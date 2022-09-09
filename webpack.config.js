'use strict';

var path = require('path');
var webpack = require('webpack');
var MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
	cache: true,
	entry: {
		main: path.resolve(__dirname, 'sources', 'scripts', 'main.js'),
	},
	output: {
		path: path.resolve(__dirname, 'develop', 'assets'),
		filename: 'scripts/[name].js',
		publicPath: './assets/',
	},
	resolve: {
		alias: {
			data: path.resolve(__dirname, 'sources', 'scripts', 'data'),
			main: path.resolve(__dirname, 'sources', 'scripts', 'main'),
			views: path.resolve(__dirname, 'sources', 'scripts', 'views'),
			app: path.resolve(__dirname, 'sources', 'scripts', 'app'),
			scope: path.resolve(__dirname, 'sources', 'scripts', 'scope'),
			templates: path.resolve(__dirname, 'sources', 'templates'),
		},
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
		}),
		new MomentLocalesPlugin(),
	],
	module: {
		loaders: [
			{
				test: /\.json$/,
				loader: 'json-loader',
			},
			{
				test: /\.hbs/,
				loader: 'handlebars-loader',
				query: {
					helperDirs: [path.resolve(__dirname, 'sources', 'scripts', 'helpers')],
					partialDirs: [path.resolve(__dirname, 'sources', 'templates')],
				},
			},
		],
	},
};
