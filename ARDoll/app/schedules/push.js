'use strict';
/**
 * Created by Koan on 17/9/29.
 */
var async = require('async'),
	Push = require('../models/push'),
	pushCtrl = require('../controllers/push'),
	logger = require('../utils/logger');

function getPush(data, callback) {
	if (data.id) {
		Push.findById(data.id, function (err, result) {
			if (err || !result) {
				return callback(err || '找不到指定推送任务');
			}
			return callback(null, result.toObject());
		});
	}
	else {
		return callback('没有提供push的内容');
	}
}

module.exports = function (agenda) {
	agenda.define('push', {priority: 'highest'}, function (job, done) {
		var data = job.attrs.data;
		async.waterfall([
			async.apply(getPush, data),
			pushCtrl.sendPush.bind(pushCtrl)
		], function (err) {
			if (err) {
				logger.error(err);
				return done(err);
			}
			done();
		});
	});
	agenda.jobDefines.PUSH = 'push';
};