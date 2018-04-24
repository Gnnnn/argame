'use strict';
/**
 * Created by Koan on 17/9/29.
 */
var async = require('async');
var apnsPush = require('./apns');

module.exports = {
	sendPush: function (note, callback) {
		async.parallel({
			apns: async.apply(apnsPush, note)
		}, function (err, results) {
			if (err) {
				return callback(err);
			}
			callback(null, {
				ios: results.apns
			});
		});
	}
};