'use strict';
/**
 * Created by gogoout on 15/6/18.
 */
var _ = require('lodash'),
	s = require('underscore.string'),
	Visitor = require('../models/visitor'),
	encryption = require('../utils/encryption'),
	appConst = require('../utils/appConst'),
	userValidator = require('../validators/request/user');

// 1d
var SHORT_EXPIRE = 24 * 60 * 60 * 1000;
// 3m
var LONG_EXPIRE = 3 * 30 * 24 * 60 * 60 * 1000;

function encryptUserToken(userId, password, expire) {
	expire = expire || SHORT_EXPIRE;
	var loginTime = _.now();
	var secrets = [userId, password, expire, loginTime];
	return encryption.encryptToken(secrets);
}

function createTokenFactory(model) {
	return function (req, callback) {
		var err = userValidator.validateLogin(req);
		if (err) {
			return callback(err);
		}
		model.findOneByName(req.body.name, function (err, user) {
			var wrongMsg = '用户名或密码不正确';
			if (err || !user) {
				return callback(err || wrongMsg);
			}
			if (!user.verifyPassword(req.body.password)) {
				return callback(wrongMsg);
			}
			var token;
			try {
				token = encryptUserToken(user._id, user.hashedPassword, req.body.expire);
			}
			catch (e) {
				err = e.message;
			}
			callback(err, token);
		});
	};
}

function verifyVisitorToken(req, callback) {
	var token = req.headers[appConst.reqHeaderToken] || '';
	token = s.trim(token);
	if (!token) {
// 		return callback('令牌不能为空:应在request head中加入\'' + appConst.reqHeaderToken + '\'');
		return callback('令牌为空!');
	}
	var visitorInfo;
	try {
		visitorInfo = encryption.decryptToken(token);
	}
	catch (e) {
		return callback('令牌不正确!');
	}
	if (visitorInfo.length >= 4) {
		var userId = visitorInfo[0],
			openId = visitorInfo[1],
			mobileId = req.mobileInfo ? req.mobileInfo.mobileId : '',
			salt = visitorInfo[3];
		var condition = {_id: userId, openId, mobileId, salt};
		Visitor.findOne(condition, function (err, visitor) {
			var wrongMsg = '令牌不正确';
			if (err || !visitor) {
				return callback(err || wrongMsg);
			}
			callback(err, {visitor});
		});
	}
}

function verifyTokenFactory(model, options) {
	options = options || {};
	return function authenticate(req, callback) {
		var token = req.headers[appConst.reqHeaderToken] || '';
		token = s.trim(token);
		if (!token) {
			return callback('令牌不能为空:应在request head中加入\'' + appConst.reqHeaderToken + '\'');
		}
		var userInfo;
		try {
			userInfo = encryption.decryptToken(token);
		}
		catch (e) {
			return callback('令牌不正确!');
		}
		if (userInfo.length >= 4) {
			var loginTime = parseInt(userInfo[3], 10);
			var expire = parseInt(userInfo[2], 10);
			// expire === 0 表示无限(已屏蔽)
//			if (expire !== 0 && _.now() > (loginTime + expire)) {
			if (_.now() > (loginTime + expire)) {
				return callback('令牌已过期,请重新登录');
			}
			var condition = _.extend({_id: userInfo[0]}, options.additionCondition);
			model.findOne(condition, function (err, user) {
				var wrongMsg = options.errorMessage || '用户无权限';
				if (err || !user) {
					return callback(err || wrongMsg);
				}
				if (user.hashedPassword !== userInfo[1]) {
					return callback('令牌不正确');
				}
				// 返回过期时间
				callback(err, {
					user,
					expire: loginTime + expire
				});
			});
		}
	};
}

function allTransformer(req) {
	var reqBody = req.body;
	if (reqBody) {
		delete reqBody.expire;

		if (reqBody.name) {
			reqBody.name = s.trim(reqBody.name).toLowerCase();
		}
		if (reqBody.password) {
			reqBody.password = s.trim(reqBody.password);
		}
	}
}

module.exports = {
	encryptUserToken  : encryptUserToken,
	verifyVisitorToken: verifyVisitorToken,
	createTokenFactory: createTokenFactory,
	verifyTokenFactory: verifyTokenFactory,
	allTransformer    : allTransformer,
	constants         : {
		SHORT_EXPIRE,
		LONG_EXPIRE
	}
};