/**
 * Created by Koan on 2017/11/20.
 */
'use strict';
var validator = require('validator'),
	Assertion = require('../utils/assertion');

module.exports = {
	validateName       : function (name, allowFault) {
		name = validator.trim(name || '');
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(name), '名称不能为空', allowFault)
			.assert(validator.isLength(validator.trim(name), 1, 20), '名称需要介于1到20字符之间');
		return assertions.result();
	},
	validateDescription: function (description) {
		description = validator.trim(description || '');
		var assertions = Assertion
			.assert(validator.isLength(description, 0, 200), '简介不能超过200个字符');
		return assertions.result();
	},
	validateAmount     : function (amount) {
		amount = validator.trim(amount || '');
		var assertions = Assertion
			.assert(validator.isFloat(amount, {min: 0}), '充值金额必须是大于0的数字');
		return assertions.result();
	},
	validateCoin       : function (coin) {
		coin = validator.trim(coin || '');
		var assertions = Assertion
			.assert(validator.isFloat(coin, {min: 0}), '赠送代币必须是大于0的数字');
		return assertions.result();
	}
};