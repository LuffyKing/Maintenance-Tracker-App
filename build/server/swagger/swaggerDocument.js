'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yamljs = require('yamljs');

var _yamljs2 = _interopRequireDefault(_yamljs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var swaggerDocument = _yamljs2.default.load('./server/swagger.yaml');
exports.default = swaggerDocument;