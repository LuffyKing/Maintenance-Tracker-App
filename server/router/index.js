import express from 'express';
import RequestsController from '../controllers/Requests';
import { getARequestChecker } from '../validation/getARequestValidator';

const router = express.Router();

router.get('/users/requests', RequestsController.getAllRequests);
router.get('/users/requests/:requestid', getARequestChecker, RequestsController.getARequest);
router.post('/users/requests/', RequestsController.createARequest);
router.put('/users/requests/:requestid', getARequestChecker, RequestsController.updateARequest);
export default router;
