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
		const url = queryParameters ? path + queryString.stringify(queryParameters) : path;
		const newPassword = this.getEncryptedPassword(this.token + queryCount);
		const requestOptions = this.setRequestOptions(url, 'GET', newPassword);

		return this.makeRequest(requestOptions)
			.then(response => {
				queryCount += 1;

				return response;
			})
			.catch(error => {
			});
	}



	}

	makeRequest(options) {
		return new Promise((resolve, reject) => {
			const request = http.request(options, response => {
				if (response.statusCode < 200 || response.statusCode > 299) {
					reject(new Error(`Failed to load page, status code: ${response.statusCode}`));
				}

				let data = '';
				response.on('data', body => {
					data += body;
				});

				response.on('end', () => {
					const parsedData = JSON.parse(data);

					if (parsedData.ERRCode) reject(parsedData);

					resolve(parsedData);
				});
			});

			request.on('error', (err) => {
				reject(err)
			});

			request.end();
		});
	}
};
