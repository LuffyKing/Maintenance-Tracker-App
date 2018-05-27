import { statusChanger } from './DatabaseHelpers';
/**
* It sets the status to Aprroved
* @param {Object} request - request object containing params and body
* @param {Object} response - response object that conveys the result of the request
* @param{Object} next - middleware that calls the net middleware in the stack
* @returns {String} - It sets the status to Approved then calls next middleware
*/
const approved = (request, response, next) => statusChanger(
  request, response, next, `SELECT * From REQUESTS where id = '${request.params.requestid}' and status = 'Not Approved/Rejected';`,
  'Approved', 'Approval', 'There is no approvable request on TrackerHero with that id'
);

export default approved;
