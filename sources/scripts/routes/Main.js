var Mn = require('backbone.marionette');
var scope = require('scope');

module.exports = Mn.AppRouter.extend({
    routes: {
        '(/)(index.html)': 'index',
    },
    index: function () {
        var View = require('views/Home');

        scope.setvars({});
        scope.app.go(new View());
    },
});
