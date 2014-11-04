PykCharts.multiD.lineChart = function (options) {
	var that = this;
	var theme = new PykCharts.Configuration.Theme({});

	this.execute = function (){

		that = new PykCharts.multiD.processInputs(that, options, "line");

		if(that.stop)
			return;

		if(that.mode === "default") {
			that.k.loading();
		}

		var multiDimensionalCharts = theme.multiDimensionalCharts,
			stylesheet = theme.stylesheet,
			optional = options.optional;

		that.pointer_overflow_enable = options.pointer_overflow_enable ? options.pointer_overflow_enable.toLowerCase() : stylesheet.pointer_overflow_enable;	
		that.crosshair_enable = options.crosshair_enable ? options.crosshair_enable.toLowerCase() : multiDimensionalCharts.crosshair_enable;
		that.curvy_lines = options.curvy_lines_enable ? options.curvy_lines_enable.toLowerCase() : multiDimensionalCharts.curvy_lines_enable;
		that.interpolate = PykCharts.boolean(that.curvy_lines) ? "cardinal" : "linear";

	    d3.json(options.data, function (e, data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(that.selector+" #chart-loader").remove();
                return;
            }
			that.data = data.groupBy("line");
			that.axis_y_data_format = "number";
    		that.axis_x_data_format = that.k.xAxisDataFormatIdentification(that.data);
			if(that.axis_x_data_format === "time" && that.axis_x_time_value_datatype === "") {
    			console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to have passed Date data so please pass the value for axis_x_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
    		}
			that.compare_data = that.data;
			that.data_length = that.data.length;
			that.dataTransformation();
			$(that.selector+" #chart-loader").remove();
			that.render();
		});
	};

	this.dataTransformation = function () {
		that.group_arr = [], that.color_arr = [], that.new_data = []/*, that.dataLineGroup = []*/,

		that.ticks = [];

		for(j = 0;j < that.data_length;j++) {
			that.group_arr[j] = that.data[j].name;
		}
		that.uniq_group_arr = that.group_arr.slice();
		that.uniq_color_arr = [];
		$.unique(that.uniq_group_arr);
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
		that.flag = 0;
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
						annotation: that.data[l].annotation || ""
					});
				}
			}
		}
		that.new_data_length = that.new_data.length;
	};

	this.render = function () {
		that.dataLineGroup = [],that.clicked;
		that.multid = new PykCharts.multiD.configuration(that);
		that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);
		that.transitions = new PykCharts.Configuration.transition(that);
		// (d3.selectAll(options.selector + ".y.axis"));

		if(that.mode === "default") {

			that.k.title();

			if(PykCharts.boolean(that.panels_enable)) {

				that.k.backgroundColor(that)
					.export(that,"svg-","lineChart",that.panels_enable,that.new_data)
					.emptyDiv()
					.subtitle();

				that.w = that.width/3;
                that.height = that.height/2;
                that.reducedWidth = that.w - that.margin_left - that.margin_right;
				that.reducedHeight = that.height - that.margin_top - that.margin_bottom;
				that.fill_data = [];
				for(i=0;i<that.new_data_length;i++) {

					that.optionalFeature().chartType();

					that.k.liveData(that)
							.makeMainDiv(that.selector,i)
							.tooltip(true,that.selector,i);

					console.log(that.type,"type");
					that.new_data1 = that.new_data[i];
					that.fill_data[0] = that.new_data1;
					that.optionalFeature()
							// .chartType()
							.svgContainer(i)
							.createGroups(i);
					that.k.crossHair(that.svgContainer,1,that.fill_data,that.fillColor,that.type);
					that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

					that.optionalFeature()
							.createChart(null,i)
							.ticks(i)
							.axisContainer();

					that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values)
							.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values)
							.yGrid(that.svgContainer,that.group,that.yScale)
							.xGrid(that.svgContainer,that.group,that.xScale)
							.xAxisTitle(that.xGroup)
							.yAxisTitle(that.yGroup);

					if((i+1)%4 === 0 && i !== 0) {
                        that.k.emptyDiv();
                    }
				}
				that.k.exportSVG(that,"svg-","lineChart",that.panels_enable,that.new_data)
				that.k.emptyDiv();
			} else {
				that.k.backgroundColor(that)
					.export(that,"#svg-1","lineChart")
					.emptyDiv()
					.subtitle();

				that.w = that.width;
				that.reducedWidth = that.w - that.margin_left - that.margin_right;
				that.reducedHeight = that.height - that.margin_top - that.margin_bottom;

				that.k.liveData(that)
						.makeMainDiv(that.selector,1)
						.tooltip(true,that.selector,1,that.flag);
				that.optionalFeature()
						.chartType()
						.svgContainer(1)
						.createGroups(1)
						.hightLightOnload();

				that.k.crossHair(that.svgContainer,that.new_data_length,that.new_data,that.fillColor,that.type);
				that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

				that.optionalFeature()
						.createChart()
						.ticks()
						.axisContainer();

				that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values)
						.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values)
						.yGrid(that.svgContainer,that.group,that.yScale)
						.xGrid(that.svgContainer,that.group,that.xScale)
						.xAxisTitle(that.xGroup)
						.yAxisTitle(that.yGroup);
				
				that.k.exportSVG(that,"#svg-1","lineChart")
				// console.log(d3.selectAll(options.selector + " .y.axis text")[0][0].__data__,"selector")
			}
			that.k.createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();
            if(PykCharts.boolean(that.annotation_enable)) {
            	that.annotation();
            }
		}
		else if(that.mode === "infographics") {
			if(PykCharts.boolean(that.panels_enable)) {

				that.k.backgroundColor(that)
					.export(that,"#svg-","lineChart",that.panels_enable,that.new_data)
					.emptyDiv();

				that.w = that.width/3;
                that.height = that.height/2;
                that.reducedWidth = that.w - that.margin_left - that.margin_right;
				that.reducedHeight = that.height - that.margin_top - that.margin_bottom;
				that.fill_data = [];
				for(i=0;i<that.new_data_length;i++) {
					that.new_data1 = that.new_data[i];
					that.fill_data[0] = that.new_data1;

					that.optionalFeature().chartType();

					that.k.makeMainDiv(that.selector,i)
					that.optionalFeature()
							// .chartType()
							.svgContainer(i)
							.createGroups(i)
							.createChart(null,i)
							.ticks(i)
							.axisContainer();

					that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values)
							.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values)
							.xAxisTitle(that.xGroup)
							.yAxisTitle(that.yGroup);

					if((i+1)%4 === 0 && i !== 0) {
                        that.k.emptyDiv();
                    }
				}
				that.k.exportSVG(that,"#svg-","lineChart",that.panels_enable,that.new_data)
				that.k.emptyDiv();
			} else {

				that.k.backgroundColor(that)
					.export(that,"#svg-0","lineChart")
					.emptyDiv();

				that.w = that.width;
				that.reducedWidth = that.w - that.margin_left - that.margin_right;
				that.reducedHeight = that.height - that.margin_top - that.margin_bottom;

				that.k.makeMainDiv(that.selector,1)
				that.optionalFeature()
						.chartType()
						.svgContainer(1)
						.createGroups(1)
						.hightLightOnload()
						.createChart()
						.ticks()
						.axisContainer();

				that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values)
						.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values)
						.xAxisTitle(that.xGroup)
						.yAxisTitle(that.yGroup);
						
				that.k.exportSVG(that,"#svg-0","lineChart")

			}
		}
		if(!PykCharts.boolean(that.panels_enable)) {
            $(document).ready(function () { return that.k.resize(that.svgContainer,"yes"); })
            $(window).on("resize", function () { return that.k.resize(that.svgContainer,"yes"); });
        } else {
        	$(document).ready(function () { return that.k.resize(null); })
            $(window).on("resize", function () { return that.k.resize(null); });
        }
	};

	this.refresh = function () {
		d3.json(options.data, function (e,data) {
			that.data = data.groupBy("line");
			that.data_length = that.data.length;
			// that.transition_duration = 0;
			var compare = that.multid.checkChangeInData(that.data,that.compare_data);
			that.compare_data = compare[0];
			var data_changed = compare[1];
			that.dataTransformation();
			if(data_changed || (PykCharts.boolean(that.zoom_enable) && that.count > 1 && that.count <= that.zoom_level) || that.transition_duration) {
				that.k.lastUpdatedAt("liveData");
				that.mouseEvent.tooltipHide(null,that.panels_enable,that.type);
				that.mouseEvent.crossHairHide(that.type);
				that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
				that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
			}

			that.optionalFeature().hightLightOnload()
				.createChart("liveData")
				.ticks();

			that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values)
					.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values)
					.yGrid(that.svgContainer,that.group,that.yScale)
					.xGrid(that.svgContainer,that.group,that.xScale)

			if(PykCharts.boolean(that.annotation_enable)) {
				that.annotation();
			}
		});
	};

	this.optionalFeature = function (){
		var optional = {
			chartType: function () {
				for(j = 0;j < that.data_length;j++) {
					for(k = (j+1);k < that.data_length;k++) {
						if(that.data[j].x === that.data[k].x) {
							that.type = "multilineChart";
							break;
						}
					}
				}
				that.type = that.type || "lineChart";
				return this;
			},
			hightLightOnload: function () {
				if(that.type === "multilineChart") {
					if(that.new_data_length > 0 && that.highlight) {
						for(var i = 0;i< that.uniq_group_arr.length;i++) {

							if(that.highlight.toLowerCase() === that.uniq_group_arr[i].toLowerCase()) {
								that.new_data[i].highlight = true;
							} else
							{
								that.new_data[i].highlight = false;
							}
						}
					}
				}
				return this;
			},
			svgContainer: function (i){
				if(that.type === "multilineChart") {
					$(that.selector).attr("class","PykCharts-twoD PykCharts-line-chart PykCharts-multi-series2D");
				}
				else if(that.type === "lineChart") {
					$(that.selector).attr("class","PykCharts-twoD PykCharts-line-chart");
				}

				that.svgContainer = d3.select(that.selector+" #tooltip-svg-container-"+i)
					.append("svg:svg")
					.attr("id","svg-" + i)
					.attr("width",that.w)
					.attr("height",that.height)
					.attr("class","svgcontainer")
					.attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.w + " " + that.height);
                // console.log(that.svgContainer);
				// var x = $(that.selector).colourBrightness(bg);

				// console.log("after appending the class light/dark");

				return this;
			},
			createGroups : function (i) {
				that.group = that.svgContainer.append("g")
					.attr("id","chartsvg")
					.attr("transform","translate("+ that.margin_left +","+ that.margin_top +")");

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
					.attr("width", that.reducedWidth)
					.attr("height", that.reducedHeight);

				that.chartBody = that.svgContainer.append("g")
					.attr("id","clipPath")
					.attr("clip-path", "url(#clip" + i + that.selector + ")")
					.attr("transform","translate("+ that.margin_left +","+ that.margin_top +")");

				return this;
			},
			axisContainer : function () {

				if(PykCharts.boolean(that.axis_x_enable) || that.axis_x_title){
					that.xGroup = that.group.append("g")
						.attr("id","xaxis")
						.attr("class", "x axis");
				}
				if(PykCharts.boolean(that.axis_y_enable) || that.axis_y_title) {
					that.yGroup = that.group.append("g")
						.attr("id","yaxis")
						.attr("class","y axis");
				}
				return this;
			},
			createChart : function (evt,index) {

				that.x_tick_values = that.k.processXAxisTickValues();
                that.y_tick_values = that.k.processYAxisTickValues();

				var x_domain,x_data = [],y_data,y_range,x_range,y_domain,min_x_tick_value,max_x_tick_value, min_y_tick_value,max_y_tick_value;

				if(that.axis_y_data_format === "number") {
					max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return k.y; }); });
					min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return k.y; }); });
		         	y_domain = [min,max];
			        
			        y_data = that.k.__proto__._domainBandwidth(y_domain,2);
                    min_y_tick_value = d3.min(that.y_tick_values);
                    max_y_tick_value = d3.max(that.y_tick_values);

                    if(y_data[0] > min_y_tick_value) {
                        y_data[0] = min_y_tick_value;
                    } 
                    if(y_data[1] < max_y_tick_value) {
                        y_data[1] = max_y_tick_value;
                    }

			        y_range = [that.reducedHeight, 0];
			        that.yScale = that.k.scaleIdentification("linear",y_data,y_range);

			    } else if(that.axis_y_data_format === "string") {
			        that.new_data[0].data.forEach(function(d) { y_data.push(d.y); });
			        y_range = [0,that.reducedHeight];
			        that.yScale = that.k.scaleIdentification("ordinal",y_data,y_range,0);

			    } else if (that.axis_y_data_format === "time") {
			        y_data = d3.extent(that.data, function (d) {
			            return new Date(d.x);
			        });

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
                        y_data[1] = max__tick_value;
                    }

			        y_range = [that.reducedHeight, 0];
			        that.yScale = that.k.scaleIdentification("time",y_data,y_range);
	      		}
	      		that.xdomain = [];
			    if(that.axis_x_data_format === "number") {
			      	max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return k.x; }); });
					min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return k.x; }); });
		         	x_domain = [min,max];
		        	x_data = that.k.__proto__._domainBandwidth(x_domain,2);

                    min_x_tick_value = d3.min(that.x_tick_values);
                    max_x_tick_value = d3.max(that.x_tick_values);

                    if(x_data[0] > min_x_tick_value) {
                        x_data[0] = min_x_tick_value;
                    } 
                    if(x_data[1] < max_x_tick_value) {
                        x_data[1] = max_x_tick_value;
                    }

		          	x_range = [0 ,that.reducedWidth];
		          	that.xScale = that.k.scaleIdentification("linear",x_data,x_range);
		          	that.extra_left_margin = 0;
		          	that.new_data[0].data.forEach(function (d) {
		          		that.xdomain.push(d.x);
		          	})

		        } else if(that.axis_x_data_format === "string") {
		          	that.new_data[0].data.forEach(function(d) { x_data.push(d.x); });
		          	x_range = [0 ,that.reducedWidth];
		          	that.xScale = that.k.scaleIdentification("ordinal",x_data,x_range,0);
		          	that.extra_left_margin = (that.xScale.rangeBand() / 2);
		          	that.xdomain = that.xScale.domain();

		        } else if (that.axis_x_data_format === "time") {
		        	max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return new Date(k.x); }); });
					min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return new Date(k.x); }); });
		         	x_data = [min,max];
		          	x_range = [0 ,that.reducedWidth];

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
		          	for(i = 0;i<that.new_data_length;i++) {
			          	that.new_data[i].data.forEach(function (d) {
				          	d.x = new Date(d.x);
			          	});
			          	that.data.forEach(function (d) {
				          	d.x = new Date(d.x);
				          	that.xdomain.push(d.x);
		          		});
			        }
			        // console.log(that.new_data[0].data[2].x);
		          	that.extra_left_margin = 0;
		      	}
		      	that.count = 1;
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
					if(PykCharts.boolean(that.panels_enable)){
						n = that.new_data_length;
						j = 0;
					} else {
						n = 2;
						j = 1;
					}
					for(i=j;i<n;i++) {
						d3.selectAll(that.selector + " #svg-" +i).call(that.zoom_event);
						d3.selectAll(that.selector + " #svg-" + i).on("wheel.zoom", null)
	                    	.on("mousewheel.zoom", null);
	                }
				}
				that.chart_path = d3.svg.line()
					.x(function(d) { return that.xScale(d.x); })
					.y(function(d) { return that.yScale(d.y); })
					.interpolate(that.interpolate);

				that.chartPathClass = (that.type === "lineChart") ? "line" : "multi-line";

				// Code for Live Data
			  	if(evt === "liveData") {
					if(!PykCharts.boolean(that.panels_enable)) {

						for (var i = 0;i < that.new_data_length;i++) {
							var data = that.new_data[i].data;
				    		type = that.type + "-svg-" +i;

				    		that.svgContainer.select(that.selector + " #"+type)
								.datum(that.new_data[i].data)
								.attr("transform", "translate("+ that.extra_left_margin +",0)")
					      		.style("stroke", function() {
				      				if(that.new_data[i].highlight && that.type === "multilineChart" && !that.clicked) {
				      					that.highlightLine(this,null);
				      				} else if(that.clicked) {
				      					that.highlightLine(that.selected,null,that.previous_color);
				      				}
				      				else {
				      					d3.select(this).classed({'multi-line-selected':false,'multi-line':true,'multi-line-hover':false});
				      				}
				      				return that.fillColor.colorPieMS(that.new_data[i],that.type);
				      			});
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

					      	d3.selectAll(that.selector+" text#"+ (that.type + "-svg-" + i))
					      		.style("fill",function() {
					      			return that.fillColor.colorPieMS(that.new_data[i],that.type);
					      		});
						}
					} else {
						type = that.type + that.svgContainer.attr("id");

						for(var i = 0;i < that.new_data_length;i++) {
							var data = that.new_data[i].data;
							var currentSvg = d3.select(that.selector + " #svg-" +i);
							var current_x_axis = currentSvg.select("#xaxis");
							var current_y_axis = currentSvg.select("#yaxis");
							var current_xgrid = currentSvg.select("#xgrid");
							var current_ygrid = currentSvg.select("#ygrid");
							var type_length = type.length;
							var containerId = type.substring(0,type_length-1);

							that.k.xAxis(that.svgContainer,current_x_axis,that.xScale)
								.yAxis(that.svgContainer,current_y_axis,that.yScale)
								.yGrid(that.svgContainer,that.group,that.yScale)
								.xGrid(that.svgContainer,that.group,that.xScale);

							currentSvg.select(that.selector + " #"+containerId+i)
								.datum(that.new_data[i].data)
				      			.attr("transform", "translate("+ that.extra_left_margin +",0)");

							function animation1(index,svg,data) {
								svg.select("#multilineChartsvg-"+index).transition()
									    .duration(that.transitions.duration())
									    .attrTween("d", function (d) {
									    	var interpolate = d3.scale.quantile()
								                .domain([0,1])
								                .range(d3.range(1, data.length + 1));
									        return function(t) {
									            return that.chart_path(data.slice(0, interpolate(t)));
									        };
									    });
							}
							animation1(i,currentSvg,data);
						}
					}

					if(that.type === "lineChart" && that.mode === "default") {
						that.svgContainer
							.on('mouseout',function (d) {
								that.mouseEvent.tooltipHide();
								that.mouseEvent.crossHairHide(that.type);
								that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
								that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
							})
							.on("mousemove", function(){
								if(!PykCharts.boolean(that.panels_enable)) {
									that.mouseEvent.crossHairPosition(that.data,that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.extra_left_margin,that.xdomain,that.type,that.tooltipMode,that.color_from_data,null);
								}
								else {
									that.mouseEvent.crossHairPosition(that.data,that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.extra_left_margin,that.xdomain);
								}
					  		});
					}
				}
				else { // Static Viz
					that.clk = true;
					if(!PykCharts.boolean(that.panels_enable)) {
						var i;
						for (i = 0;i < that.new_data_length;i++) {
							var type = that.type + "-svg-" + i;
							that.dataLineGroup[i] = that.chartBody.append("path");
							var data = that.new_data[i].data;

							that.ticks[i] = that.svgContainer.append("text")
									.attr("id",type)
									.attr("class","legend-heading")
									.style("visibility","hidden")
									.html(that.new_data[i].name)
					      			.style("fill", function() {
					      				return that.fillColor.colorPieMS(that.new_data[i],that.type);
						      		});
					      	
							that.dataLineGroup[i]
									.datum(that.new_data[i].data)
								    .attr("class", "lines-hover " + that.chartPathClass)
								    .attr("id", type)
								    .attr("transform","translate("+ that.extra_left_margin +",0)")
							      	.style("stroke", function() {
							      		if(that.new_data[i].highlight && that.type === "multilineChart") {
					      					that.highlightLine(this,null);
					      				}
					      				return that.fillColor.colorPieMS(that.new_data[i],that.type);
					      			})
					      			.attr("stroke-opacity", function () {
					      				if(that.type === "multilineChart" && that.color_mode === "saturation") {
						      				return (i+1)/that.new_data.length;
					      				} else {
					      					return 1;
					      				}
					      			})
					      			.attr("path-stroke-opacity", function () {
					      				return $(this).attr("stroke-opacity");
					      			})
						      		.on("click",function (d) {
						      			console.log("ddddddddddddddddddd");
						      			if(that.type === "multilineChart") {

						      				that.clicked = true;

						      				console.log("upper function",that.clicked)
						      				// that.prev_opacity = d3.select(this).style("stroke-opacity");
						      				that.highlightLine(PykCharts.getEvent().target,that.clicked,that.previous_color);
										}
									})
									.on("mouseover",function (d) {
										if(that.type === "multilineChart" && this !== that.selected && (that.color_mode === "saturation" || that.hover)) {
											that.previous_color = d3.select(this).attr("stroke-opacity");
											that.click_color = d3.select(this).style("stroke");
											d3.select(this)
												.classed({'multi-line-hover':true,'multi-line':false})
												.style("stroke", "orange");
										}
									})
									.on("mouseout",function (d,i) {
										if(that.type === "multilineChart" && this !== that.selected && (that.color_mode === "saturation" || that.hover)) {
											d3.select(this)
												.classed({'multi-line-hover':false,'multi-line':true})
												.style("stroke", function() {
													if(that.new_data[i].highlight && that.type === "multilineChart") {
								      					that.highlightLine(this,null,that.previous_color/*that.new_data[i].highlight*/);
								      				}
								      				return that.click_color;
								      			})
								      			.attr("stroke-opacity", function () {
								      				if(that.type === "multilineChart" && that.color_mode === "saturation") {
									      				return that.previous_color;
								      				} else {
								      					return 1;
								      				}
								      			});
										}
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
									    })
								}
								transition(i);
						}
					} else {  				// Multiple Containers -- "Yes"
						type = that.type + that.svgContainer.attr("id");
						that.dataLineGroup[0] = that.chartBody.append("path");

						that.dataLineGroup[0]
								.datum(that.new_data1.data)
							    .attr("class", "lines-hover "+that.chartPathClass)
							    .attr("id", type)
							    .attr("transform", "translate("+ that.extra_left_margin +",0)")
								.style("stroke", function() {
						      		if(that.new_data[index].highlight) {
				      					that.highlightLine(this,null);
				      				}
				      				return that.fillColor.colorPieMS(that.new_data[index],that.type);
				      			})
				      			.attr("stroke-opacity", function () {
				      				if(that.color_mode === "saturation") {
					      				return (index+1)/that.new_data.length;
				      				} else {
				      					return 1;
				      				}
				      			})
				      			.attr("path-stroke-opacity", function () {
				      				return $(this).attr("stroke-opacity");
				      			})
					      		.on("click",function (d) {
					      				that.clicked = true;
					      				console.log("upper function",that.clicked)
					      				// that.prev_opacity = d3.select(this).style("stroke-opacity");
					      				that.highlightLine(PykCharts.getEvent().target,that.clicked,that.previous_color);
								})
								.on("mouseover",function (d) {
									if(this !== that.selected && (that.color_mode === "saturation" || that.hover)) {
										that.previous_color = d3.select(this).attr("stroke-opacity");
										that.click_color = d3.select(this).style("stroke");
										d3.select(this)
											.classed({'multi-line-hover':true,'multi-line':false})
											.style("stroke", "orange");
									}
								})
								.on("mouseout",function (d,i) {
									if(this !== that.selected && (that.color_mode === "saturation" || that.hover)) {
										d3.select(this)
											.classed({'multi-line-hover':false,'multi-line':true})
											.style("stroke", function() {
												if(that.new_data[index].highlight) {
							      					that.highlightLine(this,null,that.previous_color/*that.new_data[i].highlight*/);
							      				}
							      				return that.click_color;
							      			})
							      			.attr("stroke-opacity", function () {
							      				if(that.color_mode === "saturation") {
								      				return that.previous_color;
							      				} else {
							      					return 1;
							      				}
							      			});
									}
								});

						function animation(i) {
							that.dataLineGroup[0].transition()
								    .duration(that.transitions.duration())
								    .attrTween("d", function (d) {
								    	var interpolate = d3.scale.quantile()
							                .domain([0,1])
							                .range(d3.range(1, that.new_data[i].data.length + 1));
								        return function(t) {
								            return that.chart_path(that.new_data[i].data.slice(0, interpolate(t)));
								        };
								    });
						}
						animation(index);
					}

					if(that.type === "lineChart" && that.mode === "default") {

						that.svgContainer
							.on('mouseout',function (d) {
								that.mouseEvent.tooltipHide();
								that.mouseEvent.crossHairHide(that.type);
								that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
								that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
							})
							.on("mousemove", function(){
								that.mouseEvent.crossHairPosition(that.data,that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.extra_left_margin,that.xdomain,that.type,that.tooltipMode,that.color_from_data,null);
							});
					}
					else if (that.type === "multilineChart" && that.mode === "default") {
						that.svgContainer
							.on('mouseout', function (d) {
								that.mouseEvent.tooltipHide(null,that.panels_enable,that.type);
								that.mouseEvent.crossHairHide(that.type);
								that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
								that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
								for(var a=0;a < that.new_data_length;a++) {
									$(options.selector+" #svg-"+a).trigger("mouseout");
								}
							})
							.on("mousemove", function(){
								var line = [];
								line[0] = d3.select(options.selector+" #"+this.id+" .lines-hover");
								that.mouseEvent.crossHairPosition(that.data,that.new_data,that.xScale,that.yScale,line,that.extra_left_margin,that.xdomain,that.type,that.tooltipMode,that.color_from_data,that.panels_enable);
								for(var a=0;a < that.new_data_length;a++) {
 									$(options.selector+" #svg-"+a).trigger("mousemove");
								}
							});
					}	
				}
				// var itm=document.getElementById("line");
				// var cln=itm.cloneNode(true);
				// console.log(cln,"testing export step 1");
				return this;
			},
			ticks: function (index) {

				if(PykCharts.boolean(that.pointer_size)) {
					if(PykCharts.boolean(that.panels_enable)) {
						type = that.type + that.svgContainer.attr("id");
						if (that.axis_x_position  === "bottom" && (that.axis_y_position === "left" || that.axis_y_position === "right")) {
							that.ticks[0] = that.svgContainer.append("text")
								.attr("id",type)
								.attr("x", that.margin_left)
								.attr("y", that.margin_top)
								.attr("dy",-5)
								.style("font-size", that.pointer_size + "px")
								.style("font-weight", that.pointer_weight)
								.style("font-family", that.pointer_family)
								.html(that.new_data1.name)
					      		.style("fill", function() {
					      			return that.fillColor.colorPieMS(that.new_data1,that.type);
					      		});
						} else if (that.axis_x_position  === "top"  && (that.axis_y_position === "left" || that.axis_y_position === "right")) {
							that.ticks[0] = that.svgContainer.append("text")
								.attr("id",type)
								.attr("x", that.w - that.margin_left)
								.attr("y", that.height-that.margin_bottom)
								.attr("dy",10)
								.attr("text-anchor","end")
								.style("font-size", that.pointer_size + "px")
								.style("font-weight", that.pointer_weight)
								.style("font-family", that.pointer_family)
								.html(that.new_data1.name)
								.style("fill", function() {
					      			return that.fillColor.colorPieMS(that.new_data1,that.type);
					      		});
						}

					} else {
						if(PykCharts.boolean(that.pointer_overflow_enable)) {
                    		that.svgContainer.style("overflow","visible");
                		}

						tickPosition = function (d,i) {
							var end_x_circle, end_y_circle;
							if(that.axis_y_position === "left") {
								end_x_circle = (that.xScale(that.new_data[i].data[(that.new_data[i].data.length - 1)].x) + that.extra_left_margin + that.margin_left);
								end_y_circle = (that.yScale(that.new_data[i].data[(that.new_data[i].data.length - 1)].y) + that.margin_top);
							} else if(that.axis_y_position === "right") {
								end_x_circle = (that.xScale(that.new_data[i].data[0].x) + that.extra_left_margin + that.margin_left) - 10;
								end_y_circle = (that.yScale(that.new_data[i].data[0].y) + that.margin_top);
							}
							text_x = end_x_circle,
							text_y = end_y_circle,
							text_rotate = 0;
							return "translate("+text_x+","+text_y+") rotate("+text_rotate+")";
						}
						orient = function () {
							if(that.axis_y_position === "left") {
								return "start";
							} else if(that.axis_y_position === "right") {
								return "end";
							}
						}
						that.ticks = that.svgContainer.selectAll(".legend-heading")
								.data(that.new_data);

						that.ticks.enter()
								.append("text")

						that.ticks.attr("id", function (d,i) { return that.type + "-svg-" + i; })
								.attr("class","legend-heading")
								.attr("transform", tickPosition)
								.attr("text-anchor",orient);

						that.ticks.text(function (d,i) {
								return "";
							})
						setTimeout(function() {
							that.ticks.text(function (d,i) {
									return d.name;
								})
								.text(function (d,i) {
									that.tick_w = this.getBBox().width + 5;
									return d.name;
								})
								.style("font-size", that.pointer_size + "px")
								.style("font-weight", function(d){
									if(d.highlight) {
										return "bold";
									} else {
										return that.pointer_weight;
									}
								})
								.style("font-family", that.pointer_family)
								.style("visibility","visible")
								.attr("dx",5)
								.attr("dy",5)
				      			.style("fill", function(d,i) {
				      				return that.fillColor.colorPieMS(that.new_data[i],that.type);
					      		});
					    }, that.transitions.duration());
					   	that.ticks.exit()
					   		.remove();
					}
				}
				return this;
			}
		};
		return optional;
	};
	this.zoomed = function() {
		if(!PykCharts.boolean(that.panels_enable)) {
			that.k.isOrdinal(that.svgContainer,".x.axis",that.xScale,that.xdomain,that.extra_left_margin);
		    that.k.isOrdinal(that.svgContainer,".x.grid",that.xScale);
		    that.k.isOrdinal(that.svgContainer,".y.axis",that.yScale,that.ydomain);
		    that.k.isOrdinal(that.svgContainer,".y.grid",that.yScale);
		    for (i = 0;i < that.new_data_length;i++) {
		    	type = that.type + "-svg-" + i;
		  	 	that.svgContainer.select(that.selector+" #"+type)
		        	.attr("class","lines-hover " + that.chartPathClass)
			        .attr("d", that.chart_path);

		    }
		} else {
		    for (i = 0;i < that.new_data_length;i++) {
		    	type = that.type + "svg-" + i;
		    	currentContainer = d3.selectAll(that.selector + " #svg-" + i);
		    	that.k.isOrdinal(currentContainer,".x.axis",that.xScale,that.xdomain,that.extra_left_margin);
			    that.k.isOrdinal(currentContainer,".x.grid",that.xScale);
			    that.k.isOrdinal(currentContainer,".y.axis",that.yScale,that.ydomain);
			    that.k.isOrdinal(currentContainer,".y.grid",that.yScale);

		  	 	currentContainer.select(that.selector+" #"+type)
		        	.attr("class", "lines-hover " + that.chartPathClass)
			        .attr("d", that.chart_path);

		    }
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
	    that.optionalFeature().ticks();
	};
	this.zoomOut = function () {
		that.optionalFeature().createChart("liveData");
    	that.k.isOrdinal(that.svgContainer,".x.axis",that.xScale,that.xdomain,that.extra_left_margin);
	    that.k.isOrdinal(that.svgContainer,".x.grid",that.xScale);
	    that.k.isOrdinal(that.svgContainer,".y.axis",that.yScale,that.ydomain);
	    that.k.isOrdinal(that.svgContainer,".y.grid",that.yScale);
	}
	this.highlightLine = function(linePath,clicked,prev_opacity) {
			console.log(clicked,"clicked");

			that.selected_line = linePath;
			that.selected_line_data = that.selected_line.__data__;
			that.selected_line_data_len = that.selected_line_data.length;
			that.deselected = that.selected;


			d3.select(that.deselected)
					.classed({'multi-line-selected':false,'multi-line':true,'multi-line-hover':false})

			that.selected = linePath;

			d3.select(that.selected)
					.classed({'multi-line-selected':true,'multi-line':false,'multi-line-hover':false})

			if(that.type === "multilineChart" && (that.color_mode === "saturation" || that.hover))
				d3.select(that.selected)
					.style("stroke", function (d,i) {
	      				return that.click_color;
	      			});

			console.log("outside click", that.clk);

			if(clicked) {
				 if (that.clk) {
				 	if (that.color_mode === "color") {
						d3.selectAll(options.selector+" path.multi-line").attr("stroke-opacity",0.3);
					} else {
						console.log("hey")
						d3.selectAll(options.selector+" path.multi-line").attr("stroke-opacity",0.3);
					}
					if (that.color_mode === "color") {
						d3.selectAll(options.selector+ " .legend-heading").style("opacity",0.3);
					}								
					d3.select(that.selector+" text#"+that.selected.id).style("opacity",1).style
					("font-weight","bold");
					d3.select(that.selected).attr("stroke-opacity",1);
					that.clk = false;
				 } else {
					d3.select(that.selected)
						.classed({'multi-line-selected':false,'multi-line':true,'multi-line-hover':false})
					if (that.color_mode === "color") {
						d3.selectAll(options.selector+" path.multi-line").attr("stroke-opacity",prev_opacity);
					} else {
						d3.selectAll(options.selector+" path.multi-line").attr("stroke-opacity",function () {
							return $(this).attr("path-stroke-opacity");
						});
					}					
					d3.selectAll(options.selector+ " .legend-heading").style("opacity",1);
					d3.select(that.selector+" text#"+that.selected.id).style("opacity",1).style
					("font-weight","normal");
					d3.select(that.selected).attr("stroke-opacity",prev_opacity);
					that.clk = true;				
				}
			}
			
	};

	this.annotation = function () {
		that.line = d3.svg.line()
				.interpolate('linear-closed')
                .x(function(d,i) { return d.x; })
                .y(function(d,i) { return d.y; });

    	if(!PykCharts.boolean(that.panels_enable)) {
			var arrow_size = 12/*line_size = 15*/,annotation = [];

			for(i=0;i<that.new_data_length;i++){
				that.new_data[i].data.map(function (d) {
					if(d.annotation) {
						annotation.push({
							annotation : d.annotation,
							x : d.x,
							y : d.y
						})
					}
				});
			}

			var anno = that.svgContainer.selectAll(that.selector+ " .PykCharts-annotation-line")
                .data(annotation);
            anno.enter()
                .append("path");
              anno.attr("d", function (d,i) {
                	var a = [
                		{
                			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
                			y:parseInt(that.yScale(d.y)-(arrow_size)+that.margin_top)
                		},
                		{
                			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
                			y:parseInt(that.yScale(d.y)-(arrow_size)+that.margin_top)
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
	                	return that.line(a);
	                })
	                .attr("fill",that.annotation_background_color);
           	},that.transitions.duration());

            anno.exit()
            	.remove();
            that.k.annotation(that.selector + " #svg-1",annotation, that.xScale,that.yScale);
		}
		else if(PykCharts.boolean(that.panels_enable)) {
			for(i=0;i<that.new_data_length;i++){
				var annotation = [], arrow_size = 12;
				that.new_data[i].data.map(function (d) {
					if(d.annotation) {
						annotation.push({
							annotation : d.annotation,
							x : d.x,
							y : d.y
						})
					}
				});
				var anno = d3.select(that.selector + " #svg-" + i).selectAll(that.selector+ " .PykCharts-annotation-line")
                    .data(annotation);
                anno.enter()
                    .append("path");
                anno.attr("d", function (d,i) {
                    	var a = [
                    		{
                    			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
                    			y:parseInt(that.yScale(d.y)-(arrow_size)+that.margin_top)
                    		},
                    		{
                    			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
                    			y:parseInt(that.yScale(d.y)-(arrow_size)+that.margin_top)
                    		}
                    	];
                    	return that.line(a);
                    })
                function annotationAnimation(a) {
	                setTimeout(function () {
		            	a.attr("class", "PykCharts-annotation-line")
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
		                    	return that.line(a);
		                    })
		                	.attr("fill",that.annotation_background_color);
		            },that.transitions.duration());
	            }
	            annotationAnimation(anno);
                anno.exit().remove();
                that.k.annotation(that.selector + " #svg-" + i,annotation, that.xScale,that.yScale)
			}
		}

	}
};
