/**
 * Created by Koan on 2017/11/20.
 */
'use strict';
var roomValidator = require('../room'),
	Assertion = require('../../utils/assertion');

function validateCreation(req, allowFault) {
	var reqBody = req.body;
	var assertions = new Assertion();
	assertions.push(roomValidator.validateName(reqBody.name, allowFault));
	assertions.push(roomValidator.validateDescription(reqBody.description, allowFault));
	assertions.push(roomValidator.validateProbability(reqBody.probability));
	assertions.push(roomValidator.validateJackpot(reqBody.jackpot));
	assertions.push(roomValidator.validateLimitNumber(reqBody.limitNumber));
	assertions.push(roomValidator.validatePoint(reqBody.point));
	assertions.push(roomValidator.validateConsume(reqBody.consume));
	assertions.push(roomValidator.validateConsume(reqBody.preferentialConsume));
	assertions.push(roomValidator.validateDoll(reqBody.doll));
	assertions.push(roomValidator.validateSortIndex(reqBody.sortIndex));
// 	assertions.push(roomValidator.validateDollMachine(reqBody.dollMachine));
// 	assertions.push(roomValidator.validateDollMachinePaw(reqBody.dollMachinePaw));
	return assertions.result();
}

function validateUpdate(req, allowFault) {
	var reqBody = req.body;
	var assertions = new Assertion();
	if (reqBody.name !== undefined) {
		assertions.push(roomValidator.validateName(reqBody.name, allowFault));
	}
	if (reqBody.description !== undefined) {
		assertions.push(roomValidator.validateDescription(reqBody.description, allowFault));
	}
	if (reqBody.probability !== undefined) {
		assertions.push(roomValidator.validateProbability(reqBody.probability));
	}
	if (reqBody.jackpot !== undefined) {
		assertions.push(roomValidator.validateJackpot(reqBody.jackpot));
	}
	if (reqBody.limitNumber !== undefined) {
		assertions.push(roomValidator.validateLimitNumber(reqBody.limitNumber));
	}
	if (reqBody.point !== undefined) {
		assertions.push(roomValidator.validatePoint(reqBody.point));
	}
	if (reqBody.consume !== undefined) {
		assertions.push(roomValidator.validateConsume(reqBody.consume));
	}
	if (reqBody.preferentialConsume !== undefined) {
		assertions.push(roomValidator.validateConsume(reqBody.preferentialConsume));
	}
// 	if (reqBody.dollMachine !== undefined) {
// 		assertions.push(roomValidator.validateDollMachine(reqBody.dollMachine));
// 	}
// 	if (reqBody.dollMachinePaw !== undefined) {
// 		assertions.push(roomValidator.validateDollMachinePaw(reqBody.dollMachinePaw));
// 	}
	if (reqBody.sortIndex !== undefined) {
		assertions.push(roomValidator.validateSortIndex(reqBody.sortIndex));
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