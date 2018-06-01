import express from 'express';
import AdminRequestsController from '../controllers/AdminRequestsController';
import Authorization from '../middlewares/Authorization';
import AdminUpdateRequest from '../middlewares/AdminUpdateRequest';
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
  '/requests',
  Authorization.verifyUser,
  Authorization.verifyAdmin,
  AdminRequestsController.getAllRequests,
);

requests.get(
  '/requests/:id',
  Authorization.verifyUser,
  Authorization.verifyAdmin,
  Validation.validateId,
  AdminRequestsController.getRequest,
);

requests.get(
  '/users/requests/:id',
  Authorization.verifyUser,
  Validation.validateId,
  RequestsController.getRequest,
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
  Validation.validateId,
  ValidateRequest.modify,
  RequestsController.modifyRequest,
);

requests.put(
  '/requests/:id/approve',
  Authorization.verifyUser,
  Authorization.verifyAdmin,
  Validation.validateId,
  AdminUpdateRequest.fetchRequest,
  AdminRequestsController.approveRequest,
);

requests.put(
  '/requests/:id/disapprove',
  Authorization.verifyUser,
  Authorization.verifyAdmin,
  Validation.validateId,
  AdminUpdateRequest.fetchRequest,
  AdminRequestsController.disapproveRequest,
);

requests.put(
  '/requests/:id/resolve',
  Authorization.verifyUser,
  Authorization.verifyAdmin,
  Validation.validateId,
  AdminUpdateRequest.fetchRequest,
  AdminRequestsController.reolveRequest,
);

export default requests;
