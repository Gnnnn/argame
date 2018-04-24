'use strict';
/**
 * Created by Koan on 17/8/25.
 */
var express = require('express'),
	corsMiddleware = require('cors'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	timeout = require('connect-timeout'),
	compression = require('compression'),
	responseTime = require('response-time'),
	expressBoom = require('express-boom'),
	passport = require('passport'),
	initRoute = require('./routes/index'),
	errorLogger = require('./middlewares/errorLogger'),
	errorHandler = require('./middlewares/errorHandler'),
	cacheControl = require('./middlewares/cacheControl'),
	requestInfo = require('./middlewares/requestInfo'),
	appConst = require('./utils/appConst'),
	config = require('./utils/appConfig'),
	logger = require('./utils/logger'),
	easyRouterFactory = require('./utils/easyRouter');

var server = express();
server.use((req, res, next) => {
	req.log = logger;
	next();
});
server.use(responseTime((req, res, time) => {
	var stat = (req.method + req.url).toLowerCase()
		.replace(/[:\.]/g, '')
		.replace(/\//g, '_');
	req.log.info('[response:' + res.statusCode + '] ' + stat + ' --- timing:' + time);
}));
server.use(timeout('30s'));

var corsOptions = {
	maxAge        : 10,
	exposedHeaders: [appConst.reqHeaderCount]
};
// if (process.env.NODE_DEBUG === 'true') {
//    corsOptions.allowedHeaders = config.corsAllowHeaders;
//    corsOptions.origin = config.corsUrls;
// }
server.use(corsMiddleware(corsOptions));
server.use(compression());
server.use(cookieParser());
server.use(function (req, res, next) {
	if (req.url.indexOf('/api/app/pay/wechat/callback') > 0) {
		req.headers['content-type'] = 'application/x-www-form-urlencoded';
	}
	next();
});
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.text({type: 'text/plain'}));
server.use(expressBoom());
server.use(passport.initialize());
server.use(cacheControl);
server.use(requestInfo.getUserInfo);
server.use(requestInfo.getVisitorInfo);

if (process.env.NODE_ENV !== 'production') {
	server.get('/hello', function (req, res, next) {
		res.send('hello world!');
	});
}

// server.get('/', function (req, res) {
// 	res.send('Hello World!');
// });
logger.info('loading route...');
var easyRouter = easyRouterFactory(server);
initRoute(easyRouter);

server.use(errorLogger);
server.use(errorHandler);
module.exports = server;