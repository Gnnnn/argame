/**
 * Created by Koan on 2017/12/7.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema,
	PointMall;

// schema
// --------------------------
var pointMallSchema = new Schema(
	{
		name            : {type: String, require: true},   // 名称
		thumbnail       : Schema.Types.ObjectId,   // 缩略图，一张
		document        : [Schema.Types.ObjectId],   // 多张详细图
		description     : String,   // 简述
		validFlg        : {type: Boolean, default: false}, // 上架标识
		uploadTime      : {type: Date, default: function () {return new Date();}},  // 上传日期
		lastModifiedTime: {type: Date, default: function () {return new Date();}},  // 最后编辑日期
		uploadUser      : {type: Schema.Types.ObjectId, ref: 'User', required: true},  // 上传用户
		lastModifiedUser: {type: Schema.Types.ObjectId, ref: 'User', required: true},   // 最后一位修改的用户
		consumePoint    : {type: Number, default: 0},  // 消费积分
		price           : {type: Number, default: 0},  // 原价
		tag             : {type: Schema.Types.ObjectId, ref: 'Tag'},  // 标签
		category        : {type: Schema.Types.ObjectId, ref: 'Category'}  // 分类
	}
);

PointMall = mongoose.model('PointMall', pointMallSchema);

module.exports = PointMall;