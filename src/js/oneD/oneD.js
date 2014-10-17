PykCharts.oneD = {};

// PykCharts.oneD.fillChart = function (options) {

//     var colorPie = {
//         chartColor: function (d) {
//             if(d.highlight === true) {
//                 return options.highlightColor;
//             } else{
//                 return options.chartColor;
//             }
//         }
//     };
//     return colorPie;
// };

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
    chartObject.width = options.chart_width && _.isNumber(options.chart_width) ? options.chart_width : stylesheet.chart_width;
    chartObject.height = options.chart_height && _.isNumber(options.chart_height) ? options.chart_height : stylesheet.chart_height;
    // chartObject.width = optional && optional.chart && _.isNumber(optional.chart.width) ? optional.chart.width : stylesheet.chart.width;
    // chartObject.height = optional && optional.chart &&_.isNumber(optional.chart.height) ? optional.chart.height : stylesheet.chart.height;

    chartObject.mode = options.mode ? options.mode : stylesheet.mode;

    if (options &&  PykCharts.boolean (options.title_text)) {
        chartObject.title_text = options.title_text;
        chartObject.title_size = "title_size" in options ? options.title_size : stylesheet.title_size;
        chartObject.title_color = options.title_color ? options.title_color : stylesheet.title_color;
        chartObject.title_weight = options.title_weight ? options.title_weight : stylesheet.title_weight;
        chartObject.title_family = options.title_family ? options.title_family : stylesheet.title_family;
    } else {
        chartObject.title_size = stylesheet.title_size;
        chartObject.title_color = stylesheet.title_color;
        chartObject.title_weight = stylesheet.title_weight;
        chartObject.title_family = stylesheet.title_family;
    }

    if (options && PykCharts.boolean(options.subtitle_text)) {
        chartObject.subtitle_text = options.subtitle_text;
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
    chartObject.creditMySite_name = options.creditMySite_name ? options.creditMySite_name : stylesheet.creditMySite_name;
    chartObject.creditMySite_url = options.creditMySite_url ? options.creditMySite_url : stylesheet.creditMySite_url;
    chartObject.dataSource_name = options.dataSource_name ? options.dataSource_name : "";
    chartObject.dataSource_url = options.dataSource_url ? options.dataSource_url : "";
    chartObject.clubData_enable = options.clubData_enable ? options.clubData_enable : oneDimensionalCharts.clubData_enable;
    chartObject.clubData_text = PykCharts.boolean(options.clubData_enable) && options.clubData_text ? options.clubData_text : oneDimensionalCharts.clubData_text;
    chartObject.clubData_maximumNodes = PykCharts.boolean(options.clubData_maximumNodes) && options.clubData_maximumNodes ? options.clubData_maximumNodes : oneDimensionalCharts.clubData_maximumNodes;
    chartObject.clubData_alwaysIncludeDataPoints = PykCharts.boolean(options.clubData_enable) && options.clubData_alwaysIncludeDataPoints ? options.clubData_alwaysIncludeDataPoints : [];
    chartObject.transition_duration = options.transition_duration ? options.transition_duration : functionality.transition_duration;
    chartObject.pointer_overflow_enable = options.pointer_overflow_enable ? options.pointer_overflow_enable : stylesheet.pointer_overflow_enable;
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
    chartObject.highlight = options.highlight ? options.highlight : stylesheet.highlight;
    
    chartObject.label_size = "label_size" in options ? options.label_size : stylesheet.label_size;
    chartObject.label_color = options.label_color ? options.label_color : stylesheet.label_color;
    chartObject.label_weight = options.label_weight ? options.label_weight : stylesheet.label_weight;
    chartObject.label_family = options.label_family ? options.label_family : stylesheet.label_family;

    chartObject.pointer_thickness = "pointer_thickness" in options ? options.pointer_thickness : stylesheet.pointer_thickness;
    chartObject.pointer_size = "pointer_size" in options ? options.pointer_size : stylesheet.pointer_size;
    chartObject.pointer_color = options.pointer_color ? options.pointer_color : stylesheet.pointer_color;
    chartObject.pointer_family = options.pointer_family ? options.pointer_family : stylesheet.pointer_family;

    chartObject.showTotalAtTheCenter = options.donut_showTotalAtTheCenter ? options.donut_showTotalAtTheCenter : oneDimensionalCharts.donut_showTotalAtTheCenter;
    chartObject.units_prefix = options.units_prefix ? options.units_prefix : false;
    chartObject.units_suffix = options.units_suffix ? options.units_suffix : false;

    chartObject.k = new PykCharts.Configuration(chartObject);

    return chartObject;

};
