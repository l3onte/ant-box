import db from "../config/db.js";

const ProfitsModel = {
    getProfits: async (id_tienda, page = 1, limit = 10, startDate, endDate) => {
        const offset = (page - 1) * limit;

        try {
            const [rows] = await db.query(`
                SELECT 
                    DATE_FORMAT(v.fecha_venta, '%d/%m/%Y') AS fecha,
                    SUM(dv.cantidad * p.precio_venta) AS total_ventas,
                    SUM(dv.cantidad * p.precio_compra) AS total_costos,
                    SUM((p.precio_venta - p.precio_compra) * dv.cantidad) AS ganancia_total
                FROM Ventas v
                INNER JOIN Detalle_Ventas dv ON v.id_venta = dv.id_venta
                INNER JOIN Productos p ON dv.id_producto = p.id_producto
                WHERE v.id_tienda = ?
                    AND (
                        (? IS NULL OR v.fecha_venta >= ?)
                        AND
                        (? IS NULL OR v.fecha_venta <= ?)
                    )
                GROUP BY v.fecha_venta
                ORDER BY v.fecha_venta DESC
                LIMIT ? OFFSET ?;
            `, [id_tienda, startDate, startDate, endDate, endDate, limit, offset]);

            const [[{ total} ]] = await db.query(`
                SELECT COUNT(DISTINCT v.fecha_venta) AS total
                FROM Ventas v
                INNER JOIN Detalle_Ventas dv ON v.id_venta = dv.id_venta
                INNER JOIN Productos p ON dv.id_producto = p.id_producto
                WHERE v.id_tienda = ?
                    AND ((? IS NULL OR v.fecha_venta >= ?)
                    AND  (? IS NULL OR v.fecha_venta <= ?));
            `, [id_tienda, startDate, startDate, endDate, endDate]);


            return { rows, total };
        } catch (error) {
            console.error('Error en getProfits: ', error.message);
            throw error;
        }
    },

    getTotal: async (id_tienda) => {
        try {
            const [[total]] = await db.query(`
                SELECT 
                    SUM(dv.cantidad * p.precio_venta) AS total_ventas,
                    SUM(dv.cantidad * p.precio_compra) AS total_costos,
                    SUM((p.precio_venta - p.precio_compra) * dv.cantidad) AS ganancia_total
                FROM Ventas v
                INNER JOIN Detalle_Ventas dv ON v.id_venta = dv.id_venta
                INNER JOIN Productos p ON dv.id_producto = p.id_producto
                WHERE v.id_tienda = ?;
            `, [id_tienda]);

            return total;
        } catch (error) {
            console.error('Error en getTotal: ', error.message);
            throw error;
        }
    }
}

export default ProfitsModel;