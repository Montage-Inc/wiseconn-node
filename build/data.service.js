'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
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
		return measures.measure.map(function (measure) {
			return changeKeyName(measure, 'value', 'data');
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

function changeKeyName(objectSource, oldName, newName) {
	var objectCopy = Object.assign({}, objectSource);

	objectCopy[newName] = objectSource[oldName];
	delete objectCopy[oldName];

	return objectCopy;
}

function convertDatesToUnixTimestamps(data) {
	if (data.length) {
		return data.map(function (dataPoint) {
			dataPoint.time = new Date(dataPoint.time).getTime();
			return dataPoint;
		});
	}
	return data;
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