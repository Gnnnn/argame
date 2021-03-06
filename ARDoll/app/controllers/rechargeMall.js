/**
 * Created by Koan on 2017/11/20.
 */
'use strict';
var alipayUtil = require('../utils/pay/alipay'),
	wechatpayUtil = require('../utils/pay/wechatpay');

function deleteReqBody(reqBody) {
	delete reqBody.uploadTime;
	delete reqBody.uploadUser;
	delete reqBody.lastModifiedTime;
	delete reqBody.lastModifiedUser;
}

module.exports = {
	rechargeMallCreateTransformer: function (req) {
		var reqBody = req.body;
		if (reqBody) {
			deleteReqBody(reqBody);
			reqBody.uploadTime = new Date();
			reqBody.uploadUser = req.me._id;
			reqBody.lastModifiedTime = new Date();
			reqBody.lastModifiedUser = req.me._id;
		}
	},
	rechargeMallUpdateTransformer: function (req) {
		var reqBody = req.body;
		if (reqBody) {
			deleteReqBody(reqBody);
			reqBody.lastModifiedTime = new Date();
			reqBody.lastModifiedUser = req.me._id;
		}
	},
	buildAlipayData              : function (req, callback) {
		return alipayUtil.buildAlipayData(req, callback);
	},
	buildWechatData              : function (req, callback) {
		return wechatpayUtil.buildWechatpayData(req, callback);
	}
};