var $ = require('jquery');
var _ = require('underscore');

var eventMap = {};

var duplicateFix = false;

var Metrics = function () {
    var self = this;
    var preventDuplicate = [];
    var sections = $([]);
    var ignoreduplicate;
    var nowpage;
    var scrollMetric = {};
    var lastRadioChecked = null;
    var stopScroll = false;
    var queues = {
        omni: [],
    };

    var version = '';

    if (/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)) {
        version = 'mobile:';
    }

    var parseVars = function (str, vars) {
        if (vars) {
            vars = String(vars);
            vars = vars.split(',');

            for (var x = 0; x < vars.length; x++) {
                str = str.replace('%' + x + '%', vars[x]);
            }
        }

        return str;
    };

    var event = function (event, vars, type) {
        if (duplicateFix === event) {
            return;
        }
        duplicateFix = event;

        setTimeout(function () {
            duplicateFix = false;
        }, 10);

        if (!eventMap[event]) {
            console.warn(event + ', event map not exist.');

            return;
        }

        if (window.s_gi) {
            if (eventMap[event] && eventMap[event].omni) {
                var s = s_gi('sssamsung4br,sssamsung4mstglobal');

                s.linkTrackVars = 'eVar33,events';
                s.linkTrackEvents = 'event45';
                s.events = 'event45';
                s.eVar33 = 'br:campaign:seda:' + defCampaignName + ':' + parseVars(eventMap[event].omni, vars);
                s.eVar46 = '';
                s.eVar30 = '';

                s.tl(this, 'o', 'br:campaign:seda:' + defCampaignName + ':' + parseVars(eventMap[event].omni, vars));
            }
        } else {
            queues.omni.push(event);

            return;
        }

        if (eventMap[event] && eventMap[event].conversion) {
            gtag('event', 'conversion', {
                send_to: eventMap[event].conversion,
                event_callback: function () {},
            });
        }

        if (eventMap[event] && eventMap[event].fbq) {
            if (_.isString(eventMap[event].fbq)) {
                fbq('track', eventMap[event].fbq);
            } else {
                fbq('track', eventMap[event].fbq.name, eventMap[event].fbq.props);
            }
        }
    };

    var pageview = function (page) {
        nowpage = page;
        $(window).scroll();
        var now = page;

        if (now == ignoreduplicate) {
            return;
        }

        ignoreduplicate = now;

        if (window.s_gi) {
            var s = s_gi('sssamsung4br,sssamsung4mstglobal');

            delete s.events;
            delete s.eVar33;

            s.pageName = 'br:campaign:seda:' + defCampaignName + ':' + page;
            s.hier1 = 'br>campaign>seda>' + defCampaignName + '>' + page;
            s.channel = 'br:campaign';
            s.prop1 = 'br';
            s.prop2 = 'br:campaign';
            s.prop3 = 'br:campaign:seda';
            s.prop4 = 'br:campaign:seda:' + defCampaignName;
            s.prop5 = 'br:campaign:seda:' + defCampaignName + ':' + page;

            var s_code = s.t();

            if (s_code) {
                document.write(s_code);
            }
        }
    };

    this.event = event;

    $(document).on('change', 'input[data-metrics-change],textarea[data-metrics-change],select[data-metrics-change]', function (e) {
        var ev = $(e.currentTarget).attr('data-metrics');

        if (ev) {
            event(ev, $(e.currentTarget, e).attr('data-metrics-vars'), e);
        }
    });

    $(document).on('mouseenter', '[data-metrics-hover]', function (e) {
        var ev = $(e.currentTarget).data('metrics');

        if (ev) {
            event(ev, $(e.currentTarget).data('metrics-vars'));
        }
    });

    $(document).on('change', 'input[type="checkbox"][data-metrics-check],input[type="radio"][data-metrics-check]', function (e) {
        var ev = $(e.currentTarget).attr('data-metrics-check');

        if (ev) {
            if ($(e.currentTarget).is('input[type="radio"]')) {
                var ev2 = $(e.currentTarget).attr('data-metrics-uncheck');

                if (lastRadioChecked) {
                    event(ev2, $(lastRadioChecked, e).attr('data-metrics-uncheck-vars'), e);
                    event(ev, $(e.currentTarget, e).attr('data-metrics-check-vars'), e);
                } else {
                    event(ev, $(e.currentTarget, e).attr('data-metrics-check-vars'), e);
                    lastRadioChecked = $(e.currentTarget);
                }
            } else if ($(e.currentTarget).is(':checked')) {
                event(ev, $(e.currentTarget, e).attr('data-metrics-check-vars'), e);
            } else {
                event(ev, $(e.currentTarget, e).attr('data-metrics-uncheck-vars'), e);
            }
        }
    });

    this.initSections = function () {
        sections = $('[data-metric-scroll]');
        stopScroll = false;
    };

    this.stopScroll = function () {
        stopScroll = true;
    };

    this.resumeScroll = function () {
        self.startScroll(null);
    };

    this.startScroll = function (fragment) {
        stopScroll = false;
        var section = $((fragment || window.location.hash).replace('!', ''));
        var metric = section.data('metric-scroll');
        var vars = section.data('metrics-vars');

        if (metric && !$(section).data('fired') && $.inArray(metric + '+' + vars, preventDuplicate) == -1) {
            event(metric, vars);
            $(section).data('fired', true);
            preventDuplicate.push(metric + '+' + vars);
        }
    };

    this.eventScroll = function (metric, vars) {
        if (metric && $.inArray(metric + '+' + vars, preventDuplicate) == -1) {
            event(metric, vars);
            preventDuplicate.push(metric + '+' + vars);
        }
    };

    $(window).on('scroll', function () {
        var lastEl = null;
        var lastPos = null;

        if (!stopScroll && nowpage) {
            for (var i = 0; i < sections.length; i++) {
                var el = $(sections[i]);

                if (el.css('display') !== 'none' && el.offset().top - $(window).scrollTop() < 0) {
                    lastEl = el;
                    lastPos = i;
                }
            }

            var nowPercentage = ($(window).scrollTop() + $(window).height()) / $(document).height();

            if (nowPercentage) {
                if (!scrollMetric[25] && nowPercentage > 0.25) {
                    scrollMetric[25] = true;
                    event('scrollPercentage', nowpage + ',25', 46);
                } else if (!scrollMetric[50] && nowPercentage > 0.5) {
                    scrollMetric[50] = true;
                    event('scrollPercentage', nowpage + ',50', 46);
                } else if (!scrollMetric[75] && nowPercentage > 0.75) {
                    scrollMetric[75] = true;
                    event('scrollPercentage', nowpage + ',75', 46);
                } else if (!scrollMetric[100] && nowPercentage > 0.99) {
                    scrollMetric[100] = true;
                    event('scrollPercentage', nowpage + ',100', 46);
                }
            }

            if (lastEl) {
                var vars = lastEl.data('metrics-vars');
                var metric = lastEl.data('metric-scroll');

                if (!$(sections[lastPos]).data('fired') && $.inArray(metric + '+' + vars, preventDuplicate) == -1) {
                    $(sections[lastPos]).data('fired', true);
                    preventDuplicate.push(metric + '+' + vars);
                    event(metric, vars);
                }
            }

            if ($(window).scrollTop() + $(window).height() == $(document).height()) {
                var lastSection = $(sections[sections.length - 1]);

                vars = lastSection.data('metrics-vars');
                metric = lastSection.data('metric-scroll');

                if (!lastSection.data('fired') && $.inArray(metric + '+' + vars, preventDuplicate) == -1) {
                    lastSection.data('fired', true);
                    preventDuplicate.push(metric + '+' + vars);
                    event(metric, vars);
                }
            }
        }
    });

    $(window).scroll();

    this.pageview = pageview;
    window.metric = event;
};

module.exports = new Metrics();
