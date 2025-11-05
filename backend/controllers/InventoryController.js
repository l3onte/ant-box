import InventoryModel from "../models/InventoryModel.js";

const getInventory = async (req, res) => {
    try {
        const { id_tienda } = req.params;
        const { page = 1, limit = 5 } = req.query;

        if (!id_tienda)
            return res.status(400).json({ message: 'El id de la tienda es requerido.' });

        const result = await InventoryModel.getInventory(id_tienda, Number(page), Number(limit));
        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
export default {
    getInventory
}