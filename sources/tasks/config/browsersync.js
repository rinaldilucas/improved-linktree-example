var env = require('../env');

module.exports = function (grunt) {
    var url = require('url');
    var proxy = require('proxy-middleware');
    var proxyOptions = url.parse(env().base + 'oauth');
    proxyOptions.route = '/oauth';

    grunt.config.set('browserSync', {
        dev: {
            bsFiles: {
                src: ['develop/assets/styles/*.css', 'develop/assets/scripts/*.js', 'develop/*.html', 'sources/images/*.**'],
            },
            options: {
                watchTask: true,
                server: '<%= config.develop %>',
                https: false,
                middleware: [proxy(proxyOptions)],
            },
        },
    });
};
