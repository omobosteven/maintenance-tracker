import express from 'express';
import RequestsController from '../controllers/RequestsController';
import ValidateRequest from '../validations/ValidateRequest';
import Validation from '../validations/Validation';

const router = express.Router();

router.get('/users/requests', RequestsController.getRequests);
router.get(
  '/users/requests/:id',
  Validation.validateId, RequestsController.getRequest,
);
router.post(
  '/users/requests',
  ValidateRequest.create, RequestsController.createRequest,
);
router.put(
  '/users/requests/:id',
  ValidateRequest.modify, RequestsController.modifyRequest,
);

export default router;
