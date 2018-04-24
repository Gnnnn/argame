/**
 * Created by Koan on 2016/7/22.
 */
'use strict';
var User = require('../models/user'),
	Visitor = require('../models/visitor'),
	tokenCtrl = require('../controllers/token');

module.exports = {
	getUserInfo   : function (req, res, callback) {
		return tokenCtrl.verifyTokenFactory(User, {})(req, function (err, results) {
			results = results || {};
			req.me = results.user;
			req.loginExpire = results.expire;
			callback(null);
		});
	},
	getVisitorInfo: function (req, res, callback) {
		var mobileId = req.headers['deviceid'] || req.headers['x-forwarded-for'] ||
		               req.connection.remoteAddress ||
		               req.socket.remoteAddress ||
		               req.connection.socket.remoteAddress;
		var mobileModel = req.headers['mobile-model'] ? req.headers['mobile-model'].toLowerCase() : '';
		req.mobileInfo = {
			mobileId   : mobileId,
			mobileModel: mobileModel
		};
		return tokenCtrl.verifyVisitorToken(req, function (err, results) {
			results = results || {};
			req.visitor = results.visitor;
			// del
// 			if (!req.visitor || !req.visitor._id) {
// 				req.visitor = {
// 					_id            : '5a139' +
// 					                 '983b9030831b408ac75',
// 					visitorId      : '65487936',   // 显示ID
// 					mobileId       : '112.791.64.1',
// 					mobileModel    : '手机型号',
// 					name           : '测试',
// 					gender         : 1,
// 					headImgUrl     : 'url:xxxxx',
// 					birthday       : '1999-1-2',
// 					selfInviteCode : '12345',    // 邀请码
// 					inviteCode     : '111',     // 被邀请码
// 					coin           : 10000000,   // 代币
// 					freeCoupons    : 5,   // 免费券
// 					address        : 'XXXXXX',     // 送货地址
// 					cellPhone      : '13688888888',     // 手机号
// 					point          : 1000,  //积分
// 					inviteNumber   : 3,   // 已邀请用户
// 					dailyFirstLogin: true
// 				};
// 			}
			return Visitor.updateLastActiveDate(req, function (err) {
				return callback(null);
			});
		});
	}
};