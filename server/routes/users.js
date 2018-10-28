import express from 'express';
import AdminUsersController from '../controllers/AdminUsersController';
import Authorization from '../middlewares/Authorization';
import UsersController from '../controllers/UsersController';
import ValidateUser from '../validations/ValidateUser';
import Validation from '../validations/Validation';

const users = express.Router();

users.post(
  '/auth/signup',
  ValidateUser.userInput,
  UsersController.create,
);

users.post(
  '/auth/login',
  ValidateUser.userInputLogin,
  UsersController.login,
);

users.get(
  '/users/profiles/:id',
  Authorization.verifyUser,
  Validation.validateId,
  UsersController.userDetails,
);

users.get(
  '/profiles/:id',
  Authorization.verifyUser,
  Authorization.verifyAdmin,
  AdminUsersController.userDetails,
);

users.get(
  '/profiles',
  Authorization.verifyUser,
  Authorization.verifyAdmin,
  AdminUsersController.getAllUsersDetails,
);

export default users;
