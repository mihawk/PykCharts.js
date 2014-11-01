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

        that.height = options.chart_height ? options.chart_height : that.width;
        that.percent_column_rect_width = options.percent_column_rect_width ? options.percent_column_rect_width : theme.oneDimensionalCharts.percent_column_rect_width;

        try {
            if(!_.isNumber(that.height)) {
                that.height = that.width;
                throw "chart_height"
            }
        } 
        catch (err) {
            that.k.warningHandling(err,"3");
        }

        try {
            if(!_.isNumber(that.percent_column_rect_width)) {
                that.percent_column_rect_width = theme.oneDimensionalCharts.percent_column_rect_width;
                throw "percent_column_rect_width"
            }
        } 
        catch (err) {
            that.k.warningHandling(err,"3");
        }
        if(that.stop) {
            return;
        }
        // 1.2 Read Json File Get all the data and pass to render

        if(that.percent_column_rect_width > 100) {
            that.percent_column_rect_width = 100;
        }

        that.percent_column_rect_width = that.k.__proto__._radiusCalculation(that.percent_column_rect_width,"percentageColumn") * 2;

        if(that.mode === "default") {
           that.k.loading();
        }
        d3.json(options.data, function (e, data) {
            that.data = data.groupBy("oned");
            that.compare_data = data.groupBy("oned");
            $(options.selector+" #chart-loader").remove();
            that.clubdata_enable = that.data.length>that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
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
            that.refresh_data = data.groupBy("oned");
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.optionalFeatures()
                    .clubData()
                    .createChart()
                    .label()
                    .ticks();
        });
    };

    this.render = function () {
        var that = this;

        that.fillChart = new PykCharts.Configuration.fillChart(that);
        that.onHoverEffect = new PykCharts.oneD.mouseEvent(options);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.border = new PykCharts.Configuration.border(that);

        if(that.mode === "default") {
            that.k.title()
                    .backgroundColor(that)
                    .export(that,"#svgcontainer","percentageColumn")
                    .emptyDiv()
                    .subtitle();
                // [that.fullscreen]().fullScreen(that);
        }
        if(that.mode === "infographics") {
            that.k.backgroundColor(that)
                .export(that,"#svgcontainer","percentageColumn")
                    .emptyDiv();

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
            .label()
            .ticks();
        if(that.mode === "default") {
            // that.optionalFeatures().ticks()
            that.k.liveData(that)
                .createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();
        }

        $(document).ready(function () { return that.k.resize(that.svgContainer); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer); });
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

                that.chart_data.attr('x', 0)
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
                    .attr('width', that.percent_column_rect_width)
                    .attr('height', 0)
                    .attr("fill",function (d) {
                        return that.fillChart.selectColor(d);
                    })
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-dasharray", that.border.style())
                    .on("mouseover", function (d,i) {
                        if(that.mode === "default") {
                            d.tooltip=d.tooltip||"<table class='PykCharts'><tr><th colspan='2' class='tooltip-heading'>"+d.name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.weight)+"<td class='tooltip-right-content'>("+d.percentValue.toFixed(1)+"%)</tr></table>"
                            that.onHoverEffect.highlight(options.selector+" "+".per-rect",this);
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(d.tooltip);
                        }
                    })
                    .on("mouseout", function (d) {
                        if(that.mode === "default") {
                            that.onHoverEffect.highlightHide(options.selector+" "+".per-rect");
                            that.mouseEvent.tooltipHide(d);
                        }
                    })
                    .on("mousemove", function (d,i) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr('height', function (d) {
                        return d.percentValue * that.height / 100;
                    });
                that.chart_data.exit()
                    .remove();

                return this;
            },
            svgContainer :function () {
                // $(options.selector).css("background-color",that.background_color);

                that.svgContainer = d3.select(options.selector)
                    .append('svg')
                    .attr("width",that.width)
                    .attr("height",that.height)
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height)
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
                        .attr("x", (that.percent_column_rect_width/2 ))
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
                        .attr("fill", that.label_color)
                        .style("font-size", that.label_size + "px")
                        .attr("text-anchor","middle")
                        .attr("pointer-events","none")
                        .style("font-weight", that.label_weight)
                        .style("font-family", that.label_family);
                        // .transition()
                        // .delay(that.transitions.duration())

                        setTimeout(function(){
                            that.chart_text.text(function (d) {
                                return d.percentValue.toFixed(1)+"%";
                                // return that.k.appendUnits(d.weight);
                            })
                                .text(function (d) {
                                    if(this.getBBox().width < (that.width/4) && this.getBBox().height < (d.percentValue * that.height / 100)) {
                                        return d.percentValue.toFixed(1)+"%";
                                        // return that.k.appendUnits(d.weight);
                                    }else {
                                        return "";
                                    }
                                });
                        }, that.transitions.duration());


                    that.chart_text.exit()
                        .remove();
                return this;
            },
            ticks : function () {
                if(PykCharts.boolean(that.pointer_overflow_enable)) {
                    that.svgContainer.style("overflow","visible");
                }
                    var sum = 0, sum1 = 0;

                    var x, y, w = [];
                    sum = 0;

                    var tick_line = that.group.selectAll(".per-ticks")
                        .data(that.new_data);

                    tick_line.enter()
                        .append("line")
                        .attr("class", "per-ticks");

                    var tick_label = that.group.selectAll(".ticks_label")
                                        .data(that.new_data);

                    tick_label.enter()
                        .append("text")
                        .attr("class", "ticks_label")

                    tick_label.attr("class", "ticks_label")
                        .attr("transform",function (d) {
                            sum = sum + d.percentValue
                            x = (that.percent_column_rect_width) + 10;
                            y = (((sum - d.percentValue) * that.height/100)+(sum * that.height / 100))/2 + 5;

                            return "translate(" + x + "," + y + ")";
                        });

                    tick_label.text(function (d) {
                            return "";
                        })
                        .attr("font-size", that.pointer_size)
                        .attr("text-anchor","start")
                        .attr("fill", that.pointer_color)
                        .attr("font-family", that.pointer_family)
                        .attr("font-weight",that.pointer_weight)
                        .attr("pointer-events","none");

                        setTimeout(function() {
                            tick_label.text(function (d) {
                                return d.name;
                            })
                            .text(function (d,i) {
                                w[i] = this.getBBox().height;
                                if (this.getBBox().height < (d.percentValue * that.height / 100)) {
                                    return d.name;
                                }
                                else {
                                    return "";
                                }
                            });

                            sum = 0;
                            tick_line
                                .attr("x1", function (d,i) {
                                    return that.percent_column_rect_width;
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
                                     return (that.percent_column_rect_width);
                                })
                                .attr("y2", function (d,i) {
                                    sum1 = sum1 + d.percentValue;
                                    if (i===0){
                                        return (0 + (sum1 * that.height / 100))/2;
                                    }else {
                                        return (((sum1 - d.percentValue) * that.height/100)+(sum1 * that.height / 100))/2;
                                    }
                                })
                                .attr("stroke-width", that.pointer_thickness + "px")
                                .attr("stroke", that.pointer_color)
                                // .transition()
                                // .duration(that.transitions.duration())
                                .attr("x2", function (d, i) {
                                    if((d.percentValue * that.height / 100) > w[i]) {
                                        return (that.percent_column_rect_width) + 5;
                                    } else {
                                        return (that.percent_column_rect_width) ;
                                    }
                                });
                        },that.transitions.duration());

                    tick_label.exit().remove();


                    tick_line.exit().remove();

                return this;
            },
            clubData : function () {

                if(PykCharts.boolean(that.clubdata_enable)) {
                    var clubdata_content = [];
                    if(that.clubdata_always_include_data_points.length!== 0){
                        var l = that.clubdata_always_include_data_points.length;
                        for(i=0; i < l; i++){
                            clubdata_content[i] = that.clubdata_always_include_data_points[i];
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

                    while(new_data1.length<that.clubdata_maximum_nodes-1){
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

                    while(new_data1.length > that.clubdata_maximum_nodes){
                        new_data1.sort(sortfunc);
                        var a=new_data1.pop();
                    }
                    var others_Slice = { "name":that.clubdata_text, "weight": sum_others, /*"color": that.clubData_color,*/ "tooltip": that.clubdata_tooltip };

                    if(new_data1.length < that.clubdata_maximum_nodes){
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
