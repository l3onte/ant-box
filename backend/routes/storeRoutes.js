import express from 'express'
import StoreController from '../controllers/StoreController.js';

const route = express.Router();
 
route.get('/getStoreById/:id', StoreController.getStoreById);

export default route;