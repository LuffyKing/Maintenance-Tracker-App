import { statusChanger } from './DatabaseHelpers';
/**
* It sets the status to Aprroved
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @param{object} next - middleware that calls the next middleware in the stack
* @returns {string} - It sets the status to Approved then calls next middleware
*/
const ApproveStatusValidator = (request, response, next) => statusChanger(
  request,
  response,
  next,
  `SELECT * From REQUESTS where
  id = '${request.params.requestid}' and status = 0;`,
  'Approved',
  'Approval',
  'There is no approvable request on TrackerHero with that id'
);
export default ApproveStatusValidator;
