import { pool } from '../db';

const statusChanger = (request, response, next, query, status, attempt, message404) => {
  pool.connect((error, client, done) => {
    if (error) {
      response.status(500).send({ message: error.stack });
    }
    client.query(query, (error1, requestRow) => {
      done();
      if (error1) {
        return response.status(500).send({ message: error1.stack });
      }
      if (requestRow.rows.length > 0) {
        request.status = status;
        request.attempt = attempt;
        next();
      } else {
        return response.status(404).send({
          message: message404,
        });
      }
    });
  });
};

const RequestsDatabaseHelper = (request, response, query, messageErrCode, operation, value = [], messageSuccCode = '', successCode = 200, errorCode = 404) => {
  pool.connect((error, client, done) => {
    if (error) {
      response.status(500).send({ message: error.stack });
    }
    client.query(query, value, (error1, requestRow) => {
      done();
      if (error1) {
        return response.status(500).send({ message: error1.stack });
      }
      if (requestRow.rows.length > 0) {
        const requestPluSing = requestRow.rows.length === 1 ? 'request has' : 'requests have';
        if (operation === 'get multiple requests') {
          return response.status(successCode).send({
            message: `Your ${requestRow.rows.length} ${requestPluSing} been found`,
            requests: requestRow.rows
          });
        } else if (operation === 'get single request') {
          return response.status(successCode).send({
            message: 'Your request has been found',
            request: requestRow.rows[0]
          });
        } else if (operation === 'update a request') {
          return response.status(successCode).send({
            message: messageSuccCode,
            updatedRequest: requestRow.rows[0]
          });
        } else if (operation === 'create a request') {
          return response.status(successCode).send({
            message: messageSuccCode,
            request: requestRow.rows[0]
          });
        }
      }
      return response.status(errorCode).send({
        message: messageErrCode
      });
    });
  });
};

export { statusChanger, RequestsDatabaseHelper };
