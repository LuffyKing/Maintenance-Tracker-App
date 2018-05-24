import { nonStringFieldHandler, emptyFieldsHandler, trimmer, getReqBody, invalidFieldHandler } from './createARequestValidator';
import { pool } from '../db';

const signUpAUserChecker = (request, response, next) => {
  const reqBody = getReqBody(request, ['firstName',
    'lastName',
    'email',
    'password',
    'jobTitle',
    'department',
    'location']);
  // check if the fields are filled
  let reply;
  reply = emptyFieldsHandler(reqBody, response, 'Your sign up attempt was unsuccessful because');
  if (reply) {
    return reply;
  }
  // check for strings
  reply = nonStringFieldHandler(reqBody, response, 'Your sign up attempt was unsuccessful because');
  if (reply) {
    return reply;
  }

  // check for valid types
  reply = invalidFieldHandler(reqBody, response, 'Your sign up attempt was unsuccessful because');
  if (reply) {
    return reply;
  }
  pool.connect()
    .then(client => client.query('SELECT * FROM USERS WHERE EMAIL = $1 LIMIT 1;', [reqBody.email])
      .then((result) => {
        client.release();
        if (result.rows.length > 0) {
          throw new Error('Your sign up attempt was unsuccessful because the EMAIL you provided already exists!');
        }
        trimmer(reqBody, request);
        next();
      }).catch(error => response.status(400).send({ message: error.message }))
      .catch(error => response.status(500).send({ error })));
};
export default signUpAUserChecker;
