PykCharts.multiD.column = function (options) {
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
            that.render();
        };
        that.format = that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };

    this.transformData = function () {
        that.data.forEach(function(d){
            d.name = d.x;
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
        if(that.axis_x_data_format === "time") {
            that.data.forEach(function (d) {
                d.x =that.k.dateConversion(d.x);
            });
        }

        that.map_group_data = that.multiD.mapGroup(that.data);

        if(that.mode === "default") {

            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+that.container_id,"columnChart")
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
                .axisContainer();

            that.k.yAxis(that.svgContainer,that.ygroup,that.yScale,that.y_domain,that.y_tick_values)
                .xAxis(that.svgContainer,that.xgroup,that.xScale,that.extra_left_margin,that.x_domain,that.x_tick_values)
                .yGrid(that.svgContainer,that.group,that.yScale)
                .xAxisTitle(that.xgroup)
                .yAxisTitle(that.ygroup);

        } else if(that.mode === "infographic") {
            that.k.backgroundColor(that)
                .export(that,"#"+that.container_id,"columnChart")
                .emptyDiv()
                .makeMainDiv(that.selector,1);

            that.optionalFeatures().svgContainer()
                .createColumn();

            that.k.tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

            that.k.yAxis(that.svgContainer,that.ygroup,that.yScale)
                .xAxis(that.svgContainer,that.xgroup,that.xScale);
        }
        that.k.exportSVG(that,"#"+that.container_id,"columnChart")
        $(document).ready(function () { return that.k.resize(that.svgContainer,""); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer,""); });

    };

    this.refresh = function () {
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
                });
            }

        that.map_group_data = that.multiD.mapGroup(that.data);

            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }

            that.optionalFeatures()
                .createColumn();

            that.k.yAxis(that.svgContainer,that.ygroup,that.yScale,that.y_domain,that.y_tick_values)
                .xAxis(that.svgContainer,that.xgroup,that.xScale,that.extra_left_margin,that.x_domain,that.x_tick_values)
                .yGrid(that.svgContainer,that.group,that.yScale)                    
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
                }
                return this;
            },
            createColumn: function () {
                that.x_tick_values = that.k.processXAxisTickValues();
                that.y_tick_values = that.k.processYAxisTickValues();
                that.reducedWidth = that.width - that.margin_left - that.margin_right;

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

                    that.yScale = that.k.scaleIdentification("linear",y_data,y_range);
                    that.extra_top_margin = 0;

                } else if(that.axis_y_data_format === "string") {
                    y_data = that.data.map(function (d) { return d.y; });
                    y_range = [0,that.height - that.margin_top - that.margin_bottom];
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

                    y_range = [that.height - that.margin_top - that.margin_bottom, 0];
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

                    that.xScale = that.k.scaleIdentification("linear",x_data,x_range);
                    that.extra_left_margin = 0;
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
                    .attr("x", function (d) { return that.xScale(d.x); })
                    .attr("y", height)
                    .attr("height", 0)
                    .attr("width", function (d) { return (that.reducedWidth/(that.data.length))-(0.03*that.reducedWidth); })
                    .attr("fill", function (d) { return that.fillColor.colorPieMS(d); })
                    .attr("stroke", that.border.color())
                    .attr("stroke-width",that.border.width())
                    .on('mouseover',function (d) {
                        if(PykCharts.boolean(that.onhover_enable)) {
                            that.mouseEvent1.highlight(that.selector+" "+".hbar", this);
                        }
                        that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.tooltipTextShow(d.tooltip ? d.tooltip : d.y);
                    })
                    .on('mouseout',function (d) {
                        if(PykCharts.boolean(that.onhover_enable)) {
                            that.mouseEvent1.highlightHide(that.selector+" "+".hbar");
                        }
                        that.mouseEvent.tooltipHide(d);
                        that.mouseEvent.axisHighlightHide(that.selector+" "+".x.axis")
                    })
                    .on('mousemove', function (d) {
                        that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.axisHighlightShow(d.x,that.selector+" "+".x.axis",that.x_domain);                       
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("y", function (d) { return that.yScale(d.y); })
                    .attr("height", function (d) { return height - that.yScale(d.y); });

                that.bar.exit()
                    .remove();

                return this;
            }
        };
        return optional;
    };
};