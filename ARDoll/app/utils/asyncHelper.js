'use strict';
/**
 * Created by gogoout on 15/7/14.
 */

module.exports = {
	streamWrapper: function (stream) {
		return function (callback) {
			stream.on('close', function (result) {
				callback(null, result);
			});

			stream.on('error', function (error) {
				callback(error);
			});
		};
	}
};