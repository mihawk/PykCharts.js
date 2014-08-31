PykCharts.oneD.pie = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function() {
        that = new PykCharts.oneD.processInputs(that, options, "pie");

        that.radiusPercent = options.optional && options.optional.pie && _.isNumber(options.optional.pie.radiusPercent) ? options.optional.pie.radiusPercent : theme.oneDimensionalCharts.pie.radiusPercent;
        that.innerRadiusPercent = 0;
        if(that.mode === "default") {
           that.k.loading();
        }
        d3.json(options.data, function (e, data) {
            that.data = data.groupBy("oned");
            $(options.selector+" #chart-loader").remove();
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"pie");
            that.clubData.enable = that.data.length > that.clubData.maximumNodes ? that.clubData.enable : "no";
            pieFunctions.render();

        });
        // that.clubData.enable = that.data.length>that.clubData.maximumNodes ? that.clubData.enable : "no";
    };
};

PykCharts.oneD.donut = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function() {

        that = new PykCharts.oneD.processInputs(that, options, "pie");

        that.radiusPercent = options.optional && options.optional.donut && _.isNumber(options.optional.donut.radiusPercent) ? options.optional.donut.radiusPercent : theme.oneDimensionalCharts.donut.radiusPercent;
        that.innerRadiusPercent = options.optional && options.optional.donut && _.isNumber(options.optional.donut.innerRadiusPercent) && options.optional.donut.innerRadiusPercent ? options.optional.donut.innerRadiusPercent : theme.oneDimensionalCharts.donut.innerRadiusPercent;

        d3.json(options.data, function (e, data) {
            that.data = data.groupBy("oned");
            $(options.selector+" #chart-loader").remove();
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"donut");
            that.clubData.enable = that.data.length > that.clubData.maximumNodes ? that.clubData.enable : "no";
            pieFunctions.render();
        });
    };
};

PykCharts.oneD.election_pie = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function() {

        that = new PykCharts.oneD.processInputs(that, options, "pie");

        that.radiusPercent = options.optional && options.optional.pie && _.isNumber(options.optional.pie.radiusPercent) ? options.optional.pie.radiusPercent : theme.oneDimensionalCharts.pie.radiusPercent;
        that.innerRadiusPercent = 0;
        d3.json(options.data, function (e, data) {
            that.data = data.groupBy("oned");
            $(options.selector+" #chart-loader").remove();
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"election pie");
            that.clubData.enable = that.data.length > that.clubData.maximumNodes ? that.clubData.enable : "no";
            pieFunctions.render();

        });
    };
};

PykCharts.oneD.election_donut = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function() {
        that = new PykCharts.oneD.processInputs(that, options, "pie");

        that.radiusPercent = options.optional && options.optional.donut && _.isNumber(options.optional.donut.radiusPercent) ? options.optional.donut.radiusPercent : theme.oneDimensionalCharts.donut.radiusPercent;
        that.innerRadiusPercent = options.optional && options.optional.donut && _.isNumber(options.optional.donut.innerRadiusPercent) && options.optional.donut.innerRadiusPercent ? options.optional.donut.innerRadiusPercent : theme.oneDimensionalCharts.donut.innerRadiusPercent;

        d3.json(options.data, function (e, data) {
            that.data = data.groupBy("oned");
            $(options.selector+" #chart-loader").remove();
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"election donut");
            that.clubData.enable = that.data.length> that.clubData.maximumNodes ? that.clubData.enable : "no";
            pieFunctions.render();
        });
    };
};


    //----------------------------------------------------------------------------------------
    // Function to handle live data
    //----------------------------------------------------------------------------------------

PykCharts.oneD.pieFunctions = function (options,chartObject,type) {
    var that = chartObject;
       that.refresh = function () {
        d3.json(options.data, function (e, data) {
            that.data = data.groupBy("oned");
            that.optionalFeatures()
                    .createPie()
                    .label()
                    .ticks()
                    .centerLabel();
        });
    };

    //----------------------------------------------------------------------------------------
    // Function to render the chart
    //----------------------------------------------------------------------------------------

    this.render = function() {

        that.count = 1;

        that.fillChart = new PykCharts.oneD.fillChart(that);
        that.onHoverEffect = new PykCharts.oneD.mouseEvent(options);
        that.border = new PykCharts.Configuration.border(that);
        that.transitions = new PykCharts.Configuration.transition(that);

        if(that.mode.toLowerCase() == "default") {

            that.k.title()
                .subtitle();

            that.optionalFeatures().svgContainer();
            that.chartData = that.optionalFeatures().clubData();

            that.k.credits()
                    .dataSource()
                    .tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

            var pie = that.optionalFeatures()
                    .set_start_end_angle()
                    .createPie()
                    .label()
                    .ticks()
                    .centerLabel();

            that.k.liveData(that);
        } else if(that.mode.toLowerCase() == "infographics") {
            that.chartData = that.data;
            that.optionalFeatures().svgContainer()
                    .set_start_end_angle()
                    .createPie()
                    .label();

            that.k.tooltip();
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        }
    };

    //----------------------------------------------------------------------------------------
    // Function to render configuration parameters
    //----------------------------------------------------------------------------------------

    that.optionalFeatures = function () {
        var optional = {
            svgContainer :function () {
                $(options.selector).css("background-color",that.bg);

                that.svgContainer = d3.select(that.selector)
                    .append('svg')
                    .attr("width",that.width)
                    .attr("height",that.height)
                    .attr("id","container")
                    .attr("class","svgcontainer");
                that.group = that.svgContainer.append("g")
                    .attr("transform","translate("+(that.width/2)+","+(that.k._radiusCalculation(that.radiusPercent)+20)+")")
                    .attr("id","pieGroup");

                return this;
            },
            createPie : function () {
                d3.select(options.selector +" "+"#pieGroup").node().innerHTML="";

                if(type.toLowerCase() == "pie" || type.toLowerCase() == "donut") {
                    that.chartData.sort(function (a,b) { return a.weight - b.weight;});
                    var temp = that.chartData.pop();
                    that.chartData.unshift(temp);
                }
                else if(type.toLowerCase() == "election pie" || type.toLowerCase() == "election donut") {
                    that.chartData.sort(function (a,b) { return b.weight - a.weight;});
                }
                that.sum = _.reduce(that.data,function (start,num) { return start+num.weight; },0);

                that.sorted_weight = _.map(that.chartData,function (d,i) {
                        return d.weight*100/that.sum;

                });

                that.sorted_weight.sort(function (a,b){return a-b;});

                var proportion =_.map(that.chartData,function (d,i) {
                        return d.weight*100/that.sum;
                });
                that.innerRadius = that.k._radiusCalculation(that.innerRadiusPercent);
                that.radius = that.k._radiusCalculation(that.radiusPercent);

                that.arc = d3.svg.arc()
                    .innerRadius(that.innerRadius)
                    .outerRadius(that.radius);

                that.pie = d3.layout.pie()
                    .value(function (d) { return d.weight; })
                    .sort(null)
                    .startAngle(that.startAngle)
                    .endAngle(that.endAngle);

                var cv_path = that.group.selectAll("path").
                                        data(that.pie(that.chartData));

                cv_path.enter()
                    .append("path");

                cv_path
                    .attr("class","pie");

                cv_path
                    .attr("fill",function (d) {
                            return that.fillChart.chartColor(d.data);
                    })
                    .on('mouseover',function (d) {
                        d.data.tooltip = d.data.tooltip || "<table class='PykCharts'><tr><th colspan='3' class='tooltip-heading'>"+d.data.name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.data.weight)+"<td class='tooltip-right-content'>( "+((d.data.weight*100)/that.sum).toFixed(2)+"% ) </tr></table>";
                        that.onHoverEffect.highlight(options.selector +" "+".pie", this);
                        that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.toolTextShow(d.data.tooltip);
                    })
                    .on('mouseout',function (d) {
                        that.onHoverEffect.highlightHide(options.selector +" "+".pie");
                        that.mouseEvent.tooltipHide(d);
                    })
                    .on('mousemove', function (d) {
                        that.mouseEvent.tooltipPosition(d);
                    })
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                cv_path.transition()
                    .delay(function(d, i) {
                        if(that.transition.duration && that.mode == "default") {
                            return (i * that.transition.duration)/that.chartData.length;
                        } else return 0;
                    })
                    .duration(that.transitions.duration()/that.chartData.length)
                    .attrTween("d",function(d) {
                        var i = d3.interpolate(d.startAngle, d.endAngle);
                        return function(t) {
                            d.endAngle = i(t);
                            return that.arc(d);
                        }
                    });

                cv_path.exit().remove();
                return this;
            },
            label : function () {
                    var cv_text = that.group.selectAll("text")
                                       .data(that.pie(that.chartData));

                    cv_text.enter()
                        .append("text")
                        .attr("transform",function (d) { return "translate("+that.arc.centroid(d)+")"; });

                    cv_text.attr("transform",function (d) { return "translate("+that.arc.centroid(d)+")"; });

                    cv_text.text("")
                        .transition()
                        .delay(function(d, i) {
                            if(PykCharts.boolean(that.transition.duration)) {
                                return (i * that.transition.duration)/that.chartData.length;
                            } else return 0;
                        });

                    cv_text.text(function (d) { return that.k.appendUnits(d.data.weight); })
                        .attr("text-anchor","middle")
                        .attr("pointer-events","none")
                        .text(function (d) {
                            if(type.toLowerCase() === "pie" || type.toLowerCase() === "election pie") {
                                if(this.getBBox().width<((d.endAngle-d.startAngle)*((that.radius/2)*0.9))) {
                                    return that.k.appendUnits(d.data.weight);
                                }
                                else {
                                    return "";
                                }
                            } else {
                                if((this.getBBox().width < (Math.abs(d.endAngle - d.startAngle)*that.radius*0.9))  && (this.getBBox().height < (((that.radius-that.innerRadius)*0.75)))) {
                                    return that.k.appendUnits(d.data.weight);
                                }
                                else {
                                    return "";
                                }
                            }
                        })
                        .attr("dy",5)
                        .style("font-weight", that.label.weight)
                        .style("font-size", that.label.size)
                        .attr("fill", that.label.color)
                        .style("font-family", that.label.family);

                    cv_text.exit().remove();

                return this;
            },
            clubData: function () {
                if(PykCharts.boolean(that.clubData.enable)) {
                    that.displayData = [];
                    that.maximum_weight = _.map(that.data,function(num){ return num.weight; });
                    that.maximum_weight.sort(function(a,b){ return b-a; });
                    that.checkDuplicate = [];
                    var others_Slice = {"name":that.clubData.text,"color":that.clubData.color,"tooltip":that.clubData.tooltipText,"highlight":false};
                    var index;
                    var i;
                    that.getIndexByName = function(name) {
                        for(i=0;i<that.data.length;i++)
                        {
                            if(that.data[i].name == name) {
                                return i;
                            }
                        }
                    };

                    var reject = function (index) {
                        var result = _.reject(that.maximum_weight,function(num)
                            {
                                return num == that.data[index].weight;
                            });
                        return result;
                    } ;
                    var k = 0;

                    if(that.clubData.alwaysIncludeDataPoints.length!== 0) {
                        for (var l=0;l<that.clubData.alwaysIncludeDataPoints.length;l++)
                        {

                            index = that.getIndexByName(that.clubData.alwaysIncludeDataPoints[l]);
                            if(index!= undefined) {
                                that.displayData.push(that.data[index]);
                                that.maximum_weight = reject (index);
                            }
                        }
                    }
                    that.getIndexByWeight = function (weight) {
                        for(var i=0;i<that.data.length;i++)
                        {

                            if(that.data[i].weight == weight) {
                                if((_.contains(that.checkDuplicate, i))===false) {
                                   that.checkDuplicate.push(i);
                                    return i;
                                }
                                else {
                                    continue;
                                }
                            }
                        }
                    };

                    var count = that.clubData.maximumNodes-that.displayData.length;


                    var sumOthers = d3.sum(that.maximum_weight,function (d,i) {
                            if(i>=count-1)
                                return d;
                        });

                    others_Slice.weight = sumOthers;
                    if(count>0)
                    {
                        that.displayData.push(others_Slice);
                        for (i=0;i<count-1;i++) {
                            index = that.getIndexByWeight(that.maximum_weight[i]);
                            that.displayData.push(that.data[index]);
                        }
                    }
                }
                else {
                    that.displayData = that.data;
                }
                return that.displayData;
            },
            ticks : function () {
                if(PykCharts.boolean(that.overflowTicks)) {
                    that.svgContainer.style("overflow","visible");
                }
                // if(PykCharts.boolean(that.enableTicks)) {
                    var line = that.group.selectAll("line")
                        .data(that.pie(that.chartData));

                    line.enter()
                        .append("line")
                        .attr("class", "ticks");

                    line.attr("x1", function (d) {
                            return (that.radius) * (1)* Math.cos((d.startAngle + d.endAngle)/2);
                        })
                        .attr("y1", function (d) {
                            return (that.radius) * (1) *Math.sin((d.endAngle + d.startAngle )/2);
                        })
                        .attr("x2", function (d) {
                            return (that.radius) * (1)* Math.cos((d.startAngle + d.endAngle)/2);
                        })
                        .attr("y2", function (d) {
                            return (that.radius) * (1) *Math.sin((d.endAngle + d.startAngle )/2);
                        })
                        .transition()
                        .delay(function(d, i) {
                            if(PykCharts.boolean(that.transition.duration)) {
                                return ((i) * that.transition.duration)/that.chartData.length;
                            } else return 0;
                        })
                        .duration(that.transitions.duration()/that.chartData.length)
                        .attr("x2", function (d, i) {
                            return (that.radius/1+12)* (1) * Math.cos((d.startAngle + d.endAngle)/2);
                        })
                        .attr("y2", function (d, i) {
                            return (that.radius/1+12)* ( 1) * Math.sin((d.endAngle + d.startAngle)/2);
                        })
                        .attr("transform","rotate(-90)")
                        .attr("stroke-width", that.ticks.strokeWidth)
                        .attr("stroke",that.ticks.color);
                    line.exit().remove();

                    var ticks_label = that.group.selectAll(".ticks_label")
                                    .data(that.pie(that.chartData));

                    ticks_label.attr("class","ticks_label");

                    ticks_label.enter()
                        .append("text")
                        .attr("x",0)
                        .attr("y",0);

                    var x,y;
                    ticks_label.attr("transform",function (d) {
                        if (d.endAngle - d.startAngle < 0.2) {
                             x = (that.radius +30 ) * (1) * Math.cos((d.startAngle + d.endAngle - Math.PI)/2);
                             y = (that.radius/1+20) * (1) * Math.sin((d.startAngle + d.endAngle -  Math.PI)/2);
                        } else {
                             x = (that.radius +22 ) * (1) * Math.cos((d.startAngle + d.endAngle - Math.PI)/2);
                             y = (that.radius/1+24) * (1) * Math.sin((d.startAngle + d.endAngle -  Math.PI)/2);
                        }
                        return "translate(" + x + "," + y + ")";});

                    ticks_label.text("")
                        .transition()
                        .delay(function(d, i) {
                            if(PykCharts.boolean(that.transition.duration)) {
                                return ((i+1) * that.transition.duration)/that.chartData.length;
                            } else return 0;
                        })
                        .text(function (d) { return d.data.name; })
                        .attr("text-anchor",function(d) {
                                var rads = ((d.endAngle - d.startAngle) / 2) + d.startAngle;
                                if (rads>0 && rads<1.5) {
                                    return "start";
                                } else if (rads>=1.5 && rads<3.5) {
                                    return "middle";
                                } else if (rads>=3.5 && rads<6) {
                                    return "end";
                                } else if (rads>=6) {
                                    return "middle";
                                } else if(rads<0) {
                                    return "middle";
                                }
                            })
                        .attr("dy",5)
                        .attr("pointer-events","none")
                        .style("fill",that.ticks.color)
                        .style("font-size",that.ticks.size)
                        .style("font-family", that.ticks.family);

                    ticks_label.exit().remove();
                // }
                return this;
            },
            centerLabel: function () {

                if(PykCharts.boolean(that.showTotalAtTheCenter) && (type == "donut" || type == "election donut")) {

                    // var displaySum = that.group.selectAll(".total")
                    //             .data(["sum"]);

                    // displaySum.enter()
                    //             .append("text");

                    // displaySum.attr("class","total")
                    //     .text("")
                    //     .transition()
                    //     .delay(function(d) {
                    //        return that.transitions.duration();
                    //     })
                    //     .text("Total")
                    //     .attr('font-size',"0.5em")
                    //     .attr("pointer-events","none")
                    //     .attr("text-anchor","middle")
                    //     .attr("y",function () {
                    //         return (type == "donut") ? (-0.1*that.innerRadius) : (-0.5*that.innerRadius);
                    //     })
                    //     .attr("font-size",function () {
                    //         return (type == "donut") ? 0.1*that.innerRadius : 0.1*that.innerRadius;
                    //     })
                    //     .style("font-family","'Helvetica Neue',Helvetica,Arial,sans-serif")
                    //     .attr("fill","gray");

                    // displaySum.exit().remove();


                    var label = that.group.selectAll(options.selector +" "+".centerLabel")
                                    .data([that.sum]);

                    label.enter()
                        .append("text");

                    label.attr("class","centerLabel")
                        .text("")
                        .transition()
                        .delay( function(d) {
                            if(PykCharts.boolean(that.transition.duration)) {
                                return that.transition.duration;
                            }
                        })
                        label.text( function(d) {
                            return that.k.appendUnits(that.sum);
                        })
                        .attr("pointer-events","none")
                        .attr("text-anchor","middle")
                        .attr("y",function () {
                            return (type == "donut") ? (0.2*that.innerRadius) : (-0.25*that.innerRadius);
                        })
                        .attr("font-size",function () {
                            return (type == "donut") ? 0.4*that.innerRadius : 0.2*that.innerRadius;
                        })
                        .style("font-family","'Helvetica Neue',Helvetica,Arial,sans-serif")
                        .attr("fill","#484848");

                    label.exit().remove();
                }
                return this;
            },
            set_start_end_angle: function () {
                that.startAngle, that.endAngle;
                if(type == "pie" || type == "donut") {
                    that.startAngle = (0 * (Math.PI/180));
                    that.endAngle = (360 * (Math.PI/180));
                } else if(type == "election pie" || type == "election donut") {
                    that.startAngle = (-90 * (Math.PI/180));
                    that.endAngle = (90 * (Math.PI/180));
                }
                return this;
            }
        };
        return optional;
    };
};
