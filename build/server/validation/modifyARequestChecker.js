'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createARequestValidator = require('./createARequestValidator');

/**
* It finds the fields that are not undefined or null
* @param {object} reqBody - object containing the relevant field values
* @returns {Array.<string>} - an array of filled fields as strings
*/
var filledFieldsFinder = function filledFieldsFinder(reqBody) {
  var arrayOfFields = Object.keys(reqBody);
  var filledFieldsObj = arrayOfFields.filter(function (element) {
    return Object.prototype.toString.call(reqBody[element]) !== '[object Undefined]' && Object.prototype.toString.call(reqBody[element]) !== '[object Null]';
  }).reduce(function (accumulator, current) {
    accumulator[current] = reqBody[current];
    return accumulator;
  }, {});
  return filledFieldsObj;
};
/**
* It validates the fields and renders the appropriate response
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @param{object} next - middleware that calls the next middleware in the stack
* @returns {object} - response object that has a status code of 400 may returned if
* all the fields do not have the proper data type or string values
*/
var modifyARequestChecker = function modifyARequestChecker(request, response, next) {
  var reqBody = (0, _createARequestValidator.getReqBody)(request, ['title', 'description', 'type', 'location']);
  // check if the fields are filled
  var reply = void 0;
  var filledFieldsObj = filledFieldsFinder(reqBody);
  if (Object.keys(filledFieldsObj).length === 0) {
    return response.status(200).send({
      message: 'No update was made to the request'
    });
  }
  // check for strings
  reply = (0, _createARequestValidator.nonStringFieldHandler)(filledFieldsObj, response, 'The request could not be created because');
  if (reply) {
    return reply;
  }

  // check for valid types
  reply = (0, _createARequestValidator.invalidFieldHandler)(filledFieldsObj, response, 'The request could not be created because');
  if (reply) {
    return reply;
  }
  request.failReason = 'The request could not be created because';
  (0, _createARequestValidator.trimmer)(filledFieldsObj, request);
  next();
};
exports.default = modifyARequestChecker;