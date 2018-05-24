import { requests } from '../dummy-data/database';
/**
 * An  object that handles the requests api operation
 */
const Requests = {
  /**
* It gets all the requests on the application
* @param {Object} request - request object containing params and body
* @param {Object} response - response object that conveys the result of the request
* @returns {Object} - response object that has a status code of 200 as long as a
request is made
*/
  getAllRequests: (request, response) => response.status(200).send({
    message: 'Success - All repair/maintenance requests retrieved.',
    requests
  }),
  /**
* It gets a requests on the application
* @param {Object} request - request object containing params and body
* @param {Object} response - response object that conveys the result of the request
* @returns {Object} - response object that has a status code of either 200 and
* a repair or maintenance request or 404 if the id provided in the request params id
* does not match an existing request
*/
  getARequest: (request, response) => {
    const { requestid } = request.params;
    const result = requests.filter(aRequest => aRequest.id === Number(requestid));
    return result.length > 0 ? response.status(200).send({
      message: 'Success - repair/maintenance request retrieved.',
      request: result[0]
    }) : response.status(404).send({
      message: 'Maintenance/Repair with the specified id was not found'
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
