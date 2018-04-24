/**
 * Created by Koan on 2017/9/27.
 */
'use strict';

var _ = require('lodash'),
	Assertion = require('../../utils/assertion');

function validateFile(file, assertions) {
	if (file) {
		assertions
			.assert(file.size > 0, '不能上传空文件');
	}
}
_.extend(exports, {
	validateSingleUpload: function (req) {
		var assertions = Assertion
			.assert(!_.isUndefined(req.files[0]), '不能上传空文件')
			.assert(req.files.length === 1, '只能上传一个文件');
		validateFile(req.files[0], assertions);

		return assertions.result();
	}
});