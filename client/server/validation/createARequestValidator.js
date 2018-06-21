import validator from 'validator';


const getReqBody = (request, listOfProps) => {
  const reqBody = listOfProps.reduce((accumulator, property) => {
    accumulator[property] = request.body[property];
    return accumulator;
  }, {});
  return reqBody;
};

const trimmer = (reqBody, request) => {
  Object.keys(reqBody).forEach((key) => {
    if (key === 'type') {
      reqBody[key] = reqBody[key].toLowerCase().replace(/^\w/, firstLetter => firstLetter.toUpperCase());
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
* @param {object} reqBody - object containing the relevant field values
* @returns {Array.<string>} - an array of the invalid integer fields as strings
*/
const nonStringFieldFinder = (reqBody) => {
  const arrayOfFields = Object.keys(reqBody);
  const nonStringFieldsArr = arrayOfFields.filter(element => Object.prototype.toString.call(reqBody[element]) !== '[object String]')
    .map(element => element.replace(/([A-Z])/g, ' $1').toUpperCase());
  return nonStringFieldsArr;
};

const specialValidation = {
  userid: validator.isUUID,
  type: (typeValue) => {
    const typeValueRegex = /^Maintenance$|^Repair$/i;
    return typeValueRegex.test(typeValue.trim());
  },
  profile: (profileValue) => {
    const profileValueRegex = /^User$|^Admin$/;
    return profileValueRegex.test(profileValue.trim());
  },
  email: validator.isEmail
};


const specialMessages = {
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
const message = (statusCode, response, invalidFieldsArray, end, failReason) => {
  const verb = invalidFieldsArray.length === 1 ? ['field', 'was'] : ['fields', 'were'];
  return response.status(statusCode).send({
    message: `${failReason} the ${verb[0]} ${invalidFieldsArray.join(' ,')} ${verb[1]} ${end}`
  });
};
/**
* It finds the fields that have the wrong string value
* @param {object} reqBody - object containing the relevant field values
* @returns {Array.<string>} - an array of the invalid integer fields as strings
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

const nonStringFieldHandler = (reqBody, response, failReason) => {
  const nonStringFieldFinderArr = nonStringFieldFinder(reqBody);
  if (nonStringFieldFinderArr.length > 0) {
    const word = nonStringFieldFinderArr.length === 1 ? 'a string' : 'strings';
    return message(400, response, nonStringFieldFinderArr, `supposed to be ${word}`, failReason);
  }
};
const invalidFieldMessage = (invalidFieldsArr, response, failReason) => {
  if (invalidFieldsArr.length > 0) {
    return response.status(422).json({
      message: `${failReason} ${invalidFieldsArr.join(' ,')}`
    });
  }
};
const invalidFieldHandler = (reqBody, response, failReason) => {
  const invalidFieldsArr = invalidFieldsChecker(reqBody);
  return invalidFieldMessage(invalidFieldsArr, response, failReason);
};
const emptyFieldsHandler = (reqBody, response, failReason) => {
  const emptyFieldsArr = emptyFieldsFinder(reqBody);
  if (emptyFieldsArr.length > 0) {
    return message(400, response, emptyFieldsArr, 'not provided', failReason);
  }
};
/**
* It validates the create a request fields and renders the appropriate response
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @param {object} next - middleware that calls the next middleware in the stack
* @returns {object} - response object that has a status code of 400 may returned if
* all the fields do not have the proper data type or string values
*/
const createARequestChecker = (request, response, next) => {
  const reqBody = getReqBody(request, ['title', 'description', 'type', 'location']);
  let reply = emptyFieldsHandler(reqBody, response, 'The request could not be created because');
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
  trimmer,
  invalidFieldMessage
};
