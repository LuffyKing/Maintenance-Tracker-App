'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DatabaseHelpers = require('./DatabaseHelpers');

/**
* It sets the status to Rejected
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @param{object} next - middleware that calls the next middleware in the stack
* @returns {string} - It sets the status to Rejected then calls next middleware
*/
var resolved = function resolved(request, response, next) {
  return (0, _DatabaseHelpers.statusChanger)(request, response, next, 'SELECT * From REQUESTS where id = \'' + request.params.requestid + '\' and status = \'Approved\';', 'Resolved', 'Resolution', 'There is no resolvable request on TrackerHero with that id');
};

exports.default = resolved;