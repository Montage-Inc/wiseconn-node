const summaryRequestPath = 'rest/read/summary';

const SummaryService = {
	getSummary,
};

export default SummaryService;

function getSummary(session) {
	return session.requestData(summaryRequestPath)
		.then(summary => {
			summary.measure.ids = summary.measure.map(measure => measure.id);

			return summary.measure;
		});
}
