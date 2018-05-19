import express from 'express';
import RequestsController from '../controllers/Requests';
import { getARequestChecker } from '../validation/getARequestValidator';
import { createARequestChecker } from '../validation/createARequestValidator';
import modifyARequestChecker from '../validation/modifyARequestChecker';

const router = express.Router();

router.get('/users/requests', RequestsController.getAllRequests);
router.get('/users/requests/:requestid', getARequestChecker, RequestsController.getARequest);
router.post('/users/requests/', createARequestChecker, RequestsController.createARequest);
router.put('/users/requests/:requestid', getARequestChecker, modifyARequestChecker, RequestsController.updateARequest);
export default router;
