import express from 'express'
import InvetoryController from '../controllers/InventoryController.js'

const Route = express.Router();

Route.get('/getInventory/:id_tienda', InvetoryController.getInventory);

export default Route;