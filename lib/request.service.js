import crypto from 'crypto';

const hostname = 'api.wiseconn.com';
const port     = '8080';
const basePath = '/WiseApi/';

const RequestService = {
	prepareRequest,
	getEncodedPassword,
	setRequestOptions,
};

export default RequestService;

function prepareRequest(path, username, password) {
	const requestPassword = getEncodedPassword(password);
	return setRequestOptions(path, username, requestPassword);
}

function getEncodedPassword(password) {
	return crypto.createHash('sha1')
		.update(password)
		.digest('base64');
}

function setRequestOptions(path, username, password) {
	const method = path === 'Auth/login'
		? 'POST'
		: 'GET';

	return {
		method,
		hostname,
		port,
		path    : basePath + path,
		headers : {
			'Accept'   : 'application/json',
			'username' : username,
			'password' : password,
		},
	};
}
