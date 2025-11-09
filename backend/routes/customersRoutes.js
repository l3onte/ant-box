import express from 'express';
import CustomerController from '../controllers/CustomerController.js';

const Route = express.Router();

Route.get('/getCustomers/:id_tienda', CustomerController.getCustomers);
Route.post('/postCustomer/:id_tienda', CustomerController.postCustomer);
Route.put('/updateCustomer/:id_cliente', CustomerController.updateCustomer);
Route.get('/export/:id_tienda', CustomerController.exportCustomers);

export default Route;