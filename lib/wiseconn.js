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
			this.measureIds = response.ids;
			return response;
		});
	}

	getData(requestMethod) {
		this.queryParameters.ids = this.measureIds;
		return SensorDataService[requestMethod](this.session, this.queryParameters);

	prepareQuery(queryFilters) {
		return queryFilters ? Object.assign(this.queryParameters, queryFilters) : this.queryParameters;
	}
};
