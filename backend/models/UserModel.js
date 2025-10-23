import db from "../config/db.js";

const UserModel = {
    postUser: async (userData, hashedPassword) => {
        try {
            const [result] = await db.query(`
                INSERT INTO Usuarios (username, password, rol) VALUES (?, ?, ?);
            `, [userData.username, hashedPassword, userData.rol]);

            return { id: result.insertId, username: userData.username };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Este nombre de usuario ya esta en uso');
            }
            throw error;
        }
    },
}

export default UserModel;