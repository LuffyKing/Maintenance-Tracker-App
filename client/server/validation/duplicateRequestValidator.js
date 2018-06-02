import { pool } from '../db';

const duplicateRequest = (request, response, next) => {
  const { reqBody } = request;
  pool.connect((error, client, done) => {
    if (error) {
      response.status(500).send({ message: error.stack });
    }
    client.query('SELECT * FROM REQUESTS where LOCATION ilike $1 and DESCRIPTION ilike $2 and TYPE = $3 and TITLE ilike $4;', [reqBody.location, reqBody.description, reqBody.type, reqBody.title], (error1, requestRow) => {
      done();
      if (error1) {
        return response.status(500).send({ message: error1.stack });
      } else if (requestRow.rows.length === 0) {
        request.failReason = 'The request could not be created because';
        next();
      } else {
        return response.status(422).send({
          message: 'The request could not be created because a request with the same LOCATION, DESCRIPTION,TYPE AND TITLE already exists',
        });
      }
    });
  });
};
export { duplicateRequest };
