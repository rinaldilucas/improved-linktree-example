var PROJECT = (window.PROJECT = window.PROJECT || {});

(function (scope) {
    'use strict';

    var base = document.getElementById('base-id');

    base = base.href.split(location.host).pop();
    scope.config = {
        urls: {
            base: base,
            origin: location.protocol + '//' + location.hostname,
            site: location.href.replace('index.html', ''),
        },
    };
})(PROJECT);

var scope = require('scope');

scope.$ = require('jquery');

scope.regionsData = {};

scope.setvars = function (vars) {
    scope.vars = vars;
};

scope.app = require('app');
scope.app.on('start', require('./views/Init'));
scope.app.on('start', require('./routes/Init'));

scope.app.start();
