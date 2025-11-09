import express from 'express'
import SalesController from '../controllers/SalesController.js';
import { validateSale } from '../middleware/middlewaraSales.js';

const Route = express.Router();

Route.post('/postSale/:id_tienda', SalesController.postSale);
Route.get('/getSales/:id_tienda', SalesController.getSales);
Route.get('/getSaleDetails/:id_venta', SalesController.getSaleDetails);
Route.get('/getProducts/:id_tienda', SalesController.getProducts)
Route.put('/updateSale/:id_venta', SalesController.updateSale); 
Route.delete('/deleteSale/:id_venta', SalesController.deleteSale);
Route.delete('/deleteDetail/:id_detalle', SalesController.deleteDetail);
Route.get('/export/:id_tienda', SalesController.exportSales)

export default Route;