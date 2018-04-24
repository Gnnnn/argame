'use strict';
/**
 * Created by gogoout on 15/7/29.
 */
module.exports = {
	parse : function (strDate) {
		if (strDate) {
			var reg = /\d{4}-\d{1,2}-\d{1,2}( |$)/;
			if (reg.test(strDate)) {
				return new Date(strDate.replace(/-/g, '/'));
			}
			else {
				return new Date(strDate);
			}
		}
		return null;
	},
	format: function (date, format = 'yyyy-MM-dd') {
		try {
			switch (typeof date) {
				case 'string':
					date = this.parse(date);
					break;
				case 'number':
					date = new Date(date);
					break;
			}
		}
		catch (e) {
			console && console.warn(date + 'is not a valid date');
			date = null;
		}

		if (!(date instanceof Date)) {
			return '';
		}
		var dict = {
			yyyy: date.getFullYear(),
			M   : date.getMonth() + 1,
			d   : date.getDate(),
			H   : date.getHours(),
			m   : date.getMinutes(),
			s   : date.getSeconds(),
			MM  : ('' + (date.getMonth() + 101)).substr(1),
			dd  : ('' + (date.getDate() + 100)).substr(1),
			HH  : ('' + (date.getHours() + 100)).substr(1),
			mm  : ('' + (date.getMinutes() + 100)).substr(1),
			ss  : ('' + (date.getSeconds() + 100)).substr(1)
		};
		return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
			return dict[arguments[0]];
		});
	}
};