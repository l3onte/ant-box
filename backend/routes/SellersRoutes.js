import express from 'express'
import SellersController from '../controllers/SellersController.js'
import { validateSeller, validateUpdateSeller } from '../middleware/validateUser.js';

const Route = express.Router();

Route.post('/postSeller/:id', validateSeller, SellersController.postSeller);
Route.get('/getSellers/:id', SellersController.getSellers);
Route.put('/updateSeller/:id', validateUpdateSeller, SellersController.updateSeller);
Route.delete('/deleteSeller/:id', SellersController.deleteSeller);

export default Route;
