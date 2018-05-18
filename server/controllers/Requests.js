import { requests } from '../dummy-data/database';
/**
 * An that handles the requests api operation
 */
const Requests = {
  /**
* It gets all the requests on the application
* @param {Object} req - request object containing params and body
* @param {Object} res - response object that conveys the result of the request
* @returns {Object} - response object that has a status code of either 201 and
* the new business or 400 depending on whether completness of the information
* posted or the uniqness of the email and telephoneNumber
*/
  getAllRequests: (req, res) => res.status(200).send({
    message: 'Success - All repair/maintenance requests retrieved.',
    requests
  }),
};
export default Requests;
