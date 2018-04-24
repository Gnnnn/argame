'use strict';
/**
 * Created by Koan on 2017.9.21
 */
var validator = require('validator'),
	Assertion = require('../utils/assertion');

module.exports = {
	validateName     : function (name, allowFault) {
		name = validator.trim(name || '');
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(name), '用户名不能为空', allowFault)
			.assert(validator.isLength(name, 0, 20), '用户名不能超过20个字符')
			.assert(Assertion.isUsername(name), '只能含有英文字母 汉字 _-.* 和空格');
		return assertions.result();
	},
// 	validateBirthday : function (birthday) {
// 		birthday = birthday || '';
// 		var assertions = Assertion
// 			// isDate has been removed
// 			.assertInstant(validator.isDate(birthday), '生日不是一个合法的日期', false)
// 			.assert(validator.toDate(birthday).getTime() < new Date().getTime(), '生日不合法!生日不可能晚于今天');
// 		return assertions.result();
// 	},
	valadateCellPhone: function (cellPhone) {
		cellPhone = cellPhone || '';
		var assertions = Assertion
			.assertInstant(validator.isMobilePhone(cellPhone, 'zh-CN'), '手机号不正确，请填写大陆手机号，或联系客服');
		return assertions.result();
	}
};
