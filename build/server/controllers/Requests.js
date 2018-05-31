'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _requestsSeed = require('../db/seeds/requestsSeed');

var _DatabaseHelpers = require('../validation/DatabaseHelpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An  object that handles the requests api operation
 */
var Requests = {
  /**
  * It gets all the requests on the application
  * @param {object} request - request object containing params and body
  * @param {object} response - response object that conveys the result of the request
  * @returns {object} - response object that has a status code of 200 as long as a
  * with a verified token or 404 if the user does not have any requests
  */
  getAllRequests: function getAllRequests(request, response) {
    var decodedUser = request.decodedUser;

    (0, _DatabaseHelpers.RequestsDatabaseHelper)(request, response, 'SELECT * FROM REQUESTS where userid = \'' + decodedUser.user.id + '\';', 'You do not have any requests on TrackerHero, but it is not too late to start making them!', 'get multiple requests');
  },
  /**
  * It gets all the requests on the application for an admin user
  * @param {object} request - request object containing params and body
  * @param {object} response - response object that conveys the result of the request
  * @returns {object} - response object that has a status code of 200 as long as a
  * with a verified token or 404 if the user does not have any requests
  */
  getAllRequestsAdmin: function getAllRequestsAdmin(request, response) {
    (0, _DatabaseHelpers.RequestsDatabaseHelper)(request, response, 'SELECT * FROM REQUESTS;', 'There are no requests on TrackerHero, check back later!', 'get multiple requests');
  },
  /**
  * It gets a requests on the application
  * @param {object} request - request object containing params and body
  * @param {object} response - response object that conveys the result of the request
  * @returns {object} - response object that has a status code of either 200 and
  * a repair or maintenance request or 404 if the id provided in the request params id
  * does not match an existing request
  */
  getARequest: function getARequest(request, response) {
    var decodedUser = request.decodedUser,
        params = request.params;

    (0, _DatabaseHelpers.RequestsDatabaseHelper)(request, response, 'SELECT * FROM REQUESTS where userid = \'' + decodedUser.user.id + '\' and id = \'' + params.requestid + '\';', 'You do not have any request on TrackerHero with that id', 'get single request');
  },
  /**
  * It gets a requests on the application
  * @param {object} request - request object containing params and body
  * @param {object} response - response object that conveys the result of the request
  * @returns {object} - response object that has a status code of 201 and
  * a repair or maintenance request
  */
  createARequest: function createARequest(request, response) {
    var _request$reqBody = request.reqBody,
        title = _request$reqBody.title,
        description = _request$reqBody.description,
        location = _request$reqBody.location,
        type = _request$reqBody.type;
    var decodedUser = request.decodedUser;

    var newUserValue = [(0, _v2.default)(), title, description, 'Not Approved/Rejected', type, new Date(), new Date(), location, decodedUser.user.id];
    (0, _DatabaseHelpers.RequestsDatabaseHelper)(request, response, 'INSERT INTO REQUESTS(' + _requestsSeed.requestsColumns + ') VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *;', 'Request creation failure', 'create a request', newUserValue, 'Your request was successfully created.', 201, 400);
  },
  /**
  * It gets a requests on the application
  * @param {object} request - request object containing params and body
  * @param {object} response - response object that conveys the result of the request
  * @returns {object} - response object that has a status code of 200 and
  * a repair or maintenance request that has been updated or 404 if
  *the id provided in the request params id does not match an existing request
  */
  updateARequest: function updateARequest(request, response) {
    var requestid = request.params.requestid;
    var reqBody = request.reqBody,
        decodedUser = request.decodedUser;

    var updateStatement = Object.keys(request.reqBody).map(function (key) {
      return key + ' = \'' + reqBody[key] + '\'';
    }).join(',');
    (0, _DatabaseHelpers.RequestsDatabaseHelper)(request, response, 'UPDATE REQUESTS SET last_edited = $1,' + updateStatement + ' where userid = \'' + decodedUser.user.id + '\' and status = \'Not Approved/Rejected\' and id = \'' + requestid + '\' RETURNING *;', 'You do not have any request on TrackerHero with that id', 'update a request', [new Date()], 'Your request has been updated.');
  },
  /**
  * It updates a request by chnging the status for admins
  * @param {object} request - request object containing params and body
  * @param {object} response - response object that conveys the result of the request
  * @returns {object} - response object that has a status code of 200 and
  * a repair or maintenance request that has been updated or 404 if
  *the id provided in the request params id does not match an existing request
  */
  updateARequestAdmin: function updateARequestAdmin(request, response) {
    var requestid = request.params.requestid;
    var reqBody = request.reqBody,
        status = request.status;

    var query = void 0,
        values = void 0;
    if (status === 'Resolved') {
      query = 'UPDATE REQUESTS SET date_resolved = $1,last_edited = $2,status = $3,reason = $4  where id = \'' + requestid + '\' RETURNING *;';
      values = [new Date(), new Date(), status, reqBody.reason];
    } else {
      query = 'UPDATE REQUESTS SET last_edited = $1,status = $2,reason = $3  where id = \'' + requestid + '\' RETURNING *;';
      values = [new Date(), status, reqBody.reason];
    }
    (0, _DatabaseHelpers.RequestsDatabaseHelper)(request, response, query, 'Request not found', 'update a request', values, 'The request has been updated.');
  }
};
exports.default = Requests;