var env = require('../env');

module.exports = function (grunt) {
    var UglifyJsPlugin = require('uglifyjs-3-webpack-plugin');
    var webpack = require('webpack');
    var webpackConfig = require('../../../webpack.config.js');

    grunt.config.set('webpack', {
        options: webpackConfig,
        build: {
            output: {
                path: require('path').resolve(__dirname, '../../../' + env().dist + '/assets'),
            },
            devtool: 'sourcemap',
            plugins: webpackConfig.plugins.concat(
                new webpack.DefinePlugin({
                    'process.env': {
                        NODE_ENV: JSON.stringify('production'),
                    },
                }),
                new UglifyJsPlugin({
                    uglifyOptions: {
                        mangle: true,
                        warnings: false,
                        compress: {
                            pure_getters: true,
                            unsafe: true,
                            unsafe_comps: true,
                        },
                        output: {
                            comments: false,
                        },
                    },
                }),
            ),
        },
        watch: {
            progress: true,
            devtool: 'sourcemap',
            failOnError: false,
            watch: true,
            keepalive: true,
        },
    });
};
