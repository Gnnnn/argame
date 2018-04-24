'use strict';
/**
 * Created by gogoout on 16/12/20.
 */
var isDate = require('lodash/isDate'),
	Push = require('../models/push'),
	validator = require('validator'),
	Assertion = require('../utils/assertion');

module.exports = {
	validateTitle      : function (title) {
		title = validator.trim(title || '');
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(title), '标题不能为空', true)
			.assert(validator.isLength(title, 1, 128), '标题过长');
		return assertions.result();
	},
	validateDescription: function (description, allowFault) {
		description = validator.trim(description || '');
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(description), '内容不能为空', allowFault)
			.assert(validator.isLength(description, 1, 250), '内容过长');
		return assertions.result();
	},
	validateExpiry     : function (expiry) {
		expiry = validator.trim(expiry || '');
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(expiry), '超时不能为空', true)
			.assert(validator.isNumeric(expiry), '超时格式错误');
		return assertions.result();
	},
	validatePriority   : function (priority) {
		priority = priority ? priority.toString() : '0';
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(priority), '优先级不能为空', true)
			.assert(validator.isNumeric(priority), '优先级格式错误')
			.assert(!(priority.toString() === '10' || priority.toString() === '5'), '优先级只能是5或10');
		return assertions.result();
	},
	validateType       : function (type) {
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(type), '类型不能为空', true)
			.assert(Push.constants.types.haveValue(type), '类型错误');
		return assertions.result();
	}
};
