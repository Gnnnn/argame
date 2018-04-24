/**
 * Created by Koan on 2017/9/28.
 */
'use strict';

module.exports = {
	announcementCreateTransformer: function (req) {
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
		}
	},
	announcementUpdateTransformer: function (req) {
		var reqBody = req.body;
		if (reqBody) {
			delete reqBody.uploadTime;
			delete reqBody.uploadUser;
			delete reqBody.lastModifiedTime;
			delete reqBody.lastModifiedUser;
			reqBody.lastModifiedTime = new Date();
			reqBody.lastModifiedUser = req.me._id;
		}
	}
};