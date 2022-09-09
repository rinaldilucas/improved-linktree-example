module.exports = function (grunt) {
    grunt.config.set('clean', {
        dist: {
            files: [
                {
                    dot: true,
                    src: '<%= config.dist %>',
                },
            ],
        },
    });
};
