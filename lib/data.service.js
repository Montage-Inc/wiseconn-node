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
		.then(measures => measures.measure
			.filter(measure => measure.value.length)
			.map(measure => {
				measure.data = createDataPoints(measure.value, queryParameters);
				delete measure.value;
				return measure;
			}));
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

function createDataPoints(data, query) {
	const initTime = query.initTime.replace(/\//g, '-'); // moment.js requires '-' instead of '/'
	const intervals = ['hours', 'days', 'months'];

	return data.map((value, index) => {
		const time = index === 0
			? moment(initTime).valueOf()
			: moment(initTime).add(index, intervals[query.idInterval]).valueOf();

		return { time, value };
	});
}

function convertDatesToUnixTimestamps(data) {
	return data.map(dataPoint => {
		dataPoint.time = new Date(dataPoint.time).getTime();
		return dataPoint;
	});
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
