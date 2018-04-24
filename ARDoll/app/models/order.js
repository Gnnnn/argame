/**
 * Created by Koan on 2017/12/13.
 */
'use strict';

var mongoose = require('mongoose'),
	helper = require('../utils/mongooseHelper');
var Schema = mongoose.Schema,
	Order;

// schema
// --------------------------
var orderSchema = new Schema(
	{
		visitor       : {type: Schema.Types.ObjectId, ref: 'Visitor', required: true, index: true},  // 购买用户
		time          : {type: Date, default: function () {return new Date();}},  // 日期
		playRecord    : {type: Schema.Types.ObjectId, ref: 'PlayRecord'},  // 对应抓取记录
		pointMall     : {type: Schema.Types.ObjectId, ref: 'PointMall'},  // 对应积分商城商品
		consumePoint  : {type: Number, default: 0},   // 消费积分
		address       : String,     // 送货地址
		cellPhone     : String,     // 手机号
		consignee     : String,     // 收件人
		state         : {type: String, default: 'WAITING'},   // 状态
		handleUser    : {type: Schema.Types.ObjectId, ref: 'User'},   // 管理员处理人
		handleTime    : Date,   // 处理日期
		expressCompany: String,   // 快递公司
		expressNo     : String    // 快递单号
	}
);

orderSchema.statics = {
	// constants
	// --------------------
	constants: {
		states: new helper.Constant({
			NEW      : 'NEW', // 新建
			WAITING  : 'WAITING', // 待处理
			DELIVERED: 'DELIVERED' // 已发货
		})
	}
};

Order = mongoose.model('Order', orderSchema);

module.exports = Order;