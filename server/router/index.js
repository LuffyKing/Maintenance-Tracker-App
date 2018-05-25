import express from 'express';
import RequestsController from '../controllers/Requests';
import UsersController from '../controllers/Users';
import loginAUserChecker from '../validation/loginAUSerValidator';
import { getARequestChecker } from '../validation/getARequestValidator';
import { createARequestChecker } from '../validation/createARequestValidator';
import signUpAUserChecker from '../validation/signUpAUserValidator';
import modifyARequestChecker from '../validation/modifyARequestChecker';
import verifyToken from '../authMiddleware/jwt';

const router = express.Router();

router.post('/auth/signup', signUpAUserChecker, UsersController.signUp);
router.post('/auth/login', loginAUserChecker, UsersController.login);
router.get('/users/requests', verifyToken, RequestsController.getAllRequests);
router.get('/users/requests/:requestid', verifyToken, getARequestChecker, RequestsController.getARequest);
router.post('/users/requests/', verifyToken, createARequestChecker, RequestsController.createARequest);
router.put('/users/requests/:requestid', verifyToken, getARequestChecker, modifyARequestChecker, RequestsController.updateARequest);
export default router;
