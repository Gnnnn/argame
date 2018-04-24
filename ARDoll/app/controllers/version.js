/**
 * Created by Koan on 2017/9/21.
 */
'use strict';

var Version = require('../models/version'),
	config = require('../utils/appConfig');

function versionCompare(newVer, oldVer) {
	if (!oldVer) {
		return true;
	}
	if (!newVer) {
		return false;
	}
	var newVerArr = newVer.split('.'),
		oldVerArr = oldVer.split('.'),
		diff = 0;
	for (var position = 0; position < Math.min(newVerArr.length, oldVerArr.length); position++) {
		diff = parseInt(newVerArr[position], 10) - parseInt(oldVerArr[position], 10);
		if (diff < 0) {
			return false;
		}
		else if (diff > 0) {
			return true;
		}
	}
	if (diff === 0 && newVerArr.length <= oldVerArr.length) {
		return false;
	}
	return true;
}

module.exports = {
	versionCreateTransformer: function (req) {
		var reqBody = req.body;
		if (reqBody) {
			delete reqBody.uploadTime;
			reqBody.uploadTime = new Date();
			reqBody.user = req.me._id;
		}
	},
	createNewVersion        : function (req, callback) {
		Version.findOne({}, null, {sort: {_id: -1}}, function (err, oldVersion) {
			if (err) {
				return callback(err);
			}
			var newVersion = new Version(req.body);
			if (oldVersion && !versionCompare(newVersion.version, oldVersion.version)) {
				return callback('版本号不能低于上次的版本！');
			}
			return newVersion.save(callback[201]);
		});
	},
	getLastestVersion       : function (req, callback) {
		Version.findOne({}, {
			version   : 1,
			uploadTime: 1,
			updateNews: 1
		}).sort('-_id').exec(function (err, lastestVersion) {
			if (err) {
				return callback(err);
			}
			var rtnObj = lastestVersion.toObject();
			rtnObj.censorshipVersion = config.censorshipVersion;
			rtnObj.censorshipVersionAndroid = config.censorshipVersionAndroid;
			rtnObj.vs = config.vs;
			return callback(null, rtnObj);
		});
	}
};