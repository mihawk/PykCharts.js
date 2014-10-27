PykCharts.oneD = {};

// PykCharts.oneD.fillChart = function (options) {

//     var colorPie = {
//         chart_color: function (d) {
//             if(d.highlight === true) {
//                 return options.highlight_color;
//             } else{
//                 return options.chart_color;
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
    if(options.chart_width) {
        var targetWidth = $(options.selector).width();
        options.chart_width = targetWidth < options.chart_width ? targetWidth : options.chart_width;
    }
    chartObject.width = options.chart_width && _.isNumber(options.chart_width) ? options.chart_width : stylesheet.chart_width;
    // chartObject.height = options.chart_height && _.isNumber(options.chart_height) ? options.chart_height : stylesheet.chart_height;
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
    chartObject.real_time_charts_refresh_frequency = options.real_time_charts_refresh_frequency ? options.real_time_charts_refresh_frequency : functionality.real_time_charts_refresh_frequency;
    chartObject.real_time_charts_last_updated_at_enable = options.real_time_charts_last_updated_at_enable ? options.real_time_charts_last_updated_at_enable : functionality.real_time_charts_last_updated_at_enable;

    if(options.credit_my_site_name || options.credit_my_site_url) {
        chartObject.credit_my_site_name = options.credit_my_site_name ? options.credit_my_site_name : "";
        chartObject.credit_my_site_url = options.credit_my_site_url ? options.credit_my_site_url : "";
    } else {
        chartObject.credit_my_site_name = stylesheet.credit_my_site_name;
        chartObject.credit_my_site_url = stylesheet.credit_my_site_url;
    }
    // chartObject.credit_my_site_name = options.credit_my_site_name ? options.credit_my_site_name : stylesheet.credit_my_site_name;
    // chartObject.credit_my_site_url = options.credit_my_site_url ? options.credit_my_site_url : stylesheet.credit_my_site_url;
    chartObject.data_source_name = options.data_source_name ? options.data_source_name : "";
    chartObject.data_source_url = options.data_source_url ? options.data_source_url : "";
    chartObject.clubdata_enable = options.clubdata_enable ? options.clubdata_enable : oneDimensionalCharts.clubdata_enable;
    chartObject.clubdata_text = PykCharts.boolean(options.clubdata_enable) && options.clubdata_text ? options.clubdata_text : oneDimensionalCharts.clubdata_text;
    chartObject.clubdata_maximum_nodes = PykCharts.boolean(options.clubdata_maximum_nodes) && options.clubdata_maximum_nodes ? options.clubdata_maximum_nodes : oneDimensionalCharts.clubdata_maximum_nodes;
    chartObject.clubdata_always_include_data_points = PykCharts.boolean(options.clubdata_enable) && options.clubdata_always_include_data_points ? options.clubdata_always_include_data_points : [];
    chartObject.transition_duration = options.transition_duration ? options.transition_duration : functionality.transition_duration;
    chartObject.pointer_overflow_enable = options.pointer_overflow_enable ? options.pointer_overflow_enable : stylesheet.pointer_overflow_enable;
    chartObject.background_color = options.background_color ? options.background_color : stylesheet.background_color;
    chartObject.chart_color = options.chart_color ? options.chart_color : stylesheet.chart_color;
    chartObject.highlight_color = options.highlight_color ? options.highlight_color : stylesheet.highlight_color;
    chartObject.fullscreen_enable = options.fullscreen_enable ? options.fullscreen_enable : stylesheet.fullscreen_enable;
    chartObject.loading = options.loading_gif_url ? options.loading_gif_url: stylesheet.loading_gif_url;
    chartObject.tooltip_enable = options.tooltip_enable ? options.tooltip_enable : stylesheet.tooltip_enable;
    chartObject.border_between_chart_elements_thickness = "border_between_chart_elements_thickness" in options ? options.border_between_chart_elements_thickness : stylesheet.border_between_chart_elements_thickness;
    chartObject.border_between_chart_elements_color = options.border_between_chart_elements_color ? options.border_between_chart_elements_color : stylesheet.border_between_chart_elements_color;
    chartObject.border_between_chart_elements_style = options.border_between_chart_elements_style ? options.border_between_chart_elements_style : stylesheet.border_between_chart_elements_style;
    switch(chartObject.border_between_chart_elements_style) {
        case "dotted" : chartObject.border_between_chart_elements_style = "1,3";
                        break;
        case "dashed" : chartObject.border_between_chart_elements_style = "5,5";
                       break;
        default : chartObject.border_between_chart_elements_style = "0";
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

    chartObject.donut_show_total_at_center = options.donut_show_total_at_center ? options.donut_show_total_at_center : oneDimensionalCharts.donut_show_total_at_center;
    chartObject.units_prefix = options.units_prefix ? options.units_prefix : false;
    chartObject.units_suffix = options.units_suffix ? options.units_suffix : false;
    
    chartObject.export_enable = options.export_enable ? options.export_enable : stylesheet.export_enable;
    chartObject.export_image_url = options.export_image_url ? options.export_image_url : stylesheet.export_image_url; 
    chartObject.k = new PykCharts.Configuration(chartObject);

    return chartObject;

};
