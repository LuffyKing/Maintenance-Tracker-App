import { nonStringFieldHandler, getReqBody, invalidFieldHandler } from './createARequestValidator';

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
* @param {Object} req - request object containing params and body
* @param {Object} res - response object that conveys the result of the request
* @param{Object} next - middleware that calls the net middleware in the stack
* @returns {Object} - response object that has a status code of 400 may returned if
* all the fields do not have the proper data type or string values
*/
const modifyARequestChecker = (req, res, next) => {
  const reqBody = getReqBody(req);
  // check if the fields are filled
  const filledFieldsObj = filledFieldsFinder(reqBody);
  if (Object.keys(filledFieldsObj).length === 0) {
    return res.status(200).send({
      message: 'No update was made to the request'
    });
  }
  // check for strings
  nonStringFieldHandler(filledFieldsObj, res);

  // check for valid types
  invalidFieldHandler(filledFieldsObj, res);
  next();
};
export default modifyARequestChecker;
