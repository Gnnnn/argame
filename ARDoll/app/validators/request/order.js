/**
 * Created by Koan on 2017/9/21.
 */
'use strict';

var validator = require('validator'),
	orderValidator = require('../order'),
	Assertion = require('../../utils/assertion');

function validateCreate(req, allowFault) {
	var reqBody = req.body;
	var assertions = new Assertion();
	assertions.push(orderValidator.validateVisitor(req.visitor ? req.visitor._id : ''));
	assertions.push(orderValidator.validateAddress(reqBody.address));
	assertions.push(orderValidator.validateCellPhone(reqBody.cellPhone));
	assertions.push(orderValidator.validateConsignee(reqBody.consignee));
	return assertions.result();
}

function validateUpdate(req) {
	var reqBody = req.body;
	var assertions = new Assertion();
	assertions.push(orderValidator.validateExpressCompany(reqBody.expressCompany));
	assertions.push(orderValidator.validateExpressNo(reqBody.expressNo));
	return assertions.result();
}

module.exports = {
	validateCreation: function (req) {
		req.body = req.body || {};
		return validateCreate(req);
	},
	validateUpdate  : function (req) {
		return validateUpdate(req);
	}
};