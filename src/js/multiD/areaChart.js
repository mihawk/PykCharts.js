PykCharts.multiD.areaChart = function (options){
	var that = this;
	var theme = new PykCharts.Configuration.Theme({});

	this.execute = function (){
		that = new PykCharts.multiD.processInputs(that, options, "area");

		if(that.stop)
			return;

		if(that.mode === "default") {
			that.k.loading();
		}

		var multiDimensionalCharts = theme.multiDimensionalCharts,
			stylesheet = theme.stylesheet,
			optional = options.optional;

	    that.crosshair_enable = options.crosshair_enable ? options.crosshair_enable.toLowerCase() : multiDimensionalCharts.crosshair_enable;
		that.curvy_lines = options.curvy_lines_enable ? options.curvy_lines_enable.toLowerCase() : multiDimensionalCharts.curvy_lines_enable;
		// that.color_from_data = options.line_color_from_data ? options.line_color_from_data : multiDimensionalCharts.line_color_from_data;
	  	that.panels_enable = "no";
	  	that.interpolate = PykCharts.boolean(that.curvy_lines) ? "cardinal" : "linear";
		that.w = that.width - that.margin_left - that.margin_right;
		that.h = that.height - that.margin_top - that.margin_bottom;

		d3.json(options.data, function (e, data) {

            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(that.selector+" #chart-loader").remove();
                return;
            }

			that.data = data.groupBy("area");
			that.axis_y_data_format = "number";
    		that.axis_x_data_format = that.k.xAxisDataFormatIdentification(that.data);
    		if(that.axis_x_data_format === "time" && that.axis_x_time_value_datatype === "") {
    			console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to have passed Date data so please pass the value for axis_x_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
    		}
			that.compare_data = that.data;
			that.data_length = that.data.length;
			$(that.selector+" #chart-loader").remove();
			PykCharts.multiD.areaFunctions(options,that,"area");
			that.dataTransformation();
			that.render();
		});
	};
};

PykCharts.multiD.stackedAreaChart = function (options){
	var that = this;
	var theme = new PykCharts.Configuration.Theme({});

	this.execute = function (){
		that = new PykCharts.multiD.processInputs(that, options, "area");

		if(that.stop)
			return;

		if(that.mode === "default") {
			that.k.loading();
		}

		var multiDimensionalCharts = theme.multiDimensionalCharts,
			stylesheet = theme.stylesheet,
			optional = options.optional;

	    that.crosshair_enable = options.crosshair_enable ? options.crosshair_enable.toLowerCase() : multiDimensionalCharts.crosshair_enable;
		that.curvy_lines = options.curvy_lines_enable ? options.curvy_lines_enable.toLowerCase() : multiDimensionalCharts.curvy_lines_enable;
		// that.color_from_data = options.line_color_from_data ? options.line_color_from_data : multiDimensionalCharts.line_color_from_data;
	  	that.panels_enable = "no";
	  	that.interpolate = PykCharts.boolean(that.curvy_lines) ? "cardinal" : "linear";
		that.w = that.width - that.margin_left - that.margin_right;
		that.h = that.height - that.margin_top - that.margin_bottom;

		d3.json(options.data, function (e, data) {

            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(that.selector+" #chart-loader").remove();
                return;
            }

			that.data = data.groupBy("area");
			that.axis_y_data_format = "number";
    		that.axis_x_data_format = that.k.xAxisDataFormatIdentification(that.data);
    		if(that.axis_x_data_format === "time" && that.axis_x_time_value_datatype === "") {
    			console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to have passed Date data so please pass the value for axis_x_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
    		}
			that.compare_data = that.data;
			that.data_length = that.data.length;
			$(that.selector+" #chart-loader").remove();
			PykCharts.multiD.areaFunctions(options,that,"area");
			that.dataTransformation();
			that.render();
		});
	};
};

PykCharts.multiD.areaFunctions = function (options,chartObject,type) {
	var that = chartObject;
	that.dataTransformation = function () {
		that.group_arr = [], that.color_arr = [], that.new_data = [];
		for(j = 0;j < that.data_length;j++) {
			that.group_arr[j] = that.data[j].name;
		}
		that.uniq_group_arr = _.unique(that.group_arr);
		that.uniq_color_arr = [];
		// $.unique(that.uniq_group_arr);
		var len = that.uniq_group_arr.length;
		for (k = 0;k < len;k++) {
			if(that.chart_color[k]) {
				that.uniq_color_arr[k] = that.chart_color[k];
			} else {
				for (l = 0;l < that.data_length;l++) {
					if (that.uniq_group_arr[k] === that.data[l].name && that.data[l].color) {
						that.uniq_color_arr[k] = that.data[l].color;
						break;
					}
				} if(!PykCharts.boolean(that.uniq_color_arr[k])) {
					that.uniq_color_arr[k] = that.default_color[0];
				}
			}
		}

		for (k = 0;k < len;k++) {
			that.new_data[k] = {
					name: that.uniq_group_arr[k],
					data: [],
					color: that.uniq_color_arr[k]
			};
			for (l = 0;l < that.data_length;l++) {
				if (that.uniq_group_arr[k] === that.data[l].name) {
					that.new_data[k].data.push({
							x: that.data[l].x,
							y: that.data[l].y,
							tooltip: that.data[l].tooltip,
							annotation : that.data[l].annotation || ""
				 	});
				}
				}
		}
		that.new_data_length = that.new_data.length;
	}
	that.render = function (){
		that.dataLineGroup = [], that.dataLineGroupBorder = [];
		that.multid = new PykCharts.multiD.configuration(that);
		that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);
		that.transitions = new PykCharts.Configuration.transition(that);
		that.border = new PykCharts.Configuration.border(that);

//		that.k.export(that,"#svg-1","areaChart");
		if(that.mode === "default") {

			that.k.title()
					.backgroundColor(that)
					.export(that,"#svg-1","areaChart")
					.liveData(that)
					.emptyDiv()
					.subtitle()
					.makeMainDiv(options.selector,1)
					.tooltip(true,options.selector,1);


			that.optional_feature()
		    		.chartType()
					.svgContainer(1)
					.legendsContainer()
					.legends()
					.createGroups(1)
					.createChart()
		    		.axisContainer();

		    that.k.crossHair(that.svgContainer,that.new_data_length,that.new_data,that.fillColor,that.type);


			that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height,that.data)
					.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values)
					.yGrid(that.svgContainer,that.group,that.yScale)
					.xGrid(that.svgContainer,that.group,that.xScale,that.legendsGroup_height)
					.xAxisTitle(that.xGroup)
					.yAxisTitle(that.yGroup)
					.createFooter()
	                .lastUpdatedAt()
	                .credits()
	                .dataSource();
	        if(PykCharts.boolean(that.annotation_enable)) {
	        	that.annotation();
	        }
		}
		else if(that.mode === "infographics") {
			  that.k.liveData(that)
			  			.backgroundColor(that)
			  			.export(that,"#svg-1","areaChart")
			  			.emptyDiv()
						.makeMainDiv(options.selector,1);

			  that.optional_feature()
			    		.chartType()
						.svgContainer(1)
						.legendsContainer()
						.createGroups(1)
						.createChart()
			    		.axisContainer();

		    that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
					.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values)
					.xAxisTitle(that.xGroup)
					.yAxisTitle(that.yGroup);
  		}
		that.k.exportSVG(that,"#svg-1","areaChart")
  		that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
  		$(document).ready(function () { return that.k.resize(that.svgContainer,"yes"); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer,"yes"); });
	};

	that.refresh = function (){
		d3.json(options.data, function (e,data) {
			that.data = data.groupBy("area");
			that.data_length = that.data.length;
			// that.transition_duration = 0;
			that.dataTransformation();
			var compare = that.multid.checkChangeInData(that.data,that.compare_data);
			that.compare_data = compare[0];
			var data_changed = compare[1];

			if(data_changed) {
				that.k.lastUpdatedAt("liveData");
				that.mouseEvent.tooltipHide();
				that.mouseEvent.crossHairHide(that.type);
				that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
				that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
			}

			that.optional_feature().createChart("liveData");

			that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
					.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values)
					.yGrid(that.svgContainer,that.group,that.yScale)
					.xGrid(that.svgContainer,that.group,that.xScale,that.legendsGroup_height)
					.tooltip(true,options.selector);

			if(PykCharts.boolean(that.annotation_enable)) {
	        	that.annotation();
	        }
		});
	};

	that.optional_feature = function (){
		var optional = {
			chartType: function () {
				for(j = 1;j < that.data_length;j++) {
					if(that.data[0].x === that.data[j].x) {
						that.type = "stackedAreaChart";
						break;
					}
				}
				that.type = that.type || "areaChart";
				return this;
			},
			svgContainer: function (i){
				$(that.selector).attr("class","PykCharts-twoD PykCharts-multi-series2D PykCharts-line-chart");
				// $(options.selector).css({"background-color":that.background_color,"position":"relative"});

				that.svgContainer = d3.select(options.selector+" "+"#tooltip-svg-container-"+i).append("svg:svg")
					.attr("id","svg-"+i)
					.attr("width",that.width)
					.attr("height",that.height)
					.attr("class","svgcontainer")
					.attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height);

                // $(options.selector).colourBrightness();
    			return this;
			},
			createGroups : function (i) {

				that.group = that.svgContainer.append("g")
					.attr("id","chartsvg")
					.attr("transform","translate("+ that.margin_left +","+ (that.margin_top + that.legendsGroup_height)+")");

				if(PykCharts.boolean(that.grid_y_enable)){
					that.group.append("g")
						.attr("id","ygrid")
						.attr("class","y grid-line");
				}
				if(PykCharts.boolean(that.grid_x_enable)){
					that.group.append("g")
						.attr("id","xgrid")
						.attr("class","x grid-line");
				}

				that.clip = that.svgContainer.append("svg:clipPath")
				    .attr("id","clip" + i + that.selector)
				    .append("svg:rect")
				    .attr("width", that.w)
				    .attr("height", that.h - that.legendsGroup_height);

				that.chartBody = that.svgContainer.append("g")
					.attr("id","clipPath")
					.attr("clip-path", "url(#clip" + i + that.selector + " )")
					.attr("transform","translate("+ that.margin_left +","+ (that.margin_top+that.legendsGroup_height) +")");

				that.stack_layout = d3.layout.stack()
					.values(function(d) { return d.data; });

    			return this;
			},
			legendsContainer : function (i) {
                if (PykCharts.boolean(that.legends_enable) && that.type === "stackedAreaChart" && that.mode === "default") {
                    that.legendsGroup = that.svgContainer.append("g")
                                .attr('id',"legends")
                                .style("visibility","visible")
                                .attr("transform","translate(0,10)");
                } else {
                    that.legendsGroup_height = 0;
                }
                return this;
            },
			axisContainer : function () {
	        	if(PykCharts.boolean(that.axis_x_enable) || options.axis_x_title){
					that.xGroup = that.group.append("g")
							.attr("id","xaxis")
							.attr("class", "x axis");
				}
				if(PykCharts.boolean(that.axis_y_enable) || options.axis_y_title){
					that.yGroup = that.group.append("g")
						.attr("id","yaxis")
						.attr("class","y axis");
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
			        x_range = [0 ,that.w];

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

		        }
		        else if(that.axis_x_data_format === "string") {
		          	that.new_data[0].data.forEach(function(d) { x_data.push(d.x); });
		          	x_range = [0 ,that.w];
		          	that.xScale = that.k.scaleIdentification("ordinal",x_data,x_range,0);
		          	that.extra_left_margin = (that.xScale.rangeBand() / 2);

		        }
		        else if (that.axis_x_data_format === "time") {
		        	max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return new Date(k.x); }); });
					min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return new Date(k.x); }); });
		         	x_data = [min,max];
		          	x_range = [0 ,that.w];

	          	    min_x_tick_value = d3.min(that.x_tick_values, function (d) {
                        return new Date(d);
                    });

                    max_x_tick_value = d3.max(that.x_tick_values, function (d) {
                        return new Date(d);
                    });

                    if(new Date(x_data[0]) > new Date(min_x_tick_value)) {
                        x_data[0] = min_x_tick_value;
                    }
                    if(new Date(x_data[1]) < new Date(max_x_tick_value)) {
                        x_data[1] = max_x_tick_value;
                    }

		          	that.xScale = that.k.scaleIdentification("time",x_data,x_range);
		          	for(i=0;i<that.new_data_length;i++) {
			          	that.new_data[i].data.forEach(function (d) {
			          		d.x = new Date(d.x);
			          	});
			        }
		          	that.data.forEach(function (d) {
		          		d.x = new Date(d.x);
		          	});
		          	that.extra_left_margin = 0;
		        }
		        that.xdomain = that.xScale.domain();
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

				if(PykCharts.boolean(that.zoom_enable) && (that.mode === "default")) {
					that.svgContainer.call(that.zoom_event);
					that.svgContainer.on("wheel.zoom", null)
                    	.on("mousewheel.zoom", null);
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

	        	if(evt === "liveData"){
	        		for (var i = 0;i < that.new_data_length;i++) {
	        			var data = that.new_data[i].data;
	        			type = that.chartPathClass + i;

	        			that.svgContainer.select("#"+type)
							.datum(that.layers[i].data)
							.attr("transform", "translate("+ that.extra_left_margin +",0)")
							.style("stroke",that.border.color())
		                    .style("stroke-width",that.border.width())
		                    .style("stroke-dasharray", that.border.style());

						function transition1 (i) {
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

						transition1(i);

						that.svgContainer.select("#border-stacked-area"+i)
							.datum(that.layers[i].data)
							.attr("transform", "translate("+ that.extra_left_margin +",0)");

					    function borderTransition1 (i) {
						    that.dataLineGroupBorder[i].transition()
							    .duration(that.transitions.duration())
							    .attrTween("d", function (d) {
							    	var interpolate = d3.scale.quantile()
						                .domain([0,1])
						                .range(d3.range(1, that.layers[i].data.length + 1));
							        return function(t) {
							            return that.chart_path_border(that.layers[i].data.slice(0, interpolate(t)));
							        };
							    })
						}
						borderTransition1(i);
					}
					if(that.type === "areaChart") {
						that.svgContainer
							.on('mouseout',function (d) {
			          			that.mouseEvent.tooltipHide();
			          			that.mouseEvent.crossHairHide(that.type);
								that.mouseEvent.axisHighlightHide(options.selector + " .x.axis");
								that.mouseEvent.axisHighlightHide(options.selector + " .y.axis");
		          			})
							.on("mousemove", function(){
								that.mouseEvent.crossHairPosition(that.data,that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.extra_left_margin,that.xdomain,that.type,that.tooltip_mode);
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
							.attr("class", that.chartPathClass)
							.attr("id", type)
							.style("fill", function(d) {
								return that.fillColor.colorPieMS(that.new_data[i],that.type);
							})
							.attr("fill-opacity",function() {
								if(that.type === "stackedAreaChart" && that.color_mode === "saturation") {
									return (i+1)/that.new_data.length;
								}
							})
							.attr("data-fill-opacity",function () {
		                        return $(this).attr("fill-opacity");
		                    })
							.attr("transform", "translate("+ that.extra_left_margin +",0)");

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
							.attr("class", "area-border")
							.attr("id", "border-stacked-area"+i)
							.style("stroke",that.border.color())
		                    .style("stroke-width",that.border.width())
		                    .style("stroke-dasharray", that.border.style())
		                    .style("pointer-events","none")
							.attr("transform", "translate("+ that.extra_left_margin +",0)")


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

						// Legend ---- Pending!
					  // that.legend_text[i] = that.svgContainer.append("text")
					  // 		.attr("id",that.chartPathClass+"-"+that.new_data[i].name)
					  // 		.attr("x", 20)
					  // 		.attr("y", 20)
					  // 		.style("display","none")
					  // 		.text(that.new_data[i].name);data

						// that.dataLineGroup[i].on("click",function (d,j) {
						// 		that.curr_line_data = d;
						// 		that.curr_line_data_len = d.length;
						// 		that.deselected = that.selected;
						// 		d3.select(that.deselected).classed({'multi-line-selected':false,'multi-line':true});
						// 		that.selected = this;
						// 		d3.select(that.selected).classed({'multi-line-selected':true,'multi-line':false});

						// 		that.updateSelectedLine();
						// });
					}

					that.svgContainer
						.on('mouseout', function (d) {
							that.mouseEvent.tooltipHide();
							that.mouseEvent.crossHairHide(that.type);
							that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
							that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");

							if(that.type === "stackedAreaChart") {
								for(var a=0;a < that.new_data_length;a++) {
									$(options.selector+" #svg-"+a).trigger("mouseout");
								}
							}
						})
						.on("mousemove", function() {
							if(that.type === "areaChart") {
								that.mouseEvent.crossHairPosition(that.data,that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.extra_left_margin,that.xdomain,that.type,that.tooltip_mode);
							} else if(that.type === "stackedAreaChart") {
								var line = [];
								line[0] = d3.select(options.selector+" #"+this.id+" .stacked-area");
								that.mouseEvent.crossHairPosition(that.data,that.new_data,that.xScale,that.yScale,line,that.extra_left_margin,that.xdomain,that.type,that.tooltipMode,that.color_from_data,"no");
								for(var a=0;a < that.new_data_length;a++) {
									$(options.selector+" #svg-"+a).trigger("mousemove");
								}
							}
						});

				}
				d3.selectAll(options.selector + " ." +that.chartPathClass)
					.on("mouseover", function () {
						if(that.mode === "default") {
							that.mouseEvent.highlight(options.selector + " ."+that.chartPathClass,this);
						}
					})
					.on("mouseout", function () {
						if(that.mode === "default") {
							that.mouseEvent.highlightHide(options.selector + " ."+that.chartPathClass);
						}
					});
				return this;
			},
			legends : function (index) {

                if (PykCharts.boolean(that.legends_enable) && that.type === "stackedAreaChart" && that.mode==="default") {
                    var k = 0;
                    var l = 0;

                    if(that.legends_display === "vertical" ) {
                        that.legendsGroup.attr("height", (that.new_data_length * 30)+20);
                        that.legendsGroup_height = (that.new_data_length * 30)+20;

                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        text_parameter1value = function (d,i) { return that.width - that.width/4 + 16; };
                        rect_parameter3value = function (d,i) { return that.width - that.width/4; };
                        var rect_parameter4value = function (d,i) { return i * 24 + 12;};
                        var text_parameter2value = function (d,i) { return i * 24 + 23;};

                    } else if(that.legends_display === "horizontal") {
                        // that.legendsContainer.attr("height", (k+1)*70);
                        that.legendsGroup_height = 50;
                        final_rect_x = 0;
                        final_text_x = 0;
                        legend_text_widths = [];
                        sum_text_widths = 0;
                        temp_text = temp_rect = 0;
                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";

                        var text_parameter1value = function (d,i) {
                            legend_text_widths[i] = this.getBBox().width;
                            legend_start_x = 16;
                            final_text_x = (i === 0) ? legend_start_x : (legend_start_x + temp_text);
                            temp_text = temp_text + legend_text_widths[i] + 30;
                            return final_text_x;
                        };
                        text_parameter2value = 30;
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        var rect_parameter3value = function (d,i) {
                            final_rect_x = (i === 0) ? 0 : temp_rect;
                            temp_rect = temp_rect + legend_text_widths[i] + 30;
                            return final_rect_x;
                        };
                        rect_parameter4value = 18;
                    }

                    var legend = that.legendsGroup.selectAll("rect")
                                    .data(that.new_data);

                    that.legends_text = that.legendsGroup.selectAll(".legends_text")
                        .data(that.new_data);

                    that.legends_text.enter()
                        .append('text');

                    that.legends_text.attr("class","legends_text")
                        .attr("pointer-events","none")
                        .text(function (d) { return d.name; })
                        .attr("fill", that.legends_text_color)
                        .attr("font-family", that.legends_text_family)
                        .attr("font-size",that.legends_text_size +"px")
                        .attr("font-weight", that.legends_text_weight)
                        .attr(text_parameter1, text_parameter1value)
                        .attr(text_parameter2, text_parameter2value);

                    legend.enter()
                        .append("rect");

                    legend.attr(rect_parameter1, rect_parameter1value)
                        .attr(rect_parameter2, rect_parameter2value)
                        .attr(rect_parameter3, rect_parameter3value)
                        .attr(rect_parameter4, rect_parameter4value)
                        .attr("fill", function (d) {
                            return that.fillColor.colorPieMS(d,that.type);
                        })
                        .attr("fill-opacity", function (d,i) {
                            if(that.type === "stackedAreaChart" && that.color_mode === "saturation") {
								return (i+1)/that.new_data.length;
							}
                        });

                    var legend_container_width = that.legendsGroup.node().getBBox().width,
                        translate_x = (that.legends_display === "vertical") ? 0 : (that.width - legend_container_width - 20);

                    if (legend_container_width < that.width) { that.legendsGroup.attr("transform","translate("+translate_x+",10)"); }
                    that.legendsGroup.style("visibility","visible");

                    that.legends_text.exit().remove();
                    legend.exit().remove();


                    /* !!!!! DO NOT TOUCH THE BELOW COMMENTED CODE, PREVIOUSLY WRITTEN FOR DISPLAYING LEGENDS ON THE NEXT LINE !!!!!*/
       //                  var text_parameter1value = function (d,i) {
       //                      if( i === 0) {
       //                          l = 0;
       //                      }
       //                      if((that.width - (i*100 + 75)) > 0) {
       //                          return that.width - (i*100 + 75);
       //                      } else if ((that.width - (l*100 + 75)) < that.width) {
       //                          l++;
       //                          return that.width - ((l-1)*100 + 75);
       //                      } else {
       //                          l = 0;
       //                          l++;
       //                          return that.width - ((l-1)*100 + 75);
       //                      }
       //                  };

       //                  text_parameter2value = function (d,i) {
       //                      if(i === 0) {
       //                          k = 0, l = 0;
       //                      }
       //                      if((that.width - (i*100 + 75)) > 0) {
       //                      } else if ((that.width - (l*100 + 75)) < that.width) {
       //                          if(l === 0) {
       //                              k++;
       //                          }
       //                          l++;
       //                      } else {
       //                          l = 0;
       //                          l++;
       //                          k++;
       //                      }
       //                  return k * 24 + 23;
       //                  };
       //                  rect_parameter1value = 13;
       //                  rect_parameter2value = 13;
       //                  var rect_parameter3value = function (d,i) {
       //                      if( i === 0) {
       //                          k = 0, l = 0;
       //                      }
       //                      if((that.width - (i*100 + 100)) >= 0) {
       //                          return that.width - (i*100 + 100);
       //                      } else if ((that.width - (i*100 + 100)) < that.width) {
       //                          k++;
       //                          if(l === 0) {
       //                              // that.legendsContainer.attr("height", (k+1)*50);
       //                              that.legendsGroup.attr("height", (k+1)*50);
       //                          }
       //                          l++;
       //                          return that.width - ((l-1)*100 + 100);
       //                      } else {
       //                          l = 0;
       //                          l++;
       //                          k++;
       //                          return that.width - ((l-1)*100 + 100);
       //                      }
       //                  };
       //                  rect_parameter4value = function (d,i) {
       //                      if(i === 0) {
       //                          k = 0, l = 0;
       //                      }
       //                      if((that.width - (i*100 + 75)) > 0) {
       //                      } else if ((that.width - (l*100 + 75)) < that.width) {
       //                          if( l == 0) {
       //                              k++;
       //                          }
       //                          l++;
       //                      } else {
       //                          l = 0;
       //                          l++;
       //                          k++;
       //                      }
       //                      // console.log(k*24+12, "k", d.group);
       //                  return k * 24 + 12;;
       //                  }
       //              };
       //              var legend;
       //              legend = that.legendsGroup.selectAll("rect")
       //                      .data(that.new_data);
       //              that.legends_text = that.legendsGroup.selectAll(".legends_text")
       //                  .data(that.new_data);
       //              legend.enter()
       //                      .append("rect");

       //              legend.attr(rect_parameter1, rect_parameter1value)
       //                  .attr(rect_parameter2, rect_parameter2value)
       //                  .attr(rect_parameter3, rect_parameter3value)
       //                  .attr(rect_parameter4, rect_parameter4value)
       //                  .attr("fill", function (d) {
       //                      return that.fillColor.colorPieMS(d,that.type);
       //                  })
       //                  .attr("fill-opacity", function (d,i) {
       //                      if(that.type === "stackedAreaChart" && that.color_mode === "saturation") {
							// 	return (i+1)/that.new_data.length;
							// }
       //                  });

       //              legend.exit().remove();

       //              that.legends_text
       //                  .enter()
       //                  .append('text')
       //                  .attr("class","legends_text")
       //                  .attr("fill",that.legends_text_color)
       //                  .attr("pointer-events","none")
       //                  .style("font-family", that.legends_text_family)
       //                  .attr("font-size",that.legends_text_size + "px")
       //                  .style("font-weight", that.legends_text_weight);

       //              that.legends_text.attr("class","legends_text")
       //                  .attr(text_parameter1, text_parameter1value)
       //                  .attr(text_parameter2, text_parameter2value)
       //                  .text(function (d) { return d.name; });

       //              that.legends_text.exit()
       //                              .remove();
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
	        	.attr("class", that.chartPathClass)
		        .attr("d", that.chart_path);
		    that.svgContainer.select(that.selector+" #border-stacked-area"+i)
				.attr("class","area-border")
				.attr("d", that.chart_path_border);
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
	    if(PykCharts.boolean(that.annotation_enable)) {
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

		if(that.type === "areaChart") {
			var arrow_size = 12,annotation = [];
			that.new_data[0].data.map(function (d) {
				if(d.annotation) {
					annotation.push({
						annotation : d.annotation,
						x : d.x,
						y : d.y
					})
				}
			});

			var anno = that.svgContainer.selectAll(that.selector + " .PykCharts-annotation-line")
                .data(annotation);
            anno.enter()
                .append("path");
            anno.attr("d", function (d,i) {
                	var a = [
                		{
                			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
                			y:parseInt(that.yScale(d.y)+that.margin_top - arrow_size)
                		},
                		{
                			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
                			y:parseInt(that.yScale(d.y)+that.margin_top - arrow_size)
                		}
                	];
                	return that.line(a);
                })
            setTimeout(function () {
	            anno.attr("class", "PykCharts-annotation-line")
	                .attr("d", function (d,i) {
	                	var a = [
	                		{
	                			x:parseInt(that.xScale(d.x)-(arrow_size*0.5))+that.extra_left_margin+that.margin_left,
	                			y:parseInt(that.yScale(d.y)-(arrow_size)+that.margin_top)
	                		},
	                		{
	                			x:parseInt(that.xScale(d.x)+(arrow_size*0.5))+that.extra_left_margin+that.margin_left,
	                			y:parseInt(that.yScale(d.y)-(arrow_size)+that.margin_top)
	                		},
	                		{
	                			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
	                			y:parseInt(that.yScale(d.y)+that.margin_top),
	                		}
                		];
	                	// var a = [
	                	// 	{
	                	// 		x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
	                	// 		y:parseInt(that.yScale(d.y)+that.margin_top - line_size)
	                	// 	},
	                	// 	{
	                	// 		x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
	                	// 		y:parseInt(that.yScale(d.y)+that.margin_top),
	                	// 	}
	                	// ];
	                	return that.line(a);
	                })
	                // .attr("stroke-width",0.5)
	                // .attr("stroke",that.annotation_border_color)
	                .attr("fill",that.annotation_background_color);
            }, that.transitions.duration());

            anno.exit().remove();
            that.k.annotation(that.selector + " #svg-1",annotation, that.xScale,that.yScale);

		} else if(that.type === "stackedAreaChart" && that.mode === "default") {
			var arrow_size = 12,annotation = [];
			for(i=0;i<that.new_data_length;i++) {
				that.new_data[i].data.map(function (d) {
					if(d.annotation) {
						annotation.push({
							annotation : d.annotation,
							x : d.x,
							y : d.y + d.y0
							// y0 : d.y0
						});
					}
				});
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
            setTimeout(function () {
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
		            	// var a = [
		            	// 	{
		            	// 		x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
		            	// 		y:parseInt(that.yScale(d.y)-(line_size)+that.margin_top+that.legendsGroup_height)
		            	// 	},
		            	// 	{
		            	// 		x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
		            	// 		y:parseInt(that.yScale(d.y)+that.margin_top+that.legendsGroup_height),
		            	// 	}
		            	// ];
		            	return that.line(a);
		            })
					.attr("fill",that.annotation_background_color);
		            // .attr("stroke",that.annotation_border_color);
            }, that.transitions.duration());

            anno.exit().remove();
            that.k.annotation(that.selector + " #svg-1",annotation,that.xScale,that.yScale)
		}
	}
};
