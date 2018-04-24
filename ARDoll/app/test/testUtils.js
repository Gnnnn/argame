'use strict';
/**
 * Created by gogoout on 17/1/22.
 */
var should = require('chai').should();

var modules = module.exports = {
	parseDate(str) {
		if (str) {
			return new Date(str);
		}
		return {};
	},
	expectDateToBeToday(data){
		return modules.parseDate(data).toLocaleDateString().should.contain(new Date().toLocaleDateString());
	},
	random(max){
		return Math.floor(Math.random(47) * max);
	}
};