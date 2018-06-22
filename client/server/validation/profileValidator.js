import _ from 'lodash';
import { profile } from '../maps/mapObject';
import { messageResponse } from '../helperFunctions/messageResponse';

const profileCheck = (request, response, profileAllowed) => {
  const { decodedUser } = request;
  if (typeof decodedUser.user === 'undefined') {
    decodedUser.user = decodedUser.newUser;
    request.decodedUser.user = decodedUser.newUser;
  }
  const profInv = (_.invert(profile));
  if (profile[decodedUser.user.profile] !== profileAllowed) {
    return messageResponse(
      response,
      401,
      { message: `You are not allowed to use this API because your profile is not ${profInv[profileAllowed]}` }
    );
  }
};

/**
* It checks for User profile
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @param{object} next - middleware that calls the next middleware in the stack
* @returns {object} - response object that has a status code of 401 may returned if the
* profile is in valid
*/
export const isUser = (request, response, next) => {
  const reply = profileCheck(request, response, 0);
  if (reply) {
    return reply;
  }
  return next();
};
/**
* It checks for Admin profile
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @param{object} next - middleware that calls the next middleware in the stack
* @returns {object} - response object that has a status code of 401 may returned if the
* profile is in valid
*/
export const isAdmin = (request, response, next) => {
  const reply = profileCheck(request, response, 1);
  if (reply) {
    return reply;
  }
  return next();
};
