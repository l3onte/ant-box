import { body, validationResult } from 'express-validator';

export const validateUser = [
    body('username')
        .trim()
        .notEmpty().withMessage('El nombre de usuario es requerido.')
        .isLength({ max: 100 }).withMessage('El nombre de usuario solo puede contener 100 caracteres.'),

    body('password')
        .trim()
        .notEmpty().withMessage('La contraseña es requerida.')
        .isLength({ min: 6 }).withMessage('La contraseña debe ser mayor a 6 caracteres'),

    body('rol') 
        .trim()
        .isIn(['administrador', 'vendedor']).withMessage('El rol debe ser "administrador" o "vendedor"'),
        
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        next();
    }
];