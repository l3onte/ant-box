import express from 'express';
import UsersController from '../controllers/UsersController.js';
import { validateUser, validateLogin } from '../middleware/validateUser.js';

const router = express.Router();

router.post('/newAssociation', validateUser, UsersController.newAssociation);
router.post('/login', validateLogin, UsersController.login);

export default router;