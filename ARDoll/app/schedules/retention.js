/**
 * Created by Koan on 2017/10/25.
 */
'use strict';
var async = require('async'),
	visitorCtrl = require('../controllers/visitor'),
	logger = require('../utils/logger');

module.exports = function (agenda) {
	agenda.define('buildRetention', {priority: 'highest'}, function () {
		visitorCtrl.buildRetention(function (err) {
			if (err) {
				return logger.error(err);
			}
			logger.info('buildRetention finished');
		});
	});
	agenda.jobDefines.BUILD_RETENTION = 'buildRetention';
};