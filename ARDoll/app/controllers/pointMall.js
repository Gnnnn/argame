/**
 * Created by Koan on 2017/11/20.
 */
'use strict';
var async = require('async'),
	PointMall = require('../models/pointMall');

function deleteReqBody(reqBody) {
	delete reqBody.uploadTime;
	delete reqBody.uploadUser;
	delete reqBody.lastModifiedTime;
	delete reqBody.lastModifiedUser;
}

function getValidPointMalls(callback) {
	var fields = {
		_id             : 1,
		name            : 1,
		thumbnail       : 1,
		document        : 1,
		description     : 1,
		lastModifiedTime: 1,
		consumePoint    : 1,
		price           : 1,
		category        : 1,
		tag             : 1
	};
	PointMall.find({validFlg: true}, fields)
		.sort('-_id')
		.populate([
			{
				path  : 'category',
				select: '_id name description thumbnail document lastModifiedTime'
			},
			{
				path  : 'tag',
				select: '_id name description thumbnail document lastModifiedTime'
			}
		])
		.exec(callback);
}

function restructPointMalls(orgPointMalls, callback) {
	if (!orgPointMalls) {
		return callback(null);
	}
	var pointMalls = [],
		categories = [],
		tags = [],
		categoriesObj = {},
		tagsObj = {};

	for (var index = 0, pmLength = orgPointMalls.length; index < pmLength; index++) {
		var pointMall = orgPointMalls[index];
		if (pointMall.category) {
			if (!categoriesObj[pointMall.category._id]) {
				categories.push(pointMall.category);
				categoriesObj[pointMall.category._id] = pointMall.category;
			}
			pointMall.category = pointMall.category._id;
		}
		if (pointMall.tag) {
			if (!tagsObj[pointMall.tag._id]) {
				tags.push(pointMall.tag);
				tagsObj[pointMall.tag._id] = pointMall.tag;
			}
			pointMall.tag = pointMall.tag._id;
		}
		pointMalls.push(pointMall);
	}
	var pointMallDetail = {
		pointMalls,
		categories,
		tags
	};
	return callback(null, pointMallDetail);
}

function reRestructPointMallDetail(callback) {
	async.waterfall([
		getValidPointMalls,
		restructPointMalls,
	], function (err, results) {
		if (err) {
			return callback(err);
		}
		return callback(null, results);
	});
}

module.exports = {
	pointMallCreateTransformer: function (req) {
		var reqBody = req.body;
		if (reqBody) {
			deleteReqBody(reqBody);
			reqBody.uploadTime = new Date();
			reqBody.uploadUser = req.me._id;
			reqBody.lastModifiedTime = new Date();
			reqBody.lastModifiedUser = req.me._id;
		}
	},
	pointMallUpdateTransformer: function (req) {
		var reqBody = req.body;
		if (reqBody) {
			deleteReqBody(reqBody);
			reqBody.lastModifiedTime = new Date();
			reqBody.lastModifiedUser = req.me._id;
		}
	},
	getPointMallDetail        : function (req, callback) {
		reRestructPointMallDetail(callback);
	}
};