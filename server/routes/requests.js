import express from 'express';
import RequestsController from '../controllers/RequestsController';
import ValidateRequest from '../validations/ValidateRequest';
import Authorization from '../middlewares/Authorization';
import Validation from '../validations/Validation';

const requests = express.Router();

requests.get('/users/requests', RequestsController.getRequests);

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
