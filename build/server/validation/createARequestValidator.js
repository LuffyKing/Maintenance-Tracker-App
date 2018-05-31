'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invalidFieldMessage = exports.trimmer = exports.invalidFieldHandler = exports.nonStringFieldHandler = exports.getReqBody = exports.nonStringFieldFinder = exports.emptyFieldsHandler = exports.specialMessages = exports.message = exports.invalidFieldsChecker = exports.createARequestChecker = undefined;

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _db = require('../db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getReqBody = function getReqBody(request, listOfProps) {
  var reqBody = listOfProps.reduce(function (accumulator, property) {
    accumulator[property] = request.body[property];
    return accumulator;
  }, {});
  return reqBody;
};

var trimmer = function trimmer(reqBody, request) {
  Object.keys(reqBody).forEach(function (key) {
    if (key === 'type') {
      reqBody[key] = reqBody[key].toLowerCase().replace(/^\w/, function (firstLetter) {
        return firstLetter.toUpperCase();
      });
    }
    reqBody[key] = reqBody[key].trim();
  });
  request.reqBody = reqBody;
};
/**
* It finds the fields that are undefined or null
* @param {object} reqBody - object containing the relevant field values
* @returns {Array.<string>} - an array of the undefined fields as strings
*/
var emptyFieldsFinder = function emptyFieldsFinder(reqBody) {
  var arrayOfFields = Object.keys(reqBody);
  var emptyFieldsArr = arrayOfFields.filter(function (element) {
    return Object.prototype.toString.call(reqBody[element]) === '[object Undefined]' || Object.prototype.toString.call(reqBody[element]) === '[object Null]';
  }).map(function (element) {
    return element.replace(/([A-Z])/g, ' $1').toUpperCase();
  });
  return emptyFieldsArr;
};

/**
* It finds the fields that are supposed to have a string as a value but
* possesses any data type instead
* @param {object} reqBody - object containing the relevant field values
* @returns {Array.<string>} - an array of the invalid integer fields as strings
*/
var nonStringFieldFinder = function nonStringFieldFinder(reqBody) {
  var arrayOfFields = Object.keys(reqBody);
  var nonStringFieldsArr = arrayOfFields.filter(function (element) {
    return Object.prototype.toString.call(reqBody[element]) !== '[object String]';
  }).map(function (element) {
    return element.replace(/([A-Z])/g, ' $1').toUpperCase();
  });
  return nonStringFieldsArr;
};

var specialValidation = {
  userid: _validator2.default.isUUID,
  type: function type(typeValue) {
    var typeValueRegex = /^Maintenance$|^Repair$/i;
    return typeValueRegex.test(typeValue.trim());
  },
  email: _validator2.default.isEmail
};

var specialMessages = {
  userid: 'the userid value is not UUID',
  type: 'the type value is not Repair or Maintenance',
  email: 'the email value is not an email'
};
/**
* It finds the fields that are supposed to have a string as a value but
* possesses any data type instead
* @param {number} statusCode - status code
* @param {object} response - response object that conveys the result of the request
* @param {Array.<string>} invalidFieldsArray - an array of invalid fields
* @param {string} end - an array of invalid fields
* @param {string} failReason - Reason for error message
*@returns {object} - a 400 response object with a customized message attribute
*/
var message = function message(statusCode, response, invalidFieldsArray, end, failReason) {
  var verb = invalidFieldsArray.length === 1 ? ['field', 'was'] : ['fields', 'were'];
  return response.status(statusCode).send({
    message: failReason + ' the ' + verb[0] + ' ' + invalidFieldsArray.join(' ,') + ' ' + verb[1] + ' ' + end
  });
};
/**
* It finds the fields that have the wrong string value
* @param {object} reqBody - object containing the relevant field values
* @returns {Array.<string>} - an array of the invalid integer fields as strings
*/
var invalidFieldsChecker = function invalidFieldsChecker(reqBody) {
  return Object.keys(reqBody).filter(function (elm) {
    if ('' + elm in specialValidation) {
      return !specialValidation[elm](reqBody[elm]);
    }
    return !/[a-zA-Z]/i.test(reqBody[elm]);
  }).map(function (key) {
    if ('' + key in specialMessages) {
      return specialMessages[key];
    }
    return 'the ' + key.toUpperCase() + ' field did not contain a single letter of the alphabet';
  });
};

var nonStringFieldHandler = function nonStringFieldHandler(reqBody, response, failReason) {
  var nonStringFieldFinderArr = nonStringFieldFinder(reqBody);
  if (nonStringFieldFinderArr.length > 0) {
    var word = nonStringFieldFinderArr.length === 1 ? 'a string' : 'strings';
    return message(400, response, nonStringFieldFinderArr, 'supposed to be ' + word, failReason);
  }
};
var invalidFieldMessage = function invalidFieldMessage(invalidFieldsArr, response, failReason) {
  if (invalidFieldsArr.length > 0) {
    return response.status(400).json({
      message: failReason + ' ' + invalidFieldsArr.join(' ,')
    });
  }
};
var invalidFieldHandler = function invalidFieldHandler(reqBody, response, failReason) {
  var invalidFieldsArr = invalidFieldsChecker(reqBody);
  return invalidFieldMessage(invalidFieldsArr, response, failReason);
};
var emptyFieldsHandler = function emptyFieldsHandler(reqBody, response, failReason) {
  var emptyFieldsArr = emptyFieldsFinder(reqBody);
  if (emptyFieldsArr.length > 0) {
    return message(400, response, emptyFieldsArr, 'not provided', failReason);
  }
};
/**
* It validates the fields and renders the appropriate response
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @param {object} next - middleware that calls the next middleware in the stack
* @returns {object} - response object that has a status code of 400 may returned if
* all the fields do not have the proper data type or string values
*/
var createARequestChecker = function createARequestChecker(request, response, next) {
  var reqBody = getReqBody(request, ['title', 'description', 'type', 'location']);
  var reply = emptyFieldsHandler(reqBody, response, 'The request could not be created because');
  if (reply) {
    return reply;
  }
  reply = nonStringFieldHandler(reqBody, response, 'The request could not be created because');
  if (reply) {
    return reply;
  }
  reply = invalidFieldHandler(reqBody, response, 'The request could not be created because');
  if (reply) {
    return reply;
  }
  trimmer(reqBody, request);
  _db.pool.connect(function (error, client, done) {
    if (error) {
      response.status(500).send({ message: error.stack });
    }
    client.query('SELECT * FROM REQUESTS where LOCATION = \'' + reqBody.location + '\' and DESCRIPTION = \'' + reqBody.description + '\' and TYPE = \'' + reqBody.type + '\' and TITLE = \'' + reqBody.title + '\';', function (error1, requestRow) {
      done();
      if (error1) {
        return response.status(500).send({ message: error1.stack });
      } else if (requestRow.rows.length === 0) {
        request.failReason = 'The request could not be created because';
        next();
      } else {
        return response.status(400).send({
          message: 'The request could not be created because a request with the same LOCATION, DESCRIPTION,TYPE AND TITLE already exists'
        });
      }
    });
  });
};
exports.createARequestChecker = createARequestChecker;
exports.invalidFieldsChecker = invalidFieldsChecker;
exports.message = message;
exports.specialMessages = specialMessages;
exports.emptyFieldsHandler = emptyFieldsHandler;
exports.nonStringFieldFinder = nonStringFieldFinder;
exports.getReqBody = getReqBody;
exports.nonStringFieldHandler = nonStringFieldHandler;
exports.invalidFieldHandler = invalidFieldHandler;
exports.trimmer = trimmer;
exports.invalidFieldMessage = invalidFieldMessage;