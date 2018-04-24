/**
 * Created by Koan on 2017/9/28.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema,
	Notice;

// schema
// --------------------------
var noticeSchema = new Schema(
	{
		title           : {type: String, require: true},   // 标题
		content         : {type: String, require: true},   // 正文
		uploadTime      : {type: Date, default: function () {return new Date();}},  // 上传日期
		lastModifiedTime: {type: Date, default: function () {return new Date();}},  // 最后编辑日期
		uploadUser      : {type: Schema.Types.ObjectId, ref: 'User', required: true},  // 上传用户
		lastModifiedUser: {type: Schema.Types.ObjectId, ref: 'User', required: true}   // 最后一位修改的用户
	}
);

Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;