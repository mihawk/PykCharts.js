PykCharts.multiD.areaChart = function (options){
	var that = this;
	var theme = new PykCharts.Configuration.Theme({});

	this.execute = function (){
		that = new PykCharts.multiD.processInputs(that, options, "area");

		if(that.mode === "default") {
			that.k.loading();
		}
		var multiDimensionalCharts = theme.multiDimensionalCharts,
			stylesheet = theme.stylesheet,
			optional = options.optional;
	    that.enableCrossHair = options.enableCrossHair ? options.enableCrossHair : multiDimensionalCharts.enableCrossHair;
		that.curvy_lines = options.line_curvy_lines ? options.line_curvy_lines : multiDimensionalCharts.line_curvy_lines;
		that.color_from_data = options.line_color_from_data ? options.line_color_from_data : multiDimensionalCharts.line_color_from_data;
		// that.grid = options.chart && options.chart.grid ? options.chart.grid : stylesheet.chart.grid;
	  	// that.grid.yEnabled = options.chart && options.chart.grid && options.chart.grid.yEnabled ? options.chart.grid.yEnabled : stylesheet.chart.grid.yEnabled;
	  	// that.grid.xEnabled = options.chart && options.chart.grid && options.chart.grid.xEnabled ? options.chart.grid.xEnabled : stylesheet.chart.grid.xEnabled;
	  	that.interpolate = PykCharts.boolean(that.curvy_lines) ? "cardinal" : "linear";
		that.w = that.width - that.margin_left - that.margin_right;
		that.h = that.height - that.margin_top - that.margin_bottom;

		d3.json(options.data, function (e, data) {
			that.data = data.groupBy("area");
			that.compare_data = that.data;
			that.data_length = that.data.length;
			$(that.selector+" #chart-loader").remove();
			that.render();
		});
	};

	this.render = function (){
		that.dataLineGroup = [], that.dataLineGroupBorder = [];
		that.multid = new PykCharts.multiD.configuration(that);
		if(that.mode === "default") {
			that.transitions = new PykCharts.Configuration.transition(that);

			that.k.title()
					.subtitle()
					.liveData(that)
					.makeMainDiv(options.selector,1)
					.tooltip(true,options.selector,1);

			that.optional_feature()
		    		.chartType()
					.svgContainer(1)
					.createChart()
		    		.axisContainer();

		    console.log(that.new_data);
			that.k.crossHair(that.svgContainer,that.new_data.length,that.type);

			that.k.xAxis(that.svgContainer,that.xGroup,that.xScale)
					.yAxis(that.svgContainer,that.yGroup,that.yScale)
					.yGrid(that.svgContainer,that.group,that.yScale)
					.xGrid(that.svgContainer,that.group,that.xScale)
					.createFooter()
	                .lastUpdatedAt()
	                .credits()
	                .dataSource();
		}
		else if(that.mode === "infographics") {
			  that.k.liveData(that)
						.makeMainDiv(options.selector,1);

			  that.optional_feature()
			    		.chartType()
						.svgContainer(1)
						.createChart()
			    		.axisContainer();

		    that.k.xAxis(that.svgContainer,that.xGroup,that.xScale)
				 .yAxis(that.svgContainer,that.yGroup,that.yScale);
  		}
  		that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
	};

	this.refresh = function (){
		d3.json(options.data, function (e,data) {
			that.data = data.groupBy("area");
			that.data_length = that.data.length;
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

			that.k.xAxis(that.svgContainer,that.xGroup,that.xScale)
					.yAxis(that.svgContainer,that.yGroup,that.yScale)
					.yGrid(that.svgContainer,that.group,that.yScale)
					.xGrid(that.svgContainer,that.group,that.xScale)
					.tooltip(true,options.selector);
		});
	};

	this.optional_feature = function (){
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
				$(options.selector).css({"background-color":that.bg,"position":"relative"});

				that.svgContainer = d3.select(options.selector+" "+"#tooltip-svg-container-"+i).append("svg:svg")
					.attr("id","svg-"+i)
					.attr("width",that.width)
					.attr("height",that.height);

				that.group = that.svgContainer.append("g")
					.attr("id","chartsvg")
					.attr("transform","translate("+ that.margin_left +","+ that.margin_top +")");

				if(PykCharts.boolean(that.chart_grid_yEnabled)){
					that.group.append("g")
						.attr("id","ygrid")
						.attr("class","y grid-line");
				}
				if(PykCharts.boolean(that.chart_grid_xEnabled)){
					that.group.append("g")
						.attr("id","xgrid")
						.attr("class","x grid-line");
				}

				that.clip = that.svgContainer.append("svg:clipPath")
				    .attr("id","clip")
				    .append("svg:rect")
				    .attr("width", that.w)
				    .attr("height", that.h);

				that.chartBody = that.svgContainer.append("g")
					.attr("id","clipPath")
					.attr("clip-path", "url(#clip)")
					.attr("transform","translate("+ that.margin_left +","+ that.margin_top +")");

				that.stack_layout = d3.layout.stack()
					.values(function(d) { return d.data; });

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
			createChart : function (evt) {
				that.group_arr = [], that.color_arr = [], that.new_data = [],
				that.legend_text = [];

				if(that.type === "areaChart") {
					that.new_data[0] = {
						name: (that.data[0].name || ""),
						data: []
					};
					for(j = 0;j < that.data_length;j++) {
						that.new_data[0].data.push({
							x: that.data[j].x,
							y: that.data[j].y,
							tooltip: that.data[j].tooltip,
							color: (that.data[j].color || "")
						});
					}
				}
				else if(that.type === "stackedAreaChart") {
					for(j = 0;j < that.data_length;j++) {
						that.group_arr[j] = that.data[j].name;
						that.color_arr[j] = that.data[j].color;
					}
					that.uniq_group_arr = that.group_arr.slice();
					that.uniq_color_arr = that.color_arr.slice();
					$.unique(that.uniq_group_arr);
					$.unique(that.uniq_color_arr);
					var len = that.uniq_group_arr.length;

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
										tooltip: that.data[l].tooltip
	            			 	});
	            			 	// console.log(that.data[l].y);
	            			}
	          			}
	        		}
				}
				that.new_data_length = that.new_data.length;
				that.layers = that.stack_layout(that.new_data);
				// console.log(that.layers,"layerssss");
				// console.log(that.new_data,"newdata");

        		var x_domain,x_data = [],y_data,y_range,x_range,y_domain;

				if(that.yAxisDataFormat === "number") {
					max = d3.max(that.layers, function(d) { return d3.max(d.data, function(k) { return k.y0 + k.y; }); });
					min = 0;
         			y_domain = [min,max];
		          	y_data = that.k._domainBandwidth(y_domain,1);
		          	y_range = [that.h, 0];
		          	that.yScale = that.k.scaleIdentification("linear",y_data,y_range);

		        }
		        else if(that.yAxisDataFormat === "string") {
		          	that.new_data[0].data.forEach(function(d) { y_data.push(d.y); });
		          	y_range = [0,that.h];
		          	that.yScale = that.k.scaleIdentification("ordinal",y_data,y_range,0);

		        }
		        else if (that.yAxisDataFormat === "time") {
		          	that.layers.data.forEach(function (k) {
		          		k.y0 = new Date(k.y0);
		          		k.y = new Date(k.y);
		          	});
		          	max = d3.max(that.layers, function(d) { return d3.max(d.data, function(k) { return k.y0 + k.y; }); });
					min = 0;
		         	y_data = [min,max];
		          	y_range = [that.h, 0];
		          	that.yScale = that.k.scaleIdentification("time",y_data,y_range);

		        }
		        if(that.xAxisDataFormat === "number") {
        			max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return k.x; }); });
					min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return k.x; }); });
         			x_domain = [min,max];
			        x_data = that.k._domainBandwidth(x_domain,2);
			        x_range = [0 ,that.w];
			        that.xScale = that.k.scaleIdentification("linear",x_data,x_range);
			        that.extra_left_margin = 0;

		        }
		        else if(that.xAxisDataFormat === "string") {
		          	that.new_data[0].data.forEach(function(d) { x_data.push(d.x); });
		          	x_range = [0 ,that.w];
		          	that.xScale = that.k.scaleIdentification("ordinal",x_data,x_range,0);
		          	that.extra_left_margin = (that.xScale.rangeBand() / 2);

		        }
		        else if (that.xAxisDataFormat === "time") {
		        	max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return new Date(k.x); }); });
					min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return new Date(k.x); }); });
		         	x_data = [min,max];
		          	x_range = [0 ,that.w];
		          	that.xScale = that.k.scaleIdentification("time",x_data,x_range);
		          	that.new_data[0].data.forEach(function (d) {
		          		d.x = new Date(d.x);
		          	});
		          	that.extra_left_margin = 0;
		        }

				that.zoom_event = d3.behavior.zoom()
				    .y(that.yScale)
				    .scaleExtent([1,2])
				    .on("zoom", that.zoomed);

				if(PykCharts.boolean(that.zoom_enable)) {
					that.svgContainer.call(that.zoom_event);
				}

				that.extra_left_margin = (that.xScale.rangeBand() / 2);

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
        			type = that.chartPathClass + i;
        			that.svgContainer.select("#"+type)
						.datum(that.layers[i].data)
						// .transition()
				      	// .ease(that.transition.transition_type)
			      		// .duration(that.transitions[that.transition.enable]().duration())
						//.attr("transform", "translate("+ that.extra_left_margin +",0)")
					    .attr("d", that.chart_path);

						that.svgContainer.select("#border-stacked-area"+i)
							.datum(that.layers[i].data)
					  		// .transition()
				      		// .ease("linear")
			      			// .duration(that.transitions.duration())
							//.attr("transform", "translate("+ that.extra_left_margin +",0)")
					      	.attr("d", that.chart_path_border);

						// that.svgContainer.select("#"+type).on("click",function (d) {
						// 		that.curr_line_data = d;
						// 		that.curr_line_data_len = d.length;

						// 		that.deselected = that.selected;
						// 		d3.select(that.deselected).classed({'multi-line-selected':false,'multi-line':true});
						// 		that.selected = this;
						// 		d3.select(that.selected).classed({'multi-line-selected':true,'multi-line':false});

						// 		that.updateSelectedLine();
						// });
					}

					if(that.type === "areaChart") {
						that.svgContainer
							.on('mouseout',function (d) {
			          			that.mouseEvent.tooltipHide();
			          			that.mouseEvent.crossHairHide(type);
								that.mouseEvent.axisHighlightHide(options.selector + " .x.axis");
								that.mouseEvent.axisHighlightHide(options.selector + " .y.axis");
		          			})
							.on("mousemove", function(){
								// console.log(that.svgContainer.select("#"+type),"no no no");
								that.mouseEvent.crossHairPosition(that.data,that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.extra_left_margin,that.type,that.tooltip_mode);
					  		});
					}
				}
				else {
					for (var i = 0;i < that.new_data_length;i++) {
						type = that.chartPathClass + i;
						that.dataLineGroup[i] = that.chartBody.append("path");
						that.dataLineGroup[i]
							.datum(that.layers[i].data)
							.attr("class", that.chartPathClass)
							.attr("id", type)
							.style("fill", function(d,k) { return (that.new_data[i].color !== "") ? that.new_data[i].color : that.chartColor; })
							.attr("transform", "translate("+ that.extra_left_margin +",0)")
							.attr("d", that.chart_path);

						that.dataLineGroupBorder[i] = that.chartBody.append("path");
						that.dataLineGroupBorder[i]
							.datum(that.layers[i].data)
							.attr("class", "area-border")
							.attr("id", "border-stacked-area"+i)
							.style("stroke", that.borderBetweenChartElements_color)
							.style("stroke-width", that.borderBetweenChartElements_width)
							.style("stroke-dasharray", that.borderBetweenChartElements_style)
							.attr("transform", "translate("+ that.extra_left_margin +",0)")
							.attr("d", that.chart_path_border);

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

					if(that.type === "areaChart") {
						that.svgContainer
					  		.on("mouseout",function (d) {
									that.mouseEvent.tooltipHide();
									that.mouseEvent.crossHairHide(that.type);
									that.mouseEvent.axisHighlightHide(options.selector + " .x.axis");
									that.mouseEvent.axisHighlightHide(options.selector + " .y.axis");
			          		})
						  	.on("mousemove", function(){
						  		that.mouseEvent.crossHairPosition(that.data,that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.extra_left_margin,that.type,that.tooltip_mode);
						  	});
					}
					else if(that.type === "stackedAreaChart") {
						// console.log(that.type);
						// that.svgContainer.on("mousemove", function() { console.log(d3.event.pageX,d3.event.pageY); });
						that.svgContainer
							.on('mouseout', function (d) {
								that.mouseEvent.tooltipHide();
								that.mouseEvent.crossHairHide(that.type);
								that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
								that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
								for(var a=0;a < that.new_data_length;a++) {
									$(options.selector+" #svg-"+a).trigger("mouseout");
								}
							})
							.on("mousemove", function(){
								// console.log(d3.select(options.selector+" #"+this.id+" .multi-line").attr("id"),"^^^^^^",this.id);
								var line = [];
								line[0] = d3.select(options.selector+" #"+this.id+" .stacked-area");
								that.mouseEvent.crossHairPosition(that.data,that.new_data,that.xScale,that.yScale,line,that.extra_left_margin,that.type,that.tooltipMode,that.color_from_data,"no");
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

	this.zoomed = function() {
		that.k.isOrdinal(that.svgContainer,".x.axis",that.xScale);
	    that.k.isOrdinal(that.svgContainer,".x.grid",that.xScale);
	    that.k.isOrdinal(that.svgContainer,".y.axis",that.yScale);
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

    // d3.select(that.selected).classed({'multi-line-selected':true,'multi-line':false});
    // (that.curr_line_data !== undefined) ? that.updateSelectedLine() : null;
	};

	// this.updateSelectedLine = function () {
	// 	var start_x = (that.xScale(that.curr_line_data[0].x) + that.extra_left_margin + that.margin.left),
	// 			start_y = (that.yScale(that.curr_line_data[0].y) + that.margin.top),
	// 			end_x = (that.xScale(that.curr_line_data[(that.curr_line_data_len - 1)].x) + that.extra_left_margin + that.margin.left),
	// 			end_y = (that.yScale(that.curr_line_data[(that.curr_line_data_len - 1)].y) + that.margin.top);

	//     that.start_pt_circle.show();
	// 		that.start_pt_circle.select("circle")
	// 			.attr("class","bullets")
	// 			.attr("fill",that.color)
	// 			.attr("transform", "translate(" + start_x + "," + start_y + ")");
	// 		that.end_pt_circle.show();
	// 		that.end_pt_circle.select("circle")
	// 			.attr("class","bullets")
	// 			.attr("fill",that.color)
	// 			.attr("transform", "translate(" + end_x + "," + end_y + ")");
	// };

	// this.fullScreen = function () {
 //    var modalDiv = d3.select(that.selector).append("div")
	// 	    .attr("id","modalFullScreen")
	// 	    .attr("align","center")
	// 	    .attr("visibility","hidden")
	// 	    .attr("class","clone")
	// 	    .style("align","center")
	// 	    .append("a")
	// 	    .attr("class","b-close")
	// 		      .style("cursor","pointer")
	// 		      .style("position","absolute")
	// 		      .style("right","15px")
	// 		      .style("top","10px")
	// 		      .style("font-size","20px")
	// 		      .style("font-family","arial")
	// 		      .html("X");
	// 	var scaleFactor = 1.4;

	// 	if(that.h >= 430 || that.w >= 780) {
 //      scaleFactor = 1;
 //    }
 //    $("#svg").clone().appendTo("#modalFullScreen");

 //    d3.select(".clone #svg").attr("width",screen.width-200).attr("height",screen.height-185).style("display","block");
 //    d3.select(".clone #svg #chartsvg").attr("transform","translate("+that.margin.left+","+that.margin.top+")scale("+scaleFactor+")");
 //    d3.selectAll(".clone #svg #chartsvg g text").style("font-size",9);
 //    d3.select(".clone #svg g#clipPath").attr("transform","translate("+that.margin.left+","+that.margin.top+")scale("+scaleFactor+")");

 //    $(".clone").css({"background-color":"#fff","border-radius":"15px","color":"#000","display":"","padding":"20px","min-width":screen.availWidth-100,"min-height":screen.availHeight-200,"visibility":"visible","align":"center"});
 //    $("#modalFullScreen").bPopup({position: [30, 10],transition: 'fadeIn',onClose: function(){ $('.clone').remove(); }});
 //  };
};
