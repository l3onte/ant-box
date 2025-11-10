import InventoryModel from "../models/InventoryModel.js";
import ExcelJS from "exceljs";

const getInventory = async (req, res) => {
    try {
        const { id_tienda } = req.params;
        const { page = 1, limit = 5, search = '', sort = 'ASC', stockMin = 'false' } = req.query;

        if (!id_tienda)
            return res.status(400).json({ message: 'El id de la tienda es requerido.' });

        const result = await InventoryModel.getInventory(id_tienda, Number(page), Number(limit), search, sort, stockMin === 'true');
        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
const exportInventory = async (req, res) => {
    try {
        const { id_tienda } = req.params;
        if (!id_tienda)
            res.status(400).json({ message: 'El id de la tienda es requerido.' });

        const { rows } = await InventoryModel.getInventory(id_tienda, 1, 9999, '');

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Inventario");

        worksheet.columns = [
            { header: 'nombre', key: 'nombre', width: 20 },
            { header: 'descripción', key: 'descripcion', width: 50 },
            { header: 'comprado', key: 'total_comprado', width: 15 },
            { header: 'vendido', key: 'total_vendido', width: 15 },
            { header: 'stock', key: 'stock_real', width: 15 }
        ]
        
        rows.forEach((row) => worksheet.addRow(row));
        worksheet.getRow(1).font = { bold: true };

        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader("Content-Disposition", "attachment; filename=inventario.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default {
    getInventory,
    exportInventory
}