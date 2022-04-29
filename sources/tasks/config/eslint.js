module.exports = function (grunt) {
    grunt.config.set('eslint', {
        options: {
            fix: true,
        },
        all: {
            src: ['<%= config.source %>/scripts/**/*.js'],
        },
        watch: {
            src: ['<%= config.changedFiles %>'],
        },
    });

    grunt.loadNpmTasks('grunt-eslint');
};
