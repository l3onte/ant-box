import CustomerModel from '../models/customerModel.js';

const getCustomers = async (req, res) => {
    try {
        const { id_tienda } = req.params;
        const { page = 1, limit = 5 } = req.query;
        if (!id_tienda)
            return res.status(400).json({ message: 'El id de la tienda es requerido.' });

        const result = await CustomerModel.getCustomers(id_tienda, Number(page), Number(limit));
        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
        throw error;
    }
};

const postCustomer = async (req, res) => {
    try {
        const { id_tienda } = req.params;
        const { nombre, direccion, telefono, email } = req.body;

        if (!nombre)
            return res.status(400).json({ message: "El nombre es requerido." });

        const result = await CustomerModel.postCustomer(id_tienda, { nombre, direccion, telefono, email });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCustomer = async (req, res) => {
    try {
        const { id_cliente } = req.params;
        const { data } = req.body;
        if (!id_cliente)
            return res.status(400).json({ message: "El id del cliente es requerido." });

        if (!data)
            return res.status(400).json({ message: "Los datos de la actualización son necesarios." });

        const result = await CustomerModel.updateCustomer(id_cliente, data);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default {
    getCustomers,
    postCustomer,
    updateCustomer
}