'use strict';
/**
 * Created by gogoout on 15/7/14.
 */
var _ = require('lodash'),
	Assertion = require('../../utils/assertion'),
	sizeLimit = require('../../utils/appConfig').uploadSize;


function validateImage(file, assertions) {
	if (file) {
		assertions
			.assert(file.size > 0, '不能上传空文件')
			.assert(file.mimetype.split('/')[0] === 'image', '只能上传图片')
			.assert(file.size < sizeLimit, '上传图片过大,只能上传小于2MB的图像');
	}
}
_.extend(exports, {
	validateSingleUpload: function (req) {
		var assertions = Assertion
			.assert(!_.isUndefined(req.files[0]), '不能上传空文件')
			.assert(req.files.length === 1, '只能上传一张图片');
		validateImage(req.files[0], assertions);

		return assertions.result();
	}
});