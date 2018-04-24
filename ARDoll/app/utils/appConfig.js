'use strict';
/**
 * Created by gogoout on 15/7/13.
 */
var _ = require('lodash');
var configPath = '../config/',
	env = process.env.NODE_ENV || 'development';

var config = _.extend(
	{},
	require(configPath + 'config'),
	require(configPath + env)
);

config.port = process.env.PORT || config.port;

module.exports = config;