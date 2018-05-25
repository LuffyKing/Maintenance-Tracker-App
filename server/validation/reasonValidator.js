import { nonStringFieldHandler, emptyFieldsHandler, trimmer, getReqBody, invalidFieldHandler } from './createARequestValidator';

const reasonChecker = (request, response, next) => {
  const reqBody = getReqBody(request, ['reason']);
  // check if the fields are filled
  let reply;
  reply = emptyFieldsHandler(reqBody, response, `Your  ${request.attempt} was unsuccessful because`);
  if (reply) {
    return reply;
  }
  // check for strings
  reply = nonStringFieldHandler(reqBody, response, `Your  ${request.attempt} was unsuccessful because`);
  if (reply) {
    return reply;
  }

  // check for valid types
  reply = invalidFieldHandler(reqBody, response, `Your  ${request.attempt} was unsuccessful because`);
  if (reply) {
    return reply;
  }
  trimmer(reqBody, request);
  request.failReason = `Your  ${request.attempt} was unsuccessful because`;
  next();
};
export default reasonChecker;
