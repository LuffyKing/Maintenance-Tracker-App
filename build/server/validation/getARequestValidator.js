'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getARequestChecker = exports.checkId = undefined;

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* It gets all the requests on the application
* @param {string} id - the string that represents the integer id
* @returns {boolean} - boolean which is true if the string id is an integer
*and vice-versa
*/
var checkId = function checkId(id) {
  return _validator2.default.isUUID(id, 4);
};

/**
* It gets all the requests on the application
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @param{object} next - middleware that calls the next middleware in the stack
* @returns {object} - response object that has a status code of 400 may returned if the
* requestid is in valid
*/
var getARequestChecker = function getARequestChecker(request, response, next) {
  if (checkId(request.params.requestid.trim()) && !/[^a-zA-Z0-9-]/.test(request.params.requestid)) {
    request.params.requestid = request.params.requestid.trim();
    next();
  } else {
    return response.status(400).send({ message: 'The id provided is invalid because it is not of the type UUID 4' });
  }
};
exports.checkId = checkId;
exports.getARequestChecker = getARequestChecker;