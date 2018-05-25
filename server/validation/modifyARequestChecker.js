import { nonStringFieldHandler, trimmer, getReqBody, invalidFieldHandler } from './createARequestValidator';

/**
* It finds the fields that are not undefined or null
* @param {Object} reqBody - object containing the relevant field values
* @returns {string[]} - an array of filled fields as strings
*/
const filledFieldsFinder = (reqBody) => {
  const arrayOfFields = Object.keys(reqBody);
  const filledFieldsObj = arrayOfFields.filter(element =>
    Object.prototype.toString.call(reqBody[element]) !== '[object Undefined]'
    && Object.prototype.toString.call(reqBody[element]) !== '[object Null]')
    .reduce(
      (accumulator, current) => {
        accumulator[current] = reqBody[current];
        return accumulator;
      }
      , {}
    );
  return filledFieldsObj;
};
/**
* It validates the fields and renders the appropriate response
* @param {Object} request - request object containing params and body
* @param {Object} response - response object that conveys the result of the request
* @param{Object} next - middleware that calls the net middleware in the stack
* @returns {Object} - response object that has a status code of 400 may returned if
* all the fields do not have the proper data type or string values
*/
const modifyARequestChecker = (request, response, next) => {
  const reqBody = getReqBody(request, ['title', 'description', 'type', 'location']);
  // check if the fields are filled
  let reply;
  const filledFieldsObj = filledFieldsFinder(reqBody);
  if (Object.keys(filledFieldsObj).length === 0) {
    return response.status(200).send({
      message: 'No update was made to the request'
    });
  }
  // check for strings
  reply = nonStringFieldHandler(filledFieldsObj, response, 'The request could not be created because');
  if (reply) {
    return reply;
  }

  // check for valid types
  reply = invalidFieldHandler(filledFieldsObj, response, 'The request could not be created because');
  if (reply) {
    return reply;
  }
  trimmer(filledFieldsObj, request);
  next();
};
export default modifyARequestChecker;
