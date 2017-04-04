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

	async getMeasures() {
		const measuresSummary = await MeasureService.getSummary(this.session);
		this.measureIds = measuresSummary.ids;
		return measuresSummary;
	}

	getData(requestMethod) {
		this.queryParameters.ids = this.measureIds;
		return SensorDataService[requestMethod](this.session, this.queryParameters);
	}
};
