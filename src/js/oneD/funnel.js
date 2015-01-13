PykCharts.oneD.funnel = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function () {
        that = new PykCharts.validation.processInputs(that, options, 'oneDimensionalCharts');
        that.chart_height = options.chart_height ? options.chart_height : that.chart_width;
        var optional = options.optional,
            functionality = theme.oneDimensionalCharts;
        that.funnel_rect_width =  options.funnel_rect_width   ? options.funnel_rect_width : functionality.funnel_rect_width;
        that.funnel_rect_height = options.funnel_rect_height  ? options.funnel_rect_height : functionality.funnel_rect_height;
        that.k.validator()
            .validatingDataType(that.chart_height,"chart_height",that.chart_width)
            .validatingDataType(that.funnel_rect_width,"funnel_rect_width",functionality.funnel_rect_width)
            .validatingDataType(that.funnel_rect_height,"funnel_rect_height",functionality.funnel_rect_height);

        if(that.stop) {
            return;
        }

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
            that.render();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeData");

    };
    this.refresh = function () {
        that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("oned",data);
            that.refresh_data = that.k.__proto__._groupBy("oned",data);
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.optionalFeatures()
                    .createChart()
                    .label()
                    .ticks();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
    };

    this.render = function () {
        var that = this;
        var id = that.selector.substring(1,that.selector.length);
        var container_id = id + "_svg";
        that.fillChart = new PykCharts.Configuration.fillChart(that);
        that.transitions = new PykCharts.Configuration.transition(that);

        if(that.mode === "default") {
            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+container_id,"funnel")
                .emptyDiv(that.selector)
                .subtitle();
        }
        that.k.tooltip();
        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        if(that.mode === "infographics") {
            that.k.backgroundColor(that)
                .export(that,"#"+container_id,"funnel")
                .emptyDiv(that.selector);

            that.new_data = that.data;
        }
        if(that.mode === "default") {
            that.optionalFeatures();
        }
        that.optionalFeatures().svgContainer(container_id)
            .createChart()
            .label()
            .ticks();
        if(that.mode === "default") {
            that.k.liveData(that)
                .createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();
        }

        var add_extra_width = 0;
            setTimeout(function () {
                if(that.ticks_text_width.length) {
                    add_extra_width = d3.max(that.ticks_text_width,function(d){
                            return d;
                        });
                }
                that.k.exportSVG(that,"#"+container_id,"funnel",undefined,undefined,add_extra_width)
            },that.transitions.duration());

        var resize = that.k.resize(that.svgContainer);
        that.k.__proto__._ready(resize);
        window.onresize = function () {
            return that.k.resize(that.svgContainer);
        };
    };

    this.funnelLayout = function (){
        var that = this;
        var data,
            size,
            mouth,
            sort_data,
            coordinates;

        var funnel = {
            data: function(d){
                if (d.length===0){
                } else {
                    data = d;
                }
                return this;
            },
            size: function(s){
                if (s.length!==2){
                } else {
                    size = s;
                }
                return this;
            },
            mouth: function(m){
                if (m.length!==2){
                } else {
                    mouth = m;
                }
                return this;
            },
            coordinates: function(){
                var w = size[0],
                    h = size[1],
                    rw = mouth[0], //rect width
                    rh = mouth[1], //rect height
                    tw = (w - rw)/2, //triangle width
                    th = h - rh, //triangle height
                    height1=0,
                    height2=0,
                    height3=0,
                    merge = 0,
                    coordinates = [],
                    ratio = tw/th,
                    area_of_trapezium = (w + rw) / 2 * th,
                    area_of_rectangle = rw * rh,
                    total_area = area_of_trapezium + area_of_rectangle,
                    percent_of_rectangle = area_of_rectangle / total_area * 100;
                for (var i=data.length-1; i>=0; i--){
                    var selectedPercentValues = that.percentageValues(data)[i];
                    if (percent_of_rectangle>=selectedPercentValues){
                        height3 = selectedPercentValues / percent_of_rectangle * rh;
                        height1 = h - height3;
                        if (i===data.length-1){
                            coordinates[i] = {"values":[{"x":(w-rw)/2,"y":height1},{"x":(w-rw)/2,"y":h},{"x":((w-rw)/2)+rw,"y":h},{"x":((w-rw)/2)+rw,"y":height1}]};
                        }else{
                            coordinates[i] = {"values":[{"x":(w-rw)/2,"y":height1},coordinates[i+1].values[0],coordinates[i+1].values[3],{"x":((w-rw)/2)+rw,"y":height1}]};
                        }
                    }else{
                        var area_of_element = ((selectedPercentValues)/100 * total_area) - area_of_rectangle,
                            a = 2 * ratio,
                            b = 2 * rw,
                            c = 2 * area_of_element;
                        height2 = (-b + Math.sqrt(Math.pow(b,2) - (4 * a * -c))) / (2 * a);
                        height1 = h - height2 - rh;
                        var base = 2*(ratio * height2)+rw,
                        xwidth = (w-base)/2;
                        
                        if(merge===0){
                            if (i===data.length-1){
                                coordinates[i] = {"values":[{"x":xwidth,"y":height1},{"x":(w-rw)/2,"y":th},{"x":(w-rw)/2,"y":h},{"x":((w-rw)/2)+rw,"y":h},{"x":((w-rw)/2)+rw,"y":th},{"x":base+xwidth,"y":height1}]};
                            }else{
                                coordinates[i] = {"values":[{"x":xwidth,"y":height1},{"x":(w-rw)/2,"y":th},coordinates[i+1].values[0],coordinates[i+1].values[3],{"x":((w-rw)/2)+rw,"y":th},{"x":base+xwidth,"y":height1}]};
                            }
                        }
                        else{
                            var coindex;
                            if(coordinates[i+1].values.length===6){
                                coindex = 5;
                            }else{
                                coindex = 3;
                            }
                            coordinates[i] = {"values":[{"x":xwidth,"y":height1},coordinates[i+1].values[0],coordinates[i+1].values[coindex],{"x":base+xwidth,"y":height1}]};
                        }
                        merge = 1;
                    }
                }

                return coordinates;
            }
        };
        return funnel;
    };

   this.percentageValues = function (data){
        var that = this;
        var percentValues = data.map(function (d){
            var weight_max = d3.max(data, function (d) {
                return d.weight;
            })
            return d.weight/weight_max*100;
        });
        percentValues.sort(function(a,b){
            return b-a;
        });
        return percentValues;
    };

    this.optionalFeatures = function () {

        var optional = {
            svgContainer :function (container_id) {
                that.svgContainer = d3.select(options.selector)
                    .append('svg')
                    .attr({
                        "width": that.chart_width + "px",
                        "height": that.chart_height + "px",
                        "preserveAspectRatio": "xMinYMin",
                        "viewBox": "0 0 " + that.chart_width + " " + that.chart_height,
                        "id": container_id,
                        "class": "svgcontainer PykCharts-oneD"
                    });

                that.group = that.svgContainer.append("g")
                    .attr("id","funnel");

                return this;
            },
            createChart: function () {
                var border = new PykCharts.Configuration.border(that);
                that.new_data = that.data.sort(function(a,b) {
                    return b.weight-a.weight;
                })

                that.per_values = that.percentageValues(that.new_data);
                that.funnel = that.funnelLayout()
                                .data(that.new_data)
                                .size([that.chart_width,that.chart_height])
                                .mouth([that.funnel_rect_width,that.funnel_rect_height]);

                that.coordinates = that.funnel.coordinates();
                var line = d3.svg.line()
                                .interpolate('linear-closed')
                                .x(function(d,i) { return d.x; })
                                .y(function(d,i) { return d.y; });

                that.chart_data = that.group.selectAll('.fun-path')
                                .data(that.coordinates);
                var a = [{x:0,y:0},{x:that.chart_width,y:0},{x:0,y:0},{x:that.chart_width,y:0},{x:0,y:0},{x:that.chart_width,y:0}];
                that.chart_data.enter()
                    .append('path')
                    .attr("class", "fun-path")

                that.chart_data
                    .attr({
                        "class": "fun-path",
                        'd': function(d){ return line(a); },
                        "fill": function (d,i) {
                                return that.fillChart.selectColor(that.new_data[i]);
                        },
                        "fill-opacity": 1,
                        "data-fill-opacity":function () {
                            return d3.select(this).attr("fill-opacity");
                        },
                        "stroke": border.color(),
                        "stroke-width": border.width(),
                        "stroke-dasharray": border.style(), 
                        "stroke-opacity": 1
                    })
                    .on({
                        "mouseover": function (d,i) {
                            if(that.mode === "default") {
                                if(PykCharts['boolean'](that.chart_onhover_highlight_enable)) {
                                    that.mouseEvent.highlight(options.selector +" "+".fun-path",this);
                                }
                                tooltip = that.data[i].tooltip || "<table class='PykCharts'><tr><th colspan='3' class='tooltip-heading'>"+that.new_data[i].name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(that.new_data[i].weight)+"<td class='tooltip-right-content'>("+that.per_values[i].toFixed(1)+"%) </tr></table>";
                                that.mouseEvent.tooltipPosition(d);
                                that.mouseEvent.tooltipTextShow(tooltip);
                            }
                        },
                        "mouseout": function (d) {
                            if(that.mode === "default") {
                                if(PykCharts['boolean'](that.chart_onhover_highlight_enable)) {
                                    that.mouseEvent.highlightHide(options.selector +" "+".fun-path");
                                }
                                that.mouseEvent.tooltipHide(d);
                            }
                        },
                        "mousemove": function (d,i) {
                            if(that.mode === "default") {
                                that.mouseEvent.tooltipPosition(d);
                            }
                        }
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr('d',function(d){ return line(d.values); });

               that.chart_data.exit()
                   .remove();

                return this;
            },
            label : function () {
                that.chart_text = that.group.selectAll("text")
                    .data(that.coordinates)

                    that.chart_text.enter()
                        .append("text")

                    that.chart_text.attr({
                        "y": function (d,i) {
                            if(d.values.length===4){
                                return (((d.values[0].y-d.values[1].y)/2)+d.values[1].y) + 5;
                            } else {
                                return (((d.values[0].y-d.values[2].y)/2)+d.values[2].y) + 5;
                            }
                        },
                        "x": function (d,i) { return that.chart_width/2;}
                    });

                    that.chart_text.text("");
                    function chart_text_timeout(){
                        that.chart_text.text(function (d,i) {
                                return that.per_values[i].toFixed(1) + "%";
                            })
                            .attr({
                                "text-anchor": "middle",
                                "pointer-events": "none",
                                "fill": that.label_color
                            })
                            .style({
                                "font-weight": that.label_weight,
                                "font-size": that.label_size + "px",
                                "font-family": that.label_family
                            })
                            .text(function (d,i) {
                                if(this.getBBox().width<(d.values[3].x - d.values[1].x) && this.getBBox().height < (d.values[2].y - d.values[0].y)) {
                                    return that.per_values[i].toFixed(1) + "%";
                                }
                                else {
                                    return "";
                                }
                            });
                    }
                    setTimeout(chart_text_timeout,that.transitions.duration());

                    that.chart_text.exit()
                         .remove();
                return this;
            },
            ticks : function () {
                if(PykCharts['boolean'](that.pointer_overflow_enable)) {
                    that.svgContainer.style("overflow","visible");
                }

                var w =[];
                that.ticks_text_width = [];
                    var tick_label = that.group.selectAll(".ticks_label")
                                        .data(that.coordinates);

                    tick_label.attr("class","ticks_label");

                    tick_label.enter()
                        .append("text")
                        .attr({
                            "x": 0,
                            "y": 0
                        });

                    var x,y;

                    tick_label.attr("transform",function (d) {
                        if (d.values.length === 4) {
                            x = ((d.values[3].x + d.values[2].x)/2 ) + 10;
                            y = ((d.values[0].y + d.values[2].y)/2) + 5;
                        } else {
                            x = (d.values[4].x) + 10;
                            y = (d.values[4].y) + 5;
                        }
                        return "translate(" + x + "," + y + ")";});

                    tick_label.text("");
                    function tick_timeout() {
                        tick_label.text(function (d,i) { return that.data[i].name; })
                            .text(function (d,i) {
                                w[i] = this.getBBox().height;
                                that.ticks_text_width.push(this.getBBox().width);
                                if (this.getBBox().height < (d.values[2].y - d.values[0].y)) {
                                    return that.data[i].name;
                                }
                                else {
                                    return "";
                                }
                            })
                            .style({
                                "font-size": that.pointer_size + "px",
                                "text-anchor":"start",
                                "fill": that.pointer_color,
                                "pointer-events":"none",
                                "font-family": that.pointer_family,
                                "font-weight":that.pointer_weight                                
                            })
                    }

                    setTimeout(tick_timeout,that.transitions.duration());

                    tick_label.exit().remove();
                    var tick_line = that.group.selectAll(".funnel-ticks")
                        .data(that.coordinates);

                    tick_line.enter()
                        .append("line")
                        .attr("class", "funnel-ticks");

                    tick_line.attr({
                        "x1": function (d,i) {
                           if (d.values.length === 4) {
                                return ((d.values[3].x + d.values[2].x)/2 );
                           } else {
                                return (d.values[4].x);
                           }
                        },
                        "y1": function (d,i) {
                            if (d.values.length === 4) {
                                return ((d.values[0].y + d.values[2].y)/2);
                           } else {
                                return (d.values[4].y);
                           }
                        },
                        "x2": function (d, i) {
                            if (d.values.length === 4) {
                                return ((d.values[3].x + d.values[2].x)/2 );
                           } else {
                                return (d.values[4].x);
                           }
                        },
                        "y2": function (d, i) {
                            if (d.values.length === 4) {
                                return ((d.values[0].y + d.values[2].y)/2);
                           } else {
                                return (d.values[4].y);
                           }
                        },
                        "stroke-width": that.pointer_thickness + "px",
                        "stroke": that.pointer_color
                    });

                    function tick_line_timeout(){
                        tick_line.attr("x2", function (d, i) {
                            if(( d.values[2].y - d.values[0].y) > w[i]) {
                                if (d.values.length === 4) {
                                    return ((d.values[3].x + d.values[2].x)/2 ) + 5;
                                } else {
                                    return ((d.values[4].x) +5);
                                }
                            } else {
                                if (d.values.length === 4) {
                                    return ((d.values[3].x + d.values[2].x)/2 );
                                } else {
                                    return (d.values[4].x);
                                }
                            }
                        });
                    }

                    setTimeout(tick_line_timeout,that.transitions.duration());

                    tick_line.exit().remove();

                return this;
            }
        };
        return optional;
    };
};
