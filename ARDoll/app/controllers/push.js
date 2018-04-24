'use strict';
/**
 * Created by gogoout on 16/12/8.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	async = require('async'),
	Push = require('../models/push'),
	PushUtil = require('../utils/push'),
	logger = require('../utils/logger');

function getJobByPush(push, callback) {
	var agenda = require('../app').agenda;
	agenda.jobs({_id: push.scheduleId}, function (err, jobs) {
		if (err || !jobs) {
			return callback(err);
		}
		callback(null, jobs[0]);
	});
}

function jobModifier(req, jobModifier, callback) {
	async.waterfall([
		Push.findById.bind(Push, req.params.id),
		function (push, aCallback) {
			if (!push || !push.scheduleId) {
				return aCallback(404);
			}
			aCallback(null, push);
		},
		getJobByPush,
		function (job, aCallback) {
			if (job == null) {
				return aCallback(404);
			}
			jobModifier(job, aCallback);
		}
	], callback);
}

module.exports = {
	transformer: function (req) {
		var reqBody = req.body;
		if (reqBody) {
			delete reqBody.user;
			delete reqBody.scheduleId;
			reqBody.user = req.me;
			reqBody.updateTime = new Date();
			reqBody.priority = 10;
			if (reqBody.schedule && (typeof reqBody.schedule === 'string' || typeof reqBody.schedule === 'number')) {
				try {
					reqBody.schedule = new Date(reqBody.schedule);
				}
				catch (e) {
					delete reqBody.schedule;
					logger.error('定时推送任务时间格式错误');
					logger.error(e);
				}
			}
			else {
				delete reqBody.schedule;
			}
		}
	},
	queryPushes: function (routeModelQuery) {
		return function (req, callback) {
			routeModelQuery(req, function (err, results, count) {
				if (err) {
					return callback(err);
				}
				var idMap = {}, pushes = [];
				async.waterfall([
					function (aCallback) {
						var ids = results
							.map(function (push) {
								var pushObj = push.toObject();
								pushes.push(pushObj);
								if (push.scheduleId) {
									idMap[push.scheduleId.toString()] = pushObj;
								}
								return push.scheduleId;
							})
							.filter(function (id) {
								return !!id;
							});
						aCallback(null, ids);
					},
					function (ids, aCallback) {
						var jobsCollection = mongoose.connection.collection('jobs');

						jobsCollection
							.find({_id: {$in: ids}})
							.toArray(aCallback);
					},
					function (jobs, aCallback) {
						jobs.forEach(function (job) {
							var push = idMap[job._id.toString()];
							if (push) {
								push.schedule = job;
							}
						});
						aCallback(null, pushes);
					}
				], function (err, results) {
					return callback(err, results, count);
				});
			});
		};
	},
	createPush : function (req, callback) {
		var push = new Push(req.body);
		push.save(function (err, result) {
			if (err) {
				return callback(err);
			}
			var agenda = require('../app').agenda;

			function finish(err, result) {
				if (err) {
					return callback(err);
				}
				push.scheduleId = result.attrs._id;
				push.schedule = push.schedule || push.updateTime;
				return push.save(callback[201]);
			}

			if (req.body.schedule) {
				agenda.schedule(req.body.schedule, agenda.jobDefines.PUSH, {
					id: result._id
				}, finish);
			}
			else {
				agenda.now(agenda.jobDefines.PUSH, {
					id: result._id
				}, finish);
			}
		});
	},
	updatePush : function (req, callback) {
		Push.findById(req.params.id, function (err, push) {
			if (err || !push) {
				return callback(err || 404);
			}
			_.assign(push, req.body);
			if (req.body.schedule) {
				var job;
				async.waterfall([
					getJobByPush.bind(null, push),
					function (_job, next) {
						if (!_job) {
							return next(404);
						}
						if (_job.lastRunAt || _job.attrs.lastRunAt) {
							return next('推送已发出，不能修改');
						}
						job = _job;
						job.schedule(req.body.schedule);
						next();
					},
					function (next) {
						async.parallel({
							push: function (aCallback) {
								push.save(function (err, result) {
									// 手动写callback,因为直接绑callback的话,会多接收到1个参数
									aCallback(err, result);
								});
							},
							job : function (aCallback) {
								job.save(function (err, result) {
									// 手动写callback,因为直接绑callback的话,会多接收到1个参数
									aCallback(err, result);
								});
							}
						}, next);
					}
				], function (err, results) {
					if (err) {
						return callback(err);
					}
					return callback[201](err, results.push);
				});
			}
			else {
				push.save(callback[201]);
			}
		});
	},
	sendPush   : function (note, callback) {
		PushUtil.sendPush(note, callback);
	}
};