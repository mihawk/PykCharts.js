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
    chartObject.width = options.chart_width && _.isNumber(parseInt(options.chart_width,10)) ? options.chart_width : stylesheet.chart_width;
    console.log(chartObject.width,stylesheet.chart_width);
    chartObject.height = options.chart_height && _.isNumber(parseInt(options.chart_height,10)) ? options.chart_height : stylesheet.chart_height;
    chartObject.map_code = options.map_code ? options.map_code : mapsTheme.map_code;
    chartObject.click_enable = options.click_enable ? options.click_enable : mapsTheme.click_enable;
    chartObject.background_color = options.background_color ? options.background_color : stylesheet.background_color;
    
    chartObject.timeline_duration = options.timeline_duration ? options.timeline_duration :mapsTheme.timeline_duration;
    chartObject.margin_left = options.timeline_margin_left ? options.timeline_margin_left : mapsTheme.timeline_margin_left;
    chartObject.margin_right = options.timeline_margin_right ? options.timeline_margin_right : mapsTheme.timeline_margin_right;
    chartObject.margin_top = options.timeline_margin_top ? options.timeline_margin_top : mapsTheme.timeline_margin_top;
    chartObject.margin_bottom = options.timeline_margin_bottom ? options.timeline_margin_bottom : mapsTheme.timeline_margin_bottom;

    chartObject.tooltip_enable = options.tooltip_enable ? options.tooltip_enable : mapsTheme.tooltip_enable;
    chartObject.tooltip_mode = options.tooltip_mode ? options.tooltip_mode : mapsTheme.tooltip_mode;
    chartObject.tooltip_position_top = options.tooltip_position_top ? options.tooltip_position_top : mapsTheme.tooltip_position_top;
    chartObject.tooltip_position_left = options.tooltip_position_left ? options.tooltip_position_left : mapsTheme.tooltip_position_left;
    chartObject.tooltipTopCorrection = d3.select(chartObject.selector).style("top");
    chartObject.tooltipLeftCorrection = d3.select(chartObject.selector).style("left");

    chartObject.default_color = options.chart_color ? options.chart_color : stylesheet.chart_color;
    chartObject.total_no_of_colors = options.total_no_of_colors && _.isNumber(parseInt(options.total_no_of_colors,10))? parseInt(options.total_no_of_colors,10) : mapsTheme.total_no_of_colors;
    chartObject.color_mode = options.color_mode ? options.color_mode : mapsTheme.color_mode;
    chartObject.palette_color = options.palette_color ? options.palette_color : mapsTheme.palette_color;

    chartObject.axis_onhover_hightlight_enable = PykCharts.boolean(options.axis_x_enable) && options.axis_onhover_hightlight_enable ? options.axis_onhover_hightlight_enable : mapsTheme.axis_onhover_hightlight_enable;
    chartObject.axis_x_enable = options.axis_x_enable ? options.axis_x_enable : mapsTheme.axis_x_enable;
    chartObject.axis_x_pointer_position = PykCharts.boolean(options.axis_x_enable) && options.axis_x_pointer_position ? options.axis_x_pointer_position : mapsTheme.axis_x_pointer_position;
    chartObject.axis_x_line_color = PykCharts.boolean(options.axis_x_enable) && options.axis_x_line_color ? options.axis_x_line_color : mapsTheme.axis_x_line_color;
    chartObject.axis_x_label_color = PykCharts.boolean(options.axis_x_enable) && options.axis_x_label_color ? options.axis_x_label_color : mapsTheme.axis_x_label_color;
    chartObject.axis_x_no_of_axis_value = PykCharts.boolean(options.axis_x_enable) && options.axis_x_no_of_axis_value ? options.axis_x_no_of_axis_value : mapsTheme.axis_x_no_of_axis_value;
    chartObject.axis_x_pointer_padding = PykCharts.boolean(options.axis_x_enable) && options.axis_x_pointer_padding ? options.axis_x_pointer_padding : mapsTheme.axis_x_pointer_padding;
    chartObject.axis_x_pointer_size = "axis_x_pointer_size" in options && PykCharts.boolean(options.axis_x_enable) ? options.axis_x_pointer_size : mapsTheme.axis_x_pointer_size;
    chartObject.axis_x_value_format = PykCharts.boolean(options.axis_x_enable) && options.axis_x_value_format ? options.axis_x_value_format : mapsTheme.axis_x_value_format;
    chartObject.axis_x_pointer_values = PykCharts.boolean(options.axis_x_enable) && options.axis_x_pointer_values ? options.axis_x_pointer_values : mapsTheme.axis_x_pointer_values;
    chartObject.axis_x_outer_pointer_size = "axis_x_outer_pointer_size" in options && PykCharts.boolean(options.axis_x_enable) ? options.axis_x_outer_pointer_size : mapsTheme.axis_x_outer_pointer_size;

    chartObject.label_enable = options.label_enable ? options.label_enable : mapsTheme.label_enable;
    chartObject.legends_enable = options.legends_enable ? options.legends_enable : stylesheet.legends_enable;
    chartObject.legends_display = options.legends_display ? options.legends_display : stylesheet.legends_display;

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
    chartObject.onhover = options.onhover ? options.onhover : mapsTheme.onhover;
    chartObject.default_zoom_level = options.default_zoom_level ? options.default_zoom_level : 80;
    chartObject.loading = options.loading_gif_url ? options.loading_gif_url: stylesheet.loading_gif_url;
    chartObject.highlight_area_enable = options.highlight_area_enable ? options.highlight_area_enable : mapsTheme.highlight_area_enable;
    chartObject.highlight = options.highlight ? options.highlight : stylesheet.highlight;
    chartObject.highlight_color = options.highlight_color ? options.highlight_color: stylesheet.highlight_color;
    // chartObject.highlight_area_enable = "yes";    
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
    chartObject.transition_duration = options.transition_duration ? options.transition_duration : functionality.transition_duration;
    
    if(options.credit_my_site_name || options.credit_my_site_url) {
        chartObject.credit_my_site_name = options.credit_my_site_name ? options.credit_my_site_name : "";
        chartObject.credit_my_site_url = options.credit_my_site_url ? options.credit_my_site_url : "";
    } else {
        chartObject.credit_my_site_name = stylesheet.credit_my_site_name;
        chartObject.credit_my_site_url = stylesheet.credit_my_site_url;
    } 
    chartObject.data_source_name = options.data_source_name ? options.data_source_name : "";
    chartObject.data_source_url = options.data_source_url ? options.data_source_url : "";
    chartObject.units = options.units ? options.units : false;

    // chartObject.play_image_url = options.play_image_url ? options.play_image_url : mapsTheme.play_image_url;
    // chartObject.pause_image_url = options.pause_image_url ? options.pause_image_url : mapsTheme.pause_image_url;
    // chartObject.marker_image_url = options.marker_image_url ? options.marker_image_url : mapsTheme.marker_image_url;

    // chartObject.export_image_url = options.export_image_url ? options.export_image_url : stylesheet.export_image_url; 
    chartObject.export_enable = options.export_enable ? options.export_enable : stylesheet.export_enable; 
    
    chartObject.k = new PykCharts.Configuration(chartObject);
    return chartObject; 
   
};
