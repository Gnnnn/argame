/**
 * Created by Koan on 2018/1/4.
 */
'use strict';
var async = require('async'),
	iap = require('iap'),
	RechargeMall = require('../../models/rechargeMall'),
	RechargeRecord = require('../../models/rechargeRecord'),
	Visitor = require('../../models/visitor'),
	appConfig = require('../appConfig');

const platform = 'apple';

module.exports = {
	verifyIOSPayment: function (req, callback) {
		var reqBody = req.body || {};
		var receipt = reqBody.receipt,
			productId = reqBody.productId;
		if (!receipt) {
			return callback(null, {
				errorMsg : '缺乏验证数据',
				productId: productId
			});
		}
		if (!productId) {
			return callback(null, {
				errorMsg : '缺乏商品ID',
				productId: productId
			});
		}
		var payment = {
			receipt    : receipt,
			productId  : productId,
			packageName: appConfig.pay.ios.bundleId // bundleId
		};
		iap.verifyPayment(platform, payment, function (err, response) {
			if (err) {
				return callback(null, {
					errorMsg : err,
					productId: productId
				});
			}
			var rtn = response.receipt;
			var productId = rtn['product_id'],
				transactionId = rtn['transaction_id'],
				timeEnd = rtn['purchase_date'],
				rechargeMall;
			var mallProductId = productId.replace('com.TianShe.DollMachine.', '');
			async.waterfall([
				RechargeMall.findOne.bind(RechargeMall, {productId: mallProductId}),
				function (mall, next) {
					if (!mall) {
						return next('找不到商品，请联系客服');
					}
					rechargeMall = mall;
					RechargeRecord.findOne({transactionId: transactionId}, next);
				},
				function (record, next) {
					if (record) {
						return next('该充值代币已到账');
					}
					var rechargeRecord = new RechargeRecord({
						recharge     : rechargeMall._id,
						cash         : rechargeMall.amount,   // 充值金额
						coin         : rechargeMall.exchangeCoin + rechargeMall.presentCoin,   // 兑换代币
						visitor      : req.visitor._id,
						type         : 'IOS',
						time         : new Date(),
						state        : 'FINISH',
						transactionId: transactionId,
						timeEnd      : timeEnd
					});
					rechargeRecord.save(next);
				},
				function (record, count, next) {
					var visitor = req.visitor;
					var updateSet = {
						$inc: {coin: record.coin}
					};
					if (!visitor.finishFirstCharge && rechargeMall.amount >= 68) {
						updateSet['$inc'].point = 2100;
						updateSet['$set'] = {
							finishFirstCharge: true
						}
					}
					Visitor.findByIdAndUpdate(visitor._id, updateSet, {
						new   : true,
						fields: {
							_id              : 1,
							coin             : 1,
							point            : 1,
							finishFirstCharge: 1
						}
					}, next);
				}
			], function (err, visitor) {
				if (err) {
					return callback(null, {
						errorMsg : err,
						productId: productId
					});
				}
				return callback(null, {
					coin             : visitor.coin,
					point            : visitor.point,
					finishFirstCharge: visitor.finishFirstCharge,
					productId        : productId
				});
			});
		});
	}
};