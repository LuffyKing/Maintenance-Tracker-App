import { reqstatus } from '../maps/mapObject';
/**
* It validates the status query
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @param{object} next - middleware that calls the next middleware in the stack
* @returns {object} - response object that has a status code of 404 may returned if the
* status query is invalid
*/
const isValidStatusQuery = (request, response, next) => {
  if (Object.keys(request.query).length > 0) {
    if (Object.keys(reqstatus).includes(request.query.status)) {
      request.hasQuery = true;
      request.query.mappedStatus = reqstatus[request.query.status];
      return next();
    } else{
      return response.status(404).send({ message: `There are no requests with the status ${request.query.status} on TrackerHero` });
    }
  }
  next();
};
export default isValidStatusQuery;
