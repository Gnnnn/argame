/**
 * Created by Koan on 2017/11/28.
 */
'use strict';
var async = require('async'),
	moment = require('moment'),
	Room = require('../models/room'),
	Announcement = require('../models/announcement'),
	Doll = require('../models/doll'),
	DollMachine = require('../models/dollMachine'),
	DollMachinePaw = require('../models/dollMachinePaw'),
	Category = require('../models/category'),
	Tag = require('../models/tag'),
	Visitor = require('../models/visitor'),
	PlayRecord = require('../models/playRecord'),
	DailyShare = require('../models/dailyShare'),
	DailySign = require('../models/dailySign'),
	appConfig = require('../utils/appConfig');

var playInfoDetails,
	roomsObj,
	categoriesObj,
	tagsObj,
	dollsObj,
	dollMachinesObj,
	dollMachinePawsObj;

var roomJackpots,
	roomProbability,
	roomJackpotsFill = {};

var freeRoom = {};

function getAnnouncements(callback) {
	var fields = {
		_id             : 1,
		name            : 1,
		tag             : 1,
		thumbnail       : 1,
		document        : 1,
		lastModifiedTime: 1
	};
	Announcement.find({}, fields)
		.sort('-_id')
		.limit(5)
		.exec(callback);
}

function getValidRooms(callback) {
	var fields = {
		_id                : 1,
		name               : 1,
		description        : 1,
		thumbnail          : 1,
		shareThumbnail     : 1,
		document           : 1,
		doll               : 1,
		dollMachine        : 1,
		dollMachinePaw     : 1,
		category           : 1,
		tag                : 1,
		consume            : 1,
		preferentialConsume: 1,
		lastModifiedTime   : 1,
		jackpot            : 1,
		sortIndex          : 1,
		probability        : 1,
		point              : 1
	};
	Room.find({validFlg: true}, fields)
		.sort('sortIndex')
		.populate([
			{
				path  : 'doll',
				select: '_id name description thumbnail document androidDocument lastModifiedTime'
			},
			{
				path  : 'dollMachine',
				select: '_id name description thumbnail document androidDocument lastModifiedTime'
			},
			{
				path  : 'dollMachinePaw',
				select: '_id name description thumbnail document androidDocument lastModifiedTime'
			},
			{
				path  : 'category',
				select: '_id name description thumbnail document lastModifiedTime sortIndex'
			},
			{
				path  : 'tag',
				select: '_id name description thumbnail document lastModifiedTime'
			}
		])
		.exec(callback);
}

function restructRooms(orgRooms, callback) {
	if (!orgRooms) {
		return callback(null);
	}
	var rooms = [],
		categories = [],
		tags = [],
		dolls = [],
		dollMachines = [],
		dollMachinePaws = [];

	roomsObj = {};
	categoriesObj = {};
	tagsObj = {};
	dollsObj = {};
	dollMachinesObj = {};
	dollMachinePawsObj = {};

	roomJackpots = {};
	roomProbability = {};

	for (var roomIndex = 0, roomLength = orgRooms.length; roomIndex < roomLength; roomIndex++) {
		var room = orgRooms[roomIndex];
		if (room.category) {
			if (!categoriesObj[room.category._id]) {
				categories.push(room.category);
				categoriesObj[room.category._id] = room.category;
			}
			room.category = room.category._id;
		}
		if (room.tag) {
			if (!tagsObj[room.tag._id]) {
				tags.push(room.tag);
				tagsObj[room.tag._id] = room.tag;
			}
			room.tag = room.tag._id;
		}
		if (room.doll) {
			if (!dollsObj[room.doll._id]) {
				dolls.push(room.doll);
				dollsObj[room.doll._id] = room.doll;
			}
			room.doll = room.doll._id;
		}
		if (room.dollMachine) {
			if (!dollMachinesObj[room.dollMachine._id]) {
				dollMachines.push(room.dollMachine);
				dollMachinesObj[room.dollMachine._id] = room.dollMachine;
			}
			room.dollMachine = room.dollMachine._id;
		}
		if (room.dollMachinePaw) {
			if (!dollMachinePawsObj[room.dollMachinePaw._id]) {
				dollMachinePaws.push(room.dollMachinePaw);
				dollMachinePawsObj[room.dollMachinePaw._id] = room.dollMachinePaw;
			}
			room.dollMachinePaw = room.dollMachinePaw._id;
		}
		roomJackpots[room._id] = room.jackpot;
		roomProbability[room._id] = room.probability;
		var _room = room.toObject();
		delete _room.jackpot;
		delete _room.probability;
		roomsObj[room._id] = room;
		rooms.push(_room);
	}
	var roomDetail = {
		rooms,
		categories,
		tags,
		dolls,
		dollMachines,
		dollMachinePaws
	};
	return callback(null, roomDetail);
}

function reRestructPlayInfo(callback) {
	playInfoDetails = {};
	async.waterfall([
		getValidRooms,
		restructRooms,
		function (_results, next) {
			playInfoDetails = _results || {}
			getAnnouncements(next);
		}
	], function (err, announcements) {
		if (err) {
			return callback(err);
		}
		playInfoDetails.announcements = announcements;
		return callback(null, playInfoDetails);
	});
}

function dailySign(visitor, callback) {
	var visitorId = visitor._id,
		today = moment().format('L');
	async.waterfall([
		DailySign.findOne.bind(DailySign, {time: {"$gte": today}}),
		function (signTtn, next) {
			if (signTtn) {
				return next('今日签到已完成');
			}
			var newSign = new DailySign({
				visitor: visitorId,
				time   : new Date()
			});
			async.parallel({
				visitor: Visitor.findByIdAndUpdate.bind(Visitor, visitorId, {$inc: {freeCoupons: 1}}, {
					new   : true,
					fields: {
						_id        : 1,
						freeCoupons: 1
					}
				}),
				sign   : function (next) {
					newSign.save(function (err, rtn, count) {
						if (err) {
							return next(err);
						}
						return next(null, rtn);
					});
				}
			}, next);
		}
	], callback);
}

function dailyShare(visitor, callback) {
	var visitorId = visitor._id,
		today = moment().format('L');
	async.waterfall([
		DailyShare.findOne.bind(DailyShare, {time: {"$gte": today}}),
		function (signTtn, next) {
			if (signTtn) {
				return next('今日分享已完成');
			}
			var newShare = new DailyShare({
				visitor: visitorId,
				time   : new Date()
			});
			async.parallel({
				visitor: Visitor.findByIdAndUpdate.bind(Visitor, visitorId, {$inc: {freeCoupons: 1}}, {
					new   : true,
					fields: {
						_id        : 1,
						freeCoupons: 1
					}
				}),
				share  : function (next) {
					newShare.save(function (err, rtn, count) {
						if (err) {
							return next(err);
						}
						return next(null, rtn);
					});
				}
			}, next);
		}
	], callback);
}

function randomSuccess(successFlg) {
	var num = Math.round(1000 * Math.random());
	var str2 = num.toString(2);
	if (successFlg) {
		str2 += '1';
	}
	else {
		str2 += '0';
	}
	str2 += Math.round(Math.random()).toString() + Math.round(Math.random()).toString();
	return parseInt(str2, 2);
}

module.exports = {
	getAllDetails                : function (req, callback) {
// 		if (playInfoDetails) {
// 			return callback(null, playInfoDetails);
// 		}
		reRestructPlayInfo(callback);
	},
	reRestructPlayInfo           : function (callback) {
		reRestructPlayInfo(callback);
	},
	reRestructPlayInfoAfterUpdate: function (updateFunc) {
		return function (req, calllback) {
			return updateFunc(req, function (err, results) {
				if (err) {
					return calllback(err);
				}
				calllback(null, results);
// 				reRestructPlayInfo(function (err) {
// 					if (err) {
// 						return calllback(err);
// 					}
// 					calllback(null, results);
// 				});
			});
		};
	},
	getAllBriefs                 : function (req, callback) {

	},
	playRoomByCoin               : function (req, callback) {
		var visitor = req.visitor,
			roomId = req.params.roomId,
			appConsume = req.body.consume,
			rtnVisitor;
		if (!appConsume) {
			return callback('请传入消耗代币');
		}
		if (!roomsObj || !roomsObj[roomId]) {
			return callback('未知游戏房间！');
		}
		var consume = roomsObj[roomId].consume,
			point = roomsObj[roomId].point || 0;
		if (appConsume !== consume) {
			return callback('当前游戏消耗代币与服务器不一致，请重新加载');
		}
		if (visitor.coin < consume) {
			return callback('CoinEmpty');
		}
		async.waterfall([
			// 增加游玩次数
			Room.findByIdAndUpdate.bind(Room, roomId, {$inc: {playedTimes: 1}}),
			function (rtnRoom, next) {
				// 扣除用户代币
				Visitor.findByIdAndUpdate(visitor._id, {$inc: {coin: -(consume), point: point}}, {
					new   : true,
					fields: {
						_id  : 1,
						coin : 1,
						point: 1
					}
				}, next);
			},
			// 判断是否可以抓住，并记录
			function (_rtnVisitor, next) {
				rtnVisitor = _rtnVisitor;
				var record = new PlayRecord({
					visitor      : visitor._id,
					room         : roomId,
					time         : new Date(),
					cost         : consume,
					succeedFlg   : false,
					point        : point,
					preSucceedFlg: false
				});
				if (!roomJackpotsFill[roomId]) {
					// 新建奖池
					roomJackpotsFill[roomId] = 0;
				}
				if (roomJackpotsFill[roomId] > roomJackpots[roomId] && Math.random() < roomProbability[roomId]) {
					// 成功后重制奖池
					record.preSucceedFlg = true;
					roomJackpotsFill[roomId] -= roomJackpots[roomId];
				}
				// 增加奖池
				var addNum = consume - point * appConfig.pointCoinRatio;
				addNum = addNum < 1 ? 1 : addNum;
				roomJackpotsFill[roomId] += addNum;
				console.log(roomId, roomJackpotsFill[roomId]);
				record.save(next);
			},
			// 返回成功标识
			function (savedRecord, count, next) {
				if (savedRecord.preSucceedFlg) {
					var agenda = require('../app').agenda;
					agenda.schedule('in 2 minutes', agenda.jobDefines.READDROOMJACKPOT, {
						recordId: savedRecord._id,
						roomId  : savedRecord.room
					});
				}
				next(null, {
					_id    : savedRecord._id,
					random : randomSuccess(savedRecord.preSucceedFlg),
					visitor: rtnVisitor
				});
			}
		], callback);
	},
	playRoomByCoinDiscount       : function (req, callback) {
		var visitor = req.visitor,
			roomId = req.params.roomId,
			appConsume = req.body.preferentialConsume,
			rtnVisitor;
		if (!appConsume) {
			return callback('请传入消耗代币');
		}
		if (!roomsObj || !roomsObj[roomId]) {
			return callback('未知游戏房间！');
		}
		var consume = roomsObj[roomId].preferentialConsume,
			point = roomsObj[roomId].point;
		if (appConsume !== consume) {
			return callback('当前游戏消耗代币与服务器不一致，请重新加载');
		}
		if (visitor.coin < consume) {
			return callback('CoinEmpty');
		}
		async.waterfall([
			// 判断上次游玩时间是否成立
			function (next) {
				PlayRecord.findOne({visitor: visitor._id}).sort('-_id').exec(next);
			},
			function (lastRecord, next) {
				if (!lastRecord) {
					return next('不能进行优惠投币');
				}
				var lastPlayTime = lastRecord.time;
				if ((new Date()).getTime() - lastPlayTime.getTime() > 60 * 1000) {
					return next('已超过优惠投币时间');
				}
				next(null);
			},
			// 增加游玩次数
			Room.findByIdAndUpdate.bind(Room, roomId, {$inc: {playedTimes: 1}}),
			function (rtnRoom, next) {
				// 扣除用户代币,增加积分
				Visitor.findByIdAndUpdate(visitor._id, {$inc: {coin: -(consume), point: point}}, {
					new   : true,
					fields: {
						_id  : 1,
						coin : 1,
						point: 1
					}
				}, next);
			},
			// 判断是否可以抓住，并记录
			function (_rtnVisitor, next) {
				rtnVisitor = _rtnVisitor;
				var record = new PlayRecord({
					visitor      : visitor._id,
					room         : roomId,
					time         : new Date(),
					cost         : consume,
					succeedFlg   : false,
					point        : point,
					preSucceedFlg: false
				});
				if (!roomJackpotsFill[roomId]) {
					roomJackpotsFill[roomId] = 0;
				}
				if (roomJackpotsFill[roomId] > roomJackpots[roomId] && Math.random() < roomProbability[roomId]) {
					record.preSucceedFlg = true;
					roomJackpotsFill[roomId] -= roomJackpots[roomId];
				}
				// 增加奖池
				var addNum = consume - point * appConfig.pointCoinRatio;
				addNum = addNum < 1 ? 1 : addNum;
				roomJackpotsFill[roomId] += addNum;
				console.log(roomId, roomJackpotsFill[roomId]);
				record.save(next);
			},
			// 返回成功标识
			function (savedRecord, count, next) {
				if (savedRecord.preSucceedFlg) {
					var agenda = require('../app').agenda;
					agenda.schedule('in 2 minutes', agenda.jobDefines.READDROOMJACKPOT, {
						recordId: savedRecord._id,
						roomId  : savedRecord.room
					});
				}
				next(null, {
					_id    : savedRecord._id,
					random : randomSuccess(savedRecord.preSucceedFlg),
					visitor: rtnVisitor
				});
			}
		], callback);
	},
	playRoomByFreeCoupons        : function (req, callback) {
		var visitor = req.visitor,
			roomId = req.params.roomId,
			rtnVisitor,
			count = 0;
		if (!roomsObj || !roomsObj[roomId]) {
			return callback('未知游戏房间！');
		}
		var consume = roomsObj[roomId].consume;
		if (visitor.freeCoupons <= 0) {
			return callback('免费券不足，不能进行游戏！');
		}
		async.waterfall([
			function (next) {
				var today = moment().format('L');
				PlayRecord.count({visitor: visitor._id, cost: 0, time: {"$gte": today}}, next);
			},
			function (_count, next) {
				if (_count >= appConfig.dailyFreePlayCount) {
					return next('今日使用免费券游玩5次，不能继续使用免费券');
				}
				count = _count;
				next(null);
			},
			// 增加游玩次数
			Room.findByIdAndUpdate.bind(Room, roomId, {$inc: {playedTimes: 1}}),
			function (rtnRoom, next) {
				// 扣除用户免费券
				Visitor.findByIdAndUpdate(visitor._id, {$inc: {freeCoupons: -1}}, {
					new   : true,
					fields: {
						_id        : 1,
						freeCoupons: 1
					}
				}, next);
			},
			// 判断是否可以抓住，并记录
			function (_rtnVisitor, next) {
				rtnVisitor = _rtnVisitor.toObject();
				rtnVisitor.dailyFreePlayCount = appConfig.dailyFreePlayCount - count - 1;
				var record = new PlayRecord({
					visitor      : visitor._id,
					room         : roomId,
					time         : new Date(),
					cost         : 0,
					succeedFlg   : false,
					point        : 0,
					preSucceedFlg: false
				});
				if (!roomJackpotsFill[roomId]) {
					roomJackpotsFill[roomId] = 0;
				}
				if (roomJackpotsFill[roomId] > roomJackpots[roomId] && Math.random() < roomProbability[roomId]) {
					record.preSucceedFlg = true;
					roomJackpotsFill[roomId] -= roomJackpots[roomId];
				}
				record.save(next);
			},
			// 返回成功标识
			function (savedRecord, count, next) {
				if (savedRecord.preSucceedFlg) {
					var agenda = require('../app').agenda;
					agenda.schedule('in 2 minutes', agenda.jobDefines.READDROOMJACKPOT, {
						recordId: savedRecord._id,
						roomId  : savedRecord.room
					});
				}
				next(null, {
					_id    : savedRecord._id,
					random : randomSuccess(savedRecord.preSucceedFlg),
					visitor: rtnVisitor
				});
			}
		], callback);
	},
	playFreeRoom                 : function (req, callback) {
		var roomId = req.params.roomId;
		if (!freeRoom[roomId]) {
			freeRoom[roomId] = 0;
		}
		var fr = freeRoom[roomId];
		var succeedFlg = false;
		if (fr > 5 && Math.random() < 1) {
			succeedFlg = true;
			freeRoom[roomId] -= 5;
		}
		freeRoom[roomId] += 1;
		callback(null, {
			random: randomSuccess(succeedFlg)
		});
	},
	fulfillDailyTasks            : function (req, callback) {
		var type = req.params.type,
			visitor = req.visitor;
		if (type === 'sign') {
			return dailySign(visitor, callback);
		}
		else if (type === 'share') {
			return dailyShare(visitor, callback);
		}
		else {
			return callback('未知任务');
		}
	},
	reAddRoomJackpotsFill        : function (data) {
		if (data && data.roomId && data.recordId) {
			var roomId = data.roomId,
				recordId = data.recordId;
			async.waterfall([
				PlayRecord.findOne.bind(PlayRecord, {_id: recordId}),
				function (record, next) {
					if (!record) {
						return next('未知抓取结果');
					}
					if (!record.preSucceedFlg) {
						return next('本次抓取失败');
					}
					if (record.succeedFlg) {
						return next('已成功');
					}
					next();
				},
				function (next) {
					if (roomJackpotsFill[roomId] && roomJackpots[roomId]) {
						roomJackpotsFill[roomId] += roomJackpots[roomId];
					}
					next();
				}
			], function (err) {
				if (err) {

				}
			});
		}
	}
};