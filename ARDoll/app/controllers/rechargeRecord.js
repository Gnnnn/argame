/**
 * Created by Koan on 2017/12/11.
 */
'use strict';

var alipayUtil = require('../utils/pay/alipay'),
	wechatpayUtil = require('../utils/pay/wechatpay'),
	iospayUtil = require('../utils/pay/iospay');

module.exports = {
	getAlipayResult  : function (req, callback) {
		return alipayUtil.getAlipayResult(req, callback);
	},
	getWechatResult  : function (req, callback) {
		return wechatpayUtil.getWechatResult(req, callback);
	},
	wechatpayCallback: function (req, res, callback) {
		return wechatpayUtil.wechatpayCallback(req, res, callback);
	},
	alipayCallback   : function (req, res, callback) {
		return alipayUtil.alipayCallback(req, res, callback);
	},
	verifyIOSPayment : function (req, callback) {
		return iospayUtil.verifyIOSPayment(req, callback);
	}
};