'use strict';
/**
 * Created by gogoout on 16/4/14.
 */
var logger = require('../utils/logger');

module.exports = function errorLogger(error, req, res, next) {
	if (error && error.stack) {
		logger.error(error);
	}
	return next(error);
};