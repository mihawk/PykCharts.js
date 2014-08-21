PykCharts.multiD.scatterplot = function (options) {
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
        that.enableCrossHair = optional && optional.enableCrossHair ? optional.enableCrossHair : multiDimensionalCharts.enableCrossHair;
        that.multiD = new PykCharts.multiD.configuration(that);
        that.grid = options.chart && options.chart.grid ? options.chart.grid : stylesheet.chart.grid;
        that.grid.yEnabled = options.chart && options.chart.grid && options.chart.grid.yEnabled ? options.chart.grid.yEnabled : stylesheet.chart.grid.yEnabled;
        that.grid.xEnabled = options.chart && options.chart.grid && options.chart.grid.xEnabled ? options.chart.grid.xEnabled : stylesheet.chart.grid.xEnabled;
        that.multiple_containers = optional && optional.multiple_containers && optional.multiple_containers.enable ? optional.multiple_containers.enable : multiDimensionalCharts.multiple_containers.enable;
        that.bubbleRadius = options.scatterplot && _.isNumber(options.scatterplot.radius) ? options.scatterplot.radius : multiDimensionalCharts.scatterplot.radius;
        that.zoomedOut = true;
        
        d3.json(options.data, function (e, data) {
            that.data = data;
            $(that.selector+" #chart-loader").remove();
            that.render();
        });
    };

    this.refresh = function () {
        d3.json(options.data, function (e, data) {
            that.data = data;

            that.optionalFeatures()
                    .createScatterPlot()
                    .legends()
                    .ticks();
        });
    };

    this.render = function () {
        var that = this;
        that.fillChart = new PykCharts.Configuration.fillChart(that);      
        
        that.border = new PykCharts.Configuration.border(that);
    
        if(that.mode === "default") {
            that.k.title()
                .subtitle();
            
            that.data_group = jQuery.unique(that.data.map(function (d) {
                return d.group;
            }));
            that.no_of_groups = 1;
            
            if(PykCharts.boolean(that.multiple_containers)) {
                that.radius_range = [3,7];
                that.no_of_groups = that.data_group.length;
                that.width = that.width/that.no_of_groups;
                that.margin.left = 25;
                that.margin.right = 15;
                for(i=0;i<that.no_of_groups;i++){
                    that.new_data = [];
                    for(j=0;j<that.data.length;j++) {
                        if(that.data[j].group === that.data_group[i]) {
                            that.new_data.push(that.data[j]);
                        }
                    }
                    // that.k.positionContainers(that.legends,that);

                        
                    that.k.makeMainDiv(that.selector,i);
                    that.optionalFeatures()
                        .legendsContainer(i)
                        .svgContainer(i);

                    that.k.liveData(that)
                        .tooltip();

                    that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
                    that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range); 

                    that.optionalFeatures().createScatterPlot()
                        .legends()
                        .ticks()
                        .crossHair();

                    that.k.xAxis(that.svgContainer,that.xGroup,that.x)
                        .yAxis(that.svgContainer,that.yGroup,that.y)
                        .yGrid(that.svgContainer,that.group,that.y)
                        .xGrid(that.svgContainer,that.group,that.x);                    
                }
            } else {
                that.radius_range = [7,18];
                that.new_data = that.data;
                that.k.makeMainDiv(that.selector,1);
                that.optionalFeatures()
                    .legendsContainer(1)
                    .svgContainer(1);

                that.k.liveData(that)
                    .tooltip();

                that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
                // that.k.positionContainers(that.legends,that);
                that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range); 
                
                that.optionalFeatures().createScatterPlot()
                    .legends()
                    .zoom()
                    .ticks()
                    .crossHair();

                that.k.xAxis(that.svgContainer,that.xGroup,that.x)
                    .yAxis(that.svgContainer,that.yGroup,that.y)
                    .yGrid(that.svgContainer,that.group,that.y)
                    .xGrid(that.svgContainer,that.group,that.x);
            }

            that.k.credits()
                .dataSource();
            that.optionalFeatures()
                .zoom();

        } else if (that.mode === "infographics") {
            that.radius_range = [7,18];
            that.new_data = that.data;

            that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range);
            that.k.tooltip()
                .makeMainDiv(that.selector,1);
            that.optionalFeatures()
                    .svgContainer(1);
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
            that.optionalFeatures().createScatterPlot()
                .crossHair();

            that.k.xAxis(that.svgContainer,that.xGroup,that.x)
                .yAxis(that.svgContainer,that.yGroup,that.y)
        }
    };

    this.optionalFeatures = function () {
        var that = this;
        var optional = {
            svgContainer :function (i) {
                $(options.selector + " #tooltip-svg-container-" + i).css("width",that.width);
                $(options.selector).attr("class","PykCharts-weighted")
                that.svgContainer = d3.select(options.selector + " #tooltip-svg-container-" + i)
                    .append('svg')
                    .attr("width",that.width)
                    .attr("height",that.height)
                    .attr("id","svgcontainer")
                    .attr("class","svgcontainer")
                    .style("background-color",that.bg);

                that.group = that.svgContainer.append("g")
                    .attr("transform","translate("+(that.margin.left)+","+(that.margin.top)+")")
                    .attr("id","main");

                that.group1 = that.svgContainer.append("g")
                    .attr("transform","translate("+(that.margin.left)+","+(that.margin.top)+")")
                    .attr("id","main2");

                that.xGroup = that.group.append("g")
                    .attr("class", "x axis")
                    .style("stroke","black")
                    .attr("transform", "translate(0," + (that.height-that.margin.top-that.margin.bottom) + ")");

                that.yGroup = that.group.append("g")
                    .attr("class", "y axis")
                    .style("stroke","blue");

                if(PykCharts.boolean(that.grid.xEnabled)) {
                    that.group.append("g")
                        .attr("id","xgrid")
                        .attr("class","x grid-line");
                }

                if(PykCharts.boolean(that.grid.yEnabled)) {
                    that.group.append("g")
                        .attr("id","ygrid")
                        .attr("class","y grid-line");
                }

                that.clip = that.group.append("svg:clipPath")
                            .attr("id", "clip")
                            .append("svg:rect")
                            .attr("width",(that.width-that.margin.left-that.margin.right))
                            .attr("height", that.height-that.margin.top-that.margin.bottom);

                that.chartBody = that.group.append("g")
                            .attr("clip-path", "url(#clip)");

                return this;
            },
            legendsContainer : function (i) {
                if (PykCharts.boolean(that.legends.enable) && !(PykCharts.boolean(that.size.enable))) {
                    that.legendsContainer = d3.select(that.selector + " #tooltip-svg-container-" + i)
                        .append('svg')
                        .attr('width',that.width)
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
            createScatterPlot : function () {

                that.weight = _.map(that.new_data, function (d) {
                    return d.weight;
                });

                that.weight = _.reject(that.weight,function (num) {
                    return num == 0;
                });

                that.max_radius = that.sizes(d3.max(that.weight));

                that.sorted_weight = that.weight.slice(0);
                that.sorted_weight.sort(function(a,b) { return a-b; });
                that.group.append("text")
                    .attr("fill", "black")
                    .attr("text-anchor", "end")
                    .attr("x", that.width - 70)
                    .attr("y", that.height + 40)
                    .text(that.axis.x.label);

                if(that.zoomedOut === true) {
                    var x_domain = d3.extent(that.data, function (d) {
                            return d.x;
                        });
                    var y_domain = d3.extent(that.data, function (d) {
                            return d.y;
                        })
                    var x_domain = [],y_domain,max,min,type;
                    var x_domain,x_data = [],y_data = [],y_range,x_range,y_domain;

                    if(that.yAxisDataFormat === "number") {
                        max = d3.max(that.data, function(d) { return d.y;  });
                        min = d3.min(that.data, function(d) { return d.y; });
                        y_domain = [min,max];
                        y_data = that.k._domainBandwidth(y_domain,2);
                        y_range = [that.height - that.margin.top - that.margin.bottom, 0];
                        that.y = that.k.scaleIdentification("linear",y_data,y_range);
                        that.top_margin = 0;

                    } else if(that.yAxisDataFormat === "string") {
                        that.data.forEach(function(d) { y_data.push(d.y); });
                        y_range = [0,that.height - that.margin.top - that.margin.bottom];
                        that.y = that.k.scaleIdentification("ordinal",y_data,y_range,0);
                        that.top_margin = (that.y.rangeBand() / 2);

                    } else if (that.yAxisDataFormat === "time") {
                        y_data = d3.extent(that.data, function (d) {
                            return new Date(d.x);
                        });
                        y_range = [that.height - that.margin.top - that.margin.bottom, 0];
                        that.y = that.k.scaleIdentification("time",y_data,y_range);
                        that.top_margin = 0;
                    }
                    if(that.xAxisDataFormat === "number") {
                        max = d3.max(that.data, function(d) { return d.x;  });
                        min = d3.min(that.data, function(d) { return d.x; });
                        x_domain = [min,max];
                        x_data = that.k._domainBandwidth(x_domain,2);
                        x_range = [0 ,that.width - that.margin.left - that.margin.right];
                        that.x = that.k.scaleIdentification("linear",x_data,x_range);
                        that.left_margin = 0;

                    } else if(that.xAxisDataFormat === "string") {
                        that.data.forEach(function(d) { x_data.push(d.x); });
                        x_range = [0 ,that.width - that.margin.left - that.margin.right];
                        that.x = that.k.scaleIdentification("ordinal",x_data,x_range,0);
                        that.left_margin = (that.x.rangeBand()/2);

                    } else if (that.xAxisDataFormat === "time") {
                        max = d3.max(that.data, function(d) { return d3.max(d.data, function(k) { return new Date(k.x); }); });
                        min = d3.min(that.data, function(d) { return d3.min(d.data, function(k) { return new Date(k.x); }); });
                        x_data = [min,max];
                        x_range = [0 ,that.width - that.margin.left - that.margin.right];
                        that.x = that.k.scaleIdentification("time",x_data,x_range);
                        that.new_data[0].data.forEach(function (d) {
                            d.x = new Date(d.x);
                        });
                        that.left_margin = 0;
                    }

                    if(PykCharts.boolean(that.zoom.enable) && !(that.yAxisDataFormat==="string" || that.xAxisDataFormat==="string") && (that.mode === "default")) {
                        that.svgContainer
                            .call(d3.behavior.zoom()
                            .x(that.x)
                            .y(that.y)
                            .scaleExtent([1, 10])
                            .on("zoom", zoomed));
                    }
                    that.optionalFeatures().plotCircle();
                }
                return this;
            },
            legends : function () {
                if (PykCharts.boolean(that.legends.enable) && !(PykCharts.boolean(that.size.enable))) {
                    var unique = _.uniq(that.sorted_weight);

                    if(options.optional.legends.display === "vertical" ) {
                        that.legendsContainer.attr("height", (unique.length * 30)+20);
                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        text_parameter1value = function (d,i) { return that.width - that.width/4 + 16; };
                        rect_parameter3value = function (d,i) { return that.width - that.width/4; };
                        var rect_parameter4value = function (d,i) { return i * 24 + 12;};
                        var text_parameter2value = function (d,i) { return i * 24 + 23;};

                    } else if(options.optional.legends.display === "horizontal") {
                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";
                        var text_parameter1value = function (d,i) { return that.width - (i*100 + 75); };
                        text_parameter2value = 30;
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        var rect_parameter3value = function (d,i) { return that.width - (i*100 + 100); };
                        rect_parameter4value = 18;
                    }

                    var legend = that.legendsGroup.selectAll("rect")
                            .data(unique);

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
                            return that.multiD.opacity(d,that.sorted_weight,that.data);
                        });

                    legend.exit().remove();

                    that.legends_text = that.legendsGroup.selectAll(".legends_text")
                        .data(unique);

                    that.legends_text
                        .enter()
                        .append('text')
                        .attr("class","legends_text")
                        .attr("fill",that.legendsText.color)
                        .attr("pointer-events","none")
                        .style("font-family", that.legendsText.family)
                        .attr("font-size",that.legendsText.size);

                    that.legends_text.attr("class","legends_text")
                        .attr("fill","black")
                        .attr(text_parameter1, text_parameter1value)
                        .attr(text_parameter2, text_parameter2value)
                        .text(function (d) { return d });

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
                    var scattrText = that.group1.selectAll("text")
                        .data(that.new_data);

                    scattrText.enter()
                        .append("text");

                    scattrText.
                        attr("transform",function (d) {
                            return "translate(" + that.x(d.x) + "," + that.y(d.y) + ")";
                        })
                        .style("text-anchor", "middle")
                        .style("font-family", that.label.family)
                        .style("font-size",that.label.size)
                        .attr("pointer-events","none")
                        .attr("dx",-1)
                        .attr("dy",-12);

                    scattrText.text(function (d) { return d.name; });

                    scattrText.exit().remove();
                }
                return this;
            },
            zoom : function () {
                if(PykCharts.boolean(that.zoom) && !(that.yAxisDataFormat==="string" || that.xAxisDataFormat==="string")) {
                    that.zoomOutButton = d3.select(options.selector)
                        .append("input")
                            .attr("type","button")
                            .attr("value","Zoom Out")
                            .attr("id","zoomOut")
                            .style("position","absolute")
                            // .style("left",800)
                            .style("left", that.margin.left + 300)
                            .style("top", that.margin.top + 50)
                            // .style("top",that.h-270)
                            .style("height","20")
                            .on("click",function () {
                                that.zoomedOut = true;
                                that.optionalFeatures().createScatterPlot();
                                that.k.xAxis(that.svgContainer,that.xGroup,that.x)
                                    .yAxis(that.svgContainer,that.yGroup,that.y)
                                    .yGrid(that.svgContainer,that.group,that.y)
                                    .xGrid(that.svgContainer,that.group,that.x)
                            });
                }
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
                    .attr("cx", function (d) { return (that.x(d.x)+that.left_margin); })
                    .attr("cy", function (d) { return (that.y(d.y)+that.top_margin); })
                    .style("fill", function (d) { return that.fillChart.colorPieW(d); })
                    .style("fill-opacity", function (d) { return that.multiD.opacity(d.weight,that.weight,that.data); })
                    .attr("stroke", that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-opacity",1)
                    .on('mouseover',function (d) {
                        that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.toolTextShow(d.group);
                    })
                    .on('mouseout',function (d) {
                        that.mouseEvent.tooltipHide(d);
                    })
                    .on('mousemove', function (d) {
                        that.mouseEvent.tooltipPosition(d);
                    });

                that.circlePlot.exit().remove();
                return this;
            },
            crossHair : function () {
                if(PykCharts.boolean(that.enableCrossHair)) {
                    var horizontalLine = that.svgContainer.append("line")
                        .attr("x1", that.margin.left)
                        .attr("y1", that.margin.top)
                        .attr("x2", that.width-that.margin.right)
                        .attr("y2", that.margin.top)
                        .attr("id","horizontal-cursor")
                        .attr("pointer-events","none")
                        .attr("class","line-cursor");

                    var verticalLine = that.svgContainer.append("line")
                        .attr("x1", that.margin.left)
                        .attr("y1", that.margin.top)
                        .attr("x2", that.margin.left)
                        .attr("y2", that.height-that.margin.bottom)
                        .attr("id", "vertical-cursor")
                        .attr("pointer-events","none")
                        .attr("class","line-cursor");

                    that.svgContainer.on("mousemove",function () {
                        var i,
                            x = (d3.event.layerX) - ($(that.selector+" #svgcontainer").offset().left - $(that.selector).parent().offset().left),
                            y = (d3.event.layerY) - ($(that.selector+" #svgcontainer").offset().top - $(that.selector).parent().offset().top);

                        d3.select(that.selector + " #svgcontainer").style('cursor', 'none');

                        if(x >= that.margin.left && x <=(that.width-that.margin.right)) {        
                            d3.select(options.selector+" "+'#vertical-cursor')
                                .attr("x1",x)
                                .attr("x2",x);
                        }
                        if(y >= that.margin.top && y <=(that.height-that.margin.bottom)) {
                            d3.selectAll(options.selector+" "+'#horizontal-cursor')
                                .attr("y1",y)
                                .attr("y2",y);
                        }
                    });
                }
            }
        };
        return optional;
    };

function zoomed () {

        that.zoomedOut = false;

        that.k.isOrdinal(that.svgContainer,".x.axis",that.x);
        that.k.isOrdinal(that.svgContainer,".x.grid",that.x);

        that.k.isOrdinal(that.svgContainer,".y.axis",that.y);
        that.k.isOrdinal(that.svgContainer,".y.grid",that.y);

        that.optionalFeatures().plotCircle();

        that.circlePlot
            .attr("r", function (d) {
                return that.sizes(d.weight)*d3.event.scale;
            });
}
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
