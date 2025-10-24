import express from 'express'
import StoreController from '../controllers/StoreController.js';

const route = express.Router();
 
route.get('/getStoreName/:id', StoreController.getStoreName);

export default route;