/**
 * Created by Koan on 2017/11/20.
 */
'use strict';
var validator = require('validator'),
	Assertion = require('../utils/assertion');

module.exports = {
	validateName          : function (name, allowFault) {
		name = validator.trim(name || '');
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(name), '名称不能为空', allowFault)
			.assert(validator.isLength(validator.trim(name), 1, 20), '名称需要介于1到20字符之间');
		return assertions.result();
	},
	validateDescription   : function (description) {
		description = validator.trim(description || '');
		var assertions = Assertion
			.assert(validator.isLength(description, 0, 200), '简介不能超过200个字符');
		return assertions.result();
	},
	validateProbability   : function (probability) {
		probability = validator.trim(probability || '');
		var assertions = Assertion
			.assert(validator.isFloat(probability, {min: 0, max: 1}), '抓取概率必须是0-1间的数字');
		return assertions.result();
	},
	validateLimitNumber   : function (limitNumber) {
		limitNumber = validator.trim(limitNumber || '');
		var assertions = Assertion
			.assert(validator.isInt(limitNumber, {min: 0}), '总数必须是大于0的数字');
		return assertions.result();
	},
	validateJackpot       : function (jackpot) {
		jackpot = validator.trim(jackpot || '');
		var assertions = Assertion
			.assert(validator.isInt(jackpot, {min: 0}), '奖池必须是大于0的数字');
		return assertions.result();
	},
	validatePoint         : function (point) {
		point = validator.trim(point || '');
		var assertions = Assertion
			.assert(validator.isInt(point, {min: 0}), '抓取可得积分必须是大于0的数字');
		return assertions.result();
	},
	validateConsume       : function (consume) {
		consume = validator.trim(consume || '');
		var assertions = Assertion
			.assert(validator.isInt(consume, {min: 0}), '抓取消耗代币必须是大于0的数字');
		return assertions.result();
	},
	validateDoll          : function (doll) {
		doll = validator.trim(doll || '');
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(doll), '请选择娃娃');
		return assertions.result();
	},
	validateDollMachine   : function (dollMachine) {
		dollMachine = validator.trim(dollMachine || '');
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(dollMachine), '请选择娃娃机');
		return assertions.result();
	},
	validateDollMachinePaw: function (dollMachinePaw) {
		dollMachinePaw = validator.trim(dollMachinePaw || '');
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(dollMachinePaw), '请选择娃娃机爪子');
		return assertions.result();
	},
	validateSortIndex     : function (sortIndex) {
		sortIndex = validator.trim(sortIndex || '');
		var assertions = Assertion
			.assert(validator.isInt(sortIndex), '排序序号必须是数字');
		return assertions.result();
	}
};