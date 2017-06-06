import moment from 'moment';

const dataRequestPath     = 'rest/read/data';
const lastDataRequestPath = 'rest/read/lastData';
const allDataRequestPath  = 'rest/read/allData';

const DataService = {
	getData,
	getAllData,
	getLastData,
};

export default DataService;

function getData(session, queryParameters) {
	return session.requestData(dataRequestPath, queryParameters)
		.then(measures => {
			return measures.measure.map(measure => changeKeyName(measure, 'value', 'data'));
		});
}

function getAllData(session, queryParameters) {
	return session.requestData(allDataRequestPath, queryParameters)
		.then(response => response.measure
			.filter(measure => measure.data.length)
			.map(measure => {
				measure.data = convertDatesToUnixTimestamps(measure.data);
				return measure;
			}));
}

function getLastData(session, queryParameters) {
	return session.requestData(lastDataRequestPath, queryParameters)
		.then(measures => {
			return measures.measure.map(measure => createDataPointObject(measure));
		});
}



}

function convertDatesToUnixTimestamps(data) {
	if (data.length) {
		return data.map(dataPoint => {
			dataPoint.time = new Date(dataPoint.time).getTime();
			return dataPoint;
		});
	}
	return data;
}

function createDataPointObject(measure) {
	const measureCopy = Object.assign({}, measure);

	measureCopy.data = {
		time  : new Date(measure.time).getTime(),
		value : measure.value,
	};

	delete measureCopy.time;
	delete measureCopy.value;

	return measureCopy;
}
