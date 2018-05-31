'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createARequestValidator = require('./createARequestValidator');

var loginAUserChecker = function loginAUserChecker(request, response, next) {
  var reqBody = (0, _createARequestValidator.getReqBody)(request, ['email', 'password']);
  // check if the fields are filled
  var reply = void 0;
  reply = (0, _createARequestValidator.emptyFieldsHandler)(reqBody, response, 'Your log in attempt was unsuccessful because');
  if (reply) {
    return reply;
  }
  // check for strings
  reply = (0, _createARequestValidator.nonStringFieldHandler)(reqBody, response, 'Your log in attempt was unsuccessful because');
  if (reply) {
    return reply;
  }

  // check for valid types
  reply = (0, _createARequestValidator.invalidFieldHandler)(reqBody, response, 'Your log in attempt was unsuccessful because');
  if (reply) {
    return reply;
  }
  (0, _createARequestValidator.trimmer)(reqBody, request);
  next();
};
exports.default = loginAUserChecker;