'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('babel-polyfill');

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _badApiRequest = require('./router/badRequests/badApiRequest');

var _badApiRequest2 = _interopRequireDefault(_badApiRequest);

var _config = require('./config/config');

var _config2 = _interopRequireDefault(_config);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _UIRouter = require('./UIRouter');

var _UIRouter2 = _interopRequireDefault(_UIRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var env = process.env.NODE_ENV || 'development';

var config = _config2.default[env];

var app = (0, _express2.default)();
app.use(_express2.default.static(_path2.default.resolve(__dirname, '../../client/UI')));
app.use(_express2.default.static(_path2.default.resolve(__dirname, './UI')));
var port = process.env.PORT || config.PORT;

app.use((0, _cors2.default)({ credentials: true, origin: true }));

app.use(_bodyParser2.default.json());

app.use(_bodyParser2.default.urlencoded({ extended: false }));

app.use((0, _morgan2.default)('dev'));

app.use('/api/v1', _router2.default);

app.use('/', _UIRouter2.default);

app.use(_badApiRequest2.default);

app.listen(port);

exports.default = app;