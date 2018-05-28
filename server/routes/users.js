import express from 'express';
import ValidateUser from '../validations/ValidateUser';
import UsersController from '../controllers/UsersController';

const users = express.Router();

users.post('/auth/signup', ValidateUser.userInput, UsersController.create);
users.post('/auth/login', ValidateUser.userInput, UsersController.login);

export default users;
