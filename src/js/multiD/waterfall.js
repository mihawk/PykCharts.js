PykCharts.multiD.waterfall = function(options){
	var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    var multiDimensionalCharts = theme.multiDimensionalCharts;

	this.execute = function () {
        that = new PykCharts.multiD.processInputs(that, options, "waterfall");
		
		that.grid_y_enable =  options.chart_grid_y_enable ? options.chart_grid_y_enable.toLowerCase() : theme.stylesheet.chart_grid_y_enable;
        that.grid_color = options.chart_grid_color ? options.chart_grid_color : theme.stylesheet.chart_grid_color;
        that.panels_enable = "no";
        
        if(that.stop)
            return;

        if(that.mode === "default") {
           that.k.loading();
        }
        that.multiD = new PykCharts.multiD.configuration(that);
        that.format = that.k.dataSourceFormatIdentification(options.data);
        d3[that.format](options.data, function(e, data){
			
			var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(that.selector+" #chart-loader").remove();
                return;
            }

            that.data = that.k.__proto__._groupBy("bar",data);
            that.compare_data = that.k.__proto__._groupBy("bar",data);
            // console.log(that.data,"*******",options);

            $(that.selector+" #chart-loader").remove();
            PykCharts.multiD.waterfallFunctions(options,that,"waterfall");
            that.render();
		});
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

    		that.k.title()
    			.backgroundColor(that)
    			.export(that, "#"+that.container_id,"waterfall")
    			.subtitle()
    			.makeMainDiv(that.selector,1);
    		
    		that.optionalFeatures()
                .svgContainer(1);

            that.k.liveData(that)
                .tooltip()
                .createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

           	that.optionalFeatures()
                .createChart();
    	}
    };

    that.optionalFeatures = function () {
    	var that = this;
    	var optional = {
    		svgContainer: function (i) {
                $(that.selector).attr("class","PykCharts-twoD");
                that.svgContainer = d3.select(options.selector + " #tooltip-svg-container-" + i)
                    .append("svg:svg")
                    .attr("width",that.width )
                    .attr("height",that.height)
                    .attr("id",that.container_id)
                    .attr("class","svgcontainer")
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height);

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
            createChart: function () {
				var w = that.width - that.margin_left - that.margin_right,
		            h = that.height - that.margin_top - that.margin_bottom,
		            padding = 	0.3;

		        var x = d3.scale.linear()
		        	.range([0, w]);

		        var y = d3.scale.ordinal()
		        	.rangeRoundBands([h, 0], padding);

		        // var xAxis = d3.svg.axis()
		        // 	.scale(x)
		        // 	.orient("bottom");

		        // var yAxis = d3.svg.axis()
		        // 	.scale(y)
		        // 	.orient("left");

		        x.domain([0, d3.max(that.data, function(d) { return d.end; })]);
		        y.domain(that.data.map(function(d) { return d.y; }));

		        var bar = that.svgContainer.selectAll(".bar")
		        		.data(that.data)
		        	.enter().append("g")
		        		.attr("class", function(d) { return "bar "+d.group; })
		        		.attr("transform", function(d) { return "translate(0, " + y(d.y) + ")"; });

		       	bar.append("rect")
		       		.attr("x", function(d) { return x((d.group == "negative") ? d.end : d.start); })
		       		.attr("height", y.rangeBand())
		       		.attr("width", function(d) { return Math.abs(x(d.end) - x(d.start)); })
		       		.attr("fill", function(d,i) {
		       			if (d.group == "negative") {
		       				return that.chart_color[0];
		       			}
		       			else if (d.group == "positive") {
		       				return that.chart_color[1];
		       			}
		       			else if (d.group == "total") {
		       				return that.chart_color[2];
		       			}
		       		});

		       	bar.append("text")
		       		.attr("class","ticks-text")
		       		.text(function(d) { return (d.end - d.start); })
		       		.style("visibility","hidden")
		       		.attr("y", function(d) { return (y.rangeBand()/2 + this.getBBox().height/3); })
		       		.attr("x", function(d) { return (d.group == "negative") ? (x(d.start) - this.getBBox().width) : (x(d.end) - this.getBBox().width); })
		       		.attr("dx", function(d) { return "-.5em"; })
		       		.attr("fill", "white")
		       		.style("visibility","visible");

		       	bar.filter(function(d) { return d.group != "total" }).append("line")
				      .attr("class", "waterfall-connector")
				      .attr("x1", function(d) { return x(d.end); })
				      .attr("y1", y.rangeBand())
				      .attr("x2", function(d) { return x(d.end); })
				      .attr("y2", y.rangeBand() + 5 );

		       	return this;
            }
    	};
    	return optional;
    };

    that.dataTransformation = function () {
    	var cumulative = 0;
    		
    	// console.log(that.data);
    	for (var i=0 ; i<that.data.length ; i++) {
    		that.data[i].start = cumulative;
    		cumulative += that.data[i].x;
    		that.data[i].end = cumulative;
    		that.data[i].group = (that.data[i].x > 0) ? "positive" : "negative";
    	}
    	that.data.push({
    		y: "Total",
    		x: cumulative,
    		end: cumulative,
    		start: 0,
    		group: "total"
    	});
    	that.data.reverse();
    };
};