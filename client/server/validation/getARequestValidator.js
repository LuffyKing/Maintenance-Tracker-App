/**
* It gets all the requests on the application
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @param{object} next - middleware that calls the next middleware in the stack
* @returns {object} - response object that has a status code of 400 may returned if the
* requestid is in valid
*/
const getARequestChecker = (request, response, next) => {
  if (!/[^a-zA-Z0-9]/.test(request.params.requestid) && /^[a-zA-Z0-9]{8}$/.test(request.params.requestid)) {
    request.params.requestid = request.params.requestid.trim();
    next();
  } else {
    return response.status(404).send({ message: 'The id provided is invalid which means the request does not exist' });
  }
};
export { getARequestChecker };
