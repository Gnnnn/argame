/**
 * Created by Koan on 2017/12/13.
 */
'use strict';
var async = require('async'),
	PlayRecord = require('../models/playRecord'),
	PointMall = require('../models/pointMall'),
	Order = require('../models/order'),
	Visitor = require('../models/visitor');

module.exports = {
	orderCreateTransformer: function (req) {
		var reqBody = req.body;
		if (reqBody) {
			delete reqBody.time;
			delete reqBody.handleUser;
			delete reqBody.handleTime;
			delete reqBody.state;
			delete reqBody.expressCompany;
			delete reqBody.expressNo;
			delete reqBody.playRecord;
			delete reqBody.pointMall;
			delete reqBody.consumePoint;
			reqBody.visitor = req.visitor ? req.visitor._id : '';
			reqBody.time = new Date();
		}
	},
	orderUpdateTransformer: function (req) {
		var reqBody = req.body;
		if (reqBody) {
			delete reqBody.visitor;
			delete reqBody.time;
			delete reqBody.time;
			delete reqBody.handleUser;
			delete reqBody.handleTime;
			delete reqBody.state;
			delete reqBody.playRecord;
			delete reqBody.pointMall;
			delete reqBody.consumePoint;
			reqBody.handleUser = req.me._id;
			reqBody.handleTime = new Date();
			reqBody.state = 'DELIVERED';
		}
	},
	orderVisitorUpdate    : function (req, callback) {
		var orderId = req.params.id,
			reqBody = req.body;
		async.waterfall([
			Order.findOne.bind(Order, {_id: orderId}),
			function (order, next) {
				if (order.state != 'NEW') {
					return next('已领取过该奖品');
				}
				order.state = 'WAITING';
				order.address = reqBody.address;
				order.cellPhone = reqBody.cellPhone;
				order.consignee = reqBody.consignee;
				order.save(next);
			}
		], callback);
	},
	orderPointMallCreate  : function (req, callback) {
		var visitor = req.visitor,
			pointMallId = req.params.id,
			reqBody = req.body;
		async.waterfall([
			PointMall.findOne.bind(PointMall, {_id: pointMallId}),
			function (pointMall, next) {
				if (!pointMall) {
					return next('找不到商品');
				}
				reqBody.pointMall = pointMall._id;
				reqBody.consumePoint = pointMall.consumePoint;
				if (visitor.point < pointMall.consumePoint) {
					return next('积分不足，不能兑换');
				}
				var newOrder = new Order(reqBody);
				newOrder.save(next);
			}, function (newOrder, count, next) {
				Visitor.findByIdAndUpdate(visitor._id, {$inc: {point: -newOrder.consumePoint}}, {
					new   : true,
					fields: {
						_id  : 1,
						point: 1
					}
				}, next);
			}
		], callback);
	}
};