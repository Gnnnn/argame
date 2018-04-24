'use strict';
/**
 * Created by gogoout on 16/12/8.
 */
var mongoose = require('mongoose'),
	helper = require('../utils/mongooseHelper');
var Schema = mongoose.Schema;

var pushSchema = new Schema({
	title      : String,
	description: String,
	type       : String,
	schedule   : {type: Date, default: function () {return new Date();}},
	scheduleId : Schema.Types.ObjectId,
	expiry     : Number,   // 超时时间 毫秒
	priority   : {type: Number, default: 10},
	user       : {type: Schema.Types.ObjectId, ref: 'User'},
	updateTime : {type: Date, default: function () {return new Date();}}
});

// static
// ----------------
pushSchema.statics = {
	// constants
	// --------------------
	constants: {
		types: new helper.Constant({
			SYSTEM_UPDATA: 'SYSTEM_UPDATA',
			ACTIVITY     : 'ACTIVITY',
			NEW_DOLL     : 'NEW_DOLL'
		})
	}
};

module.exports = mongoose.model('Push', pushSchema);