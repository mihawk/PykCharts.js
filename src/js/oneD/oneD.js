PykCharts.oneD = {};

PykCharts.oneD.fillChart = function (options) {

    var colorPie = {
        chartColor: function (d) {
            if(d.highlight === true) {
                return options.highlightColor;
            } else{
                return options.chartColor;
            }
        }
    };
    return colorPie;
};

PykCharts.oneD.mouseEvent = function (options) {
    var highlight_selected = {
        highlight: function (selectedclass, that) {
                var t = d3.select(that);
                d3.selectAll(selectedclass)
                    .attr("opacity",.5)
                t.attr("opacity",1);
                return this;
        },
        highlightHide : function (selectedclass) {
                d3.selectAll(selectedclass)
                    .attr("opacity",1);
            return this;
        }
    }
    return highlight_selected;
}

PykCharts.oneD.processInputs = function (chartObject, options) {

    var theme = new PykCharts.Configuration.Theme({})
        , stylesheet = theme.stylesheet
        , functionality = theme.functionality
        , oneDimensionalCharts = theme.oneDimensionalCharts
        , optional = options.optional;

    chartObject.selector = options.selector ? options.selector : stylesheet.selector;
    chartObject.width = _.isNumber(options.chart_width) ? options.chart_width : stylesheet.chart_width;
    chartObject.height = _.isNumber(options.chart_height) ? options.chart_height : stylesheet.chart_height;
    // chartObject.width = optional && optional.chart && _.isNumber(optional.chart.width) ? optional.chart.width : stylesheet.chart.width;
    // chartObject.height = optional && optional.chart &&_.isNumber(optional.chart.height) ? optional.chart.height : stylesheet.chart.height;

    chartObject.mode = options.mode ? options.mode : stylesheet.mode;

    if (options &&  PykCharts.boolean (options.title_text)) {
        chartObject.title_size = "size" in options ? options.title_size : stylesheet.title_size;
        chartObject.title_color = options.title_color ? options.title_color : stylesheet.title_color;
        chartObject.title_weight = options.title_weight ? options.title_weight : stylesheet.title_weight;
        chartObject.title_family = options.title_family ? optional.title_family : stylesheet.title_family;
    } else {
        chartObject.title_size = stylesheet.title_size;
        chartObject.title_color = stylesheet.title_color;
        chartObject.title_weight = stylesheet.title_weight;
        chartObject.title_family = stylesheet.title_family;
    }

    if (options && PykCharts.boolean(options.subtitle_text)) {
        chartObject.subtitle_size = "subtitle_size" in options ? options.subtitle_size : stylesheet.subtitle_size;
        chartObject.subtitle_color = options.subtitle_color ? options.subtitle_color : stylesheet.subtitle_color;
        chartObject.subtitle_weight = options.subtitle_weight ? options.subtitle_weight : stylesheet.subtitle_weight;
        chartObject.subtitle_family = options.subtitle_family ? options.subtitle_family : stylesheet.subtitle_family;
    } else {
        chartObject.subtitle_size = stylesheet.subtitle_size;
        chartObject.subtitle_color = stylesheet.subtitle_color;
        chartObject.subtitle_weight = stylesheet.subtitle_weight;
        chartObject.subtitle_family = stylesheet.subtitle_family;        
    }

    // if (optional && optional.title && PykCharts.boolean(optional.title.text)) {
    //     chartObject.title = optional.title;
    //     chartObject.title.size = "size" in optional.title ? optional.title.size : stylesheet.title.size;
    //     chartObject.title.color = optional.title.color ? optional.title.color : stylesheet.title.color;
    //     chartObject.title.weight = optional.title.weight ? optional.title.weight : stylesheet.title.weight;
    //     chartObject.title.family = optional.title.family ? optional.title.family : stylesheet.title.family;
    // } else {
    //     chartObject.title = stylesheet.title;
    // }
    // if (optional && optional.subtitle && PykCharts.boolean(optional.subtitle.text)) {
    //     chartObject.subtitle = optional.subtitle;
    //     chartObject.subtitle.size = "size" in optional.subtitle ? optional.subtitle.size : stylesheet.subtitle.size;
    //     chartObject.subtitle.color = optional.subtitle.color ? optional.subtitle.color : stylesheet.subtitle.color;
    //     chartObject.subtitle.weight = optional.subtitle.weight ? optional.subtitle.weight : stylesheet.subtitle.weight;
    //     chartObject.subtitle.family = optional.subtitle.family ? optional.subtitle.family : stylesheet.subtitle.family;
    // } else {
    //     chartObject.subtitle = stylesheet.subtitle;
    // }
    // chartObject.realTimeCharts = optional && optional.realTimeCharts ? optional.realTimeCharts : functionality.realTimeCharts;
    // chartObject.transition = optional && optional.transition && optional.transition.duration ? optional.transition : functionality.transition;
    // chartObject.creditMySite = optional && optional.creditMySite ? optional.creditMySite : stylesheet.creditMySite;
    chartObject.realTimeCharts_refreshFrequency = options.realTimeCharts_refreshFrequency ? options.realTimeCharts_refreshFrequency : functionality.realTimeCharts_refreshFrequency;
    chartObject.realTimeCharts_enableLastUpdatedAt = options.realTimeCharts_enableLastUpdatedAt ? options.realTimeCharts_enableLastUpdatedAt : functionality.realTimeCharts_enableLastUpdatedAt;
    chartObject.creditMySite_name = options.creditMySite_name ? options.creditMySite_name : stylesheet.creditMySite_name;
    chartObject.creditMySite_url = options.creditMySite_url ? options.creditMySite_url : stylesheet.creditMySite_url;
    chartObject.dataSource = options.dataSource ? options.dataSource : "no";
    chartObject.clubData_enable = options.clubData_enable ? options.clubData_enable : oneDimensionalCharts.clubData_enable;
    chartObject.clubData_text = PykCharts.boolean(options.clubData_enable) && options.clubData_text ? options.clubData_text : oneDimensionalCharts.clubData_text;
    chartObject.clubData_maximumNodes = PykCharts.boolean(options.clubData_maximumNodes) && options.clubData_maximumNodes ? options.clubData_maximumNodes : oneDimensionalCharts.clubData_maximumNodes;
    chartObject.clubData_alwaysIncludeDataPoints = PykCharts.boolean(options.clubData_enable) && options.clubData_alwaysIncludeDataPoints ? options.clubData_alwaysIncludeDataPoints : [];
    chartObject.transition_duration = options.transition_duration ? options.transition_duration : functionality.transition_duration;
    chartObject.overflowTicks = options.overflowTicks ? options.overflowTicks : stylesheet.overflowTicks;
    chartObject.bg = options.backgroundColor ? options.backgroundColor : stylesheet.backgroundColor;
    chartObject.chartColor = options.chartColor ? options.chartColor : stylesheet.chartColor;
    chartObject.highlightColor = options.highlightColor ? options.highlightColor : stylesheet.highlightColor;
    chartObject.fullscreen = options.buttons_enableFullScreen ? options.buttons_enableFullScreen : stylesheet.buttons_enableFullScreen;
    chartObject.loading = options.loading_animationGifUrl ? options.loading_animationGifUrl: stylesheet.loading_animationGifUrl;   
    chartObject.tooltip_enable = options.tooltip_enable ? options.tooltip_enable : stylesheet.tooltip_enable;
    chartObject.borderBetweenChartElements_width = "borderBetweenChartElements_width" in options ? options.borderBetweenChartElements_width : stylesheet.borderBetweenChartElements_width;
    chartObject.borderBetweenChartElements_color = options.borderBetweenChartElements_color ? options.borderBetweenChartElements_color : stylesheet.borderBetweenChartElements_color;
    chartObject.borderBetweenChartElements_style = options.borderBetweenChartElements_style ? options.borderBetweenChartElements_style : stylesheet.borderBetweenChartElements_style;
    switch(chartObject.borderBetweenChartElements_style) {
        case "dotted" : chartObject.borderBetweenChartElements_style = "1,3";
                        break;
        case "dashed" : chartObject.borderBetweenChartElements_style = "5,5";
                       break;
        default : chartObject.borderBetweenChartElements_style = "0";
                  break;
    }
    chartObject.label_size = "label_size" in options ? options.label_size : stylesheet.label_size;
    chartObject.label_color = options.label_color ? options.label_color : stylesheet.label_color;
    chartObject.label_weight = options.label_weight ? options.label_weight : stylesheet.label_weight;
    chartObject.label_family = options.label_family ? options.label_family : stylesheet.label_family;

    chartObject.ticks_thickness = "ticks_thickness" in options ? options.ticks_thickness : stylesheet.ticks_thickness;
    chartObject.ticks_size = "ticks_size" in options ? options.ticks_size : stylesheet.ticks_size;
    chartObject.ticks_color = options.ticks_color ? options.ticks_color : stylesheet.ticks_color;
    chartObject.ticks_family = options.ticks_family ? options.ticks_family : stylesheet.ticks_family;

    chartObject.showTotalAtTheCenter = options.donut_showTotalAtTheCenter ? options.donut_showTotalAtTheCenter : oneDimensionalCharts.donut_showTotalAtTheCenter;
    chartObject.units = options.units ? options.units : false;

    chartObject.k = new PykCharts.Configuration(chartObject);

    return chartObject;
    // chartObject.dataSource = optional && optional.dataSource ? optional.dataSource : "no";
    // if (optional && optional.clubData) {
    //     chartObject.clubData = optional.clubData;
    //     chartObject.clubData.text = PykCharts.boolean(optional.clubData.enable) && optional.clubData.text ? optional.clubData.text : oneDimensionalCharts.clubData.text;
    //     chartObject.clubData.maximumNodes = PykCharts.boolean(optional.clubData.maximumNodes) && optional.clubData.maximumNodes ? optional.clubData.maximumNodes : oneDimensionalCharts.clubData.maximumNodes;
    //     chartObject.clubData.alwaysIncludeDataPoints = PykCharts.boolean(optional.clubData.enable) && optional.clubData.alwaysIncludeDataPoints ? optional.clubData.alwaysIncludeDataPoints : [];
    // } else {
    //     chartObject.clubData = oneDimensionalCharts.clubData;
    //     chartObject.clubData.alwaysIncludeDataPoints = [];
    // }
    // chartObject.overflowTicks = optional && optional.overflowTicks ? optional.overflowTicks : stylesheet.overflowTicks;
    // chartObject.bg = optional && optional.colors && optional.colors.backgroundColor ? optional.colors.backgroundColor : stylesheet.colors.backgroundColor;
    // chartObject.chartColor = optional && optional.colors && optional.colors.chartColor ? optional.colors.chartColor : stylesheet.colors.chartColor;
    // chartObject.highlightColor = optional && optional.colors && optional.colors.highlightColor ? optional.colors.highlightColor : stylesheet.colors.highlightColor;
    // chartObject.fullscreen = optional && optional.buttons && optional.buttons.enableFullScreen ? optional.buttons.enableFullScreen : stylesheet.buttons.enableFullScreen;
    // chartObject.loading = optional && optional.loading && optional.loading.animationGifUrl ? optional.loading.animationGifUrl: stylesheet.loading.animationGifUrl;
    // if (optional && optional.tooltip) {
    //     chartObject.tooltip = optional.tooltip;        
    //     chartObject.tooltip.enable = optional.tooltip.enable ? optional.tooltip.enable : stylesheet.tooltip.enable;
    // } else {
    //     chartObject.tooltip = stylesheet.tooltip;
    // //    chartObject.enableTooltip = multiDimensionalCharts.tooltip.enable;     
    // }   
    // if (optional && optional.borderBetweenChartElements) {
    //     chartObject.borderBetweenChartElements = optional.borderBetweenChartElements;
    //     chartObject.borderBetweenChartElements.width = "width" in optional.borderBetweenChartElements ? optional.borderBetweenChartElements.width : stylesheet.borderBetweenChartElements.width;
    //     chartObject.borderBetweenChartElements.color = optional.borderBetweenChartElements.color ? optional.borderBetweenChartElements.color : stylesheet.borderBetweenChartElements.color;
    //     chartObject.borderBetweenChartElements.style = optional.borderBetweenChartElements.style ? optional.borderBetweenChartElements.style : stylesheet.borderBetweenChartElements.style;
    //     switch(chartObject.borderBetweenChartElements.style) {
    //         case "dotted" : chartObject.borderBetweenChartElements.style = "1,3";
    //                         break;
    //         case "dashed" : chartObject.borderBetweenChartElements.style = "5,5";
    //                        break;
    //         default : chartObject.borderBetweenChartElements.style = "0";
    //                   break;
    //     }
    // } else {
    //     chartObject.borderBetweenChartElements = stylesheet.borderBetweenChartElements;
    // }
    // if (optional && optional.label) {
    //     chartObject.label = optional.label;
    //     chartObject.label.size = "size" in optional.label ? optional.label.size : stylesheet.label.size;
    //     chartObject.label.color = optional.label.color ? optional.label.color : stylesheet.label.color;
    //     chartObject.label.weight = optional.label.weight ? optional.label.weight : stylesheet.label.weight;
    //     chartObject.label.family = optional.label.family ? optional.label.family : stylesheet.label.family;
    // } else {
    //     chartObject.label = stylesheet.label;
    // }
    // if(optional && optional.ticks) {
    //     chartObject.ticks = optional.ticks;
    //     chartObject.ticks.strokeWidth = "strokeWidth" in optional.ticks ? optional.ticks.strokeWidth : stylesheet.ticks.strokeWidth;
    //     chartObject.ticks.size = "size" in optional.ticks ? optional.ticks.size : stylesheet.ticks.size;
    //     chartObject.ticks.color = optional.ticks.color ? optional.ticks.color : stylesheet.ticks.color;
    //     chartObject.ticks.family = optional.ticks.family ? optional.ticks.family : stylesheet.ticks.family;
    // } else {
    //     chartObject.ticks = stylesheet.ticks;
    // }
    // chartObject.showTotalAtTheCenter = optional && optional.donut && optional.donut.showTotalAtTheCenter ? optional.donut.showTotalAtTheCenter : oneDimensionalCharts.donut.showTotalAtTheCenter;
    // chartObject.units = optional && optional.units ? optional.units : false;

   
};