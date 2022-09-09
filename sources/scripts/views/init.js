var Init = function () {
    var Layout = require('views/_Layout');

    this.layout = new Layout();
    this.layout.triggerMethod('attach');
};

module.exports = Init;
