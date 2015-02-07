PykCharts.multiD.waterfall = function(options){
	var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    var multiDimensionalCharts = theme.multiDimensionalCharts;

	this.execute = function (pykquery_data) {
        that = new PykCharts.validation.processInputs(that, options, "multiDimensionalCharts");
        that.calculate_total_of = options.calculate_total_of ? options.calculate_total_of : [];
        that.axis_y_background_color = options.axis_y_background_color ? options.axis_y_background_color : theme.multiDimensionalCharts.axis_y_background_color;

        PykCharts.scaleFunction(that);
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
        
        if(that.stop) {
            return;
        }
        that.k.storeInitialDivHeight();

        if(that.mode === "default") {
           that.k.loading();
        }
        that.multiD = new PykCharts.multiD.configuration(that);

        that.executeData = function (data) {			
			var validate = that.k.validator().validatingJSON(data),
                id = that.selector.substring(1,that.selector.length);

            if(that.stop || validate === false) {
                that.k.remove_loading_bar(id);
                return;
            }

            that.data = that.k.__proto__._groupBy("waterfall",data);
            that.compare_data = that.k.__proto__._groupBy("waterfall",data);

            that.axis_y_data_format = that.k.yAxisDataFormatIdentification(that.data);
            that.axis_x_data_format = "number";

            that.k.remove_loading_bar(id);
            PykCharts.multiD.waterfallFunctions(options,that,"waterfall");
            that.render();
		};
        if (PykCharts.boolean(options.interactive_enable)) {
            that.k.dataFromPykQuery(pykquery_data);
            that.k.dataSourceFormatIdentification(that.data,that,"executeData");
        } else {
            that.k.dataSourceFormatIdentification(options.data,that,"executeData");
        }   
	};
};

PykCharts.multiD.waterfallFunctions = function (options,chartObject,type) {
    var that = chartObject;

    that.refresh = function (pykquery_data) {
        var element = document.querySelectorAll(".custom-axis");
        for(var i = 0;i<element.length;i++) {
            element[i].parentNode.removeChild(element[i]);
        }

        that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("waterfall",data);
            that.refresh_data = that.k.__proto__._groupBy("waterfall",data);
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }

            that.groupData();
            that.sortData();
            that.calculateRiverData();

            that.optionalFeatures()
                .createScales()
                .ticks()
                .createChart();

            that.k.yAxis(that.svgContainer,that.yGroup,that.yScale,that.yDomain,that.y_tick_values,undefined,undefined,that.tick_format_function)
            that.xaxis();
        };
        if (PykCharts.boolean(options.interactive_enable)) {
            that.k.dataFromPykQuery(pykquery_data);
            that.k.dataSourceFormatIdentification(that.data,that,"executeRefresh");
        } else {
            that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
        }   
    };
                
    that.render = function() {
    	var that = this;
        var id = that.selector.substring(1,that.selector.length);
        that.container_id = id + "_svg";
        that.groupData();
        that.sortData();
        that.calculateRiverData();
        that.transitions = new PykCharts.Configuration.transition(that);
        that.mouseEvent1 = new PykCharts.Configuration.mouseEvent(that);
        that.border = new PykCharts.Configuration.border(that);

        that.reducedWidth = that.chart_width - that.chart_margin_left - that.chart_margin_right;
		that.reducedHeight = that.chart_height - that.chart_margin_top - that.chart_margin_bottom;
        // console.log(that.data,that.new_data)
        if (that.mode === "default") {       	

    		that.k.title()
    			.backgroundColor(that)
    			.export(that, "#"+that.container_id,"waterfallChart")
    			.subtitle()
    			.makeMainDiv(that.selector,1);
    		
    		that.optionalFeatures(id)
                .svgContainer(1,that.container_id)
                .createGroups();

            that.k.liveData(that)
                .tooltip()
                .createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

           	that.optionalFeatures(id)
                .axisContainer()
                .createScales()
               	.ticks()
                .createChart();

        } else if(that.mode === "infographics") {
            that.k.backgroundColor(that)
                .export(that,"#"+that.container_id,"waterfallChart")
                .emptyDiv()
                .makeMainDiv(that.selector,1);

            that.optionalFeatures(id)
                .svgContainer(1,that.container_id)
                .createGroups()
            	.axisContainer()
                .createScales()
                .ticks()
                .createChart();

            that.k.tooltip();
            
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        }

        that.k.yAxis(that.svgContainer,that.yGroup,that.yScale,that.yDomain,that.y_tick_values,undefined,undefined,that.tick_format_function)
                  .yAxisTitle(that.yGroup,undefined);

        that.xaxis();
        that.optionalFeatures().axis_background(that.container_id);
        that.k.exportSVG(that,"#"+that.container_id,"waterfallChart"); 
                    console.log(d3.select("#waterfall-chart_svg #yaxis").attr("width"))
        var resize = that.k.resize(that.svgContainer);
        that.k.__proto__._ready(resize);
        window.addEventListener('resize', function(event){
            return that.k.resize(that.svgContainer);
        });
    };

    that.optionalFeatures = function (id) {
    	var that = this;
    	var optional = {
    		svgContainer: function (i,container_id) {
                document.getElementById(id).className += " PykCharts-twoD";
                that.svgContainer = d3.select(that.selector + " #tooltip-svg-container-" + i)
                    .append("svg:svg")
                    .attr("width",that.chart_width)
                    .attr("height",that.chart_height)
                    .attr("id",container_id)
                    .attr("class","svgcontainer")
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.chart_width + " " + that.chart_height);

                    that.background_rect =  that.svgContainer.selectAll(".background-rect")
                        .data(["rect"])

                    that.background_rect.enter()
                        .append("rect")
                        .attr("class","background-rect")

                    that.background_rect
                        .attr("y",that.chart_margin_top)
                        .attr("width",that.longest_tick_width)
                        .attr("height",that.reducedHeight)    
                        .attr("fill",that.axis_y_background_color);

                return this;
            },
            createGroups: function () {
            	that.group = that.svgContainer.append("g")
                    .attr("id","chartsvg")
                    .attr("transform","translate("+ that.chart_margin_left +","+ that.chart_margin_top +")");

                return this;
            },
            createScales: function () {
                that.y_values = [];
                that.x_values = [];
                var river_data_length = that.river_data.length;
                var domain = [];
                for(var i = 0;i<river_data_length;i++) {
                        domain.push(that.river_data[i].y);
                        that.y_values.push(that.river_data[i].unique_name);
                        that.x_values.push(that.river_data[i].end);
                }

                that.y_values.reverse();
                domain.reverse();
                that.tick_format_function = function (d) {
                    var index = d.lastIndexOf('-');
                    if(index!=-1) {
                        return d.substring(0,index);    
                    } else {
                        return d;
                    }
                }                

            	that.yScale = d3.scale.ordinal()
		        	.domain(that.y_values)
		        	.rangeRoundBands([that.reducedHeight, 0],0.1);

		        that.yDomain = domain;
		        that.data_length = that.data.length;
      
		        that.bars = that.group.selectAll(".bar")
		        		.data(that.river_data);

		        that.bars.attr("transform", function(d) { return "translate(5, " + that.yScale(d.unique_name) + ")"; });

		        that.bars.enter()
		        	.append("g")
	        		.attr("class", function(d) { return "bar "+d.group; })
	        		.attr("transform", function(d) { return "translate(5, " + that.yScale(d.unique_name) + ")"; });

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
		        	.domain([0, d3.max(that.x_values, function(d) { return d; })])
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
                        return d.color;
		       		})
                    .attr("fill-opacity",1)
                    .attr("data-id",function (d,i) {
                        return d.unique_name;
                    })
		       		.on('mouseover',function (d) {
                        if(that.mode === "default") {
                        	var tooltipText = d.tooltip ? d.tooltip : "<table><thead><th colspan='2'><b>"+d.y+"</b></th></thead><tr><td>Start</td><td><b>"+that.ticks_formatter(d.start)+"</b></td></tr><tr><td>Weight</td><td><b>"+that.ticks_formatter(d.x)+"</b></td></tr></table>";
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(tooltipText);
                            that.mouseEvent.axisHighlightShow(d.unique_name,that.selector + " .y.axis",that.y_values,"waterfall");
                            if(PykCharts['boolean'](that.chart_onhover_highlight_enable)) {
                                that.mouseEvent.highlight(that.selector + " .rect", this);
                            }
                        }
                    })
                    .on('mouseout',function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipHide(d);
                            that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
                            if(PykCharts['boolean'](that.chart_onhover_highlight_enable)) {
                                that.mouseEvent.highlightHide(that.selector + " .rect")
                            }
                        }
                    })
                    .on('mousemove', function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    })
                    .on('click', function (d,i) {
                        if(PykCharts['boolean'](options.click_enable)){
                           that.addEvents(d.unique_name, d3.select(this).attr("data-id")); 
                        }                     
                    })
                    .transition()
               		.duration(that.transitions.duration())
               		.delay(function(d) { count_rect++; return (count_rect / that.data_length) * that.transitions.duration(); })
               		.attr("x", function(d) { return (that.xScale((d.group == "negative") ? d.end : d.start)) + that.longest_tick_width + 15; })
		       		.attr("width", function(d) {
                            return Math.abs(that.xScale(d.x)); 
                        });

                rect.exit()
                	.remove();

                that.bars.exit()
                	.remove();

		       	return this;
            },
            ticks: function() {
            	if(that.pointer_size) {
                    // that.background_rect.remove()
                    //     .exit();

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
            },
            axis_background: function (container_id) {
                var y_axis_text = document.querySelectorAll("#"+container_id+" #yaxis .tick text");
                var y_axis_text_length = y_axis_text.length,text = [];
                for(var i=0;i<y_axis_text_length;i++) {
                    text.push(y_axis_text[i].getBBox().width)
                }
                var max_width = d3.max(text,function(d){
                    return d;
                })

                that.background_rect
                    .attr("x",that.chart_margin_left - max_width - 10)
                    .attr("width",max_width+10);


                that.background_rect.exit()
                    .remove();
                return this;
            }
    	};
    	return optional;
    };
    that.groupData = function() {
        that.group_arr = [], that.new_data = [];
        that.ticks = [], that.x_arr = [];

        for(j = 0;j < that.data.length;j++) {

            that.group_arr[j] = that.data[j].group;
        }
        that.uniq_group_arr = that.k.__proto__._unique(that.group_arr);
        var uniq_group_arr_length = that.uniq_group_arr.length;

        for(var k = 0;k < that.data.length;k++) {
            that.x_arr[k] = +that.data[k].x;
        }
        var uniq_x_arr = that.k.__proto__._unique(that.x_arr);

        that.flag = 0;

        for (var k = 0;k < uniq_group_arr_length;k++) {
            that.new_data[k] = {
                    name: that.uniq_group_arr[k],
                    data: []
            };
            for (var l = 0;l < that.data.length;l++) {
                if (that.uniq_group_arr[k] === that.data[l].group) {
                    that.new_data[k].data.push({
                        x: +that.data[l].x,
                        y: that.data[l].y,
                        tooltip: that.data[l].tooltip,
                        name: that.data[l].group,
                        unique_name: that.data[l].group ? (that.data[l].y + "-" + that.data[l].group) : that.data[l].y
                    });
                }
            }
        }
        that.new_data_length = that.new_data.length;
    }

    that.dataTransformation = function (new_data) {
    	var cumulative = 0,
    		temp_cumulative = 0,
    		total_start = 0,
    		total_end = 0,
    		total_weight = 0,
    		totol_group = 'positive',
            data = new_data.data,
            name = 'Total';

    	var data_length = data.length
    	   ,rect_data = [];

    	for(var i = 0; i<that.data.length;i++) {
            temp_cumulative += that.data[i].x;
            if (temp_cumulative < cumulative) {
                cumulative = temp_cumulative; 
            }
        }

        if(new_data.name) {
            name =  name + " " + new_data.name;
        }
        
    	if (cumulative<0) { cumulative = Math.abs(cumulative); }
    	else { cumulative = 0; }
        data = that.rivergroup(cumulative,data,name,cumulative,new_data.name);

        return data;
    };

    that.check_total_is_present = function (data) {
        var present = false;
        for(var l = 0;l<that.calculate_total_of.length;l++) {
            if(data === that.calculate_total_of[l]) {
                present = true;
                break;
            }
        }
        return present;
    }
 
    that.rivergroup = function (start,data,name,cumulative,group_name) {
        var store_cumulative = cumulative;
        for (var i=0 ; i<data.length ; i++) {
            data[i].start = cumulative;
            cumulative += data[i].x;
            data[i].end = cumulative;
            data[i].group = (data[i].x > 0) ? "positive" : "negative"
            data[i].color = (data[i].x > 0) ? that.chart_color[1] : that.chart_color[0];
            data[i].name = data[i].name;
            that.river_data.push(data[i]);
        }
        total_start = start;
        total_end = data[data.length-1].end;
        total_weight = total_end - total_start;
        totol_group = (total_weight < 0) ? 'negative' : 'positive';

        that.river_data.push({
            y: name,
            x: total_weight,
            end: total_end,
            start: total_start,
            group: totol_group,
            color: that.chart_color[2],
            name: data[data.length-1].name,
            unique_name: group_name ? (name+"-"+group_name) : name
        });
        return data;
    }
    that.calculateRiverData = function () {
        that.river_data = [];
        var prev_total;
        for(var i = 0;i<that.new_data_length;i++) { 
            if(i===0) {
                that.dataTransformation(that.new_data[i]);            

            } else {
                var previous_data_length = that.river_data.length;
                prev_total = that.river_data[previous_data_length-1];
                var present = that.check_total_is_present(prev_total.name);
                if(present) {
                    that.river_data.pop();
                }
                name =  'Total' + " " + that.new_data[i].name;
                that.rivergroup(that.river_data[0].start,that.new_data[i].data,name,prev_total.end,that.new_data[i].name);           
            }
        }
        present = that.check_total_is_present(that.river_data[that.river_data.length-1].name);
        if(present) {
            that.river_data.pop();
        }
                   
    }
    that.xaxis = function () {
        var xScale_domain = that.xScale.domain();
        var start_point = that.xScale(xScale_domain[0]) + that.longest_tick_width + 15;
        var end_point = that.xScale(xScale_domain[1]) + that.longest_tick_width + 15,
            extrapadding = 5;
        var middle_point = that.xScale(that.new_data[0].data[0].start) + that.longest_tick_width + 15;
        if(PykCharts['boolean'](that.axis_x_enable)) {
            drawline(start_point+extrapadding,end_point+extrapadding+1,that.reducedHeight,that.reducedHeight);
            drawline(start_point+1+extrapadding,start_point+1+extrapadding,that.reducedHeight,that.reducedHeight+that.axis_x_outer_pointer_length)
            drawline(end_point+1+extrapadding,end_point+1+extrapadding,that.reducedHeight,that.reducedHeight+that.axis_x_pointer_length)
            drawline(middle_point+1+extrapadding,middle_point+1+extrapadding,that.reducedHeight,that.reducedHeight+that.axis_x_pointer_length);
        
            var text = that.group.selectAll(".custom-axis-text")
                .data([0]);

            text.enter()
                .append("text");

            text.attr("class","custom-axis-text")
                .attr("x",middle_point+extrapadding)
                .attr("y",that.reducedHeight+that.axis_x_pointer_length)
                .attr("dy",12)
                .attr("text-anchor","middle")
                .attr("fill",that.axis_x_pointer_color)
                .style("font-family",that.axis_x_pointer_family)
                .style("font-size",that.axis_x_pointer_size)
                .style("font-weight",that.axis_x_pointer_weight)
                .text("0");

            text.exit().remove();
        }

        function drawline(x1,x2,y1,y2) {
            that.group.append("line")
                .attr("x1",x1)
                .attr("y1",y1)
                .attr("x2",x2)
                .attr("y2",y2)
                .attr("class","custom-axis")
                .attr("stroke",that.axis_x_line_color)
                .attr("stroke-width",1);
        }
    }

    that.sortData = function () {
        if(that.axis_y_data_format === "number" || that.axis_y_data_format === "time") {
            for(var i=0;i<that.new_data_length;i++) {
                that.new_data[i].data = that.k.__proto__._sortData(that.new_data[i].data, undefined, "y", that)
            }
        }
    }
};  