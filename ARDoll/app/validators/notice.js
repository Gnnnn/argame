/**
 * Created by Koan on 2017/9/28.
 */
'use strict';

var validator = require('validator'),
	Assertion = require('../utils/assertion');

module.exports = {
	validateTitle  : function (title, allowFault) {
		title = validator.trim(title || '');
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(title), '标题不能为空', allowFault)
			.assert(validator.isLength(title, 1, 20), '标题不能超过20个字符');
		return assertions.result();
	},
	validateContent: function (content, allowFault) {
		content = validator.trim(content || '');
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(content), '正文不能为空', allowFault);
		return assertions.result();
	}
};