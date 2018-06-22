import validator from 'validator';

import { messageResponse } from '../helperFunctions/messageResponse';

/**
* Checks if image url is url
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @param{object} next - middleware that calls the next middleware in the stack
* @returns {object} - response object that has a status code of 400 may returned if the
* image url is invalid
*/
const imageUrlValidator = (request, response, next) => {
  if (validator.isURL(request.body.imageUrl)) {
    return next();
  }
  return messageResponse(
    response,
    404,
    { message: 'The image url provided is invalid which means the image does not exist' }
  );
};
export default imageUrlValidator;
