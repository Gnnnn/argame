'use strict';
/**
 * Created by Koan on 2017.9.29
 */
var mongoose = require('mongoose'),
	helper = require('../utils/mongooseHelper');
var Schema = mongoose.Schema,
	PushDevice;

// schema
// ----------------
var pushDeviceSchema = new Schema({
	deviceId  : {type: String, required: true, unique: true, index: true},
	// possible values: ios
	type      : {type: String, required: true},
	visitor   : {type: Schema.Types.ObjectId, sparse: true, ref: 'Visitor'},
	updateTime: Date
});


// validation
// ----------------
// required
helper.fieldEnsureUnique(pushDeviceSchema, 'deviceId', function () {return PushDevice;}, 'deviceId is already used!');
// static
// ----------------
pushDeviceSchema.statics = {
	// constants
	// --------------------
	constants: {
		types: new helper.Constant({
			IOS: 'ios'
		})
	}
};


PushDevice = mongoose.model('PushDevice', pushDeviceSchema);
module.exports = PushDevice;