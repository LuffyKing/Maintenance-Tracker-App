import { requests } from '../dummy-data/database';
import { pool } from '../db';
/**
 * An  object that handles the requests api operation
 */
const Requests = {
  /**
* It gets all the requests on the application
* @param {Object} request - request object containing params and body
* @param {Object} response - response object that conveys the result of the request
* @returns {Object} - response object that has a status code of 200 as long as a
* with a verified token
*/
  getAllRequests: (request, response) => {
    const { decodedUser } = request;
    pool.connect((error, client, done) => {
      if (error) response.status(500).send({ message: error.stack });
      client.query(`SELECT * FROM REQUESTS where userid = '${decodedUser.user.id}';`, (error1, requestRow) => {
        done();
        if (error1) {
          return response.status(500).send({ message: error1.stack });
        }
        if (requestRow.rows.length > 0) {
          const requestPluSing = requestRow.rows.length === 1 ? 'request has' : 'requests have';
          return response.status(200).send({
            message: `Your ${requestRow.rows.length} ${requestPluSing} been found`,
            requests: requestRow.rows
          });
        }
        return response.status(404).send({
          message: 'You do not have any requests on TrackerHero, but it is not too late to start making them!',
        });
      });
    });
  },
  /**
* It gets a requests on the application
* @param {Object} request - request object containing params and body
* @param {Object} response - response object that conveys the result of the request
* @returns {Object} - response object that has a status code of either 200 and
* a repair or maintenance request or 404 if the id provided in the request params id
* does not match an existing request
*/
  getARequest: (request, response) => {
    const { decodedUser, params } = request;
    pool.connect((error, client, done) => {
      if (error) response.status(500).send({ message: error.stack });
      client.query(`SELECT * FROM REQUESTS where userid = '${decodedUser.user.id}' and id = '${params.requestid}';`, (error1, requestRow) => {
        done();
        if (error1) {
          return response.status(500).send({ message: error1.stack });
        }
        if (requestRow.rows.length > 0) {
          return response.status(200).send({
            message: 'Your request has been found',
            request: requestRow.rows[0]
          });
        }
        return response.status(404).send({
          message: 'You do not have any request on TrackerHero with that id',
        });
      });
    });
  },
  /**
* It gets a requests on the application
* @param {Object} request - request object containing params and body
* @param {Object} response - response object that conveys the result of the request
* @returns {Object} - response object that has a status code of 201 and
* a repair or maintenance request
*/
  createARequest: (request, response) => {
    const {
      title,
      description,
      location,
      type,
      userid
    } = request.reqBody;
    const id = requests.length;
    const newRequest = {
      id,
      title,
      description,
      location,
      type,
      userid,
      dateSubmitted: new Date().toString(),
      status: 'Not Approved/Rejected/Resolved'
    };
    requests.push(newRequest);
    response.status(201).send({
      request: newRequest,
      message: 'Success - repair/maintenance request created.'
    });
  },
  /**
* It gets a requests on the application
* @param {Object} request - request object containing params and body
* @param {Object} response - response object that conveys the result of the request
* @returns {Object} - response object that has a status code of 200 and
* a repair or maintenance request that has been updated or 404 if
*the id provided in the request params id does not match an existing request
*/
  updateARequest: (request, response) => {
    const {
      requestid
    } = request.params;
    let result = requests.filter(aRequest => aRequest.id === Number(requestid));
    if (result.length > 0) {
      [result] = result;
      const updatedRequest = {
        id: result.id,
        userid: result.userid,
        status: result.status,
        dateSubmitted: result.dateSubmitted,
        title: request.reqBody.title || result.title,
        description: request.reqBody.description || result.description,
        location: request.reqBody.location || result.location,
        type: request.reqBody.type || result.type,
      };
      requests.push(updatedRequest);
      return response.status(200).send({
        message: 'Success - repair/maintenance request updated.',
        updatedRequest
      });
    }
    return response.status(404).send({
      message: 'Maintenance/Repair with the specified id was not found'
    });
  }
};
export default Requests;
