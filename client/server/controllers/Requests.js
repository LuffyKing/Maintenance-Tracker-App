import uuidv4 from 'uuid/v4';
import { requestsColumns } from '../db/seeds/requestsSeed';
import { RequestsDatabaseHelper } from '../validation/DatabaseHelpers';
/**
 * An  object that handles the requests api operation
 */
const Requests = {
  /**
* It gets all the requests on the application
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @returns {object} - response object that has a status code of 200 as long as a
* with a verified token or 404 if the user does not have any requests
*/
  getAllRequests: (request, response) => {
    const { decodedUser } = request;
    RequestsDatabaseHelper(
      request, response, `SELECT * FROM REQUESTS where userid = '${decodedUser.user.id}';`,
      'You do not have any requests on TrackerHero, but it is not too late to start making them!',
      'get multiple requests'
    );
  },
  /**
* It gets all the requests on the application for an admin user
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @returns {object} - response object that has a status code of 200 as long as a
* with a verified token or 404 if the user does not have any requests
*/
  getAllRequestsAdmin: (request, response) => {
    RequestsDatabaseHelper(
      request, response, 'SELECT * FROM REQUESTS;',
      'There are no requests on TrackerHero, check back later!',
      'get multiple requests'
    );
  },
  /**
* It gets a requests on the application
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @returns {object} - response object that has a status code of either 200 and
* a repair or maintenance request or 404 if the id provided in the request params id
* does not match an existing request
*/
  getARequest: (request, response) => {
    const { decodedUser, params } = request;
    RequestsDatabaseHelper(
      request, response, `SELECT * FROM REQUESTS where userid = '${decodedUser.user.id}' and id = '${params.requestid}';`,
      'You do not have any request on TrackerHero with that id',
      'get single request'
    );
  },
  /**
* It deletes a request that a user owns on the application
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @returns {object} - response object that has a status code of either 200 and
* a repair or maintenance request or 404 if the id provided in the request params id
* does not match an existing request
*/
  deleteARequest: (request, response) => {
    const { decodedUser, params } = request;
    RequestsDatabaseHelper(
      request, response, `DELETE FROM REQUESTS where userid = '${decodedUser.user.id}' and id = '${params.requestid}' and status='Not Approved/Rejected' RETURNING *;`,
      'You do not have any deleteable request on TrackerHero with that id',
      'delete single request'
    );
  },
  /**
* It gets a requests on the application
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @returns {object} - response object that has a status code of 201 and
* a repair or maintenance request
*/
  createARequest: (request, response) => {
    const {
      title,
      description,
      location,
      type
    } = request.reqBody;
    const { decodedUser } = request;
    const newUserValue = [
      uuidv4(),
      title,
      description,
      'Not Approved/Rejected',
      type,
      new Date(),
      new Date(),
      location,
      decodedUser.user.id
    ];
    RequestsDatabaseHelper(
      request, response,
      `INSERT INTO REQUESTS(${requestsColumns}) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *;`,
      'Request creation failure', 'create a request', newUserValue, 'Your request was successfully created.',
      201, 400
    );
  },
  /**
* It gets a requests on the application
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @returns {object} - response object that has a status code of 200 and
* a repair or maintenance request that has been updated or 404 if
*the id provided in the request params id does not match an existing request
*/
  updateARequest: (request, response) => {
    const {
      requestid
    } = request.params;
    const { reqBody, decodedUser } = request;
    const updateStatement = Object.keys(request.reqBody).map(key => `${key} = '${reqBody[key]}'`).join(',');
    RequestsDatabaseHelper(
      request, response, `UPDATE REQUESTS SET last_edited = $1,${updateStatement} where userid = '${decodedUser.user.id}' and status = 'Not Approved/Rejected' and id = '${requestid}' RETURNING *;`,
      'You do not have any editable request on TrackerHero with that id',
      'update a request', [new Date()], 'Your request has been updated.'
    );
  },
  /**
* It updates a request by chnging the status for admins
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @returns {object} - response object that has a status code of 200 and
* a repair or maintenance request that has been updated or 404 if
*the id provided in the request params id does not match an existing request
*/
  updateARequestAdmin: (request, response) => {
    const {
      requestid
    } = request.params;
    const { reqBody, status } = request;
    let query, values;
    if (status === 'Resolved') {
      query = `UPDATE REQUESTS SET date_resolved = $1,last_edited = $2,status = $3,reason = $4  where id = '${requestid}' RETURNING *;`;
      values = [new Date(), new Date(), status, reqBody.reason];
    } else {
      query = `UPDATE REQUESTS SET last_edited = $1,status = $2,reason = $3  where id = '${requestid}' RETURNING *;`;
      values = [new Date(), status, reqBody.reason];
    }
    RequestsDatabaseHelper(request, response, query, 'Request not found', 'update a request', values, 'The request has been updated.');
  }
};
export default Requests;
