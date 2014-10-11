PykCharts.multiD.lineChart = function (options){
	var that = this;
	var theme = new PykCharts.Configuration.Theme({});

	this.execute = function (){
		that = new PykCharts.multiD.processInputs(that, options, "line");

		if(that.mode === "default") {
			that.k.loading();
		}
		var multiDimensionalCharts = theme.multiDimensionalCharts,
			stylesheet = theme.stylesheet,
			optional = options.optional;
		that.enableCrossHair = options.enableCrossHair ? options.enableCrossHair : multiDimensionalCharts.enableCrossHair;
		that.curvy_lines = options.line_curvy_lines ? options.line_curvy_lines : multiDimensionalCharts.line_curvy_lines;
		that.interpolate = PykCharts.boolean(that.curvy_lines) ? "cardinal" : "linear";
	    that.color_from_data = options.line_color_from_data ? options.line_color_from_data : multiDimensionalCharts.line_color_from_data;
	    
	    d3.json(options.data, function (e, data) {
			that.data = data.groupBy("line");
			that.yAxisDataFormat = options.yAxisDataFormat ? options.yAxisDataFormat : that.k.yAxisDataFormatIdentification(that.data);
    		that.xAxisDataFormat = options.xAxisDataFormat ? options.xAxisDataFormat : that.k.xAxisDataFormatIdentification(that.data);
			that.compare_data = that.data;
			that.data_length = that.data.length;
			that.dataTransformation();
			$(that.selector+" #chart-loader").remove();
			that.render();
		});
	};

	this.dataTransformation = function () {
		that.group_arr = [], that.color_arr = [], that.new_data = []/*, that.dataLineGroup = []*/,

		that.legend_text = [];

		for(j = 0;j < that.data_length;j++) {
			that.group_arr[j] = that.data[j].name;
			if(!that.data[j].color) {
				that.color_arr[j] = that.color[j];
			} else if (that.data[j].color){ 
				that.color_arr[j] = that.data[j].color;
			} else {
				that.hover = true;
			}
		}

		that.uniq_group_arr = that.group_arr.slice();
		that.uniq_color_arr = that.color_arr.slice();
		$.unique(that.uniq_group_arr);
		$.unique(that.uniq_color_arr);
		var len = that.uniq_group_arr.length;

		if(!PykCharts.boolean(that.group_arr[0])){
			that.new_data[0] = {
					name: (that.data[0].name || ""),
					data: []
			};
			for (l = 0;l < that.data_length;l++) {
				that.new_data[0].data.push({
					x: that.data[l].x,
					y: that.data[l].y,
					tooltip: that.data[l].tooltip,
					annotation: that.data[l].annotations || ""
				});
			}
		} else {
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
							annotation: that.data[l].annotations || ""	
						});
					}
				}
			}
		}
		that.new_data_length = that.new_data.length;
	};

	this.render = function () {
		that.dataLineGroup = [];
		that.multid = new PykCharts.multiD.configuration(that);
		if(that.mode === "default") {
			that.transitions = new PykCharts.Configuration.transition(options);
			that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);


			that.k.title()
					.subtitle();

			if(PykCharts.boolean(that.multiple_containers_enable)) {
				that.w = that.width/3;

                that.height = that.height/2;
                that.reducedWidth = that.w - that.margin_left - that.margin_right;
				that.reducedHeight = that.height - that.margin_top - that.margin_bottom;
				that.fill_data = [];
				for(i=0;i<that.new_data_length;i++) {
					that.k.liveData(that)
							.makeMainDiv(that.selector,i)
							.tooltip(true,that.selector,i);

					that.new_data1 = that.new_data[i];
					that.fill_data[0] = that.new_data1;
					that.optionalFeature()
							.chartType()
							.svgContainer(i);


					that.k.crossHair(that.svgContainer,1,that.fill_data,that.fillColor);

					that.optionalFeature()
							.createChart(null,i)
							.axisContainer();
					

					that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain)
							.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain)
							.yGrid(that.svgContainer,that.group,that.yScale)
							.xGrid(that.svgContainer,that.group,that.xScale)
							.xAxisTitle(that.xGroup)
							.yAxisTitle(that.yGroup);
					if((i+1)%4 === 0 && i !== 0) {
                        that.k.emptyDiv();
                    }
				}
				that.k.emptyDiv();
			} else {
				that.w = that.width;
				that.reducedWidth = that.w - that.margin_left - that.margin_right;
				that.reducedHeight = that.height - that.margin_top - that.margin_bottom;

				that.k.liveData(that)
						.makeMainDiv(that.selector,1)
						.tooltip(true,that.selector,1);

				that.optionalFeature()
						.chartType()
						.svgContainer(1)
						.hightLightOnload();

				that.k.crossHair(that.svgContainer,that.new_data_length,that.new_data,that.fillColor);

				that.optionalFeature()
						.createChart()
						.axisContainer();
				that.annotation();

				that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain)
						.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain)
						.yGrid(that.svgContainer,that.group,that.yScale)
						.xGrid(that.svgContainer,that.group,that.xScale)
						.xAxisTitle(that.xGroup)
						.yAxisTitle(that.yGroup);
			}
			that.k.createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();
            that.annotation();
		}
		else if(that.mode === "infographics") {
			that.w = that.width;
			that.reducedWidth = that.w - that.margin_left - that.margin_right;
			that.reducedHeight = that.height - that.margin_top - that.margin_bottom;

			that.k.liveData(that)
					.makeMainDiv(that.selector,1);

			that.optionalFeature()
					.chartType()
					.svgContainer(1)
					.createChart()
					.axisContainer();

			that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain)
					.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain)
					.xAxisTitle(that.xGroup)
					.yAxisTitle(that.yGroup);
		}
		that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
	};

	this.refresh = function () {
		d3.json(options.data, function (e,data) {
			that.data = data.groupBy("line");
			that.data_length = that.data.length;
			var compare = that.multid.checkChangeInData(that.data,that.compare_data);
			that.compare_data = compare[0];
			var data_changed = compare[1];
			that.dataTransformation();

			if(data_changed) {
				that.k.lastUpdatedAt("liveData");
				that.mouseEvent.tooltipHide(null,that.multiple_containers_enable,that.type);
				that.mouseEvent.crossHairHide(that.type);
				that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
				that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
			}
			
			that.optionalFeature().createChart("livedata")
					.hightLightOnload();

			that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain)
					.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain)
					.yGrid(that.svgContainer,that.group,that.yScale)
					.xGrid(that.svgContainer,that.group,that.xScale);
			that.annotation();
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
				$(that.selector).css({"background-color":that.bg,"position":"relative"});

				that.svgContainer = d3.select(that.selector+" #tooltip-svg-container-"+i)
					.append("svg:svg")
					.attr("id","svg-" + i)
					.attr("width",that.w)
					.attr("height",that.height);

				that.group = that.svgContainer.append("g")
					.attr("id","chartsvg")
					.attr("transform","translate("+ that.margin_left +","+ that.margin_top +")");

				if(PykCharts.boolean(that.grid_yEnabled)){
					that.group.append("g")
						.attr("id","ygrid")
						.attr("class","y grid-line");
				}
				if(PykCharts.boolean(that.grid_xEnabled)){
					that.group.append("g")
						.attr("id","xgrid")
						.attr("class","x grid-line");
				}

				that.clip = that.svgContainer.append("svg:clipPath")
					.attr("id","clip")
					.append("svg:rect")
					.attr("width", that.reducedWidth)
					.attr("height", that.reducedHeight);

				that.chartBody = that.svgContainer.append("g")
					.attr("id","clipPath")
					.attr("clip-path", "url(#clip)")
					.attr("transform","translate("+ that.margin_left +","+ that.margin_top +")");

				return this;
			},
			axisContainer : function () {

				if(PykCharts.boolean(that.axis_x_enable)){
					that.xGroup = that.group.append("g")
						.attr("id","xaxis")
						.attr("class", "x axis");
				}
				if(PykCharts.boolean(that.axis_y_enable)){
					that.yGroup = that.group.append("g")
						.attr("id","yaxis")
						.attr("class","y axis");
				}
				return this;
			},
			createChart : function (evt,index) {
			
				var x_domain,x_data = [],y_data,y_range,x_range,y_domain;

				if(that.yAxisDataFormat === "number") {
					max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return k.y; }); });
					min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return k.y; }); });
		         	y_domain = [min,max];
			        y_data = that.k._domainBandwidth(y_domain,2);
			        y_range = [that.reducedHeight, 0];
			        that.yScale = that.k.scaleIdentification("linear",y_data,y_range);

			    } else if(that.yAxisDataFormat === "string") {
			        that.new_data[0].data.forEach(function(d) { y_data.push(d.y); });
			        y_range = [0,that.reducedHeight];
			        that.yScale = that.k.scaleIdentification("ordinal",y_data,y_range,0);

			    } else if (that.yAxisDataFormat === "time") {
			        y_data = d3.extent(that.data, function (d) {
			            return new Date(d.x);
			        });
			        y_range = [that.reducedHeight, 0];
			        that.yScale = that.k.scaleIdentification("time",y_data,y_range);
	      		}
	      		that.xdomain = [];
			    if(that.xAxisDataFormat === "number") {
			      	max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return k.x; }); });
					min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return k.x; }); });
		         	x_domain = [min,max];
		        	x_data = that.k._domainBandwidth(x_domain,2);
		          	x_range = [0 ,that.reducedWidth];
		          	that.xScale = that.k.scaleIdentification("linear",x_data,x_range);
		          	that.extra_left_margin = 0;

		        } else if(that.xAxisDataFormat === "string") {
		          	that.new_data[0].data.forEach(function(d) { x_data.push(d.x); });
		          	x_range = [0 ,that.reducedWidth];
		          	that.xScale = that.k.scaleIdentification("ordinal",x_data,x_range,0);
		          	that.extra_left_margin = (that.xScale.rangeBand() / 2);
		          	that.xdomain = that.xScale.domain();
		        } else if (that.xAxisDataFormat === "time") {
		        	max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return new Date(k.x); }); });
					min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return new Date(k.x); }); });
		         	x_data = [min,max];
		          	x_range = [0 ,that.reducedWidth];
		          	that.xScale = that.k.scaleIdentification("time",x_data,x_range);
		          	for(i = 0;i<that.new_data_length;i++)
			          	that.new_data[i].data.forEach(function (d) {
				          	d.x = new Date(d.x);
			          	});
		          	that.data.forEach(function (d) {
			          	d.x = new Date(d.x);
			          	that.xdomain.push(d.x);
		          	});
		          	that.extra_left_margin = 0;

		      	}
		      	
		      	that.ydomain = that.yScale.domain();
		      	// that.annotation();
		      	// console.log(that.domain);
		      	//
					// that.zoom_event = d3.behavior.zoom()
					// 	.y(that.yScale)
					// 	.scaleExtent([1,2])
					// 	.on("zoom",that.zoomed);
					// if(PykCharts.boolean(that.zoom.enable)) {
					// 	that.svgContainer.call(that.zoom_event);
					// }

				that.chart_path = d3.svg.line()
					.x(function(d) { return that.xScale(d.x); })
					.y(function(d) { return that.yScale(d.y); })
					.interpolate(that.interpolate);

				that.chartPathClass = (that.type === "lineChart") ? "line" : "multi-line";

				// Real - time Viz
			  	if(evt === "livedata") {
					if(!PykCharts.boolean(that.multiple_containers_enable)) {
						for (var i = 0;i < that.new_data_length;i++) {
				    		type = that.type + "-svg-" +i;
					    	that.svgContainer.select(that.selector + " #"+type)
									.datum(that.new_data[i].data)
									// .transition()
									// .attr("transform", "translate("+ that.extra_left_margin +",0)")
						      		.attr("d", that.chart_path);
						}
					} else {
						type = that.type + that.svgContainer.attr("id");

						for(var i = 0;i < that.new_data_length;i++) {
						
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
									//.transition()
					      			.attr("transform", "translate("+ that.extra_left_margin +",0)")
						      		.attr("d", that.chart_path);
						}
					}
					// console.log(that.selected_line_data !== undefined,"whats wrong");
					if(that.type === "lineChart" && that.mode === "default") {
						that.svgContainer
							.on('mouseout',function (d) {
								that.mouseEvent.tooltipHide();
								that.mouseEvent.crossHairHide(that.type);
								that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
								that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
							})
							.on("mousemove", function(){
								if(!PykCharts.boolean(that.multiple_containers_enable)) {
									that.mouseEvent.crossHairPosition(that.data,that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.extra_left_margin,that.xdomain,that.type,that.tooltipMode,that.color_from_data,null);
								}
								else {
									that.mouseEvent.crossHairPosition(that.data,that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.extra_left_margin,that.xdomain);
								}
					  		});
					}
					else if (that.type === "multilineChart" && that.selected_line_data !== undefined) {
						that.selected_line_data = that.selected_line.__data__;
						that.selected_line_data_len = that.selected_line_data.length;
						PykCharts.boolean(that.legends_enable) ? that.updateSelectedLine(that.selected.id) : null;
					}
				}
				else { // Static Viz
					if(!PykCharts.boolean(that.multiple_containers_enable)) {
						for (var i = 0;i < that.new_data_length;i++) {
							type = that.type + "-svg-" + i;
							that.dataLineGroup[i] = that.chartBody.append("path");

							that.legend_text[i] = that.svgContainer.append("text")
									.attr("id",type)
									.attr("class","legend-heading")
									.style("visibility","hidden")
									.html(that.new_data[i].name);

							that.dataLineGroup[i]
									.datum(that.new_data[i].data)
								    .attr("class", that.chartPathClass)
								    .attr("id", type)
								    .attr("transform", "translate("+ that.extra_left_margin +",0)")
							      	.style("stroke", function() {
					      				if(that.new_data[i].highlight && that.type === "multilineChart") {
					      					that.highlightLine(this);
					      				}
					      				return that.fillColor.colorPieMS(that.new_data[i]);
					      			})
					      			.style("stroke-opacity", function () {
					      				if(that.type === "multilineChart" && that.color_mode === "saturation") {
						      				return (i+1)/that.new_data.length;
					      				} else {
					      					return 1;
					      				}
					      			})
						      		.on("click",function (d) {
						      			if(that.type === "multilineChart") {
						      				that.clicked = true;
						      				that.highlightLine(d3.event.target,that.clicked);
										}
									})
									.on("mouseover",function (d) {
										if(that.type === "multilineChart" && this !== that.selected && (that.color_mode === "saturation" || that.hover)) {
											d3.select(this)
											.classed({'multi-line-hover':true,'multi-line':false})
											.style("stroke", "orange");
										}
									})
									.on("mouseout",function (d) {
										if(that.type === "multilineChart" && this !== that.selected && (that.color_mode === "saturation" || that.hover)) {
											d3.select(this)
												.classed({'multi-line-hover':false,'multi-line':true})
												.style("stroke", that.chartColor);
										}
									})					
							    	.attr("d", that.chart_path);

							that.legend_text[i]
				      			.style("fill", function() {
				      				return that.fillColor.colorPieMS(that.new_data[i]);
					      		});
						}
					} else {  				// Multiple Containers -- "Yes"
						type = that.type + that.svgContainer.attr("id");
						that.dataLineGroup[0] = that.chartBody.append("path");

						that.dataLineGroup[0]
								.datum(that.new_data1.data)
							    .attr("class", that.chartPathClass)
							    .attr("id", type)
							    .attr("transform", "translate("+ that.extra_left_margin +",0)")
							    .style("stroke", function (d,i) {
										return that.fillColor.colorPieMS(that.new_data[index]); 
								})
							    .attr("d", that.chart_path);

						if (that.axis_x_position  === "bottom" && (that.axis_y_position === "left" || that.axis_y_position === "right")) {
							that.legend_text[0] = that.svgContainer.append("text")
								.attr("id",type)
								.attr("x", that.width/6)
								.attr("y", that.height/3)
								.attr("dx",-20)
								.style("font-size", that.legendsText_size)
								.style("font-weight", that.legendsText_weight)
								.style("font-family", that.legendsText_family)
								.html(that.new_data1.name);

						} else if (that.axis_x_position  === "top"  && (that.axis_y_position === "left" || that.axis_y_position === "right")) {
							that.legend_text[0] = that.svgContainer.append("text")
								.attr("id",type)
								.attr("x", that.width/6)
								.attr("y", that.height)
								.attr("dy",-20)
								.style("font-size", that.legendsText_size)
								.style("font-weight", that.legendsText_weight)
								.style("font-family", that.legendsText_family)
								.html(that.new_data1.name);						
						}
						if(that.type === "multilineChart") {
								that.legend_text[0]
					      			.style("fill", function() { return that.fillColor.colorPieMS(that.new_data[index]); });					      						      	
						}
					}

					if(that.type === "lineChart" && that.mode === "default") {
						var arrow_size = 10,annotation = [];
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
								that.mouseEvent.tooltipHide(null,that.multiple_containers_enable,that.type);
								that.mouseEvent.crossHairHide(that.type);
								that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
								that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
								for(var a=0;a < that.new_data_length;a++) {
									$(options.selector+" #svg-"+a).trigger("mouseout");
								}
							})
							.on("mousemove", function(){
								var line = [];

								line[0] = d3.select(options.selector+" #"+this.id+" .multi-line");
								that.mouseEvent.crossHairPosition(that.data,that.new_data,that.xScale,that.yScale,line,that.extra_left_margin,that.xdomain,that.type,that.tooltipMode,that.color_from_data,that.multiple_containers_enable);
								for(var a=0;a < that.new_data_length;a++) {
 									$(options.selector+" #svg-"+a).trigger("mousemove");
								}
							});
					}
				}
				return this;
			}
		};
		return optional;
	};
	
	this.highlightLine = function(linePath,clicked) {
	
			that.selected_line = linePath;
			that.selected_line_data = that.selected_line.__data__;
			that.selected_line_data_len = that.selected_line_data.length;
			that.deselected = that.selected;

			d3.select(that.deselected)
					.classed({'multi-line-selected':false,'multi-line':true,'multi-line-hover':false})

			that.selected = linePath;
	
			d3.select(that.selected)
					.classed({'multi-line-selected':true,'multi-line':false,'multi-line-hover':false})
					.style("opacity",1);

			if(clicked) {
				d3.selectAll(options.selector+" path.multi-line").style("opacity",0.3);
			}

			if(PykCharts.boolean(that.legends_enable)) {
				(that.deselected !== undefined)? d3.select("text#"+that.deselected.id).style("visibility","hidden") : null;
				d3.select(that.selector+" text#"+that.selected.id).style("visibility","visible");
				that.updateSelectedLine(that.selected.id);
			}
	}

	this.updateSelectedLine = function (lineid) {
		var height_text = parseFloat(d3.select(that.selector+" text#"+lineid).style("height")) / 2,
			width_text = parseFloat(d3.select(that.selector+" text#"+lineid).style("width")) / 2 ,
			start_x_circle = (that.xScale(that.selected_line_data[0].x) + that.extra_left_margin + that.margin_left),
			start_y_circle = (that.yScale(that.selected_line_data[0].y) + that.margin_top),
			end_x_circle = (that.xScale(that.selected_line_data[(that.selected_line_data_len - 1)].x) + that.extra_left_margin + that.margin_left),
			end_y_circle = (that.yScale(that.selected_line_data[(that.selected_line_data_len - 1)].y) + that.margin_top);

		if(that.legends_display === "vertical") {
			text_x = (end_x_circle - that.margin_left + 25),
			text_y = (end_y_circle - that.margin_top + 20),
			text_rotate = -90;
		}
		else if(that.legends_display === "horizontal") {
			text_x = (end_x_circle - that.margin_left + width_text + 30),
			text_y = (end_y_circle - that.margin_top - height_text + 20),
			text_rotate = 0;
		}

		d3.select(that.selector+" text#"+lineid)
				.attr("transform","translate("+text_x+","+text_y+") rotate("+text_rotate+")")
				.style("font-size", that.legendsText_size)
				.style("font-weight", that.legendsText_weight)
				.style("font-family", that.legendsText_family);
	};
	this.annotation = function () {
		that.line = d3.svg.line()
                .interpolate('linear-closed')
                .x(function(d,i) { return d.x; })
                .y(function(d,i) { return d.y; });
      	if(!PykCharts.boolean(that.multiple_containers_enable) && that.mode === "default") {
			var arrow_size = 10,annotation = [];
			
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


			var anno = that.svgContainer.selectAll(that.selector+ " .linechart-arrows")
                .data(annotation)
            anno.enter()
                .append("path")
            anno.attr("class", "linechart-arrows")
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
				.attr("fill","#eeeeee")
                .call(that.k.annotation);
            anno.exit()
            	.remove();
		} else if(PykCharts.boolean(that.multiple_containers_enable)) {
			for(i=0;i<that.new_data_length;i++){
				var annotation = [], arrow_size = 10;
				that.new_data[i].data.map(function (d) {
					if(d.annotation) {
						annotation.push({
							annotation : d.annotation,
							x : d.x,
							y : d.y 
						})
					}
				});
				var anno = d3.select(that.selector + " #svg-" + i).selectAll(that.selector+ " .linechart-arrows")
                    .data(annotation);
                anno.enter()
                    .append("path")

                anno.attr("class", "linechart-arrows")
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
					.attr("fill","#eeeeee")
                    .call(that.k.annotation);
                anno.exit()
                	.remove();
			}
		}
	}
};				