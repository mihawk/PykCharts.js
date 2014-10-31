PykCharts.multiD = {};
var theme = new PykCharts.Configuration.Theme({});

PykCharts.multiD.configuration = function (options){
    var that = this;
    var fillColor = new PykCharts.Configuration.fillChart(options);
    var multiDConfig = {
        magnify: function(rect,gsvg,xScale){
            gsvg.on("mousemove", function() {
                var mouse = d3.mouse(this);
                xScale.focus(mouse[0]);
                rect
                .attr("x", function(d) { return xScale(d.x); })
                .attr("width", function(d) {return xScale.rangeBand(d.x);});
            });
        },
        checkChangeInData: function (data, compare_data) { // this function checks if the data in json has been changed
            var key1 = Object.keys(compare_data[0]);
            var key2 = Object.keys(data[0]);
            var changed = false;
            that.data = data.groupBy("oned");
            if(key1.length === key2.length && compare_data.length === data.length) {
                for(i=0;i<data.length;i++) {
                    for(j=0;j<key1.length;j++){
                        if(data[i][key2[j]] !== compare_data[i][key1[j]] || key1[j] !== key2[j]) {
                            changed = true;
                            break;
                        }
                    }
                }
            } else {
                changed = true;
            }
            that.compare_data = data;
            return [that.compare_data, changed];
        },
        opacity : function (d,weight,data) {
            if(!(PykCharts.boolean(options.variable_circle_size_enable))) {
                var z = d3.scale.linear()
                            .domain(d3.extent(data,function (d) {
                                return d.weight;
                            }))
                            .range([0.1,1]);

                return d ? z(d) : z(_.min(weight));
            }
            else {
                return 0.6;
            }
        },
        legendsPosition : function (chart) {
            if(status) {
                chart.optionalFeatures().legendsContainer().svgContainer();
            }else {
                chart.optionalFeatures().svgContainer();
            }
            return this;
        },
        legends: function (series,group1,data,svg) {
            if(status) {
                var j = 0,k = 0;
                j = series.length;
                k = series.length;

                if(options.legends_display === "vertical") {
                    svg.attr("height", (series.length * 30)+20)
                    text_parameter1 = "x";
                    text_parameter2 = "y";
                    rect_parameter1 = "width";
                    rect_parameter2 = "height";
                    rect_parameter3 = "x";
                    rect_parameter4 = "y";
                    rect_parameter1value = 13;
                    rect_parameter2value = 13;
                    text_parameter1value = function (d,i) { return options.chart_width - 75; };
                    rect_parameter3value = function (d,i) { return options.chart_width - 100; };
                    var rect_parameter4value = function (d,i) { return i * 24 + 12;};
                    var text_parameter2value = function (d,i) { return i * 24 + 26;};
                }
                if(options.legends_display === "horizontal"){
                    svg.attr("height",70);
                    text_parameter1 = "x";
                    text_parameter2 = "y";
                    rect_parameter1 = "width";
                    rect_parameter2 = "height";
                    rect_parameter3 = "x";
                    rect_parameter4 = "y";
                    var text_parameter1value = function (d,i) { j--;return options.chart_width - (j*100 + 75); };
                    text_parameter2value = 30;
                    rect_parameter1value = 13;
                    rect_parameter2value = 13;
                    var rect_parameter3value = function (d,i) { k--;return options.chart_width - (k*100 + 100); };
                    rect_parameter4value = 18;
                }

                that.legends_text = group1.selectAll(".legends_text")
                    .data(series);
                that.legends_text.enter()
                    .append('text')
                    .attr("class","legends_text")
                    .attr("fill","#1D1D1D")
                    .attr("pointer-events","none")
                    .style("font-family", "'Helvetica Neue',Helvetica,Arial,sans-serif");

                that.legends_text.attr("class","legends_text")
                    .attr("fill","black")
                    .attr(text_parameter1, text_parameter1value)
                    .attr(text_parameter2, text_parameter2value)
                    .text(function (d) { return d; });

                that.legends_text.exit()
                    .remove();

                that.legends_rect = group1.selectAll(".legends_rect")
                    .data(series);

                that.legends_rect.enter()
                    .append("rect")
                    .attr("class","legends_rect");

                that.legends_rect.attr("class","legends_rect")
                    .attr('fill',function (d,i) { return fillColor(data[i]); })
                    .attr("fill-opacity", function (d,i) { return options.saturation_enable === "yes" ? (i+1)/series.length : 1; })
                        .attr(rect_parameter1, rect_parameter1value)
                        .attr(rect_parameter2, rect_parameter2value)
                        .attr(rect_parameter3, rect_parameter3value)
                        .attr(rect_parameter4, rect_parameter4value);

                that.legends_rect.exit()
                    .remove();
            }
            return this;
        },
        legendsGroupStacked : function (legendsContainer,legendsGroup,names,color) {
            if(status) {
                var p = 0,a=[],k,jc,ic;
                for(i=0;i<names.length;i++) {
                    for(j=0;j<names[i].length;j++) {
                        a[p] = names[i][j];
                        p++;
                    }
                }
                jc = a.length;
                k = a.length;
                ic = -1;
                legendsContainer.attr("height",90);
                var abc = legendsGroup.selectAll(".legends_g")
                    .data(names)
                    .enter()
                    .append("g")
                    .attr("class","legends_g")
                    .attr("fill",function (d) {ic++;return color[ic];})
                abc.selectAll(".legends_rect")
                        .data(names[ic])
                        .enter()
                            .append("rect")
                            .attr("class","legends_rect")
                            .attr("x",function (d) { k--;return options.chart_width - (k*80 + 75); })
                            .attr("y", 20)
                            .attr("height",13)
                            .attr("width",13)
                            .attr("fill-opacity",function (d,i) { return options.saturation_enable === "yes" ? (names[i].length - i)/names[i].length : 1 ;});
                legendsGroup.selectAll(".legends_text")
                    .data(a)
                    .enter()
                        .append("text")
                        .attr("class","legends_text")
                        .attr("pointer-events","none")
                        .attr("x", function (d,i) {jc--;return options.chart_width - (jc*80 + 55); })
                        .attr("y",32)
                        .attr("fill","#1D1D1D")
                        .attr("font-family","'Helvetica Neue',Helvetica,Arial,sans-serif")
                        .text(function (d) { return d; });
            }
            return this;
        },
        mapGroup : function (data) {
            // console.log(data,"data");
            var newarr = [];
            var unique = {};
            var k = 0;
            var checkGroup = true;
            var checkColor = true;

            data.forEach(function (item) {
                if(item.group) {
                    checkGroup = true;
                } else {
                    checkGroup = false;
                    if(options.chart_color) {
                        checkGroup = false;
                        item.color = options.chart_color[0];
                    }else if(item.color) {
                        checkColor = false;
                        item.color = item.color;
                    } else{
                        checkColor = false;
                        item.color = options.default_color[0];
                    }
                }
            });
            i = 0
            if(checkGroup) {
                data.forEach(function(item) {
                    if (!unique[item.group] && item.color) {
                        unique[item.group] = item;
                        if(options.chart_color.length !== 0 && PykCharts.boolean(options.chart_color[k])) {
                            item.color = options.chart_color[k];
                        }else if(item.color) {
                            item.color = item.color;
                        } else {
                            item.color = options.default_color;
                        }
                        if(i<data.length-2 &&item.group !== data[i+1].group) {
                            k++;
                        }
                        newarr.push(item);
                    } else {
                        if(i<data.length-2 &&item.group !== data[i+1].group) {
                            k++;
                        }
                    }
                    i++;
                });
                k=0;i=0;
                data.forEach(function(item) {
                    if(!unique[item.group]) {
                        unique[item.group] = item;
                        if(options.chart_color.length !== 0 && PykCharts.boolean(options.chart_color[k])) {
                            item.color = options.chart_color[k];
                        } else {
                            item.color = options.default_color;
                        }
                        if(i<data.length-2 &&item.group !== data[i+1].group) {
                            k++;
                        }
                        newarr.push(item);
                    } else {
                        if(i<data.length-2 && item.group !== data[i+1].group) {
                            k++;
                        }
                    }
                    i++;
                })

                var arr = [];
                var uniqueColor = {};
                k = 0;
                newarr.forEach(function(item) {
                    arr.push(item);
                });
                var arr_length = arr.length,
                data_length = data.length;
                for(var i = 0;i < arr_length; i++) {
                    for(var j = 0;j<data_length;j++) {
                        if(data[j].group === arr[i].group) {
                            data[j].color = arr[i].color;
                        }
                    }
                }
                // console.log(arr,checkGroup,"before return");
                return [arr,checkGroup];
            } else {
                return [data,checkGroup];
            }
        }

    };
    return multiDConfig;
};

PykCharts.multiD.mouseEvent = function (options) {
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

PykCharts.multiD.bubbleSizeCalculation = function (options,data,rad_range) {
    var size = function (d) {
        if(d && PykCharts.boolean(options.variable_circle_size_enable)) {
            var z = d3.scale.linear()
                        .domain(d3.extent(data,function (d) {
                            return d.weight;
                        }))
                        .range(rad_range);
            return z(d);
        } else {
            // console.log("Same Radius >>> ",options.bubbleRadius,options.selector);
            return options.bubbleRadius;
        }
    };
    return size;
};

PykCharts.multiD.processInputs = function (chartObject, options) {

    var theme = new PykCharts.Configuration.Theme({}),
        stylesheet = theme.stylesheet,
        functionality = theme.functionality,
        multiDimensionalCharts = theme.multiDimensionalCharts,
        optional = options.optional;

    // chartObject.axis_y_data_format = options.axis_y_data_format ? options.axis_y_data_format : multiDimensionalCharts.axis_y_data_format;
    // chartObject.axis_x_data_format = options.axis_x_data_format ? options.axis_x_data_format : multiDimensionalCharts.axis_x_data_format;
    chartObject.selector = options.selector ? options.selector : "body";
    chartObject.panels_enable = options.panels_enable ? options.panels_enable.toLowerCase() : multiDimensionalCharts.panels_enable;
    // if(options.chart_width && !PykCharts.boolean(chartObject.panels_enable)) {
    //     var targetWidth = $(options.selector).width();
    //     options.chart_width = targetWidth < options.chart_width ? targetWidth : options.chart_width;
    // }
    chartObject.width = options.chart_width ? options.chart_width : stylesheet.chart_width;
    chartObject.height = options.chart_height ? options.chart_height : stylesheet.chart_height;

    chartObject.margin_left = options.chart_margin_left  ? options.chart_margin_left : stylesheet.chart_margin_left;
    chartObject.margin_right = options.chart_margin_right  ? options.chart_margin_right : stylesheet.chart_margin_right;
    chartObject.margin_top = options.chart_margin_top  ? options.chart_margin_top : stylesheet.chart_margin_top;
    chartObject.margin_bottom = options.chart_margin_bottom  ? options.chart_margin_bottom : stylesheet.chart_margin_bottom;

    chartObject.grid_x_enable = options.chart_grid_x_enable ? options.chart_grid_x_enable.toLowerCase() : multiDimensionalCharts.chart_grid_x_enable;
    chartObject.grid_y_enable = options.chart_grid_y_enable ? options.chart_grid_y_enable.toLowerCase() : multiDimensionalCharts.chart_grid_y_enable;
    chartObject.grid_color = options.chart_grid_color ? options.chart_grid_color.toLowerCase() : multiDimensionalCharts.chart_grid_color;
    chartObject.mode = options.mode ? options.mode.toLowerCase() : "default";
    chartObject.color_mode = options.color_mode ? options.color_mode.toLowerCase() : stylesheet.color_mode;

    if (options &&  PykCharts.boolean (options.title_text)) {
        chartObject.title_text = options.title_text;
        chartObject.title_size = "title_size" in options ? options.title_size : stylesheet.title_size;
        chartObject.title_color = options.title_color ? options.title_color : stylesheet.title_color;
        chartObject.title_weight = options.title_weight ? options.title_weight.toLowerCase() : stylesheet.title_weight;
        chartObject.title_family = options.title_family ? options.title_family.toLowerCase() : stylesheet.title_family;
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
        chartObject.subtitle_weight = options.subtitle_weight ? options.subtitle_weight.toLowerCase() : stylesheet.subtitle_weight;
        chartObject.subtitle_family = options.subtitle_family ? options.subtitle_family.toLowerCase() : stylesheet.subtitle_family;
    } else {
        chartObject.subtitle_size = stylesheet.subtitle_size;
        chartObject.subtitle_color = stylesheet.subtitle_color;
        chartObject.subtitle_weight = stylesheet.subtitle_weight;
        chartObject.subtitle_family = stylesheet.subtitle_family;
    }

    chartObject.axis_x_enable = options.axis_x_enable ? options.axis_x_enable.toLowerCase() : stylesheet.axis_x_enable;
    chartObject.axis_onhover_hightlight_enable = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_onhover_hightlight_enable ? options.axis_onhover_hightlight_enable.toLowerCase() : multiDimensionalCharts.axis_onhover_hightlight_enable;
    chartObject.axis_x_title = options.axis_x_title ? options.axis_x_title : stylesheet.axis_x_title;
    chartObject.axis_x_pointer_position = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_pointer_position ? options.axis_x_pointer_position.toLowerCase(): stylesheet.axis_x_pointer_position;
    chartObject.axis_x_position = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_position ? options.axis_x_position.toLowerCase() : stylesheet.axis_x_position;
    chartObject.axis_x_line_color = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_line_color ? options.axis_x_line_color : stylesheet.axis_x_line_color;
    // chartObject.axis_x_label_color = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_label_color ? options.axis_x_label_color.toLowerCase() : stylesheet.axis_x_label_color;

    chartObject.axis_x_no_of_axis_value = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_no_of_axis_value ? options.axis_x_no_of_axis_value : stylesheet.axis_x_no_of_axis_value;
    chartObject.axis_x_pointer_padding = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_pointer_padding ? options.axis_x_pointer_padding : stylesheet.axis_x_pointer_padding;

    chartObject.axis_x_pointer_length = "axis_x_pointer_length" in options && PykCharts.boolean(chartObject.axis_x_enable) ? options.axis_x_pointer_length : stylesheet.axis_x_pointer_length;
    chartObject.axis_x_value_format = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_value_format ? options.axis_x_value_format : stylesheet.axis_x_value_format;

    chartObject.axis_x_pointer_values = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_pointer_values ? options.axis_x_pointer_values : stylesheet.axis_x_pointer_values;
    chartObject.axis_x_outer_pointer_length = "axis_x_outer_pointer_length" in options && PykCharts.boolean(chartObject.axis_x_enable) ? options.axis_x_outer_pointer_length : stylesheet.axis_x_outer_pointer_length;
    chartObject.axis_x_time_value_datatype = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_time_value_datatype ? options.axis_x_time_value_datatype.toLowerCase() : stylesheet.axis_x_time_value_datatype;
    chartObject.axis_x_time_value_interval = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_time_value_interval ? options.axis_x_time_value_interval : stylesheet.axis_x_time_value_interval;

    chartObject.axis_x_title_color = options.axis_x_title_color ? options.axis_x_title_color : stylesheet.axis_x_title_color;
    chartObject.axis_x_title_weight = options.axis_x_title_weight ? options.axis_x_title_weight.toLowerCase() : stylesheet.axis_x_title_weight;
    chartObject.axis_x_title_family = options.axis_x_title_family ? options.axis_x_title_family.toLowerCase() : stylesheet.axis_x_title_family;
    chartObject.axis_x_title_size = "axis_x_title_size" in options ? options.axis_x_title_size : stylesheet.axis_x_title_size;

    chartObject.axis_x_pointer_size = "axis_x_pointer_size" in options ? options.axis_x_pointer_size : stylesheet.axis_x_pointer_size;
    chartObject.axis_x_pointer_weight = options.axis_x_pointer_weight ? options.axis_x_pointer_weight.toLowerCase() : stylesheet.axis_x_pointer_weight;
    chartObject.axis_x_pointer_family = options.axis_x_pointer_family ? options.axis_x_pointer_family.toLowerCase() : stylesheet.axis_x_pointer_family;
    chartObject.axis_x_pointer_color = options.axis_x_pointer_color ? options.axis_x_pointer_color : stylesheet.axis_x_pointer_color;

    chartObject.axis_y_enable = options.axis_y_enable ? options.axis_y_enable.toLowerCase() : multiDimensionalCharts.axis_y_enable;
    chartObject.axis_y_title =  options.axis_y_title ? options.axis_y_title : multiDimensionalCharts.axis_y_title;
    chartObject.axis_y_pointer_position = PykCharts.boolean(chartObject.axis_y_enable) && options.axis_y_pointer_position ? options.axis_y_pointer_position.toLowerCase() : multiDimensionalCharts.axis_y_pointer_position;
    chartObject.axis_y_position = PykCharts.boolean(chartObject.axis_y_enable) && options.axis_y_position ? options.axis_y_position.toLowerCase(): multiDimensionalCharts.axis_y_position;
    chartObject.axis_y_line_color = PykCharts.boolean(chartObject.axis_y_enable) && options.axis_y_line_color ? options.axis_y_line_color : multiDimensionalCharts.axis_y_line_color;
    // chartObject.axis_y_label_color = PykCharts.boolean(chartObject.axis_y_enable) && options.axis_y_label_color ? options.axis_y_label_color.toLowerCase() : multiDimensionalCharts.axis_y_label_color;

    chartObject.axis_y_no_of_axis_value = PykCharts.boolean(chartObject.axis_y_enable) && options.axis_y_no_of_axis_value ? options.axis_y_no_of_axis_value : multiDimensionalCharts.axis_y_no_of_axis_value;
    chartObject.axis_y_pointer_padding = PykCharts.boolean(chartObject.axis_y_enable) && options.axis_y_pointer_padding ? options.axis_y_pointer_padding : multiDimensionalCharts.axis_y_pointer_padding;

    chartObject.axis_y_pointer_length = "axis_y_pointer_length" in options && PykCharts.boolean(chartObject.axis_y_enable) ? options.axis_y_pointer_length : multiDimensionalCharts.axis_y_pointer_length;
    chartObject.axis_y_value_format = PykCharts.boolean(chartObject.axis_y_enable) && options.axis_y_value_format ? options.axis_y_value_format : multiDimensionalCharts.axis_y_value_format;
    chartObject.axis_y_pointer_values = PykCharts.boolean(chartObject.axis_y_enable) && options.axis_y_pointer_values ? options.axis_y_pointer_values : multiDimensionalCharts.axis_y_pointer_values;
    chartObject.axis_y_outer_pointer_length = "axis_y_outer_pointer_length" in options && PykCharts.boolean(chartObject.axis_y_enable) ? options.axis_y_outer_pointer_length : multiDimensionalCharts.axis_y_outer_pointer_length;
    chartObject.axis_y_time_value_datatype = PykCharts.boolean(chartObject.axis_y_enable) && options.axis_y_time_value_datatype ? options.axis_y_time_value_datatype.toLowerCase(): multiDimensionalCharts.axis_y_time_value_datatype;
    chartObject.axis_y_time_value_interval = PykCharts.boolean(chartObject.axis_y_enable) && options.axis_y_time_value_interval ? options.axis_y_time_value_interval : multiDimensionalCharts.axis_y_time_value_interval;

    chartObject.axis_y_pointer_size = "axis_y_pointer_size" in options ? options.axis_y_pointer_size : multiDimensionalCharts.axis_y_pointer_size;
    chartObject.axis_y_pointer_weight = options.axis_y_pointer_weight ? options.axis_y_pointer_weight.toLowerCase() : multiDimensionalCharts.axis_y_pointer_weight;
    chartObject.axis_y_pointer_family = options.axis_y_pointer_family ? options.axis_y_pointer_family.toLowerCase() : multiDimensionalCharts.axis_y_pointer_family;
    chartObject.axis_y_pointer_color = options.axis_y_pointer_color ? options.axis_y_pointer_color : multiDimensionalCharts.axis_y_pointer_color;

    chartObject.axis_y_title_color = options.axis_y_title_color ? options.axis_y_title_color : multiDimensionalCharts.axis_y_title_color;
    chartObject.axis_y_title_weight = options.axis_y_title_weight ? options.axis_y_title_weight : multiDimensionalCharts.axis_y_title_weight;
    chartObject.axis_y_title_family = options.axis_y_title_family ? options.axis_y_title_family : multiDimensionalCharts.axis_y_title_family;
    chartObject.axis_y_title_size = "axis_y_title_size" in options ? options.axis_y_title_size : multiDimensionalCharts.axis_y_title_size;

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

    chartObject.background_color = options.background_color ? options.background_color : stylesheet.background_color;

    chartObject.chart_color = options.chart_color ? options.chart_color : [];
    chartObject.default_color = stylesheet.chart_color;
    chartObject.highlight_color = options.highlight_color ? options.highlight_color : stylesheet.highlight_color;
    chartObject.saturation_color = options.saturation_color ? options.saturation_color : stylesheet.saturation_color;

    chartObject.fullscreen_enable = options.fullscreen_enable ? options.fullscreen_enable : stylesheet.fullscreen_enable;
    chartObject.loading = options.loading_gif_url ? options.loading_gif_url: stylesheet.loading_gif_url;
    chartObject.real_time_charts_refresh_frequency = options.real_time_charts_refresh_frequency ? options.real_time_charts_refresh_frequency : functionality.real_time_charts_refresh_frequency;
    chartObject.real_time_charts_last_updated_at_enable = options.real_time_charts_last_updated_at_enable ? options.real_time_charts_last_updated_at_enable.toLowerCase() : functionality.real_time_charts_last_updated_at_enable;

    chartObject.transition_duration = options.transition_duration ? options.transition_duration : functionality.transition_duration;
    // chartObject.saturationEnable = options.saturation_enable ? options.saturation_enable : "no";

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

    chartObject.pointer_thickness = "pointer_thickness" in options ? options.pointer_thickness : stylesheet.pointer_thickness;
    chartObject.pointer_size = "pointer_size" in options ? options.pointer_size : stylesheet.pointer_size;
    chartObject.pointer_color = options.pointer_color ? options.pointer_color : stylesheet.pointer_color;
    chartObject.pointer_family = options.pointer_family ? options.pointer_family.toLowerCase() : stylesheet.pointer_family;
    chartObject.pointer_weight = options.pointer_weight ? options.pointer_weight.toLowerCase(): stylesheet.pointer_weight;
    chartObject.zoom_enable = options.zoom_enable ? options.zoom_enable.toLowerCase() : multiDimensionalCharts.zoom_enable;
    chartObject.zoom_level = options.zoom_level ? options.zoom_level : multiDimensionalCharts.zoom_level;

    chartObject.label_size = "label_size" in options ? options.label_size : stylesheet.label_size;
    chartObject.label_color = options.label_color ? options.label_color : stylesheet.label_color;
    chartObject.label_weight = options.label_weight ? options.label_weight.toLowerCase() : stylesheet.label_weight;
    chartObject.label_family = options.label_family ? options.label_family.toLowerCase() : stylesheet.label_family;

    chartObject.tooltip_enable = options.tooltip_enable ? options.tooltip_enable.toLowerCase() : stylesheet.tooltip_enable;
    chartObject.tooltip_mode = options.tooltip_mode ? options.tooltip_mode.toLowerCase() : stylesheet.tooltip_mode;

    chartObject.annotation_enable = options.annotation_enable ? options.annotation_enable : multiDimensionalCharts.annotation_enable;
    chartObject.annotation_view_mode = options.annotation_view_mode ? options.annotation_view_mode : multiDimensionalCharts.annotation_view_mode;
    chartObject.annotation_background_color = options.annotation_background_color ? options.annotation_background_color : multiDimensionalCharts.annotation_background_color;
    chartObject.annotation_border_color = options.annotation_border_color ? options.annotation_border_color : multiDimensionalCharts.annotation_border_color;
    chartObject.annotation_font_color = options.annotation_font_color ? options.annotation_font_color : multiDimensionalCharts.annotation_font_color;

    chartObject.legends_enable = options.legends_enable ? options.legends_enable.toLowerCase() : stylesheet.legends_enable;
    chartObject.legends_display = options.legends_display ? options.legends_display.toLowerCase() : stylesheet.legends_display;
    chartObject.legends_text_size = options.legends_text_size ? options.legends_text_size : stylesheet.legends_text_size;
    chartObject.legends_text_color = options.legends_text_color ? options.legends_text_color : stylesheet.legends_text_color;

    chartObject.legends_text_weight = options.legends_text_weight ? options.legends_text_weight.toLowerCase() : stylesheet.legends_text_weight;
    chartObject.legends_text_family = options.legends_text_family ? options.legends_text_family.toLowerCase() : stylesheet.legends_text_family;
    chartObject.highlight = options.highlight ? options.highlight : stylesheet.highlight;
    chartObject.variable_circle_size_enable = options.variable_circle_size_enable ? options.variable_circle_size_enable : multiDimensionalCharts.variable_circle_size_enable;
    // chartObject.units = options.units ? options.units : false;
    // chartObject.colorPalette = ["#b2df8a", "#1f78b4", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928", "#a6cee3"];
    chartObject.export_enable = options.export_enable ? options.export_enable.toLowerCase() : stylesheet.export_enable;
    // chartObject.export_image_url = options.export_image_url ? options.export_image_url : stylesheet.export_image_url;
    chartObject.k = new PykCharts.Configuration(chartObject);
    chartObject.k.validator().validatingSelector(chartObject.selector.substring(1,chartObject.selector.length))
                .validatingChartMode(chartObject.mode)
                .validatingDataType(chartObject.width,"chart_width")
                .validatingDataType(chartObject.height,"chart_height")
                .validatingDataType(chartObject.margin_left,"chart_margin_left")
                .validatingDataType(chartObject.margin_right,"chart_margin_right")
                .validatingDataType(chartObject.margin_top,"chart_margin_top")
                .validatingDataType(chartObject.margin_bottom,"chart_margin_bottom")
                .validatingDataType(chartObject.title_size,"title_size")
                .validatingDataType(chartObject.subtitle_size,"subtitle_size")
                .validatingDataType(chartObject.real_time_charts_refresh_frequency,"real_time_charts_refresh_frequency")
                .validatingDataType(chartObject.transition_duration,"transition_duration")
                .validatingDataType(chartObject.border_between_chart_elements_thickness,"border_between_chart_elements_thickness")
                .validatingDataType(chartObject.axis_x_pointer_size,"axis_x_pointer_size")
                .validatingDataType(chartObject.axis_y_pointer_size,"axis_y_pointer_size")
                .validatingDataType(chartObject.axis_x_pointer_length,"axis_x_pointer_length")
                .validatingDataType(chartObject.axis_y_pointer_length,"axis_y_pointer_length")
                .validatingDataType(chartObject.axis_x_title_size,"axis_x_title_size")
                .validatingDataType(chartObject.axis_y_title_size,"axis_y_title_size")
                .validatingDataType(chartObject.label_size,"label_size")
                .validatingDataType(chartObject.legends_text_size ,"legends_text_size")
                .validatingDataType(chartObject.zoom_level,"zoom_level")
                .validatingDataType(chartObject.pointer_thickness,"pointer_thickness")
                .validatingDataType(chartObject.pointer_size,"pointer_size")
                .validatingDataType(chartObject.axis_x_outer_pointer_length,"axis_x_outer_pointer_length")
                .validatingDataType(chartObject.axis_y_outer_pointer_length,"axis_y_outer_pointer_length")
                .validatingDataType(chartObject.axis_x_pointer_padding,"axis_x_pointer_padding")
                .validatingDataType(chartObject.axis_y_pointer_padding,"axis_y_pointer_padding")
                .validatingDataType(chartObject.axis_x_no_of_axis_value,"axis_x_no_of_axis_value")
                .validatingDataType(chartObject.axis_y_no_of_axis_value,"axis_y_no_of_axis_value")
                .validatingDataType(chartObject.axis_x_time_value_interval,"axis_x_time_value_interval")
                .validatingDataType(chartObject.axis_y_time_value_interval,"axis_y_time_value_interval")
                .validatingAxisDataFormat(options.axis_x_data_format,"axis_x_data_format")
                .validatingAxisDataFormat(options.axis_y_data_format,"axis_y_data_format")
                .validatingColorMode(chartObject.color_mode,"color_mode")
                .validatingYAxisPointerPosition(chartObject.axis_y_pointer_position,"axis_y_pointer_position")
                .validatingXAxisPointerPosition(chartObject.axis_x_pointer_position,"axis_x_pointer_position")
                .validatingXAxisPointerPosition(chartObject.axis_x_position,"axis_x_position")
                .validatingYAxisPointerPosition(chartObject.axis_y_position,"axis_y_position")
                .validatingBorderBetweenChartElementsStyle(chartObject.border_between_chart_elements_style,"border_between_chart_elements_style")
                .validatingLegendsPosition(chartObject.legends_display,"legends_display")
                .isArray(chartObject.axis_x_pointer_values,"axis_x_pointer_values")
                .isArray(chartObject.axis_y_pointer_values,"axis_y_pointer_values")
                .isArray(chartObject.chart_color,"chart_color")
                .validatingTimeScaleDataType(chartObject.axis_x_time_value_datatype,"axis_x_time_value_datatype")
                .validatingTimeScaleDataType(chartObject.axis_y_time_value_datatype,"axis_y_time_value_datatype")
                .validatingTooltipMode(chartObject.tooltip_mode,"tooltip_mode")
                .validatingFontWeight(chartObject.title_weight,"title_weight")
                .validatingFontWeight(chartObject.subtitle_weight,"subtitle_weight")
                .validatingFontWeight(chartObject.pointer_weight,"pointer_weight")
                .validatingFontWeight(chartObject.label_weight,"label_weight")
                .validatingFontWeight(chartObject.legends_text_weight,"legends_text_weight")
                .validatingFontWeight(chartObject.axis_x_pointer_weight,"axis_x_pointer_weight")
                .validatingFontWeight(chartObject.axis_y_pointer_weight,"axis_y_pointer_weight")
                .validatingFontWeight(chartObject.axis_x_title_weight,"axis_x_title_weight")
                .validatingFontWeight(chartObject.axis_y_title_weight,"axis_y_title_weight")
                .validatingColor(chartObject.background_color,"background_color")
                .validatingColor(chartObject.grid_color,"chart_grid_color")
                .validatingColor(chartObject.title_color,"title_color")
                .validatingColor(chartObject.subtitle_color,"subtitle_color")
                .validatingColor(chartObject.axis_x_line_color,"axis_x_line_color")
                .validatingColor(chartObject.axis_y_line_color,"axis_y_line_color")
                .validatingColor(chartObject.axis_x_title_color,"axis_x_title_color")
                .validatingColor(chartObject.axis_y_title_color,"axis_y_title_color")
                .validatingColor(chartObject.axis_x_pointer_color,"axis_x_pointer_color")
                .validatingColor(chartObject.axis_y_pointer_color,"axis_y_pointer_color")
                .validatingColor(chartObject.highlight_color,"highlight_color")
                .validatingColor(chartObject.saturation_color,"saturation_color")
                .validatingColor(chartObject.pointer_color,"pointer_color")
                .validatingColor(chartObject.label_color,"label_color")
                .validatingColor(chartObject.annotation_border_color,"annotation_border_color")
                .validatingColor(chartObject.annotation_background_color,"annotation_background_color")
                .validatingColor(chartObject.annotation_font_color,"annotation_font_color")
                .validatingColor(chartObject.legends_text_color,"legends_text_color");

        if($.isArray(chartObject.chart_color)) {
            for(var i = 0;i < chartObject.chart_color.length;i++) {
                if(chartObject.chart_color[i]) {
                    chartObject.k.validator()
                        .validatingColor(chartObject.chart_color[i],"chart_color");
                }
            }
        }
                                // .validatingDataType(,"");
    return chartObject;
};
