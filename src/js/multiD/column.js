PykCharts.multiD.column = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function (pykquery_data) {
        that = new PykCharts.validation.processInputs(that, options, 'multiDimensionalCharts');
        PykCharts.scaleFunction(that);
        PykCharts.grid(that);
        if(that.stop){
            return;
        }
        that.panels_enable = "no";
        that.k.storeInitialDivHeight();

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
            that.render();
        };
        if (PykCharts.boolean(options.interactive_enable)) {
            that.k.dataFromPykQuery(pykquery_data);
            that.k.dataSourceFormatIdentification(that.data,that,"executeData");
        } else {
            that.k.dataSourceFormatIdentification(options.data,that,"executeData");
        }   
    };

    this.transformData = function () {
        that.data.forEach(function(d){
            d.name = d.x;
            d.color = that.chart_color[0];
        })
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

        if(that.axis_x_data_format === "time") {
            that.data.forEach(function (d) {
                d.x =that.k.dateConversion(d.x);
            });
        }

      //  that.map_group_data = that.multiD.mapGroup(that.data);
        if(that.mode === "default") {

            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+container_id,"columnChart")
                .emptyDiv(options.selector)
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
                .axisContainer();

            that.k.yAxis(that.svgContainer,that.ygroup,that.yScale,that.y_domain,that.y_tick_values)
                .yGrid(that.svgContainer,that.group,that.yScale)
                .xAxisTitle(that.xgroup)
                .yAxisTitle(that.ygroup);
            if(that.axis_x_data_format !== "string") {
                that.k.xAxis(that.svgContainer,that.xgroup,that.xScale,that.extra_left_margin,that.x_domain,that.x_tick_values,null,"bar")
                that.optionalFeatures().newXAxis();
            } else {
                that.k.xAxis(that.svgContainer,that.xgroup,that.xScale,that.extra_left_margin,that.x_domain,that.x_tick_values)
            }

        } else if(that.mode === "infographics") {
            that.k.backgroundColor(that)
                .export(that,"#"+container_id,"columnChart")
                .emptyDiv(options.selector)
                .makeMainDiv(that.selector,1);

            that.optionalFeatures()
                .svgContainer(container_id,1)
                .createGroups();

            that.k.liveData(that)
                .tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

            that.optionalFeatures()
                .createColumn()
                .axisContainer();

            that.k.yAxis(that.svgContainer,that.ygroup,that.yScale,that.y_domain,that.y_tick_values)
                .xAxisTitle(that.xgroup)
                .yAxisTitle(that.ygroup);
            if(that.axis_x_data_format !== "string") {
                that.k.xAxis(that.svgContainer,that.xgroup,that.xScale,that.extra_left_margin,that.x_domain,that.x_tick_values,null,"bar")
                that.optionalFeatures().newXAxis();
            } else {
                that.k.xAxis(that.svgContainer,that.xgroup,that.xScale,that.extra_left_margin,that.x_domain,that.x_tick_values)
            }
        }
        that.k.exportSVG(that,"#"+container_id,"columnChart")

        var resize = that.k.resize(that.svgContainer);
        that.k.__proto__._ready(resize);
        window.addEventListener('resize', function(event){
            return that.k.resize(that.svgContainer);
        });
    };

    this.refresh = function (pykquery_data) {
       that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("column",data);
            that.refresh_data = that.k.__proto__._groupBy("column",data);
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            that.transformData();
            if(that.axis_x_data_format === "time") {
                that.data.forEach(function (d) {
                    d.x =that.k.dateConversion(d.x);
                    d.color = that.chart_color[0];
                });
            }

    //    that.map_group_data = that.multiD.mapGroup(that.data);

            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }

            that.optionalFeatures()
                .createColumn();

            that.k.yAxis(that.svgContainer,that.ygroup,that.yScale,that.y_domain,that.y_tick_values)
                .yGrid(that.svgContainer,that.group,that.yScale);
            if(that.axis_x_data_format !== "string") {
                that.k.xAxis(that.svgContainer,that.xgroup,that.xScale,that.extra_left_margin,that.x_domain,that.x_tick_values,null,"bar")
                that.optionalFeatures().newXAxis();
            } else {
                that.k.xAxis(that.svgContainer,that.xgroup,that.xScale,that.extra_left_margin,that.x_domain,that.x_tick_values)
            }
        };
        
        if (PykCharts.boolean(options.interactive_enable)) {
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
                that.svgContainer = d3.select(that.selector + " #tooltip-svg-container-" + i)
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
                        "id": "column-group",
                        "transform": "translate(" + that.chart_margin_left + "," + (that.chart_margin_top/* + that.legendsGroup_height*/) +")"
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
            axisContainer : function () {
                if(PykCharts.boolean(that.axis_x_enable)  || that.axis_x_title) {
                    that.xgroup = that.group.append("g")
                        .attr({
                            "id": "xaxis",
                            "class": "x axis"
                        })
                        .style("stroke","none");
                }

                if(PykCharts.boolean(that.axis_y_enable)  || that.axis_y_title) {
                    that.ygroup = that.group.append("g")
                        .attr({
                            "id": "yaxis",
                            "class": "y axis"
                        });
                    that.new_xAxisgroup = that.group.append("g")
                        .attr({
                            "class": "x new-axis",
                            "id": "new-xaxis"
                        })
                        .style("stroke","blue");
                }
                return this;
            },
            createColumn: function () {
                that.x_tick_values = that.k.processXAxisTickValues();
                that.y_tick_values = that.k.processYAxisTickValues();
                that.reducedWidth = that.chart_width - that.chart_margin_left - that.chart_margin_right;

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

                    that.yScale = that.k.scaleIdentification("linear",y_data,y_range);
                    that.extra_top_margin = 0;


                } else if(that.axis_y_data_format === "string") {
                    y_data = that.data.map(function (d) { return d.y; });
                    y_range = [0,that.chart_height - that.chart_margin_top - that.chart_margin_bottom];
                    that.yScale = that.k.scaleIdentification("ordinal",y_data,y_range,0.3);
                    that.extra_top_margin = (that.yScale.rangeBand() / 2);

                } else if (that.axis_y_data_format === "time") {
                    y_data = d3.extent(that.data, function (d) {
                        return parseDate(d.y);
                    });

                    min_y_tick_value = d3.min(that.y_tick_values, function (d) {
                        return new Date(d);
                    });

                    max_y_tick_value = d3.max(that.y_tick_values, function (d) {
                        return new Date(d);
                    });

                    if(new Date(y_data[0]) > new Date(min_y_tick_value)) {
                        y_data[0] = min_y_tick_value;
                    }
                    if(new Date(y_data[1]) < new Date(max_y_tick_value)) {
                        y_data[1] = max__tick_value;
                    }

                    y_range = [that.chart_height - that.chart_margin_top - that.chart_margin_bottom, 0];
                    that.yScale = that.k.scaleIdentification("time",y_data,y_range);
                    that.extra_top_margin = 0;
                }
                if(that.axis_x_data_format === "number") {
                    x_domain = [0,d3.max(that.data,function (d) { return d.x; })];
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
                    that.data.sort(function (a,b) {
                        return a.x - b.x;
                    })
                    that.xScale1 = that.k.scaleIdentification("linear",x_data,x_range);
                    x_data1 = that.data.map(function (d) { return d.x; });
                    x_range1 = [0 ,that.reducedWidth];
                    that.xScale = that.k.scaleIdentification("ordinal",x_data1,x_range1,0.3);
                    that.extra_left_margin = (that.xScale.rangeBand()/2);

                } else if(that.axis_x_data_format === "string") {
                    x_data = that.data.map(function (d) { return d.x; });
                    x_range = [0 ,that.reducedWidth];
                    that.xScale = that.k.scaleIdentification("ordinal",x_data,x_range,0.3);
                    that.extra_left_margin = (that.xScale.rangeBand()/2);
                } else if (that.axis_x_data_format === "time") {
                    max = d3.max(that.data, function(k) { return (k.x); });
                    min = d3.min(that.data, function(k) { return (k.x); });
                    x_domain = [min.getTime(),max.getTime()];

                    min_x_tick_value = d3.min(that.x_tick_values, function (d) {
                        return that.k.dateConversion(d);
                    });

                    max_x_tick_value = d3.max(that.x_tick_values, function (d) {
                        return that.k.dateConversion(d);
                    });

                    if(x_data[0] > min_x_tick_value) {
                        x_data[0] = min_x_tick_value;
                    }
                    if(x_data[1] < max_x_tick_value) {
                        x_data[1] = max_x_tick_value;
                    }

                    x_range = [0 ,that.reducedWidth];
                    that.xScale = that.k.scaleIdentification("time",x_domain,x_range);
                    that.data.sort(function (a,b) {
                        if ((a.x) < (b.x)) {
                            return -1 ;
                        }
                        else if ((a.x) > (b.x)) {
                            return 1;
                        }
                    })
                    that.xScale1 = that.k.scaleIdentification("linear",x_data,x_range);
                    x_data1 = that.data.map(function (d) { return d.x; });
                    x_range1 = [0 ,that.reducedWidth];
                    that.xScale = that.k.scaleIdentification("ordinal",x_data1,x_range1,0.3);
                    that.extra_left_margin = (that.xScale.rangeBand()/2);

                }

                that.x_domain = that.xScale.domain();
                that.y_domain = that.yScale.domain();

                that.bar = that.group.selectAll(".column-rect")
                    .data(that.data)

                that.bar.enter()
                    .append("g")
                    .attr("class","column-rect")
                    .append("svg:rect");

                that.bar.attr("class","column-rect")
                    .select("rect")
                    .attr({
                        "class": "vcolumn",
                        "x": function (d) { return that.xScale(d.x); },
                        "y": height,
                        "height": 0,
                        "width": function (d) { return that.xScale.rangeBand(d.x); },
                        "fill": function (d) { return that.fillColor.colorPieMS(d); },
                        "stroke": that.border.color(),
                        "stroke-width": that.border.width(),
                        "stroke-dasharray": that.border.style(),
                        "data-id":function (d,i) {
                            return d.name;
                        }
                    })
                    .on({
                        'mouseover': function (d) {
                            if(that.mode === "default") {
                                if(PykCharts.boolean(that.chart_onhover_highlight_enable)) {
                                    that.mouseEvent1.highlight(that.selector+" "+".vcolumn", this);
                                }
                                if (PykCharts['boolean'](options.tooltip_enable)) {
                                    that.mouseEvent.tooltipPosition(d);
                                    that.mouseEvent.tooltipTextShow(d.tooltip ? d.tooltip : d.y);
                                }
                            }
                        },
                        'mouseout': function (d) {
                            if(that.mode === "default") {
                                if(PykCharts.boolean(that.chart_onhover_highlight_enable)) {
                                    that.mouseEvent1.highlightHide(that.selector+" "+".vcolumn");
                                }
                                if (PykCharts['boolean'](options.tooltip_enable)) {
                                    that.mouseEvent.tooltipHide(d);
                                }
                                that.mouseEvent.axisHighlightHide(that.selector+" "+".x.axis")
                            }
                        },
                        'mousemove': function (d) {
                            if(that.mode === "default") {
                                if (PykCharts['boolean'](options.tooltip_enable)) {
                                    that.mouseEvent.tooltipPosition(d);
                                }
                                that.mouseEvent.axisHighlightShow(d.x,that.selector+" "+".x.axis",that.x_domain);
                            }
                        },
                        'click': function (d,i) {
                            if(PykCharts['boolean'](options.click_enable)){
                               that.addEvents(d.name, d3.select(this).attr("data-id")); 
                            }                     
                        }
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr({
                        "y": function (d) { return that.yScale(d.y); },
                        "height": function (d) { return height - that.yScale(d.y); }
                    });

                that.bar.exit()
                    .remove();
                var t = d3.transform(d3.select(d3.selectAll(options.selector + ' .column-rect')[0][(that.data.length-1)]).attr("transform")),
                    x = t.translate[0],
                    y = t.translate[1];
                x_range = [(x + (that.xScale.rangeBand()/2)),(that.reducedWidth - x - (that.xScale.rangeBand()/2))];
                that.xScale1 = that.k.scaleIdentification("linear",x_data,x_range);
                return this;
            },
            newXAxis : function () {
                if(PykCharts["boolean"](that.axis_x_enable)) {
                    if(that.axis_x_position === "bottom") {
                        that.new_xAxisgroup.attr("transform", "translate(0," + (that.chart_height - that.chart_margin_top - that.chart_margin_bottom) + ")");
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
        };
        return optional;
    };
};