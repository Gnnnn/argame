/**
 * Created by Koan on 2017/9/28.
 */
'use strict';

function noticeContentTransformer(content) {
	content = content || '';
	return content.replace(/<script.+<\/script>/g, '');
}

module.exports = {
	noticeCreateTransformer: function (req) {
		var reqBody = req.body;
		if (reqBody) {
			delete reqBody.uploadTime;
			delete reqBody.uploadUser;
			delete reqBody.lastModifiedTime;
			delete reqBody.lastModifiedUser;
			reqBody.uploadTime = new Date();
			reqBody.uploadUser = req.me._id;
			reqBody.lastModifiedTime = new Date();
			reqBody.lastModifiedUser = req.me._id;
			reqBody.content = noticeContentTransformer(reqBody.content);
		}
	},
	noticeUpdateTransformer: function (req) {
		var reqBody = req.body;
		if (reqBody) {
			delete reqBody.uploadTime;
			delete reqBody.uploadUser;
			delete reqBody.lastModifiedTime;
			delete reqBody.lastModifiedUser;
			reqBody.lastModifiedTime = new Date();
			reqBody.lastModifiedUser = req.me._id;
			reqBody.content = noticeContentTransformer(reqBody.content);
		}
	}
};