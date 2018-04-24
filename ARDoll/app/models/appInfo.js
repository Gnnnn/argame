/**
 * Created by Koan on 2017/10/25.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema,
	AppInfo;

// schema
// --------------------------
var appInfoSchema = new Schema(
	{
		retention       : {type: Array, require: true},
		totalVisitors   : {type: Number, require: true},
		buildTime       : {type: Date, default: function () {return new Date();}},
		inviteCodeNumber: Number
	}
);

AppInfo = mongoose.model('AppInfo', appInfoSchema);

module.exports = AppInfo;