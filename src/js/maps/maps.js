PykCharts.maps = {};

PykCharts.maps.mouseEvent = function (options) {
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

PykCharts.maps.processInputs = function (chartObject, options) {

    var theme = new PykCharts.Configuration.Theme({})
        , stylesheet = theme.stylesheet
        , functionality = theme.functionality
        , mapsTheme = theme.mapsTheme
        , optional = options.optional;

    chartObject.selector = options.selector ? options.selector : stylesheet.selector;
    chartObject.width = optional.chart && _.isNumber(parseInt(optional.chart.width,10)) ? optional.chart.width : mapsTheme.chart.width;
    chartObject.height = optional.chart && _.isNumber(parseInt(optional.chart.height,10)) ? optional.chart.height : mapsTheme.chart.height;
    chartObject.mapCode = options.mapCode ? options.mapCode : mapsTheme.mapCode;
    chartObject.enableClick = options.enableClick ? options.enableClick : mapsTheme.enableClick;
    // chartObject.defaultColor = optional && optional.colors && optional.colors.defaultColor ? optional.colors.defaultColor : mapsTheme.colors.defaultColor;
    // chartObject.colorType = optional && optional.colors && optional.colors.type ? optional.colors.type : stylesheet.colors.type;
    // chartObject.totalColors = optional && optional.colors && _.isNumber(parseInt(optional.colors.total,10)) ? parseInt(optional.colors.total,10) : stylesheet.colors.total;
    // chartObject.colorPalette = optional && optional.colors && optional.colors.palette ? optional.colors.palette : mapsTheme.colors.palette;
    chartObject.bg = optional && optional.colors && optional.colors.backgroundColor ? optional.colors.backgroundColor : stylesheet.colors.backgroundColor;
    if (optional && optional.timeline) {
        chartObject.timeline = optional.timeline;
        chartObject.timeline.duration = optional.timeline.duration ? optional.timeline.duration :mapsTheme.timeline.duration;
        chartObject.timeline.margin = optional.timeline.margin;
        chartObject.timeline.margin.left = optional.timeline.margin.left ? optional.timeline.margin.left : mapsTheme.timeline.margin.left;
        chartObject.timeline.margin.right = optional.timeline.margin.right ? optional.timeline.margin.right : mapsTheme.timeline.margin.right;
        chartObject.timeline.margin.top = optional.timeline.margin.top ? optional.timeline.margin.top : mapsTheme.timeline.margin.top;
        chartObject.timeline.margin.bottom = optional.timeline.margin.bottom ? optional.timeline.margin.bottom : mapsTheme.timeline.margin.bottom;
    } else {
        chartObject.timeline = mapsTheme.timeline;
    }
    if (optional && optional.tooltip)  {
        chartObject.tooltip = optional.tooltip;
        chartObject.tooltip.enable = optional.tooltip.enable ? optional.tooltip.enable : mapsTheme.tooltip.enable;
        // chartObject.enableTooltip = chartObject.tooltip.enable;
        chartObject.tooltip.mode = optional.tooltip.mode ? optional.tooltip.mode : mapsTheme.tooltip.mode;
        chartObject.tooltip.positionTop = optional.tooltip.positionTop ? optional.tooltip.positionTop : mapsTheme.tooltip.positionTop;
        chartObject.tooltip.positionLeft = optional.tooltip.positionLeft ? optional.tooltip.positionLeft : mapsTheme.tooltip.positionLeft;
        chartObject.tooltipTopCorrection = d3.select(chartObject.selector).style("top");
        chartObject.tooltipLeftCorrection = d3.select(chartObject.selector).style("left");
    } else {
        chartObject.tooltip = mapsTheme.tooltip;
    }
    if (optional && optional.colors) {
        chartObject.colors = optional.colors;
        chartObject.colors.defaultColor = optional.colors.defaultColor ? optional.colors.defaultColor : mapsTheme.colors.defaultColor;
        chartObject.colors.total = optional.colors.total && _.isNumber(parseInt(optional.colors.total,10))? parseInt(optional.colors.total,10) : mapsTheme.colors.total;
        chartObject.colors.type = optional.colors.type ? optional.colors.type : mapsTheme.colors.type;
        chartObject.colors.palette = optional.colors.palette ? optional.colors.palette : mapsTheme.colors.palette;
    } else {
        chartObject.colors = mapsTheme.colors;
    }
    if (optional && optional.axis) {
        chartObject.axis = optional.axis;
        chartObject.axis.x = optional.axis.x;
        chartObject.axis.onHoverHighlightenable = PykCharts.boolean(optional.axis.x.enable) && optional.axis.onHoverHighlightenable ? optional.axis.onHoverHighlightenable : mapsTheme.axis.onHoverHighlightenable;
        chartObject.axis.x.orient = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.orient ? optional.axis.x.orient : mapsTheme.axis.x.orient;
        chartObject.axis.x.axisColor = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.axisColor ? optional.axis.x.axisColor : mapsTheme.axis.x.axisColor;
        chartObject.axis.x.labelColor = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.labelColor ? optional.axis.x.labelColor : mapsTheme.axis.x.labelColor;
        chartObject.axis.x.no_of_ticks = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.no_of_ticks ? optional.axis.x.no_of_ticks : mapsTheme.axis.x.no_of_ticks;
        chartObject.axis.x.ticksPadding = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.ticksPadding ? optional.axis.x.ticksPadding : mapsTheme.axis.x.ticksPadding;
        chartObject.axis.x.tickSize = "tickSize" in optional.axis.x && PykCharts.boolean(optional.axis.x.enable) ? optional.axis.x.tickSize : mapsTheme.axis.x.tickSize;
        chartObject.axis.x.tickFormat = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.tickFormat ? optional.axis.x.tickFormat : mapsTheme.axis.x.tickFormat;
        chartObject.axis.x.tickValues = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.tickValues ? optional.axis.x.tickValues : mapsTheme.axis.x.tickValues;
        chartObject.axis.x.outer_tick_size = "outer_tick_size" in optional.axis.x && PykCharts.boolean(optional.axis.x.enable) ? optional.axis.x.outer_tick_size : mapsTheme.axis.x.outer_tick_size;
    } else {
        chartObject.axis = mapsTheme.axis;
    }
    if(optional && optional.label) {
        chartObject.label = optional.label;
        chartObject.label.enable = optional.label.enable && optional.label.enable ? optional.label.enable : mapsTheme.label.enable;
    } else {
        chartObject.label =  mapsTheme.label;
    }
    // if (optional && optional.label) {
    //     chartObject.label = optional.label;
    //     chartObject.label.size = optional.label.size ? optional.label.size : stylesheet.label.size;
    //     chartObject.label.color = optional.label.color ? optional.label.color : stylesheet.label.color;
    //     chartObject.label.weight = optional.label.weight ? optional.label.weight : stylesheet.label.weight;
    //     chartObject.label.family = optional.label.family ? optional.label.family : stylesheet.label.family;
    // } else {
    //     chartObject.label = stylesheet.label;
    // }
    if(optional && optional.legends) {
        chartObject.legends = optional.legends;
        chartObject.legends.enable = optional.legends.enable && optional.legends.enable ? optional.legends.enable : mapsTheme.legends.enable;
        chartObject.legends.display = optional.legends.display ? optional.legends.display : mapsTheme.legends.display;
    } else {
        chartObject.legends =  mapsTheme.legends;
    }
    // if(optional && optional.legends) {
    //     chartObject.legends = optional.legends;
    //     chartObject.legends.strokeWidth = optional.legends.strokeWidth ? optional.legends.strokeWidth : stylesheet.legends.strokeWidth;
    //     chartObject.legends.size = optional.legends.size ? optional.legends.size : stylesheet.legends.size;
    //     chartObject.legends.color = optional.legends.color ? optional.legends.color : stylesheet.legends.color;
    //     chartObject.legends.family = optional.legends.family ? optional.legends.family : stylesheet.legends.family;
    // } else {
    //     chartObject.legends = stylesheet.legends;
    // }
    if (optional && optional.borderBetweenChartElements) {
        chartObject.borderBetweenChartElements = optional.borderBetweenChartElements;
        chartObject.borderBetweenChartElements.width = "width" in optional.borderBetweenChartElements ? optional.borderBetweenChartElements.width : stylesheet.borderBetweenChartElements.width;
        chartObject.borderBetweenChartElements.color = optional.borderBetweenChartElements.color ? optional.borderBetweenChartElements.color : stylesheet.borderBetweenChartElements.color;
        chartObject.borderBetweenChartElements.style = optional.borderBetweenChartElements.style ? optional.borderBetweenChartElements.style : stylesheet.borderBetweenChartElements.style;
        switch(chartObject.borderBetweenChartElements.style) {
            case "dotted" : chartObject.borderBetweenChartElements.style = "1,3";
                            break;
            case "dashed" : chartObject.borderBetweenChartElements.style = "5,5";
                           break;
            default : chartObject.borderBetweenChartElements.style = "0";
                      break;
        }
    } else {
        chartObject.borderBetweenChartElements = stylesheet.borderBetweenChartElements;
    }
    chartObject.onhover = optional && optional.onhover ? optional.onhover : mapsTheme.onhover;
    chartObject.defaultZoomLevel = optional && optional.defaultZoomLevel ? optional.defaultZoomLevel : 80;
    chartObject.loading = optional && optional.loading && optional.loading.animationGifUrl ? optional.loading.animationGifUrl: stylesheet.loading.animationGifUrl;
    chartObject.highlightArea = optional && optional.highlightArea ? optional.highlightArea : mapsTheme.highlightArea;
    if (optional && optional.title) {
        chartObject.title = optional.title;
        chartObject.title.size = "size"  in optional.title ? optional.title.size : stylesheet.title.size;
        chartObject.title.color = optional.title.color ? optional.title.color : stylesheet.title.color;
        chartObject.title.weight = optional.title.weight ? optional.title.weight : stylesheet.title.weight;
        chartObject.title.family = optional.title.family ? optional.title.family : stylesheet.title.family;
    } else {
        chartObject.title = stylesheet.title;
    }
    if (optional && optional.subtitle) {
        chartObject.subtitle = optional.subtitle;
        chartObject.subtitle.size = "size"  in optional.subtitle ? optional.subtitle.size : stylesheet.subtitle.size;
        chartObject.subtitle.color = optional.subtitle.color ? optional.subtitle.color : stylesheet.subtitle.color;
        chartObject.subtitle.family = optional.subtitle.family ? optional.subtitle.family : stylesheet.subtitle.family;
    } else {
        chartObject.subtitle = stylesheet.subtitle;
    }
    chartObject.realTimeCharts = optional && optional.realTimeCharts ? optional.realTimeCharts : functionality.realTimeCharts;
    chartObject.transition = optional && optional.transition ? optional.transition : functionality.transition;
    chartObject.creditMySite = optional && optional.creditMySite ? optional.creditMySite : stylesheet.creditMySite;
    chartObject.dataSource = optional && optional.dataSource ? optional.dataSource : "no";
    chartObject.units = optional && optional.units ? optional.units : false;
    chartObject.k = new PykCharts.Configuration(chartObject);
    return chartObject;
};
