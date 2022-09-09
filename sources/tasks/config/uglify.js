module.exports = function (grunt) {
    grunt.config.set('uglify', {
        options: {
            removeComments: true,
            collapseWhitespace: true,
        },
        target: {
            files: [
                {
                    expand: true,
                    cwd: '<%= config.source %>/js',
                    src: ['src/**/*.js', '*.js'],
                    dest: '<%= config.dist %>/js',
                },
            ],
        },
    });
};
