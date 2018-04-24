/**
 * Created by Koan on 2017/11/20.
 */
'use strict';
var pointMallValidator = require('../pointMall'),
	Assertion = require('../../utils/assertion');

function validateCreation(req, allowFault) {
	var reqBody = req.body;
	var assertions = new Assertion();
	assertions.push(pointMallValidator.validateName(reqBody.name, allowFault));
	assertions.push(pointMallValidator.validateDescription(reqBody.description, allowFault));
	assertions.push(pointMallValidator.validateConsumePoint(reqBody.consumePoint));
	assertions.push(pointMallValidator.validatePrice(reqBody.price));
	return assertions.result();
}

function validateUpdate(req, allowFault) {
	var reqBody = req.body;
	var assertions = new Assertion();
	if (reqBody.name !== undefined) {
		assertions.push(pointMallValidator.validateName(reqBody.name, allowFault));
	}
	if (reqBody.description !== undefined) {
		assertions.push(pointMallValidator.validateDescription(reqBody.description, allowFault));
	}
	if (reqBody.consumePoint !== undefined) {
		assertions.push(pointMallValidator.validateConsumePoint(reqBody.consumePoint));
	}
	if (reqBody.price !== undefined) {
		assertions.push(pointMallValidator.validatePrice(reqBody.price));
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