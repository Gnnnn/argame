/**
 * Created by Koan on 2017/11/27.
 */
'use strict';
var mongoose = require('mongoose'),
	helper = require('../utils/mongooseHelper');
var Schema = mongoose.Schema,
	PlayRecord;

// 游玩记录schema
// --------------------------
var playRecordSchema = new Schema(
	{
		visitor      : {type: Schema.Types.ObjectId, ref: 'Visitor', require: true, index: true},  // 用户
		room         : {type: Schema.Types.ObjectId, ref: 'Room', require: true, index: true},  // 游玩房间
		time         : {type: Date, default: function () {return new Date();}, index: true},  // 游玩时间
		cost         : {type: Number, default: 0},  // 消耗代币，为0代表消费的是免费券
		point        : {type: Number, default: 0},  // 获取积分
		succeedFlg   : {type: Boolean, default: false},  // 成功标识
		preSucceedFlg: {type: Boolean, default: false}  // 预先生成的成功标志
	}
);

PlayRecord = mongoose.model('PlayRecord', playRecordSchema);

module.exports = PlayRecord;