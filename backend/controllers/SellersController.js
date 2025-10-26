import SellersModel from '../models/SellersModel.js'
import bcrypt from 'bcrypt'

const postSeller = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) 
            return res.status(400).json({ message: 'El id de la tienda es requerido.' });

        const { userData } = req.body;
        if (!userData) 
            return res.status(400).json({ message: 'Los datos del nuevo usuario son requeridos.' });

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

        const result = await SellersModel.postSeller(userData, id, hashedPassword);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error in post seller: ', error);

        if (error.message.includes('ya existe')) {
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({ message: 'Error al registrar el vendedor: ', error: error.message });
    }
};

const getSellers = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) 
            return res.status(400).json({ message: 'El id de la tienda es requerido.' });

        const result = await SellersModel.getSellers(id);
        if (result.length === 0) 
            return res.status(404).json({ message: 'No se encontraron a los usuarios de esta tienda.' });

        res.status(200).json(result);
    } catch (error) {
        console.error('Error in getSellers: ', error.message);
        res.status(500).json({ message: 'Error al obtener los vendedores: ', error: error.message });
    }
};

const updateSeller = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) 
            return res.status(400).json({ message: 'El id del vendedor es requerido.' });
        
        const { updateData } = req.body;
        if (!updateData) 
            return res.status(400).json({ message: 'Los datos para actualizar el vendedor es requerido.' });

        const result = await SellersModel.updateSeller(id, updateData);
        if (!result) 
            return res.status(404).json({ message: 'No se pudo actualizar el vendedor.' });

        res.status(200).json({ message: "Vendedor actualizado con éxito." });
    } catch (error) {
        console.error('Error in updateSeller: ', error.message);
        res.status(500).json({ message: 'Error al actualizar el vendedor: ', error: error.message });
    }
}

const deleteSeller = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id)
            return res.status(400).json({ message: 'El id del vendedor es requerido.' });

        const result = await SellersModel.deleteSeller(id);
        if (!result)
            return res.status(404).json({ message: 'No se pudo eliminar el vendedor.' });

        res.status(200).json({ message: "Vendedor eliminado con éxito." });
    } catch (error) {
        console.error('Error in deleteSeller: ', error.message);
        res.status(500).json({ message: 'Error al eliminar el vendedor: ', error: error.message });
    }
}

export default {
    postSeller,
    getSellers,
    updateSeller,
    deleteSeller
}