module.exports = function (grunt) {
    grunt.registerTask(
        'build', //
        [
            'eslint:all', //
            'clean:dist', //
            'webpack:build',
            'sass:dist',
            'cssmin',
            'autoprefixer:dist',
            'tinypng',
            'imagemin:webp',
            'copy:dist',
            'hb:dist',
            'htmlmin',
        ],
    );
};
