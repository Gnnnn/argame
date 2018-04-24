'use strict';
/**
 * Created by gogoout on 15/6/17.
 */
var querystring = require('querystring'),
	_ = require('lodash'),
	async = require('async');
var errorHelper = require('./errorHelper'),
	Assertion = require('./assertion'),
	serverUtils = require('./serverUtils'),
	appConst = require('./appConst'),
	logger = require('./logger');

var methods = ['get', 'post', 'put', 'delete'],

	/**
	 * @apiDefine Response200
	 * @apiSuccessExample {json} Success 200
	 *  HTTP/1.1 200
	 */
	/** @apiDefine Response201
	 * @apiSuccessExample {json} Success 201
	 *  HTTP/1.1 201 Created
	 */
	/** @apiDefine Response204
	 * @apiSuccessExample {json} Success 204
	 *  HTTP/1.1 204 Deleted
	 */
	buildInStatusCodes = [200, 201, 204, 400, 404, 406, 500];

var DEFAULT_CACHE_TIME = 0;

function normalizeAuth(auth) {
	// default
	auth = auth || function (req, cb) {
		cb();
	};
	// mult auths , any of the auth is true will be ok
	if (_.isArray(auth)) {
		var auths = auth;
		auth = function (req, callback) {
			// eachAuth 返回错误信息或空,如果都出错,则无权限,因此用every
			async.every(auths, function (eachAuth, acb) {
				eachAuth(req, acb);
			}, function (result) {
				if (result) {
					// 错误信息无法返回
					return callback('用户无权限!');
				}
				// 错误信息无法返回
				return callback();
			});
		};
	}
	return auth;
}

function normalizeValidator(validator) {
	validator = validator || function (req) {
		return null;
	};
	// sync validator
	if (validator.length === 1) {
		var _validator = validator;
		// turn into async
		validator = function (req, cb) {
			var errMsg = _validator(req);
			if (errMsg === null) {
				return cb();
			}
			else {
				return cb(errMsg);
			}
		};
	}
	return validator;
}

function normalizeTransformer(transformer) {
	// default transformer
	transformer = transformer || _.identity;
	// make array
	if (!_.isArray(transformer)) {
		transformer = [transformer];
	}
	// make each of the array be async
	var transformerMapped = transformer.map(function (eachTransformer) {
		if (eachTransformer.length === 1) {
			return function (req, cb) {
				// at most time req have no return
				req = eachTransformer(req) || req;
				cb(null, req);
			};
		}
		else {
			return eachTransformer;
		}
	});

	// waterfall the array
	transformer = function (req, cb) {
		// waterfall的第一个函数包装成无参数的
		var transformerArray = [function (aCallback) {
			aCallback(null, req);
		}].concat(transformerMapped);
		async.waterfall(transformerArray, cb);
	};

	return transformer;
}

module.exports = function (server) {

// route
// ----------------
	function httpMethod(path, requestType, auth, validator, transformer, resultTransformer, handler) {
		switch (arguments.length) {
			case 3:
				handler = auth;
				auth = null;
				break;
			case 4:
				handler = validator;
				validator = null;
				break;
			case 5:
				handler = transformer;
				transformer = null;
				break;
			case 6:
				handler = resultTransformer;
				resultTransformer = null;
				break;
		}
		// default
		auth = normalizeAuth(auth);
		validator = normalizeValidator(validator);
		transformer = normalizeTransformer(transformer);

		// multi result transformer
		if (resultTransformer) {
			if (!_.isArray(resultTransformer)) {
				resultTransformer = [resultTransformer];
			}
		}


		/* eslint-disable no-invalid-this */
		var args = [path].concat(this.middlewares);
		/* eslint-enable no-invalid-this */
		args.push(function (req, res, next) {
			async.series([
				async.apply(auth, req),
				async.apply(validator, req),
				async.apply(transformer, req)
			], function (err, results) {
				// failed auth
				if (results.length <= 1) {
					return errorHelper.ifUnauthorized(err, next);
				}
				// failed validator
				else if (results.length <= 2) {
					return errorHelper.ifUnprocessableEntity(err, next);
				}
				else if (results[2] == null) {
					return errorHelper.ifInternalServer(err, next);
				}
				// transformer
				req = results[2];

				if (handler.length === 2) {
					// this finish method is where the handler received
					let finish = function (err, result, count) {
						if (res.headersSent) {
							return;
						}

						try {
							// default cache-control
							if (requestType === 'get') {
								serverUtils.setCacheControl(res, DEFAULT_CACHE_TIME);
							}

							// incase cb(201) cb(204) etc
							if (typeof err === 'number') {
								return res.status(err).send(result);
							}
							// mongoose wrap the callback with catch,so throw error here will never catched by restify
							// we have to manually judge and return here
							if (err) {
								logger.error('path[%s]`%s` is error', requestType, path);
								return errorHelper.ifError(err, next);
							}
							if (result) {
								if (resultTransformer) {
									result = (result.toObject && result.toObject()) || result;
									resultTransformer.forEach(function (eachResultTransformer) {
										result = eachResultTransformer(result);
									});
								}

								if (typeof result === 'string') {
									res.set('Content-Type', 'text/plain');
								}
								if (count) {
									res.set(appConst.reqHeaderCount, count);
								}
								res.send(result);
							}
							// TODO maybe too aggressive
							else {
								res.boom.notFound();
							}
						}
						catch (e) {
							errorHelper.ifInternalServer(e);
						}
					};
					// add finish[200],finish[201] and etc
					buildInStatusCodes.forEach(function (code) {
						finish[code] = function (err, result) {
							return finish(err || code, result);
						};
					});

					handler(req, finish);
				}
				else {
					let finish = function (err) {
						return errorHelper.ifError(err, next);
					};
					handler(req, res, finish);
				}
			});
		});
		server[requestType].apply(server, args);
	}

	function route(path) {
		var instance = {
			middlewares: [],
			server
		};
		methods.forEach(function (method) {
			instance[method] = function (auth, validator, transformer, resultTransformer, callback) {
				var preBindHttpMethod = httpMethod.bind(this, path, method);
				// arguments
				preBindHttpMethod.apply(this, arguments);
				return this;
			};
		});
		instance.del = instance.delete;
		instance.use = function (middleware) {
			if (middleware) {
				this.middlewares.push(middleware);
			}
			return this;
		};
		// use this instance to get/post/put/del
		return instance;
	}

// model
// ----------------------
	// in[XXX|YYY|ZZZ]
	var IN_REGEXP = /^in\[[^\[\],:]+]$/;

	function inParser(condition) {
		if (IN_REGEXP.test(condition)) {
			condition = {$in: condition.slice(3, -1).split('|')};
		}
		return condition;
	}

	function qParser(req, condition) {
		if (!_.isUndefined(req.query.q)) {
			var q;
			try {
				q = querystring.parse(req.query.q, ',', ':');
				condition = _.extend({}, condition, q);
				_(q).forEach(function (value, key) {
					if (value === '*') {
						delete condition[key];
					}
					else {
						condition[key] = inParser(value);
					}
				});
			}
			catch (e) {}
		}
		return condition;
	}

// inspired by [`restify-mongoose`](https://github.com/saintedlama/restify-mongoose)
	function fromModel(Model) {
		var instance = {};

		function queryPopulate(query, populate, since) {
			// req.query.since不能用于skip refs,应该没这种需求
			if (_.isArray(populate)) {
				if (Assertion.isArrayOfObject(populate)) {
					populate.forEach(function (eachPopulate) {
						query = query.populate(eachPopulate);
					});
				}
				else {
					query.populate.apply(query, populate);
				}
			}
			else {
				// TODO one操作中没有since参数,因此可以用在population中,但是使用since仍然有违反约定的感觉
				if (!_.isUndefined(since)) {
					populate = _.extend({}, populate, {skip: since});
				}
				query.populate(populate);
			}
		}

		// all
		// ========
		// supported options:limit,condition,fields,populate,sort,needCount,queryPick

		// default options
		var defaultQueryOptions = {
			limit: 135
		};

		function queryFactory(options) {
			options = _.extend({}, defaultQueryOptions, options || {});
			return function all(req, callback) {
				var condition = options.condition || {};
				if (_.isFunction(options.condition)) {
					condition = options.condition(req);
				}
				if (options.queryPick) {
					condition = qParser(req, condition);
					condition = _.pick(condition, options.queryPick);
				}

				var limit = Number.parseInt(req.query.limit) || options.limit;
				var query = Model.find(condition, options.fields).limit(limit);

				// sort
				var sort = options.sort || req.query.sort;
				if (sort) {
					query = query.sort(sort);
				}

				var since = Number.parseInt(req.query.since);
				if (!_.isUndefined(req.query.since) && !isNaN(since)) {
					query = query.skip(since);
				}
				if (!_.isUndefined(options.populate)) {
					queryPopulate(query, options.populate);
				}
				if (options.needCount) {
					return async.parallel({
							result: query.exec.bind(query),
							count : Model.count.bind(Model, condition)
						},
						function (err, results) {
							if (err) {
								return callback(err);
							}
							return callback(err, results.result, results.count);
						});
				}
				else {
					return query.exec(callback);
				}
			};
		}

		var all = queryFactory();
		all.custom = queryFactory;


		// one
		// ==========
		// supported options:condition,fields,populate,sort
		var defaultOneOptions = {
			condition: function (req) {
				return {_id: req.params.id};
			}
		};

		function findOneFactory(options) {
			options = _.extend({}, defaultOneOptions, options);
			return function one(req, callback) {
				var condition = options.condition;
				if (_.isFunction(options.condition)) {
					condition = options.condition(req);
				}
				var query = Model.findOne(condition, options.fields);

				// sort
				var sort = options.sort || req.query.sort;
				if (sort) {
					query = query.sort(sort);
				}

				if (!_.isUndefined(options.populate)) {
					var since = Number.parseInt(req.query.since, 10) || undefined;
					queryPopulate(query, options.populate, since);
				}
				return query.exec(callback);
			};
		}

		var one = findOneFactory();
		one.custom = findOneFactory;

		// create
		// ==========
		var create = function (req, callback) {
			var model = new Model(req.body);
			model.save(callback[201] || callback);
		};

		// update
		// =============
		// supported options:idField,preVerify
		var defaultUpdateOptions = {
			idField: 'id'
		};

		function updateFactory(options) {
			options = _.extend({}, defaultUpdateOptions, options);
			return function (req, callback) {
				var id = req.params[options.idField];
				return Model.findById(id, function (err, result) {
					err = err || (_.isFunction(options.preVerify) && options.preVerify(req, result));
					if (err) {
						return callback(err);
					}
					_.extend(result, req.body);
					result.save(callback[201] || callback);
				});
			};
		}

		var update = updateFactory();
		update.custom = updateFactory;


		// delete
		// ===========
		var defaultDeleteOptions = {
			idField: 'id'
		};

		function delFactory(options) {
			options = _.extend({}, defaultDeleteOptions, options);
			return function (req, callback) {
				var id = req.params[options.idField];
				return Model.findById(id, function (err, result) {
					err = err || (_.isFunction(options.preVerify) && options.preVerify(req, result));
					if (err) {
						return callback(err);
					}
					if (!result) {
						return callback('未找到资源，可能已经删除');
					}
					result.remove(callback[204] || callback);
				});
			};
		}

		var del = delFactory();
		del.custom = delFactory;

		_.extend(instance, {
			all   : all,
			one   : one,
			create: create,
			update: update,
			del   : del
		});
		return instance;
	}

	return {
		route    : route,
		fromModel: fromModel,
		qParser  : qParser,
		rawServer: server
		//	afterCheck: afterCheck
	};
};