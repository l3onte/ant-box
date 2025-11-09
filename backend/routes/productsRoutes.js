import express from 'express';
import ProductsController from '../controllers/ProductsController.js';

const Route = express.Router();

Route.get('/getProducts/:id_tienda', ProductsController.getProducts);
Route.post('/postProduct/:id_tienda', ProductsController.postProduct);
Route.put('/updateProduct/:id_producto', ProductsController.updateProduct);
Route.delete('/deleteProduct/:id_producto', ProductsController.deleteProduct);
Route.get('/export/:id_tienda', ProductsController.exportProduct);

export default Route;