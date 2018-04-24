/**
 * Created by Koan on 2017/11/13.
 */
'use strict';

var mongoose = require('mongoose'),
	helper = require('../utils/mongooseHelper');
var Schema = mongoose.Schema,
	DollMachine;

// schema
// --------------------------
var dollMachineSchema = new Schema(
	{
		name            : {type: String, require: true},   // 名称
		thumbnail       : Schema.Types.ObjectId,   // 缩略图，一张
		document        : Schema.Types.ObjectId,   // 文件
		androidDocument : Schema.Types.ObjectId,   // 安卓文件
		description     : String,   // 简述
		uploadTime      : {type: Date, default: function () {return new Date();}},  // 上传日期
		lastModifiedTime: {type: Date, default: function () {return new Date();}},  // 最后编辑日期
		uploadUser      : {type: Schema.Types.ObjectId, ref: 'User', required: true},  // 上传用户
		lastModifiedUser: {type: Schema.Types.ObjectId, ref: 'User', required: true}   // 最后一位修改的用户
	}
);

DollMachine = mongoose.model('DollMachine', dollMachineSchema);

module.exports = DollMachine;