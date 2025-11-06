import db from "../config/db.js";

const ProductsModel = {
    getProducts: async (id_tienda, page = 1, limit = 5, search = '') => {
        const offset = (page - 1) * limit;
        const searchFilter = `%${search}%`;
        
        try {
            const [rows] = await db.query(`
                SELECT 
                    p.id_producto,
                    p.nombre,
                    p.descripcion,
                    p.precio_compra,
                    p.porcentaje_ganancia,
                    p.precio_venta,
                    p.stock,
                    p.stock_minimo,
                    p.precio_unitario,
                    pv.nombre AS proveedor
                FROM Productos p
                INNER JOIN Proveedores pv ON pv.id_proveedor = p.id_proveedor
                WHERE p.id_tienda = ?
                    AND (
                        p.id_producto LIKE ?
                        OR p.nombre LIKE ?
                        OR p.descripcion LIKE ?
                        OR p.precio_compra LIKE ?
                        OR p.porcentaje_ganancia LIKE ?
                        OR p.precio_venta LIKE ?
                        OR p.stock LIKE ?
                        OR p.stock_minimo LIKE ?
                        OR p.precio_unitario LIKE ?
                        OR pv.nombre LIKE ?
                    )
                LIMIT ? OFFSET ?;
            `, [id_tienda, 
                searchFilter, 
                searchFilter, 
                searchFilter, 
                searchFilter, 
                searchFilter, 
                searchFilter, 
                searchFilter, 
                searchFilter, 
                searchFilter, 
                searchFilter, 
                limit, offset]
            );

            const [[{ total }]] = await db.query(`
                SELECT COUNT(*) AS total FROM Productos WHERE id_tienda = ?; 
            `, [id_tienda]);
 
            return { rows, total }
        } catch (error) {
            console.error('Error en getProducts: ', error.message);
            throw error;
        }
    },

    postProduct: async (id_tienda, data) => {
        try {
            const { nombre, descripcion, precio_compra, porcentaje_ganancia, stock, stock_minimo, id_proveedor } = data;

            const [result] = await db.query(`
                INSERT INTO Productos ( 
                    nombre, 
                    descripcion, 
                    precio_compra, 
                    porcentaje_ganancia, 
                    stock, 
                    stock_minimo,  
                    id_proveedor, 
                    id_tienda 
                )
                VALUES (?,?,?,?,?,?,?,?);
            `, [
                nombre, 
                descripcion, 
                precio_compra, 
                porcentaje_ganancia, 
                stock, 
                stock_minimo, 
                id_proveedor || null, 
                id_tienda
            ]);

            return result.insertId;
        } catch (error) {
            console.error('Error en postProduct: ', error.message);
            throw error;
        }
    },

    updateProduct: async (id_producto, data) => {
        try {
            const { nombre, descripcion, precio_compra, porcentaje_ganancia, stock, stock_minimo, id_proveedor } = data;

            const [result] = await db.query(`
                UPDATE Productos
                SET nombre = ?, descripcion = ?, precio_compra = ?, porcentaje_ganancia = ?, stock = ?, stock_minimo = ?, id_proveedor = ?
                WHERE id_producto = ?;
            `, [nombre, descripcion, precio_compra, porcentaje_ganancia, stock, stock_minimo, id_proveedor, id_producto]);

            if (result.affectedRows === 0) 
                return new Error('No se encontró el producto a actualizar.');

            return { message: 'Se actualizó el producto con éxito.' };
        } catch (error) {
            console.error('Error en updateProduct: ', error.message);
            throw error;
        }
    },

    deleteProduct: async (id_producto) => {
        try {
            const [result] = await db.query(`
                DELETE FROM Productos WHERE id_producto = ?;
            `, [id_producto]);

            if (result.affectedRows === 0)
                throw new Error('No se encontro el producto a eliminar.');

            return { message: 'Producto eliminado con éxito.' };
        } catch (error) {
            console.error('Error en deleteProduct: ', error.message);
            throw error;
        }
    }
}

export default ProductsModel;