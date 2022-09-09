var helpers = require('../libraries/helpers');
var Backbone = require('backbone');
var scope = require('scope');
var Uri = require('urijs');

var Init = function () {
    var Route = require('./Main');
    var root = (this.root = new Uri($('#base-id').get(0).href));

    new Route();

    Backbone.history.start({
        pushState: true,
        hashChange: false,
        root: root.pathname(),
    });

    var navigate = function (url, replace, noAnchor) {
        url = url.replace('./', '');

        var full = root.toString();
        var fragment = url + '/' === full ? '' : url.replace(full, '');
        var parts = fragment.split('#');
        var matchs = Backbone.history.navigate(parts[0], {
            trigger: true,
            replace: replace,
        });

        if (parts[1]) {
            window.history.replaceState({}, document.title, url);
            !noAnchor && helpers.anchor('#' + parts[1]);
        } else if (window.location.href.indexOf('#') > -1) {
            var uri = window.location.href.substr(0, window.location.href.indexOf('#'));

            window.history.replaceState({}, document.title, uri);
            !noAnchor && helpers.anchor(0);
        } else if (typeof matchs === 'undefined') {
            !noAnchor && helpers.anchor(0);
        } else {
            !noAnchor && helpers.anchor(0);
        }

        scope.app.trigger('routed');
    };

    scope.app.navigate = navigate;

    $('#main').on('click', 'a:not([data-bypass])', function (event) {
        var link = event.currentTarget;

        if (link.tagName.toUpperCase() !== 'A') {
            return;
        }
        if (link.target === '_blank') {
            return;
        }
        if (event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }
        if (location.protocol !== link.protocol || location.hostname !== link.hostname) {
            return;
        }
        if (event.isDefaultPrevented()) {
            return;
        }

        event.preventDefault();

        setTimeout(function () {
            navigate(link.href);
        }, 1);
    });
};

module.exports = Init;
