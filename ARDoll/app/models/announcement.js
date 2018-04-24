/**
 * Created by Koan on 2017/9/28.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema,
	Announcement;

// schema
// --------------------------
var announcementSchema = new Schema(
	{
		name            : {type: String, require: true},   // 名称
		tag             : {type: String, require: true},   // 标签
		uploadTime      : {type: Date, default: function () {return new Date();}},  // 上传日期
		lastModifiedTime: {type: Date, default: function () {return new Date();}},  // 最后编辑日期
		uploadUser      : {type: Schema.Types.ObjectId, ref: 'User', required: true},  // 上传用户
		lastModifiedUser: {type: Schema.Types.ObjectId, ref: 'User', required: true},   // 最后一位修改的用户
		thumbnail       : Schema.Types.ObjectId,   // 缩略图，一张
		document        : Schema.Types.ObjectId   // 详细图，一张
	}
);

Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;