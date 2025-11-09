import ProductsModel from '../models/ProductsModel.js';

const getProducts = async (req, res) => {
    try {
        const { id_tienda } = req.params;
        const { page = 1, limit = 5, search } = req.query;

        if (!id_tienda)
            return res.status(400).json({ message: "El id de la tienda es requerido." });

        const result = await ProductsModel.getProducts(id_tienda, Number(page), Number(limit), search);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(error);
    }
};

const postProduct = async (req, res) => {
    try {
        const { id_tienda } = req.params;
        const data = req.body;
        if (!id_tienda)
            return res.status(400).json({ message: "El id de la tienda es requerido." });
        
        const result = await ProductsModel.postProduct(id_tienda, data);
        res.status(201).json({ message: "Producto creado correctamente.", id_producto: result })
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(error);
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id_producto } = req.params;
        const data = req.body;
        if (!id_producto)
            return res.status(400).json({ message: "El id del producto es requerido." });

        const result = await ProductsModel.updateProduct(id_producto, data);
        res.status(200).json(result);  
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(error);
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id_producto } = req.params;
        if (!id_producto)
            return res.status(400).json({ message: "El id del producto es requerido." });

        const result = await ProductsModel.deleteProduct(id_producto);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(error);
    }
};

export default {
    getProducts,
    postProduct,
    updateProduct,
    deleteProduct
}