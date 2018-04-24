/**
 * Created by Koan on 2017/9/26.
 */
'use strict';
var pick = require('lodash/pick'),
	forEach = require('lodash/forEach'),
	assign = require('lodash/assign'),
	_defaults = require('./resourzeDefaults'),
	utils = require('./resourzeUtils');

function Route(url, defaults, provider) {
	var validOptionKeys = ['stripTrailingSlashes', 'actions'];
	this.url = url;
	this.defaults = pick(assign({}, _defaults, defaults), validOptionKeys);
	this.urlParams = {};
	this.provider = provider;
}

Route.prototype = {};
Route.prototype.constructor = Route;
Route.prototype = {
	getComputedUrl: function (params, actionUrl) {
		var self = this,
			url = actionUrl || self.url,
			val,
			encodedVal;

		var urlParams = self.urlParams = {};
		forEach(url.split(/\W/), function (param) {
			if (param === 'hasOwnProperty') {
				throw new Error('hasOwnProperty is not a valid parameter name.');
			}
			if (!(/^\d+$/.test(param)) && param &&
			    (new RegExp('(^|[^\\\\]):' + param + '(\\W|$)').test(url))) {
				urlParams[param] = true;
			}
		});
		url = url.replace(/\\:/g, ':');

		params = params || {};
		forEach(self.urlParams, function (_, urlParam) {
			val = params.hasOwnProperty(urlParam) ? params[urlParam] : self.defaults[urlParam];
			if (val != null) {
				encodedVal = utils.encodeUriSegment(val);
				url = url.replace(new RegExp(':' + urlParam + '(\\W|$)', 'g'), function (match, p1) {
					return encodedVal + p1;
				});
			}
			else {
				url = url.replace(new RegExp('(\/?):' + urlParam + '(\\W|$)', 'g'), function (match,
				                                                                              leadingSlashes, tail) {
					if (tail.charAt(0) === '/') {
						return tail;
					}
					else {
						return leadingSlashes + tail;
					}
				});
			}
		});

		// strip trailing slashes and set the url (unless this behavior is specifically disabled)
		if (self.defaults.stripTrailingSlashes) {
			url = url.replace(/\/+$/, '') || '/';
		}

		// then replace collapse `/.` if found in the last URL path segment before the query
		// E.g. `http://url.com/id./format?q=x` becomes `http://url.com/id.format?q=x`
		url = url.replace(/\/\.(?=\w+($|\?))/, '.');
		url = self.provider.serverUrl + url.replace(/\/\\\./, '/.');
		return url;
	},
	hasUrlParam   : function (key) {
		if (this.urlParams[key]) {
			return true;
		}
		return false;
	},
	setUrlParams  : function (config, params, actionUrl) {
		var self = this;
		// replace escaped `/\.` with `/.`
		config.url = this.getComputedUrl(params, actionUrl);

		// set params - delegate param encoding to axios
		forEach(params, function (value, key) {
			if (!self.hasUrlParam(key)) {
				config.params = config.params || {};
				config.params[key] = value;
			}
		});
	}
};

module.exports = Route;