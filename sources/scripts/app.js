var Mn = require('backbone.marionette');
var $ = (window.jq = require('jquery'));
var helper = require('./libraries/helpers');
var $win = $(window);
var scope = require('scope');

var Application = Mn.Application.extend({
    el: function () {
        return this.layout.$el.find('#content');
    },
    go: function (view) {
        var self = this;

        this.layout.go(view, function () {
            self.sections = $('section[data-anchor-scroll]');
        });
    },
    anchor: function (where) {
        helper.anchor(where);
    },
    onStart: function () {
        var self = this;
        var imageSrcArray = $(document.images).not('[data-bypass-load-image]');

        $('body').addClass('on-loading');

        helper
            .loadImages(imageSrcArray)
            .then(function gotEm (imageArray) {
                return imageArray.length;
            })
            .then(function shout () {
                var hash = document.location.hash;

                if (hash) {
                    $(window).scrollTop(0);
                    self.anchor(hash);
                }
                setTimeout(function () {
                    self.loaded = true;
                }, 1000);
            });

        $win.scroll(function () {
            var top = typeof window.scrollY === 'undefined' ? window.pageYOffset : window.scrollY;

            self.trigger('scroll', {
                top: top,
                width: $win.width(),
                height: $win.height(),
            });
        })
            .resize(function () {
                var top = typeof window.scrollY === 'undefined' ? window.pageYOffset : window.scrollY;

                self.trigger('resize', {
                    top: top,
                    width: $win.width(),
                    height: $win.height(),
                });
            })
            .mousemove(function (e) {
                self.trigger('mousemove', {
                    left: e.pageX,
                    top: e.pageY,
                });
            })
            .mousemove(function (e) {
                self.trigger('mousemove', {
                    left: e.pageX,
                    top: e.pageY,
                });
            })
            .keydown(function () {
                switch (event.key) {
                    case 'Escape':
                        self.trigger('esc');
                        break;
                    default:
                }
            });
        $(document)
            .on('mouseup', function () {
                self.trigger('mouseup');
            })
            .on('mousemove', function (e) {
                self.trigger('mousemove', {
                    left: e.pageX,
                    top: e.pageY,
                });
            })
            .on('touchend', function () {
                self.trigger('touchend');
            })
            .on('touchmove', function (e) {
                self.trigger('touchmove', {
                    left: e.touches[0].pageX,
                    top: e.touches[0].pageY,
                });
            });
    },
    initialize: function () {
        this.sections = $('section[data-anchor-scroll]');
        var self = this,
            last = false;

        $.fn.shuffle = function () {
            var j;

            for (var i = 0; i < this.length; i++) {
                j = Math.floor(Math.random() * this.length);
                $(this[i]).before($(this[j]));
            }

            return this;
        };

        $(window)
            .scroll(function () {
                var top = typeof window.scrollY === 'undefined' ? window.pageYOffset : window.scrollY,
                    current;

                self.trigger('scroll', {
                    top: top,
                });
                windowHeight = $(window).height();
                windowWidth = $(window).width();

                for (var i = 0; i < self.sections.length; i++) {
                    var el = (computed = $(self.sections[i]));

                    if (el.attr('data-anchor-computed')) {
                        computed = el.find(el.attr('data-anchor-computed'));
                    }

                    var eltop = el.position().top;

                    if (eltop - top <= $(window).height() / 4) {
                        current = el;
                    }

                    if (el.hasClass('has-parallax')) {
                        var navHeight = $('.navigation').innerHeight();
                        var sectionTopOnScreen = eltop + navHeight - top - windowHeight;
                        var sectionBottomOnTopScreen = eltop + windowHeight - (top + navHeight);

                        if (sectionTopOnScreen <= 0 && sectionBottomOnTopScreen >= 0) {
                            var toTranslate = ((sectionTopOnScreen + windowHeight) / windowHeight) * 100;

                            toTranslate = 100 - toTranslate;

                            if (toTranslate >= 200) {
                                toTranslate = 200;
                            } else if (toTranslate <= 0) {
                                toTranslate = 0;
                            }

                            el.find('[data-parallax]').css({
                                transform: 'translateY(' + toTranslate * 0.3 + '%)',
                            });
                        }
                    }
                }

                var toAnimate = $('[data-to-animate]');

                for (i = 0; i < toAnimate.length; i++) {
                    el = $(toAnimate[i]);

                    var offset = typeof el.data('animate-offset') !== 'undefined' ? (Number(el.data('animate-offset')) / 100) * windowHeight : 0;
                    var dataOffsetMobile = typeof el.data('animate-offset-mobile') !== 'undefined' ? (Number(el.data('animate-offset-mobile')) / 100) * windowHeight : 0;

                    if (windowWidth <= 1000) {
                        offset = dataOffsetMobile !== 0 ? dataOffsetMobile : offset;
                    }

                    eltop = el.offset().top + offset;

                    var defineAnimated = function (el) {
                        el.addClass('animated');
                        el.trigger('animated');
                    };

                    if (eltop - (top + windowHeight * 0.8) <= 0) {
                        if (!el.hasClass('animate')) {
                            el.addClass('animate');
                            el.removeAttr('data-to-animate');

                            setTimeout(defineAnimated.bind(null, el), Number(el.data('animate-time')) || 1000);
                        }
                    }
                }

                if (current && current.attr('data-anchor-scroll') && current.attr('data-anchor-scroll') !== last) {
                    last = current.attr('data-anchor-scroll');

                    scope.now = window.location.pathname.replace(/\//g, '');
                    if (scope.now === '') {
                        scope.now = undefined;
                    } else {
                        scope.now = '/' + scope.now + '/';
                    }

                    if (last === '' || last === '/' || last === '#' || last === '#!') {
                        if (history.pushState) {
                            history.pushState(null, null, (scope.now || '') + location.search);
                        }
                    } else if (history.pushState) {
                        history.pushState(null, null, (scope.now || '') + '#' + last.replace('/', '').replace('#!', '').replace('#', '') + location.search);
                    }
                }
            })
            .resize(function () {
                var top = typeof window.scrollY === 'undefined' ? window.pageYOffset : window.scrollY;

                self.trigger('resize', {
                    top: top,
                    width: $(window).width(),
                    height: $(window).height(),
                });
            });
    },
});

module.exports = new Application();
