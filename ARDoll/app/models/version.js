/**
 * Created by Koan on 2017/9/21.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema,
	Version;

// schema
// --------------------------
var versionSchema = new Schema(
	{
		user      : {type: Schema.Types.ObjectId, ref: 'User', required: true},
		version   : {type: String, require: true},
		uploadTime: {type: Date, default: function () {return new Date();}},
		updateNews: {type: String, require: true}   // 更新履历
	}
);

Version = mongoose.model('Version', versionSchema);

module.exports = Version;