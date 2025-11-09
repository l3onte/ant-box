import ProfitsModel from "../models/ProfitsModel.js";
import ExcelJS from "exceljs";

const getProfits = async (req, res) => {
    try {
        const { id_tienda } = req.params;
        let { page = 1, limit = 10, startDate, endDate } = req.query;

        startDate = startDate && startDate.trim() !== '' ? startDate : null;
        endDate = endDate && endDate.trim() !== '' ? endDate : null;

        if (!id_tienda) 
            return res.status(400).json({ message: 'El id de la tienda es requerido.' });
            
        const result = await ProfitsModel.getProfits(id_tienda, Number(page), Number(limit), startDate, endDate);
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

const exportProfits = async (req, res) => {
    try {
        const { id_tienda } = req.params;
        if (!id_tienda)
            return res.status(400).json({ message: 'El id del tienda es requerido.' });

        const { rows } = await ProfitsModel.getProfits(id_tienda, 1, 9999, '', null, null);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet();

        worksheet.columns = [
            { header: 'Fecha', key: 'fecha', width: 20 },
            { header: 'Ventas', key: 'total_ventas', width: 20 },
            { header: 'Costos', key: 'total_costos', width: 20 },
            { header: 'Ganancia del día', key: 'ganancia_total', width: 20}
        ]

        rows.forEach((profit) => worksheet.addRow(profit));
        worksheet.getRow(1).font = { bold: true };
        
        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader("Content-Disposition", "attachment; filename=profits.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: 'Error en exportProfits.', error: error.message });
    }
}

export default {
    getProfits,
    getTotal,
    exportProfits
}