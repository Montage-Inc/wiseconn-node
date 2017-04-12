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
		return Session.login(this.credentials)
			.then(session => {
				this.session = session;
				return SummaryService.getSummary(this.session)
			})
			.then(response => {
				this.queryParameters.ids = response.ids;
				return response;
			});
	}

	getData(queryFilters) {
		return DataService.getData(this.session, this.mergeQueryParameters(queryFilters));
	}

	getAllData(queryFilters) {
		return DataService.getAllData(this.session, this.mergeQueryParameters(queryFilters));
	}

	getLastData() {
		return DataService.getLastData(this.session, this.queryParameters);
	}

	mergeQueryParameters(queryFilters) {
		return queryFilters ? Object.assign(this.queryParameters, queryFilters) : this.queryParameters;
	}
};
