import db from '../config/db.js'

const Suppliers = {
    postSuppliers: async (id_tienda, supplierData) => {
        try {
            const { nombre, direccion, telefono, email } = supplierData; 

            const [rows] = await db.query(`
                INSERT INTO Proveedores (nombre, direccion, telefono, email, id_tienda)
                VALUES (?, ?, ?, ?, ?);
            `, [nombre, direccion, telefono, email, id_tienda]);

            const supplierId = rows.insertId;
            
            return { message: 'Proveedor agregado con éxito.', id_supplier: supplierId }
        } catch (error) {
            console.error('Error en postSuppliers: ', error);
            throw new Error(error.message);
        }
    },

    getSuppliers: async (id_tienda, page = 1, limit = 5) => {
        const offset = (page - 1) * limit;

        try {
            const [result] = await db.query(`
                SELECT 
                    id_proveedor,
                    nombre,
                    direccion,
                    telefono,
                    email
                FROM Proveedores
                WHERE id_tienda = ?
                LIMIT ? OFFSET ?;
            `, [id_tienda, limit, offset]);

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

    updateSupplier: async (id_supplier, updateData) => {
        try {
            const { nombre, direccion, telefono, email } = updateData;

            const [existing] = await db.query(`
                SELECT id_proveedor
                FROM Proveedores
                WHERE (nombre = ? OR email = ?) AND id_proveedor != ?;
            `, [nombre, email, id_supplier]);

            if (existing.length > 0) 
                throw new Error('El email o nombre ya están en uso por otro proveedor.');

            const [rows] = await db.query(`
                UPDATE Proveedores
                SET nombre = ?, direccion = ?, telefono = ?, email = ?
                WHERE id_proveedor = ?;
            `, [nombre, direccion, telefono, email, id_supplier]);

            if (rows.affectedRows === 0) 
                throw new Error('No se encontró el proveedor a actualizar.');

            return { message: 'Proveedor actualizado con éxito.' };
        } catch (error) {
            console.error('Error updateSupplier: ', error);
            throw new Error(error.message);
        }
    },

    deleteSupplier: async (id_supplier) => {
        try {
            const [result] = await db.query(`
                DELETE FROM Proveedores WHERE id_proveedor = ?;
            `, [id_supplier]);

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