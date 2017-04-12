const summaryRequestPath = 'rest/read/summary';

module.exports = {
	getSummary,
};

function getSummary(session) {
	return session.requestData(summaryRequestPath)
		.then(summary => {
			summary.measure.ids = summary.measure.map(measure => measure.id);
			return summary.measure;
		});
}
