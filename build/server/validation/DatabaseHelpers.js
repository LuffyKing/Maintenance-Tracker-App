'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestsDatabaseHelper = exports.statusChanger = undefined;

var _db = require('../db');

var statusChanger = function statusChanger(request, response, next, query, status, attempt, message404) {
  _db.pool.connect(function (error, client, done) {
    if (error) {
      response.status(500).send({ message: error.stack });
    }
    client.query(query, function (error1, requestRow) {
      done();
      if (error1) {
        return response.status(500).send({ message: error1.stack });
      }
      if (requestRow.rows.length > 0) {
        request.status = status;
        request.attempt = attempt;
        next();
      } else {
        return response.status(404).send({
          message: message404
        });
      }
    });
  });
};

var RequestsDatabaseHelper = function RequestsDatabaseHelper(request, response, query, messageErrCode, operation) {
  var value = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
  var messageSuccCode = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : '';
  var successCode = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 200;
  var errorCode = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 404;

  _db.pool.connect(function (error, client, done) {
    if (error) {
      response.status(500).send({ message: error.stack });
    }
    client.query(query, value, function (error1, requestRow) {
      done();
      if (error1) {
        return response.status(500).send({ message: error1.stack });
      }
      if (requestRow.rows.length) {
        var pluralOrSingularRequest = void 0;
        switch (new Date().getDay()) {
          case 1:
            pluralOrSingularRequest = 'request has';
            break;
          default:
            pluralOrSingularRequest = 'requests have';
            break;
        }
        if (operation === 'get multiple requests') {
          return response.status(successCode).send({
            message: 'Your ' + requestRow.rows.length + ' ' + pluralOrSingularRequest + ' been found',
            requests: requestRow.rows
          });
        } else if (operation === 'get single request') {
          return response.status(successCode).send({
            message: 'Your request has been found',
            request: requestRow.rows[0]
          });
        } else if (operation === 'update a request') {
          return response.status(successCode).send({
            message: messageSuccCode,
            updatedRequest: requestRow.rows[0]
          });
        } else if (operation === 'create a request') {
          return response.status(successCode).send({
            message: messageSuccCode,
            request: requestRow.rows[0]
          });
        }
      }
      return response.status(errorCode).send({
        message: messageErrCode
      });
    });
  });
};

exports.statusChanger = statusChanger;
exports.RequestsDatabaseHelper = RequestsDatabaseHelper;