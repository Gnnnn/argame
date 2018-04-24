/**
 * Created by Koan on 2017/12/11.
 */
'use strict';

var async = require('async'),
	Alipay = require('alipay-mobile'),
	RechargeMall = require('../../models/rechargeMall'),
	RechargeRecord = require('../../models/rechargeRecord'),
	Visitor = require('../../models/visitor'),
	logger = require('../logger'),
	appConfig = require('../appConfig'),
	alipayUtil = require('./ali/util');

//app_id: 开放平台 appid
//appPrivKeyFile: 应用私钥
//alipayPubKeyFile: 蚂蚁金服公钥
const options = {
	app_id          : appConfig.pay.alipay.appId,
	appPrivKeyFile  : appConfig.pay.alipay.appPrivKeyFile,
	alipayPubKeyFile: appConfig.pay.alipay.alipayPubKeyFile,
	notify_url      : appConfig.pay.alipay.callbackUrl
};

const alipayService = new Alipay(options);

module.exports = {
	buildAlipayData: function (req, callback) {
		var visitor = req.visitor,
			rechargeMallId = req.params.id,
			rechargeMall;
		async.waterfall([
			RechargeMall.findOne.bind(RechargeMall, {_id: rechargeMallId}),
			function (_rechargeMall, next) {
				if (!_rechargeMall) {
					return next('无该充值种类');
				}
				rechargeMall = _rechargeMall;
				var rechargeRecord = new RechargeRecord({
					recharge: rechargeMall._id,
					cash    : rechargeMall.amount,   // 充值金额
					coin    : rechargeMall.exchangeCoin + rechargeMall.presentCoin,   // 兑换代币
					visitor : visitor._id,
					type    : 'ALIPAY',
					time    : new Date(),
					state   : 'WAITING'
				});
				rechargeRecord.save(next);
			},
			function (rechargeRecord, count, next) {
				var data = {
					subject        : rechargeMall.name,
					out_trade_no   : rechargeRecord._id.toString(),
					total_amount   : rechargeMall.amount,
					timeout_express: '30m',
					body           : rechargeMall.description

				};
				return alipayService.createOrder(data).then(next);
			}
		], function (err) {
			if (err.message === 'success') {
				return callback(null, err.data);
			}
			return callback(err.message);
		});
	},
	alipayCallback : function (req, res, callback) {
		var msg = req.body;
		var tradeStatus = msg['trade_status'] || '';
		// 处理商户业务逻辑
		if (tradeStatus != 'TRADE_SUCCESS' || tradeStatus != 'TRADE_FINISHED') {
			var sign = msg['sign'],
				recordId = msg['out_trade_no'],
				transactionId = msg['trade_no'],
				timeEnd = msg['gmt_close'],
				cashFee = msg['total_amount'],
				errorInfo = '',
				record;
			async.waterfall([
				// 验签
				function (next) {
					if (!alipayUtil.verifySign(msg, "-----BEGIN PUBLIC KEY-----\n" + appConfig.pay.alipay.alipayPubKeyFile + "\n-----END PUBLIC KEY-----")) {
						return next('验签失败');
					}
					return next();
				},
				function (next) {
					RechargeRecord.findOne({_id: recordId}).populate('recharge visitor').exec(next);
				},
				function (_record, next) {
					record = _record;
					if (!record) {
						errorInfo = '无支付订单记录';
						return next(errorInfo);
					}
					if (record.recharge.amount != cashFee) {
						errorInfo = '金额不匹配';
						return next(errorInfo);
					}
// 						if (record.visitor.openId != openid) {
// 							errorInfo = '用户不匹配';
// 						}
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
					if (!visitor.finishFirstCharge && cashFee >= 68) {
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
					return res.end();
				}
				// res.success() 向微信返回处理成功信息，res.fail()返回失败信息。
				res.end('success');
			});
		}
		else {
			res.end('success');
		}
	},
	getAlipayResult: function (req, callback) {
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