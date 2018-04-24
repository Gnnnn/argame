/**
 * Created by Koan on 2017/9/21.
 */
'use strict';

var validator = require('validator'),
	versionValidator = require('../version'),
	Assertion = require('../../utils/assertion');

function validate(req, allowFault) {
	var reqBody = req.body;
	var assertions = new Assertion();
	assertions.push(versionValidator.validateVersion(reqBody.version, allowFault));
	assertions.push(versionValidator.validateUpdateNews(reqBody.updateNews, allowFault));
	return assertions.result();
}
module.exports = {
	validateCreation    : function (req) {
		return validate(req);
	}
};