import express from 'express';
import ShoppingController from '../controllers/PurchaseController.js';

const Route = express.Router();

Route.get('/getPurchases/:id_tienda', ShoppingController.getPurchases);
Route.post('/postPurchase/:id_tienda', ShoppingController.postPurchase);
Route.put('/updatePurchase/:id_compra', ShoppingController.updatePurchase);
Route.delete('/deletePurchase/:id_compra', ShoppingController.deletePurchase);
Route.get('/export/:id_tienda', ShoppingController.exportPurchases);
Route.get('/receipt/:id_compra', ShoppingController.getReceipt)

export default Route;