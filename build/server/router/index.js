'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _swaggerUiExpress = require('swagger-ui-express');

var _swaggerUiExpress2 = _interopRequireDefault(_swaggerUiExpress);

var _ApproveStatusValidator = require('../validation/ApproveStatusValidator');

var _ApproveStatusValidator2 = _interopRequireDefault(_ApproveStatusValidator);

var _createARequestValidator = require('../validation/createARequestValidator');

var _getARequestValidator = require('../validation/getARequestValidator');

var _profileValidator = require('../validation/profileValidator');

var _loginAUSerValidator = require('../validation/loginAUSerValidator');

var _loginAUSerValidator2 = _interopRequireDefault(_loginAUSerValidator);

var _modifyARequestChecker = require('../validation/modifyARequestChecker');

var _modifyARequestChecker2 = _interopRequireDefault(_modifyARequestChecker);

var _maxLengthValidator = require('../validation/maxLengthValidator');

var _maxLengthValidator2 = _interopRequireDefault(_maxLengthValidator);

var _reasonValidator = require('../validation/reasonValidator');

var _reasonValidator2 = _interopRequireDefault(_reasonValidator);

var _RejectStatusValidator = require('../validation/RejectStatusValidator');

var _RejectStatusValidator2 = _interopRequireDefault(_RejectStatusValidator);

var _ResolveStatusValidator = require('../validation/ResolveStatusValidator');

var _ResolveStatusValidator2 = _interopRequireDefault(_ResolveStatusValidator);

var _Requests = require('../controllers/Requests');

var _Requests2 = _interopRequireDefault(_Requests);

var _signUpAUserValidator = require('../validation/signUpAUserValidator');

var _signUpAUserValidator2 = _interopRequireDefault(_signUpAUserValidator);

var _swaggerDocument = require('../swagger/swaggerDocument');

var _swaggerDocument2 = _interopRequireDefault(_swaggerDocument);

var _Users = require('../controllers/Users');

var _Users2 = _interopRequireDefault(_Users);

var _jwt = require('../authMiddleware/jwt');

var _jwt2 = _interopRequireDefault(_jwt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/auth/signup', _signUpAUserValidator2.default, _maxLengthValidator2.default, _Users2.default.signUp);
router.post('/auth/login', _loginAUSerValidator2.default, _Users2.default.login);
router.get('/users/requests', _jwt2.default, _profileValidator.isUser, _Requests2.default.getAllRequests);
router.get('/users/requests/:requestid', _jwt2.default, _profileValidator.isUser, _getARequestValidator.getARequestChecker, _Requests2.default.getARequest);
router.post('/users/requests/', _jwt2.default, _profileValidator.isUser, _createARequestValidator.createARequestChecker, _maxLengthValidator2.default, _Requests2.default.createARequest);
router.put('/users/requests/:requestid', _jwt2.default, _profileValidator.isUser, _getARequestValidator.getARequestChecker, _modifyARequestChecker2.default, _maxLengthValidator2.default, _Requests2.default.updateARequest);
router.get('/requests/', _jwt2.default, _profileValidator.isAdmin, _Requests2.default.getAllRequestsAdmin);
router.put('/requests/:requestid/approve', _jwt2.default, _profileValidator.isAdmin, _getARequestValidator.getARequestChecker, _ApproveStatusValidator2.default, _reasonValidator2.default, _maxLengthValidator2.default, _Requests2.default.updateARequestAdmin);
router.put('/requests/:requestid/disapprove', _jwt2.default, _profileValidator.isAdmin, _getARequestValidator.getARequestChecker, _RejectStatusValidator2.default, _reasonValidator2.default, _maxLengthValidator2.default, _Requests2.default.updateARequestAdmin);
router.put('/requests/:requestid/resolve', _jwt2.default, _profileValidator.isAdmin, _getARequestValidator.getARequestChecker, _ResolveStatusValidator2.default, _reasonValidator2.default, _maxLengthValidator2.default, _Requests2.default.updateARequestAdmin);
router.use('/api-docs', _swaggerUiExpress2.default.serve, _swaggerUiExpress2.default.setup(_swaggerDocument2.default));

exports.default = router;