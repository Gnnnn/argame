'use strict';
/**
 * Created by Koan on 2017.9.27
 */

var _ = require('lodash'),
	path = require('path'),
	async = require('async'),
	mongoose = require('mongoose'),
	fs = require('fs'),
	asyncHelper = require('../utils/asyncHelper'),
	serverUtils = require('../utils/serverUtils');

function imageProcess(file, callback) {
	var readStream = fs.createReadStream(file.path);
	var name = file.originalname,
		type = file.mimetype,
		length = file.size;
	var gfs = require('../app').gfs;
	var rawWriteStream = gfs.createWriteStream({
		filename    : name,
		/* eslint-disable camelcase*/
		content_type: type
		/* eslint-enable camelcase*/
	});
	var saveTask = asyncHelper.streamWrapper(rawWriteStream);
	// directly save to db
	readStream.pipe(rawWriteStream);

	saveTask(function (err, result) {
		if (err) {
			return callback(err);
		}
		if (!result) {
			return callback('上传错误');
		}
		return callback(err, result._id);
	});
}

function responseImage(fileId, req, res, callback) {
	var gfs = require('../app').gfs,
		options = {_id: fileId};
	gfs.findOne(options, function (err, file) {
		if (res.headersSent) {
			return callback();
		}
		if (err) {
			res.sendStatus(500);
			return callback();
		}
		if (!file) {
			res.sendStatus(404);
			return callback();
		}
		if (req.headers['if-none-match'] === file.md5) {
			res.sendStatus(304);
			return callback();
		}
		res.set('ETag', file.md5);
		res.set('Content-Type', file.contentType);
		var readStream = gfs.createReadStream(options);
		readStream.pipe(res);
		readStream.on('close', callback);
	});
}

module.exports = {
	imageUpload: function (req, callback) {
		return async.map(req.files,
			function (file, aCallback) {
				imageProcess(file, aCallback);
			},
			callback);
	},
	getImage   : function (req, res, next) {
		serverUtils.setCacheControl(res, 'max');
		responseImage(req.params.id, req, res, next);
	},
	removeImage: function (req, callback) {
		var gfs = require('../app').gfs;
		gfs.remove({_id: req.params.id}, callback[204]);
	}
};