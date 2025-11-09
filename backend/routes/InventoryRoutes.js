import express from 'express'
import InvetoryController from '../controllers/InventoryController.js'

const Route = express.Router();

Route.get('/getInventory/:id_tienda', InvetoryController.getInventory);
Route.get('/export/:id_tienda', InvetoryController.exportInventory);

export default Route;