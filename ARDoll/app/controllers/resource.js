/**
 * Created by Koan on 2018/1/11.
 */
'use strict';
var path = require('path'),
	fs = require('fs'),
	serverUtils = require('../utils/serverUtils');

const WHITE_LIST = [
	'shareQRCode.png'
];

function checkWhiteList(fileName) {
	return WHITE_LIST.indexOf(fileName) > -1;
}

function responseResource(fileName, req, res, callback) {
	var currFile = path.join(path.resolve(__dirname, '../resources'), fileName),
		fReadStream;

	fs.exists(currFile, function (exist) {
		if (exist) {
			res.set({
				"Content-type"       : "application/octet-stream",
				"Content-Disposition": "attachment;filename=" + encodeURI(fileName)
			});
			fReadStream = fs.createReadStream(currFile);
			fReadStream.on("data", (chunk) => res.write(chunk, "binary"));
			fReadStream.on("end", function () {
				res.end();
			});
		}
		else {
			res.set("Content-type", "text/html");
			res.send("file not exist!");
			res.end();
		}
	});
}

module.exports = {
	getResource: function (req, res, callback) {
		serverUtils.setCacheControl(res, 'max');
		var fileName = req.params.name;
		if (!checkWhiteList(fileName)) {
			return callback('无文件获取权限！');
		}
		responseResource(fileName, req, res, callback);
	}
};