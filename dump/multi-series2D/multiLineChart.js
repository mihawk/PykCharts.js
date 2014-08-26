PykCharts.twoD.line = function (options){
	var that = this;
	var theme = new PykCharts.Configuration.Theme({});
	
	this.execute = function (){
		that.k = new PykCharts.Configuration(options);
		that.k1 = new PykCharts.twoD.configuration(options);
		that.optional = options.optional;
		that.mode = options.mode;
		that.type = options.type;
		//that.loading = options.optional.loading;
    that.selector = options.selector;
    that.margin = that.k.setChartMargin();
    that.curvy_lines = (options.optional.curvy_lines === "yes") ? "cardinal" : "linear";
    that.w = options.optional.chart.width;
    that.h = options.optional.chart.height;
    that.reducedWidth = that.w - that.margin.left - that.margin.right;
    that.reducedHeight = that.h - that.margin.top - that.margin.bottom;
    that.ticks = options.optional.chart.no_of_ticks;
    that.enableTooltip = theme.stylesheet.enableTooltip;
    that.enableCrossHair = options.optional.enableCrossHair;
    that.enableAxisHighlightOnHover = options.optional.enableAxisHighlightOnHover;
    that.title = options.optional.title;
    that.color = options.optional.color.color;
    that.bg = theme.stylesheet.colors.backgroundColor;
    that.dataSource = options.optional.dataSource;
    that.liveData = options.optional.liveData;
    that.fullScreenEnabled = theme.stylesheet.buttons.enableFullScreenButton;
    that.enableTicks = theme.stylesheet.enableTicks;
    that.zoomEvt = options.optional.zoom;
    that.download = options.optional.download;
    that.axis = options.optional.axis;
    that.chart = options.optional.chart;
    that.grid = options.optional.chart.grid;
    that.transition = options.optional.transition;
    
  //   if(that.mode === "default") {
		// 	that.k[that.loading.enable]().loading();
		// }

		d3.json(options.data, function (e, data) {                
	      that.data = data;
	      that.data_length = data.length;
	      // $(".loader").remove();
	      that.render();
	  });
	};

	this.render = function (){
		if(that.mode === "default") {
			that.transitions = new PykCharts.Configuration.transition(options);

		  that.k[that.title.enable]().title()
					[that.liveData.enable]().liveData(that)
					[that.fullScreenEnabled]().fullScreen(that)
					[that.enableTooltip]().tooltip(true,options.selector);

			that.optional_feature()
	    		.createSvg()
	    		.createMultiLine()
	    		.axisContainer();

			that.k["yes"]().credits()
					[that.dataSource.enable]().dataSource()
					[that.enableCrossHair]().crossHair(that.svg);
			
			that.mouseEvent = new PykCharts.Configuration.mouseEvent(options);

			that.k
					[that.axis.x.enable]().xAxis(that.svg,that.gxaxis,that.xScale)
					[that.axis.y.enable]().yAxis(that.svg,that.gyaxis,that.yScale)
					[that.grid.yEnabled]().yGrid(that.svg,that.group,that.yScale)
					[that.grid.xEnabled]().xGrid(that.svg,that.group,that.xScale);
		}
		else if(that.mode === "infographic") {
	    that.optional_feature()
	    		.createSvg()
	    		.createMultiLine()
	    		.axisContainer();
	    
	    that.k
		    	[that.axis.x.enable]().xAxis(that.svg,that.gxaxis,that.xScale)
					[that.axis.y.enable]().yAxis(that.svg,that.gyaxis,that.yScale);
  	}
	};

	this.refresh = function (){
		d3.json(options.data, function (e,data) {
			that.data = data;
			that.data_length = data.length;
			
			that.optional_feature().createMultiLine("liveData");

			that.k
					[that.axis.x.enable]().xAxis(that.svg,that.gxaxis,that.xScale)
					[that.axis.y.enable]().yAxis(that.svg,that.gyaxis,that.yScale)
					[that.grid.yEnabled]().yGrid(that.svg,that.group,that.yScale)
					[that.grid.xEnabled]().xGrid(that.svg,that.group,that.xScale);
		});
	};

	this.optional_feature = function (){
		var status = "";
		var optional = {
			yes : function (){
				status = true;
				return this;
			},
			no: function (){
				status = false;
				return this;
			},
			createSvg: function (){
				$(options.selector).css("background-color",that.bg);
        $(that.selector).attr("class","PykCharts-twoD PykCharts-line-chart PykCharts-multi-series2D");
				that.svg = d3.select(that.selector).append("svg:svg")
					.attr("id","svg")
					.attr("width",that.w)
					.attr("height",that.h);

				that.group = that.svg.append("g")
					.attr("id","chartsvg")
					.attr("transform","translate("+ that.margin.left +","+ that.margin.top +")");

				if(that.grid.yEnabled === "yes"){
					that.group.append("g")
						.attr("id","ygrid")
						.attr("class","y grid-line");
				}
				if(that.grid.xEnabled === "yes"){
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
        if(that.axis.x.enable === "yes"){
					that.gxaxis = that.group.append("g")
							.attr("id","xaxis")
							.attr("class", "x axis")
							.attr("transform", "translate(0," + that.reducedHeight + ")");
				}
				if(that.axis.y.enable === "yes"){
					that.gyaxis = that.group.append("g")
							.attr("id","yaxis")
							.attr("class","y axis");
				}
        return this;
      },
			createMultiLine : function (evt) {
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
        that.new_data_length = that.new_data.length;

        var x_domain = [],y_domain,max,min,type;
        max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return k.y; }); });
				min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return k.y; }); });
				y_domain = [(min - 10),(max + 10)];
				that.new_data[0].data.forEach(function(d) { x_domain.push(d.x); });

				that.yScale = d3.scale.linear()
						.domain(y_domain)
						.range([that.reducedHeight, 0]);
				that.xScale = d3.scale.ordinal()
						.domain(x_domain)
						.rangeRoundBands([0, that.reducedWidth]);

				that.zoom = d3.behavior.zoom()
				    .y(that.yScale)
				    .scaleExtent([1,10])
				    .on("zoom", that.zoomed);
				that.svg.call(that.zoom);

				that.lineMargin = (that.xScale.rangeBand() / 2);
 
				if(that.type === "areaChart"){
					that.chart_path = d3.svg.area()
					    .x(function(d) { return that.xScale(d.x); })
					    .y0(that.reducedHeight)
					    .y1(function(d) { return that.yScale(d.y); })
					    .interpolate(that.curvy_lines); // Helps for 'onLoad' transition
					that.chart_path_border = d3.svg.line()
					    .x(function(d) { return that.xScale(d.x); })
					    .y(function(d) { return that.yScale(d.y); })
					    .interpolate(that.curvy_lines); // Helps for 'onLoad' transition
					that.chartPathClass = "area";
					that.colorCssProperty = "fill";
				}
				else if(that.type === "stackedAreaChart"){
					that.chart_path = d3.svg.area()
					    .x(function(d) { return that.xScale(d.x); })
					    .y0(that.reducedHeight)
					    .y1(function(d) { return that.yScale(d.y); })
					    .interpolate(that.curvy_lines);
					that.chart_path_border = d3.svg.line()
					    .x(function(d) { return that.xScale(d.x); })
					    .y(function(d) { return that.yScale(d.y); })
					    .interpolate(that.curvy_lines);
					that.chartPathClass = "stacked-area";
					that.colorCssProperty = "fill";
				}

        if(evt === "liveData"){
        	for (var i = 0;i < that.new_data_length;i++) {
        		type = that.type + that.new_data[i].name;        		
        		that.svg.select("#"+type)
								.datum(that.new_data[i].data)
								.transition()
				      	.ease(that.transition.transition_type)
			      		.duration(that.transitions[that.transition.enable]().duration())
								.attr("transform", "translate("+ that.lineMargin +",0)")
					      .attr("d", that.chart_path);

					 	if(that.type === "areaChart") {
							that.svg.select("border-stacked-area"+i)
									.datum(that.new_data[i].data)
						  		.transition()
					      	.ease("linear")
				      		.duration(that.transitions[that.transition.enable]().duration())
									.attr("transform", "translate("+ that.lineMargin +",0)")
						      .attr("d", that.chart_path_border);	
						}
						
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
					
					// (that.curr_line_data !== undefined) ? that.updateSelectedLine() : null;
				// 	that.svg
				// 			.on('mouseout',function (d) {
		  //           that.mouseEvent[that.enableTooltip]().tooltipHide();
		  //           that.mouseEvent[that.enableCrossHair]().crossHairHide();
				// 				that.mouseEvent[that.enableAxisHighlightOnHover]().axisHighlightHide();
		  //         })
				// 			.on("mousemove", function(){
				// 				that.mouseEvent.crossHairPosition(that.new_data,that.xScale,that.dataLineGroup);
				// 	  	});
				}
				else {
					for (var i = 0;i < that.new_data_length;i++) {
						type = that.type + that.new_data[i].name;
						that.dataLineGroup[i] = that.chartBody.append("path");
						that.dataLineGroup[i]
								.datum(that.new_data[i].data)
					      .attr("class", that.chartPathClass)
					      .attr("id",type)
					      .attr("value",that.new_data[i].group)
					      .classed('multi-line',true)
					      .style(that.colorCssProperty, function(d) { return (that.color === "") ? that.new_data[i].color : that.color; })
					      // .style("fill-opacity", function(d) { return (that.color === "" && that.colorCssProperty === "fill") ? (i/100) : 1; })
					      .attr("transform", "translate("+ that.lineMargin +",0)")
					      .attr("d", that.chart_path);
					  that.dataTextGroup[i] = that.svg.append("text")
					  		.attr("id",that.type+"-"+that.new_data[i].name)
					  		.attr("x", 20)
					  		.attr("y", 20)
					  		.style("display","none")
					  		.text(that.new_data[i].name);

						if(that.type === "stackedAreaChart") {
							that.dataLineGroupBorder[i] = that.chartBody.append("path");
							that.dataLineGroupBorder[i]
										.datum(that.new_data[i].data)
							      .attr("class","line")
							      .attr("id","border-stacked-area"+i)
							      .style("stroke","#1d1d1d")
							      .style("stroke-width","1px")
							      .attr("transform", "translate("+ that.lineMargin +",0)")
							      .attr("d", that.chart_path_border);
						}

						// if(that.type === "areaChart") {
					// 	that.dataLineGroupBorder = that.chartBody.append("path");
					// 	that.dataLineGroupBorder
					// 				.datum(that.data)
					// 	      .attr("class", "line")
					// 	      .attr("id","border-area")
					// 	      .style("stroke","#1d1d1d")
					// 	      .style("stroke-width","1px")
					// 	      .attr("transform", "translate("+ that.lineMargin +",0)")
					// 	      .attr("d", that.chart_path_border);	
					// }					

						that.dataLineGroup[i].on("click",function (d,j) {
								that.curr_line_data = d;
								that.curr_line_data_len = d.length;
								that.deselected = that.selected;
								d3.select(that.deselected).classed({'multi-line-selected':false,'multi-line':true});
								that.selected = this;
								d3.select(that.selected).classed({'multi-line-selected':true,'multi-line':false});

								that.updateSelectedLine();
						});
					} 
					
					// that.svg
				  	// 		.on("click", function () {
				  					// that.start_pt_circle.style("display","none");
				  					// that.end_pt_circle.style("display","none");
				  	// 		});
					  // 		.on('mouseout',function (d) {
			    //         that.mouseEvent[that.enableTooltip]().tooltipHide();
			    //         that.mouseEvent[that.enableCrossHair]().crossHairHide();
							// 		that.mouseEvent[that.enableAxisHighlightOnHover]().axisHighlightHide();
			    //       })
						 //  	.on("mousemove", function(){
						 //  		that.mouseEvent.crossHairPosition(that.new_data,that.xScale,that.dataLineGroup);
						 //  	});
				}
				return this;
			}
		};
		return optional;
	};

	this.zoomed = function() {
		that.k[that.zoomEvt.elements]().isOrdinal(that.svg,".x.axis",that.xScale);
    that.k[that.zoomEvt.elements]().isOrdinal(that.svg,".x.grid",that.xScale);

    that.k[that.zoomEvt.elements]().isOrdinal(that.svg,".y.axis",that.yScale);
    that.k[that.zoomEvt.elements]().isOrdinal(that.svg,".y.grid",that.yScale);
    
    for (i = 0;i < that.new_data_length;i++) {
    	type = that.type + i;
    	// else if(that.type === "areaChart"){
    // 	that.svg.select("."+that.chartPathClass)
    //     .attr("class", that.chartPathClass)
    //     .attr("d", that.chart_path);
    //   that.svg.select(".line")
    //   	.attr("class", "line")
    //     .attr("d", that.chart_path_border);
    // }    
    	else if(that.type === "stackedAreaChart"){
    	 	that.svg.select("#"+type)
	        	.attr("class", that.chartPathClass)
		        .attr("d", that.chart_path);
		    that.svg.select("#border-stacked-area"+i)
			    	.attr("class","line")
			      .attr("d", that.chart_path_border);
    	}
    }

    d3.select(that.selected).classed({'multi-line-selected':true,'multi-line':false});

    (that.curr_line_data !== undefined) ? that.updateSelectedLine() : null;
	};

	this.updateSelectedLine = function () {
			var start_x = (that.xScale(that.curr_line_data[0].x) + that.lineMargin + that.margin.left),
					start_y = (that.yScale(that.curr_line_data[0].y) + that.margin.top),
					end_x = (that.xScale(that.curr_line_data[(that.curr_line_data_len - 1)].x) + that.lineMargin + that.margin.left),
					end_y = (that.yScale(that.curr_line_data[(that.curr_line_data_len - 1)].y) + that.margin.top);
			
	    that.start_pt_circle.show();
			that.start_pt_circle.select("circle")
					.attr("class","bullets")
					.attr("fill",that.color)
					.attr("transform", "translate(" + start_x + "," + start_y + ")");
			that.end_pt_circle.show();
			that.end_pt_circle.select("circle")
					.attr("class","bullets")
					.attr("fill",that.color)
					.attr("transform", "translate(" + end_x + "," + end_y + ")");
	};

	this.fullScreen = function () {
    var modalDiv = d3.select(that.selector).append("div")
		    .attr("id","modalFullScreen")
		    .attr("align","center")
		    .attr("visibility","hidden")
		    .attr("class","clone")
		    .style("align","center")
		    .append("a")
		    .attr("class","b-close")
			      .style("cursor","pointer")
			      .style("position","absolute")
			      .style("right","15px")
			      .style("top","10px")
			      .style("font-size","20px")
			      .style("font-family","arial")
			      .html("X");
		var scaleFactor = 1.4;

		if(that.h >= 430 || that.w >= 780) {
      scaleFactor = 1;
    }
    $("#svg").clone().appendTo("#modalFullScreen");
    
    d3.select(".clone #svg").attr("width",screen.width-200).attr("height",screen.height-185).style("display","block");
    d3.select(".clone #svg #chartsvg").attr("transform","translate("+that.margin.left+","+that.margin.top+")scale("+scaleFactor+")");
    d3.selectAll(".clone #svg #chartsvg g text").style("font-size",9);
    d3.select(".clone #svg g#clipPath").attr("transform","translate("+that.margin.left+","+that.margin.top+")scale("+scaleFactor+")");

    $(".clone").css({"background-color":"#fff","border-radius":"15px","color":"#000","display":"","padding":"20px","min-width":screen.availWidth-100,"min-height":screen.availHeight-200,"visibility":"visible","align":"center"});
    $("#modalFullScreen").bPopup({position: [30, 10],transition: 'fadeIn',onClose: function(){ $('.clone').remove(); }});
  };
};