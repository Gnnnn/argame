/**
 * Created by Koan on 2017/12/11.
 */
'use strict';


var async = require('async'),
	RechargeMall = require('../../models/rechargeMall'),
	RechargeRecord = require('../../models/rechargeRecord'),
	Visitor = require('../../models/visitor'),
	appConfig = require('../appConfig'),
	logger = require('../logger'),
	WXPay = require('./wechat/wxpay');

var wxpay = WXPay({
	appid : appConfig.pay.wechat.appId,
	mch_id: appConfig.pay.wechat.mchId,
	apiKey: appConfig.pay.wechat.apiKey  //微信商户平台API密钥
});

module.exports = {
	buildWechatpayData: function (req, callback) {
		var visitor = req.visitor,
			rechargeMallId = req.params.id,
			rechargeMall, recordId;
		async.waterfall([
			RechargeMall.findOne.bind(RechargeMall, {_id: rechargeMallId}),
			function (_rechargeMall, next) {
				if (!_rechargeMall) {
					return next('无该充值种类');
				}
				rechargeMall = _rechargeMall;
				var rechargeRecord = new RechargeRecord({
					recharge: rechargeMall._id,
					cash    : rechargeMall.amount * 100,   // 充值金额
					coin    : rechargeMall.exchangeCoin + rechargeMall.presentCoin,   // 兑换代币
					visitor : visitor._id,
					type    : 'WECHATPAY',
					time    : new Date(),
					state   : 'WAITING'
				});
				rechargeRecord.save(next);
			},
			function (rechargeRecord, count, next) {
				recordId = rechargeRecord._id.toString();
				var ip = req.headers['x-forwarded-for'] ||
				         req.connection.remoteAddress ||
				         req.socket.remoteAddress ||
				         req.connection.socket.remoteAddress;
				wxpay.createUnifiedOrder({
					body            : 'AR娃娃机' + '-' + rechargeMall.name,
					out_trade_no    : recordId,
					total_fee       : rechargeMall.amount * 100,
					spbill_create_ip: ip.replace('::ffff:', ''),
					notify_url      : appConfig.pay.wechat.callbackUrl,
					trade_type      : 'APP'
				}, next);
			},
			function (results, next) {
				results = results || {};
				if (results['return_code'] != 'SUCCESS' || results['result_code'] != 'SUCCESS') {
					return next(results['return_msg'] || results['err_code_des'] || '订单生成失败');
				}
				var config = wxpay.prepay(results);
				next(null, config);
			}
		], function (err, results) {
			if (err) {
				return callback(err);
			}
			results['out_trade_no'] = recordId;
			callback(null, results);
		});
	},
	wechatpayCallback : function (req, res, callback) {
		wxpay.useWXCallback(function (msg, req, res, next) {
			// 处理商户业务逻辑
			if (msg.return_code.toUpperCase() === 'SUCCESS') {
				var sign = msg['sign'],
					recordId = msg['out_trade_no'],
					transactionId = msg['transaction_id'],
					timeEnd = msg['time_end'],
					cashFee = msg['total_fee'],
					openid = msg['openid'],
					errorInfo = '',
					record;
				async.waterfall([
					// 验签
					function (next) {
						if (wxpay.sign(msg) != sign) {
							errorInfo = '验签失败';
						}
						next(errorInfo);
					},
					function (next) {
						RechargeRecord.findOne({_id: recordId}).populate('recharge visitor').exec(next);
					},
					function (_record, next) {
						record = _record;
						if (!record) {
							errorInfo = '无支付订单记录';
						}
						if (record.cash != cashFee) {
							errorInfo = '金额不匹配';
						}
						if (record.visitor.openId != openid) {
							errorInfo = '用户不匹配';
						}
						if (record.state == 'FINISH') {
							errorInfo = '支付已完成';
							return next(errorInfo);
						}
						record.state = 'FINISH';
						record.transactionId = transactionId;
						record.timeEnd = timeEnd;
						record.errorInfo = errorInfo;
						record.save(next);
					},
					function (record, count, next) {
						if (record.errorInfo) {
							return next(record.errorInfo);
						}
						var visitor = record.visitor || {};
						var updateSet = {
							$inc: {coin: record.coin}
						};
						if (!visitor.finishFirstCharge && cashFee >= 6800) {
							updateSet['$inc'].point = 2100;
							updateSet['$set'] = {
								finishFirstCharge: true
							}
						}
						Visitor.findByIdAndUpdate(visitor._id, updateSet, next);
					}
				], function (err) {
					if (err) {
						logger.error(err);
					}
					if (err == '验签失败') {
						return res.fail();
					}
					// res.success() 向微信返回处理成功信息，res.fail()返回失败信息。
					res.success();
				});
			}
		})(req, res, callback);
	},
	getWechatResult   : function (req, callback) {
		var recordId = req.params.id;
		async.waterfall([
			function (next) {
				RechargeRecord.findOne({_id: recordId}).populate('visitor').exec(next);
			},
			function (record, next) {
				if (!record) {
					return callback('查询不到有效数据');
				}
				return next(null, {
					_id    : record._id,
					visitor: {
						_id              : record.visitor._id,
						coin             : record.visitor.coin,
						point            : record.visitor.point,
						finishFirstCharge: record.visitor.finishFirstCharge,
					},
					state  : record.state,
					type   : record.type
				});
			}
		], callback);
	}
};