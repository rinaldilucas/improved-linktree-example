var Base = require('views/_BaseView');
var scope = require('scope');
var first = true;

var Layout = Base.extend({
    name: 'layout',
    el: '#main',
    events: {},
    behaviors: {},
    ui: {
        loader: '#preloader',
    },
    partials: {
        content: {
            region: '#site-content',
        },
        footer: {
            region: '#site-footer',
            partial: require('../partials/Footer'),
        },
    },
    initialize: function () {
        var self = this;
        var last = null;

        self.getRegion('content').on('show', function (view) {
            !first && $('body').addClass('page-changed');
            $('body')
                .removeClass(last)
                .addClass((last = view.name));

            $(document).ready(function () {
                $('iframe').ready(function () {
                    setTimeout(function () {
                        first = false;
                        $('body').removeClass('page-changed');

                        $('body').removeClass('on-loading');
                        $('body').addClass('on-loaded');
                        $('.loading').addClass('loaded');
                    }, 500);
                });
            });
        });
    },
    go: function (view, cb) {
        var self = this;

        self.partials.content.instance = view;

        $('body').addClass('on-loading');

        self.load()
            .done(function (response) {
                if (response.error) {
                    return Backbone.history.navigate('error', {
                        trigger: true,
                    });
                }
                self.populate();
                scope.app.started = true;

                cb && cb();
            })
            .catch(function () {
                cb && cb();
            });
    },
});

module.exports = Layout;
