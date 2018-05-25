import { pool } from '../db';

/**
* It sets the status to Aprroved
* @param {Object} request - request object containing params and body
* @param {Object} response - response object that conveys the result of the request
* @param{Object} next - middleware that calls the net middleware in the stack
* @returns {String} - It sets the status to Approved then calls next middleware
*/
const approved = (request, response, next) => {
  pool.connect((error, client, done) => {
    if (error) response.status(500).send({ message: error.stack });
    client.query(`SELECT * From REQUESTS where id = '${request.params.requestid}' and status = 'Not Approved/Rejected';`, (error1, requestRow) => {
      done();
      if (error1) {
        return response.status(500).send({ message: error1.stack });
      }
      if (requestRow.rows.length > 0) {
        request.status = 'Approved';
        request.attempt = 'Approval';
        next();
      } else {
        return response.status(404).send({
          message: 'There is no approvable request on TrackerHero with that id',
        });
      }
    });
  });
};

/**
* It sets the status to Rejected
* @param {Object} request - request object containing params and body
* @param {Object} response - response object that conveys the result of the request
* @param{Object} next - middleware that calls the net middleware in the stack
* @returns {String} - It sets the status to Rejected then calls next middleware
*/
const resolved = (request, response, next) => {
  pool.connect((error, client, done) => {
    if (error) response.status(500).send({ message: error.stack });
    client.query(`SELECT * From REQUESTS where id = '${request.params.requestid}' and status = 'Approved';`, (error1, requestRow) => {
      done();
      if (error1) {
        return response.status(500).send({ message: error1.stack });
      }
      if (requestRow.rows.length > 0) {
        request.status = 'Resolved';
        request.attempt = 'Resolution';
        next();
      } else {
        return response.status(404).send({
          message: 'There is no approvable request on TrackerHero with that id',
        });
      }
    });
  });
};
export { resolved, approved };
