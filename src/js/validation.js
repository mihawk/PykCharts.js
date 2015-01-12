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
        }/*,
        {
            'config_name': '',
            'default_value': stylesheet,
            'validation_type': ''
        },
        {
            'config_name': '',
            'default_value': stylesheet,
            'validation_type': ''
        }*/
    ]

        if($.isArray(chartObject.chart_color)) {
            if(chartObject.chart_color[0]) {
                chartObject.k.validator()
                    .validatingColor(chartObject.chart_color[0],"chart_color",stylesheet.chart_color);
            }
        }
    return chartObject;

}