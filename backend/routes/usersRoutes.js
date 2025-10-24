import express from 'express';
import UsersController from '../controllers/UsersController.js';
import { validateUser } from '../middleware/validateUser.js';

const router = express.Router();

router.post('/newAssociation', validateUser, UsersController.newAssociation);

export default router;