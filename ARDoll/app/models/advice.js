/**
 * Created by Koan on 2017/9/21.
 */
'use strict';

var mongoose = require('mongoose'),
	helper = require('../utils/mongooseHelper');
var Schema = mongoose.Schema,
	Advice;

// schema
// --------------------------
var adviceSchema = new Schema(
	{
		visitor      : {type: Schema.Types.ObjectId, ref: 'Visitor', require: true},
		uploadTime   : {type: Date, default: function () {return new Date();}},
		message      : {type: String, require: true},
		messageType  : {type: String, default: 'user'},
		handleState  : {type: String, default: 'pending'},
		handleUser   : {type: Schema.Types.ObjectId, ref: 'User'},
		handleTime   : Date,
		handleMessage: String
	}
);

adviceSchema.statics = {
	// constants
	// --------------------
	constants: {
		messageType: new helper.Constant({
			SYSTEM: 'system',
			USER  : 'user'
		}),
		handleState: new helper.Constant({
			PENDING  : 'pending', // 待处理
			PROCESSED: 'processed', // 已处理
			SHELVE   : 'shelve' // 搁置
		})
	}
};

Advice = mongoose.model('Advice', adviceSchema);

module.exports = Advice;