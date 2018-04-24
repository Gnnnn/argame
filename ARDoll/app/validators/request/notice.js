/**
 * Created by Koan on 2017/9/28.
 */
'use strict';

var validator = require('validator'),
	noticeValidator = require('../notice'),
	Assertion = require('../../utils/assertion');

function validate(req, allowFault) {
	var reqBody = req.body;
	var assertions = new Assertion();
	assertions.push(noticeValidator.validateTitle(reqBody.title, allowFault));
	assertions.push(noticeValidator.validateContent(reqBody.content, allowFault));
	return assertions.result();
}
module.exports = {
	validateCreation: function (req) {
		return validate(req);
	},
	validateUpdate  : function (req) {
		return validate(req);
	}
};