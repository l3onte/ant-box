import StoreModel from '../models/StoreModel.js';

const getStoreName = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'El user id es requerido.' });
 
        const result = await StoreModel.getStoreName(id);
        if (!result) return res.status(404).json({ message: 'Tienda no encontrada' });

        return res.status(200).json(result);
    } catch (error) {
        console.error("Error en getStoreName: ", error);
        res.status(500).json({ message: error });
    }
}

export default{
    getStoreName
}