import { nonStringFieldHandler, trimmer, getReqBody, invalidFieldHandler } from './createARequestValidator';
import { messageResponse } from '../helperFunctions/messageResponse';

/**
* It finds the fields that are not undefined or null
* @param {object} reqBody - object containing the relevant field values
* @returns {Array.<string>} - an array of filled fields as strings
*/
export const filledFieldsFinder = (reqBody) => {
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
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @param{object} next - middleware that calls the next middleware in the stack
* @returns {object} - response object that has a status code of 400 may returned if
* all the fields do not have the proper data type or string values
*/
const modifyARequestChecker = (request, response, next) => {
  const reqBody = getReqBody(request, ['title', 'description', 'type', 'location']);
  // check if the fields are filled
  let reply;
  const filledFieldsObj = filledFieldsFinder(reqBody);
  if (Object.keys(filledFieldsObj).length === 0) {
    return messageResponse(response, 200, {
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
  request.failReason = 'The request could not be created because';
  trimmer(filledFieldsObj, request);
  return next();
};
export default modifyARequestChecker;
