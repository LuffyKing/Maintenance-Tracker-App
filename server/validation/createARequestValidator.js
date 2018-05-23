import validator from 'validator';
import { requests } from '../dummy-data/database';

const getReqBody = (req, listOfProps) => {
  const reqBody = listOfProps.reduce((accumulator, property) => {
    accumulator[property] = req.body[property];
    return accumulator;
  }, {});
  return reqBody;
};

const duplicateRequestHandler = (reqBody, res) => {
  const duplicateRequest = requests.find(request => request.title === reqBody.title &&
    reqBody.description === request.description &&
    reqBody.type === request.type &&
    reqBody.location === request.location);
  if (Object.prototype.toString.call(duplicateRequest) === '[object Object]') {
    return res.status(400).send({
      message: 'The request could not be created because a request with the same LOCATION, DESCRIPTION,TYPE AND TITLE already exists'
    });
  }
};
const trimmer = (reqBody, req) => {
  Object.keys(reqBody).forEach((key) => {
    if (key !== 'userid') {
      reqBody[key] = reqBody[key].trim();
    }
  });
  req.reqBody = reqBody;
};
/**
* It finds the fields that are undefined or null
* @param {Object} reqBody - object containing the relevant field values
* @returns {string[]} - an array of the undefined fields as strings
*/
const emptyFieldsFinder = (reqBody) => {
  const arrayOfFields = Object.keys(reqBody);
  const emptyFieldsArr = arrayOfFields.filter(element =>
    Object.prototype.toString.call(reqBody[element]) === '[object Undefined]'
    || Object.prototype.toString.call(reqBody[element]) === '[object Null]')
    .map(element => element.replace(/([A-Z])/g, ' $1').toUpperCase());
  return emptyFieldsArr;
};

/**
* It finds the fields that are supposed to have a string as a value but
* possesses any data type instead
* @param {Object} reqBody - object containing the relevant field values
* @returns {string[]} - an array of the invalid integer fields as strings
*/
const nonStringFieldFinder = (reqBody) => {
  const arrayOfFields = Object.keys(reqBody);
  const nonStringFieldsArr = arrayOfFields.filter(element => Object.prototype.toString.call(reqBody[element]) !== '[object String]' && element !== 'userid')
    .map(element => element.replace(/([A-Z])/g, ' $1').toUpperCase());
  return nonStringFieldsArr;
};

const specialValidation = {
  userid: useridValue => Object.prototype.toString.call(useridValue) === '[object Number]',
  type: (typeValue) => {
    const typeValueRegex = /^Maintenance$|^Repair$/i;
    return typeValueRegex.test(typeValue.trim());
  },
  email: validator.isEmail
};


const specialMessages = {
  userid: 'the userid value is not an integer',
  type: 'the type value is not Repair or Maintenance',
  email: 'the email value is not an email'
};
/**
* It finds the fields that are supposed to have a string as a value but
* possesses any data type instead
* @param {number} statusCode - status code
* @param {Object} res - response object that conveys the result of the request
* @param {string[]} invalidFieldsArray - an array of invalid fields
* @param {string} end - an array of invalid fields
*@returns {Object} - a 400 response object with a customized message attribute
*/
const message = (statusCode, res, invalidFieldsArray, end, failReason) => {
  const verb = invalidFieldsArray.length === 1 ? ['field', 'was'] : ['fields', 'were'];
  return res.status(statusCode).send({
    message: `${failReason} the ${verb[0]} ${invalidFieldsArray.join(' ,')} ${verb[1]} ${end}`
  });
};
/**
* It finds the fields that are supposed to have the wrong string value or in
* the case of the userid it checks for the type Number
* @param {Object} reqBody - object containing the relevant field values
* @returns {string[]} - an array of the invalid integer fields as strings
*/
const invalidFieldsChecker = reqBody => Object.keys(reqBody).filter((elm) => {
  if (`${elm}` in specialValidation) {
    return !specialValidation[elm](reqBody[elm]);
  }
  return !/[a-zA-Z]/i.test(reqBody[elm]);
}).map((key) => {
  if (`${key}` in specialMessages) {
    return specialMessages[key];
  }
  return `the ${key.toUpperCase()} field did not contain a single letter of the alphabet`;
});

const nonStringFieldHandler = (reqBody, res, failReason) => {
  const nonStringFieldFinderArr = nonStringFieldFinder(reqBody);
  if (nonStringFieldFinderArr.length > 0) {
    const word = nonStringFieldFinderArr.length === 1 ? 'a string' : 'strings';
    return message(400, res, nonStringFieldFinderArr, `supposed to be ${word}`, failReason);
  }
};
const invalidFieldHandler = (reqBody, res, failReason) => {
  const invalidFieldsArr = invalidFieldsChecker(reqBody);
  if (invalidFieldsArr.length > 0) {
    return res.status(400).json({
      message: `${failReason} ${invalidFieldsArr.join(' ,')}`
    });
  }
};
const emptyFieldsHandler = (reqBody, res, failReason) => {
  const emptyFieldsArr = emptyFieldsFinder(reqBody);
  if (emptyFieldsArr.length > 0) {
    return message(400, res, emptyFieldsArr, 'not provided', failReason);
  }
};
/**
* It validates the fields and renders the appropriate response
* @param {Object} req - request object containing params and body
* @param {Object} res - response object that conveys the result of the request
* @param{Object} next - middleware that calls the net middleware in the stack
* @returns {Object} - response object that has a status code of 400 may returned if
* all the fields do not have the proper data type or string values
*/
const createARequestChecker = (req, res, next) => {
  const reqBody = getReqBody(req, ['title', 'description', 'type', 'userid', 'title', 'location']);
  let reply;

  // check if the fields are empty
  reply = emptyFieldsHandler(reqBody, res, 'The request could not be created because');
  if (reply) {
    return reply;
  }
  // check for strings
  reply = nonStringFieldHandler(reqBody, res, 'The request could not be created because');
  if (reply) {
    return reply;
  }
  reply = invalidFieldHandler(reqBody, res, 'The request could not be created because');
  if (reply) {
    return reply;
  }
  trimmer(reqBody, req);
  reply = duplicateRequestHandler(reqBody, res);
  if (reply) {
    return reply;
  }
  next();
};
export {
  createARequestChecker,
  invalidFieldsChecker,
  message,
  specialMessages,
  emptyFieldsHandler,
  nonStringFieldFinder,
  getReqBody,
  nonStringFieldHandler,
  invalidFieldHandler,
  trimmer
};
