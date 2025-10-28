import { body, validationResult } from "express-validator";
import db from "../config/db.js";

const validateSupplier = [
    body('supplierData.nombre')
        .trim()
        .notEmpty().withMessage('El nombre del proveedor es requerido.')
        .custom(async (nombre) => {
            const [row] = await db.query(`
              SELECT * FROM Proveedores WHERE nombre = ?;  
            `, [nombre]);

            if (row.length > 0)
                throw new Error('El nombre del proveedor ya está en uso.');

            return true;
        }),

    body('supplierData.email')
        .trim()
        .notEmpty().withMessage('El email del proveedor es requerido.')
        .custom(async (email) => {
            const [row] = await db.query(`
                SELECT * FROM Proveedores WHERE email = ?;
            `, [email]);

            if (row.length > 0)
                throw new Error('El email del proveedor ya está en uso.');

            return true;
        }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        next();
    }
]

const validateUpdateSupplier = [
    body('updateData.nombre')
        .trim()
        .notEmpty().withMessage('El nombre del proveedor es requerido.')
        .custom(async (nombre, {req}) => {
            const { id_supplier } = req.params;
            const [row] = await db.query(`
              SELECT * FROM Proveedores WHERE nombre = ? AND id_proveedor != ?;  
            `, [nombre, id_supplier]);

            if (row.length > 0)
                throw new Error('El nombre del proveedor ya está en uso.');

            return true;
        }),

    body('updateData.email')
        .trim()
        .notEmpty().withMessage('El email del proveedor es requerido.')
        .custom(async (email, {req}) => {
            const { id_supplier } = req.params;
            const [row] = await db.query(`
                SELECT * FROM Proveedores WHERE email = ? AND id_proveedor != ?;
            `, [email, id_supplier]);

            if (row.length > 0)
                throw new Error('El email del proveedor ya está en uso.');

            return true;
        }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        next();
    }
]

export { 
    validateSupplier,
    validateUpdateSupplier
}