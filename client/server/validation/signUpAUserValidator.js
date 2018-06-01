import { nonStringFieldHandler, emptyFieldsHandler, trimmer, getReqBody, invalidFieldHandler } from './createARequestValidator';
import { pool } from '../db';

const signUpAUserChecker = (request, response, next) => {
  const reqBody = getReqBody(request, ['firstName', 'lastName', 'email', 'password', 'jobTitle', 'department', 'location']);
  let reply = emptyFieldsHandler(reqBody, response, 'Your sign up attempt was unsuccessful because');
  if (reply) {
    return reply;
  }
  reply = nonStringFieldHandler(reqBody, response, 'Your sign up attempt was unsuccessful because');
  if (reply) {
    return reply;
  }
  reply = invalidFieldHandler(reqBody, response, 'Your sign up attempt was unsuccessful because');
  if (reply) {
    return reply;
  }
  pool.connect()
    .then(client => client.query('SELECT * FROM USERS WHERE EMAIL ilike $1;', [reqBody.email])
      .then((result) => {
        client.release();
        if (result.rows.length > 0) {
          throw new Error('Your sign up attempt was unsuccessful because the EMAIL you provided already exists!');
        }
        trimmer(reqBody, request);
        request.failReason = 'Your sign up attempt was unsuccessful because';
        next();
      }).catch(error => response.status(422).send({ message: error.message }))
      .catch(error => response.status(500).send({ error })));
};
export default signUpAUserChecker;
