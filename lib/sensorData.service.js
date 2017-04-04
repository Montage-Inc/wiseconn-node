const dataRequestPath     = '/WiseApi/rest/read/data';
const lastDataRequestPath = '/WiseApi/rest/read/lastData';

const SensorDataService = () => {
	return {
		getData : (session, queryParameters) => {
			return session.requestData(dataRequestPath, queryParameters);
		},

		getLastData : (session, queryParameters) => {
			return session.requestData(lastDataRequestPath, queryParameters);
		},
	}
};
