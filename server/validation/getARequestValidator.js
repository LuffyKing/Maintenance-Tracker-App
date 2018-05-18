import validator from 'validator';
/**
* It gets all the requests on the application
* @param {string} id - the string that represents the integer id
* @returns {boolean} - boolean which is true if the string id is an integer
*and vice-versa
*/
const checkId = id => validator.isInt(id);

/**
* It gets all the requests on the application
* @param {Object} req - request object containing params and body
* @param {Object} res - response object that conveys the result of the request
* @param{Object} next - middleware that calls the net middleware in the stack
* @returns {Object} - response object that has a status code of 400 may returned if the
* requestid is in valid
*/
const getARequestChecker = (req, res, next) => {
  if (checkId(req.params.requestid.trim())) {
    req.params.requestid = req.params.requestid.trim();
    next();
  } else {
    return res.status(400).send({ message: 'The id provided is invalid because it is not an integer' });
  }
};
export { checkId, getARequestChecker };
