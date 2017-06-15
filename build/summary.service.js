'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var summaryRequestPath = 'rest/read/summary';

var SummaryService = {
	getSummary: getSummary
};

exports.default = SummaryService;


function getSummary(session) {
	return session.requestData(summaryRequestPath).then(function (summary) {
		summary.measure.ids = summary.measure.map(function (measure) {
			return measure.id;
		});

		return summary.measure;
	});
}