var PykCharts = {};

Array.prototype.groupBy = function () {
    var gd = []
    , i
    , group = _.groupBy(this, function (d) {
        return d.name;
    });
    for(i in group) {
        var highlight = _.where(group[i], {highlight: true}).length;
        if (highlight>0) {
            gd.push({
                name: i,
                weight: d3.sum(group[i], function (d) { return d.weight; }),
                highlight: true
            })
        } else {
            gd.push({
                name: i,
                weight: d3.sum(group[i], function (d) { return d.weight; })
            })
        }
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
        emptyDiv : function () {
            d3.select(options.selector).append("div")
                .style("clear","both");

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
	                    .style("text-align","left")
	                    .html("<span style='pointer-events:none;font-size:" +
                        options.title.size+
                        ";color:" +
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
                        .style("text-align","left")
                        .html("</span><br><span style='pointer-events:none;font-size:" +
                        options.subtitle.size+";color:" +
                        options.subtitle.color + ";font-family:" +
                        options.subtitle.family + "'>"+
                        options.subtitle.text + "</span>");
            }
            return this;
        },
	    credits : function () {
            console.log("credist");
	        if(PykCharts.boolean(options.creditMySite.mySiteName) || PykCharts.boolean(options.creditMySite.mySiteUrl)) {
                console.log("havdahdagd");
                var credit = options.creditMySite;
                var enable = true;

                if(credit.mySiteName === "") {
                    credit.mySiteName = credit.mySiteUrl;
                }
                if(credit.mySiteUrl === "") {
                    enable = false;
                }
                d3.select(options.selector).append("table")
                    .style("background", options.bg)
                    .attr("width",options.width+"px")
                    .append("tr")
                    .attr("class","PykCharts-credits")
                    .append("td")
                    .style("text-align","left")
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
                d3.select(options.selector+" table tr")
                    .style("background", options.bg)
                    .append("td")
                    .style("text-align","right")
                    .html("<span style='pointer-events:none;'>Source: </span><a href='" + data_src.url + "' target='_blank' onclick='return " + enable +"'>"+ data_src.text +"</a></tr>");
            }
	        return this;
	    },
        makeMainDiv : function (selection,i) {
            var d = d3.select(selection).append("div")
                .attr("id","tooltip-svg-container-"+i)
                .style("width",options.width);
            if(PykCharts.boolean(options.multiple_containers)){
                d.style("float","left");
                // .style("height","auto");
            }
            return this;
        },
	    tooltip : function (d,selection,i) {
	    	if(PykCharts.boolean(options.enableTooltip) && options.mode === "default") {
	        	if(selection !== undefined){
                    console.log(selection);
	        		PykCharts.Configuration.tooltipp = d3.select(selection).append("div")
			        	.attr("id", "pyk-tooltip")
			        	.attr("class","pyk-line-tooltip");
	        	} else {
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
                }    
            } else if (PykCharts.boolean(options.tooltip.enable)) {
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
                }
            return this;
        },
        crossHair : function (svg) {
            if(PykCharts.boolean(options.enableCrossHair) && options.mode === "default") {
                /*$(options.selector + " " + "#cross-hair-v").remove();
                $(options.selector + " " + "#focus-circle").remove();*/
                PykCharts.Configuration.cross_hair_v = svg.append("g")
                    .attr("class","line-cursor")
                    .style("display","none");
                PykCharts.Configuration.cross_hair_v.append("line")
                    .attr("id","cross-hair-v");
                
                PykCharts.Configuration.cross_hair_h = svg.append("g")
                    .attr("class","line-cursor")
                    .style("display","none");
                PykCharts.Configuration.cross_hair_h.append("line")
                    .attr("id","cross-hair-h");

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
                $(options.selector + " #chart-loader").css({"visibility":"visible","padding-left":(options.width)/2 +"px","padding-top":(options.height)/2 + "px"});
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
                gsvg.selectAll(options.selector + " g.y.grid-line")
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
                gsvg.selectAll(options.selector + " g.x.grid-line")
                    .style("stroke",function () { return options.grid.color; })
                    .call(xgrid);
            }
            return this;
        },
        xAxis: function (svg, gsvg, xScale) {

            var width = options.width,
                height = options.height;

            if(PykCharts.boolean(options.axis.x.enable)){
                d3.selectAll(options.selector + " .x.axis").attr("fill",function () { return options.axis.x.labelColor;});
                if(options.axis.x.position === "bottom") {
                    gsvg.attr("transform", "translate(0," + (options.height - options.margin.top - options.margin.bottom) + ")");
                }
                var xaxis = PykCharts.Configuration.makeXAxis(options,xScale);

                if(options.axis.x.tickValues.length != 0) {
                    xaxis.tickValues(options.axis.x.tickValues);
                }

                gsvg.style("stroke",function () { return options.axis.x.axisColor; })
                    .call(xaxis);
                gsvg.selectAll(options.selector + " g.x.axis text").attr("pointer-events","none");
            }
            return this;
        },
        yAxis: function (svg, gsvg, yScale) {
            var width = options.width,
                height = options.height;

            if(PykCharts.boolean(options.axis.y.enable)){
                if(options.axis.y.position === "right") {
                    gsvg.attr("transform", "translate(" + (options.width - options.margin.left - options.margin.right) + ",0)");
                }
                d3.selectAll(options.selector + " .y.axis").attr("fill",function () { return options.axis.y.labelColor; });
                var yaxis = PykCharts.Configuration.makeYAxis(options,yScale);

                gsvg.style("stroke",function () { return options.axis.y.axisColor; })
                    .call(yaxis);
                gsvg.selectAll(options.selector + " g.y.axis text").attr("pointer-events","none");
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
    that.cross_hair_h = configuration.cross_hair_h;
    that.focus_circle = configuration.focus_circle;
    var status;
    var action = {
        tooltipPosition : function (d,xPos,yPos,xDiff,yDiff) {
            if(PykCharts.boolean(options.enableTooltip) && options.mode === "default") {
            	if(xPos !== undefined){
                    var width_tooltip = parseFloat($(options.selector+" #"+that.tooltip.attr("id")).css("width"));                    
                    that.tooltip
            			.style("visibility", "visible")
                        .style("top", (yPos + yDiff) + "px")
                        .style("left", (xPos + options.margin.left + xDiff - width_tooltip) + "px");
                }
                else {
                    that.tooltip
                        .style("visibility", "visible")
                        .style("top", (d3.event.pageY - 20) + "px")
                        .style("left", (d3.event.pageX + 30) + "px");
                }
                return that.tooltip;
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
        crossHairPosition: function(data,new_data,xScale,dataLineGroup,lineMargin,type){
            if((PykCharts.boolean(options.enableCrossHair) || PykCharts.boolean(options.enableTooltip) || PykCharts.boolean(options.onHoverHighlightenable))  && options.mode === "default") {
                var offsetLeft = $(options.selector + " #"+dataLineGroup[0].attr("id")).offset().left;
                var offsetRight = $(options.selector + " #"+dataLineGroup[0].attr("id")).offset().right;
                var number_of_lines = dataLineGroup.length;
                var left = options.margin.left;
                var right = options.margin.right;
                var top = options.margin.top;
                var bottom = options.margin.bottom;
                var w = options.width;
                var h = options.height;
                var x = d3.event.pageX - offsetLeft;
                var pathEl = dataLineGroup[0].node();
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
                activeTick = data[j].x;                

                if(type === "lineChart" || type === "areaChart") { tooltipText = data[j].tooltip; }
                else if(type === "multiline") {
                    that.tooltip.classed({"pyk-line-tooltip":false,"pyk-multiline-tooltip":true});
                    var len_data = new_data[0].data.length,tt_row=""; // Assumption -- number of Data points in different groups will always be equal
                    for(var i=0;i < number_of_lines;i++) {
                        for(var j=0;j < len_data;j++) {
                            if(new_data[i].data[j].x === activeTick) {
                                tt_row += "<tr><td>"+new_data[i].name+"</td><td><b>"+new_data[i].data[j].tooltip+"</b></td></tr>";
                            }
                        }
                    }
                    tooltipText = "<table>"+tt_row+"</table>";
                }

                cx = x + lineMargin + left - 1;
                cy = pos.y + top;
                pathWidth = dataLineGroup[0].node().getBBox().width;

    			if((cx >= (lineMargin + left)) && (cx <= (pathWidth + lineMargin + left)) && (cy >= top) && (cy <= (h - bottom))) {
                	if(type === "lineChart" || type === "areaChart") {
                        this.tooltipPosition(tooltipText,0,cy,-14,-15);
                    }
                    else if (type === "multiline" || type === "stackedAreaChart") {
                        this.tooltipPosition(tooltipText,cx,event.offsetY,-2,20);
                    }
                    this.toolTextShow(tooltipText);
                    (options.enableCrossHair) ? this.crossHairShow(cx,top,cx,(h - bottom),cx,cy,type) : null;
                    this.axisHighlightShow(activeTick,options.selector+" .x.axis");
                }
                else {
                  	this.tooltipHide();
                  	(options.enableCrossHair) ? this.crossHairHide(type) : null;
                  	this.axisHighlightHide(options.selector+" .x.axis");
                }
            }
        },
        crossHairShow : function (x1,y1,x2,y2,cx,cy,type) {
            if(PykCharts.boolean(options.enableCrossHair) && options.mode === "default") {
                if(x1 !== undefined) {
                    that.cross_hair_v.style("display","block");
                    that.cross_hair_v.select(options.selector + " #cross-hair-v")
                        .attr("x1",x1)
                        .attr("y1",y1)
                        .attr("x2",x2)
                        .attr("y2",y2);

                    if(type === "lineChart" || type === "areaChart") {
                        that.cross_hair_h.style("display","block");
                        that.cross_hair_h.select(options.selector + " #cross-hair-h")
                            .attr("x1",options.margin.left)
                            .attr("y1",cy)
                            .attr("x2",(options.width - options.margin.right))
                            .attr("y2",cy);
                        that.focus_circle.style("display","block")
                            .attr("transform", "translate(" + cx + "," + cy + ")");
                    }
                    else if(type === "multiline") {
                        // Horizontal Cursor Removed & Multiple focus circles --- Pending!!!
                    }
                }
            }
            return this;
        },
        crossHairHide : function (type) {
            if(PykCharts.boolean(options.enableCrossHair) && options.mode === "default") {
                that.cross_hair_v.style("display","none");
                if(type === "lineChart" || type === "areaChart") {
                    that.cross_hair_h.style("display","none");
                    that.focus_circle.style("display","none");
                }
            }
            return this;
        },
        axisHighlightShow : function (activeTick,axisHighlight,a) {
            var j_curr,j_prev,abc,selection;
            if(PykCharts.boolean(options.axis.onHoverHighlightenable)&& options.mode === "default"){
                if(axisHighlight === options.selector + " .y.axis"){
                    selection = axisHighlight+" .tick text";
                    abc = options.axis.y.labelColor;
                } else if(axisHighlight === options.selector + " .x.axis") {
                    selection = axisHighlight+" .tick text";
                    abc = options.axis.x.labelColor;
                } else if(axisHighlight === options.selector + " .axis-text" && a === "column") {
                    selection = axisHighlight;
                    abc = options.axis.x.labelColor;
                } else if(axisHighlight === options.selector + " .axis-text" && a === "bar") {
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
                if(axisHighlight === options.selector + " .y.axis"){
                    selection = axisHighlight+" .tick text";
                    abc = options.axis.y.labelColor;
                } else if(axisHighlight === options.selector + " .x.axis") {
                    selection = axisHighlight+" .tick text";
                    abc = options.axis.x.labelColor;
                } else if(axisHighlight === options.selector + " .axis-text" && a === "column") {
                    selection = axisHighlight;
                    abc = options.axis.x.labelColor;
                } else if(axisHighlight === options.selector + " .axis-text" && a === "bar") {
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
            } else if(PykCharts.boolean(options.saturationEnable)) {
                return options.saturationColor;
            } else if(config.optional && config.optional.colors && config.optional.colors.chartColor) {
                return options.chartColor;
            } else if(config.optional && config.optional.colors && d.color){
                return d.color;
            } else {
                return options.chartColor;
            } return options.chartColor;
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
            "weight": "bold",
            "family": "'Helvetica Neue',Helvetica,Arial,sans-serif"
        },
        "subtitle":{
            "size": "12px",
            "color": "black",
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
            "saturationColor" : "steelblue"
        },
        "borderBetweenChartElements":{
            "width": 1,
            "color": "white",
            "style": "solid" // or "dotted / dashed"
        },
        "legendsText":{ //partially done for oneD, pending for twoD
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
                "position":"bottom",
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
                "position":"left",
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
            "enable": "yes",
            "display" : "horizontal"
        },
        "scatterplot" : {
            "radius" : 9
        },
        "line": {
            "color_from_data": "yes"
        }
    };

    that.treeCharts = {
        "zoom" : {
            "enable" : "no"
        },
        "nodeRadius" : 4.5
    };

    that.mapsTheme = {
        // "mapCode": "india-topo",
        "map": {
            "width":1000,
            "height":1000
        },
        "colors" : {
            "defaultColor" : "#4682B4",
            "total" :3,
            "type" : "satuartion",
            "palette" : "Blue"
        },
        "border" :{
            "color": "white",
            "thickness" : 1
        },
        "tooltip" : {
            "enable": "yes",
            "mode":"moving",
            "positionTop":0,
            "positionLeft":0
        },
        "legends": {
            "enable":"yes"
        },
        "label": {
            "enable": "no"
        },
        "enableClick": "yes",
        "onhover": "no",
        "highlightArea":"no",
        "axis" : {
            "onHoverHighlightenable": "no",
            "x": {
                "enable": "yes",
                "orient" : "top",
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
