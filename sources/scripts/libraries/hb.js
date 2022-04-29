module.exports = function (grunt) {
    var hb = require('gulp-hb');
    var path = require('path');
    var defaults = require('../../../data.json');
    var rename = require('gulp-rename');
    var vinylFs = require('vinyl-fs');

    grunt.registerMultiTask('hb', 'Renders Handlebars templates to static HTML.', function () {
        var done;
        var options = this.options();
        var files = this.files;
        var count = files.length;

        var fail = function (err) {
            grunt.log.error(err);
            done(false);
        };

        var success = function () {
            if (--count === 0) {
                done(true);
            }
        };

        var process = function (file) {
            var dest = file.dest,
                dirname = path.dirname(dest),
                basename = path.basename(dest);

            vinylFs
                .src(file.src)
                .pipe(
                    hb(options)
                        .helpers(require('handlebars-layouts'))
                        .data(options.more || {})
                        .data(defaults),
                )
                .pipe(rename(basename))
                .pipe(vinylFs.dest(dirname))
                .on('error', fail)
                .on('finish', success);
        };

        if (count) {
            done = this.async();
            files.forEach(process);
        }
    });
};
