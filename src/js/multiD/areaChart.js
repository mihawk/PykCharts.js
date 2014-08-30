PykCharts.multiD.areaChart = function (options){
	var that = this;
	var theme = new PykCharts.Configuration.Theme({});

	this.execute = function (){
		that = new PykCharts.multiD.processInputs(that, options, "area");

		if(that.mode === "default") {
			that.k.loading();
		}
		var twoDimensionalCharts = theme.twoDimensionalCharts,
			stylesheet = theme.stylesheet,
			optional = options.optional;
	    that.enableCrossHair = optional && optional.enableCrossHair ? optional.enableCrossHair : twoDimensionalCharts.enableCrossHair;
			that.curvy_lines = optional && optional.curvy_lines ? optional.curvy_lines : twoDimensionalCharts.curvy_lines;
			// that.grid = options.chart && options.chart.grid ? options.chart.grid : stylesheet.chart.grid;
	  	// that.grid.yEnabled = options.chart && options.chart.grid && options.chart.grid.yEnabled ? options.chart.grid.yEnabled : stylesheet.chart.grid.yEnabled;
	  	// that.grid.xEnabled = options.chart && options.chart.grid && options.chart.grid.xEnabled ? options.chart.grid.xEnabled : stylesheet.chart.grid.xEnabled;
	  	that.interpolate = PykCharts.boolean(that.curvy_lines) ? "cardinal" : "linear";
		that.reducedWidth = that.width - that.margin.left - that.margin.right;
		that.reducedHeight = that.height - that.margin.top - that.margin.bottom;

		d3.json(options.data, function (e, data) {
			that.data = data.groupBy("area");
			that.data_length = data.length;
			$(that.selector+" #chart-loader").remove();
			that.render();
		});
	};

	this.render = function (){
		if(that.mode === "default") {
			that.transitions = new PykCharts.Configuration.transition(that);

			that.k.title()
					.subtitle()
					.liveData(that)
					.makeMainDiv(options.selector,1)
					.tooltip(true,options.selector,1);

			that.optional_feature()
		    		.chartType()
					.createSvg(1)
					.createChart()
		    		.axisContainer();

			that.k.crossHair(that.svg,that.type)
					.credits();

			that.k.xAxis(that.svg,that.gxaxis,that.xScale)
					.yAxis(that.svg,that.gyaxis,that.yScale)
					.yGrid(that.svg,that.group,that.yScale)
					.xGrid(that.svg,that.group,that.xScale)
					.dataSource();
		}
		else if(that.mode === "infographics") {
			  that.k.liveData(that)
						.makeMainDiv(options.selector,1);

			  that.optional_feature()
			    		.chartType()
						.createSvg(1)
						.createChart()
			    		.axisContainer();

		    that.k.xAxis(that.svg,that.gxaxis,that.xScale)
				 .yAxis(that.svg,that.gyaxis,that.yScale);
  		}
  		that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
	};

	this.refresh = function (){
		d3.json(options.data, function (e,data) {
			that.data = data.groupBy("area");
			that.data_length = data.length;

			that.optional_feature().createChart("liveData");

			that.k.xAxis(that.svg,that.gxaxis,that.xScale)
					.yAxis(that.svg,that.gyaxis,that.yScale)
					.yGrid(that.svg,that.group,that.yScale)
					.xGrid(that.svg,that.group,that.xScale)
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
			createSvg: function (i){
				$(that.selector).attr("class","PykCharts-twoD PykCharts-multi-series2D PykCharts-line-chart");
				$(options.selector).css({"background-color":that.bg,"position":"relative"});

				that.svg = d3.select(options.selector+" "+"#tooltip-svg-container-"+i).append("svg:svg")
					.attr("id","svg")
					.attr("width",that.width)
					.attr("height",that.height);

				that.group = that.svg.append("g")
					.attr("id","chartsvg")
					.attr("transform","translate("+ that.margin.left +","+ that.margin.top +")");

				if(PykCharts.boolean(that.grid.yEnabled)){
					that.group.append("g")
						.attr("id","ygrid")
						.attr("class","y grid-line");
				}
				if(PykCharts.boolean(that.grid.xEnabled)){
					that.group.append("g")
						.attr("id","xgrid")
						.attr("class","x grid-line");
				}

				that.clip = that.svg.append("svg:clipPath")
				    .attr("id","clip")
				    .append("svg:rect")
				    .attr("width", that.reducedWidth)
				    .attr("height", that.reducedHeight);

				that.chartBody = that.svg.append("g")
					.attr("id","clipPath")
					.attr("clip-path", "url(#clip)")
					.attr("transform","translate("+ that.margin.left +","+ that.margin.top +")");

				that.chart_path_stack = d3.layout.stack()
					.values(function(d) { return d.data; });

    			return this;
			},
			axisContainer : function () {
	        if(PykCharts.boolean(that.axis.x.enable)){
				that.gxaxis = that.group.append("g")
						.attr("id","xaxis")
						.attr("class", "x axis");
				}
				if(PykCharts.boolean(that.axis.y.enable)){
					that.gyaxis = that.group.append("g")
						.attr("id","yaxis")
						.attr("class","y axis");
				}
	        	return this;
      		},
			createChart : function (evt) {
				that.group_arr = [], that.color_arr = [], that.new_data = [], that.dataLineGroup = [],
				that.dataTextGroup = [], that.dataLineGroupBorder = [];

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
	            			}
	          			}
	        		}
				}
				that.new_data_length = that.new_data.length;
				that.stacked_new_data = that.chart_path_stack(that.new_data);

        		var x_domain,x_data = [],y_data,y_range,x_range,y_domain;

				if(that.yAxisDataFormat === "number") {
					max = d3.max(that.stacked_new_data, function(d) { return d3.max(d.data, function(k) { return k.y0 + k.y; }); });
					min = 0;
         			y_domain = [min,max];
		          	y_data = that.k._domainBandwidth(y_domain,1);
		          	y_range = [that.reducedHeight, 0];
		          	that.yScale = that.k.scaleIdentification("linear",y_data,y_range);

		        }
		        else if(that.yAxisDataFormat === "string") {
		          	that.new_data[0].data.forEach(function(d) { y_data.push(d.y); });
		          	y_range = [0,that.reducedHeight];
		          	that.yScale = that.k.scaleIdentification("ordinal",y_data,y_range,0);

		        }
		        else if (that.yAxisDataFormat === "time") {
		          	that.stacked_new_data.data.forEach(function (k) {
		          		k.y0 = new Date(k.y0);
		          		k.y = new Date(k.y);
		          	});
		          	max = d3.max(that.stacked_new_data, function(d) { return d3.max(d.data, function(k) { return k.y0 + k.y; }); });
					min = 0;
		         	y_data = [min,max];
		          	y_range = [that.reducedHeight, 0];
		          	that.yScale = that.k.scaleIdentification("time",y_data,y_range);

		        }
		        if(that.xAxisDataFormat === "number") {
        			max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return k.x; }); });
					min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return k.x; }); });
         			x_domain = [min,max];
			        x_data = that.k._domainBandwidth(x_domain,2);
			        x_range = [0 ,that.reducedWidth];
			        that.xScale = that.k.scaleIdentification("linear",x_data,x_range);
			        that.lineMargin = 0;

		        }
		        else if(that.xAxisDataFormat === "string") {
		          	that.new_data[0].data.forEach(function(d) { x_data.push(d.x); });
		          	x_range = [0 ,that.reducedWidth];
		          	that.xScale = that.k.scaleIdentification("ordinal",x_data,x_range,0);
		          	that.lineMargin = (that.xScale.rangeBand() / 2);

		        }
		        else if (that.xAxisDataFormat === "time") {
		        	max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return new Date(k.x); }); });
					min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return new Date(k.x); }); });
		         	x_data = [min,max];
		          	x_range = [0 ,that.reducedWidth];
		          	that.xScale = that.k.scaleIdentification("time",x_data,x_range);
		          	that.new_data[0].data.forEach(function (d) {
		          		d.x = new Date(d.x);
		          	});
		          	that.lineMargin = 0;
		        }

				that.zoom_event = d3.behavior.zoom()
				    .y(that.yScale)
				    .scaleExtent([1,2])
				    .on("zoom", that.zoomed);
				if(PykCharts.boolean(that.zoom.enable)) {
					that.svg.call(that.zoom_event);
				}

				that.lineMargin = (that.xScale.rangeBand() / 2);

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
        			that.svg.select("#"+type)
						.datum(that.stacked_new_data[i].data)
						.transition()
				      	// .ease(that.transition.transition_type)
			      		// .duration(that.transitions[that.transition.enable]().duration())
						.attr("transform", "translate("+ that.lineMargin +",0)")
					    .attr("d", that.chart_path);

						that.svg.select("#border-stacked-area"+i)
							.datum(that.stacked_new_data[i].data)
					  		.transition()
				      		.ease("linear")
			      			.duration(that.transitions.duration())
							.attr("transform", "translate("+ that.lineMargin +",0)")
					      	.attr("d", that.chart_path_border);

						// that.svg.select("#"+type).on("click",function (d) {
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
						that.svg
							.on('mouseout',function (d) {
			          			that.mouseEvent.tooltipHide();
			          			that.mouseEvent.crossHairHide(type);
								that.mouseEvent.axisHighlightHide(options.selector + " .x.axis");
								that.mouseEvent.axisHighlightHide(options.selector + " .y.axis");
		          			})
							.on("mousemove", function(){
								that.mouseEvent.crossHairPosition(that.data,null,that.xScale,that.yScale,that.svg.select("#"+type),that.lineMargin,that.type,that.tooltip.mode);
					  		});
					}
				}
				else {
					for (var i = 0;i < that.new_data_length;i++) {
						type = that.chartPathClass + i;
						that.dataLineGroup[i] = that.chartBody.append("path");
						that.dataLineGroup[i]
							.datum(that.stacked_new_data[i].data)
							.attr("class", that.chartPathClass)
							.attr("id", type)
							.style("fill", function(d,k) { return (that.new_data[i].color !== "") ? that.new_data[i].color : that.chartColor; })
							.attr("transform", "translate("+ that.lineMargin +",0)")
							.attr("d", that.chart_path);

						that.dataLineGroupBorder[i] = that.chartBody.append("path");
						that.dataLineGroupBorder[i]
							.datum(that.stacked_new_data[i].data)
							.attr("class", "area-border")
							.attr("id", "border-stacked-area"+i)
							.style("stroke", that.borderBetweenChartElements.color)
							.style("stroke-width", that.borderBetweenChartElements.width)
							.style("stroke-dasharray", that.borderBetweenChartElements.style)
							.attr("transform", "translate("+ that.lineMargin +",0)")
							.attr("d", that.chart_path_border);

						// Legend ---- Pending!
					  // that.dataTextGroup[i] = that.svg.append("text")
					  // 		.attr("id",that.chartPathClass+"-"+that.new_data[i].name)
					  // 		.attr("x", 20)
					  // 		.attr("y", 20)
					  // 		.style("display","none")
					  // 		.text(that.new_data[i].name);

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
						that.svg
					  		.on("mouseout",function (d) {
									that.mouseEvent.tooltipHide();
									that.mouseEvent.crossHairHide(that.type);
									that.mouseEvent.axisHighlightHide(options.selector + " .x.axis");
									that.mouseEvent.axisHighlightHide(options.selector + " .y.axis");
			          		})
						  	.on("mousemove", function(){
						  		that.mouseEvent.crossHairPosition(that.data,null,that.xScale,that.yScale,that.dataLineGroup,that.lineMargin,that.type,that.tooltip.mode);
						  	});
					}
					else if(that.type === "stackedAreaChart") {
						// that.svg.on("mousemove", function() { console.log(d3.event.pageX,d3.event.pageY); });
					}
				}
				return this;
			}
		};
		return optional;
	};

	this.zoomed = function() {
		that.k.isOrdinal(that.svg,".x.axis",that.xScale);
	    that.k.isOrdinal(that.svg,".x.grid",that.xScale);
	    that.k.isOrdinal(that.svg,".y.axis",that.yScale);
	    that.k.isOrdinal(that.svg,".y.grid",that.yScale);

	    for (i = 0;i < that.new_data_length;i++) {
	    	type = that.chartPathClass + i;
	  	 	that.svg.select(that.selector+" #"+type)
	        	.attr("class", that.chartPathClass)
		        .attr("d", that.chart_path);
		    that.svg.select(that.selector+" #border-stacked-area"+i)
				.attr("class","area-border")
				.attr("d", that.chart_path_border);
	    }

    // d3.select(that.selected).classed({'multi-line-selected':true,'multi-line':false});
    // (that.curr_line_data !== undefined) ? that.updateSelectedLine() : null;
	};

	// this.updateSelectedLine = function () {
	// 	var start_x = (that.xScale(that.curr_line_data[0].x) + that.lineMargin + that.margin.left),
	// 			start_y = (that.yScale(that.curr_line_data[0].y) + that.margin.top),
	// 			end_x = (that.xScale(that.curr_line_data[(that.curr_line_data_len - 1)].x) + that.lineMargin + that.margin.left),
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
