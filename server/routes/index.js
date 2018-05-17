import express from 'express';
import requests from './requests';

const router = express.Router();

router.use('/api/v1', requests);
router.use('/*', (req, res) => res.status(404).send({
  message: 'Does not exist',
}));

export default router;
