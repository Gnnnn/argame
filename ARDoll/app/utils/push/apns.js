'use strict';
/**
 * Created by Koan on 17/9/29.
 */
var async = require('async'),
	path = require('path'),
	apn = require('apn'),
	PushDevice = require('../../models/pushDevice'),
	configs = require('../../utils/appConfig');

// var apnProvider = new apn.Provider({
// 	token: {
// 		key   : path.resolve(__dirname, 'ARDoll_PushService.pem'),
// 		keyId : configs.push.ios.kid,
// 		teamId: configs.push.ios.teamId
// 	}
// });

function getAllPushDevices(start, limit, deviceTokens, callback) {
	deviceTokens = deviceTokens || [];
	start = start || 0;
	limit = limit || 5000;
	//分页查询
	PushDevice.find({}, {deviceId: 1}).skip(start).limit(limit).exec(function (err, docs) {
		if (err) {
			return callback(err);
		}
		if (!docs || docs.length === 0) {
			return callback(null, deviceTokens);
		}
		docs.forEach(function (doc) {
			deviceTokens.push(doc.deviceId);
		});
		getAllPushDevices(start + docs.length, limit, deviceTokens, callback);
	});
}

function sendPush(obj, callback) {
	// send push here
	var note = new apn.Notification();
// 	note.payload = {
// 		url: obj.url
// 	};
	note.topic = configs.push.packageId;   // destination topic
	note.contentAvailable = 1;
	note.title = obj.title;
	note.body = obj.description;
	note.category = obj.type;
	note.expiry = obj.expiry;    // 到期时间（若没推送到APNS，则继续，直到该时间。0表示立刻推送，失败后也不继续）
	note.priority = obj.priority || 5;   // 5或10
	note.badge = 1;

	async.waterfall([
		async.apply(getAllPushDevices, 0, 5000, [])
	], function (err, deviceTokens) {
		if (err) {
			return callback(err);
		}
		if (!deviceTokens || deviceTokens.length === 0) {
			return callback(null);
		}
		callback(null);
// 		apnProvider.send(note, deviceTokens).then(
// 			function (res) {
// 				return callback(null);
// 			},
// 			function (err) {
// 				return callback(err);
// 			}
// 		);
	});
}

module.exports = sendPush;