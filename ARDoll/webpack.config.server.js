var path = require('path');
var webpack = require('webpack');

var PATH_ROOT = path.resolve(__dirname);
var PATH_ENTRY = path.resolve(PATH_ROOT, 'public', 'js', 'app.js');

module.exports = {
	devtool: 'cheap-module-eval-source-map',
	entry  : [
		'webpack-hot-middleware/client',
		'webpack/hot/only-dev-server',
		PATH_ENTRY
	],
	output : {
		path      : '/',
		filename  : 'app.js',
		publicPath: '/static/'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"' + (process.env.NODE_ENV || 'development') + '"'
		})
	],
	module : {
		loaders: [
			{
				test   : /\.jsx?$/,
				loaders: ['babel-loader'],
				exclude: /node_modules/,
				include: path.resolve(PATH_ROOT, 'public')
			},
			{
				test   : /\.json$/,
				loader : 'json-loader',
				exclude: /node_modules/,
				include: path.resolve(PATH_ROOT, 'public')
			},
			{
				test   : /\.css$/,
				loaders: ['style-loader', 'css-loader', 'postcss-loader']
			},
			{
				test   : /\.scss$/i,
				loaders: ['style-loader', 'raw-loader', 'postcss-loader', 'sass-loader']
			}
		]
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json'],
		alias     : {}
	}
};
