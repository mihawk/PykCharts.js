PykCharts.other = {};

PykCharts.other.processInputs = function (chartObject, options) {

    var theme = new PykCharts.Configuration.Theme({})
        , stylesheet = theme.stylesheet
        , functionality = theme.functionality
        , otherCharts = theme.otherCharts;

    chartObject.selector = options.selector ? options.selector : stylesheet.selector;
    
    chartObject.chart_width = options.chart_width  ? options.chart_width : stylesheet.chart_width;

    chartObject.mode = options.mode ? options.mode.toLowerCase(): stylesheet.mode;

    chartObject.tooltip_enable = options.tooltip_enable ? options.tooltip_enable.toLowerCase() : stylesheet.tooltip_enable;
    if (options &&  PykCharts['boolean'] (options.title_text)) {
        chartObject.title_text = options.title_text;
        chartObject.title_size = "title_size" in options ? options.title_size : stylesheet.title_size;
        chartObject.title_color = options.title_color ? options.title_color.toLowerCase()  : stylesheet.title_color;
        chartObject.title_weight = options.title_weight ? options.title_weight.toLowerCase() : stylesheet.title_weight;
        chartObject.title_family = options.title_family ? options.title_family.toLowerCase() : stylesheet.title_family;
    } else {
        chartObject.title_size = stylesheet.title_size;
        chartObject.title_color = stylesheet.title_color;
        chartObject.title_weight = stylesheet.title_weight;
        chartObject.title_family = stylesheet.title_family;
    }

    if (options && PykCharts['boolean'](options.subtitle_text)) {
        chartObject.subtitle_text = options.subtitle_text;
        chartObject.subtitle_size = "subtitle_size" in options ? options.subtitle_size : stylesheet.subtitle_size;
        chartObject.subtitle_color = options.subtitle_color ? options.subtitle_color : stylesheet.subtitle_color;
        chartObject.subtitle_weight = options.subtitle_weight ? options.subtitle_weight.toLowerCase() : stylesheet.subtitle_weight;
        chartObject.subtitle_family = options.subtitle_family ? options.subtitle_family.toLowerCase() : stylesheet.subtitle_family;
    } else {
        chartObject.subtitle_size = stylesheet.subtitle_size;
        chartObject.subtitle_color = stylesheet.subtitle_color;
        chartObject.subtitle_weight = stylesheet.subtitle_weight;
        chartObject.subtitle_family = stylesheet.subtitle_family;
    }

    if(options.credit_my_site_name || options.credit_my_site_url) {
        chartObject.credit_my_site_name = options.credit_my_site_name ? options.credit_my_site_name : "";
        chartObject.credit_my_site_url = options.credit_my_site_url ? options.credit_my_site_url : "";
    } else {
        chartObject.credit_my_site_name = stylesheet.credit_my_site_name;
        chartObject.credit_my_site_url = stylesheet.credit_my_site_url;
    }
    chartObject.data_source_name = options.data_source_name ? options.data_source_name : "";
    chartObject.data_source_url = options.data_source_url ? options.data_source_url : "";
    
    chartObject.label_size = "label_size" in options ? options.label_size : stylesheet.label_size;
    chartObject.label_color = options.label_color ? options.label_color : stylesheet.label_color;
    chartObject.label_weight = options.label_weight ? options.label_weight.toLowerCase() : stylesheet.label_weight;
    chartObject.label_family = options.label_family ? options.label_family.toLowerCase() : stylesheet.label_family;

    chartObject.transition_duration = options.transition_duration ? options.transition_duration : functionality.transition_duration;
    chartObject.chart_onhover_highlight_enable = options.chart_onhover_highlight_enable ? options.chart_onhover_highlight_enable : stylesheet.chart_onhover_highlight_enable;
    chartObject.highlight_color = options.highlight_color ? options.highlight_color : stylesheet.highlight_color;
    chartObject.highlight = options.highlight ? options.highlight : stylesheet.highlight;
    
    chartObject.background_color = options.background_color ? options.background_color.toLowerCase() : stylesheet.background_color;
    chartObject.real_time_charts_refresh_frequency = options.real_time_charts_refresh_frequency ? options.real_time_charts_refresh_frequency : functionality.real_time_charts_refresh_frequency;
    chartObject.real_time_charts_last_updated_at_enable = options.real_time_charts_last_updated_at_enable ? options.real_time_charts_last_updated_at_enable.toLowerCase() : functionality.real_time_charts_last_updated_at_enable;

    chartObject.chart_color = options.chart_color ? options.chart_color : [];
    chartObject.default_color = stylesheet.chart_color;
    chartObject.fullscreen_enable = options.fullscreen_enable ? options.fullscreen_enable : stylesheet.fullscreen_enable;
    chartObject.loading_type = options.loading_type ? options.loading_type : stylesheet.loading_type;
    chartObject.loading_source = options.loading_source ? options.loading_source : stylesheet.loading_source;
    chartObject.export_enable = options.export_enable ? options.export_enable.toLowerCase() : stylesheet.export_enable;
    chartObject.border_between_chart_elements_thickness = "border_between_chart_elements_thickness" in options ? options.border_between_chart_elements_thickness : stylesheet.border_between_chart_elements_thickness;
    chartObject.border_between_chart_elements_color = options.border_between_chart_elements_color ? options.border_between_chart_elements_color: stylesheet.border_between_chart_elements_color;
    chartObject.border_between_chart_elements_style = options.border_between_chart_elements_style ? options.border_between_chart_elements_style.toLowerCase() : stylesheet.border_between_chart_elements_style;
    switch(chartObject.border_between_chart_elements_style) {
        case "dotted" : chartObject.border_between_chart_elements_style = "1,3";
                        break;
        case "dashed" : chartObject.border_between_chart_elements_style = "5,5";
                       break;
        default : chartObject.border_between_chart_elements_style = "0";
                  break;
    }

    chartObject.k = new PykCharts.Configuration(chartObject);

    chartObject.k.validator().validatingSelector(chartObject.selector.substring(1,chartObject.selector.length))
                .validatingChartMode(chartObject.mode,"mode",stylesheet.mode)
                .validatingDataType(chartObject.chart_width,"chart_width",stylesheet.chart_width)
                .validatingDataType(chartObject.title_size,"title_size",stylesheet.title_size)
                .validatingDataType(chartObject.border_between_chart_elements_thickness,"border_between_chart_elements_thickness",stylesheet.border_between_chart_elements_thickness)
                .validatingDataType(chartObject.real_time_charts_refresh_frequency,"real_time_charts_refresh_frequency",functionality.real_time_charts_refresh_frequency)
                .validatingDataType(chartObject.label_size,"label_size",stylesheet.label_size)
                .validatingDataType(chartObject.subtitle_size,"subtitle_size",stylesheet.subtitle_size)
                .validatingDataType(chartObject.transition_duration,"transition_duration",functionality.transition_duration)
                .validatingBorderBetweenChartElementsStyle(chartObject.border_between_chart_elements_style)
                .validatingFontWeight(chartObject.title_weight,"title_weight",stylesheet.title_weight)
                .validatingFontWeight(chartObject.subtitle_weight,"subtitle_weight",stylesheet.subtitle_weight)
                .validatingFontWeight(chartObject.label_weight,"label_weight",stylesheet.label_weight)
                .validatingColor(chartObject.title_color,"title_color",stylesheet.title_color)
                .validatingColor(chartObject.subtitle_color,"subtitle_color",stylesheet.subtitle_color)
                .validatingColor(chartObject.highlight_color,"highlight_color",stylesheet.highlight_color)
                .validatingColor(chartObject.label_color,"label_color",stylesheet.label_color)
                .validatingColor(chartObject.border_between_chart_elements_color)
                .validatingColor(chartObject.background_color,"background_color",stylesheet.background_color)
                
    if(chartObject.chart_color.constructor === Array) {
        for(var i = 0;i < chartObject.chart_color.length;i++) {
            if(chartObject.chart_color[i]) {
                chartObject.k.validator()
                    .validatingColor(chartObject.chart_color[i],"chart_color",stylesheet.chart_color);
            }
        }
    }
    return chartObject;
};
