'use strict';
/**
 * Created by gogoout on 16/4/15.
 */
var path = require('path'),
	fs = require('fs'),
	_ = require('lodash'),
	boom = require('boom'),
	multer = require('multer'),
	logger = require('../utils/logger'),
	os = require('os');

const defaultOption = {
	dest  : os.tmpdir(),
	limits: {
		file: 2 * 1024 * 1024
	}
};
const upload = multer(defaultOption);

const chunkStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		const folder = path.resolve(os.tmpdir(), req.body.name);
		fs.stat(folder, function (err, stats) {
			let mkDir = function (folder, cb) {cb();};
			if (!stats) {
				mkDir = fs.mkdir;
			}
			mkDir(folder, function (err) {
				if (err) {
					logger.error(err);
					return cb(err);
				}
				req.chunksPath = folder;
				cb(null, folder);
			});
		});
	},
	filename   : function (req, file, cb) {
		cb(null, 'tmp.chunk.' + req.body.chunk);
	}
});

upload.chunks = multer({
	storage   : chunkStorage,
	limits    : defaultOption.limits,
	fileFilter: function (req, file, cb) {
		if (!req.body.chunk || !req.body.chunks || !req.body.name || !req.body.originName) {
			return cb(new boom.badData('请求出错:请求格式不合法'));
		}
		cb(null, true);
	}
});

module.exports = upload;