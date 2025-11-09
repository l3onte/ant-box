import express from 'express';
import ProfitsController from '../controllers/ProfitsController.js';

const Route = express.Router();

Route.get('/getProfits/:id_tienda', ProfitsController.getProfits);
Route.get('/getTotal/:id_tienda', ProfitsController.getTotal);
Route.get('/export/:id_tienda', ProfitsController.exportProfits);

export default Route;