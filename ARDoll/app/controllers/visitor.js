/**
 * Created by Koan on 2017/9/29.
 */
'use strict';

var _ = require('lodash'),
	async = require('async'),
	crypto = require('crypto'),
	moment = require('moment'),
	OAuth = require('wechat-oauth'),
	Visitor = require('../models/visitor'),
	DailyActive = require('../models/dailyActive'),
	MonthlyActive = require('../models/monthlyActive'),
	AppInfo = require('../models/appInfo'),
	appConfig = require('../utils/appConfig'),
	ExcelExport = require('../utils/excelExport'),
	encryption = require('../utils/encryption'),
	serverUtils = require('../utils/serverUtils'),
	PlayRecord = require('../models/playRecord'),
	DailySign = require('../models/dailySign');

var calcRetentionFuncs = {};
(appConfig.retentionCalcArray || []).forEach(function (dayLength) {
	var func = function (callback) {
		Visitor.find({$where: 'function(){return this.lastActiveDate.getTime()-this.registerDate.getTime()>' + dayLength + '*24*60*60*1000;}'})
			.count(callback);
	};
	calcRetentionFuncs[dayLength.toString()] = func;
});


function getVisitorInfoById(visitorId) {
    visitorId = ObjectId(visitorId)
    return Visitor.find({"_id":visitorId})
}


function totalVisitorCount(callback) {
	Visitor.find().count(callback);
}

calcRetentionFuncs.totalVisitorCount = totalVisitorCount;

function getMonthlyActive(req, callback) {
	MonthlyActive.find({}, {}, callback);
}

function getDailyActive(req, callback) {
	DailyActive.find({}, {}, callback);
}

function encryptVisitorToken(userId, openId, mobileId, salt) {
	var secrets = [userId, openId, mobileId, salt];
	return encryption.encryptToken(secrets);
}

module.exports = {
	visitorSelfUpdateTransformer: function (req) {
		var reqBody = req.body;
		if (reqBody) {
			delete reqBody.visitorId;
			delete reqBody.mobileId;
			delete reqBody.mobileModel;
			delete reqBody.registerDate;
			delete reqBody.lastActiveDate;
			delete reqBody.headImgUrl;
			delete reqBody.openId;
			delete reqBody.name;
			delete reqBody.gender;
			delete reqBody.salt;
			delete reqBody.selfInviteCode;
			delete reqBody.inviteCode;
			delete reqBody.coin;
			delete reqBody.freeCoupons;
			delete reqBody.point;
			delete reqBody.inviteNumber;
		}
	},
	getRetention                : function (req, callback) {
		AppInfo.find({}, {retention: 1, totalVisitors: 1}, function (err, results) {
			if (err) {
				return callback(err);
			}
			if (!results || results.length < 1) {
				return callback('找不到统计数据！');
			}
			callback(err, results[0].retention, results[0].totalVisitors);
		});
	},
	buildRetention              : function (callback) {
		async.parallel(calcRetentionFuncs, function (err, results) {
			if (err) {
				return callback(err);
			}
			var rtnObj = [];
			(appConfig.retentionCalcArray || []).forEach(function (dayLength) {
				rtnObj.push({
					dayLength: dayLength,
					count    : results[dayLength]
				});
			});
			AppInfo.find({}, {}, function (err, infoResults) {
				if (err) {
					return callback(err);
				}
				if (!infoResults || infoResults.length < 1) {
					var newAppInfo = new AppInfo({
						retention    : rtnObj,
						totalVisitors: results.totalVisitorCount,
						buildTime    : new Date()
					});
					newAppInfo.save(callback);
				}
				else {
					var ai = infoResults[0];
					ai.retention = rtnObj;
					ai.totalVisitors = results.totalVisitorCount;
					ai.buildTime = new Date();
					ai.save(callback);
				}
			});
		});
	},
	getDailyActive              : function (req, callback) {
		getDailyActive(req, callback);
	},
	getMonthlyActive            : function (req, callback) {
		getMonthlyActive(req, callback);
	},
	exportDailyActive           : function (req, res, callback) {
		getDailyActive(req, function (err, results) {
			if (err) {
				return callback(err);
			}
			var excelExport = new ExcelExport(),
				sheetName = 'dailyActive',
				cols = [],
				rows = [];
			cols = [
				{
					caption: '日期',
					type   : 'string'
				},
				{
					caption: '活跃数',
					type   : 'number'
				}
			];
			results.forEach(function (active) {
				if (active) {
					rows.push([
						active.day,
						active.count
					]);
				}
			});
			var excelData = excelExport.exportExcel(sheetName, cols, rows);
			res.setHeader('Content-Type', 'application/vnd.openxmlformats');
			res.setHeader('Content-Disposition', 'attachment; filename=' + sheetName + '.xlsx');
			res.write(excelData, 'binary');
			res.end();
		});
	},
	exportMonthlyActive         : function (req, res, callback) {
		getMonthlyActive(req, function (err, results) {
			if (err) {
				return callback(err);
			}
			var excelExport = new ExcelExport(),
				sheetName = 'monthlyActive',
				cols = [],
				rows = [];
			cols = [
				{
					caption: '月份',
					type   : 'string'
				},
				{
					caption: '活跃数',
					type   : 'number'
				}
			];
			results.forEach(function (active) {
				if (active) {
					rows.push([
						active.month,
						active.count
					]);
				}
			});
			var excelData = excelExport.exportExcel(sheetName, cols, rows);
			res.setHeader('Content-Type', 'application/vnd.openxmlformats');
			res.setHeader('Content-Disposition', 'attachment; filename=' + sheetName + '.xlsx');
			res.write(excelData, 'binary');
			res.end();
		});
	},
	userOauthCallback           : function (req, res, next) {
		console.log('success');
		res.redirect('/');
	},
	userOauthJSONCallback       : function (req, res, callback) {
		var user = req.user,
			mobileInfo = req.mobileInfo || {};
		var mobileId = mobileInfo.mobileId || '';
		var inviteCodeNumber = 12961;
		async.waterfall([
			function (next) {
				AppInfo.findOneAndUpdate({}, {$inc: {inviteCodeNumber: 1}}, {new: true}, function (err, rtn) {
					if (err) {
						return next('邀请码生成错误');
					}
					inviteCodeNumber += rtn.inviteCodeNumber;
					return next(null);
				});
			},
			Visitor.findOne.bind(Visitor, {openId: user.openId}),
			function (visitor, next) {
				if (!visitor) {
					visitor = new Visitor();
					visitor.visitorId = serverUtils.generateRandomNumberString(8);
					visitor.selfInviteCode = inviteCodeNumber.toString();
					visitor.freeCoupons = 5;
				}
				visitor.openId = user.openId;
				visitor.name = user.name;
				visitor.gender = user.gender;
				visitor.headImgUrl = user.headImgUrl;
				visitor.accessToken = user.accessToken;
				visitor.refreshToken = user.refreshToken;
				visitor.mobileId = mobileInfo.mobileId;
				visitor.mobileModel = mobileInfo.mobileModel;
				visitor.salt = crypto.randomBytes(16).toString('base64');
				visitor.save(next);
			}
		], function (err, visitor) {
			if (err) {
				return callback(err);
			}
			if (!visitor) {
				return callback('微信登录失败');
			}
			var token = encryptVisitorToken(visitor._id, visitor.openId, mobileId, visitor.salt);
			res.send(token);
		});
	},
	createTempVisitor           : function (req, res, callback) {
		var user = req.user,
			mobileInfo = req.mobileInfo || {};
		var mobileId = req.headers['deviceid'];
		var inviteCodeNumber = 12961;
		if (!mobileId) {
			return callback('获取不到设备标识');
		}
		async.waterfall([
			function (next) {
				AppInfo.findOneAndUpdate({}, {$inc: {inviteCodeNumber: 1}}, {new: true}, function (err, rtn) {
					if (err) {
						return next('邀请码生成错误');
					}
					inviteCodeNumber += rtn.inviteCodeNumber;
					return next(null);
				});
			},
			Visitor.findOne.bind(Visitor, {mobileId: mobileId, openId: '', name: '游客账号'}),
			function (visitor, next) {
				if (!visitor) {
					visitor = new Visitor();
					visitor.visitorId = serverUtils.generateRandomNumberString(8);
					visitor.selfInviteCode = inviteCodeNumber.toString();
					visitor.freeCoupons = 5;
					visitor.openId = '';
					visitor.name = '游客账号';
// 				visitor.gender = user.gender;
					visitor.headImgUrl = 'http://39.104.66.47:8888/images/5a5580818fa550576caef262';
					visitor.mobileId = mobileId;
					visitor.mobileModel = mobileInfo.mobileModel;
				}
				visitor.salt = crypto.randomBytes(16).toString('base64');
				visitor.save(next);
			}
		], function (err, visitor) {
			if (err) {
				return callback(err);
			}
			if (!visitor) {
				return callback('游客登录失败');
			}
			var token = encryptVisitorToken(visitor._id, visitor.openId, mobileId, visitor.salt);
			res.send(token);
		});
	},
	getMe                       : function (req, callback) {
		var visitor = req.visitor.toObject ? req.visitor.toObject() : req.visitor;
		var visitorId = visitor._id,
			today = moment().format('L');
		async.waterfall([
			PlayRecord.count.bind(PlayRecord, {visitor: visitorId, cost: 0, time: {"$gte": today}}),
			function (count, next) {
				visitor.dailyFreePlayCount = appConfig.dailyFreePlayCount - count;
				next(null);
			},
			DailySign.findOne.bind(DailySign, {visitor: visitorId, time: {"$gte": today}}),
			function (signTtn, next) {
				if (signTtn && signTtn.visitor) {
					return next(null);
				}
				var newSign = new DailySign({
					visitor: visitorId,
					time   : new Date()
				});
				async.parallel({
					visitor   : Visitor.findByIdAndUpdate.bind(Visitor, visitorId, {$inc: {freeCoupons: 1}}, {
						new   : true,
						fields: {
							_id        : 1,
							freeCoupons: 1
						}
					}),
					sign      : function (next) {
						newSign.save(function (err, rtn, count) {
							if (err) {
								return next(err);
							}
							return next(null, rtn);
						});
					},
					wechatInfo: function (next) {
						var client = new OAuth(appConfig.passport.wechatMobile.clientID, appConfig.passport.wechatMobile.clientSecret);
						client.refreshAccessToken(req.visitor.refreshToken, function (err, token) {
							if (err) {
								return next(err);
							}
							client._getUser({openid: req.visitor.openId}, token.data['access_token'], next);
						});
					}
				}, next);
			}
		], function (err, results) {
			if (err) {
				return callback(err);
			}
			visitor.dailyFirstLogin = false;
			if (results && results.visitor) {
				visitor.freeCoupons = results.visitor.freeCoupons;
				visitor.dailyFirstLogin = true;
			}
			if (results && results.wechatInfo) {
				return Visitor.findByIdAndUpdate(visitor._id, {
					$set: {
						openId    : results.wechatInfo[0].openid,
						name      : results.wechatInfo[0].nickname,
						gender    : results.wechatInfo[0].gender,
						headImgUrl: results.wechatInfo[0].headimgurl
					}
				}, {new: true}, function (err, newVisitor) {
					if (err) {
						return callback(err);
					}
					newVisitor = newVisitor.toObject();
					newVisitor.dailyFirstLogin = false;
					if (newVisitor && newVisitor.visitor) {
						newVisitor.dailyFirstLogin = true;
					}
					return callback(null, newVisitor);
				});
			}
			return callback(null, visitor);
		});
	},
	updateMe                    : function (req, callback) {
		var id = req.visitor._id;
		return Visitor.findById(id, function (err, visitor) {
			if (err || !visitor) {
				return callback(err || 404);
			}
			var updatePart = req.body || {};
			_.extend(visitor, updatePart);
			visitor.save(callback[201]);
		});
	},
	setInviteCode               : function (req, callback) {
		var id = req.visitor._id;
		var updatePart = req.body || {};
		var inviteCode = updatePart.inviteCode;
		if (!inviteCode) {
			return callback('请填写邀请码');
		}
		async.waterfall([
			Visitor.findOne.bind(Visitor, {selfInviteCode: inviteCode}),
			function (visitor, next) {
				if (!visitor) {
					return next('邀请码错误：找不到对应用户');
				}
				Visitor.findByIdAndUpdate(visitor._id, {$inc: {freeCoupons: 2, inviteNumber: 1}}, next);
			},
			function (result, next) {
				Visitor.findByIdAndUpdate(id, {
					$set: {inviteCode: inviteCode},
					$inc: {freeCoupons: 2}
				}, {new: true}, next);
			}
		], callback);
	}
};