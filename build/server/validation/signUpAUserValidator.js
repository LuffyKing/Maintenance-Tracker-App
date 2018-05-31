'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createARequestValidator = require('./createARequestValidator');

var _db = require('../db');

var signUpAUserChecker = function signUpAUserChecker(request, response, next) {
  var reqBody = (0, _createARequestValidator.getReqBody)(request, ['firstName', 'lastName', 'email', 'password', 'jobTitle', 'department', 'location']);
  var reply = (0, _createARequestValidator.emptyFieldsHandler)(reqBody, response, 'Your sign up attempt was unsuccessful because');
  if (reply) {
    return reply;
  }
  reply = (0, _createARequestValidator.nonStringFieldHandler)(reqBody, response, 'Your sign up attempt was unsuccessful because');
  if (reply) {
    return reply;
  }
  reply = (0, _createARequestValidator.invalidFieldHandler)(reqBody, response, 'Your sign up attempt was unsuccessful because');
  if (reply) {
    return reply;
  }
  _db.pool.connect().then(function (client) {
    return client.query('SELECT * FROM USERS WHERE EMAIL = $1 LIMIT 1;', [reqBody.email]).then(function (result) {
      client.release();
      if (result.rows.length > 0) {
        throw new Error('Your sign up attempt was unsuccessful because the EMAIL you provided already exists!');
      }
      (0, _createARequestValidator.trimmer)(reqBody, request);
      request.failReason = 'Your sign up attempt was unsuccessful because';
      next();
    }).catch(function (error) {
      return response.status(400).send({ message: error.message });
    }).catch(function (error) {
      return response.status(500).send({ error: error });
    });
  });
};
exports.default = signUpAUserChecker;