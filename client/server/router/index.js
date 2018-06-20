import express from 'express';
import swaggerUi from 'swagger-ui-express';
import approved from '../validation/ApproveStatusValidator';
import { createARequestChecker } from '../validation/createARequestValidator';
import changePasswordChecker from '../validation/changePasswordValidator';
import { duplicateRequest } from '../validation/duplicateRequestValidator';
import { getARequestChecker } from '../validation/getARequestValidator';
import { isAdmin, isUser } from '../validation/profileValidator';
import { imageUrlChecker } from '../validation/imageUrlValidator';
import isValidStatusQuery from '../validation/statusQueryValidator';
import loginAUserChecker from '../validation/loginAUSerValidator';
import modifyARequestChecker from '../validation/modifyARequestChecker';
import maxLengthChecker from '../validation/maxLengthValidator';
import reasonChecker from '../validation/reasonValidator';
import rejected from '../validation/RejectStatusValidator';
import resolved from '../validation/ResolveStatusValidator';
import resetPasswordChecker from '../validation/resetPasswordValidator';
import resetTokenChecker from '../validation/resetTokenValidator';
import RequestsController from '../controllers/Requests';
import signUpAUserChecker from '../validation/signUpAUserValidator';
import swaggerDocument from '../swagger/swaggerDocument';
import UsersController from '../controllers/Users';
import verifyToken from '../authMiddleware/jwt';

const router = express.Router();
router.get('/', (request, response) => {
  response.status(200).send({
    message: 'Welcome to TrackerHero! Read the docs at /api-docs/ to get started'
  });
});
router.post('/auth/signup', signUpAUserChecker, maxLengthChecker, UsersController.signUp);
router.post('/auth/login', loginAUserChecker, maxLengthChecker, UsersController.login);
router.post('/auth/forgotPassword', resetPasswordChecker, UsersController.forgotPassword);
router.post('/auth/changePassword', changePasswordChecker, maxLengthChecker, resetTokenChecker, UsersController.changePassword);
router.get('/auth/users', verifyToken, UsersController.getAUser);
router.get('/users/requests', verifyToken, isUser, isValidStatusQuery, RequestsController.getAllRequests);
router.put('/attachImage/:requestid', verifyToken, isUser, getARequestChecker, imageUrlChecker, RequestsController.insertImage);
router.get('/users/requests/:requestid', verifyToken, getARequestChecker, RequestsController.getARequest);
router.delete('/users/requests/:requestid', verifyToken, isUser, getARequestChecker, RequestsController.deleteARequest);
router.post('/users/requests/', verifyToken, isUser, createARequestChecker, maxLengthChecker, duplicateRequest, RequestsController.createARequest);
router.put('/users/requests/:requestid', verifyToken, isUser, getARequestChecker, modifyARequestChecker, maxLengthChecker, RequestsController.updateARequest);
router.get('/requests', verifyToken, isAdmin, isValidStatusQuery, RequestsController.getAllRequestsAdmin);
router.put('/requests/:requestid/approve', verifyToken, isAdmin, getARequestChecker, approved, reasonChecker, maxLengthChecker, RequestsController.updateARequestAdmin);
router.put('/requests/:requestid/disapprove', verifyToken, isAdmin, getARequestChecker, rejected, reasonChecker, maxLengthChecker, RequestsController.updateARequestAdmin);
router.put('/requests/:requestid/resolve', verifyToken, isAdmin, getARequestChecker, resolved, reasonChecker, maxLengthChecker, RequestsController.updateARequestAdmin);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
