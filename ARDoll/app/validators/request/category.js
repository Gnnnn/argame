/**
 * Created by Koan on 2017/11/20.
 */
'use strict';
var categoryValidator = require('../category'),
	Assertion = require('../../utils/assertion');

function validateCreation(req, allowFault) {
	var reqBody = req.body;
	var assertions = new Assertion();
	assertions.push(categoryValidator.validateName(reqBody.name, allowFault));
	assertions.push(categoryValidator.validateDescription(reqBody.description, allowFault));
	assertions.push(categoryValidator.validateSortIndex(reqBody.sortIndex));
	return assertions.result();
}

function validateUpdate(req, allowFault) {
	var reqBody = req.body;
	var assertions = new Assertion();
	if (reqBody.name !== undefined) {
		assertions.push(categoryValidator.validateName(reqBody.name, allowFault));
	}
	if (reqBody.description !== undefined) {
		assertions.push(categoryValidator.validateDescription(reqBody.description, allowFault));
	}
	if (reqBody.sortIndex !== undefined) {
		assertions.push(categoryValidator.validateSortIndex(reqBody.sortIndex));
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