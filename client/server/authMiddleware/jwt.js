import jwt from 'jsonwebtoken';

const verifyToken = (request, response, next) => {
  const bearerHeader = request.headers.authorization;
  const hasBearerHeader = typeof bearerHeader === 'string';
  if (hasBearerHeader && bearerHeader) {
    const bearerToken = bearerHeader;
    jwt.verify(bearerToken, process.env.SECRET_KEY, (error, user) => {
      if (error) {
        return response.status(401).send({ message: 'Login Token invalid', error });
      } else {
      
      request.decodedUser = user;
      next();
    }
    });
  } else {
    return response.status(401).send({
      message: 'Missing authentication token'
    });
  }
};

const verifyTokenUI = (request, response) => {
  const bearerHeader = request.headers.authorization;
  const hasBearerHeader = typeof bearerHeader === 'string';
  if (hasBearerHeader && bearerHeader) {
    const bearerToken = bearerHeader;
    jwt.verify(bearerToken, process.env.SECRET_KEY, (error, user) => {
      if (error) {
        return response.status(401).send();
      } else {
      return response.status(200).send();
    }
    });
  } else {
    return response.status(401).send();
  }
};

export { verifyToken as default, verifyTokenUI };
