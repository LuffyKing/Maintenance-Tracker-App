import { statusChanger } from './DatabaseHelpers';
/**
* It sets the status to Rejected
* @param {Object} request - request object containing params and body
* @param {Object} response - response object that conveys the result of the request
* @param{Object} next - middleware that calls the net middleware in the stack
* @returns {String} - It sets the status to Rejected then calls next middleware
*/
const resolved = (request, response, next) => statusChanger(
  request, response, next, `SELECT * From REQUESTS where id = '${request.params.requestid}' and status = 'Approved';`,
  'Resolved', 'Resolution', 'There is no resolvable request on TrackerHero with that id'
);

export default resolved;
