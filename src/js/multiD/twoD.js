PykCharts.twoD = {};

var theme = new PykCharts.Configuration.Theme({});

PykCharts.twoD.configuration = function (options){
    var that = this;
    var twoDConfig = {
        twoDOptional : function (padding){
            var that = this;
            var status = "";
            var optional = {
                yes : function (){
                    status = true;
                    return this;
                },
                no: function (){
                    status = false;
                    return this;
                },
                magnify: function(rect,gsvg,xScale){
                    gsvg.on("mousemove", function() {
                        var mouse = d3.mouse(this);
                        xScale.focus(mouse[0]);
                        rect
                        .attr("x", function(d) { return xScale(d.x); })
                        .attr("width", function(d) {return xScale.rangeBand(d.x);});                         
                    });
                }
            };
            return optional;
        }
    };
    return twoDConfig;
};

PykCharts.twoD.mouseEvent = function (options) {
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
};

PykCharts.twoD.fillChart = function (options, theme) {
    // var that = this;
    var colorChart = function (d) {
        if(d.highlight === true) {
            return theme.stylesheet.colors.highlightColor;
        } else{
            return theme.stylesheet.colors.chartColor;
        }
    };
    return colorChart;
};

PykCharts.twoD.processInputs = function (chartObject, options) {
    var theme = new PykCharts.Configuration.Theme({})
    , stylesheet = theme.stylesheet
    //, functionality = theme.functionality
    , twoDimensionalCharts = theme.twoDimensionalCharts
    , optional = options.optional;
    chartObject.yAxisDataFormat = options.yAxisDataFormat ? options.yAxisDataFormat : twoDimensionalCharts.yAxisDataFormat
    chartObject.xAxisDataFormat = options.xAxisDataFormat ? options.xAxisDataFormat : twoDimensionalCharts.xAxisDataFormat;
    chartObject.selector = options.selector ? options.selector : "body";
    chartObject.width = options.chart && _.isNumber(options.chart.width) ? options.chart.width : stylesheet.chart.width;
    chartObject.height = options.chart && _.isNumber(options.chart.height) ? options.chart.height : stylesheet.chart.height;
    chartObject.margin = options.chart && options.chart.margin ? options.chart.margin : stylesheet.chart.margin;
    chartObject.margin.left = options.chart && options.chart.margin && _.isNumber(options.chart.margin.left) ? options.chart.margin.left : stylesheet.chart.margin.left;
    chartObject.margin.right = options.chart && options.chart.margin && _.isNumber(options.chart.margin.right) ? options.chart.margin.right : stylesheet.chart.margin.right;
    chartObject.margin.top = options.chart && options.chart.margin && _.isNumber(options.chart.margin.top) ? options.chart.margin.top : stylesheet.chart.margin.top;
    chartObject.margin.bottom = options.chart && options.chart.margin && _.isNumber(options.chart.margin.bottom) ? options.chart.margin.bottom : stylesheet.chart.margin.bottom;
    chartObject.mode = options.mode ? options.mode : "default";
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
    if (optional && optional.axis) {
        chartObject.axis = optional.axis;
        chartObject.axis.onHoverHighlightenable = optional.axis.onHoverHighlightenable ? optional.axis.onHoverHighlightenable : twoDimensionalCharts.axis.onHoverHighlightenable;
        chartObject.axis.x = optional.axis.x;
        chartObject.axis.x.orient = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.orient ? optional.axis.x.orient : twoDimensionalCharts.axis.x.orient;
        chartObject.axis.x.axisColor = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.axisColor ? optional.axis.x.axisColor : twoDimensionalCharts.axis.x.axisColor;
        chartObject.axis.x.labelColor = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.labelColor ? optional.axis.x.labelColor : twoDimensionalCharts.axis.x.labelColor;
        chartObject.axis.x.no_of_ticks = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.no_of_ticks ? optional.axis.x.no_of_ticks : twoDimensionalCharts.axis.x.no_of_ticks;
        chartObject.axis.x.ticksPadding = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.ticksPadding ? optional.axis.x.ticksPadding : twoDimensionalCharts.axis.x.ticksPadding;
        chartObject.axis.x.tickSize = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.tickSize ? optional.axis.x.tickSize : twoDimensionalCharts.axis.x.tickSize;
        chartObject.axis.x.tickFormat = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.tickFormat ? optional.axis.x.tickFormat : twoDimensionalCharts.axis.x.tickFormat;
        chartObject.axis.x.tickValues = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.tickValues ? optional.axis.x.tickValues : twoDimensionalCharts.axis.x.tickValues;
        chartObject.axis.y = optional.axis.y;
        chartObject.axis.y.orient = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.orient ? optional.axis.y.orient : twoDimensionalCharts.axis.y.orient;
        chartObject.axis.y.axisColor = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.axisColor ? optional.axis.y.axisColor : twoDimensionalCharts.axis.y.axisColor;
        chartObject.axis.y.labelColor = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.labelColor ? optional.axis.y.labelColor : twoDimensionalCharts.axis.y.labelColor;
        chartObject.axis.y.no_of_ticks = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.no_of_ticks ? optional.axis.y.no_of_ticks : twoDimensionalCharts.axis.y.no_of_ticks;
        chartObject.axis.y.ticksPadding = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.ticksPadding ? optional.axis.y.ticksPadding : twoDimensionalCharts.axis.y.ticksPadding;
        chartObject.axis.y.tickSize = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.tickSize ? optional.axis.y.tickSize : twoDimensionalCharts.axis.y.tickSize;
        chartObject.axis.y.tickFormat = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.tickFormat ? optional.axis.y.tickFormat : twoDimensionalCharts.axis.y.tickFormat;
    } else {
        chartObject.axis = twoDimensionalCharts.axis;
    }

    if(optional && optional.legends) {
        chartObject.legends = optional.legends;
        chartObject.legends.enable = optional.legends.enable && optional.legends.enable ? optional.legends.enable : twoDimensionalCharts.legends.enable;
        chartObject.legends.display = optional.legends.display ? optional.legends.display : twoDimensionalCharts.legends.display;
    }
    chartObject.saturationColor = optional && optional.colors && optional.colors.saturationColor ? optional.colors.saturationColor : stylesheet.colors.saturationColor;
    chartObject.realTimeCharts = optional && optional.realTimeCharts ? optional.realTimeCharts : "no";
    chartObject.transition = optional && optional.transition ? optional.transition : "no";
    chartObject.creditMySite = optional && optional.creditMySite ? optional.creditMySite : stylesheet.creditMySite;
    chartObject.dataSource = optional && optional.dataSource ? optional.dataSource : stylesheet.dataSource;
    chartObject.bg = optional && optional.colors && optional.colors.backgroundColor ? optional.colors.backgroundColor : stylesheet.colors.backgroundColor;
    chartObject.chartColor = optional && optional.colors && optional.colors.chartColor ? optional.colors.chartColor : stylesheet.colors.chartColor;
    chartObject.highlightColor = optional && optional.colors && optional.colors.highlightColor ? optional.colors.highlightColor : stylesheet.colors.highlightColor;
    chartObject.fullscreen = optional && optional.buttons && optional.buttons.enableFullScreen ? optional.buttons.enableFullScreen : stylesheet.buttons.enableFullScreen;
    chartObject.loading = optional && optional.loading && optional.loading.animationGifUrl ? optional.loading.animationGifUrl: stylesheet.loading.animationGifUrl;
    chartObject.enableTooltip = optional && optional.enableTooltip ? optional.enableTooltip : stylesheet.enableTooltip;
    if (optional && optional.borderBetweenChartElements && optional.borderBetweenChartElements.width!=0 && optional.borderBetweenChartElements.width!="0px") {
        chartObject.borderBetweenChartElements = optional.borderBetweenChartElements;
        chartObject.borderBetweenChartElements.width = optional.borderBetweenChartElements.width ? optional.borderBetweenChartElements.width : stylesheet.borderBetweenChartElements.width;
        chartObject.borderBetweenChartElements.color = optional.borderBetweenChartElements.color ? optional.borderBetweenChartElements.color : stylesheet.borderBetweenChartElements.color;
        chartObject.borderBetweenChartElements.style = optional.borderBetweenChartElements.style ? optional.borderBetweenChartElements.style : stylesheet.borderBetweenChartElements.style;
    } else {
        chartObject.borderBetweenChartElements = "no";
    }
    if(optional && optional.ticks) {
        chartObject.ticks = optional.ticks;
        chartObject.ticks.strokeWidth = optional.ticks.strokeWidth ? optional.ticks.strokeWidth : stylesheet.ticks.strokeWidth;
        chartObject.ticks.size = optional.ticks.size ? optional.ticks.size : stylesheet.ticks.size;
        chartObject.ticks.color = optional.ticks.color ? optional.ticks.color : stylesheet.ticks.color;
        chartObject.ticks.family = optional.ticks.family ? optional.ticks.family : stylesheet.ticks.family;
    } else {
        chartObject.ticks = stylesheet.ticks;
    }
    chartObject.zoom = optional && optional.zoom ? optional.zoom : twoDimensionalCharts.zoom;
    chartObject.zoom.enable = optional && optional.zoom && optional.zoom.enable ? optional.zoom.enable : twoDimensionalCharts.zoom.enable;

    if (optional && optional.label) {
        chartObject.label = optional.label;
        chartObject.label.size = optional.label.size ? optional.label.size : stylesheet.label.size;
        chartObject.label.color = optional.label.color ? optional.label.color : stylesheet.label.color;
        chartObject.label.weight = optional.label.weight ? optional.label.weight : stylesheet.label.weight;
        chartObject.label.family = optional.label.family ? optional.label.family : stylesheet.label.family;
    } else {
        chartObject.label = stylesheet.label;
    }

    if (optional && optional.legendsText) {
        chartObject.legendsText = optional.legendsText;
        chartObject.legendsText.size = optional.legendsText.size ? optional.legendsText.size : stylesheet.legendsText.size;
        chartObject.legendsText.color = optional.legendsText.color ? optional.legendsText.color : stylesheet.legendsText.color;
        chartObject.legendsText.weight = optional.legendsText.weight ? optional.legendsText.weight : stylesheet.legendsText.weight;
        chartObject.legendsText.family = optional.legendsText.family ? optional.legendsText.family : stylesheet.legendsText.family;
    } else {
        chartObject.legendsText = stylesheet.legendsText;
    }

    chartObject.units = optional && optional.units ? optional.units : false;
    chartObject.size = optional && optional.size ? optional.size : twoDimensionalCharts.size;
    chartObject.size.enable = optional && optional.size && optional.size.enable ? optional.size.enable : twoDimensionalCharts.size.enable;
    chartObject.k = new PykCharts.Configuration(chartObject);
    return chartObject;
};