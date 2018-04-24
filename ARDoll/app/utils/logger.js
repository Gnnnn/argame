'use strict';
/**
 * Created by gogoout on 15/12/17.
 */
var _ = require('lodash'),
	bunyan = require('bunyan'),
	PrettyStream = require('bunyan-prettystream'),
	configs = require('./appConfig');

var prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

var streams = [{stream: prettyStdOut}];
if (configs.log) {
	if (_.isArray(configs.log)) {
		Array.prototype.push.apply(streams, configs.log);
	}
	else {
		streams.push(configs.log);
	}
}
var log = bunyan.createLogger({
	name   : 'dolls',
	streams: streams
});

module.exports = log;