/**
 * Created by Koan on 2017/12/21.
 */
'use strict';

var async = require('async'),
	appCtrl = require('../controllers/app'),
	logger = require('../utils/logger');

module.exports = function (agenda) {
	agenda.define('reAddRoomJackpotsFill', {priority: 'highest'}, function (job) {
		appCtrl.reAddRoomJackpotsFill(job.attrs.data, function (err) {
			if (err) {
				return logger.error(err);
			}
		});
	});
	agenda.jobDefines.READDROOMJACKPOT = 'reAddRoomJackpotsFill';
};