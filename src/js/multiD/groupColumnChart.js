PykCharts.multiD.groupedColumn = function(options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function () {
        that = new PykCharts.multiD.processInputs(that, options, "column");
        PykCharts.scaleFunction(that);
        if(that.stop){
            return;
        }
        that.panels_enable = "no";

        if(that.mode === "default") {
           that.k.loading();
        }
        that.multiD = new PykCharts.multiD.configuration(that);

        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data),
                id = that.selector.substring(1,that.selector.length);
            if(that.stop || validate === false) {
                that.k.remove_loading_bar(id);
                return;
            }
            that.data = that.k.__proto__._groupBy("column",data);
            that.compare_data = that.k.__proto__._groupBy("column",data);
            that.axis_y_data_format = "number";
            that.axis_x_data_format = that.k.xAxisDataFormatIdentification(that.data);
            if(that.axis_x_data_format === "time" && that.axis_x_time_value_datatype === "") {
                console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to have passed Date data so please pass the value for axis_x_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
            }

            that.k.remove_loading_bar(id);
            // PykCharts.multiD.columnFunctions(options,that,"group_column");
            that.render();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };

    that.dataTransformation = function () {
        that.group_arr = [], that.new_data = [];
        that.data_length = that.data.length;
        for(var j = 0;j < that.data_length;j++) {
            that.group_arr[j] = that.data[j].x;
        }
        // that.uniq_group_arr = _.unique(that.group_arr);
        that.uniq_group_arr = that.k.__proto__._unique(that.group_arr);
        var len = that.uniq_group_arr.length;

        for (var k = 0;k < len;k++) {
            that.new_data[k] = {
                    name: that.uniq_group_arr[k],
                    data: []
            };
            for (var l = 0;l < that.data_length;l++) {
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
                    .legends()
                    .highlightRect();

            that.k.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
            .yGrid(that.svgContainer,that.group,that.yScale,that.legendsGroup_width);
            if(that.axis_y_data_format !== "string") {
                that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height,"groupcolumn")
                that.optionalFeatures().newXAxis();
            } else {
                that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
            }
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
    };

    that.render = function() {
        var that = this,
            id = that.selector.substring(1,that.selector.length),
            container_id = id + "_svg";

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
        // that.mouseEvent1 = new PykCharts.multiD.mouseEvent(that);
        that.mouseEvent1 = new PykCharts.Configuration.mouseEvent(that);
        that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);

        if(that.mode === "default") {
            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+container_id,"groupColumnChart")
                .emptyDiv(options.selector)
                .subtitle()
                .makeMainDiv(that.selector,1);

            that.optionalFeatures()
                .svgContainer(container_id,1)
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

            that.k.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
            .yGrid(that.svgContainer,that.group,that.yScale,that.legendsGroup_width)
            .xAxisTitle(that.xGroup)
            .yAxisTitle(that.yGroup);
            if(that.axis_y_data_format !== "string") {
                that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height,"groupcolumn")
                that.optionalFeatures().newXAxis();
            } else {
                that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
            }

        } else if(that.mode === "infographics") {
            that.k.backgroundColor(that)
                .export(that,"#"+container_id,"groupColumnChart")
                .emptyDiv(options.selector)
                .makeMainDiv(that.selector,1);

            that.optionalFeatures().svgContainer(container_id,1)
                .legendsContainer(1)
                .createGroups(1)
                .createChart()
                .axisContainer()
                .highlightRect();

            that.k.tooltip();
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
            that.k
            .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
            .xAxisTitle(that.xGroup)
            .yAxisTitle(that.yGroup);
            if(that.axis_y_data_format !== "string") {
                that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height,"groupcolumn")
                that.optionalFeatures().newXAxis();
            } else {
                that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
            }
        }

        that.k.exportSVG(that,"#"+container_id,"groupColumnChart");
            var resize = that.k.resize(that.svgContainer);
            that.k.__proto__._ready(resize);
            window.addEventListener('resize', function(event){
                return that.k.resize(that.svgContainer);
            });
    };

    that.optionalFeatures = function() {
        var that = this;
        var id = that.selector.substring(1,that.selector.length);
        var optional = {
            svgContainer: function (container_id,i) {
                document.getElementById(id).className = "PykCharts-twoD";
                that.svgContainer = d3.select(options.selector + " #tooltip-svg-container-" + i)
                    .append("svg:svg")
                    .attr({
                        "width": that.chart_width,
                        "height": that.chart_height,
                        "id": container_id,
                        "class": "svgcontainer",
                        "preserveAspectRatio": "xMinYMin",
                        "viewBox": "0 0 " + that.chart_width + " " + that.chart_height
                    });
                return this;
            },
            createGroups: function (i) {
                that.group = that.svgContainer.append("g")
                    .attr({
                        "id": "groupedColumn-group",
                        "transform": "translate(" + that.chart_margin_left + "," + (that.chart_margin_top + that.legendsGroup_height) +")"
                    });

                if(PykCharts.boolean(that.chart_grid_y_enable)) {
                    that.group.append("g")
                        .attr({
                            "id": "ygrid",
                            "class": "y grid-line"
                        });
                }
                return this;
            },
            legendsContainer: function (i) {
                if(PykCharts.boolean(that.legends_enable) && that.mode === "default") {

                    that.legendsGroup = that.svgContainer.append("g")
                        .attr({
                            "id": "groupedColumn-legends",
                            "class": "legends",
                            "transform": "translate(0,10)"
                        })
                        .style("visibility","hidden");

                } else {
                    that.legendsGroup_height = 0;
                    that.legendsGroup_width = 0;
                }
                return this;
            },
            axisContainer : function () {
                if(PykCharts.boolean(that.axis_x_enable) || that.axis_x_title) {
                    that.xGroup = that.group.append("g")
                        .attr({
                            "class": "x axis",
                            "id": "xaxis"
                        })
                        .style("stroke","black");
                    that.new_xAxisgroup = that.group.append("g")
                        .attr({
                            "class": "x new-axis",
                            "id": "new-xaxis"
                        })
                        .style("stroke","blue");
                }

                if(PykCharts.boolean(that.axis_y_enable) || that.axis_y_title) {
                    that.yGroup = that.group.append("g")
                        .attr({
                            "class": "y axis",
                            "id": "yaxis"
                        })
                        .style("stroke","blue");
                }
                return this;
            },
            createChart: function() {
                that.reduced_width = that.chart_width - that.chart_margin_left - that.chart_margin_right - that.legendsGroup_width;

                that.reduced_height = that.chart_height - that.chart_margin_top - that.chart_margin_bottom - that.legendsGroup_height;

                // console.log(that.data,"data");
                that.getuniqueGroups = that.data.map(function (d) {
                    return d.group;
                })

                that.getuniqueGroups = that.k.__proto__._unique(that.getuniqueGroups)

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
                    x_data = [min,max];

                    min_x_tick_value = d3.min(that.x_tick_values);
                    max_x_tick_value = d3.max(that.x_tick_values);

                    if(x_data[0] > min_x_tick_value) {
                        x_data[0] = min_x_tick_value;
                    }
                    if(x_data[1] < max_x_tick_value) {
                        x_data[1] = max_x_tick_value;
                    }
                    that.new_data.sort(function (a,b) {
                        return a.name - b.name;
                    })
                    x_range = [0 ,that.reduced_width];
                    that.xScale1 = that.k.scaleIdentification("linear",x_data,x_range);
                    x_data1 = that.new_data.map(function (d) { return d.name; });
                    x_range1 = [0 ,that.reduced_width];
                    that.xScale = that.k.scaleIdentification("ordinal",x_data1,x_range1,0.2);
                    that.extra_left_margin = (that.xScale.rangeBand() / 2);
                    that.xdomain = that.xScale.domain();
                    that.x1 = d3.scale.ordinal()
                        .domain(that.getuniqueGroups)
                        .rangeRoundBands([0, that.xScale.rangeBand()]) ;
                    

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
                    x_data = [min,max];
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
                    that.new_data.sort(function (a,b) {
                        if (new Date(a.name) < new Date(b.name)) {
                            return -1 ;
                        }
                        else if (new Date(a.name) > new Date(b.name)) {
                            return 1;
                        }
                    });
                    x_data1 = that.new_data.map(function (d) { return d.name; });

                    x_range1 = [0 ,that.reduced_width];
                    that.xScale1 = that.k.scaleIdentification("ordinal",x_data1,x_range1,0.2);
                    x_data1 = that.new_data.map(function (d) { return d.name; });
                    x_range1 = [0 ,that.reduced_width];
                    that.xScale = that.k.scaleIdentification("ordinal",x_data1,x_range1,0.2);
                    that.extra_left_margin = (that.xScale.rangeBand() / 2);
                    that.xdomain = that.xScale.domain();
                    that.x1 = d3.scale.ordinal()
                        .domain(that.getuniqueGroups)
                        .rangeRoundBands([0, that.xScale.rangeBand()]) ;
                }
                that.xdomain = that.xScale.domain();
                that.ydomain = that.yScale.domain();
                that.highlight_y_positions =  [];
                var chart = that.group.selectAll(".groupedColumn-rect")
                    .data(that.new_data);

                chart.enter()
                    .append("g")
                    .attr("class", "groupedColumn-rect");

                chart.attr("transform", function (d) {
                        that.optionalFeatures().checkIfHighLightDataExists(d.name);
                        if(that.highlight_group_exits) {
                            that.flag = true;
                            that.highlight_x_positions = that.xScale(d.name);
                        }
                        return "translate(" + that.xScale(d.name) + ",0)";
                    })
                    .on({
                        'mouseout': function (d) {
                            if(that.mode === "default") {
                                if(PykCharts.boolean(that.chart_onhover_highlight_enable)) {
                                    that.mouseEvent.highlightGroupHide(that.selector+" "+".groupedColumn-rect","rect");
                                }
                                that.mouseEvent.axisHighlightHide(that.selector+" "+".x.axis")
                            }
                        },
                        'mousemove': function (d) {
                            if(that.mode === "default") {
                                if(PykCharts.boolean(that.chart_onhover_highlight_enable)) {
                                    that.mouseEvent.highlightGroup(that.selector+" "+".groupedColumn-rect", this, "rect");
                                }
                                that.mouseEvent.axisHighlightShow(d.name,that.selector+" "+".x.axis",that.xdomain);
                            }
                        }
                    });

                var bar = chart.selectAll("rect")
                            .data(function (d) { return d.data; });

                bar.enter()
                    .append("rect")

                bar.attr("height", 0)
                    .attr({
                        "x": function (d) {return that.x1(d.name); },
                        "y": that.chart_height - that.chart_margin_top - that.chart_margin_bottom,
                        "width": function (d){ return 0.98*that.x1.rangeBand(); },
                        "fill": function (d,i) {
                            return that.fillColor.colorGroup(d);
                        },
                        "fill-opacity": function (d,i) {
                            if (that.color_mode === "saturation") {
                                return (i+1)/that.no_of_groups;
                            } else {
                                return 1;
                            }
                        },
                        "stroke": that.border.color(),
                        "stroke-width": that.border.width(),
                        "data-fill-opacity": function () {
                            return d3.select(this).attr("fill-opacity");
                        }
                    })
                    .on({
                        'mouseover': function (d) {
                            if(that.mode === "default" && PykCharts['boolean'](options.tooltip_enable)) {
                                var tooltip = d.tooltip ? d.tooltip : d.y
                                that.mouseEvent.tooltipPosition(d);
                                that.mouseEvent.tooltipTextShow(tooltip);
                            }
                        },
                        'mouseout': function (d) {
                            if(that.mode === "default" && PykCharts['boolean'](options.tooltip_enable)) {
                                that.mouseEvent.tooltipHide(d);
                            }
                        },
                        'mousemove': function (d) {
                            if(that.mode === "default" && PykCharts['boolean'](options.tooltip_enable)) {
                                that.mouseEvent.tooltipPosition(d);
                            }
                        }
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr({
                        "height": function (d) { return that.reduced_height - that.yScale(d.y); },
                        "y": function (d) {
                            if(that.flag) {
                                that.highlight_y_positions.push(that.yScale(d.y));
                            }
                            return that.yScale(d.y);
                        }
                    });

                chart.exit().remove();
                bar.exit().remove();
                var t = d3.transform(d3.select(d3.selectAll('.groupedColumn-rect')[0][(that.new_data.length-1)]).attr("transform")),
                    x = t.translate[0],
                    y = t.translate[1];
                x_range = [(that.reduced_height-x - (that.x1.rangeBand()*2)),(x + (that.x1.rangeBand()*2))];
                that.xScale1 = that.k.scaleIdentification("linear",x_data,x_range);

                return this;
            },
            mapColors : function () {
                that.no_of_groups = d3.max(that.new_data,function (d){
                    return d.data.length;
                });

                for(var i = 0;i<that.new_data_length;i++) {
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
                    params = that.k.__proto__._unique(params);
                    that.multiD.legendsPosition(that,"groupColumn",params,color);
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
            newXAxis : function () {
                if(PykCharts["boolean"](that.axis_x_enable)) {
                    if(that.axis_x_position === "bottom") {
                        that.new_xAxisgroup.attr("transform", "translate(0," + (that.chart_height - that.chart_margin_top - that.chart_margin_bottom - that.legendsGroup_height) + ")");
                    }
                    var xaxis = d3.svg.axis()
                        .scale(that.xScale)
                        .orient(that.axis_x_pointer_position)
                        .tickSize(0)
                        .outerTickSize(that.axis_x_outer_pointer_length);
                    that.new_xAxisgroup.style("stroke",function () { return that.axis_x_line_color; })
                        .call(xaxis);
                    d3.selectAll(that.selector + " .x.new-axis text").style({
                        "display": function () { return "none"; },
                        "stroke": "none"
                    });
                }
                
                return this;
            },
            highlightRect : function () {
                if(that.flag) {

                    function setTimeoutHighlight() {
                        x = that.highlight_x_positions - 5;                    
                    
                        var highlight_rect = that.group.selectAll(".highlight-groupedColumn-rect")
                            .data([that.highlight])

                        highlight_rect.enter()
                            .append("rect")

                        highlight_rect.attr({
                            "class": "highlight-groupedColumn-rect",
                            "x": x,
                            "y": 0,
                            "width": (that.x1.rangeBand()* that.group_data.length)+10,
                            "height": that.reduced_height+ 5,
                            "fill": "none",
                            "stroke": that.highlight_color,
                            "stroke-width": "1.5px",
                            "stroke-dasharray": "5,5",
                            "stroke-opacity": 1
                        });
                        highlight_rect.exit()
                            .remove();
                        if(PykCharts["boolean"](that.highlight_x_positions)) {
                            highlight_array = that.highlight;
                        } else {
                            highlight_rect.remove()
                        }
                    }
                    setTimeout(setTimeoutHighlight, that.transitions.duration());
                }
                return this;
            },
        }
        return optional;
    };
};
