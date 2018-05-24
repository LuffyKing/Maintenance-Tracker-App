import jwt from 'jsonwebtoken';

const verifyToken = (request, response, next) => {
  const bearerHeader = request.headers.authorization;
  const hasBearerHeader = typeof bearerHeader === 'string';
  if (hasBearerHeader && bearerHeader) {
    const bearerToken = bearerHeader;
    jwt.verify(bearerToken, process.env.SECRET_KEY)
      .then(() => {
        next();
      })
      .catch(err => response.send(401).send(err));
  } else {
    return response.status(401).send({
      message: 'Missing authentication token'
    });
  }
};
export default verifyToken;
