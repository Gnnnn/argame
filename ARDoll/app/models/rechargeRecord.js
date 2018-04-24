/**
 * Created by Koan on 2017/11/20.
 */
'use strict';
var mongoose = require('mongoose'),
	helper = require('../utils/mongooseHelper');
var Schema = mongoose.Schema,
	RechargeRecord;

// 充值记录schema
// --------------------------
var rechargeRecordSchema = new Schema(
	{
		recharge     : {type: Schema.Types.ObjectId, ref: 'RechargeMall', required: true},  // 充值
		cash         : Number,   // 充值金额
		coin         : Number,   // 兑换代币
		visitor      : {type: Schema.Types.ObjectId, ref: 'Visitor', required: true},  // 充值账号
		type         : {type: String, default: 'ADMIN', require: true},  // 充值方式
		time         : {type: Date, default: function () {return new Date();}},  // 充值时间
		state        : {type: String, default: 'WAITING', require: true},   // 状态
		transactionId: String,  // 支付ID（微信或支付宝返回）
		timeEnd      : String,   // 支付完成时间
		errorInfo    : String
	}
);

// static
// ----------------
rechargeRecordSchema.statics = {
	// constants
	// --------------------
	constants: {
		types : new helper.Constant({
			WECHATPAY: 'WECHATPAY',
			ALIPAY   : 'ALIPAY',
			IOS      : 'IOS',
			ADMIN    : 'ADMIN'
		}),
		states: new helper.Constant({
			WAITING: 'WAITING',
			FINISH : 'FINISH',
			CANCEL : 'CANCEL'
		}),
	}
};

RechargeRecord = mongoose.model('RechargeRecord', rechargeRecordSchema);

module.exports = RechargeRecord;