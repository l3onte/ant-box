import ProfitsModel from "../models/ProfitsModel.js";

const getProfits = async (req, res) => {
    try {
        const { id_tienda } = req.params;
        const { page = 1, limit = 10, search = '', startDate, endDate } = req.query;
        if (!id_tienda) 
            return res.status(400).json({ message: 'El id de la tienda es requerido.' });
            
        const result = await ProfitsModel.getProfits(id_tienda, Number(page), Number(limit), search, startDate, endDate);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error en getProfits.', error: error.message });
    }
}

const getTotal = async (req, res) => {
    try {
        const { id_tienda } = req.params;
        if (!id_tienda)
            return res.status(400).json({ message: 'El id de la tienda es requerido.' });

        const result = await ProfitsModel.getTotal(id_tienda);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error en getTotal.', error: error.message });
    }
}

export default {
    getProfits,
    getTotal
}