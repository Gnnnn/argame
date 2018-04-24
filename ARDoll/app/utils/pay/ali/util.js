var xml2js = require('xml2js'),
	crypto = require('crypto');

function makeSignStr(params) {
	var omit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['sign', 'sign_type'];
	return Object.keys(params).sort().filter(function (key) {
		return params[key] && omit.indexOf(key) === -1;
	}).map(function (key) {
		var value = params[key];
		return key + '=' + value + '';
	}).join('&').trim();
}

function signAlgorithm(signType) {
	return {
		RSA : "RSA-SHA1",
		RSA2: "RSA-SHA256"
	}[signType];
}

exports.verifySign = function (params, publicKey) {
	var sign = params.sign;
	var signStr = makeSignStr(params);
	var algorithm = signAlgorithm(params.sign_type);
	var verify = crypto.createVerify(algorithm);
	verify.update(signStr, params.charset);
	return verify.verify(publicKey, sign, 'base64');
};