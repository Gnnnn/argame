'use strict';
/**
 * Created by Koan on 2017.9.21
 */
var fs = require('fs'),
	path = require('path'),
	startsWith = require('underscore.string/startsWith');

module.exports = function (easyRouter) {
	var files = fs.readdirSync(__dirname);

	if (files && files.length) {
		files.forEach(function (file) {
			if (file !== 'index.js' && !startsWith(file, '.')) {
				var route = require(path.resolve(__dirname, file));
				route(easyRouter);
			}
		});
	}
};