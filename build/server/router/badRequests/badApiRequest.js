'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var badApiRequest = function badApiRequest(request, response) {
  response.status(400).send({ message: 'Bad API - Request' });
};
exports.default = badApiRequest;