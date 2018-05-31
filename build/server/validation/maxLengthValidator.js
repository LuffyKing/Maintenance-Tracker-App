'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createARequestValidator = require('./createARequestValidator');

var maxFieldsChecker = function maxFieldsChecker(reqBody, maxLengthObj) {
  return Object.keys(reqBody).filter(function (elm) {
    return elm.length > maxLengthObj[elm];
  }).map(function (key) {
    return 'the input supplied for ' + key.toUpperCase() + ' field is too large the maximum allowed input is ' + maxLengthObj[key];
  });
};

var maxFieldHandler = function maxFieldHandler(reqBody, response, failReason, maxLengthObj) {
  var invalidFieldsArr = maxFieldsChecker(reqBody, maxLengthObj);
  return (0, _createARequestValidator.invalidFieldMessage)(invalidFieldsArr, response, failReason);
};

var maxLengthChecker = function maxLengthChecker(request, response, next) {
  var maxLengthObj = {
    firstName: 25,
    lastName: 25,
    email: 50,
    password: 90,
    jobTitle: 30,
    department: 30,
    title: 50,
    description: 288,
    location: 160,
    reason: 288
  };
  var reqBody = request.reqBody;
  // check if the fields are filled

  var reply = maxFieldHandler(reqBody, response, request.failReason, maxLengthObj);
  if (reply) {
    return reply;
  }
  next();
};
exports.default = maxLengthChecker;