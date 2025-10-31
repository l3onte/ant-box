import db from "../config/db.js";

const SalesModel = {
    postSale: async (id_tienda, saleInfo) => {
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

            const [resultVenta] = await connection.query(`
                INSERT INTO Ventas (fecha_venta, id_cliente, id_tienda, total)
                VALUES (?, ?, ?, ?); 
            `, [fecha_venta, id_cliente, id_tienda, total]);

            const id_venta = resultVenta.insertId;

            await connection.query(`
                INSERT INTO Detalle_Ventas (id_venta, id_producto, cantidad, precio_unitario)
                VALUES (?, ?, ?, ?);
            `, [id_venta, id_producto, cantidad, precio_unitario]);

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
                    p.nombre AS Producto,
                    p.descripcion AS Descripcion,
                    dv.cantidad AS Cantidad,
                    dv.precio_unitario AS Precio_Unitario,
                    v.total AS Total
                FROM Ventas v
                INNER JOIN Tiendas t ON t.id_tienda = v.id_tienda
                INNER JOIN Detalle_Ventas dv ON dv.id_venta = v.id_venta
                INNER JOIN Clientes c ON c.id_cliente = v.id_cliente
                INNER JOIN Productos p ON p.id_producto = dv.id_producto
                WHERE t.id_tienda = ?
                ORDER BY Fecha DESC
                LIMIT ? OFFSET ?;
            `, [id_tienda, limit, offset]);

            const [[{ total }]] = await db.query(`
                SELECT COUNT(*) AS total 
                FROM Ventas
                WHERE id_tienda = ?;
            `, [id_tienda]);

            return { rows, total };
        } catch (error) {
            console.error('Error en getSale: ', error.message);
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
    }
};

export default SalesModel;