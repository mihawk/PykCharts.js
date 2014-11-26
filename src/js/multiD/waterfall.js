PykCharts.multiD.waterfall = function(options){
	var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    var multiDimensionalCharts = theme.multiDimensionalCharts;

	this.execute = function () {
        that = new PykCharts.multiD.processInputs(that, options, "waterfall");
		
		that.grid_y_enable =  options.chart_grid_y_enable ? options.chart_grid_y_enable.toLowerCase() : theme.stylesheet.chart_grid_y_enable;
        that.grid_color = options.chart_grid_color ? options.chart_grid_color : theme.stylesheet.chart_grid_color;
        that.panels_enable = "no";
        
        if(that.stop)
            return;

        if(that.mode === "default") {
           that.k.loading();
        }
        that.multiD = new PykCharts.multiD.configuration(that);
        that.format = that.k.dataSourceFormatIdentification(options.data);
        d3[that.format](options.data, function(e, data){
			var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(that.selector+" #chart-loader").remove();
                return;
            }

            that.data = that.k.__proto__._groupBy("bar",data);
            that.compare_data = that.k.__proto__._groupBy("bar",data);
            console.log(that.data,"*******",options);

            PykCharts.multiD.waterfallFunctions(options,that,"waterfall");
            that.render();
		});
	};
};

PykCharts.multiD.waterfallFunctions = function (options,chartObject,type) {
    var that = chartObject;
    
    that.render = function() {
    	var that = this;
    	var l = $(".svgContainer").length;
        that.container_id = "svgcontainer" + l;

        that.data = that.dataTransformation();

        var fD = that.flattenData();
        that.the_bars = fD[0];
        that.the_keys = fD[1];

    	if (that.mode === "default") {

    		that.k.title()
    			.backgroundColor(that)
    			.export(that, "#"+that.container_id,"waterfall")
    			.subtitle()
    			.makeMainDiv(that.selector,1);
    		
    		that.optionalFeatures()
                .svgContainer(1);

            that.k.liveData(that)
                .tooltip()
                .createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

           	that.optionalFeatures()
                .createChart()
                .ticks();
    	}
    };

    that.optionalFeatures = function () {
    	var that = this;
    	var optional = {
    		svgContainer: function (i) {
                $(that.selector).attr("class","PykCharts-twoD");
                that.svgContainer = d3.select(options.selector + " #tooltip-svg-container-" + i)
                    .append("svg:svg")
                    .attr("width",that.width )
                    .attr("height",that.height)
                    .attr("id",that.container_id)
                    .attr("class","svgcontainer")
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height);

                return this;
            },
            createChart: function () {
				var w = that.width - that.margin_left - that.margin_right - that.legendsGroup_width,
		            j = that.no_of_groups + 1,
		            h = that.height - that.margin_top - that.margin_bottom - that.legendsGroup_height;

                var the_bars = that.the_bars;
                var keys = that.the_keys;

                var x_data = [];
                
                that.yScale = d3.scale.ordinal()
                    .domain(the_bars.map(function(e, i){
                        return e.id || i; // Keep the ID for bars and numbers for integers
                    }))
                    .rangeBands([0,h]);

                that.x_tick_values = that.k.processXAxisTickValues();
                var min_x_tick_value,max_x_tick_value;

                var x_domain = [0,d3.max(x_data)];
                x_domain = that.k.__proto__._domainBandwidth(x_domain,1);

                min_x_tick_value = d3.min(that.x_tick_values);
                max_x_tick_value = d3.max(that.x_tick_values);

                if(x_domain[0] > min_x_tick_value) {
                    x_domain[0] = min_x_tick_value;
                }
                if(x_domain[1] < max_x_tick_value) {
                    x_domain[1] = max_x_tick_value;
                }

                that.xScale = d3.scale.linear().domain(x_domain).range([0, w]);

                var group_arr = [];

                for(var i in groups){
                    var g = groups[i];
                    var y = that.yScale(g[0]);
                    var totalHeight = that.yScale.rangeBand() * g.length;
                    y = y + (totalHeight/2);
                    group_arr.push({y: y, name: i});
                }
                that.domain = group_arr.map(function (d) {
                    return d.name;
                });
                that.y0 = d3.scale.ordinal()
                    .domain(group_arr.map(function (d,i) { return d.name; }))
                    .rangeRoundBands([0, h], 0.1);

                that.y1 = d3.scale.ordinal()
                    .domain(that.barName.map(function(d) { return d; }))
                    .rangeRoundBands([0, that.y0.rangeBand()]) ;

                that.y_factor = 0;
                that.height_factor = 0;
                if(that.no_of_groups === 1) {
                    that.y_factor = that.yScale.rangeBand()/4;
                    that.height_factor = (that.yScale.rangeBand()/(2*that.no_of_groups));
                };
                that.highlight_y_positions = [];
                that.highlight_x_positions = [];


                that.bars = that.group.selectAll(".bars")
                    .data(that.layers);

                that.bars.enter()
                        .append("g")
                        .attr("class", "bars");

                var rect = that.bars.selectAll("rect")
                    .data(function(d,i){
                        return d.values;
                    });

                rect.enter()
                    .append("svg:rect")
                    .attr("class","rect")
                rect.attr("width", 0).attr("x", 0)
                    .attr("fill", function(d,i){
                        if(that.no_of_groups === 1) {
                            return that.fillColor.colorPieMS(d);
                        } else {
                            return that.fillColor.colorGroup(d);
                        }
                    })
                    .attr("fill-opacity", function (d,i) {
                        if (that.color_mode === "saturation"){
                            if(j>1){
                                j--;
                                return j/that.no_of_groups;
                            } else {
                                j = that.no_of_groups+1;
                                j--;
                                return j/that.no_of_groups;
                            }
                        } else {
                            return 1;
                        }
                    })
                    .attr("data-fill-opacity",function () {
                        return $(this).attr("fill-opacity");
                    })
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-dasharray", that.border.style())
                    .attr("stroke-opacity",1)
                    .on('mouseover',function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(d.tooltip ? d.tooltip : d.y);
                            that.mouseEvent.axisHighlightShow(d.name,options.selector + " .axis-text",that.domain,"bar");
                            if(PykCharts.boolean(that.onhover_enable)) {
                                that.mouseEvent.highlight(options.selector + " .rect", this);
                            }
                        }
                    })
                    .on('mouseout',function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipHide(d);
                            that.mouseEvent.axisHighlightHide(options.selector + " .axis-text","bar");
                            if(PykCharts.boolean(that.onhover_enable)) {
                                that.mouseEvent.highlightHide(options.selector + " .rect")
                            }
                        }
                    })
                    .on('mousemove', function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    });

                rect
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("x", function(d){
                        return that.xScale(d.x0);
                    })
                    .attr("width", function(d){
                        if(that.highlight.toLowerCase() === d.name.toLowerCase()) {
                            that.highlight_x_positions.push(that.xScale(d.x));
                        }
                        return that.xScale(d.x);
                    })
                    .attr("height", function(d){
                        return that.yScale.rangeBand()+that.height_factor;
                    })
                    .attr("y", function(d){
                        if(that.highlight.toLowerCase() === d.name.toLowerCase()) {
                            that.highlight_y_positions.push(that.yScale(d.y)-that.y_factor);
                        }
                        return that.yScale(d.y)-that.y_factor;
                    });

                that.bars.exit()
                    .remove();

                if(PykCharts.boolean(that.axis_y_enable)) {
                    var yAxis_label = that.group.selectAll("text.axis-text")
                        .data(group_arr);

                    yAxis_label.enter()
                            .append("text")

                    yAxis_label.attr("class", "axis-text")
                            .attr("y", function(d){
                                return d.y;
                            })
                            .attr("x", function(d){
                                return -10;
                            })
                            .style("font-size",that.axis_y_pointer_size + "px")
                            .style("fill",that.axis_y_pointer_color)
                            .style("font-weight",that.axis_y_pointer_weight)
                            .style("font-family",that.axis_y_pointer_family)

                            .text(function(d){
                                return d.name;
                            })
                            .text(function (d) {
                                if(this.getBBox().width > (0.8*that.margin_left)) {
                                    return d.name.substr(0,2) + "..";
                                } else {
                                    return d.name;
                                }
                            })
                            .on('mouseover',function (d) {
                                that.mouseEvent.tooltipPosition(d);
                                that.mouseEvent.tooltipTextShow(d.name);
                            })
                            .on('mouseout',function (d) {
                                that.mouseEvent.tooltipHide(d);
                            })
                            .on('mousemove', function (d) {
                                that.mouseEvent.tooltipPosition(d);
                            });
                    if(that.axis_y_position === "right") {
                        yAxis_label.attr("x", function () {
                            return (that.width-that.margin_left-that.margin_right-that.legendsGroup_width) + 10;
                        });
                    }
                    if(that.axis_y_position === "left" && that.axis_y_pointer_position === "right") {
                        yAxis_label.attr("x", function (d) {
                            return 10;
                        });
                    }
                    if(that.axis_y_position === "right" && that.axis_y_pointer_position === "left") {
                        yAxis_label.attr("x", function (d) {
                            return (that.width-that.margin_left-that.margin_right-that.legendsGroup_width) - 10;
                        });
                    }
                    if(that.axis_y_pointer_position === "right") {
                        yAxis_label.attr("text-anchor","start");
                    } else if(that.axis_y_pointer_position === "left") {
                        yAxis_label.attr("text-anchor","end");
                    }
                    yAxis_label.exit().remove();
                }
                return this;
            }
    	};
    	return optional;
    };

    that.dataTransformation = function () {

        var data_tranform = [];
        that.barName = [];

        var data_length = that.data.length;
        that.unique_group = _.uniq(that.data, function (d) {
            return d.group;
        });

        for(var i=0; i < data_length; i++) {
            var group = {},
                bar = {},
                stack;

            if(!that.data[i].group) {
                that.data[i].group = "group" + i;
            }

            if(!that.data[i].stack) {
                that.data[i].stack = "stack";
            }

            that.barName[i] = that.data[i].group;
            group[that.data[i].y] = [];
            bar[that.data[i].group] = [];
            stack = { "name": that.data[i].stack, "tooltip": that.data[i].tooltip, "color": that.data[i].color, "val": that.data[i].x/*, highlight: that.data[i].highlight */};
            if(i === 0) {
                data_tranform.push(group);
                data_tranform[i][that.data[i].y].push(bar);
                data_tranform[i][that.data[i].y][i][that.data[i].group].push(stack);

            } else {
                var data_tranform_lenght = data_tranform.length;
                var j=0;
                for(j=0;j < data_tranform_lenght; j++) {
                    if ((_.has(data_tranform[j], that.data[i].y))) {
                        var barr = data_tranform[j][that.data[i].y];
                        var barLength = barr.length;
                        var k = 0;
                        for(k =0; k<barLength;k++) {
                            if(_.has(data_tranform[j][that.data[i].y][k],that.data[i].group)) {
                                break;
                            }
                        }
                        if(k < barLength) {
                            data_tranform[j][that.data[i].y][k][that.data[i].group].push(stack);
                        } else {
                            data_tranform[j][that.data[i].y].push(bar);
                            data_tranform[j][that.data[i].y][k][that.data[i].group].push(stack);
                        }
                        break;
                    }
                }
                if(j === data_tranform_lenght) {
                    data_tranform.push(group);
                    data_tranform[j][that.data[i].y].push(bar);
                    data_tranform[j][that.data[i].y][0][that.data[i].group].push(stack);
                }
            }
        }
        that.barName = _.unique(that.barName);
        return data_tranform;
    };

    that.flattenData = function(){
        var the_bars = [-1];
        that.keys = {};
        for(var i=0; i<that.data.length; i++) {
            var d = that.data[i];
            for(var cat_name in d){
                for(var j = 0; j < d[cat_name].length; j++) {
                    var id = "i" + i + "j" + j;
                    if(typeof d[cat_name][j] !== "object"){
                        continue;
                    }
                    var key = Object.keys(d[cat_name][j])[0];
                    that.keys[id] = key;
                    d[cat_name][j].id = id;
                    d[cat_name][j].group = cat_name;

                    the_bars.push(d[cat_name][j]);
                }
                the_bars.push(i); // Extra seperator element for gaps in segments
            }
        }
        return [the_bars, that.keys];
    };
};