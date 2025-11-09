import express from 'express';
import ProfitsController from '../controllers/ProfitsController.js';

const Route = express.Router();

Route.get('/getProfits/:id_tienda', ProfitsController.getProfits);
Route.get('/getTotal/:id_tienda', ProfitsController.getTotal);

export default Route;