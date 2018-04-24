/**
 * Created by Koan on 2017/9/26.
 */
'use strict';
var request = require('supertest'),
	should = require('chai').should(),
	async = require('async'),
	config = require('../config.js'),
	testUtils = require('../testUtils');

const API_URL = config.API_URL;

describe('advice test', function () {
	var ADMIN_TOKEN;
// 	before(function (done) {
// 		request(API_URL)
// 			.post('/api/token/user')
// 			.send({name: 'admin', password: 'admin'})
// 			.end(function (err, res) {
// 				if (err) {
// 					return done(err);
// 				}
// 				ADMIN_TOKEN = res.text;
// 				done(err);
// 			});
// 	});
// 	it('查询所有反馈信息', function (done) {
// 		request(API_URL)
// 			.get('/api/advice')
// 			.set('x-ar-token', ADMIN_TOKEN)
// 			.expect('Content-Type', /json/)
// 			.expect(200)
// 			.end(function (err, res) {
// 				if (err) {
// 					return done(err);
// 				}
// 				for (var i = 0; i < res.body.length; i++) {
// 					res.body[i].visitor.should.not.equal(null);
// 					res.body[i].uploadTime.should.not.equal(null);
// 					res.body[i].message.should.not.equal(null);
// 				}
// 				done(err);
// 			});
// 	});
// 	for (var i = 0; i < 1; i++) {
// 		/* eslint-disable no-loop-func*/
// 		var a = function (k) {
// 			it('创建反馈信息:' + k, function (done) {
// 				request(API_URL)
// 					.post('/api/advice')
// 					.send({
// 						message    : 'test message:' + k,
// 						messageType: 'user'
// 					})
// 					.set('mobile-id', '112.791.64.' + k)
// 					.set('mobile-model', 'test mobile')
// 					.expect('Content-Type', /json/)
// 					.expect(201)
// 					.end(function (err, res) {
// 						if (err) {
// 							return done(err);
// 						}
// 						res.body.visitor.should.not.equal(null);
// 						res.body.message.should.equal('test message:' + k);
// 						res.body.messageType.should.equal('user');
// 						testUtils.expectDateToBeToday(res.body.uploadTime);
// 						done(err);
// 					});
// 			});
// 		};
// 		a(i);
// 		/* eslint-enable no-loop-func*/
// 	}
	it('压力测试', function (done) {
		var tasks = [];
		for (var i = 0; i < 10; i++) {
			/* eslint-disable no-loop-func*/
			var a = function (k) {
				request(API_URL)
					.get('/api/app/detail')
					.expect('Content-Type', /json/)
					.expect(200)
					.end(function (err, res) {

					});
			};
			tasks.push(a);
		}
		console.log(1);
		async.parallel(tasks, done);
	});


});