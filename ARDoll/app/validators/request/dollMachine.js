/**
 * Created by Koan on 2017/11/20.
 */
'use strict';
var dollMachineValidator = require('../dollMachine'),
	Assertion = require('../../utils/assertion');

function validateCreation(req, allowFault) {
	var reqBody = req.body;
	var assertions = new Assertion();
	assertions.push(dollMachineValidator.validateName(reqBody.name, allowFault));
	assertions.push(dollMachineValidator.validateDescription(reqBody.description, allowFault));
	return assertions.result();
}

function validateUpdate(req, allowFault) {
	var reqBody = req.body;
	var assertions = new Assertion();
	if (reqBody.name !== undefined) {
		assertions.push(dollMachineValidator.validateName(reqBody.name, allowFault));
	}
	if (reqBody.description !== undefined) {
		assertions.push(dollMachineValidator.validateDescription(reqBody.description, allowFault));
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