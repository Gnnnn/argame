'use strict';
/**
 * Created by Koan on 2017.9.25
 */
var assign = require('lodash/assign'),
	allConfig = require('../../config/config.json');

var configs = assign(
	{},
	allConfig
);

module.exports = configs;