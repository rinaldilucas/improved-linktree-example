var Mn = require('backbone.marionette');
var $ = require('jquery');
var defaultJSON = require('../../../data.json');

var View = Mn.View.extend({
    name: 'no-name',
    constructor: function () {
        this.serviceData = {};
        this.callServiceList = [];

        if (this.partials) {
            this.regions = this.regions || {};

            for (var key in this.partials) {
                this.regions[key] = this.partials[key].region;
            }
        }

        return Mn.View.prototype.constructor.apply(this, arguments);
    },
    serializeData: function () {
        var data = {
            cdn_url: './',
        };

        if (process.env.NODE_ENV === 'production') {
            data.cdn_url = './';
        }

        data.data = defaultJSON;

        return $.extend(data, Mn.View.prototype.serializeData.call(this), this.options.data);
    },
    load: function () {
        var self = this;
        var defr = $.Deferred();

        defr.name = self.name;
        defr.type = 'page-load';

        if (self.service) {
            self.callServiceBatch(self.service);
        }

        if (self.partials) {
            $.each(self.partials, function (key, partial) {
                var defrPartial = $.Deferred();

                defrPartial.name = self.name;
                defrPartial.subname = key;
                defrPartial.type = 'page-child';

                if (partial.partial) {
                    partial.instance = new partial.partial(partial.options);
                }

                if (partial.instance) {
                    partial.instance._parent = self;
                    self.callServiceList.push(defrPartial);

                    partial.instance
                        .load()
                        .done(function () {
                            setTimeout(function () {
                                defrPartial.resolve();
                            }, 100);
                        })
                        .catch(function () {
                            defrPartial.reject();
                        });
                }
            });
        }

        $.when
            .apply($, self.callServiceList)
            .done(function () {
                defr.resolve(self);
            })
            .catch(function (e) {
                defr.reject();
            });

        return defr;
    },
    populate: function () {
        var self = this;

        $.each(self.partials, function (key, partial) {
            var view = partial.instance;

            view.populate();
            self.getRegion(key).show(view);
        });
    },
    reload: function () {
        var self = this;

        return self.load().done(function () {
            self.render();
        });
    },
    callServiceBatch: function (services) {
        var self = this;

        return $.each(services, function (key, values) {
            self.callServiceList.push(
                self.callServiceAdd(
                    $.extend(
                        {
                            name: key,
                        },
                        values,
                    ),
                ),
            );
        });
    },
    callServiceAdd: function (service) {
        var self = this;
        var slug = service.name || self.name;
        var defrService = $.Deferred();

        defrService.name = slug;
        defrService.type = 'page-service';

        // var request = $.ajax(service)
        //     .done(function(data) {
        //         data = data || {};

        //         try {
        //             if (self.getLayout().getPartials('content')[0].instance.checkauth) {
        //                 if (data.errors && data.errors[0].code === '-1') {
        //                     defrService.reject(data.errors[0]);

        //                     return;
        //                 }
        //             }
        //         } catch (e) {}

        //         if (!scope.regionsData[self.name]) {
        //             scope.regionsData[self.name] = {};
        //         }

        //         self.serviceData[slug] = scope.regionsData[self.name][slug] = service.scope ? data[service.scope] : data.data ? data.data : data;

        //         if (service.scope) {
        //             delete data[service.scope];
        //             self.serviceData[slug] = $.extend(self.serviceData[slug], data);
        //         }

        //         self.trigger(slug + '.onComplete', true, data);

        //         defrService.resolve(data);
        //     })
        //     .catch(function(e) {
        //         self.serviceData[slug] = null;
        //         self.trigger(slug + '.onComplete', false, e);
        //         defrService.reject();
        //     });

        return defrService;
    },
    onAttach: function () {},
    getLayout: function () {
        if (this._parent) {
            return this._parent.getLayout();
        }

        return this;
    },
    getPartials: function (name) {
        var self = this;
        var result = [];

        $.each(self.partials, function (key, partial) {
            if (key == name) {
                result.push(partial);
            } else {
                result = result.concat(partial.instance.getPartials(name));
            }
        });

        return result;
    },
});

module.exports = View;
