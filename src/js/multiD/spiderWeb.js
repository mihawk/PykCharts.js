PykCharts.multiD.spiderWeb = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function (pykquery_data) {
        var multiDimensionalCharts = theme.multiDimensionalCharts;
        that = new PykCharts.validation.processInputs(that, options, 'multiDimensionalCharts');
        that.bubbleRadius = options.spiderweb_radius  ? options.spiderweb_radius : (0.6 * multiDimensionalCharts.scatterplot_radius);
        that.spiderweb_outer_radius_percent = options.spiderweb_outer_radius_percent  ? options.spiderweb_outer_radius_percent : multiDimensionalCharts.spiderweb_outer_radius_percent;
        that.panels_enable = "no";
        that.data_sort_enable = "yes";
        that.data_sort_type = "alphabetically";
        that.data_sort_order = "ascending";        
        try {
            if(!that.k.__proto__._isNumber(that.bubbleRadius)) {
                that.bubbleRadius = (0.6 * multiDimensionalCharts.scatterplot_radius);
                throw "spiderweb_radius";
            }
        } 
        catch (err) {
            that.k.warningHandling(err,"1");
        }

        try {
            if(!that.k.__proto__._isNumber(that.spiderweb_outer_radius_percent)) {
                that.bubbleRadius = multiDimensionalCharts.spiderweb_outer_radius_percent;
                throw "spiderweb_outer_radius_percent";
            }
        } 

        catch (err) {
            that.k.warningHandling(err,"1");
        }

        if(that.stop) {
            return;
        }
        
        if(that.mode === "default") {
            that.k.loading();
        }

        if(that.spiderweb_outer_radius_percent > 100) {
            that.spiderweb_outer_radius_percent = 100;
        }

        that.multiD = new PykCharts.multiD.configuration(that);
        
        that.inner_radius = 0;
        
        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data),
                id = that.selector.substring(1,that.selector.length);
            if(that.stop || validate === false) {
                that.k.remove_loading_bar(id);
                return;
            }
            that.data = that.k.__proto__._groupBy("spiderweb",data);
            that.compare_data = that.k.__proto__._groupBy("spiderweb",data);
            that.k.remove_loading_bar(id);
            that.render();
        };
        if (PykCharts.boolean(options.interactive_enable)) {
            that.k.dataFromPykQuery(pykquery_data);
            that.k.dataSourceFormatIdentification(that.data,that,"executeData");
        } else {
            that.k.dataSourceFormatIdentification(options.data,that,"executeData");
        }   
    };

    that.dataTransformation = function () {
        that.group_arr = [];
        that.uniq_group_arr = [];
        that.x_arr = [];
        that.uniq_x_arr = [];
        that.data = that.k.__proto__._sortData(that.data, "x", "group", that);
        that.data_length = that.data.length;
        for(var j=0; j<that.data_length; j++) {
            that.group_arr[j] = that.data[j].group;
        }
        that.uniq_group_arr = that.k.__proto__._unique(that.group_arr);
        var len = that.uniq_group_arr.length;

        for(var k=0; k<that.data_length; k++) {
            that.x_arr[k] = that.data[k].x;
        }
        var uniq_x_arr = that.k.__proto__._unique(that.x_arr);

        that.new_data = [];
        for (var k=0; k<len; k++) {
            that.new_data[k] = {
                name: that.uniq_group_arr[k],
                data: []
            };
            for (var l=0; l<that.data_length; l++) {
                if (that.uniq_group_arr[k] === that.data[l].group) {
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
        that.new_data_length = that.new_data.length;
    }

    that.refresh = function (pykquery_data) {
        that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("spiderweb",data);
            that.refresh_data = that.k.__proto__._groupBy("spiderweb",data);
            that.map_group_data = that.multiD.mapGroup(that.data);
            that.dataTransformation();
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.optionalFeatures()
                .createChart()
                .legends()
                .xAxis()
                .yAxis();
        };
        if (PykCharts.boolean(options.interactive_enable)) {
            that.k.dataFromPykQuery(pykquery_data);
            that.k.dataSourceFormatIdentification(that.data,that,"executeRefresh");
        } else {
            that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
        }  
    };

    this.render = function () {
        that.fillChart = new PykCharts.Configuration.fillChart(that);
        var id = that.selector.substring(1,that.selector.length),
            container_id = id + "_svg";
        that.border = new PykCharts.Configuration.border(that);
        that.map_group_data = that.multiD.mapGroup(that.data);
        that.dataTransformation();
        
        if(that.mode === "default") {
            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+container_id,"spiderweb")
                .emptyDiv(options.selector)
                .subtitle()
                .makeMainDiv(that.selector,1);
            that.h = that.chart_height;
            that.optionalFeatures()
                .svgContainer(container_id,1)
                .legendsContainer(1);
            
            that.k
                .liveData(that)
                .tooltip();
            
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

            that.optionalFeatures()
                .legends()
                .createGroups();
            that.spiderweb_outer_radius_percent = that.k.__proto__._radiusCalculation(that.spiderweb_outer_radius_percent,"spiderweb");
            that.radius_range = [(3*that.spiderweb_outer_radius_percent)/100,(0.09*that.spiderweb_outer_radius_percent)];
            that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range);
            
            that.optionalFeatures()
                .createChart()
                .xAxis()
                .yAxis();
            that.k.createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();

        } else if (that.mode==="infographics") {
            that.k.backgroundColor(that)
                .export(that,"#"+container_id,"spiderweb")
                .emptyDiv(options.selector);
            that.k.makeMainDiv(that.selector,1);
            that.h = that.chart_height;
            that.optionalFeatures().svgContainer(container_id,1)
                .legendsContainer()
                .createGroups();
            that.spiderweb_outer_radius_percent = that.k.__proto__._radiusCalculation(that.spiderweb_outer_radius_percent,"spiderweb");
            that.radius_range = [(3*that.spiderweb_outer_radius_percent)/100,(0.09*that.spiderweb_outer_radius_percent)];
            that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range);
            that.optionalFeatures()
                .createChart()
                .xAxis()
                .yAxis();

            that.k.tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        }
        that.k.exportSVG(that,"#"+container_id,"spiderweb")
        var resize = that.k.resize(that.svgContainer);
        that.k.__proto__._ready(resize);
        window.addEventListener('resize', function(event){
            return that.k.resize(that.svgContainer);
        });
    };

    this.degrees = function (radians) {
      return (radians / Math.PI * 180 - 90);
    };

    this.optionalFeatures = function () {
        var that =this,
            id = that.selector.substring(1,that.selector.length),
            status;
        var optional = {
            svgContainer: function (container_id,i) {
                document.getElementById(id).className = "PykCharts-spider-web";
                that.svgContainer = d3.select(that.selector + " #tooltip-svg-container-" + i)
                    .append("svg")
                    .attr({
                        "class": "svgcontainer",
                        "id": container_id,
                        "width": that.chart_width,
                        "height": that.chart_height,
                        "preserveAspectRatio": "xMinYMin",
                        "viewBox": "0 0 " + that.chart_width + " " + that.chart_height
                    });
                return this;
            },
            createGroups: function () {
                that.group = that.svgContainer.append("g")
                    .attr({
                        "id": "spider-group",
                        "transform": "translate(" + (that.chart_width - that.legendsGroup_width) / 2 + "," + ((that.h+that.legendsGroup_height+20)/2) + ")"
                    });

                that.ticksElement = that.svgContainer.append("g")
                    .attr("transform", "translate(" + (that.chart_width - that.legendsGroup_width)/ 2 + "," + ((that.h+that.legendsGroup_height+20)/2) + ")");
                return this;
            },
            legendsContainer : function (i) {
                if (PykCharts['boolean'](that.legends_enable) && that.map_group_data[1] && that.mode === "default") {
                    that.legendsGroup = that.svgContainer.append("g")
                        .attr({
                            "class": "spiderweb-legends",
                            "id": "legends"
                        });
                } else {
                    that.legendsGroup_width = 0;
                    that.legendsGroup_height = 0;
                }
                return this;
            },
            createChart: function () {
                var i, min, max,
                    uniq = that.new_data[0].data,
                    uniq_length = uniq.length;


                max = d3.max(that.new_data, function (d,i) { return d3.max(d.data, function (k) { return k.y; })});
                min = d3.min(that.new_data, function (d,i) { return d3.min(d.data, function (k) { return k.y; })});

                that.yScale = d3.scale.linear()
                    .domain([min,max])
                    .range([that.inner_radius, that.spiderweb_outer_radius_percent]);
                that.y_domain = [], that.nodes = [];

                for (var i=0;i<that.new_data_length;i++){
                    var t = [];
                    for (var j=0;j<that.new_data[i].data.length;j++) {
                        t[j] = that.yScale(that.new_data[i].data[j].y);
                    }
                    that.y_domain[i] = t;
                }
                for (var i=0;i<that.new_data_length;i++){
                    that.y = d3.scale.linear()
                        .domain(d3.extent(that.y_domain[i], function(d) { return parseFloat(d); }))
                        .range([0.1,0.9]);
                    var xyz = [];
                    for (var j=0;j<uniq_length;j++) {
                        xyz[j] = {
                            x: j,
                            y: that.y(that.y_domain[i][j]),
                            tooltip: that.new_data[i].data[j].tooltip || that.new_data[i].data[j].weight
                        }
                    }
                    that.nodes[i] = xyz;
                }
                for (var m =0; m<that.new_data_length; m++) {
                    var toolTip = [];
                    for (j=0; j<that.new_data[m].data.length;j++) {
                        toolTip[j] = that.new_data[m].data[j].tooltip;
                    }
                    that.angle = d3.scale.ordinal().domain(d3.range(that.new_data[m].data.length+1)).rangePoints([0, 2 * Math.PI]);
                    that.radius = d3.scale.linear().range([that.inner_radius, that.spiderweb_outer_radius_percent]);

                    that.yAxis = [];
                    for (var i=0;i<that.new_data[m].data.length;i++){
                        that.yAxis.push(
                            {x: i, y: 0.25},
                            {x: i, y: 0.5},
                            {x: i, y: 0.75},
                            {x: i, y: 1}
                        );
                    }

                    var target;
                    var grids = [];
                        that.yAxis_length =  that.yAxis.length;
                    for (var i=0;i<that.yAxis_length;i++) {
                        if (i<(that.yAxis_length-4)) {
                            target = that.yAxis[i+4];
                        } else {
                            target = that.yAxis[i - that.yAxis_length + 4];
                        }
                        grids.push({source: that.yAxis[i], target: target});
                    }

                    var links = [], color;
                    for (var i=0;i<that.nodes[m].length;i++) {
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

                    spider.attr({
                        "class": "link",
                        "stroke": function (d) {
                            return d.color;
                        },
                        "stroke-opacity": 1,
                        "id": "link"+m,
                        "d": d3.customHive.link()
                                .angle(function(d) { return that.angle(d.x); })
                                .radius(function(d) { return that.radius(d.y); })                          
                    });
                    spider.exit().remove();

                    that.weight = that.new_data[m].data.map(function (d) {
                        return d.weight;
                    });

                    var weight_length = that.weight.length,
                        rejected_result = [];
                    for(var i=0 ; i<weight_length ; i++) {
                        if(that.weight[i] !== 0) {
                            rejected_result.push(that.weight[i]);
                        }
                    }
                    that.weight = rejected_result;

                    that.sorted_weight = that.weight.slice(0);
                    that.sorted_weight.sort(function(a,b) { return a-b; });
                    var spiderNode = that.group.selectAll(".node"+m)
                        .data(that.nodes[m])

                    spiderNode.enter().append("circle")
                        .attr({
                            "class": "dot node"+m,
                            "transform": function(d) { return "rotate(" + that.degrees(that.angle(d.x)) + ")"; }
                        });

                    spiderNode.attr({
                        "class": "dot node"+m,
                        "cx": function (d) { return that.radius(d.y); },
                        "r": function (d,i) { return that.sizes(that.new_data[m].data[i].weight); },
                        "fill-opacity": function (d,i) {
                            return that.multiD.opacity(that.new_data[m].data[i].weight,that.weight,that.data);
                        },
                        "data-fill-opacity": function () {
                            return d3.select(this).attr("fill-opacity");
                        },
                        "stroke": that.border.color(),
                        "stroke-width": that.border.width(),
                        "stroke-dasharray": that.border.style(),
                        "data-id":function (d,i) {
                            return that.new_data[0].data[i].x;
                        }
                    })
                    .style("fill", function (d,i) {
                        return that.fillChart.colorPieW(that.new_data[m].data[i]);
                    })
                    .on({
                        'mouseover': function (d,i) {
                            if(that.mode === "default") {
                                that.mouseEvent.tooltipPosition(d);
                                that.mouseEvent.tooltipTextShow(d.tooltip);
                                if(PykCharts['boolean'](that.chart_onhover_highlight_enable)) {
                                    that.mouseEvent.highlight(that.selector + " .dot", this);
                                }
                            }
                        },
                        'mouseout': function (d) {
                            if(that.mode === "default") {
                                that.mouseEvent.tooltipHide(d);
                                if(PykCharts['boolean'](that.chart_onhover_highlight_enable)) {
                                    that.mouseEvent.highlightHide(that.selector + " .dot");
                                }
                            }
                        },
                        'mousemove': function (d) {
                            if(that.mode === "default") {
                                that.mouseEvent.tooltipPosition(d);
                            }
                        },
                        'click': function (d,i) {
                            if(PykCharts.boolean(options.click_enable)) {
                               that.addEvents(that.new_data[0].data[i].x, $(this).attr("data-id")); 
                            } 
                        }
                    });
                    spiderNode.exit().remove();
                }

                that.group.selectAll(".axis")
                    .data(d3.range(that.new_data[0].data.length))
                    .enter().append("line")
                    .attr({
                        "class": "axis",
                        "transform": function(d) { return "rotate(" + that.degrees(that.angle(d)) + ")"; },
                        "x1": that.radius.range()[0],
                        "x2": that.radius.range()[1]
                    });

                that.group.selectAll(".grid")
                    .data(grids)
                    .enter().append("path")
                    .attr({
                        "class": "grid",
                        "d": d3.customHive.link()
                                .angle(function(d) { return that.angle(d.x); })
                                .radius(function(d) { return that.radius(d.y); })
                    });

                return this;
            },
            legends : function () {
                if (PykCharts['boolean'](that.legends_enable) && that.map_group_data[1] && that.mode==="default") {
                    that.multiD.legendsPosition(that,"spiderWeb",that.map_group_data[0]);
                }
                return this;
            },
            xAxis : function () {
                that.length = that.new_data[0].data.length;

                var spiderAxisTitle = that.group.selectAll("text.x-axis-title")
                    .data(that.nodes[0]);
                    
                spiderAxisTitle.enter()
                    .append("text")
                    .attr("class","x-axis-title");

                spiderAxisTitle.attr({
                    "transform": function(d, i){
                        return "translate(" + (-that.spiderweb_outer_radius_percent) + "," + (-that.spiderweb_outer_radius_percent) + ")";
                    },
                    "x": function (d, i){ return that.spiderweb_outer_radius_percent*(1-0.2*Math.sin(i*2*Math.PI/that.length))+(that.spiderweb_outer_radius_percent * 1.25)*Math.sin(i*2*Math.PI/that.length); },
                    "y": function (d, i){
                        return that.spiderweb_outer_radius_percent*(1-0.60*Math.cos(i*2*Math.PI/that.length))-(that.spiderweb_outer_radius_percent * 0.47)*Math.cos(i*2*Math.PI/that.length);
                    }
                })
                .style({
                    "text-anchor": "middle",
                    "font-size": that.axis_x_pointer_size + "px",
                    "font-family": that.axis_x_pointer_family,
                    "font-weight": that.axis_x_pointer_weight,
                    "fill": that.axis_x_pointer_color
                });

                spiderAxisTitle
                    .text(function (d,i) { return that.new_data[0].data[i].x; });

                spiderAxisTitle.exit().remove();
                return this;
            },
            yAxis: function () {
                var a = that.yScale.domain(),
                    t = a[1]/4,
                    b = [];
                for(var i=4,j=0; i>=0 ;i--,j++){
                    b[j]=i*t;
                }
                var tick_label = that.ticksElement.selectAll("text.y-axis-ticks")
                    .data(b);

                tick_label.enter()
                    .append("text")
                    .attr("class","y-axis-ticks");
                tick_label
                    .style("text-anchor","start")
                    .attr({
                        "transform": "translate(5,"+(-that.spiderweb_outer_radius_percent)+")",
                        "x": 0,
                        "y": function (d,i) { return (i*(that.spiderweb_outer_radius_percent/4)); },
                        "dy": -2
                    });

                tick_label               
                    .text(function (d,i) { return d; })
                    .style({
                        "font-size": that.axis_y_pointer_size + "px",
                        "font-family": that.axis_y_pointer_family,
                        "font-weight": that.axis_y_pointer_weight,
                        "fill": that.axis_y_pointer_color
                    });

                tick_label.exit().remove();
                return this;
            },
            sort : function() {
                if(that.axis_y_data_format === "string") {
                    try {
                        if(that.data_sort_type === "alphabetically") {
                            that.data = that.k.__proto__._sortData(that.data, "y", "group", that);
                        } else {
                            that.data_sort_type = multiDimensionalCharts.data_sort_type;
                            throw "data_sort_type";
                        }
                    }
                    catch(err) {
                        that.k.warningHandling(err,"8");
                    }
                }
                return this;
            }
        }
        return optional;
    };
};