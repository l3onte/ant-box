import PurchaseModel from '../models/PurchaseModel.js';
import ShoppingModel from '../models/PurchaseModel.js';
import ExcelJS from 'exceljs';

const getPurchases = async (req, res) => {
    try {
        const { id_tienda } = req.params;
        let { page = 1, limit = 6, search = '', startDate, endDate } = req.query;

        startDate = startDate && startDate.trim() !== '' ? startDate: null;
        endDate = endDate && endDate.trim() !== '' ? endDate: null;

        if (!id_tienda) 
            return res.status(400).json({ message: 'El id de la tienda es requerido.' });

        const result = await ShoppingModel.getPurchases(
            id_tienda, 
            Number(page), 
            Number(limit), 
            search,
            startDate,
            endDate
        );
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

const exportPurchases = async (req, res) => {
    try {
        const { id_tienda } = req.params;
        if (!id_tienda)
            return res.status(400).json({ message: 'El id de la tienda es requerido.' });

        const { rows } = await PurchaseModel.getPurchases(id_tienda, 1, 9999, '', null, null);
 
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Compras");

        worksheet.columns = [
            { header: 'ID Columnas', key: 'id_compra', width: 10 },
            { header: 'Fecha de Compra', key: 'fecha_compra', width: 15 },
            { header: 'Proveedor', key: 'proveedor', width: 30 },
            { header: 'Producto', key: 'producto', width: 30 },
            { header: 'Cantidad', key: 'cantidad', width: 10 },
            { header: 'Precio de Compra', key: 'precio_compra', width: 30 },
            { header: 'Total', key: 'total', width: 30 }
        ]

        rows.forEach((compra) => worksheet.addRow(compra));
        worksheet.getRow(1).font = { bold: true };

        const buffer = await workbook.xlsx.writeBuffer();

        res.setHeader("Content-Disposition", "attachment; filename=compras.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: 'Error en exportPurchases', error: error.message });
    }
}

export default {
    getPurchases,
    postPurchase,
    updatePurchase,
    deletePurchase,
    exportPurchases
};