const dataRequestPath     = '/WiseApi/rest/read/data';
const lastDataRequestPath = '/WiseApi/rest/read/lastData';

const SensorDataService = () => {
	return {
		getData : (session, queryParameters) => {
			return session.requestData(dataRequestPath, queryParameters)
				.then(measures => {
					return measures.measure.map(measure => changePropertyName(measure, 'value', 'data'));
				});
		},

		},

		getLastData : session => {
			return session.requestData(lastDataRequestPath)
				.then(measures => {
					return measures.measure.map(measure => createDataPointObject(measure));
				});
		},
	};
};

function changePropertyName(arrayObject, oldName, newName) {
	const objectCopy = Object.assign({}, arrayObject);

	objectCopy[newName] = arrayObject[oldName];
	delete objectCopy[oldName];

	return objectCopy;
}

function createDataPointObject(measure) {
	const measureCopy = Object.assign({}, measure);

	measureCopy.data = {
		time  : measure.time,
		value : measure.value,
	};
	delete measureCopy.time;
	delete measureCopy.value;

	return measureCopy;
}