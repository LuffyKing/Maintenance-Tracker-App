'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createARequestValidator = require('./createARequestValidator');

var reasonChecker = function reasonChecker(request, response, next) {
  var reqBody = (0, _createARequestValidator.getReqBody)(request, ['reason']);
  // check if the fields are filled
  var reply = void 0;
  reply = (0, _createARequestValidator.emptyFieldsHandler)(reqBody, response, 'Your  ' + request.attempt + ' was unsuccessful because');
  if (reply) {
    return reply;
  }
  // check for strings
  reply = (0, _createARequestValidator.nonStringFieldHandler)(reqBody, response, 'Your  ' + request.attempt + ' was unsuccessful because');
  if (reply) {
    return reply;
  }

  // check for valid types
  reply = (0, _createARequestValidator.invalidFieldHandler)(reqBody, response, 'Your  ' + request.attempt + ' was unsuccessful because');
  if (reply) {
    return reply;
  }
  (0, _createARequestValidator.trimmer)(reqBody, request);
  request.failReason = 'Your  ' + request.attempt + ' was unsuccessful because';
  next();
};
exports.default = reasonChecker;