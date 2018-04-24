var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var PATH_ROOT = path.resolve(__dirname);
var PATH_ENTRY = path.resolve(PATH_ROOT, 'public', 'js', 'app.js');
var PATH_DIST = path.resolve(PATH_ROOT, 'public', 'www');

module.exports = {
	entry  : PATH_ENTRY,
	output : {
		path    : path.resolve(PATH_DIST, 'js'),
		filename: 'app.js'
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"' + (process.env.NODE_ENV || 'production') + '"'
		}),
		new ExtractTextPlugin('app.css')
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
				test  : /\.css$/,
				loader: ExtractTextPlugin.extract('css!postcss')
			},
			{
				test  : /\.scss$/i,
				loader: ExtractTextPlugin.extract(['raw-loader', 'postcss-loader', 'sass-loader'])
			}
		]
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json'],
		alias     : {}
	}
};
