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
            that.data = data.groupBy("oned");
            $(options.selector+" #chart-loader").remove();
            that.clubData_enable = that.data.length>that.clubData_maximumNodes ? that.clubData_enable : "no";
            that.render();
        });
        // that.clubData.enable = that.data.length>that.clubData.maximumNodes ? that.clubData.enable : "no";
    };
    //----------------------------------------------------------------------------------------
    //2. Render function to create the chart
    //----------------------------------------------------------------------------------------
    this.refresh = function () {
        d3.json (options.data, function (e,data) {
            that.data = data.groupBy("oned");
            that.optionalFeatures()
                    .clubData()
                    .createChart()
                    .label()
                    .ticks();
            that.k.lastUpdatedAt("liveData");
        });
    };

    this.render = function () {
        var that = this;
        that.fillChart = new PykCharts.oneD.fillChart(that);
        that.onHoverEffect = new PykCharts.oneD.mouseEvent(options);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.border = new PykCharts.Configuration.border(that);
        if(that.mode === "default") {
            that.k.title()
                    .subtitle();
                // [that.fullscreen]().fullScreen(that);
        }
        if(that.mode === "infographics") {
            that.new_data = that.data;
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
                .createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();
        }
    };
    this.optionalFeatures = function () {
        var optional = {
            createChart: function () {
                var arr = that.new_data.map(function (d) {
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
                that.new_data.forEach(function (d, i) {
                    this[i].percentValue= d.weight * 100 / sum;
                }, that.new_data);
                that.new_data.sort(function (a,b) { return b.weight - a.weight; })
                // that.map1 = _.map(that.new_data,function (d,i) {
                //     return d.percentValue;
                // });
                that.chart_data = that.group.selectAll('.per-rect')
                    .data(that.new_data)

                that.chart_data.enter()
                    .append('rect')
                    .attr("class","per-rect")

                that.chart_data.attr('x', (that.width/3))
                    .attr('y', function (d, i) {
                        if (i === 0) {
                            return 0;
                        } else {
                            var sum = 0,
                                subset = that.new_data.slice(0,i);

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
                    .attr("stroke-dasharray", that.border.style())
                    .on("mouseover", function (d,i) {
                        d.tooltip=d.tooltip||"<table class='PykCharts'><tr><th colspan='2' class='tooltip-heading'>"+d.name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.weight)+"<td class='tooltip-right-content'>(&nbsp;"+d.percentValue.toFixed(2)+"%&nbsp)</tr></table>"
                        that.onHoverEffect.highlight(".per-rect",this);
                        that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.toolTextShow(d.tooltip);
                    })
                    .on("mouseout", function (d) {
                        that.onHoverEffect.highlightHide(".per-rect");
                        that.mouseEvent.tooltipHide(d);
                    })
                    .on("mousemove", function (d,i) {
                        that.mouseEvent.tooltipPosition(d);
                    })
                    // .transition()
                    // .duration(that.transitions.duration())
                    .attr('height', function (d) {
                        return d.percentValue * that.height / 100;
                    });
                that.chart_data.exit()
                    .remove();

                return this;
            },
            svgContainer :function () {
                $(options.selector).css("background-color",that.bg);

                that.svgContainer = d3.select(options.selector)
                    .append('svg')
                    .attr("width",that.width)
                    .attr("height",that.height)
                    .attr("id","svgcontainer")
                    .attr("class","svgcontainer");

                    that.group = that.svgContainer.append("g")
                        .attr("id","funnel");

                return this;
            },
            label : function () {
                    that.chart_text = that.group.selectAll(".per-text")
                        .data(that.new_data);
                    var sum = 0;
                    that.chart_text.enter()
                        .append("text")
                        .attr("class","per-text");

                    that.chart_text.attr("class","per-text")
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
                    that.chart_text.text("")
                    //     .transition()
                    //     .delay(that.transitions.duration())
                    that.chart_text.text(function (d) { return that.k.appendUnits(d.weight); })
                        .attr("text-anchor","middle")
                        .attr("pointer-events","none")
                        .style("font-weight", that.label_weight)
                        .style("font-size", that.label_size)
                        .attr("fill", that.label_color)
                        .style("font-family", that.label_family)
                        .text(function (d) {
                            if(this.getBBox().width < (that.width/4) && this.getBBox().height < (d.percentValue * that.height / 100)) {
                                return that.k.appendUnits(d.weight);
                            }else {
                                return "";
                            }
                        });
                    that.chart_text.exit()
                        .remove();
                return this;
            },
            ticks : function () {
                if(PykCharts.boolean(that.overflowTicks)) {
                    that.svgContainer.style("overflow","visible");
                }
                    var sum = 0,sum1=0;
                    
                    var x,y,w = [];
                    sum = 0;
                    var tick_label = that.group.selectAll(".ticks_label")
                                        .data(that.new_data);

                    tick_label.enter()
                        .append("text")
                        .attr("class", "ticks_label")

                    tick_label.attr("class", "ticks_label")
                        .attr("transform",function (d) {
                            sum = sum + d.percentValue
                            x = that.width/3+(that.width/4) + 10;
                            y = (((sum - d.percentValue) * that.height/100)+(sum * that.height / 100))/2 + 5;

                            return "translate(" + x + "," + y + ")";
                        });

                    tick_label.text(function (d) {
                            return d.name;
                        })
                        // .transition()
                        // .delay(that.transitions.duration())
                        .text(function (d,i) {
                            w[i] = this.getBBox().height;
                            if (this.getBBox().height < (d.percentValue * that.height / 100)) {
                                return d.name;
                            }
                            else {
                                return "";
                            }
                        })
                        .attr("font-size", that.ticks_size)
                        .attr("text-anchor","start")
                        .attr("fill", that.ticks_color)
                        .attr("font-family", that.ticks_family)
                        .attr("pointer-events","none");

                    tick_label.exit().remove();
                    sum = 0;
                    var tick_line = that.group.selectAll(".per-ticks")
                        .data(that.new_data);

                    tick_line.enter()
                        .append("line")
                        .attr("class", "per-ticks");

                    tick_line
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
                        .attr("stroke-width", that.ticks_strokeWidth)
                        .attr("stroke", that.ticks_color)
                        // .transition()
                        // .duration(that.transitions.duration())
                        .attr("x2", function (d, i) {
                            if((d.percentValue * that.height / 100) > w[i]) {
                                return that.width/3 + (that.width/4) + 5;
                            } else {
                                return that.width/3 + (that.width/4) ;
                            }
                        });

                    tick_line.exit().remove();

                return this;
            },
            clubData : function () {

                if(PykCharts.boolean(that.clubData_enable)) {
                    var clubdata_content = [];
                    if(that.clubData_alwaysIncludeDataPoints.length!== 0){
                        var l = that.clubData_alwaysIncludeDataPoints.length;
                        for(i=0; i < l; i++){
                            clubdata_content[i] = that.clubData_alwaysIncludeDataPoints[i];
                        }
                    }
                    var new_data1 = [];
                    for(i=0;i<clubdata_content.length;i++){
                        for(j=0;j<that.data.length;j++){
                            if(clubdata_content[i].toUpperCase() === that.data[j].name.toUpperCase()){
                                new_data1.push(that.data[j]);
                            }
                        }
                    }
                    that.data.sort(function (a,b) { return b.weight - a.weight; });
                    var k = 0;

                    while(new_data1.length<that.clubData_maximumNodes-1){
                        for(i=0;i<clubdata_content.length;i++){
                            if(that.data[k].name.toUpperCase() === clubdata_content[i].toUpperCase()){
                                k++;
                            }
                        }
                        new_data1.push(that.data[k]);
                        k++;
                    }
                    var sum_others = 0;
                    for(j=k; j < that.data.length; j++){
                        for(i=0; i<new_data1.length && j<that.data.length; i++){
                            if(that.data[j].name.toUpperCase() === new_data1[i].name.toUpperCase()){
                                sum_others +=0;
                                j++;
                                i = -1;
                            }
                        }
                        if(j < that.data.length){
                            sum_others += that.data[j].weight;
                        }
                    }
                    var sortfunc = function (a,b) { return b.weight - a.weight; };

                    while(new_data1.length > that.clubData_maximumNodes){
                        new_data1.sort(sortfunc);
                        var a=new_data1.pop();
                    }
                    var others_Slice = { "name":that.clubData_text, "weight": sum_others, "color": that.clubData_color, "tooltip": that.clubData_tooltip };

                    if(new_data1.length < that.clubData_maximumNodes){
                        new_data1.push(others_Slice);
                    }
                    that.new_data = new_data1;
                }
                else {
                    that.data.sort(function (a,b) { return b.weight - a.weight; });
                    that.new_data = that.data;
                }
                return this;
            }
        };
        return optional;
    };
};
