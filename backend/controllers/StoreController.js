import StoreModel from '../models/StoreModel.js';

const getStoreById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'El user id es requerido.' });

        const result = await StoreModel.getStoreById(id);
        if (!result) return res.status(404).json({ message: 'Tienda no encontrada.' });

        return res.status(200).json(result);
    } catch (error) {
        console.error("Error en getStoreById: ", error);
        res.status(500).json({ message: error });
    }
}

export default {
    getStoreById
}