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
        opacity : function (d,weight,data) {
            if(!(PykCharts.boolean(options.size_enable))) {
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
                    if(!item.color) {
                        checkColor = false;
                        item.color = options.colorPalette[0];
                    }
                }
            });

            if(checkGroup) {
                data.forEach(function(item) {
                    if (!unique[item.group]) {
                        if(!item.color) {
                            item.color = options.colorPalette[k];
                            k++;
                        }
                        newarr.push(item);
                        unique[item.group] = item;
                    }
                });

                var arr = [];
                var uniqueColor = {};
                k = 0;
                newarr.forEach(function(item) {
                    if (!uniqueColor[item.color]) {
                        arr.push(item);
                        uniqueColor[item.color] = item;
                    } else {
                        item.color = options.colorPalette[k];
                        k++;
                        arr.push(item);
                        uniqueColor[item.color] = item;
                    }
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
        if(d && PykCharts.boolean(options.size_enable)) {
            var z = d3.scale.linear()
                        .domain(d3.extent(data,function (d) {
                            return d.weight;
                        }))
                        .range(rad_range);
            return z(d);
        } else {
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

    chartObject.yAxisDataFormat = options.yAxisDataFormat ? options.yAxisDataFormat : multiDimensionalCharts.yAxisDataFormat
    chartObject.xAxisDataFormat = options.xAxisDataFormat ? options.xAxisDataFormat : multiDimensionalCharts.xAxisDataFormat;
    chartObject.selector = options.selector ? options.selector : "body";
    chartObject.width = options.chart_width && _.isNumber(options.chart_width) ? options.chart_width : stylesheet.chart_width;
    chartObject.height = options.chart_height && _.isNumber(options.chart_height) ? options.chart_height : stylesheet.chart_height;
    // chartObject.width = optional && optional.chart && _.isNumber(optional.chart.width) ? optional.chart.width : stylesheet.chart.width;
    // chartObject.height = optional && optional.chart &&_.isNumber(optional.chart.height) ? optional.chart.height : stylesheet.chart.height;
    chartObject.margin_left = options.chart_margin_left && _.isNumber(options.chart_margin_left) ? options.chart_margin_left : stylesheet.chart_margin_left;
    chartObject.margin_right = options.chart_margin_left && _.isNumber(options.chart_margin_right) ? options.chart_margin_right : stylesheet.chart_margin_right;
    chartObject.margin_top = options.chart_margin_top && _.isNumber(options.chart_margin_top) ? options.chart_margin_top : stylesheet.chart_margin_top;
    chartObject.margin_bottom = options.chart_margin_bottom && _.isNumber(options.chart_margin_bottom) ? options.chart_margin_bottom : stylesheet.chart_margin_bottom;
    chartObject.grid_xEnabled = options.chart_grid_xEnabled ? options.chart_grid_xEnabled : stylesheet.chart_grid_xEnabled;
    chartObject.grid_yEnabled = options.chart_grid_yEnabled ? options.chart_grid_yEnabled : stylesheet.chart_grid_yEnabled;
    chartObject.grid_color = options.chart_grid_color ? options.chart_grid_color : stylesheet.chart_grid_color;
    chartObject.mode = options.mode ? options.mode : "default";

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
    chartObject.axis_onHoverHighlightenable = PykCharts.boolean(options.axis_x_enable) && options.axis_onHoverHighlightenable ? options.axis_onHoverHighlightenable : multiDimensionalCharts.axis_onHoverHighlightenable;
    chartObject.axis_x_enable = options.axis_x_enable ? options.axis_x_enable : multiDimensionalCharts.axis_x_enable;
    chartObject.axis_x_orient = PykCharts.boolean(options.axis_x_enable) && options.axis_x_orient ? options.axis_x_orient : multiDimensionalCharts.axis_x_orient;
    chartObject.axis_x_position = PykCharts.boolean(options.axis_x_enable) && options.axis_x_position ? options.axis_x_position : multiDimensionalCharts.axis_x_position;
    chartObject.axis_x_axisColor = PykCharts.boolean(options.axis_x_enable) && options.axis_x_axisColor ? options.axis_x_axisColor : multiDimensionalCharts.axis_x_axisColor;
    chartObject.axis_x_labelColor = PykCharts.boolean(options.axis_x_enable) && options.axis_x_labelColor ? options.axis_x_labelColor : multiDimensionalCharts.axis_x_labelColor;
    chartObject.axis_x_no_of_ticks = PykCharts.boolean(options.axis_x_enable) && options.axis_x_no_of_ticks ? options.axis_x_no_of_ticks : multiDimensionalCharts.axis_x_no_of_ticks;
    chartObject.axis_x_tickPadding = PykCharts.boolean(options.axis_x_enable) && options.axis_x_tickPadding ? options.axis_x_tickPadding : multiDimensionalCharts.axis_x_tickPadding;

    // console.log(chartObject.axis_x_ticksPadding)
    chartObject.axis_x_tickSize = "axis_x_tickSize" in options && PykCharts.boolean(options.axis_x_enable) ? options.axis_x_tickSize : multiDimensionalCharts.axis_x_tickSize;
    chartObject.axis_x_tickFormat = PykCharts.boolean(options.axis_x_enable) && options.axis_x_tickFormat ? options.axis_x_tickFormat : multiDimensionalCharts.axis_x_tickFormat;
    chartObject.axis_x_tickValues = PykCharts.boolean(options.axis_x_enable) && options.axis_x_tickValues ? options.axis_x_tickValues : multiDimensionalCharts.axis_x_tickValues;
    chartObject.axis_x_outer_tick_size = "axis_x_outer_tick_size" in options && PykCharts.boolean(options.axis_x_enable) ? options.axis_x_outer_tick_size : multiDimensionalCharts.axis_x_outer_tick_size;

    chartObject.axis_y_enable = options.axis_y_enable ? options.axis_y_enable : multiDimensionalCharts.axis_y_enable;
    chartObject.axis_y_orient = PykCharts.boolean(options.axis_y_enable) && options.axis_y_orient ? options.axis_y_orient : multiDimensionalCharts.axis_y_orient;
    chartObject.axis_y_position = PykCharts.boolean(options.axis_y_enable) && options.axis_y_position ? options.axis_y_position : multiDimensionalCharts.axis_y_position;
    chartObject.axis_y_axisColor = PykCharts.boolean(options.axis_y_enable) && options.axis_y_axisColor ? options.axis_y_axisColor : multiDimensionalCharts.axis_y_axisColor;
    chartObject.axis_y_labelColor = PykCharts.boolean(options.axis_y_enable) && options.axis_y_labelColor ? options.axis_y_labelColor : multiDimensionalCharts.axis_y_labelColor;
    chartObject.axis_y_no_of_ticks = PykCharts.boolean(options.axis_y_enable) && options.axis_y_no_of_ticks ? options.axis_y_no_of_ticks : multiDimensionalCharts.axis_y_no_of_ticks;
    chartObject.axis_y_tickPadding = PykCharts.boolean(options.axis_y_enable) && options.axis_y_tickPadding ? options.axis_y_tickPadding : multiDimensionalCharts.axis_y_tickPadding;
    chartObject.axis_y_tickSize = "axis_y_tickSize" in options && PykCharts.boolean(options.axis_y_enable) ? options.axis_y_tickSize : multiDimensionalCharts.axis_y_tickSize;
    chartObject.axis_y_tickFormat = PykCharts.boolean(options.axis_y_enable) && options.axis_y_tickFormat ? options.axis_y_tickFormat : multiDimensionalCharts.axis_y_tickFormat;
    chartObject.axis_y_tickValues = PykCharts.boolean(options.axis_y_enable) && options.axis_y_tickValues ? options.axis_y_tickValues : multiDimensionalCharts.axis_y_tickValues;
    chartObject.axis_y_outer_tick_size = "axis_y_outer_tick_size" in options && PykCharts.boolean(options.axis_y_enable) ? options.axis_y_outer_tick_size : multiDimensionalCharts.axis_y_outer_tick_size;

    chartObject.legends_enable =  options.legends_enable ? options.legends_enable : multiDimensionalCharts.legends_enable;
    chartObject.legends_display = options.legends_display ? options.legends_display : multiDimensionalCharts.legends_display;

    chartObject.creditMySite_name = options.creditMySite_name ? options.creditMySite_name : stylesheet.creditMySite_name;
    chartObject.creditMySite_url = options.creditMySite_url ? options.creditMySite_url : stylesheet.creditMySite_url;
    chartObject.dataSource = options.dataSource ? options.dataSource : "no";
    chartObject.bg = options.backgroundColor ? options.backgroundColor : stylesheet.backgroundColor;
    chartObject.chartColor = options.chartColor ? options.chartColor : stylesheet.chartColor;
    chartObject.highlightColor = options.highlightColor ? options.highlightColor : stylesheet.highlightColor;
    chartObject.fullscreen = options.buttons_enableFullScreen ? options.buttons_enableFullScreen : stylesheet.buttons_enableFullScreen;
    chartObject.loading = options.loading_animationGifUrl ? options.loading_animationGifUrl: stylesheet.loading_animationGifUrl;
    chartObject.realTimeCharts_refreshFrequency = options.realTimeCharts_refreshFrequency ? options.realTimeCharts_refreshFrequency : functionality.realTimeCharts_refreshFrequency;
    chartObject.realTimeCharts_enableLastUpdatedAt = options.realTimeCharts_enableLastUpdatedAt ? options.realTimeCharts_enableLastUpdatedAt : functionality.realTimeCharts_enableLastUpdatedAt;
    chartObject.transition_duration = options.transition_duration ? options.transition_duration : functionality.transition_duration;
    chartObject.saturationEnable = options.saturation_enable ? options.saturation_enable : "no";
    chartObject.saturationColor = options.saturationColor ? options.saturationColor : stylesheet.saturationColor;

//    chartObject.enableTooltip = optional && optional.enableTooltip ? optional.enableTooltip : stylesheet.enableTooltip
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
    chartObject.ticks_strokeWidth = "ticks_strokeWidth" in options ? options.ticks_strokeWidth : stylesheet.ticks_strokeWidth;
    chartObject.ticks_size = "ticks_size" in options ? options.ticks_size : stylesheet.ticks_size;
    chartObject.ticks_color = options.ticks_color ? options.ticks_color : stylesheet.ticks_color;
    chartObject.ticks_family = options.ticks_family ? options.ticks_family : stylesheet.ticks_family;

    chartObject.zoom_enable = options.zoom_enable ? options.zoom_enable : multiDimensionalCharts.zoom_enable;

    chartObject.label_size = "label_size" in options ? options.label_size : stylesheet.label_size;
    chartObject.label_color = options.label_color ? options.label_color : stylesheet.label_color;
    chartObject.label_weight = options.label_weight ? options.label_weight : stylesheet.label_weight;
    chartObject.label_weight = (chartObject.label_weight === "thick") ? "bold" : "normal";
    chartObject.label_family = options.label_family ? options.label_family : stylesheet.label_family;

    chartObject.tooltip_enable = options.tooltip_enable ? options.tooltip_enable : multiDimensionalCharts.tooltip_enable;
    chartObject.tooltip_mode = options.tooltip_mode ? options.tooltip_mode : multiDimensionalCharts.tooltipmode;

    chartObject.legendsText_size = options.legendsText_size ? options.legendsText_size : stylesheet.legendsText_size;
    chartObject.legendsText_color = options.legendsText_color ? options.legendsText_color : stylesheet.legendsText_color;
    chartObject.legendsText_weight = options.legendsText_weight ? options.legendsText_weight : stylesheet.legendsText_weight;
    chartObject.legendsText_weight = (chartObject.legendsText_weight === "thick") ? "bold" : "normal";
    chartObject.legendsText_family = options.legendsText_family ? options.legendsText_family : stylesheet.legendsText_family;

    chartObject.size_enable = options.size_enable ? options.size_enable : multiDimensionalCharts.size_enable;
    chartObject.units = options.units ? options.units : false;

    chartObject.colorPalette = ["#b2df8a", "#1f78b4", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928", "#a6cee3"];
    chartObject.k = new PykCharts.Configuration(chartObject);

    // if (optional && optional.axis) {
    //     chartObject.axis = optional.axis;
    //     chartObject.axis.x = optional.axis.x;
    //     chartObject.axis.onHoverHighlightenable = PykCharts.boolean(optional.axis.x.enable) && optional.axis.onHoverHighlightenable ? optional.axis.onHoverHighlightenable : multiDimensionalCharts.axis.onHoverHighlightenable;
    //     chartObject.axis.x.orient = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.orient ? optional.axis.x.orient : multiDimensionalCharts.axis.x.orient;
    //     chartObject.axis.x.axisColor = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.axisColor ? optional.axis.x.axisColor : multiDimensionalCharts.axis.x.axisColor;
    //     chartObject.axis.x.labelColor = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.labelColor ? optional.axis.x.labelColor : multiDimensionalCharts.axis.x.labelColor;
    //     chartObject.axis.x.no_of_ticks = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.no_of_ticks ? optional.axis.x.no_of_ticks : multiDimensionalCharts.axis.x.no_of_ticks;
    //     chartObject.axis.x.ticksPadding = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.ticksPadding ? optional.axis.x.ticksPadding : multiDimensionalCharts.axis.x.ticksPadding;
    //     chartObject.axis.x.tickSize = "tickSize" in optional.axis.x && PykCharts.boolean(optional.axis.x.enable) ? optional.axis.x.tickSize : multiDimensionalCharts.axis.x.tickSize;
    //     chartObject.axis.x.tickFormat = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.tickFormat ? optional.axis.x.tickFormat : multiDimensionalCharts.axis.x.tickFormat;
    //     chartObject.axis.x.tickValues = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.tickValues ? optional.axis.x.tickValues : multiDimensionalCharts.axis.x.tickValues;
    //     chartObject.axis.x.outer_tick_size = "outer_tick_size" in optional.axis.x && PykCharts.boolean(optional.axis.x.enable) ? optional.axis.x.outer_tick_size : multiDimensionalCharts.axis.x.outer_tick_size;
    //     chartObject.axis.y = optional.axis.y;
    //     chartObject.axis.y.orient = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.orient ? optional.axis.y.orient : multiDimensionalCharts.axis.y.orient;
    //     chartObject.axis.y.axisColor = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.axisColor ? optional.axis.y.axisColor : multiDimensionalCharts.axis.y.axisColor;
    //     chartObject.axis.y.labelColor = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.labelColor ? optional.axis.y.labelColor : multiDimensionalCharts.axis.y.labelColor;
    //     chartObject.axis.y.no_of_ticks = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.no_of_ticks ? optional.axis.y.no_of_ticks : multiDimensionalCharts.axis.y.no_of_ticks;
    //     chartObject.axis.y.ticksPadding = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.ticksPadding ? optional.axis.y.ticksPadding : multiDimensionalCharts.axis.y.ticksPadding;
    //     chartObject.axis.y.tickSize = "tickSize" in optional.axis.y && PykCharts.boolean(optional.axis.y.enable) ? optional.axis.y.tickSize : multiDimensionalCharts.axis.y.tickSize;
    //     chartObject.axis.y.tickFormat = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.tickFormat ? optional.axis.y.tickFormat : multiDimensionalCharts.axis.y.tickFormat;
    //     chartObject.axis.y.outer_tick_size = "outer_tick_size" in optional.axis.y && PykCharts.boolean(optional.axis.y.enable) ? optional.axis.y.outer_tick_size : multiDimensionalCharts.axis.y.outer_tick_size;
    // } else {
    //     chartObject.axis = multiDimensionalCharts.axis;
    // }

    // if(optional && optional.legends) {
    //     chartObject.legends = optional.legends;
    //     chartObject.legends.enable = optional.legends.enable && optional.legends.enable ? optional.legends.enable : multiDimensionalCharts.legends.enable;
    //     chartObject.legends.display = optional.legends.display ? optional.legends.display : multiDimensionalCharts.legends.display;
    // } else {
    //     chartObject.legends =  multiDimensionalCharts.legends;
    // }

   // if (optional && optional.legendsText) {
    //     chartObject.legendsText = optional.legendsText;
    //     chartObject.legendsText.size = optional.legendsText.size ? optional.legendsText.size : stylesheet.legendsText.size;
    //     chartObject.legendsText.color = optional.legendsText.color ? optional.legendsText.color : stylesheet.legendsText.color;
    //     chartObject.legendsText.weight = optional.legendsText.weight ? optional.legendsText.weight : stylesheet.legendsText.weight;
    //     chartObject.legendsText.weight = (chartObject.legendsText.weight === "thick") ? "bold" : "normal";
    //     chartObject.legendsText.family = optional.legendsText.family ? optional.legendsText.family : stylesheet.legendsText.family;
    // } else {
    //     chartObject.legendsText = stylesheet.legendsText;
    // }
    // chartObject.units = optional && optional.units ? optional.units : false;
    // chartObject.size = optional && optional.size ? optional.size : multiDimensionalCharts.size;
    // chartObject.size.enable = optional && optional.size && optional.size.enable ? optional.size.enable : multiDimensionalCharts.size.enable;
    // if (optional && optional.tooltip) {
    //     chartObject.tooltip = optional.tooltip;
    //     chartObject.tooltip.enable = optional.tooltip.enable ? optional.tooltip.enable : multiDimensionalCharts.tooltip.enable;
    //     chartObject.tooltip.mode = optional.tooltip.mode ? optional.tooltip.mode : multiDimensionalCharts.tooltip.mode;
    // } else {
    //     chartObject.tooltip = multiDimensionalCharts.tooltip;
    // }
    return chartObject;
};
