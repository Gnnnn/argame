console.info('app run with NODE_ENV:%s', process.env.NODE_ENV);
console.info('app run with NODE_DEBUG:%s', process.env.NODE_DEBUG);

var express = require('express'),
	path = require('path');

var PORT = 9000;

var app = new express();

if (process.env.NODE_DEBUG === 'true') {
	var webpack = require('webpack'),
		webpackDevMiddleware = require('webpack-dev-middleware'),
		webpackHotMiddleware = require('webpack-hot-middleware'),
		config = require('./webpack.config.server.js');
	var compiler = webpack(config);
	app.use(webpackDevMiddleware(compiler, {publicPath: '/static/', noInfo: true, stats: {colors: true}}));
	app.use(webpackHotMiddleware(compiler));
	app.use(express.static(path.resolve('public', 'www')));
	console.info('app serve with `%s`', 'public/www');
	app.get(/.*\.(css|js|eot|svg|ttf|woff|png|jpg)$/, express.static('public/www'));
	app.get('/*', (req, res) => {
		res.sendFile(path.resolve('public', 'www', 'index.html'));
	});
}
else {
	console.info('app serve with `%s`', 'build/client/www');
	app.get(/.*\.(css|js|eot|svg|ttf|woff|png|jpg)$/, express.static('build/client/www'));
	app.get('/*', (req, res) => {
		res.sendFile(path.resolve('build', 'client', 'www', 'index.html'));
	});
}

app.listen(PORT, function (error) {
	if (error) {
		console.error(error);
	}
	else {
		console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', PORT, PORT);
	}
});
