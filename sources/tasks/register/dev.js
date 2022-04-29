module.exports = function (grunt) {
    grunt.registerTask(
        'dev', //
        [
            'browserSync:dev', //
            'concurrent:dev',
        ],
    );
};
