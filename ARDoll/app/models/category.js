/**
 * Created by Koan on 2017/11/27.
 */
'use strict';

var mongoose = require('mongoose'),
	helper = require('../utils/mongooseHelper');
var Schema = mongoose.Schema,
	Category;

// schema
// --------------------------
var categorySchema = new Schema(
	{
		name            : {type: String, require: true},   // 分类名称
		thumbnail       : Schema.Types.ObjectId,   // 缩略图，一张
		document        : Schema.Types.ObjectId,   // 文件
		description     : String,   // 简述
		uploadTime      : {type: Date, default: function () {return new Date();}},  // 上传日期
		lastModifiedTime: {type: Date, default: function () {return new Date();}},  // 最后编辑日期
		uploadUser      : {type: Schema.Types.ObjectId, ref: 'User', required: true},  // 上传用户
		lastModifiedUser: {type: Schema.Types.ObjectId, ref: 'User', required: true},   // 最后一位修改的用户
		sortIndex       : {type: Number, default: 0}   // 排序序号
	}
);

Category = mongoose.model('Category', categorySchema);

module.exports = Category;