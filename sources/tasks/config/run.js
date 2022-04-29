module.exports = function (grunt) {
    grunt.config.set('run', {
        image: {
            exec: 'npm run sync',
        },
    });
};
