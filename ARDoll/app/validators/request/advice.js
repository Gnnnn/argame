/**
 * Created by Koan on 2017/9/21.
 */
'use strict';

var validator = require('validator'),
	adviceValidator = require('../advice'),
	Assertion = require('../../utils/assertion');

function validateCreate(req, allowFault) {
	var reqBody = req.body;
	var assertions = new Assertion();
	assertions.push(adviceValidator.validateVisitor(req.visitor ? req.visitor._id : ''));
	assertions.push(adviceValidator.validateMessage(reqBody.message, allowFault));
	return assertions.result();
}

function validateUpdate(req) {
	var reqBody = req.body;
	var assertions = new Assertion();
	assertions.push(adviceValidator.validateHandleState(reqBody.handleState));
	assertions.push(adviceValidator.validateHandleMessage(reqBody.handleMessage));
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