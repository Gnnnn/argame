'use strict';
/**
 * Created by gogoout on 15/6/17.
 */
var _ = require('lodash'),
	boom = require('boom'),
	Assertion = require('./assertion'),
	mongoose = require('mongoose'),
	MongooseError = mongoose.Error;

const supportedError = {
	ifUnauthorized       : 'unauthorized',
	ifUnprocessableEntity: 'badData',
	ifInternalServer     : 'badImplementation'
};

function errorHandler(error, next) {
	if (next) {
		return next(error);
	}
	throw error;
}


_.forEach(supportedError, (value, key) => {
	exports[key] = function (err, next) {
		if (err) {
			if (!(err instanceof Error || err instanceof String)) {
				err = err.toString();
			}
			var error = new boom[value](err);
			return errorHandler(error, next);
		}
	};
});

exports.ifError = function (err, next) {
	if (err) {
		if (err instanceof MongooseError) {
			switch (err.name) {
				case 'ValidationError':
					var assertions = new Assertion();
					if (err.errors) {
						_(err.errors).each(function (each) {
							assertions.push(each.message);
						});
					}
					return errorHandler(new boom.badData('验证出错:' + assertions.result()), next);
				default :
					return errorHandler(new boom.badImplementation('查询出错:' + err.message), next);
			}
		}
		else if (err.isBoom) {
			return errorHandler(err, next);
		}
		else if (err.name === 'MongoError') {
			// 防止泄露数据库的字段,不给出详细的错误信息
			return errorHandler(new boom.badImplementation('查询出错'), next);
		}
		else {
			if (!(err instanceof String)) {
				err = err.toString();
			}
			return errorHandler(new boom.badData(err), next);
		}
	}
};