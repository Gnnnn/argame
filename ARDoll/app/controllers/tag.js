/**
 * Created by Koan on 2017/11/20.
 */
'use strict';

function deleteReqBody(reqBody) {
	delete reqBody.uploadTime;
	delete reqBody.uploadUser;
	delete reqBody.lastModifiedTime;
	delete reqBody.lastModifiedUser;
}

module.exports = {
	tagCreateTransformer: function (req) {
		var reqBody = req.body;
		if (reqBody) {
			deleteReqBody(reqBody);
			reqBody.uploadTime = new Date();
			reqBody.uploadUser = req.me._id;
			reqBody.lastModifiedTime = new Date();
			reqBody.lastModifiedUser = req.me._id;
		}
	},
	tagUpdateTransformer: function (req) {
		var reqBody = req.body;
		if (reqBody) {
			deleteReqBody(reqBody);
			reqBody.lastModifiedTime = new Date();
			reqBody.lastModifiedUser = req.me._id;
		}
	}
};