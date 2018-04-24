'use strict';
/**
 * Created by gogoout on 15/6/16.
 */
var validator = require('validator'),
	assign = require('lodash/assign'),
	isUndefined = require('lodash/isUndefined'),
	isArray = require('lodash/isArray'),
	isObject = require('lodash/isObject');

function Assertion() {
	this.continue = true;
}
Assertion.prototype = Object.create(Array.prototype);
Assertion.prototype.constructor = Assertion;

assign(Assertion.prototype, {
	_push        : Assertion.prototype.push,
	push         : function (errMsg) {
		if (errMsg) {
			this._push(errMsg);
		}
	},
	assert       : function (valid, errMsg) {
		if (this.continue && !valid) {
			this.push(errMsg);
		}
		return this;
	},
	assertInstant: function (valid, errMsg, allowFault) {
		if (this.continue && !valid) {
			if (!allowFault) {
				this.push(errMsg);
			}
			this.continue = false;
		}
		return this;
	},
	result       : function () {
		return this.length > 0 ? this.toString() : null;
	},
	toString     : function () {
		return this.join('\n');
	}
});


// 允许 0-9 a-Z 汉字 _ - . *  空格
var userName = /^[\s\-.*0-9\u00BF-\u1FFF\u2C00-\uD7FF\w]+$/;
assign(Assertion, {
	assert         : function (valid, errMsg) {
		return new Assertion().assert(valid, errMsg);
	},
	assertInstant  : function (valid, errMsg, allowFault) {
		return new Assertion().assertInstant(valid, errMsg, allowFault);
	},
	isArrayOfOid   : function (array) {
		// 这里写的不太好
		if (isUndefined(array)) {
			return true;
		}
		if (!isArray(array)) {
			return false;
		}
		var wrong = false;
		for (var i = array.length; i--;) {
			var each = array[i];
			wrong = !validator.isMongoId(each);
			if (wrong) {
				break;
			}
		}

		return !wrong;
	},
	isArrayOfObject: function (array) {
		if (isUndefined(array)) {
			return false;
		}
		if (!isArray(array)) {
			return false;
		}
		var correct = true;
		for (var i = array.length; i--;) {
			var each = array[i];
			if (!isObject(each)) {
				correct = false;
				break;
			}
		}

		return correct;
	},
	isUsername     : function (str) {
		return userName.test(str);
	}
});

module.exports = Assertion;