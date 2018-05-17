import express from 'express';
import RequestsController from '../controllers/RequestsController';

const router = express.Router();

router.get('/requests', RequestsController.getRequests);

export default router;
