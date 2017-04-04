const crypto      = require('crypto');
const moment      = require('moment');
const http        = require('http');
const queryString = require('querystring');

const hostname = 'api.wiseconn.com';
const port = '8080';

let queryCount = 0;

module.exports = class Session {

	login(credentials) {
		this.username = credentials.username;

		const loginPassword = this.getEncryptedPassword(credentials.password);
		const options = this.setRequestOptions('/WiseApi/Auth/login', 'POST', loginPassword);

		this.makeRequest(options)
			.then(response => {
				if (response.token) this.token = response.token;
			})
			.catch(error => {
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

	getEncryptedPassword(password) {
		const newPassword = password +  moment.utc().format('YYYYMMDD');
		const hashedPassword = crypto.createHash('sha1')
			.update(newPassword, 'utf-8')
			.digest('hex');
		const cipher = crypto.createCipher('aes192', hashedPassword);

		return cipher.final('base64');
	}

	setRequestOptions(path, method, password) {
		return {
			hostname,
			port,
			path,
			method,
			headers : {
				'Accept'   : 'application/json',
				'username' : this.username,
				'password' : password,
			},
		};
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
