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
    },

    // ✅ POST - Registrar compra
    postPurchase: async (id_tienda, data) => {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const {
                id_proveedor,
                id_producto,
                cantidad,
                precio_compra,
                nuevo_producto // opcional: datos del nuevo producto
            } = data;

            let productoId = id_producto;

            // 1️⃣ Si se agrega un nuevo producto
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
                    nuevo_producto.precio_compra,
                    nuevo_producto.porcentaje_ganancia,
                    nuevo_producto.stock,
                    nuevo_producto.stock_minimo,
                    id_proveedor,
                    id_tienda
                ]);
                productoId = resultProducto.insertId;
            }

            // 2️⃣ Calcular total de la compra
            const totalCompra = cantidad * precio_compra;

            // 3️⃣ Insertar la compra
            const [resultCompra] = await conn.query(`
                INSERT INTO Compras (id_proveedor, fecha_compra, total, id_tienda)
                VALUES (?, CURDATE(), ?, ?)
            `, [id_proveedor, totalCompra, id_tienda]);

            const id_compra = resultCompra.insertId;

            // 4️⃣ Insertar detalle de la compra
            await conn.query(`
                INSERT INTO Detalle_Compras (id_compra, id_producto, cantidad, precio_compra)
                VALUES (?, ?, ?, ?)
            `, [id_compra, productoId, cantidad, precio_compra]);

            // 5️⃣ Actualizar el stock del producto
            await conn.query(`
                UPDATE Productos 
                SET stock = stock + ?,
                    precio_compra = ? 
                WHERE id_producto = ?
            `, [cantidad, precio_compra, productoId]);

            await conn.commit();
            return { message: 'Compra registrada correctamente' };
        } catch (error) {
            await conn.rollback();
            console.error('Error en postPurchase:', error.message);
            throw error;
        } finally {
            conn.release();
        }
    },

    // ✅ PUT - Actualizar compra existente (permite cambiar proveedor y producto)
    updatePurchase: async (id_compra, data) => {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const { cantidad, precio_compra, id_producto, id_proveedor } = data;

            // Obtener el detalle actual
            const [[detalleActual]] = await conn.query(`
                SELECT id_producto, cantidad 
                FROM Detalle_Compras 
                WHERE id_compra = ?
            `, [id_compra]);

            if (!detalleActual) {
                throw new Error("No se encontró el detalle de la compra.");
            }

            const productoAnterior = detalleActual.id_producto;
            const cantidadAnterior = detalleActual.cantidad;

            // 🔹 1. Ajustar stock del producto anterior (restar lo que se había sumado)
            await conn.query(`
                UPDATE Productos 
                SET stock = stock - ?
                WHERE id_producto = ?
            `, [cantidadAnterior, productoAnterior]);

            // 🔹 2. Si cambió el producto, sumar al nuevo producto
            if (productoAnterior !== id_producto) {
                await conn.query(`
                    UPDATE Productos 
                    SET stock = stock + ?, 
                        precio_compra = ?
                    WHERE id_producto = ?
                `, [cantidad, precio_compra, id_producto]);
            } else {
                // Si es el mismo producto, solo ajustar la diferencia
                const diferencia = cantidad - cantidadAnterior;
                await conn.query(`
                    UPDATE Productos 
                    SET stock = stock + ?, 
                        precio_compra = ?
                    WHERE id_producto = ?
                `, [diferencia, precio_compra, id_producto]);
            }

            // 🔹 3. Actualizar el detalle de compra
            await conn.query(`
                UPDATE Detalle_Compras
                SET id_producto = ?, cantidad = ?, precio_compra = ?
                WHERE id_compra = ?
            `, [id_producto, cantidad, precio_compra, id_compra]);

            // 🔹 4. Actualizar proveedor y total en la tabla Compras
            const nuevoTotal = cantidad * precio_compra;
            await conn.query(`
                UPDATE Compras
                SET id_proveedor = ?, total = ?
                WHERE id_compra = ?
            `, [id_proveedor, nuevoTotal, id_compra]);

            await conn.commit();
            return { message: 'Compra actualizada correctamente' };
        } catch (error) {
            await conn.rollback();
            console.error('Error en updatePurchase:', error.message);
            throw error;
        } finally {
            conn.release();
        }
    },


    // ✅ DELETE - Eliminar compra
    deletePurchase: async (id_compra) => {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            // Obtener detalle antes de eliminar
            const [detalle] = await conn.query(`
                SELECT id_producto, cantidad FROM Detalle_Compras WHERE id_compra = ?
            `, [id_compra]);

            // Restar stock de productos
            for (const item of detalle) {
                await conn.query(`
                    UPDATE Productos 
                    SET stock = stock - ?
                    WHERE id_producto = ?
                `, [item.cantidad, item.id_producto]);
            }

            // Eliminar compra (cascade borra detalle)
            await conn.query(`
                DELETE FROM Compras WHERE id_compra = ?
            `, [id_compra]);

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