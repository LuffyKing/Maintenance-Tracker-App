import { statusChanger } from './DatabaseHelpers';
/**
* It sets the status to Rejected
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @param{object} next - middleware that calls the next middleware in the stack
* @returns {string} - It sets the status to Rejected then calls next middleware
*/
const resolved = (request, response, next) => statusChanger(
  request, response, next, `SELECT * From REQUESTS where id = '${request.params.requestid}' and status = 1;`,
  'Resolved', 'Resolution', 'There is no resolvable request on TrackerHero with that id'
);

export default resolved;
