'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hostname = 'api.wiseconn.com';
var port = '8080';
var basePath = '/WiseApi/';

var RequestService = {
	prepareRequest: prepareRequest,
	getEncodedPassword: getEncodedPassword,
	setRequestOptions: setRequestOptions
};

exports.default = RequestService;


function prepareRequest(path, username, password) {
	var requestPassword = getEncodedPassword(password);
	return setRequestOptions(path, username, requestPassword);
}

function getEncodedPassword(password) {
	return _crypto2.default.createHash('sha1').update(password).digest('base64');
}

function setRequestOptions(path, username, password) {
	var method = path === 'Auth/login' ? 'POST' : 'GET';

	return {
		method: method,
		hostname: hostname,
		port: port,
		path: basePath + path,
		headers: {
			'Accept': 'application/json',
			'username': username,
			'password': password
		}
	};
}