import { messageResponse } from '../helperFunctions/messageResponse';
import { pool } from '../db';
import { reqtype } from '../maps/mapObject';

const duplicateRequestValidator = (request, response, next) => {
  const { reqBody } = request;
  pool.connect((error, client, done) => {
    if (error) {
      return messageResponse(
        response,
        500,
        { message: error.stack }
      );
    }
    client.query('SELECT * FROM REQUESTS where LOCATION ilike $1 and DESCRIPTION ilike $2 and TYPE = $3 and TITLE ilike $4;', [reqBody.location, reqBody.description, reqtype[reqBody.type], reqBody.title], (error1, requestRow) => {
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
        {
          message: 'The request could not be created because a request with the same LOCATION, DESCRIPTION,TYPE AND TITLE already exists',
        }
      );
    });
  });
};
export default duplicateRequestValidator;
