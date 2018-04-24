/**
 * Created by Koan on 2017/9/21.
 */
'use strict';

var validator = require('validator'),
	Assertion = require('../utils/assertion');

module.exports = {
	validateVersion   : function (version, allowFault) {
		version = validator.trim(version || '');
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(version), '版本号不能为空', allowFault)
			.assert(validator.matches(version, /^\d[\d\.]+\d$/), '版本号格式不正确，正确格式：0.0.0');
		return assertions.result();
	},
	validateUpdateNews: function (updateNews, allowFault) {
		updateNews = validator.trim(updateNews || '');
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(updateNews), '更新履历不能为空', allowFault);
		return assertions.result();
	}
};