/**
 * Created by Koan on 2017/9/28.
 */
'use strict';

var mongoose = require('mongoose'),
	logger = require('../utils/logger');
var Schema = mongoose.Schema,
	HourlyActive;

// schema
// --------------------------
var hourlyActiveSchema = new Schema(
	{
		hour : {type: String, require: true},
		count: {type: Number, default: 0}
	}
);

// static
// ----------------
hourlyActiveSchema.statics = {
	increaseCount: function (hour) {
		return function (callback) {
			HourlyActive.findOne({hour: hour}, function (err, result) {
				if (err) {
					logger.error(err);
					return callback();
				}
				if (!result) {
					result = new HourlyActive({
						hour : hour,
						count: 0
					});
				}
				result.count++;
				result.save(callback);
			});
		};
	}
};

HourlyActive = mongoose.model('HourlyActive', hourlyActiveSchema);

module.exports = HourlyActive;