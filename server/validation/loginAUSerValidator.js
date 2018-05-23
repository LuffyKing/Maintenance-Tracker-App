import { nonStringFieldHandler, emptyFieldsHandler, trimmer, getReqBody, invalidFieldHandler } from './createARequestValidator';

const loginAUserChecker = (req, res, next) => {
  const reqBody = getReqBody(req, ['email', 'password']);
  // check if the fields are filled
  let reply;
  reply = emptyFieldsHandler(reqBody, res);
  if (reply) {
    return reply;
  }
  // check for strings
  reply = nonStringFieldHandler(reqBody, res);
  if (reply) {
    return reply;
  }

  // check for valid types
  reply = invalidFieldHandler(reqBody, res);
  if (reply) {
    return reply;
  }
  trimmer(reqBody, req);
  next();
};
export default loginAUserChecker;
