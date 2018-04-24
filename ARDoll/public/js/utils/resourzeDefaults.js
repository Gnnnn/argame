/**
 * Created by Koan on 2017/9/26.
 */
'use strict';

var _defaults = {
	// Strip slashes by default
	stripTrailingSlashes: true,

	// Default actions configuration
	actions            : {
		// 新增one
		one   : {method: 'GET'},
		query : {method: 'GET'},
		// 新增create
		create: {method: 'POST'},
		// save改为put
		save  : {method: 'PUT'},
		update: {method: 'PUT'},
		delete: {method: 'DELETE'}
	},
	responseInterceptor: function (response) {
		return response;
	}

};

module.exports = _defaults;