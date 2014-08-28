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
	        if(PykCharts.boolean(options.creditMySite.mySiteName) || PykCharts.boolean(options.creditMySite.mySiteUrl)) {
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
                d.style("float","left")
                    .style("width","auto");
            }
            return this;
        },
	    tooltip : function (d,selection,i) {
	    	if(PykCharts.boolean(options.enableTooltip) && options.mode === "default") {
	        	if(selection !== undefined){
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
            } else if (PykCharts.boolean(options.enableTooltip) && options.mode === "infographics") {
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
            _domainBandwidth: function (domain_array, count, callback) {
                addFactor = 0;
                if (callback) {
                    // addFactor = callback();
                }
                padding = (domain_array[1] - domain_array[0]) * 0.1;
                if (count === 0) {
                    domain_array[0] -= (padding + addFactor);
                }else if(count === 1) {
                    domain_array[1] += (padding + addFactor);
                }else if (count === 2) {
                    domain_array[0] -= (padding + addFactor);
                    domain_array[1] += (padding + addFactor);
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
        crossHairPosition: function(data,new_data,xScale,yScale,dataLineGroup,lineMargin,type,tooltipMode){
            if((PykCharts.boolean(options.enableCrossHair) || PykCharts.boolean(options.enableTooltip) || PykCharts.boolean(options.onHoverHighlightenable))  && options.mode === "default") {
                var offsetLeft = $(options.selector + " #"+dataLineGroup[0].attr("id")).offset().left;
                var offsetTop = $(options.selector + " #"+dataLineGroup[0].attr("id")).offset().top;
                var radius_focus_circle = parseFloat($(options.selector+" #focus-circle").attr("r"));
                var number_of_lines = dataLineGroup.length;
                var left = options.margin.left;
                var right = options.margin.right;
                var top = options.margin.top;
                var bottom = options.margin.bottom;
                var w = options.width;
                var h = options.height;
                var x = d3.event.pageX - offsetLeft;
                var y = d3.event.pageY - offsetTop;
                var x_range = xScale.range();
                var y_range = yScale.range();
                var j,tooltpText,active_x_tick,active_y_tick = [],left_diff,right_diff,
                    pos_line_cursor_x,pos_line_cursor_y,right_tick,left_tick,
                    range_length = x_range.length;

                for(j = 0;j < range_length;j++) {
                    if((j+1) >= range_length) {
                        return false;
                    }
                    else {
                        if(right_tick === x_range[j] && left_tick === x_range[j+1]) {
                            return false;
                        }
                        else if(x >= x_range[j] && x <= x_range[j+1]) {
                            left_tick = x_range[j], right_tick = x_range[j+1];
                            left_diff = (left_tick - x), right_diff = (x - right_tick);

                            if(left_diff >= right_diff) {
                                active_x_tick = data[j].x;
                                active_y_tick.push(data[j].y);
                                tooltipText = data[j].tooltip;
                                pos_line_cursor_x = (xScale(active_x_tick) + lineMargin + left);
                                pos_line_cursor_y = (yScale(data[j].y) + top );
                            }
                            else {
                                active_x_tick = data[j+1].x;
                                active_y_tick.push(data[j+1].y);
                                tooltipText = data[j+1].tooltip; // Line Chart ONLY!
                                pos_line_cursor_x = (xScale(active_x_tick) + lineMargin + left);
                                pos_line_cursor_y = (yScale(data[j+1].y) + top);
                            }

                            if(type === "multilineChart") {
                                that.tooltip.classed({"pyk-line-tooltip":false,"pyk-multiline-tooltip":true,"pyk-tooltip-table":true});
                                var len_data = new_data[0].data.length,tt_row=""; // Assumption -- number of Data points in different groups will always be equal
                                active_y_tick = [];
                                for(var a=0;a < number_of_lines;a++) {
                                    for(var b=0;b < len_data;b++) {
                                        if(new_data[a].data[b].x === active_x_tick) {
                                            active_y_tick.push(new_data[a].data[b].y);
                                            tt_row += "<tr><td><div style='padding:2px;width:5px;height:5px;background-color:"+new_data[a].color+"'></div></td><td>"+new_data[a].name+"</td><td><b>"+new_data[a].data[b].tooltip+"</b></td></tr>";
                                        }
                                    }
                                }
                                pos_line_cursor_x += 6;
                                tooltipText = "<table><thead><th colspan='3'>"+active_x_tick+"</th></thead><tbody>"+tt_row+"</tbody></table>";
                                this.tooltipPosition(tooltipText,pos_line_cursor_x,y,60,100);
                            }
                            else if(type === "lineChart" || type === "areaChart") {
                                if((options.tooltip.mode).toLowerCase() === "fixed") {
                                    this.tooltipPosition(tooltipText,0,pos_line_cursor_y,-14,-15);
                                } else if((options.tooltip.mode).toLowerCase() === "moving"){
                                    this.tooltipPosition(tooltipText,pos_line_cursor_x,pos_line_cursor_y,5,-45);
                                }
                            }
                            this.toolTextShow(tooltipText);
                            (options.enableCrossHair) ? this.crossHairShow(pos_line_cursor_x,top,pos_line_cursor_x,(h - bottom),pos_line_cursor_x,pos_line_cursor_y,type,active_y_tick.length) : null;
                            this.axisHighlightShow(active_x_tick,options.selector+" .x.axis");
                            this.axisHighlightShow(active_y_tick,options.selector+" .y.axis");
                        }
                    }
                }
            }
        },
        crossHairShow : function (x1,y1,x2,y2,cx,cy,type,no_bullets) {
            if(PykCharts.boolean(options.enableCrossHair) && options.mode === "default") {
                if(x1 !== undefined) {
                    if(type === "lineChart" || type === "areaChart") {
                        that.cross_hair_v.style("display","block");
                        that.cross_hair_v.select(options.selector + " #cross-hair-v")
                            .attr("x1",x1)
                            .attr("y1",y1)
                            .attr("x2",x2)
                            .attr("y2",y2);
                        that.cross_hair_h.style("display","block");
                        that.cross_hair_h.select(options.selector + " #cross-hair-h")
                            .attr("x1",options.margin.left)
                            .attr("y1",cy)
                            .attr("x2",(options.width - options.margin.right))
                            .attr("y2",cy);
                        that.focus_circle.style("display","block")
                            .attr("transform", "translate(" + cx + "," + cy + ")");

                    }
                    else if(type === "multilineChart") {
                        // Horizontal Cursor Removed & Multiple focus circles --- Pending!!!
                        that.cross_hair_v.style("display","block");
                        that.cross_hair_v.select(options.selector + " #cross-hair-v")
                            .attr("x1",(x1 - 5))
                            .attr("y1",y1)
                            .attr("x2",(x2 - 5))
                            .attr("y2",y2);
                        // for(var a=0;a < no_bullets;a++) {
                            
                        // }
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
        axisHighlightShow : function (active_tick,axisHighlight,a) {
            var curr_tick,prev_tick,abc,selection,axis_data_length;
            if(PykCharts.boolean(options.axis.onHoverHighlightenable) && options.mode === "default"){
                if(axisHighlight === options.selector + " .y.axis"){
                    selection = axisHighlight+" .tick text";
                    abc = options.axis.y.labelColor;
                    axis_data_length = d3.selectAll(selection)[0].length;
                    
                    d3.selectAll(selection)
                        .style("fill","#bbb")
                        .style("font-size","12px")
                        .style("font-weight","normal");
                    for(var b=0;b < axis_data_length;b++) {
                        for(var a=0;a < active_tick.length;a++) {
                            if(d3.selectAll(selection)[0][b].innerHTML == active_tick[a]) {
                                d3.select(d3.selectAll(selection)[0][b])
                                    .style("fill",abc)
                                    .style("font-size","13px")
                                    .style("font-weight","bold");
                            }
                        }
                    }
                } 
                else {
                    if(axisHighlight === options.selector + " .x.axis") {
                        selection = axisHighlight+" .tick text";
                        abc = options.axis.x.labelColor;
                    } else if(axisHighlight === options.selector + " .axis-text" && a === "column") {
                        selection = axisHighlight;
                        abc = options.axis.x.labelColor;
                    } else if(axisHighlight === options.selector + " .axis-text" && a === "bar") {
                        selection = axisHighlight;
                        abc = options.axis.y.labelColor;
                    }
                    if(prev_tick !== undefined) {
                        d3.select(d3.selectAll(selection)[0][prev_tick])
                            .style("fill",abc)
                            .style("font-weight","normal");
                    }

                    for(curr_tick = 0;d3.selectAll(selection)[0][curr_tick].innerHTML !== active_tick;curr_tick++){}
                    prev_tick = curr_tick;
                    
                    d3.selectAll(selection)
                        .style("fill","#bbb")
                        .style("font-size","12px")
                        .style("font-weight","normal");
                    d3.select(d3.selectAll(selection)[0][curr_tick])
                        .style("fill",abc)
                        .style("font-size","13px")
                        .style("font-weight","bold");
                }
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
                    .outerTickSize(options.axis.x.outer_tick_size)
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
                    .outerTickSize(options.axis.y.outer_tick_size)
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
        "overflowTicks" : "no",
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
            "enableTotal": "yes", //shows both the text when yes
            "enableCurrent": "yes", //shows only the actual number when yes
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
                "no_of_ticks": 5,
                "tickSize": 5,
                "tickFormat": "",
                "ticksPadding": 6,
                "tickValues": [],
                "outer_tick_size": 0
            },
            "y": {
                "enable": "yes",
                "position":"left",
                "orient": "left",
                "axisColor": "#1D1D1D",
                "labelColor": "#1D1D1D",
                "no_of_ticks": 5,
                "tickSize": 5,
                "tickFormat": "",
                "ticksPadding": 6,
                "outer_tick_size": 0
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
        "tooltip" : {
            "enable" : "yes",
            "mode" : "fixed"
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
        "timeline": {
            "duration": 1000,
            "margin": {"top": 5, "right": 25, "bottom": 25, "left": 45}
        },
        "legends": {
            "enable":"yes"
        },
        "label": {
            "enable": "no"
        },
        "enableClick": "yes",
        "onhover": "shadow",
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
                "tickValues": [],
                "outer_tick_size": 0
            }
        }
    };
    return that;
}
