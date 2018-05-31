'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestsValues = exports.requestsColumns = undefined;

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _loginSeed = require('./loginSeed');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requestsColumns = '\nid,\ntitle,\ndescription,\nstatus,\ntype,\ndate_submitted,\nlast_edited,\nlocation,\nuserid\n';
var requestsValues = [(0, _v2.default)(), 'Broken Toilet', 'The toilet is broken please fix it', 'Not Approved/Rejected', 'Repair', new Date(), new Date(), '4 Tawdry Lane', _loginSeed.loginValues[0], (0, _v2.default)(), 'Broken Lightbulb', 'The lightbulb is broken please fix it', 'Not Approved/Rejected', 'Repair', new Date(), new Date(), '7 brammal lane', _loginSeed.loginValues[0], (0, _v2.default)(), 'Broken faucet', 'The tap is broken', 'Not Approved/Rejected', 'Repair', new Date(), new Date(), '6 brammal lane', _loginSeed.loginValues[0], (0, _v2.default)(), 'Broken chair', 'The chair is broken please fix it', 'Approved', 'Repair', new Date(), new Date(), '8 brammal lane', _loginSeed.loginValues[0]];
exports.requestsColumns = requestsColumns;
exports.requestsValues = requestsValues;