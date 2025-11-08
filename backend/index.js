import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import usersRoutes from './routes/usersRoutes.js' ;
import storeRoutes from './routes/storeRoutes.js';
import sellerRoutes from './routes/SellersRoutes.js';
import supplierRoutes from './routes/suppliersRoutes.js';
import inventoryRoutes from './routes/InventoryRoutes.js';
import saleRoutes from './routes/salesRoutes.js';
import customerRoutes from './routes/customersRoutes.js';
import productsRoutes from './routes/productsRoutes.js';
import purchaseRoutes from './routes/PurchasesRoutes.js';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

const corsAllowedOrigins = [
    'http://localhost:5173'
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);

        if(corsAllowedOrigins.indexOf(origin) === -1) {
            const message = 'Not allow access from the specified origin';
            return callback(new Error(message), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas

app.use('/ant-box/users', usersRoutes);
app.use('/ant-box/store', storeRoutes);
app.use('/ant-box/sellers', sellerRoutes);
app.use('/ant-box/suppliers', supplierRoutes);
app.use('/ant-box/inventory', inventoryRoutes);
app.use('/ant-box/sales', saleRoutes);
app.use('/ant-box/customers', customerRoutes);
app.use('/ant-box/products', productsRoutes);
app.use('/ant-box/purchases', purchaseRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on: ${PORT}`);
});