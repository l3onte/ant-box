import SuppliersModel from "../models/SuppliersModel.js";

const postSupplier = async (req, res) => {
    try {
        const { id_tienda } = req.params;
        if (!id_tienda)
            return res.status(400).json({ message: 'El id de la tienda es requerido.' });

        const { supplierData } = req.body;
        if (!supplierData) 
            return res.status(400).json({ message: 'Los datos del proveedor son requeridos.' });

        const result = await SuppliersModel.postSuppliers(id_tienda, supplierData);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSuppliers = async (req, res) => {
    try {
        const { id_tienda } = req.params;
        const { page = 1, limit = 5 } = req.query;
        
        if (!id_tienda) 
            return res.status(400).json({ message: 'El id de la tienda es requerido.' });

        const result = await SuppliersModel.getSuppliers(id_tienda, Number(page), Number(limit)); 

        if (result.result.length === 0) 
            return res.status(404).json({ message: 'No se encontraron los proveedores de esta tienda.' });

        return res.status(200).json(result);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSupplier = async (req, res) => {
    try {
        const { id_supplier } = req.params;
        const { updateData } = req.body;

        if (!id_supplier)
            return res.status(400).json({ message: 'El id del proveedor es requerido.' });

        if (!updateData)
            return res.status(400).json({ message: 'Los datos de la actualización son requeridos.' });

        const result = await SuppliersModel.updateSupplier(id_supplier, updateData);
        return res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSupplier = async (req, res) => {
    try {
        const { id_supplier } = req.params;
        if (!id_supplier) 
            return res.status(400).json({ message: 'El id del proveedor es requerido.' });

        const result = await SuppliersModel.deleteSupplier(id_supplier);
        return res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    postSupplier,
    getSuppliers,
    updateSupplier,
    deleteSupplier
}