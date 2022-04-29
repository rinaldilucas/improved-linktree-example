var data = require('../../../data.json');
var Base = require('./_BaseView');

View = Base.extend({
    template: require('templates/pages/home.hbs'),
    templateContext: {
        infos: data,
    },
    name: 'home',
    behaviors: {},
    ui: {},
    events: {},
    onAttach: function () {},
});
module.exports = View;
