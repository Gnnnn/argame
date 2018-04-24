'use strict';
/**
 * Created by Koan on 2017.9.21
 */
var _ = require('lodash'),
	User = require('../models/user'),
	tokenCtrl = require('../controllers/token');

function resourceAuthenticationFactory(options) {
	options = options || {};

	function resourceCheck(req, callback) {
		var err;
		if (options.idCheck && req.me._id.toString() !== req.params[options.idCheck]) {
			err = '用户无权限';
		}
		if (!err && options.additionCondition && _.isFunction(options.additionCondition)) {
			err = options.additionCondition(req, options);
		}
		callback(err);
	}

	resourceCheck.options = function (optionsOverLoad) {
		var newOptions = _.extend({}, options, optionsOverLoad);
		var newResourceCheck = resourceAuthenticationFactory(newOptions);
		delete  newResourceCheck.options;
		return newResourceCheck;
	};

	return resourceCheck;
}

function resourceAuthenticationFactoryByModel(Model, options) {
	options = options || {};

	function resourceCheck(req, callback) {
		return tokenCtrl.verifyTokenFactory(Model, options)(req, function (err, results) {
			if (!err && results && results.user) {
				if (options.idCheck && results.user._id.toString() !== req.params[options.idCheck]) {
					err = '用户无权限';
				}
				else {
					req.loginExpire = results.expire;
					req.me = results.user;
				}
			}
			callback(err);
		});
	}

	resourceCheck.options = function (optionsOverLoad) {
		var newOptions = _.extend({}, options, optionsOverLoad);
		var newResourceCheck = resourceAuthenticationFactoryByModel(Model, newOptions);
		delete  newResourceCheck.options;
		return newResourceCheck;
	};

	return resourceCheck;
}

/**
 * @apiDefine user 登录用户
 * 登录后的用户(包括未验证的)才能访问, 特定资源将检查资源路径中的id, 保证用户只能修改/访问自己的资源
 */
var userResource = resourceAuthenticationFactory({
	additionCondition: function (req, options) {
		var user = req.me,
			err;
		if (!user) {
			err = '令牌已过期,请重新登录！';
		}
		return err;
	}
});

var visitorResource = resourceAuthenticationFactory({
	additionCondition: function (req, options) {
		var user = req.visitor,
			err;
		if (!user) {
			err = '请先登录！';
		}
		return err;
	}
});

/**
 * @apiDefine verifiedUser 登录用户
 * 登录后的用户(已验证的)才能访问, 特定资源将检查资源路径中的id, 保证用户只能修改/访问自己的资源
 */
var verifiedUserResource = resourceAuthenticationFactory({
	additionCondition: function (req, options) {
		var user = req.me,
			err;
		if (!user) {
			err = '请先登录后再进行操作！';
		}
		return err;
	}
});

/**
 * @apiDefine system 管理员
 * 登录后的管理员才能访问
 */
var systemResource = resourceAuthenticationFactory({
	additionCondition: function (req, options) {
		var user = req.me,
			err = options.errorMessage || '用户无权限';
		if (!user) {
			err = '请先登录后再进行操作！';
		}
		else if (user.role === User.constants.roles.ADMIN) {
			err = '';
		}
		return err;
	}
});


module.exports = {
	userResource        : userResource,
	visitorResource     : visitorResource,
	verifiedUserResource: verifiedUserResource,
	systemResource      : systemResource
};