var _ = require('lodash'),
	gulp = require('gulp'),
	plugin = require('gulp-load-plugins')(),
	runSequence = require('gulp-run-sequence'),
	del = require('del'),
	through = require('through2'),
	webpack = require('webpack-stream'),
	webpackConfig = require('./webpack.config');

var paths = {
	server: {
		apijs: 'app/',
		js   : 'app/**/*.js',
		doc  : 'build/server/doc/'
	},
	client: {
		html   : 'public/www/index.html',
		js     : 'public/js/**/*.js*',
		appjs  : 'public/js/app.js',
		sass   : {
			app  : 'public/css/index.scss',
			watch: 'public/css/**/*.scss'
		},
		dest   : {
			www: 'public/www/**',
			lib: 'public/www/lib',
			js : 'public/www/js',
			css: 'public/www/css'
		},
		release: {
			www: 'build/client',
			js : 'build/client/www/js',
			css: 'build/client/www/css'
		}
	}
};

gulp.task('webpack', function () {
	var webpackPipe = gulp.src(paths.client.appjs)
		.pipe(webpack(webpackConfig));

	// js
	webpackPipe
		.pipe(through.obj(function (file, enc, callback) {
			var isJS = /\.js$/.test(file.path);
			if (isJS) {
				this.push(file);
			}
			callback();
		}))
		.pipe(gulp.dest(paths.client.dest.js))
		.pipe(plugin.uglify())
		.pipe(plugin.rename('app.min.js'))
		.pipe(gulp.dest(paths.client.dest.js));

	//css
	return webpackPipe
		.pipe(through.obj(function (file, enc, callback) {
			var isJS = /\.css$/.test(file.path);
			if (isJS) {
				this.push(file);
			}
			callback();
		}))
		.pipe(gulp.dest(paths.client.dest.css))
		.pipe(plugin.cssnano())
		.pipe(plugin.rename('app.min.css'))
		.pipe(gulp.dest(paths.client.dest.css));
});

gulp.task('clean', function () {
	del.sync('build/');
	del.sync(paths.client.dest.lib);
	del.sync(paths.client.dest.js);
	del.sync(paths.client.dest.css);
});

gulp.task('eslint', function () {
	return gulp.src([paths.server.js, paths.client.js])
		.pipe(plugin.eslint())
		.pipe(plugin.eslint.format())
		.pipe(plugin.eslint.failAfterError());
});

gulp.task('removeUnMin', function () {
	del.sync(paths.client.release.js + '/app.js');
	del.sync(paths.client.release.css + '/app.css');
});

gulp.task('releaseCp', function () {
	return gulp.src(paths.client.dest.www)
		.pipe(plugin.copy(paths.client.release.www, {prefix: 1}));
});

gulp.task('rev', function () {
	var pathWWW = paths.client.release.www + '/www';
	del.sync(pathWWW + '/**/{app-*.js,app-*.css}');

	return gulp.src([paths.client.release.css + '/*.css',
	          paths.client.release.js + '/*.js'],
		{base: pathWWW})
		.pipe(plugin.rev())
		.pipe(gulp.dest(pathWWW))
		.pipe(plugin.rev.manifest())
		.pipe(gulp.dest(pathWWW));
});

gulp.task('parseHTML', function () {
	var productOption = {
		js : '/js/app.min.js',
		css: '/css/app.min.css'
	};
	var developOption = {
		js : '/js/app.js',
		css: '/css/app.css'
	};
	var option;
// 	if (argv && (argv.env || 'production') === 'production') {
	option = productOption;
// 	}
// 	else {
// 		option = developOption;
// 	}

	option.html = '<html class = "no-js">';

	return gulp.src(paths.client.html)
		.pipe(plugin.htmlReplace(option))
		.pipe(plugin.revReplace({manifest: gulp.src(paths.client.release.www + '/www/rev-manifest.json')}))
		.pipe(gulp.dest(paths.client.release.www + '/www'));
});

gulp.task('mochaTest', function () {
	return gulp.src('app/test/api/*.test.js', {read: false})
		.pipe(plugin.mocha({reporter: 'spec'}));
});

gulp.task('release', function (callback) {
	runSequence('clean', ['webpack'], 'releaseCp', 'removeUnMin', 'rev', 'parseHTML', callback);
});