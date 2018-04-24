/**
 * Created by Koan on 2017/12/7.
 */
'use strict';

var mongoose = require('mongoose'),
	appConfig = require('../utils/appConfig');
var Schema = mongoose.Schema,
	RechargeMall;

// schema
// --------------------------
var rechargeMallSchema = new Schema(
	{
		name            : {type: String, require: true},   // 名称
		thumbnail       : Schema.Types.ObjectId,   // 缩略图，一张
		description     : String,   // 简述
		validFlg        : {type: Boolean, default: false}, // 上架标识
		uploadTime      : {type: Date, default: function () {return new Date();}},  // 上传日期
		lastModifiedTime: {type: Date, default: function () {return new Date();}},  // 最后编辑日期
		uploadUser      : {type: Schema.Types.ObjectId, ref: 'User', required: true},  // 上传用户
		lastModifiedUser: {type: Schema.Types.ObjectId, ref: 'User', required: true},   // 最后一位修改的用户
		amount          : {type: Number, default: 0},  // 充值金额
		presentCoin     : {type: Number, default: 0},   // 额外赠送代币
		productId       : String // 苹果商城Id
	}
);

rechargeMallSchema.virtual('exchangeCoin')
	.set(function (exchangeCoin) {

	})
	.get(function () {
		return this.amount * appConfig.cashCoinRatio;
	});

RechargeMall = mongoose.model('RechargeMall', rechargeMallSchema);

rechargeMallSchema.options.toObject = rechargeMallSchema.options.toObject || {};
rechargeMallSchema.options.toJSON = rechargeMallSchema.options.toJSON || {};
rechargeMallSchema.options.toJSON.transform = rechargeMallSchema.options.toObject.transform = function (doc, obj, options) {
	obj.exchangeCoin = doc.exchangeCoin;
};

module.exports = RechargeMall;