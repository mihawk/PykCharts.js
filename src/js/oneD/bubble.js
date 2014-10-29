PykCharts.oneD.bubble = function (options) {
    var that = this;

    this.execute = function () {
        that = PykCharts.oneD.processInputs(that, options);
        that.height = options.chart_height ? options.chart_height : that.width;

        that.k.validator()
            .validatingDataType(that.height,"chart_height")    

        if(that.stop) { 
            return;
        }

        if(that.mode === "default") {
           that.k.loading();
        }

        d3.json(options.data, function (e,data) {
            console.log(options.data,"data");
            // that.data =options.data;
            // that.compare_data = options.data;
            that.data = data.groupBy("oned");
            that.compare_data = data.groupBy("oned");
            $(options.selector+" #chart-loader").remove();
            that.clubdata_enable = that.data.length>that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.render();
        });
    };

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
            that.new_data = that.optionalFeatures().clubData();
            that.optionalFeatures()
                .createChart()
                .label();
        });
    };

    this.render = function () {
        // that.fillChart = new PykCharts.oneD.fillChart(that);
        that.fillChart = new PykCharts.Configuration.fillChart(that);
        that.onHoverEffect = new PykCharts.oneD.mouseEvent(that);
        that.transitions = new PykCharts.Configuration.transition(that);
       
        if (that.mode ==="default") {
            
            that.k.title()
                .backgroundColor(that)
                .export(that,"#svgcontainer","bubble")
                .emptyDiv()
                .subtitle();

            that.new_data = that.optionalFeatures().clubData();
            that.optionalFeatures().svgContainer()
                .createChart()
                .label();

            that.k.createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource()
                .liveData(that)
                .tooltip();
        }
        else if (that.mode ==="infographics") {
            that.k.backgroundColor(that)
                .export(that,"#svgcontainer","bubble")
                .emptyDiv();

            that.new_data = {"children" : that.data};
            that.optionalFeatures().svgContainer()
                .createChart()
                .label();

            that.k.tooltip();

        }
        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        $(document).ready(function () { return that.k.resize(that.svgContainer); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer); });
    };

    this.optionalFeatures = function () {

        var optional = {
            svgContainer: function () {
                // $(that.selector).css("background-color",that.background_color);

                that.svgContainer = d3.select(that.selector).append("svg")
                    .attr("class","svgcontainer")
                    .attr("id","svgcontainer")
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height)
                    .attr("width",that.width)
                    .attr("height",that.height);

                that.group = that.svgContainer.append("g")
                    .attr("id","bubgrp");
                return this;
            },
            createChart : function () {

                that.bubble = d3.layout.pack()
                    .sort(function (a,b) { return b.weight - a.weight; })
                    .size([that.width, that.height])
                    .value(function (d) { return d.weight; })
                    .padding(20);
                that.sum = d3.sum(that.new_data.children, function (d) {
                    return d.weight;
                })
                var l = that.new_data.children.length;
                // that.max = that.new_data.children[l-1].weight;
                that.node = that.bubble.nodes(that.new_data);

                that.chart_data = that.group.selectAll(".bubble-node")
                    .data(that.node);

                that.chart_data.enter()
                    .append("g")
                    .attr("class","bubble-node")
                    .append("circle");

                that.chart_data.attr("class","bubble-node")
                    .select("circle")
                    .attr("class","bubble")
                    .attr("x",function (d) { return d.x; })
                    .attr("y",function (d) { return d.y; })
                    .attr("r",0)
                    .attr("transform",function (d) { return "translate(" + d.x + "," + d.y +")"; })
                    .attr("fill",function (d) {
                        return d.children ? that.background_color : that.fillChart.selectColor(d);
                    })
                    .on("mouseover", function (d) {
                        if(!d.children && that.mode==="default") {
                            that.onHoverEffect.highlight(options.selector+" "+".bubble", this);
                            d.tooltip = d.tooltip ||"<table><thead><th colspan='2' class='tooltip-heading'>"+d.name+"</th></thead><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.weight)+"  <td class='tooltip-right-content'>(&nbsp;"+((d.weight*100)/that.sum).toFixed(2)+"%&nbsp;)</tr></table>";
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(d.tooltip);
                        }
                    })
                    .on("mouseout", function (d) {
                        if(that.mode==="default") {
                            that.mouseEvent.tooltipHide(d)
                            that.onHoverEffect.highlightHide(options.selector+" "+".bubble");
                        }

                    })
                    .on("mousemove", function (d) {
                        if(!d.children && that.mode==="default") {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("r",function (d) {return d.r; });
                that.chart_data.exit().remove();

                return this;
            },
            label : function () {

                //     that.chart_text = that.group.selectAll("text")
                //         .data(that.node);

                //     that.chart_text.enter()
                //     .append("text")
                //     .style("pointer-events","none");

                //     that.chart_text.attr("text-anchor","middle")
                //         .attr("transform",function (d) {return "translate(" + d.x + "," + (d.y + 5) +")";})
                //         .text("")
                //         // .transition()
                //         // .delay(that.transitions.duration());

                //     setTimeout(function() {
                //         that.chart_text
                //             .text(function (d) { return d.children ? " " :  d.name; })
                //             .attr("pointer-events","none")
                //             .text(function (d) {
                //                 if(this.getBBox().width< 2*d.r && this.getBBox().height<2*d.r) {
                //                     return d.children ? " " :  d.name;
                //                 }
                //                 else {
                //                      return "";
                //                     }
                //             })
                //             .style("font-weight", that.label_weight)
                //             .style("font-size",function (d,i) {
                //                 if (d.r > 24) {
                //                     return that.label_size;
                //                 } else {
                //                     return "10px";
                //                 }
                //             })
                //             .attr("fill", that.label_color)
                //             .style("font-family", that.label_family);
                //     },that.transitions.duration());

                //     that.chart_text.exit().remove;
                // return this;
                 that.chart_text = that.group.selectAll(".name")
                        .data(that.node);
                    that.chart_text1 = that.group.selectAll(".weight")
                        .data(that.node);
                    that.chart_text.enter()
                        .append("svg:text")
                        .attr("class","name");

                    that.chart_text1.enter()
                        .append("svg:text")
                        .attr("class","weight");

                    that.chart_text.attr("class","name")
                        .attr("x", function (d) { return d.x })
                        .attr("y", function (d) { return d.y -5 });

                    that.chart_text1.attr("class","weight")
                        .attr("x", function (d) { return d.x })
                        .attr("y", function (d) { return d.y + 10; });

                    that.chart_text.attr("text-anchor","middle")
                        .style("font-weight", that.label_weight)
                        .style("font-size", that.label_size)
                        .attr("fill", that.label_color)
                        .style("font-family", that.label_family)
                        .text("")
                        // .transition()
                        // .delay(that.transitions.duration())

                  setTimeout(function() {
                        that.chart_text
                            .text(function (d) { return d.children ? " " :  d.name; })
                            .attr("pointer-events","none")
                            .text(function (d) {
                                if(this.getBBox().width< 2*d.r && this.getBBox().height<2*d.r) {
                                    return d.children ? " " :  d.name;
                                }
                                else {
                                    return "";
                                }
                            });
                    },that.transitions.duration());

                    that.chart_text1.attr("text-anchor","middle")
                        .style("font-weight", that.label_weight)
                        .style("font-size", that.label_size)
                        .attr("fill", that.label_color)
                        .style("font-family", that.label_family)
                        .text("")
                        .attr("pointer-events","none")
                        // .transition()
                        // .delay(that.transitions.duration())

                    setTimeout(function () {
                        that.chart_text1.text(function (d) { return d.children ? " " :  that.k.appendUnits(d.weight); })
                            .text(function (d) {
                                if(this.getBBox().width<2*d.r*0.55 && this.getBBox().height<2*d.r*0.55) {
                                    return d.children ? " " :  ((d.weight*100)/that.sum).toFixed(1)+"%"; /*that.k.appendUnits(d.weight);*/
                                }
                                else {
                                    return "";
                                }
                            });
                    },that.transitions.duration());

                    that.chart_text.exit()
                        .remove();
                    that.chart_text1.exit()
                        .remove();
                return this;
            },
            clubData : function () {
                var new_data1;
                if (PykCharts.boolean(that.clubdata_enable)) {
                    var clubdata_content = [];
                    var k = 0, j, i, new_data = [];
                    if(that.data.length <= that.clubdata_maximum_nodes) {
                        new_data1 = { "children" : that.data };
                        return new_data1;
                    }
                    if (that.clubdata_always_include_data_points.length!== 0) {
                        var l = that.clubdata_always_include_data_points.length;
                        for (i =0; i<l; i++) {
                            clubdata_content[i] = that.clubdata_always_include_data_points[i];
                        }
                    }
                    for (i=0; i<clubdata_content.length; i++) {
                        for (j=0; j< that.data.length; j++) {
                            if (clubdata_content[i].toUpperCase() === that.data[j].name.toUpperCase()) {
                                new_data.push(that.data[j]);
                            }
                        }
                    }

                    that.data.sort (function (a,b) { return b.weight - a.weight;});
                    while (new_data.length < that.clubdata_maximum_nodes-1) {
                        for(i=0;i<clubdata_content.length;i++) {
                            if(that.data[k].name.toUpperCase() === clubdata_content[i].toUpperCase()) {
                                k++;
                            }
                        }
                        new_data.push(that.data[k]);
                        k++;
                    }
                    var sum_others = 0;
                    for(j=k; j<that.data.length; j++) {
                        for (i=0; i<new_data.length && i< that.data.length; i++) {
                            if(that.data[j].name.toUpperCase() === new_data[i].name.toUpperCase()) {
                                sum_others+=0;
                                j++;
                                i = -1;
                            }
                        }
                        if(j<that.data.length) {
                            sum_others += that.data[j].weight;
                        }
                    }
                    var f = function (a,b) {return b.weight- a.weight;};
                    while (new_data.length > that.clubdata_maximum_nodes) {
                        new_data.sort(f);
                        var a = new_data.pop();
                    }

                    var others_Slice = {"name": that.clubdata_text,"weight": sum_others, "color": that.clubData_color,"tooltip": that.clubData_tooltipText,"highlight":false};

                    if (new_data.length < that.clubdata_maximum_nodes) {
                        new_data.push(others_Slice);

                    }
                    new_data.sort(function (a,b) {
                        return a.weight - b.weight;
                    })

                    new_data1 = {"children": new_data};
                    that.map1 = new_data1.children.map(function (d) { return d.weight;});
                }
                else {
                    // console.log(that.data.data,"what is this");
                    that.data.sort(function (a,b) {
                        return a.weight - b.weight;
                    })
                    new_data1 = { "children" : that.data };
                }
                return new_data1;
            }
        };
        return optional;
    };
};
