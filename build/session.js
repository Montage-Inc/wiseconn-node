'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _requestService = require('./request.service.js');

var _requestService2 = _interopRequireDefault(_requestService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var loginPath = 'Auth/login';
var authStatusPath = 'Auth/status';

var Session = function () {
	function Session(username, token) {
		_classCallCheck(this, Session);

		this.username = username;
		this.token = token;
		this.queryCount = 1;
	}

	_createClass(Session, [{
		key: 'getStatus',
		value: function getStatus() {
			var requestOptions = _requestService2.default.prepareRequest(authStatusPath, this.username, this.token + this.queryCount);

			return Session.makeRequest(requestOptions).then(function (response) {
				return response.status;
			});
		}
	}, {
		key: 'requestData',
		value: function requestData(path, queryParameters) {
			var _this = this;

			var url = queryParameters ? path + '?' + _querystring2.default.stringify(queryParameters) : path;

			var tokenWithQueryCount = this.token + this.queryCount;
			var requestOptions = _requestService2.default.prepareRequest(url, this.username, tokenWithQueryCount);

			return Session.makeRequest(requestOptions).then(function (response) {
				_this.queryCount += 1;
				return response;
			});
		}
	}], [{
		key: 'login',
		value: function login(credentials) {
			var passwordWithCurrentDate = credentials.password + _moment2.default.utc().format('YYYYMMDD');
			var loginOptions = _requestService2.default.prepareRequest(loginPath, credentials.username, passwordWithCurrentDate);

			return Session.makeRequest(loginOptions).then(function (response) {
				if (response.token) return new Session(credentials.username, response.token);
			});
		}
	}, {
		key: 'makeRequest',
		value: function makeRequest(options) {
			return new Promise(function (resolve, reject) {
				var request = _http2.default.request(options, function (response) {
					if (response.statusCode < 200 || response.statusCode > 299) {
						console.log('response = ', response);
						var errorMessage = 'Failed to load page, status code: ' + response.statusCode + ',\n status message: ' + response.statusMessage;
						return reject(new Error(errorMessage));
					}

					response.on('error', function (err) {
						return reject(err);
					});

					var data = '';
					response.on('data', function (body) {
						data += body;
					});

					response.on('end', function () {
						var parsedData = JSON.parse(data);

						if (parsedData.ERRCode) {
							console.log('parsedData = ', parsedData);
							var _errorMessage = 'Failed to retrieve data, error code: ' + parsedData.ERRCode + ',\n error description: ' + parsedData.description;
							return reject(new Error(_errorMessage));
						}

						resolve(parsedData);
					});
				});

				request.on('error', function (err) {
					return reject(err);
				});

				request.end();
			});
		}
	}]);

	return Session;
}();

exports.default = Session;
;