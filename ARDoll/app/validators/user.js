'use strict';
/**
 * Created by Koan on 2017.9.21
 */
var validator = require('validator'),
	Assertion = require('../utils/assertion');

module.exports = {
	validateName       : function (name, allowFault) {
		name = validator.trim(name || '');
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(name), '用户名不能为空', allowFault)
			.assert(validator.isLength(name, 0, 20), '用户名不能超过20个字符')
			.assert(Assertion.isUsername(name), '只能含有英文字母 汉字 _-.* 和空格');
		return assertions.result();
	},
	validatePassword   : function (password, allowFault) {
		password = validator.trim(password || '');
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(validator.trim(password)), '密码不能为空', allowFault)
			.assert(validator.isLength(validator.trim(password), 4, 20), '密码长度必须在4~20之间');
		return assertions.result();
	}
};
