import SuppliersModel from "../models/SuppliersModel.js";
import ExcelJS from "exceljs"

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
        const { page = 1, limit = 5, search = '', sort = 'ASC' } = req.query;
        
        if (!id_tienda) 
            return res.status(400).json({ message: 'El id de la tienda es requerido.' });

        const result = await SuppliersModel.getSuppliers(id_tienda, Number(page), Number(limit), search, sort); 

        if (result.result.length === 0) 
            return res.status(404).json({ message: 'No se encontraron los proveedores de esta tienda.' });

        return res.status(200).json(result);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSupplier = async (req, res) => {
    try {
        const { id_proveedor } = req.params;
        const { updateData } = req.body;

        if (!id_proveedor)
            return res.status(400).json({ message: 'El id del proveedor es requerido.' });

        if (!updateData)
            return res.status(400).json({ message: 'Los datos de la actualización son requeridos.' });

        const result = await SuppliersModel.updateSupplier(id_proveedor, updateData);
        return res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSupplier = async (req, res) => {
    try {
        const { id_proveedor } = req.params;
        if (!id_proveedor) 
            return res.status(400).json({ message: 'El id del proveedor es requerido.' });

        const result = await SuppliersModel.deleteSupplier(id_proveedor);
        return res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const exportSuppliers = async (req, res) => {
    try {
        const { id_tienda } = req.params;
        if (!id_tienda)
            res.status(400).json({ message: 'El id de la tienda es requerido.' });

        const { result } = await SuppliersModel.getSuppliers(id_tienda, 1, 9999, '');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Proveedores");

        worksheet.columns = [
            { header: 'id', key: 'id_proveedor', width: 30 },
            { header: 'nombre', key: 'nombre', width: 30 },
            { header: 'direccion', key: 'direccion', width: 50 },
            { header: 'telefono', key: 'telefono', width: 30 },
            { header: 'email', key: 'email', width: 30 }
        ]

        result.forEach((supplier) => worksheet.addRow(supplier));
        worksheet.getRow(1).font = { bold: true };

        const buffer = await workbook.xlsx.writeBuffer();

        res.setHeader("Content-Disposition", "attachment; filename=proveedores.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default {
    postSupplier,
    getSuppliers,
    updateSupplier,
    deleteSupplier,
    exportSuppliers
}