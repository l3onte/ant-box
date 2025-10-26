import db from "../config/db.js";

const UserModel = {
    newAssociation: async (userData, hashedPassword, storeData) => {
        const connection = await db.getConnection(); // Esto se usa cuando se necesita hacer varias consultas como una unidad.

        try {
            await connection.beginTransaction();

            const { nombreUsuario, apellido, correo, username } = userData;

            const [resultUser] = await connection.query(`
                INSERT INTO Usuarios (nombre, apellido, correo, username, password, rol) VALUES (?, ?, ?, ?, ?, ?);
            `, [nombreUsuario, apellido, correo, username, hashedPassword, 'administrador']);

            const userId = resultUser.insertId;
            const { nombreTienda, direccion, telefono, moneda, logo } = storeData;

            await connection.query(`
                INSERT INTO Tiendas (id_usuario, nombre, direccion, telefono, moneda, logo) VALUES (?, ?, ?, ?, ?, ?);   
            `, [userId, nombreTienda, direccion, telefono, moneda, null]);

            await connection.commit(); // Si no hay error se commitea en al base de datos

            return { id: userId, username: userData.username };
        } catch (error) {
            console.error("Error en newAssocitation", error);
            await connection.rollback(); // Si falla se hace un rollback

            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Este nombre de usuario ya esta en uso');
            }
            throw error;
        } finally {
            connection.release();
        }
    },

    findByUsername: async (username) => {
        try {
            const [rows] = await db.query(`
                SELECT  
                    id_usuario AS id,
                    nombre,
                    apellido,
                    correo,
                    username,
                    password,
                    rol
                FROM Usuarios WHERE username = ?;
            `, [username]);

            return rows[0];
        } catch (error) {
            console.error("Error en find username: ", error);
        }
    },
}

export default UserModel;