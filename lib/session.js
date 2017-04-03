const crypto      = require('crypto');
const moment      = require('moment');
const http        = require('http');
const queryString = require('querystring');

const basePath = 'api.wiseconn.com:8080/WiseApi/';

let queryCount = 0;

export class Session {

	async login (credentials) {
		this.username = credentials.username;

		const loginPassword = this.getEncryptedPassword(credentials.password);
		const options = this.setRequestOptions('Auth/login', 'POST', loginPassword);
		this.token = await this.makeRequest(options);

		return new Session();
	}

	async requestData(path, queryParameters) {
		const url = queryParameters ? path + queryString.stringify(queryParameters) : path;
		const newPassword = this.getEncryptedPassword(this.token + queryCount);
		const requestOptions = this.setRequestOptions(url, 'GET', newPassword);

		try {
			const data = await this.makeRequest(requestOptions);

			queryCount += 1;
			return data;
		}
			catch(err) {
		}
	}

	getEncryptedPassword(password) {
		const newPassword = password +  moment.utc().format('YYYYMMDD');
		const hash = crypto.createHash('sha1');
		const hashedPassword = hash.update(newPassword);
		const cipher = crypto.createCipher('aes192', hashedPassword);

		return cipher.final('base64');
	}

	setRequestOptions(path, method, password) {
		return {
			hostname: basePath,
			port: 8080,
			path,
			method,
			headers: {
				'Content-Type' : 'application/json',
				'username'     : this.username,
				'password'     : password,
			},
		};
	}

	async makeRequest(options) {
		return http.request(options).end();
	}
}
