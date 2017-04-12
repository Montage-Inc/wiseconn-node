const http        = require('http');
const moment      = require('moment');
const queryString = require('querystring');

const RequestService = require('./request.service.js');

const loginPath = 'Auth/login';
const authStatusPath = 'Auth/status';

module.exports = class Session {

	constructor(username, token) {
		this.username = username;
		this.token = token;
		this.queryCount = 1;
	}

	static login(credentials) {
		const passwordWithCurrentDate = credentials.password + moment.utc().format('YYYYMMDD');
		const loginOptions = RequestService.prepareRequest(loginPath, credentials.username, passwordWithCurrentDate);

		this.makeRequest(options)
			.then(response => {
				if (response.token) this.token = response.token;
			});

		return new Session();
	}

	requestData(path, queryParameters) {
	getStatus() {
		const requestOptions = RequestService.prepareRequest(authStatusPath, this.username, this.token + this.queryCount);

		return Session.makeRequest(requestOptions)
			.then(response => {
				return response.status;
			});
	}

		const url = queryParameters
			? `${path}?${queryString.stringify(queryParameters)}`
			: path;

		const tokenWithQueryCount = this.token + this.queryCount;
		const requestOptions = RequestService.prepareRequest(url, this.username, tokenWithQueryCount);

		return Session.makeRequest(requestOptions)
			.then(response => {
				this.queryCount += 1;
				return response;
			});
	}

	static makeRequest(options) {
		return new Promise((resolve, reject) => {
			const request = http.request(options, response => {
				if (response.statusCode < 200 || response.statusCode > 299) {
					const errorMessage = `Failed to load page, status code: ${response.statusCode},\n status message: ${response.statusMessage}`;
					return reject(new Error(errorMessage));
				}

				response.on('error', (err) => {
					return reject(err);
				});

				let data = '';
				response.on('data', body => {
					data += body;
				});

				response.on('end', () => {
					const parsedData = JSON.parse(data);

					if (parsedData.ERRCode) {
						const errorMessage = `Failed to retrieve data, error code: ${parsedData.ERRCode},\n error description: ${parsedData.description}`;
						return reject(new Error(errorMessage));
					}

					resolve(parsedData);
				});

			});

			request.on('error', (err) => {
				return reject(err);
			});

			request.end();
		});
	}
};
