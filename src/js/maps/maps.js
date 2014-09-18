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
    chartObject.width = _.isNumber(parseInt(options.chart_width,10)) ? options.chart_width : mapsTheme.chart_width;
    chartObject.height = _.isNumber(parseInt(options.chart_height,10)) ? options.chart_height : mapsTheme.chart_height;
    // chartObject.width = optional.chart && _.isNumber(parseInt(optional.chart.width,10)) ? optional.chart.width : mapsTheme.chart.width;
    // chartObject.height = optional.chart && _.isNumber(parseInt(optional.chart.height,10)) ? optional.chart.height : mapsTheme.chart.height;
    chartObject.mapCode = options.mapCode ? options.mapCode : mapsTheme.mapCode;
    chartObject.enableClick = options.enableClick ? options.enableClick : mapsTheme.enableClick;
    // chartObject.defaultColor = optional && optional.colors && optional.colors.defaultColor ? optional.colors.defaultColor : mapsTheme.colors.defaultColor;
    // chartObject.colorType = optional && optional.colors && optional.colors.type ? optional.colors.type : stylesheet.colors.type;
    // chartObject.totalColors = optional && optional.colors && _.isNumber(parseInt(optional.colors.total,10)) ? parseInt(optional.colors.total,10) : stylesheet.colors.total;
    // chartObject.colorPalette = optional && optional.colors && optional.colors.palette ? optional.colors.palette : mapsTheme.colors.palette;
    chartObject.bg = options.colors_backgroundColor ? options.colors_backgroundColor : stylesheet.backgroundColor;
    
    chartObject.timeline_duration = options.timeline_duration ? options.timeline_duration :mapsTheme.timeline_duration;
    chartObject.margin_left = options.timeline_margin_left ? options.timeline_margin_left : mapsTheme.timeline_margin_left;
    chartObject.margin_right = options.timeline_margin_right ? options.timeline_margin_right : mapsTheme.timeline_margin_right;
    chartObject.margin_top = options.timeline_margin_top ? options.timeline_margin_top : mapsTheme.timeline_margin_top;
    chartObject.margin_bottom = options.timeline_margin_bottom ? options.timeline_margin_bottom : mapsTheme.timeline_margin_bottom;

    chartObject.tooltip_enable = options.tooltip_enable ? options.tooltip_enable : mapsTheme.tooltip_enable;
    chartObject.tooltip_mode = options.tooltip_mode ? options.tooltip_mode : mapsTheme.tooltip_mode;
    chartObject.tooltip_positionTop = options.tooltip_positionTop ? options.tooltip_positionTop : mapsTheme.tooltip_positionTop;
    chartObject.tooltip_positionLeft = options.tooltip_positionLeft ? options.tooltip_positionLeft : mapsTheme.tooltip_positionLeft;
    chartObject.tooltipTopCorrection = d3.select(chartObject.selector).style("top");
    chartObject.tooltipLeftCorrection = d3.select(chartObject.selector).style("left");

    chartObject.colors_defaultColor = options.colors_defaultColor ? options.colors_defaultColor : mapsTheme.colors_defaultColor;
    chartObject.colors_total = options.colors_total && _.isNumber(parseInt(options.colors_total,10))? parseInt(options.colors_total,10) : mapsTheme.colors_total;
    chartObject.colors_type = options.colors_type ? options.colors_type : mapsTheme.colors_type;
    chartObject.colors_palette = options.colors_palette ? options.colors_palette : mapsTheme.colors_palette;

    chartObject.axis_onHoverHighlightenable = PykCharts.boolean(options.axis_x_enable) && options.axis_onHoverHighlightenable ? options.axis_onHoverHighlightenable : mapsTheme.axis_onHoverHighlightenable;
    chartObject.axis_x_enable = options.axis_x_enable ? options.axis_x_enable : mapsTheme.axis_x_enable;
    chartObject.axis_x_orient = PykCharts.boolean(options.axis_x_enable) && options.axis_x_orient ? options.axis_x_orient : mapsTheme.axis_x_orient;
    // chartObject.axis_x_position = PykCharts.boolean(options.axis_x_enable) && options.axis_x_position ? options.axis_x_position : mapsTheme.axis_x_position;
    chartObject.axis_x_axisColor = PykCharts.boolean(options.axis_x_enable) && options.axis_x_axisColor ? options.axis_x_axisColor : mapsTheme.axis_x_axisColor;
    chartObject.axis_x_labelColor = PykCharts.boolean(options.axis_x_enable) && options.axis_x_labelColor ? options.axis_x_labelColor : mapsTheme.axis_x_labelColor;
    chartObject.axis_x_no_of_ticks = PykCharts.boolean(options.axis_x_enable) && options.axis_x_no_of_ticks ? options.axis_x_no_of_ticks : mapsTheme.axis_x_no_of_ticks;
    chartObject.axis_x_tickPadding = PykCharts.boolean(options.axis_x_enable) && options.axis_x_tickPadding ? options.axis_x_tickPadding : mapsTheme.axis_x_tickPadding;
    chartObject.axis_x_tickSize = "axis_x_tickSize" in options && PykCharts.boolean(options.axis_x_enable) ? options.axis_x_tickSize : mapsTheme.axis_x_tickSize;
    chartObject.axis_x_tickFormat = PykCharts.boolean(options.axis_x_enable) && options.axis_x_tickFormat ? options.axis_x_tickFormat : mapsTheme.axis_x_tickFormat;
    chartObject.axis_x_tickValues = PykCharts.boolean(options.axis_x_enable) && options.axis_x_tickValues ? options.axis_x_tickValues : mapsTheme.axis_x_tickValues;
    chartObject.axis_x_outer_tick_size = "axis_x_outer_tick_size" in options && PykCharts.boolean(options.axis_x_enable) ? options.axis_x_outer_tick_size : mapsTheme.axis_x_outer_tick_size;

    chartObject.label_enable = options.label_enable ? options.label_enable : mapsTheme.label_enable;
    chartObject.legends_enable = options.legends_enable ? options.legends_enable : mapsTheme.legends_enable;
    chartObject.legends_display = options.legends_display ? options.legends_display : mapsTheme.legends_display;

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
    chartObject.onhover = options.onhover ? options.onhover : mapsTheme.onhover;
    chartObject.defaultZoomLevel = options.defaultZoomLevel ? options.defaultZoomLevel : 80;
    chartObject.loading = options.loading_animationGifUrl ? options.loading_animationGifUrl: stylesheet.loading_animationGifUrl;
    chartObject.highlightArea = options.highlightArea ? options.highlightArea : mapsTheme.highlightArea;
    
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

    chartObject.realTimeCharts_refreshFrequency = options.realTimeCharts_refreshFrequency ? options.realTimeCharts_refreshFrequency : functionality.realTimeCharts_refreshFrequency;
    chartObject.realTimeCharts_enableLastUpdatedAt = options.realTimeCharts_enableLastUpdatedAt ? options.realTimeCharts_enableLastUpdatedAt : functionality.realTimeCharts_enableLastUpdatedAt;
    chartObject.transition_duration = options.transition_duration ? options.transition_duration : functionality.transition_duration;
    
    chartObject.creditMySite_name = options.creditMySite_name ? options.creditMySite_name : stylesheet.creditMySite_name;
    chartObject.creditMySite_url = options.creditMySite_url ? options.creditMySite_url : stylesheet.creditMySite_url;
    chartObject.dataSource = options.dataSource ? options.dataSource : "no";
    chartObject.units = options.units ? options.units : false;

    chartObject.k = new PykCharts.Configuration(chartObject);
    return chartObject; 
    // if (optional && optional.colors) {
    //     chartObject.colors = optional.colors;
    //     chartObject.colors.defaultColor = optional.colors.defaultColor ? optional.colors.defaultColor : mapsTheme.colors.defaultColor;
    //     chartObject.colors.total = optional.colors.total && _.isNumber(parseInt(optional.colors.total,10))? parseInt(optional.colors.total,10) : mapsTheme.colors.total;
    //     chartObject.colors.type = optional.colors.type ? optional.colors.type : mapsTheme.colors.type;
    //     chartObject.colors.palette = optional.colors.palette ? optional.colors.palette : mapsTheme.colors.palette;
    // } else {
    //     chartObject.colors = mapsTheme.colors;
    // }
    // if (optional && optional.axis) {
    //     chartObject.axis = optional.axis;
    //     chartObject.axis.x = optional.axis.x;
    //     chartObject.axis.onHoverHighlightenable = PykCharts.boolean(optional.axis.x.enable) && optional.axis.onHoverHighlightenable ? optional.axis.onHoverHighlightenable : mapsTheme.axis.onHoverHighlightenable;
    //     chartObject.axis.x.orient = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.orient ? optional.axis.x.orient : mapsTheme.axis.x.orient;
    //     chartObject.axis.x.axisColor = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.axisColor ? optional.axis.x.axisColor : mapsTheme.axis.x.axisColor;
    //     chartObject.axis.x.labelColor = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.labelColor ? optional.axis.x.labelColor : mapsTheme.axis.x.labelColor;
    //     chartObject.axis.x.no_of_ticks = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.no_of_ticks ? optional.axis.x.no_of_ticks : mapsTheme.axis.x.no_of_ticks;
    //     chartObject.axis.x.ticksPadding = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.ticksPadding ? optional.axis.x.ticksPadding : mapsTheme.axis.x.ticksPadding;
    //     chartObject.axis.x.tickSize = "tickSize" in optional.axis.x && PykCharts.boolean(optional.axis.x.enable) ? optional.axis.x.tickSize : mapsTheme.axis.x.tickSize;
    //     chartObject.axis.x.tickFormat = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.tickFormat ? optional.axis.x.tickFormat : mapsTheme.axis.x.tickFormat;
    //     chartObject.axis.x.tickValues = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.tickValues ? optional.axis.x.tickValues : mapsTheme.axis.x.tickValues;
    //     chartObject.axis.x.outer_tick_size = "outer_tick_size" in optional.axis.x && PykCharts.boolean(optional.axis.x.enable) ? optional.axis.x.outer_tick_size : mapsTheme.axis.x.outer_tick_size;
    // } else {
    //     chartObject.axis = mapsTheme.axis;
    // }
    // if(optional && optional.label) {
    //     chartObject.label = optional.label;
    //     chartObject.label.enable = optional.label.enable && optional.label.enable ? optional.label.enable : mapsTheme.label.enable;
    // } else {
    //     chartObject.label =  mapsTheme.label;
    // }
    // if (optional && optional.label) {
    //     chartObject.label = optional.label;
    //     chartObject.label.size = optional.label.size ? optional.label.size : stylesheet.label.size;
    //     chartObject.label.color = optional.label.color ? optional.label.color : stylesheet.label.color;
    //     chartObject.label.weight = optional.label.weight ? optional.label.weight : stylesheet.label.weight;
    //     chartObject.label.family = optional.label.family ? optional.label.family : stylesheet.label.family;
    // } else {
    //     chartObject.label = stylesheet.label;
    // }
    // if(optional && optional.legends) {
    //     chartObject.legends = optional.legends;
    //     chartObject.legends.enable = optional.legends.enable && optional.legends.enable ? optional.legends.enable : mapsTheme.legends.enable;
    //     chartObject.legends.display = optional.legends.display ? optional.legends.display : mapsTheme.legends.display;
    // } else {
    //     chartObject.legends =  mapsTheme.legends;
    // }
    // if(optional && optional.legends) {
    //     chartObject.legends = optional.legends;
    //     chartObject.legends.strokeWidth = optional.legends.strokeWidth ? optional.legends.strokeWidth : stylesheet.legends.strokeWidth;
    //     chartObject.legends.size = optional.legends.size ? optional.legends.size : stylesheet.legends.size;
    //     chartObject.legends.color = optional.legends.color ? optional.legends.color : stylesheet.legends.color;
    //     chartObject.legends.family = optional.legends.family ? optional.legends.family : stylesheet.legends.family;
    // } else {
    //     chartObject.legends = stylesheet.legends;
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
    // chartObject.onhover = optional && optional.onhover ? optional.onhover : mapsTheme.onhover;
    // chartObject.defaultZoomLevel = optional && optional.defaultZoomLevel ? optional.defaultZoomLevel : 80;
    // chartObject.loading = optional && optional.loading && optional.loading.animationGifUrl ? optional.loading.animationGifUrl: stylesheet.loading.animationGifUrl;
    // chartObject.highlightArea = optional && optional.highlightArea ? optional.highlightArea : mapsTheme.highlightArea;
    // if (optional && optional.title) {
    //     chartObject.title = optional.title;
    //     chartObject.title.size = "size"  in optional.title ? optional.title.size : stylesheet.title.size;
    //     chartObject.title.color = optional.title.color ? optional.title.color : stylesheet.title.color;
    //     chartObject.title.weight = optional.title.weight ? optional.title.weight : stylesheet.title.weight;
    //     chartObject.title.family = optional.title.family ? optional.title.family : stylesheet.title.family;
    // } else {
    //     chartObject.title = stylesheet.title;
    // }
    // if (optional && optional.subtitle) {
    //     chartObject.subtitle = optional.subtitle;
    //     chartObject.subtitle.size = "size"  in optional.subtitle ? optional.subtitle.size : stylesheet.subtitle.size;
    //     chartObject.subtitle.color = optional.subtitle.color ? optional.subtitle.color : stylesheet.subtitle.color;
    //     chartObject.subtitle.family = optional.subtitle.family ? optional.subtitle.family : stylesheet.subtitle.family;
    // } else {
    //     chartObject.subtitle = stylesheet.subtitle;
    // }
    // chartObject.realTimeCharts = optional && optional.realTimeCharts ? optional.realTimeCharts : functionality.realTimeCharts;
    // chartObject.transition = optional && optional.transition ? optional.transition : functionality.transition;
    // chartObject.creditMySite = optional && optional.creditMySite ? optional.creditMySite : stylesheet.creditMySite;
    // chartObject.dataSource = optional && optional.dataSource ? optional.dataSource : "no";
    // chartObject.units = optional && optional.units ? optional.units : false;
     // if (optional && optional.timeline) {
    //     chartObject.timeline = optional.timeline;
    //     chartObject.timeline.duration = optional.timeline.duration ? optional.timeline.duration :mapsTheme.timeline.duration;
    //     chartObject.timeline.margin = optional.timeline.margin;
    //     chartObject.timeline.margin.left = optional.timeline.margin.left ? optional.timeline.margin.left : mapsTheme.timeline.margin.left;
    //     chartObject.timeline.margin.right = optional.timeline.margin.right ? optional.timeline.margin.right : mapsTheme.timeline.margin.right;
    //     chartObject.timeline.margin.top = optional.timeline.margin.top ? optional.timeline.margin.top : mapsTheme.timeline.margin.top;
    //     chartObject.timeline.margin.bottom = optional.timeline.margin.bottom ? optional.timeline.margin.bottom : mapsTheme.timeline.margin.bottom;
    // } else {
    //     chartObject.timeline = mapsTheme.timeline;
    // }
};
