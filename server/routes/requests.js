import express from 'express';
import Authorization from '../middlewares/Authorization';
import RequestsController from '../controllers/RequestsController';
import ValidateRequest from '../validations/ValidateRequest';
import Validation from '../validations/Validation';

const requests = express.Router();

requests.get(
  '/users/requests',
  Authorization.verifyUser,
  RequestsController.getAllRequests,
);

requests.get(
  '/users/requests/:id',
  Validation.validateId, RequestsController.getRequest,
);

requests.post(
  '/users/requests',
  Authorization.verifyUser,
  ValidateRequest.create,
  RequestsController.createRequest,
);

requests.put(
  '/users/requests/:id',
  Authorization.verifyUser,
  ValidateRequest.modify,
  RequestsController.modifyRequest,
);

export default requests;
