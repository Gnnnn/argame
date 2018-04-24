'use strict';
/**
 * Created by gogoout on 16/12/20.
 */
var pushValidator = require('../push'),
	Assertion = require('../../utils/assertion');

function validatePush(req, allowFault) {
	var reqBody = req.body;
	var assertions = new Assertion();
	assertions.push(pushValidator.validateTitle(reqBody.title));
	assertions.push(pushValidator.validateType(reqBody.type));
	assertions.push(pushValidator.validateDescription(reqBody.description, allowFault));
	assertions.push(pushValidator.validateExpiry(reqBody.expiry));
// 	assertions.push(pushValidator.validatePriority(reqBody.priority));
	return assertions.result();
}
module.exports = {
	validateCreation    : function (req) {
		return validatePush(req);
	},
	validateModification: function (req) {
		return validatePush(req, true);
	}
};
