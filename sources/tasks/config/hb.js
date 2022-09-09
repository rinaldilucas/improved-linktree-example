module.exports = function (grunt) {
    var hb = require('../../scripts/libraries/hb');
    var env = require('../env');
    hb(grunt, grunt.option('lang'));

    grunt.config.set('hb', {
        options: {
            data: ['sources/scripts/data/**/*.json'],
            helpers: ['sources/scripts/helpers/*.js'],
            partials: ['sources/templates/**/*.hbs'],
        },
        watch: {
            options: {
                more: {
                    layout: 'layouts/skel',
                    cdn_url: './',
                },
            },
            files: [
                {
                    expand: true,
                    cwd: '<%= config.source %>/pages/',
                    src: '**/*.hbs',
                    dest: '<%= config.develop %>/',
                    ext: '.html',
                },
            ],
        },
        dist: {
            options: {
                bustCache: true,
                more: {
                    full: grunt.option('hml') ? env().url.hml : env().url.prod,
                    layout: 'layouts/skel',
                    version: '0.0.1',
                    cdn_url: './',
                    date: (function (d) {
                        return [d.getFullYear(), (d.getMonth() + 1 + '').padStart(2, '0'), d.getDate()].join('-');
                    })(new Date()),
                },
            },
            files: [
                {
                    expand: true,
                    cwd: '<%= config.source %>/pages/',
                    src: '**/*.hbs',
                    dest: '<%= config.dist %>',
                    ext: '.html',
                },
            ],
        },
    });
};
