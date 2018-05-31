const profileCheck = (request, response, profileAllowed) => {
  const { decodedUser } = request;
  if (typeof decodedUser.user === "undefined") {
    decodedUser.user = decodedUser.newUser;
    request.decodedUser.user = decodedUser.newUser;
  }
  if (decodedUser.user.profile !== profileAllowed) {
    return response.status(401).send({ message: `You are not allowed to use this API because your profile is not ${profileAllowed}` });
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
const isUser = (request, response, next) => {
  const reply = profileCheck(request, response, 'User');
  if (reply) {
    return reply;
  }
  next();
};
/**
* It checks for Admin profile
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @param{object} next - middleware that calls the next middleware in the stack
* @returns {object} - response object that has a status code of 401 may returned if the
* profile is in valid
*/
const isAdmin = (request, response, next) => {
  const reply = profileCheck(request, response, 'Admin');
  if (reply) {
    return reply;
  }
  next();
};
export { isUser, isAdmin };
