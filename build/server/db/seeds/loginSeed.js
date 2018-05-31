'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loginValuesAdmin = exports.loginColumns = exports.loginValues = undefined;

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loginColumns = '\n  ID,\n  FIRST_NAME,\n  LAST_NAME,\n  EMAIL,\n  PASSWORD,\n  JOB_TITLE,\n  DEPARTMENT,\n  PROFILE,\n  LOCATION,\n  UPGRADE_ID\n';
var loginValues = [(0, _v2.default)(), 'Oyindamola', 'Aderinwale', 'aderinwale17@gmail.com', _bcrypt2.default.hashSync('test_password', 8), 'King slayer', 'Guardians', 'User', '4 Tawdry Lane', (0, _v2.default)()];

var loginValuesAdmin = [(0, _v2.default)(), 'King', 'Arthur', 'arthur@gmail.com', _bcrypt2.default.hashSync('test_password', 8), 'King slayer', 'Guardians', 'Admin', '4 Tawdry Lane', (0, _v2.default)()];
exports.loginValues = loginValues;
exports.loginColumns = loginColumns;
exports.loginValuesAdmin = loginValuesAdmin;