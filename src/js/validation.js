PykCharts.validation = {};
PykCharts.oneD = {};
PykCharts.other = {};
PykCharts.validation.processInputs = function (chartObject, options, chart_type) {
    var theme = new PykCharts.Configuration.Theme({})
	    , stylesheet = theme.stylesheet
	    , functionality = theme.functionality
	    , oneDimensionalCharts = theme.oneDimensionalCharts        
	    , multiDimensionalCharts = theme.multiDimensionalCharts
        , mapsTheme = theme.mapsTheme;

        chartObject.title_text = options.title_text;
        chartObject.subtitle_text = options.subtitle_text;
        if(options.credit_my_site_name || options.credit_my_site_url) {
            chartObject.credit_my_site_name = options.credit_my_site_name ? options.credit_my_site_name : "";
            chartObject.credit_my_site_url = options.credit_my_site_url ? options.credit_my_site_url : "";
        } else {
            chartObject.credit_my_site_name = stylesheet.credit_my_site_name;
            chartObject.credit_my_site_url = stylesheet.credit_my_site_url;
        }
        chartObject.data_source_name = options.data_source_name ? options.data_source_name : "";
        chartObject.data_source_url = options.data_source_url ? options.data_source_url : "";
        chartObject.default_color = stylesheet.chart_color;
    // console.log("heyyyyyyyyyyyyyyyyyyyyheyyyyyyyyyyyyyyyyyyyy")
    var config_param_info = [
    	{	
    		'config_name': 'selector',
    		'default_value': stylesheet,
    		'validation_type': 'validatingSelector',
            'all': true
    	},
    	{
    		'config_name': 'mode',
    		'default_value': stylesheet,
    		'validation_type': 'validatingChartMode',
            'condition2': convertToLowerCase,
            'oneDimensionalCharts': true,
            'multiDimensionalCharts':true,
            'other': true
    	},
    	{
    		'config_name': 'chart_color',
    		'default_value': stylesheet,
    		'validation_type': 'isArray',
            'all': true
    	},
    	{
    		'config_name': 'chart_width',
    		'default_value': stylesheet,
    		'validation_type': 'validatingDataType',
            'all_charts':true
    	},
        {
            'config_name': 'title_size',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType',
            'all_charts':true

        },
        {
            'config_name': 'subtitle_size',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType',
            'condition1': findInObject,
            'all_charts':true
        },
        {
            'config_name': 'border_between_chart_elements_thickness',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType',
            'condition1': findInObject,
            'all_charts':true
        },
        {
            'config_name': 'label_size',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType',
            'condition1': findInObject,
            'all_charts':true
        },
        {
            'config_name': 'pointer_thickness',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType',
            'condition1': findInObject,
            'oneDimensionalCharts':true,
            'multiDimensionalCharts':true
        },
        {
            'config_name': 'pointer_size',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType',
            'condition1': findInObject,
            'oneDimensionalCharts':true,
            'multiDimensionalCharts':true
        },
        {
            'config_name': 'axis_x_title_size',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType',
            'condition1': findInObject,
            'multiDimensionalCharts':true
        },
        {
            'config_name': 'axis_y_title_size',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingDataType',
            'condition1': findInObject,
            'multiDimensionalCharts':true
        },
        {
            'config_name': 'legends_text_size',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType',
            'condition1': findInObject,
            'maps':true,
            'multiDimensionalCharts':true
        },
        {
            'config_name': 'axis_x_pointer_size',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType',
            'condition1': findInObject,
            'maps':true,
            'multiDimensionalCharts':true
        },
        {
            'config_name': 'axis_y_pointer_size',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingDataType',
            'condition1': findInObject,
            'multiDimensionalCharts':true
        },
        {
            'config_name': 'axis_x_pointer_length',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType',
            'condition1': findInObject,
            'maps':true,
            'multiDimensionalCharts':true
        },
        {
            'config_name': 'axis_y_pointer_length',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingDataType',
            'condition1': findInObject,
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'axis_x_outer_pointer_length',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType',
            'condition1': findInObject,
            'maps':true,
            'multiDimensionalCharts':true
        },
        {
            'config_name': 'axis_y_outer_pointer_length',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingDataType',
            'condition1': findInObject,
            'multiDimensionalCharts':true
        },
        {
            'config_name': 'real_time_charts_refresh_frequency',
            'default_value': functionality,
            'validation_type': 'validatingDataType',
            'all_charts':true
        },
        {
            'config_name': 'transition_duration',
            'default_value': functionality,
            'validation_type': 'validatingDataType',
            'oneDimensionalCharts': true,
            'multiDimensionalCharts':true,
            'other': true
        },
        {
            'config_name': 'clubdata_maximum_nodes',
            'default_value': oneDimensionalCharts,
            'validation_type': 'validatingDataType',
            'oneDimensionalCharts':true
        },
        {
            'config_name': 'title_weight',
            'default_value': stylesheet,
            'validation_type': 'validatingFontWeight',
            'condition2' : convertToLowerCase,
            'all_charts': true
        },
        {
            'config_name': 'subtitle_weight',
            'default_value': stylesheet,
            'validation_type': 'validatingFontWeight',
            'condition2' : convertToLowerCase,
            'all_charts': true
        },
        {
            'config_name': 'pointer_weight',
            'default_value': stylesheet,
            'validation_type': 'validatingFontWeight',
            'condition2' : convertToLowerCase,
            'oneDimensionalCharts': true,
            'multiDimensionalCharts':true
        },
        {
            'config_name': 'label_weight',
            'default_value': stylesheet,
            'validation_type': 'validatingFontWeight',
            'condition2' : convertToLowerCase,
            'all_charts': true
        },
        {
            'config_name': 'background_color',
            'default_value': stylesheet,
            'validation_type': 'validatingColor',
            'all_charts': true
        },
        {
            'config_name': 'title_color',
            'default_value': stylesheet,
            'validation_type': 'validatingColor',
            'all_charts': true
        },
        {
            'config_name': 'subtitle_color',
            'default_value': stylesheet,
            'validation_type': 'validatingColor',
            'all_charts': true
        },
        {
            'config_name': 'highlight_color',
            'default_value': stylesheet,
            'validation_type': 'validatingColor',
            'all_charts': true
        },
        {
            'config_name': 'label_color',
            'default_value': stylesheet,
            'validation_type': 'validatingColor',
            'all_charts': true
        },
        {
            'config_name': 'pointer_color',
            'default_value': stylesheet,
            'validation_type': 'validatingColor',
            'oneDimensionalCharts': true,
            'multiDimensionalCharts':true
        },
        {
            'config_name': 'border_between_chart_elements_color',
            'default_value': stylesheet,
            'validation_type': 'validatingColor',
            'all_charts': true
        },
        {
            'config_name': 'axis_x_pointer_values',
            'default_value': stylesheet,
            'validation_type': 'isArray',
            'maps':true,
            'multiDimensionalCharts':true
        },
        {
            'config_name': 'axis_y_pointer_values',
            'default_value': multiDimensionalCharts,
            'validation_type': 'isArray',
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'axis_x_time_value_datatype',
            'default_value': stylesheet,
            'validation_type': 'validatingTimeScaleDataType',
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'axis_y_time_value_datatype',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingTimeScaleDataType',
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'chart_height',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType',
            'multiDimensionalCharts': true,
            'maps': true
        },
        {
            'config_name': 'chart_margin_left',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType',
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'chart_margin_right',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType',
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'chart_margin_top',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType',
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'chart_margin_bottom',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType',
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'zoom_level',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingDataType',
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'axis_x_pointer_padding',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType',
            'multiDimensionalCharts': true,
            'maps': true
        },
        {
            'config_name': 'axis_y_pointer_padding',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingDataType',
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'axis_x_no_of_axis_value',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType',
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'axis_y_no_of_axis_value',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingDataType',
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'axis_x_time_value_interval',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType',
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'axis_y_time_value_interval',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingDataType',
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'legends_text_color',
            'default_value': stylesheet,
            'validation_type': 'validatingColor',
            'multiDimensionalCharts': true,
            'maps': true
        },
        {
            'config_name': 'axis_x_pointer_color',
            'default_value': stylesheet,
            'validation_type': 'validatingColor',
            'multiDimensionalCharts': true,
            'maps': true
        },
        {
            'config_name': 'axis_y_pointer_color',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingColor',
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'axis_x_title_color',
            'default_value': stylesheet,
            'validation_type': 'validatingColor',
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'axis_y_title_color',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingColor',
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'axis_x_line_color',
            'default_value': stylesheet,
            'validation_type': 'validatingColor',
            'multiDimensionalCharts': true,
            'maps': true
        },
        {
            'config_name': 'axis_y_line_color',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingColor',
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'annotation_font_color',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingColor',
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'annotation_background_color',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingColor',
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'chart_grid_color',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingColor',
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'legends_display',
            'default_value': stylesheet,
            'validation_type': 'validatingLegendsPosition',
            'multiDimensionalCharts': true,
            'maps': true
        },
        {
            'config_name': 'tooltip_mode',
            'default_value': stylesheet,
            'validation_type': 'validatingTooltipMode',
            'multiDimensionalCharts': true,
            'maps': true
        },
        {
            'config_name': 'legends_text_weight',
            'default_value': stylesheet,
            'validation_type': 'validatingFontWeight',
            'condition2' : convertToLowerCase,
            'multiDimensionalCharts': true,
            'maps': true
        },
        {
            'config_name': 'axis_y_pointer_weight',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingFontWeight',
            'condition2' : convertToLowerCase,
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'axis_x_pointer_weight',
            'default_value': stylesheet,
            'validation_type': 'validatingFontWeight',
            'condition2' : convertToLowerCase,
            'multiDimensionalCharts': true,
            'maps': true
        },
        {
            'config_name': 'axis_y_title_weight',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingFontWeight',
            'condition2' : convertToLowerCase,
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'axis_x_title_weight',
            'default_value': stylesheet,
            'validation_type': 'validatingFontWeight',
            'condition2' : convertToLowerCase,
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'axis_y_position',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingYAxisPointerPosition',
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'axis_x_position',
            'default_value': stylesheet,
            'validation_type': 'validatingXAxisPointerPosition',
            'condition2': convertToLowerCase,
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'axis_y_pointer_position',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingYAxisPointerPosition',
            'condition2': convertToLowerCase,
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'axis_x_pointer_position',
            'default_value': stylesheet,
            'validation_type': 'validatingXAxisPointerPosition',
            'condition2': convertToLowerCase,
            'multiDimensionalCharts': true,
            'maps': true
        },
        {
            'config_name': 'color_mode',
            'default_value': stylesheet,
            'validation_type': 'validatingColorMode',
            'condition2': convertToLowerCase,
            'all_charts': true
        },
        {
            'config_name': 'border_between_chart_elements_style',
            'default_value': stylesheet,
            'condition2': convertToLowerCase,
            'all_charts': true
        },
        {
            'config_name': 'clubdata_text',
            'default_value':oneDimensionalCharts,
            'oneDimensionalCharts': true
        },
        {
            'config_name': 'saturation_color',
            'default_value': stylesheet,
            'multiDimensionalCharts': true,
            'maps': true
        }
    ];
    chartObject.k = new PykCharts.Configuration(chartObject);
    var validator = chartObject.k.validator();

    for (var i=0,config_length=config_param_info.length; i<config_length; i++) {
        var config = config_param_info[i];
            var config_name = config.config_name
            , default_value = config.default_value[config_name]
            , condition1 = !config.condition1 ? options[config_name] : config.condition1(config_name);

            if(config_name in options) {
                var condition2  = !config.condition2 ? options[config_name] : config.condition2(options[config_name]);
                // console.log(options[config_name],config_name)
            }
            chartObject[config_name] = condition1 ? condition2 : default_value;
            // console.log(chartObject[config_name],config_name,default_value)
            if(config.validation_type) {
                // console.log(validator[config.validation_type],"testing",config.validation_type)
                validator[config.validation_type](chartObject[config_name],config_name,default_value);
            }

    }
    var enable_config_param = [
        {   
            'config_name': 'tooltip_enable',
            'default_value': stylesheet,
            'all_charts': true
        },
        {
            'config_name': 'is_interactive',
            'default_value': stylesheet,
            'all_charts': true
        },
        {   
            'config_name': 'export_enable',
            'default_value': stylesheet,
            'all_charts': true
        },
        {   
            'config_name': 'real_time_charts_last_updated_at_enable',
            'default_value': functionality,
            'all_charts': true
        },
        {   
            'config_name': 'clubdata_enable',
            'default_value': oneDimensionalCharts,
            'oneDimensionalCharts': true
        },
        {   
            'config_name': 'pointer_overflow_enable',
            'default_value': oneDimensionalCharts,
            'oneDimensionalCharts': true
        },
        {
            'config_name': 'chart_onhover_highlight_enable',
            'default_value': stylesheet,
            'all_charts': true
        },
        {
            'config_name': 'chart_grid_x_enable',
            'default_value': multiDimensionalCharts,
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'chart_grid_y_enable',
            'default_value': multiDimensionalCharts,
            'multiDimensionalCharts': true
        },
        {
            'config_name':'axis_x_enable',
            'default_value': stylesheet,
            'multiDimensionalCharts': true,
            'maps': true
        },
        {
            'config_name': 'axis_y_enable',
            'default_value': multiDimensionalCharts,
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'axis_onhover_highlight_enable',
            'default_value': multiDimensionalCharts,
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'zoom_enable',
            'default_value': multiDimensionalCharts,
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'annotation_enable',
            'default_value': multiDimensionalCharts,
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'legends_enable',
            'default_value': stylesheet,
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'variable_circle_size_enable',
            'default_value': multiDimensionalCharts,
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'title_family',
            'default_value':stylesheet,
            'all_charts':true
        },
        {
            'config_name': 'subtitle_family',
            'default_value':stylesheet,
            'all_charts':true
        },
        {
            'config_name': 'pointer_family',
            'default_value':stylesheet,
            'oneDimensionalCharts':true,
            'multiDimensionalCharts':true
        },
        {
            'config_name': 'title_family',
            'default_value':stylesheet,
            'all_charts':true
        },
        {
            'config_name': 'label_family',
            'default_value':stylesheet,
            'all_charts':true
        },
        {
            'config_name': 'units_suffix',
            'default_value':stylesheet,
            'oneDimensionalCharts':true
        },
        {
            'config_name': 'units_prefix',
            'default_value':stylesheet,
            'oneDimensionalCharts':true
        },
        {
            'config_name':'highlight',
            'default_value': stylesheet,
            'all_charts': true
        },
        {
            'config_name': 'axis_x_title_family',
            'default_value': stylesheet,
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'axis_y_title_family',
            'default_value': multiDimensionalCharts,
            'multiDimensionalCharts': true
        },
        {
            'config_name': 'legends_text_family',
            'default_value': stylesheet,
            'multiDimensionalCharts': true,

        }
    ];


    for (var i = 0, len = enable_config_param.length; i<len; i++) {
        var config = enable_config_param[i];
        if(config[chart_type] || config.all_charts) {
            var config_name = config.config_name;
            var default_value = config.default_value[config_name];
            chartObject[config_name] = options[config_name] ? options[config_name] : default_value;
            // console.log(config_name,chartObject[config_name])
        }
    }

    chartObject.clubdata_always_include_data_points = PykCharts['boolean'](chartObject.clubdata_enable) && options.clubdata_always_include_data_points ? options.clubdata_always_include_data_points : [];

    switch(chartObject.border_between_chart_elements_style) {
        case "dotted" : chartObject.border_between_chart_elements_style = "1,3";
                        break;
        case "dashed" : chartObject.border_between_chart_elements_style = "5,5";
                       break;
        default : chartObject.border_between_chart_elements_style = "0";
                  break;
    }

 

    if(chart_type === 'oneDimensionalCharts' || chart_type === 'maps') {
        if(chartObject.chart_color[0]) {
            chartObject.k.validator()
                .validatingColor(chartObject.chart_color[0],"chart_color",stylesheet.chart_color);
        }
    } else {
        for(var i = 0;i < chartObject.chart_color.length;i++) {
            if(chartObject.chart_color[i]) {
                chartObject.k.validator()
                    .validatingColor(chartObject.chart_color[i],"chart_color",stylesheet.chart_color);
            }
        }        
    }
    function convertToLowerCase(value) {
        return value.toLowerCase();
    }                  

    function findInObject(value) {
        return value in options;
    }
    // console.log(chartObject.chart_color)
    chartObject.k = new PykCharts.Configuration(chartObject);
    return chartObject;
}