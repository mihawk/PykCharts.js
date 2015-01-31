PykCharts.oneD.bubble = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function (pykquery_data) {
        that = new PykCharts.validation.processInputs(that, options,'oneDimensionalCharts');
        that.chart_height = options.chart_height ? options.chart_height : that.chart_width;

        that.k.validator()
            .validatingDataType(that.chart_height,"chart_height",that.chart_width);

        if(that.mode === "default") {
            that.k.loading();
        }

        that.executeData = function (data) { 
            var validate = that.k.validator().validatingJSON(data),
                id = that.selector.substring(1,that.selector.length);

            if(that.stop || validate === false) {
                that.k.remove_loading_bar(id);
                return;
            }

            that.data = that.k.__proto__._groupBy("oned",data);
            that.compare_data = that.k.__proto__._groupBy("oned",data);
            that.k.remove_loading_bar(id);
            that.clubdata_enable = that.data.length>that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.render();
        };
        if (PykCharts['boolean'](options.interactive_enable)) {
            that.k.dataFromPykQuery(pykquery_data);
            that.k.dataSourceFormatIdentification(that.data,that,"executeData");
        } else {
            that.k.dataSourceFormatIdentification(options.data,that,"executeData");
        }   
    };

    this.refresh = function (pykquery_data) {
        that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("oned",data);
            that.clubdata_enable = that.data.length>that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.refresh_data = that.k.__proto__._groupBy("oned",data);
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data)
                , shade_array = [];
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.new_data = that.optionalFeatures().clubData();
            if(that.color_mode === "shade") {
                shade_array = that.k.shadeColorConversion(that.shade_color,that.new_data.children.length);
                that.new_data.children.forEach(function (d,i) {
                    d.color = shade_array[i];
                })
            }
            that.optionalFeatures()
                .createChart()
                .label();
        };
        if (PykCharts['boolean'](options.interactive_enable)) {
            that.k.dataFromPykQuery(pykquery_data);
            that.k.dataSourceFormatIdentification(that.data,that,"executeRefresh");
        } else {
            that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
        }   
    };

    this.render = function () {

        var id = that.selector.substring(1,that.selector.length);
        var container_id = id + "_svg"
            , shade_array = [];

        that.fillChart = new PykCharts.Configuration.fillChart(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        if (that.mode ==="default") {

            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+container_id,"bubble")
                .emptyDiv(options.selector)
                .subtitle();

            that.new_data = that.optionalFeatures().clubData();
            if(that.color_mode === "shade") {
                shade_array = that.k.shadeColorConversion(that.shade_color,that.new_data.children.length);
                that.new_data.children.forEach(function (d,i) {
                    d.color = shade_array[i];
                })
            }
            that.optionalFeatures().svgContainer(container_id)
                .createChart()
                .label();

            that.k.createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource()
                .liveData(that)
                .tooltip();
        }
        else if (that.mode === "infographics") {
            that.k.backgroundColor(that)
                .export(that,"#" + container_id,"bubble")
                .emptyDiv(options.selector);

            that.new_data = {"children" : that.data};
            if(that.color_mode === "shade") {
                shade_array = that.k.shadeColorConversion(that.shade_color,that.new_data.children.length);
                that.new_data.children.forEach(function (d,i) {
                    d.color = shade_array[i];
                })
            }
            that.optionalFeatures().svgContainer(container_id)
                .createChart()
                .label();

            that.k.tooltip();

        }
        that.k.exportSVG(that,"#"+container_id,"bubble")
        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        var resize = that.k.resize(that.svgContainer);
        that.k.__proto__._ready(resize);
        window.addEventListener('resize', function(event){
            return that.k.resize(that.svgContainer);
        });
    };

    this.optionalFeatures = function () {
        var optional = {
            svgContainer: function (container_id) {
                that.svgContainer = d3.select(that.selector).append("svg")
                    .attr({
                        "class": "svgcontainer PykCharts-oneD",
                        "id": container_id,
                        "preserveAspectRatio": "xMinYMin",
                        "viewBox": "0 0 " + that.chart_width + " " + that.chart_height,
                        "width": that.chart_width,
                        "height": that.chart_height
                    });
                that.group = that.svgContainer.append("g")
                    .attr("id","bubgrp");
                return this;
            },
            createChart : function () {
                var bubble = d3.layout.pack()
                    .sort(function (a,b) { return b.weight - a.weight; })
                    .size([that.chart_width, that.chart_height])
                    .value(function (d) { return d.weight; })
                    .padding(20);

                that.sum = d3.sum(that.new_data.children, function (d) {
                    return d.weight;
                });
                
                var l = that.new_data.children.length;
                that.node = bubble.nodes(that.new_data);

                var chart_data = that.group.selectAll(".bubble-node")
                    .data(that.node);

                chart_data.enter()
                    .append("g")
                    .attr("class","bubble-node")
                    .append("circle");

                chart_data.attr("class","bubble-node")
                    .select("circle")
                    .attr({
                        "class": "bubble",
                        "id":function (d,i) {
                            return "bubble"+i;
                        },
                        "x":function (d) { return d.x; },
                        "y":function (d) { return d.y; },
                        "r": 0,
                        "transform": function (d) { return "translate(" + d.x + "," + d.y +")"; },
                        "fill": function (d) {
                            return d.children ? that.background_color : that.fillChart.selectColor(d);
                        },
                        "fill-opacity": function(d) {
                            return d.children ? 0 : 1;
                        },
                        "data-fill-opacity": function () {
                            return d3.select(this).attr("fill-opacity");
                        },
                        "data-id":function (d,i) {
                            return d.name;
                        }
                    })
                    .on({
                        "mouseover": function (d) {
                            if(!d.children && that.mode==="default") {
                                if(PykCharts['boolean'](that.chart_onhover_highlight_enable)) {
                                    that.mouseEvent.highlight(options.selector+" "+".bubble", this, true);
                                }
                                d.tooltip = d.tooltip ||"<table><thead><th colspan='2' class='tooltip-heading'>"+d.name+"</th></thead><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.weight)+"  <td class='tooltip-right-content'>("+((d.weight*100)/that.sum).toFixed(1)+"%)</tr></table>";
                                that.mouseEvent.tooltipPosition(d);
                                that.mouseEvent.tooltipTextShow(d.tooltip);
                            }
                        },
                        "mouseout": function (d) {
                            if(that.mode==="default") {
                                that.mouseEvent.tooltipHide(d)
                                if(PykCharts['boolean'](that.chart_onhover_highlight_enable)) {
                                    that.mouseEvent.highlightHide(options.selector+" "+".bubble");
                                }
                            }
                        },
                        "mousemove": function (d) {
                            if(!d.children && that.mode==="default") {
                                that.mouseEvent.tooltipPosition(d);
                            }
                        },
                        'click': function (d,i) {
                            if(PykCharts['boolean'](options.click_enable)){
                               that.addEvents(d.name, d3.select(this).attr("data-id")); 
                            }                     
                        }
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("r",function (d) {return d.r; });
                chart_data.exit().remove();

                return this;
            },
            label : function () {
                var chart_text = that.group.selectAll(".name")
                        .data(that.node);

                var chart_text1 = that.group.selectAll(".weight")
                    .data(that.node);

                chart_text.enter()
                    .append("svg:text")
                    .attr("class","name");

                chart_text1.enter()
                    .append("svg:text")
                    .attr("class","weight");

                chart_text.attr("class","name")
                    .attr({
                        "x": function (d) { return d.x },
                        "y": function (d) { return d.y -5 }
                    });

                chart_text1.attr("class","weight")
                    .attr({
                        "x": function (d) { return d.x },
                        "y": function (d) { return + d.y + that.label_size; }
                    });

                chart_text.attr("text-anchor","middle")
                    .attr("fill", that.label_color)
                    .style({
                        "font-weight": that.label_weight,
                        "font-size": that.label_size + "px",
                        "font-family": that.label_family
                    })
                    .text("")
                        
                    function chart_text_timeout() {
                        chart_text
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
                    }
                    setTimeout(chart_text_timeout,that.transitions.duration());

                    chart_text1
                        .attr({
                            "text-anchor":"middle",
                            "fill": that.label_color,
                            "pointer-events": "none"
                        })
                        .style({
                            "font-family": that.label_family,
                            "font-weight": that.label_weight,
                            "font-size": that.label_size + "px"
                        })
                        .text("")

                    function label_timeout() {
                        chart_text1.text(function (d) { return d.children ? " " :  that.k.appendUnits(d.weight); })
                            .text(function (d) {
                                if(this.getBBox().width<2*d.r*0.55 && this.getBBox().height<2*d.r*0.55) {
                                    return d.children ? " " :  ((d.weight*100)/that.sum).toFixed(1)+"%"; /*that.k.appendUnits(d.weight);*/
                                }
                                else {
                                    return "";
                                }
                            });                        
                    }
                    setTimeout(label_timeout,that.transitions.duration());

                    chart_text.exit()
                        .remove();
                    chart_text1.exit()
                        .remove();
                return this;
            },
            clubData : function () {
                var new_data1,data_length = that.data.length;

                if (PykCharts['boolean'](that.clubdata_enable)) {
                    var clubdata_content = [];
                    var k = 0, j, i, new_data = [];
                    if(data_length <= that.clubdata_maximum_nodes) {
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
                        for (j=0; j<data_length; j++) {
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
                    for(j=k; j<data_length; j++) {
                        for (i=0; i<new_data.length && j<that.data.length; i++) {
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
