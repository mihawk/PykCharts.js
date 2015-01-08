PykCharts.multiD.groupedBar = function(options){
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    var multiDimensionalCharts = theme.multiDimensionalCharts;
    this.execute = function () {
        that = new PykCharts.multiD.processInputs(that, options, "bar");
        PykCharts.scaleFunction(that);
        that.data_sort_enable = options.data_sort_enable ? options.data_sort_enable.toLowerCase() : multiDimensionalCharts.data_sort_enable;
        that.data_sort_type = PykCharts['boolean'](that.data_sort_enable) && options.data_sort_type ? options.data_sort_type.toLowerCase() : multiDimensionalCharts.data_sort_type;
        that.data_sort_order = PykCharts['boolean'](that.data_sort_enable) && options.data_sort_order ? options.data_sort_order.toLowerCase() : multiDimensionalCharts.data_sort_order;

        try {
            if(that.data_sort_order === "ascending" || that.data_sort_order === "descending") {
            } else {
                that.data_sort_order = multiDimensionalCharts.data_sort_order;
                throw "data_sort_order";
            }
        }
        catch(err) {
            that.k.warningHandling(err,"9");
        }
        
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
            that.data = that.k.__proto__._groupBy("bar",data);
            that.compare_data = that.k.__proto__._groupBy("bar",data);
            that.axis_x_data_format = "number";
            that.axis_y_data_format = that.k.yAxisDataFormatIdentification(that.data);
            if(that.axis_y_data_format === "time") {
                that.axis_y_data_format = "string";
            }
            that.k.remove_loading_bar(id);
            // PykCharts.multiD.columnFunctions(options,that,"group_bar");
            that.render();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };

    that.dataTransformation = function () {
        that.optionalFeatures().sort();
        that.group_arr = [], that.new_data = [];
        that.data_length = that.data.length;
        for(var j = 0;j < that.data_length;j++) {
            that.group_arr[j] = that.data[j].y;
        }
        that.uniq_group_arr = that.k.__proto__._unique(that.group_arr);
        var len = that.uniq_group_arr.length;
        
        for (var k = 0;k < len;k++) {
            that.new_data[k] = {
                name: that.uniq_group_arr[k],
                data: []
            };
            for (var l = 0;l < that.data_length;l++) {
                if (that.uniq_group_arr[k] === that.data[l].y) {
                    that.new_data[k].data.push({
                        x: that.data[l].x,
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
            that.data = that.k.__proto__._groupBy("bar",data);
            that.refresh_data = that.k.__proto__._groupBy("bar",data);
            that.map_group_data = that.multiD.mapGroup(that.data);
            that.dataTransformation();
            that.optionalFeatures().mapColors();

            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }

            that.optionalFeatures()
                .createChart()
                .legends()
                .ticks()
                .highlightRect();

            that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
                .yGrid(that.svgContainer,that.group,that.yScale,that.legendsGroup_width);
            if(that.axis_y_data_format !== "string") {
                that.k.yAxis(that.svgContainer,that.yGroup,that.yScale1,that.ydomain,that.y_tick_values,that.legendsGroup_width,"groupbar");
                that.optionalFeatures().newYAxis();
            } else {
                that.k.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width);
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

        that.border = new PykCharts.Configuration.border(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        // that.mouseEvent1 = new PykCharts.multiD.mouseEvent(that);
        that.mouseEvent1 = new PykCharts.Configuration.mouseEvent(that);
        that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);

        if(that.mode === "default") {
            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+container_id,"groupbarChart")
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
                .highlightRect()
                .ticks();

            that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
                .xAxisTitle(that.xGroup)
                .yAxisTitle(that.yGroup);
            if(that.axis_y_data_format !== "string") {
                that.k.yAxis(that.svgContainer,that.yGroup,that.yScale1,that.ydomain,that.y_tick_values,that.legendsGroup_width,"groupbar");
                that.optionalFeatures().newYAxis();
            } else {
                that.k.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width);
            }
        } else if(that.mode === "infographics") {
            that.k.backgroundColor(that)
                .export(that,"#"+container_id,"groupbarChart")
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
            that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
                .xAxisTitle(that.xGroup)
                .yAxisTitle(that.yGroup);
            if(that.axis_y_data_format !== "string") {
                that.k.yAxis(that.svgContainer,that.yGroup,that.yScale1,that.ydomain,that.y_tick_values,that.legendsGroup_width,"groupbar");
                that.optionalFeatures().newYAxis();
            } else {
                that.k.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width);
            }
        }

        that.k.exportSVG(that,"#"+container_id,"groupbarChart")

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
                        "width" : that.chart_width,
                        "height" : that.chart_height,
                        "id" : container_id,
                        "class" : "svgcontainer",
                        "preserveAspectRatio" : "xMinYMin",
                        "viewBox" : "0 0 " + that.chart_width + " " + that.chart_height
                    });
                return this;
            },
            createGroups: function (i) {
                that.group = that.svgContainer.append("g")
                    .attr({
                        "id" : "groupedBar-group",
                        "transform" : "translate(" + that.margin_left + "," + (that.margin_top + that.legendsGroup_height) +")"
                    });
                
                return this;
            },
            legendsContainer: function (i) {
                if(PykCharts.boolean(that.legends_enable) && that.mode === "default") {
                    that.legendsGroup = that.svgContainer.append("g")
                        .attr({
                            "id" : "groupedBar-legends",
                            "class" : "legends",
                            "transform" : "translate(0,10)"
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
                            "class" : "x axis",
                            "id" : "xaxis"
                        })
                        .style("stroke","black");
                }

                if(PykCharts.boolean(that.axis_y_enable) || that.axis_y_title) {
                    that.yGroup = that.group.append("g")
                        .attr({
                            "class" : "y axis",
                            "id" : "yaxis"
                        })
                        .style("stroke","blue");
                    that.new_yAxisgroup = that.group.append("g")
                        .attr({
                            "class" : "y new-axis",
                            "id" : "new-yaxis"
                        })
                        .style("stroke","blue");
                    
                }
                return this;
            },  
            createChart: function() {
                that.reduced_width = that.chart_width - that.margin_left - that.margin_right - that.legendsGroup_width;

                that.reduced_height = that.chart_height - that.margin_top - that.margin_bottom - that.legendsGroup_height;

                that.getuniqueGroups = that.data.map(function (d) {
                    return d.group;
                })

                that.getuniqueGroups = that.k.__proto__._unique(that.getuniqueGroups)

                that.x_tick_values = that.k.processXAxisTickValues();
                that.y_tick_values = that.k.processYAxisTickValues();

                var x_domain,x_data = [],y_data,y_range,x_range,y_domain,min_x_tick_value,max_x_tick_value, min_y_tick_value,max_y_tick_value;

                if(that.axis_y_data_format === "number") {
                    max = d3.max(that.new_data, function(d) { return d.name });
                    min = d3.min(that.new_data, function(d) { return d.name });
                    y_domain = [min,max];
                    // y_data = that.k.__proto__._domainBandwidth(y_domain,2);
                    y_data = y_domain;

                    min_y_tick_value = d3.min(that.y_tick_values);
                    max_y_tick_value = d3.max(that.y_tick_values);

                    if(y_data[0] > min_y_tick_value) {
                        y_data[0] = min_y_tick_value;
                    }
                    if(y_data[1] < max_y_tick_value) {
                        y_data[1] = max_y_tick_value;
                    }
   
                    that.new_data.sort(function (a,b) {
                        return a.name - b.name;
                    })
                    y_data1 = that.new_data.map(function (d) { return d.name; });
                    y_range1 = [that.reduced_height,0];
                    that.yScale = that.k.scaleIdentification("ordinal",y_data1,y_range1,0.3);
                    that.extra_top_margin = (that.yScale.rangeBand() / 2);
                    that.y1 = d3.scale.ordinal()
                        .domain(that.getuniqueGroups)
                        .rangeRoundBands([that.yScale.rangeBand(),0]) ;
                    that.extra_top_margin = 0;
                } else if(that.axis_y_data_format === "string") {
                    y_data = that.new_data.map(function (d) { return d.name; });
                    y_range = [0,that.reduced_height];
                    that.yScale = that.k.scaleIdentification("ordinal",y_data,y_range,0.3);
                    that.extra_top_margin = (that.yScale.rangeBand() / 2);
                    that.y1 = d3.scale.ordinal()
                        .domain(that.getuniqueGroups)
                        .rangeRoundBands([0, that.yScale.rangeBand()]) ;
                }

                if(that.axis_x_data_format === "number") {
                    that.max_x_value = d3.max(that.new_data, function(d) { return d3.max(d.data, function(d) { return d.x; }); });

                    x_domain = [0,that.max_x_value];
                    x_data = that.k._domainBandwidth(x_domain,1);
                    x_range = [0 ,that.reduced_width];
                    min_x_tick_value = d3.min(that.x_tick_values);
                    max_x_tick_value = d3.max(that.x_tick_values);

                    if(x_data[0] > min_x_tick_value) {
                        x_data[0] = min_x_tick_value;
                    }
                    if(x_data[1] < max_x_tick_value) {
                        x_data[1] = max_x_tick_value;
                    }

                    that.xScale = that.k.scaleIdentification("linear",x_data,x_range);
                    that.extra_left_margin = 0;
                }

                that.xdomain = that.xScale.domain();
                that.ydomain = that.yScale.domain();
                that.highlight_x_positions =  [];
                var chart = that.group.selectAll(".groupedBar-rect")
                    .data(that.new_data);
                
                chart.enter()
                    .append("g")
                    .attr("class", "groupedBar-rect");

                that.highlight_y_positions = "";
                    
                chart
                    .attr("transform", function (d) {
                        that.optionalFeatures().checkIfHighLightDataExists(d.name); 
                        if(that.highlight_group_exits) {
                            that.flag = true;
                            that.highlight_y_positions = that.yScale(d.name);
                        }
                        return "translate(" + 0 + "," + that.yScale(d.name) + ")"; 
                    })
                    .on({
                        'mouseout': function (d) {
                            if(that.mode === "default") {
                                if(PykCharts.boolean(that.chart_onhover_highlight_enable)) {
                                    that.mouseEvent.highlightGroupHide(that.selector+" "+".bar-group","rect");
                                }
                                that.mouseEvent.axisHighlightHide(that.selector+" "+".y.axis")
                            }
                        },
                        'mousemove': function (d) {
                            if(that.mode === "default") {
                                if(PykCharts.boolean(that.chart_onhover_highlight_enable)) {
                                    that.mouseEvent.highlightGroup(that.selector+" "+".bar-group", this, "rect");
                                }
                                that.mouseEvent.axisHighlightShow([d.name],that.selector+" "+".y.axis",that.xdomain,"bar");
                            }
                        }
                    });

                var bar = chart.selectAll("rect")
                    .data(function (d) { return d.data; });

                bar.enter()
                    .append("rect")
                      
                bar.attr({
                    "height" : 0,
                    "y" : function (d) {return that.y1(d.name); },
                    "x" : 0,
                    "width" : 0,
                    "height" : function (d){ return 0.98*that.y1.rangeBand(); },
                    "fill" : function (d,i) {
                        return that.fillColor.colorGroup(d);
                    },
                    "fill-opacity" : function (d,i) {
                        if (that.color_mode === "saturation") {
                            return (i+1)/that.no_of_groups;
                        } else {
                            return 1;
                        }
                    },
                    "stroke" : that.border.color(),
                    "stroke-width" : that.border.width(),
                    "data-fill-opacity" : function () {
                        return d3.select(this).attr("fill-opacity");
                    }
                })
                .on({
                    'mouseover': function (d) {
                        if(that.mode === "default" && PykCharts['boolean'](options.tooltip_enable)) {
                            var tooltip = d.tooltip ? d.tooltip : d.x;
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
                .attr("width", function (d) { return that.xScale(d.x); })

                bar.exit().remove();
                chart.exit().remove(); 

                var t = d3.transform(d3.select(d3.selectAll('.groupedBar-rect')[0][(that.new_data.length-1)]).attr("transform")),
                    x = t.translate[0],
                    y = t.translate[1];
                y_range = [(that.reduced_height-y - (that.y1.rangeBand()*2)),(y + (that.y1.rangeBand()*2))];
                that.yScale1 = that.k.scaleIdentification("linear",y_data,y_range);

                return this;
            },
            ticks : function(){
                if(that.pointer_size) {
                    var ticks = that.group.selectAll(".groupedBar-ticks")
                        .data(that.new_data);

                        ticks.enter()
                        .append("g")
                        .attr("class","groupedBar-ticks");

                    ticks.attr("transform", function (d) {
                        return "translate(" + 0 + "," + that.yScale(d.name) + ")"; 
                    })

                    var tick_label = ticks.selectAll(".ticks_label")
                        .data(function (d) { return d.data; });

                    tick_label.enter()
                        .append("text")

                    tick_label.attr("class","ticks_label")
                        .style("font-weight", that.pointer_weight)
                        .style("font-size", that.pointer_size + "px")
                        .attr("fill", that.pointer_color)
                        .style("font-family", that.pointer_family)
                        .text("");

                    function setTimeoutTicks() {
                        tick_label.attr({
                            "x" : function (d) { return that.xScale(d.x); },
                            "y" : function(d) { return (that.y1(d.name))+(that.y1.rangeBand()/2); },
                            "dx" : 4,
                            "dy" : 2
                        })
                        .transition()
                        .text(function (d) { 
                            if(d.x) {
                                return (d.x).toFixed(); 
                            }
                        })
                        .attr({
                            "pointer-events" : "none",
                        })
                        .text(function (d) { 
                            if(d.x) {
                                that.txt_width = this.getBBox().width;
                                that.txt_height = this.getBBox().height;
                                if(d.x && (that.txt_width< that.xScale(d.x)) && (that.txt_height < (that.y1.rangeBand() ))) {
                                    return d.x;
                                }
                            } 
                        });
                    }
                    setTimeout(setTimeoutTicks,that.transitions.duration());

                    tick_label.exit().remove();
                    ticks.exit().remove();
                }
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
                    that.multiD.legendsPosition(that,"groupBar",params,color);
                }
                return this;
            },
            checkIfHighLightDataExists : function (name) {
                if(that.highlight) {
                    if(that.axis_y_data_format === "number") {
                        that.highlight_group_exits = (that.highlight === name);
                    } else if (that.axis_y_data_format === "string") {
                        that.highlight_group_exits = (that.highlight.toLowerCase() === name.toLowerCase());
                    }
                }
                return this;
            },
            highlightRect : function () {
                if(that.flag) {
                    function setTimeoutHighlight() {
                        y = that.highlight_y_positions - 5;                    
                    
                        var highlight_rect = that.group.selectAll(".highlight-groupedBar-rect")
                            .data([that.highlight])

                        highlight_rect.enter()
                            .append("rect")

                        highlight_rect.attr("class","highlight-groupedBar-rect")
                            .attr({
                                "x" : 0,
                                "y" : y,
                                "height" : (that.y1.rangeBand()* that.group_data.length)+10,
                                "width" : that.reduced_width + 5,
                                "fill" : "none",
                                "stroke" : that.highlight_color,
                                "stroke-width" : "1.5px",
                                "stroke-dasharray" : "5,5",
                                "stroke-opacity" : 1
                            });
                        highlight_rect.exit()
                            .remove();
                        if(PykCharts["boolean"](that.highlight_y_positions)) {
                            highlight_array = that.highlight;
                        } else {
                            highlight_rect
                                .remove()
                        }
                    }
                    setTimeout(setTimeoutHighlight, that.transitions.duration());
                }
                return this;
            },
            newYAxis : function () {
                if(PykCharts["boolean"](that.axis_y_enable)) {
                    if(that.axis_y_position === "right") {
                        that.new_yAxisgroup.attr("transform", "translate(" + (that.chart_width - that.margin_left - that.margin_right - that.legendsGroup_width) + ",0)");
                    }
                    var yaxis = d3.svg.axis()
                        .scale(that.yScale)
                        .orient(that.axis_y_pointer_position)
                        .tickSize(0)
                        .outerTickSize(that.axis_y_outer_pointer_length);
                    that.new_yAxisgroup.style("stroke",function () { return that.axis_y_line_color; })
                        .call(yaxis);
                    d3.selectAll(that.selector + " .y.new-axis text")
                        .style({
                            "display": function () { return "none"; },
                            "stroke": "none"
                        });
                }
                return this;
            },
            sort : function() {
                if(that.axis_y_data_format === "string") {
                    try {
                        if(that.data_sort_type === "alphabetically") {
                            that.data = that.k.__proto__._sortData(that.data, "y", "group", that);
                        } else {
                            that.data_sort_type = multiDimensionalCharts.data_sort_type;
                            throw "data_sort_type";
                        }
                    }
                    catch(err) {
                        that.k.warningHandling(err,"8");
                    }
                }
                return this;
            }
        }
        return optional;
    };
};