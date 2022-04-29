module.exports = function (grunt) {
    grunt.config.set('copy', {
        dist: {
            files: [
                // root files
                {
                    expand: true,
                    cwd: '<%= config.source %>',
                    dest: '<%= config.dist %>',
                    src: ['CNAME'],
                },
                // fonts
                {
                    expand: true,
                    dot: true,
                    cwd: '<%= config.source %>/fonts',
                    dest: '<%= config.dist %>/assets/fonts',
                    src: '**/*.{eot,svg,ttf,woff,woff2}',
                },
                // images
                {
                    expand: true,
                    cwd: '<%= config.temp %>/images',
                    dest: '<%= config.dist %>/assets/images',
                    src: '**/*.{ico,png,jpg,jpeg,svg,gif,png.webp,jpg.webp,jpeg.webp,svg.webp,webp}',
                },
                // videos
                {
                    expand: true,
                    cwd: '<%= config.source %>/videos',
                    dest: '<%= config.dist %>/assets/videos',
                    src: '**/*.{mp4,avi}',
                },
            ],
        },
        dev: {
            files: [
                // root files
                {
                    expand: true,
                    cwd: '<%= config.source %>',
                    dest: '<%= config.develop %>',
                    src: ['CNAME'],
                },
                // fonts
                {
                    expand: true,
                    dot: true,
                    cwd: '<%= config.source %>/fonts',
                    dest: '<%= config.develop %>/assets/fonts',
                    src: '**/*.{eot,svg,ttf,woff,woff2}',
                },
                // videos
                {
                    expand: true,
                    cwd: '<%= config.source %>/videos',
                    dest: '<%= config.develop %>/assets/videos',
                    src: '**/*.{mp4,avi}',
                },
            ],
        },
    });
};
