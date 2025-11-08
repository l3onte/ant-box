import ShoppingModel from '../models/PurchaseModel.js';

const getPurchases = async (req, res) => {
    try {
        const { id_tienda } = req.params;
        const { page = 1, limit = 6, search = '' } = req.query;
        if (!id_tienda) 
            return res.status(400).json({ message: 'El id de la tienda es requerido.' });

        const result = await ShoppingModel.getPurchases(id_tienda, Number(page), Number(limit), search);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error en getPurchases', error: error.message });
    }
}

export default {
    getPurchases
}