PykCharts.multiD.spiderWeb = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function () {
        if(that.mode === "default") {
            that.k.loading();
        }
        that = new PykCharts.multiD.processInputs(that, options, "spiderweb");
        that.multiD = new PykCharts.multiD.configuration(that);
        that.axisTitle = options.optional && options.optional.axisTitle ? options.optional.axisTitle : theme.multiDimensionalCharts.spiderweb.axisTitle;
        that.bubbleRadius = options.spiderweb && _.isNumber(options.spiderweb.radius) ? options.spiderweb.radius : theme.multiDimensionalCharts.spiderweb.radius;
        that.outerRadius = options.spiderweb && _.isNumber(options.spiderweb.outer_radius) ? options.spiderweb.outer_radius : theme.multiDimensionalCharts.spiderweb.radius; 
        that.innerRadius = 0;
        that.enableTicks = options.optional && options.optional.enableTicks ? options.optional.enableTicks : theme.multiDimensionalCharts.spiderweb.enableTicks;        

        d3.json(options.data, function (e, data) {
            that.data = data;
            $(that.selector+" #chart-loader").remove();
            that.render();            
        });
    };

    that.refresh = function () {
        d3.json(options.data, function (e, data) {
            that.data = data;
            that.mapGroupData = that.multiD.mapGroup(that.data); 
            that.optionalFeatures()
                .createSpiderWeb()
                .legends()
                .axisTicks()
                .axisTitle();
        });
    };

    this.render = function () {
        that.radius_range = [7,18];
        that.fillChart = new PykCharts.Configuration.fillChart(that);
        that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range);
        that.border = new PykCharts.Configuration.border(that);
        that.mapGroupData = that.multiD.mapGroup(that.data);
        if(that.mode === "default") {
            that.k.title();
            that.k.subtitle()
                .makeMainDiv(that.selector,1);
            
            that.optionalFeatures()
                .legendsContainer(1)
                .svgContainer(1);

            that.k
                .liveData(that)
                .tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

            that.optionalFeatures()
                .createSpiderWeb()
                .axisTicks()
                .axisTitle()
                .legends();

              that.k.credits()
                .dataSource();

        } else if (that.mode==="infographics") {
            that.optionalFeatures().svgContainer()
                .createSpiderWeb()
                .axisTicks()
                .axisTitle();

            that.k.tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
       }              
    };

    this.degrees = function (radians) {
      return (radians / Math.PI * 180 - 90);
    };

    this.optionalFeatures = function () {
        var that =this;
        var status;
        var optional = {
            svgContainer: function (i) {
                $(that.selector).attr("class","PykCharts-spider-web");
                that.svg = d3.select(that.selector + " #tooltip-svg-container-" + i)
                    .append("svg")
                    .attr("class","svgcontainer")
                    .attr("id","svgcontainer")
                    .attr("width", that.width)
                    .attr("height", that.height)
                    .style("background-color",that.bg);
                    
                that.group = that.svg.append("g")
                    .attr("id","spidergrp")
                    .attr("transform", "translate(" + that.width / 2 + "," + that.height / 2 + ")");

                return this;               
            },
            legendsContainer : function (i) {
                if (PykCharts.boolean(that.legends.enable) && PykCharts.boolean(that.size.enable) && that.mapGroupData[1]) {
                    that.legendSvg = d3.select(that.selector + " #tooltip-svg-container-" + i)
                        .append("svg")
                        .attr("class","legendsvg")
                        .attr("id","legendsvg")
                        .attr("width",that.width)
                        .attr("height",50);

                    that.legendsgrp = that.legendSvg.append("g")
                        .attr("class","legendgrp")
                        .attr("id","legendgrp");
                } 
                return this;
            },
            createSpiderWeb: function () {
                var i;
                that.group_arr = [];
                that.unique_arr = [];
                for(j=0; j<that.data.length; j++) {
                    that.group_arr[j] = that.data[j].group;
                }
                that.uniq_arr = _.uniq(that.group_arr);
                var len = that.uniq_arr.length;
                that.new_data = [];

                for (k=0; k<len; k++) {
                    that.new_data[k] = {
                        name: that.uniq_arr[k],
                        data: []
                    };                   
                    for (l=0; l<that.data.length; l++) {
                        if (that.uniq_arr[k] === that.data[l].group) {
                            that.new_data[k].data.push({
                                x: that.data[l].x,
                                y: that.data[l].y,
                                weight: that.data[l].weight,
                                color: that.data[l].color,
                                tooltip: that.data[l].tooltip
                            });
                        } 
                    }
                }
                var uniq = that.new_data[0].data;    
                                
                that.max = d3.max(that.new_data, function (d,i) { return d3.max(d.data, function (k) { return k.y; })});
                that.min = d3.min(that.new_data, function (d,i) { return d3.min(d.data, function (k) { return k.y; })});

                that.yScale = d3.scale.linear()
                    .domain([that.min,that.max])
                    .range([that.innerRadius, that.outerRadius]);
                that.yDomain = [], that.nodes = [];

                for (i=0;i<that.new_data.length;i++){
                    var t = [];
                    for (j=0;j<that.new_data[i].data.length;j++) {
                        t[j] = that.yScale(that.new_data[i].data[j].y);
                    }
                    that.yDomain[i] = t;
                }
                for (i=0;i<that.new_data.length;i++){
                    that.y = d3.scale.linear()
                        .domain(d3.extent(that.yDomain[i], function(d) { return d; }))
                        .range([0.1,0.9]);
                    var xyz = [];
                    for (j=0;j<uniq.length;j++) {
                        xyz[j] = {
                            x: j,
                            y: that.y(that.yDomain[i][j])
                        }
                    }
                    that.nodes[i] = xyz;
                }
                for (m =0; m<that.new_data.length; m++) {
                    var toolTip = [];
                    for (j=0; j<that.new_data[m].data.length;j++) {
                        toolTip[j] = that.new_data[m].data[j].tooltip;
                    }
                    that.angle = d3.scale.ordinal().domain(d3.range(that.new_data[m].data.length+1)).rangePoints([0, 2 * Math.PI]);
                    that.radius = d3.scale.linear().range([that.innerRadius, that.outerRadius]);

                    that.yAxis = [];
                    for (i=0;i<that.new_data[m].data.length;i++){
                        that.yAxis.push(
                            {x: i, y: 0.25},
                            {x: i, y: 0.5},
                            {x: i, y: 0.75},
                            {x: i, y: 1}
                        );
                    }

                    var target;
                    var grids = [];
                    for (i=0;i<that.yAxis.length;i++) {               
                        if (i<(that.yAxis.length-4)) {
                            target = that.yAxis[i+4];
                        } else {
                            target = that.yAxis[i - that.yAxis.length + 4];
                        }
                        grids.push({source: that.yAxis[i], target: target});
                    }

                    var links = [], color;
                    for (i=0;i<that.nodes[m].length;i++) {                      
                        if (i<(that.nodes[m].length-1)) {
                            target = that.nodes[m][i+1];
                            color = that.fillChart.colorPieW(that.new_data[m].data[i]);
                        } else {
                            target = that.nodes[m][0];
                            color = that.fillChart.colorPieW(that.new_data[m].data[i]);
                        }
                        links.push({source: that.nodes[m][i], target: target, color : color});
                    }

                    var spider =  that.group.selectAll("#link"+m)
                        .data(links);

                    spider.enter().append("path")
                        .attr("class", "link")
                        
                    spider.attr("class","link")
                        .attr("stroke",function (d) {
                           return d.color;
                        })
                        .attr("stroke-opacity",1)
                        .attr("id","link"+m)
                        .attr("d", d3.customHive.link()
                            .angle(function(d) { /*console.log(d,"d");*/ return that.angle(d.x); })
                            .radius(function(d) { return that.radius(d.y); })
                        );
                    spider.exit().remove();


                    that.weight = _.map(that.new_data[m].data, function (d) {
                        return d.weight;
                    });

                    that.weight = _.reject(that.weight,function (num) {
                        return num == 0;
                    });

                    that.sorted_weight = that.weight.slice(0);
                    that.sorted_weight.sort(function(a,b) { return a-b; });

                    var spidernode = that.group.selectAll(".node"+m)
                        .data(that.nodes[m])
                    
                    spidernode.enter().append("circle")
                        .attr("class", "node"+m)
                        .attr("transform", function(d) { return "rotate(" + that.degrees(that.angle(d.x)) + ")"; })
                        
                        
                    spidernode.attr("class","node"+m)
                        .attr("cx", function (d) { return that.radius(d.y); })
                        .attr("r", function (d,i) { return that.sizes(that.new_data[m].data[i].weight); })
                        .style("fill", function (d,i) {
                            return that.fillChart.colorPieW(that.new_data[m].data[i]);
                        })
                        .style("opacity", function (d,i) { 
                            return that.multiD.opacity(that.new_data[m].data[i].weight,that.weight,that.data);
                        })
                        .attr("stroke",that.border.color())
                        .attr("stroke-width",that.border.width())
                        .on('mouseover',function (d,i) {
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.toolTextShow(toolTip[i]);
                        })
                        .on('mouseout',function (d) {
                            that.mouseEvent.tooltipHide(d);  
                        })
                        .on('mousemove', function (d) {
                          that.mouseEvent.tooltipPosition(d);
                        });
                    spidernode.exit().remove();
                }

                that.group.selectAll(".axis")
                    .data(d3.range(that.new_data[0].data.length))
                    .enter().append("line")
                    .attr("class", "axis")
                    .attr("transform", function(d) { return "rotate(" + that.degrees(that.angle(d)) + ")"; })
                    .attr("x1", that.radius.range()[0])
                    .attr("x2", that.radius.range()[1]);
                  //  .attr("fill","blue");

                that.group.selectAll(".grid")
                    .data(grids)
                    .enter().append("path")
                    .attr("class", "grid")
                    .attr("d", d3.customHive.link()
                        .angle(function(d) { return that.angle(d.x); })
                        .radius(function(d) { return that.radius(d.y); })
                    );

                return this;             
            },
            legends : function () {
                if (PykCharts.boolean(that.legends.enable) && PykCharts.boolean(that.size.enable) && that.mapGroupData[1]) {
                    var unique = _.uniq(that.sorted_weight);
                    var k = 0;
                    var l = 0;
                    if(that.legends.display === "vertical" ) {
                        that.legendSvg.attr("height", (that.mapGroupData[0].length * 30)+20);
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

                    } else if(that.legends.display === "horizontal") {
                         // that.legendSvg.attr("height", (k+1)*70);
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
                                return that.width - (i*100 + 75); 
                            } else if ((that.width - (l*100 + 75)) < that.width) {
                                l++;
                                return that.width - ((l-1)*100 + 75); 
                            } else {
                                l = 0;
                                l++;
                                return that.width - ((l-1)*100 + 75); 
                            }
                        };

                        text_parameter2value = function (d,i) {
                            if(i === 0) {
                                k = 0, l = 0;
                            }
                            if((that.width - (i*100 + 75)) > 0) {
                            } else if ((that.width - (l*100 + 75)) < that.width) {
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
                                return that.width - (i*100 + 100); 
                            } else if ((that.width - (i*100 + 100)) < that.width) {
                                k++;
                                if(l === 0) {
                                    that.legendSvg.attr("height", (l+1)*50);
                                }
                                l++;
                                return that.width - ((l-1)*100 + 100); 
                            } else {
                                l = 0;
                                l++;
                                k++;
                                return that.width - ((l-1)*100 + 100); 
                            }
                        };
                        rect_parameter4value = function (d,i) {
                            if(i === 0) {
                                k = 0, l = 0;
                            }
                            if((that.width - (i*100 + 75)) > 0) {
                            } else if ((that.width - (l*100 + 75)) < that.width) {
                                if( l == 0) {
                                    k++;
                                }
                                l++;
                            } else {
                                l = 0;
                                l++;
                                k++;    
                            }
                            return k * 24 + 12;  
                        } 
                    };

                    var legend = that.legendsgrp.selectAll("rect")
                            .data(that.mapGroupData[0]);

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

                    that.legends_text = that.legendsgrp.selectAll(".legends_text")
                        .data(that.mapGroupData[0]);

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
            //         opacity = function (d){return that.multiD.opacity(d,that.sorted_weight,that.data); };
            //         var start, height, width, xtext, ytext;
                   
            //         var renderLengends = function (start,height,width,xtext,ytext,position,textPosition) {
            //             for(k=1;k<=unique.length;k++)
            //             {    
            //                 x = that.legendgrp.selectAll("rect")
            //                     .data(unique);
                                
            //                 x.enter()
            //                     .append("rect");

            //                 x.attr(start, position)
            //                     .attr("height", height)
            //                     .attr("width", width)
            //                     .attr("fill",function(d) { return that.fillChart.colorPieW(d); })
            //                     .attr("opacity",opacity);

            //                 x.exit().remove();
                            
            //                 y = that.legendgrp.selectAll(".leg")
            //                      .data(unique);
                            
            //                 y.enter()
            //                     .append("text");

            //                 y.attr("class","leg")
            //                     .attr("x",xtext)
            //                     .attr("y",ytext)
            //                     .style("font-size",12)
            //                     .style("font-family", "'Helvetica Neue',Helvetica,Arial,sans-serif");

            //                 y.text(roundOff);
                            
            //                 y.exit().remove();
            //             }                   
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
            axisTitle : function () {
                if(PykCharts.boolean(that.axisTitle)) {
                    that.length = that.new_data[0].data.length;

                    var spider_text = that.group.selectAll("text.axisTitle")
                        .data(that.nodes[0]);

                    spider_text.enter()
                        .append("text")
                        .attr("class","axisTitle");

                    spider_text
                        .attr("transform", function(d, i){ 
                            return "translate(" + (-that.width/2) + "," + (-that.height/2) + ")";
                        })
                        .style("text-anchor","middle")
                        .attr("x", function (d, i){return that.width/2*(1-0.2*Math.sin(i*2*Math.PI/that.length))+245*Math.sin(i*2*Math.PI/that.length);})
                        .attr("y", function (d, i){
                            return that.height/2*(1-0.60*Math.cos(i*2*Math.PI/that.length))-75*Math.cos(i*2*Math.PI/that.length);
                        })
                        .style("font-size",that.label.size)
                        .style("font-family",that.label.family)
                    
                    spider_text
                        .text(function (d,i) { return that.new_data[0].data[i].x; });
                
                    spider_text.exit().remove();
                }
                return this;
            },
            axisTicks: function () {
                if (PykCharts.boolean(that.enableTicks)) {
                    var a = that.yScale.domain();
                    var t = a[1]/4;
                    var b=[];
                    for(i=4,j=0; i>=0 ;i--,j++){
                        b[j]=i*t;
                    }
                    var spider_ticks = that.group.selectAll("text.ticks")
                        .data(b);

                    spider_ticks.enter()
                        .append("text")
                        .attr("class","ticks");

                    spider_ticks
                        .style("text-anchor","start")
                        .attr("transform", "translate(5,-180)") 
                        .attr("x",0)
                        .attr("y", function (d,i) { return i*40; });

                    spider_ticks               
                        .text(function (d) { return d; })
                        .style("font-size",that.label.size)
                        .style("font-family",that.label.family);
                }              
                return this;
            },          
        }
        return optional;
    };

    // this.fullScreen = function () {      
    //     var modalDiv = d3.select(options.selector).append("div")
    //         .attr("id","abc")
    //         .attr("align","center")
    //         .attr("visibility","hidden")
    //         .attr("class","clone")
    //         .style("align","center")
    //         .append("a")
    //         .attr("class","b-close")
    //             .style("cursor","pointer")
    //             .style("position","absolute")
    //             .style("right","10px")
    //             .style("top","5px")
    //             .style("font-size","20px")
    //             .html("Close");

    //     var scaleFactor = 1.5;
    //     var w = that.w;
    //     var h = that.h;
    //     if(h>=500 || w>900){
    //         scaleFactor = 1;
    //     }
    //     if(that.legends.position == "top" || that.legends.position == "left") {
    //         $(".legendsvg").clone().appendTo("#abc");            
    //         $(".svgcontainer").clone().appendTo("#abc");
    //     }
    //     else {
    //         $(".svgcontainer").clone().appendTo("#abc");  
    //         $(".legendsvg").clone().appendTo("#abc");
    //     }
    //     if(that.legends.position == "top" || that.legends.position == "bottom") {
    //         d3.select(".clone #legendsvg").attr("width",screen.width-200);
    //         d3.select(".clone #legendgrp").attr("transform","scale("+scaleFactor+")"); 
    //         d3.select(".clone #svgcontainer").attr("width",screen.width-200).attr("height",screen.height-200).style("display","block");
    //     }
    //     else if(that.legends.position == "left" || that.legends.position == "right") {
    //         d3.select(".clone #legendsvg").attr("width",100).attr("height",screen.height-100);
    //         d3.select(".clone svg #legendgrp").attr("transform","scale("+scaleFactor+")");            
    //         d3.select(".clone #svgcontainer").attr("width",screen.width-200).attr("height",screen.height-200);
    //     }
    //     d3.select(".clone svg #spidergrp")
    //         .attr("transform","scale("+scaleFactor+")")
    //         .attr("transform", "translate(" + that.w / 2 + "," + that.h / 2 + ")");  
    //     $(".clone").css({"background-color":"#fff","border-radius":"15px","color":"#000","display":"none","padding":"20px","min-width":screen.availWidth-100,"min-height":screen.availHeight-150,"visibility":"visible","align":"center"});
    //     $("#abc").bPopup({position: [30, 10],transition: 'fadeIn',onClose: function(){ $('.clone').remove(); }});
    // };
};