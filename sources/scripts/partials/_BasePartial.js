var Mn = require('backbone.marionette');
var $ = require('jquery');
var scope = require('scope');

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
    render: function () {
        var result = Mn.View.prototype.render.apply(this, arguments);

        for (var key in this._uiBindings) {
            this.ui[key].selector = this._uiBindings[key];
        }

        return result;
    },
    serializeData: function () {
        var self = this;
        var result = $.extend(
            {
                _regions: scope.regionsData,
                _name: self.name,
                _layout: self.getLayout().serializeData(),
                _parent: self._parent.serializeData(),
            },
            Mn.View.prototype.serializeData.call(self),
            self.options ? self.options.data : {},
            self.serviceData,
        );

        return result;
    },
    load: function () {
        var self = this;
        var defr = $.Deferred();

        defr.name = self.name;
        defr.type = 'partial-load';

        if (self.service) {
            self.callServiceBatch(self.service);
        }

        if (self.partials) {
            $.each(self.partials, function (key, partial) {
                var defrPartial = $.Deferred();

                defrPartial.name = self.name;
                defrPartial.subname = key;
                defrPartial.type = 'partial-child';

                partial.instance = new partial.partial(partial.options);
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
            });
        }

        $.when
            .apply($, self.callServiceList)
            .done(function () {
                defr.resolve(self);
            })
            .catch(function () {
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
        defrService.type = 'partial-service';

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

        //         data = service.convert ? service.convert(data) : data.data ? data.data : data;
        //         self.serviceData[slug] = scope.regionsData[self.name][slug] = service.scope ? data[service.scope] : data;

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
    serializeTemplate: function (data, context, insert) {
        var tpl = $(this.template(data));

        if (insert) {
            if (insert == 'append') {
                context.append(tpl.find(context.selector).html());
            }
        }
        if (insert == 'prepend') {
            context.prepend(tpl.find(context.selector).html());
        } else {
            context.html(tpl.find(context.selector).html());
        }

        delete tpl;
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
