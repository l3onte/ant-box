import express from 'express';
import SuppliersController from '../controllers/SuppliersController.js'
import { validateSupplier, validateUpdateSupplier } from '../middleware/middlewareSupplier.js';

const Route = express.Router();

Route.post('/postSupplier/:id_tienda', validateSupplier, SuppliersController.postSupplier);
Route.get('/getSuppliers/:id_tienda', SuppliersController.getSuppliers);
Route.put('/updateSupplier/:id_proveedor', validateUpdateSupplier, SuppliersController.updateSupplier);
Route.delete('/deleteSupplier/:id_proveedor', SuppliersController.deleteSupplier);
Route.get('/export/:id_tienda', SuppliersController.exportSuppliers);

export default Route;