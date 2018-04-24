/**
 * Created by Koan on 2017/9/28.
 */
'use strict';

var mongoose = require('mongoose'),
	logger = require('../utils/logger');
var Schema = mongoose.Schema,
	DailyActive;

// schema
// --------------------------
var dailyActiveSchema = new Schema(
	{
		day  : {type: String, require: true},
		count: {type: Number, default: 0}
	}
);

// static
// ----------------
dailyActiveSchema.statics = {
	increaseCount: function (day) {
		return function (callback) {
			DailyActive.findOne({day: day}, function (err, result) {
				if (err) {
					logger.error(err);
					return callback();
				}
				if (!result) {
					result = new DailyActive({
						day  : day,
						count: 0
					});
				}
				result.count++;
				result.save(callback);
			});
		};
	}
};

DailyActive = mongoose.model('DailyActive', dailyActiveSchema);

module.exports = DailyActive;