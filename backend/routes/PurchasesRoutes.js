import express from 'express';
import ShoppingController from '../controllers/PurchaseController.js';

const Route = express.Router();

Route.get('/getPurchases/:id_tienda', ShoppingController.getPurchases);

export default Route;