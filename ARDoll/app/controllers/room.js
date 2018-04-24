/**
 * Created by Koan on 2017/11/20.
 */
'use strict';

function deleteReqBody(reqBody) {
	delete reqBody.uploadTime;
	delete reqBody.uploadUser;
	delete reqBody.lastModifiedTime;
	delete reqBody.lastModifiedUser;
	delete reqBody.playedTimes;
	delete reqBody.catchedNumber;
	if (!reqBody.dollMachine) {
		delete reqBody.dollMachine;
	}
	if (!reqBody.dollMachinePaw) {
		delete reqBody.dollMachinePaw;
	}
	if (!reqBody.tag) {
		delete reqBody.tag;
	}
	if (!reqBody.category) {
		delete reqBody.category;
	}
}

module.exports = {
	roomCreateTransformer: function (req) {
		var reqBody = req.body;
		if (reqBody) {
			deleteReqBody(reqBody);
			reqBody.playedTimes = 0;
			reqBody.catchedNumber = 0;
			reqBody.uploadTime = new Date();
			reqBody.uploadUser = req.me._id;
			reqBody.lastModifiedTime = new Date();
			reqBody.lastModifiedUser = req.me._id;
		}
	},
	roomUpdateTransformer: function (req) {
		var reqBody = req.body;
		if (reqBody) {
			deleteReqBody(reqBody);
			delete reqBody.doll;
			reqBody.tag = reqBody.tag || null;
			reqBody.lastModifiedTime = new Date();
			reqBody.lastModifiedUser = req.me._id;
		}
	}
};