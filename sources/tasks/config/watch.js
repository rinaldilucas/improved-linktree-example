module.exports = function (grunt) {
    grunt.config.set('watch', {
        sass: {
            files: ['<%= config.source %>/styles/**'],
            tasks: ['sass:watch', 'autoprefixer:dev'],
            options: {
                atBegin: true,
            },
        },
        html: {
            files: ['<%= config.source %>/templates/**', '<%= config.source %>/pages/**', '<%= config.source %>/elements/**', '<%= config.source %>/scripts/data/**'],
            tasks: ['hb:watch'],
            options: {
                atBegin: true,
            },
        },
        static: {
            files: ['<%= config.source %>/scripts/data/**'],
            tasks: ['copy:dev'],
            options: {
                atBegin: true,
            },
        },
        scripts: {
            files: ['<%= config.source %>/scripts/libraries/**'],
            tasks: ['copy:dev'],
            options: {
                atBegin: true,
            },
        },
        eslint: {
            files: ['<%= config.source %>/scripts/**/*.js'],
            tasks: ['eslint:watch'],
            options: {
                spawn: false,
            },
        },
    });
};
