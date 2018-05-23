import jwt from 'jsonwebtoken';
// if (typeof checkTokenResult !== 'boolean') {
//   return res.send(500).send({
//     message: 'Sever Error occured during jwt verification',
//     error: checkTokenResult
//   });
// }
// const checkToken = (token) => {
//   const { id } = jwt.verify(token, process.env.SECRET_KEY);
//   return query('SELECT ID FROM USERS WHERE id = $1', [id])
//     .then(result => typeof result.row[0].id === 'string')
//     .catch(error => error);
// };
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  const hasBearerHeader = typeof bearerHeader === 'string';
  if (hasBearerHeader && bearerHeader) {
    const bearerToken = bearerHeader;
    jwt.verify(bearerToken, process.env.SECRET_KEY)
      .then(() => {
        next();
      })
      .catch(err => res.send(401).send(err));
  } else {
    return res.status(401).send({
      message: 'Missing authentication token'
    });
  }
};
export default verifyToken;
