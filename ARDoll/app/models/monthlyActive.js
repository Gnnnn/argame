/**
 * Created by Koan on 2017/9/28.
 */
'use strict';
var mongoose = require('mongoose'),
	logger = require('../utils/logger');
var Schema = mongoose.Schema,
	MonthlyActive;

// schema
// --------------------------
var monthlyActiveSchema = new Schema(
	{
		month: {type: String, require: true},
		count: {type: Number, default: 0}
	}
);

// static
// ----------------
monthlyActiveSchema.statics = {
	increaseCount: function (month) {
		return function (callback) {
			MonthlyActive.findOne({month: month}, function (err, result) {
				if (err) {
					logger.error(err);
					return callback();
				}
				if (!result) {
					result = new MonthlyActive({
						month: month,
						count: 0
					});
				}
				result.count++;
				result.save(callback);
			});
		};
	}
};

MonthlyActive = mongoose.model('MonthlyActive', monthlyActiveSchema);

module.exports = MonthlyActive;