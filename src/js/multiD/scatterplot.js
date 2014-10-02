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
        // that.enableCrossHair = optional && optional.enableCrossHair ? optional.enableCrossHair : multiDimensionalCharts.enableCrossHair;
        that.multiD = new PykCharts.multiD.configuration(that);
        that.multiple_containers_enable =options.multiple_containers_enable && options.multiple_containers_enable ? options.multiple_containers_enable : multiDimensionalCharts.multiple_containers_enable;
        that.bubbleRadius = options.scatterplot_radius && _.isNumber(options.scatterplot_radius) ? options.scatterplot_radius : multiDimensionalCharts.scatterplot_radius;
        that.enableTicks =  options.scatterplot_pointer ? options.scatterplot_pointer : multiDimensionalCharts.scatterplot_pointer;
        that.zoomed_out = true;
        that.size_enable = options.size_enable ? options.size_enable : multiDimensionalCharts.size_enable;

        if(PykCharts.boolean(that.multiple_containers_enable)) {
            that.radius_range = [that.k._radiusCalculation(1.1)*2,that.k._radiusCalculation(2.6)*2];
        } else {
            that.radius_range = [that.k._radiusCalculation(4.5)*2,that.k._radiusCalculation(11)*2];
        }
        d3.json(options.data, function (e, data) {
            that.data = data.groupBy("scatterplot");
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
        that.size_enable = options.size_enable ? options.size_enable : multiDimensionalCharts.size_enable;
        d3.json(options.data, function (e, data) {
            that.data = data.groupBy("pulse");
            console.log(data);
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
            console.log(that.map_group_data);
            that.optionalFeatures()
                    .createChart()
                    .legends()
                    .label()
                    .ticks();
        });
    };

    this.render = function () {
        console.log(that.data);
        that.map_group_data = that.multiD.mapGroup(that.data);
        that.fillChart = new PykCharts.Configuration.fillChart(that);

        that.border = new PykCharts.Configuration.border(that);

        if(that.mode === "default") {
            that.k.title()
                .subtitle();

            that.uniq_group_arr = jQuery.unique(that.data.map(function (d) {
                return d.group;
            }));

            that.no_of_groups = 1;

            if(PykCharts.boolean(that.multiple_containers_enable) && type === "scatterplot") {
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
                        .legendsContainer(i)
                        .svgContainer(i);

                    that.k.liveData(that)
                        .tooltip();

                    that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
                    that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range);

                    that.optionalFeatures().createChart()
                        .legends(i)
                        .label()
                        .ticks();
                        // .crossHair();

                    that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain)
                        .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain)
                        // .yGrid(that.svgContainer,that.group,that.yScale)
                        // .xGrid(that.svgContainer,that.group,that.x);
                    if((i+1)%4 === 0 && i !== 0) {
                        that.k.emptyDiv();
                    }
                }
                that.k.emptyDiv();
            } else {
                that.w = that.width;
                that.new_data = that.data;
                that.k.makeMainDiv(that.selector,0);
                that.optionalFeatures()
                    .legendsContainer(0)
                    .svgContainer(0);

                that.k.liveData(that)
                    .tooltip();

                that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
                // that.k.positionContainers(that.legends,that);
                that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range);

                that.optionalFeatures().createChart()
                    .legends()
                    .zoom()
                    .ticks();
                    // .crossHair();
                if(type === "scatterplot") {
                    that.optionalFeatures().label();
                }

                that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain)
                    .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain);
                    // .yGrid(that.svgContainer,that.group,that.yScale)
                    // .xGrid(that.svgContainer,that.group,that.x);
            }

            that.k.createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();
            that.optionalFeatures()
                .zoom();

        } else if (that.mode === "infographics") {
            that.radius_range = [7,18];
            that.new_data = that.data;
            that.w = that.width
            that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range);
            that.k.tooltip()
                .makeMainDiv(that.selector,0);
            that.optionalFeatures()
                    .svgContainer(0);
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
            that.optionalFeatures().createChart(0);
                // .crossHair();

            that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain)
                .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain)
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
                    .attr("id","svgcontainer" + i)
                    .attr("class","svgcontainer")
                    .style("background-color",that.bg);

                that.group = that.svgContainer.append("g")
                    .attr("transform","translate("+(that.margin_left)+","+(that.margin_top)+")")
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

                // if(PykCharts.boolean(that.grid.xEnabled)) {
                //     that.group.append("g")
                //         .attr("id","xgrid")
                //         .attr("class","x grid-line");
                // }

                // if(PykCharts.boolean(that.grid.yEnabled)) {
                //     that.group.append("g")
                //         .attr("id","ygrid")
                //         .attr("class","y grid-line");
                // }

                that.clip = that.group.append("svg:clipPath")
                            .attr("id", "clip")
                            .append("svg:rect")
                            .attr("width",(that.w-that.margin_left-that.margin_right))
                            .attr("height", that.height-that.margin_top-that.margin_bottom);

                that.chartBody = that.group.append("g")
                            .attr("clip-path", "url(#clip)");

                return this;
            },
            legendsContainer : function (i) {

                if (PykCharts.boolean(that.legends_enable) && PykCharts.boolean(that.size_enable) && that.map_group_data[1]) {
                    that.legendsContainer = d3.select(that.selector + " #tooltip-svg-container-" + i)
                        .append('svg')
                        .attr('width',that.w)
                        .attr('height',50)
                        .attr('class','legends')
                        .attr('id','legendscontainer');
                    
                    that.legendsGroup = that.legendsContainer
                        .append("g")
                                .attr('id',"legends")
                                .attr("transform","translate(0,20)");
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

                    if(that.yAxisDataFormat === "number") {
                        y_domain = d3.extent(that.data, function(d) { return d.y });
                        y_data = that.k._domainBandwidth(y_domain,2,"number");
                        y_range = [that.height - that.margin_top - that.margin_bottom, 0];
                        that.yScale = that.k.scaleIdentification("linear",y_data,y_range);
                        that.extra_top_margin = 0;

                    } else if(that.yAxisDataFormat === "string") {
                        that.data.forEach(function(d) { y_data.push(d.y); });
                        y_range = [0,that.height - that.margin_top - that.margin_bottom];
                        that.yScale = that.k.scaleIdentification("ordinal",y_data,y_range,0);
                        that.extra_top_margin = (that.yScale.rangeBand() / 2);

                    } else if (that.yAxisDataFormat === "time") {
                        y_data = d3.extent(that.data, function (d) { return new Date(d.x); });
                        y_range = [that.height - that.margin_top - that.margin_bottom, 0];
                        that.yScale = that.k.scaleIdentification("time",y_data,y_range);
                        that.extra_top_margin = 0;
                    }
                    if(that.xAxisDataFormat === "number") {
                        x_domain = d3.extent(that.data, function(d) { return d.x; });
                        x_data = that.k._domainBandwidth(x_domain,2);
                        x_range = [0 ,that.w - that.margin_left - that.margin_right];
                        that.x = that.k.scaleIdentification("linear",x_data,x_range);
                        that.extra_left_margin = 0;

                    } else if(that.xAxisDataFormat === "string") {
                        that.data.forEach(function(d) { x_data.push(d.x); });
                        x_range = [0 ,that.w - that.margin_left - that.margin_right];
                        that.x = that.k.scaleIdentification("ordinal",x_data,x_range,0);
                        that.extra_left_margin = (that.x.rangeBand()/2);

                    } else if (that.xAxisDataFormat === "time") {
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
                    var zoom = d3.behavior.zoom()
                            .x(that.x)
                            .y(that.yScale)
                            .scaleExtent([1, 10])
                            .on("zoom",zoomed);

                    if(PykCharts.boolean(that.zoom_enable) && !(that.yAxisDataFormat==="string" || that.xAxisDataFormat==="string") && (that.mode === "default") ) {                                           
                            // console.log("hey hello m in zoom",that.x.domain(),that.yScale.domain(),i);
                        var n;
                        if(PykCharts.boolean(that.multiple_containers_enable)) {
                            n = that.no_of_groups;
                        } else {
                            n = 1;
                        }

                        for(var i = 0; i < that.no_of_groups; i++) {
                            d3.select(that.selector+ " #svgcontainer" +i)
                                .call(zoom);

                            // d3.select(that.selector+ " #svgcontainer" +1)
                            //     .call(zoom);

                            // d3.select(that.selector+ " #svgcontainer" +2)
                            //     .call(zoom);

                            // d3.select(that.selector+ " #svgcontainer" +3)
                            //     .call(zoom);

                            // d3.select(that.selector+ " #svgcontainer" +4)
                            //     .call(zoom);
                        }
                    
                    }
                    that.optionalFeatures().plotCircle();
                }
                return this ;
            },
            legends : function (index) {

                if (PykCharts.boolean(that.legends_enable) && PykCharts.boolean(that.size_enable) && that.map_group_data[1]) {
                    var unique = _.uniq(that.sorted_weight);
                    var k = 0;
                    var l = 0;

                    if(that.legends_display === "vertical" ) {
                        that.legendsContainer.attr("height", (that.map_group_data[0].length * 30)+20);
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
                         .attr("fill",that.legendsText_color)
                        .attr("pointer-events","none")
                        .style("font-family", that.legendsText_family)
                        .attr("font-size",that.legendsText_size);

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
            // legends : function (position) {
            //     if(PykCharts.boolean(that.legends) && !(PykCharts.boolean(that.size.enable))) {
            //         var xPosition, textXPosition, roundOff, opacity;
            //         var unique = _.uniq(that.sorted_weight);
            //         var x, y, k;
            //         xPosition = function (d , i) { return (i)*(90 * that.width / unique.length)/100; };
            //         yPosition = function (d , i) { return (i)*(90 * that.height / unique.length)/100; };
            //         textXPosition = function (d,i) { return (++i*(90*that.width /unique.length)/100-5); };
            //         textYPosition = function (d,i) { return (++i*(90*that.height /unique.length)/100-5); };
            //         roundOff = function (d,i) { return Math.round(d); };
            //         opacity = function (d){ return that.multiD.opacity(d,that.weight,that.data); };
            //         var start, height, width, xtext, ytext;

            //         var renderLengends = function (start,height,width,xtext,ytext,position,textPosition) {
            //             // for(k=1;k<=unique.length;k++)
            //             // {
            //                 x = that.legendsGroup.selectAll("rect")
            //                     .data(unique);

            //                 x.enter()
            //                     .append("rect");

            //                 x.attr(start, position)
            //                     .attr("height", height)
            //                     .attr("width", width)
            //                     .attr("fill",function(d) { return that.fillChart.colorPieW(d); })
            //                     .attr("opacity",opacity);

            //                 x.exit().remove();

            //                 y = that.legendsGroup.selectAll(".leg")
            //                      .data(unique);

            //                 y.enter()
            //                     .append("text");

            //                 y.attr("class","leg")
            //                     .attr("x",xtext)
            //                     .attr("y",ytext)
            //                     .style("font-size", 14)
            //                     .style("font-family", "''Helvetica Neue',Helvetica,Arial,sans-serif',Helvetica,Arial,sans-serif");

            //                 y.text(roundOff);

            //                 y.exit().remove();
            //             // }

            //         };
            //         if(position == "top" || position == "bottom") {
            //             start = "x";
            //             height = 10;
            //             width = (90*that.width/unique.length)/100;
            //             xtext = textXPosition;
            //             ytext = 25;
            //             renderLengends(start,height,width,xtext,ytext,xPosition);
            //         } else if(position == "left" || position == "right") {
            //             that.legendsContainer.attr("width",100).attr("height",that.height);
            //             that.legendsGroup.attr("transform","translate(20,0)");
            //             start = "y";
            //             height = (90*that.height/unique.length)/100;
            //             width = 10;
            //             xtext = 15;
            //             ytext = textYPosition;
            //             renderLengends(start,height,width,xtext,ytext,yPosition);
            //         }
            //     }
            //     return this;
            // },
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
            zoom : function () {
                // if(PykCharts.boolean(that.zoom) && !(that.yAxisDataFormat==="string" || that.xAxisDataFormat==="string")) {
                //     $(that.selector).css("position","relative");
                //     that.zoomOutButton = d3.select(options.selector)
                //         .append("input")
                //             .attr("type","button")
                //             .attr("value","Zoom Out")
                //             .attr("id","zoomOuts")
                //             .style("position","absolute")
                //             .style("left",that.width)
                //             .style("top", that.margin.top + 50)
                //             .style("height","20")
                //             .on("click",function () {
                //                 that.zoomed_out = true;
                //                 that.optionalFeatures().createChart();
                //                 that.k.xAxis(that.svgContainer,that.xGroup,that.x)
                //                     .yAxis(that.svgContainer,that.yGroup,that.yScale);
                                    // .yGrid(that.svgContainer,that.group,that.yScale)
                                    // .xGrid(that.svgContainer,that.group,that.x)
 //                           });
   //             }
                return this;
            },
            plotCircle : function () {

                that.circlePlot = that.chartBody.selectAll(".dot")
                                     .data(that.new_data);

                that.circlePlot.enter()
                            .append("circle")
                            .attr("class", "dot");

                that.circlePlot
                    .attr("r", function (d) { return that.sizes(d.weight); })
                    .attr("cx", function (d) { return (that.x(d.x)+that.extra_left_margin); })
                    .attr("cy", function (d) { return (that.yScale(d.y)+that.extra_top_margin); })
                    .style("fill", function (d) { return that.fillChart.colorPieW(d); })
                    .style("fill-opacity", function (d) { return that.multiD.opacity(d.weight,that.weight,that.data); })
                    .attr("stroke", that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-dasharray", that.border.style())
                    .attr("stroke-opacity",1)
                    .on('mouseover',function (d) {
                        tooltipText = d.tooltip ? d.tooltip : "<table class='PykCharts'><tr><th colspan='2'>"+d.name+"</th></tr><tr><td>X</td><td>"+d.x+"</td></tr><tr><td>Y</td><td>"+d.y+"</td></tr><tr><td>Weight</td><td>"+d.weight+"</td></tr></table>";
                        that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.toolTextShow(tooltipText);
                        if(PykCharts.boolean(that.size_enable)){
                            d3.select(this).style("fill-opacity",1);
                        }
                    })
                    .on('mouseout',function (d) {
                        that.mouseEvent.tooltipHide(d);
                        if(PykCharts.boolean(that.size_enable)) {
                            d3.selectAll(".dot").style("fill-opacity",0.5);
                        }
                    })
                    .on('mousemove', function (d) {
                        that.mouseEvent.tooltipPosition(d);
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
            // crossHair : function () {
            //     if(PykCharts.boolean(that.enableCrossHair)) {

            //         var horizontalLine = that.svgContainer.append("line")
            //             .attr("x1", that.margin.left)
            //             .attr("y1", that.margin.top)
            //             .attr("x2", that.w-that.margin.right)
            //             .attr("y2", that.margin.top)
            //             .attr("id","horizontal-cursor")
            //             .attr("pointer-events","none")
            //             .attr("class","line-cursor");

            //         var verticalLine = that.svgContainer.append("line")
            //             .attr("x1", that.margin.left)
            //             .attr("y1", that.margin.top)
            //             .attr("x2", that.margin.left)
            //             .attr("y2", that.height-that.margin.bottom)
            //             .attr("id", "vertical-cursor")
            //             .attr("pointer-events","none")
            //             .attr("class","line-cursor");

            //         $(that.selector + " " +"#horizontal-cursor").hide();
            //         $(that.selector + " " +"#vertical-cursor").hide();

            //         that.svgContainer.on("mousemove",function () {
            //             id = this.id

            //             $(that.selector + " " +"#horizontal-cursor").show();
            //             $(that.selector + " " +"#vertical-cursor").show();

            //             var i,
            //                 x = (d3.event.pageX) - ($(that.selector+ " #" + id).offset().left),
            //                 y = (d3.event.pageY) - ($(that.selector+ " #" + id).offset().top);

            //             d3.select(that.selector + " #" + id).style('cursor', 'none');

            //             if(x >= that.margin.left && x <=(that.w-that.margin.right)) {

            //                 d3.select(options.selector+" #"+ id +' #vertical-cursor')
            //                     .attr("x1",x)
            //                     .attr("x2",x);
            //             }
            //             if(y >= that.margin.top && y <=(that.height-that.margin.bottom)) {
            //                 d3.selectAll(options.selector+" "+'#horizontal-cursor')
            //                     .attr("y1",y)
            //                     .attr("y2",y);
            //             }
            //         });

            //         that.svgContainer.on("mouseout",function () {
            //             $(that.selector + " " +"#horizontal-cursor").hide();
            //             $(that.selector + " " +"#vertical-cursor").hide();
            //         });

            //     }
            //     return this;
            // }

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
        // console.log(this.id,"id");
        for(var i = 0; i < n; i++) {
            var containerId = id.substring(0,idLength-1);
            // console.log(d3.select(that.selector+" #"+containerId +i),"fishyyyyyyyy",that.x.domain());

            current_container = d3.select(that.selector+" #"+containerId +i);
            
            that.k.isOrdinal(current_container,".x.axis",that.x);
            that.k.isOrdinal(current_container,".x.grid",that.x);

            that.k.isOrdinal(current_container,".y.axis",that.yScale);
            that.k.isOrdinal(current_container,".y.grid",that.yScale);

            that.optionalFeatures().plotCircle().label();
            d3.select(that.selector+" #"+containerId +i)
                .selectAll(".dot")
                .attr("r", function (d) {
                    return that.sizes(d.weight)*d3.event.scale;
                });
        }
    };


    // this.fullScreen = function () {
    //     var modalDiv = d3.select(that.selector).append("div")
    //         .attr("id","abc")
    //         .attr("visibility","hidden")
    //         .attr("class","clone")
    //         .append("a")
    //         .attr("class","b-close")
    //             .style("cursor","pointer")
    //             .style("position","absolute")
    //             .style("right","10px")
    //             .style("top","5px")
    //             .style("font-size","20px")
    //             .html("Close");
    //     var scaleFactor = 1.2;
    //     var w = that.width;
    //     var h = that.height;
    //     if(h>=500 || w>900){
    //         scaleFactor = 1;
    //     }
    //     $(".legends").clone().appendTo("#abc");
    //     $(".svgcontainer").clone().appendTo("#abc");
    //     if(that.legends.display==="vertical"){
    //         d3.select(".clone #legendscontainer").attr("width",screen.width-200).attr("height", that.series.length*40);
    //     }else if(that.legends.display === "horizontal") {
    //         d3.select(".clone #legendscontainer").attr("width",screen.width-200).attr("height", 60);
    //     }
    //     d3.select(".clone #legends").attr("transform","scale("+scaleFactor+")");
    //     d3.select(".clone #container").attr("width",screen.width-200).attr("height",screen.height-200).style("display","block");
    //     d3.select(".clone svg #main").attr("transform","scale("+scaleFactor+")translate("+(that.margin.left)+","+that.margin.top+")");
    //     d3.select(".clone svg #horizontal-cursor").remove();
    //     d3.select(".clone svg #vertical-cursor").remove();
    //     $(".clone").css({"background-color":"#fff","border-radius":"15px","color":"#000","display":"none","padding":"20px   ","min-width":screen.availWidth-100,"min-height":screen.availHeight-150,"visibility":"visible","align":"center"});
    //     $("#abc").bPopup({position: [30, 10],transition: 'fadeIn',onClose: function(){ $('.clone').remove(); }});
    // };
};
