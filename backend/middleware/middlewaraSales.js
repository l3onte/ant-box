import { body, validationResult } from "express-validator";
import db from "../config/db.js";

const validateSale = [
    body('saleInfo.id_producto')
        .notEmpty().withMessage('El id del producto es requerido.')
        .isInt({ gt: 0 }).withMessage('El id del producto debe ser un número válido.'),

    body('saleInfo.cantidad')
        .notEmpty().withMessage('La cantidad es obligatoria.')
        .isInt({ gt: 0 }).withMessage('La cantidad debe ser mayor que cero.')
        .custom(async (cantidad, { req }) => {
            const id_producto = req.body.saleInfo.id_producto;

            const [rows] = await db.query(`
                SELECT stock, stock_minimo, nombre
                FROM Productos
                WHERE id_producto = ?;
            `, [id_producto]); 

            if (rows.length === 0) 
                throw new Error('El producto no existe.');

            const { stock, stock_minimo, nombre } = rows[0];

            if (cantidad > stock) 
                throw new Error(`No hay suficiente stock del producto "${nombre}". Disponible: ${stock}`);

            if (stock - cantidad < stock_minimo)
                throw new Error(`La venta dejaría el stock de "${nombre}" por debajo del mínimo (${stock_minimo}).`);

            return true;
        }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Error en la validación de la venta.',
                errors: errors.array()
            });
        }
        next();
    }
];

export {validateSale};