module.exports = function (grunt) {
    grunt.config.set('autoprefixer', {
        options: {
            browsers: ['last 2 versions', 'ie 10'],
        },
        dev: {
            files: {
                '<%= config.develop %>/assets/styles/main.css': '<%= config.develop %>/assets/styles/main.css',
            },
        },
        dist: {
            files: {
                '<%= config.dist %>/assets/styles/main.css': '<%= config.dist %>/assets/styles/main.css',
            },
        },
    });
};
