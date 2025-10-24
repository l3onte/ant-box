import db from '../config/db.js'

const Store = {
    getStoreName: async (id) => {
        const [rows] = await db.query(`
            SELECT nombre FROM Tiendas WHERE id_usuario = ?;
        `, [id]);

        return rows[0];
    }
}

export default Store;