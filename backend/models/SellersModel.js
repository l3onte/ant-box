import db from '../config/db.js'

const Sellers = {
    postSeller: async (userData, id, hashedPassword) => {
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();

            const { nombre, apellido, correo, username } = userData;

            const [resultUser] = await connection.query(`
                INSERT INTO Usuarios (nombre, apellido, correo, username, password, rol) 
                VALUES (?, ?, ?, ?, ?, ?);
            `, [nombre, apellido, correo, username, hashedPassword, 'vendedor']);

            const userId = resultUser.insertId;

            await connection.query(`
                INSERT INTO Vendedores (id_tienda, id_usuario) 
                VALUES (?, ?);
            `, [id, userId]);

            await connection.commit();
            return { message: 'Vendedor creado con éxito.', id_usuario: userId };
        } catch (error) {
            console.error("Error en postSeller: ", error);
            await connection.rollback();
         
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('El usuario o correo ya existe en la base de datos.');
            }

            throw new Error('Error al registrar el vendedor.');
        } finally {
            connection.release();
        }
    },

    getSellers: async (id, page = 1, limit = 5, search = '', sort = 'ASC') => {
        const offset = (page - 1) * limit;
        const searchFilter = `%${search}%`;
        const order = sort.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        try {
            const [rows] = await db.query(`
                SELECT 
                    Usuarios.id_usuario AS id,
                    CONCAT(Usuarios.nombre, ' ', Usuarios.apellido) AS Vendedor,
                    Usuarios.username AS Username,
                    Usuarios.correo AS Correo,
                    Usuarios.rol AS Rol
                FROM Vendedores
                INNER JOIN Usuarios ON Usuarios.id_usuario = Vendedores.id_usuario
                WHERE Vendedores.id_tienda = ?
                    AND (
                        Usuarios.id_usuario LIKE ?
                        OR CONCAT(Usuarios.nombre, ' ', Usuarios.apellido) LIKE ?
                        OR Usuarios.username LIKE ?
                        OR Usuarios.correo LIKE ?
                        OR Usuarios.rol LIKE ?
                    )
                ORDER BY Vendedor ${order}
                LIMIT ? OFFSET ?;
            `, [id, searchFilter, searchFilter, searchFilter, searchFilter, searchFilter, limit, offset]);

            const [countResult] = await db.query(`
                SELECT COUNT(*) AS total FROM Vendedores WHERE id_tienda = ?;
            `, [id]);

            const total = countResult[0]?.total || 0;

            return { rows, total };
        } catch (error) {
            console.error("Error en getSellers: ", error);
            throw new Error('Error al obtener los vendedores.');
        }
    },

    updateSeller: async (id, updateData) => {
        try {
            const { nombre, apellido, username, correo, rol } = updateData;

            const [existing] = await db.query(`
                SELECT id_usuario
                FROM Usuarios
                WHERE (correo = ? OR username = ?) AND id_usuario != ?;
            `, [correo, username, id]);

            if (existing.length > 0) 
                throw new Error('El correo o username ya están en uso por otro usuario.');

            const [result] = await db.query(`
                UPDATE Usuarios
                SET nombre = ?, apellido = ?, username = ?, correo = ?, rol = ?
                WHERE id_usuario = ?
            `, [nombre, apellido, username, correo, rol, id]);

            if (result.affectedRows === 0) 
                throw new Error('No se encontró el vendedor a actualizar.');

            return { message: 'Vendedor actualizado correctamente.' };
        } catch (error) {
            console.error("Error en updateSeller: ", error);
            throw new Error(error.message || 'Error al actualizar el vendedor.');
        }
    },

    deleteSeller: async (id) => {
        try {
            const [result] = await db.query(`
                DELETE FROM Usuarios WHERE id_usuario = ?;
            `, [id]);

            if (result.affectedRows === 0) 
                throw new Error('No se encontro el vendedor a eliminar.');

            return { message: 'Vendedor eliminado correctamente.' };
        } catch (error) {
            console.error('Error en deleteSeller: ', error);
            throw new Error(error.message || 'Error al eliminar el vendedor.');
        }
    }
}

export default Sellers;