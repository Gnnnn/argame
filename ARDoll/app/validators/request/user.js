'use strict';
/**
 * Created by Koan on 2017.9.21.
 */
var validator = require('validator'),
	userValidator = require('../user'),
	Assertion = require('../../utils/assertion');

function validateUser(req, allowFault) {
	var reqBody = req.body;
	var assertions = new Assertion();
	assertions.push(userValidator.validateName(reqBody.name, allowFault));
	assertions.push(userValidator.validatePassword(reqBody.password, allowFault));
	return assertions.result();
}
module.exports = {
	validateCreation    : function (req) {
		return validateUser(req);
	},
	validateModification: function (req) {
		return validateUser(req, true);
	},
	validateLogin       : function (req) {
		var reqBody = req.body;
		var assertions = Assertion
			.assert(!validator.isEmpty(validator.trim(reqBody.name || '')), '用户名不能为空')
			.assert(!validator.isEmpty(validator.trim(reqBody.password || '')), '密码不能为空');
		return assertions.result();
	}
};
