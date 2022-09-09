module.exports = function (grunt) {
    grunt.config.set('tinypng', {
        options: {
            apiKey: grunt.option('tiny-key'),
            showProgress: true,
            stopOnImageError: true,
            checkSigs: true,
            sigFile: 'sigs.json',
            summarize: true,
        },
        files: {
            src: ['**/*.{png,jpg,jpeg}'],
            cwd: './<%= config.source %>/images',
            dest: './<%= config.temp %>/images',
            expand: true,
        },
    });
};
