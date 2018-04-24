/**
 * Created by Koan on 2017/9/28.
 */
'use strict';

var async = require('async'),
	mongoose = require('mongoose'),
	hourlyActive = require('./hourlyActive'),
	dailyActive = require('./dailyActive'),
	monthlyActive = require('./monthlyActive');
var Schema = mongoose.Schema,
	Visitor;

function increaseActiveCount(orgDate, nowDate, callback) {
	var tasks = [];
	var nowYear = nowDate.getYear() + 1900,
// 		nowHour = nowDate.getHours(),
		nowDay = nowDate.getDate(),
		nowMonth = nowDate.getMonth() + 1;
	if (!orgDate) {
		tasks.push(monthlyActive.increaseCount(nowYear + '-' + nowMonth));
		tasks.push(dailyActive.increaseCount(nowYear + '-' + nowMonth + '-' + nowDay));
// 		tasks.push(hourlyActive.increaseCount(nowYear + '-' + nowMonth + '-' + nowDay + ' ' + nowHour));
	}
	else {
		var orgYear = orgDate.getYear() + 1900,
// 			orgHour = orgDate.getHours(),
			orgDay = orgDate.getDate(),
			orgMonth = orgDate.getMonth() + 1;

		if (orgYear !== nowYear || orgMonth !== nowMonth) {
			tasks.push(monthlyActive.increaseCount(nowYear + '-' + nowMonth));
			tasks.push(dailyActive.increaseCount(nowYear + '-' + nowMonth + '-' + nowDay));
// 			tasks.push(hourlyActive.increaseCount(nowYear + '-' + nowMonth + '-' + nowDay + ' ' + nowHour));
		}
		else if (orgDay !== nowDay) {
			tasks.push(dailyActive.increaseCount(nowYear + '-' + nowMonth + '-' + nowDay));
// 			tasks.push(hourlyActive.increaseCount(nowYear + '-' + nowMonth + '-' + nowDay + ' ' + nowHour));
		}
// 		else if (orgHour !== nowHour) {
// 			tasks.push(hourlyActive.increaseCount(nowYear + '-' + nowMonth + '-' + nowDay + ' ' + nowHour));
// 		}
	}
	async.parallel(tasks, callback);
}

// schema
// --------------------------
var visitorSchema = new Schema(
	{
		visitorId        : {type: String, require: true, index: true},
		mobileId         : {type: String, require: true},
		mobileModel      : String,
		registerDate     : {type: Date, default: function () {return new Date();}},
		lastActiveDate   : {type: Date, default: function () {return new Date();}},
		openId           : {type: String, index: true},
		name             : String,
		gender           : String,
		headImgUrl       : String,
		salt             : String,
		birthday         : String,
		accessToken      : String,
		refreshToken     : String,
		selfInviteCode   : {type: String, index: true},    // 邀请码
		inviteCode       : String,     // 被邀请码
		coin             : {type: Number, default: 0},   // 代币
		freeCoupons      : {type: Number, default: 0},   // 免费券
		address          : String,     // 送货地址
		cellPhone        : String,     // 手机号
		consignee        : String,     // 收件人
		point            : {type: Number, default: 0},   // 积分
		inviteNumber     : {type: Number, default: 0},   // 邀请人数
		finishFirstCharge: {type: Boolean, default: false}   // 完成首充
	}
);

// static
// ----------------
visitorSchema.statics = {
	updateLastActiveDate: function (req, callback) {
		if (req.visitor && req.visitor._id) {
			var result;
			async.waterfall([
				function (next) {
					Visitor.findOne({_id: req.visitor._id}, next);
				},
				function (_result, next) {
					if (!_result) {
						return next('未知用户');
					}
					result = _result;
					var lastActiveDate = new Date(),
						orgActiveDate = result.lastActiveDate;
					result.lastActiveDate = lastActiveDate;
					increaseActiveCount(orgActiveDate, lastActiveDate, next);
				},
				function (results, next) {
					result.save(next);
				}
			], function (err) {
				if (err) {
					return callback(err);
				}
				return callback(null);
			});
		}
		else {
			return callback(null);
		}
	}
};

visitorSchema.options.toObject = visitorSchema.options.toObject || {};
visitorSchema.options.toJSON = visitorSchema.options.toJSON || {};
visitorSchema.options.toJSON.transform = visitorSchema.options.toObject.transform = function (doc, obj, options) {
// 	delete obj.mobileId;
// 	delete obj.mobileModel;
// 	delete obj.registerDate;
// 	delete obj.lastActiveDate;
	delete obj.openId;
	delete obj.salt;
};

Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor;