PykCharts.oneD.percentageColumn = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    //----------------------------------------------------------------------------------------
    //1. This is the method that executes the various JS functions in the proper sequence to generate the chart
    //----------------------------------------------------------------------------------------
    this.execute = function () {
        //1.3 Assign Global variable var that to access function and variable throughout
        var that = this;

        that = new PykCharts.oneD.processInputs(that, options, "percentageColumn");
        // 1.2 Read Json File Get all the data and pass to render
        if(that.mode === "default") {
           that.k.loading();
        }
        d3.json(options.data, function (e, data) {
            that.data = data.groupBy();
            $(options.selector+" #chart-loader").remove();
            that.clubData.enable = that.data.length>that.clubData.maximumNodes ? that.clubData.enable : "no";
            that.render();
        });
        // that.clubData.enable = that.data.length>that.clubData.maximumNodes ? that.clubData.enable : "no";
    };
    //----------------------------------------------------------------------------------------
    //2. Render function to create the chart
    //----------------------------------------------------------------------------------------
    this.refresh = function () {
        d3.json (options.data, function (e,data) {
            that.data = data;
            that.optionalFeatures()
                    .clubData()
                    .createChart()
                    .label()
                    .ticks()
        });
    };

    this.render = function () {
        var that = this;
        that.fillChart = new PykCharts.oneD.fillChart(that);
        that.mouseEvent1 = new PykCharts.oneD.mouseEvent(options);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.border = new PykCharts.Configuration.border(that);
        if(that.mode === "default") {
            that.k.title()
                    .subtitle();
                // [that.fullscreen]().fullScreen(that);
        }
        if(that.mode === "infographics") {
            that.newData1 = that.data;
        }

        that.k.tooltip();

        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        if(that.mode === "default") {
            percent_column = that.optionalFeatures()
                            .clubData();
        }
        that.optionalFeatures().svgContainer()
            .createChart()
            .label();
        if(that.mode === "default") {
            that.optionalFeatures().ticks()
            that.k.liveData(that)
                .credits()
                .dataSource();
        }
    };
    this.optionalFeatures = function () {
        var optional = {
            createChart: function () {
                var arr = that.newData1.map(function (d) {
                    return d.weight;
                });
                arr.sum = function () {
                    var sum = 0;
                    for(var i = 0 ; i < this.length; ++i) {
                        sum += this[i];
                    }
                    return sum;
                };

                var sum = arr.sum();
                that.newData1.forEach(function (d, i) {
                    this[i].percentValue= d.weight * 100 / sum;
                }, that.newData1);
                that.newData1.sort(function (a,b) { return b.weight - a.weight; })
                that.map1 = _.map(that.newData1,function (d,i) {
                    return d.percentValue;
                });
                that.perColumn = that.group.selectAll('.per-rect')
                    .data(that.newData1)

                that.perColumn.enter()
                    .append('rect')
                    .attr("class","per-rect")

                that.perColumn.attr('x', (that.width/3))
                    .attr('y', function (d, i) {
                        if (i === 0) {
                            return 0;
                        } else {
                            var sum = 0,
                                subset = that.newData1.slice(0,i);

                            subset.forEach(function(d, i){
                                sum += this[i].percentValue;
                            },subset);

                            return sum * that.height / 100;
                        }
                    })
                    .attr('width', that.width/4)
                    .attr('height', 0)
                    .attr("fill",function (d) {
                        return that.fillChart.chartColor(d);
                    })
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .on("mouseover", function (d,i) {
                        d.tooltip=d.tooltip||"<table class='PykCharts'><tr><th colspan='2' class='tooltip-heading'>"+d.name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.weight)+"<td class='tooltip-right-content'>(&nbsp;"+d.percentValue.toFixed(2)+"%&nbsp)</tr></table>"
                        that.mouseEvent1.highlight(".per-rect",this);
                        that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.toolTextShow(d.tooltip);
                    })
                    .on("mouseout", function (d) {
                        that.mouseEvent1.highlightHide(".per-rect");
                        that.mouseEvent.tooltipHide(d);
                    })
                    .on("mousemove", function (d,i) {
                        that.mouseEvent.tooltipPosition(d);
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr('height', function (d) {
                        return d.percentValue * that.height / 100;
                    });
                that.perColumn.exit()
                    .remove();

                return this;
            },
            svgContainer :function () {
                $(options.selector).css("background-color",that.bg);

                that.svg = d3.select(options.selector)
                    .append('svg')
                    .attr("width",that.width)
                    .attr("height",that.height)
                    .attr("id","svgcontainer")
                    .attr("class","svgcontainer");

                    that.group = that.svg.append("g")
                        .attr("id","funnel");

                return this;
            },
            label : function () {
                    that.per_text = that.group.selectAll(".per-text")
                        .data(that.newData1);
                    var sum = 0;
                    that.per_text.enter()
                        .append("text")
                        .attr("class","per-text");

                    that.per_text.attr("class","per-text")
                        .attr("x", (that.width/3 + that.width/8 ))
                        .attr("y",function (d,i) {
                                sum = sum + d.percentValue;
                                if (i===0) {
                                    return (0 + (sum * that.height / 100))/2+5;
                                } else {
                                    return (((sum - d.percentValue) * that.height/100)+(sum * that.height / 100))/2+5;
                                }
                            });
                    sum = 0;
                    that.per_text.text("")
                        .transition()
                        .delay(that.transitions.duration())
                    that.per_text.text(function (d) { return that.k.appendUnits(d.weight); })
                        .attr("text-anchor","middle")
                        .attr("pointer-events","none")
                        .style("font-weight", that.label.weight)
                        .style("font-size", that.label.size)
                        .attr("fill", that.label.color)
                        .style("font-family", that.label.family)
                        .text(function (d) {
                            if(this.getBBox().width < (that.width/4 ) && this.getBBox().height < (d.percentValue * that.height / 100)) {
                                return that.k.appendUnits(d.weight);
                            }else {
                                return "";
                            }
                        });
                    that.per_text.exit()
                        .remove();
                return this;
            },
            ticks : function () {
                if(PykCharts.boolean(that.overflowTicks)) {
                    that.svg.style("overflow","visible");
                }
                    var sum = 0,sum1=0;
                    var line = that.group.selectAll(".per-ticks")
                        .data(that.newData1);

                    line.enter()
                        .append("line")
                        .attr("class", "per-ticks");

                    line
                        .attr("x1", function (d,i) {
                            return that.width/3 + that.width/4;
                        })
                        .attr("y1", function (d,i) {
                            sum = sum + d.percentValue;
                            if (i===0){
                                return (0 + (sum * that.height / 100))/2;
                            }else {
                                return (((sum - d.percentValue) * that.height/100)+(sum * that.height / 100))/2;
                            }
                        })
                        .attr("x2", function (d, i) {
                             return that.width/3 + (that.width/4);
                        })
                        .attr("y2", function (d,i) {
                            sum1 = sum1 + d.percentValue;
                            if (i===0){
                                return (0 + (sum1 * that.height / 100))/2;
                            }else {
                                return (((sum1 - d.percentValue) * that.height/100)+(sum1 * that.height / 100))/2;
                            }
                        })
                        .attr("stroke-width", that.ticks.strokeWidth)
                        .attr("stroke", that.ticks.color)
                        .transition()
                        .duration(that.transitions.duration())
                        .attr("x2", function (d, i) {
                            if((d.percentValue * that.height / 100) > 15) {
                                return that.width/3 + (that.width/4) + 5;
                            } else {
                                return that.width/3 + (that.width/4) ;
                            }
                        });

                    line.exit().remove();
                    var x,y;
                    sum = 0;
                    var ticks_label = that.group.selectAll(".ticks_label")
                                        .data(that.newData1);

                    ticks_label.enter()
                        .append("text")
                        .attr("class", "ticks_label")

                    ticks_label.attr("class", "ticks_label")
                        .attr("transform",function (d) {
                            sum = sum + d.percentValue
                            x = that.width/3+(that.width/4) + 10;
                            y = (((sum - d.percentValue) * that.height/100)+(sum * that.height / 100))/2 + 5;

                            return "translate(" + x + "," + y + ")";
                        });

                    ticks_label.text("")
                        .transition()
                        .delay(that.transitions.duration())
                        .text(function (d,i) {
                            if (this.getBBox().height < (d.percentValue * that.height / 100)-15) {
                                return d.name;
                            }
                            else {
                                return "";
                            }
                        })
                        .attr("font-size", that.ticks.size)
                        .attr("text-anchor","start")
                        .attr("fill", that.ticks.color)
                        .attr("font-family", that.ticks.family)
                        .attr("pointer-events","none");

                    ticks_label.exit().remove();

                return this;
            },
            clubData : function () {
                if(PykCharts.boolean(that.clubData.enable)) {
                    var clubdataContent = [];
                    if(that.clubData.alwaysIncludeDataPoints.length!== 0){
                        var l = that.clubData.alwaysIncludeDataPoints.length;
                        for(i=0; i < l; i++){
                            clubdataContent[i] = that.clubData.alwaysIncludeDataPoints[i];
                        }
                    }
                    that.newData = [];
                    for(i=0;i<clubdataContent.length;i++){
                        for(j=0;j<that.data.length;j++){
                            if(clubdataContent[i].toUpperCase() === that.data[j].name.toUpperCase()){
                                that.newData.push(that.data[j]);
                            }
                        }
                    }
                    that.data.sort(function (a,b) { return b.weight - a.weight; });
                    var k = 0;
                    while(that.newData.length<that.clubData.maximumNodes-1){
                        for(i=0;i<clubdataContent.length;i++){
                            if(that.data[k].name.toUpperCase() === clubdataContent[i].toUpperCase()){
                                k++;
                            }
                        }
                        that.newData.push(that.data[k]);
                        k++;
                    }
                    var weight = 0;
                    for(j=k; j < that.data.length; j++){
                        for(i=0; i<that.newData.length && j<that.data.length; i++){
                            if(that.data[j].name.toUpperCase() === that.newData[i].name.toUpperCase()){
                                weight +=0;
                                j++;
                                i = -1;
                            }
                        }
                        if(j < that.data.length){
                            weight += that.data[j].weight;
                        }
                    }
                    var sortfunc = function (a,b) { return b.weight - a.weight; };
                    while(that.newData.length > that.clubData.maximumNodes){
                        that.newData.sort(sortfunc);
                        var a=that.newData.pop();
                    }
                    var otherSpan = { "name":that.clubData.text, "weight": weight, "color": that.clubData.color, "tooltip": that.clubData.tooltip };

                    if(that.newData.length < that.clubData.maximumNodes){
                        that.newData.push(otherSpan);
                    }
                    that.newData1 = that.newData;
                }
                else {
                    that.data.sort(function (a,b) { return b.weight - a.weight; });
                    that.newData1 = that.data;
                }
                return this;
            }
        };
        return optional;
    };
};
