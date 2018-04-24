'use strict';
/**
 * Created by gogoout on 16/12/7.
 */
var async = require('async'),
	PushDevice = require('../models/pushDevice');

module.exports = {
	pushDeviceTransformer: function (req) {
		var reqBody = req.body;
		if (reqBody) {
			delete reqBody.visitor;
			reqBody.updateTime = new Date();
			reqBody.type = 'ios';
			reqBody.visitor = req.visitor ? req.visitor._id : '';
		}
	},
	pushDeviceCreate     : function (req, callback) {
		// 先查找是否已经添加过deviceId,因为deviceId每次app打开都会重新上传
		async.waterfall([
			PushDevice.findOne.bind(PushDevice, {deviceId: req.body.deviceId}),
			function (result, aCallback) {
				if (result) {
					result.visitor = req.body.visitor;
					result.updateTime = req.body.updateTime;
					result.type = req.body.type;
					aCallback(null, result);
				}
				else {
					aCallback(null, new PushDevice(req.body));
				}
			}
		], function (err, result) {
			if (err) {
				return callback(err);
			}
			result.save(callback[201]);
		});
	},
	pushDeviceUserUpdate : function (req, callback) {
		PushDevice.findOne({deviceId: req.params.deviceId}, function (err, result) {
			if (err || !result) {
				return callback(err || 404);
			}
			result.visitor = req.visitor ? req.visitor._id : '';
			result.updateTime = req.body.updateTime;
			result.save(callback[201]);
		});
	},
	pushDeviceUserDelete : function (req, callback) {
		PushDevice.findOne({deviceId: req.params.deviceId}, function (err, result) {
			if (err || !result) {
				return callback(err || 404);
			}
			result.visitor = null;
			result.updateTime = req.body.updateTime;
			result.save(callback[204]);
		});
	}
};