const Session           = require('./session.js');
const MeasureService    = require('./measure.service.js');
const SensorDataService = require('./sensorData.service.js');

module.exports = class Wiseconn {
	constructor(credentials, queryParameters = {}) {
		this.credentials = credentials;
		this.queryParameters = queryParameters;
		this.session = new Session();
		this.session.login(this.credentials);
	}

	getMeasures() {
		return MeasureService.getSummary(this.session).then(response => {
			this.queryParameters.ids = response.ids;
			return response;
		});
	}

	getData(queryFilters) {
		return SensorDataService.getData(this.session, this.prepareQuery(queryFilters));
	}

	getAllData(queryFilters) {
		return SensorDataService.getAllData(this.session, this.prepareQuery(queryFilters));
	}

	getLastData() {
		return SensorDataService.getLastData(this.session);
	}

	prepareQuery(queryFilters) {
		return queryFilters ? Object.assign(this.queryParameters, queryFilters) : this.queryParameters;
	}
};
