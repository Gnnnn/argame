/**
 * Created by Koan on 2017/9/21.
 */
'use strict';

var validator = require('validator'),
	Assertion = require('../utils/assertion');

module.exports = {
	validateVisitor       : function (visitorId) {
		visitorId = visitorId ? visitorId.toString() : '';
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(visitorId), '未知用户：用户id为空');
		return assertions.result();
	},
	validateAddress       : function (address) {
		address = address ? address : '';
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(address), '地址不能为空');
		return assertions.result();
	},
	validateCellPhone     : function (cellPhone) {
		cellPhone = cellPhone ? cellPhone : '';
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(cellPhone), '联系方式不能为空');
		return assertions.result();
	},
	validateConsignee     : function (consignee) {
		consignee = consignee ? consignee : '';
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(consignee), '收件人不能为空');
		return assertions.result();
	},
	validateExpressCompany: function (expressCompany) {
		expressCompany = expressCompany ? expressCompany : '';
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(expressCompany), '快递公司不能为空');
		return assertions.result();
	},
	validateExpressNo     : function (expressNo) {
		expressNo = expressNo ? expressNo : '';
		var assertions = Assertion
			.assertInstant(!validator.isEmpty(expressNo), '快递单号不能为空');
		return assertions.result();
	},
};