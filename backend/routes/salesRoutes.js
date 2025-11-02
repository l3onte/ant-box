import express from 'express'
import SalesController from '../controllers/SalesController.js';
import { validateSale } from '../middleware/middlewaraSales.js';

const Route = express.Router();

Route.post('/postSale/:id_tienda', validateSale, SalesController.postSale);
Route.get('/getSales/:id_tienda', SalesController.getSales);
Route.get('/getSaleDetails/:id_venta', SalesController.getSaleDetails);
Route.put('/updateSale/:id_venta', SalesController.updateSale); 
Route.delete('/deleteSale/:id_venta', SalesController.deleteSale);
Route.delete('/deleteDetail/:id_detalle', SalesController.deleteDetail);

export default Route;