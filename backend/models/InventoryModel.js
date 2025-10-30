import db from "../config/db.js";

const InventoryModel = {
    getInventory: async (id_tienda, page, limit) => {
        const offset = (page - 1) * limit;

        try {
            const [rows] = await db.query(`
                SELECT 
                    p.id_producto,
                    p.nombre,
                    p.descripcion,
                    p.stock AS stock_actual,
                    p.stock_minimo,
                    p.precio_compra,
                    p.precio_venta,
                    p.porcentaje_ganancia,
                    prov.nombre AS proveedor,
                    COALESCE(dc.total_comprado, 0) AS total_comprado,
                    COALESCE(dv.total_vendido, 0) AS total_vendido,
                    (p.stock + COALESCE(dc.total_comprado, 0) - COALESCE(dv.total_vendido, 0)) AS stock_real,
                    CASE 
                        WHEN (p.stock + COALESCE(dc.total_comprado, 0) - COALESCE(dv.total_vendido, 0)) < p.stock_minimo THEN 'Bajo'
                        ELSE 'OK'
                    END AS alerta_stock
                FROM Productos p
                LEFT JOIN Proveedores prov ON prov.id_proveedor = p.id_proveedor
                LEFT JOIN (
                    SELECT id_producto, SUM(cantidad) AS total_comprado
                    FROM Detalle_Compras
                    GROUP BY id_producto
                ) dc ON dc.id_producto = p.id_producto
                LEFT JOIN (
                    SELECT id_producto, SUM(cantidad) AS total_vendido
                    FROM Detalle_Ventas
                    GROUP BY id_producto
                ) dv ON dv.id_producto = p.id_producto
                WHERE p.id_tienda = ?
                LIMIT ? OFFSET ?;
            `, [id_tienda, limit, offset]);

            const [countResult] = await db.query(`
                SELECT COUNT(*) AS total FROM Productos WHERE id_tienda = ?;
            `, [id_tienda]); 

            const total = countResult[0]?.total || 0;

            return { rows, total }
        } catch (error) {
            console.error('Error en getInventory: ', error.message);
            throw error;
        }
    }
};

export default InventoryModel;