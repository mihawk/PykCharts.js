PykCharts.multiD.area = function (options){
	var that = this;
	var theme = new PykCharts.Configuration.Theme({});

	this.execute = function (){
		that = new PykCharts.multiD.processInputs(that, options, "area");

		if(that.stop) {
			return;
		}

		if(that.mode === "default") {
			that.k.loading();
		}

		var multiDimensionalCharts = theme.multiDimensionalCharts,
			stylesheet = theme.stylesheet,
			optional = options.optional;

	    that.crosshair_enable = options.crosshair_enable ? options.crosshair_enable.toLowerCase() : multiDimensionalCharts.crosshair_enable;
		that.curvy_lines_enable = options.curvy_lines_enable ? options.curvy_lines_enable.toLowerCase() : multiDimensionalCharts.curvy_lines_enable;
	  	that.panels_enable = "no";
	  	that.interpolate = PykCharts['boolean'](that.curvy_lines_enable) ? "cardinal" : "linear";
		that.w = that.chart_width - that.margin_left - that.margin_right;
		that.h = that.chart_height - that.margin_top - that.margin_bottom;

		that.executeData = function (data) {
			var validate = that.k.validator().validatingJSON(data),
                id = that.selector.substring(1,that.selector.length);
            if(that.stop || validate === false) {
                that.k.remove_loading_bar(id);
                return;
            }

			that.data = that.k.__proto__._groupBy("area",data);
			that.axis_y_data_format = "number";
    		that.axis_x_data_format = that.k.xAxisDataFormatIdentification(that.data);
    		if(that.axis_x_data_format === "time" && that.axis_x_time_value_datatype === "") {
    			console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to have passed Date data so please pass the value for axis_x_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
    		}
			that.compare_data = that.data;
			that.data_length = that.data.length;
            that.k.remove_loading_bar(id);

			if (that.axis_x_data_format === "string") {
                that.data_sort_enable = "no";                
            }
            else {
                that.data_sort_enable = "yes";
                that.data_sort_type = (that.axis_x_data_format === "time") ? "date" : "numerically";
                that.data_sort_order = "ascending";
            }
			PykCharts.multiD.areaFunctions(options,that,"area");
			that.dataTransformation();
			that.render();

		}
		that.k.dataSourceFormatIdentification(options.data,that,"executeData");
		
	};
};

PykCharts.multiD.stackedArea = function (options){
	var that = this;
	var theme = new PykCharts.Configuration.Theme({});

	this.execute = function (){
		that = new PykCharts.multiD.processInputs(that, options, "area");

		if(that.stop) {
			return;
		}

		if(that.mode === "default") {
			that.k.loading();
		}

		var multiDimensionalCharts = theme.multiDimensionalCharts,
			stylesheet = theme.stylesheet,
			optional = options.optional;

	    that.crosshair_enable = options.crosshair_enable ? options.crosshair_enable.toLowerCase() : multiDimensionalCharts.crosshair_enable;
		that.curvy_lines_enable = options.curvy_lines_enable ? options.curvy_lines_enable.toLowerCase() : multiDimensionalCharts.curvy_lines_enable;
	  	that.panels_enable = "no";
	  	that.interpolate = PykCharts['boolean'](that.curvy_lines_enable) ? "cardinal" : "linear";
		that.w = that.chart_width - that.margin_left - that.margin_right;
		that.h = that.chart_height - that.margin_top - that.margin_bottom;

		that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data),
                id = that.selector.substring(1,that.selector.length);
                
            if(that.stop || validate === false) {
                that.k.remove_loading_bar(id);
                return;
            }

			that.data = that.k.__proto__._groupBy("area",data);
			that.axis_y_data_format = "number";
    		that.axis_x_data_format = that.k.xAxisDataFormatIdentification(that.data);
    		if(that.axis_x_data_format === "time" && that.axis_x_time_value_datatype === "") {
    			console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to have passed Date data so please pass the value for axis_x_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
    		}
			that.compare_data = that.data;
			that.data_length = that.data.length;
            that.k.remove_loading_bar(id);			
			if (that.axis_x_data_format === "string") {
                that.data_sort_enable = "no";                
            }
            else {
                that.data_sort_enable = "yes";
                that.data_sort_type = (that.axis_x_data_format === "time") ? "date" : "numerically";
                that.data_sort_order = "ascending";
            }
			PykCharts.multiD.areaFunctions(options,that,"stacked_area");
			that.dataTransformation();
			that.render();
		};
		that.k.dataSourceFormatIdentification(options.data,that,"executeData");
	};
};

PykCharts.multiD.areaFunctions = function (options,chartObject,type) {
	var that = chartObject;
	
	that.dataTransformation = function () {
        that.group_arr = [], that.new_data = [];
        that.ticks = [], that.x_arr = [];

        for(var j = 0;j < that.data_length;j++) {
            that.group_arr[j] = that.data[j].name;
        }
        that.uniq_group_arr = that.k.__proto__._unique(that.group_arr);
        that.uniq_color_arr = [];
        var uniq_group_arr_length = that.uniq_group_arr.length;

        for(var k = 0;k < that.data_length;k++) {
            that.x_arr[k] = that.data[k].x;
        }
        that.uniq_x_arr = that.k.__proto__._unique(that.x_arr);

        for (var k = 0;k < uniq_group_arr_length;k++) {
            if(that.chart_color[k]) {
                that.uniq_color_arr[k] = that.chart_color[k];
            } else {
                for (var l = 0;l < that.data_length;l++) {
                    if (that.uniq_group_arr[k] === that.data[l].name && that.data[l].color) {
                        that.uniq_color_arr[k] = that.data[l].color;
                        break;
                    }
                } if(!PykCharts['boolean'](that.uniq_color_arr[k])) {
                    that.uniq_color_arr[k] = that.default_color[0];
                }
            }
        }

        that.flag = 0;
        for (var k = 0;k < uniq_group_arr_length;k++) {
            that.new_data[k] = {
                    name: that.uniq_group_arr[k],
                    data: [],
                    color: that.uniq_color_arr[k]
            };
            for (var l = 0;l < that.data_length;l++) {
                if (that.uniq_group_arr[k] === that.data[l].name) {
                    that.new_data[k].data.push({
                        x: that.data[l].x,
                        y: that.data[l].y,
                        tooltip: that.data[l].tooltip,
                        annotation: that.data[l].annotation || ""
                    });
                }
            }
        }

        that.new_data_length = that.new_data.length;
        var uniq_x_arr_length = that.uniq_x_arr.length;

        for (var a = 0;a < that.new_data_length;a++) {
            var uniq_x_arr_copy = that.k.__proto__._unique(that.x_arr)
            ,	every_data_length = that.new_data[a].data.length
            for(var b = 0;b < every_data_length;b++) {
                for(var k = 0;k < uniq_x_arr_length;k++) {
                    if(that.new_data[a].data[b].x === uniq_x_arr_copy[k]) {
                        uniq_x_arr_copy[k] = undefined;
                        break;
                    }
                }
            }
            for (var i = 0; i < uniq_x_arr_length ; i++) {
                if (uniq_x_arr_copy[i] != undefined) {
                    var temp_obj_to_insert_in_new_data = {
                        x: uniq_x_arr_copy[i],
                        y: 0,
                        tooltip: 0,
                        annotation: ""
                    };
                    that.new_data[a].data.splice(i, 0, temp_obj_to_insert_in_new_data);
                }
            }
        }
        for (var k = 0;k < that.new_data_length;k++) {
            that.new_data[k].data = that.k.__proto__._sortData(that.new_data[k].data, "x", "name", that);
        }
    };
	
	that.render = function () {
		that.dataLineGroup = [], that.dataLineGroupBorder = [];
		that.multid = new PykCharts.multiD.configuration(that);
		that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);
		that.transitions = new PykCharts.Configuration.transition(that);
		that.border = new PykCharts.Configuration.border(that);
		that.xdomain = [];
		that.optional_feature()
		    .chartType();

		try {
			if(that.type === "stackedAreaChart" && type === "area" ) {
				throw "Invalid data in the JSON";
			}

		}
		catch (err) {
            console.error('%c[Error - Pykih Charts] ', 'color: red;font-weight:bold;font-size:14px', " at "+that.selector+".\""+err+"\"  Visit www.chartstore.io/docs#error_7");					
         	return;   
		}
		if(that.axis_x_data_format === "time") {
			for(var i = 0;i<that.new_data_length;i++) {
	          	that.new_data[i].data.forEach(function (d) {
		          	d.x = that.k.dateConversion(d.x);
		          	that.xdomain.push(d.x);
	          	});
	          	that.data.forEach(function (d) {
		          	d.x =that.k.dateConversion(d.x);
          		});
	        }
	    }

		if(that.mode === "default") {

			that.k.title()
					.backgroundColor(that)
					.export(that,"#svg-1","areaChart")
					.liveData(that)
					.emptyDiv()
					.subtitle()
					.makeMainDiv(that.selector,1)
					.tooltip(true,that.selector,1);

			that.renderChart();

			that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
					.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
					.yGrid(that.svgContainer,that.group,that.yScale,that.legendsGroup_width)
					.xGrid(that.svgContainer,that.group,that.xScale,that.legendsGroup_height)
					.xAxisTitle(that.xGroup,that.legendsGroup_height,that.legendsGroup_width)
					.yAxisTitle(that.yGroup)
					.createFooter()
	                .lastUpdatedAt()
	                .credits()
	                .dataSource();

	        if(PykCharts['boolean'](that.annotation_enable)) {
	        	that.annotation();
	        }
		}
		else if(that.mode === "infographics") {
			  that.k/*.liveData(that)*/
			  			.backgroundColor(that)
			  			.export(that,"#svg-1","areaChart")
			  			.emptyDiv()
						.makeMainDiv(that.selector,1);

			  that.optional_feaure()
						.svgContainer(1)
						.legendsContainer()
						.createGroups(1)
						.createChart()
			    		.axisContainer();

		    that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
					.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
					.xAxisTitle(that.xGroup,that.legendsGroup_height,that.legendsGroup_width)
					.yAxisTitle(that.yGroup);
  		}
		that.k.exportSVG(that,"#svg-1","areaChart")
  		that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

  		var resize = that.k.resize(that.svgContainer);
        that.k.__proto__._ready(resize);
        window.addEventListener('resize', function(event){
			return that.k.resize(that.svgContainer);
        });
	};

	that.refresh = function () {
		that.xdomain = [];
		that.executeRefresh = function (data) {
			that.data = that.k.__proto__._groupBy("area",data);
			that.data_length = that.data.length;
			that.dataTransformation();
			var compare = that.k.checkChangeInData(that.data,that.compare_data);
			that.compare_data = compare[0];
			var data_changed = compare[1];

			if(data_changed) {
				that.k.lastUpdatedAt("liveData");
				that.mouseEvent.tooltipHide();
				that.mouseEvent.crossHairHide(that.type);
				that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
				that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
			}
			if(that.axis_x_data_format === "time") {
				for(var i = 0;i<that.new_data_length;i++) {
		          	that.new_data[i].data.forEach(function (d) {
			          	d.x = that.k.dateConversion(d.x);
			          	that.xdomain.push(d.x);
		          	});
		          	that.data.forEach(function (d) {
			          	d.x =that.k.dateConversion(d.x);
	          		});
		        }
		    }
			if(that.type === "stackedAreaChart") {
				document.querySelector(that.selector +" #tooltip-svg-container-1").innerHTML = null;
				that.renderChart();
			}
			else {
				that.optional_feature().createChart("liveData");
			}

			that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
					.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
					.yGrid(that.svgContainer,that.group,that.yScale,that.legendsGroup_width)
					.xGrid(that.svgContainer,that.group,that.xScale,that.legendsGroup_height)
					.tooltip(true,that.selector);

			if(PykCharts['boolean'](that.annotation_enable)) {
	        	that.annotation();
	        }
		};
		that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
	};

	that.optional_feature = function (){
		var id = that.selector.substring(1,that.selector.length);
		var optional = {
			chartType: function () {
				for(var j = 1;j < that.data_length;j++) {
					if(that.data[0].x === that.data[j].x) {
						that.type = "stackedAreaChart";
						break;
					}
				}
				that.type = that.type || "areaChart";
				return this;
			},
			svgContainer: function (i){
				document.getElementById(id).className = "PykCharts-twoD PykCharts-multi-series2D PykCharts-line-chart";

				that.svgContainer = d3.select(that.selector+" "+"#tooltip-svg-container-"+i).append("svg:svg")
					.attr({
						"id": "svg-"+i,
						"width": that.chart_width,
						"height": that.chart_height,
						"class": "svgcontainer",
						"preserveAspectRatio": "xMinYMin",
	                    "viewBox": "0 0 " + that.chart_width + " " + that.chart_height
					});
    			return this;
			},
			createGroups : function (i) {
				that.group = that.svgContainer.append("g")
					.attr({
						"id": "chartsvg",
						"transform": "translate("+ that.margin_left +","+ (that.margin_top + that.legendsGroup_height)+")"
					});

				if(PykCharts['boolean'](that.chart_grid_y_enable)){
					that.group.append("g")
						.attr({
							"id": "ygrid",
							"class": "y grid-line"
						});
				}
				if(PykCharts['boolean'](that.chart_grid_x_enable)){
					that.group.append("g")
						.attr({
							"id": "xgrid",
							"class": "x grid-line"
						});
				}

				that.clip = that.svgContainer.append("svg:clipPath")
				    .attr("id","clip" + i + that.selector)
				    .append("svg:rect")
				    .attr({
				    	"width": that.w - that.legendsGroup_width,
				    	"height": that.h - that.legendsGroup_height
				    });

				that.chartBody = that.svgContainer.append("g")
					.attr({
						"id": "clipPath",
						"clip-path": "url(#clip" + i + that.selector + " )",
						"transform": "translate("+ that.margin_left +","+ (that.margin_top+that.legendsGroup_height) +")"
					});

				that.stack_layout = d3.layout.stack()
					.values(function(d) { return d.data; });

    			return this;
			},
			legendsContainer : function (i) {
                if (PykCharts['boolean'](that.legends_enable) && that.type === "stackedAreaChart" && that.mode === "default") {
                    that.legendsGroup = that.svgContainer.append("g")
                                .attr('id',"legends")
                                .style("visibility","visible")
                                .attr("transform","translate(0,10)");
                } else {
                    that.legendsGroup_height = 0;
                    that.legendsGroup_width = 0;
                }
                return this;
            },
			axisContainer : function () {
	        	if(PykCharts['boolean'](that.axis_x_enable) || options.axis_x_title){
					that.xGroup = that.group.append("g")
							.attr({
								"id": "xaxis",
								"class": "x axis"
							});
				}
				if(PykCharts['boolean'](that.axis_y_enable) || options.axis_y_title){
					that.yGroup = that.group.append("g")
						.attr({
							"id": "yaxis",
							"class": "y axis"
						});
				}
	        	return this;
      		},
			createChart : function (evt) {

				that.legend_text = [];

				that.layers = that.stack_layout(that.new_data);

        		var x_domain,x_data = [],y_data,y_range,x_range,y_domain, min_x_tick_value,max_x_tick_value, min_y_tick_value,max_y_tick_value;
        		that.count = 1;

        		that.x_tick_values = that.k.processXAxisTickValues();
                that.y_tick_values = that.k.processYAxisTickValues();

				if(that.axis_y_data_format === "number") {
					max = d3.max(that.layers, function(d) { return d3.max(d.data, function(k) { return k.y0 + k.y; }); });
					min = 0;
         			y_domain = [min,max];
		          	y_data = that.k.__proto__._domainBandwidth(y_domain,1);
					y_range = [that.h - that.legendsGroup_height, 0];

					min_y_tick_value = d3.min(that.y_tick_values);
                    max_y_tick_value = d3.max(that.y_tick_values);

                    if(y_data[0] > min_y_tick_value) {
                        y_data[0] = min_y_tick_value;
                    }
                    if(y_data[1] < max_y_tick_value) {
                        y_data[1] = max_y_tick_value;
                    }

		          	that.yScale = that.k.scaleIdentification("linear",y_data,y_range);
		        }
		        else if(that.axis_y_data_format === "string") {
		          	that.new_data[0].data.forEach(function(d) { y_data.push(d.y); });
		          	y_range = [0,that.h];
		          	that.yScale = that.k.scaleIdentification("ordinal",y_data,y_range,0);
		        }
		        else if (that.axis_y_data_format === "time") {
		          	that.layers.data.forEach(function (k) {
		          		k.y0 = new Date(k.y0);
		          		k.y = new Date(k.y);
		          	});
		          	max = d3.max(that.layers, function(d) { return d3.max(d.data, function(k) { return k.y0 + k.y; }); });
					min = 0;
		         	y_data = [min,max];
		          	y_range = [that.h, 0];

	          	    min_y_tick_value = d3.min(that.y_tick_values, function (d) {
                        return new Date(d);
                    });

                    max_y_tick_value = d3.max(that.y_tick_values, function (d) {
                        return new Date(d);
                    });

                    if(new Date(y_data[0]) > new Date(min_y_tick_value)) {
                        y_data[0] = min_y_tick_value;
                    }
                    if(new Date(y_data[1]) < new Date(max_y_tick_value)) {
                        y_data[1] = max_y_tick_value;
                    }

		          	that.yScale = that.k.scaleIdentification("time",y_data,y_range);

		        }
		        if(that.axis_x_data_format === "number") {
        			max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return k.x; }); });
					min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return k.x; }); });
         			x_domain = [min,max];
			        x_data = that.k.__proto__._domainBandwidth(x_domain,2);
			        x_range = [0 ,that.w - that.legendsGroup_width];

		            min_x_tick_value = d3.min(that.x_tick_values);
                    max_x_tick_value = d3.max(that.x_tick_values);

                    if(x_data[0] > min_x_tick_value) {
                        x_data[0] = min_x_tick_value;
                    }
                    if(x_data[1] < max_x_tick_value) {
                        x_data[1] = max_x_tick_value;
                    }

			        that.xScale = that.k.scaleIdentification("linear",x_data,x_range);
			        that.extra_left_margin = 0;
			        that.new_data[0].data.forEach(function (d) {
                        that.xdomain.push(d.x);
                    })
		        }
		        else if(that.axis_x_data_format === "string") {
		          	that.new_data[0].data.forEach(function(d) { x_data.push(d.x); });
		          	x_range = [0 ,that.w - that.legendsGroup_width];
		          	that.xScale = that.k.scaleIdentification("ordinal",x_data,x_range,0);
		          	that.extra_left_margin = (that.xScale.rangeBand() / 2);
		          	that.xdomain = that.xScale.domain()
		        }
		        else if (that.axis_x_data_format === "time") {
		        	max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return k.x; }); });
					min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return k.x; }); });
		         	x_data = [min,max];
		          	x_range = [0 ,that.w - that.legendsGroup_width];

	          	    min_x_tick_value = d3.min(that.x_tick_values, function (d) {
                        return that.k.dateConversion(d);
                    });

                    max_x_tick_value = d3.max(that.x_tick_values, function (d) {
                        return that.k.dateConversion(d);
                    });

                    if(new Date(x_data[0]) > new Date(min_x_tick_value)) {
                        x_data[0] = min_x_tick_value;
                    }
                    if(new Date(x_data[1]) < new Date(max_x_tick_value)) {
                        x_data[1] = max_x_tick_value;
                    }

		          	that.xScale = that.k.scaleIdentification("time",x_data,x_range);
		          	
		          	that.extra_left_margin = 0;
		          	that.new_data[0].data.forEach(function (d) {
                        that.xdomain.push(d.x);
                    })
		        }
		        that.ydomain = that.yScale.domain();
				that.zoom_event = d3.behavior.zoom();

		      	if(!(that.axis_y_data_format==="string" || that.axis_x_data_format==="string")) {
		      		that.zoom_event.x(that.xScale)
					    .y(that.yScale)
					    .scale(that.count)
					    .on("zoom",that.zoomed);
				} else {
					that.zoom_event.y(that.yScale)
					    .scale(that.count)
					    .on("zoom",that.zoomed);
				}

				if(PykCharts['boolean'](that.zoom_enable) && (that.mode === "default")) {
					that.svgContainer.call(that.zoom_event);
					that.svgContainer.on({
						"wheel.zoom": null,
                    	"mousewheel.zoom": null
					});
				}

				that.chart_path = d3.svg.area()
				    .x(function(d) { return that.xScale(d.x); })
				    .y0(function(d) { return that.yScale(d.y0); })
    				.y1(function(d) { return that.yScale(d.y0 + d.y); })
				    .interpolate(that.interpolate);

				that.chart_path_border = d3.svg.line()
				    .x(function(d) { return that.xScale(d.x); })
				    .y(function(d) { return that.yScale(d.y0 + d.y); })
				    .interpolate(that.interpolate);

				that.chartPathClass = (that.type === "areaChart") ? "area" : "stacked-area";

	        	if(evt === "liveData") {
	        		for (var i = 0;i < that.new_data_length;i++) {
	        			var data = that.new_data[i].data;
	        			type = that.chartPathClass + i;

	        			that.svgContainer.select("#"+type)
							.datum(that.layers[i].data)
							.attr("transform", "translate("+ that.extra_left_margin +",0)");/*
							.style({
								"stroke": that.border.color(),
			                    "stroke-width": that.border.width(),
			                    "stroke-dasharray": that.border.style()
							});*/

						// function transition1 (i) {
						//     that.dataLineGroup[i].transition()
						// 	    .duration(that.transitions.duration())
						// 	    .attrTween("d", function (d) {
						// 	    	var interpolate = d3.scale.quantile()
						//                 .domain([0,1])
						//                 .range(d3.range(1, data.length + 1));
						// 	        return function(t) {
						// 	            return that.chart_path(that.new_data[i].data.slice(0, interpolate(t)));
						// 	        };
						// 	    });
						// }

						// transition1(i);

						// that.svgContainer.select("#border-stacked-area"+i)
						// 	.datum(that.layers[i].data)
						// 	.attr("transform", "translate("+ that.extra_left_margin +",0)");

					 //    function borderTransition1 (i) {
						//     that.dataLineGroupBorder[i].transition()
						// 	    .duration(that.transitions.duration())
						// 	    .attrTween("d", function (d) {
						// 	    	var interpolate = d3.scale.quantile()
						//                 .domain([0,1])
						//                 .range(d3.range(1, that.layers[i].data.length + 1));
						// 	        return function(t) {
						// 	            return that.chart_path_border(that.layers[i].data.slice(0, interpolate(t)));
						// 	        };
						// 	    })
						// }
						// borderTransition1(i);
					}
					if(that.type === "areaChart") {
						that.svgContainer
							.on('mouseout',function (d) {
			          			that.mouseEvent.tooltipHide();
			          			that.mouseEvent.crossHairHide(that.type);
								that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
								that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
		          			})
							.on("mousemove", function(){
								that.mouseEvent.crossHairPosition(that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.extra_left_margin,that.xdomain,that.type,that.tooltip_mode);
					  		});
					}
				}
				else {
					for (var i = 0;i < that.new_data_length;i++) {
						var data = that.new_data[i].data;
						type = that.chartPathClass + i;
						that.dataLineGroup[i] = that.chartBody.append("path");
						that.dataLineGroup[i]
							.datum(that.layers[i].data)
							.attr({
								"class": that.chartPathClass,
								"id": type,
								"fill-opacity": function() {
									if(that.type === "stackedAreaChart" && that.color_mode === "saturation") {
										return (i+1)/that.new_data.length;
									}
								},
								"data-fill-opacity": function () {
			                        return d3.select(this).attr("fill-opacity");
			                    },
								"transform": "translate("+ that.extra_left_margin +",0)"
							})
							.style("fill", function(d) {
								return that.fillColor.colorPieMS(that.new_data[i],that.type);
							});

						function transition (i) {
						    that.dataLineGroup[i].transition()
							    .duration(that.transitions.duration())
							    .attrTween("d", function (d) {
							    	var interpolate = d3.scale.quantile()
						                .domain([0,1])
						                .range(d3.range(1, data.length + 1));
							        return function(t) {
							            return that.chart_path(that.new_data[i].data.slice(0, interpolate(t)));
							        };
							    });
						}
						transition(i);

						that.dataLineGroupBorder[i] = that.chartBody.append("path");
						that.dataLineGroupBorder[i]
							.datum(that.layers[i].data)
							.attr({
								"class": "area-border",
								"id": "border-stacked-area"+i,
								"transform": "translate("+ that.extra_left_margin +",0)"
							})
							.style({
								"stroke": that.border.color(),
			                    "stroke-width": that.border.width(),
			                    "stroke-dasharray": that.border.style(),
			                    "pointer-events": "none"
							});

						function borderTransition (i) {
						    that.dataLineGroupBorder[i].transition()
							    .duration(that.transitions.duration())
							    .attrTween("d", function (d) {
							    	var interpolate = d3.scale.quantile()
						                .domain([0,1])
						                .range(d3.range(1, that.layers[i].data.length + 1));
							        return function(t) {
							            return that.chart_path_border(that.layers[i].data.slice(0, interpolate(t)));
							        };
							    });
						}
						borderTransition(i);

					}

					that.svgContainer
						.on('mouseout', function (d) {
							that.mouseEvent.tooltipHide();
							that.mouseEvent.crossHairHide(that.type);
							that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
							that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
						})
						.on("mousemove", function() {
							if(that.type === "areaChart") {
								that.mouseEvent.crossHairPosition(that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.extra_left_margin,that.xdomain,that.type,that.tooltip_mode);
							} else if(that.type === "stackedAreaChart") {
								var line = [];
								line[0] = d3.select(that.selector+" #"+this.id+" .stacked-area");
								that.mouseEvent.crossHairPosition(that.new_data,that.xScale,that.yScale,line,that.extra_left_margin,that.xdomain,that.type,that.tooltipMode,that.color_from_data,"no");
							}
						});

				}
				d3.selectAll(that.selector + " ." +that.chartPathClass)
					.on({
						"mouseover": function () {
							if(that.mode === "default") {
								that.mouseEvent.highlight(that.selector + " ."+that.chartPathClass,this);
							}
						},
						"mouseout": function () {
							if(that.mode === "default") {
								that.mouseEvent.highlightHide(that.selector + " ."+that.chartPathClass);
							}
						}
					});
				return this;
			},
			legends: function () {
                if (PykCharts['boolean'](that.legends_enable) && that.type === "stackedAreaChart" && that.mode==="default") {
        			that.multid.legendsPosition(that,"stackedArea",that.new_data);
                }
                return this;
            }
		};
		return optional;
	};

	that.zoomed = function() {
		that.k.isOrdinal(that.svgContainer,".x.axis",that.xScale,that.xdomain,that.extra_left_margin);
	    that.k.isOrdinal(that.svgContainer,".x.grid",that.xScale);
	    that.k.isOrdinal(that.svgContainer,".y.axis",that.yScale,that.ydomain);
	    that.k.isOrdinal(that.svgContainer,".y.grid",that.yScale);

	    for (i = 0;i < that.new_data_length;i++) {
	    	type = that.chartPathClass + i;
	  	 	that.svgContainer.select(that.selector+" #"+type)
	  	 		.attr({
	  	 			"class": that.chartPathClass,
		        	"d": that.chart_path
	  	 		});
		    that.svgContainer.select(that.selector+" #border-stacked-area"+i)
		    	.attr({
		    		"class": "area-border",
					"d": that.chart_path_border
		    	});
	    }
	    if(PykCharts.getEvent().sourceEvent.type === "dblclick") {
	    	that.count++;
	    }
	    that.mouseEvent.tooltipHide();
		that.mouseEvent.crossHairHide(that.type);
		that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
		that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
	    if(that.count === that.zoom_level+1) {
	    	that.zoomOut();
	    }
	    if(PykCharts['boolean'](that.annotation_enable)) {
        	that.annotation();
        }
	};

	that.zoomOut =  function () {
		that.optional_feature().createChart("liveData");
    	that.k.isOrdinal(that.svgContainer,".x.axis",that.xScale,that.xdomain,that.extra_left_margin);
	    that.k.isOrdinal(that.svgContainer,".x.grid",that.xScale);
	    that.k.isOrdinal(that.svgContainer,".y.axis",that.yScale,that.ydomain);
	    that.k.isOrdinal(that.svgContainer,".y.grid",that.yScale);
	};

	that.annotation = function () {
		that.line = d3.svg.line()
				.interpolate('linear-closed')
                .x(function(d,i) { return d.x; })
                .y(function(d,i) { return d.y; });
        var arrow_size = 12,annotation = [];
		if(that.type === "areaChart") {
			that.new_data[0].data.map(function (d) {
				if(d.annotation) {
					annotation.push({
						annotation : d.annotation,
						x : d.x,
						y : d.y
					})
				}
			});
		} else if(that.type === "stackedAreaChart" && that.mode === "default") {
			
			for(i=0;i<that.new_data_length;i++) {
				that.new_data[i].data.map(function (d) {
					if(d.annotation) {
						annotation.push({
							annotation : d.annotation,
							x : d.x,
							y : d.y + d.y0
						});
					}
				});
			}
		}
		var anno = that.svgContainer.selectAll(" .PykCharts-annotation-line")
            .data(annotation);
        anno.enter()
            .append("path");

        anno.attr("d", function (d,i) {
            	var a = [
            		{
            			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
            			y:parseInt(that.yScale(d.y)-(arrow_size)+that.margin_top+that.legendsGroup_height)
            		},
            		{
            			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
            			y:parseInt(that.yScale(d.y)-(arrow_size)+that.margin_top+that.legendsGroup_height)
            		}
            	];
            	return that.line(a);
            })
        function setTimeoutAnnotation () {
        	anno.attr("class", "PykCharts-annotation-line")
	            .attr("d", function (d,i) {
	            	var a = [
                		{
                			x:parseInt(that.xScale(d.x)-(arrow_size*0.5))+that.extra_left_margin+that.margin_left,
                			y:parseInt(that.yScale(d.y)-(arrow_size)+that.margin_top+that.legendsGroup_height)
                		},
                		{
                			x:parseInt(that.xScale(d.x)+(arrow_size*0.5))+that.extra_left_margin+that.margin_left,
                			y:parseInt(that.yScale(d.y)-(arrow_size)+that.margin_top+that.legendsGroup_height)
                		},
                		{
                			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
                			y:parseInt(that.yScale(d.y)+that.margin_top+that.legendsGroup_height),
                		}
            		];
	            	return that.line(a);
	            })
				.attr("fill",that.annotation_background_color);
        }
        setTimeout(setTimeoutAnnotation, that.transitions.duration());

        anno.exit().remove();
        that.k.annotation(that.selector + " #svg-1",annotation,that.xScale,that.yScale)
	};

	that.renderChart =  function () {
		that.optional_feature()
				.svgContainer(1)
				.legendsContainer()
				.legends()
				.createGroups(1)
				.createChart()
	    		.axisContainer();

	    that.k.crossHair(that.svgContainer,that.new_data_length,that.new_data,that.fillColor,that.type);
	};
};