const http        = require('http');
const moment      = require('moment');
const queryString = require('querystring');

const RequestService = require('./request.service.js');

const loginPath = 'Auth/login';
const authStatusPath = 'Auth/status';

module.exports = class Session {

	login(credentials) {
		this.username = credentials.username;
	constructor(username, token) {
		this.username = username;
		this.token = token;
		this.queryCount = 1;
	}

		const loginPassword = this.getEncryptedPassword(credentials.password);
		const options = this.setRequestOptions(loginPath, 'POST', loginPassword);

		this.makeRequest(options)
			.then(response => {
				if (response.token) this.token = response.token;
			})
			.catch(error => {
				console.log('login error = ', error);
			});

		return new Session();
	}

	requestData(path, queryParameters) {
		const newPassword = this.getEncryptedPassword(this.token + queryCount);
		const requestOptions = this.setRequestOptions(url, 'GET', newPassword);

		return Session.makeRequest(requestOptions)
			.then(response => {
				queryCount += 1;

				return response;
			})
			.catch(error => {
			});
	}

		const url = queryParameters
			? `${path}?${queryString.stringify(queryParameters)}`
			: path;


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
