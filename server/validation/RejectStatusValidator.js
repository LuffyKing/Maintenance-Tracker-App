import { pool } from '../db';
/**
* It sets the status to Rejected
* @param {Object} request - request object containing params and body
* @param {Object} response - response object that conveys the result of the request
* @param{Object} next - middleware that calls the net middleware in the stack
* @returns {String} - It sets the status to Rejected then calls next middleware
*/
const rejected = (request, response, next) => {
  pool.connect((error, client, done) => {
    if (error) response.status(500).send({ message: error.stack });
    client.query(`SELECT * From REQUESTS where id = '${request.params.requestid}' and status = 'Not Approved/Rejected';`, (error1, requestRow) => {
      done();
      if (error1) {
        return response.status(500).send({ message: error1.stack });
      }
      if (requestRow.rows.length > 0) {
        request.status = 'Rejected';
        request.attempt = 'Rejection';
        next();
      } else {
        return response.status(404).send({
          message: 'There is no rejectable request on TrackerHero with that id',
        });
      }
    });
  });
};
export default rejected;
