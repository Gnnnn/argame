/**
 * Created by Koan on 2017/9/21.
 */
'use strict';

var validator = require('validator'),
	Advice = require('../models/advice'),
	Assertion = require('../utils/assertion');

module.exports = {
	validateVisitor      : function (visitorId) {
		visitorId = visitorId ? visitorId.toString() : '';
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(visitorId), '未知用户：用户id为空');
		return assertions.result();
	},
	validateMessage      : function (message, allowFault) {
		message = validator.trim(message || '');
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(validator.trim(message)), '反馈信息不能为空', allowFault)
			.assert(validator.isLength(validator.trim(message), 0, 250), '反馈信息不能超过200字符');
		return assertions.result();
	},
	validateHandleState  : function (handleState) {
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(handleState), '处理状态不能为空')
			.assert(Advice.constants.handleState.haveValue(handleState), '处理状态不合法!');
		return assertions.result();
	},
	validateHandleMessage: function (message, allowFault) {
		message = validator.trim(message || '');
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(validator.trim(message)), '处理意见不能为空', allowFault)
			.assert(validator.isLength(validator.trim(message), 0, 250), '处理意见不能超过200字符');
		return assertions.result();
	}
};