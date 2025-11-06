import db from '../config/db.js';

const CustomerModel = {
    getCustomers: async (id_tienda, page, limit, search = '') => {
        const offset = (page - 1) * limit;
        const searchFilter = `%${search}%`

        try {
            const [rows] = await db.query(`
                SELECT 
                    id_cliente,
                    nombre,
                    direccion,
                    telefono,
                    email
                FROM Clientes
                WHERE id_tienda = ?
                    AND (
                        id_cliente LIKE ?
                        OR nombre LIKE ?
                        OR direccion LIKE ?
                        OR telefono LIKE ?
                        OR email LIKE ?
                    )
                LIMIT ? OFFSET ?;
            `, [id_tienda, searchFilter, searchFilter, searchFilter, searchFilter, searchFilter, limit, offset]);

            const [countResult] = await db.query(`
                SELECT COUNT(*) AS Total FROM Clientes WHERE id_tienda = ?;
            `, [id_tienda]);

            const total = countResult[0]?.total || 0;

            return { rows, total };
        } catch (error) {
            console.error('Error en getCustomers: ', error.message);
        }
    },

    postCustomer: async (id_tienda, data) => {
        try {
            const { nombre, direccion, telefono, email } = data;
            const [result] = await db.query(`
                INSERT INTO Clientes (nombre, direccion, telefono, email, id_tienda)
                VALUES (?,?,?,?,?);
            `, [nombre, direccion, telefono, email, id_tienda]);

            return { message: "Cliente agregado correctamente.", id_cliente: result.insertId };
        } catch (error) {
            console.error('Error en postCustomer: ', error.message);
        }
    },

    updateCustomer: async (id_cliente, data) => {
        try {
            const { nombre, direccion, telefono, email } = data;
            const [rows] = await db.query(`
                UPDATE Clientes
                SET nombre = ?, direccion = ?, telefono = ?, email = ?
                WHERE id_cliente = ?;
            `, [nombre, direccion, telefono, email, id_cliente]);

            if (rows.affectedRows === 0)
                throw new Error('No se encontró el cliente a actualizar.');

            return { message: 'Cliente actualizado con éxito.' };
        } catch (error) {
            console.error('Error en updateCustomer: ', error.message);
        }
    }
}

export default CustomerModel;