import { requestsColumns } from '../db/seeds/requestsSeed';
import { RequestsDatabaseHelper } from '../validation/DatabaseHelpers';
import { reqtype, reqstatus } from '../maps/mapObject';

/**
 * An  object that handles the requests api operations
 */
const Requests = {
  /**
* @desc It gets all the requests on the application for a particular user
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @returns {object} - response object that has a status code of 200  and a list
* of requests owned by the user
*/
  getAllRequests: (request, response) => {
    const { decodedUser } = request;
    const query = request.hasQuery ? `SELECT * FROM
    REQUESTS where STATUS='${request.query.mappedStatus}' and
    userid = '${decodedUser.user.id}'` :
      `SELECT * FROM REQUESTS where userid = '${decodedUser.user.id}';`;
    const notFoundMessage = request.hasQuery ?
      `You do not have any requests with the status = ${request.query.status}` :
      'You do not have any requests on TrackerHero, but it is not too late to start making them!';
    RequestsDatabaseHelper(
      request, response, query,
      notFoundMessage,
      'get multiple requests', [], '', 200, 200
    );
  },
  /**
* @desc It gets all the requests on the application for an admin user
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @returns {object} - response object that has a status code of 200  and a list
* of all the requests
*/
  getAllRequestsAdmin: (request, response) => {
    const query = request.hasQuery ? `SELECT * FROM
    REQUESTS where STATUS=${request.query.mappedStatus}` :
      'SELECT * FROM REQUESTS;';
    RequestsDatabaseHelper(
      request, response, query,
      'There are no requests on TrackerHero, check back later!',
      'get multiple requests', [], '', 200, 200
    );
  },
  /**
* @desc It gets a request on the application and returns specific info based
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @returns {object} - response object that has a status code of either 200 and
* a repair or maintenance request or 404 if the id provided in the request params id
* does not match an existing request.
*/
  getARequest: (request, response) => {
    const { decodedUser, params } = request;
    if (decodedUser.user.profile === 'User') {
      RequestsDatabaseHelper(
        request, response, `SELECT * FROM REQUESTS
        where userid = '${decodedUser.user.id}' and
        id = '${params.requestid}';`,
        'You do not have any request on TrackerHero with that id',
        'get single request'
      );
    } else if (decodedUser.user.profile === 'Admin') {
      RequestsDatabaseHelper(
        request, response, `select requests.*,
        users.first_name,
        users.last_name from requests inner join users on
        requests.userid = users.id where requests.id = '${params.requestid}';`,
        'There is not a request on TrackerHero with that id',
        'get single request'
      );
    }
  },
  /**
* @desc It deletes a request that a user owns on the application
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @returns {object} - response object that has a status code of either 200 and
* a repair or maintenance request or 404 if the id provided in the request params id
* does not match an existing request
*/
  deleteARequest: (request, response) => {
    const { decodedUser, params } = request;
    RequestsDatabaseHelper(
      request, response, `DELETE FROM REQUESTS
      where userid = '${decodedUser.user.id}'
      and id = '${params.requestid}' and status = 0 RETURNING *;`,
      'You do not have any deleteable request on TrackerHero with that id',
      'delete single request'
    );
  },
  /**
* @desc It creates a user request on the application
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @returns {object} - response object that has a status code of 201 and
* a repair or maintenance request
*/
  createARequest: (request, response) => {
    const { decodedUser } = request;
    const newUserValue = [
      request.reqBody.title,
      request.reqBody.description,
      reqstatus['Not Approved/Rejected'],
      reqtype[request.reqBody.type],
      new Date(),
      new Date(),
      request.reqBody.location,
      decodedUser.user.id,
      request.reqBody.imageUrl
    ];
    RequestsDatabaseHelper(
      request, response,
      `INSERT INTO REQUESTS(${requestsColumns}, image_url)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *;`,
      'Request creation failure',
      'create a request',
      newUserValue,
      'Your request was successfully created.',
      201,
      400
    );
  },
  /**
* @desc It updates a request on the application
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @returns {object} - response object that has a status code of 200 and
* a repair or maintenance request that has been updated or 404 if
* the id provided in the request params id does not match an existing request
*/
  updateARequest: (request, response) => {
    const { reqBody, decodedUser } = request;
    const updateStatement = Object.keys(request.reqBody).map((key) => {
      if (key === 'type') {
        return `${key} = ${reqtype[reqBody[key]]}`;
      }
      return `${key} = $$${reqBody[key]}$$`;
    }).join(',');
    RequestsDatabaseHelper(
      request, response, `UPDATE REQUESTS SET last_edited = $1,
      ${updateStatement} where userid = '${decodedUser.user.id}' and
      status = 0 and id = '${request.params.requestid}' RETURNING *;`,
      'You do not have any editable request on TrackerHero with that id',
      'update a request', [new Date()], 'Your request has been updated.'
    );
  },
  /**
* @desc It updates a request by changing the status of the request as directed by the admin
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
      query = `UPDATE REQUESTS SET
      date_resolved = $1, last_edited = $2, status = $3, reason = $4
      where id = '${requestid}' RETURNING *;`;
      values = [new Date(), new Date(), reqstatus[status], reqBody.reason];
    } else {
      query = `UPDATE REQUESTS SET last_edited = $1, status = $2, reason = $3
      where id = '${requestid}' RETURNING *;`;
      values = [new Date(), reqstatus[status], reqBody.reason];
    }
    RequestsDatabaseHelper(
      request,
      response,
      query,
      'Request not found',
      'update a request',
      values,
      'The request has been updated.'
    );
  },
  /**
* @desc It inserts an image url into the request table
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @returns {object} - response object that has a status code of 200 and
* a repair or maintenance request that has been updated or 404 if
* the id provided in the request params id does not match an existing request
*/
  insertImage: (request, response) => {
    const {
      requestid
    } = request.params;
    const query = `UPDATE REQUESTS SET
    image_url = $1 where id = '${requestid}' and status = 0 RETURNING *;`;
    const values = [request.body.imageUrl];
    RequestsDatabaseHelper(
      request,
      response,
      query,
      'Request not found',
      'update a request',
      values,
      'The request has been updated.'
    );
  }
};
export default Requests;
