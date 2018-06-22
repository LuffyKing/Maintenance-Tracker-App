import jwt from 'jsonwebtoken';
import { messageResponse } from '../helperFunctions/messageResponse';

export const verifyToken = (request, response, next) => {
  const bearerHeader = request.headers.authorization;
  const hasBearerHeader = typeof bearerHeader === 'string';
  if (hasBearerHeader && bearerHeader) {
    const bearerToken = bearerHeader;
    return jwt.verify(bearerToken, process.env.SECRET_KEY, (error, user) => {
      if (error) {
        return messageResponse(response, 401, { message: 'Login Token invalid', error });
      }
      request.decodedUser = user;
      return next();
    });
  }
  return messageResponse(response, 401, {
    message: 'Missing authentication token'
  });
};

export const verifyTokenUI = (request, response) => {
  const bearerHeader = request.headers.authorization;
  const hasBearerHeader = typeof bearerHeader === 'string';
  if (hasBearerHeader && bearerHeader) {
    const bearerToken = bearerHeader;
    return jwt.verify(bearerToken, process.env.SECRET_KEY, (error) => {
      if (error) {
        return messageResponse(response, 401, { message: '' });
      }
      return messageResponse(response, 200, { profile: jwt.decode(bearerHeader).user.profile });
    });
  }
  return messageResponse(response, 401, { message: '' });
};
