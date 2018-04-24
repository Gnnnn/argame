/**
 * Created by Koan on 2017/12/1.
 */
'use strict';

var mongoose = require('mongoose'),
	helper = require('../utils/mongooseHelper');
var Schema = mongoose.Schema,
	DailySign;

// schema
// --------------------------
var dailySignSchema = new Schema(
	{
		visitor: {type: Schema.Types.ObjectId, ref: 'Visitor', require: true, index: true},  // 用户
		time   : {type: Date, default: function () {return new Date();}, index: true}  // 时间
	}
);

DailySign = mongoose.model('DailySign', dailySignSchema);

module.exports = DailySign;