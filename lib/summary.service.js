const summaryRequestPath = 'rest/read/summary';

const MeasureService = () => {
	return {
		getSummary : session => {
			return session.requestData(summaryRequestPath)
				.then(summary => {
					summary.measure.ids = summary.measure.map(measure => measure.id);
					return summary.measure;
				});
		}
	};
};

module.exports = MeasureService;
