import { pool } from '../db';
import { messageResponse } from '../helperFunctions/messageResponse';
/**
* It checks requests for reset tokens
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @param{object} next - middleware that calls the next middleware in the stack
* @returns {object} - response object that has a status code of 400 may returned if the
* requestid is in valid
*/
const resetTokenValidator = (request, response, next) => {
  if (typeof request.query.resetToken !== 'undefined') {
    if (!/[^a-zA-Z0-9]/.test(request.query.resetToken) && /^[a-zA-Z0-9]{10}$/.test(request.query.resetToken)) {
      request.query.resetToken = request.query.resetToken.trim();
      const dateNew = new Date();
      pool.connect((error, client, done) => {
        if (error) {
          return messageResponse(
            response,
            500,
            { message: error.stack }
          );
        }
        client.query('SELECT * FROM RESETPASSWORD where resetid = $1;', [request.query.resetToken], (error1, requestRow) => {
          done();
          if (error1) {
            return messageResponse(
              response,
              500,
              {
                message: error1.stack
              }
            );
          } else if (requestRow.rows.length === 1) {
            if (requestRow.rows[0].expirydate >= dateNew) {
              return next();
            }
            return messageResponse(
              response,
              401,
              {
                message: 'Token has expired'
              }
            );
          }
          return messageResponse(
            response,
            401,
            {
              message: 'Token is invalid'
            }
          );
        });
      });
    }
    return messageResponse(
      response,
      401,
      {
        message: 'Token is invalid'
      }
    );
  }
  return messageResponse(
    response,
    401,
    {
      message: 'Missing reset token'
    }
  );
};
export default resetTokenValidator;
