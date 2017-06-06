'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dataRequestPath = 'rest/read/data';
var lastDataRequestPath = 'rest/read/lastData';
var allDataRequestPath = 'rest/read/allData';

var DataService = {
	getData: getData,
	getAllData: getAllData,
	getLastData: getLastData
};

exports.default = DataService;


function getData(session, queryParameters) {
	return session.requestData(dataRequestPath, queryParameters).then(function (measures) {
		return measures.measure.filter(function (measure) {
			return measure.value.length;
		}).map(function (measure) {
			measure.data = createDataPoints(measure.value, queryParameters);
			delete measure.value;
			return measure;
		});
	});
}

function getAllData(session, queryParameters) {
	return session.requestData(allDataRequestPath, queryParameters).then(function (response) {
		return response.measure.filter(function (measure) {
			return measure.data.length;
		}).map(function (measure) {
			measure.data = convertDatesToUnixTimestamps(measure.data);
			return measure;
		});
	});
}

function getLastData(session, queryParameters) {
	return session.requestData(lastDataRequestPath, queryParameters).then(function (measures) {
		return measures.measure.map(function (measure) {
			return createDataPointObject(measure);
		});
	});
}

function createDataPoints(data, query) {
	var initTime = query.initTime.replace(/\//g, '-'); // moment.js requires '-' instead of '/'
	var intervals = ['hours', 'days', 'months'];

	return data.map(function (value, index) {
		var time = index === 0 ? (0, _moment2.default)(initTime).valueOf() : (0, _moment2.default)(initTime).add(index, intervals[query.idInterval]).valueOf();

		return { time: time, value: value };
	});
}

function convertDatesToUnixTimestamps(data) {
	return data.map(function (dataPoint) {
		// const date = new Date(dataPoint.time);
		// dataPoint.time = moment(date).format('MMMM Do YYY, h:mm');

		dataPoint.time = new Date(dataPoint.time).getTime();
		return dataPoint;
	});
}

function createDataPointObject(measure) {
	var measureCopy = Object.assign({}, measure);

	measureCopy.data = {
		time: new Date(measure.time).getTime(),
		value: measure.value
	};

	delete measureCopy.time;
	delete measureCopy.value;

	return measureCopy;
}