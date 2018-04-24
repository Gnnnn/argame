/**
 * Created by Koan on 2017.9.21
 */
'use strict';
var AdviceSchema = require('../models/advice'),
	ExcelExport = require('../utils/excelExport'),
	appConst = require('../utils/appConst'),
	appUtils = require('../utils/serverUtils');

function getAllAdviceExportRows(start, limit, rows, callback) {
	rows = rows || [];
	start = start || 0;
	limit = limit || 5000;
	// 分页查询
	AdviceSchema.find({}, {})
		.sort('-_id')
		.skip(start)
		.limit(limit)
		.populate({path: 'handleUser', select: 'name'})
		.exec(function (err, docs) {
			if (err) {
				return callback(err);
			}
			if (!docs || docs.length === 0) {
				return callback(null, rows);
			}
			docs.forEach(function (doc) {
				rows.push([
					doc.message,
					doc.messageType,
					doc.uploadTime,
					doc.handleState,
					doc.handleMessage || '',
					doc.handleUser || '',
					doc.handleTime
				]);
			});
			return getAllAdviceExportRows(start + docs.length, limit, rows, callback);
		});
}

function getExportAdvice(req, callback) {
	getAllAdviceExportRows(0, 5000, [], callback);
}

function beforeHandleStateCellWrite(row, cellData) {
	return appConst.ADVICE_HANDLESTATE[cellData] || '';
}

function beforeMsgTypeCellWrite(row, cellData) {
	return appConst.ADVICE_MSG_TYPE[cellData] || '';
}

function beforeHandleUserCellWrite(row, cellData) {
	return (cellData || {}).name || '';
}

function beforeDateCellWrite(row, cellData) {
	return appUtils.dateFormat(cellData, 'yyyy-MM-dd HH:mm');
}

module.exports = {
	adviceCreateTransformer: function (req) {
		var reqBody = req.body;
		if (reqBody) {
			delete reqBody.uploadTime;
			delete reqBody.handleUser;
			delete reqBody.handleTime;
			reqBody.visitor = req.visitor ? req.visitor._id : '';
			reqBody.uploadTime = new Date();
			reqBody.messageType = reqBody.messageType || AdviceSchema.constants.messageType.USER;
			reqBody.handleState = AdviceSchema.constants.handleState.PENDING;
		}
	},
	adviceUpdateTransformer: function (req) {
		var reqBody = req.body;
		if (reqBody) {
			delete reqBody.mobileId;
			delete reqBody.mobileModel;
			delete reqBody.message;
			delete reqBody.messageType;
			delete reqBody.uploadTime;
			delete reqBody.handleUser;
			delete reqBody.handleTime;
			reqBody.handleTime = new Date();
			reqBody.handleUser = req.me._id;
		}
	},
	adviceExport           : function (req, res, callback) {
		getExportAdvice(req, function (err, rows) {
			if (err) {
				return callback(err);
			}
			var excelExport = new ExcelExport(),
				sheetName = 'advice',
				cols = [],
				rows = rows || [];
			cols = [
				{
					caption: '反馈信息',
					type   : 'string',
					width  : 50
				},
				{
					caption        : '反馈类型',
					type           : 'string',
					beforeCellWrite: beforeMsgTypeCellWrite,
					width          : 10
				},
				{
					caption        : '反馈时间',
					type           : 'string',
					beforeCellWrite: beforeDateCellWrite,
					width          : 20
				},
				{
					caption        : '处理状态',
					type           : 'string',
					beforeCellWrite: beforeHandleStateCellWrite,
					width          : 10
				},
				{
					caption: '处理意见',
					type   : 'string',
					width  : 50
				},
				{
					caption        : '处理人',
					type           : 'string',
					beforeCellWrite: beforeHandleUserCellWrite,
					width          : 10
				},
				{
					caption        : '处理时间',
					type           : 'string',
					beforeCellWrite: beforeDateCellWrite,
					width          : 20
				}
			];

			var result = excelExport.exportExcel(sheetName, cols, rows);
			res.setHeader('Content-Type', 'application/vnd.openxmlformats');
			res.setHeader('Content-Disposition', 'attachment; filename=' + sheetName + '.xlsx');
			res.write(result, 'binary');
			return res.end();
		});
	}
};