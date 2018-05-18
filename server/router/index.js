import express from 'express';
import RequestsController from '../controllers/Requests';

const router = express.Router();

router.get('/users/requests', RequestsController.getAllRequests);
router.get('/users/requests/:requestid', RequestsController.getARequest);
router.post('/users/requests/', RequestsController.createARequest);
export default router;
