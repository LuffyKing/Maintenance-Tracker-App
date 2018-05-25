import express from 'express';
import RequestsController from '../controllers/Requests';
import UsersController from '../controllers/Users';
import loginAUserChecker from '../validation/loginAUSerValidator';
import { getARequestChecker } from '../validation/getARequestValidator';
import { createARequestChecker } from '../validation/createARequestValidator';
import signUpAUserChecker from '../validation/signUpAUserValidator';
import modifyARequestChecker from '../validation/modifyARequestChecker';
import verifyToken from '../authMiddleware/jwt';
import { isAdmin, isUser } from '../validation/profileValidator';
import { approved, rejected, resolved } from '../validation/statusValidator';
import reasonChecker from '../validation/reasonValidator';

const router = express.Router();

router.post('/auth/signup', signUpAUserChecker, UsersController.signUp);
router.post('/auth/login', loginAUserChecker, UsersController.login);
router.get('/users/requests', verifyToken, isUser, RequestsController.getAllRequests);
router.get('/users/requests/:requestid', verifyToken, isUser, getARequestChecker, RequestsController.getARequest);
router.post('/users/requests/', verifyToken, isUser, createARequestChecker, RequestsController.createARequest);
router.put('/users/requests/:requestid', verifyToken, isUser, getARequestChecker, modifyARequestChecker, RequestsController.updateARequest);
router.get('/requests/', verifyToken, isAdmin, RequestsController.getAllRequestsAdmin);
router.put('/requests/:requestid/approve', verifyToken, isAdmin, getARequestChecker, approved, reasonChecker, RequestsController.updateARequestAdmin);
export default router;
