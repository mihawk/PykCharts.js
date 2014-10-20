PykCharts.multiD.scatterPlot = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function() {
        that = new PykCharts.multiD.processInputs(that, options, "scatterplot");
        if(that.mode === "default") {
            that.k.loading();
        }
        var multiDimensionalCharts = theme.multiDimensionalCharts,
            stylesheet = theme.stylesheet,
            optional = options.optional;

        that.multiD = new PykCharts.multiD.configuration(that);
        that.multiple_containers_enable =options.multiple_containers_enable && options.multiple_containers_enable ? options.multiple_containers_enable : multiDimensionalCharts.multiple_containers_enable;
        that.bubbleRadius = options.scatterplot_radius && _.isNumber(options.scatterplot_radius) ? options.scatterplot_radius : multiDimensionalCharts.scatterplot_radius;
        that.enableTicks =  options.scatterplot_pointer ? options.scatterplot_pointer : multiDimensionalCharts.scatterplot_pointer;
        that.zoomed_out = true;
        that.variable_circle_size_enable = options.variable_circle_size_enable ? options.variable_circle_size_enable : multiDimensionalCharts.variable_circle_size_enable;

        if(PykCharts.boolean(that.multiple_containers_enable)) {
            that.radius_range = [that.k._radiusCalculation(1.1)*2,that.k._radiusCalculation(2.6)*2];
        } else {
            that.radius_range = [that.k._radiusCalculation(4.5)*2,that.k._radiusCalculation(11)*2];
        }
        d3.json(options.data, function (e, data) {
            that.data = data.groupBy("scatterplot");
            that.axis_y_data_format = options.axis_y_data_format ? options.axis_y_data_format : that.k.yAxisDataFormatIdentification(that.data);
            that.axis_x_data_format = options.axis_x_data_format ? options.axis_x_data_format : that.k.xAxisDataFormatIdentification(that.data);
            that.compare_data = data.groupBy("scatterplot");
            $(that.selector+" #chart-loader").remove();
            var a = new PykCharts.multiD.scatterplotFunction(options,that,"scatterplot");
            a.render();
        });
    };
};

PykCharts.multiD.pulse = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function() {
        that = new PykCharts.multiD.processInputs(that, options, "pulse");
        if(that.mode === "default") {
            that.k.loading();
        }
        var multiDimensionalCharts = theme.multiDimensionalCharts,
            stylesheet = theme.stylesheet,
            optional = options.optional;
        // that.enableCrossHair = optional && optional.enableCrossHair ? optional.enableCrossHair : multiDimensionalCharts.enableCrossHair;
        that.multiD = new PykCharts.multiD.configuration(that);
        that.multiple_containers_enable = options.multiple_containers_enable && options.multiple_containers_enable ? options.multiple_containers_enable : multiDimensionalCharts.multiple_containers_enable;
        that.bubbleRadius = options.scatterplot_radius && _.isNumber(options.scatterplot_radius) ? options.scatterplot_radius : multiDimensionalCharts.scatterplot_radius;
        that.zoomed_out = true;
        that.radius_range = [that.k._radiusCalculation(1.1)*2,that.k._radiusCalculation(3.5)*2];
        that.variable_circle_size_enable = options.variable_circle_size_enable ? options.variable_circle_size_enable : multiDimensionalCharts.variable_circle_size_enable;
        d3.json(options.data, function (e, data) {
            that.data = data.groupBy("pulse");
            that.axis_y_data_format = options.axis_y_data_format ? options.axis_y_data_format : that.k.yAxisDataFormatIdentification(that.data);
            that.axis_x_data_format = options.axis_x_data_format ? options.axis_x_data_format : that.k.xAxisDataFormatIdentification(that.data);
            that.compare_data = data.groupBy("pulse");
            $(that.selector+" #chart-loader").remove();
            var a = new PykCharts.multiD.scatterplotFunction(options,that,"pulse");
            a.render();
        });
    };
};
PykCharts.multiD.scatterplotFunction = function (options,chartObject,type) {
    var that = chartObject;
    that.refresh = function () {
        d3.json(options.data, function (e, data) {
            that.data = data.groupBy("scatterplot");
            that.refresh_data = data.groupBy("scatterplot");
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.map_group_data = that.multiD.mapGroup(that.data);
            
            that.optionalFeatures()
                    .createChart()
                    .legends()
                    .plotCircle()
                    .label()
                    .ticks();
                    that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain,that.legendsGroup_height)
                    .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain)
        });
    };

    this.render = function () {
        // console.log(that.data);
        that.map_group_data = that.multiD.mapGroup(that.data); 
        that.fillChart = new PykCharts.Configuration.fillChart(that);

        that.border = new PykCharts.Configuration.border(that);

        if(that.mode === "default") {
        
            that.uniq_group_arr = _.uniq(that.data.map(function (d) {

                return d.group;
            }));

            that.no_of_groups = 1;

            if(PykCharts.boolean(that.multiple_containers_enable) && type === "scatterplot") {
                that.k.title()
                    .subtitle();

                that.no_of_groups = that.uniq_group_arr.length;
                that.w = that.width/4;
                that.height = that.height/2;
                that.margin_left = that.margin_left;
                that.margin_right = that.margin_right;
//                that.radius_range = [20,35];
                for(i=0;i<that.no_of_groups;i++){
                    that.new_data = [];
                    for(j=0;j<that.data.length;j++) {
                        if(that.data[j].group === that.uniq_group_arr[i]) {
                            that.new_data.push(that.data[j]);
                        }
                    }
                    that.k.positionContainers(that.legends_enable,that);

                    that.k.makeMainDiv(that.selector,i);
                    
                    that.optionalFeatures()
                        .svgContainer(i)
                        .legendsContainer(i);

                    that.k.liveData(that)
                        .tooltip();

                    that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
                    that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range);

                    that.optionalFeatures()
                        .legends(i)
                        .createGroups(i)
                        .createChart()
                        .label()
                        .ticks()

        

                    that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain,that.legendsGroup_height)
                        .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain)
                        .xAxisTitle(that.xGroup)
                        .yAxisTitle(that.yGroup);
        
                    if((i+1)%4 === 0 && i !== 0) {
                        that.k.emptyDiv();
                    }
                }
                that.k.emptyDiv();
            } else {
                
                that.k.export(that,"#svgcontainer0",type);
                that.k.title()
                    .subtitle()
                    .emptyDiv();

                that.w = that.width;
                that.new_data = that.data;
                that.k.makeMainDiv(that.selector,0);

                that.optionalFeatures()
                    .svgContainer(0)
                    .legendsContainer(0);

                that.k.liveData(that)
                    .tooltip();

                that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
                that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range);

                that.optionalFeatures()
                    .legends()
                    .createGroups(0)
                    .createChart()
                    .ticks();
                  //  .zoom();

                if(type === "scatterplot") {
                    that.optionalFeatures().label();
                }

                that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain,that.legendsGroup_height)
                    .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain)
                    .xAxisTitle(that.xGroup)
                    .yAxisTitle(that.yGroup);
                    // .yGrid(that.svgContainer,that.group,that.yScale)
                    // .xGrid(that.svgContainer,that.group,that.x);
            }

            that.k.createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();

            // that.optionalFeatures()
            //      .zoom();

        } else if (that.mode === "infographics") {
            that.radius_range = [7,18];
            that.new_data = that.data;
            that.w = that.width
            that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range);

            that.k.export(that,"#svgcontainer0",type);

            that.k.tooltip()
                .emptyDiv()
                .makeMainDiv(that.selector,0);

            that.optionalFeatures()
                    .svgContainer(0)
                    .legendsContainer(0)
                    .createGroups(0);

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
            that.optionalFeatures().createChart(0);
                // .crossHair();

            that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain)
                .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain)
                .xAxisTitle(that.xGroup)
                .yAxisTitle(that.yGroup);
        }
        if(!PykCharts.boolean(that.multiple_containers_enable)) {
            if(type === "scatterplot" && PykCharts.boolean(that.legends_enable) && PykCharts.boolean(that.variable_circle_size_enable) && that.map_group_data[1]) {
                $(window).on("load", function () { return that.k.resize(that.svgContainer,"",that.legendsContainer); })
                            .on("resize", function () { return that.k.resize(that.svgContainer,"",that.legendsContainer); });
            } else {
                $(window).on("load", function () { return that.k.resize(that.svgContainer); })
                            .on("resize", function () { return that.k.resize(that.svgContainer); });
            }
        }
    };

    that.optionalFeatures = function () {
        var optional = {
            svgContainer :function (i) {
                $(options.selector + " #tooltip-svg-container-" + i).css("width",that.w);
                $(options.selector).attr("class","PykCharts-weighted")

                that.svgContainer = d3.select(options.selector + " #tooltip-svg-container-" + i)
                    .append('svg')
                    .attr("width",that.w)
                    .attr("height",that.height)
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.w + " " + that.height)
                    .attr("id","svgcontainer" + i)
                    .attr("class","svgcontainer")
                    .style("background-color",that.bg);

                return this;
            },
            createGroups : function (i) {

                console.log(that.legendsGroup_height,"ypoooooooo");
                that.group = that.svgContainer.append("g")
                    .attr("transform","translate("+(that.margin_left)+","+(that.margin_top+that.legendsGroup_height)+")")
                    .attr("id","main");

                that.ticksElement = that.svgContainer.append("g")
                    .attr("transform","translate("+(that.margin_left)+","+(that.margin_top)+")")
                    .attr("id","main2");

                if(PykCharts.boolean(that.axis_x_enable)) {
                    that.xGroup = that.group.append("g")
                        .attr("class", "x axis")
                        .style("stroke","black");
                }
                
                if(PykCharts.boolean(that.axis_y_enable)){
                    that.yGroup = that.group.append("g")
                        .attr("class", "y axis")
                        .style("stroke","blue");
                }

                that.clip = that.group.append("svg:clipPath")
                            .attr("id", "clip" + i + that.selector)
                            .append("svg:rect")
                            .attr("width",(that.w-that.margin_left-that.margin_right))
                            .attr("height", that.height-that.margin_top-that.margin_bottom - that.legendsGroup_height);

                that.chartBody = that.group.append("g")
                            .attr("clip-path", "url(#clip" + i + that.selector +")");

                return this;
            },
            legendsContainer : function (i) {
                if (PykCharts.boolean(that.legends_enable) && PykCharts.boolean(that.variable_circle_size_enable) && that.map_group_data[1] && that.mode === "default") {
                    console.log("legends");                    
                    that.legendsGroup = that.svgContainer
                        .append("g")
                                .attr('id',"legends")
                                .attr("transform","translate(0,20)");
                } else {
                    that.legendsGroup_height = 0;
                }
                return this;
            },            
            createChart : function () {
                that.weight = _.map(that.new_data, function (d) {
                    return d.weight;
                });

                that.weight = _.reject(that.weight,function (num) {
                    return num == 0;
                });

                // that.max_radius = that.sizes(d3.max(that.weight));

                that.sorted_weight = that.weight.slice(0);
                that.sorted_weight.sort(function(a,b) { return a-b; });


                that.group.append("text")
                    .attr("fill", "black")
                    .attr("text-anchor", "end")
                    .attr("x", that.w - 70)
                    .attr("y", that.height + 40)
                    // .text(that.axis_x_label);

                if(that.zoomed_out === true) {
                    // var x_domain = d3.extent(that.data, function (d) {
                    //         return d.x;
                    //     });
                    // var y_domain = d3.extent(that.data, function (d) {
                    //         return d.y;
                    //     })
                    // var x_domain = [],y_domain,max,min,type;
                    var x_domain,x_data = [],y_data = [],y_range,x_range,y_domain;

                    if(that.axis_y_data_format === "number") {
                        y_domain = d3.extent(that.data, function(d) { return d.y });
                        y_data = that.k._domainBandwidth(y_domain,2,"number");
                        y_range = [that.height - that.margin_top - that.margin_bottom - that.legendsGroup_height, 0];
                        that.yScale = that.k.scaleIdentification("linear",y_domain,y_range);
                        that.extra_top_margin = 0;

                    } else if(that.axis_y_data_format === "string") {
                        console.log("hey")
                        that.data.forEach(function(d) { y_data.push(d.y); });
                        y_range = [0,that.height - that.margin_top - that.margin_bottom - that.legendsGroup_height];
                        that.yScale = that.k.scaleIdentification("ordinal",y_data,y_range,0);
                        that.extra_top_margin = (that.yScale.rangeBand() / 2);

                    } else if (that.axis_y_data_format === "time") {
                        y_data = d3.extent(that.data, function (d) { return new Date(d.x); });
                        y_range = [that.height - that.margin_top - that.margin_bottom - that.legendsGroup_height, 0];
                        that.yScale = that.k.scaleIdentification("time",y_data,y_range);
                        that.extra_top_margin = 0;
                    }
                    if(that.axis_x_data_format === "number") {
                        x_domain = d3.extent(that.data, function(d) { return d.x; });
                        x_data = that.k._domainBandwidth(x_domain,2);
                        x_range = [0 ,that.w - that.margin_left - that.margin_right];
                        that.x = that.k.scaleIdentification("linear",x_data,x_range);
                        that.extra_left_margin = 0;

                    } else if(that.axis_x_data_format === "string") {
                        that.data.forEach(function(d) { x_data.push(d.x); });
                        x_range = [0 ,that.w - that.margin_left - that.margin_right];
                        that.x = that.k.scaleIdentification("ordinal",x_data,x_range,0);
                        that.extra_left_margin = (that.x.rangeBand()/2);

                    } else if (that.axis_x_data_format === "time") {
                        max = d3.max(that.data, function(k) { return new Date(k.x); });
                        min = d3.min(that.data, function(k) { return new Date(k.x); }); 
                        x_domain = [min.getTime(),max.getTime()];
                        x_data = that.k._domainBandwidth(x_domain,2,"time");
                        x_range = [0 ,that.w - that.margin_left - that.margin_right];
                        that.x = that.k.scaleIdentification("time",x_data,x_range);
                        that.data.forEach(function (d) {
                            d.x = new Date(d.x);
                        });
                        that.extra_left_margin = 0;
                    }
                    that.xdomain = that.x.domain();
                    that.ydomain = that.yScale.domain();
                    that.x1 = 1;
                    that.y1 = 12;
                    that.count = 1;
                    var zoom = d3.behavior.zoom()
                            .x(that.x)
                            .y(that.yScale)
                            .scaleExtent([that.x1, that.y1])
                            .on("zoom",zoomed);
                    // console.log($("#svgcontainer0 .dot"));
                     // $("#svgcontainer0 .dot").dblclick(function(){
                     //    console.log(d3.event,"d33333 eeee");
                     //    // console.log("heyyyyyyyy");
                     //    return false;
                     // })

//        $("#svgcontainer0 .dot").off("dblclick");
    

                    if(PykCharts.boolean(that.zoom_enable) && !(that.axis_y_data_format==="string" || that.axis_x_data_format==="string") && (that.mode === "default") ) {                                           
                        var n;
                        if(PykCharts.boolean(that.multiple_containers_enable)) {
                            n = that.no_of_groups;
                        } else {
                            n = 1;
                        }

                        for(var i = 0; i < that.no_of_groups; i++) {
                            d3.select(that.selector+ " #svgcontainer" +i)
                                .call(zoom)

                            d3.select(that.selector+ " #svgcontainer" +i)
                                .on("wheel.zoom", null)
                                .on("mousewheel.zoom", null);
                        }
                    }
                    that.optionalFeatures().plotCircle();
                }
                return this ;
            },
            legends : function (index) {

                if (PykCharts.boolean(that.legends_enable) && PykCharts.boolean(that.variable_circle_size_enable) && that.map_group_data[1]) {
                    var unique = _.uniq(that.sorted_weight);
                    var k = 0;
                    var l = 0;

                    if(that.legends_display === "vertical" ) {
                        that.legendsGroup.attr("height", (that.map_group_data[0].length * 30)+20);
                        that.legendsGroup_height = (that.map_group_data[0].length * 30)+20;

                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        text_parameter1value = function (d,i) { return that.w - that.w/4 + 16; };
                        rect_parameter3value = function (d,i) { return that.w - that.w/4; };
                        var rect_parameter4value = function (d,i) { return i * 24 + 12;};
                        var text_parameter2value = function (d,i) { return i * 24 + 23;};

                    } else if(that.legends_display === "horizontal") {
                        // that.legendsContainer.attr("height", (k+1)*70);
                        that.legendsGroup_height = 50;
                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";
                        k = 0, l = 0;

                        var text_parameter1value = function (d,i) {
                            if( i === 0) {
                                l = 0;
                            }
                            if((that.w - (i*100 + 75)) > 0) {
                                return that.w - (i*100 + 75);
                            } else if ((that.w - (l*100 + 75)) < that.w) {
                                l++;
                                return that.w - ((l-1)*100 + 75);
                            } else {
                                l = 0;
                                l++;
                                return that.w - ((l-1)*100 + 75);
                            }
                        };

                        text_parameter2value = function (d,i) {
                            if(i === 0) {
                                k = 0, l = 0;
                            }
                            if((that.w - (i*100 + 75)) > 0) {
                            } else if ((that.w - (l*100 + 75)) < that.w) {
                                if(l === 0) {
                                    k++;
                                }
                                l++;
                            } else {
                                l = 0;
                                l++;
                                k++;
                            }
                        return k * 24 + 23;
                        };
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        var rect_parameter3value = function (d,i) {
                            if( i === 0) {
                                k = 0, l = 0;
                            }
                            if((that.w - (i*100 + 100)) >= 0) {
                                return that.w - (i*100 + 100);
                            } else if ((that.w - (i*100 + 100)) < that.w) {
                                k++;
                                if(l === 0) {
                                    that.legendsContainer.attr("height", (k+1)*50);
                                    that.legendsGroup.attr("height", (k+1)*50);
                                }
                                l++;
                                return that.w - ((l-1)*100 + 100);
                            } else {
                                l = 0;
                                l++;
                                k++;
                                return that.w - ((l-1)*100 + 100);
                            }
                        };
                        rect_parameter4value = function (d,i) {
                            if(i === 0) {
                                k = 0, l = 0;
                            }
                            if((that.w - (i*100 + 75)) > 0) {
                            } else if ((that.w - (l*100 + 75)) < that.w) {
                                if( l == 0) {
                                    k++;
                                }
                                l++;
                            } else {
                                l = 0;
                                l++;
                                k++;
                            }
                            // console.log(k*24+12, "k", d.group);
                        return k * 24 + 12;;
                        }
                    };
                    var legend;
                    if(PykCharts.boolean(that.multiple_containers_enable)){
                        var abc =[];
                        abc.push(that.map_group_data[0][index]);
                        legend = that.legendsGroup.selectAll("rect")
                            .data(abc);
                        that.legends_text = that.legendsGroup.selectAll(".legends_text")
                            .data(abc);
                    } else {
                        legend = that.legendsGroup.selectAll("rect")
                                .data(that.map_group_data[0]);
                        that.legends_text = that.legendsGroup.selectAll(".legends_text")
                            .data(that.map_group_data[0]);
                    }
                    // console.log(that.map_group_data[0]);
                    legend.enter()
                            .append("rect");

                    legend.attr(rect_parameter1, rect_parameter1value)
                        .attr(rect_parameter2, rect_parameter2value)
                        .attr(rect_parameter3, rect_parameter3value)
                        .attr(rect_parameter4, rect_parameter4value)
                        .attr("fill", function (d) {
                            return that.fillChart.colorPieW(d);
                        })
                        .attr("opacity", function (d) {
                            return 0.6;
                        });

                    legend.exit().remove();

                    that.legends_text
                        .enter()
                        .append('text')
                        .attr("class","legends_text")
                         .attr("fill",that.legends_text_color)
                        .attr("pointer-events","none")
                        .style("font-family", that.legends_text_family)
                        .attr("font-size",that.legends_text_size);

                    that.legends_text.attr("class","legends_text")
                        .attr("fill","black")
                        .attr(text_parameter1, text_parameter1value)
                        .attr(text_parameter2, text_parameter2value)
                        .text(function (d) { return d.group });

                    that.legends_text.exit()
                                    .remove();
                }
                return this;
            },
            ticks : function () {
                if(PykCharts.boolean(that.enableTicks)) {
                    var tick_label = that.ticksElement.selectAll("text")
                        .data(that.new_data);

                    tick_label.enter()
                        .append("text");

                    tick_label.
                        attr("transform",function (d) {
                            return "translate(" + that.x(d.x) + "," + that.yScale(d.y) + ")";
                        })
                        .style("text-anchor", "middle")
                        .style("font-family", that.label_family)
                        .style("font-size",that.label_size)
                        .attr("pointer-events","none")
                        .attr("dx",-1)
                        .attr("dy",function (d) { return -that.sizes(d.weight)-4; });

                    tick_label.text(function (d) {return d.name; });

                    tick_label.exit().remove();
                }
                return this;
            },
            plotCircle : function () {

                that.circlePlot = that.chartBody.selectAll(".dot")
                                     .data(that.new_data)

                that.circlePlot.enter()
                            .append("circle")
                            .attr("class", "dot");

                that.circlePlot
                    .attr("r", function (d) { return that.sizes(d.weight); })
                    .attr("cx", function (d) { return (that.x(d.x)+that.extra_left_margin); })
                    .attr("cy", function (d) { return (that.yScale(d.y)+that.extra_top_margin); })
                    .attr("fill", function (d) { return that.fillChart.colorPieW(d); })
                    .attr("fill-opacity", function (d) { return that.multiD.opacity(d.weight,that.weight,that.data); })
                    .attr("stroke", that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-dasharray", that.border.style())
                    .attr("stroke-opacity",1)
                    .on('mouseover',function (d) {
                        tooltipText = d.tooltip ? d.tooltip : "<table class='PykCharts'><tr><th colspan='2'>"+d.name+"</th></tr><tr><td>X</td><td>"+d.x+"</td></tr><tr><td>Y</td><td>"+d.y+"</td></tr><tr><td>Weight</td><td>"+d.weight+"</td></tr></table>";
                        that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.toolTextShow(tooltipText);
                        if(PykCharts.boolean(that.variable_circle_size_enable)){
                            d3.select(this).style("fill-opacity",1);
                        }
                    })
                    .on('mouseout',function (d) {
                        that.mouseEvent.tooltipHide(d);
                        if(PykCharts.boolean(that.variable_circle_size_enable)) {
                            d3.selectAll(".dot").style("fill-opacity",0.5);
                        }
                    })
                    .on('mousemove', function (d) {
                        that.mouseEvent.tooltipPosition(d);
                    })
                    .on("dblclick",function() {
                        d3.event.stopPropagation();
                    })
                    .on("mousedown",function() {
                        d3.event.stopPropagation();
                    });

                that.circlePlot.exit().remove();
                return this;
            },
            label : function () {
                if(PykCharts.boolean(that.label_size)) {
                    that.circleLabel = that.chartBody.selectAll(".text")
                        .data(that.new_data);

                    that.circleLabel.enter()
                        .append("text")
                        .attr("class","text");

                    that.circleLabel
                        .attr("x", function (d) { return (that.x(d.x)+that.extra_left_margin); })
                        .attr("y", function (d) { return (that.yScale(d.y)+that.extra_top_margin + 5); })
                        .attr("text-anchor","middle")
                        .attr("pointer-events","none")
                        .style("font-weight", that.label_weight)
                        .style("font-size", that.label_size)
                        .attr("fill", that.label_color)
                        .style("font-family", that.label_family)
                        .text(function (d) {
                            return d.weight;
                        })
                        .text(function (d) {
                            if((this.getBBox().width < (that.sizes(d.weight) * 2)) && (this.getBBox().height < (that.sizes(d.weight) * 2))) {
                                return d.weight;
                            } else {
                                return "";
                            }
                        });
                    that.circleLabel.exit()
                        .remove();
                }
                return this;
            },

        };
        return optional;
    };
    
    function zoomed () {
        that.zoomed_out = false;

        var id = this.id,
        idLength = id.length,
        n;

        if(PykCharts.boolean(that.multiple_containers_enable)) {
            n = that.no_of_groups;
        } else {
            n = 1;
        }
        for(var i = 0; i < n; i++) {
            var containerId = id.substring(0,idLength-1);
            current_container = d3.select(that.selector+" #"+containerId +i)

            
            that.k.isOrdinal(current_container,".x.axis",that.x);
    //        that.k.isOrdinal(current_container,".x.grid",that.x);

            that.k.isOrdinal(current_container,".y.axis",that.yScale);
    //        that.k.isOrdinal(current_container,".y.grid",that.yScale);

            that.optionalFeatures().plotCircle()
                                    .label();

            d3.select(that.selector+" #"+containerId +i)
                .selectAll(".dot")
                .attr("r", function (d) {
                    return that.sizes(d.weight)*d3.event.scale;
                })                    
                .attr("cx", function (d) { return (that.x(d.x)+that.extra_left_margin); })
                .attr("cy", function (d) { return (that.yScale(d.y)+that.extra_top_margin); });

            d3.select(that.selector+" #"+containerId +i)
                .selectAll(".text")
                .style("font-size", that.label_size)
                .attr("x", function (d) { return (that.x(d.x)+that.extra_left_margin); })
                .attr("y", function (d) { return (that.yScale(d.y)+that.extra_top_margin + 5); });
        }
        that.count++;
        if(that.count === 10) {
            d3.select(that.selector+" #"+containerId +i)
                .call(function () {
                    return that.zoomOut();
                });
            that.count = 1;
       }        
    };

    that.zoomOut=function () {
        that.zoomed_out = true;
        that.x1 = 1;
        that.y1 = 12;

        that.optionalFeatures().createChart()
            .label();

        that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain,that.legendsGroup_height)
            .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain);

    }
};