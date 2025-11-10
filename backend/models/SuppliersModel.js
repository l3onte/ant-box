import db from '../config/db.js'

const Suppliers = {
    postSuppliers: async (id_tienda, supplierData) => {
        try {
            const { nombre, direccion, telefono, email, status } = supplierData; 
            const supplierStatus = status || 'Activo';

            const [rows] = await db.query(`
                INSERT INTO Proveedores (nombre, direccion, telefono, email, status, id_tienda)
                VALUES (?, ?, ?, ?, ?, ?);
            `, [nombre, direccion, telefono, email, supplierStatus, id_tienda]);

            const supplierId = rows.insertId;
            
            return { message: 'Proveedor agregado con éxito.', id_supplier: supplierId }
        } catch (error) {
            console.error('Error en postSuppliers: ', error);
            throw new Error(error.message);
        }
    },

    getSuppliers: async (id_tienda, page = 1, limit = 5, search = '', sort = 'ASC') => {
        const offset = (page - 1) * limit;
        const searchFilter = `%${search}%`;
        const order = sort.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'; 

        try {
            const [result] = await db.query(`
                SELECT 
                    id_proveedor,
                    nombre,
                    direccion,
                    telefono,
                    email,
                    status
                FROM Proveedores
                WHERE id_tienda = ?
                    AND (
                        id_proveedor LIKE ?
                        OR nombre LIKE ?
                        OR direccion LIKE ?
                        OR telefono LIKE ?
                        OR email LIKE ?
                        OR status LIKE ?
                    )
                ORDER BY nombre ${order}
                LIMIT ? OFFSET ?;
            `, [id_tienda, searchFilter, searchFilter, searchFilter, searchFilter, searchFilter, searchFilter,limit, offset]);

            const [countResult] = await db.query(`
                SELECT COUNT(*) AS total FROM Proveedores WHERE id_tienda = ?;
            `, [id_tienda]);

            const total = countResult[0]?.total || 0;

            return { result, total };
        } catch (error) {
            console.error('Error en getSuppliers: ', error);
            throw new Error(error.message);
        }
    },

    updateSupplier: async (id_proveedor, updateData) => {
        try {
            const { nombre, direccion, telefono, email, status } = updateData;

            const [existing] = await db.query(`
                SELECT id_proveedor
                FROM Proveedores
                WHERE (nombre = ? OR email = ?) AND id_proveedor != ?;
            `, [nombre, email, id_proveedor]);

            if (existing.length > 0) 
                throw new Error('El email o nombre ya están en uso por otro proveedor.');

            const [rows] = await db.query(`
                UPDATE Proveedores
                SET nombre = ?, direccion = ?, telefono = ?, email = ?, status = ?
                WHERE id_proveedor = ?;
            `, [nombre, direccion, telefono, email, status, id_proveedor]);

            if (rows.affectedRows === 0) 
                throw new Error('No se encontró el proveedor a actualizar.');

            return { message: 'Proveedor actualizado con éxito.' };
        } catch (error) {
            console.error('Error updateSupplier: ', error);
            throw new Error(error.message);
        }
    },

    deleteSupplier: async (id_proveedor) => {
        try {
            const [result] = await db.query(`
                DELETE FROM Proveedores WHERE id_proveedor = ?;
            `, [id_proveedor]);

            if (result.affectedRows === 0) 
                throw new Error('No se encontro el proveedor.');
        
            return { message: 'Proveedor eliminado con éxito.' };
        } catch (error) {
            console.error('Error en deleteSupplier: ', error);
            throw new Error(error.message);
        }
    }
};

export default Suppliers;