/**
 * Created by Koan on 2017/12/3.
 */
'use strict';

var mongoose = require('mongoose'),
	helper = require('../utils/mongooseHelper');
var Schema = mongoose.Schema,
	DailyShare;

// schema
// --------------------------
var dailyShareSchema = new Schema(
	{
		visitor: {type: Schema.Types.ObjectId, ref: 'Visitor', require: true, index: true},  // 用户
		time   : {type: Date, default: function () {return new Date();}, index: true}  // 时间
	}
);

DailyShare = mongoose.model('DailyShare', dailyShareSchema);

module.exports = DailyShare;