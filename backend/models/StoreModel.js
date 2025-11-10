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
    },

    getStoreByUser: async (id_usuario) => {
        try {
            const [ownerStore] = await db.query(`
                SELECT * FROM Tiendas WHERE id_usuario = ?;
            `, [id_usuario]);

            if (ownerStore.length > 0) return ownerStore[0];

            const [vendorStore] = await db.query(`
                SELECT t.*
                FROM Tiendas t
                INNER JOIN Vendedores v ON v.id_tienda = t.id_tienda
                WHERE v.id_usuario = ?;
            `, [id_usuario]);

            if (vendorStore.length > 0) return vendorStore[0];

            return null;
        } catch (error) {
            console.error("Error en getStoreByUser:", error);
            throw error;
        }
    }
}

export default Store;