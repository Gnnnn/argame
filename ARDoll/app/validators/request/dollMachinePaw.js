/**
 * Created by Koan on 2017/11/20.
 */
'use strict';
var dollMachinePawValidator = require('../dollMachinePaw'),
	Assertion = require('../../utils/assertion');

function validateCreation(req, allowFault) {
	var reqBody = req.body;
	var assertions = new Assertion();
	assertions.push(dollMachinePawValidator.validateName(reqBody.name, allowFault));
	assertions.push(dollMachinePawValidator.validateDescription(reqBody.description, allowFault));
	return assertions.result();
}

function validateUpdate(req, allowFault) {
	var reqBody = req.body;
	var assertions = new Assertion();
	if (reqBody.name !== undefined) {
		assertions.push(dollMachinePawValidator.validateName(reqBody.name, allowFault));
	}
	if (reqBody.description !== undefined) {
		assertions.push(dollMachinePawValidator.validateDescription(reqBody.description, allowFault));
	}
	return assertions.result();
}

module.exports = {
	validateCreation: function (req) {
		return validateCreation(req);
	},
	validateUpdate  : function (req) {
		return validateUpdate(req);
	}
};