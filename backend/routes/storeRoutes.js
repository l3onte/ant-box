import express from 'express'
import StoreController from '../controllers/StoreController.js';

const route = express.Router();
 
route.get('/getStoreById/:id', StoreController.getStoreById);
route.get('/getStoreByUser/:id', StoreController.getStoreByUser);

export default route;