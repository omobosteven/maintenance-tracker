import express from 'express';
import validateUser from '../validations/validateUser';
import UsersController from '../controllers/UsersController';

const router = express.Router();

router.post('/auth/signup', validateUser, UsersController.create);

export default router;
