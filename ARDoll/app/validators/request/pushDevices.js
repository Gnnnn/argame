'use strict';
/**
 * Created by Koan on 17/9/29.
 */
var PushDevice = require('../../models/pushDevice'),
	deviceValidator = require('../pushDevice'),
	Assertion = require('../../utils/assertion');

function validatePushDevice(req, allowFault) {
	var reqBody = req.body;
	var assertions = new Assertion();
	assertions.push(deviceValidator.validateDeviceId(reqBody.deviceId, allowFault));
// 	assertions.push(deviceValidator.validateType(reqBody.type, allowFault));
// 	assertions.assert(PushDevice.constants.types.haveValue(reqBody.type), '类型错误,只能是' + PushDevice.constants.types + '中的一个');
	return assertions.result();
}
module.exports = {
	validateCreation    : function (req) {
		return validatePushDevice(req);
	},
	validateModification: function (req) {
		return validatePushDevice(req, true);
	}
};
