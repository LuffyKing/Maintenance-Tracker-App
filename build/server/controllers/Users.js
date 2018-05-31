'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _db = require('../db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An  object that handles the requests api operation
 */
var Users = {
  removePassword: function removePassword(user) {
    return Object.keys(user).reduce(function (accumulator, current) {
      if (current !== 'password') {
        accumulator[current] = user[current];
        return accumulator;
      }
      return accumulator;
    }, {});
  },

  /**
  * It gets all the requests on the application
  * @param {object} request - request object containing params and body
  * @param {object} response - response object that conveys the result of the request
  * @returns {object} - response object that has a status code of 200 as long as a
  request is made
  */
  login: function login(request, response) {
    var _request$reqBody = request.reqBody,
        email = _request$reqBody.email,
        password = _request$reqBody.password;

    _db.pool.connect(function (err, client, done) {
      if (err) {
        response.status(500).send({ message: err.stack });
      }
      client.query('SELECT ID,\n        FIRST_NAME,\n        LAST_NAME,\n        EMAIL,\n        PASSWORD,\n        JOB_TITLE,\n        DEPARTMENT,\n        PROFILE,\n        LOCATION from USERS where EMAIL=$1', [email], function (err, result) {
        done();
        if (err) {
          return response.status(500).send({ message: err.stack });
        }
        if (result.rows.length > 0) {
          var user = result.rows[0];
          var newUser = Users.removePassword(user);
          if (_bcrypt2.default.compareSync(password, user.password) === true) {
            var token = _jsonwebtoken2.default.sign({ user: user }, process.env.SECRET_KEY, { expiresIn: '7d' });
            return response.status(200).send({
              message: 'Login successful',
              token: token,
              user: newUser,
              status: 200
            });
          }
          return response.status(401).send({
            message: 'Invalid Username/Password',
            status: 401
          });
        }
        return response.status(401).send({
          message: 'Invalid Username/Password',
          status: 401
        });
      });
    });
  },
  signUp: function signUp(request, response) {
    var newUser = _extends({}, request.reqBody, {
      id: (0, _v2.default)(),
      password: _bcrypt2.default.hashSync(request.reqBody.password, 8),
      profile: 'User',
      upgradeId: (0, _v2.default)()
    });
    _db.pool.connect(function (err, client, done) {
      if (err) response.status(500).send({ message: err.stack });
      client.query('INSERT INTO USERS(ID,FIRST_NAME,LAST_NAME,EMAIL,PASSWORD,JOB_TITLE,DEPARTMENT,PROFILE,LOCATION,UPGRADE_ID)\n        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *;', [newUser.id, newUser.firstName, newUser.lastName, newUser.email, newUser.password, newUser.jobTitle, newUser.department, newUser.profile, newUser.location, newUser.upgradeId], function (err) {
        done();
        if (err) {
          return response.status(500).send({ message: err.stack });
        }
        var token = _jsonwebtoken2.default.sign({ user: newUser }, process.env.SECRET_KEY, { expiresIn: '7d' });
        var newUserNoPassword = Users.removePassword(newUser);
        return response.status(200).send({
          message: 'Signup successful',
          token: token,
          user: newUserNoPassword
        });
      });
    });
  }
};
exports.default = Users;