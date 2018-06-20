import { nonStringFieldHandler, emptyFieldsHandler, trimmer, getReqBody, invalidFieldHandler } from './createARequestValidator';

const changePasswordChecker = (request, response, next) => {
  const reqBody = getReqBody(request, ['password']);
  // check if the fields are filled
  let reply;
  reply = emptyFieldsHandler(reqBody, response, 'Your password change attempt was unsuccessful because');
  if (reply) {
    return reply;
  }
  // check for strings
  reply = nonStringFieldHandler(reqBody, response, 'Your password change attempt was unsuccessful because');
  if (reply) {
    return reply;
  }

  // check for valid types
  reply = invalidFieldHandler(reqBody, response, 'Your password change attempt was unsuccessful because');
  if (reply) {
    return reply;
  }
  trimmer(reqBody, request);
  next();
};
export default changePasswordChecker;
