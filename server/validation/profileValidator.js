
/**
* It checks for User profile
* @param {Object} request - request object containing params and body
* @param {Object} response - response object that conveys the result of the request
* @param{Object} next - middleware that calls the net middleware in the stack
* @returns {Object} - response object that has a status code of 401 may returned if the
* profile is in valid
*/
const isUser = (request, response, next) => {
  const { decodedUser } = request;
  if (decodedUser.user.profile === 'User') {
    next();
  } else {
    return response.status(401).send({ message: 'You are not allowed to use this API because your profile is not User' });
  }
};
/**
* It checks for Admin profile
* @param {Object} request - request object containing params and body
* @param {Object} response - response object that conveys the result of the request
* @param{Object} next - middleware that calls the net middleware in the stack
* @returns {Object} - response object that has a status code of 401 may returned if the
* profile is in valid
*/
const isAdmin = (request, response, next) => {
  const { decodedUser } = request;
  if (decodedUser.user.profile === 'Admin') {
    next();
  } else {
    return response.status(401).send({ message: 'You are not allowed to use this API because your profile is not Admin' });
  }
};
export { isUser, isAdmin };
