/**
 * Created by Koan on 2017/11/22.
 */
'use strict';


var mongoose = require('mongoose'),
	helper = require('../utils/mongooseHelper');
var Schema = mongoose.Schema,
	Room;

// schema
// --------------------------
var roomSchema = new Schema(
	{
		name               : {type: String, require: true},   // 房间名称
		thumbnail          : Schema.Types.ObjectId,   // 缩略图，一张
		shareThumbnail     : Schema.Types.ObjectId,  // 分享图
		document           : Schema.Types.ObjectId,   // 文件
		description        : String,   // 简述
		validFlg           : {type: Boolean, default: false}, // 上架标识
		uploadTime         : {type: Date, default: function () {return new Date();}},  // 上传日期
		lastModifiedTime   : {type: Date, default: function () {return new Date();}},  // 最后编辑日期
		uploadUser         : {type: Schema.Types.ObjectId, ref: 'User', required: true},  // 上传用户
		lastModifiedUser   : {type: Schema.Types.ObjectId, ref: 'User', required: true},   // 最后一位修改的用户
		playedTimes        : {type: Number, default: 0},  // 被游玩次数
		probability        : {type: Number, default: 0.01},  // 抓取概率
		jackpot            : {type: Number, default: 500},  // 奖池
		limitNumber        : {type: Number, default: 0}, // 总数
		catchedNumber      : {type: Number, default: 0}, // 被抓取数量
		point              : {type: Number, default: 0}, // 抓取可得积分
		consume            : {type: Number, default: 20},  // 每次抓取消耗代币
		preferentialConsume: {type: Number, default: 18},  // 连续抓取消耗代币
		doll               : {type: Schema.Types.ObjectId, ref: 'Doll', required: true},  // 绑定的娃娃
		dollMachine        : {type: Schema.Types.ObjectId, ref: 'DollMachine'},  // 绑定的娃娃机
		dollMachinePaw     : {type: Schema.Types.ObjectId, ref: 'DollMachinePaw'},  // 绑定的娃娃机爪子
		tag                : {type: Schema.Types.ObjectId, ref: 'Tag'},  // 标签
		category           : {type: Schema.Types.ObjectId, ref: 'Category'},  // 分类
		sortIndex          : {type: Number, default: 0}   // 排序序号
	}
);

Room = mongoose.model('Room', roomSchema);

module.exports = Room;