import express from 'express';
import users from './users';
import requests from './requests';

const router = express.Router();

router.use('/api/v1', users);
router.use('/api/v1', requests);
router.use('/*', (request, response) => response.status(404).send({
  status: 'fail',
  message: 'Does not exist',
}));

export default router;
