'use strict';
/**
 * Created by gogoout on 16/4/14.
 */
/* eslint-disable no-invalid-this */
function cache(type, options) {
	if (!this.headersSent) {
		if (typeof (type) !== 'string') {
			options = type;
			type = 'public';
		}

		if (options && typeof options.maxAge === 'number') {
			type += ', max-age=' + options.maxAge;
			var expire = new Date(Date.now() + options.maxAge).toUTCString();
			this.set('Expires', expire);
		}

		this.set('Cache-Control', type);
	}
}
/* eslint-enable no-invalid-this */

module.exports = (req, res, next)=> {
	res.cache = cache;
	next();
};
