'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jwt = require('../authMiddleware/jwt');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UIRouter = _express2.default.Router();

UIRouter.get('/', function (req, res) {
  res.sendFile(_path2.default.resolve(__dirname, '../../../client/UI/html/SigninPage.html'));
});

UIRouter.get('/SigninPage.html', function (req, res) {
  res.sendFile(_path2.default.resolve(__dirname, '../../../client/UI/html/SigninPage.html'));
});

UIRouter.get('/UserViewRequests.html', function (req, res) {
  res.sendFile(_path2.default.resolve(__dirname, '../../../client/UI/html/UserViewRequests.html'));
});

UIRouter.get('/SignupPage.html', function (req, res) {
  res.sendFile(_path2.default.resolve(__dirname, '../../../client/UI/html/SigninPage.html'));
});

UIRouter.post('/verify', _jwt.verifyTokenUI);

exports.default = UIRouter;