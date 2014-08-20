PykCharts.twoD.line = function (options){
	var that = this;
	var theme = new PykCharts.Configuration.Theme({});

	this.execute = function (){
		that = new PykCharts.twoD.processInputs(that, options, "line");
		
		if(that.mode === "default") {
			that.k.loading();
		}
		var twoDimensionalCharts = theme.twoDimensionalCharts,
				stylesheet = theme.stylesheet,
				optional = options.optional;
		that.enableCrossHair = optional && optional.enableCrossHair ? optional.enableCrossHair : twoDimensionalCharts.enableCrossHair;
		that.curvy_lines = optional && optional.curvy_lines ? optional.curvy_lines : twoDimensionalCharts.curvy_lines;
		that.grid = options.chart && options.chart.grid ? options.chart.grid : stylesheet.chart.grid;
    that.grid.yEnabled = options.chart && options.chart.grid && options.chart.grid.yEnabled ? options.chart.grid.yEnabled : stylesheet.chart.grid.yEnabled;
    that.grid.xEnabled = options.chart && options.chart.grid && options.chart.grid.xEnabled ? options.chart.grid.xEnabled : stylesheet.chart.grid.xEnabled;
    that.multiple_containers = optional && optional.multiple_containers && optional.multiple_containers.enable ? optional.multiple_containers.enable : twoDimensionalCharts.multiple_containers.enable;
    that.interpolate = PykCharts.boolean(that.curvy_lines) ? "cardinal" : "linear";
    
		d3.json(options.data, function (e, data) {
			that.data = data;
			that.data_length = data.length;
			that.group_arr = [], that.color_arr = [], that.new_data = [], that.dataLineGroup = [],
			that.dataTextGroup = [], that.dataLineGroupBorder = [];
			for(j = 0;j < that.data_length;j++) {
				that.group_arr[j] = that.data[j].group;
				that.color_arr[j] = that.data[j].color;
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
						tooltip: that.data[l].tooltip
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
						if (that.uniq_group_arr[k] === that.data[l].group) {
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
			$(that.selector+" #chart-loader").remove();
			that.render();
		});
	};

	this.render = function () {
		if(that.mode === "default") {
			that.transitions = new PykCharts.Configuration.transition(options);
			
			that.k.title()
						.subtitle();

			if(PykCharts.boolean(that.multiple_containers)) {
				that.w = that.width/that.new_data_length;
				that.reducedWidth = that.w - that.margin.left - that.margin.right;
				that.reducedHeight = that.height - that.margin.top - that.margin.bottom;
				
				for(i=0;i<that.new_data_length;i++) {
					that.k.liveData(that)
								.makeMainDiv(options.selector,i)
								.tooltip(true,options.selector,i);

					that.new_data1 = that.new_data[i];
					that.optionalFeature()
								.chartType()
								.svgContainer(i);

					that.k.crossHair(that.svg);

					that.optionalFeature()
								.createLineChart()
								.axisContainer();

					that.k.xAxis(that.svg,that.gxaxis,that.xScale)
								.yAxis(that.svg,that.gyaxis,that.yScale)
								.yGrid(that.svg,that.group,that.yScale)
								.xGrid(that.svg,that.group,that.xScale);
				}
			} else {
				that.w = that.width;
				that.reducedWidth = that.w - that.margin.left - that.margin.right;
				that.reducedHeight = that.height - that.margin.top - that.margin.bottom;

				that.k.liveData(that)
							.makeMainDiv(options.selector,1)
							.tooltip(true,options.selector,1);

				that.optionalFeature()
							.chartType()
							.svgContainer(1);

				that.k.crossHair(that.svg);

				that.optionalFeature()
							.createLineChart()
							.axisContainer();

				that.k.xAxis(that.svg,that.gxaxis,that.xScale)
							.yAxis(that.svg,that.gyaxis,that.yScale)
							.yGrid(that.svg,that.group,that.yScale)
							.xGrid(that.svg,that.group,that.xScale);
			}
			that.k.credits()
						.dataSource();
		}
		else if(that.mode === "infographics") {
			that.w = that.width;
			that.reducedWidth = that.w - that.margin.left - that.margin.right;
			that.reducedHeight = that.height - that.margin.top - that.margin.bottom;
			
			that.k.liveData(that)
						.makeMainDiv(options.selector,1);

			that.optionalFeature()
						.chartType()
						.svgContainer(1)
						.createLineChart()
						.axisContainer();

			that.k.xAxis(that.svg,that.gxaxis,that.xScale)
						.yAxis(that.svg,that.gyaxis,that.yScale);
		}
		that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
	};

	this.refresh = function (){
		d3.json(options.data, function (e,data) {
			that.data = data;
			that.data_length = data.length;

			that.optionalFeature().createLineChart("liveData");

			that.k.xAxis(that.svg,that.gxaxis,that.xScale)
						.yAxis(that.svg,that.gyaxis,that.yScale)
						.yGrid(that.svg,that.group,that.yScale)
						.xGrid(that.svg,that.group,that.xScale);
		});
	};

	this.optionalFeature = function (){
		var optional = {
			chartType: function () {
				for(j = 0;j < that.data_length;j++) {
					for(k = (j+1);k < that.data_length;k++) {
						if(that.data[j].x === that.data[k].x) {
							that.type = "multiLineChart";
							break;
						}
					}
				}
				that.type = that.type || "lineChart";
				return this;
			},
			svgContainer: function (i){
				if(that.type === "multiLineChart") {
					$(that.selector).attr("class","PykCharts-twoD PykCharts-line-chart PykCharts-multi-series2D");
				}
				else if(that.type === "lineChart") {
					$(that.selector).attr("class","PykCharts-twoD PykCharts-line-chart");
				}
				$(options.selector).css("background-color",that.bg);

				that.svg = d3.select(options.selector+" "+"#tooltip-svg"+i).append("svg:svg")
					.attr("id","svg" + i)
					.attr("width",that.w)
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

				return this;
			},
			axisContainer : function () {
				if(PykCharts.boolean(that.axis.x.enable)){
					that.gxaxis = that.group.append("g")
							.attr("id","xaxis")
							.attr("class", "x axis")
							.attr("transform", "translate(0," + that.reducedHeight + ")");
				}
				if(PykCharts.boolean(that.axis.y.enable)){
					that.gyaxis = that.group.append("g")
							.attr("id","yaxis")
							.attr("class","y axis");
				}
				return this;
			},
			createLineChart : function (evt) {
				that.pt_circle = PykCharts.Configuration.focus_circle;
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
	      
	      if(that.xAxisDataFormat === "number") {
	      	max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return k.x; }); });
					min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return k.x; }); });
         	x_domain = [min,max];
          x_data = that.k._domainBandwidth(x_domain,2);
          x_range = [0 ,that.reducedWidth];
          that.xScale = that.k.scaleIdentification("linear",x_data,x_range);
          that.lineMargin = 0;

        } else if(that.xAxisDataFormat === "string") {
          that.new_data[0].data.forEach(function(d) { x_data.push(d.x); });
          x_range = [0 ,that.reducedWidth];
          that.xScale = that.k.scaleIdentification("ordinal",x_data,x_range,0);
          that.lineMargin = (that.xScale.rangeBand() / 2);

        } else if (that.xAxisDataFormat === "time") {
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
					.on("zoom",that.zoomed);
				if(PykCharts.boolean(that.zoom.enable)) {
					that.svg.call(that.zoom_event);
				}

				that.chart_path = d3.svg.line()
					.x(function(d) { return that.xScale(d.x); })
					.y(function(d) { return that.yScale(d.y); })
					.interpolate(that.interpolate);

				that.chartPathClass = (that.type === "lineChart") ? "line" : "multi-line";

			  if(evt === "liveData") {
					if(!PykCharts.boolean(that.multiple_containers)) {
						for (var i = 0;i < that.new_data_length;i++) {
				    		type = that.type + "svg" +i;
				    		that.svg.select(options.selector + " " +"#"+type)
									.datum(that.new_data[i].data)
									.transition()
									.attr("transform", "translate("+ that.lineMargin +",0)")
						      .attr("d", that.chart_path);
						 	
						 	if(that.type === "multiLineChart") {
						 		that.svg.select(options.selector + " " +"#"+type).on("click",function (d) {
						 				that.selected_line = d3.event.target;
										that.selected_line_data = that.selected_line.__data__;
										that.selected_line_data_len = that.selected_line_data.length;
										that.deselected = that.selected;
										
										d3.select(that.deselected)
												.classed({'multi-line-selected':false,'multi-line':true})
												.style("stroke",that.chartColor);
										that.selected = this;
										d3.select(that.selected)
												.classed({'multi-line-selected':true,'multi-line':false})
												.style("stroke",that.highlightColor);

										that.updateSelectedLine();
								});
						 	}
							else if(that.type === "lineChart") {
								that.svg.select(options.selector + " " +"#"+type)
						      	.style("stroke", function(d) { return d[0].color ? d[0].color : that.chartColor; }); // Hard-coded d[0].color ---- Pending!
							}
						}
					} else {
						type = that.type + that.svg.attr("id");
				    		that.svg.select(options.selector + " " +"#"+type)
									.datum(that.new_data1.data)
									.transition()
					      	.attr("transform", "translate("+ that.lineMargin +",0)")
						      .attr("d", that.chart_path);

						 	if(that.type === "multiLineChart") {
						 		that.svg.select(options.selector + " " +"#"+type).on("click",function (d) {
						 				that.selected_line = d3.event.target;
										that.selected_line_data = that.selected_line.__data__;
										that.selected_line_data_len = that.selected_line_data.length;
										that.deselected = that.selected;
										
										d3.select(that.deselected)
												.classed({'multi-line-selected':false,'multi-line':true})
												.style("stroke",that.chartColor);
										that.selected = this;
										d3.select(that.selected)
												.classed({'multi-line-selected':true,'multi-line':false})
												.style("stroke",that.highlightColor);

										that.updateSelectedLine();
								});
						 	}
							else if(that.type === "lineChart") {
								that.svg.select(options.selector + " " +"#"+type)
						      	.style("stroke", function(d) { return d[0].color ? d[0].color : that.chartColor; }); // Hard-coded d[0].color ---- Pending!
							}
					}

					if(that.type === "lineChart") {
						that.svg
							.on('mouseout',function (d) {
									that.mouseEvent.tooltipHide();
									that.mouseEvent.crossHairHide();
									that.mouseEvent.axisHighlightHide(options.selector + " " +".x.axis");
							})
							.on("mousemove", function(){
									that.mouseEvent.crossHairPosition(that.data,that.xScale,that.svg.select("#"+type),that.lineMargin);
					  	});
					}
					else if (that.type === "multiLineChart" && that.selected_line_data !== undefined) {
						that.selected_line_data = that.selected_line.__data__;
						that.selected_line_data_len = that.selected_line_data.length;
						that.updateSelectedLine();
					}
				}
				else {
					if(!PykCharts.boolean(that.multiple_containers)) {
						for (var i = 0;i < that.new_data_length;i++) {
							type = that.type + "svg" + i;
							that.dataLineGroup[i] = that.chartBody.append("path");
							that.dataLineGroup[i]
									.datum(that.new_data[i].data)
						      .attr("class", that.chartPathClass)
						      .attr("id", type)
						      .attr("transform", "translate("+ that.lineMargin +",0)")
						      .attr("d", that.chart_path);

						  // Legend ---- Pending!
						  // that.dataTextGroup[i] = that.svg.append("text")
						  // 		.attr("id",that.type+"-"+that.new_data[i].name)
						  // 		.attr("x", 20)
						  // 		.attr("y", 20)
						  // 		.style("display","none")
						  // 		.text(that.new_data[i].name);

						  if(that.type === "multiLineChart") {
						  	that.dataLineGroup[i].on("click",function (d) {
						  			that.selected_line = d3.event.target;
										that.selected_line_data = that.selected_line.__data__;
										that.selected_line_data_len = that.selected_line_data.length;
										
										that.deselected = that.selected;
										d3.select(that.deselected)
												.classed({'multi-line-selected':false,'multi-line':true})
												.style("stroke","");
										that.selected = this;
										d3.select(that.selected)
												.classed({'multi-line-selected':true,'multi-line':false})
												.style("stroke",that.highlightColor);
										
										// console.log(this.id,"************");
										that.updateSelectedLine(this.id);
								});
							}
							else if(that.type === "lineChart") {
								that.dataLineGroup[i]
						      	.style("stroke", function(d) { return (that.color === "") ? d[0].color : that.chartColor; }); // Hard-coded d[0].color ---- Pending!
							}
						}
					} else {
						type = that.type + that.svg.attr("id");
						that.dataLineGroup = that.chartBody.append("path");
						that.dataLineGroup
								.datum(that.new_data1.data)
					      .attr("class", that.chartPathClass)
					      .attr("id", type)
					      .attr("transform", "translate("+ that.lineMargin +",0)")
					      .attr("d", that.chart_path);

						  // Legend ---- Pending!
						  // that.dataTextGroup[i] = that.svg.append("text")
						  // 		.attr("id",that.type+"-"+that.new_data[i].name)
						  // 		.attr("x", 20)
						  // 		.attr("y", 20)
						  // 		.style("display","none")
						  // 		.text(that.new_data[i].name);

						if(that.type === "multiLineChart") {
						  that.dataLineGroup.on("click",function (d) {
						  		that.selected_line = d3.event.target;
									that.selected_line_data = that.selected_line.__data__;
									that.selected_line_data_len = that.selected_line_data.length;
							
									that.deselected = that.selected;
									d3.select(that.deselected)
											.classed({'multi-line-selected':false,'multi-line':true})
											.style("stroke","");
									that.selected = this;
									d3.select(that.selected)
											.classed({'multi-line-selected':true,'multi-line':false})
											.style("stroke",that.highlightColor);
									
									that.updateSelectedLine(this.id);
							});
						}
						else if(that.type === "lineChart") {
							that.dataLineGroup
					      		.style("stroke", function(d) { return (that.color === "") ? d[0].color : that.chartColor; }); // Hard-coded d[0].color ---- Pending!
						}
					}
					if(that.type === "lineChart") {
						that.svg
							.on('mouseout',function (d) {
									that.mouseEvent.tooltipHide();
									that.mouseEvent.crossHairHide();
									that.mouseEvent.axisHighlightHide(options.selector + " " +".x.axis");
							})
							.on("mousemove", function(){
								if(!PykCharts.boolean(that.multiple_containers))
										that.mouseEvent.crossHairPosition(that.data,that.xScale,that.dataLineGroup[0],that.lineMargin);
								else
										that.mouseEvent.crossHairPosition(that.data,that.xScale,that.dataLineGroup,that.lineMargin);
							});
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
				type = that.type + "svg" + i;    	
				that.svg.select("#"+type)
					.attr("class", that.chartPathClass)
					.attr("d", that.chart_path);    	
			}
			if(that.type === "multiLineChart") {
				d3.select(that.selected)
						.classed({'multi-line-selected':true,'multi-line':false})
						.style("stroke",that.highlightColor);
				(that.selected_line_data !== undefined) ? that.updateSelectedLine(this.id) : null;
			}
	};

	this.updateSelectedLine = function (lineid) {
		start = that.type.length;
		end = lineid.length;
		svgid = lineid.substring(start,end);

		if(!PykCharts.boolean(that.multiple_containers)) {

			that.pt_circle.attr("id","pt-line"+svgid);
			console.log(that.pt_circle);
			that.start_pt_circle = $(options.selector+" #"+that.pt_circle.attr("id")).clone().appendTo("#svg1");
			that.start_pt_circle
					.attr("id","start-pt-line"+svgid);
			that.end_pt_circle = $(options.selector+" #"+that.start_pt_circle.attr("id")).clone().appendTo("#svg1");
	  	that.end_pt_circle
	  			.attr("id","end-pt-line"+svgid);
		} else {
			that.pt_circle.attr("id","pt-line"+svgid);
			that.start_pt_circle = $(options.selector+" #"+that.pt_circle.attr("id")).clone().appendTo("#"+svgid);
			that.start_pt_circle
					.attr("id","start-pt-line"+svgid);
			that.end_pt_circle = $(options.selector+" #"+that.start_pt_circle.attr("id")).clone().appendTo("#"+svgid);
	  	that.end_pt_circle
	  			.attr("id","end-pt-line"+svgid);
		}
		
  	d3.selectAll(options.selector + " circle").style("visibility","hidden");
		var start_x = (that.xScale(that.selected_line_data[0].x) + that.lineMargin + that.margin.left),
				start_y = (that.yScale(that.selected_line_data[0].y) + that.margin.top),
				end_x = (that.xScale(that.selected_line_data[(that.selected_line_data_len - 1)].x) + that.lineMargin + that.margin.left),
				end_y = (that.yScale(that.selected_line_data[(that.selected_line_data_len - 1)].y) + that.margin.top),
				start,end;
				// console.log(start_x,start_y);
		
		d3.select(options.selector + " #start-pt-line"+svgid+" circle")
			.style("visibility","visible");
		d3.select(options.selector + " #end-pt-line"+svgid+" circle")
			.style("visibility","visible");

		that.start_pt_circle.show();
		that.start_pt_circle.select(options.selector+" circle")
				.attr("class","bullets")
				.attr("transform", "translate(" + start_x + "," + start_y + ")");
		that.end_pt_circle.show();
		that.end_pt_circle.select(options.selector+" circle")
				.attr("class","bullets")
				.attr("transform", "translate(" + end_x + "," + end_y + ")");
	};

	// this.fullScreen = function () {
 //    var modalDiv = d3.select(that.selector).append("div")
	// 			.attr("id","modalFullScreen")
	// 			.attr("align","center")
	// 			.attr("visibility","hidden")
	// 			.attr("class","clone")
	// 			.style("align","center")
	// 			.append("a")
	// 			.attr("class","b-close")
	// 				  .style("cursor","pointer")
	// 				  .style("position","absolute")
	// 				  .style("right","15px")
	// 				  .style("top","10px")
	// 				  .style("font-size","20px")
	// 				  .style("font-family","arial")
	// 				  .html("X");
	// 		var scaleFactor = 1.4;

	// 		if(that.h >= 430 || that.w >= 780) {
	// 	  scaleFactor = 1;
	// 	}
	// 	$("#svg").clone().appendTo("#modalFullScreen");

	// 	d3.select(".clone #svg").attr("width",screen.width-200).attr("height",screen.height-185).style("display","block");
	// 	d3.select(".clone #svg #chartsvg").attr("transform","translate("+that.margin.left+","+that.margin.top+")scale("+scaleFactor+")");
	// 	d3.selectAll(".clone #svg #chartsvg g text").style("font-size",9);
	// 	d3.select(".clone #svg g#clipPath").attr("transform","translate("+that.margin.left+","+that.margin.top+")scale("+scaleFactor+")");

	// 	$(".clone").css({"background-color":"#fff","border-radius":"15px","color":"#000","display":"","padding":"20px","min-width":screen.availWidth-100,"min-height":screen.availHeight-200,"visibility":"visible","align":"center"});
	// 	$("#modalFullScreen").bPopup({position: [30, 10],transition: 'fadeIn',onClose: function(){ $('.clone').remove(); }});
	// };
};