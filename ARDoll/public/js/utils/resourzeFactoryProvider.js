/**
 * Created by Koan on 2017/9/25.
 */
'use strict';

var assign = require('lodash/assign'),
	isFunction = require('lodash/isFunction'),
	forEach = require('lodash/forEach'),
	cloneDeep = require('lodash/cloneDeep'),
	noop = require('lodash/noop'),
	axios = require('axios'),
	axiosDefaults = require('axios/lib/defaults'),
	utils = require('./resourzeUtils'),
	_defaults = require('./resourzeDefaults'),
	Route = require('./resourzeRoute');

/**
 * provider的作用主要是配置全局url和header
 * @param serverUrl
 * @param option {object} {port,prefixUrl,headers}
 * @returns {resourzeFactory}
 */
module.exports = function resourzeFactoryProvider(serverUrl, option) {
	var provider = {};
	option = assign({}, option);
	option.serverUrl = (option.proto || 'http') + '://' + serverUrl;
	option.serverUrl += option.port ? ':' + option.port : '';
	option.serverUrl += option.prefixUrl ? '/' + option.prefixUrl : '';

	option.serverUrl += '/';

	provider.serverUrl = option.serverUrl;
	provider.headers = option.headers || {};

	/**
	 *
	 * @param url
	 * @param paramDefaults
	 * @param actions {object} {action,method,params,url(override),transformRequest,transformResponse,cache,timeout,
	 * withCredentials(currently not availble),responseType,interceptor}
	 * @param options {object} {stripTrailingSlashes,transformRequest}
	 * @returns {Resourze}
	 */
	function resourzeFactory(url, paramDefaults, actions, options) {
		var factoryArgs = arguments;
		options = options || {};
		var route = new Route(url, options, provider);

		actions = assign({}, _defaults.actions, actions);

		function Resourze(value) {
			this.setResourzeValue(value);
		}

		// for Constructor test
		Resourze.isConstructorOfResourze = true;

		Resourze.prototype.setResourzeValue = function setResourzeValue(value) {
			var self = this;
			// deep clone
			value = JSON.parse(JSON.stringify(value || {}));
			utils.shallowClearAndCopy(this, value);
		};

		Resourze.prototype.toJSON = function () {
			return this;
		};

		forEach(actions, function (action, name) {
			var hasBody = /^(POST|PUT|PATCH)$/i.test(action.method);

			Resourze[name] = function (a1, a2, a3, a4) {
				var params = {}, data, success, error;

				/* jshint -W086 */
				/* (purposefully fall through case statements) */
				switch (arguments.length) {
					case 4:
						error = a4;
						success = a3;
					//fallthrough
					case 3:
					case 2:
						if (isFunction(a2)) {
							if (isFunction(a1)) {
								success = a1;
								error = a2;
								break;
							}

							success = a2;
							error = a3;
							//fallthrough
						}
						else {
							params = a1;
							data = a2;
							success = a3;
							break;
						}
					case 1:
						if (isFunction(a1)) {
							success = a1;
						}
						else if (hasBody) {
							data = a1;
						}
						else {
							params = a1;
						}
						break;
					case 0:
						break;
					default:
						throw new Error('Expected up to 4 arguments [params, data, success, error], got %s arguments', arguments.length);
				}
				/* jshint +W086 */
				/* (purposefully fall through case statements) */

				var isInstanceCall = this instanceof Resourze;
				var value = isInstanceCall ? data : null;
				var httpConfig = {
					headers         : provider.headers,
					transformRequest: options.transformRequest || [utils.transformRequest,
					                                               axiosDefaults.transformRequest[0]]
				};
				var responseInterceptor = action.interceptor && action.interceptor.response ||
				                          _defaults.responseInterceptor;
				var responseErrorInterceptor = action.interceptor && action.interceptor.responseError ||
				                               undefined;

				forEach(action, function (value, key) {
					if (key !== 'params' && key !== 'interceptor') {
						if (key !== 'headers') {
							httpConfig[key] = cloneDeep(value);
						}
						else {
							extend(httpConfig[key]);
						}
					}
				});

				if (hasBody) {
					httpConfig.data = data;
				}
				var actionParams = assign({}, paramDefaults, action.params || {});
				route.setUrlParams(httpConfig,
					assign({}, utils.extractParams(data, actionParams), params),
					action.url);

				var promise = axios(httpConfig).then(function (response) {
					return response;
				}, error);

				promise = promise.then(
					function (response) {
						var value = responseInterceptor(response);
						(success || noop)(value, response.headers);
						return value;
					},
					responseErrorInterceptor);

				return promise;
			};


			Resourze.prototype['$' + name] = function (params, success, error) {
				if (isFunction(params)) {
					error = success;
					success = params;
					params = {};
				}
				return Resourze[name].call(this, params, this, success, error);
			};
		});


		Resourze.prototype.getComputedUrl = function (params) {
			params = assign({}, utils.extractParams(this, paramDefaults), params || {});
			return route.getComputedUrl(params, null);
		};

		Resourze.getComputedUrl = function (params) {
			params = assign({}, utils.extractParams({}, paramDefaults), params || {});
			return route.getComputedUrl(params, null);
		};

		Resourze.hasUrlParam = Resourze.prototype.hasUrlParam = function (key) {
			return route.hasUrlParam(key);
		};

		// for change
		Object.defineProperty(Resourze, '_url', {
			writable: true,
			value   : route.url
		});

		Resourze.clone = function () {
			return resourzeFactory.apply(undefined, factoryArgs);
		};

		Resourze.bind = function (additionalParamDefaults) {
			return resourzeFactory(url, assign({}, paramDefaults, additionalParamDefaults), actions);
		};

		return Resourze;
	}

	resourzeFactory.provider = provider;
	return resourzeFactory;
};