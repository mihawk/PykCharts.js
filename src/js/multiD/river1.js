PykCharts.multiD.river = function (options){
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function (){
        that = new PykCharts.multiD.processInputs(that, options, "area");
        var multiDimensionalCharts = theme.multiDimensionalCharts,
            stylesheet = theme.stylesheet,
            optional = options.optional;
        that.data_mode_enable = options.data_mode_enable ? options.data_mode_enable.toLowerCase() : multiDimensionalCharts.data_mode_enable;
        if(PykCharts.boolean(that.data_mode_enable) && that.mode === "default") {
            that.chart_mode = options.data_mode_default ? options.data_mode_default.toLowerCase() : multiDimensionalCharts.data_mode_default;
            that.data_mode_legends_color = options.data_mode_legends_color ? options.data_mode_legends_color : multiDimensionalCharts.data_mode_legends_color;
        } else {
            that.data_mode_enable = "no";
            that.chart_mode = "absolute";
        }
        that.connecting_lines_color = options.connecting_lines_color ? options.connecting_lines_color : multiDimensionalCharts.connecting_lines_color;
        that.connecting_lines_style = options.connecting_lines_style ? options.connecting_lines_style : multiDimensionalCharts.connecting_lines_style;
        switch(that.connecting_lines_style) {
            case "dotted" : that.connecting_lines_style = "1,3";
                            break;
            case "dashed" : that.connecting_lines_style = "5,5";
                           break;
            default : that.connecting_lines_style = "0";
                      break;
        }
        that.legends_mode = options.legends_mode ? options.legends_mode : multiDimensionalCharts.legends_mode;
        that.expand_group = options.expand_group ? options.expand_group : multiDimensionalCharts.expand_group;
        that.time_between_steps_text_color = options.time_between_steps_text_color ? options.time_between_steps_text_color : multiDimensionalCharts.time_between_steps_text_color;
        that.time_between_steps_text_weight = options.time_between_steps_text_weight ? options.time_between_steps_text_weight.toLowerCase() : multiDimensionalCharts.time_between_steps_text_weight;
        that.time_between_steps_text_family = options.time_between_steps_text_family ? options.time_between_steps_text_family.toLowerCase() : multiDimensionalCharts.time_between_steps_text_family;
        that.time_between_steps_text_size = "time_between_steps_text_size" in options ? options.time_between_steps_text_size : multiDimensionalCharts.time_between_steps_text_size;
        that.k.validator()
            .validatingDataType(that.time_between_steps_text_size,"time_between_steps_text_size",multiDimensionalCharts.time_between_steps_text_size,"time_between_steps_text_size")
            .validatingFontWeight(that.time_between_steps_text_weight,"time_between_steps_text_weight",multiDimensionalCharts.time_between_steps_text_weight,"time_between_steps_text_weight")           
            .validatingColor(that.time_between_steps_text_color,"time_between_steps_text_color",multiDimensionalCharts.time_between_steps_text_color,"time_between_steps_text_color")
            .validatingColor(that.connecting_lines_color,"connecting_lines_color",multiDimensionalCharts.connecting_lines_color,"connecting_lines_color")
            .validatingColor(that.data_mode_legends_color,"data_mode_legends_color",multiDimensionalCharts.data_mode_legends_color,"data_mode_legends_color")
            .validatingDataMode(that.chart_mode,"data_mode_default",multiDimensionalCharts.data_mode_default,"chart_mode")
            .validatingLegendsMode(that.legends_mode,"legends_mode",multiDimensionalCharts.legends_mode,"legends_mode");
        
        if(that.stop)
            return;

        if(that.mode === "default") {
            that.k.loading();
        }

        that.w = that.width - that.margin_left - that.margin_right;
        that.h = that.height - that.margin_top - that.margin_bottom;
        that.multiD = new PykCharts.multiD.configuration(that);
        that.filterList = [];
        that.fullList = [];
        that.extended = that.chart_mode === "absolute" ? false : true;
        
        that.executeData = function (data) {

            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(that.selector+" #chart-loader").remove();
                $(options.selector).css("height","auto")
                return;
            }

            that.data = data;
            that.data.forEach(function (d) {
                d.group = d.stack;
            })
            that.axis_y_data_format = "number";
            that.axis_x_data_format = "number"
            that.compare_data = that.data;
            that.data_length = that.data.length;
            $(that.selector+" #chart-loader").remove();
            $(options.selector).css("height","auto")
            that.map_group_data = that.multiD.mapGroup(that.data);
            that.dataTransformation();
            that.render();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };
    this.render = function () {
        that.multid = new PykCharts.multiD.configuration(that);
        that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.border = new PykCharts.Configuration.border(that);
        if(that.mode === "default") {
            that.k.title()
                    .backgroundColor(that)
                    .export(that,"#svg-1","river")
                    .liveData(that)
                    .emptyDiv()
                    .subtitle()
                    .tooltip();
            that.optional_feature()
                .svgContainer(1)
                .legendsContainer()
                .legends()
                .dataModeContainer()
                .dataMode()
                .createGroups(1)
                .preProcessing()
                .ticks()
                .yAxisLabel()
                .grids()
                .durationLabel()
                .createChart()
                .connectingLines()
                
                .highlight();

            that.k.createFooter()
                    .lastUpdatedAt()
                    .credits()
                    .dataSource();
        }
        else if(that.mode === "infographics") {
              that.k.liveData(that)
                        .backgroundColor(that)
                        .export(that,"#svg-1","river")
                        .emptyDiv()
                        .makeMainDiv(options.selector,1);

              that.optional_feature()
                        .svgContainer(1)
                        .legendsContainer()
                        .dataModeContainer()
                        .dataMode()
                        .createGroups(1)
                        .preProcessing()
                        .ticks()
                        .yAxisLabel()
                        .grids()
                        .durationLabel()
                        .createChart()
                        .connectingLines();

        }
        that.k.exportSVG(that,"#svg-1","river")
        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        $(document).ready(function () { return that.k.resize(that.svgContainer); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer); });

    };
    that.dataTransformation = function () {
        that.group_arr = [], that.new_data = [],that.uniq_alias_arr = [],that.uniq_duration_arr = [];
        that.data_length = that.data.length;
        for(j = 0;j < that.data_length;j++) {
            that.group_arr[j] = that.data[j].y;
        }
        that.uniq_group_arr = _.unique(that.group_arr);
        var len = that.uniq_group_arr.length;
        for (k = 0;k < len;k++) {
            for (l = 0;l < that.data_length;l++) {
                if (that.uniq_group_arr[k] === that.data[l].y) {
                    that.uniq_alias_arr[k] = that.data[l].alias;
                    that.uniq_duration_arr[k] = that.data[l].time_between_steps || "";
                    break;
                }
            }
        }
        
        for (k = 0;k < len;k++) {
            that.new_data[k] = {
                    display_name: that.uniq_group_arr[k],
                    breakup: [],
                    technical_name: that.uniq_alias_arr[k], 
                    duration: that.uniq_duration_arr[k]
            };
            for (l = 0;l < that.data_length;l++) {
                if (that.uniq_group_arr[k] === that.data[l].y) {
                    that.new_data[k].breakup.push({
                        count: that.data[l].x,
                        name: that.data[l].stack,
                        tooltip: that.data[l].tooltip,
                        color: that.data[l].color
                    });
                }
            }
        }
        that.new_data_length = that.new_data.length;
    };
    that.refresh = function() {
        that.executeRefresh = function (e, data) {
            that.data = data;
            that.refresh_data = data;
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.data.forEach(function (d) {
                d.group = d.stack;
            })
            that.map_group_data = that.multiD.mapGroup(that.data);
            that.dataTransformation();
            that.draw();
            that.optional_feature().grids()
                .yAxisLabel()
                .durationLabel();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
    }
    this.draw = function(){
        that.optional_feature().legends().dataMode().preProcessing().createChart().grids();    
        that.optional_feature().connectingLines().ticks().highlight();
    };
    that.optional_feature = function (){
        var optional = {
            svgContainer: function (i){
                $(that.selector).attr("class","PykCharts-twoD PykCharts-multi-series2D PykCharts-line-chart");
                
                that.svgContainer = d3.select(options.selector).append("svg:svg")
                    .attr("id","svg-"+i)
                    .attr("width",that.width)
                    .attr("height",that.height)
                    .attr("class","svgcontainer PykCharts-river")
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height);
                return this;
            },
            createGroups : function (i) {
                that.group = that.svgContainer.append("g")
                    .attr("id","chartsvg")
                    .attr("transform","translate("+ that.margin_left +","+ (that.legendsGroup_height)+")");
                that.ygroup = that.svgContainer.append("g")
                    .attr("transform","translate("+ 0 +","+ (that.legendsGroup_height)+")");
                that.grid_group = that.svgContainer.append("g")
                    .attr("transform","translate("+ 0 +","+ (that.legendsGroup_height)+")");
                that.ticks_group = that.svgContainer.append("g")
                    .attr("transform","translate("+ (0) +","+ (that.legendsGroup_height)+")")
                return this;
            },
            dataModeContainer : function () {
                that.chart_mode_group = that.svgContainer.append("g")
                    .attr("translate","transform(0,0)");
                return this;    
            },
            legendsContainer : function (i) {
                if(PykCharts.boolean(that.legends_enable) && that.mode === "default") {
                    that.legendsGroup = that.svgContainer.append("g")
                        .attr('id',"legends")
                        .style("visibility","visible")
                        .attr("class", "legend-holder")
                        .attr("transform","translate(0,10)");
                } else {
                    that.legendsGroup_height = 0;
                    that.legendsGroup_width = 0;
                    that.new_data[0].breakup.forEach(function(d) {
                        that.filterList.push(d.name);
                        that.fullList.push(d.name);
                    })
                }
                return this;
            },
            preProcessing: function () {
                that.new_data1 = jQuery.extend(true, [], that.new_data);
                that.highlightdata = [],highlight_index = -1;
                that.new_data1 = that.filter(that.new_data1);
                that.new_data1 = that.parseData(that.new_data1);
                that.maxTotalVal = that.maxTotal(that.new_data1);
                that.highlight_enable = false;
                that.yScale = d3.scale.linear().domain([0, that.height]).range([0, that.height-that.legendsGroup_height]);
                that.barHeight = (that.height) / (that.new_data1.length * 2);
                that.barMargin = that.barHeight * 2;
                return this;
            },
            createChart : function () {

                that.margin_left = that.max_label + 10;
                that.margin_right = that.max_duration > that.max_tick ? (that.max_duration + 10) : (that.max_tick + 10);
                var height = that.height;
                var width = that.width - that.legendsGroup_width - that.margin_right - that.margin_left;
                that.group.attr("transform","translate("+ that.margin_left +","+ (that.legendsGroup_height)+")");
                if(!that.extended) {
                    that.xScale = d3.scale.linear().domain([0, that.maxTotalVal]).range([0, width]);
                } else {
                    that.xScale = d3.scale.linear().range([0, width]);
                }
                var svg = that.group;
                var groups = svg.selectAll("g.bar-holder").data(that.new_data1);

                groups.enter().append("g").attr("class", "bar-holder")
                    .attr("transform", function(d, i){
                        var y = that.yScale(i * that.barMargin);
                        var x = that.xScale((that.maxTotalVal - d.breakupTotal) / 2);
                        if(that.extended) {
                            var x = 0;
                        }
                        
                        return "translate("+x+","+y+")";
                    });

                groups.transition().duration(that.transitions.duration())
                    .attr("transform", function(d, i){
                        var y = that.yScale(i * that.barMargin);
                        var x = that.xScale((that.maxTotalVal - d.breakupTotal) / 2);
                        if(that.extended){
                            x = that.yScale(0);
                        }
                        if(d.display_name.toLowerCase() === that.highlight) {
                            that.highlightdata.push(d);
                            that.highlight_index = i;
                            that.highlight_enable = true;
                        }
                        return "translate("+x+","+y+")";
                    });

                groups.exit().remove();
                
                var bar_holder = svg.selectAll("g.bar-holder")[0];
                for(var i = 0; i<that.new_data1.length; i++){
                    var group = bar_holder[i];
                    var breakup = that.new_data1[i].breakup;
                    var len = that.new_data[i].breakup.length;
                    if(that.extended) {
                        that.xScale.domain([0,that.new_data1[i].breakupTotal]);
                    }
                    
                    var rects = d3.select(group).selectAll("rect").data(breakup);

                    rects.enter().append("rect").attr("width", 0).attr("class","rect");

                    rects.transition().duration(that.transitions.duration())
                        .attr("x", function(d, i){
                            if (i === 0) return 0;
                            var shift = 0;
                            for(var j = 0; j < i; j++){
                                shift += breakup[j].count;
                            }
                            return that.xScale(shift);
                        })
                        .attr("y", 0)
                        .attr("height", function(d, i){
                            
                            return (that.barHeight * (height - that.legendsGroup_height)) / height;

                        })
                        .attr("width", function(d,i){
                            return that.xScale(d.count);
                        });

                    rects.attr("fill", function (d) {
                            return that.fillColor.colorPieMS(d);
                        })
                        .attr("stroke",that.border.color())
                        .attr("stroke-width",that.border.width())
                        .attr("stroke-dasharray", that.border.style())
                        .attr("fill-opacity", function (d,i) {
                            if(that.color_mode === "saturation") {
                                return (len-i)/len;
                            }
                            return 1;
                        })
                        .attr("data-fill-opacity",function () {
                            return $(this).attr("fill-opacity");
                        })
                        .on("mouseover", function(d, i){
                            if(that.mode === "default") {
                                that.mouseEvent.tooltipPosition(d);
                                that.mouseEvent.tooltipTextShow(d.tooltip ? d.tooltip : d.y);
                                if(PykCharts.boolean(that.onhover_enable)) {
                                    that.mouseEvent.highlight(options.selector + " .rect", this);
                                }
                            }
                        })
                        .on("mousemove", function(d){
                            if(that.mode === "default") {
                                that.mouseEvent.tooltipPosition(d);
                            }
                        })
                        .on("mouseout", function(d){
                            if(that.mode === "default") {
                                that.mouseEvent.tooltipHide(d);
                                if(PykCharts.boolean(that.onhover_enable)) {
                                    that.mouseEvent.highlightHide(options.selector + " .rect")
                                }
                            }
                        })
                        .on("click", function(d, i){
                            if(PykCharts.boolean(that.expand_group) && that.mode === "default") {
                                that.onlyFilter(d.name); 
                            }
                        });

                    rects.exit().transition().duration(that.transitions.duration()).attr("width", 0).remove();
                    if(PykCharts.boolean(that.expand_group)) {
                        rects.style("cursor","pointer");
                    }
                }
                return this;
            },
            grids: function () {
                if(PykCharts.boolean(that.grid_x_enable)) {
                    
                    var width = that.width - that.legendsGroup_width;
                    var top_grid = that.grid_group.selectAll("line.top_line")
                        .data(that.new_data1)
                    top_grid.enter()
                        .append("line")
                    top_grid.attr("class", "top_line")
                        .attr("x1", 0).attr("x2", width)
                        .attr("y1", function(d, i){
                            return that.yScale(i * that.barMargin);
                        })
                        .attr("y2", function(d, i){
                            return that.yScale(i * that.barMargin);
                        })
                        .attr("stroke",that.grid_color);
                    top_grid.exit().remove();
                    
                    var bottom_grid = that.grid_group.selectAll("line.bottom_line")
                        .data(that.new_data1);
                    bottom_grid.enter()
                        .append("line")
                    bottom_grid.attr("class", "bottom_line")
                        .attr("x1", 0).attr("x2", width)
                        .attr("y1", function(d, i){
                            return that.yScale((i * that.barMargin) + that.barHeight);
                        })
                        .attr("y2", function(d, i){
                            return that.yScale((i * that.barMargin) + that.barHeight);
                        })
                        .attr("stroke",that.grid_color);
                    bottom_grid.exit().remove();
                }
                return this;
            },
            connectingLines: function () {
                if(!that.extended) {
                    $("line.left_line").fadeIn();
                    $("line.right_line").fadeIn();
                    var left_angles = that.group.selectAll("line.left_line").data(that.new_data1);

                    left_angles.enter().append("line").attr("class", "left_line")
                        .attr("y2", function(d,i){
                            return that.yScale((i * that.barMargin) + that.barHeight);
                        })
                        .attr("x2", function(d,i){
                            return that.xScale((that.maxTotalVal - d.breakupTotal) / 2);
                        });
                    left_angles.style("stroke-width", function(d,i){
                            if(!that.new_data1[i+1]) return "0";
                        })
                    left_angles.transition().duration(that.transitions.duration())
                        .style("stroke-width", 1)
                        .style("stroke", that.connecting_lines_color)
                        .style("stroke-dasharray", that.connecting_lines_style)
                        .style("shape-rendering", "auto")
                        .style("stroke-width", function(d,i){
                            if(!that.new_data1[i+1]) return "0";
                        })
                        .attr("y1", function(d,i){
                            return that.yScale((i * that.barMargin) + that.barHeight);
                        })
                        .attr("x1", function(d,i){
                            return that.xScale((that.maxTotalVal - d.breakupTotal) / 2);
                        })
                        .attr("y2", function(d,i){
                            return that.yScale(((i+1) * that.barMargin));
                        })
                        .attr("x2", function(d,i){
                            if(!that.new_data1[i+1]) return 0;
                            return that.xScale((that.maxTotalVal - that.new_data1[i+1].breakupTotal) / 2);

                        });
                    left_angles.exit().remove();
                    var right_angles = that.group.selectAll("line.right_line").data(that.new_data1);

                    right_angles.enter().append("line").attr("class", "right_line")
                        .attr("y2", function(d,i){
                            return that.yScale((i * that.barMargin) + that.barHeight);
                        })
                        .attr("x2", function(d,i){
                            return that.xScale(((that.maxTotalVal - d.breakupTotal) / 2) + d.breakupTotal);
                        });
                    right_angles.style("stroke-width", function(d,i){
                            if(!that.new_data1[i+1]) return "0";
                        })
                    right_angles.transition().duration(that.transitions.duration())
                        .style("stroke-width", 1)
                        .style("stroke", that.connecting_lines_color)
                        .style("stroke-dasharray", that.connecting_lines_style)
                        .style("shape-rendering", "auto")
                        .style("stroke-width", function(d,i){
                            if(!that.new_data1[i+1]) return "0";
                        })
                        .attr("y1", function(d,i){
                            return that.yScale((i * that.barMargin) + that.barHeight);
                        })
                        .attr("x1", function(d,i){
                            return that.xScale(((that.maxTotalVal - d.breakupTotal) / 2) + d.breakupTotal);
                        })
                        .attr("y2", function(d,i){
                            return that.yScale(((i+1) * that.barMargin));
                        })
                        .attr("x2", function(d,i){
                            if(!that.new_data1[i+1]) return 0;
                            return that.xScale(((that.maxTotalVal - that.new_data1[i+1].breakupTotal) / 2) + that.new_data1[i+1].breakupTotal);
                        });
                    right_angles.exit().remove();
                } else if(that.extended) {
                    $("line.left_line").fadeOut();
                    $("line.right_line").fadeOut();
                } 
                return this;
            },
            ticks: function () {
                if(PykCharts.boolean(that.pointer_size)) {
                    var tick_text_width = [];
                    var width = that.width - that.legendsGroup_width;
                    var display_name = that.ticks_group.selectAll("text.cool_label").data(that.new_data1);

                    display_name.enter().append("text").attr("class", "cool_label");

                    display_name.attr("x", width)
                        .attr("y", function(d, i){
                            return that.yScale((i * that.barMargin) + (that.barHeight/2) + 5);
                        })
                        .text(function(d, i){
                            return d.breakupTotal + " " + d.technical_name;
                        })
                        .text(function(d,i){
                            var x = this.getBBox().width;
                            tick_text_width.push(x);
                            return d.breakupTotal + " " + d.technical_name;
                        })
                        .style("font-weight", that.pointer_weight)
                        .style("font-size", that.pointer_size + "px")
                        .attr("fill", that.pointer_color)
                        .style("font-family", that.pointer_family)
                        .attr("text-anchor","end");
                    that.max_tick = d3.max(tick_text_width,function (d) { return d; })
                    display_name.exit().remove();
                }
                return this;
            },
            yAxisLabel : function () {
                var left_labels = that.ygroup.selectAll("text.left_label").data(that.new_data1);
                var label_text_width = [];
                left_labels.enter().append("svg:text").attr("class", "left_label");

                left_labels
                    .attr("y", function(d, i){
                        return that.yScale((i * that.barMargin) + (that.barHeight/2) + 5);
                    })
                    .attr("x", 0)
                    .text(function(d,i){
                        return d.display_name;
                    })
                    .text(function (d,i) {
                        var x = this.getBBox().width;
                        label_text_width.push(x);
                        return d.display_name;
                    })
                    .style("font-size",that.axis_y_pointer_size + "px")
                    .style("fill",that.axis_y_pointer_color)
                    .style("font-weight",that.axis_y_pointer_weight)
                    .style("font-family",that.axis_y_pointer_family); 
                that.max_label = d3.max(label_text_width,function (d) { return d; })
                left_labels.exit().remove();
                return this;
            },
            highlight : function () {
                if(that.highlight_enable) {
                    var highlight_rect = that.group.selectAll(".highlight-rect")
                        .data(that.highlightdata)
                    highlight_rect.enter()
                        .append("rect")
                        .attr("class","highlight-rect")

                    highlight_rect.attr("y", function(d){
                            return that.yScale((that.highlight_index * that.barMargin)) - 5;
                        })
                        .attr("x", function(d){
                            return that.xScale((that.maxTotalVal - d.breakupTotal) / 2) - 5;
                        })
                        .attr("width", function (d) {

                            return that.xScale(d.breakupTotal) + 10;
                        })
                        .attr("height", (that.barHeight + 5))
                        .attr("fill","none")
                        .attr("stroke", that.highlight_color)
                        .attr("stroke-width", "1.5px")
                        .attr("stroke-dasharray", "5,5")
                        .attr("stroke-opacity",1);
                    if(that.extended) {
                        highlight_rect.attr("x",-5)
                            .attr("width", (that.width- that.legendsGroup_width - that.margin_right - that.margin_left + 10))
                    }
                }
                return this;
            },
            durationLabel: function () {
                if(PykCharts.boolean(that.time_between_steps_text_size)) {
                    var duration_text_width = [];
                    var width = that.width - that.legendsGroup_width;
                    var right_labels = that.ticks_group.selectAll("text.right_label").data(that.new_data1);

                    right_labels.enter().append("svg:text").attr("class", "right_label");

                    right_labels
                        .attr("y", function(d, i){
                            return that.yScale((i * that.barMargin) + (that.barHeight * 1.5) + 5);
                        })
                        .attr("x", width)
                        .attr("text-anchor","start")
                        .text(function(d,i){
                            if(that.new_data1[i+1] === undefined){
                                return "";
                            }
                            return d.duration;
                        })
                        .text(function(d,i){
                            var x = this.getBBox().width
                            duration_text_width.push(x);
                            return d.duration;
                        })
                        .style("font-weight", that.time_between_steps_text_weight)
                        .style("font-size", that.time_between_steps_text_size + "px")
                        .attr("fill", that.time_between_steps_text_color)
                        .style("font-family", that.time_between_steps_text_family)
                        .attr("text-anchor","end");
                    }
                that.max_duration = d3.max(duration_text_width,function (d) { return d; });
                right_labels.exit().remove();
                return this;
            },
            legends : function () {
                if(PykCharts.boolean(that.legends_enable)) {
                    var k = 0;
                    var l = 0;

                    if(that.legends_display === "vertical" ) {
                        that.legendsGroup.attr("height", (that.new_data_length * 30)+20);
                        that.legendsGroup_height = 0;

                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        text_parameter1value = function (d,i) { return 36; };
                        rect_parameter3value = function (d,i) { return 20; };
                        var rect_parameter4value = function (d,i) { return (i * 24 + 12) + 7.5;};
                        var text_parameter2value = function (d,i) { return i * 24 + 23;};

                    } else if(that.legends_display === "horizontal") {
                        that.legendsGroup_height = 50;
                        final_rect_x = 0;
                        final_text_x = 0;
                        legend_text_widths = [];
                        sum_text_widths = 0;
                        temp_text = temp_rect = 0;
                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        
                        var text_parameter1value = function (d,i) {
                            legend_text_widths[i] = this.getBBox().width;
                            legend_start_x = 16;
                            final_text_x = (i === 0) ? legend_start_x : (legend_start_x + temp_text);
                            temp_text = temp_text + legend_text_widths[i] + 30;
                            return final_text_x;
                        };
                        text_parameter2value = 30;
                        var rect_parameter3value = function (d,i) {
                            final_rect_x = (i === 0) ? 0 : temp_rect;
                            temp_rect = temp_rect + legend_text_widths[i] + 30;
                            return final_rect_x;
                        };
                        rect_parameter4value = 18 + 7.5;
                    }
                    var len = that.new_data[0].breakup.length;
                    var legend = that.legendsGroup.selectAll(".circ")
                                    .data(that.new_data[0].breakup);

                    that.legends_text = that.legendsGroup.selectAll(".legends_text")
                        .data(that.new_data[0].breakup);

                    that.legends_text.enter()
                        .append('text')
                        .text(function (d) { 
                            that.filterList.push(d.name);
                            that.fullList.push(d.name);
                        })

                    that.legends_text.attr("class","legends_text")
                        .text(function (d) { 
                            return d.name;
                        })
                        .on("click", function(d){
                            if(that.legends_mode === "interactive" && that.mode === "default") {
                                that.toggleFilter(d.name);
                            }
                        })
                        .attr("fill", that.legends_text_color)
                        .attr("font-family", that.legends_text_family)
                        .attr("font-size",that.legends_text_size +"px")
                        .attr("font-weight", that.legends_text_weight)
                        .attr(text_parameter1, text_parameter1value)
                        .attr(text_parameter2, text_parameter2value);

                    legend.enter()
                        .append("circle");

                    legend.attr("cx", rect_parameter3value)
                        .attr("class","circ")
                        .attr("cy", rect_parameter4value)
                        .attr("r", 7.5)
                        .on("click", function(d){
                            if(that.legends_mode === "interactive" && that.mode === "default") {
                                that.toggleFilter(d.name);
                            }
                        })
                        .attr("style", function(d){
                            var fill = (that.filterList.indexOf(d.name) === -1) ? "#fff" : that.fillColor.colorPieMS(d);
                            if(that.filterList.length === 0) fill = that.fillColor.colorPieMS(d);
                            return "fill: "+ fill +"; stroke-width: 3px; stroke:" + that.fillColor.colorPieMS(d);
                        })
                        .attr("opacity", function (d,i) {
                            if(that.color_mode === "saturation") {
                                return (len-i)/len;
                            }
                            return 1;
                        });
                    if(that.legends_mode === "interactive") {
                        legend.style("cursor","pointer");
                        that.legends_text.style("cursor","pointer");
                    }
                    var legend_container_width = that.legendsGroup.node().getBBox().width, translate_x;
                    if(that.legends_display === "vertical") {
                        that.legendsGroup_width = legend_container_width + 20;
                    } else  {
                        that.legendsGroup_width = 0;
                    }
                    
                    translate_x = (that.legends_display === "vertical") ? (that.width - that.legendsGroup_width)  : (that.width - legend_container_width - 20);

                    if (legend_container_width < that.width) { that.legendsGroup.attr("transform","translate("+translate_x+",0)"); }
                    that.legendsGroup.style("visibility","visible");

                    that.legends_text.exit().remove();
                    legend.exit().remove();
                }
                return this;
            },
            dataMode : function () {
                if(PykCharts.boolean(that.data_mode_enable)) {
                    var options = [
                        {
                            "name": "Percentage",
                            "on": that.extended
                        },
                        {
                            "name": "Absolute",
                            "on": !that.extended
                        }
                    ];
                    that.legendsGroup_height = 50;
                    var texts = that.chart_mode_group.selectAll(".mode-text").data(options);
                    texts.enter().append("text")

                    texts.attr("class","mode-text")
                        .attr("fill", that.legends_text_color)
                        .attr("font-family", that.legends_text_family)
                        .attr("font-size",that.legends_text_size +"px")
                        .attr("font-weight", that.legends_text_weight)
                        .text(function(d,i){
                            return d.name;
                        })
                        .attr("transform", function(d, i){
                            return "translate(" + ((i*100) + 20) + ",30)";
                        })
                        .on("click", function(d,i){
                            that.extended = !that.extended;
                            that.draw();
                        });
                    var circles = that.chart_mode_group.selectAll(".mode-circ").data(options);
                    circles.enter().append("circle");

                    circles.attr("class","mode-circ")
                        .attr("cx", function(d,i){
                            return (i*100)+10;
                        })
                        .attr("cy",(18 + 7.5)).attr("r", 6)
                        .attr("style", function(d){
                            var fill = !d.on ? "#fff" : that.data_mode_legends_color;
                            return "fill: "+ fill +"; stroke-width: 3px; stroke:" + that.data_mode_legends_color;
                        })
                        .on("click", function(d,i){
                            if(that.mode === "default") {
                                that.extended = !that.extended;
                                that.draw();
                            }
                        });
                        texts.style("cursor","pointer");
                        circles.style("cursor","pointer");
                }
                return this;
            }
        };
        return optional;
    };
    that.filter = function(d){
        if(that.filterList.length < 1){
            that.filterList = jQuery.extend(true, [], that.fullList);
        }

        for(var i in d){
            var media = d[i].breakup;
            var newMedia = [];
            for(var j in media){
                if (jQuery.inArray(media[j].name, that.filterList) >= 0) newMedia.push(media[j]);
            }
            d[i].breakup = newMedia;
        }
        return d;
    };

    that.onlyFilter = function(f){
        var index = that.filterList.indexOf(f);
        if(that.filterList.length === 1 && index != -1){
            that.filterList = [];
        }else{
            that.filterList = [];
            that.filterList.push(f);
        }
        this.draw();
    };

    that.toggleFilter = function(f){
        var index = that.filterList.indexOf(f);
        if(index === -1){
            that.filterList.push(f);
        }else{
            that.filterList.splice(index, 1);
        }
        that.draw();
    };
    that.totalInBreakup = function(breakup){
        var total = 0;
        for(var i in breakup) total += breakup[i].count; // Add all the counts in breakup to total
        return total;
    };

    that.maxTotal = function(d){
        var totals = [];
        for(var i in d) totals.push(d[i].breakupTotal); // Get all the breakupTotals in an Array
        totals = totals.sort(function(a,b){return a - b;}); // Sort them in ascending order
        return totals[totals.length - 1]; // Give the last one
    };

    that.parseData = function(d){
        for(var i in d) d[i].breakupTotal = this.totalInBreakup(d[i].breakup); // Calculate all breakup totals and add to the hash
        return d;
    };
};