import db from "../config/db.js";

const PurchaseModel = {
    getPurchases: async (id_tienda, page, limit, search = '') => {
        const offset = (page - 1) * limit;
        const searchFilter = `%${search}%`;

        try {
            const [rows] = await db.query(`
                SELECT 
                    c.id_compra,
                    c.id_proveedor,
                    pv.nombre AS proveedor,
                    DATE_FORMAT(c.fecha_compra, '%d/%m/%Y') AS fecha_compra,
                    c.total,
                    dc.id_producto,
                    p.nombre AS producto,
                    dc.cantidad,
                    dc.precio_compra
                FROM Compras c
                INNER JOIN Detalle_Compras dc ON c.id_compra = dc.id_compra
                INNER JOIN Proveedores pv ON c.id_proveedor = pv.id_proveedor
                INNER JOIN Productos p ON dc.id_producto = p.id_producto
                WHERE c.id_tienda = ? 
                    AND 
                      (pv.nombre LIKE ? OR p.nombre LIKE ?)
                ORDER BY c.fecha_compra DESC
                LIMIT ? OFFSET ?;
            `, [id_tienda, searchFilter, searchFilter, limit, offset]);

            const [[{ total }]] = await db.query(`
               SELECT COUNT(DISTINCT id_compra) AS total
               FROM Compras 
               WHERE id_tienda = ?
            `, [id_tienda]); 

            return { rows, total };
        } catch (error) {
            console.error('Error en getPurchases: ', error.message);
            throw error;
        }
    }
}

export default PurchaseModel;