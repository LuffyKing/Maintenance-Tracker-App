'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyTokenUI = exports.default = undefined;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var verifyToken = function verifyToken(request, response, next) {
  var bearerHeader = request.headers.authorization;
  var hasBearerHeader = typeof bearerHeader === 'string';
  if (hasBearerHeader && bearerHeader) {
    var bearerToken = bearerHeader;
    _jsonwebtoken2.default.verify(bearerToken, process.env.SECRET_KEY, function (error, user) {
      if (error) {
        return response.status(401).send({ message: 'Login Token invalid', error: error });
      } else {
        console.log(user);
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

var verifyTokenUI = function verifyTokenUI(request, response) {
  var bearerHeader = request.headers.authorization;
  var hasBearerHeader = typeof bearerHeader === 'string';
  if (hasBearerHeader && bearerHeader) {
    var bearerToken = bearerHeader;
    _jsonwebtoken2.default.verify(bearerToken, process.env.SECRET_KEY, function (error, user) {
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

exports.default = verifyToken;
exports.verifyTokenUI = verifyTokenUI;