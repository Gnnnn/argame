'use strict';
/**
 * Created by gogoout on 16/4/14.
 */
var boom = require('boom');
module.exports = function errorHandler(error, req, res, next) {
	if (!res.headersSent) {
		if (!error.isBoom) {
			if (error.code === 'ETIMEDOUT') {
				error = boom.wrap(error, 503);
			}
			else if (typeof error === 'string') {
				error = boom.badImplementation(error);
			}
			else {
				error = boom.wrap(error, 500);
			}
		}
		res.status(error.output.statusCode).send(error.output.payload);
	}
	else {
		return next(error);
	}
};