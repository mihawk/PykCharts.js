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
    chartObject.width = optional && _.isNumber(optional.chart.width) ? optional.chart.width : stylesheet.chart.width;
    chartObject.height = optional &&_.isNumber(optional.chart.height) ? optional.chart.height : stylesheet.chart.height;
    // chartObject.width = options.chart && _.isNumber(options.chart.width) ? options.chart.width : stylesheet.chart.width;
    // chartObject.height = options.chart && _.isNumber(options.chart.height) ? options.chart.height : stylesheet.chart.height;
    chartObject.mode = options.mode ? options.mode : stylesheet.mode;
    
    if (optional && optional.title) {
        chartObject.title = optional.title;
        chartObject.title.size = optional.title.size ? optional.title.size : stylesheet.title.size;
        chartObject.title.color = optional.title.color ? optional.title.color : stylesheet.title.color;
        chartObject.title.weight = optional.title.weight ? optional.title.weight : stylesheet.title.weight;
        chartObject.title.family = optional.title.family ? optional.title.family : stylesheet.title.family;
    } else {
        chartObject.title = stylesheet.title;
    }
    if (optional && optional.subtitle) {
        chartObject.subtitle = optional.subtitle;
        chartObject.subtitle.size = optional.subtitle.size ? optional.subtitle.size : stylesheet.subtitle.size;
        chartObject.subtitle.color = optional.subtitle.color ? optional.subtitle.color : stylesheet.subtitle.color;
        chartObject.subtitle.weight = optional.subtitle.weight ? optional.subtitle.weight : stylesheet.subtitle.weight;
        chartObject.subtitle.family = optional.subtitle.family ? optional.subtitle.family : stylesheet.subtitle.family;
    } else {
        chartObject.subtitle = stylesheet.subtitle;
    }
    chartObject.realTimeCharts = optional && optional.realTimeCharts ? optional.realTimeCharts : functionality.realTimeCharts;
    chartObject.transition = optional && optional.transition && optional.transition.duration ? optional.transition : functionality.transition;
    chartObject.creditMySite = optional && optional.creditMySite ? optional.creditMySite : stylesheet.creditMySite;
    chartObject.dataSource = optional && optional.dataSource ? optional.dataSource : "no";
    if (optional && optional.clubData) {
        chartObject.clubData = optional.clubData;
        chartObject.clubData.text = PykCharts.boolean(optional.clubData.enable) && optional.clubData.text ? optional.clubData.text : oneDimensionalCharts.clubData.text;
        chartObject.clubData.maximumNodes = PykCharts.boolean(optional.clubData.maximumNodes) && optional.clubData.maximumNodes ? optional.clubData.maximumNodes : oneDimensionalCharts.clubData.maximumNodes;
        chartObject.clubData.alwaysIncludeDataPoints = PykCharts.boolean(optional.clubData.enable) && optional.clubData.alwaysIncludeDataPoints ? optional.clubData.alwaysIncludeDataPoints : [];
    } else {
        chartObject.clubData = oneDimensionalCharts.clubData;
        chartObject.clubData.alwaysIncludeDataPoints = [];
    }
    chartObject.bg = optional && optional.colors && optional.colors.backgroundColor ? optional.colors.backgroundColor : stylesheet.colors.backgroundColor;
    chartObject.chartColor = optional && optional.colors && optional.colors.chartColor ? optional.colors.chartColor : stylesheet.colors.chartColor;
    chartObject.highlightColor = optional && optional.colors && optional.colors.highlightColor ? optional.colors.highlightColor : stylesheet.colors.highlightColor;
    chartObject.fullscreen = optional && optional.buttons && optional.buttons.enableFullScreen ? optional.buttons.enableFullScreen : stylesheet.buttons.enableFullScreen;
    chartObject.loading = optional && optional.loading && optional.loading.animationGifUrl ? optional.loading.animationGifUrl: stylesheet.loading.animationGifUrl;
    chartObject.enableTooltip = optional && optional.enableTooltip ? optional.enableTooltip : stylesheet.enableTooltip;
    if (optional && optional.borderBetweenChartElements) {
        chartObject.borderBetweenChartElements = optional.borderBetweenChartElements;
        chartObject.borderBetweenChartElements.width = "width" in optional.borderBetweenChartElements ? optional.borderBetweenChartElements.width : stylesheet.borderBetweenChartElements.width;
        chartObject.borderBetweenChartElements.color = optional.borderBetweenChartElements.color ? optional.borderBetweenChartElements.color : stylesheet.borderBetweenChartElements.color;
        chartObject.borderBetweenChartElements.style = optional.borderBetweenChartElements.style ? optional.borderBetweenChartElements.style : stylesheet.borderBetweenChartElements.style;
    } else {
        chartObject.borderBetweenChartElements = stylesheet.borderBetweenChartElements;
    }
    if (optional && optional.label) {
        chartObject.label = optional.label;
        chartObject.label.size = "size" in optional.label ? optional.label.size : stylesheet.label.size;
        chartObject.label.color = optional.label.color ? optional.label.color : stylesheet.label.color;
        chartObject.label.weight = optional.label.weight ? optional.label.weight : stylesheet.label.weight;
        chartObject.label.family = optional.label.family ? optional.label.family : stylesheet.label.family;
    } else {
        chartObject.label = stylesheet.label;
    }
    if(optional && optional.ticks) {
        chartObject.ticks = optional.ticks;
        chartObject.ticks.strokeWidth = "strokeWidth" in optional.ticks ? optional.ticks.strokeWidth : stylesheet.ticks.strokeWidth;
        chartObject.ticks.size = "size" in optional.ticks ? optional.ticks.size : stylesheet.ticks.size;
        chartObject.ticks.color = optional.ticks.color ? optional.ticks.color : stylesheet.ticks.color;
        chartObject.ticks.family = optional.ticks.family ? optional.ticks.family : stylesheet.ticks.family;
    } else {
        chartObject.ticks = stylesheet.ticks;
    }
    chartObject.showTotalAtTheCenter = optional && optional.donut && optional.donut.showTotalAtTheCenter ? optional.donut.showTotalAtTheCenter : oneDimensionalCharts.donut.showTotalAtTheCenter;
    chartObject.units = optional && optional.units ? optional.units : false;

    chartObject.k = new PykCharts.Configuration(chartObject);

    return chartObject;
};
