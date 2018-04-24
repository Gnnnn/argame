'use strict';
/**
 * Created by Koan on 17/9/29
 */
var validator = require('validator'),
	Assertion = require('../utils/assertion');

module.exports = {
	validateDeviceId: function (id, allowFault) {
		id = validator.trim(id || '');
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(id), '设备ID不能为空', allowFault)
			.assert(validator.isLength(id, 1, 128), '设备ID过长');
		return assertions.result();
	},
	validateType    : function (type, allowFault) {
		type = validator.trim(type || '');
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(type), '设备类型不能为空', allowFault);
		return assertions.result();
	}
};
