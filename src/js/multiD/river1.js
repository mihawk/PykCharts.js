PykCharts.multiD.river = function (options){
	var that = this;
	var theme = new PykCharts.Configuration.Theme({});

	this.execute = function (){
		that = new PykCharts.multiD.processInputs(that, options, "area");

		if(that.stop)
			return;

		if(that.mode === "default") {
			that.k.loading();
		}

		var multiDimensionalCharts = theme.multiDimensionalCharts,
			stylesheet = theme.stylesheet,
			optional = options.optional;

		that.w = that.width - that.margin_left - that.margin_right;
		that.h = that.height - that.margin_top - that.margin_bottom;
		that.filterList = [];
		that.fullList = [];
		that.extended = false;
		d3.json(options.data, function (e, data) {

            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(that.selector+" #chart-loader").remove();
                return;
            }

			that.data = data;
			that.axis_y_data_format = "number";
    		that.axis_x_data_format = "number"
			that.compare_data = that.data;
			that.data_length = that.data.length;
			$(that.selector+" #chart-loader").remove();
			// that.dataTransformation();
			that.render();
		});
	};
	this.render = function () {
		that.multid = new PykCharts.multiD.configuration(that);
		that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);
		that.transitions = new PykCharts.Configuration.transition(that);
		that.border = new PykCharts.Configuration.border(that);
		if(that.mode === "default") {

			that.k.title()
					// .backgroundColor(that)
					// .export(that,"#svg-1","areaChart")
					.liveData(that)
					.emptyDiv()
					.subtitle()
					.tooltip();
			that.optional_feature()
				.svgContainer(1)
				.legendsContainer()
				// .legends()
				.createGroups(1)
				.createChart()
	    		// .axisContainer();

			that.k.createFooter()
	                .lastUpdatedAt()
	                .credits()
	                .dataSource();
		}
		else if(that.mode === "infographics") {
			  that.k/*.liveData(that)*/
			  			// .backgroundColor(that)
			  			// .export(that,"#svg-1","areaChart")
			  			.emptyDiv()
						.makeMainDiv(options.selector,1);

			  that.optional_feaure()
						.svgContainer(1)
						.legendsContainer()
						.createGroups(1)
						.createChart()
			    		.axisContainer();

  		}
		// that.k.exportSVG(that,"#svg-1","areaChart")
  		that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
  		$(document).ready(function () { return that.k.resize(that.svgContainer); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer); });

	};
	this.draw = function(){

        //6.1 call render legends to display legends
        // this.renderLegends();
        //6.2 call render legends to display charts
        that.optional_feature().createChart();
    };
	that.optional_feature = function (){
		var optional = {
			svgContainer: function (i){
				$(that.selector).attr("class","PykCharts-twoD PykCharts-multi-series2D PykCharts-line-chart");
				// $(options.selector).css({"background-color":that.background_color,"position":"relative"});

				that.svgContainer = d3.select(options.selector).append("svg:svg")
					.attr("id","svg-"+i)
					.attr("width",that.width)
					.attr("height",that.height)
					.attr("class","svgcontainer")
					.attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height);

                // $(options.selector).colourBrightness();
    			return this;
			},
			createGroups : function (i) {

				that.group = that.svgContainer.append("g")
					.attr("id","chartsvg")
					.attr("transform","translate("+ that.margin_left +","+ (that.margin_top + that.legendsGroup_height)+")");


    			return this;
			},
			legendsContainer : function (i) {
                if (PykCharts.boolean(that.legends_enable) && that.type === "stackedAreaChart" && that.mode === "default") {
                    that.legendsGroup = that.svgContainer.append("g")
                                .attr('id',"legends")
                                .style("visibility","visible")
                                .attr("transform","translate(0,10)");
                } else {
                    that.legendsGroup_height = 0;
                    that.legendsGroup_width = 0;
                }
                return this;
            },
			createChart : function (evt) {
				var tData = jQuery.extend(true, [], that.data);
		        var legendHeight = 40;
		        //8.1 Filtering & Parsing Data
		        // tData = that.filter(tData);
		        tData = that.parseData(tData);
		        var maxTotalVal = that.maxTotal(tData);
		        //8.2 Sizes & Scales
		        var width = that.width;
		        var height = that.height;
		        var xScale = d3.scale.linear().domain([0, maxTotalVal]).range([0, width - 200]);
		        var yScale = d3.scale.linear().domain([0, height]).range([0, height]);
		        var barHeight = (height) / (tData.length * 2);
		        var barMargin = barHeight * 2;

		        var svg = that.group;

		        //8.3 Setting up Top: Graph Lines
		        svg.selectAll("line.top_line").data(tData).enter()
		            .append("line").attr("class", "top_line")
		            .attr("x1", 0).attr("x2", width)
		            .attr("y1", function(d, i){
		                return yScale(i * barMargin);
		            })
		            .attr("y2", function(d, i){
		                return yScale(i * barMargin);
		            });


		        //8.4 Setting up Bottom: Graph Lines
		        svg.selectAll("line.bottom_line").data(tData).enter()
		            .append("line").attr("class", "bottom_line")
		            .attr("x1", 0).attr("x2", width)
		            .attr("y1", function(d, i){
		                return yScale((i * barMargin) + barHeight);
		            })
		            .attr("y2", function(d, i){
		                return yScale((i * barMargin) + barHeight);
		            });

		        //8.5 SVG Groups for holding the bars
		        var groups = svg.selectAll("g.bar-holder").data(tData);

		        groups.enter().append("g").attr("class", "bar-holder")
		            .attr("transform", function(d, i){
		                var y = yScale(i * barMargin);
		                var x = xScale((maxTotalVal - d.breakupTotal) / 2) + 100;
		                return "translate("+x+","+y+")";
		            });


		        groups.transition().duration(1000)
		            .attr("height", yScale(barHeight))
		            .attr("width", function(d){
		                return xScale(d.breakupTotal);
		            })
		            .attr("transform", function(d, i){
		                var y = yScale(i * barMargin);
		                var x = xScale((maxTotalVal - d.breakupTotal) / 2) + 100;
		                var scalex = 1;
		                var scaley = 1;

		                if(that.extended){
		                    var barWidth = xScale(d.breakupTotal);
		                    scalex = (width - 200) / barWidth;
		                    scaley = 2;
		                    x = yScale(100);
		                }

		                return "translate("+x+","+y+") scale("+ scalex +", "+ scaley  +")";
		            });

		        groups.exit().remove();

		        //8.6 SVG Groups for holding the bars
		        var bar_holder = svg.selectAll("g.bar-holder")[0];
		        for(var i in tData){
		            var group = bar_holder[i];
		            var breakup = tData[i].breakup;


		            //8.7 Append Rectangles elements to  bar holder
		            var rects = d3.select(group).selectAll("rect").data(breakup);

		            rects.enter().append("rect").attr("width", 0);

		            rects.transition().duration(1000)
		                .attr("x", function(d, i){
		                    if (i === 0) return 0;
		                    var shift = 0;
		                    for(var j = 0; j < i; j++){
		                        shift += breakup[j].count;
		                    }
		                    return xScale(shift);
		                })
		                .attr("y", 0)
		                .attr("height", function(d, i){
		                    //8.8 Scale the height according to the available height
		                    return (barHeight * (height - legendHeight)) / height;

		                })
		                .attr("width", function(d,i){
		                    return xScale(d.count);
		                });

		            rects.attr("style", function(d,i){
		                return "fill: " + d.color;
		            })
		                .on("mouseover", function(d, i){
		                    that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(d.tooltip ? d.tooltip : d.y);
		                })
		                .on("mousemove", function(d){
		                    that.mouseEvent.tooltipPosition(d);
		                })
		                .on("mouseout", function(d){
		                   	that.mouseEvent.tooltipHide(d);
		                })
		                .on("click", function(d, i){
		                    that.onlyFilter(d.name);
		                });

		            rects.exit().transition().duration(1000).attr("width", 0).remove();
		        }

		        //8.9 Display Name labels
		        var display_name = svg.selectAll("text.cool_label").data(tData);

		        display_name.enter().append("text").attr("class", "cool_label");

		        display_name.attr("x", width)
		            .attr("y", function(d, i){
		                return yScale((i * barMargin) + (barHeight/2) + 5);
		            })
		            .text(function(d, i){
		                return d.breakupTotal + " " + d.technical_name;
		            });


		        //8.10 Left side labels with totals
		        var left_labels = svg.selectAll("text.left_label").data(tData);

		        left_labels.enter().append("svg:text").attr("class", "left_label");

		        left_labels
		            .attr("y", function(d, i){
		                return yScale((i * barMargin) + (barHeight/2) + 5);
		            })
		            .attr("x", 0)
		            .text(function(d,i){
		                return d.display_name;
		            });


		        //8.11 Right side labels with time duration
		        var right_labels = svg.selectAll("text.right_label").data(tData);

		        right_labels.enter().append("svg:text").attr("class", "right_label");

		        right_labels
		            .attr("y", function(d, i){
		                return yScale((i * barMargin) + (barHeight * 1.5) + 5);
		            })
		            .attr("x", width)
		            .text(function(d,i){
		                if(tData[i+1] === undefined){
		                    return "";
		                }
		                return d.duration;
		            });



		        if(this.extended) {
		            $("line.left_line").fadeOut();
		            $("line.right_line").fadeOut();
		            return;
		        } //No need for angle lines if its extended

		        //8.12 Setting up Left side angle lines
		        var left_angles = svg.selectAll("line.left_line").data(tData);

		        left_angles.enter().append("line").attr("class", "left_line")
		            .attr("y2", function(d,i){
		                return yScale((i * barMargin) + barHeight);
		            })
		            .attr("x2", function(d,i){
		                return xScale((maxTotalVal - d.breakupTotal) / 2) + 100;
		            });

		        left_angles.transition().duration(1000)
		            .attr("style", function(d,i){
		                if(!tData[i+1]) return "stroke-width: 0";
		            })
		            .attr("y1", function(d,i){
		                return yScale((i * barMargin) + barHeight);
		            })
		            .attr("x1", function(d,i){
		                return xScale((maxTotalVal - d.breakupTotal) / 2) + 100;
		            })
		            .attr("y2", function(d,i){
		                return yScale(((i+1) * barMargin));
		            })
		            .attr("x2", function(d,i){
		                if(!tData[i+1]) return 0;
		                return xScale((maxTotalVal - tData[i+1].breakupTotal) / 2) + 100;

		            });


		        //8.13 Calibrating Right side angle lines
		        var right_angles = svg.selectAll("line.right_line").data(tData);

		        right_angles.enter().append("line").attr("class", "right_line")
		            .attr("y2", function(d,i){
		                return yScale((i * barMargin) + barHeight);
		            })
		            .attr("x2", function(d,i){
		                return xScale(((maxTotalVal - d.breakupTotal) / 2) + d.breakupTotal) + 100;
		            });

		        right_angles.transition().duration(1000)
		            .attr("style", function(d,i){
		                if(!tData[i+1]) return "stroke-width: 0";
		            })
		            .attr("y1", function(d,i){
		                return yScale((i * barMargin) + barHeight);
		            })
		            .attr("x1", function(d,i){
		                return xScale(((maxTotalVal - d.breakupTotal) / 2) + d.breakupTotal) + 100;
		            })
		            .attr("y2", function(d,i){
		                return yScale(((i+1) * barMargin));
		            })
		            .attr("x2", function(d,i){
		                if(!tData[i+1]) return 0;
		                return xScale(((maxTotalVal - tData[i+1].breakupTotal) / 2) + tData[i+1].breakupTotal) + 100;
		            });
			}
		};
		return optional;
	};
	that.filter = function(d){
        if(that.filterList.length < 1){
            that.filterList = jQuery.extend(true, [], that.fullList);
        }

        for(var i in d){
            var media = d[i].breakup;
            var newMedia = [];
            for(var j in media){
                if (jQuery.inArray(media[j].name, that.filterList) >= 0) newMedia.push(media[j]);
            }
            d[i].breakup = newMedia;
        }
        return d;
    };

    that.onlyFilter = function(f){
        var index = that.filterList.indexOf(f);
        if(that.filterList.length === 1 && index != -1){
            // if its the only item on the list, get rid of it
            that.filterList = [];
        }else{
            // otherwise empty the list and add this one to it
            that.filterList = [];
            that.filterList.push(f);
        }
        this.draw();
    };

    that.toggleFilter = function(f){
        var index = that.filterList.indexOf(f);
        if(index === -1){
            that.filterList.push(f);
        }else{
            that.filterList.splice(index, 1);
        }
        this.draw();
    };

    that.totalInBreakup = function(breakup){
        var total = 0;
        for(var i in breakup) total += breakup[i].count; // Add all the counts in breakup to total
        return total;
    };

    that.maxTotal = function(d){
        var totals = [];
        for(var i in d) totals.push(d[i].breakupTotal); // Get all the breakupTotals in an Array
        totals = totals.sort(function(a,b){return a - b;}); // Sort them in ascending order
        return totals[totals.length - 1]; // Give the last one
    };

    that.parseData = function(d){
    	for(var i in d) d[i].breakupTotal = this.totalInBreakup(d[i].breakup); // Calculate all breakup totals and add to the hash
        return d;
    };
};