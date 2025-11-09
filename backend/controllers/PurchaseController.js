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

const postPurchase = async (req, res) => {
    try {
        const { id_tienda } = req.params;
        const result = await ShoppingModel.postPurchase(id_tienda, req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error en postPurchase', error: error.message });
    }
};

const updatePurchase = async (req, res) => {
    try {
        const { id_compra } = req.params;
        const result = await ShoppingModel.updatePurchase(id_compra, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error en updatePurchase', error: error.message });
    }
};

const deletePurchase = async (req, res) => {
    try {
        const { id_compra } = req.params;
        const result = await ShoppingModel.deletePurchase(id_compra);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error en deletePurchase', error: error.message });
    }
};

export default {
    getPurchases,
    postPurchase,
    updatePurchase,
    deletePurchase
};