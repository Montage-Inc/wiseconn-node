const summaryRequestPath = '/WiseApi/rest/read/summary';

const MeasureService = () => {
	return {
		getSummary : session => {
			return session.requestData(summaryRequestPath)
				.then(summary => {
					summary.ids = summary.measure.map(measure => measure.id);
					return summary;
				});
		}
	};
};

module.exports = MeasureService;
