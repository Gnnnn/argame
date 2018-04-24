'use strict';
/**
 * Created by gogoout on 15/6/12.
 */
var _ = require('lodash'),
	s = require('underscore.string'),
	async = require('async'),
	validator = require('validator'),
	User = require('../models/user'),
	tokenCtrl = require('./token'),
	encryption = require('../utils/encryption'),
	configs = require('../utils/appConfig');

var AVATAR_THUMBNAIL_SIZES = [84, 28];

function setUserLoginToken(res, user) {
	var loginToken = tokenCtrl.encryptUserToken(user._id, user.hashedPassword);
	res.cookie('x-token', loginToken, {
		path  : '/',
		domain: configs.webDomain,
		maxAge: 60 * 1000
	});
}

module.exports = {
	getMe                    : function (req, callback) {
		var user = req.me,
			err;
		if (user == null) {
			err = '请登录！';
		}
		return callback(err, user ? user.toObject() : {});
	},
	userUpdate               : function (id, updatePart, callback) {
		return User.findById(id, function (err, user) {
			if (err || !user) {
				return callback(err || 404);
			}
			if (updatePart.password) {
				if (updatePart.oldPassword) {
					if (!user.verifyPassword(updatePart.oldPassword)) {
						return callback('密码错误!无法修改用户信息');
					}
					user.password = updatePart.password;
				}
				else if (updatePart.enPassword) {
					if (user.hashedPassword !== updatePart.enPassword) {
						return callback('密码错误!无法修改用户信息');
					}
					user.password = updatePart.password;
				}
			}
			delete updatePart.password;
			_.extend(user, updatePart);
			user.save(callback[201]);
		});
	},
	userAllTransformer       : function (req, callback) {
		var reqBody = req.body;
		if (reqBody) {
			delete reqBody.salt;
			delete reqBody.hashedPassword;

			if (reqBody.name) {
				reqBody.name = s.trim(reqBody.name);
				reqBody.nameLower = reqBody.name.toLowerCase();
			}
			if (reqBody.password) {
				reqBody.password = s.trim(reqBody.password);
			}
			return callback(null, req);
		}
	},
	userCreateTransformer    : function (req) {
		var reqBody = req.body;
		if (reqBody) {
			reqBody.registerDate = new Date();
			reqBody.role = User.constants.roles.ADMIN;
		}
	},
	userSelfUpdateTransformer: function (req) {
		var reqBody = req.body;
		if (reqBody) {
			delete reqBody.registerDate;
			delete reqBody.role;
			delete reqBody.name;
			delete reqBody.nameLower;
		}
	}
};