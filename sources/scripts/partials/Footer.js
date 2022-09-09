var data = require('../../../data.json');
var Base = require('./_BasePartial');

View = Base.extend({
    name: 'footer',
    template: require('templates/elements/footer.hbs'),
    templateContext: {
        infos: data,
    },
    events: {},
    onAttach: function () {},
});
module.exports = View;
