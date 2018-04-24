'use strict';
/**
 * Created by gogoout on 15/6/4.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	validator = require('validator'),
	errorHelper = require('./errorHelper');
var modelHelper = {};

modelHelper.fieldEnsureUnique = function (schema, fieldName, getModel, errMsg) {
	schema.path(fieldName).validate(function (val, callback) {
		var model = getModel();
		var conditions = [{}];
		conditions[0][fieldName] = val;
		/* eslint-disable no-invalid-this*/
		conditions.push({_id: {$ne: this._id}});
		/* eslint-enable no-invalid-this*/

		model.find({
			$and: conditions
		}, function (err, results) {
			callback(err || results.length === 0);
		});
	}, errMsg);
};

modelHelper.Constant = function (object) {
	_.extend(this, object || {});
};
_.extend(modelHelper.Constant.prototype, {
	haveValue: function (str) {
		for (var key in this) {
			if (this[key] === str) {
				return true;
			}
		}
		return false;
	},
	toArray  : function () {
		var constants = [];
		_.forEach(this, function (value) {
			constants.push(value);
		});
		return constants;
	},
	toString : function () {
		return this.toArray().join(',');
	}
});

var ObjectId = mongoose.Types.ObjectId;
modelHelper.arrayIndexOfId = function (array, id) {
	if (!validator.isMongoId(id)) {
		errorHelper.ifUnprocessableEntity('传递的id不合法');
	}
	return array.indexOf(new ObjectId(id));
};

modelHelper.convertObjectIdInConditions = function (conditions) {
	conditions = _.clone(conditions);
	_(conditions).forEach(function (val, key) {
		if (validator.isMongoId(val)) {
			conditions[key] = new mongoose.Types.ObjectId(val);
		}
	});
	return conditions;
};

module.exports = modelHelper;
