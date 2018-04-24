'use strict';
var request = require('supertest'),
	should = require('chai').should(),
	async = require('async'),
	config = require('../config.js'),
	testUtils = require('../testUtils');

const API_URL = config.API_URL;

describe('user test', function () {
	it('查询所有用户信息', function (done) {
		request(API_URL)
			.get('/api/users')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function (err, res) {
				if (err) {
					return done(err);
				}
				for (var i = 0; i < res.body.length; i++) {
					res.body[i].name.should.not.equal(null);
					res.body[i].registerDate.should.not.equal(null);
					res.body[i].role.should.not.equal(null);
				}
				done(err);
			});
	});
	var USER_ID,
		ADMIN_TOKEN;
	it('创建新用户', function (done) {
		request(API_URL)
			.post('/api/users')
			.send({
				name    : 'testUser',
				password: '12345678',
				role    : 'adssadasdasd'
			})
			.expect(201)
			.end(function (err, res) {
				if (err) {
					return done(err);
				}
				res.body.name.should.equal('testUser');
				res.body.role.should.equal('admin');
				testUtils.expectDateToBeToday(res.body.registerDate);
				USER_ID = res.body._id;
				request(API_URL)
					.post('/api/token/user')
					.send({name: 'testUser', password: '12345678'})
					.end(function (err, res) {
						if (err) {
							return done(err);
						}
						ADMIN_TOKEN = res.text;
						done(err);
					});
			});
	});
	it('获取个人信息', function (done) {
		request(API_URL)
			.get('/api/users/me')
			.set('x-ar-token', ADMIN_TOKEN)
			.expect(200)
			.end(function (err, res) {
				if (err) {
					return done(err);
				}
				res.body.name.should.equal('testUser');
				res.body.role.should.equal('admin');
				done(err);
			});
	});
	it('修改个人信息', function (done) {
		request(API_URL)
			.put('/api/users/me')
			.send({
				name       : 'testUser1',
				password   : '87654321',
				oldPassword: '12345678',
				role       : 'adssadasdasd'
			})
			.set('x-ar-token', ADMIN_TOKEN)
			.expect(201)
			.end(function (err, res) {
				if (err) {
					return done(err);
				}
				res.body.name.should.equal('testUser');
				res.body.role.should.equal('admin');
				request(API_URL)
					.post('/api/token/user')
					.send({name: 'testUser', password: '87654321'})
					.end(function (err, res) {
						if (err) {
							return done(err);
						}
						ADMIN_TOKEN = res.text;
						done(err);
					});
			});
	});
	it('删除用户', function (done) {
		request(API_URL)
			.del('/api/users/' + USER_ID)
			.set('x-ar-token', ADMIN_TOKEN)
			.expect(204)
			.end(function (err, res) {
				if (err) {
					return done(err);
				}

				request(API_URL)
					.post('/api/token/user')
					.send({name: 'testUser', password: '87654321'})
					.expect(422)
					.end(function (err, res) {
						if (err) {
							return done(err);
						}
						done(err);
					});

			});
	});
});