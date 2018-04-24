'use strict';
/**
 * Created by gogoout on 15/6/24.
 */
var crypto = require('crypto'),
	config = require('./appConfig');

module.exports = {
	encryptToken: function (data) {
		// add some random so everytime the token will be different
		data.unshift(crypto.randomBytes(8).toString('base64'));
		var cipher = crypto.createCipher('aes-256-cbc', config.tokenCipher);
		var crypted = cipher.update(data.join('|^|'), 'utf8', 'hex');
		crypted += cipher.final('hex');
		return crypted;
	},
	decryptToken: function (token) {
		var decipher = crypto.createDecipher('aes-256-cbc', config.tokenCipher);
		var decrypted = decipher.update(token, 'hex', 'utf-8');
		decrypted += decipher.final('utf-8');
		var data = decrypted.split('|^|');
		// drop the random
		data.shift();
		return data;
	}
};