PykCharts.multiD.bar = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    var multiDimensionalCharts = theme.multiDimensionalCharts;
    this.execute = function () {
        that = new PykCharts.multiD.processInputs(that, options, "bar");
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
        if(that.stop)
            return;
         that.panels_enable = "no";

        if(that.mode === "default") {
           that.k.loading();
        }

        that.multiD = new PykCharts.multiD.configuration(that);
            that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(that.selector+" #chart-loader").remove();
                return;
            }
            that.data = that.k.__proto__._groupBy("bar",data);
            that.compare_data = that.k.__proto__._groupBy("bar",data);
            that.axis_x_data_format = "number";
            that.axis_y_data_format = that.k.yAxisDataFormatIdentification(that.data);
            if(that.axis_y_data_format === "time") {
                that.axis_y_data_format = "string";
            }
            $(that.selector+" #chart-loader").remove();
            $(options.selector).css("height","auto");
            that.render();
        };
        that.format = that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };

    this.transformData = function () {
        that.optionalFeatures().sort();
        that.data.forEach(function(d) {
            d.name = d.y;
        })
    }

    this.render = function () {
        var l = $(".svgcontainer").length;
        that.container_id = "svgcontainer" + l;

        that.border = new PykCharts.Configuration.border(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.mouseEvent1 = new PykCharts.multiD.mouseEvent(options);
        that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);
        that.transformData();

        // if(that.axis_x_data_format === "time") {
        //     that.data.forEach(function (d) {
        //         d.x =that.k.dateConversion(d.x);
        //     });
        // }

        that.map_group_data = that.multiD.mapGroup(that.data);

        if(that.mode === "default") {

            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+that.container_id,"barChart")
                .emptyDiv()
                .subtitle()
                .makeMainDiv(that.selector,1);

            that.optionalFeatures()
                .svgContainer(1)
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
                that.k.yAxis(that.svgContainer,that.ygroup,that.yScale,that.y_domain,that.y_tick_values,null,"bar");
                that.optionalFeatures().newYAxis();
            } else {
                that.k.yAxis(that.svgContainer,that.ygroup,that.yScale,that.y_domain,that.y_tick_values);
            }
        } else if(that.mode === "infographics") {
            that.k.backgroundColor(that)
                .export(that,"#"+that.container_id,"barChart")
                .emptyDiv()
                .makeMainDiv(that.selector,1);

            that.optionalFeatures()
                .svgContainer(1)
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
                that.k.yAxis(that.svgContainer,that.ygroup,that.yScale,that.y_domain,that.y_tick_values,null,"bar");
                that.optionalFeatures().newYAxis();
            } else {
                that.k.yAxis(that.svgContainer,that.ygroup,that.yScale,that.y_domain,that.y_tick_values);
            }
        }
        that.k.exportSVG(that,"#"+that.container_id,"barChart")
        $(document).ready(function () { return that.k.resize(that.svgContainer,""); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer,""); });

    };

    this.refresh = function () {
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
        
        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
    };

    this.optionalFeatures = function () {
        var status;
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
                    .attr("transform","translate(" + that.margin_left + "," + (that.margin_top/* + that.legendsGroup_height*/) +")");

                if(PykCharts.boolean(that.grid_y_enable)) {
                    that.group.append("g")
                        .attr("id","ygrid")
                        .style("stroke",that.grid_color)
                        .attr("class","y grid-line");

                }
                return this;
            },
             newYAxis : function () {
                if(PykCharts["boolean"](that.axis_y_enable)) {
                    if(that.axis_y_position === "right") {
                        gsvg.attr("transform", "translate(" + (that.width - that.margin_left - that.margin_right) + ",0)");
                    }
                    var yaxis = d3.svg.axis()
                        .scale(that.yScale)
                        .orient(that.axis_y_pointer_position)
                        .tickSize(0)
                        .outerTickSize(that.axis_y_outer_pointer_length);
                    that.new_yAxisgroup.style("stroke",function () { return that.axis_y_line_color; })
                        .call(yaxis);
                    d3.selectAll(that.selector + " .y.new-axis text").style("display",function () { return "none"; })
                        .style("stroke","none");
                }
                return this;
            },
            axisContainer : function () {
                if(PykCharts.boolean(that.axis_x_enable)  || that.axis_x_title) {
                    that.xgroup = that.group.append("g")
                        .attr("id","xaxis")
                        .attr("class", "x axis")
                        .style("stroke","none");
                }

                if(PykCharts.boolean(that.axis_y_enable)  || that.axis_y_title) {
                    that.ygroup = that.group.append("g")
                        .attr("id","yaxis")
                        .attr("class","y axis");
                    that.new_yAxisgroup = that.group.append("g")
                        .attr("class", "y new-axis")
                        .attr("id","new-yaxis")
                        .style("stroke","blue");
                    
                }
                return this;
            },
            createColumn: function () {
                that.x_tick_values = that.k.processXAxisTickValues();
                that.y_tick_values = that.k.processYAxisTickValues();
                that.reducedWidth = that.width - that.margin_left - that.margin_right;
                that.reducedHeight = that.height - that.margin_top - that.margin_bottom;
                var height = that.height - that.margin_top - that.margin_bottom;
                var x_domain,x_data = [],y_data = [],y_range,x_range,y_domain, min_x_tick_value,max_x_tick_value, min_y_tick_value,max_y_tick_value;

                if(that.axis_y_data_format === "number") {
                    y_domain = [0,d3.max(that.data,function (d) { return d.y; })];
                    y_data = that.k._domainBandwidth(y_domain,1);
                    y_range = [that.height - that.margin_top - that.margin_bottom, 0];
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
                    y_range1 = [0,that.height - that.margin_top - that.margin_bottom];
                    that.yScale = that.k.scaleIdentification("ordinal",y_data1,y_range1,0.3);
                    that.extra_top_margin = (that.yScale.rangeBand() / 2);

                } else if(that.axis_y_data_format === "string") {
                    y_data = that.data.map(function (d) { return d.y; });
                    y_range = [0,that.height - that.margin_top - that.margin_bottom];
                    that.yScale = that.k.scaleIdentification("ordinal",y_data,y_range,0.3);
                    that.extra_top_margin = (that.yScale.rangeBand() / 2);

                }

                if(that.axis_x_data_format === "number") {
                    x_domain = [0,d3.max(that.data,function (d) {  return d.x; })];
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
                
                that.bar = that.group.selectAll(".bar")
                    .data(that.data)

                that.bar.enter()
                    .append("g")
                    .attr("class","bar")
                    .append("svg:rect");

                that.bar.attr("class","bar")
                    .select("rect")
                    .attr("class","hbar")
                    .attr("y", function (d) { return that.yScale(d.y); })
                    .attr("x", 0)
                    .attr("height",function (d) { 
                        return (that.reducedHeight/(that.data.length))-(0.03*that.reducedHeight); 
                    })
                    .attr("width",0)
                    .attr("fill", function (d) { return that.fillColor.colorPieMS(d); })
                    .attr("stroke", that.border.color())
                    .attr("stroke-width",that.border.width())
                    .on('mouseover',function (d) {
                        if(that.mode === "default") {
                            if(PykCharts.boolean(that.onhover_enable)) {
                                that.mouseEvent1.highlight(that.selector+" "+".hbar", this);
                            }
                            if (PykCharts['boolean'](options.tooltip_enable)) {
                                that.mouseEvent.tooltipPosition(d);
                                that.mouseEvent.tooltipTextShow(d.tooltip ? d.tooltip : d.x);
                            }
                        }
                    })
                    .on('mouseout',function (d) {
                        if(that.mode === "default") {
                            if(PykCharts.boolean(that.onhover_enable)) {
                                that.mouseEvent1.highlightHide(that.selector+" "+".hbar");
                            }
                            if (PykCharts['boolean'](options.tooltip_enable)) {
                                that.mouseEvent.tooltipHide(d);
                            }
                            that.mouseEvent.axisHighlightHide(that.selector+" "+".y.axis")
                        }
                    })
                    .on('mousemove', function (d) {
                        if(that.mode === "default") {
                            if (PykCharts['boolean'](options.tooltip_enable)) {
                                that.mouseEvent.tooltipPosition(d);
                            }
                            that.mouseEvent.axisHighlightShow([d.y],that.selector+" "+".y.axis",that.y_domain);
                        }                       
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("width", function (d) { return that.xScale(d.x); });

                that.bar.exit()
                    .remove();
                var t = d3.transform(d3.select(d3.selectAll(options.selector + ' .bar')[0][(that.data.length-1)]).attr("transform")),
                    x = t.translate[0],
                    y = t.translate[1];
                y_range = [(that.reducedHeight - y - (that.yScale.rangeBand()/2)),(y + (that.yScale.rangeBand()/2))];
                that.yScale1 = that.k.scaleIdentification("linear",y_data,y_range);
                return this;
            },
            ticks: function() {
                if(that.pointer_size) {
                    var tick_label = that.group.selectAll(".tickLabel")
                        .data(that.data);

                    tick_label.enter()
                        .append("text")

                    tick_label.attr("class","tickLabel")
                        .style("font-weight", that.pointer_weight)
                        .style("font-size", that.pointer_size + "px")
                        .attr("fill", that.pointer_color)
                        .style("font-family", that.pointer_family)
                        .text("");

                    setTimeout(function () {
                        tick_label.attr("x", function (d) { return that.xScale(d.x); })
                            .attr("y",function (d) { return that.yScale(d.name) + ((that.reducedHeight/(that.data.length))-(0.03*that.reducedHeight))/2; })
                            .attr("dx",4)
                            .attr("dy",4)
                            .text(function (d) { 
                                return d.x; 
                            });
                    }, that.transitions.duration());
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
                        case "date":            column_to_be_sorted = "y";
                                                break;
                        case "numerically":     column_to_be_sorted = "x";
                                                break;
                    }
                    that.data = that.k.__proto__._sortData(that.data, column_to_be_sorted, "group", that);
                }
            }
        };
        return optional;
    };
};