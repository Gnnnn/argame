'use strict';
/**
 * Created by Koan on 2017.9.17
 */
var _ = require('lodash'),
	async = require('async'),
	fs = require('fs'),
	path = require('path'),
	mongoose = require('mongoose'),
	gridFactory = require('gridfs-stream'),
	Agenda = require('agenda'),
	startsWith = require('underscore.string/startsWith'),
	config = require('./utils/appConfig'),
	logger = require('./utils/logger'),
	appCtrl = require('./controllers/app');

var app = {};

gridFactory.mongo = mongoose.mongo;

logger.info('app run with NODE_ENV:' + process.env.NODE_ENV);
logger.info('app run with NODE_DEBUG:' + process.env.NODE_DEBUG);

// ============== schedule ==================
function setupSchedule(conn) {
	// ensureIndex
	var jobs = conn.collection('jobs');

	jobs.ensureIndex({
		nextRunAt: 1,
		lockedAt : 1,
		name     : 1,
		priority : 1
	}, _.noop);


	var agenda = new Agenda();
	// agenda 升级时可以切换成这个
	// agenda.mongo(conn);
	agenda.mongo(jobs.conn.db, 'jobs');
	logger.info('loading schedule jobs...');

	agenda.jobDefines = {};
	var jobFiles = fs.readdirSync(path.resolve(__dirname, 'schedules'));
	if (jobFiles && jobFiles.length) {
		jobFiles.forEach(function (file) {
			if (file) {
				var job = require(path.resolve(__dirname, 'schedules', file));
				job(agenda);
			}
		});
	}
	logger.info('schedule jobs loaded!');
	agenda.on('ready', function () {
		agenda.start();
		app.agenda = agenda;
		logger.info('agenda is running');

		agenda.jobs({name: agenda.jobDefines.BUILD_RETENTION}, function (err, jobs) {
			if (err) {
				return logger.error(err);
			}
			jobs.forEach(function (job) {
				job.remove();
			});
			var newJob = agenda.create(agenda.jobDefines.BUILD_RETENTION);
			newJob.repeatAt('2am');
			newJob.save();
		});
	});

	agenda.on('error', function (err) {
		logger.error(err);
	});
}

// ============== database ==================
function connectDatabase(onOpen) {
	// server will need mongoose, so connect first
	// this is somewhat coupling
	logger.info('connecting database...');
	if (process.env.NODE_DEBUG === 'true') {
		mongoose.set('debug', true);
	}
	mongoose.connect(config.dbUrl, {
		user: config.user,
		pass: config.password
	});

	var conn = mongoose.connection;
	conn.once('open', function () {
		logger.info('database connected');
		onOpen();
	});
	return conn;
}

function registerDbModels() {
	var files = fs.readdirSync(path.resolve(__dirname, 'models'));

	if (files && files.length) {
		files.forEach(function (file) {
			if (file !== 'index.js' && !startsWith(file, '.')) {
				require(path.resolve(__dirname, 'models', file));
			}
		});
	}
}

// ============== server ==================
var server;

function setupServer() {
	logger.info('loading middleware...');
	server = require('./server');
	_.extend(app, {
		config: config,
		server: server
	});
}

function startListen() {
	var instance = server.listen(config.port, function () {
		var host = instance.address().address;
		var port = instance.address().port;
		logger.info('listening at http://%s:%s', host, port);
	});
}

function buildResources() {
	async.waterfall([
		async.apply(appCtrl.reRestructPlayInfo)
	], function (err, result) {
		if (err) {
			return logger.error('buildResources failed: ' + err);
		}
		logger.info('buildResources success');
	});
}

// ============== start ==================
setupServer();
// startListen();
var conn = connectDatabase(function () {
	app.gfs = gridFactory(conn.db);
	registerDbModels();
	setupSchedule(conn);
	buildResources();
	startListen();
});
// ============== exit ==================
process.on('SIGINT', function () {
	setTimeout(function () {
		process.exit(0);
	}, 3000);
});

module.exports = app;