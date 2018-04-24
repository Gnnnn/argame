/**
 * Created by Koan on 2017/11/28.
 */
'use strict';
var async = require('async'),
	Order = require('../models/order'),
	Visitor = require('../models/visitor'),
	PlayRecord = require('../models/playRecord'),
	Share = require('../models/share'),
	serverUtils = require('../utils/serverUtils');

module.exports = {
	share        : function (req, callback) {
		var visitor = req.visitor,
			recordId = req.params.id;

		async.waterfall([
			Share.findOne.bind(Share, {playRecord: recordId}),
			function (share, next) {
				if (share) {
					return next('已分享过该结果，不能再次获得免费券');
				}
				next(null);
			},
			PlayRecord.findOne.bind(PlayRecord, {_id: recordId}),
			function (record, next) {
				if (!record) {
					return next('未知抓取结果分享');
				}
				if (!record.succeedFlg) {
					return next('抓取失败分享，不能获得免费券');
				}
				var newShare = new Share({
					visitor   : visitor._id,
					playRecord: recordId,
					time      : new Date(),
					type      : req.body ? req.body.type : ''
				});
				newShare.save(next);
			},
			function (share, count, next) {
				Visitor.findByIdAndUpdate(visitor._id, {$inc: {freeCoupons: 1}}, {
					new   : true,
					fields: {
						_id        : 1,
						freeCoupons: 1
					}
				}, next);
			}
		], callback);
	},
	confirm      : function (req, callback) {
		var visitor = req.visitor,
			recordId = req.params.id;
		if (!req.body || !req.body.succeedFlg) {
			return callback[200]();
		}
		async.waterfall([
			PlayRecord.findOne.bind(PlayRecord, {_id: recordId}),
			function (record, next) {
				if (!record) {
					return next('未知抓取结果');
				}
				if (record.visitor.toString() !== visitor._id.toString()) {
					return next('用户匹配失败');
				}
				if (!record.preSucceedFlg) {
					return next('判断到本次抓取失败');
				}
				record.succeedFlg = true;
				record.save(next);
			},
			function (record, count, next) {
				var newOrder = new Order({
					visitor   : record.visitor._id || record.visitor,  // 购买用户
					time      : new Date(),
					playRecord: record._id,  // 对应抓取记录
					state     : 'NEW'
				});
				newOrder.save(next);
			}
		], function (err, result) {
			if (err) {
				return callback(err);
			}
			return callback(null, {
				orderId   : result._id,
				succeedFlg: true
			});
		});
	},
	getAllSuccess: function (getFromDbFunc) {
		return function (req, callback) {
			getFromDbFunc(req, function (err, results) {
				if (err) {
					return callback(err);
				}
				results = results ? results.toArray() : [];
				var roomNames = ['美国熊'];
				results.forEach(function (record) {
					if (record.visitor) {
						record.visitor.name = record.visitor.name.substr(0, 1) + '****';
					}
					if (record.room) {
						roomNames.push(record.room.name);
					}
				});
				if (results.length < 10) {
					for (var index = results.length; index < 10; index++) {
						var newRecord = {};
						newRecord._id = serverUtils.generateRandomString(32);
						newRecord.visitor = {
							_id : serverUtils.generateRandomString(32),
							name: serverUtils.generateRandomString(1) + '****'
						};
						newRecord.room = {
							_id : serverUtils.generateRandomString(32),
							name: roomNames[Math.floor((Math.random() * roomNames.length))]
						};
						results.push(newRecord);
					}
				}
				return callback(null, results);
			})
		};
	}
};