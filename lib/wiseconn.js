import Session from './session.js';
import SummaryService from './summary.service.js';
import DataService from './data.service.js';

export default class Wiseconn {
	constructor(credentials, queryParameters = {}) {
		this.credentials = credentials;
		this.queryParameters = queryParameters;
	}

	getStatus() {
		return this.session.getStatus();
	}

	getMeasures() {
		return Session.login(this.credentials)
			.then(session => {
				this.session = session;
				return SummaryService.getSummary(this.session);
			})
			.then(response => {
				this.queryParameters.ids = response.ids;
				delete response.ids;
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
}
