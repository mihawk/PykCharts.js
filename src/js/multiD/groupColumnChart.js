PykCharts.multiD.groupedColumn = function(options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function () {
        that = new PykCharts.multiD.processInputs(that, options, "column");

        if(that.stop)
            return;
        that.grid_color = options.chart_grid_color ? options.chart_grid_color : theme.stylesheet.chart_grid_color;
         that.panels_enable = "no";

        if(that.mode === "default") {
           that.k.loading();
        }
        that.multiD = new PykCharts.multiD.configuration(that);

        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(that.selector+" #chart-loader").remove();
                $(options.selector).css("height","auto");
                return;
            }
            that.data = that.k.__proto__._groupBy("column",data);
            that.compare_data = that.k.__proto__._groupBy("column",data);
            that.axis_y_data_format = "number";
            that.axis_x_data_format = that.k.xAxisDataFormatIdentification(that.data);
            if(that.axis_x_data_format === "time" && that.axis_x_time_value_datatype === "") {
                console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to have passed Date data so please pass the value for axis_x_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
            }

            $(that.selector+" #chart-loader").remove();
            $(options.selector).css("height","auto");
            // PykCharts.multiD.columnFunctions(options,that,"group_column");
            that.render();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };

    that.dataTransformation = function () {
        that.group_arr = [], that.new_data = [];
        that.data_length = that.data.length;
        for(j = 0;j < that.data_length;j++) {
            that.group_arr[j] = that.data[j].x;
        }
        that.uniq_group_arr = _.unique(that.group_arr);
        var len = that.uniq_group_arr.length;

        for (k = 0;k < len;k++) {
            that.new_data[k] = {
                    name: that.uniq_group_arr[k],
                    data: []
            };
            for (l = 0;l < that.data_length;l++) {
                if (that.uniq_group_arr[k] === that.data[l].x) {
                    that.new_data[k].data.push({
                        y: that.data[l].y,
                        name: that.data[l].group,
                        tooltip: that.data[l].tooltip,
                        color: that.data[l].color
                    });
                }
            }
        }
        that.new_data_length = that.new_data.length;
    };

    that.refresh = function () {
        that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("column",data);
            that.refresh_data = that.k.__proto__._groupBy("column",data);
            that.map_group_data = that.multiD.mapGroup(that.data);
            that.dataTransformation();
            that.optionalFeatures().mapColors();

            if(that.axis_x_data_format === "time") {
                    that.new_data.forEach(function (d) {
                        d.name = that.k.dateConversion(d.name);
                        // that.xdomain.push(d.x);
                    });
                    that.data.forEach(function (d) {
                        d.x =that.k.dateConversion(d.x);
                    });
            }
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }

            that.optionalFeatures()
                    .createChart()
                    .legends();

            that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
            .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
            .yGrid(that.svgContainer,that.group,that.yScale,that.legendsGroup_width);
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
    };

    that.render = function() {
        var that = this;
        var l = $(".svgcontainer").length;
        that.container_id = "svgcontainer" + l;

        that.map_group_data = that.multiD.mapGroup(that.data);
        that.dataTransformation();
        that.optionalFeatures().mapColors();

        if(that.axis_x_data_format === "time") {
                that.new_data.forEach(function (d) {
                    d.name = that.k.dateConversion(d.name);
                    // that.xdomain.push(d.x);
                });
                that.data.forEach(function (d) {
                    d.x =that.k.dateConversion(d.x);
                });
        }


        that.border = new PykCharts.Configuration.border(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.mouseEvent1 = new PykCharts.multiD.mouseEvent(that);
        that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);

        if(that.mode === "default") {
            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+that.container_id,"groupColumnChart")
                .emptyDiv()
                .subtitle()
                .makeMainDiv(that.selector,1);

            that.optionalFeatures()
                .svgContainer(1)
                .legendsContainer(1);

            that.k.liveData(that)
                .tooltip()
                .createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

            that.optionalFeatures()
                .legends()
                .createGroups(1)
                .createChart()
                .axisContainer()
               .highlightRect();

            that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
            .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
            .yGrid(that.svgContainer,that.group,that.yScale,that.legendsGroup_width)
            .xAxisTitle(that.xGroup)
            .yAxisTitle(that.yGroup);

        } else if(that.mode === "infographics") {
            that.k.backgroundColor(that)
                .export(that,"#"+that.container_id,"groupColumnChart")
                .emptyDiv()
                .makeMainDiv(that.selector,1);

            that.optionalFeatures().svgContainer(1)
                .legendsContainer(1)
                .createGroups(1)
                .createChart()
                .axisContainer()
                .highlightRect();

            that.k.tooltip();
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
            that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
            .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
            .xAxisTitle(that.xGroup)
            .yAxisTitle(that.yGroup);
        }

        that.k.exportSVG(that,"#"+that.container_id,"groupColumnChart")
        if(PykCharts.boolean(that.legends_enable)) {
            $(document).ready(function () { return that.k.resize(that.svgContainer,"",that.legendsContainer); })
            $(window).on("resize", function () { return that.k.resize(that.svgContainer,"",that.legendsContainer); });
        } else {
            $(document).ready(function () { return that.k.resize(that.svgContainer,""); })
            $(window).on("resize", function () { return that.k.resize(that.svgContainer,""); });
        }
    };

    that.optionalFeatures = function() {
        var that = this;
        var optional = {
            svgContainer: function (i) {
               $(that.selector).attr("class","PykCharts-twoD");
                that.svgContainer = d3.select(options.selector + " #tooltip-svg-container-" + i)
                    .append("svg:svg")
                    .attr("width",that.width )
                    .attr("height",that.height)
                    .attr("id",that.container_id)
                    .attr("class","svgcontainer")
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height);
                return this;
            },
            createGroups: function (i) {
                that.group = that.svgContainer.append("g")
                    .attr("id","svggroup")
                    .attr("class","svggroup")
                    .attr("transform","translate(" + that.margin_left + "," + (that.margin_top + that.legendsGroup_height) +")");

                if(PykCharts.boolean(that.grid_y_enable)) {
                    that.group.append("g")
                        .attr("id","ygrid")
                        .style("stroke",that.grid_color)
                        .attr("class","y grid-line");
                }
                return this;
            },
            legendsContainer: function (i) {
                if(PykCharts.boolean(that.legends_enable) && that.mode === "default") {

                    that.legendsGroup = that.svgContainer.append("g")
                        .attr("id","legends")
                        .attr("class","legends")
                        .style("visibility","hidden")
                        .attr("transform","translate(0,10)");

                } else {
                    that.legendsGroup_height = 0;
                    that.legendsGroup_width = 0;
                }
                return this;
            },
            axisContainer : function () {
                if(PykCharts.boolean(that.axis_x_enable) || that.axis_x_title) {
                    that.xGroup = that.group.append("g")
                        .attr("class", "x axis")
                        .attr("id","xaxis")
                        .style("stroke","black");
                }

                if(PykCharts.boolean(that.axis_y_enable) || that.axis_y_title) {
                    that.yGroup = that.group.append("g")
                        .attr("class", "y axis")
                        .attr("id","yaxis")
                        .style("stroke","blue");
                }
                return this;
            },
            createChart: function() {
                that.reduced_width = that.width - that.margin_left - that.margin_right - that.legendsGroup_width;

                that.reduced_height = that.height - that.margin_top - that.margin_bottom - that.legendsGroup_height;

                that.getuniqueGroups = _.map(that.data,function(d) {
                    return d.group;
                })

                that.getuniqueGroups = _.unique(that.getuniqueGroups)

                that.x_tick_values = that.k.processXAxisTickValues();
                that.y_tick_values = that.k.processYAxisTickValues();

                var x_domain,x_data = [],y_data,y_range,x_range,y_domain,min_x_tick_value,max_x_tick_value, min_y_tick_value,max_y_tick_value;

                if(that.axis_y_data_format === "number") {
                    that.max_y_value = d3.max(that.new_data, function(d) { return d3.max(d.data, function(d) { return d.y; }); });

                    y_domain = [0,that.max_y_value];
                    y_data = that.k.__proto__._domainBandwidth(y_domain,1);
                    min_y_tick_value = d3.min(that.y_tick_values);
                    max_y_tick_value = d3.max(that.y_tick_values);

                    if(y_data[0] > min_y_tick_value) {
                        y_data[0] = min_y_tick_value;
                    }
                    if(y_data[1] < max_y_tick_value) {
                        y_data[1] = max_y_tick_value;
                    }
                    y_range = [that.reduced_height, 0];
                    that.yScale = that.k.scaleIdentification("linear",y_data,y_range);

                }

                if(that.axis_x_data_format === "number") {
                    max = d3.max(that.new_data, function(d) { return d.name });
                    min = d3.min(that.new_data, function(d) { return d.name });
                    x_domain = [min,max];
                    x_data = that.k.__proto__._domainBandwidth(x_domain,2);

                    min_x_tick_value = d3.min(that.x_tick_values);
                    max_x_tick_value = d3.max(that.x_tick_values);

                    if(x_data[0] > min_x_tick_value) {
                        x_data[0] = min_x_tick_value;
                    }
                    if(x_data[1] < max_x_tick_value) {
                        x_data[1] = max_x_tick_value;
                    }

                    x_range = [0 ,that.reduced_width];
                    that.xScale = that.k.scaleIdentification("linear",x_data,x_range);
                    that.x1 = d3.scale.ordinal()
                        .domain(that.getuniqueGroups)
                        .rangeRoundBands([0, (that.reduced_width/that.new_data.length)-20]) ;

                    that.extra_left_margin = 0;

                } else if(that.axis_x_data_format === "string") {
                    x_data = that.new_data.map(function (d) { return d.name; });

                    x_range = [0 ,that.reduced_width];
                    that.xScale = that.k.scaleIdentification("ordinal",x_data,x_range,0.2);
                    that.extra_left_margin = (that.xScale.rangeBand() / 2);
                    that.xdomain = that.xScale.domain();
                    that.x1 = d3.scale.ordinal()
                        .domain(that.getuniqueGroups)
                        .rangeRoundBands([0, that.xScale.rangeBand()]) ;


                } else if (that.axis_x_data_format === "time") {
                    max = d3.max(that.new_data,function(d) {
                        return d.name;
                    })

                    min = d3.min(that.new_data,function(d) {
                        return d.name;
                    })

                    x_domain = [min.getTime(),max.getTime()];
                    x_data = that.k.__proto__._domainBandwidth(x_domain,2,"time");
                    x_range = [0 ,that.reduced_width];


                    min_x_tick_value = d3.min(that.x_tick_values, function (d) {
                        d = that.k.dateConversion(d);
                        return d;
                    });

                    max_x_tick_value = d3.max(that.x_tick_values, function (d) {
                        d = that.k.dateConversion(d);
                        return d;
                    });

                    if((x_data[0]) > (min_x_tick_value)) {
                        x_data[0] = min_x_tick_value;
                    }
                    if((x_data[1]) < (max_x_tick_value)) {
                        x_data[1] = max_x_tick_value;
                    }

                    that.xScale = that.k.scaleIdentification("time",x_data,x_range);

                    that.x1 = d3.scale.ordinal()
                        .domain(that.getuniqueGroups)
                        .rangeRoundBands([0, that.reduced_width/that.new_data.length]) ;

                    that.extra_left_margin = 0;
                }
                that.xdomain = that.xScale.domain();
                that.ydomain = that.yScale.domain();
                that.highlight_y_positions =  [];
                var chart = that.group.selectAll(".column-group")
                    .data(that.new_data);

                chart.enter()
                    .append("g")
                    .attr("class", "column-group")

                chart
                    .attr("transform", function (d) {
                        that.optionalFeatures().checkIfHighLightDataExists(d.name);
                        if(that.highlight_group_exits) {
                            that.flag = true;
                            that.highlight_x_positions = that.xScale(d.name);
                        }
                        return "translate(" + that.xScale(d.name) + ",0)";
                    })
                    .on('mouseout',function (d) {
                        if(that.mode === "default") {
                            if(PykCharts.boolean(that.onhover_enable)) {
                                that.mouseEvent.highlightGroupHide(that.selector+" "+".column-group","rect");
                            }
                            that.mouseEvent.axisHighlightHide(that.selector+" "+".x.axis")
                        }
                    })
                    .on('mousemove', function (d) {
                        if(that.mode === "default") {
                            if(PykCharts.boolean(that.onhover_enable)) {
                                that.mouseEvent.highlightGroup(that.selector+" "+".column-group", this, "rect");
                            }
                            that.mouseEvent.axisHighlightShow(d.name,that.selector+" "+".x.axis",that.xdomain);
                        }
                    });

                var bar = chart.selectAll("rect")
                            .data(function (d) { return d.data; });

                bar.enter()
                    .append("rect")

                bar.attr("height", 0)
                    .attr("x", function (d) {return that.x1(d.name); })
                    .attr("y", that.height)
                    .attr("width", function (d){ return 0.98*that.x1.rangeBand(); })
                    .attr("fill", function (d,i) {
                        return that.fillColor.colorGroup(d);
                    })
                    .attr("fill-opacity", function (d,i) {
                        if (that.color_mode === "saturation") {
                            return (i+1)/that.no_of_groups;
                        } else {
                            return 1;
                        }
                    })
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("data-fill-opacity",function () {
                        return $(this).attr("fill-opacity");
                    })
                    .on('mouseover',function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(d.tooltip);
                        }
                    })
                    .on('mouseout',function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipHide(d);
                        }
                    })
                    .on('mousemove', function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                        }

                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("height", function (d) { return that.reduced_height - that.yScale(d.y); })
                    .attr("y",function (d) {
                        if(that.flag) {
                            that.highlight_y_positions.push(that.yScale(d.y));
                        }
                        return that.yScale(d.y);
                    });

                chart.exit().remove();

                return this;
            },
            mapColors : function () {
                that.no_of_groups = d3.max(that.new_data,function (d){
                    return d.data.length;
                });

                for(var i = 0;that.new_data.length;i++) {
                    if(that.new_data[i].data.length === that.no_of_groups) {
                        that.group_data = that.new_data[i].data;
                        break;
                    }
                }

                that.new_data.forEach(function(d){
                    d.data.forEach(function(data){
                        data.color = _.find(that.group_data,function(d) {
                            return d.name === data.name;
                        }).color;
                    })
                });
            },
            legends: function () {
                if(PykCharts.boolean(that.legends_enable)) {
                    var params = that.group_data,color;

                    color = params.map(function (d) {
                        return d.color;
                    });

                    params = params.map(function (d) {
                        return d.name;
                    });

                    params = _.uniq(params);
                    var j = 0,k = 0;
                    j = params.length;
                    k = params.length;

                    if(that.legends_display === "vertical" ) {
                        that.legendsGroup.attr("height", (params.length * 30)+20);
                        that.legendsGroup_height = 0;

                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        text_parameter1value = function (d,i) { return 36; };
                        rect_parameter3value = function (d,i) { return 20; };
                        var rect_parameter4value = function (d,i) { return i * 24 + 12;};
                        var text_parameter2value = function (d,i) { return i * 24 + 23;};
                    }
                    else if(that.legends_display === "horizontal") {
                        that.legendsGroup_height = 50;
                        temp_i = j;
                        final_rect_x = 0;
                        final_text_x = 0;
                        legend_text_widths = [];
                        sum_text_widths = 0;
                        temp_text = temp_rect = 0;
                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";
                        var text_parameter1value = function (d,i) {
                            legend_text_widths[i] = this.getBBox().width;
                            legend_start_x = 16;
                            final_text_x = (i === 0) ? legend_start_x : (legend_start_x + temp_text);
                            temp_text = temp_text + legend_text_widths[i] + 30;
                            return final_text_x;
                        };
                        text_parameter2value = 30;
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        var rect_parameter3value = function (d,i) {
                            final_rect_x = (i === 0) ? 0 : temp_rect;
                            temp_rect = temp_rect + legend_text_widths[i] + 30;
                            return final_rect_x;
                        };
                        rect_parameter4value = 18;
                    }

                    var legend = that.legendsGroup.selectAll(".legends-rect")
                                    .data(params);

                    that.legends_text = that.legendsGroup.selectAll(".legends_text")
                        .data(params);

                    that.legends_text.enter()
                        .append('text');

                    that.legends_text.attr("class","legends_text")
                        .attr("pointer-events","none")
                        .text(function (d) { return d; })
                        .attr("fill", that.legends_text_color)
                        .attr("font-family", that.legends_text_family)
                        .attr("font-size",that.legends_text_size+"px")
                        .attr("font-weight", that.legends_text_weight)
                        .attr(text_parameter1, text_parameter1value)
                        .attr(text_parameter2, text_parameter2value);

                    legend.enter()
                        .append("rect");

                    legend.attr("class","legends-rect")
                        .attr(rect_parameter1, rect_parameter1value)
                        .attr(rect_parameter2, rect_parameter2value)
                        .attr(rect_parameter3, rect_parameter3value)
                        .attr(rect_parameter4, rect_parameter4value)
                        .attr("fill", function (d,i) {
                            if(that.color_mode === "color")
                                return color[i];
                            else return that.saturation_color
                        })
                        .attr("fill-opacity", function (d,i) {
                            if (that.color_mode === "saturation") {
                                return (i+1)/that.no_of_groups;
                            }
                        });

                    var legend_container_width = that.legendsGroup.node().getBBox().width,translate_x;

                    if(that.legends_display === "vertical") {
                        that.legendsGroup_width = legend_container_width + 20;
                    } else  {
                        that.legendsGroup_width = 0;
                    }

                    translate_x = (that.legends_display === "vertical") ? (that.width - that.legendsGroup_width) : (that.width - legend_container_width - 20);

                    if (legend_container_width < that.width) { that.legendsGroup.attr("transform","translate("+translate_x+",10)"); }
                    that.legendsGroup.style("visibility","visible");

                    that.legends_text.exit().remove();
                    legend.exit().remove();
                }
                return this;
            },
            checkIfHighLightDataExists : function (name) {
                if(that.highlight) {
                    if(that.axis_x_data_format === "number") {
                        that.highlight_group_exits = (that.highlight === name);
                    } else if (that.axis_x_data_format === "string") {
                        that.highlight_group_exits = (that.highlight.toLowerCase() === name.toLowerCase());
                        
                    }
                }
                return this;
            },
            highlightRect : function () {
                if(that.highlight) {
                    setTimeout(function() {
                        x = that.highlight_x_positions - 5;
                        // y = d3.select(that.highlight_y_positions).node();
                        // var highlight_group = y.querySelectorAll("rect");
                        // var min = _.min(that.highlight_y_positions);

                    that.group.append("rect")
                        .attr("class","highlight-rect")
                        .attr("x", x)
                        .attr("y", 0)
                        .attr("width", (that.x1.rangeBand()* that.group_data.length)+10)
                        .attr("height", that.height - that.margin_top - that.margin_bottom - that.legendsGroup_height + 5)
                        .attr("fill","none")
                        .attr("stroke", that.highlight_color)
                        .attr("stroke-width", "1.5px")
                        .attr("stroke-dasharray", "5,5")
                        .attr("stroke-opacity",1);
                    }, that.transitions.duration());
                }
                return this;
            },
        }
        return optional;
    };
};;
