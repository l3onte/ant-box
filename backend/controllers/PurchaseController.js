import PurchaseModel from '../models/PurchaseModel.js';
import ShoppingModel from '../models/PurchaseModel.js';
import ExcelJS from 'exceljs';
import db from '../config/db.js';

const getPurchases = async (req, res) => {
    try {
        const { id_tienda } = req.params;
        let { page = 1, limit = 6, search = '', startDate, endDate, sort = 'ASC' } = req.query;

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
            endDate,
            sort
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

const getReceipt = async (req, res) => {
    try {
        const { id_compra } = req.params;
        if (!id_compra) return res.status(400).json({ message: 'El id de la compra es requerido.' });

        const [rows] = await db.query(`
            SELECT c.id_compra, DATE_FORMAT(c.fecha_compra, '%d/%m/%Y') AS fecha_compra, c.total, 
                   p.nombre AS proveedor
            FROM Compras c
            INNER JOIN Proveedores p ON c.id_proveedor = p.id_proveedor
            WHERE c.id_compra = ?
        `, [id_compra]);

        const compra = rows[0];
        if (!compra) return res.status(404).json({ message: 'Compra no encontrada.' });

        const [detalles] = await db.query(`
            SELECT dc.id_producto, pr.nombre AS producto, dc.cantidad, dc.precio_compra
            FROM Detalle_Compras dc
            INNER JOIN Productos pr ON dc.id_producto = pr.id_producto
            WHERE dc.id_compra = ?
        `, [id_compra]);

        res.status(200).json({ compra, detalles });

    } catch (error) {
        console.error('Error en getReceipt:', error.message);
        res.status(500).json({ message: 'Error al generar el recibo', error: error.message });
    }
};


export default {
    getPurchases,
    postPurchase,
    updatePurchase,
    deletePurchase,
    exportPurchases,
    getReceipt
};