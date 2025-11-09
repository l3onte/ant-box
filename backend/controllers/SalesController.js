import SalesModel from "../models/SalesModel.js";
import ExcelJS from "exceljs";

const postSale = async (req ,res) => {
    try {
        const { id_tienda } = req.params;
        const { saleInfo } = req.body;

        if (!id_tienda) 
            return res.status(400).json({ message: 'El id de la tienda es requerido.' });

        if (!saleInfo)
            return res.status(400).json({ message: 'Los datos de la venta son requeridos.' });
        
        const result = await SalesModel.postSale(id_tienda, saleInfo);
        return res.status(201).json(result);
    } catch (error) {
        console.error('Error en postSale: ', error.message);
        res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
};

const getSales = async (req, res) => {
    try {   
        const { id_tienda } = req.params;
        let { page = 1, limit = 5, search = '', startDate, endDate, sort = 'ASC' } = req.query;

        startDate = startDate && startDate.trim() !== '' ? startDate : null;
        endDate = endDate && endDate.trim() !== '' ? endDate : null;

        if (!id_tienda)
            return res.status(400).json({ message: 'El id de la tienda es requerido' });

        const result = await SalesModel.getSale(
                                                id_tienda, 
                                                Number(page),
                                                Number(limit), 
                                                search, 
                                                startDate, 
                                                endDate,
                                                sort
                                            );
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error en getSales: ', error.message);
        res.status(500).json({ message: 'Error al obtener las ventas.', error: error.message });
    }
};

const getSaleDetails = async (req, res) => {
    try {
        const { id_venta } = req.params;
        if (!id_venta)
                return res.status(400).json({ message: 'El id de la venta es requerido.' });

        const result = await SalesModel.getSaleDetails(id_venta);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error getSaleDetails: ', error.message);
        res.status(500).json({ message: 'Error al obtener los detalles de la venta.', error: error.message });
    }
}

const updateSale = async (req, res) => {
    try {
        const { id_venta } = req.params;
        const { saleInfo } = req.body;

        if (!id_venta)
            return res.status(400).json({ message: 'El id de la venta es requerido.' });

        if (!saleInfo)
            return res.status(400).json({ message: 'Los datos para actualizar son requeridos.' });

        const result = await SalesModel.updateSale(id_venta, saleInfo);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error en updateSale: ', error.message);
        res.status(500).json({ message: 'Error al actualizar la venta.', error: error.message });
    }
};

const deleteSale = async (req, res) => {
    try {
        const { id_venta } = req.params;

        if (!id_venta)
            return res.status(400).json({ message: 'El id de la venta es requerido.' });

        const result = await SalesModel.deleteSale(id_venta);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error en deleteSale: ', error.message);
        res.status(500).json({ message: 'Error al eliminar la venta.', error: error.message });
    }
}

const deleteDetail = async (req, res) => {
    try {
        const { id_detalle } = req.params;
        if (!id_detalle)
            return res.status(400).json({ message: 'El id del detalle es requerido.' });

        const result = await SalesModel.deleteDatail(id_detalle);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error en deleteDatail: ', error.message);
        res.status(500).json({ message: 'Error al eliminar la venta.', error: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const { id_tienda } = req.params;
        if (!id_tienda)
            return res.status(400).json({ message: 'El id de la tineda es requerido.' });

        const result = await SalesModel.getProducts(id_tienda);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error en getProducts: ', error.message);
        res.status(500).json({ message: 'Error al extraer los productos.', error: error.message });
    }
}

const exportSales = async (req, res) => {
    try {
        const { id_tienda } = req.params;
        if (!id_tienda)
            return res.status(400).json({ message: "El id de la tienda es requerido." });

        const { rows } = await SalesModel.getSale(id_tienda, 1, 99999, '', null, null);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Ventas");

        worksheet.columns = [
            { header: "ID Venta", key: "id_venta", width: 10 },
            { header: "Fecha", key: "Fecha", width: 15 },
            { header: "Cliente", key: "Cliente", width: 25 },
            { header: "Cantidad de Productos", key: "Cantidad_de_Productos", width: 25 },
            { header: "Total Venta", key: "Total_Venta", width: 15 },
        ]

        rows.forEach((venta) => worksheet.addRow(venta));
        worksheet.getRow(1).font = { bold: true };

        const buffer = await workbook.xlsx.writeBuffer();

        res.setHeader("Content-Disposition", "attachment; filename=ventas.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(buffer);
    } catch (error) {
        console.error("Error al exportar ventas: ", error.message);
        res.status(500).json({ message: "Error al generar el Excel." });
    }
}

export default {
    getSales,
    getSaleDetails,
    postSale,
    updateSale,
    deleteSale,
    deleteDetail,
    getProducts,
    exportSales
}