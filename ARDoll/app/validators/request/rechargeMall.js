/**
 * Created by Koan on 2017/11/20.
 */
'use strict';
var rechargeMallValidator = require('../rechargeMall'),
	Assertion = require('../../utils/assertion');

function validateCreation(req, allowFault) {
	var reqBody = req.body;
	var assertions = new Assertion();
	assertions.push(rechargeMallValidator.validateName(reqBody.name, allowFault));
	assertions.push(rechargeMallValidator.validateDescription(reqBody.description, allowFault));
	assertions.push(rechargeMallValidator.validateAmount(reqBody.amount));
	assertions.push(rechargeMallValidator.validateCoin(reqBody.presentCoin));
	return assertions.result();
}

function validateUpdate(req, allowFault) {
	var reqBody = req.body;
	var assertions = new Assertion();
	if (reqBody.name !== undefined) {
		assertions.push(rechargeMallValidator.validateName(reqBody.name, allowFault));
	}
	if (reqBody.description !== undefined) {
		assertions.push(rechargeMallValidator.validateDescription(reqBody.description, allowFault));
	}
	if (reqBody.amount !== undefined) {
		assertions.push(rechargeMallValidator.validateAmount(reqBody.amount));
	}
	if (reqBody.presentCoin !== undefined) {
		assertions.push(rechargeMallValidator.validateCoin(reqBody.presentCoin));
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