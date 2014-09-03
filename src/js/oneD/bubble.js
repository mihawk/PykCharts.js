PykCharts.oneD.bubble = function (options) {
    var that = this;

    this.execute = function () {
        that = PykCharts.oneD.processInputs(that, options);

        if(that.mode === "default") {
           that.k.loading();
        }
        d3.json(options.data, function (e,data) {
            that.data = data.groupBy("oned");
            $(options.selector+" #chart-loader").remove();
            that.clubData.enable = that.data.length>that.clubData.maximumNodes ? that.clubData.enable : "no";
            that.render();

        });
    };

    this.refresh = function () {

        d3.json (options.data, function (e,data) {
            that.data = data;
            that.optionalFeatures()
                .createBubble()
                .label();
        });
    };

    this.render = function () {
        that.fillChart = new PykCharts.oneD.fillChart(that);
        that.mouseEvent1 = new PykCharts.oneD.mouseEvent(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        if (that.mode ==="default") {
            that.k.title();
            that.k.subtitle();
            that.b = that.optionalFeatures().clubData();
            var bubble = that.optionalFeatures().svgContainer()
                .createBubble()
                .label();

            that.k.credits()
                .dataSource()
                .liveData(that)
                .tooltip();

        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
       }
       else if (that.mode ==="infographics") {
            that.b = {"children" : that.data};
            that.optionalFeatures().svgContainer()
                .createBubble()
                .label();

            that.k.tooltip();
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
       }
    };

    this.optionalFeatures = function () {

        var optional = {
            svgContainer: function () {
                $(that.selector).css("background-color",that.bg);

                that.svgContainer = d3.select(that.selector).append("svg")
                    .attr("class","svgcontainer")
                    .attr("id","svgcontainer")
                    .attr("width",that.width)
                    .attr("height",that.height);

                that.group = that.svgContainer.append("g")
                    .attr("id","bubgrp");
                return this;
            },
            createBubble : function () {

                that.bubble = d3.layout.pack()
                    .sort(function (a,b) { return b.weight - a.weight; })
                    .size([that.width, that.height])
                    .value(function (d) { return d.weight; })
                    .padding(20);
                var total = d3.sum(that.b.children, function (d) {
                    return d.weight;
                })
                var l = that.b.children.length;
                that.max = that.b.children[l-1].weight;
                that.node = that.bubble.nodes(that.b);

                that.bub_node = that.group.selectAll(".bubble-node")
                    .data(that.node);

                that.bub_node.enter()
                    .append("g")
                    .attr("class","bubble-node")
                    .append("circle");

                that.bub_node.attr("class","bubble-node")
                    .select("circle")
                    .attr("class","bubble")
                    .attr("x",function (d) { return d.x; })
                    .attr("y",function (d) { return d.y; })
                    .attr("r",0)
                    .attr("transform",function (d) { return "translate(" + d.x + "," + d.y +")"; })
                    .attr("fill",function (d) {
                        return d.children ? that.bg : that.fillChart.chartColor(d);
                    })
                    .on("mouseover", function (d) {
                        if(!d.children) {
                            that.mouseEvent1.highlight(options.selector+" "+".bubble", this);
                            d.tooltip = d.tooltip ||"<table class='PykCharts'><tr><th colspan='2' class='tooltip-heading'>"+d.name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.weight)+"  <td class='tooltip-right-content'>(&nbsp;"+((d.weight*100)/total).toFixed(2)+"%&nbsp;)</tr></table>";
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.toolTextShow(d.tooltip);
                        }
                    })
                    .on("mouseout", function (d) {
                        that.mouseEvent.tooltipHide(d)
                        that.mouseEvent1.highlightHide(options.selector+" "+".bubble");
                    })
                    .on("mousemove", function (d) {
                        if(!d.children) {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    })
                    // .transition()
                    // .duration(that.transitions.duration())
                    .attr("r",function (d) {return d.r; });
                that.bub_node.exit().remove();

                return this;
            },
            label : function () {

                    that.bub_text = that.group.selectAll("text")
                        .data(that.node);

                    that.bub_text.enter()
                    .append("text")
                    .style("pointer-events","none");

                    that.bub_text.attr("text-anchor","middle")
                        .attr("transform",function (d) {return "translate(" + d.x + "," + (d.y + 5) +")";})
                        .text("")
                        // .transition()
                        // .delay(that.transitions.duration());

                    that.bub_text
                        .text(function (d) { return d.children ? " " :  d.name; })
                        .attr("pointer-events","none")
                        .text(function (d) {
                            if(this.getBBox().width< 2*d.r && this.getBBox().height<2*d.r) {
                                return d.children ? " " :  d.name;
                            }
                            else {
                                 return "";
                                }
                        })
                        .style("font-weight", that.label.weight)
                        .style("font-size",function (d,i) {
                            if (d.r > 24) {
                                return that.label.size;
                            } else {
                                return "10px";
                            }
                        })
                        .attr("fill", that.label.color)
                        .style("font-family", that.label.family);
                    that.bub_text.exit().remove;
                return this;
            },
            clubData : function () {
                if (PykCharts.boolean(that.clubData.enable)) {
                    var clubdata_content = [];
                    var k = 0;
                    var j, i;
                    if(that.data.length <= that.clubData.maximumNodes) {
                        that.new_data1 = { "children" : that.data };
                        return this;
                    }
                    if (that.clubData.alwaysIncludeDataPoints.length!== 0) {
                        var l = that.clubData.alwaysIncludeDataPoints.length;
                        for (i =0; i<l; i++) {
                            clubdata_content[i] = that.clubData.alwaysIncludeDataPoints[i];
                        }
                    }
                    var new_data = [];
                    for (i=0; i<clubdata_content.length; i++) {
                        for (j=0; j< that.data.length; j++) {
                            if (clubdata_content[i].toUpperCase() === that.data[j].name.toUpperCase()) {
                                new_data.push(that.data[i]);
                            }
                        }
                    }
                    that.data.sort (function (a,b) { return b.weight - a.weight;});
                    while (new_data.length < that.clubData.maximumNodes-1) {
                        for(i=0;i<clubdata_content.length;i++) {
                            if(that.data[k].name.toUpperCase() === clubdata_content[i].toUpperCase()) {
                                k++;
                            }
                        }
                        new_data.push(that.data[k]);
                        k++;
                    }
                    var weight = 0;
                    for(j=k; j<that.data.length; j++) {
                        for (i=0; i<new_data.length && i< that.data.length; i++) {
                            if(that.data[j].name.toUpperCase() === new_data[i].name.toUpperCase()) {
                                weight+=0;
                                j++;
                                i = -1;
                            }
                        }
                        if(j<that.data.length) {
                            weight += that.data[j].weight;
                        }
                    }
                    var f = function (a,b) {return b.weight- a.weight;};
                    while (new_data.length > that.clubData.maximumNodes) {
                        new_data.sort(f);
                        var a = new_data.pop();
                    }

                    var others = {"name": that.clubData.text,"weight": weight, "color": that.clubData.color,"tooltip": that.clubData.tooltipText,"highlight":false};

                    if (new_data.length < that.clubData.maximumNodes) {
                        new_data.push(others);
                    }
                    new_data.sort(function (a,b) {
                        return a.weight - b.weight;
                    })

                    that.new_data1 = {"children": new_data};
                    that.map1 = that.new_data1.children.map(function (d) { return d.weight;});
                }
                else {
                    that.data.sort(function (a,b) {
                        return a.weight - b.weight;
                    })
                    that.new_data1 = { "children" : that.data };
                }
                return that.new_data1;
            }
        };
        return optional;
    };
};
