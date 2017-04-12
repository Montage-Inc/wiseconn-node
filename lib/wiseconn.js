const Session        = require('./session.js');
const SummaryService = require('./summary.service.js');
const DataService    = require('./data.service.js');

module.exports = class Wiseconn {
	constructor(credentials, queryParameters = {}) {
		this.credentials = credentials;
		this.queryParameters = queryParameters;
		this.session = new Session();
		this.session.login(this.credentials);

	getStatus() {
		return this.session.getStatus();
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
