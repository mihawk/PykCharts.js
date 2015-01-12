PykCharts.validation = {};
PykCharts.validation = function (chartObject, options) {
    var theme = new PykCharts.Configuration.Theme({})
	    , stylesheet = theme.stylesheet
	    , functionality = theme.functionality
	    , oneDimensionalCharts = theme.oneDimensionalCharts        
	    , multiDimensionalCharts = theme.multiDimensionalCharts;

    var config_param_info = [
    	{	
    		'config_name': 'selector',
    		'default_value': stylesheet,
    		'validation_type': 'validatingSelector'
    	},
    	{
    		'config_name': 'mode',
    		'default_value': stylesheet,
    		'validation_type': 'validatingChartMode',

    	},
    	{
    		'config_name': 'chart_color',
    		'default_value': "",
    		'validation_type': 'isArray'

    	},
    	{
    		'config_name': 'clubdata_always_include_data_points',
    		'default_value': "",
    		'validation_type': 'isArray'
    	},
    	{
    		'config_name': 'chart_width',
    		'default_value': stylesheet,
    		'validation_type': 'validatingDataType'
    	},
        {
            'config_name': 'title_size',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'subtitle_size',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'real_time_charts_refresh_frequency',
            'default_value': functionality,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'transition_duration',
            'default_value': functionality,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'border_between_chart_elements_thickness',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'label_size',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'pointer_thickness',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'pointer_size',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'clubdata_maximum_nodes',
            'default_value': oneDimensionalCharts,
            'validation_type': 'validatingDataType'
        }
        {
            'config_name': 'title_weight',
            'default_value': stylesheet,
            'validation_type': 'validatingFontWeight',
            'lower_case' : 'yes'
        },
        {
            'config_name': 'subtitle_weight',
            'default_value': stylesheet,
            'validation_type': 'validatingFontWeight',
            'lower_case' : 'yes'
        },
        {
            'config_name': 'pointer_weight',
            'default_value': stylesheet,
            'validation_type': 'validatingFontWeight',
            'lower_case' : 'yes'
        },
        {
            'config_name': 'label_weight',
            'default_value': stylesheet,
            'validation_type': 'validatingFontWeight',
            'lower_case' : 'yes'
        },
        {
            'config_name': 'background_color',
            'default_value': stylesheet,
            'validation_type': 'validatingColor'
        },
        {
            'config_name': 'title_color',
            'default_value': stylesheet,
            'validation_type': 'validatingColor'
        },
        {
            'config_name': 'subtitle_color',
            'default_value': stylesheet,
            'validation_type': 'validatingColor'
        },
        {
            'config_name': 'highlight_color',
            'default_value': stylesheet,
            'validation_type': 'validatingColor'
        },
        {
            'config_name': 'label_color',
            'default_value': stylesheet,
            'validation_type': 'validatingColor'
        },
        {
            'config_name': 'pointer_color',
            'default_value': stylesheet,
            'validation_type': 'validatingColor'
        },
        {
            'config_name': 'border_between_chart_elements_color',
            'default_value': stylesheet,
            'validation_type': 'validatingColor'
        },
        {
            'config_name': 'axis_x_pointer_values',
            'default_value': "",
            'validation_type': 'isArray'
        },
        {
            'config_name': 'axis_y_pointer_values',
            'default_value': "",
            'validation_type': 'isArray'
        },
        {
            'config_name': 'axis_x_time_value_datatype',
            'default_value': stylesheet,
            'validation_type': 'validatingTimeScaleDataType'
        },
        {
            'config_name': 'axis_y_time_value_datatype',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingTimeScaleDataType'
        },
        {
            'config_name': 'axis_x_data_format',
            'default_value': stylesheet,
            'validation_type': 'validatingAxisDataFormat'
        },
        {
            'config_name': 'axis_y_data_format',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingAxisDataFormat'
        },
        {
            'config_name': 'chart_height',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'chart_margin_left',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'chart_margin_right',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'chart_margin_top',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'chart_margin_bottom',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'axis_x_pointer_size',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'axis_y_pointer_size',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'axis_x_pointer_length',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'axis_y_pointer_length',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'axis_x_title_size',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'axis_y_title_size',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'legends_text_size',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'zoom_level',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'axis_x_outer_pointer_length',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'axis_y_outer_pointer_length',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'axis_x_pointer_padding',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'axis_y_pointer_padding',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'axis_x_no_of_axis_value',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'axis_y_no_of_axis_value',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'axis_x_time_value_interval',
            'default_value': stylesheet,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'axis_y_time_value_interval',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingDataType'
        },
        {
            'config_name': 'legends_text_color',
            'default_value': stylesheet,
            'validation_type': 'validatingColor'
        },
        {
            'config_name': 'axis_x_pointer_color',
            'default_value': stylesheet,
            'validation_type': 'validatingColor'
        },
        {
            'config_name': 'axis_y_pointer_color',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingColor'
        },
        {
            'config_name': 'axis_x_title_color',
            'default_value': stylesheet,
            'validation_type': 'validatingColor'
        },
        {
            'config_name': 'axis_y_title_color',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingColor'
        },
        {
            'config_name': 'axis_x_line_color',
            'default_value': stylesheet,
            'validation_type': 'validatingColor'
        },
        {
            'config_name': 'axis_x_line_color',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingColor'
        },
        {
            'config_name': 'annotation_font_color',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingColor'
        },
        {
            'config_name': 'annotation_background_color',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingColor'
        },
        {
            'config_name': 'annotation_border_color',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingColor'
        },
        {
            'config_name': 'chart_grid_color',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingColor'
        },
        {
            'config_name': 'legends_display',
            'default_value': stylesheet,
            'validation_type': 'validatingLegendsPosition'
        },
        {
            'config_name': 'tooltip_mode',
            'default_value': stylesheet,
            'validation_type': 'validatingTooltipMode'
        },
        {
            'config_name': 'legends_text_weight',
            'default_value': stylesheet,
            'validation_type': 'validatingFontWeight'
        },
        {
            'config_name': 'axis_y_pointer_weight',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingFontWeight'
        },
        {
            'config_name': 'axis_x_pointer_weight',
            'default_value': stylesheet,
            'validation_type': 'validatingFontWeight'
        },
        {
            'config_name': 'axis_y_title_weight',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingFontWeight'
        },
        {
            'config_name': 'axis_x_title_weight',
            'default_value': stylesheet,
            'validation_type': 'validatingFontWeight'
        },
        {
            'config_name': 'axis_y_position',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingYAxisPointerPosition'
        },
        {
            'config_name': 'axis_x_position',
            'default_value': stylesheet,
            'validation_type': 'validatingxAxisPointerPosition'
        },
        {
            'config_name': 'axis_y_pointer_position',
            'default_value': multiDimensionalCharts,
            'validation_type': 'validatingYAxisPointerPosition'
        },
        {
            'config_name': 'axis_x_pointer_position',
            'default_value': stylesheet,
            'validation_type': 'validatingxAxisPointerPosition'
        },
        {
            'config_name': 'color_mode',
            'default_value': stylesheet,
            'validation_type': 'validatingColorMode'
        }
    ]
                
        if($.isArray(chartObject.chart_color)) {
            if(chartObject.chart_color[0]) {
                chartObject.k.validator()
                    .validatingColor(chartObject.chart_color[0],"chart_color",stylesheet.chart_color);
            }
        }
    return chartObject;

}