import { pool } from '../db';

const duplicateUser = (request, response, next) => {
  const { reqBody } = request;
  pool.connect((error, client, done) => {
    if (error) {
      response.status(500).send({ message: error.stack });
    }
    client.query('SELECT * FROM USERS where email ilike $1;', [reqBody.email], (error1, requestRow) => {
      done();
      if (error1) {
        return response.status(500).send({ message: error1.stack });
      } else if (requestRow.rows.length === 0) {
        request.failReason = 'The request could not be created because';
        next();
      } else {
        return response.status(422).send({
          message: 'The request could not be created because a user already exists with that email.',
        });
      }
    });
  });
};
export { duplicateUser };
