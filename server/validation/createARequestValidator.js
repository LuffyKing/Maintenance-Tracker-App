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
* It finds the fields that are not supposed to have an integer as a value
* @param {Object} reqBody - object containing the relevant field values
* @returns {string[]} - an array of the invalid integer fields as strings
*/
const intFieldFinder = (reqBody) => {
  const arrayOfFields = Object.keys(reqBody);
  const intFieldsArr = arrayOfFields.filter(element =>
    Object.prototype.toString.call(reqBody[element]) === '[object Number]' && element !== 'userid')
    .map(element => element.replace(/([A-Z])/g, ' $1').toUpperCase());
  return intFieldsArr;
};
/**
* It finds the fields that are supposed to have a string as a value but
* possesses any data type instead
* @param {Object} reqBody - object containing the relevant field values
* @returns {string[]} - an array of the invalid integer fields as strings
*/
const nonStringFieldFinder = (reqBody) => {
  const arrayOfFields = Object.keys(reqBody);
  const emptyFieldsArr = arrayOfFields.filter(element => Object.prototype.toString.call(reqBody[element]) !== '[object String]' && element !== 'userid')
    .map(element => element.replace(/([A-Z])/g, ' $1').toUpperCase());
  return emptyFieldsArr;
};

const specialValidation = {
  userid: useridValue => Object.prototype.toString.call(useridValue) === '[object Number]',
  type: (typeValue) => {
    const typeValueRegex = /^Maintenance$|^Repair$/i;
    return typeValueRegex.test(typeValue.trim());
  }
};


const specialMessages = {
  userid: 'the userid value is not an integer',
  type: 'the type value is not Repair or Maintenance'
};
/**
* It finds the fields that are supposed to have a string as a value but
* possesses any data type instead
* @param {Object} res - response object that conveys the result of the request
* @param {string[]} invalidFieldsArray - an array of invalid fields
* @param {string} end - an array of invalid fields
*@returns {Object} - a 400 response object with a customized message attribute
*/
const message = (res, invalidFieldsArray, end) => {
  const verb = invalidFieldsArray.length === 1 ? ['field', 'was'] : ['fields', 'were'];
  return res.status(400).send({
    message: `The request could not be created because the ${verb[0]} ${invalidFieldsArray.join(' ,')} ${verb[1]} ${end}`
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
/**
* It validates the fields and renders the appropriate response
* @param {Object} req - request object containing params and body
* @param {Object} res - response object that conveys the result of the request
* @param{Object} next - middleware that calls the net middleware in the stack
* @returns {Object} - response object that has a status code of 400 may returned if
* all the fields do not have the proper data type or string values
*/
const createARequestChecker = (req, res, next) => {
  const {
    description,
    type,
    userid,
    title,
    location
  } = req.body;

  const reqBody = {
    description,
    type,
    userid,
    title,
    location
  };
  // check for integers
  const invalidIntArr = intFieldFinder(reqBody);
  if (invalidIntArr.length > 0) {
    const word = invalidIntArr.length === 1 ? 'an integer' : 'integers';
    return message(res, invalidIntArr, `not supposed to be ${word}`);
  }
  // check if the fields are empty
  const emptyFieldsArr = emptyFieldsFinder(reqBody);
  if (emptyFieldsArr.length > 0) {
    return message(res, emptyFieldsArr, 'not provided');
  }
  // check for strings
  const nonStringFieldFinderArr = nonStringFieldFinder(reqBody);
  if (nonStringFieldFinderArr.length > 0) {
    const word = nonStringFieldFinderArr.length === 1 ? 'a string' : 'strings';
    return message(res, nonStringFieldFinderArr, `supposed to be ${word}`);
  }

  // check for valid types
  const invalidFieldsArr = invalidFieldsChecker(reqBody);
  if (invalidFieldsArr.length > 0) {
    return res.status(400).send({
      message: `The request could not be created because ${invalidFieldsArr.join(' ,')}`
    });
  }
  next();
};
export {
  createARequestChecker,
  invalidFieldsChecker,
  message,
  specialMessages,
  intFieldFinder,
  emptyFieldsFinder
};
