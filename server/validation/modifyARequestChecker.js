import { message, nonStringFieldFinder, invalidFieldsChecker } from './createARequestValidator';

/**
* It finds the fields that are undefined or null
* @param {Object} reqBody - object containing the relevant field values
* @returns {string[]} - an array of the undefined fields as strings
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
const modifyARequestChecker = (req, res, next) => {
  const reqBody = {
    description: req.body.description,
    type: req.body.type,
    userid: req.body.userid,
    title: req.body.title,
    location: req.body.location
  };

  // check if the fields are filled
  const filledFieldsObj = filledFieldsFinder(reqBody);
  if (Object.keys(filledFieldsObj).length === 0) {
    return res.status(200).send({
      message: 'No update was made to the request'
    });
  }
  // check for strings
  const nonStringFieldFinderArr = nonStringFieldFinder(filledFieldsObj);
  if (nonStringFieldFinderArr.length > 0) {
    const word = nonStringFieldFinderArr.length === 1 ? 'a string' : 'strings';
    return message(400, res, nonStringFieldFinderArr, `supposed to be ${word}`);
  }

  // check for valid types
  const invalidFieldsArr = invalidFieldsChecker(filledFieldsObj);
  if (invalidFieldsArr.length > 0) {
    return res.status(400).send({
      message: `The request could not be created because ${invalidFieldsArr.join(' ,')}`
    });
  }
  next();
};
export default modifyARequestChecker;
