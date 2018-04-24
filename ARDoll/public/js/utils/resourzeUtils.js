/**
 * Created by Koan on 2017/9/25.
 */
'use strict';
var isFunction = require('lodash/isFunction'),
	isArray = require('lodash/isArray'),
	forEach = require('lodash/forEach'),
	every = require('lodash/every'),
	clone = require('lodash/clone');

/**
 * We need our custom method because encodeURIComponent is too aggressive and doesn't follow
 * http://www.ietf.org/rfc/rfc3986.txt with regards to the character set
 * (pchar) allowed in path segments:
 *    segment       = *pchar
 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *    pct-encoded   = "%" HEXDIG HEXDIG
 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                     / "*" / "+" / "," / ";" / "="
 */
function encodeUriSegment(val) {
	return encodeUriQuery(val, true).replace(/%26/gi, '&').replace(/%3D/gi, '=').replace(/%2B/gi, '+');
}


/**
 * This method is intended for encoding *key* or *value* parts of query component. We need a
 * custom method because encodeURIComponent is too aggressive and encodes stuff that doesn't
 * have to be encoded per http://tools.ietf.org/html/rfc3986:
 *    query       = *( pchar / "/" / "?" )
 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 *    pct-encoded   = "%" HEXDIG HEXDIG
 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                     / "*" / "+" / "," / ";" / "="
 */
function encodeUriQuery(val, pctEncodeSpaces) {
	return encodeURIComponent(val)
		.replace(/%40/gi, '@')
		.replace(/%3A/gi, ':')
		.replace(/%24/g, '$')
		.replace(/%2C/gi, ',')
		.replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
}

// Helper functions and regex to lookup a dotted path on an object
// stopping at undefined/null.  The path must be composed of ASCII
// identifiers (just like $parse)
var MEMBER_NAME_REGEX = /^(\.[a-zA-Z_$@][0-9a-zA-Z_$@]*)+$/;
function isValidDottedPath(path) {
	return (path != null && path !== '' && path !== 'hasOwnProperty' &&
	        MEMBER_NAME_REGEX.test('.' + path));
}

function lookupDottedPath(obj, path) {
	if (!isValidDottedPath(path)) {
		throw new ResourzeError('badmember', 'Dotted member path "%s" is invalid.', path);
	}
	var keys = path.split('.');
	for (var i = 0, ii = keys.length; i < ii && obj !== undefined; i++) {
		var key = keys[i];
		obj = (obj !== null) ? obj[key] : undefined;
	}
	return obj;
}

function extractParams(data, actionParams) {
	var ids = {};
	forEach(actionParams, function (value, key) {
		if (isFunction(value)) { value = value(); }
		ids[key] = value && value.charAt && value.charAt(0) === '@' ?
		           lookupDottedPath(data, value.substr(1)) : value;
	});
	return ids;
}

/**
 * Create a shallow copy of an object and clear other fields from the destination
 */
function shallowClearAndCopy(dst, src) {
	dst = dst || {};

	forEach(dst, function (value, key) {
		delete dst[key];
	});

	for (var key in src) {
		if (src.hasOwnProperty(key) && !(key.charAt(0) === '$' && key.charAt(1) === '$')) {
			dst[key] = src[key];
		}
	}
	return dst;
}

function isConstructorOfResourze(obj) {
	return (obj && isFunction(obj) && obj.isConstructorOfResourze === true);
}

function isInstanceOfResourze(obj) {
	return (obj && isConstructorOfResourze(obj.constructor));
}

function isArrayOfResourzeInstance(obj) {
	if (obj && isArray(obj)) {
		return every(obj, function (each) {
			return isInstanceOfResourze(each);
		});
	}
	return false;
}

function transformRequest(data) {
	return clone(data);
}

module.exports = {
	encodeUriSegment         : encodeUriSegment,
	encodeUriQuery           : encodeUriQuery,
	isValidDottedPath        : isValidDottedPath,
	lookupDottedPath         : lookupDottedPath,
	extractParams            : extractParams,
	shallowClearAndCopy      : shallowClearAndCopy,
	isConstructorOfResourze  : isConstructorOfResourze,
	isInstanceOfResourze     : isInstanceOfResourze,
	isArrayOfResourzeInstance: isArrayOfResourzeInstance,
	transformRequest         : transformRequest
};