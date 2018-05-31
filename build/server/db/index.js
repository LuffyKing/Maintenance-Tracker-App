'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectionString = exports.pool = undefined;

var _pg = require('pg');

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

var _loginSeed = require('./seeds/loginSeed');

var _requestsSeed = require('./seeds/requestsSeed');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var env = process.env.NODE_ENV || 'development';
var config = _config2.default[env];
var connectionString = config.DATABASE_URL || process.env.DATABASE_URL;
var pool = new _pg.Pool({
  connectionString: connectionString
});
pool.connect(function (err, client, done) {
  if (err) {
    throw err;
  }
  if (process.env.NODE_ENV) {
    client.query('INSERT INTO USERS(ID,FIRST_NAME,LAST_NAME,EMAIL,PASSWORD,JOB_TITLE,DEPARTMENT,PROFILE,LOCATION,UPGRADE_ID) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);', _loginSeed.loginValues, function (error) {
      done();
      if (error) {
        return error;
      }
      client.query('INSERT INTO REQUESTS(' + _requestsSeed.requestsColumns + ') VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9),($10,$11,$12,$13,$14,$15,$16,$17,$18),($19,$20,$21,$22,$23,$24,$25,$26,$27),($28,$29,$30,$31,$32,$33,$34,$35,$36);', _requestsSeed.requestsValues, function (error1) {
        if (error1) throw error1;
        done();

        client.query('INSERT INTO USERS(ID,FIRST_NAME,LAST_NAME,EMAIL,PASSWORD,JOB_TITLE,DEPARTMENT,PROFILE,LOCATION,UPGRADE_ID) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);', _loginSeed.loginValuesAdmin, function (error2) {
          if (error1) throw error2;
          done();
        });
      });
    });
  }
});
exports.pool = pool;
exports.connectionString = connectionString;