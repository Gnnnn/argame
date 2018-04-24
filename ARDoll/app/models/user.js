'use strict';
/**
 * Created by gogoout on 15/6/3.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	crypto = require('crypto'),
	helper = require('../utils/mongooseHelper');

var Schema = mongoose.Schema,
	User;

// schema
// ------------
var userSchema = new Schema({
	name          : {type: String, unique: true, require: true},
	nameLower     : {type: String, unique: true, require: true},
	// possible values: 'admin' , 'user'
	role          : {type: String, default: 'user', require: true},
	hashedPassword: {type: String, required: true},
	registerDate  : Date,
	salt          : String
});

/* eslint-disable no-invalid-this */
userSchema.virtual('password')
	.set(function (password) {
		this.makeSalt();
		this.hashedPassword = this.hashPassword(password);
	})
	.get(function () {
		return this.password;
	});

// validation
// ----------------
// required
helper.fieldEnsureUnique(userSchema, 'name', function () {return User;}, 'User name is already in use!');

// methods
//-----------------
_.extend(userSchema.methods, {
	hashPassword  : function (password) {
		if (!password || !this.salt) {
			return '';
		}
		var salt = new Buffer(this.salt, 'base64');
		// this sync will not impact to the performance
		return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64');
	},
	verifyPassword: function (password) {
		return this.hashPassword(password) === this.hashedPassword;
	},
	makeSalt      : function () {
		this.salt = crypto.randomBytes(16).toString('base64');
	}
});

// static
// ----------------
userSchema.statics = {
	findOneByName: function (name, additionCondition, callback) {
		if (arguments.length === 2) {
			callback = additionCondition;
			additionCondition = null;
		}
		var condition = {$or: [{nameLower: name}]};
		if (additionCondition) {
			condition = {$and: [condition, additionCondition]};
		}
		User.findOne(condition, callback);
	},
	isAdmin  : function (user) {
		return user && user.role === User.constants.roles.ADMIN;
	},
	// constants
	// --------------------
	constants: {
		roles: new helper.Constant({
			ADMIN: 'admin',
			USER : 'user'
		})
	}
};

userSchema.options.toObject = userSchema.options.toObject || {};
userSchema.options.toJSON = userSchema.options.toJSON || {};
userSchema.options.toJSON.transform = userSchema.options.toObject.transform = function (doc, obj, options) {
	delete obj.hashedPassword;
	delete obj.salt;
};

User = mongoose.model('User', userSchema);
module.exports = User;