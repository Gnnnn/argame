/**
 * Created by Koan on 2017/11/20.
 */
'use strict';
var dollValidator = require('../doll'),
	Assertion = require('../../utils/assertion');

function validateCreation(req, allowFault) {
	var reqBody = req.body;
	var assertions = new Assertion();
	assertions.push(dollValidator.validateName(reqBody.name, allowFault));
	assertions.push(dollValidator.validateDescription(reqBody.description, allowFault));
	assertions.push(dollValidator.validateCost(reqBody.cost));
	return assertions.result();
}

function validateUpdate(req, allowFault) {
	var reqBody = req.body;
	var assertions = new Assertion();
	if (reqBody.name !== undefined) {
		assertions.push(dollValidator.validateName(reqBody.name, allowFault));
	}
	if (reqBody.description !== undefined) {
		assertions.push(dollValidator.validateDescription(reqBody.description, allowFault));
	}
	if (reqBody.cost !== undefined) {
		assertions.push(dollValidator.validateCost(reqBody.cost));
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