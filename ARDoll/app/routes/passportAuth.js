/**
 * Created by Koan on 2017/11/3.
 */
'use strict';

var passport = require('passport'),
	WechatStrategy = require('passport-wechat').Strategy,
	visitorCtrl = require('../controllers/visitor'),
	config = require('../utils/appConfig');

function wechatTransformer(accessToken, refreshToken, profile) {
	return {
		accessToken : accessToken,
		refreshToken: refreshToken,
		openId      : profile.openid,
		name        : profile.nickname,
		gender      : profile.sex === 1 ? 'male' : (profile.sec === 2 ? 'female' : null),
		headImgUrl  : profile.headimgurl
	};
}

module.exports = function (easyRouter) {
	var server = easyRouter.rawServer;

	// 微信移动端中登录方式
	passport.use(new WechatStrategy({
		name     : 'wechatMobile',
		appID    : config.passport.wechatMobile.clientID,
		appSecret: config.passport.wechatMobile.clientSecret,
		client   : 'wechat',
		scope    : 'snsapi_userinfo'
// 		callbackURL: config.passport.wechatMobile.callbackURL
	}, function (accessToken, refreshToken, profile, expiresIn, done) {
		done(null, wechatTransformer(accessToken, refreshToken, profile));
	}));

	server.get('/auth/wechatMobile', passport.authenticate('wechatMobile', {session: false}), visitorCtrl.userOauthJSONCallback);
// 	server.get('/auth/wechatMobile/callback', passport.authenticate('wechatMobile', {session: false}), visitorCtrl.userOauthCallback);
// 	server.post('/auth/wechatMobile/callback', passport.authenticate('wechatMobile', {session: false}), visitorCtrl.userOauthJSONCallback);

	if (config.censorshipFlg) {
		server.get('/auth/temp/visitor', visitorCtrl.createTempVisitor);
	}
};