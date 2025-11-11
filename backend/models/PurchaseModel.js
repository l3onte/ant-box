import db from "../config/db.js";

const PurchaseModel = {
    getPurchases: async (id_tienda, page, limit, search = '', startDate = null, endDate = null, sort = 'ASC') => {
        const offset = (page - 1) * limit;
        const searchFilter = `%${search}%`;
        const order = sort.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        try {
            // Primero obtenemos las compras principales
            const [rows] = await db.query(`
                SELECT 
                    c.id_compra,
                    c.id_proveedor,
                    pv.nombre AS proveedor,
                    DATE_FORMAT(c.fecha_compra, '%d/%m/%Y') AS fecha_compra,
                    c.total
                FROM Compras c
                INNER JOIN Proveedores pv ON c.id_proveedor = pv.id_proveedor
                WHERE c.id_tienda = ? 
                    AND pv.nombre LIKE ?
                    AND (
                        (? IS NULL OR c.fecha_compra >= ?)
                        AND
                        (? IS NULL OR c.fecha_compra <= ?)
                    )
                ORDER BY pv.nombre ${order}
                LIMIT ? OFFSET ?;
            `, [id_tienda, searchFilter, startDate, startDate, endDate, endDate, limit, offset]);

            // Obtener detalles de cada compra
            const comprasConDetalles = await Promise.all(
                rows.map(async (compra) => {
                    try {
                        const [detalles] = await db.query(`
                            SELECT 
                                dc.id_producto,
                                p.nombre AS producto,
                                dc.cantidad,
                                dc.precio_compra,
                                (dc.cantidad * dc.precio_compra) AS subtotal
                            FROM Detalle_Compras dc
                            INNER JOIN Productos p ON dc.id_producto = p.id_producto
                            WHERE dc.id_compra = ?
                        `, [compra.id_compra]);
                        
                        return {
                            ...compra,
                            detalles: detalles || []
                        };
                    } catch (error) {
                        console.error(`Error obteniendo detalles para compra ${compra.id_compra}:`, error);
                        return {
                            ...compra,
                            detalles: []
                        };
                    }
                })
            );

            const [[{ total }]] = await db.query(`
                SELECT COUNT(*) AS total
                FROM Compras c
                INNER JOIN Proveedores pv ON c.id_proveedor = pv.id_proveedor
                WHERE c.id_tienda = ?
                AND pv.nombre LIKE ?
                AND ((? IS NULL OR c.fecha_compra >= ?)
                    AND (? IS NULL OR c.fecha_compra <= ?))
            `, [id_tienda, searchFilter, startDate, startDate, endDate, endDate]);

            return { rows: comprasConDetalles, total };
        } catch (error) {
            console.error('Error en getPurchases: ', error.message);
            throw error;
        }
    },

    // ... los demás métodos (postPurchase, updatePurchase, deletePurchase) se mantienen igual
    postPurchase: async (id_tienda, data) => {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const {
                id_proveedor,
                productos // Array de productos
            } = data;

            if (!productos || productos.length === 0) {
                throw new Error('Debe incluir al menos un producto en la compra.');
            }

            let totalCompra = 0;
            const productosProcesados = [];

            // Procesar cada producto
            for (const producto of productos) {
                const { id_producto, cantidad, precio_compra, nuevo_producto } = producto;

                let productoId = id_producto;
                let esProductoNuevo = false;

                // Crear nuevo producto si es necesario
                if (!id_producto && nuevo_producto) {
                    const [resultProducto] = await conn.query(`
                        INSERT INTO Productos (
                            nombre, descripcion, precio_compra, porcentaje_ganancia, 
                            stock, stock_minimo, id_proveedor, id_tienda
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `, [
                        nuevo_producto.nombre,
                        nuevo_producto.descripcion,
                        precio_compra, // Usar el precio_compra de la compra
                        nuevo_producto.porcentaje_ganancia || 0,
                        cantidad,
                        nuevo_producto.stock_minimo || 0,
                        id_proveedor,
                        id_tienda
                    ]);
                    productoId = resultProducto.insertId;
                    esProductoNuevo = true;
                } else if (!id_producto) {
                    throw new Error('Cada producto debe tener un ID o ser un producto nuevo.');
                }

                totalCompra += cantidad * precio_compra;
                productosProcesados.push({ productoId, cantidad, precio_compra, esProductoNuevo });
            }

            // Insertar la compra
            const [resultCompra] = await conn.query(`
                INSERT INTO Compras (id_proveedor, fecha_compra, total, id_tienda)
                VALUES (?, CURDATE(), ?, ?)
            `, [id_proveedor, totalCompra, id_tienda]);

            const id_compra = resultCompra.insertId;

            // Insertar detalles y actualizar stock
            for (const item of productosProcesados) {
                await conn.query(`
                    INSERT INTO Detalle_Compras (id_compra, id_producto, cantidad, precio_compra)
                    VALUES (?, ?, ?, ?)
                `, [id_compra, item.productoId, item.cantidad, item.precio_compra]);

                if (!item.esProductoNuevo) {
                    await conn.query(`
                        UPDATE Productos
                        SET stock = stock + ?,
                            precio_compra = ?
                        WHERE id_producto = ?;
                    `, [item.cantidad, item.precio_compra, item.productoId]);
                }
                // Si es nuevo producto, el stock ya se insertó con la cantidad
            }

            await conn.commit();
            return { message: 'Compra registrada correctamente', id_compra };
        } catch (error) {
            await conn.rollback();
            console.error('Error en postPurchase:', error.message);
            throw error;
        } finally {
            conn.release();
        }
    },

    updatePurchase: async (id_compra, data) => {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const { id_proveedor, productos } = data;

            if (!productos || productos.length === 0) {
                throw new Error('Debe incluir al menos un producto en la compra.');
            }

            // Obtener detalles actuales para revertir stock
            const [detallesActuales] = await conn.query(`
                SELECT id_producto, cantidad 
                FROM Detalle_Compras 
                WHERE id_compra = ?
            `, [id_compra]);

            // Revertir stock de productos anteriores
            for (const detalle of detallesActuales) {
                await conn.query(`
                    UPDATE Productos 
                    SET stock = stock - ?
                    WHERE id_producto = ?
                `, [detalle.cantidad, detalle.id_producto]);
            }

            // Eliminar detalles actuales
            await conn.query(`
                DELETE FROM Detalle_Compras WHERE id_compra = ?
            `, [id_compra]);

            let totalCompra = 0;

            // Insertar nuevos detalles y actualizar stock
            for (const producto of productos) {
                const { id_producto, cantidad, precio_compra } = producto;

                await conn.query(`
                    INSERT INTO Detalle_Compras (id_compra, id_producto, cantidad, precio_compra)
                    VALUES (?, ?, ?, ?)
                `, [id_compra, id_producto, cantidad, precio_compra]);

                await conn.query(`
                    UPDATE Productos 
                    SET stock = stock + ?, 
                        precio_compra = ?
                    WHERE id_producto = ?
                `, [cantidad, precio_compra, id_producto]);

                totalCompra += cantidad * precio_compra;
            }

            // Actualizar la compra
            await conn.query(`
                UPDATE Compras
                SET id_proveedor = ?, total = ?
                WHERE id_compra = ?
            `, [id_proveedor, totalCompra, id_compra]);

            await conn.commit();
            return { message: 'Compra actualizada correctamente', id_compra };
        } catch (error) {
            await conn.rollback();
            console.error('Error en updatePurchase:', error.message);
            throw error;
        } finally {
            conn.release();
        }
    },

    deletePurchase: async (id_compra) => {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const [detalle] = await conn.query(`
                SELECT id_producto, cantidad FROM Detalle_Compras WHERE id_compra = ?
            `, [id_compra]);

            for (const item of detalle) {
                await conn.query(`
                    UPDATE Productos 
                    SET stock = stock - ?
                    WHERE id_producto = ?
                `, [item.cantidad, item.id_producto]);
            }

            await conn.query(`DELETE FROM Detalle_Compras WHERE id_compra = ?`, [id_compra]);
            await conn.query(`DELETE FROM Compras WHERE id_compra = ?`, [id_compra]);

            await conn.commit();
            return { message: 'Compra eliminada correctamente' };
        } catch (error) {
            await conn.rollback();
            console.error('Error en deletePurchase:', error.message);
            throw error;
        } finally {
            conn.release();
        }
    }
}

export default PurchaseModel;