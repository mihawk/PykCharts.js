PykCharts.multiD.waterfall = function(options){
	var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    var multiDimensionalCharts = theme.multiDimensionalCharts;

	this.execute = function () {
        that = new PykCharts.multiD.processInputs(that, options, "waterfall");
		
		that.grid_y_enable =  options.chart_grid_y_enable ? options.chart_grid_y_enable.toLowerCase() : theme.stylesheet.chart_grid_y_enable;
        that.grid_color = options.chart_grid_color ? options.chart_grid_color : theme.stylesheet.chart_grid_color;
        that.panels_enable = "no";
        that.longest_tick_width = 0;
        
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
                return;
            }

            that.data = that.k.__proto__._groupBy("oned",data);
            that.compare_data = that.k.__proto__._groupBy("oned",data);

            that.axis_y_data_format = that.k.yAxisDataFormatIdentification(that.data);
            that.axis_x_data_format = "number";

            $(that.selector+" #chart-loader").remove();
            PykCharts.multiD.waterfallFunctions(options,that,"waterfall");
            that.render();
		};
		that.k.dataSourceFormatIdentification(options.data,that,"executeData");
	};
};

PykCharts.multiD.waterfallFunctions = function (options,chartObject,type) {
    var that = chartObject;
    
    that.render = function() {
    	var that = this;
    	var l = $(".svgContainer").length;
        that.container_id = "svgcontainer" + l;

        that.dataTransformation();
        
        
        that.transitions = new PykCharts.Configuration.transition(that);
        that.mouseEvent1 = new PykCharts.multiD.mouseEvent(that);
        that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);
        that.border = new PykCharts.Configuration.border(that);

        if (that.mode === "default") {
        	that.reducedWidth = that.width - that.margin_left - that.margin_right;
			that.reducedHeight = that.height - that.margin_top - that.margin_bottom;
			that.padding = 0.2;

    		that.k.title()
    			.backgroundColor(that)
    			.export(that, "#"+that.container_id,"waterfall")
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
                .ticks()
                .createChart();

            that.k.yAxis(that.svgContainer,that.yGroup,that.yScale,that.yDomain,that.y_tick_values);
        }
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

                // if(PykCharts.boolean(that.grid_x_enable)){
                //     that.group.append("g")
                //         .attr("id","xgrid")
                //         .attr("class","x grid-line");
                // }

                return this;
            },
            axisContainer : function () {
                if(PykCharts.boolean(that.axis_y_enable) || that.axis_y_title) {
                    that.yGroup = that.group.append("g")
                        .attr("id","yaxis")
                        .attr("class","y axis");
                }

                that.xScale = d3.scale.linear()
		        	.domain([0, d3.max(that.data, function(d) { return d.end; })])
		        	.range([0, that.reducedWidth]);

		        that.yScale = d3.scale.ordinal()
		        	.domain(that.data.map(function(d) { return d.name; }))
		        	.rangeRoundBands([that.reducedHeight, 0], that.padding);		        
		        that.yDomain = that.yScale.domain();
		        
		        that.bars = that.group.selectAll(".bar")
		        		.data(that.data)
		        	.enter().append("g")
		        		.attr("class", function(d) { return "bar "+d.group; })
		        		.attr("transform", function(d) { return "translate(0, " + that.yScale(d.name) + ")"; });

                return this;
            },
            createChart: function () {
            	that.y_tick_values = that.k.processYAxisTickValues();

		        that.bars.append("rect")
		       		.attr("x", function(d) { return (that.xScale((d.group == "negative") ? d.end : d.start)) + that.longest_tick_width + 20; })
		       		.attr("height", that.yScale.rangeBand())
		       		.attr("width", function(d) { return Math.abs(that.xScale(d.end) - that.xScale(d.start)); })
		       		.attr("fill", function(d,i) {
		       			if (d.name.toLowerCase() == "total") {
		       				return that.chart_color[2];
		       			}
		       			else if (d.group == "negative") {
		       				return that.chart_color[0];
		       			}
		       			else if (d.group == "positive") {
		       				return that.chart_color[1];
		       			}
		       		});

		       	return this;
            },
            ticks: function() {
            	var ticks_formatter = d3.format("s");

            	that.bars.append("text")
		       		.attr("class","ticks-text")
		       		.text(function(d) {
		       			return ticks_formatter(d.weight);
		       		})
		       		.style("visibility","hidden")
		       		.attr("y", function(d) { return (that.yScale.rangeBand()/2 + this.getBBox().height/3); })
		       		.attr("dx", ".25em")
		       		.style("font-weight", that.pointer_weight)
                    .style("font-size", that.pointer_size + "px")
                    .attr("fill", function(d) {
                    	that.longest_tick_width = (that.longest_tick_width < this.getBBox().width) ? this.getBBox().width : that.longest_tick_width;

                    	if (d.group == "negative") {
		       				return that.chart_color[0];
		       			}
		       			else if (d.group == "positive") {
		       				return that.chart_color[1];
		       			}
                    })
                    .style("font-family", that.pointer_family)
		       		.style("visibility","visible");

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
    		totol_group = 'positive',
    		data_length = that.data.length;

    	_.each(that.data, function (d) {
    		temp_cumulative += d.weight;
    		if (temp_cumulative < cumulative) { cumulative = temp_cumulative; }
    	});

    	if (cumulative<0) { cumulative = Math.abs(cumulative); }
    	else { cumulative = 0; }

    	for (var i=0 ; i<data_length ; i++) {
    		that.data[i].start = cumulative;
    		cumulative += that.data[i].weight;
    		that.data[i].end = cumulative;
    		that.data[i].group = (that.data[i].weight > 0) ? "positive" : "negative";
    	}
    	total_start = that.data[0].start;
    	total_end = that.data[data_length-1].end;
    	total_weight = total_end - total_start;
    	totol_group = (total_weight < 0) ? 'negative' : 'positive';

    	that.data.push({
    		name: 'Total',
    		weight: total_weight,
		    end: total_end,
		    start: total_start,
		    group: totol_group
    	});
    	that.data.reverse();
    };
};