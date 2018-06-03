import express from 'express';
import users from './users';
import requests from './requests';

const router = express.Router();

router.use('/api/v1', users);
router.use('/api/v1', requests);
router.use('/*', (request, response) => response.status(400).send({
  status: 'fail',
  message: 'The API endpoint does not exist',
}));

export default router;
