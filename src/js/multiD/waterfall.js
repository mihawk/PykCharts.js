PykCharts.multiD.waterfall = function(options){
	var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    var multiDimensionalCharts = theme.multiDimensionalCharts;

	this.execute = function () {
        that = new PykCharts.multiD.processInputs(that, options, "waterfall");
		
		that.color_mode = "color";
		that.grid_y_enable = "no";
        that.grid_color = "#fff";
        that.panels_enable = "no";
        that.longest_tick_width = 0;
        that.ticks_formatter = d3.format("s");

        try {
        	if (that.chart_color.length == 0) {
	        	that.chart_color = ["rgb(255, 60, 131)", "rgb(0, 185, 250)", "grey"];
	        	throw "chart_color";
	        }
	        else if (that.chart_color.length == 1) {
	        	that.chart_color.push("rgb(0, 185, 250)", "grey");
	        	throw "chart_color";
	        }
	        else if (that.chart_color.length == 2) {
	        	that.chart_color.push("grey");
	        	throw "chart_color";
	        }
        }
        catch(err) {
        	console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to have passed less than three colors for '"+err+"', in a waterfall chart."+"\")  Visit www.chartstore.io/docs#warning_"+"18");
        }
        
        if(that.stop)
            return;

        if(that.mode === "default") {
           that.k.loading();
        }
        that.multiD = new PykCharts.multiD.configuration(that);

        that.executeData = function (data) {			
			var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(that.selector+" #chart-loader").remove();
                $(that.selector).css("height","auto");
                return;
            }

            that.data = that.k.__proto__._groupBy("waterfall",data);
            that.compare_data = that.k.__proto__._groupBy("waterfall",data);

            that.axis_y_data_format = that.k.yAxisDataFormatIdentification(that.data);
            that.axis_x_data_format = "number";

            $(that.selector+" #chart-loader").remove();
            $(that.selector).css("height","auto");
            PykCharts.multiD.waterfallFunctions(options,that,"waterfall");
            that.render();
		};
		that.k.dataSourceFormatIdentification(options.data,that,"executeData");
	};
};

PykCharts.multiD.waterfallFunctions = function (options,chartObject,type) {
    var that = chartObject;

    that.refresh = function () {
        that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("waterfall",data);
            that.refresh_data = that.k.__proto__._groupBy("waterfall",data);
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }

            that.dataTransformation();

            that.optionalFeatures()
                .createScales()
                .ticks()
                .createChart();

            that.k.yAxis(that.svgContainer,that.yGroup,that.yScale,that.yDomain,that.y_tick_values);
        };

        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
    };
    
    that.render = function() {
    	var that = this;
    	var l = $(".svgContainer").length;
        that.container_id = "svgcontainer" + l;

        that.dataTransformation();
        
        that.transitions = new PykCharts.Configuration.transition(that);
        that.mouseEvent1 = new PykCharts.multiD.mouseEvent(that);
        that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);
        that.border = new PykCharts.Configuration.border(that);

        that.reducedWidth = that.width - that.margin_left - that.margin_right;
		that.reducedHeight = that.height - that.margin_top - that.margin_bottom;

        if (that.mode === "default") {       	

    		that.k.title()
    			.backgroundColor(that)
    			.export(that, "#"+that.container_id,"waterfallChart")
    			.subtitle()
    			.makeMainDiv(that.selector,1);
    		
    		that.optionalFeatures()
                .svgContainer(1)
                .createGroups();

            that.k.liveData(that)
                .tooltip()
                .createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

           	that.optionalFeatures()
                .axisContainer()
                .createScales()
               	.ticks()
                .createChart();

        } else if(that.mode === "infographics") {
            that.k.backgroundColor(that)
                .export(that,"#"+that.container_id,"waterfallChart")
                .emptyDiv()
                .makeMainDiv(that.selector,1);

            that.optionalFeatures()
                .svgContainer(1)
                .createGroups()
            	.axisContainer()
                .createScales()
                .ticks()
                .createChart();

            that.k.tooltip();
            
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        }
        that.k.yAxis(that.svgContainer,that.yGroup,that.yScale,that.yDomain,that.y_tick_values)
                  .yAxisTitle(that.yGroup,undefined);

        that.k.exportSVG(that,"#"+that.container_id,"waterfallChart");

        $(document).ready(function () { return that.k.resize(that.svgContainer,""); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer,""); });
    };

    that.optionalFeatures = function () {
    	var that = this;
    	var optional = {
    		svgContainer: function (i) {
                $(that.selector).attr("class","PykCharts-twoD");
                that.svgContainer = d3.select(options.selector + " #tooltip-svg-container-" + i)
                    .append("svg:svg")
                    .attr("width",that.width)
                    .attr("height",that.height)
                    .attr("id",that.container_id)
                    .attr("class","svgcontainer")
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height);

                return this;
            },
            createGroups: function () {
            	that.group = that.svgContainer.append("g")
                    .attr("id","chartsvg")
                    .attr("transform","translate("+ that.margin_left +","+ that.margin_top +")");

                return this;
            },
            createScales: function () {
            	that.yScale = d3.scale.ordinal()
		        	.domain(that.data.map(function(d) { return d.y; }))
		        	.rangeRoundBands([that.reducedHeight, 0]);
		        that.yDomain = that.yScale.domain();
		        that.data_length = that.data.length;

		        var padding_temp = that.reducedHeight - (that.data_length * that.yScale.rangeBand());
		        that.padding = (padding_temp / (that.data_length - 1)) * 0.3;

		        that.yScale.rangeRoundBands([that.reducedHeight, 0], that.padding);

		        that.bars = that.group.selectAll(".bar")
		        		.data(that.rect_data);

		        that.bars.attr("transform", function(d) { return "translate(5, " + that.yScale(d.y) + ")"; });

		        that.bars.enter()
		        	.append("g")
	        		.attr("class", function(d) { return "bar "+d.group; })
	        		.attr("transform", function(d) { return "translate(5, " + that.yScale(d.y) + ")"; });

            	return this;
            },
            axisContainer : function () {
                if(PykCharts.boolean(that.axis_y_enable) || that.axis_y_title) {
                	that.yGroup = that.group.append("g")
                        .attr("id","yaxis")
                        .attr("class","y axis");
                }

                return this;
            },
            createChart: function () {
            	that.y_tick_values = that.k.processYAxisTickValues();

            	that.xScale = d3.scale.linear()
		        	.domain([0, d3.max(that.data, function(d) { return d.end; })])
		        	.range([0, (that.reducedWidth - that.longest_tick_width - 15)]);

		    	var rect = that.bars.selectAll(".rect")
	    				.data(function(d){
	    					return [d];
	    				});

	    		rect.enter().append("rect")
    				.attr("class","rect")
		       		.attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-dasharray", that.border.style())
                    .attr("stroke-opacity",1);
                var count_rect = 0;
		        
		        rect.attr("x", function(d) { return that.xScale(d.start) + that.longest_tick_width + 15; })
		       		.attr("height", that.yScale.rangeBand())
		       		.attr("width", 0)
		       		.attr("fill", function(d,i) {
		       			if (d.y.toLowerCase() == "total") {
		       				return that.chart_color[2];
		       			}
		       			else if (d.group == "negative") {
		       				return that.chart_color[0];
		       			}
		       			else if (d.group == "positive") {
		       				return that.chart_color[1];
		       			}
		       		})
                    .attr("fill-opacity",1)
		       		.on('mouseover',function (d) {
                        if(that.mode === "default") {
                        	var tooltipText = d.tooltip ? d.tooltip : "<table><thead><th colspan='2'><b>"+d.y+"</b></th></thead><tr><td>Start</td><td><b>"+that.ticks_formatter(d.start)+"</b></td></tr><tr><td>Weight</td><td><b>"+that.ticks_formatter(d.x)+"</b></td></tr></table>";
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(tooltipText);
                            that.mouseEvent.axisHighlightShow(d.y,that.selector + " .y.axis",that.yDomain,"waterfall");
                            if(PykCharts['boolean'](that.onhover_enable)) {
                                that.mouseEvent.highlight(that.selector + " .rect", this);
                            }
                        }
                    })
                    .on('mouseout',function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipHide(d);
                            that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
                            if(PykCharts['boolean'](that.onhover_enable)) {
                                that.mouseEvent.highlightHide(that.selector + " .rect")
                            }
                        }
                    })
                    .on('mousemove', function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    })
                    .transition()
               		.duration(that.transitions.duration())
               		.delay(function(d) { count_rect++; return (count_rect / that.data_length) * that.transitions.duration(); })
               		.attr("x", function(d) { return (that.xScale((d.group == "negative") ? d.end : d.start)) + that.longest_tick_width + 15; })
		       		.attr("width", function(d) { return Math.abs(that.xScale(d.x)); });

                rect.exit()
                	.remove();

                that.bars.exit()
                	.remove();

		       	return this;
            },
            ticks: function() {
            	if(that.pointer_size) {

            		var ticks = that.bars.selectAll(".ticks-text")
		    				.data(function(d){
		    					return [d];
		    				});

		    		ticks.enter().append("text")
	    				.attr("class","ticks-text")
	                    .style("font-weight", that.pointer_weight)
	                    .style("font-size", that.pointer_size + "px")
	                    .style("font-family", that.pointer_family)
	                    .text("");

	            	ticks.text(function(d) {
			       			return that.ticks_formatter(d.x);
			       		})
			       		.style("visibility","hidden")
			       		.attr("y", function(d) { return (that.yScale.rangeBand()/2 + this.getBBox().height/3); })
			       		.attr("dx", ".25em")
			       		.attr("fill", function(d) {
	                    	that.longest_tick_width = (that.longest_tick_width < this.getBBox().width) ? this.getBBox().width : that.longest_tick_width;

	                    	if (d.group == "negative") {
			       				return that.chart_color[0];
			       			}
			       			else if (d.group == "positive") {
			       				return that.chart_color[1];
			       			}
	                    })
			       		.style("visibility","visible");

			       	ticks.exit()
			       		.remove();
			    }

            	return this;
            }
    	};
    	return optional;
    };

    that.dataTransformation = function () {
    	var cumulative = 0,
    		temp_cumulative = 0,
    		total_start = 0,
    		total_end = 0,
    		total_weight = 0,
    		totol_group = 'positive';
    	that.data_length = that.data.length;
    	that.rect_data = [];

    	_.each(that.data, function (d) {
    		temp_cumulative += d.x;
    		if (temp_cumulative < cumulative) { cumulative = temp_cumulative; }
    	});

    	if (cumulative<0) { cumulative = Math.abs(cumulative); }
    	else { cumulative = 0; }

    	for (var i=0 ; i<that.data_length ; i++) {
    		that.data[i].start = cumulative;
    		cumulative += that.data[i].x;
    		that.data[i].end = cumulative;
    		that.data[i].group = (that.data[i].x > 0) ? "positive" : "negative";
    	}
    	total_start = that.data[0].start;
    	total_end = that.data[that.data_length-1].end;
    	total_weight = total_end - total_start;
    	totol_group = (total_weight < 0) ? 'negative' : 'positive';

    	that.data.push({
    		y: 'Total',
    		x: total_weight,
		    end: total_end,
		    start: total_start,
		    group: totol_group
    	});
    	that.data.reverse();
    	that.data_length = that.data.length;

    	for (var i=0 ; i<that.data_length ; i++) {
    		that.rect_data[i] = that.data[i];
    	}
    	that.rect_data.reverse();
    };
};