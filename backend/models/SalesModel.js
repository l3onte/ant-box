import db from "../config/db.js";

const SalesModel = {
    postSale: async (id_tienda, saleInfo) => {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const { fecha_venta, id_cliente, productos } = saleInfo;

            if (!productos || productos.length === 0)
                throw new Error('Debe incluir al menos un producto en la venta.');

            let totalVenta = 0;

            for (const { id_producto, cantidad } of productos) {
                const [result] = await connection.query(`
                    SELECT stock, precio_unitario, nombre
                    FROM Productos
                    WHERE id_producto = ? AND id_tienda = ?;
                `, [id_producto, id_tienda]);

                if (result.length === 0) 
                    throw new Error(`El producto con ID ${id_producto} no existe o no pertenece a esta tienda.`);

                const { stock, precio_unitario, nombre } = result[0];

                if (stock < cantidad) {
                    throw new Error(`Stock insuficiente para ${nombre}. Stock disponible: ${stock}, Cantidad solicitada: ${cantidad}.`);
                }

                totalVenta += precio_unitario * cantidad;
            }

            const [ventaResult] = await connection.query(`
                INSERT INTO Ventas (fecha_venta, id_cliente, id_tienda, total)
                VALUES (?,?,?,?);
            `, [fecha_venta, id_cliente, id_tienda, totalVenta]);

            const id_venta = ventaResult.insertId;

            for (const { id_producto, cantidad } of productos) {
                await connection.query(`
                    INSERT INTO Detalle_Ventas (id_venta, id_producto, cantidad)
                    VALUES (?,?,?);
                `, [id_venta, id_producto, cantidad]);

                await connection.query(`
                    UPDATE Productos
                    SET stock = stock - ?
                    WHERE id_producto = ?;                    
                `, [cantidad, id_producto]);
            }

            await connection.commit();
            return { message: 'Venta agregada con éxito.', ventaId: id_venta };
        } catch (error) {
            console.error('Error en postSale: ', error.message);
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }, 

    getSale: async (id_tienda, page, limit, search = '', startDate = null, endDate = null, sort = 'ASC') => {
        const offset = (page - 1) * limit;
        const searchFilter = `%${search}%`;
        const order = sort.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        try {
        const [rows] = await db.query(`
            SELECT 
                v.id_venta,
                DATE_FORMAT(v.fecha_venta, '%d/%m/%Y') AS Fecha,
                c.nombre AS Cliente,
                COUNT(p.nombre) AS Cantidad_de_Productos,
                SUM(p.precio_unitario * dv.cantidad) AS Total_Venta
            FROM Ventas v
            INNER JOIN Detalle_Ventas dv ON dv.id_venta = v.id_venta
            INNER JOIN Clientes c ON c.id_cliente = v.id_cliente
            INNER JOIN Productos p ON p.id_producto = dv.id_producto
            WHERE v.id_tienda = ?
                AND (
                    c.nombre LIKE ? 
                    OR v.id_venta LIKE ?
                )
                AND (
                    (? IS NULL OR v.fecha_venta >= ?)
                    AND
                    (? IS NULL OR v.fecha_venta <= ?)
                )
            GROUP BY v.id_venta, c.nombre, v.fecha_venta
            ORDER BY c.nombre ${order}
            LIMIT ? OFFSET ?;
        `, [
                id_tienda,  
                searchFilter, 
                searchFilter,
                startDate, startDate,
                endDate, endDate, 
                limit, 
                offset
            ]);


            const [[{ total }]] = await db.query(`
                SELECT COUNT(DISTINCT v.id_venta) AS total
                FROM Ventas v
                INNER JOIN Clientes c ON c.id_cliente = v.id_cliente
                WHERE v.id_tienda = ?
                    AND (c.nombre LIKE ? OR v.id_venta LIKE ?)
                    AND (
                        (? IS NULL OR v.fecha_venta >= ?)
                        AND
                        (? IS NULL OR v.fecha_venta <= ?)
                    );
            `, [
                id_tienda, 
                searchFilter, 
                searchFilter,
                startDate, startDate, 
                endDate, endDate
            ]);

            return { rows, totalCount: total };
        } catch (error) {
            console.error('Error en getSale: ', error.message);
            throw error;
        }
    },

    getSaleDetails: async (id_venta) => {
        try {
            const [details] = await db.query(`
                SELECT 
                    dv.id_detalle AS id,
                    v.id_venta AS id_venta,
                    p.nombre AS P_Nombre,
                    p.descripcion AS Descripcion,
                    p.precio_unitario AS Precio_Unitario,
                    dv.cantidad AS Cantidad,
                    (p.precio_unitario * dv.cantidad) AS Total_Individual
                FROM Detalle_Ventas dv
                INNER JOIN Ventas v ON v.id_venta = dv.id_venta
                INNER JOIN Productos p ON p.id_producto = dv.id_producto
                WHERE dv.id_venta = ?;
            `, [id_venta]);

            const [[{ totalCount }]] = await db.query(`
                SELECT COUNT(*) AS total
                FROM Detalle_Ventas
                WHERE id_venta = ?;
            `, [id_venta]);

            return { details, totalCount }; 
        } catch (error) {
            console.error('Error en getSaleDetails: ', error.message);
            throw error;
        }
    },

    updateSale: async (id_venta, saleInfo) => {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const { fecha_venta, id_cliente, productos } = saleInfo;

            // Obtener la venta anterior para revertir stock
            const [oldDetails] = await connection.query(`
                SELECT id_producto, cantidad 
                FROM Detalle_Ventas 
                WHERE id_venta = ?
            `, [id_venta]);

            // Revertir stock de la venta anterior
            for (const { id_producto, cantidad } of oldDetails) {
                await connection.query(`
                    UPDATE Productos 
                    SET stock = stock + ?
                    WHERE id_producto = ?
                `, [cantidad, id_producto]);
            }

            let totalVenta = 0;

            // Validar stock para los nuevos productos
            for (const { id_producto, cantidad } of productos) {
                const [result] = await connection.query(`
                    SELECT stock, precio_unitario, nombre
                    FROM Productos
                    WHERE id_producto = ?;
                `, [id_producto]);

                if (result.length === 0) 
                    throw new Error(`El producto con ID ${id_producto} no existe.`);

                const { stock, precio_unitario, nombre } = result[0];
                
                if (stock < cantidad) {
                    throw new Error(`Stock insuficiente para ${nombre}. Stock disponible: ${stock}, Cantidad solicitada: ${cantidad}`);
                }

                totalVenta += precio_unitario * cantidad;
            }

            // Actualizar la venta
            await connection.query(`
                UPDATE Ventas
                SET fecha_venta = ?, id_cliente = ?, total = ?
                WHERE id_venta = ?;
            `, [fecha_venta, id_cliente, totalVenta, id_venta]);

            // Eliminar detalles antiguos
            await connection.query(`
                DELETE FROM Detalle_Ventas WHERE id_venta = ?;
            `, [id_venta]);

            // Insertar nuevos detalles y actualizar stock
            for (const { id_producto, cantidad } of productos) {
                await connection.query(`
                    INSERT INTO Detalle_Ventas (id_venta, id_producto, cantidad)
                    VALUES (?,?,?);
                `, [id_venta, id_producto, cantidad]);

                // Actualizar stock con los nuevos valores
                await connection.query(`
                    UPDATE Productos 
                    SET stock = stock - ?
                    WHERE id_producto = ?;
                `, [cantidad, id_producto]);
            }

            await connection.commit();
            return { message: 'Venta actualizada correctamente.' };
        } catch (error) {
            console.error('Erro en updateSale: ', error.message);
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    deleteSale: async (id_venta) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Primero: Obtener los detalles para revertir el stock
            const [detalles] = await connection.query(`
                SELECT id_producto, cantidad 
                FROM Detalle_Ventas 
                WHERE id_venta = ?
            `, [id_venta]);

            // Revertir el stock
            for (const { id_producto, cantidad } of detalles) {
                await connection.query(`
                    UPDATE Productos 
                    SET stock = stock + ?
                    WHERE id_producto = ?
                `, [cantidad, id_producto]);
            }

            // Luego eliminar la venta
            const [result] = await connection.query(`
                DELETE FROM Ventas WHERE id_venta = ?;
            `, [id_venta]);

            if (result.affectedRows === 0) 
                throw new Error('No se encontró la venta a eliminar.');

            await connection.commit();
            return { message: 'Venta eliminada con éxito.' }; 
        } catch (error) {
            await connection.rollback();
            console.error('Error en deleteSale: ', error.message);
            throw error;
        } finally {
            connection.release();
        }
    },

    deleteDetail: async (id_detail) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Primero obtener el detalle para revertir stock
            const [detail] = await connection.query(`
                SELECT id_producto, cantidad 
                FROM Detalle_Ventas 
                WHERE id_detalle = ?
            `, [id_detail]);

            if (detail.length === 0)
                throw new Error('No se encontró el detalle a eliminar.');

            // Revertir stock
            await connection.query(`
                UPDATE Productos 
                SET stock = stock + ?
                WHERE id_producto = ?
            `, [detail[0].cantidad, detail[0].id_producto]);

            // Luego eliminar el detalle
            const [result] = await connection.query(`
                DELETE FROM Detalle_Ventas WHERE id_detalle = ?;
            `, [id_detail]);

            await connection.commit();
            return { message: 'Detalle eliminado.' }
        } catch (error) {
            await connection.rollback();
            console.error('Error en deleteDetail: ', error.message);
            throw error;
        } finally {
            connection.release();
        }
    },

    getProducts: async (id_tienda) => {
        try {
            const [rows] = await db.query(`
                SELECT 
                    id_producto,
                    nombre,
                    descripcion,
                    precio_compra,
                    porcentaje_ganancia,
                    precio_venta,
                    stock,
                    stock_minimo,
                    precio_unitario
                FROM Productos
                WHERE id_tienda = ? AND stock > 0;
            `, [id_tienda]);

            return rows;
        } catch (error) {
            console.error('Error en getProducts: ', error.message);
            throw error;
        }
    }
};

export default SalesModel;