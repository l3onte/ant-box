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
                    SELECT precio_unitario
                    FROM Productos
                    WHERE id_producto = ? AND id_tienda = ?;
                `, [id_producto, id_tienda]);

                if (result.length === 0) 
                    throw new Error(`El producto con ID ${id_producto} no existe o no pertenece a esta tienda.`);

                const { precio_unitario } = result[0];
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

    getSale: async (id_tienda, page, limit) => {
        const offset = (page - 1) * limit;

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
            GROUP BY v.id_venta, c.nombre, v.fecha_venta
            ORDER BY v.fecha_venta DESC
            LIMIT ? OFFSET ?;
        `, [id_tienda, limit, offset]);

            const [[{ totalCount }]] = await db.query(`
                SELECT COUNT(*) AS total 
                FROM Ventas
                WHERE id_tienda = ?;
            `, [id_tienda]);

            return { rows, totalCount };
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

            const {
                fecha_venta,
                id_cliente,
                id_producto,
                cantidad,
                precio_unitario
            } = saleInfo;

            const total = precio_unitario * cantidad;

            await connection.query(`
                UPDATE Ventas
                SET fecha_venta = ?, id_cliente = ?, total = ?
                WHERE id_venta = ?;
            `, [fecha_venta, id_cliente, total, id_venta]);

            await connection.query(`
                UPDATE Detalle_Ventas
                SET id_producto = ?, cantidad = ?, precio_unitario = ?
                WHERE id_venta = ?;
            `, [id_producto, cantidad, precio_unitario, id_venta]);

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
        try {
            const [result] = await db.query(`
                DELETE FROM Ventas WHERE id_venta = ?;
            `, [id_venta]);

            if (result.affectedRows === 0) 
                throw new Error('No se econtró la venta a eliminar.');

            return { message: 'Venta eliminada con éxito.' }; 
        } catch (error) {
            console.error('Error en deleteSale: ', error.message);
            throw error;
        }
    },

    deleteDatail: async (id_detail) => {
        try {
            const [result] = await db.query(`
                DELETE FROM Detalle_Ventas WHERE id_detalle = ?;
            `, [id_detail]);

            if (result.affectedRows === 0)
                throw new Error('No se encontro el detalle a elimiar.');
            
            return { message: 'Detalle eliminado.' }
        } catch (error) {
            console.error('Error en deleteDatail: ', error.message);
            throw error;
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