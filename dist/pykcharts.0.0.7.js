var PykCharts = {};

Array.__proto__.groupBy = function (data) {
    var gd = []
    , i
    , group = _.groupBy(data, function (d) {
        return d.name;
    });
    for(i in group) {
        gd.push({
            name: i,
            weight: d3.sum(group[i], function (d) { return d.weight; })
        })
    };
    return gd;
};

PykCharts.boolean = function(d) {
    var false_values = ['0','f',"false",'n','no',''];
    var false_keywords = [undefined,null,NaN];
    if(_.contains(false_keywords, d)) {
        return false;
    }
    value = d.toLocaleString();
    value = value.toLowerCase();
    if (false_values.indexOf(value) > -1) {
        return false;
    } else {
        return true;
    }
};

PykCharts.Configuration = function (options){
	var that = this;

	var configuration = {
		liveData : function (chart) {
            var frequency = options.realTimeCharts.refreshFrequency;
	        if(PykCharts.boolean(frequency)) {
	            setInterval(chart.refresh,frequency*1000);
	        }
	        return this;
	    },
        scaleIdentification : function (type,data,range,x) {
            var scale;
            if(type === "ordinal") {
                scale = d3.scale.ordinal()
                    .domain(data)
                    .rangeRoundBands(range, x);
                return scale;

            } else if(type === "linear") {
                scale = d3.scale.linear()
                    .domain(data)
                    .range(range);
                return scale;

            } else if(type === "time") {
                scale = d3.time.scale()
                    .domain(data)
                    .range(range);
                return scale;
            }
        },
	    appendUnits : function (text) {
            var label,prefix,suffix;
            if(options.units) {
                prefix = options.units.prefix,
                suffix = options.units.suffix;
                if(prefix && prefix !== "") {
                    label = prefix + text;
                    if(suffix) {
                        label += " " + suffix;
                    }
                } else if(suffix && suffix !== "") {
                    label = text + " " + suffix;
                } else {
                    label = text;
                }
            }
            else {
                label = text;
            }
            return label;
        },
		title : function () {
            if(PykCharts.boolean(options.title.text)) {
	        	that.titleDiv = d3.select(options.selector)
	                .append("div")
	                    .attr("id","title")
	                    .style("width", options.width + "px")
	                    .style("text-align","center")
	                    .html("<span style='pointer-events:none;font-size:" +
                        options.title.size+
                        ";align:center;color:" +
                        options.title.color+
                        ";font-weight:" +
                        options.title.weight+
                        ";font-family:" +
                        options.title.family
                        + "'>" +
                        options.title.text +
                        "</span>");
	        }
	        return this;
	    },
        subtitle : function () {
            if(PykCharts.boolean(options.subtitle.text)) {
                that.subtitleDiv = d3.select(options.selector)
                    .append("div")
                        .attr("id","sub-title")
                        .style("width", options.width + "px")
                        .style("text-align","center")
                        .html("</span><br><span style='pointer-events:none;font-size:" +
                        options.subtitle.size+";align:center;color:" +
                        options.subtitle.color + ";font-weight:" +
                        options.subtitle.weight + ";font-family:" +
                        options.subtitle.family + "'>"+
                        options.subtitle.text + "</span>");
            }
            return this;
        },
	    credits : function () {
	        if(PykCharts.boolean(options.creditMySite.mySiteName) || PykCharts.boolean(options.creditMySite.mySiteUrl)) {
                var credit = options.creditMySite;
	            var enable = true;

	            if(credit.mySiteName === "") {
	                credit.mySiteName = credit.mySiteUrl;
	            }
	            if(credit.mySiteUrl === "") {
	                enable = false;
	            }
	            d3.select(options.selector).append("div")
		        	.attr("id","footer")
		        	.style("width",options.width+"px");

	            d3.select(options.selector+" #footer").append("div")
	                .attr("id","credits")
                    .style("width",((options.width/2)-30)+"px")
                    .style("background", options.bg)
                    .style("float","left")
                    .attr("class","PykCharts-credits")
	                .html("<span style='pointer-events:none;'>Credits: </span><a href='" + credit.mySiteUrl + "' target='_blank' onclick='return " + enable +"'>"+ credit.mySiteName +"</a>");
	        }
	        return this;
	    },
	    dataSource : function () {
	        if(PykCharts.boolean(options.dataSource) && (PykCharts.boolean(options.dataSource.text) || PykCharts.boolean(options.dataSource.url))) {
	            var enable = true;
	            var data_src = options.dataSource;
	            if(data_src.text === "") {
                    data_src.text = data_src.url;
	            }
	            if(data_src.url === "") {
	                enable = false;
	            }
	            d3.select(options.selector+" #footer").append("div")
	                .attr("id","data-source")
                    .style("width",((options.width/2)-30)+"px")
                    .attr("class","PykCharts-credits PykCharts-data-src")
                    .style("background", options.bg)
                    .style("float","right")
	                .html("<span style='pointer-events:none;'>Source: </span><a href='" + data_src.url + "' target='_blank' onclick='return " + enable +"'>"+ data_src.text +"</a>");
	        }
	        return this;
	    },
        makeMainDiv : function (selection,i) {
            d3.select(selection).append("div")
                .attr("id","tooltip-svg-container-"+i)
                .style("float","left");
            return this;
        },
	    tooltip : function (d,selection,i) {
	    	if(PykCharts.boolean(options.enableTooltip) && options.mode === "default") {
	        	if(selection !== undefined){
	        		d3.select(options.selector + " " +"#tooltip-svg-container-"+i).append("div")
                        .attr("id", "tooltip-container")
						.style("position", "relative")
						.style("height", "35px")
						.style("margin-top", "10px");

					PykCharts.Configuration.tooltipp = d3.select(options.selector + " " +"#tooltip-container").append("div")
			        	.attr("id", "pyk-tooltip")
			        	.attr("class","pyk-line-tooltip");
	        	} else if (PykCharts.boolean(options.tooltip)) {
                    if (options.tooltip.mode === "fixed") {
                        PykCharts.Configuration.tooltipp = d3.select("body")
                            .append("div")
                            .attr("id", "pyk-tooltip")
                            .style("height","auto")
                            .style("padding", "5px 6px")
                            .style("color","#4F4F4F")
                            .style("background","#eeeeee")
                            .style("text-decoration","none")
                            .style("position", "absolute")
                            .style("border-radius", "5px")
                            .style("text-align","center")
                            .style("font-family","Arial, Helvetica, sans-serif")
                            .style("font-size","14px")
                            .style("border","1px solid #CCCCCC")
                            .style("min-width","30px")
                            .style("z-index","10")
                            .style("visibility", "hidden");
                    } else {
                        PykCharts.Configuration.tooltipp = d3.select("body")
                            .append("div")
                            .attr("id", "pyk-tooltip")
                            // .attr("class","pyk-line-tooltip");
                            .style("height","auto")
                            .style("padding", "5px 6px")
                            .style("color","#4F4F4F")
                            .style("background","#eeeeee")
                            .style("text-decoration","none")
                            .style("position", "absolute")
                            .style("border-radius", "5px")
                            .style("text-align","center")
                            .style("font-family","Arial, Helvetica, sans-serif")
                            .style("font-size","14px")
                            .style("border","1px solid #CCCCCC")
                            .style("min-width","30px")
                            .style("z-index","10")
                            .style("visibility", "hidden");
                    }
                } else {
	        		PykCharts.Configuration.tooltipp = d3.select("body")
		                .append("div")
		                .attr("id", "pyk-tooltip")
		                // .attr("class","pyk-line-tooltip");
	                	.style("height","auto")
                        .style("padding", "5px 6px")
                        .style("color","#4F4F4F")
                        .style("background","#eeeeee")
                        .style("text-decoration","none")
                        .style("position", "absolute")
                        .style("border-radius", "5px")
                        .style("text-align","center")
                        .style("font-family","Arial, Helvetica, sans-serif")
                        .style("font-size","14px")
                        .style("border","1px solid #CCCCCC")
                        .style("min-width","30px")
                        .style("z-index","10")
                        .style("visibility", "hidden");
                }
            }
            return this;
        },
        crossHair : function (svg) {
            if(PykCharts.boolean(options.enableCrossHair) && options.mode === "default") {
                /*$(options.selector + " " + "#cross-hair-v").remove();
                $(options.selector + " " + "#focus-circle").remove();
                */PykCharts.Configuration.cross_hair_v = svg.append("g")
                    .attr("class","line-cursor")
                    .style("display","none");
                PykCharts.Configuration.cross_hair_v.append("line")
                    .attr("id","cross-hair-v");
                //    that.crossHairH = that.svg.append("g")
                //          .attr("class","line-cursor")
                //          .style("display","none");
                // that.crossHairH.append("line")
                //          .attr("id","crossHairH");

                PykCharts.Configuration.focus_circle = svg.append("g")
                    .attr("class", function () { return (options.type === "areaChart") ? "focus-area" : "focus"; })
                    .style("display", "none");
                PykCharts.Configuration.focus_circle.append("circle")
                    .attr("id","focus-circle")
                    .attr("r",6)
                    .style("fill",function () { return (options.type === "areaChart") ? "none" : options.chartColor; });
            }
            return this;
        },
        fullScreen : function (chart) {
            if(PykCharts.boolean(options.fullScreen)) {
                that.fullScreenButton = d3.select(options.selector)
                    .append("input")
                        .attr("type","image")
                        .attr("id","btn-zoom")
                        .attr("src","../../PykCharts/img/apple_fullscreen.jpg")
                        .style("font-size","30px")
                        .style("left","800px")
                        .style("top","0px")
                        .style("position","absolute")
                        .style("height","4%")
                        .on("click",chart.fullScreen);
            }
            return this;
	    },
        loading: function () {
            if(PykCharts.boolean(options.loading)) {
                $(options.selector).html("<div id='chart-loader'><img src="+options.loading+"></div>");
                $(options.selector + " " + '#chart-loader').css({"visibility":"visible","padding-left":(options.width)/2 +"px","padding-top":(options.height)/2 + "px"});
            }
            return this;
        },
	    positionContainers : function (position, chart) {
            if(PykCharts.boolean(options.legends) && !(PykCharts.boolean(options.size.enable))) {
                if(position == "top" || position == "left") {
                    chart.optionalFeatures().legendsContainer().svgContainer();
                }
                if(position == "bottom" || position == "right") {
                    chart.optionalFeatures().svgContainer().legendsContainer();
                }
            }
            else {
                chart.optionalFeatures().svgContainer();
            }
            return this;
        },
        yGrid: function (svg, gsvg, yScale) {
            var width = options.width,
                height = options.height;
            if(PykCharts.boolean(options.grid.yEnabled)) {
                var ygrid = PykCharts.Configuration.makeYGrid(options,yScale);
                gsvg.selectAll(options.selector + " " + "g.y.grid-line")
                    .style("stroke",function () { return options.grid.color; })
                    .call(ygrid);
            }
            return this;
        },
        xGrid: function (svg, gsvg, xScale) {
             var width = options.width,
                height = options.height;

            if(PykCharts.boolean(options.grid.xEnabled)) {
                var xgrid = PykCharts.Configuration.makeXGrid(options,xScale);
                gsvg.selectAll(options.selector + " " + "g.x.grid-line")
                    .style("stroke",function () { return options.grid.color; })
                    .call(xgrid);
            }
            return this;
        },
        xAxis: function (svg, gsvg, xScale) {

            var width = options.width,
                height = options.height;

            if(PykCharts.boolean(options.axis.x.enable)){
                d3.selectAll(options.selector + " " + ".x.axis").attr("fill",function () { return options.axis.x.labelColor;});

                var xaxis = PykCharts.Configuration.makeXAxis(options,xScale);

                if(options.axis.x.tickValues.length != 0) {
                    xaxis.tickValues(options.axis.x.tickValues);
                }

                gsvg.style("stroke",function () { return options.axis.x.axisColor; })
                    .call(xaxis);
                gsvg.selectAll(options.selector + " " + "g.x.axis text").attr("pointer-events","none");
            }
            return this;
        },
        yAxis: function (svg, gsvg, yScale) {
            var width = options.width,
                height = options.height;

            if(PykCharts.boolean(options.axis.y.enable)){

                d3.selectAll(options.selector + " " + ".y.axis").attr("fill",function () { return options.axis.y.labelColor; });
                var yaxis = PykCharts.Configuration.makeYAxis(options,yScale);

                gsvg.style("stroke",function () { return options.axis.y.axisColor; })
                    .call(yaxis);
                gsvg.selectAll(options.selector + " " + "g.y.axis text").attr("pointer-events","none");
            }
            return this;
        },
        isOrdinal: function(svg,container,scale) {
            if(container === ".x.axis") {
                svg.select(container).call(PykCharts.Configuration.makeXAxis(options,scale));
            }
            else if (container === ".x.grid") {
                svg.select(container).call(PykCharts.Configuration.makeXGrid(options,scale));
            }
            else if (container === ".y.axis") {
                svg.select(container).call(PykCharts.Configuration.makeYAxis(options,scale));
            }
            else if (container === ".y.grid") {
                svg.select(container).call(PykCharts.Configuration.makeYGrid(options,scale));
            }
            return this;
        },
        totalColors: function (tc) {
            var n = parseInt(tc, 10)
            if (n > 2 && n < 10) {
                that.total_colors = n;
                return this;
            };
            that.total_colors = 9;
            return this;
        },
        colorType: function (ct) {
            if (ct === "colors") {
                that.legends = "no";
            };
            return this;
        },
        __proto__: {
            _domainBandwidth: function (domain_array, count) {
                padding = (domain_array[1] - domain_array[0]) * 0.1;
                if (count === 0) {
                    domain_array[0] -= padding;
                }else if(count === 1) {
                    domain_array[1] += padding;
                }else if (count === 2) {
                    domain_array[0] -= padding;
                    domain_array[1] += padding;
                }
                return domain_array;
            },
            _radiusCalculation: function (radius_percent) {
                var min_value = d3.min([options.width,options.height]);
                return (min_value*radius_percent)/200;
            }
        }
    };
    return configuration;
};

var configuration = PykCharts.Configuration;
configuration.mouseEvent = function (options) {
    var that = this;
    that.tooltip = configuration.tooltipp;
    that.cross_hair_v = configuration.cross_hair_v;
    that.focus_circle = configuration.focus_circle;
    var status;
    var action = {
        tooltipPosition : function (d,xPos,yPos,xDiff,yDiff) {
            if(PykCharts.boolean(options.enableTooltip) && options.mode === "default") {
            	if(xPos !== undefined){
                    return that.tooltip
            			.style("visibility", "visible")
                        .style("top", (yPos + yDiff)+"px")
                        .style("left", (xPos + xDiff)+"px");
                }
                else{
                    return that.tooltip
                        .style("visibility", "visible")
                        .style("top", (d3.event.pageY - 20) + "px")
                        .style("left", (d3.event.pageX + 30) + "px");
                }
            }
        },
        toolTextShow : function (d) {
            if(PykCharts.boolean(options.enableTooltip) && options.mode === "default") {
            	that.tooltip.html(d);
            }
            return this;
        },
        tooltipHide : function (d) {
            if(PykCharts.boolean(options.enableTooltip) && options.mode === "default") {
                return that.tooltip.style("visibility", "hidden");
            }
        },
        crossHairPosition: function(data,xScale,dataLineGroup,lineMargin){
            if((PykCharts.boolean(options.enableCrossHair) || PykCharts.boolean(options.enableTooltip) || PykCharts.boolean(options.onHoverHighlightenable))  && options.mode === "default") {
                var offsetLeft = $(options.selector + " " + "#"+dataLineGroup.attr("id")).offset().left;
                var offsetRight = $(options.selector + " " + "#"+dataLineGroup.attr("id")).offset().right;
                var left = options.margin.left;
                var right = options.margin.right;
                var top = options.margin.top;
                var bottom = options.margin.bottom;
                var w = options.width;
                var h = options.height;
                var x = d3.event.pageX - offsetLeft;
                var pathEl = dataLineGroup.node();
                var pathLength = pathEl.getTotalLength();
                var beginning = x, end = pathLength, target;
                var leftEdges = xScale.range();
                var xRange = xScale.rangeBand();
                var j,tooltpText="",activeTick="",cx = 0,cy = 0,pathWidth = 0;

                while (true) {
                  target = Math.floor((beginning + end) / 2);
                  pos = pathEl.getPointAtLength(target);
                  if ((target === end || target === beginning) && pos.x !== x) {
                    break;
                  }
                  if (pos.x > x) {
                      end = target;
                  }
                  else if (pos.x < x) {
                      beginning = target;
                  }
                  else{
                      break;
                  }
                }
                for(j = 0; x > (xScale.range()[j] + xRange - lineMargin); j++) {}
                tooltipText = data[j].tooltip;
                activeTick = data[j].x;
                cx = x + lineMargin + left;
                cy = pos.y + top;
                pathWidth = dataLineGroup.node().getBBox().width;

    			if((cx >= (lineMargin + left + 1)) && (cx <= (pathWidth + lineMargin + left + 2)) && (cy >= top) && (cy <= (h - bottom))) {
                	this.tooltipPosition(tooltipText,cx,top,-30,-3);
                    this.toolTextShow(tooltipText);
                    (options.enableCrossHair) ? this.crossHairShow(cx,top,cx,(h - bottom),cx,cy) : null;
                    this.axisHighlightShow(activeTick,options.selector+" "+".x.axis");
                }
                else{
                  	this.tooltipHide();
                  	(options.enableCrossHair) ? this.crossHairHide() : null;
                  	this.axisHighlightHide(options.selector+" "+".x.axis");
                  	// crossHairH.style("display","none");
                }

            }
        },
        crossHairShow : function (x1,y1,x2,y2,cx,cy) {
            if(PykCharts.boolean(options.enableCrossHair) && options.mode === "default") {
                if(x1 !== undefined){
                    that.cross_hair_v.style("display","block");
                    that.cross_hair_v.select(options.selector + " #cross-hair-v")
                        .attr("x1",x1)
                        .attr("y1",y1)
                        .attr("x2",x2)
                        .attr("y2",y2);
                    that.focus_circle.style("display","block")
                        .attr("transform", "translate(" + cx + "," + cy + ")");
                }
            }
            return this;
        },
        crossHairHide : function () {
            if(PykCharts.boolean(options.enableCrossHair) && options.mode === "default") {
                that.cross_hair_v.style("display","none");
                that.focus_circle.style("display","none");
            }
            return this;
        },
        axisHighlightShow : function (activeTick,axisHighlight,a) {
            var j_curr,j_prev,abc,selection;
            if(PykCharts.boolean(options.axis.onHoverHighlightenable)&& options.mode === "default"){
                if(axisHighlight === options.selector + " " + ".y.axis"){
                    selection = axisHighlight+" .tick text";
                    abc = options.axis.y.labelColor;
                } else if(axisHighlight === options.selector + " " + ".x.axis") {
                    selection = axisHighlight+" .tick text";
                    abc = options.axis.x.labelColor;
                } else if(axisHighlight === options.selector + " " + ".axis-text" && a === "column") {
                    selection = axisHighlight;
                    abc = options.axis.x.labelColor;
                } else if(axisHighlight === options.selector + " " + ".axis-text" && a === "bar") {
                    selection = axisHighlight;
                    abc = options.axis.y.labelColor;
                }
                if(j_prev !== undefined) {
                    d3.select(d3.selectAll(selection)[0][j_prev])
                        .style("fill",abc)
                        .style("font-weight","normal");
                }

                for(j_curr = 0;d3.selectAll(selection)[0][j_curr].innerHTML !== activeTick;j_curr++){}
                j_prev = j_curr;

                d3.selectAll(selection)
                    .style("fill","#bbb")
                    .style("font-size","12px")
                    .style("font-weight","normal");
                d3.select(d3.selectAll(selection)[0][j_curr])
                    .style("fill",abc)
                    .style("font-size","13px")
                    .style("font-weight","bold");
            }
            return this;
        },

        axisHighlightHide : function (axisHighlight,a) {
            var abc,selection;
            if(PykCharts.boolean(options.axis.onHoverHighlightenable) && options.mode === "default"){
                if(axisHighlight === options.selector + " " + ".y.axis"){
                    selection = axisHighlight+" .tick text";
                    abc = options.axis.y.labelColor;
                } else if(axisHighlight === options.selector + " " + ".x.axis") {
                    selection = axisHighlight+" .tick text";
                    abc = options.axis.x.labelColor;
                } else if(axisHighlight === options.selector + " " + ".axis-text" && a === "column") {
                    selection = axisHighlight;
                    abc = options.axis.x.labelColor;
                } else if(axisHighlight === options.selector + " " + ".axis-text" && a === "bar") {
                    selection = axisHighlight;
                    abc = options.axis.y.labelColor;
                }
                d3.selectAll(selection)
                    .style("fill",abc)
                    .style("font-size","12px")
                    .style("font-weight","normal");
            }
            return this;
        }
    };
    return action;
};

configuration.fillChart = function (options,theme,config) {
    var that = this;
    var fillchart = {
        color : function (d) { return d.color; },
        saturation : function (d) { return "steelblue"; },
        selectColor: function (d) {
            if(d.highlight === true) {
                return options.highlightColor;
            } else{
                return options.chartColor;
            }
        },
        colorChart : function (d) {
            if(d.highlight === true) {
                return theme.stylesheet.colors.highlightColor;
            } else{
                return theme.stylesheet.colors.chartColor;
            }
        },
        colorPieW : function (d) {
            if(!(PykCharts.boolean(options.size.enable))) {
                return options.saturationColor;
            } else if(PykCharts.boolean(options.size.enable)) {
                if(d.color) {
                    return d.color;
                }
                return options.chartColor;
            }
        },
        colorPieMS : function (d) {
            if(PykCharts.boolean(d.highlight)) {
                return options.highlightColor;
            } else if(config.optional && config.optional.colors && config.optional.colors.chartColor) {
                return options.chartColor;
            } else if(config.optional && config.optional.colors && d.color){
                return d.color;
            } else {
                return options.chartColor;
            }
        }
    }
    return fillchart;
};

configuration.border = function (options) {
	var that = this;
	var border = {
	    width: function () {
	    		return options.borderBetweenChartElements.width;
	    },
		color: function () {
				return options.borderBetweenChartElements.color;
		}
	};
	return border;
};

configuration.makeXAxis = function(options,xScale) {
    var that = this;

    var xaxis = d3.svg.axis()
                    .scale(xScale)
                    .ticks(options.axis.x.no_of_ticks)
                    .tickSize(options.axis.x.tickSize)
                    .outerTickSize(0)
                    .tickFormat(function (d,i) {
                        return d + options.axis.x.tickFormat;
                    })
                    .tickPadding(options.axis.x.ticksPadding)
                    .orient(options.axis.x.orient);
    return xaxis;
};

configuration.makeYAxis = function(options,yScale) {
    var that = this;
    var yaxis = d3.svg.axis()
                    .scale(yScale)
                    .orient(options.axis.y.orient)
                    .ticks(options.axis.y.no_of_ticks)
                    .tickSize(options.axis.y.tickSize)
                    .outerTickSize(0)
                    .tickPadding(options.axis.y.ticksPadding)
                    .tickFormat(function (d,i) {
                        return d + options.axis.y.tickFormat;
                    });
                    // .tickFormat(d3.format(",.0f"));
    return yaxis;
};

configuration.makeXGrid = function(options,xScale) {
    var that = this;

    var xgrid = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(options.axis.x.no_of_ticks)
                    .tickFormat("")
                    .tickSize(options.height - options.margin.top - options.margin.bottom)
                    .outerTickSize(0);
    return xgrid;
};

configuration.makeYGrid = function(options,yScale) {
    var that = this;
    var ygrid = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(options.axis.x.no_of_ticks)
                    .tickSize(-(options.width - options.margin.left - options.margin.right))
                    .tickFormat("")
                    .outerTickSize(0);
    return ygrid;
};

configuration.transition = function (options) {
    var that = this;
    var transition = {
        duration : function() {
            if(options.mode === "default" && PykCharts.boolean(options.transition.duration)) {
                return options.transition.duration;
            } else {
                return 0;
            }
        }
    };
    return transition;
};

configuration.Theme = function(){
    var that = this;
    that.stylesheet = {
        "chart": {
            "height": 400,
            "width": 600,
            "margin":{"top": 0, "right": 0, "bottom": 0, "left": 0},
            "grid" : {
                "xEnabled":"yes",
                "yEnabled":"yes",
                "color": "#ddd"
            }
        },
        "mode": "default",
        "selector": "body",
        "title":{
            "size": "15px",
            "color": "#1D1D1D",
            "weight": 800,
            "family": "'Helvetica Neue',Helvetica,Arial,sans-serif"
        },
        "subtitle":{
            "size": "12px",
            "color": "gray",
            "weight": 200,
            "family": "'Helvetica Neue',Helvetica,Arial,sans-serif"
        },
        "loading":{
            "animationGifUrl": "https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/img/loader.gif"
        },
        "buttons":{
            "enableFullScreen": "no"
        },
        "enableTooltip": "yes",
        "creditMySite":{
            "mySiteName": "Pykih",
            "mySiteUrl": "http://www.pykih.com"
        },
        "colors":{
            "backgroundColor": "transparent",
            "chartColor": "steelblue",
            "highlightColor": "#013F73",
            "saturationColor" : "green"
        },
        "borderBetweenChartElements":{
            "width": 1,
            "color": "white",
            "style": "solid" // or "dotted / dashed"
        },
        "legends":{ //partially done for oneD, pending for twoD
            "size": "13",
            "color": "white",
            "weight": "thin",
            "family": "'Helvetica Neue',Helvetica,Arial,sans-serif"
        },
        "label":{ //partially done for oneD, pending for twoD
            "size": "13",
            "color": "white",
            "weight": "thin",
            "family": "'Helvetica Neue',Helvetica,Arial,sans-serif"
        },
        "ticks":{
            "strokeWidth": 1,
            "size": 13,
            "color": "#1D1D1D",
            "family": "'Helvetica Neue',Helvetica,Arial,sans-serif"
        }
    };

    that.functionality = {
        "realTimeCharts": {
            "refreshFrequency": 0,
            "enableLastUpdatedAt": "yes"
        },
        "transition": {
            "duration": 0
        }
    };

    that.oneDimensionalCharts = { //pending
        "donut":{
            "radiusPercent": 70,
            "innerRadiusPercent": 40,
            "showTotalAtTheCenter": "yes" //done
        },
        "pie":{
            "radiusPercent": 70
        },
        "clubData":{
            "enable": "yes",
            "text": "Others", //text must be resused as tooltipText
            "maximumNodes": 5
        },
        // "enableLabel": "yes",
        "pictograph": {
            "showActive": "yes", //removes the grey heart i.e just shows the actual number of heart
            "enableLabel": "yes", //shows both the text when yes
            "labelText": "yes", //shows only the actual number when yes
            "imagePerLine": 3,
            "imageWidth":79,
            "imageHeight":66,
            "activeText": {
                "size": 64,
                "color": "steelblue",
                "weight": "thin",
                "family": "'Helvetica Neue',Helvetica,Arial,sans-serif"
            },
            "inactiveText": {
                "size": 64,
                "color": "grey",
                "weight": "thin",
                "family": "'Helvetica Neue',Helvetica,Arial,sans-serif"
            }
        },
        "funnel": {
            "rect_width": 100,
            "rect_height": 100
        }
    };

    that.multiDimensionalCharts = {
        "axis" : {
            "onHoverHighlightenable": "no",
            "x": {
                "enable": "yes",
                "orient" : "bottom",
                "axisColor": "#1D1D1D",
                "labelColor": "#1D1D1D",
                "no_of_ticks": 10,
                "tickSize": 5,
                "tickFormat": "",
                "ticksPadding": 6,
                "tickValues": []
            },
            "y": {
                "enable": "yes",
                "orient": "left",
                "axisColor": "#1D1D1D",
                "labelColor": "#1D1D1D",
                "no_of_ticks": 10,
                "tickSize": 5,
                "tickFormat": "",
                "ticksPadding": 6
            }
        },
        "yAxisDataFormat" : "number",
        "xAxisDataFormat" : "string",
        "curvy_lines" : "no",
        "enableCrossHair" : "yes",
        "zoom" : {
            "enable" : "no"
        },
        "size" : {
            "enable" : "yes"
        },
        "spiderweb" : {
            "outer_radius" : 200,
            "radius" : 5,
            "axisTitle" : "yes",
            "enableTicks" : "yes"
        },
        "multiple_containers" : {
            "enable" : "no"
        },
        "legends" : {
            "enable": "no",
            "display" : "horizontal"
        },
        "scatterplot" : {
            "radius" : 9
        }
    };

    that.treeCharts = {
        "zoom" : {
            "enable" : "no"
        },
        "nodeRadius" : 4.5
    };

    that.mapsTheme = {
        "mapCode": "india-topo",
        "axis" : {
            "onHoverHighlightenable": "no",
            "x": {
                "enable": "yes",
                "orient" : "bottom",
                "axisColor": "#1D1D1D",
                "labelColor": "#1D1D1D",
                "no_of_ticks": 10,
                "tickSize": 5,
                "tickFormat": "",
                "ticksPadding": 6,
                "tickValues": []
            }
        }
    };
    return that;
}

PykCharts.oneD = {};

PykCharts.oneD.fillChart = function (options) {

    var colorPie = {
        chartColor: function (d) {
            if(d.highlight === true) {
                return options.highlightColor;
            } else{
                return options.chartColor;
            }
        }
    };
    return colorPie;
};

PykCharts.oneD.mouseEvent = function (options) {
    var highlight_selected = {
        highlight: function (selectedclass, that) {
                var t = d3.select(that);
                d3.selectAll(selectedclass)
                    .attr("opacity",.5)
                t.attr("opacity",1);
                return this;
        },
        highlightHide : function (selectedclass) {
                d3.selectAll(selectedclass)
                    .attr("opacity",1);
            return this;
        }
    }
    return highlight_selected;
}

PykCharts.oneD.processInputs = function (chartObject, options) {

    var theme = new PykCharts.Configuration.Theme({})
        , stylesheet = theme.stylesheet
        , functionality = theme.functionality
        , oneDimensionalCharts = theme.oneDimensionalCharts
        , optional = options.optional;

    chartObject.selector = options.selector ? options.selector : stylesheet.selector;
    chartObject.width = options.chart && _.isNumber(options.chart.width) ? options.chart.width : stylesheet.chart.width;
    chartObject.height = options.chart && _.isNumber(options.chart.height) ? options.chart.height : stylesheet.chart.height;
    chartObject.mode = options.mode ? options.mode : stylesheet.mode;
    if (optional && optional.title) {
        chartObject.title = optional.title;
        chartObject.title.size = optional.title.size ? optional.title.size : stylesheet.title.size;
        chartObject.title.color = optional.title.color ? optional.title.color : stylesheet.title.color;
        chartObject.title.weight = optional.title.weight ? optional.title.weight : stylesheet.title.weight;
        chartObject.title.family = optional.title.family ? optional.title.family : stylesheet.title.family;
    } else {
        chartObject.title = stylesheet.title;
    }
    if (optional && optional.subtitle) {
        chartObject.subtitle = optional.subtitle;
        chartObject.subtitle.size = optional.subtitle.size ? optional.subtitle.size : stylesheet.subtitle.size;
        chartObject.subtitle.color = optional.subtitle.color ? optional.subtitle.color : stylesheet.subtitle.color;
        chartObject.subtitle.weight = optional.subtitle.weight ? optional.subtitle.weight : stylesheet.subtitle.weight;
        chartObject.subtitle.family = optional.subtitle.family ? optional.subtitle.family : stylesheet.subtitle.family;
    } else {
        chartObject.subtitle = stylesheet.subtitle;
    }
    chartObject.realTimeCharts = optional && optional.realTimeCharts ? optional.realTimeCharts : functionality.realTimeCharts;
    chartObject.transition = optional && optional.transition && optional.transition.duration ? optional.transition : functionality.transition;
    chartObject.creditMySite = optional && optional.creditMySite ? optional.creditMySite : stylesheet.creditMySite;
    chartObject.dataSource = optional && optional.dataSource ? optional.dataSource : "no";
    if (optional && optional.clubData) {
        chartObject.clubData = optional.clubData;
        chartObject.clubData.text = PykCharts.boolean(optional.clubData.enable) && optional.clubData.text ? optional.clubData.text : oneDimensionalCharts.clubData.text;
        chartObject.clubData.maximumNodes = PykCharts.boolean(optional.clubData.maximumNodes) && optional.clubData.maximumNodes ? optional.clubData.maximumNodes : oneDimensionalCharts.clubData.maximumNodes;
        chartObject.clubData.alwaysIncludeDataPoints = PykCharts.boolean(optional.clubData.enable) && optional.clubData.alwaysIncludeDataPoints ? optional.clubData.alwaysIncludeDataPoints : [];
    } else {
        chartObject.clubData = oneDimensionalCharts.clubData;
        chartObject.clubData.alwaysIncludeDataPoints = [];
    }
    chartObject.bg = optional && optional.colors && optional.colors.backgroundColor ? optional.colors.backgroundColor : stylesheet.colors.backgroundColor;
    chartObject.chartColor = optional && optional.colors && optional.colors.chartColor ? optional.colors.chartColor : stylesheet.colors.chartColor;
    chartObject.highlightColor = optional && optional.colors && optional.colors.highlightColor ? optional.colors.highlightColor : stylesheet.colors.highlightColor;
    chartObject.fullscreen = optional && optional.buttons && optional.buttons.enableFullScreen ? optional.buttons.enableFullScreen : stylesheet.buttons.enableFullScreen;
    chartObject.loading = optional && optional.loading && optional.loading.animationGifUrl ? optional.loading.animationGifUrl: stylesheet.loading.animationGifUrl;
    chartObject.enableTooltip = optional && optional.enableTooltip ? optional.enableTooltip : stylesheet.enableTooltip;
    // chartObject.enableLabel = optional && optional.enableLabel ? optional.enableLabel : oneDimensionalCharts.enableLabel;
    if (optional && optional.borderBetweenChartElements && optional.borderBetweenChartElements.width!="0px") {
        chartObject.borderBetweenChartElements = optional.borderBetweenChartElements;
        chartObject.borderBetweenChartElements.width = optional.borderBetweenChartElements.width ? optional.borderBetweenChartElements.width : stylesheet.borderBetweenChartElements.width;
        chartObject.borderBetweenChartElements.color = optional.borderBetweenChartElements.color ? optional.borderBetweenChartElements.color : stylesheet.borderBetweenChartElements.color;
        chartObject.borderBetweenChartElements.style = optional.borderBetweenChartElements.style ? optional.borderBetweenChartElements.style : stylesheet.borderBetweenChartElements.style;
    } else {
        chartObject.borderBetweenChartElements = stylesheet.borderBetweenChartElements;
    }
    if (optional && optional.label) {
        chartObject.label = optional.label;
        chartObject.label.size = optional.label.size ? optional.label.size : stylesheet.label.size;
        chartObject.label.color = optional.label.color ? optional.label.color : stylesheet.label.color;
        chartObject.label.weight = optional.label.weight ? optional.label.weight : stylesheet.label.weight;
        chartObject.label.family = optional.label.family ? optional.label.family : stylesheet.label.family;
    } else {
        chartObject.label = stylesheet.label;
    }
    if(optional && optional.ticks) {
        chartObject.ticks = optional.ticks;
        chartObject.ticks.strokeWidth = optional.ticks.strokeWidth ? optional.ticks.strokeWidth : stylesheet.ticks.strokeWidth;
        chartObject.ticks.size = optional.ticks.size ? optional.ticks.size : stylesheet.ticks.size;
        chartObject.ticks.color = optional.ticks.color ? optional.ticks.color : stylesheet.ticks.color;
        chartObject.ticks.family = optional.ticks.family ? optional.ticks.family : stylesheet.ticks.family;
    } else {
        chartObject.ticks = stylesheet.ticks;
    }
    chartObject.showTotalAtTheCenter = optional && optional.donut && optional.donut.showTotalAtTheCenter ? optional.donut.showTotalAtTheCenter : oneDimensionalCharts.donut.showTotalAtTheCenter;
    chartObject.units = optional && optional.units ? optional.units : false;

    chartObject.k = new PykCharts.Configuration(chartObject);

    return chartObject;
};

PykCharts.oneD.bubble = function (options) {
    var that = this;

    this.execute = function () {
        that = PykCharts.oneD.processInputs(that, options);

        if(that.mode === "default") {
           that.k.loading();
        }
        d3.json(options.data, function (e,data) {
            that.data = Array.groupBy(data);
            $(options.selector+" #chart-loader").remove();
            that.render();
        });
    };

    this.refresh = function () {

        d3.json (options.data, function (e,data) {
            that.data = data;
            that.optionalFeatures()
                .createBubble();
        });
    };

    this.render = function () {
        that.fillChart = new PykCharts.oneD.fillChart(that);
        that.mouseEvent1 = new PykCharts.oneD.mouseEvent(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        if (that.mode ==="default") {
            that.k.title();
            that.k.subtitle();

            var bubble = that.optionalFeatures().svgContainer()
                .createBubble()
                .label();

            that.k.credits()
                .dataSource()
                .liveData(that)
                .tooltip();

        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
       }
       else if (that.mode ==="infographics") {
            that.optionalFeatures().svgContainer()
                .createBubble()
                .label();

            that.k.tooltip();
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
       }
    };

    this.optionalFeatures = function () {

        var optional = {
            svgContainer: function () {
                $(that.selector).css("background-color",that.bg);

                that.svgContainer = d3.select(that.selector).append("svg")
                    .attr("class","svgcontainer")
                    .attr("id","svgcontainer")
                    .attr("width",that.width)
                    .attr("height",that.height);

                that.group = that.svgContainer.append("g")
                    .attr("id","bubgrp");
                return this;
            },
            createBubble : function () {
                that.b = that.optionalFeatures().clubData();
                that.bubble = d3.layout.pack()
                    .sort(function (a,b) { return b.weight - a.weight; })
                    .size([that.width, that.height])
                    .value(function (d) { return d.weight; })
                    .padding(20);
                var total = d3.sum(that.b.children, function (d) {
                    return d.weight;
                })
                var l = that.b.children.length;
                that.max = that.b.children[l-1].weight;
                that.node = that.bubble.nodes(that.b);

                that.bub_node = that.group.selectAll(".node")
                    .data(that.node);

                that.bub_node.enter()
                    .append("g")
                    .attr("class","bubble-node")
                    .append("circle");

                that.bub_node.attr("class","bubble-node")
                    .select("circle")
                    .attr("class","bubble")
                    .attr("x",function (d) { return d.x; })
                    .attr("y",function (d) { return d.y; })
                    .attr("r",0)
                    .attr("transform",function (d) {return "translate(" + d.x + "," + d.y +")";})
                    .attr("fill",function (d) {
                        return d.children ? that.bg : that.fillChart.chartColor(d);
                    })
                    .on("mouseover", function (d) {
                        if(!d.children) {
                            that.mouseEvent1.highlight(options.selector+" "+".bubble", this);
                            d.tooltip = d.tooltip ||"<table class='PykCharts'><tr><th colspan='2' class='tooltip-heading'>"+d.name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.weight)+"  <td class='tooltip-right-content'>(&nbsp;"+((d.weight*100)/total).toFixed(2)+"%&nbsp;)</tr></table>";
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.toolTextShow(d.tooltip);
                        }
                    })
                    .on("mouseout", function (d) {
                        that.mouseEvent.tooltipHide(d)
                        that.mouseEvent1.highlightHide(options.selector+" "+".bubble");
                    })
                    .on("mousemove", function (d) {
                        if(!d.children) {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("r",function (d) {return d.r; });
            
                return this;
            },
            label : function () {
                if (PykCharts.boolean(that.enableLabel)) {

                    that.bub_text = that.group.selectAll("text")
                        .data(that.node);

                    that.bub_text.enter()
                    .append("text")
                    .style("pointer-events","none");

                    that.bub_text.attr("text-anchor","middle")
                        .attr("transform",function (d) {return "translate(" + d.x + "," + (d.y + 5) +")";})
                        .text("")
                        .transition()
                        .delay(that.transitions.duration());

                    that.bub_text
                        .text(function (d) { return d.children ? " " :  d.name; })
                        .attr("pointer-events","none")
                        .text(function (d) {
                            if(this.getBBox().width< 2*d.r && this.getBBox().height<2*d.r) {
                                return d.children ? " " :  d.name;
                            }
                            else {
                                 return "";
                                }
                        })
                        .style("font-weight", that.label.weight)
                        .style("font-size",function (d,i) {
                            if (d.r > 24) {
                                return that.label.size;
                            } else {
                                return "10px";
                            }
                        })
                        .attr("fill", that.label.color)
                        .style("font-family", that.label.family);
                }
                return this;
            },
            clubData : function () {
                if (PykCharts.boolean(that.clubData.enable)) {
                    var clubdata_content = [];
                    var k = 0;
                    var j, i;
                    if(that.data.length <= that.clubData.maximumNodes) {
                        that.new_data1 = { "children" : that.data };
                        return this;
                    }
                    if (that.clubData.alwaysIncludeDataPoints.length!== 0) {
                        var l = that.clubData.alwaysIncludeDataPoints.length;
                        for (i =0; i<l; i++) {
                            clubdata_content[i] = that.clubData.alwaysIncludeDataPoints[i];
                        }
                    }
                    var new_data = [];
                    for (i=0; i<clubdata_content.length; i++) {
                        for (j=0; j< that.data.length; j++) {
                            if (clubdata_content[i].toUpperCase() === that.data[j].name.toUpperCase()) {
                                new_data.push(that.data[i]);
                            }
                        }
                    }
                    that.data.sort (function (a,b) { return b.weight - a.weight;});
                    while (new_data.length < that.clubData.maximumNodes-1) {
                        for(i=0;i<clubdata_content.length;i++) {
                            if(that.data[k].name.toUpperCase() === clubdata_content[i].toUpperCase()) {
                                k++;
                            }
                        }
                        new_data.push(that.data[k]);
                        k++;
                    }
                    var weight = 0;
                    for(j=k; j<that.data.length; j++) {
                        for (i=0; i<new_data.length && i< that.data.length; i++) {
                            if(that.data[j].name.toUpperCase() === new_data[i].name.toUpperCase()) {
                                weight+=0;
                                j++;
                                i = -1;
                            }
                        }
                        if(j<that.data.length) {
                            weight += that.data[j].weight;
                        }
                    }
                    var f = function (a,b) {return b.weight- a.weight;};
                    while (new_data.length > that.clubData.maximumNodes) {
                        new_data.sort(f);
                        var a = new_data.pop();
                    }

                    var others = {"name": that.clubData.text,"weight": weight, "color": that.clubData.color,"tooltip": that.clubData.tooltipText,"highlight":false};

                    if (new_data.length < that.clubData.maximumNodes) {
                        new_data.push(others);
                    }
                    new_data.sort(function (a,b) {
                        return a.weight - b.weight;
                    })

                    that.new_data1 = {"children": new_data};
                    that.map1 = that.new_data1.children.map(function (d) { return d.weight;});
                }
                else {
                    that.data.sort(function (a,b) {
                        return a.weight - b.weight;
                    })
                    that.new_data1 = { "children" : that.data };
                }
                return that.new_data1;
            }
        };
        return optional;
    };
};

PykCharts.oneD.funnel = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    that.creditMySite = theme.stylesheet.creditMySite;
    //----------------------------------------------------------------------------------------
    //1. This is the method that executes the various JS functions in the proper sequence to generate the chart
    //----------------------------------------------------------------------------------------
    this.execute = function () {
        //1.3 Assign Global variable var that to access function and variable throughout
        that = new PykCharts.oneD.processInputs(that, options);

        var funnel = options.funnel
        , functionality = theme.oneDimensionalCharts.funnel;
        that.rect_width = funnel && _.isNumber(funnel.rect_width) && funnel.rect_width ? funnel.rect_width : functionality.rect_width;
        that.rect_height = funnel && _.isNumber(funnel.rect_height) && funnel.rect_height ? funnel.rect_height : functionality.rect_height;

        if(that.mode === "default") {
           that.k.loading();
        }

        d3.json(options.data, function (e,data) {
            that.data = Array.groupBy(data);
            $(options.selector+" #chart-loader").remove();
            that.render();
        });

    };


    //----------------------------------------------------------------------------------------
    //2. Render function to create the chart
    //----------------------------------------------------------------------------------------
    this.refresh = function () {
        d3.json (options.data, function (e,data) {
            that.data = data;
            that.optionalFeatures()
                    .clubData()
                    .createFunnel()
                    .label()
                    .ticks()
        });
    };

    this.render = function () {
        var that = this;
        that.fillChart = new PykCharts.oneD.fillChart(that);
        that.mouseEvent1 = new PykCharts.oneD.mouseEvent(that);
        that.transitions = new PykCharts.Configuration.transition(that);
//        theme.stylesheet.borderBetweenChartElements;
        that.border = new PykCharts.Configuration.border(that);
        if(that.mode === "default") {
            that.k.title()
                .subtitle();
        }
        that.k.tooltip();
        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        if(that.mode === "infographics") {

            that.newData1 = that.data;
        }
        if(that.mode === "default") {
            var funnel = that.optionalFeatures()
                            .clubData();
        }
        that.optionalFeatures().svgContainer()
            .createFunnel()
            .label();
        if(that.mode === "default") {
            that.optionalFeatures().ticks();
            that.k.liveData(that)
                .credits()
                .dataSource();
        }
    };

    this.funnelLayout = function (){
        var that = this;
        var data,
            size,
            mouth,
            coordinates;

        var funnel = {
            data: function(d){
                if (d.length===0){

                } else {
                    data = d;
                }
                return this;
            },
            size: function(s){
                if (s.length!==2){

                } else {
                    size = s;
                }
                return this;
            },
            mouth: function(m){
                if (m.length!==2){

                } else {
                    mouth = m;
                }
                return this;
            },
            coordinates: function(){
                var w = size[0];
                var h = size[1];
                var rw = mouth[0]; //rect width
                var rh = mouth[1]; //rect height
                var tw = (w - rw)/2; //triangle width
                var th = h - rh; //triangle height
                var height1=0;
                var height2=0;
                var height3=0;
                var merge = 0;
                var coordinates = [];
                var percentValues = that.percentageValues(data);
                var ratio = tw/th;
                var area_of_trapezium = (w + rw) / 2 * th;
                var area_of_rectangle = rw * rh;
                var total_area = area_of_trapezium + area_of_rectangle;
                var percent_of_rectangle = area_of_rectangle / total_area * 100;
                function d3Sum (i) {
                    return d3.sum(percentValues,function (d, j){
                        if (j>=i) {
                            return d;
                        }
                    });
                }
                for (var i=data.length-1; i>=0; i--){
                    var selectedPercentValues = d3Sum(i);
                    if (percent_of_rectangle>=selectedPercentValues){
                        height3 = selectedPercentValues / percent_of_rectangle * rh;
                        height1 = h - height3;
                        if (i===data.length-1){
                            coordinates[i] = {"values":[{"x":(w-rw)/2,"y":height1},{"x":(w-rw)/2,"y":h},{"x":((w-rw)/2)+rw,"y":h},{"x":((w-rw)/2)+rw,"y":height1}]};
                        }else{
                            coordinates[i] = {"values":[{"x":(w-rw)/2,"y":height1},coordinates[i+1].values[0],coordinates[i+1].values[3],{"x":((w-rw)/2)+rw,"y":height1}]};
                        }
                    }else{
                        var area_of_element;
                        if(merge===0){
                            area_of_element = (selectedPercentValues - percent_of_rectangle)/100 * area_of_trapezium;
                        }else{
                            area_of_element = selectedPercentValues/100 * area_of_trapezium;
                        }
                        //quadratic equation = (-b +- root(pow(b)-4ac))/2a;
                        var a = 2 * ratio;
                        var b = 2 * rw;
                        var c = 2 * area_of_element;
                        height2 = (-b + Math.sqrt(Math.pow(b,2) - (4 * a * -c))) / (2 * a);
                        height1 = h - height2 - rh;
                        var base = 2*(ratio * height2)+rw;
                        var xwidth = (w-base)/2;
                        if(merge===0){
                            if (i===data.length-1){
                                coordinates[i] = {"values":[{"x":xwidth,"y":height1},{"x":(w-rw)/2,"y":th},{"x":(w-rw)/2,"y":h},{"x":((w-rw)/2)+rw,"y":h},{"x":((w-rw)/2)+rw,"y":th},{"x":base+xwidth,"y":height1}]};
                            }else{
                                coordinates[i] = {"values":[{"x":xwidth,"y":height1},{"x":(w-rw)/2,"y":th},coordinates[i+1].values[0],coordinates[i+1].values[3],{"x":((w-rw)/2)+rw,"y":th},{"x":base+xwidth,"y":height1}]};
                            }
                        }
                        else{
                                var coindex;
                                if(coordinates[i+1].values.length===6){
                                    coindex = 5;
                                }else{
                                    coindex = 3;
                                }
                                coordinates[i] = {"values":[{"x":xwidth,"y":height1},coordinates[i+1].values[0],coordinates[i+1].values[coindex],{"x":base+xwidth,"y":height1}]};
                        }
                        merge = 1;
                    }
                }
                return coordinates;
            }
        };
        return funnel;
    };

    this.percentageValues = function (data){
        var that = this;
        var total = d3.sum(data, function (d){
            return d.weight;
        });
        var percentValues = data.map(function (d){
            return d.weight/total*100;
        });
        percentValues.sort(function(a,b){
            return b-a;
        });
        return percentValues;
    };
    this.optionalFeatures = function () {

        var optional = {
            svgContainer :function () {
                $(options.selector).css("background-color",that.bg);

                that.svg = d3.select(options.selector)
                    .append('svg')
                    .attr("width",that.width+100)
                    .attr("height",that.height)
                    .attr("id","svgcontainer")
                    .attr("class","svgcontainer");

                    that.group = that.svg.append("g")
                        .attr("id","funnel");

                return this;
            },
            createFunnel: function () {
                that.pervalue = that.percentageValues(that.newData1);
                var funnel = that.funnelLayout()
                                .data(that.newData1)
                                .size([that.width,that.height])
                                .mouth([that.rect_width,that.rect_height]);

                that.coordinates = funnel.coordinates();
                var line = d3.svg.line()
                                .interpolate('linear-closed')
                                .x(function(d,i) { return d.x; })
                                .y(function(d,i) { return d.y; });

                that.path = that.group.selectAll('.fun-path')
                                .data(that.coordinates);
                var a = [{x:0,y:0},{x:that.width,y:0},{x:0,y:0},{x:that.width,y:0},{x:0,y:0},{x:that.width,y:0}];
                that.path.enter()
                    .append('path')
                    .attr("class", "fun-path")

                that.path
                    .attr("class","fun-path")
                    .attr('d',function(d){ return line(a); })

                   	.attr("fill",function (d,i) {
                        return that.fillChart.chartColor(that.newData1[i]);
        			})
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-opacity",1)
        			.on("mouseover", function (d,i) {
                        that.mouseEvent1.highlight(options.selector +" "+".fun-path",this);
                        tooltip = that.newData1[i].tooltip || "<table class='PykCharts'><tr><th colspan='3' class='tooltip-heading'>"+that.newData1[i].name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(that.newData1[i].weight)+"<td class='tooltip-right-content'>(&nbsp; "+that.pervalue[i].toFixed(2)+"%&nbsp) </tr></table>";
            			that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.toolTextShow(tooltip);
        			})
        			.on("mouseout", function (d) {
                        that.mouseEvent1.highlightHide(options.selector +" "+".fun-path");
            			that.mouseEvent.tooltipHide(d);
        			})
        			.on("mousemove", function (d,i) {
                        that.mouseEvent.tooltipPosition(d);
        			})
                    .transition()
                    .duration(that.transitions.duration())
                    .attr('d',function(d){ return line(d.values); });

               that.path.exit()
                   .remove();
               
                return this;
            },
            label : function () {
                if (PykCharts.boolean(that.enableLabel)) {

                    var pyr_text = that.group.selectAll("text")
                    .data(that.coordinates)

                    pyr_text.enter()
                        .append("text")


                    pyr_text.attr("y",function (d,i) {
                            if(d.values.length===4){
                                return (((d.values[0].y-d.values[1].y)/2)+d.values[1].y) + 5;
                            } else {
                                return (((d.values[0].y-d.values[2].y)/2)+d.values[2].y) + 5;
                            }
                        })
                        .attr("x", function (d,i) { return that.width/2;})
                    pyr_text.text(function (d,i) {
                            return that.k.appendUnits(that.newData1[i].weight);
                         })
                        .attr("text-anchor","middle")
                        .attr("pointer-events","none")
                        .style("font-weight", that.label.weight)
                        .style("font-size", that.label.size)
                        .attr("fill", that.label.color)
                        .style("font-family", that.label.family)
                        .text(function (d,i) {
                            if(this.getBBox().width<(d.values[3].x - d.values[1].x) && this.getBBox().height < (d.values[2].y - d.values[0].y)) {

                                return that.k.appendUnits(that.newData1[i].weight);
                            }
                            else {
                                return "";
                            }
                        });
                    pyr_text.exit()
                         .remove();
                }
                return this;
            },
            ticks : function () {
                    var line = that.group.selectAll("funnel-ticks")
                        .data(that.coordinates);

                    line.enter()
                        .append("line")
                        .attr("class", "funnel-ticks");

                    line
                        .attr("x1", function (d,i) {
                           if (d.values.length === 4) {
                                return ((d.values[3].x + d.values[2].x)/2 );
                           } else {
                                return ((d.values[4].x + d.values[5].x + d.values[3].x)/3 - 5);
                           }

                        })
                        .attr("y1", function (d,i) {
                               return (d.values[0].y + d.values[2].y)/2;
                        })
                        .attr("x2", function (d, i) {
                              if (d.values.length === 4) {
                                return ((d.values[3].x + d.values[2].x)/2 );
                           } else {
                                return ((d.values[4].x + d.values[5].x + d.values[3].x)/3 - 5);
                           }
                        })
                        .attr("y2", function (d, i) {
                               return ((d.values[0].y + d.values[2].y)/2);
                        })
                        .attr("stroke-width", that.ticks.strokeWidth)
                        .attr("stroke", that.ticks.color)
                        .transition()
                        .duration(that.transitions.duration())
                        .attr("x2", function (d, i) {
                            if(( d.values[2].y - d.values[0].y) > 15) {
                                if (d.values.length === 4) {
                                    return ((d.values[3].x + d.values[2].x)/2 ) + 5;
                                } else {
                                    return ((d.values[4].x + d.values[5].x + d.values[3].x)/3 );
                                }
                            } else {
                                if (d.values.length === 4) {
                                    return ((d.values[3].x + d.values[2].x)/2 );
                                } else {
                                    return ((d.values[4].x + d.values[5].x + d.values[3].x)/3 -5);
                                }
                            }

                        });

                    line.exit().remove();

                    var ticks_label = that.group.selectAll(".ticks_label")
                                        .data(that.coordinates);

                    ticks_label.attr("class","ticks_label");

                    ticks_label.enter()
                        .append("text")
                        .attr("x",0)
                        .attr("y",0);

                    var x,y;

                    ticks_label.attr("transform",function (d) {
                        if (d.values.length === 4) {
                            x = ((d.values[3].x + d.values[2].x)/2 ) + 10;
                        } else {
                            x = ((d.values[4].x + d.values[5].x + d.values[3].x)/3 ) + 5;
                        }
                        y = (d.values[0].y + d.values[2].y)/2 + 5;

                        return "translate(" + x + "," + y + ")";});

                    ticks_label.text("")
                        .transition()
                        .delay(that.transitions.duration())
                        .text(function (d,i) { return that.newData1[i].name; })
                        .text(function (d,i) {
                            if (this.getBBox().height < (d.values[2].y - d.values[0].y)-15) {
                                return that.newData1[i].name;
                            }
                            else {
                                return "";
                            }
                        })
                        .attr("font-size", that.ticks.size)
                        .attr("text-anchor","start")
                        .attr("fill", that.ticks.color)
                        .attr("pointer-events","none")
                        .attr("font-family", that.ticks.family);

                    ticks_label.exit().remove();

                return this;
            },
            clubData : function () {
                if(PykCharts.boolean(that.clubData.enable)) {
                    var clubdataContent = [];
                    if(that.clubData.alwaysIncludeDataPoints.length!== 0){
                        var l = that.clubData.alwaysIncludeDataPoints.length;
                        for(i=0; i < l; i++){
                            clubdataContent[i] = that.clubData.alwaysIncludeDataPoints[i];
                        }
                    }
                    that.newData = [];
                    for(i=0;i<clubdataContent.length;i++){
                        for(j=0;j<that.data.length;j++){
                            if(clubdataContent[i].toUpperCase() === that.data[j].name.toUpperCase()){
                                that.newData.push(that.data[j]);
                            }
                        }
                    }
                    that.data.sort(function (a,b) { return b.weight - a.weight; });
                    var k = 0;
                    while(that.newData.length<that.clubData.maximumNodes-1){
                        for(i=0;i<clubdataContent.length;i++){
                            if(that.data[k].name.toUpperCase() === clubdataContent[i].toUpperCase()){
                                k++;
                            }
                        }
                        that.newData.push(that.data[k]);
                        k++;
                    }
                    var weight = 0;
                    for(j=k; j < that.data.length; j++){
                        for(i=0; i<that.newData.length && j<that.data.length; i++){
                            if(that.data[j].name.toUpperCase() === that.newData[i].name.toUpperCase()){
                                weight +=0;
                                j++;
                                i = -1;
                            }
                        }
                        if(j < that.data.length){
                            weight += that.data[j].weight;
                        }
                    }
                    var sortfunc = function (a,b) { return b.weight - a.weight; };
                    while(that.newData.length > that.clubData.maximumNodes){
                        that.newData.sort(sortfunc);
                        var a=that.newData.pop();
                    }

                    var otherSpan = { "name":that.clubData.text, "weight": weight, "color": that.clubData.color, "tooltip": (that.clubData.tooltip)};
                    if(that.newData.length < that.clubData.maximumNodes){
                        that.newData.push(otherSpan);
                    }
                    that.newData1 = that.newData;
                }
                else {
                    that.data.sort(function (a,b) { return b.weight - a.weight; });
                    that.newData1 = that.data;
                }
                return this;
            }
        };
        return optional;
    };
};
PykCharts.oneD.percentageColumn = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    //----------------------------------------------------------------------------------------
    //1. This is the method that executes the various JS functions in the proper sequence to generate the chart
    //----------------------------------------------------------------------------------------
    this.execute = function () {
        //1.3 Assign Global variable var that to access function and variable throughout
        var that = this;

        that = new PykCharts.oneD.processInputs(that, options, "percentageColumn");
        // 1.2 Read Json File Get all the data and pass to render
        if(that.mode === "default") {
           that.k.loading();
        }
        d3.json(options.data, function (e, data) {
            that.data = Array.groupBy(data);
            $(options.selector+" #chart-loader").remove();
            that.render();
        });
    };
    //----------------------------------------------------------------------------------------
    //2. Render function to create the chart
    //----------------------------------------------------------------------------------------
    this.refresh = function () {
        d3.json (options.data, function (e,data) {
            that.data = data;
            that.optionalFeatures()
                    .clubData()
                    .createChart()
                    .label()
                    .ticks()
        });
    };

    this.render = function () {
        var that = this;
        that.fillChart = new PykCharts.oneD.fillChart(that);
        that.mouseEvent1 = new PykCharts.oneD.mouseEvent(options);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.border = new PykCharts.Configuration.border(that);
        if(that.mode === "default") {
            that.k.title()
                    .subtitle();
                // [that.fullscreen]().fullScreen(that);
        }
        if(that.mode === "infographics") {
            that.newData1 = that.data;
        }

        that.k.tooltip();

        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        if(that.mode === "default") {
            percent_column = that.optionalFeatures()
                            .clubData();
        }
        that.optionalFeatures().svgContainer()
            .createChart()
            .label();
        if(that.mode === "default") {
            that.optionalFeatures().ticks()
            that.k.liveData(that)
                .credits()
                .dataSource();
        }
    };
    this.optionalFeatures = function () {
        var optional = {
            createChart: function () {
                var arr = that.newData1.map(function (d) {
                    return d.weight;
                });
                arr.sum = function () {
                    var sum = 0;
                    for(var i = 0 ; i < this.length; ++i) {
                        sum += this[i];
                    }
                    return sum;
                };

                var sum = arr.sum();
                that.newData1.forEach(function (d, i) {
                    this[i].percentValue= d.weight * 100 / sum;
                }, that.newData1);
                that.newData1.sort(function (a,b) { return b.weight - a.weight; })
                that.map1 = _.map(that.newData1,function (d,i) {
                    return d.percentValue;
                });
                that.perColumn = that.group.selectAll('.per-rect')
                    .data(that.newData1)

                that.perColumn.enter()
                    .append('rect')
                    .attr("class","per-rect")

                that.perColumn.attr('x', (that.width/3))
                    .attr('y', function (d, i) {
                        if (i === 0) {
                            return 0;
                        } else {
                            var sum = 0,
                                subset = that.newData1.slice(0,i);

                            subset.forEach(function(d, i){
                                sum += this[i].percentValue;
                            },subset);

                            return sum * that.height / 100;
                        }
                    })
                    .attr('width', that.width/4)
                    .attr('height', 0)
                    .attr("fill",function (d) {
                        return that.fillChart.chartColor(d);
                    })
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .on("mouseover", function (d,i) {
                        d.tooltip=d.tooltip||"<table class='PykCharts'><tr><th colspan='2' class='tooltip-heading'>"+d.name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.weight)+"<td class='tooltip-right-content'>(&nbsp;"+d.percentValue.toFixed(2)+"%&nbsp)</tr></table>"
                        that.mouseEvent1.highlight(".per-rect",this);
                        that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.toolTextShow(d.tooltip);
                    })
                    .on("mouseout", function (d) {
                        that.mouseEvent1.highlightHide(".per-rect");
                        that.mouseEvent.tooltipHide(d);
                    })
                    .on("mousemove", function (d,i) {
                        that.mouseEvent.tooltipPosition(d);
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr('height', function (d) {
                        return d.percentValue * that.height / 100;
                    });
                that.perColumn.exit()
                    .remove();
               
                return this;
            },
            svgContainer :function () {
                $(options.selector).css("background-color",that.bg);

                that.svg = d3.select(options.selector)
                    .append('svg')
                    .attr("width",that.width)
                    .attr("height",that.height)
                    .attr("id","svgcontainer")
                    .attr("class","svgcontainer");

                    that.group = that.svg.append("g")
                        .attr("id","funnel");

                return this;
            },
            label : function () {
                if (PykCharts.boolean(that.enableLabel)) {

                    that.per_text = that.group.selectAll(".text")
                        .data(that.newData1);
                    var sum = 0;
                    that.per_text.enter()
                        .append("text")
                        .attr("class","per-text");

                    that.per_text.attr("class","per-text")
                        .attr("x", (that.width/3 + that.width/8 ))
                        .attr("y",function (d,i) {
                                sum = sum + d.percentValue;
                                if (i===0) {
                                    return (0 + (sum * that.height / 100))/2+5;
                                } else {
                                    return (((sum - d.percentValue) * that.height/100)+(sum * that.height / 100))/2+5;
                                }
                            });
                    sum = 0;
                    that.per_text.text("")
                        .transition()
                        .delay(that.transitions.duration())
                    that.per_text.text(function (d) { return that.k.appendUnits(d.weight); })
                        .attr("text-anchor","middle")
                        .attr("pointer-events","none")
                        .style("font-weight", that.label.weight)
                        .style("font-size", that.label.size)
                        .attr("fill", that.label.color)
                        .style("font-family", that.label.family)
                        .text(function (d) {
                            if(this.getBBox().width < (that.width/4 ) && this.getBBox().height < (d.percentValue * that.height / 100)) {
                                return that.k.appendUnits(d.weight);
                            }else {
                                return "";
                            }
                        });
                    that.per_text.exit()
                        .remove();
                }
                return this;
            },
            ticks : function () {
                    var sum = 0,sum1=0;
                    var line = that.group.selectAll(".per-ticks")
                        .data(that.newData1);

                    line.enter()
                        .append("line")
                        .attr("class", "per-ticks");

                    line
                        .attr("x1", function (d,i) {
                            return that.width/3 + that.width/4;
                        })
                        .attr("y1", function (d,i) {
                            sum = sum + d.percentValue;
                            if (i===0){
                                return (0 + (sum * that.height / 100))/2;
                            }else {
                                return (((sum - d.percentValue) * that.height/100)+(sum * that.height / 100))/2;
                            }
                        })
                        .attr("x2", function (d, i) {
                             return that.width/3 + (that.width/4);
                        })
                        .attr("y2", function (d,i) {
                            sum1 = sum1 + d.percentValue;
                            if (i===0){
                                return (0 + (sum1 * that.height / 100))/2;
                            }else {
                                return (((sum1 - d.percentValue) * that.height/100)+(sum1 * that.height / 100))/2;
                            }
                        })
                        .attr("stroke-width", that.ticks.strokeWidth)
                        .attr("stroke", that.ticks.color)
                        .transition()
                        .duration(that.transitions.duration())
                        .attr("x2", function (d, i) {
                            if((d.percentValue * that.height / 100) > 15) {
                                return that.width/3 + (that.width/4) + 5;
                            } else {
                                return that.width/3 + (that.width/4) ;
                            }
                        });

                    line.exit().remove();
                    var x,y;
                    sum = 0;
                    var ticks_label = that.group.selectAll(".ticks_label")
                                        .data(that.newData1);

                    ticks_label.enter()
                        .append("text")
                        .attr("class", "ticks_label")

                    ticks_label.attr("class", "ticks_label")
                        .attr("transform",function (d) {
                            sum = sum + d.percentValue
                            x = that.width/3+(that.width/4) + 10;
                            y = (((sum - d.percentValue) * that.height/100)+(sum * that.height / 100))/2 + 5;

                            return "translate(" + x + "," + y + ")";
                        });

                    ticks_label.text("")
                        .transition()
                        .delay(that.transitions.duration())
                        .text(function (d,i) {
                            if (this.getBBox().height < (d.percentValue * that.height / 100)-15) {
                                return d.name;
                            }
                            else {
                                return "";
                            }
                        })
                        .attr("font-size", that.ticks.size)
                        .attr("text-anchor","start")
                        .attr("fill", that.ticks.color)
                        .attr("font-family", that.ticks.family)
                        .attr("pointer-events","none");

                    ticks_label.exit().remove();

                return this;
            },
            clubData : function () {
                if(PykCharts.boolean(that.clubData.enable)) {
                    var clubdataContent = [];
                    if(that.clubData.alwaysIncludeDataPoints.length!== 0){
                        var l = that.clubData.alwaysIncludeDataPoints.length;
                        for(i=0; i < l; i++){
                            clubdataContent[i] = that.clubData.alwaysIncludeDataPoints[i];
                        }
                    }
                    that.newData = [];
                    for(i=0;i<clubdataContent.length;i++){
                        for(j=0;j<that.data.length;j++){
                            if(clubdataContent[i].toUpperCase() === that.data[j].name.toUpperCase()){
                                that.newData.push(that.data[j]);
                            }
                        }
                    }
                    that.data.sort(function (a,b) { return b.weight - a.weight; });
                    var k = 0;
                    while(that.newData.length<that.clubData.maximumNodes-1){
                        for(i=0;i<clubdataContent.length;i++){
                            if(that.data[k].name.toUpperCase() === clubdataContent[i].toUpperCase()){
                                k++;
                            }
                        }
                        that.newData.push(that.data[k]);
                        k++;
                    }
                    var weight = 0;
                    for(j=k; j < that.data.length; j++){
                        for(i=0; i<that.newData.length && j<that.data.length; i++){
                            if(that.data[j].name.toUpperCase() === that.newData[i].name.toUpperCase()){
                                weight +=0;
                                j++;
                                i = -1;
                            }
                        }
                        if(j < that.data.length){
                            weight += that.data[j].weight;
                        }
                    }
                    var sortfunc = function (a,b) { return b.weight - a.weight; };
                    while(that.newData.length > that.clubData.maximumNodes){
                        that.newData.sort(sortfunc);
                        var a=that.newData.pop();
                    }
                    var otherSpan = { "name":that.clubData.text, "weight": weight, "color": that.clubData.color, "tooltip": that.clubData.tooltip };

                    if(that.newData.length < that.clubData.maximumNodes){
                        that.newData.push(otherSpan);
                    }
                    that.newData1 = that.newData;
                }
                else {
                    that.data.sort(function (a,b) { return b.weight - a.weight; });
                    that.newData1 = that.data;
                }
                return this;
            }
        };
        return optional;
    };
};
PykCharts.oneD.pictograph = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function () {
        that = new PykCharts.oneD.processInputs(that, options);

        var optional = options.optional
        ,functionality = theme.oneDimensionalCharts;
        that.showActive = optional && optional.pictograph && optional.pictograph.showActive ? optional.pictograph.showActive : functionality.pictograph.showActive;
        that.enableLabel = optional && optional.pictograph && optional.pictograph.enableLabel ? optional.pictograph.enableLabel : functionality.pictograph.enableLabel;
        that.labeltext = optional && optional.pictograph && optional.pictograph.labelText ? optional.pictograph.labelText : functionality.pictograph.labelText;
        that.imgperline = optional && optional.pictograph && optional.pictograph.imagePerLine ?  optional.pictograph.imagePerLine : functionality.pictograph.imagePerLine;
        if (optional && optional.pictograph && optional.pictograph.activeText) {
            that.activeText = optional.pictograph.activeText;
            that.activeText.size = optional.pictograph.activeText.size ? optional.pictograph.activeText.size : functionality.pictograph.activeText.size;
            that.activeText.color = optional.pictograph.activeText.color ? optional.pictograph.activeText.color : functionality.pictograph.activeText.color;
            that.activeText.weight = optional.pictograph.activeText.weight ? optional.pictograph.activeText.weight : functionality.pictograph.activeText.weight;
            that.activeText.family = optional.pictograph.activeText.family ? optional.pictograph.activeText.family : functionality.pictograph.activeText.family;
        } else {
            that.activeText = functionality.pictograph.activeText;
        }
        if (optional && optional.pictograph && optional.pictograph.inactiveText) {
            that.inactiveText = optional.pictograph.inactiveText;
            that.inactiveText.size = optional.pictograph.inactiveText.size ? optional.pictograph.inactiveText.size : functionality.pictograph.inactiveText.size;
            that.inactiveText.color = optional.pictograph.inactiveText.color ? optional.pictograph.inactiveText.color : functionality.pictograph.inactiveText.color;
            that.inactiveText.weight = optional.pictograph.inactiveText.weight ? optional.pictograph.inactiveText.weight : functionality.pictograph.inactiveText.weight;
            that.inactiveText.family = optional.pictograph.inactiveText.family ? optional.pictograph.inactiveText.family : functionality.pictograph.inactiveText.family;
        } else {
            that.inactiveText = functionality.pictograph.inactiveText;
        }
        that.imageWidth = optional && optional.pictograph && optional.pictograph.imageWidth ? optional.pictograph.imageWidth : functionality.pictograph.imageWidth;
        that.imageHeight = optional && optional.pictograph && optional.pictograph.imageHeight ? optional.pictograph.imageHeight : functionality.pictograph.imageHeight;

        if(that.mode === "default") {
           that.k.loading();
        }
        d3.json(options.data, function (e,data) {
            that.data = data;
            $(options.selector+" #chart-loader").remove();
            that.render();
        })
    };

    this.render = function () {

        that.transitions = new PykCharts.Configuration.transition(that);
        that.k.title();
        that.k.subtitle();

        var picto = that.optionalFeatures()
                .svgContainer()
                .createPictograph()
                .labelText()
                .enableLabel();
        that.k.credits()
                .dataSource();
    };

    this.optionalFeatures = function () {

        var optional = {
            svgContainer: function () {
                $(options.selector).css("background-color",that.bg);

                that.svg = d3.select(options.selector).append('svg')
                    .attr("width",that.width)
                    .attr("height",that.height);

                that.group = that.svg.append("g")
                    .attr("transform", "translate(" + that.imageWidth + ",0)");

                that.group1 = that.svg.append("g")
                    .attr("transform","translate(0,"+ that.imageHeight +")");

                return this;
            },
            createPictograph: function () {
                var a = 1,b=1;

                that.optionalFeatures().showActive();
                var counter = 0;
                for(var j=1; j<=that.size; j++) {
                    if(j <= that.data[1].size ) {
                        that.group.append("image")
                            .attr("xlink:href",that.data[1].img)
                            .attr("x", b *(that.imageWidth + 1))
                            .attr("y", a *(that.imageHeight + 10))
                            .attr("width",0)
                            .attr("height", that.imageHeight + "px")
                            .transition()
                            .duration(that.transitions.duration())
                            .attr("width", that.imageWidth + "px");
                    }else {
                        that.group.append("image")
                            .attr("xlink:href",that.data[0].img)
                            .attr("x", b *(that.imageWidth + 1))
                            .attr("y", a *(that.imageHeight+ 10))
                            .attr("width",0)
                            .attr("height", that.imageHeight + "px")
                            .transition()
                            .duration(that.transitions.duration())
                            .attr("width", that.imageWidth + "px");
                    }
                    counter++;
                    b++;
                    if (counter >= that.imgperline) {
                        a++;
                        b=1;
                        counter=0;
                        that.group.append("text").html("<br><br>");
                    }
                }
                return this;
            },
            showActive: function () {
                 if (PykCharts.boolean(that.showActive)) {
                    that.size = that.data[0].size;
                }
                else {
                    that.size = that.data[1].size;
                }
                return this ;
            },
            enableLabel: function () {
                if (PykCharts.boolean(that.enableLabel)) {
                    var textHeight;
                     this.labelText();
                     that.group1.append("text")
                        .attr("font-family",that.inactiveText.family)
                        .attr("font-size",that.inactiveText.size)
                        .attr("fill",that.inactiveText.color)
                        .text("/"+that.data[0].size)
                        .text(function () {
                            textHeight =this.getBBox().height;
                            return "/"+that.data[0].size;
                        })
                        .attr("x", (that.textWidth+5))
                        .attr("y", that.height/2 - textHeight);
                }
                return this;
            },
            labelText: function () {
                if (PykCharts.boolean(that.labeltext)) {
                    var textHeight;
                    that.group1.append("text")
                        .attr("x", 0)
                        .attr("font-family",that.activeText.family)
                        .attr("font-size",that.activeText.size)
                        .attr("fill",that.activeText.color)
                        .text(that.data[1].size)
                        .text(function () {
                            textHeight =this.getBBox().height;
                            that.textWidth = this.getBBox().width;
                            return that.data[1].size;
                        })
                        .attr("y", that.height/2 - textHeight);

                }
                return this;
            }
        }
        return optional;
    }
};
PykCharts.oneD.pie = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function() {

        that = new PykCharts.oneD.processInputs(that, options, "pie");

        that.radiusPercent = options.pie && _.isNumber(options.pie.radiusPercent) ? options.pie.radiusPercent : theme.oneDimensionalCharts.pie.radiusPercent;
        that.innerRadiusPercent = 0;
        if(that.mode === "default") {
           that.k.loading();
        }
        d3.json(options.data, function (e, data) {
            console.log(data);
            that.data = Array.groupBy(data);
            console.log(that.data);
            $(options.selector+" #chart-loader").remove();
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"pie");
            pieFunctions.render();

        });
    };
};

PykCharts.oneD.donut = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function() {

        that = new PykCharts.oneD.processInputs(that, options, "pie");

        that.radiusPercent = options.donut && _.isNumber(options.donut.radiusPercent) ? options.donut.radiusPercent : theme.oneDimensionalCharts.donut.radiusPercent;
        that.innerRadiusPercent = options.donut && _.isNumber(options.donut.innerRadiusPercent) && options.donut.innerRadiusPercent ? options.donut.innerRadiusPercent : theme.oneDimensionalCharts.donut.innerRadiusPercent;

        d3.json(options.data, function (e, data) {
            that.data = data;
            $(".loader").remove();
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"donut");
            pieFunctions.render();
        });
    };
};

PykCharts.oneD.election_pie = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function() {

        that = new PykCharts.oneD.processInputs(that, options, "pie");

        that.radiusPercent = options.pie && _.isNumber(options.pie.radiusPercent) ? options.pie.radiusPercent : theme.oneDimensionalCharts.pie.radiusPercent;
        that.innerRadiusPercent = 0;
        d3.json(options.data, function (e, data) {
            that.data = data;
            $(".loader").remove();
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"election pie");
            pieFunctions.render();

        });
    };
};

PykCharts.oneD.election_donut = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function() {
        that = new PykCharts.oneD.processInputs(that, options, "pie");

        that.radiusPercent = options.donut && _.isNumber(options.donut.radiusPercent) ? options.donut.radiusPercent : theme.oneDimensionalCharts.donut.radiusPercent;
        that.innerRadiusPercent = options.donut && _.isNumber(options.donut.innerRadiusPercent) && options.donut.innerRadiusPercent ? options.donut.innerRadiusPercent : theme.oneDimensionalCharts.donut.innerRadiusPercent;

        d3.json(options.data, function (e, data) {
            that.data = data;
            $(".loader").remove();
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"election donut");
            pieFunctions.render();
        });
    };
};


    //----------------------------------------------------------------------------------------
    // Function to handle live data
    //----------------------------------------------------------------------------------------

PykCharts.oneD.pieFunctions = function (options,chartObject,type) {
    var that = chartObject;
       that.refresh = function () {
        d3.json(options.data, function (e, data) {
            that.data = data;
            that.optionalFeatures()
                    .createPie()
                    .label()
                    .ticks()
                    .centerLabel();
        });
    };

    //----------------------------------------------------------------------------------------
    // Function to render the chart
    //----------------------------------------------------------------------------------------

    this.render = function() {

        that.count = 1;

        that.fillChart = new PykCharts.oneD.fillChart(that);
        that.onHoverEffect = new PykCharts.oneD.mouseEvent(options);
        that.border = new PykCharts.Configuration.border(that);
        that.transitions = new PykCharts.Configuration.transition(that);

        if(that.mode.toLowerCase() == "default") {

            that.k.title()
                .subtitle();

            that.optionalFeatures().svgContainer();

            that.k.credits()
                    .dataSource()
                    .tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

            var pie = that.optionalFeatures()
                    .set_start_end_angle()
                    .createPie()
                    .label()
                    .ticks()
                    .centerLabel();

            that.k.liveData(that);
        } else if(that.mode.toLowerCase() == "infographics") {
            that.optionalFeatures().svgContainer()
                    .set_start_end_angle()
                    .createPie()
                    .label();

            that.k.tooltip();
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        }
    };

    //----------------------------------------------------------------------------------------
    // Function to render configuration parameters
    //----------------------------------------------------------------------------------------

    that.optionalFeatures = function () {
        var optional = {
            svgContainer :function () {
                $(options.selector).css("background-color",that.bg);

                that.svgContainer = d3.select(that.selector)
                    .append('svg')
                    .attr("width",that.width)
                    .attr("height",that.height)
                    .attr("id","container")
                    .attr("class","svgcontainer");
                that.group = that.svgContainer.append("g")
                    .attr("transform","translate("+(that.width/2)+","+(that.k._radiusCalculation(that.radiusPercent)+40)+")")
                    .attr("id","pieGroup");

                return this;
            },
            createPie : function () {
                d3.select(options.selector +" "+"#pieGroup").node().innerHTML="";
                that.chartData = that.optionalFeatures().clubData();

                console.log(that.chartData);

                if(type.toLowerCase() == "pie" || type.toLowerCase() == "donut") {
                    that.chartData.sort(function (a,b) { return a.weight - b.weight;});
                    var temp = that.chartData.pop();
                    that.chartData.unshift(temp);
                }
                else if(type.toLowerCase() == "election pie" || type.toLowerCase() == "election donut") {
                    that.chartData.sort(function (a,b) { return b.weight - a.weight;});
                }
                that.sum = _.reduce(that.data,function (start,num) { return start+num.weight; },0);

                that.sorted_weight = _.map(that.chartData,function (d,i) {
                        return d.weight*100/that.sum;

                });

                that.sorted_weight.sort(function (a,b){return a-b;});

                var proportion =_.map(that.chartData,function (d,i) {
                        return d.weight*100/that.sum;
                });
                that.innerRadius = that.k._radiusCalculation(that.innerRadiusPercent);
                that.radius = that.k._radiusCalculation(that.radiusPercent);

                that.arc = d3.svg.arc()
                    .innerRadius(that.innerRadius)
                    .outerRadius(that.radius);

                that.pie = d3.layout.pie()
                    .value(function (d) { return d.weight; })
                    .sort(null)
                    .startAngle(that.startAngle)
                    .endAngle(that.endAngle);

                var cv_path = that.group.selectAll("path").
                                        data(that.pie(that.chartData));

                cv_path.enter()
                    .append("path");

                cv_path
                    .attr("class","pie");

                cv_path
                    .attr("fill",function (d) {
                            return that.fillChart.chartColor(d.data);
                    })
                    .on('mouseover',function (d) {
                        d.data.tooltip = d.data.tooltip || "<table class='PykCharts'><tr><th colspan='3' class='tooltip-heading'>"+d.data.name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.data.weight)+"<td class='tooltip-right-content'>( "+((d.data.weight*100)/that.sum).toFixed(2)+"% ) </tr></table>";
                        that.onHoverEffect.highlight(options.selector +" "+".pie", this);
                        that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.toolTextShow(d.data.tooltip);
                    })
                    .on('mouseout',function (d) {
                        that.onHoverEffect.highlightHide(options.selector +" "+".pie");
                        that.mouseEvent.tooltipHide(d);
                    })
                    .on('mousemove', function (d) {
                        that.mouseEvent.tooltipPosition(d);
                    })
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                cv_path.transition()
                    .delay(function(d, i) {
                        if(that.transition.duration && that.mode == "default") {
                            return (i * that.transition.duration)/that.chartData.length;
                        } else return 0;
                    })
                    .duration(that.transitions.duration()/that.chartData.length)
                    .attrTween("d",function(d) {
                        var i = d3.interpolate(d.startAngle, d.endAngle);
                        return function(t) {
                            d.endAngle = i(t);
                            return that.arc(d);
                        }
                    });

                cv_path.exit().remove();                
                return this;
            },
            label : function () {
                // if (PykCharts.boolean(that.enableLabel)) {

                    var cv_text = that.group.selectAll("text")
                                       .data(that.pie(that.chartData));

                    cv_text.enter()
                        .append("text")
                        .attr("transform",function (d) { return "translate("+that.arc.centroid(d)+")"; });

                    cv_text.attr("transform",function (d) { return "translate("+that.arc.centroid(d)+")"; });

                    cv_text.text("")
                        .transition()
                        .delay(function(d, i) {
                            if(PykCharts.boolean(that.transition.duration)) {
                                return (i * that.transition.duration)/that.chartData.length;
                            } else return 0;
                        });

                    cv_text.text(function (d) { return that.k.appendUnits(d.data.weight); })
                        .attr("text-anchor","middle")
                        .attr("pointer-events","none")
                        .text(function (d) {
                            if(type.toLowerCase() === "pie" || type.toLowerCase() === "election pie") {
                                if(this.getBBox().width<((d.endAngle-d.startAngle)*((that.radius/2)*0.9))) {
                                    return that.k.appendUnits(d.data.weight);
                                }
                                else {
                                    return "";
                                }
                            } else {
                                if((this.getBBox().width < (Math.abs(d.endAngle - d.startAngle)*that.radius*0.9))  && (this.getBBox().height < (((that.radius-that.innerRadius)*0.75)))) {
                                    return that.k.appendUnits(d.data.weight);
                                }
                                else {
                                    return "";
                                }
                            }
                        })
                        .attr("dy",5)
                        .style("font-weight", that.label.weight)
                        .style("font-size", that.label.size)
                        .attr("fill", that.label.color)
                        .style("font-family", that.label.family);

                        console.log(that.label.size);

                    cv_text.exit().remove();
                // }
                return this;
            },
            clubData: function () {
                if(PykCharts.boolean(that.clubData.enable)) {
                    that.displayData = [];
                    that.maximum_weight = _.map(that.data,function(num){ return num.weight; });
                    that.maximum_weight.sort(function(a,b){ return b-a; });
                    that.checkDuplicate = [];
                    var others_Slice = {"name":that.clubData.text,"color":that.clubData.color,"tooltip":that.clubData.tooltipText,"highlight":false};
                    var index;
                    var i;
                    console.log(that.data);
                    that.getIndexByName = function(name) {
                        for(i=0;i<that.data.length;i++)
                        {
                            if(that.data[i].name == name) {
                                return i;
                            }
                        }
                    };

                    var reject = function (index) {
                        var result = _.reject(that.maximum_weight,function(num)
                            {
                                return num == that.data[index].weight;
                            });
                        return result;
                    } ;
                    var k = 0;

                    if(that.clubData.alwaysIncludeDataPoints.length!== 0) {
                        for (var l=0;l<that.clubData.alwaysIncludeDataPoints.length;l++)
                        {

                            index = that.getIndexByName(that.clubData.alwaysIncludeDataPoints[l]);
                            if(index!= undefined) {
                                that.displayData.push(that.data[index]);
                                that.maximum_weight = reject (index);
                            }
                        }
                    }
                    that.getIndexByWeight = function (weight) {
                        for(var i=0;i<that.data.length;i++)
                        {

                            if(that.data[i].weight == weight) {
                                if((_.contains(that.checkDuplicate, i))===false) {
                                   that.checkDuplicate.push(i);
                                    return i;
                                }
                                else {
                                    continue;
                                }
                            }
                        }
                    };

                    var count = that.clubData.maximumNodes-that.displayData.length;

                    if(count>0)
                    {
                        that.displayData.push(others_Slice);
                        for (i=0;i<count-1;i++) {
                            index = that.getIndexByWeight(that.maximum_weight[i]);
                            that.displayData.push(that.data[index]);
                        }
                    }
                    var sumOthers = d3.sum(that.maximum_weight,function (d,i) {
                            if(i>=count)
                                return d;
                        });

                    others_Slice.weight = sumOthers;
                }
                else {
                    that.displayData = that.data;
                }
                console.log(that.displayData);
                return that.displayData;
            },
            ticks : function () {
                // if(PykCharts.boolean(that.enableTicks)) {
                    var line = that.group.selectAll("line")
                        .data(that.pie(that.chartData));

                    line.enter()
                        .append("line")
                        .attr("class", "ticks");

                    line.attr("x1", function (d) {
                            return (that.radius) * (1)* Math.cos((d.startAngle + d.endAngle)/2);
                        })
                        .attr("y1", function (d) {
                            return (that.radius) * (1) *Math.sin((d.endAngle + d.startAngle )/2);
                        })
                        .attr("x2", function (d) {
                            return (that.radius) * (1)* Math.cos((d.startAngle + d.endAngle)/2);
                        })
                        .attr("y2", function (d) {
                            return (that.radius) * (1) *Math.sin((d.endAngle + d.startAngle )/2);
                        })
                        .transition()
                        .delay(function(d, i) {
                            if(PykCharts.boolean(that.transition.duration)) {
                                return ((i) * that.transition.duration)/that.chartData.length;
                            } else return 0;
                        })
                        .duration(that.transitions.duration()/that.chartData.length)
                        .attr("x2", function (d, i) {
                            return (that.radius/1+12)* (1) * Math.cos((d.startAngle + d.endAngle)/2);
                        })
                        .attr("y2", function (d, i) {
                            return (that.radius/1+12)* ( 1) * Math.sin((d.endAngle + d.startAngle)/2);
                        })
                        .attr("transform","rotate(-90)")
                        .attr("stroke-width", that.ticks.strokeWidth)
                        .attr("stroke",that.ticks.color);
                    line.exit().remove();

                    var ticks_label = that.group.selectAll(".ticks_label")
                                    .data(that.pie(that.chartData));

                    ticks_label.attr("class","ticks_label");

                    ticks_label.enter()
                        .append("text")
                        .attr("x",0)
                        .attr("y",0);

                    var x,y;
                    ticks_label.attr("transform",function (d) {
                        if (d.endAngle - d.startAngle < 0.2) {
                             x = (that.radius +30 ) * (1) * Math.cos((d.startAngle + d.endAngle - Math.PI)/2);
                             y = (that.radius/1+20) * (1) * Math.sin((d.startAngle + d.endAngle -  Math.PI)/2);
                        } else {
                             x = (that.radius +22 ) * (1) * Math.cos((d.startAngle + d.endAngle - Math.PI)/2);
                             y = (that.radius/1+24) * (1) * Math.sin((d.startAngle + d.endAngle -  Math.PI)/2);
                        }
                        return "translate(" + x + "," + y + ")";});

                    ticks_label.text("")
                        .transition()
                        .delay(function(d, i) {
                            if(PykCharts.boolean(that.transition.duration)) {
                                return ((i+1) * that.transition.duration)/that.chartData.length;
                            } else return 0;
                        })
                        .text(function (d) { return d.data.name; })
                        .attr("text-anchor",function(d) {
                                var rads = ((d.endAngle - d.startAngle) / 2) + d.startAngle;
                                if (rads>0 && rads<1.5) {
                                    return "start";
                                } else if (rads>=1.5 && rads<3.5) {
                                    return "middle";
                                } else if (rads>=3.5 && rads<6) {
                                    return "end";
                                } else if (rads>=6) {
                                    return "middle";
                                } else if(rads<0) {
                                    return "middle";
                                }
                            })
                        .attr("dy",5)
                        .attr("pointer-events","none")
                        .style("fill",that.ticks.color)
                        .style("font-size",that.ticks.size)
                        .style("font-family", that.ticks.family);

                    ticks_label.exit().remove();
                // }
                return this;
            },
            centerLabel: function () {

                if(PykCharts.boolean(that.showTotalAtTheCenter) && (type == "donut" || type == "election donut")) {

                    // var displaySum = that.group.selectAll(".total")
                    //             .data(["sum"]);

                    // displaySum.enter()
                    //             .append("text");

                    // displaySum.attr("class","total")
                    //     .text("")
                    //     .transition()
                    //     .delay(function(d) {
                    //        return that.transitions.duration();
                    //     })
                    //     .text("Total")
                    //     .attr('font-size',"0.5em")
                    //     .attr("pointer-events","none")
                    //     .attr("text-anchor","middle")
                    //     .attr("y",function () {
                    //         return (type == "donut") ? (-0.1*that.innerRadius) : (-0.5*that.innerRadius);
                    //     })
                    //     .attr("font-size",function () {
                    //         return (type == "donut") ? 0.1*that.innerRadius : 0.1*that.innerRadius;
                    //     })
                    //     .style("font-family","'Helvetica Neue',Helvetica,Arial,sans-serif")
                    //     .attr("fill","gray");

                    // displaySum.exit().remove();


                    var label = that.group.selectAll(options.selector +" "+".centerLabel")
                                    .data([that.sum]);

                    label.enter()
                        .append("text");

                    label.attr("class","centerLabel")
                        .text("")
                        .transition()
                        .delay( function(d) {
                            if(PykCharts.boolean(that.transition.duration)) {
                                return that.transition.duration;
                            }
                        })
                        label.text( function(d) {
                            return that.k.appendUnits(that.sum);
                        })
                        .attr("pointer-events","none")
                        .attr("text-anchor","middle")
                        .attr("y",function () {
                            return (type == "donut") ? (0.2*that.innerRadius) : (-0.25*that.innerRadius);
                        })
                        .attr("font-size",function () {
                            return (type == "donut") ? 0.4*that.innerRadius : 0.2*that.innerRadius;
                        })
                        .style("font-family","'Helvetica Neue',Helvetica,Arial,sans-serif")
                        .attr("fill","#484848");

                    label.exit().remove();
                }
                return this;
            },
            set_start_end_angle: function () {
                that.startAngle, that.endAngle;
                if(type == "pie" || type == "donut") {
                    that.startAngle = (0 * (Math.PI/180));
                    that.endAngle = (360 * (Math.PI/180));
                } else if(type == "election pie" || type == "election donut") {
                    that.startAngle = (-90 * (Math.PI/180));
                    that.endAngle = (90 * (Math.PI/180));
                }
                return this;
            }
        };
        return optional;
    };
};

PykCharts.oneD.pyramid = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

	this.execute = function () {
        that = new PykCharts.oneD.processInputs(that, options, "pyramid");

        if(that.mode === "default") {
           that.k.loading();
        }

        d3.json(options.data, function (e,data) {
			that.data = Array.groupBy(data);
            $(options.selector+" #chart-loader").remove();
			that.render();
		})
	};

    this.refresh = function () {
        d3.json (options.data, function (e,data) {
            that.data = data;
            that.optionalFeatures()
                    .createChart()
                    .label()
                    .ticks();
        });
    };

	this.render = function () {
		that.fillChart = new PykCharts.oneD.fillChart(that);
        that.mouseEvent1 = new PykCharts.oneD.mouseEvent(options);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.border = new PykCharts.Configuration.border(that);

        if (that.mode === "default") {
            that.k.title();
            that.k.subtitle();
            var pyramid = that.optionalFeatures().svgContainer()
                .createChart()
                .label()
                .ticks();

            that.k.credits()
                .dataSource()
                .tooltip()
                .liveData(that);
                // [that.fullscreen]().fullScreen(that)

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

        } else if (that.mode === "infographics") {
            that.optionalFeatures().svgContainer()
                .createChart()
                .label();

            that.k.tooltip();
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        }
	};

	this.percentageValues = function (data){
        var total = d3.sum(data, function (d){
            return d.weight;
        });
        var percentValues = data.map(function (d){
            return d.weight/total*100;
        });
        percentValues.sort(function(a,b){
            return b-a;
        });
        return percentValues;
    };
	this.pyramidLayout = function () {
        var data,
            size,
            coordinates;

        var pyramid = {
            data: function(d){
                if (d.length===0){

                } else {
                    data = d;
                }
                return this;
            },
            size: function(s){
                if (s.length!==2){

                } else {
                    size = s;
                }
                return this;
            },
            coordinates: function(c){
                var w = size[0];
                var h = size[1];
                var ratio = (w/2)/h;
                var percentValues = that.percentageValues(data);
                var coordinates = [];
                var area_of_triangle = (w * h) / 2;
                 function d3Sum (i) {
                    return d3.sum(percentValues,function (d, j){
                        if (j>=i) {
                            return d;
                        }
                    });
                }
                for (var i=0; i<data.length; i++){
                    var selectedPercentValues = d3Sum(i);
                    var area_of_element = selectedPercentValues/100 * area_of_triangle;
                    var height1 = Math.sqrt(area_of_element/ratio);
                    var base = 2 * ratio * height1;
                    var xwidth = (w-base)/2;
                    if (i===0){
                        coordinates[i] = {"values":[{"x":w/2,"y":0},{"x":xwidth,"y":height1},{"x":base+xwidth,"y":height1}]};
                    }else{
                        coordinates[i] = {"values":[coordinates[i-1].values[1],{"x":xwidth,"y":height1},{"x":base+xwidth,"y":height1},coordinates[i-1].values[2]]};
                    }
                }
                return coordinates;
            }
        };
        return pyramid;
    };

    this.optionalFeatures = function () {

    	var optional = {
            svgContainer :function () {
                $(options.selector).css("background-color",that.bg);

                that.svg = d3.select(options.selector)
                    .append('svg')
                    .attr("width", that.width +200)
                    .attr("height",that.height)
                    .attr("id","svgcontainer")
                    .attr("class","svgcontainer");

                that.group = that.svg.append("g")
                    .attr("id","pyrgrp");

                return this;
            },
        	createChart : function () {

        		that.chartData = that.optionalFeatures().clubData();
        		that.perValues = that.percentageValues(that.chartData);

        		var pyramid = that.pyramidLayout()
                    .data(that.chartData)
                    .size([that.width,that.height]);
                var total = d3.sum(that.chartData, function (d){
                    return d.weight;
                });
		        that.coordinates = pyramid.coordinates();
                that.coordinates[0].values[1] = that.coordinates[that.coordinates.length-1].values[1];
                that.coordinates[0].values[2] = that.coordinates[that.coordinates.length-1].values[2];
                var k = that.chartData.length-1,p = that.chartData.length-1,tooltipArray = [];
                for(i=0;i<that.chartData.length;i++){
                    if(i==0) {
                        tooltipArray[i] = that.chartData[i].tooltip || "<table class='PykCharts'><tr><th colspan='3'  class='tooltip-heading'>"+that.chartData[i].name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(that.chartData[i].weight)+"<td class='tooltip-right-content'>( "+((that.chartData[i].weight*100)/total).toFixed(2)+"% ) </tr></table>";
                    } else {
                        tooltipArray[i] = that.chartData[k].tooltip || "<table class='PykCharts'><tr><th colspan='3'  class='tooltip-heading'>"+that.chartData[k].name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(that.chartData[k].weight)+"<td class='tooltip-right-content'>( "+((that.chartData[k].weight*100)/total).toFixed(2)+"% ) </tr></table>";
                        k--;
                    }
                }
		        that.line = d3.svg.line()
                    .interpolate('linear-closed')
                    .x(function(d,i) { return d.x; })
                    .y(function(d,i) { return d.y; });

                var a = [{x:0,y:that.height},{x:that.width,y:that.height},{x:0,y:that.height},{x:that.width,y:that.height},{x:0,y:that.height},{x:that.width,y:that.height}]
                var k =that.chartData.length;
        
                var path =that.group.selectAll('.pyr-path')
                    .data(that.coordinates)
                path.enter()
                    .append('path')

                path.attr("class","pyr-path")
                    .attr('d',function(d) {return that.line(a);})
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                   	.attr("fill",function (d,i) {
                        if(i===0) {
                            b = that.chartData[i];
                        }
                        else {
                            k--;
                            b = that.chartData[k];
                        }
                        return that.fillChart.chartColor(b);
                    })
        			.on("mouseover", function (d,i) {
                        that.mouseEvent1.highlight(options.selector +" "+".pyr-path",this);
                        that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.toolTextShow(tooltipArray[i]);
        			})
        			.on("mouseout", function (d) {
                        that.mouseEvent1.highlightHide(options.selector +" "+".pyr-path")
            			that.mouseEvent.tooltipHide(d);
        			})
        			.on("mousemove", function (d,i) {
                        that.mouseEvent.tooltipPosition(d);
        			})
                    .transition()
                    .duration(that.transitions.duration())
                    .attr('d',function (d){ return that.line(d.values); });

                path.exit().remove();
              
		        return this;
        	},
            label: function () {
                if (PykCharts.boolean(that.enableLabel)) {
                    var j = that.chartData.length;
                    var p = that.chartData.length;
                    var pyr_text = that.group.selectAll("text")
                        .data(that.coordinates)

                    pyr_text.enter()
                        .append("text")

                    pyr_text.attr("y",function (d,i) {
                            if(d.values.length === 4) {
                                return (((d.values[0].y-d.values[1].y)/2)+d.values[1].y) +2;
                            } else {
                                return (d.values[0].y + that.coordinates[that.coordinates.length-1].values[1].y)/2 + 10;
                            }
                        })
                        .attr("x", function (d,i) { return that.width/2;})
                        .text("")
                        .transition()
                        .delay(that.transitions.duration())
                    pyr_text.text(function (d,i) {
                            if(i===0) {
                                return that.k.appendUnits(that.chartData[i].weight);
                            }
                            else {
                                j--;
                                return that.k.appendUnits(that.chartData[j].weight);
                            }
                         })
                        .text(function (d,i) {
                            if(this.getBBox().width < (d.values[2].x - d.values[1].x) || this.getBBox().height < (d.values[1].y - d.values[0].y)) {
                                if(i===0) {
                                    return that.k.appendUnits(that.chartData[i].weight);
                                }else {
                                    p--;
                                    return that.k.appendUnits(that.chartData[p].weight);
                                }
                            }
                            else {
                                return "";
                            }
                        })
                        .attr("text-anchor","middle")
                        .attr("pointer-events","none")
                        .style("font-weight", that.label.weight)
                        .style("font-size", that.label.size)
                        .attr("fill", that.label.color)
                        .style("font-family", that.label.family);
                    pyr_text.exit().remove();
                }
                return this;
            },
            ticks : function () {
                // if(PykCharts.boolean(that.enableTicks)) {

                var line = that.group.selectAll("pyr-ticks")
                    .data(that.coordinates);

                var n = that.chartData.length;

                line.enter()
                    .append("line")
                    .attr("class", "pyr-ticks");

                line.attr("x1", function (d,i) {
                       if (d.values.length === 3) {
                            return (d.values[0].x + that.coordinates[that.coordinates.length-1].values[2].x)/2 ;
                       } else {
                            return ((d.values[2].x + d.values[3].x)/2 );
                       }
                    })
                    .attr("y1", function (d,i) {
                        if(d.values.length === 4) {
                            return (((d.values[0].y-d.values[1].y)/2)+d.values[1].y) +2;
                        } else {
                            return (d.values[0].y + that.coordinates[that.coordinates.length-1].values[1].y)/2;
                        }
                    })
                    .attr("x2", function (d, i) {
                          if (d.values.length === 3) {
                            return (d.values[0].x + that.coordinates[that.coordinates.length-1].values[2].x)/2  ;
                       } else {
                            return ((d.values[2].x + d.values[3].x)/2 )  ;
                       }
                    })
                    .attr("y2", function (d, i) {
                         if(d.values.length === 4) {
                            return (((d.values[0].y-d.values[1].y)/2)+d.values[1].y) +2;
                        } else {
                            return (d.values[0].y + that.coordinates[that.coordinates.length-1].values[1].y)/2;
                        }
                    })
                    .attr("stroke-width", that.ticks.strokeWidth)
                    .attr("stroke",that.ticks.color)
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("x2", function (d,i) {
                        if(Math.abs(d.values[0].y - d.values[1].y) > 15) {
                            if (d.values.length === 3) {
                                return (d.values[0].x + that.coordinates[that.coordinates.length-1].values[2].x)/2 + 20;
                            } else {
                                return ((d.values[2].x + d.values[3].x)/2 ) + 20;
                            }
                        } else {
                            if (d.values.length === 3) {
                                return (d.values[0].x + that.coordinates[that.coordinates.length-1].values[2].x)/2 ;
                            } else {
                                return ((d.values[2].x + d.values[3].x)/2 ) ;
                            }
                        }
                    });
                    // .attr("x2", function (d, i) {
                    //     if(( d.values[0].y - d.values[1].y) > 0) {
                    //         if (d.values.length === 3) {
                    //             return (d.values[0].x + that.coordinates[that.coordinates.length-1].values[2].x)/2 + 20;
                    //         } else {
                    //             return ((d.values[2].x + d.values[3].x)/2 ) + 20;
                    //         }
                    //     } else {
                    //         if (d.values.length === 3) {
                    //             return (d.values[0].x + that.coordinates[that.coordinates.length-1].values[2].x)/2  ;
                    //         } else {
                    //             return ((d.values[2].x + d.values[3].x)/2 ) ;
                    //         }
                    //     }
                    // });

                line.exit().remove();

                var ticks_label = that.group.selectAll(".ticks_label")
                        .data(that.coordinates);

                ticks_label.enter()
                    .append("text")
                    .attr("x",0)
                    .attr("y",0)
                    .attr("class","ticks_label");

                var x,y;
                var j = that.chartData.length;
                ticks_label.attr("transform",function (d) {
                    if (d.values.length === 3) {
                        x = ((d.values[0].x + that.coordinates[that.coordinates.length-1].values[2].x)/2) + 30;
                    } else {
                        x = ((d.values[2].x + d.values[3].x)/2 ) + 30;
                    }
                     if(d.values.length === 4) {
                            y= (((d.values[0].y-d.values[1].y)/2)+d.values[1].y) +2;
                        } else {
                            y =(d.values[0].y + that.coordinates[that.coordinates.length-1].values[1].y)/2;
                        }

                    return "translate(" + x + "," + (y + 5) + ")";
                });

                ticks_label
                .text("")
                .transition()
                .delay(that.transitions.duration())

                ticks_label.text(function (d,i) {
                    if(i===0) {
                        return that.chartData[i].name;
                    }
                    else {
                        n--;
                        return that.chartData[n].name;                    }
                })
                .text(function (d,i) {
                    if(i===0) {
                        if (this.getBBox().height < (d.values[1].y - d.values[0].y)) {
                            return that.chartData[i].name;

                        } else {
                            return "";
                        }
                    }
                    else {
                        if (this.getBBox().height < (d.values[0].y - d.values[1].y)) {
                             j--;
                            return that.chartData[j].name;
                        }
                        else {
                            return "";
                        }
                    }
                })
                .style("fill",that.ticks.color)
                .style("font-size",that.ticks.size)
                .style("font-family", that.ticks.family)
                .attr("text-anchor","start");

                ticks_label.exit().remove();

                // }
                return this;
            },
            clubData: function () {

            	if (PykCharts.boolean(that.clubData.enable)) {
            		that.displayData = [];
                    that.maximum_weight = _.map(that.data,function(num){ return num.weight; });
                    that.maximum_weight.sort(function(a,b){ return b-a; });
                    that.checkDuplicate = [];
                    var others_Slice = {"name":that.clubData.text,"color":that.clubData.color,"tooltip":that.clubData.tooltipText,"highlight":false};
                    var index;
                    var i;
                    that.getIndexByName = function(name){
                        for(i=0;i<that.data.length;i++)
                        {
                            if(that.data[i].name == name)
                                return i;
                        }
                    };

                    var reject = function (index) {
                        var result = _.reject(that.maximum_weight,function(num)
                            {
                                return num==that.data[index].weight;
                            });
                        return result;
                    } ;
                    if(that.clubData.alwaysIncludeDataPoints.length!==0) {
                        for (i=0;i<that.clubData.alwaysIncludeDataPoints.length;i++)
                        {
                            index = that.getIndexByName(that.clubData.alwaysIncludeDataPoints[i]);
                            that.displayData.push(that.data[index]);

                            that.maximum_weight = reject (index);

                        }
                    }

                    that.getIndexByWeight = function (weight) {
                        for(var i=0;i<that.data.length;i++)
                        {
                            if(that.data[i].weight == weight) {
                                if((_.contains(that.checkDuplicate, i))===false) {
                                   that.checkDuplicate.push(i);
                                    return i;
                                }
                                else {
                                    continue;
                                }
                            }
                        }
                    };

                    var count = that.clubData.maximumNodes-that.displayData.length;

                    if(count>0)
                    {   that.displayData.push(others_Slice);
                        for (i=0;i<count-1;i++) {
                                index = that.getIndexByWeight(that.maximum_weight[i]);
                            that.displayData.push(that.data[index]);
                        }
                    }
                    var sumOthers = d3.sum(that.maximum_weight,function (d,i) {
                            if(i>=count)
                                return d;
                        });

                    others_Slice.weight = sumOthers;
                }
                else {
                    that.displayData = that.data;
                }
                that.displayData.sort(function (a,b) { return a.weight-b.weight; })
                return that.displayData;
            }
        }
    	return optional;
    };
};
PykCharts.oneD.treemap = function (options){
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function (){
        that = new PykCharts.oneD.processInputs(that, options);
        optional = options.optional;
        // that.enableText = optional && PykCharts.boolean(optional.enableText) ? optional.enableText : false;
        that.selector = options.selector;

        if(that.mode === "default") {
           that.k.loading();
        }

        d3.json(options.data, function (e,data) {
            that.data = Array.groupBy(data);
            $(options.selector+" #chart-loader").remove();
            that.render();
        });

    };

    this.refresh = function (){
        d3.json(options.data, function (e,data) {
            that.data = data;
            that.optionalFeatures()
                .clubData()
                .createChart()
                .label();
        });
    };

    this.render = function (){

        that.fillChart = new PykCharts.oneD.fillChart(that);
        that.mouseEvent1 = new PykCharts.oneD.mouseEvent(options);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.border = new PykCharts.Configuration.border(that);
        if(that.mode === "default") {
            that.k.title();
            that.k.subtitle();
        }

        that.k.tooltip();
        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        if(that.mode === "infographics"){
            that.new_data1 = that.data;
        }

        if(that.mode === "default") {
            var treemap = that.optionalFeatures()
                .clubData()
        }
        that.optionalFeatures().svgContainer()
            .createChart()
            .label();
        if(that.mode === "default") {
            that.k.liveData(that)
                .credits()
                .dataSource();
        }
    };

    this.optionalFeatures = function (){
        var optional = {
            svgContainer: function () {
                $(options.selector).css("background-color",that.bg);

                that.svg = d3.select(that.selector).append("svg:svg")
                    .attr("width",that.width)
                    .attr("height",that.height)
                    .attr("id","svgcontainer")
                    .attr("class","svgcontainer");

                that.group = that.svg.append("g")
                    .attr("id","treemap");
                return this;
            },
            createChart: function () {
                that.treemap = d3.layout.treemap()
                    .sort(function (a,b) { return a.weight - b.weight; })
                    .size([that.width,that.height])
                    .value(function (d) { return d.weight; })
                    .sticky(false);
                var total = d3.sum(that.new_data1.children, function (d){
                        return d.weight;
                    }), l, cell;

                that.node = that.treemap.nodes(that.new_data1);
                l = that.new_data1.children.length;
                that.max = that.new_data1.children[l-1].weight;
                that.map1 = that.new_data1.children.map(function (d) { return d.weight; });
                that.map1 = jQuery.unique(that.map1);
                that.treemap_data = that.group.selectAll(".cell")
                                    .data(that.node);
                cell = that.treemap_data.enter()
                    .append("svg:g")
                    .attr("class","cell")
                    .append("svg:rect")
                    .attr("class","treemap-rect");

                that.treemap_data.attr("class","cell")
                    .select("rect")
                    .attr("class","treemap-rect")
                    .attr("id",function (d,i) { return i; })
                    .attr("x",function (d) { return d.x; })
                    .attr("y", function (d) { return d.y; })
                    .attr("width", function (d) { return d.dx-1; })
                    .attr("height", 0)
                    .attr("fill",function (d) {
                        return d.children ? "white" : that.fillChart.chartColor(d);
                    })
                    .on('mouseover',function (d) {
                        if(!d.children) {
                            d.tooltip = d.tooltip || "<table class='PykCharts'><tr><th colspan='2' class='tooltip-heading'>"+d.name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.weight)+"<td class='tooltip-right-content'>(&nbsp;"+((d.weight*100)/total).toFixed(2)+"%&nbsp;)</tr></table>";
                            that.mouseEvent1.highlight(options.selector +" "+".treemap-rect", this);
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.toolTextShow(d.tooltip);
                        }
                    })
                    .on('mouseout',function (d) {
                        var o = d.weight/that.max;
                        that.mouseEvent.tooltipHide(d);
                        that.mouseEvent1.highlightHide(options.selector +" "+".treemap-rect");
                    })
                    .on('mousemove', function (d) {
                        if(!d.children) {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("height", function (d) { return d.dy-1; });

                that.treemap_data.exit()
                    .remove();
                return this;
            },
            label: function () {
                if(PykCharts.boolean(that.enableLabel)) {
                    that.treemap_text = that.group.selectAll(".name")
                        .data(that.node);
                    that.treemap_text1 = that.group.selectAll(".weight")
                        .data(that.node);
                    that.treemap_text.enter()
                        .append("svg:text")
                        .attr("class","name");

                    that.treemap_text1.enter()
                        .append("svg:text")
                        .attr("class","weight");

                    that.treemap_text.attr("class","name")
                        .attr("x", function (d) { return d.x + d.dx / 2; })
                        .attr("y", function (d) { return d.y + d.dy / 2; });

                    that.treemap_text1.attr("class","weight")
                        .attr("x", function (d) { return d.x + d.dx / 2; })
                        .attr("y", function (d) { return d.y + d.dy / 2 + 15; });

                    that.treemap_text.attr("text-anchor","middle")
                        .style("font-weight", that.label.weight)
                        .style("font-size", that.label.size)
                        .attr("fill", that.label.color)
                        .style("font-family", that.label.family)
                        .text("")
                        .transition()
                        .delay(that.transitions.duration())

                    that.treemap_text.text(function (d) { return d.children ? " " :  d.name; })
                        .attr("pointer-events","none")
                        .text(function (d) {

                            if(this.getBBox().width<d.dx && this.getBBox().height<d.dy-15) {
                                return d.children ? " " :  d.name;
                            }
                            else {
                                return "";
                            }
                        });

                    that.treemap_text1.attr("text-anchor","middle")
                        .style("font-weight", that.label.weight)
                        .style("font-size", that.label.size)
                        .attr("fill", that.label.color)
                        .style("font-family", that.label.family)
                        .text("")
                        .attr("pointer-events","none")
                        .transition()
                        .delay(that.transitions.duration())
                    that.treemap_text1.text(function (d) { return d.children ? " " :  that.k.appendUnits(d.weight); })
                        .text(function (d) {
                            if(this.getBBox().width < d.dx && this.getBBox().height < d.dy-15) {
                                return d.children ? " " :  that.k.appendUnits(d.weight);
                            }
                            else {
                                return "";
                            }
                        });

                    that.treemap_text.exit()
                        .remove();
                    that.treemap_text1.exit()
                        .remove();
                }
                return this;
            },
            clubData : function () {
                if(PykCharts.boolean(that.clubData.enable)){
                    var clubdata_content = [],weight = 0,k=0;
                    if(that.data.length <= that.clubData.maximumNodes) {
                        that.new_data1 = { "children" : that.data };
                        return this;
                    }
                    if(that.clubData.alwaysIncludeDataPoints.length!== 0){
                        var l = that.clubData.alwaysIncludeDataPoints.length;
                        for(i=0; i < l; i++){
                            clubdata_content[i] = that.clubData.alwaysIncludeDataPoints[i];
                        }
                    }
                    that.new_data = [];
                    for(i=0;i<clubdata_content.length;i++){
                        for(j=0;j<that.data.length;j++){
                            if(clubdata_content[i].toUpperCase() === that.data[j].name.toUpperCase()){
                                that.new_data.push(that.data[j]);
                            }
                        }
                    }
                    that.data.sort(function (a,b) { return b.weight - a.weight; });
                    while(that.new_data.length<that.clubData.maximumNodes-1){
                        for(i=0;i<clubdata_content.length;i++){
                            if(that.data[k].name.toUpperCase() === clubdata_content[i].toUpperCase()){
                                k++;
                            }
                        }
                        that.new_data.push(that.data[k]);
                        k++;
                    }
                    for(j=k; j < that.data.length; j++){
                        for(i=0; i<that.new_data.length && j<that.data.length; i++){
                            if(that.data[j].name.toUpperCase() === that.new_data[i].name.toUpperCase()){
                                weight +=0;
                                j++;
                                i = -1;
                            }
                        }
                        if(j < that.data.length){
                            weight += that.data[j].weight;
                        }
                    }
                    var sortfunc = function (a,b) { return b.weight - a.weight; };
                    while(that.new_data.length > that.clubData.maximumNodes){
                        that.new_data.sort(sortfunc);
                        var a=that.new_data.pop();
                    }
                    var other_span = { "name":that.clubData.text, "weight": weight, "color": that.clubData.color, "tooltip": that.clubData.tooltip };

                    if(that.new_data.length < that.clubData.maximumNodes){
                        that.new_data.push(other_span);
                    }
                    that.new_data1 = {"children" : that.new_data};
                }
                else {
                    that.new_data1 = {"children" : that.data};
                }
                return this;
            },
        };
        return optional;
    };
};
PykCharts.maps = {};

PykCharts.maps.mouseEvent = function (options) {
    var highlight_selected = {
        highlight: function (selectedclass, that) {
            var t = d3.select(that);
            d3.selectAll(selectedclass)
                .attr("opacity",.5)
            t.attr("opacity",1);
            return this;
        },
        highlightHide : function (selectedclass) {
            d3.selectAll(selectedclass)
                .attr("opacity",1);
            return this;
        }
    }
    return highlight_selected;
}

PykCharts.maps.processInputs = function (chartObject, options) {

    var theme = new PykCharts.Configuration.Theme({})
        , stylesheet = theme.stylesheet
        , functionality = theme.functionality
        , mapsTheme = theme.mapsTheme
        , optional = options.optional;

    chartObject.selector = options.selector ? options.selector : stylesheet.selector;
    chartObject.width = options.chart && _.isNumber(parseInt(options.chart.width,10)) ? options.chart.width : stylesheet.chart.width;
    chartObject.height = options.chart && _.isNumber(parseInt(options.chart.height,10)) ? options.chart.height : stylesheet.chart.height;
    chartObject.mapCode = options.mapCode ? options.mapCode : mapsTheme.mapCode;
    chartObject.defaultColor = optional && optional.colors && optional.colors.defaultColor ? optional.colors.defaultColor : stylesheet.colors.defaultColor;
    chartObject.colorType = optional && optional.colors && optional.colors.type ? optional.colors.type : stylesheet.colors.type;
    chartObject.totalColors = optional && optional.colors && _.isNumber(parseInt(optional.colors.total,10)) ? parseInt(optional.colors.total,10) : stylesheet.colors.total;
    chartObject.colorPalette = optional && optional.colors && optional.colors.palette ? optional.colors.palette : stylesheet.colors.palette;
    chartObject.bg = optional && optional.colors && optional.colors.backgroundColor ? optional.colors.backgroundColor : stylesheet.colors.backgroundColor;
    if (optional && optional.tooltip)  {
        chartObject.tooltip = optional.tooltip;
        chartObject.tooltip.enable = optional.tooltip.enable ? optional.tooltip.enable : stylesheet.tooltip.enable;
        chartObject.enableTooltip = chartObject.tooltip.enable;
        chartObject.tooltip.mode = optional.tooltip.mode ? optional.tooltip.mode : stylesheet.tooltip.mode;
        chartObject.tooltip.positionTop = optional.tooltip.positionTop ? optional.tooltip.positionTop : stylesheet.tooltip.positionTop;
        chartObject.tooltip.positionLeft = optional.tooltip.positionLeft ? optional.tooltip.positionLeft : stylesheet.tooltip.positionLeft;
        chartObject.tooltipTopCorrection = d3.select(chartObject.selector).style("top");
        chartObject.tooltipLeftCorrection = d3.select(chartObject.selector).style("left");
    } else {
        chartObject.tooltip = stylesheet.tooltip;
    }
    if (optional && optional.axis) {
        chartObject.axis = optional.axis;
        chartObject.axis.onHoverHighlightenable = optional.axis.onHoverHighlightenable ? optional.axis.onHoverHighlightenable : mapsTheme.axis.onHoverHighlightenable;
        chartObject.axis.x = optional.axis.x;
        chartObject.axis.x.orient = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.orient ? optional.axis.x.orient : mapsTheme.axis.x.orient;
        chartObject.axis.x.axisColor = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.axisColor ? optional.axis.x.axisColor : mapsTheme.axis.x.axisColor;
        chartObject.axis.x.labelColor = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.labelColor ? optional.axis.x.labelColor : mapsTheme.axis.x.labelColor;
        chartObject.axis.x.no_of_ticks = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.no_of_ticks ? optional.axis.x.no_of_ticks : mapsTheme.axis.x.no_of_ticks;
        chartObject.axis.x.ticksPadding = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.ticksPadding ? optional.axis.x.ticksPadding : mapsTheme.axis.x.ticksPadding;
        chartObject.axis.x.tickSize = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.tickSize ? optional.axis.x.tickSize : mapsTheme.axis.x.tickSize;
        chartObject.axis.x.tickFormat = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.tickFormat ? optional.axis.x.tickFormat : mapsTheme.axis.x.tickFormat;
        chartObject.axis.x.tickValues = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.tickValues ? optional.axis.x.tickValues : mapsTheme.axis.x.tickValues;
        chartObject.axis.y = optional.axis.y;
        chartObject.axis.y.orient = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.orient ? optional.axis.y.orient : mapsTheme.axis.y.orient;
        chartObject.axis.y.axisColor = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.axisColor ? optional.axis.y.axisColor : mapsTheme.axis.y.axisColor;
        chartObject.axis.y.labelColor = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.labelColor ? optional.axis.y.labelColor : mapsTheme.axis.y.labelColor;
        chartObject.axis.y.no_of_ticks = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.no_of_ticks ? optional.axis.y.no_of_ticks : mapsTheme.axis.y.no_of_ticks;
        chartObject.axis.y.ticksPadding = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.ticksPadding ? optional.axis.y.ticksPadding : mapsTheme.axis.y.ticksPadding;
        chartObject.axis.y.tickSize = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.tickSize ? optional.axis.y.tickSize : mapsTheme.axis.y.tickSize;
        chartObject.axis.y.tickFormat = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.tickFormat ? optional.axis.y.tickFormat : mapsTheme.axis.y.tickFormat;
    } else {
        chartObject.axis = mapsTheme.axis;
    }
    if (optional && optional.label) {
        chartObject.label = optional.label;
        chartObject.label.size = optional.label.size ? optional.label.size : stylesheet.label.size;
        chartObject.label.color = optional.label.color ? optional.label.color : stylesheet.label.color;
        chartObject.label.weight = optional.label.weight ? optional.label.weight : stylesheet.label.weight;
        chartObject.label.family = optional.label.family ? optional.label.family : stylesheet.label.family;
    } else {
        chartObject.label = stylesheet.label;
    }
    if(optional && optional.legends) {
        chartObject.legends = optional.legends;
        chartObject.legends.strokeWidth = optional.legends.strokeWidth ? optional.legends.strokeWidth : stylesheet.legends.strokeWidth;
        chartObject.legends.size = optional.legends.size ? optional.legends.size : stylesheet.legends.size;
        chartObject.legends.color = optional.legends.color ? optional.legends.color : stylesheet.legends.color;
        chartObject.legends.family = optional.legends.family ? optional.legends.family : stylesheet.legends.family;
    } else {
        chartObject.legends = stylesheet.legends;
    }
    if(optional && optional.border) {
        chartObject.border = optional.border;
        chartObject.border.color = optional.border.color ? optional.border.color : stylesheet.border.color;
        chartObject.border.thickness = optional.border.thickness ? optional.border.thickness : stylesheet.border.thickness;
    } else {
        chartObject.legends = stylesheet.legends;
    }
    chartObject.enableClick = optional && optional.enableClick ? optional.enableClick : stylesheet.enableClick;
    chartObject.onhover = optional && optional.onhover ? optional.onhover : stylesheet.onhover;
    chartObject.defaultZoomLevel = optional && optional.defaultZoomLevel ? optional.defaultZoomLevel : 80;
    chartObject.loading = optional && optional.loading && optional.loading.animationGifUrl ? optional.loading.animationGifUrl: stylesheet.loading.animationGifUrl;
    chartObject.highlightArea = optional && optional.highlightArea ? optional.highlightArea : stylesheet.highlightArea;
    if (optional && optional.title) {
        chartObject.title = optional.title;
        chartObject.title.size = optional.title.size ? optional.title.size : stylesheet.title.size;
        chartObject.title.color = optional.title.color ? optional.title.color : stylesheet.title.color;
        chartObject.title.weight = optional.title.weight ? optional.title.weight : stylesheet.title.weight;
        chartObject.title.family = optional.title.family ? optional.title.family : stylesheet.title.family;
    } else {
        chartObject.title = stylesheet.title;
    }
    if (optional && optional.subtitle) {
        chartObject.subtitle = optional.subtitle;
        chartObject.subtitle.size = optional.subtitle.size ? optional.subtitle.size : stylesheet.subtitle.size;
        chartObject.subtitle.color = optional.subtitle.color ? optional.subtitle.color : stylesheet.subtitle.color;
        chartObject.subtitle.weight = optional.subtitle.weight ? optional.subtitle.weight : stylesheet.subtitle.weight;
        chartObject.subtitle.family = optional.subtitle.family ? optional.subtitle.family : stylesheet.subtitle.family;
    } else {
        chartObject.subtitle = stylesheet.subtitle;
    }
    chartObject.realTimeCharts = optional && optional.realTimeCharts ? optional.realTimeCharts : functionality.realTimeCharts;
    chartObject.transition = optional && optional.transition ? optional.transition : functionality.transition;
    chartObject.creditMySite = optional && optional.creditMySite ? optional.creditMySite : stylesheet.creditMySite;
    chartObject.dataSource = optional && optional.dataSource ? optional.dataSource : "no";

    chartObject.k = new PykCharts.Configuration(chartObject);
    return chartObject;
};

PykCharts.maps.oneLayer = function (options) {
    var that = this;

    this.execute = function () {
        that = PykCharts.maps.processInputs(that, options);
        //$(that.selector).css("height",that.height);
        that.data = options.data;

        that.k
            .totalColors(that.totalColors)
            .colorType(that.colorType)
            .loading(that.loading)
            .tooltip(that.tooltip)

        d3.json("../data/maps/" + that.mapCode + ".json", function (data) {
            that.map_data = data;

            d3.json("../data/maps/colorPalette.json", function (data) {
                that.colorPalette_data = data;
                $(that.selector).html("");
                that.render();
                that.simulateLiveData(that.data);
            });
        });

        that.max_size = d3.max(that.data, function (sample) { return parseInt(sample.size, 10); });
        that.min_size = d3.min(that.data, function (sample) { return parseInt(sample.size, 10); });
        that.difference = that.max_size - that.min_size;
    };

    this.optionalFeatures = function () {
        var config = {
            enableLegend: function (el) {
                if (PykCharts.boolean(el)) {
                    that.renderLegend();
                };
                return this;
            },
            enableLabel: function (el) {
                if (PykCharts.boolean(el)) {
                    that.renderLabel();
                };
                return this;
            },
            enableClick: function (ec) {
                if (PykCharts.boolean(ec)) {
                    areas.on("click", that.clicked);
                    that.onhover = "color_saturation";
                };
                return this;
            }
        }
        return config;
    }

    this.render = function () {
        var that = this;

        var that = this,
            scale = 150,
            offset = [that.width / 2, that.height / 2],
            i;

        that.current_palette = _.where(that.colorPalette_data, {name:that.colorPalette, number:that.totalColors})[0];

        that.optionalFeatures()
            .enableLegend(that.legends)

        that.canvas = d3.select(that.selector)
            .append("svg")
            .attr("width", that.width)
            .attr("height", that.height)
            .attr("style", "border:1px solid lightgrey")
            .style("border-radius", "5px");

        var map_cont = that.canvas.append("g")
            .attr("id", "map_group");

        var defs = map_cont.append('defs');
        var filter = defs.append('filter')
            .attr('id', 'dropshadow');

        filter.append('feGaussianBlur')
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', 1)
            .attr('result', 'blur');

        filter.append('feOffset')
            .attr('in', 'blur')
            .attr('dx', 1)
            .attr('dy', 1)
            .attr('result', 'offsetBlur');

        var feMerge = filter.append('feMerge');

        feMerge.append('feMergeNode')
            .attr('in", "offsetBlur');

        feMerge.append('feMergeNode')
            .attr('in', 'SourceGraphic');

        that.group = map_cont.selectAll("g")
            .data(topojson.feature(that.map_data, that.map_data.objects).features)
            .enter()
            .append("g");

        var center = d3.geo.centroid(topojson.feature(that.map_data, that.map_data.objects)),
            projection = d3.geo.mercator().center(center).scale(scale).translate(offset);

        that.path = d3.geo.path().projection(projection);

        var bounds = that.path.bounds(topojson.feature(that.map_data, that.map_data.objects)),
            hscale = scale * (that.width) / (bounds[1][0] - bounds[0][0]),
            vscale = scale * (that.height) / (bounds[1][1] - bounds[0][1]),
            scale = (hscale < vscale) ? hscale : vscale,
            offset = [that.width - (bounds[0][0] + bounds[1][0]) / 2, that.height - (bounds[0][1] + bounds[1][1]) / 2];

        projection = d3.geo.mercator().center(center)
                        .scale((that.defaultZoomLevel / 100) * scale).translate(offset);
        that.path = that.path.projection(projection);
        var ttp = d3.select("#pyk-tooltip");
        var areas = that.group.append("path")
            .attr("d", that.path)
            .attr("class", "area")
            .attr("state_name", function (d) {
                return d.properties.NAME_1;
            })
            //.attr("prev-fill",that.renderPreColor)
            .attr("fill", that.renderColor)
            .attr("opacity", that.renderOpacity)
            .attr("stroke", that.boder_color)
            .attr("stroke-width", that.boder_thickness)
            .on("mouseover", function (d) {
                console.log((_.where(that.data, {iso2: d.properties.iso_a2})[0]).tooltip)
                if (PykCharts.boolean(that.tooltip)) {
                    ttp.style("visibility", "visible");
                    ttp.html((_.where(that.data, {iso2: d.properties.iso_a2})[0]).tooltip);
                }
                that.bodColor(d);
            })
            .on("mousemove", function () {
                if (PykCharts.boolean(that.tooltip)) {
                    if (that.tooltip.mode === "moving") {
                        ttp.style("top", function () {

                                return (d3.event.clientY + 10 ) + "px";
                            })
                            .style("left", function () {

                                return (d3.event.clientX + 10 ) + "px";

                            });
                    } else if (that.tooltip.mode === "fixed") {
                        ttp.style("top", (that.tooltip.positionTop) + "px")
                            .style("left", (that.tooltip.positionLeft) + "px");
                    }
                }
            })
            .on("mouseout", function (d) {
                if (PykCharts.boolean(that.tooltip)) {
                    ttp.style("visibility", "hidden");
                }
                that.bodUncolor(d);
            });

        this.optionalFeatures()
            .enableLabel(that.label)
            .enableClick(that.enable_click);

        that.k.dataSource(that.dataSource)
            .credits(that.creditMySite);
    };

    this.renderColor = function (d, i) {
        var col_shade,
            obj;
            obj = _.where(that.data, {iso2: d.properties.iso_a2});
        if (_.where(that.data, {iso2: d.properties.iso_a2}).length > 0) {
            if (that.colorType === "colors") {
                if (obj.length > 0 && obj[0].color !== "") {
                    return obj[0].color;
                }
                return that.defaultColor;
            }
            if (that.colorType === "saturation") {

                if ((that.highlightArea === "yes") && obj[0].highlight == "true") {
                    return obj[0].highlight_color;
                } else {
                    if (that.colorPalette !== "") {
                        col_shade = _.where(that.data, {iso2: d.properties.iso_a2})[0].size;
                        for (i = 0; i < that.current_palette.colors.length; i++) {
                            if (col_shade >= that.min_size + i * (that.difference / that.current_palette.colors.length) && col_shade <= that.min_size + (i + 1) * (that.difference / that.current_palette.colors.length)) {
                                return that.current_palette.colors[i];
                            }
                        }

                    }
                    return that.defaultColor;
                }
            }
            return that.defaultColor;
        }
        return that.defaultColor;
    };

    this.renderOpacity = function (d) {

        if (that.colorPalette === "" && that.colorType === "saturation") {
            that.oneninth = +(d3.format(".2f")(that.difference / 10));
            that.opacity = (that.min_size + (_.where(that.data, {iso2: d.properties.iso_a2})[0]).size + that.oneninth) / that.difference;
            return that.opacity;
        }
        return 1;
    };

    this.renderLegend = function () {
        var that = this,
            k,
            onetenth;
        if (that.colorType === "saturation") {
            that.legs = d3.select(that.selector)
                .append("svg")
                .attr("id", "legend-container")
                .attr("width", that.width)
                .attr("height", 50);
            if (that.colorPalette === "") {
                for (k = 1; k <= 9; k++) {
                    onetenth = d3.format(".1f")(that.max_size / 9);
                    that.leg = d3.round(onetenth * k);
                    that.legs.append("rect")
                        .attr("x", k * (that.width / 11))
                        .attr("y", 20)
                        .attr("width", (that.width / 11))
                        .attr("height", 5)
                        .attr("fill", that.defaultColor)
                        .attr("opacity", k / 9);

                    that.legs.append("text")
                        .attr("x", (k + 1) * (that.width / 11) - 5)
                        .attr("y", 34)
                        .style("font-size", 10)
                        .style("font", "Arial")
                        .text("< " + that.leg);
                }
            } else {
                for (k = 1; k <= that.current_palette.number; k++) {
                    that.leg = d3.round(that.min_size + k * (that.difference / that.current_palette.number));
                    that.legs.append("rect")
                        .attr("x", k * that.width / (that.current_palette.number + 2))
                        .attr("y", 20)
                        .attr("width", that.width / (that.current_palette.number + 2))
                        .attr("height", 5)
                        .attr("fill", that.current_palette.colors[k - 1]);

                    that.legs.append("text")
                        .attr("x", (k + 1) * that.width / (that.current_palette.number + 2) - 5)
                        .attr("y", 34)
                        .style("font-size", 10)
                        .style("font", "Arial")
                        .text("< " + that.leg);
                }
            }
        } else {
            $("#legend-container").remove();
        }
    };

    this.renderLabel = function () {
        that.group.append("text")
            .attr("x", function (d) { return that.path.centroid(d)[0]; })
            .attr("y", function (d) { return that.path.centroid(d)[1]; })
            .attr("text-anchor", "middle")
            .attr("font-size", "10")
            .attr("pointer-events", "none")
            .text(function (d) { return d.properties.NAME_1; });
    };

    this.bodColor = function (d) {

        if(that.onhover !== "none") {
            if (that.onhover === "highlight_border") {
                d3.select("path[state_name='" + d.properties.NAME_1 + "']")
                    .attr("stroke", that.border.color)
                    .attr("stroke-width", that.border.thickness + 0.5);
            } else if (that.onhover === "shadow") {
                d3.select("path[state_name='" + d.properties.NAME_1 + "']")
                    .attr('filter', 'url(#dropshadow)')
                    .attr("opacity", function () {
                        if (that.colorPalette === "" && that.colorType === "saturation") {
                            that.oneninth_dim = +(d3.format(".2f")(that.difference / 10));
                            that.opacity_dim = (that.min_size + (_.where(that.data, {iso2: d.properties.iso_a2})[0]).size + that.oneninth_dim) / that.difference;
                            return that.opacity_dim/2;
                        }
                        return 0.5;
                    });
            } else if (that.onhover === "color_saturation") {
                d3.select("path[state_name='" + d.properties.NAME_1 + "']")
                    .attr("opacity", function () {
                        if (that.colorPalette === "" && that.colorType === "saturation") {
                            that.oneninth_dim = +(d3.format(".2f")(that.difference / 10));
                            that.opacity_dim = (that.min_size + (_.where(that.data, {iso2: d.properties.iso_a2})[0]).size + that.oneninth_dim) / that.difference;
                            return that.opacity_dim/2;
                        }
                        return 0.5;
                    });
            }
        } else {
            that.bodUncolor(d);
        }
    };

    this.bodUncolor = function (d) {
        d3.select("path[state_name='" + d.properties.NAME_1 + "']")
            .attr("stroke", that.border.color)
            .attr("stroke-width", that.border.thickness)
            .attr('filter', null)
            .attr("opacity", function () {
                if (that.colorPalette === "" && that.colorType === "saturation") {
                    that.oneninth_high = +(d3.format(".2f")(that.difference / 10));
                    that.opacity_high = (that.min_size + (_.where(that.data, {iso2: d.properties.iso_a2})[0]).size + that.oneninth_high) / that.difference;
                    return that.opacity_high;
                }
                return 1;
            });
    };

    this.clicked = function (d) {
        var obj = {};
        obj.container = d3.event.target.ownerSVGElement.parentNode.id;
        obj.area = d.properties;
        obj.data = _.where(that.data, {iso2: d.properties.iso_a2})[0];
        try {
            customFunction(obj);
        } catch (ignore) {
            /*console.log(e);*/
        }
    };

    this.simulateLiveData = function(data) {
        var bat = $('#live-data').val();
        batSplit = bat.split("\n");
        var ball = [];
        that.live_json = [];
        for (var i = 0; i < batSplit.length -1 ; i++) {
            ball[i] = batSplit[i].split(",");
        };
        for (var i = 1; i < batSplit.length -1 ; i++) {
            var tep = {}
            for (var j = 0; j < ball[i].length; j++) {
                tep[ball[0][j]] = ball[i][j];
            };
            that.live_json.push(tep);
        };
        that.data = that.live_json;
        d3.selectAll("path")
            .attr("fill", that.renderColor)
            .attr("opacity", that.renderOpacity);
    }
};

/*function customFunction (d) {
console.log(d);
}*/

(function () {
    var count = 0;

    function importFiles (url) {
        var include = document.createElement('script');
        include.type = 'text/javascript';
        include.async = true;
        include.onload = include.onreadystatechange = function () {
            count++;
            if (count===3) {
                window.PykChartsInit();
            };
        }
        include.src = url;
        var s = document.getElementsByTagName('link')[0];
        s.parentNode.insertBefore(include, s);
    }
    importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/underscore-min.js');
    importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/d3.min.js');
    importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/jquery-1.11.1.min.js');
})();
