import express from 'express';
import swaggerUi from 'swagger-ui-express';

import Requests from '../controllers/Requests';
import Users from '../controllers/Users';

import ApproveStatusValidator from '../validation/ApproveStatusValidator';
import { createARequestValidator } from '../validation/createARequestValidator';
import changePasswordValidator from '../validation/changePasswordValidator';
import duplicateRequestValidator from '../validation/duplicateRequestValidator';
import editAUserValidator from '../validation/editAUserValidator';
import getARequestValidator from '../validation/getARequestValidator';
import { isAdmin, isUser } from '../validation/profileValidator';
import imageUrlValidator from '../validation/imageUrlValidator';
import statusQueryValidator from '../validation/statusQueryValidator';
import loginAUSerValidator from '../validation/loginAUSerValidator';
import modifyARequestChecker from '../validation/modifyARequestChecker';
import maxLengthValidator from '../validation/maxLengthValidator';
import { messageResponse } from '../helperFunctions/messageResponse';
import reasonValidator from '../validation/reasonValidator';
import RejectStatusValidator from '../validation/RejectStatusValidator';
import ResolveStatusValidator from '../validation/ResolveStatusValidator';
import resetPasswordValidator from '../validation/resetPasswordValidator';
import resetTokenValidator from '../validation/resetTokenValidator';
import signUpAUserValidator from '../validation/signUpAUserValidator';
import swaggerDocument from '../swagger/swaggerDocument';
import { verifyToken } from '../authMiddleware/jwt';

const router = express.Router();

router.get('/', (request, response) => messageResponse(response, 200, {
  message: 'Welcome to TrackerHero! Read the docs at /api-docs/ to get started'
}));

router.post(
  '/auth/signup',
  signUpAUserValidator,
  maxLengthValidator,
  Users.signUp
);

router.post(
  '/auth/login',
  loginAUSerValidator,
  maxLengthValidator,
  Users.login
);

router.post(
  '/auth/forgotPassword',
  resetPasswordValidator,
  Users.forgotPassword
);

router.post(
  '/auth/changePassword',
  changePasswordValidator,
  maxLengthValidator,
  resetTokenValidator,
  Users.changePassword
);

router.get(
  '/auth/users',
  verifyToken,
  Users.getAUser
);

router.get(
  '/users/requests',
  verifyToken,
  isUser,
  statusQueryValidator,
  Requests.getAllRequests
);

router.put(
  '/attachImage/:requestid',
  verifyToken,
  isUser,
  getARequestValidator,
  imageUrlValidator,
  Requests.insertImage
);

router.get(
  '/users/requests/:requestid',
  verifyToken,
  getARequestValidator,
  Requests.getARequest
);

router.delete(
  '/users/requests/:requestid',
  verifyToken,
  isUser,
  getARequestValidator,
  Requests.deleteARequest
);

router.post(
  '/users/requests/',
  verifyToken,
  isUser,
  createARequestValidator,
  maxLengthValidator,
  duplicateRequestValidator,
  Requests.createARequest
);

router.put(
  '/users/requests/:requestid',
  verifyToken,
  isUser,
  getARequestValidator,
  modifyARequestChecker,
  maxLengthValidator,
  Requests.updateARequest
);

router.get(
  '/requests',
  verifyToken,
  isAdmin,
  statusQueryValidator,
  Requests.getAllRequestsAdmin
);

router.put(
  '/requests/:requestid/approve',
  verifyToken,
  isAdmin,
  getARequestValidator,
  ApproveStatusValidator,
  reasonValidator,
  maxLengthValidator,
  Requests.updateARequestAdmin
);

router.put(
  '/requests/:requestid/disapprove',
  verifyToken,
  isAdmin,
  getARequestValidator,
  RejectStatusValidator,
  reasonValidator,
  maxLengthValidator,
  Requests.updateARequestAdmin
);

router.put(
  '/requests/:requestid/resolve',
  verifyToken,
  isAdmin,
  getARequestValidator,
  ResolveStatusValidator,
  reasonValidator,
  maxLengthValidator,
  Requests.updateARequestAdmin
);

router.put(
  '/users/edit/',
  verifyToken,
  editAUserValidator,
  maxLengthValidator,
  Users.editAUser
);

router.put(
  '/attachImageUser/',
  verifyToken,
  imageUrlValidator,
  Users.insertImage
);

router.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

export default router;
