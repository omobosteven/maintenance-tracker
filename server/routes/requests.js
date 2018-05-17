import express from 'express';
import RequestsController from '../controllers/RequestsController';
import validation from '../validations/validateId';

const router = express.Router();

router.get('/requests', RequestsController.getRequests);
router.get('/requests/:id', validation.validateId, RequestsController.getRequest);

export default router;
