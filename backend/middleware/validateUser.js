import { body, validationResult } from 'express-validator';
import db from '../config/db.js';

const validateSeller = [
    body('userData.username')
        .trim()
        .notEmpty().withMessage('El nombre de usuario es requerido.')
        .isLength({max: 100}).withMessage('El nombre de usuario solo puede contener 100 caracteres.')
        .custom(async (username) => {
            const [rows] = await db.query(`SELECT * FROM Usuarios WHERE username = ?;`, [username]);
            if (rows.length > 0) {
                throw new Error('El nombre de usuario ya está en uso.');
            }

            return true;
        }),

    body('userData.password')
        .trim()
        .notEmpty().withMessage('La contraseña es requerida.')
        .isLength({ min: 6 }).withMessage('La contraseña debe ser mayor a 6 caracteres.'),

    body('userData.nombre')
        .trim()
        .notEmpty().withMessage('El nombre es requerido.'),

    body('userData.apellido')
        .trim()
        .notEmpty().withMessage('El apellido es requerido.'),

    body('userData.correo')
        .trim()
        .notEmpty().withMessage('El correo es requerido.')
        .custom(async (correo) => {
            const [rows] = await db.query(`SELECT * FROM Usuarios WHERE correo = ?;`, [correo]);
            if (rows.length > 0) {
                throw new Error('El correo ya está registrado.');
            }

            return true;
        }),

    body('userData.rol')
        .trim()
        .isIn(['administrador', 'vendedor']).withMessage('El rol debe ser "administrador" o "vendedor"'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        next();
    }
];

const validateUpdateSeller = [
    body('userData.username')
        .trim()
        .notEmpty().withMessage('El username es requerido')
        .custom(async (username, { req }) => {
            const { id } = req.params;
            const [rows] = await db.query('SELECT * FROM Usuarios WHERE username = ? AND id_usuario != ?;', [username, id]);
            if (rows.length > 0) {
                throw new Error('El username ya está registrado.');
            }

            return true
        }),

    body('userData.nombre')
        .trim()
        .notEmpty().withMessage('El nombre es requerido.'),

    body('userData.apellido')
        .trim()
        .notEmpty().withMessage('El apellido es requerido.'),

    body('userData.correo')
        .trim()
        .notEmpty().withMessage('El correo es requerido.')
        .custom(async (correo, { req }) => {
            const { id } = req.params;
            const [rows] = await db.query(`SELECT * FROM Usuarios WHERE correo = ? AND id_usuario != ?;`, [correo, id]);
            if (rows.length > 0) {
                throw new Error('El correo ya está en uso.');
            }

            return true;
        }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        next();
    }
]

const validateUser = [
    body('userData.username')
        .trim()
        .notEmpty().withMessage('El nombre de usuario es requerido.')
        .isLength({ max: 100 }).withMessage('El nombre de usuario solo puede contener 100 caracteres')
        .custom(async (username) => {
            const [rows] = await db.query(`SELECT * FROM Usuarios WHERE username = ?;`, [username]);
            if (rows.length > 0) {
                throw new Error('El username ya está en uso.');
            }

            return true;
        }),

    body('userData.password')
        .trim()
        .notEmpty().withMessage('La contraseña es requerida.')
        .isLength({ min: 6 }).withMessage('La contraseña debe ser mayor a 6 caracteres'),

    body('userData.rol')
        .trim()
        .isIn(['administrador', 'vendedor']).withMessage('El rol debe ser "administrador" o "vendedor"'),

    body('storeData.nombreTienda')
        .trim()
        .notEmpty().withMessage('El nombre de la tienda es requerido.'),

    body('storeData.moneda') 
        .trim()
        .notEmpty().withMessage('El tipo de moneda es requerido.'),
        
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        next();
    }
];

const validateLogin = [
    body('username')
        .trim()
        .notEmpty().withMessage('El nombre de usuario es requerido.'),
    
    body('password')
        .trim()
        .notEmpty().withMessage('La contraseña es requerida.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        next();
    }
]

export {
    validateUser,
    validateLogin,
    validateSeller,
    validateUpdateSeller
}