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
            if(!(PykCharts.boolean(options.size.enable))) {
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

                if(options.optional.legends.display === "vertical") {
                    svg.attr("height", (series.length * 30)+20)
                    text_parameter1 = "x";
                    text_parameter2 = "y";
                    rect_parameter1 = "width";
                    rect_parameter2 = "height";
                    rect_parameter3 = "x";
                    rect_parameter4 = "y";
                    rect_parameter1value = 13;
                    rect_parameter2value = 13;
                    text_parameter1value = function (d,i) { return options.optional.chart.width - 75; };
                    rect_parameter3value = function (d,i) { return options.optional.chart.width - 100; };
                    var rect_parameter4value = function (d,i) { return i * 24 + 12;};
                    var text_parameter2value = function (d,i) { return i * 24 + 26;};
                }
                if(options.optional.legends.display === "horizontal"){                    
                    svg.attr("height",70);
                    text_parameter1 = "x";
                    text_parameter2 = "y";
                    rect_parameter1 = "width";
                    rect_parameter2 = "height";
                    rect_parameter3 = "x";
                    rect_parameter4 = "y";
                    var text_parameter1value = function (d,i) { j--;return options.optional.chart.width - (j*100 + 75); };
                    text_parameter2value = 30;
                    rect_parameter1value = 13;
                    rect_parameter2value = 13;
                    var rect_parameter3value = function (d,i) { k--;return options.optional.chart.width - (k*100 + 100); };
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
                    .attr("fill-opacity", function (d,i) { return options.optional.saturation.enable === "yes" ? (i+1)/series.length : 1; })
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
                            .attr("x",function (d) { k--;return options.optional.chart.width - (k*80 + 75); })
                            .attr("y", 20)
                            .attr("height",13)
                            .attr("width",13)
                            .attr("fill-opacity",function (d,i) { return options.optional.saturation.enable === "yes" ? (names[i].length - i)/names[i].length : 1 ;});
                legendsGroup.selectAll(".legends_text")
                    .data(a)
                    .enter()
                        .append("text")
                        .attr("class","legends_text")
                        .attr("pointer-events","none")
                        .attr("x", function (d,i) {jc--;return options.optional.chart.width - (jc*80 + 55); })
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
        if(d && PykCharts.boolean(options.size.enable)) {
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
        //, functionality = theme.functionality,
        multiDimensionalCharts = theme.multiDimensionalCharts,
        optional = options.optional;

    chartObject.yAxisDataFormat = options.yAxisDataFormat ? options.yAxisDataFormat : multiDimensionalCharts.yAxisDataFormat
    chartObject.xAxisDataFormat = options.xAxisDataFormat ? options.xAxisDataFormat : multiDimensionalCharts.xAxisDataFormat;
    chartObject.selector = options.selector ? options.selector : "body";
    chartObject.width = optional.chart && _.isNumber(optional.chart.width) ? optional.chart.width : stylesheet.chart.width;
    chartObject.height = optional.chart &&_.isNumber(optional.chart.height) ? optional.chart.height : stylesheet.chart.height;
    chartObject.margin = optional.chart && optional.chart.margin ? optional.chart.margin : stylesheet.chart.margin;
    chartObject.margin.left = optional.chart && optional.chart.margin && _.isNumber(optional.chart.margin.left) ? optional.chart.margin.left : stylesheet.chart.margin.left;
    chartObject.margin.right = optional.chart && optional.chart.margin && _.isNumber(optional.chart.margin.right) ? optional.chart.margin.right : stylesheet.chart.margin.right;
    chartObject.margin.top = optional.chart && optional.chart.margin && _.isNumber(optional.chart.margin.top) ? optional.chart.margin.top : stylesheet.chart.margin.top;
    chartObject.margin.bottom = optional.chart && optional.chart.margin && _.isNumber(optional.chart.margin.bottom) ? optional.chart.margin.bottom : stylesheet.chart.margin.bottom;
    chartObject.grid =  optional.chart && optional.chart.grid ? optional.chart.grid : stylesheet.chart.grid;
    chartObject.grid.xEnabled = optional.chart && optional.chart.grid ? optional.chart.grid.xEnabled : stylesheet.chart.grid.xEnabled;
    chartObject.grid.yEnabled = optional.chart && optional.chart.grid ? optional.chart.grid.yEnabled : stylesheet.chart.grid.yEnabled;
    chartObject.grid.color = optional.chart && optional.chart.grid ? optional.chart.grid.color : stylesheet.chart.grid.color;
    // chartObject.width = options.chart && _.isNumber(options.chart.width) ? options.chart.width : stylesheet.chart.width;
    // chartObject.height = options.chart && _.isNumber(options.chart.height) ? options.chart.height : stylesheet.chart.height;
    // chartObject.margin = options.chart && options.chart.margin ? options.chart.margin : stylesheet.chart.margin;
    // chartObject.margin.left = options.chart && options.chart.margin && _.isNumber(options.chart.margin.left) ? options.chart.margin.left : stylesheet.chart.margin.left;
    // chartObject.margin.right = options.chart && options.chart.margin && _.isNumber(options.chart.margin.right) ? options.chart.margin.right : stylesheet.chart.margin.right;
    // chartObject.margin.top = options.chart && options.chart.margin && _.isNumber(options.chart.margin.top) ? options.chart.margin.top : stylesheet.chart.margin.top;
    // chartObject.margin.bottom = options.chart && options.chart.margin && _.isNumber(options.chart.margin.bottom) ? options.chart.margin.bottom : stylesheet.chart.margin.bottom;
    chartObject.mode = options.mode ? options.mode : "default";
    if (optional && optional.title) {
        chartObject.title = optional.title;
        chartObject.title.size = optional.title.size ? optional.title.size : stylesheet.title.size;
        chartObject.title.color = optional.title.color ? optional.title.color : stylesheet.title.color;
        chartObject.title.weight = optional.title.weight ? optional.title.weight : stylesheet.title.weight;
        chartObject.title.family = optional.title.family ? optional.title.family : stylesheet.title.family;
    } else {
        chartObject.title = stylesheet.title;
    }
    if (optional && optional.subtitle) {
        chartObject.subtitle = optional.subtitle;
        chartObject.subtitle.size = optional.subtitle.size ? optional.subtitle.size : stylesheet.subtitle.size;
        chartObject.subtitle.color = optional.subtitle.color ? optional.subtitle.color : stylesheet.subtitle.color;
        chartObject.subtitle.weight = optional.subtitle.weight ? optional.subtitle.weight : stylesheet.subtitle.weight;
        chartObject.subtitle.family = optional.subtitle.family ? optional.subtitle.family : stylesheet.subtitle.family;
    } else {
        chartObject.subtitle = stylesheet.subtitle;
    }
    if (optional && optional.axis) {
        chartObject.axis = optional.axis;
        chartObject.axis.x = optional.axis.x;
        chartObject.axis.onHoverHighlightenable = PykCharts.boolean(optional.axis.x.enable) && optional.axis.onHoverHighlightenable ? optional.axis.onHoverHighlightenable : multiDimensionalCharts.axis.onHoverHighlightenable;
        chartObject.axis.x.orient = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.orient ? optional.axis.x.orient : multiDimensionalCharts.axis.x.orient;
        chartObject.axis.x.axisColor = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.axisColor ? optional.axis.x.axisColor : multiDimensionalCharts.axis.x.axisColor;
        chartObject.axis.x.labelColor = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.labelColor ? optional.axis.x.labelColor : multiDimensionalCharts.axis.x.labelColor;
        chartObject.axis.x.no_of_ticks = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.no_of_ticks ? optional.axis.x.no_of_ticks : multiDimensionalCharts.axis.x.no_of_ticks;
        chartObject.axis.x.ticksPadding = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.ticksPadding ? optional.axis.x.ticksPadding : multiDimensionalCharts.axis.x.ticksPadding;
        chartObject.axis.x.tickSize = "tickSize" in optional.axis.x && PykCharts.boolean(optional.axis.x.enable) ? optional.axis.x.tickSize : multiDimensionalCharts.axis.x.tickSize;
        chartObject.axis.x.tickFormat = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.tickFormat ? optional.axis.x.tickFormat : multiDimensionalCharts.axis.x.tickFormat;
        chartObject.axis.x.tickValues = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.tickValues ? optional.axis.x.tickValues : multiDimensionalCharts.axis.x.tickValues;
        chartObject.axis.x.outer_tick_size = "outer_tick_size" in optional.axis.x && PykCharts.boolean(optional.axis.x.enable) ? optional.axis.x.outer_tick_size : multiDimensionalCharts.axis.x.outer_tick_size;
        chartObject.axis.y = optional.axis.y;
        chartObject.axis.y.orient = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.orient ? optional.axis.y.orient : multiDimensionalCharts.axis.y.orient;
        chartObject.axis.y.axisColor = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.axisColor ? optional.axis.y.axisColor : multiDimensionalCharts.axis.y.axisColor;
        chartObject.axis.y.labelColor = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.labelColor ? optional.axis.y.labelColor : multiDimensionalCharts.axis.y.labelColor;
        chartObject.axis.y.no_of_ticks = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.no_of_ticks ? optional.axis.y.no_of_ticks : multiDimensionalCharts.axis.y.no_of_ticks;
        chartObject.axis.y.ticksPadding = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.ticksPadding ? optional.axis.y.ticksPadding : multiDimensionalCharts.axis.y.ticksPadding;
        chartObject.axis.y.tickSize = "tickSize" in optional.axis.y && PykCharts.boolean(optional.axis.y.enable) ? optional.axis.y.tickSize : multiDimensionalCharts.axis.y.tickSize;
        chartObject.axis.y.tickFormat = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.tickFormat ? optional.axis.y.tickFormat : multiDimensionalCharts.axis.y.tickFormat;
        chartObject.axis.y.outer_tick_size = "outer_tick_size" in optional.axis.y && PykCharts.boolean(optional.axis.y.enable) ? optional.axis.y.outer_tick_size : multiDimensionalCharts.axis.y.outer_tick_size;
    } else {
        chartObject.axis = multiDimensionalCharts.axis;
    }

    if(optional && optional.legends) {
        chartObject.legends = optional.legends;
        chartObject.legends.enable = optional.legends.enable && optional.legends.enable ? optional.legends.enable : multiDimensionalCharts.legends.enable;
        chartObject.legends.display = optional.legends.display ? optional.legends.display : multiDimensionalCharts.legends.display;
    } else {
        chartObject.legends =  multiDimensionalCharts.legends;
    }
    chartObject.saturationEnable = optional && optional.saturation && optional.saturation.enable ? optional.saturation.enable : "no";
    chartObject.saturationColor = optional && optional.colors && optional.colors.saturationColor ? optional.colors.saturationColor : stylesheet.colors.saturationColor;
    chartObject.realTimeCharts = optional && optional.realTimeCharts ? optional.realTimeCharts : "no";
    chartObject.transition = optional && optional.transition ? optional.transition : "no";
    chartObject.creditMySite = optional && optional.creditMySite ? optional.creditMySite : stylesheet.creditMySite;
    chartObject.dataSource = optional && optional.dataSource ? optional.dataSource : stylesheet.dataSource;
    chartObject.bg = optional && optional.colors && optional.colors.backgroundColor ? optional.colors.backgroundColor : stylesheet.colors.backgroundColor;
    chartObject.chartColor = optional && optional.colors && optional.colors.chartColor ? optional.colors.chartColor : stylesheet.colors.chartColor;
    chartObject.highlightColor = optional && optional.colors && optional.colors.highlightColor ? optional.colors.highlightColor : stylesheet.colors.highlightColor;
    chartObject.fullscreen = optional && optional.buttons && optional.buttons.enableFullScreen ? optional.buttons.enableFullScreen : stylesheet.buttons.enableFullScreen;
    chartObject.loading = optional && optional.loading && optional.loading.animationGifUrl ? optional.loading.animationGifUrl: stylesheet.loading.animationGifUrl;
    chartObject.enableTooltip = optional && optional.enableTooltip ? optional.enableTooltip : stylesheet.enableTooltip;
    if (optional && optional.borderBetweenChartElements /*&& optional.borderBetweenChartElements.width!=0 && optional.borderBetweenChartElements.width!="0px"*/) {
        chartObject.borderBetweenChartElements = optional.borderBetweenChartElements;
        chartObject.borderBetweenChartElements.width = "width" in optional.borderBetweenChartElements ? optional.borderBetweenChartElements.width : stylesheet.borderBetweenChartElements.width;
        chartObject.borderBetweenChartElements.color = optional.borderBetweenChartElements.color ? optional.borderBetweenChartElements.color : stylesheet.borderBetweenChartElements.color;
        chartObject.borderBetweenChartElements.style = optional.borderBetweenChartElements.style ? optional.borderBetweenChartElements.style : stylesheet.borderBetweenChartElements.style;
        switch(chartObject.borderBetweenChartElements.style) {
            case "dotted" : chartObject.borderBetweenChartElements.style = "1,3";
                            break;
            case "dashed" : chartObject.borderBetweenChartElements.style = "5,5";
                           break;
            default : chartObject.borderBetweenChartElements.style = "0";
                      break;
        }
    } else {
        chartObject.borderBetweenChartElements = stylesheet.borderBetweenChartElements;
    }
    if(optional && optional.ticks) {
        chartObject.ticks = optional.ticks;
        chartObject.ticks.strokeWidth = "strokeWidth" in optional.ticks ? optional.ticks.strokeWidth : stylesheet.ticks.strokeWidth;
        chartObject.ticks.weight = optional.ticks.weight ? optional.ticks.weight : stylesheet.ticks.weight;
        chartObject.ticks.size = "size" in optional.ticks ? optional.ticks.size : stylesheet.ticks.size;
        chartObject.ticks.color = optional.ticks.color ? optional.ticks.color : stylesheet.ticks.color;
        chartObject.ticks.family = optional.ticks.family ? optional.ticks.family : stylesheet.ticks.family;
    } else {
        chartObject.ticks = stylesheet.ticks;
    }
    chartObject.zoom = optional && optional.zoom ? optional.zoom : multiDimensionalCharts.zoom;
    chartObject.zoom.enable = optional && optional.zoom && optional.zoom.enable ? optional.zoom.enable : multiDimensionalCharts.zoom.enable;

    if (optional && optional.label) {
        chartObject.label = optional.label;
        chartObject.label.size = "size" in optional.label ? optional.label.size : stylesheet.label.size;
        chartObject.label.color = optional.label.color ? optional.label.color : stylesheet.label.color;
        chartObject.label.weight = optional.label.weight ? optional.label.weight : stylesheet.label.weight;
        chartObject.label.family = optional.label.family ? optional.label.family : stylesheet.label.family;
    } else {
        chartObject.label = stylesheet.label;
    }
    if (optional && optional.legendsText) {
        chartObject.legendsText = optional.legendsText;
        chartObject.legendsText.size = optional.legendsText.size ? optional.legendsText.size : stylesheet.legendsText.size;
        chartObject.legendsText.color = optional.legendsText.color ? optional.legendsText.color : stylesheet.legendsText.color;
        chartObject.legendsText.weight = optional.legendsText.weight ? optional.legendsText.weight : stylesheet.legendsText.weight;
        chartObject.legendsText.weight = (chartObject.legendsText.weight === "thick") ? "bold" : "normal";
        chartObject.legendsText.family = optional.legendsText.family ? optional.legendsText.family : stylesheet.legendsText.family;
    } else {
        chartObject.legendsText = stylesheet.legendsText;
    }
    chartObject.units = optional && optional.units ? optional.units : false;
    chartObject.size = optional && optional.size ? optional.size : multiDimensionalCharts.size;
    chartObject.size.enable = optional && optional.size && optional.size.enable ? optional.size.enable : multiDimensionalCharts.size.enable;
    chartObject.colorPalette = ["#b2df8a", "#1f78b4", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928", "#a6cee3"]; 
    chartObject.k = new PykCharts.Configuration(chartObject);
    if (optional && optional.tooltip) {
        chartObject.tooltip = optional.tooltip;        
        chartObject.enableTooltip = optional.tooltip.enable ? optional.tooltip.enable : multiDimensionalCharts.tooltip.enable;
        chartObject.tooltip.mode = optional.tooltip.mode ? optional.tooltip.mode : multiDimensionalCharts.tooltip.mode;
    } else {
        chartObject.tooltip = multiDimensionalCharts.tooltip;
        chartObject.enableTooltip = multiDimensionalCharts.tooltip.enable;     
    }
    return chartObject;
};