PykCharts.multiD.column = function(options){
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function () {
        that = new PykCharts.multiD.processInputs(that, options, "column");

        if(that.stop)
            return;

        // that.grid_y_enable = options.chart_grid_y_enable ? options.chart_grid_y_enable : theme.stylesheet.chart_grid_y_enable;
        that.grid_color = options.chart_grid_color ? options.chart_grid_color : theme.stylesheet.chart_grid_color;
         that.panels_enable = "no";

        if(that.mode === "default") {
           that.k.loading();
        }
        that.multiD = new PykCharts.multiD.configuration(that);
        d3.json(options.data, function(e, data) {

            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(that.selector+" #chart-loader").remove();
                return;
            }

            that.data = data.groupBy("column");
            that.compare_data = data.groupBy("column");
            that.axis_y_data_format = that.k.yAxisDataFormatIdentification(that.data);
            $(that.selector+" #chart-loader").remove();
            PykCharts.multiD.columnFunctions(options,that,"column");
            that.render();
        });
    };
};

PykCharts.multiD.groupedColumn = function(options){
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function () {
        that = new PykCharts.multiD.processInputs(that, options, "column");

        if(that.stop)
            return;

        // that.grid_y_enable = options.chart_grid_y_enable ? options.chart_grid_y_enable : theme.stylesheet.chart_grid_y_enable;
        that.grid_color = options.chart_grid_color ? options.chart_grid_color : theme.stylesheet.chart_grid_color;
         that.panels_enable = "no";

        if(that.mode === "default") {
           that.k.loading();
        }
        that.multiD = new PykCharts.multiD.configuration(that);
        d3.json(options.data, function(e, data){

            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(that.selector+" #chart-loader").remove();
                return;
            }

            that.data = data.groupBy("column");
            that.compare_data = data.groupBy("column");
            that.axis_y_data_format = that.k.yAxisDataFormatIdentification(that.data);
            $(that.selector+" #chart-loader").remove();
            PykCharts.multiD.columnFunctions(options,that,"group_column");
            that.render();
        });
    };
};

PykCharts.multiD.columnFunctions = function (options,chartObject,type) {
    var that = chartObject;
    that.refresh = function () {
        d3.json(options.data, function (e, data) {
            that.data = data.groupBy("column");
            that.refresh_data = data.groupBy("column");

            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.map_group_data = that.multiD.mapGroup(that.data);
            that.data = that.dataTransformation();
            that.data = that.emptygroups(that.data);

            var fD = that.flattenData();
            that.the_bars = fD[0];
            that.the_keys = fD[1];
            that.the_layers = that.buildLayers(that.the_bars);
            if(that.no_of_groups === 1) {
                that.legends_enable = "no";
            }

            that.optionalFeatures()
                    .createChart()
                    .legends();

            that.k.yAxis(that.svgContainer,that.yGroup,that.yScaleInvert,undefined,that.y_tick_values,that.legendsGroup_width)
                .yGrid(that.svgContainer,that.group,that.yScaleInvert,that.legendsGroup_width);
                // console.log("inside liveData");
        });
    };

    //----------------------------------------------------------------------------------------
    //4. Render function to create the chart
    //----------------------------------------------------------------------------------------
    that.render = function() {
        var that = this;
        var l = $(".svgcontainer").length;
        that.container_id = "svgcontainer" + l;
        that.map_group_data = that.multiD.mapGroup(that.data);
        that.data = that.dataTransformation();
        that.data = that.emptygroups(that.data);

        try {
            if(that.no_of_groups > 1 && type === "column") {
                throw "Invalid data in the JSON";
            }
        }
        catch (err) {
            console.error('%c[Error - Pykih Charts] ', 'color: red;font-weight:bold;font-size:14px', " at "+options.selector+". \""+err+"\"  Visit www.chartstore.io/docs#error_");
            return;
        }

        var fD = that.flattenData();
        that.the_bars = fD[0];
        that.the_keys = fD[1];
        that.the_layers = that.buildLayers(that.the_bars);
        that.border = new PykCharts.Configuration.border(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.mouseEvent1 = new PykCharts.multiD.mouseEvent(that);
        that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);


        if(that.no_of_groups === 1) {
            that.legends_enable = "no";
        }
        if(that.mode === "default") {
            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+that.container_id,"columnChart")
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

            that.k.yAxis(that.svgContainer,that.yGroup,that.yScaleInvert,undefined,that.y_tick_values,that.legendsGroup_width)
                 .yAxisTitle(that.yGroup)
                // .xAxis(that.svgContainer,that.xGroup,that.xScale)
                .yGrid(that.svgContainer,that.group,that.yScaleInvert,that.legendsGroup_width);

        } else if(that.mode === "infographics") {
            that.k.backgroundColor(that)
                .export(that,"#"+that.container_id,"columnChart")
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
            that.k.yAxis(that.svgContainer,that.yGroup,that.yScaleInvert,undefined,that.y_tick_values,that.legendsGroup_width)
                 .yAxisTitle(that.yGroup,that.legendsGroup_width);
        }

        that.k.exportSVG(that,"#"+that.container_id,"columnChart")
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
                    // .style("background-color",that.background_color)
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height);

                // $(options.selector).colourBrightness();
                return this;
            },
            createGroups: function (i) {
                // console.log(that.legendsGroup_height,"hello");
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
                // console.log(that.x_axis_enable);
                if(PykCharts.boolean(that.axis_x_enable)) {
                    // console.log("hey");
                    var axis_line = that.group.selectAll(".axis-line")
                        .data(["line"]);

                    axis_line.enter()
                            .append("line");

                    axis_line.attr("class","axis-line")
                            .attr("x1",0)
                            .attr("y1",that.height-that.margin_top-that.margin_bottom-that.legendsGroup_height)
                            .attr("x2",that.width-that.margin_left-that.margin_right - that.legendsGroup_width)
                            .attr("y2",that.height-that.margin_top-that.margin_bottom-that.legendsGroup_height)
                            .attr("stroke",that.axis_x_line_color);

                    axis_line.exit().remove();
                    if(that.axis_x_position === "top") {
                        axis_line.attr("y1",0)
                            .attr("y2",0);
                    }
                }

                if(PykCharts.boolean(that.axis_y_enable) || that.axis_y_enable) {
                    that.yGroup = that.group.append("g")
                        .attr("id","yaxis")
                        .attr("class","y axis");
                }
                if(that.axis_x_title) {
                    if (that.axis_x_position === "bottom") {
                        that.xGroup = that.group.append("g")
                            .attr("id","xaxis")
                            .attr("class", "x axis")
                            .style("stroke","none")
                            .append("text")
                                .attr("x", (that.width - that.margin_left - that.margin_right - that.legendsGroup_width)/2)
                                .attr("y", that.height -that.margin_bottom - that.margin_top - that.legendsGroup_height)
                                // .attr("dy", -8)
                                .attr("dy", that.margin_top + 10)
                                .style("text-anchor", "end")
                                .style("fill",that.axis_x_title_color)
                                .style("font-weight",that.axis_x_title_weight)
                                .style("font-family",that.axis_x_title_family)
                                .style("font-size",that.axis_x_title_size + "px")
                                .text(that.axis_x_title);

                    } else if(that.axis_x_position === "top") {

                        that.xGroup = that.group.append("g")
                            .attr("id","xaxis")
                            .attr("class", "x axis")
                            .style("stroke","none")
                            .append("text")
                                .attr("x", (that.width - that.margin_left - that.margin_right -that.legendsGroup_width)/2)
                                .attr("y", -40)
                                // .attr("dy", -8)
                                .attr("dy", that.margin_top + that.legendsGroup_height + 10)
                                .style("text-anchor", "end")
                                .style("fill",that.axis_x_title_color)
                                .style("font-weight",that.axis_x_title_weight)
                                .style("font-family",that.axis_x_title_family)
                                .style("font-size",that.axis_x_title_size +"px")
                                .text(that.axis_x_title);
                    }
                }
                return this;
            },
            createChart: function() {
                var w = that.width - that.margin_left - that.margin_right - that.legendsGroup_width;
                var h = that.height - that.margin_top - that.margin_bottom - that.legendsGroup_height,j=that.no_of_groups+1;

                var the_bars = that.the_bars;
                var keys = that.the_keys;
                that.groups= that.getGroups();
                var layers = that.the_layers;

                that.stack_layout = d3.layout.stack() // Create default stack
                    .values(function(d){ // The values are present deep in the array, need to tell d3 where to find it
                        return d.values;
                    })(layers);

                var y_data = [];
                layers.map(function(e, i){ // Get all values to create scale
                    // for(i in e.values){
                    for(i=0;i<e.values.length;i++) {
                        var d = e.values[i];
                        y_data.push(d.y + d.y0); // Adding up y0 and y to get total height
                    }
                });

                that.xScale = d3.scale.ordinal()
                    .domain(the_bars.map(function(e, i){
                        return e.id || i; // Keep the ID for bars and numbers for integers
                    }))
                    .rangeBands([0,w],0.1);
                that.highlight_y_positions = [];
                that.highlight_x_positions = [];
                that.y_tick_values = that.k.processYAxisTickValues();

                var min_y_tick_value,max_y_tick_value;

                y_domain = [0,d3.max(y_data)]
                y_domain = that.k.__proto__._domainBandwidth(y_domain,1);

                min_y_tick_value = d3.min(that.y_tick_values);
                max_y_tick_value = d3.max(that.y_tick_values);

                if(y_domain[0] > min_y_tick_value) {
                    y_domain[0] = min_y_tick_value;
                }
                if(y_domain[1] < max_y_tick_value) {
                    y_domain[1] = max_y_tick_value;
                }

                that.yScale = d3.scale.linear().domain(y_domain).range([0, h]);
                that.yScaleInvert = d3.scale.linear().domain([y_domain[1],y_domain[0]]).range([0, h]); // For the yAxis
                var zScale = d3.scale.category10();

                var group_arr = [], g, x, totalWidth, i;
                var x_factor = 0, width_factor = 0;
                if(that.no_of_groups === 1) {
                    x_factor = that.xScale.rangeBand()/4;
                    width_factor = (that.xScale.rangeBand()/(2*that.no_of_groups));
                };

                for(i in that.groups){
                    g = that.groups[i];
                    x = that.xScale(g[0]);
                    totalWidth = that.xScale.rangeBand() * g.length;
                    x = x + (totalWidth/2);
                    group_arr.push({x: x, name: i});
                }
                var len = w/group_arr.length;
                var bars = that.group.selectAll(".bars")
                    .data(layers);

                bars.attr("class","bars");
                bars.enter()
                        .append("g")
                        .attr("class", "bars");
                that.domain = group_arr.map(function (d) {
                    return d.name;
                });
                var text_height;
                var rect = bars.selectAll("rect")
                    .data(function(d,i){
                        return d.values;
                    });

                rect.enter()
                    .append("svg:rect")
                    .attr("class","rect");

                rect.attr("height", 0).attr("y", h)
                    .attr("fill", function(d) {
                        if(that.no_of_groups === 1) {
//                            console.log(that.fillColor.colorPieMS(d),d,"color")
                            return that.fillColor.colorPieMS(d);
                        } else {
                            return that.fillColor.colorGroup(d);
                        }
                    })
                    .attr("fill-opacity", function (d,i) {
                        if (that.color_mode === "saturation") {
                        // if(PykCharts.boolean(that.saturationEnable))     {

                            if(j>1) {
                                j--;
                                return j/that.no_of_groups;
                            } else {
                                j = that.no_of_groups+1;
                                j--;
                                return j/that.no_of_groups;
                            }
                        }
                    })
                    .attr("data-fill-opacity",function () {
                        return $(this).attr("fill-opacity");
                    })
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-dasharray", that.border.style())
                    .attr("stroke-opacity",1)
                    .on('mouseover',function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(d.tooltip ? d.tooltip : d.y);
                            that.mouseEvent.axisHighlightShow(d.name,options.selector + " " + ".axis-text",that.domain,"column");
                            if(PykCharts.boolean(that.onhover_enable)) {
                                that.mouseEvent.highlight(options.selector + " .rect", this);
                            }
                        }
                    })
                    .on('mouseout',function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipHide(d);
                            that.mouseEvent.axisHighlightHide(options.selector + " " + ".axis-text","column");
                            if(PykCharts.boolean(that.onhover_enable)) {
                                that.mouseEvent.highlightHide(options.selector + " .rect");
                            }
                        }
                     })
                    .on('mousemove', function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    });

                rect
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("x", function(d) {
                        if(that.highlight.toLowerCase() === d.name.toLowerCase()) {
                            that.highlight_x_positions.push(that.xScale(d.x) - x_factor);
                        }
                        return that.xScale(d.x) - x_factor;
                    })
                    .attr("width", function(d) {
                        return that.xScale.rangeBand()+width_factor;
                    })
                    .attr("height", function(d){
                        return that.yScale(d.y);
                    })
                    .attr("y", function(d){
                        if(that.highlight.toLowerCase() === d.name.toLowerCase()) {
                            that.highlight_y_positions.push(that.yScale(d.y0+d.y));
                        }
                        return h - that.yScale(d.y0 + d.y);
                    });

                bars.exit()
                    .remove();
                var flag, length = group_arr.length,
                    largest = 0, rangeband = len;

                if(PykCharts.boolean(that.axis_x_enable)) {
                    var xAxis_label = that.group.selectAll("text.axis-text")
                        .data(group_arr);

                    xAxis_label.enter()
                            .append("text")

                    xAxis_label.attr("class", "axis-text")
                            .attr("x", function(d){
                                // console.log(d.x,"d.x");
                                return d.x;
                            })
                            .attr("text-anchor", "middle")
                            .attr("fill",that.axis_x_pointer_color)
                            .attr("font-size",that.axis_x_pointer_size + "px")
                            .style("font-weight",that.axis_x_pointer_weight)
                            .style("font-family",that.axis_x_pointer_family)
                            .text(function(d){
                                // console.log(d.name,"name");
                                return d.name;
                            })
                            .text(function (d,i) {
                                text_height = this.getBBox().height;
                                largest = (this.getBBox().width > largest) ? this.getBBox().width : largest;
                            });
                    if (rangeband >= largest) { flag = 1; }
                    else if (rangeband >= (largest*0.75) && rangeband < largest) { flag = 2; }
                    else if (rangeband >= (largest*0.65) && rangeband < (largest*0.75)) { flag = 3; }
                    else if (rangeband >= (largest*0.55) && rangeband < (largest*0.65)) { flag = 4; }
                    else if (rangeband >= (largest*0.35) && rangeband < (largest*0.55)) { flag = 5; }
                    else if (rangeband <= 20 || rangeband < (largest*0.35)) { flag = 0; }

                    xAxis_label.text(function (d) {
                                if (flag === 0) {
                                    return "";
                                }
                                else if (rangeband >= this.getBBox().width && flag === 1) {
                                    return d.name;
                                }
                                else if (rangeband >= (this.getBBox().width*0.75) && rangeband < this.getBBox().width && flag === 2){
                                    return d.name.substr(0,5) + "..";
                                }
                                else if (rangeband >= (this.getBBox().width*0.65) && rangeband < (this.getBBox().width*0.75) && flag === 3){
                                    return d.name.substr(0,4) + "..";
                                }
                                else if (flag === 4){
                                    return d.name.substr(0,3);
                                }
                                else if (flag === 5){
                                    return d.name.substr(0,2);
                                }
                                else {
                                    return d.name;
                                }
                            })
                            .on('mouseover',function (d) {
                                that.mouseEvent.tooltipPosition(d);
                                that.mouseEvent.tooltipTextShow(d.name);
                            })
                            .on('mouseout',function (d) {
                                that.mouseEvent.tooltipHide(d);
                            })
                            .on('mousemove', function (d) {
                                that.mouseEvent.tooltipPosition(d);
                            });

                    xAxis_label.exit().remove();
                    if(that.axis_x_position==="top") {
                        if(that.axis_x_pointer_position === "top") {
                            xAxis_label.attr("y", function () {
                                return -15;
                            });
                        } else if(that.axis_x_pointer_position === "bottom") {
                            xAxis_label.attr("y", function () {
                                return text_height;
                            });
                        }
                    }else {
                        if(that.axis_x_pointer_position === "top") {
                            xAxis_label.attr("y", function () {
                                return h - text_height;
                            });
                        } else if(that.axis_x_pointer_position === "bottom") {
                            xAxis_label.attr("y", function () {
                                return h + text_height;
                            });
                        }
                    }
                }
                return this;
            },
            highlightRect : function () {
                if(that.no_of_groups > 1 && PykCharts.boolean(that.highlight)) {
                    setTimeout(function() {
                        function ascending( a, b ) {
                            return a - b;
                        }
                        that.highlight_x_positions.sort(ascending)
                        that.highlight_y_positions.sort(ascending);

                        var x_len = that.highlight_x_positions.length,
                            y_len = that.highlight_y_positions.length,
                            x = that.highlight_x_positions[0] - 5,
                            y = (that.height - that.margin_bottom - that.margin_top - that.legendsGroup_height - that.highlight_y_positions[y_len - 1] - 5),
                            height = (that.highlight_y_positions[y_len - 1] + 10);
                        width = (that.highlight_x_positions[x_len - 1] - that.highlight_x_positions[0] + 10 + that.xScale.rangeBand());
                        that.group.append("rect")
                            .attr("class","highlight-rect")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("width", width)
                            .attr("height", height)
                            .attr("fill","none")
                            .attr("stroke", that.highlight_color)
                            .attr("stroke-width", "1.5px")
                            .attr("stroke-dasharray", "5,5")
                            .attr("stroke-opacity",1);
                    }, that.transitions.duration());
                }
                return this;
            },
            legends: function () {
                if(PykCharts.boolean(that.legends_enable)) {
                    var params = that.getParameters(),color;
                    // console.log(params);
                    color = params.map(function (d) {
                        return d.color;
                    });
                    params = params.map(function (d) {
                        return d.name;
                    });

                    params = _.uniq(params);
                    // color = _.uniq(color);
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
                            else return color[0];
                        })
                        .attr("fill-opacity", function (d,i) {
                            if (that.color_mode === "saturation") {
                            // if(PykCharts.boolean(that.saturationEnable)){
                                return (that.no_of_groups-i)/that.no_of_groups;
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
            }
        }
        return optional;
    };

    //----------------------------------------------------------------------------------------
    // 6. Rendering groups:
    //----------------------------------------------------------------------------------------

    that.getGroups = function(){
        var groups = {};
        // for(var i in that.the_bars){
        for(var i=0;i<that.the_bars.length;i++) {
            var bar = that.the_bars[i];
            if(!bar.id) continue;
            if(groups[bar.group]){
                groups[bar.group].push(bar.id);
            }else{
                groups[bar.group] = [bar.id];
            }
        }
        return groups;
    };

    //----------------------------------------------------------------------------------------
    // 10.Data Manuplation:
    //----------------------------------------------------------------------------------------

    // Data Helpers
    // Takes the flattened data and returns layers
    // Each layer is a separate category
    // The structure of the layer is made so that is plays well with d3.stack.layout()
    // Docs - https://github.com/mbostock/d3/wiki/Stack-Layout#wiki-values

    that.buildLayers = function(the_bars){
        var layers = [];

        function findLayer(l){
            // for(var i in layers){
            for(var i=0; i<layers.length; i++) {
                // console.log(layers[i])
                var layer = layers[i];
                if (layer.name == l) return layer;
            }
            return addLayer(l);
        }

        function addLayer(l){
            var new_layer = {
                "name": l,
                "values": []
            };
            layers.push(new_layer);
            return new_layer;
        }

        // for(var i in the_bars){
        for(var i=0; i<the_bars.length; i++) {
            // console.log(the_bars[i])
            var bar = the_bars[i];
            if(!bar.id) continue;
            var id = bar.id;
            for(var k in bar){
                if(k === "id") continue;
                var icings = bar[k];
                // for(var j in icings){
                for(var j=0;j<icings.length;j++) {
                    var icing = icings[j];
                    if(!icing.name) continue;
                    var layer = findLayer(icing.name);
                    var index_group = that.unique_group.indexOf(that.keys[id])
                    layer.values.push({
                        "x": id,
                        "y": icing.val,
                        "group": that.keys[id],
                        "color": icing.color,
                        "tooltip": icing.tooltip,
                        "name": bar.group
                        // "highlight": icing.highlight
                    });
                }
            }
        }
        return layers;
    };

    // Traverses the JSON and returns an array of the 'bars' that are to be rendered
    that.flattenData = function(){
        var the_bars = [-1];
        that.keys = {};
        // for(var i in that.data){
        for(var i=0; i<that.data.length; i++) {
            var d = that.data[i];
            for(var cat_name in d){
                // for(var j in d[cat_name]){
                for(var j=0; j<d[cat_name].length; j++) {
                    var id = "i" + i + "j" + j;
                    if(typeof d[cat_name][j] !== "object"){
                        continue;
                    }
                    var key = Object.keys(d[cat_name][j])[0];
                    that.keys[id] = key;
                    d[cat_name][j].id = id;
                    d[cat_name][j].group = cat_name;

                    the_bars.push(d[cat_name][j]);
                }
                the_bars.push(i); // Extra seperator element for gaps in segments
            }
        }
        return [the_bars, that.keys];
    };

    that.getParameters = function () {
        var p = [];
        // for(var i in  that.the_layers){
        for(var i=0; i<that.the_layers.length; i++) {
            // console.log(that.the_layers[i]);
            if(!that.the_layers[i].name) continue;
            // for(var j in that.the_layers[i].values) {
            for(var j=0; j<that.the_layers[i].values.length; j++) {
                var name = that.the_layers[i].values[j].group, color;
                if(that.color_mode === "saturation") {
                    color = that.saturation_color;
                } else if(that.color_mode === "color" && that.the_layers[0].values[j].color){
                    color = that.the_layers[0].values[j].color;
                }
                p.push({
                    "name": name,
                    "color": color
                });
            }
        }
        return p;
    }
    that.emptygroups = function (data) {
        that.no_of_groups = d3.max(data,function (d){
            var value = _.values(d);
            return value[0].length;
        });

        that.group_data;

        for(var i =0; i<that.no_of_groups;i++) {
            if(_.values(data[i])[0].length === that.no_of_groups) {
                that.group_data = _.values(data[i])[0];
                break;
            }
        }

        that.get_unique_group = _.map(that.group_data,function(d,i) {
            return _.keys(d)[0];
        });

        that.unique_color = _.map(that.group_data, function (d,i) {
            return d[_.keys(d)][0].color;
        });

        for(var i = 0;i<data.length;i++) {
            var value = _.values(data[i]);
            var group = value[0];

            if(value[0].length < that.no_of_groups) {
                for(var k=0; k<that.no_of_groups;k++) {
                    var value = _.values(data[i]);
                    var group = value[0];
                    if(_.keys(group[k])[0] != that.get_unique_group[k]) {
                        var stack = { "name": "stack", "tooltip": "null", "color": that.unique_color[k], "val": 0, /*highlight: false*/ };
                        var missing_group = that.get_unique_group[k];
                        _.values(data[i])[0].splice(k, 0, {});
                        _.values(data[i])[0][k][missing_group] = [stack];
                    }
                }
            }
        }
        // console.log(data,"data")
        // console.log(data,"new_data");
        return data;
    };

    that.dataTransformation = function () {

        var data_tranform = [];
        that.barName = [];
        var data_length = that.data.length;
        that.unique_group = that.data.map(function (d) {
            return d.group;
        });
        that.unique_group = _.uniq(that.unique_group);

        for(var i=0; i < data_length; i++) {
            var group = {},
                bar = {},
                stack;

            if(!that.data[i].group) {
                that.data[i].group = "group" + i;
            }

            if(!that.data[i].stack) {
                that.data[i].stack = "stack";
            }

            that.barName[i] = that.data[i].group;
            group[that.data[i].x] = [];
            bar[that.data[i].group] = [];
            stack = { "name": that.data[i].stack, "tooltip": that.data[i].tooltip, "color": that.data[i].color, "val": that.data[i].y/*, highlight: that.data[i].highlight */};

            if(i === 0) {
                data_tranform.push(group);
                data_tranform[i][that.data[i].x].push(bar);
                data_tranform[i][that.data[i].x][i][that.data[i].group].push(stack);
            } else {
                var data_tranform_lenght = data_tranform.length;
                var j=0;
                for(j=0;j < data_tranform_lenght; j++) {
                    if ((_.has(data_tranform[j], that.data[i].x))) {
                        var barr = data_tranform[j][that.data[i].x],
                            barLength = barr.length,
                            k = 0;

                        for(k =0; k<barLength;k++) {
                            if(_.has(data_tranform[j][that.data[i].x][k],that.data[i].group)) {
                                break;
                            }
                        }
                        if(k < barLength) {
                            data_tranform[j][that.data[i].x][k][that.data[i].group].push(stack);
                        } else {
                            data_tranform[j][that.data[i].x].push(bar);
                            data_tranform[j][that.data[i].x][k][that.data[i].group].push(stack);
                        }
                        break;
                    }
                }
                if(j === data_tranform_lenght) {
                    data_tranform.push(group);
                    data_tranform[j][that.data[i].x].push(bar);
                    data_tranform[j][that.data[i].x][0][that.data[i].group].push(stack);
                }
            }
        }
        that.barName = _.unique(that.barName);
        return data_tranform;
    };
    return this;
};
