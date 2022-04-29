module.exports = function (grunt) {
    grunt.config.set('cssmin', {
        dist: {
            options: {
                level: {
                    1: {
                        specialComments: 0,
                    },
                },
            },
            files: [
                {
                    '<%= config.dist %>/assets/styles/main.css': '<%= config.dist %>/assets/styles/main.css',
                    '<%= config.dist %>/assets/styles/fonts.css': '<%= config.dist %>/assets/styles/fonts.css',
                },
            ],
        },
    });
    grunt.loadNpmTasks('grunt-contrib-cssmin');
};
