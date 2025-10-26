import db from '../config/db.js'

const Store = {
    getStoreById: async (id) => {
        const [rows] = await db.query(`
            SELECT  
                id_tienda,
                nombre,
                direccion,
                telefono,
                moneda
            FROM Tiendas
            WHERE id_usuario = ?;
        `, [id]);

        return rows[0];
    }
}

export default Store;