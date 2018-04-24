/**
 * Created by Koan on 2017/12/3.
 */
'use strict';

var mongoose = require('mongoose'),
	helper = require('../utils/mongooseHelper');
var Schema = mongoose.Schema,
	Share;

// schema
// --------------------------
var shareSchema = new Schema(
	{
		visitor   : {type: Schema.Types.ObjectId, ref: 'Visitor', require: true, index: true},  // 用户
		playRecord: {type: Schema.Types.ObjectId, ref: 'PlayRecord', require: true, index: true},  // 对应抓取记录
		time      : {type: Date, default: function () {return new Date();}},  // 时间
		type      : String
	}
);

Share = mongoose.model('Share', shareSchema);

module.exports = Share;