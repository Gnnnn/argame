'use strict';
/**
 * Created by Koan on 2017.9.21.
 */
var validator = require('validator'),
	visitorValidator = require('../visitor'),
	Assertion = require('../../utils/assertion');

function validateUser(req, allowFault) {
	var reqBody = req.body;
	var assertions = new Assertion()
// 	assertions.push(visitorValidator.validateBirthday(reqBody.birthday));
	if (reqBody.cellPhone) {
		assertions.push(visitorValidator.valadateCellPhone(reqBody.cellPhone));
	}
	return assertions.result();
}

module.exports = {
	validateCreation  : function (req) {
		return validateUser(req);
	},
	validateUpdate    : function (req) {
		return validateUser(req, true);
	},
	validateInviteCode: function (req) {
		var visitor = req.visitor;
		return visitor.inviteCode ? '已经绑定过邀请码，不能重复绑定' : null;
	}
};
