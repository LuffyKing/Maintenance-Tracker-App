import { nonStringFieldHandler, emptyFieldsHandler, trimmer, getReqBody, invalidFieldHandler } from './createARequestValidator';
import { pool } from '../db';
import { messageResponse } from '../helperFunctions/messageResponse';
import { filledFieldsFinder } from '../validation/modifyARequestChecker';

const editAUserValidator = (request, response, next) => {
  const reqBody = getReqBody(request, [
    'firstName',
    'lastName',
    'email',
    'jobTitle',
    'department',
    'location']);
  let reply;
  const filledFieldsObj = filledFieldsFinder(reqBody);
  if (Object.keys(filledFieldsObj).length === 0) {
    return messageResponse(response, 200, {
      message: 'No update was made to the profile'
    });
  }
  reply = emptyFieldsHandler(filledFieldsObj, response, 'Your edit attempt was unsuccessful because');
  if (reply) {
    return reply;
  }
  reply = nonStringFieldHandler(filledFieldsObj, response, 'Your edit attempt was unsuccessful because');
  if (reply) {
    return reply;
  }
  reply = invalidFieldHandler(filledFieldsObj, response, 'Your edit attempt was unsuccessful because');
  if (reply) {
    return reply;
  }
  trimmer(filledFieldsObj, request);
  if (request.reqBody.email) {
    pool.connect()
      .then(client => client.query('SELECT * FROM USERS WHERE EMAIL ilike $1;', [request.reqBody.email])
        .then((result) => {
          client.release();
          if (result.rows.length > 0) {
            if (result.rows[0].id !== request.decodedUser.user.id) {
              return messageResponse(
                response,
                422,
                {
                  message: 'Your edit attempt was unsuccessful because the EMAIL you provided already exists!'
                }
              );
            }
          }
          request.failReason = 'Your edit attempt was unsuccessful because';
          return next();
        })
        .catch(error => messageResponse(
          response,
          500,
          {
            error
          }
        )));
  } else if (typeof request.reqBody.email === 'undefined') {
    return next();
  }
};
export default editAUserValidator;
