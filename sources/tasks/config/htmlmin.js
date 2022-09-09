module.exports = function (grunt) {
    grunt.config.set('htmlmin', {
        dist: {
            options: {
                removeComments: true,
                collapseWhitespace: true,
            },
            files: [
                {
                    expand: true,
                    cwd: '<%= config.dist %>',
                    dest: '<%= config.dist %>',
                    src: ['**.html'],
                },
            ],
        },
    });
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
};
