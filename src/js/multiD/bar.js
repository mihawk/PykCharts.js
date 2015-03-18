PykCharts.multiD.bar = function (options) {
    var that = this;
    that.interval = "";
    var theme = new PykCharts.Configuration.Theme({});
    var multiDimensionalCharts = theme.multiDimensionalCharts;
    this.execute = function (pykquery_data) {
        that = new PykCharts.validation.processInputs(that, options, 'multiDimensionalCharts');
        PykCharts.scaleFunction(that);
        that.data_sort_enable = options.data_sort_enable ? options.data_sort_enable.toLowerCase() : multiDimensionalCharts.data_sort_enable;
        that.data_sort_type = PykCharts['boolean'](that.data_sort_enable) && options.data_sort_type ? options.data_sort_type.toLowerCase() : multiDimensionalCharts.data_sort_type;
        that.data_sort_order = PykCharts['boolean'](that.data_sort_enable) && options.data_sort_order ? options.data_sort_order.toLowerCase() : multiDimensionalCharts.data_sort_order;
        try{
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
        that.k.storeInitialDivHeight();
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
            that.render();
        };
        if (PykCharts.boolean(that.interactive_enable)) {
            that.k.dataFromPykQuery(pykquery_data);
            that.k.dataSourceFormatIdentification(that.data,that,"executeData");
        } else {
            that.k.dataSourceFormatIdentification(options.data,that,"executeData");
        }   
    };

    this.transformData = function () {
        var group_arr = [], uniq_group_arr = [];
        
        that.optionalFeatures().sort();
        if (options.chart_color != undefined && options.chart_color.length != 0) {
            that.chart_color[0] = options.chart_color[0];
        }
        else {
            for (var i=0,len=that.data.length ; i<len ; i++) {
                if (that.data[i].color != undefined && that.data[i].color != "") {
                    that.chart_color[0] = that.data[i].color;
                    if (options.axis_y_pointer_color == undefined || options.axis_y_pointer_color == "") {            
                        that.axis_y_pointer_color = that.chart_color[0];
                    }
                    break;
                }
            }
            
        }        
        that.data.forEach(function(d) {
            d.x = (that.axis_x_data_format === "number") ? parseFloat(d.x) : d.x;
            d.name = d.y;
            d.color = that.chart_color[0];
        });

        for(var j=0, len=that.data.length ; j<len ; j++) {
            group_arr[j] = that.data[j].group;
        }
        uniq_group_arr = that.k.__proto__._unique(group_arr);
        that.no_of_groups = uniq_group_arr.length;
    }

    this.render = function () {
        var id = that.selector.substring(1,that.selector.length),
            container_id = id + "_svg";

        that.border = new PykCharts.Configuration.border(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        // that.mouseEvent1 = new PykCharts.multiD.mouseEvent(options);
        that.mouseEvent1 = new PykCharts.Configuration.mouseEvent(options);
        that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);
        that.transformData();

        try {
            if(that.no_of_groups > 1) {
                throw "Invalid data in the JSON";
            }
        }
        catch (err) {
            console.error('%c[Error - Pykih Charts] ', 'color: red;font-weight:bold;font-size:14px', " at "+that.selector+". \""+err+"\"  Visit www.pykcharts.com/errors#error_9");
            return;
        }

        that.map_group_data = that.multiD.mapGroup(that.data);

        if(that.mode === "default") {

            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+container_id,"barChart")
                .emptyDiv(that.selector)
                .subtitle()
                .makeMainDiv(that.selector,1);

            that.optionalFeatures()
                .svgContainer(container_id,1)
                .createGroups();

            that.k.liveData(that)
                .tooltip()
                .createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

            that.optionalFeatures()
                .createColumn()
                .axisContainer()
                .ticks();

            that.k.xAxis(that.svgContainer,that.xgroup,that.xScale,that.extra_left_margin,that.x_domain,that.x_tick_values)
                .xAxisTitle(that.xgroup)
                .yAxisTitle(that.ygroup);
            if(that.axis_y_data_format !== "string") {
                that.k.yAxis(that.svgContainer,that.ygroup,that.yScale,that.y_domain,that.y_tick_values,null,"bar",null,that);
                that.optionalFeatures().newYAxis();
            } else {
                that.k.yAxis(that.svgContainer,that.ygroup,that.yScale,that.y_domain,that.y_tick_values,null,null,null,that);
            }
        } else if(that.mode === "infographics") {
            that.k.backgroundColor(that)
                .export(that,"#"+container_id,"barChart")
                .emptyDiv(that.selector)
                .makeMainDiv(that.selector,1);

            that.optionalFeatures()
                .svgContainer(container_id,1)
                .createGroups();

            that.k.liveData(that)
                .tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

            that.optionalFeatures()
                .createColumn()
                .axisContainer()
                .ticks();
            
            that.k.xAxis(that.svgContainer,that.xgroup,that.xScale,that.extra_left_margin,that.x_domain,that.x_tick_values)
                .xAxisTitle(that.xgroup)
                .yAxisTitle(that.ygroup);
            if(that.axis_y_data_format !== "string") {
                that.k.yAxis(that.svgContainer,that.ygroup,that.yScale,that.y_domain,that.y_tick_values,null,"bar",null,that);
                that.optionalFeatures().newYAxis();
            } else {
                that.k.yAxis(that.svgContainer,that.ygroup,that.yScale,that.y_domain,that.y_tick_values,null,null,null,that);
            }
        }
        that.k.exportSVG(that,"#"+container_id,"barChart")

        var resize = that.k.resize(that.svgContainer);
        that.k.__proto__._ready(resize);
        window.addEventListener('resize', function(event){
            return that.k.resize(that.svgContainer,"");
        });
    };

    this.refresh = function (pykquery_data) {
       that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("bar",data);
            that.refresh_data = that.k.__proto__._groupBy("bar",data);
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            that.transformData();

            if(that.axis_x_data_format === "time") {
                that.data.forEach(function (d) {
                    d.x =that.k.dateConversion(d.x);
                });
            }

            that.map_group_data = that.multiD.mapGroup(that.data);

            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }

            that.optionalFeatures()
                .createColumn()
                .ticks();

            that.k.xAxis(that.svgContainer,that.xgroup,that.xScale,that.extra_left_margin,that.x_domain,that.x_tick_values);
            if(that.axis_y_data_format !== "string") {
                that.k.yAxis(that.svgContainer,that.ygroup,that.yScale,that.y_domain,that.y_tick_values,null,"bar");
                that.optionalFeatures().newYAxis();
            } else {
                that.k.yAxis(that.svgContainer,that.ygroup,that.yScale,that.y_domain,that.y_tick_values);
            }
        };
        
        if (PykCharts.boolean(that.interactive_enable)) {
            that.k.dataFromPykQuery(pykquery_data);
            that.k.dataSourceFormatIdentification(that.data,that,"executeRefresh");
        } else {
            that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
        }   
    };

    this.optionalFeatures = function () {
        var id = that.selector.substring(1,that.selector.length);
        var status;
        var optional = {
            svgContainer: function (container_id,i) {
                document.getElementById(id).className += " PykCharts-twoD";
                that.svgContainer = d3.select(that.selector + " #chart-container-" + i)
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
                       "id" : "bar-group",
                       "transform" : "translate(" + that.chart_margin_left + "," + (that.chart_margin_top) +")"
                    });

                if(PykCharts.boolean(that.chart_grid_y_enable)) {
                    that.group.append("g")
                        .attr({
                            "id" : "ygrid",
                            "class" : "y grid-line"
                        });
                }
                return this;
            },
            newYAxis : function () {
                if(PykCharts["boolean"](that.axis_y_enable)) {
                    if(that.axis_y_position === "right") {
                        gsvg.attr("transform", "translate(" + (that.chart_width - that.chart_margin_left - that.chart_margin_right) + ",0)");
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
                            "display" : function () { return "none"; },
                            "stroke" : "none"
                        });
                }
                return this;
            },
            axisContainer : function () {
                if(PykCharts.boolean(that.axis_x_enable)  || that.axis_x_title) {
                    that.xgroup = that.group.append("g")
                        .attr({
                            "id" : "xaxis",
                            "class" : "x axis"
                        })
                        .style("stroke","none");
                }

                if(PykCharts.boolean(that.axis_y_enable)  || that.axis_y_title) {
                    that.ygroup = that.group.append("g")
                        .attr({
                            "id" : "yaxis",
                            "class" : "y axis"
                        });

                    that.new_yAxisgroup = that.group.append("g")
                        .attr({
                            "id" : "new-yaxis",
                            "class" : "y new-axis"
                        })
                        .style("stroke","blue");                    
                }
                return this;
            },
            createColumn: function () {
                that.x_tick_values = that.k.processXAxisTickValues();
                that.y_tick_values = that.k.processYAxisTickValues();
                that.reducedWidth = that.chart_width - that.chart_margin_left - that.chart_margin_right;
                that.reducedHeight = that.chart_height - that.chart_margin_top - that.chart_margin_bottom;
                var height = that.chart_height - that.chart_margin_top - that.chart_margin_bottom;
                var x_domain,x_data = [],y_data = [],y_range,x_range,y_domain, min_x_tick_value,max_x_tick_value, min_y_tick_value,max_y_tick_value;

                if(that.axis_y_data_format === "number") {
                    y_domain = [0,d3.max(that.data,function (d) { return d.y; })];
                    y_data = that.k._domainBandwidth(y_domain,1);
                    y_range = [that.chart_height - that.chart_margin_top - that.chart_margin_bottom, 0];
                    min_y_tick_value = d3.min(that.y_tick_values);
                    max_y_tick_value = d3.max(that.y_tick_values);

                    if(y_data[0] > min_y_tick_value) {
                        y_data[0] = min_y_tick_value;
                    }
                    if(y_data[1] < max_y_tick_value) {
                        y_data[1] = max_y_tick_value;
                    }
                    that.data.sort(function (a,b) {
                        return a.y - b.y;
                    })
                    that.yScale1 = that.k.scaleIdentification("linear",y_data,y_range);
                    y_data1 = that.data.map(function (d) { return d.y; });
                    y_range1 = [0,that.chart_height - that.chart_margin_top - that.chart_margin_bottom];
                    that.yScale = that.k.scaleIdentification("ordinal",y_data1,y_range1,0.3);
                    that.extra_top_margin = (that.yScale.rangeBand() / 2);

                } else if(that.axis_y_data_format === "string") {
                    y_data = that.data.map(function (d) { return d.y; });
                    y_range = [0,that.chart_height - that.chart_margin_top - that.chart_margin_bottom];
                    that.yScale = that.k.scaleIdentification("ordinal",y_data,y_range,0.3);
                    that.extra_top_margin = (that.yScale.rangeBand() / 2);

                }

                if(that.axis_x_data_format === "number") {
                    x_domain = [0,d3.max(that.data,function (d) {  return +d.x; })];
                    x_data = that.k._domainBandwidth(x_domain,1);
                    x_range = [0 ,that.reducedWidth];
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

                that.x_domain = that.xScale.domain();
                that.y_domain = that.yScale.domain();
                
                that.bar = that.group.selectAll(".bar-rect")
                    .data(that.data);

                that.bar.enter()
                    .append("g")
                    .attr("class","bar-rect")
                    .append("svg:rect");

                that.bar.attr("class","bar-rect")
                    .select("rect")
                    .attr({
                        "class" : "hbar",
                        "y" :  function (d) { return that.yScale(d.y); },
                        "x" : 0,
                        "height" : function (d) {return that.yScale.rangeBand(d.y);},
                        "width" : 0,
                        "fill" : function (d) { return that.fillColor.colorPieMS(d); },
                        "stroke" : that.border.color(),
                        "stroke-width" : that.border.width(),
                        "stroke-dasharray": that.border.style(),
                        "data-id":function (d,i) {
                            return d.name;
                        }
                    })
                    .on({
                        'mouseover': function (d) {
                            if(that.mode === "default") {
                                if(PykCharts.boolean(that.chart_onhover_highlight_enable)) {
                                    that.mouseEvent1.highlight(that.selector+" "+".hbar", this);
                                }
                                if (PykCharts['boolean'](that.tooltip_enable)) {
                                    that.mouseEvent.tooltipPosition(d);
                                    that.mouseEvent.tooltipTextShow(d.tooltip ? d.tooltip : d.x);
                                }
                            }
                        },
                        'mouseout': function (d) {
                            if(that.mode === "default") {
                                if(PykCharts.boolean(that.chart_onhover_highlight_enable)) {
                                    that.mouseEvent1.highlightHide(that.selector+" "+".hbar");
                                }
                                if (PykCharts['boolean'](that.tooltip_enable)) {
                                    that.mouseEvent.tooltipHide(d);
                                }
                                that.mouseEvent.axisHighlightHide(that.selector+" "+".y.axis")
                            }
                        },
                        'mousemove': function (d) {
                            if(that.mode === "default") {
                                if (PykCharts['boolean'](that.tooltip_enable)) {
                                    that.mouseEvent.tooltipPosition(d);
                                }
                                that.mouseEvent.axisHighlightShow([d.y],that.selector+" "+".y.axis",that.y_domain);
                            }
                        },
                        'click': function (d,i) {
                            if(PykCharts['boolean'](that.click_enable)){
                               that.addEvents(d.name, d3.select(this).attr("data-id")); 
                            }                     
                        }
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("width", function (d) { return that.xScale(d.x); });

                that.bar.exit()
                    .remove();

                var t = d3.transform(d3.select(d3.selectAll(that.selector + ' .bar-rect')[0][(that.data.length-1)]).attr("transform")),
                    x = t.translate[0],
                    y = t.translate[1];
                y_range = [(that.reducedHeight - y - (that.yScale.rangeBand()/2)),(y + (that.yScale.rangeBand()/2))];
                that.yScale1 = that.k.scaleIdentification("linear",y_data,y_range);
                return this;
            },
            ticks: function() {
                if(that.pointer_size) {
                    var tick_label = that.group.selectAll(".ticks_label")
                        .data(that.data);

                    tick_label.enter()
                        .append("text")

                    tick_label.attr("class","ticks_label")
                        .attr("fill", that.pointer_color)
                        .style({
                            "font-weight": that.pointer_weight,
                            "font-size": that.pointer_size + "px",
                            "font-family": that.pointer_family
                        })
                        .text("");

                    function setTimeoutTicks () {
                        tick_label
                            .attr({
                                "x" : function (d) { return that.xScale(d.x); },
                                "y" : function (d) { return that.yScale(d.name) + that.yScale.rangeBand(d.y)/2; },
                                "dx" : 4,
                                "dy" : 4,
                            })
                            .text(function (d) { 
                                return d.x; 
                            });
                    }
                    setTimeout(setTimeoutTicks ,that.transitions.duration());

                }
                return this;
            },
            sort : function () {
                if(that.axis_y_data_format === "string") {
                    try {
                        if(that.data_sort_type === "alphabetically" || that.data_sort_type === "numerically") {
                        } else {
                            that.data_sort_type = multiDimensionalCharts.data_sort_type;
                            throw "data_sort_type";
                        }
                    }
                    catch(err) {
                        that.k.warningHandling(err,"8");
                    }
                    var column_to_be_sorted = "";
                    switch (that.data_sort_type) {
                        case "alphabetically":
                        case "date":
                            column_to_be_sorted = "y";
                            break;
                        case "numerically":
                            column_to_be_sorted = "x";
                            break;
                    }
                    that.data = that.k.__proto__._sortData(that.data, column_to_be_sorted, "group", that,"notApplicable");
                }
            }
        };
        return optional;
    };
};