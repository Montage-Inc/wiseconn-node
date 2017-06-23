'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _session = require('./session.js');

var _session2 = _interopRequireDefault(_session);

var _summaryService = require('./summary.service.js');

var _summaryService2 = _interopRequireDefault(_summaryService);

var _dataService = require('./data.service.js');

var _dataService2 = _interopRequireDefault(_dataService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Wiseconn = function () {
	function Wiseconn(credentials) {
		var queryParameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		_classCallCheck(this, Wiseconn);

		this.credentials = credentials;
		this.queryParameters = queryParameters;
	}

	_createClass(Wiseconn, [{
		key: 'getStatus',
		value: function getStatus() {
			return this.session.getStatus();
		}
	}, {
		key: 'getMeasures',
		value: function getMeasures() {
			var _this = this;

			return _session2.default.login(this.credentials).then(function (session) {
				_this.session = session;
				return _summaryService2.default.getSummary(_this.session);
			}).then(function (response) {
				_this.queryParameters.ids = response.ids;
				delete response.ids;
				return response;
			}).catch(function (error) {
				console.log('wiseconn-node, wiseconn.js, Session.login(), Error: ', error);
			});
		}
	}, {
		key: 'getData',
		value: function getData(queryFilters) {
			return _dataService2.default.getData(this.session, this.mergeQueryParameters(queryFilters));
		}
	}, {
		key: 'getAllData',
		value: function getAllData(queryFilters) {
			return _dataService2.default.getAllData(this.session, this.mergeQueryParameters(queryFilters)).catch(function (error) {
				console.log('wiseconn-node, wiseconn.js, getAllData(), Error:  = ', error);
			});
		}
	}, {
		key: 'getLastData',
		value: function getLastData() {
			return _dataService2.default.getLastData(this.session, this.queryParameters);
		}
	}, {
		key: 'mergeQueryParameters',
		value: function mergeQueryParameters(queryFilters) {
			return queryFilters ? Object.assign(this.queryParameters, queryFilters) : this.queryParameters;
		}
	}]);

	return Wiseconn;
}();

exports.default = Wiseconn;