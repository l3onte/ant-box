import ProductsModel from '../models/ProductsModel.js';
import ExcelJS from 'exceljs';

const getProducts = async (req, res) => {
    try {
        const { id_tienda } = req.params;
        const { page = 1, limit = 5, search = '', sort = 'ASC' } = req.query;

        if (!id_tienda)
            return res.status(400).json({ message: "El id de la tienda es requerido." });

        const result = await ProductsModel.getProducts(id_tienda, Number(page), Number(limit), search, sort);
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

const exportProduct = async (req, res) => {
    try {
        const { id_tienda } = req.params;
        if (!id_tienda)
            return res.status(400).json({ message: "El id de la tienda es requerido." });

        const { rows } = await ProductsModel.getProducts(id_tienda, 1, 9999, '');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet();

        worksheet.columns = [
            { header: 'id', key: 'id_producto', width: 10 },
            { header: 'proveedor', key: 'proveedor', width: 30 },
            { header: 'producto', key: 'nombre', width: 30 },
            { header: 'descripcion', key: 'descripcion', width: 50 },
            { header: 'precio de compra', key: 'precio_compra', width: 30 },
            { header: '%. ganancia', key: 'porcentaje_ganancia', width: 30 },
            { header: 'precio venta', key: 'precio_venta', width: 30 }
        ]

        rows.forEach((product) => worksheet.addRow(product));
        worksheet.getRow(1).font = { bold: true };

        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader("Content-Disposition", "attachment; filename=productos.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(error);
    }
}

export default {
    getProducts,
    postProduct,
    updateProduct,
    deleteProduct,
    exportProduct
}