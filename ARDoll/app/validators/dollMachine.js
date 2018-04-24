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
	}
};