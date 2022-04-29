var Mn = require('backbone.marionette');
var when = require('when');

var Helper = Mn.Object.extend({
    anchor: function (where) {
        var self = this;

        setTimeout(function () {
            var offtop = $(window).scrollTop();
            var discount = 0;

            discount = parseFloat($('.navigation').height());
            if (!$.isNumeric(discount)) {
                discount = 0;
            }

            if ($.isNumeric(where)) {
                offtop = where;
            } else {
                window.location.hash = where;

                where = where.replace(/[\'\"\/\<\>\!]/gim, '');
                var el = $(document.getElementById(where) || where);

                if (where == '#home' || where == '#destaque') {
                    $(window).scrollTo(1, 750, {
                        interrupt: self.isDesktop,
                        axis: 'y',
                    });

                    return;
                }
                if (el.data('anchor-scroll-align') === 'bottom') {
                    discount = (el.height() - Math.abs($(window).height())) * -1;
                }
                offtop = el.offset().top;
            }

            $(window).scrollTo(offtop - discount, 750, {
                interrupt: self.isDesktop,
                axis: 'y',
            });
        }, 20);
    },
    loadImage: function (src) {
        var deferred = when.defer(),
            img = document.createElement('img');

        img.onload = function () {
            deferred.resolve(img);
        };
        img.onerror = function () {
            deferred.reject(new Error('Image not found: ' + src));
        };
        img.src = src.src || src;

        return deferred.promise;
    },
    loadImages: function (srcs) {
        var deferreds = [];
        var self = this;

        for (var i = 0, len = srcs.length; i < len; i++) {
            deferreds.push(self.loadImage(srcs[i]));
        }

        return when.all(deferreds);
    },
});

module.exports = new Helper();
