import { messageResponse } from '../helperFunctions/messageResponse';
import { pool } from '../db';

const duplicateUserValidator = (request, response, next) => {
  const { reqBody } = request;
  pool.connect((error, client, done) => {
    if (error) {
      return messageResponse(
        response,
        500,
        { message: error.stack }
      );
    }
    client.query('SELECT * FROM USERS where email ilike $1;', [reqBody.email], (error1, requestRow) => {
      done();
      if (error1) {
        return messageResponse(
          response,
          500,
          { message: error1.stack }
        );
      } else if (requestRow.rows.length === 0) {
        request.failReason = 'The request could not be created because';
        return next();
      }
      return messageResponse(
        response,
        422,
        { message: 'The request could not be created because a user already exists with that email.' }
      );
    });
  });
};
export default duplicateUserValidator;
