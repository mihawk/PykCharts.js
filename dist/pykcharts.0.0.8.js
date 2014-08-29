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
                    label = prefix + " " + text;
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
                    .attr("id","footer")
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
                if($(options.selector+" #footer").length) {
                    d3.select(options.selector+" table tr")
                        .style("background", options.bg)
                        .append("td")
                        .style("text-align","right")
                        .html("<span style='pointer-events:none;'>Source: </span><a href='" + data_src.url + "' target='_blank' onclick='return " + enable +"'>"+ data_src.text +"</a></tr>");
                }
                else {
                    d3.select(options.selector).append("table")
                        .attr("id","footer")
                        .style("background", options.bg)
                        .attr("width",options.width+"px")
                        .append("tr")
                        .attr("class","PykCharts-credits")
                        .append("td")
                        .style("text-align","right")
                        .html("<span style='pointer-events:none;'>Source: </span><a href='" + data_src.url + "' target='_blank' onclick='return " + enable +"'>"+ data_src.text +"</a></tr>");
                }
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
            } else if (PykCharts.boolean(options.tooltip)) {
                if (options.tooltip.mode === "fixed" && PykCharts.boolean(options.tooltip.enable)) {
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
            else {
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
                    .attr("class","cross-hair-v")
                    .attr("id","cross-hair-v");
                
                PykCharts.Configuration.cross_hair_h = svg.append("g")
                    .attr("class","line-cursor")
                    .style("display","none");
                PykCharts.Configuration.cross_hair_h.append("line")
                    .attr("class","cross-hair-h")
                    .attr("id","cross-hair-h");

                PykCharts.Configuration.focus_circle = svg.append("g")
                    .attr("class","focus")
                    .style("display","none");
                PykCharts.Configuration.focus_circle.append("circle")
                    .attr("id","focus-circle")
                    .attr("r",6);
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
            if(PykCharts.boolean(options.enableTooltip)) {
                // var tooltip = d3.selectAll(options.selector+" #pyk-tooltip");
                // console.log(tooltip,"**********");
            	if(xPos !== undefined){
                    var width_tooltip = parseFloat($(options.selector+" #"+that.tooltip.attr("id")).css("width"));
                    // d3.selectAll(options.selector+" #pyk-tooltip")
                    that.tooltip
            			.style("visibility", "visible")
                        .style("top", (yPos + yDiff) + "px")
                        .style("left", (xPos + options.margin.left + xDiff - width_tooltip) + "px");
                }
                else {
                    // d3.selectAll(options.selector+" #pyk-tooltip")
                    that.tooltip
                        .style("visibility", "visible")
                        .style("top", (d3.event.pageY - 20) + "px")
                        .style("left", (d3.event.pageX + 30) + "px");
                }
                return that.tooltip;
            }
        },
        toolTextShow : function (d) {
            if(PykCharts.boolean(options.enableTooltip)) {
            	// d3.selectAll(options.selector+" #pyk-tooltip").html(d);
                that.tooltip.html(d);
            }
            return this;
        },
        tooltipHide : function (d) {
            if(PykCharts.boolean(options.enableTooltip)) {
                // return d3.selectAll(options.selector+" #pyk-tooltip").style("visibility", "hidden");
                return that.tooltip.style("visibility", "hidden");
            }
        },
        crossHairPosition: function(data,new_data,xScale,yScale,dataLineGroup,lineMargin,type,tooltipMode,color_from_data,multiple_containers){
            if((PykCharts.boolean(options.enableCrossHair) || PykCharts.boolean(options.enableTooltip) || PykCharts.boolean(options.onHoverHighlightenable))  && options.mode === "default") {
                var offsetLeft = $(options.selector + " #"+dataLineGroup[0].attr("id")).offset().left;
                var offsetTop = $(options.selector + " #"+dataLineGroup[0].attr("id")).offset().top;
                var number_of_lines = new_data.length;
                var left = options.margin.left;
                var right = options.margin.right;
                var top = options.margin.top;
                var bottom = options.margin.bottom;
                var w = options.width;
                var h = options.height;
                var group_index = parseInt(d3.event.target.id.substr((d3.event.target.id.length-1),1));
                // console.log(d3.event.pageX,group_index);
                var x = d3.event.pageX - offsetLeft;
                var y = d3.event.pageY - offsetTop;
                var x_range = xScale.range();
                var y_range = yScale.range();
                var j,tooltpText,active_x_tick,active_y_tick = [],left_diff,right_diff,
                    pos_line_cursor_x,pos_line_cursor_y,right_tick,left_tick,
                    range_length = x_range.length,colspan;

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
                                // for(var a=0;a < number_of_lines;a++) {
                                //     if(new_data[a].)
                                // }
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
                                if(multiple_containers === "no") {
                                    d3.selectAll(options.selector+" #pyk-tooltip").classed({"pyk-line-tooltip":false,"pyk-multiline-tooltip":true,"pyk-tooltip-table":true});
                                    var len_data = new_data[0].data.length,tt_row=""; // Assumption -- number of Data points in different groups will always be equal
                                    active_y_tick = [];
                                    for(var a=0;a < number_of_lines;a++) {
                                        for(var b=0;b < len_data;b++) {
                                            if(new_data[a].data[b].x === active_x_tick) {
                                                active_y_tick.push(new_data[a].data[b].y);
                                                if(!PykCharts.boolean(color_from_data)) {
                                                    tt_row += "<tr><td>"+new_data[a].name+"</td><td><b>"+new_data[a].data[b].tooltip+"</b></td></tr>";
                                                    colspan = 2;
                                                }
                                                else if (PykCharts.boolean(color_from_data)) {
                                                    tt_row += "<tr><td><div style='padding:2px;width:5px;height:5px;background-color:"+new_data[a].color+"'></div></td><td>"+new_data[a].name+"</td><td><b>"+new_data[a].data[b].tooltip+"</b></td></tr>";
                                                    colspan = 3;
                                                }
                                            }
                                        }
                                    }
                                    pos_line_cursor_x += 6;
                                    tooltipText = "<table><thead><th colspan='"+colspan+"'>"+active_x_tick+"</th></thead><tbody>"+tt_row+"</tbody></table>";
                                    this.tooltipPosition(tooltipText,pos_line_cursor_x,y,60,-15);
                                }
                                else if(multiple_containers === "yes") {                                    
                                    // console.log(dataLineGroup[0].attr("id"),x);
                                    pos_line_cursor_x += 5;
                                    this.tooltipPosition(tooltipText,pos_line_cursor_x,pos_line_cursor_y,0,-45);
                                }
                            }
                            else if(type === "lineChart" || type === "areaChart") {
                                if((options.tooltip.mode).toLowerCase() === "fixed") {
                                    this.tooltipPosition(tooltipText,0,pos_line_cursor_y,-14,-15);
                                } else if((options.tooltip.mode).toLowerCase() === "moving"){
                                    this.tooltipPosition(tooltipText,pos_line_cursor_x,pos_line_cursor_y,5,-45);
                                }
                            }
                            this.toolTextShow(tooltipText);
                            (options.enableCrossHair) ? this.crossHairShow(pos_line_cursor_x,top,pos_line_cursor_x,(h - bottom),pos_line_cursor_x,pos_line_cursor_y,type,active_y_tick.length,multiple_containers) : null;
                            this.axisHighlightShow(active_x_tick,options.selector+" .x.axis");
                            this.axisHighlightShow(active_y_tick,options.selector+" .y.axis");
                        }
                    }
                }
            }
        },
        crossHairShow : function (x1,y1,x2,y2,cx,cy,type,no_bullets,multiple_containers) {
            if(PykCharts.boolean(options.enableCrossHair)) {
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
                        if(multiple_containers === "no") {
                            that.cross_hair_v.style("display","block");
                            that.cross_hair_v.select(options.selector + " #cross-hair-v")
                                .attr("x1",(x1 - 5))
                                .attr("y1",y1)
                                .attr("x2",(x2 - 5))
                                .attr("y2",y2);
                        }
                        else if(multiple_containers === "yes") {
                            d3.selectAll(options.selector+" .line-cursor").style("display","block");
                            d3.selectAll(options.selector+" .cross-hair-v")
                                .attr("x1",(x1 - 5))
                                .attr("y1",y1)
                                .attr("x2",(x2 - 5))
                                .attr("y2",y2);
                            d3.selectAll(options.selector + " .cross-hair-h")
                                .attr("x1",options.margin.left)
                                .attr("y1",cy)
                                .attr("x2",(options.width - options.margin.right))
                                .attr("y2",cy);
                            d3.selectAll(options.selector+" .focus").style("display","block")
                                .attr("transform", "translate(" + (cx - 5) + "," + cy + ")");
                        }
                    }
                }
            }
            return this;
        },
        crossHairHide : function (type) {
            if(PykCharts.boolean(options.enableCrossHair)/* && options.mode === "default"*/) {
                that.cross_hair_v.style("display","none");
                if(type === "lineChart" || type === "areaChart") {
                    that.cross_hair_h.style("display","none");
                    that.focus_circle.style("display","none");
                }
                else if(type === "multilineChart") {
                    d3.selectAll(options.selector+" .line-cursor").style("display","none");
                    d3.selectAll(options.selector+" .focus").style("display","none");
                }
            }
            return this;
        },
        axisHighlightShow : function (active_tick,axisHighlight,a) {
            var curr_tick,prev_tick,abc,selection,axis_data_length;
            if(PykCharts.boolean(options.axis.onHoverHighlightenable)/* && options.mode === "default"*/){
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
            if(PykCharts.boolean(options.axis.onHoverHighlightenable)/* && options.mode === "default"*/){
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
    var k = PykCharts.Configuration(options.axis.x);
    var xaxis = d3.svg.axis()
                    .scale(xScale)
                    .ticks(options.axis.x.no_of_ticks)
                    .tickSize(options.axis.x.tickSize)
                    .outerTickSize(options.axis.x.outer_tick_size)
                    .tickFormat(function (d,i) {
                        if(options.multiple_containers === "yes" && options.xAxisDataFormat === "string") {
                            return d.substr(0,2);
                        }
                        else {
                            return k.appendUnits(d);
                        }
                    })
                    .tickPadding(options.axis.x.ticksPadding)
                    .orient(options.axis.x.orient);
    return xaxis;
};

configuration.makeYAxis = function(options,yScale) {
    var that = this;
    var k = PykCharts.Configuration(options.axis.y);
    var yaxis = d3.svg.axis()
                    .scale(yScale)
                    .orient(options.axis.y.orient)
                    .ticks(options.axis.y.no_of_ticks)
                    .tickSize(options.axis.y.tickSize)
                    .outerTickSize(options.axis.y.outer_tick_size)
                    .tickPadding(options.axis.y.ticksPadding)
                    .tickFormat(function (d,i) {
                        return k.appendUnits(d);
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
            "margin":{"top": 20, "right": 20, "bottom": 20, "left": 20},
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
            "radius" : 40
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
    chartObject.width = optional && optional.chart && _.isNumber(optional.chart.width) ? optional.chart.width : stylesheet.chart.width;
    chartObject.height = optional && optional.chart &&_.isNumber(optional.chart.height) ? optional.chart.height : stylesheet.chart.height;

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
    chartObject.overflowTicks = optional && optional.overflowTicks ? optional.overflowTicks : stylesheet.overflowTicks;
    chartObject.bg = optional && optional.colors && optional.colors.backgroundColor ? optional.colors.backgroundColor : stylesheet.colors.backgroundColor;
    chartObject.chartColor = optional && optional.colors && optional.colors.chartColor ? optional.colors.chartColor : stylesheet.colors.chartColor;
    chartObject.highlightColor = optional && optional.colors && optional.colors.highlightColor ? optional.colors.highlightColor : stylesheet.colors.highlightColor;
    chartObject.fullscreen = optional && optional.buttons && optional.buttons.enableFullScreen ? optional.buttons.enableFullScreen : stylesheet.buttons.enableFullScreen;
    chartObject.loading = optional && optional.loading && optional.loading.animationGifUrl ? optional.loading.animationGifUrl: stylesheet.loading.animationGifUrl;
    chartObject.enableTooltip = optional && optional.enableTooltip ? optional.enableTooltip : stylesheet.enableTooltip;
    if (optional && optional.borderBetweenChartElements) {
        chartObject.borderBetweenChartElements = optional.borderBetweenChartElements;
        chartObject.borderBetweenChartElements.width = "width" in optional.borderBetweenChartElements ? optional.borderBetweenChartElements.width : stylesheet.borderBetweenChartElements.width;
        chartObject.borderBetweenChartElements.color = optional.borderBetweenChartElements.color ? optional.borderBetweenChartElements.color : stylesheet.borderBetweenChartElements.color;
        chartObject.borderBetweenChartElements.style = optional.borderBetweenChartElements.style ? optional.borderBetweenChartElements.style : stylesheet.borderBetweenChartElements.style;
    } else {
        chartObject.borderBetweenChartElements = stylesheet.borderBetweenChartElements;
    }
    if (optional && optional.label) {
        chartObject.label = optional.label;
        chartObject.label.size = "size" in optional.label ? optional.label.size : stylesheet.label.size;
        chartObject.label.color = optional.label.color ? optional.label.color : stylesheet.label.color;
        chartObject.label.weight = optional.label.weight ? optional.label.weight : stylesheet.label.weight;
        chartObject.label.family = optional.label.family ? optional.label.family : stylesheet.label.family;
    } else {
        chartObject.label = stylesheet.label;
    }
    if(optional && optional.ticks) {
        chartObject.ticks = optional.ticks;
        chartObject.ticks.strokeWidth = "strokeWidth" in optional.ticks ? optional.ticks.strokeWidth : stylesheet.ticks.strokeWidth;
        chartObject.ticks.size = "size" in optional.ticks ? optional.ticks.size : stylesheet.ticks.size;
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
            that.data = data.groupBy();
            $(options.selector+" #chart-loader").remove();
            that.clubData.enable = that.data.length>that.clubData.maximumNodes ? that.clubData.enable : "no";
            that.render();
        
        });
    };

    this.refresh = function () {

        d3.json (options.data, function (e,data) {
            that.data = data;
            that.optionalFeatures()
                .createBubble()
                .label();
        });
    };

    this.render = function () {
        that.fillChart = new PykCharts.oneD.fillChart(that);
        that.mouseEvent1 = new PykCharts.oneD.mouseEvent(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        if (that.mode ==="default") {
            that.k.title();
            that.k.subtitle();
            that.b = that.optionalFeatures().clubData();
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
            that.b = {"children" : that.data};
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

                that.bub_node = that.group.selectAll(".bubble-node")
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
                that.bub_node.exit().remove();

                return this;
            },
            label : function () {

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
                    that.bub_text.exit().remove;
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

        var optional = options.optional
        , functionality = theme.oneDimensionalCharts.funnel;
        that.rect_width = optional && optional.funnel && optional.funnel.rect_width && _.isNumber(optional.funnel.rect_width)  ? optional.funnel.rect_width : functionality.rect_width;
        that.rect_height = optional && optional.funnel && optional.funnel.rect_height && _.isNumber(optional.funnel.rect_height) ? optional.funnel.rect_height : functionality.rect_height;

        if(that.mode === "default") {
           that.k.loading();
        }

        d3.json(options.data, function (e,data) {
            that.data = data.groupBy();
            $(options.selector+" #chart-loader").remove();
            that.clubData.enable = that.data.length>that.clubData.maximumNodes ? that.clubData.enable : "no";
            that.render();
        });
        // that.clubData.enable = that.data.length>that.clubData.maximumNodes ? that.clubData.enable : "no";

    };


    //----------------------------------------------------------------------------------------
    //2. Render function to create the chart
    //----------------------------------------------------------------------------------------
    this.refresh = function () {
        d3.json (options.data, function (e,data) {
            that.data = data.groupBy();
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
                    .attr("width",that.width) //+100 removed
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
                return this;
            },
            ticks : function () {
                if(PykCharts.boolean(that.overflowTicks)) {
                    that.svg.style("overflow","visible");
                }   
                    var line = that.group.selectAll(".funnel-ticks")
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
                    that.newData.sort(function (a,b) { return b.weight - a.weight; });
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
            that.data = data.groupBy();
            $(options.selector+" #chart-loader").remove();
            that.clubData.enable = that.data.length>that.clubData.maximumNodes ? that.clubData.enable : "no";
            that.render();
        });
        // that.clubData.enable = that.data.length>that.clubData.maximumNodes ? that.clubData.enable : "no";
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
                    that.per_text = that.group.selectAll(".per-text")
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
                return this;
            },
            ticks : function () {
                if(PykCharts.boolean(that.overflowTicks)) {
                    that.svg.style("overflow","visible");
                }
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
        that.enableTotal = optional && optional.pictograph && optional.pictograph.enableTotal ? optional.pictograph.enableTotal : functionality.pictograph.enableTotal;
        that.enableCurrent = optional && optional.pictograph && optional.pictograph.enableCurrent ? optional.pictograph.enableCurrent : functionality.pictograph.enableCurrent;
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
        if(that.mode==="default") {
            that.k.title();
            that.k.subtitle();
        }

        var picto = that.optionalFeatures()
                .svgContainer()
                .createPictograph()
                .labelText()
                .enableLabel();
        if(that.mode==="default") {
            that.k.credits()
                .dataSource();
        }
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
                if (PykCharts.boolean(that.enableTotal)) {
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
                if (PykCharts.boolean(that.enableCurrent)) {
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

        that.radiusPercent = options.optional && options.optional.pie && _.isNumber(options.optional.pie.radiusPercent) ? options.optional.pie.radiusPercent : theme.oneDimensionalCharts.pie.radiusPercent;
        that.innerRadiusPercent = 0;
        if(that.mode === "default") {
           that.k.loading();
        }
        d3.json(options.data, function (e, data) {
            that.data = data.groupBy();
            $(options.selector+" #chart-loader").remove();
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"pie");
            that.clubData.enable = that.data.length > that.clubData.maximumNodes ? that.clubData.enable : "no";
            pieFunctions.render();

        });
        // that.clubData.enable = that.data.length>that.clubData.maximumNodes ? that.clubData.enable : "no";
    };
};

PykCharts.oneD.donut = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function() {

        that = new PykCharts.oneD.processInputs(that, options, "pie");

        that.radiusPercent = options.optional && options.optional.donut && _.isNumber(options.optional.donut.radiusPercent) ? options.optional.donut.radiusPercent : theme.oneDimensionalCharts.donut.radiusPercent;
        that.innerRadiusPercent = options.optional && options.optional.donut && _.isNumber(options.optional.donut.innerRadiusPercent) && options.optional.donut.innerRadiusPercent ? options.optional.donut.innerRadiusPercent : theme.oneDimensionalCharts.donut.innerRadiusPercent;

        d3.json(options.data, function (e, data) {
            that.data = data.groupBy();
            $(options.selector+" #chart-loader").remove();
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"donut");
            that.clubData.enable = that.data.length > that.clubData.maximumNodes ? that.clubData.enable : "no";
            pieFunctions.render();
        });
    };
};

PykCharts.oneD.election_pie = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function() {

        that = new PykCharts.oneD.processInputs(that, options, "pie");

        that.radiusPercent = options.optional && options.optional.pie && _.isNumber(options.optional.pie.radiusPercent) ? options.optional.pie.radiusPercent : theme.oneDimensionalCharts.pie.radiusPercent;
        that.innerRadiusPercent = 0;
        d3.json(options.data, function (e, data) {
            that.data = data.groupBy();
            $(options.selector+" #chart-loader").remove();
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"election pie");
            that.clubData.enable = that.data.length > that.clubData.maximumNodes ? that.clubData.enable : "no";
            pieFunctions.render();

        });
    };
};

PykCharts.oneD.election_donut = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function() {
        that = new PykCharts.oneD.processInputs(that, options, "pie");

        that.radiusPercent = options.optional && options.optional.donut && _.isNumber(options.optional.donut.radiusPercent) ? options.optional.donut.radiusPercent : theme.oneDimensionalCharts.donut.radiusPercent;
        that.innerRadiusPercent = options.optional && options.optional.donut && _.isNumber(options.optional.donut.innerRadiusPercent) && options.optional.donut.innerRadiusPercent ? options.optional.donut.innerRadiusPercent : theme.oneDimensionalCharts.donut.innerRadiusPercent;

        d3.json(options.data, function (e, data) {
            that.data = data.groupBy();
            $(options.selector+" #chart-loader").remove();
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"election donut");
            that.clubData.enable = that.data.length> that.clubData.maximumNodes ? that.clubData.enable : "no";
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
            that.data = data.groupBy();
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
            that.chartData = that.optionalFeatures().clubData();

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
            that.chartData = that.data;
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

                    cv_text.exit().remove();

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

                    
                    var sumOthers = d3.sum(that.maximum_weight,function (d,i) {
                            if(i>=count-1)
                                return d;
                        });

                    others_Slice.weight = sumOthers;
                    if(count>0)
                    {
                        that.displayData.push(others_Slice);
                        for (i=0;i<count-1;i++) {
                            index = that.getIndexByWeight(that.maximum_weight[i]);
                            that.displayData.push(that.data[index]);
                        }
                    }
                }
                else {
                    that.displayData = that.data;
                }
                return that.displayData;
            },
            ticks : function () {
                if(PykCharts.boolean(that.overflowTicks)) {
                    that.svgContainer.style("overflow","visible");
                }
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
			that.data = data.groupBy();
            $(options.selector+" #chart-loader").remove();
			that.clubData.enable = that.data.length>that.clubData.maximumNodes ? that.clubData.enable : "no";
            that.render();
		});
        // that.clubData.enable = that.data.length>that.clubData.maximumNodes ? that.clubData.enable : "no";
	};

    this.refresh = function () {
        d3.json (options.data, function (e,data) {
            that.data = data.groupBy();
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
            that.chartData = that.optionalFeatures().clubData();
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
            that.chartData = that.data;
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
                    .attr("width", that.width) //+200 removed
                    .attr("height",that.height)
                    .attr("id","svgcontainer")
                    .attr("class","svgcontainer");

                that.group = that.svg.append("g")
                    .attr("id","pyrgrp");

                return this;
            },
        	createChart : function () {

        		
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
                return this;
            },
            ticks : function () {
                // if(PykCharts.boolean(that.enableTicks)) {
                if(PykCharts.boolean(that.overflowTicks)) {
                    that.svg.style("overflow","visible");
                }
                var line = that.group.selectAll(".pyr-ticks")
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
                            if(i>=count-1)
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
            that.data = data.groupBy();
            $(options.selector+" #chart-loader").remove();
            that.clubData.enable = that.data.length>that.clubData.maximumNodes ? that.clubData.enable : "no";
            that.render();
        });
        // that.clubData.enable = that.data.length > that.clubData.maximumNodes ? that.clubData.enable : "no";
    };

    this.refresh = function (){
        d3.json(options.data, function (e,data) {
            that.data = data.groupBy();
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
            that.new_data1 = {"children" : that.data};
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

PykCharts.multiD = {};
var theme = new PykCharts.Configuration.Theme({});

PykCharts.multiD.configuration = function (options){
    var that = this;
    var fillColor = new PykCharts.Configuration.fillChart(options);
    var multiDConfig = {
        magnify: function(rect,gsvg,xScale){
            gsvg.on("mousemove", function() {
                var mouse = d3.mouse(this);
                xScale.focus(mouse[0]);
                rect
                .attr("x", function(d) { return xScale(d.x); })
                .attr("width", function(d) {return xScale.rangeBand(d.x);});                         
            });
        },
        opacity : function (d,weight,data) {
            if(!(PykCharts.boolean(options.size.enable))) {
                var z = d3.scale.linear()
                            .domain(d3.extent(data,function (d) {
                                return d.weight;
                            }))
                            .range([0.1,1]);
                
                return d ? z(d) : z(_.min(weight));
            }
            else {
                return 0.6;
            }
        },
        legendsPosition : function (chart) {
            if(status) {
                chart.optionalFeatures().legendsContainer().svgContainer();
            }else {
                chart.optionalFeatures().svgContainer();
            }
            return this;
        },
        legends: function (series,group1,data,svg) {
            if(status) {
                var j = 0,k = 0;
                j = series.length;
                k = series.length;                

                if(options.optional.legends.display === "vertical") {
                    svg.attr("height", (series.length * 30)+20)
                    text_parameter1 = "x";
                    text_parameter2 = "y";
                    rect_parameter1 = "width";
                    rect_parameter2 = "height";
                    rect_parameter3 = "x";
                    rect_parameter4 = "y";
                    rect_parameter1value = 13;
                    rect_parameter2value = 13;
                    text_parameter1value = function (d,i) { return options.optional.chart.width - 75; };
                    rect_parameter3value = function (d,i) { return options.optional.chart.width - 100; };
                    var rect_parameter4value = function (d,i) { return i * 24 + 12;};
                    var text_parameter2value = function (d,i) { return i * 24 + 26;};
                }
                if(options.optional.legends.display === "horizontal"){                    
                    svg.attr("height",70);
                    text_parameter1 = "x";
                    text_parameter2 = "y";
                    rect_parameter1 = "width";
                    rect_parameter2 = "height";
                    rect_parameter3 = "x";
                    rect_parameter4 = "y";
                    var text_parameter1value = function (d,i) { j--;return options.optional.chart.width - (j*100 + 75); };
                    text_parameter2value = 30;
                    rect_parameter1value = 13;
                    rect_parameter2value = 13;
                    var rect_parameter3value = function (d,i) { k--;return options.optional.chart.width - (k*100 + 100); };
                    rect_parameter4value = 18;
                }
                
                that.legends_text = group1.selectAll(".legends_text")
                    .data(series);
                that.legends_text.enter()
                    .append('text')
                    .attr("class","legends_text")
                    .attr("fill","#1D1D1D")
                    .attr("pointer-events","none")
                    .style("font-family", "'Helvetica Neue',Helvetica,Arial,sans-serif");

                that.legends_text.attr("class","legends_text")
                    .attr("fill","black")
                    .attr(text_parameter1, text_parameter1value)
                    .attr(text_parameter2, text_parameter2value)
                    .text(function (d) { return d; });

                that.legends_text.exit()
                    .remove();
                
                that.legends_rect = group1.selectAll(".legends_rect")
                    .data(series);
                
                that.legends_rect.enter()
                    .append("rect")
                    .attr("class","legends_rect");

                that.legends_rect.attr("class","legends_rect")
                    .attr('fill',function (d,i) { return fillColor(data[i]); })
                    .attr("fill-opacity", function (d,i) { return options.optional.saturation.enable === "yes" ? (i+1)/series.length : 1; })
                        .attr(rect_parameter1, rect_parameter1value)
                        .attr(rect_parameter2, rect_parameter2value)
                        .attr(rect_parameter3, rect_parameter3value)
                        .attr(rect_parameter4, rect_parameter4value);

                that.legends_rect.exit()
                    .remove();
            }
            return this;
        },
        legendsGroupStacked : function (legendsContainer,legendsGroup,names,color) {
            if(status) {
                var p = 0,a=[],k,jc,ic;
                for(i=0;i<names.length;i++) {
                    for(j=0;j<names[i].length;j++) {
                        a[p] = names[i][j];
                        p++;
                    }
                }
                jc = a.length;
                k = a.length;
                ic = -1;
                legendsContainer.attr("height",90);
                var abc = legendsGroup.selectAll(".legends_g")
                    .data(names)
                    .enter()
                    .append("g")
                    .attr("class","legends_g")
                    .attr("fill",function (d) {ic++;return color[ic];})
                abc.selectAll(".legends_rect")
                        .data(names[ic])
                        .enter()
                            .append("rect")
                            .attr("class","legends_rect")
                            .attr("x",function (d) { k--;return options.optional.chart.width - (k*80 + 75); })
                            .attr("y", 20)
                            .attr("height",13)
                            .attr("width",13)
                            .attr("fill-opacity",function (d,i) { return options.optional.saturation.enable === "yes" ? (names[i].length - i)/names[i].length : 1 ;});
                legendsGroup.selectAll(".legends_text")
                    .data(a)
                    .enter()
                        .append("text")
                        .attr("class","legends_text")
                        .attr("pointer-events","none")
                        .attr("x", function (d,i) {jc--;return options.optional.chart.width - (jc*80 + 55); })
                        .attr("y",32)
                        .attr("fill","#1D1D1D")
                        .attr("font-family","'Helvetica Neue',Helvetica,Arial,sans-serif")
                        .text(function (d) { return d; });
            }
            return this;
        },
        mapGroup : function (data) {
            var newarr = [];
            var unique = {};
            var k = 0;
            var checkGroup = true;
            var checkColor = true;
            
            data.forEach(function (item) {
                if(item.group) {
                    checkGroup = true;
                } else {
                    checkGroup = false;
                    if(!item.color) {
                        checkColor = false;
                        item.color = options.colorPalette[0];
                    }
                }
            });

            if(checkGroup) {
                data.forEach(function(item) {
                    if (!unique[item.group]) {
                        if(!item.color) {
                            item.color = options.colorPalette[k];
                            k++;
                        }
                        newarr.push(item);
                        unique[item.group] = item;
                    } 
                }); 
                
                var arr = [];
                var uniqueColor = {};
                k = 0;
                newarr.forEach(function(item) {
                    if (!uniqueColor[item.color]) {
                        arr.push(item);
                        uniqueColor[item.color] = item;
                    } else {
                        item.color = options.colorPalette[k];
                        k++;
                        arr.push(item);
                        uniqueColor[item.color] = item;
                    }
                }); 
                var arr_length = arr.length,
                data_length = data.length; 
                for(var i = 0;i < arr_length; i++) {
                    for(var j = 0;j<data_length;j++) {
                        if(data[j].group === arr[i].group) {
                            data[j].color = arr[i].color;
                        }
                    }
                }                
                return [arr,checkGroup];
            } else {
                return [data,checkGroup];
            }                
        }
        
    };
    return multiDConfig;
};

PykCharts.multiD.mouseEvent = function (options) {
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
};

PykCharts.multiD.bubbleSizeCalculation = function (options,data,rad_range) {
    var size = function (d) {
        if(d && PykCharts.boolean(options.size.enable)) {
            var z = d3.scale.linear()
                        .domain(d3.extent(data,function (d) {
                            return d.weight;
                        }))
                        .range(rad_range);
            return z(d);
        } else { 
            return options.bubbleRadius;
        }
    };
    return size;
};

PykCharts.multiD.processInputs = function (chartObject, options) {
    var theme = new PykCharts.Configuration.Theme({}),
        stylesheet = theme.stylesheet,
        //, functionality = theme.functionality,
        multiDimensionalCharts = theme.multiDimensionalCharts,
        optional = options.optional;

    chartObject.yAxisDataFormat = options.yAxisDataFormat ? options.yAxisDataFormat : multiDimensionalCharts.yAxisDataFormat
    chartObject.xAxisDataFormat = options.xAxisDataFormat ? options.xAxisDataFormat : multiDimensionalCharts.xAxisDataFormat;
    chartObject.selector = options.selector ? options.selector : "body";
    chartObject.width = optional && optional.chart && _.isNumber(optional.chart.width) ? optional.chart.width : stylesheet.chart.width;
    chartObject.height = optional && optional.chart &&_.isNumber(optional.chart.height) ? optional.chart.height : stylesheet.chart.height;
    chartObject.margin = optional && optional.chart && optional.chart.margin ? optional.chart.margin : stylesheet.chart.margin;
    chartObject.margin.left = optional && optional.chart && optional.chart.margin && _.isNumber(optional.chart.margin.left) ? optional.chart.margin.left : stylesheet.chart.margin.left;
    chartObject.margin.right = optional && optional.chart && optional.chart.margin && _.isNumber(optional.chart.margin.right) ? optional.chart.margin.right : stylesheet.chart.margin.right;
    chartObject.margin.top = optional && optional.chart && optional.chart.margin && _.isNumber(optional.chart.margin.top) ? optional.chart.margin.top : stylesheet.chart.margin.top;
    chartObject.margin.bottom = optional && optional.chart && optional.chart.margin && _.isNumber(optional.chart.margin.bottom) ? optional.chart.margin.bottom : stylesheet.chart.margin.bottom;
    chartObject.grid = optional && optional.chart && optional.chart.grid ? optional.chart.grid : stylesheet.chart.grid;
    chartObject.grid.xEnabled = optional && optional.chart && optional.chart.grid ? optional.chart.grid.xEnabled : stylesheet.chart.grid.xEnabled;
    chartObject.grid.yEnabled = optional && optional.chart && optional.chart.grid ? optional.chart.grid.yEnabled : stylesheet.chart.grid.yEnabled;
    chartObject.grid.color = optional && optional.chart && optional.chart.grid ? optional.chart.grid.color : stylesheet.chart.grid.color;
    chartObject.mode = options.mode ? options.mode : "default";
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
    if (optional && optional.axis) {
        chartObject.axis = optional.axis;
        chartObject.axis.x = optional.axis.x;
        chartObject.axis.onHoverHighlightenable = PykCharts.boolean(optional.axis.x.enable) && optional.axis.onHoverHighlightenable ? optional.axis.onHoverHighlightenable : multiDimensionalCharts.axis.onHoverHighlightenable;
        chartObject.axis.x.orient = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.orient ? optional.axis.x.orient : multiDimensionalCharts.axis.x.orient;
        chartObject.axis.x.axisColor = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.axisColor ? optional.axis.x.axisColor : multiDimensionalCharts.axis.x.axisColor;
        chartObject.axis.x.labelColor = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.labelColor ? optional.axis.x.labelColor : multiDimensionalCharts.axis.x.labelColor;
        chartObject.axis.x.no_of_ticks = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.no_of_ticks ? optional.axis.x.no_of_ticks : multiDimensionalCharts.axis.x.no_of_ticks;
        chartObject.axis.x.ticksPadding = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.ticksPadding ? optional.axis.x.ticksPadding : multiDimensionalCharts.axis.x.ticksPadding;
        chartObject.axis.x.tickSize = "tickSize" in optional.axis.x && PykCharts.boolean(optional.axis.x.enable) ? optional.axis.x.tickSize : multiDimensionalCharts.axis.x.tickSize;
        chartObject.axis.x.tickFormat = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.tickFormat ? optional.axis.x.tickFormat : multiDimensionalCharts.axis.x.tickFormat;
        chartObject.axis.x.tickValues = PykCharts.boolean(optional.axis.x.enable) && optional.axis.x.tickValues ? optional.axis.x.tickValues : multiDimensionalCharts.axis.x.tickValues;
        chartObject.axis.x.outer_tick_size = "outer_tick_size" in optional.axis.x && PykCharts.boolean(optional.axis.x.enable) ? optional.axis.x.outer_tick_size : multiDimensionalCharts.axis.x.outer_tick_size;
        chartObject.axis.y = optional.axis.y;
        chartObject.axis.y.orient = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.orient ? optional.axis.y.orient : multiDimensionalCharts.axis.y.orient;
        chartObject.axis.y.axisColor = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.axisColor ? optional.axis.y.axisColor : multiDimensionalCharts.axis.y.axisColor;
        chartObject.axis.y.labelColor = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.labelColor ? optional.axis.y.labelColor : multiDimensionalCharts.axis.y.labelColor;
        chartObject.axis.y.no_of_ticks = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.no_of_ticks ? optional.axis.y.no_of_ticks : multiDimensionalCharts.axis.y.no_of_ticks;
        chartObject.axis.y.ticksPadding = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.ticksPadding ? optional.axis.y.ticksPadding : multiDimensionalCharts.axis.y.ticksPadding;
        chartObject.axis.y.tickSize = "tickSize" in optional.axis.y && PykCharts.boolean(optional.axis.y.enable) ? optional.axis.y.tickSize : multiDimensionalCharts.axis.y.tickSize;
        chartObject.axis.y.tickFormat = PykCharts.boolean(optional.axis.y.enable) && optional.axis.y.tickFormat ? optional.axis.y.tickFormat : multiDimensionalCharts.axis.y.tickFormat;
        chartObject.axis.y.outer_tick_size = "outer_tick_size" in optional.axis.y && PykCharts.boolean(optional.axis.y.enable) ? optional.axis.y.outer_tick_size : multiDimensionalCharts.axis.y.outer_tick_size;
    } else {
        chartObject.axis = multiDimensionalCharts.axis;
    }

    if(optional && optional.legends) {
        chartObject.legends = optional.legends;
        chartObject.legends.enable = optional.legends.enable && optional.legends.enable ? optional.legends.enable : multiDimensionalCharts.legends.enable;
        chartObject.legends.display = optional.legends.display ? optional.legends.display : multiDimensionalCharts.legends.display;
    } else {
        chartObject.legends =  multiDimensionalCharts.legends;
    }
    chartObject.saturationEnable = optional && optional.saturation && optional.saturation.enable ? optional.saturation.enable : "no";
    chartObject.saturationColor = optional && optional.colors && optional.colors.saturationColor ? optional.colors.saturationColor : stylesheet.colors.saturationColor;
    chartObject.realTimeCharts = optional && optional.realTimeCharts ? optional.realTimeCharts : "no";
    chartObject.transition = optional && optional.transition ? optional.transition : "no";
    chartObject.creditMySite = optional && optional.creditMySite ? optional.creditMySite : stylesheet.creditMySite;
    chartObject.dataSource = optional && optional.dataSource ? optional.dataSource : stylesheet.dataSource;
    chartObject.bg = optional && optional.colors && optional.colors.backgroundColor ? optional.colors.backgroundColor : stylesheet.colors.backgroundColor;
    chartObject.chartColor = optional && optional.colors && optional.colors.chartColor ? optional.colors.chartColor : stylesheet.colors.chartColor;
    chartObject.highlightColor = optional && optional.colors && optional.colors.highlightColor ? optional.colors.highlightColor : stylesheet.colors.highlightColor;
    chartObject.fullscreen = optional && optional.buttons && optional.buttons.enableFullScreen ? optional.buttons.enableFullScreen : stylesheet.buttons.enableFullScreen;
    chartObject.loading = optional && optional.loading && optional.loading.animationGifUrl ? optional.loading.animationGifUrl: stylesheet.loading.animationGifUrl;
    chartObject.enableTooltip = optional && optional.enableTooltip ? optional.enableTooltip : stylesheet.enableTooltip;
    if (optional && optional.borderBetweenChartElements /*&& optional.borderBetweenChartElements.width!=0 && optional.borderBetweenChartElements.width!="0px"*/) {
        chartObject.borderBetweenChartElements = optional.borderBetweenChartElements;
        chartObject.borderBetweenChartElements.width = "width" in optional.borderBetweenChartElements ? optional.borderBetweenChartElements.width : stylesheet.borderBetweenChartElements.width;
        chartObject.borderBetweenChartElements.color = optional.borderBetweenChartElements.color ? optional.borderBetweenChartElements.color : stylesheet.borderBetweenChartElements.color;
        chartObject.borderBetweenChartElements.style = optional.borderBetweenChartElements.style ? optional.borderBetweenChartElements.style : stylesheet.borderBetweenChartElements.style;
        switch(chartObject.borderBetweenChartElements.style) {
            case "dotted" : chartObject.borderBetweenChartElements.style = "1,3";
                            break;
            case "dashed" : chartObject.borderBetweenChartElements.style = "5,5";
                           break;
            default : chartObject.borderBetweenChartElements.style = "0";
                      break;
        }
    } else {
        chartObject.borderBetweenChartElements = stylesheet.borderBetweenChartElements;
    }
    if(optional && optional.ticks) {
        chartObject.ticks = optional.ticks;
        chartObject.ticks.strokeWidth = "strokeWidth" in optional.ticks ? optional.ticks.strokeWidth : stylesheet.ticks.strokeWidth;
        chartObject.ticks.weight = optional.ticks.weight ? optional.ticks.weight : stylesheet.ticks.weight;
        chartObject.ticks.size = "size" in optional.ticks ? optional.ticks.size : stylesheet.ticks.size;
        chartObject.ticks.color = optional.ticks.color ? optional.ticks.color : stylesheet.ticks.color;
        chartObject.ticks.family = optional.ticks.family ? optional.ticks.family : stylesheet.ticks.family;
    } else {
        chartObject.ticks = stylesheet.ticks;
    }
    chartObject.zoom = optional && optional.zoom ? optional.zoom : multiDimensionalCharts.zoom;
    chartObject.zoom.enable = optional && optional.zoom && optional.zoom.enable ? optional.zoom.enable : multiDimensionalCharts.zoom.enable;

    if (optional && optional.label) {
        chartObject.label = optional.label;
        chartObject.label.size = "size" in optional.label ? optional.label.size : stylesheet.label.size;
        chartObject.label.color = optional.label.color ? optional.label.color : stylesheet.label.color;
        chartObject.label.weight = optional.label.weight ? optional.label.weight : stylesheet.label.weight;
        chartObject.label.weight = (chartObject.label.weight === "thick") ? "bold" : "normal";
        chartObject.label.family = optional.label.family ? optional.label.family : stylesheet.label.family;
    } else {
        chartObject.label = stylesheet.label;
    }
    if (optional && optional.legendsText) {
        chartObject.legendsText = optional.legendsText;
        chartObject.legendsText.size = optional.legendsText.size ? optional.legendsText.size : stylesheet.legendsText.size;
        chartObject.legendsText.color = optional.legendsText.color ? optional.legendsText.color : stylesheet.legendsText.color;
        chartObject.legendsText.weight = optional.legendsText.weight ? optional.legendsText.weight : stylesheet.legendsText.weight;
        chartObject.legendsText.weight = (chartObject.legendsText.weight === "thick") ? "bold" : "normal";
        chartObject.legendsText.family = optional.legendsText.family ? optional.legendsText.family : stylesheet.legendsText.family;
    } else {
        chartObject.legendsText = stylesheet.legendsText;
    }
    chartObject.units = optional && optional.units ? optional.units : false;
    chartObject.size = optional && optional.size ? optional.size : multiDimensionalCharts.size;
    chartObject.size.enable = optional && optional.size && optional.size.enable ? optional.size.enable : multiDimensionalCharts.size.enable;
    chartObject.colorPalette = ["#b2df8a", "#1f78b4", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928", "#a6cee3"]; 
    chartObject.k = new PykCharts.Configuration(chartObject);
    if (optional && optional.tooltip) {
        chartObject.tooltip = optional.tooltip;        
        chartObject.enableTooltip = optional.tooltip.enable ? optional.tooltip.enable : multiDimensionalCharts.tooltip.enable;
        chartObject.tooltip.mode = optional.tooltip.mode ? optional.tooltip.mode : multiDimensionalCharts.tooltip.mode;
    } else {
        chartObject.tooltip = multiDimensionalCharts.tooltip;
        chartObject.enableTooltip = multiDimensionalCharts.tooltip.enable;     
    }
    return chartObject;
};
PykCharts.multiD.lineChart = function (options){
	var that = this;
	var theme = new PykCharts.Configuration.Theme({});

	this.execute = function (){
		that = new PykCharts.multiD.processInputs(that, options, "line");
		
		if(that.mode === "default") {
			that.k.loading();
		}
		var multiDimensionalCharts = theme.multiDimensionalCharts,
			stylesheet = theme.stylesheet,
			optional = options.optional;
		that.enableCrossHair = optional && optional.enableCrossHair ? optional.enableCrossHair : multiDimensionalCharts.enableCrossHair;
		that.curvy_lines = optional && optional.curvy_lines ? optional.curvy_lines : multiDimensionalCharts.curvy_lines;
		that.multiple_containers = optional && optional.multiple_containers && optional.multiple_containers.enable ? optional.multiple_containers.enable : multiDimensionalCharts.multiple_containers.enable;
		that.interpolate = PykCharts.boolean(that.curvy_lines) ? "cardinal" : "linear";
	    that.color_from_data = optional && optional.line && optional.line.color_from_data ? optional.line.color_from_data : multiDimensionalCharts.line.color_from_data;
	    
	    d3.json(options.data, function (e, data) {
			that.data = data;
			that.data_length = data.length;
			that.dataTransform();
			$(that.selector+" #chart-loader").remove();
			that.render();
		});
	};

	this.dataTransform = function () {
		that.group_arr = [], that.color_arr = [], that.new_data = [], that.dataLineGroup = [],
		that.dataTextGroup = [], that.dataLineGroupBorder = [];
		for(j = 0;j < that.data_length;j++) {
			that.group_arr[j] = that.data[j].name;
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
					if (that.uniq_group_arr[k] === that.data[l].name) {
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
	};

	this.render = function () {
		if(that.mode === "default") {
			that.transitions = new PykCharts.Configuration.transition(options);
			
			that.k.title()
					.subtitle();
			if(PykCharts.boolean(that.multiple_containers)) {
				that.w = that.width/3;
                that.height = that.height/2;
                that.reducedWidth = that.w - that.margin.left - that.margin.right;
				that.reducedHeight = that.height - that.margin.top - that.margin.bottom;
				
				for(i=0;i<that.new_data_length;i++) {
					that.k.liveData(that)
							.makeMainDiv(that.selector,i)
							.tooltip(true,that.selector,i);

					that.new_data1 = that.new_data[i];
					that.optionalFeature()
							.chartType()
							.svgContainer(i);

					that.k.crossHair(that.svg,i);

					that.optionalFeature()
							.createLineChart(null,i)
							.axisContainer();

					that.k.xAxis(that.svg,that.gxaxis,that.xScale)
							.yAxis(that.svg,that.gyaxis,that.yScale);
					if((i+1)%4 === 0 && i !== 0) {
                        that.k.emptyDiv();
                    }
				}
				that.k.emptyDiv(); 
			} else {
				that.w = that.width;
				that.reducedWidth = that.w - that.margin.left - that.margin.right;
				that.reducedHeight = that.height - that.margin.top - that.margin.bottom;

				that.k.liveData(that)
						.makeMainDiv(that.selector,1)
						.tooltip(true,that.selector,1);

				that.optionalFeature()
						.chartType()
						.svgContainer(1);

				that.k.crossHair(that.svg,1);

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
					.makeMainDiv(that.selector,1);

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

	this.refresh = function () {
		d3.json(options.data, function (e,data) {
			that.data = data;
			that.data_length = data.length;
			that.dataTransform();

			that.optionalFeature().createLineChart("livedata");

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
							that.type = "multilineChart";
							break;
						}
					}
				}
				that.type = that.type || "lineChart";
				return this;
			},
			svgContainer: function (i){
				if(that.type === "multilineChart") {
					$(that.selector).attr("class","PykCharts-twoD PykCharts-line-chart PykCharts-multi-series2D");
				}
				else if(that.type === "lineChart") {
					$(that.selector).attr("class","PykCharts-twoD PykCharts-line-chart");
				}
				$(that.selector).css({"background-color":that.bg,"position":"relative"});

				that.svg = d3.select(that.selector+" #tooltip-svg-container-"+i)
					.append("svg:svg")
					.attr("id","svg-" + i)
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
						.attr("class", "x axis");
				}
				if(PykCharts.boolean(that.axis.y.enable)){
					that.gyaxis = that.group.append("g")
						.attr("id","yaxis")
						.attr("class","y axis");
				}
				return this;
			},
			createLineChart : function (evt,index) {
				// that.pt_circle = PykCharts.Configuration.focus_circle;
				// that.pt_circle.select("circle").attr("r",4);

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
		      	// 
					// that.zoom_event = d3.behavior.zoom()
					// 	.y(that.yScale)
					// 	.scaleExtent([1,2])
					// 	.on("zoom",that.zoomed);
					// if(PykCharts.boolean(that.zoom.enable)) {
					// 	that.svg.call(that.zoom_event);
					// }

				that.chart_path = d3.svg.line()
					.x(function(d) { return that.xScale(d.x); })
					.y(function(d) { return that.yScale(d.y); })
					.interpolate(that.interpolate);

				that.chartPathClass = (that.type === "lineChart") ? "line" : "multi-line";

				// Real - time Viz
			  	if(evt === "livedata") {
					if(!PykCharts.boolean(that.multiple_containers)) {
						for (var i = 0;i < that.new_data_length;i++) {
				    		type = that.type + "-svg-" +i;
				    		that.svg.select(that.selector + " #"+type)
									.datum(that.new_data[i].data)
									.transition()
									.attr("transform", "translate("+ that.lineMargin +",0)")
						      		.attr("d", that.chart_path);
						 	
						 	if(that.type === "multilineChart") {
						 	// 	that.svg.select(that.selector + " #"+type).on("click",function (d) {
						 	// 		that.selected_line = d3.event.target;
								// 	that.selected_line_data = that.selected_line.__data__;
								// 	that.selected_line_data_len = that.selected_line_data.length;
								// 	that.deselected = that.selected;
									
								// 	d3.select(that.deselected)
								// 			.classed({'multi-line-selected':false,'multi-line':true})
								// 			.style("stroke","");
								// 	that.selected = this;
								// 	d3.select(that.selected)
								// 			.classed({'multi-line-selected':true,'multi-line':false})
								// 			.style("stroke",that.highlightColor);

								// 	if(PykCharts.boolean(that.legends.enable)) {
								// 		(that.deselected !== undefined)? d3.select("text#"+that.deselected.id).style("visibility","hidden") : null;
								// 		d3.select(that.selector+" text#"+that.selected.id).style("visibility","visible");
								// 		that.updateSelectedLine(that.selected.id);
								// 	}
								// });
						 	}
						}
					} else {
						type = that.type + that.svg.attr("id");
			    		that.svg.select(that.selector + " #"+type)
								.datum(that.new_data1.data)
								.transition()
				      			.attr("transform", "translate("+ that.lineMargin +",0)")
					      		.attr("d", that.chart_path);

					 	if(that.type === "multilineChart") {
					 	// 	that.svg.select(that.selector + " #"+type).on("click",function (d) {
				 		// 		that.selected_line = d3.event.target;
							// 	that.selected_line_data = that.selected_line.__data__;
							// 	that.selected_line_data_len = that.selected_line_data.length;
							// 	that.deselected = that.selected;
								
							// 	d3.select(that.deselected)
							// 			.classed({'multi-line-selected':false,'multi-line':true})
							// 			.style("stroke","");
							// 	that.selected = this;
							// 	d3.select(that.selected)
							// 			.classed({'multi-line-selected':true,'multi-line':false})
							// 			.style("stroke",that.highlightColor);

							// 	if(PykCharts.boolean(that.legends.enable)) {
							// 		(that.deselected !== undefined)? d3.select("text#"+that.deselected.id).style("visibility","hidden") : null;
							// 		d3.select(that.selector+" text#"+that.selected.id).style("visibility","visible");
							// 		that.updateSelectedLine(that.selected.id);
							// 	}
							// });
					 	}
					}

					if(that.type === "lineChart" && that.mode === "default") {
						that.svg
							.on('mouseout',function (d) {
								that.mouseEvent.tooltipHide();
								that.mouseEvent.crossHairHide(that.type);
								that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
								that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
							})
							.on("mousemove", function(){
								if(!PykCharts.boolean(that.multiple_containers)) {
									that.mouseEvent.crossHairPosition(that.data,that.xScale,that.yScale,that.dataLineGroup[0],that.lineMargin);
								}
								else {
									that.mouseEvent.crossHairPosition(that.data,that.xScale,that.yScale,that.dataLineGroup,that.lineMargin);
								}
					  		});
					}
					else if (that.type === "multilineChart" && that.selected_line_data !== undefined) {
						that.selected_line_data = that.selected_line.__data__;
						that.selected_line_data_len = that.selected_line_data.length;
						PykCharts.boolean(that.legends.enable) ? that.updateSelectedLine(that.selected.id) : null;
					}
				}
				else { // Static Viz
					if(!PykCharts.boolean(that.multiple_containers)) {
						for (var i = 0;i < that.new_data_length;i++) {
							type = that.type + "-svg-" + i;
							that.dataLineGroup[i] = that.chartBody.append("path");
							that.dataLineGroup[i]
									.datum(that.new_data[i].data)
								    .attr("class", that.chartPathClass)
								    .attr("id", type)
								    .attr("transform", "translate("+ that.lineMargin +",0)")
								    .attr("d", that.chart_path);

							that.dataTextGroup[i] = that.svg.append("text")
									.attr("id",type)
									.attr("class","legend-heading")
									.style("visibility","hidden")
									.html(that.new_data[i].name);

						  	if(that.type === "multilineChart") {
						  		if(PykCharts.boolean(that.color_from_data)) {
									that.dataTextGroup[i]
						      			.style("fill", function() { return that.new_data[i].color; });

						      		that.dataLineGroup[i]
						      			.style("stroke", function() { return that.new_data[i].color; })
							      		.on("click",function (d) {
								  			that.selected_line = d3.event.target;
											that.selected_line_data = that.selected_line.__data__;
											that.selected_line_data_len = that.selected_line_data.length;
											
											that.deselected = that.selected;
											d3.select(that.deselected)
													.classed({'multi-line-selected':false,'multi-line':true,'multi-line-hover':false})
													.style("stroke", function() { return (PykCharts.boolean(that.color_from_data)) ? that.color_before_selection : that.chartColor; });
											that.selected = this;
											that.color_before_selection = d3.select(that.selected).style("stroke");
											d3.select(that.selected)
													.classed({'multi-line-selected':true,'multi-line':false,'multi-line-hover':false})
													.style("stroke", function() { return (PykCharts.boolean(that.color_from_data)) ? that.color_before_selection : that.highlightColor; })
													.style("opacity",1);
											d3.selectAll(options.selector+" path.multi-line").style("opacity",0.3);

											if(PykCharts.boolean(that.legends.enable)) {
												(that.deselected !== undefined)? d3.select("text#"+that.deselected.id).style("visibility","hidden") : null;
												d3.select(that.selector+" text#"+that.selected.id).style("visibility","visible");
												that.updateSelectedLine(that.selected.id);
											}
										});
								}
								else if(!PykCharts.boolean(that.color_from_data)) {
									that.dataTextGroup[i]
						      			.style("fill", function() { return that.legendsText.color; });

									that.dataLineGroup[i]
										.style("stroke", that.chartColor)
										.on("mouseover",function (d) {
											if(this !== that.selected) {
												d3.select(this)
												.classed({'multi-line-hover':true,'multi-line':false})
												.style("stroke", "orange");
											}											
										})
										.on("mouseout",function (d) {
											if(this !== that.selected) {
												d3.select(this)
													.classed({'multi-line-hover':false,'multi-line':true})
													.style("stroke", that.chartColor);
											}
										})
										.on("click",function (d) {
								  			that.selected_line = d3.event.target;
											that.selected_line_data = that.selected_line.__data__;
											that.selected_line_data_len = that.selected_line_data.length;
											
											that.deselected = that.selected;
											d3.select(that.deselected)
													.classed({'multi-line-selected':false,'multi-line':true,'multi-line-hover':false})
													.style("stroke", function() { return (PykCharts.boolean(that.color_from_data)) ? that.color_before_selection : that.chartColor; });
											that.selected = this;
											that.color_before_selection = d3.select(that.selected).style("stroke");
											d3.select(that.selected)
													.classed({'multi-line-selected':true,'multi-line':false,'multi-line-hover':false})
													.style("stroke", function() { return (PykCharts.boolean(that.color_from_data)) ? that.color_before_selection : that.highlightColor; });

											if(PykCharts.boolean(that.legends.enable)) {
												(that.deselected !== undefined)? d3.select("text#"+that.deselected.id).style("visibility","hidden") : null;
												d3.select(that.selector+" text#"+that.selected.id).style("visibility","visible");
												that.updateSelectedLine(that.selected.id);
											}
										});
								}
							}
						}
					} else { // Multiple Containers -- "Yes"
						type = that.type + that.svg.attr("id");
						that.dataLineGroup[0] = that.chartBody.append("path");
						that.dataLineGroup[0]
								.datum(that.new_data1.data)
							    .attr("class", that.chartPathClass)
							    .attr("id", type)
							    .attr("transform", "translate("+ that.lineMargin +",0)")
							    .attr("d", that.chart_path);
						that.dataTextGroup[0] = that.svg.append("text")
								.attr("id",type)
								.attr("x", 65)
								.attr("y", 20)
								.style("font-size", that.legendsText.size)
								.style("font-weight", that.legendsText.weight)
								.style("font-family", that.legendsText.family)
								.html(that.new_data1.name);
						
						if(that.type === "multilineChart") {
							if(PykCharts.boolean(that.color_from_data)) {
								that.dataTextGroup[0]
					      			.style("fill", function() { return that.new_data[index].color; });

					      		that.dataLineGroup[0]
					      			.style("stroke", function() { return that.new_data[index].color; });
							}
							else if(!PykCharts.boolean(that.color_from_data)) {
								that.dataTextGroup[0]
					      			.style("fill", function() { return that.legendsText.color; });

								that.dataLineGroup[0]
									.style("stroke", that.chartColor);
							}
						}
					}

					if(that.type === "lineChart" && that.mode === "default") {
						that.svg
							.on('mouseout',function (d) {
								that.mouseEvent.tooltipHide();
								that.mouseEvent.crossHairHide(that.type);
								that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
								that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
							})
							.on("mousemove", function(){
								that.mouseEvent.crossHairPosition(that.data,that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.lineMargin,that.type,that.tooltipMode,that.color_from_data,null);
							});
					}
					else if (that.type === "multilineChart" && that.mode === "default") {
						that.svg
							.on('mouseout', function (d) {
								that.mouseEvent.tooltipHide();
								that.mouseEvent.crossHairHide(that.type);
								that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
								that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
								for(var a=0;a < that.new_data_length;a++) {
									$(options.selector+" #svg-"+a).trigger("mouseout");
								}
							})
							.on("mousemove", function(){
								// console.log(d3.select(options.selector+" #"+this.id+" .multi-line").attr("id"),"^^^^^^",this.id);
								var line = [];
								line[0] = d3.select(options.selector+" #"+this.id+" .multi-line");
								that.mouseEvent.crossHairPosition(that.data,that.new_data,that.xScale,that.yScale,line,that.lineMargin,that.type,that.tooltipMode,that.color_from_data,that.multiple_containers);
								for(var a=0;a < that.new_data_length;a++) {										
									$(options.selector+" #svg-"+a).trigger("mousemove");
								}
							});
					}
				}
				return this;
			}
		};
		return optional;
	};

	// this.reset_lines_to_onload = function() {
	// 	console.log("RESET TRIGERRED!!!!!!!!!!!!!!!!!!!!!!");
	// 	d3.selectAll(options.selector+" path."+that.chartPathClass).style("opacity",1);
	// };

	// this.zoomed = function() {

	// 	if(!PykCharts.boolean(that.multiple_containers.enable)) {
	// 		console.log(!PykCharts.boolean(that.multiple_containers.enable));
	// 		that.k.isOrdinal(that.svg,".x.axis",that.xScale);
	// 		that.k.isOrdinal(that.svg,".x.grid",that.xScale);
	// 		that.k.isOrdinal(that.svg,".y.axis",that.yScale);
	// 		that.k.isOrdinal(that.svg,".y.grid",that.yScale);
			
	// 		for (i = 0;i < that.new_data_length;i++) {
	// 			type = that.type + "-svg-" + i;
	// 			that.svg.select(that.selector+" #"+type)
	// 					.attr("class", that.chartPathClass)
	// 					.attr("d", that.chart_path);
	// 		}
	// 	}
	// 	else {
	// 		console.log(that.multiple_containers.enable);
	// 		that.k.isOrdinal(d3.select(this),"#"+this.id+" .x.axis",that.xScale);
	// 		that.k.isOrdinal(d3.select(this),"#"+this.id+" .x.grid",that.xScale);
	// 		that.k.isOrdinal(d3.select(this),"#"+this.id+" .y.axis",that.yScale);
	// 		that.k.isOrdinal(d3.select(this),"#"+this.id+" .y.grid",that.yScale);
	// 		console.log("#"+this.id+" .y.axis");
	// 		type = that.type + "-" + this.id;
	// 		that.svg.select(that.selector+" #"+this.id+" #"+type)
	// 				.attr("class", that.chartPathClass)
	// 				.attr("d", that.chart_path);
	// 	}
	// 	// console.log(that.svg,d3.select(this),type);
	// 	if(that.type === "multilineChart") {
	// 		d3.select(that.selected)
	// 				.classed({'multi-line-selected':true,'multi-line':false})
	// 				.style("stroke",that.highlightColor);

	// 		(that.selected_line_data !== undefined && PykCharts.boolean(that.legends.enable)) ? that.updateSelectedLine(this.id) : null;
	// 	}
	// };

	this.updateSelectedLine = function (lineid) {
		var height_text = parseFloat(d3.select(that.selector+" text#"+lineid).style("height")) / 2,
			width_text = parseFloat(d3.select(that.selector+" text#"+lineid).style("width")) / 2 ,
			start_x_circle = (that.xScale(that.selected_line_data[0].x) + that.lineMargin + that.margin.left),
			start_y_circle = (that.yScale(that.selected_line_data[0].y) + that.margin.top),
			end_x_circle = (that.xScale(that.selected_line_data[(that.selected_line_data_len - 1)].x) + that.lineMargin + that.margin.left),
			end_y_circle = (that.yScale(that.selected_line_data[(that.selected_line_data_len - 1)].y) + that.margin.top);

		if(that.legends.display === "vertical") {
			text_x = ( - that.margin.left + 25),
			text_y = (end_y_circle - that.margin.top + 20),
			text_rotate = -90;
		}
		else if(that.legends.display === "horizontal") {
			text_x = (end_x_circle - that.margin.left + width_text + 30),
			text_y = (end_y_circle - that.margin.top - height_text + 20),
			text_rotate = 0;
		}

		d3.select(that.selector+" text#"+lineid)
				.attr("transform","translate("+text_x+","+text_y+") rotate("+text_rotate+")")
				.style("font-size", that.legendsText.size)
				.style("font-weight", that.legendsText.weight)
				.style("font-family", that.legendsText.family);
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
PykCharts.multiD.areaChart = function (options){
	var that = this;
	var theme = new PykCharts.Configuration.Theme({});

	this.execute = function (){
		that = new PykCharts.multiD.processInputs(that, options, "area");
		                        
		if(that.mode === "default") {
			that.k.loading();
		}
		var twoDimensionalCharts = theme.twoDimensionalCharts,
			stylesheet = theme.stylesheet,
			optional = options.optional;
	    that.enableCrossHair = optional && optional.enableCrossHair ? optional.enableCrossHair : twoDimensionalCharts.enableCrossHair;
			that.curvy_lines = optional && optional.curvy_lines ? optional.curvy_lines : twoDimensionalCharts.curvy_lines;
			// that.grid = options.chart && options.chart.grid ? options.chart.grid : stylesheet.chart.grid;
	  	// that.grid.yEnabled = options.chart && options.chart.grid && options.chart.grid.yEnabled ? options.chart.grid.yEnabled : stylesheet.chart.grid.yEnabled;
	  	// that.grid.xEnabled = options.chart && options.chart.grid && options.chart.grid.xEnabled ? options.chart.grid.xEnabled : stylesheet.chart.grid.xEnabled;
	  	that.interpolate = PykCharts.boolean(that.curvy_lines) ? "cardinal" : "linear";
		that.reducedWidth = that.width - that.margin.left - that.margin.right;
		that.reducedHeight = that.height - that.margin.top - that.margin.bottom;

		d3.json(options.data, function (e, data) {
			that.data = data;
			that.data_length = data.length;
			$(that.selector+" #chart-loader").remove();
			that.render();
		});
	};

	this.render = function (){
		if(that.mode === "default") {
			that.transitions = new PykCharts.Configuration.transition(that);
			
			that.k.title()
					.subtitle()
					.liveData(that)
					.makeMainDiv(options.selector,1)
					.tooltip(true,options.selector,1);

			that.optional_feature()
		    		.chartType()
					.createSvg(1)
					.createChart()
		    		.axisContainer();

			that.k.crossHair(that.svg,that.type)
					.credits();

			that.k.xAxis(that.svg,that.gxaxis,that.xScale)
					.yAxis(that.svg,that.gyaxis,that.yScale)
					.yGrid(that.svg,that.group,that.yScale)
					.xGrid(that.svg,that.group,that.xScale)
					.dataSource();
		}
		else if(that.mode === "infographics") {
			  that.k.liveData(that)
						.makeMainDiv(options.selector,1);

			  that.optional_feature()
			    		.chartType()
						.createSvg(1)
						.createChart()
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

			that.optional_feature().createChart("liveData");

			that.k.xAxis(that.svg,that.gxaxis,that.xScale)
					.yAxis(that.svg,that.gyaxis,that.yScale)
					.yGrid(that.svg,that.group,that.yScale)
					.xGrid(that.svg,that.group,that.xScale)
					.tooltip(true,options.selector);
		});
	};

	this.optional_feature = function (){
		var optional = {
			chartType: function () {
				for(j = 1;j < that.data_length;j++) {
					if(that.data[0].x === that.data[j].x) {
						that.type = "stackedAreaChart";
						break;
					}
				}
				that.type = that.type || "areaChart";
				return this;
			},
			createSvg: function (i){
				$(that.selector).attr("class","PykCharts-twoD PykCharts-multi-series2D PykCharts-line-chart");
				$(options.selector).css({"background-color":that.bg,"position":"relative"});

				that.svg = d3.select(options.selector+" "+"#tooltip-svg-container-"+i).append("svg:svg")
					.attr("id","svg")
					.attr("width",that.width)
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

				that.chart_path_stack = d3.layout.stack()
					.values(function(d) { return d.data; });
    		
    			return this;
			},
			axisContainer : function () {
	        if(PykCharts.boolean(that.axis.x.enable)){
				that.gxaxis = that.group.append("g")
						.attr("id","xaxis")
						.attr("class", "x axis");
				}
				if(PykCharts.boolean(that.axis.y.enable)){
					that.gyaxis = that.group.append("g")
						.attr("id","yaxis")
						.attr("class","y axis");
				}
	        	return this;
      		},
			createChart : function (evt) {
				that.group_arr = [], that.color_arr = [], that.new_data = [], that.dataLineGroup = [],
				that.dataTextGroup = [], that.dataLineGroupBorder = [];

				if(that.type === "areaChart") {
					that.new_data[0] = {
						name: (that.data[0].name || ""),
						data: []
					};
					for(j = 0;j < that.data_length;j++) {
						that.new_data[0].data.push({
							x: that.data[j].x,
							y: that.data[j].y,
							tooltip: that.data[j].tooltip,
							color: (that.data[j].color || "")
						});
					}
				}
				else if(that.type === "stackedAreaChart") {
					for(j = 0;j < that.data_length;j++) {
						that.group_arr[j] = that.data[j].name;
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
							if (that.uniq_group_arr[k] === that.data[l].name) {
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
				that.stacked_new_data = that.chart_path_stack(that.new_data);

        		var x_domain,x_data = [],y_data,y_range,x_range,y_domain;

				if(that.yAxisDataFormat === "number") {
					max = d3.max(that.stacked_new_data, function(d) { return d3.max(d.data, function(k) { return k.y0 + k.y; }); });
					min = 0;
         			y_domain = [min,max];
		          	y_data = that.k._domainBandwidth(y_domain,1);
		          	y_range = [that.reducedHeight, 0];
		          	that.yScale = that.k.scaleIdentification("linear",y_data,y_range);

		        }
		        else if(that.yAxisDataFormat === "string") {
		          	that.new_data[0].data.forEach(function(d) { y_data.push(d.y); });
		          	y_range = [0,that.reducedHeight];
		          	that.yScale = that.k.scaleIdentification("ordinal",y_data,y_range,0);

		        }
		        else if (that.yAxisDataFormat === "time") {
		          	that.stacked_new_data.data.forEach(function (k) {
		          		k.y0 = new Date(k.y0);
		          		k.y = new Date(k.y);
		          	});
		          	max = d3.max(that.stacked_new_data, function(d) { return d3.max(d.data, function(k) { return k.y0 + k.y; }); });
					min = 0;
		         	y_data = [min,max];
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

		        }
		        else if(that.xAxisDataFormat === "string") {
		          	that.new_data[0].data.forEach(function(d) { x_data.push(d.x); });
		          	x_range = [0 ,that.reducedWidth];
		          	that.xScale = that.k.scaleIdentification("ordinal",x_data,x_range,0);
		          	that.lineMargin = (that.xScale.rangeBand() / 2);

		        }
		        else if (that.xAxisDataFormat === "time") {
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
				    .on("zoom", that.zoomed);
				if(PykCharts.boolean(that.zoom.enable)) {
					that.svg.call(that.zoom_event);
				}

				that.lineMargin = (that.xScale.rangeBand() / 2);

				that.chart_path = d3.svg.area()
				    .x(function(d) { return that.xScale(d.x); })
				    .y0(function(d) { return that.yScale(d.y0); })
    				.y1(function(d) { return that.yScale(d.y0 + d.y); })
				    .interpolate(that.interpolate);
				that.chart_path_border = d3.svg.line()
				    .x(function(d) { return that.xScale(d.x); })
				    .y(function(d) { return that.yScale(d.y0 + d.y); })
				    .interpolate(that.interpolate);

				that.chartPathClass = (that.type === "areaChart") ? "area" : "stacked-area";

        	if(evt === "liveData"){
        		for (var i = 0;i < that.new_data_length;i++) {
        			type = that.chartPathClass + i;
        			that.svg.select("#"+type)
						.datum(that.stacked_new_data[i].data)
						.transition()
				      	// .ease(that.transition.transition_type)
			      		// .duration(that.transitions[that.transition.enable]().duration())
						.attr("transform", "translate("+ that.lineMargin +",0)")
					    .attr("d", that.chart_path);

						that.svg.select("#border-stacked-area"+i)
							.datum(that.stacked_new_data[i].data)
					  		.transition()
				      		.ease("linear")
			      			.duration(that.transitions.duration())
							.attr("transform", "translate("+ that.lineMargin +",0)")
					      	.attr("d", that.chart_path_border);

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

					if(that.type === "areaChart") {
						that.svg
							.on('mouseout',function (d) {
			          			that.mouseEvent.tooltipHide();
			          			that.mouseEvent.crossHairHide(type);
								that.mouseEvent.axisHighlightHide(options.selector + " .x.axis");
								that.mouseEvent.axisHighlightHide(options.selector + " .y.axis");
		          			})
							.on("mousemove", function(){
								that.mouseEvent.crossHairPosition(that.data,that.new_data,that.xScale,that.yScale,that.svg.select("#"+type),that.lineMargin,that.type,that.tooltip.mode);
					  		});
					}
				}
				else {
					for (var i = 0;i < that.new_data_length;i++) {
						type = that.chartPathClass + i;
						that.dataLineGroup[i] = that.chartBody.append("path");
						that.dataLineGroup[i]
							.datum(that.stacked_new_data[i].data)
							.attr("class", that.chartPathClass)
							.attr("id", type)
							.style("fill", function(d,k) { return (that.new_data[i].color !== "") ? that.new_data[i].color : that.chartColor; })
							.attr("transform", "translate("+ that.lineMargin +",0)")
							.attr("d", that.chart_path);

						that.dataLineGroupBorder[i] = that.chartBody.append("path");
						that.dataLineGroupBorder[i]
							.datum(that.stacked_new_data[i].data)
							.attr("class", "area-border")
							.attr("id", "border-stacked-area"+i)
							.style("stroke", that.borderBetweenChartElements.color)
							.style("stroke-width", that.borderBetweenChartElements.width)
							.style("stroke-dasharray", that.borderBetweenChartElements.style)
							.attr("transform", "translate("+ that.lineMargin +",0)")
							.attr("d", that.chart_path_border);

						// Legend ---- Pending!
					  // that.dataTextGroup[i] = that.svg.append("text")
					  // 		.attr("id",that.chartPathClass+"-"+that.new_data[i].name)
					  // 		.attr("x", 20)
					  // 		.attr("y", 20)
					  // 		.style("display","none")
					  // 		.text(that.new_data[i].name);

						// that.dataLineGroup[i].on("click",function (d,j) {
						// 		that.curr_line_data = d;
						// 		that.curr_line_data_len = d.length;
						// 		that.deselected = that.selected;
						// 		d3.select(that.deselected).classed({'multi-line-selected':false,'multi-line':true});
						// 		that.selected = this;
						// 		d3.select(that.selected).classed({'multi-line-selected':true,'multi-line':false});

						// 		that.updateSelectedLine();
						// });
					}

					if(that.type === "areaChart") {
						that.svg
					  		.on("mouseout",function (d) {
									that.mouseEvent.tooltipHide();
									that.mouseEvent.crossHairHide(that.type);
									that.mouseEvent.axisHighlightHide(options.selector + " .x.axis");
									that.mouseEvent.axisHighlightHide(options.selector + " .y.axis");
			          		})
						  	.on("mousemove", function(){
						  		that.mouseEvent.crossHairPosition(that.data,that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.lineMargin,that.type,that.tooltip.mode);
						  	});
					}
					else if(that.type === "stackedAreaChart") {
						// that.svg.on("mousemove", function() { console.log(d3.event.pageX,d3.event.pageY); });
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
	    	type = that.chartPathClass + i;
	  	 	that.svg.select(that.selector+" #"+type)
	        	.attr("class", that.chartPathClass)
		        .attr("d", that.chart_path);
		    that.svg.select(that.selector+" #border-stacked-area"+i)
				.attr("class","area-border")
				.attr("d", that.chart_path_border);
	    }

    // d3.select(that.selected).classed({'multi-line-selected':true,'multi-line':false});
    // (that.curr_line_data !== undefined) ? that.updateSelectedLine() : null;
	};

	// this.updateSelectedLine = function () {
	// 	var start_x = (that.xScale(that.curr_line_data[0].x) + that.lineMargin + that.margin.left),
	// 			start_y = (that.yScale(that.curr_line_data[0].y) + that.margin.top),
	// 			end_x = (that.xScale(that.curr_line_data[(that.curr_line_data_len - 1)].x) + that.lineMargin + that.margin.left),
	// 			end_y = (that.yScale(that.curr_line_data[(that.curr_line_data_len - 1)].y) + that.margin.top);

	//     that.start_pt_circle.show();
	// 		that.start_pt_circle.select("circle")
	// 			.attr("class","bullets")
	// 			.attr("fill",that.color)
	// 			.attr("transform", "translate(" + start_x + "," + start_y + ")");
	// 		that.end_pt_circle.show();
	// 		that.end_pt_circle.select("circle")
	// 			.attr("class","bullets")
	// 			.attr("fill",that.color)
	// 			.attr("transform", "translate(" + end_x + "," + end_y + ")");
	// };

	// this.fullScreen = function () {
 //    var modalDiv = d3.select(that.selector).append("div")
	// 	    .attr("id","modalFullScreen")
	// 	    .attr("align","center")
	// 	    .attr("visibility","hidden")
	// 	    .attr("class","clone")
	// 	    .style("align","center")
	// 	    .append("a")
	// 	    .attr("class","b-close")
	// 		      .style("cursor","pointer")
	// 		      .style("position","absolute")
	// 		      .style("right","15px")
	// 		      .style("top","10px")
	// 		      .style("font-size","20px")
	// 		      .style("font-family","arial")
	// 		      .html("X");
	// 	var scaleFactor = 1.4;

	// 	if(that.h >= 430 || that.w >= 780) {
 //      scaleFactor = 1;
 //    }
 //    $("#svg").clone().appendTo("#modalFullScreen");

 //    d3.select(".clone #svg").attr("width",screen.width-200).attr("height",screen.height-185).style("display","block");
 //    d3.select(".clone #svg #chartsvg").attr("transform","translate("+that.margin.left+","+that.margin.top+")scale("+scaleFactor+")");
 //    d3.selectAll(".clone #svg #chartsvg g text").style("font-size",9);
 //    d3.select(".clone #svg g#clipPath").attr("transform","translate("+that.margin.left+","+that.margin.top+")scale("+scaleFactor+")");

 //    $(".clone").css({"background-color":"#fff","border-radius":"15px","color":"#000","display":"","padding":"20px","min-width":screen.availWidth-100,"min-height":screen.availHeight-200,"visibility":"visible","align":"center"});
 //    $("#modalFullScreen").bPopup({position: [30, 10],transition: 'fadeIn',onClose: function(){ $('.clone').remove(); }});
 //  };
};
PykCharts.multiD.barChart = function(options){
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    
    this.execute = function () {
        that = new PykCharts.multiD.processInputs(that, options, "column");

        that.grid = options.chart && options.chart.grid ? options.chart.grid : theme.stylesheet.chart.grid;
        that.grid.yEnabled = options.chart && options.chart.grid && options.chart.grid.yEnabled ? options.chart.grid.yEnabled : theme.stylesheet.chart.grid.yEnabled;
        that.grid.color = options.chart && options.chart.grid && options.chart.grid.color ? options.chart.grid.color : theme.stylesheet.chart.grid.color;

        if(that.mode === "default") {
           that.k.loading();
        }
        d3.json(options.data, function(e, data){
            that.data = data;
            //console.log(data);
            $(that.selector+" #chart-loader").remove();
            that.render();
        });
    };

    this.refresh = function () {
        d3.json(options.data, function (e, data) {
            that.data = data;      
            that.data = that.dataTransformation();        
            that.data = that.emptygroups(that.data);                           
            var fD = that.flattenData();
            that.the_bars = fD[0];
            that.the_keys = fD[1];
            that.the_layers = that.buildLayers(that.the_bars);
            if(that.max_length === 1) {
                that.legends.enable = "no";
            }
            that.optionalFeatures()
                    .createColumnChart()
                    .legends()
                    .ticks();
            that.k.xAxis(that.svg,that.xgroup,that.xScale);
        });
    };

    //----------------------------------------------------------------------------------------
    //4. Render function to create the chart
    //----------------------------------------------------------------------------------------
    this.render = function(){
        var that = this;

        that.data = that.dataTransformation();
        //console.log(that.data);
        that.data = that.emptygroups(that.data);
        //console.log(that.data);
        var fD = that.flattenData();
        // console.log(fD);
        that.the_bars = fD[0];
        that.the_keys = fD[1];
        that.the_layers = that.buildLayers(that.the_bars);
        // console.log(that.the_bars);
        that.border = new PykCharts.Configuration.border(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.mouseEvent1 = new PykCharts.multiD.mouseEvent(that);
        that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);
        that.border = new PykCharts.Configuration.border(that);
        if(that.max_length === 1) {
            that.legends.enable = "no";
        }
        if(that.mode === "default") {

            that.k.title()
                .subtitle()
                .makeMainDiv(that.selector,1);
            that.optionalFeatures()
                .legendsContainer(1)
                .svgContainer(1);

            that.k.credits()
                .dataSource()
                .liveData(that)
                .tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
            
            that.optionalFeatures()
                .createColumnChart()
                .legends()
                .axisContainer()
               .ticks();

            that.k.xAxis(that.svg,that.xgroup,that.xScale)
        } else if(that.mode === "infographics") {
            that.k.makeMainDiv(that.selector,1);
            that.optionalFeatures().svgContainer(1)
                .createColumnChart()
                .axisContainer();

            that.k.tooltip();
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
            that.k.xAxis(that.svg,that.xgroup,that.xScale);
        }
    };

    this.optionalFeatures = function() {
        var that = this;
        var optional = {
            svgContainer: function (i) {
                $(that.selector).attr("class","PykCharts-twoD");
                that.svg = d3.select(options.selector + " #tooltip-svg-container-" + i)
                    .append("svg:svg")
                    .attr("width",that.width )
                    .attr("height",that.height)
                    .attr("id","svgcontainer")
                    .attr("class","svgcontainer")
                    .style("background-color",that.bg);

                that.group = that.svg.append("g")
                    .attr("id","svggroup")
                    .attr("class","svggroup")
                    .attr("transform","translate(" + that.margin.left + "," + that.margin.top +")");
            
                return this;
            },
            legendsContainer: function (i) {
                if(PykCharts.boolean(that.legends.enable)) {
                    that.legend_svg = d3.select(options.selector + " #tooltip-svg-container-" + i)
                        .append("svg:svg")
                        .attr("width",that.width)
                        .attr("height",50)
                        .attr("class","legendscontainer")
                        .attr("id","legendscontainer");

                    that.legends_group = that.legend_svg.append("g")
                        .attr("id","legends")
                        .attr("class","legends")
                        .attr("transform","translate(0,10)");
                }

                return this;
            },
            axisContainer : function () {
                if(PykCharts.boolean(that.axis.y.enable)) {

                    var axis_line = that.group.selectAll(".axis-line")
                        .data(["line"]);

                    axis_line.enter()
                            .append("line");

                    axis_line.attr("class","axis-line")
                            .attr("x1",0)
                            .attr("y1",0)
                            .attr("x2",0)
                            .attr("y2",that.height-that.margin.top-that.margin.bottom)
                            .attr("stroke",that.axis.x.axisColor);

                    axis_line.exit().remove();

                    that.xgroup = that.group.append("g")
                        .attr("id","xaxis")
                        .attr("class", "x axis");
                    if(that.axis.y.position === "right") {
                        axis_line.attr("x1",(that.width-that.margin.left-that.margin.right))
                            .attr("x2",(that.width-that.margin.left-that.margin.right));
                        // that.xgroup.attr("transform","translate(0,"+(that.width-that.margin.left-that.margin.right)+")");
                    }
                        // .style("stroke","none"); 
                }
                
                if(PykCharts.boolean(that.axis.x.enable)) {
                    that.ygroup = that.group.append("g")
                        .attr("id","xaxis")
                        .attr("class","x axis");
                }
                return this;
            },
            createColumnChart: function() {
                var w = that.width - that.margin.left - that.margin.right,
                    j = that.max_length+1,
                    h = that.height - that.margin.top - that.margin.bottom;

                var the_bars = that.the_bars;
                var keys = that.the_keys;
                that.layers = that.the_layers;
                var groups= that.getGroups();
  
                var stack = d3.layout.stack() // Create default stack
                    .values(function(d){ // The values are present deep in the array, need to tell d3 where to find it
                        return d.values;
                    })(that.layers);
                // console.log(stack);
                that.layers = that.layers.map(function (group) {
                    return {
                        name : group.name,
                        values : group.values.map(function (d) {
                            // Invert the x and y values, and y0 becomes x0
                            return {
                                x: d.y,
                                y: d.x,
                                x0: d.y0,
                                tooltip : d.tooltip,
                                color: d.color,
                                group: d.group,
                                name:d.name,
                                highlight:d.highlight
                            };
                        })
                    };
                })
                // console.log(layers);
                var xValues = [];
                that.layers.map(function(e, i){ // Get all values to create scale
                    for(i in e.values){
                        var d = e.values[i];
                        xValues.push(d.x + d.x0); // Adding up y0 and y to get total height
                    }
                });
                that.yScale = d3.scale.ordinal()
                    .domain(the_bars.map(function(e, i){
                        return e.id || i; // Keep the ID for bars and numbers for integers
                    }))
                    .rangeBands([0,h]);
                var x_domain = [0,d3.max(xValues)];
                that.xScale = d3.scale.linear().domain(that.k._domainBandwidth(x_domain,1)).range([0, w]);
                // that.yScaleInvert = d3.scale.linear().domain([d3.max(yValues), 0]).range([0, h]).nice(); // For the yAxis
                var zScale = d3.scale.category10();

                var group_label_data = [];

                for(var i in groups){
                    var g = groups[i];
                    var y = that.yScale(g[0]);
                    var totalHeight = that.yScale.rangeBand() * g.length;
                    y = y + (totalHeight/2);
                    group_label_data.push({y: y, name: i});
                }

                that.y0 = d3.scale.ordinal()
                    .domain(group_label_data.map(function (d,i) { return d.name; }))
                    .rangeRoundBands([0, h], 0.1);

                that.y1 = d3.scale.ordinal()
                    .domain(that.barName.map(function(d) { return d; }))
                    .rangeRoundBands([0, that.y0.rangeBand()]) ;

                that.y_factor = 0;
                that.height_factor = 0;
                if(that.max_length === 1) {
                    that.y_factor = that.yScale.rangeBand()/4;
                    that.height_factor = (that.yScale.rangeBand()/(2*that.max_length));
                };
                

                that.bars = that.group.selectAll(".bars")
                    .data(that.layers);

                that.bars.enter()
                        .append("g")
                        .attr("class", "bars");

                var rect = that.bars.selectAll("rect")
                    .data(function(d,i){
                        return d.values;
                    });

                rect.enter()
                    .append("svg:rect")
                    .attr("class","rect")

                rect.attr("width", 0).attr("x", 0)
                    .attr("fill", function(d){
                        return that.fillColor.colorPieMS(d);
                    })
                    .attr("fill-opacity", function (d,i) {
                        //console.log(d.x);
                        if(PykCharts.boolean(that.saturationEnable)){
                            if(d.highlight) {
                                j--;
                                return 1;
                            }
                            if(j>1){
                                //console.log(d.x, "d.x" , j, "j");
                                j--;
                                return j/that.max_length;
                            } else {
                                j = that.max_length+1;
                                j--;
                                return j/that.max_length;
                            }
                        }
                    })
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-opacity",1)
                    .on('mouseover',function (d) {
                        that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.toolTextShow(d.tooltip ? d.tooltip : d.y);
                        that.mouseEvent.axisHighlightShow(d.name,options.selector + " .axis-text","bar");
                    })
                    .on('mouseout',function (d) {
                        that.mouseEvent.tooltipHide(d);
                        that.mouseEvent.axisHighlightHide(options.selector + " .axis-text","bar");
                    })
                    .on('mousemove', function (d) {
                        that.mouseEvent.tooltipPosition(d);
                    });

                rect.transition()
                    .duration(that.transitions.duration())
                    .attr("x", function(d){
                        return that.xScale(d.x0);
                    })
                    .attr("width", function(d){
                        return that.xScale(d.x);
                    })
                    .attr("height", function(d){
                        return that.yScale.rangeBand()+that.height_factor;
                    })
                    .attr("y", function(d){
                        return that.yScale(d.y)-that.y_factor;                        
                    });

                that.bars.exit()
                    .remove();
                var yAxis_label = that.group.selectAll("text.axis-text")
                    .data(group_label_data);

                yAxis_label.enter()
                        .append("text")

                yAxis_label.attr("class", "axis-text")
                        .attr("y", function(d){
                            return d.y;
                        })
                        .attr("x", function(d){
                            return -10;
                        })
                        .attr("fill",that.axis.y.labelColor)
                        .text(function(d){
                            return d.name;
                        });
                if(that.axis.y.position === "right") {
                    yAxis_label.attr("x", function () {
                        return (that.width-that.margin.left-that.margin.right) + 10;
                    });
                }
                if(that.axis.y.position === "left" && that.axis.y.orient === "right") {
                    yAxis_label.attr("x", function (d) {
                        return 10;
                    });
                }
                if(that.axis.y.position === "right" && that.axis.y.orient === "left") {
                    yAxis_label.attr("x", function (d) {
                        return (that.width-that.margin.left-that.margin.right) - 10;
                    });
                }
                if(that.axis.y.orient === "right") {
                    yAxis_label.attr("text-anchor","start");
                } else if(that.axis.y.orient === "left") {
                    yAxis_label.attr("text-anchor","end");
                }

                yAxis_label.exit().remove();
                return this;
            },
            ticks: function () {
                if(that.ticks.size) {
                    that.txt_width;
                    that.txt_height;
                    var ticks = that.bars.selectAll("g")
                                .data(that.layers);
                    
                    var ticksText = that.bars.selectAll(".ticksText")
                                .data(function(d) {
                                        // console.log(d.values);
                                        return d.values;
                                });
                    ticksText.enter()
                        .append("text")
                        .attr("class","ticksText");

                    ticksText.attr("class","ticksText")
                        .text(function(d) {
                            if(d.x) { 
                                // console.log(d.x);
                                return d.x;
                            }
                        })
                        .style("font-weight", that.ticks.weight)
                        .style("font-size", that.ticks.size)
                        .attr("fill", that.ticks.color)
                        .style("font-weight", that.ticks.weight)
                        .style("font-family", that.ticks.family)
                        .text(function(d) {
                            if(d.x) {
                                that.txt_width = this.getBBox().width;
                                that.txt_height = this.getBBox().height;
                                if(d.x && (that.txt_width< that.xScale(d.x)) && (that.txt_height < (that.yScale.rangeBand()+that.height_factor ))) {                                   
                                    return d.x;
                                }
                            }
                        })
                        .attr("x", function(d){
                            var bar_width  = that.xScale(d.x);
                            return that.xScale(d.x0) + that.xScale(d.x)+ 5;    
                        })
                        .attr("y",function(d){
                            return that.yScale(d.y)-that.y_factor+(that.yScale.rangeBand()/2);
                        })
                        .attr("dy",function(d){
                            if(that.max_length ===1) {
                                return that.yScale.rangeBand()/2;
                            } else {
                                return that.yScale.rangeBand()/4;
                            }
                        })
                        .style("font-size",function(d) {
                            // console.log(that.label.size);
                            return that.ticks.size;
                        });

                    ticksText.exit().remove();
                }
                return this;
            },
            legends: function () {
                if(PykCharts.boolean(that.legends.enable)) {
                    var params = that.getParameters(),color;
                    // console.log(params);
                    color = params[0].color; 
                    params = params.map(function (d) {
                        return d.name;
                    });

                    params = jQuery.unique(params);
                    var j = 0,k = 0;
                    j = params.length;
                    k = params.length;                
                    
                    if(that.legends.display === "vertical" ) {
                        that.legend_svg.attr("height", (params.length * 30)+20);
                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        text_parameter1value = function (d,i) { return that.width - that.width/4 + 16; };
                        rect_parameter3value = function (d,i) { return that.width - that.width/4; };
                        var rect_parameter4value = function (d,i) { return i * 24 + 12;};
                        var text_parameter2value = function (d,i) { return i * 24 + 23;};
                    }
                    else if(that.legends.display === "horizontal") {
                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";
                        var text_parameter1value = function (d,i) { j--;return that.width - (j*100 + 75); };
                        text_parameter2value = 30;
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        var rect_parameter3value = function (d,i) { k--;return that.width - (k*100 + 100); };
                        rect_parameter4value = 18;
                    }

                    var legend = that.legends_group.selectAll("rect")
                                    .data(params);

                    legend.enter()
                            .append("rect");

                    legend.attr(rect_parameter1, rect_parameter1value)
                        .attr(rect_parameter2, rect_parameter2value)
                        .attr(rect_parameter3, rect_parameter3value)
                        .attr(rect_parameter4, rect_parameter4value)
                        .attr("fill", function (d) {
                            return that.fillColor.colorPieMS(color);
                        })
                        .attr("fill-opacity", function (d,i) {
                            if(PykCharts.boolean(that.saturationEnable)){
                                return (that.max_length-i)/that.max_length;
                            }
                        });

                    legend.exit().remove();

                    that.legends_text = that.legends_group.selectAll(".legends_text")
                        .data(params);
                    
                    that.legends_text
                        .enter()
                        .append('text')
                        .attr("class","legends_text")
                        .attr("fill","#1D1D1D")
                        .attr("pointer-events","none")
                        .style("font-family", "'Helvetica Neue',Helvetica,Arial,sans-serif")
                        .attr("font-size",12);

                    that.legends_text.attr("class","legends_text")
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   .attr("fill","black")
                    .attr(text_parameter1, text_parameter1value)
                    .attr(text_parameter2, text_parameter2value)
                    .text(function (d) { return d; });
                    
                    that.legends_text.exit()
                                    .remove();                
                }     
                return this;    
            } 
        }
        return optional;
    };

    //----------------------------------------------------------------------------------------
    // 6. Rendering groups:
    //----------------------------------------------------------------------------------------
    
    this.getGroups = function(){
        var groups = {};
        for(var i in that.the_bars){
            var bar = that.the_bars[i];
            if(!bar.id) continue;
            if(groups[bar.group]){
                groups[bar.group].push(bar.id);
            }else{
                groups[bar.group] = [bar.id];
            }
        }
        return groups;
    };

    //----------------------------------------------------------------------------------------
    // 10.Data Manuplation:
    //----------------------------------------------------------------------------------------

    // Data Helpers
    // Takes the flattened data and returns layers
    // Each layer is a separate category
    // The structure of the layer is made so that is plays well with d3.stack.layout()
    // Docs - https://github.com/mbostock/d3/wiki/Stack-Layout#wiki-values

    this.buildLayers = function(the_bars){
        var layers = [];

        function findLayer(l){
            for(var i in layers){
                var layer = layers[i];
                if (layer.name == l) return layer;
            }
            return addLayer(l);
        }

        function addLayer(l){
            var new_layer = {
                "name": l,
                "values": []
            };
            layers.push(new_layer);
            return new_layer;
        }

        for(var i in the_bars){
            var bar = the_bars[i];
            if(!bar.id) continue;
            var id = bar.id;
            for(var k in bar){
                // console.log(bar,"bar");
                if(k === "id") continue;
                var icings = bar[k];
                for(var j in icings){
                    var icing = icings[j];
                    if(!icing.name) continue;
                    var layer = findLayer(icing.name);
                    layer.values.push({
                        "x": id,
                        "y": icing.val,
                        "color": icing.color,
                        "tooltip": icing.tooltip,
                        "highlight": icing.highlight,
                        "group": that.keys[id],
                        "name": bar.group
                    });
                }
            }
        }
        // console.log(layers,"layers"); 
        return layers;
    };

    // Traverses the JSON and returns an array of the 'bars' that are to be rendered
    this.flattenData = function(){
        var the_bars = [-1];
        that.keys = {};
        for(var i in that.data){
            var d = that.data[i];
            for(var cat_name in d){
                for(var j in d[cat_name]){
                    var id = "i" + i + "j" + j;
                    if(typeof d[cat_name][j] !== "object"){
                        continue;
                    }
                    var key = Object.keys(d[cat_name][j])[0];
                    that.keys[id] = key;
                    d[cat_name][j].id = id;
                    d[cat_name][j].group = cat_name;

                    the_bars.push(d[cat_name][j]);
                }
                the_bars.push(i); // Extra seperator element for gaps in segments
            }
        }
        return [the_bars, that.keys];
    };

    this.getParameters = function () {
        var p = [];
        for(var i in  that.the_layers){
            if(!that.the_layers[i].name) continue;
            var name = that.the_layers[i].name, color;
            for(var j in that.the_layers[i].values) {
                if(!PykCharts.boolean(that.the_layers[i].values[j].y)) continue;
                var name = that.the_layers[i].values[j].group, color;
                if(options.optional && options.optional.colors) {
                    if(options.optional.colors.chartColor) {
                        color = that.chartColor;
                    }
                    else if(that.the_layers[i].values[0].color) {
                        color = that.the_layers[i].values[0].color;   
                    }
                }
                else {
                    color = that.chartColor;
                }

                p.push({
                    "name": name,
                    "color": color
                });
            }
        }
        return p;
    };
    this.emptygroups = function (data) {

        that.max_length = d3.max(data,function (d){
            var value = _.values(d);
            return value[0].length;
        });

        var new_data = _.map(data,function (d,i){
            //console.log(that.data);
            var value = _.values(d);
            while(value[0].length < that.max_length) {
                var key = _.keys(d);
                var stack = { "name": "stack", "tooltip": "null", "color": "white", "val": 0, highlight: false };
                var group = {"group3":[stack]};
                // console.log(data[1],"dataaaaaaaa");
                data[i][key[0]].push(group);
                value = _.values(d);
            }
        });
        // console.log(data,"new_data");
        return data;
    };

    this.dataTransformation = function () {

        var data_tranform = [];
        that.barName = [];
        var data_length = that.data.length; 
        that.data.sort(function (a,b) {
            return b.x - a.x;
        });                                                                                                            
        for(var i=0; i < data_length; i++) {
            var group = {},
                bar = {},
                stack;

            if(!that.data[i].group) {
                that.data[i].group = "group" + i;
            }

            if(!that.data[i].stack) {
                that.data[i].stack = "stack";
            }

            that.barName[i] = that.data[i].group;
            group[that.data[i].y] = [];      
            bar[that.data[i].group] = [];
            stack = { "name": that.data[i].stack, "tooltip": that.data[i].tooltip, "color": that.data[i].color, "val": that.data[i].x, highlight: that.data[i].highlight };
            if(i === 0) {
                data_tranform.push(group);
                data_tranform[i][that.data[i].y].push(bar);
                data_tranform[i][that.data[i].y][i][that.data[i].group].push(stack);
                //console.log("hey");
            } else {
                var data_tranform_lenght = data_tranform.length;
                var j=0;
                for(j=0;j < data_tranform_lenght; j++) {
                    if ((_.has(data_tranform[j], that.data[i].y))) {
                        var barr = data_tranform[j][that.data[i].y];
                        var barLength = barr.length;
                        var k = 0;
                        for(k =0; k<barLength;k++) {
                            if(_.has(data_tranform[j][that.data[i].y][k],that.data[i].group)) {
                                break;
                            }
                        }
                        if(k < barLength) {
                            data_tranform[j][that.data[i].y][k][that.data[i].group].push(stack);                   
                        } else {
                            data_tranform[j][that.data[i].y].push(bar);
                            data_tranform[j][that.data[i].y][k][that.data[i].group].push(stack);                      
                        }
                        break;
                    }
                }
                // console.log("heyyyyyy");
                if(j === data_tranform_lenght) {    
                    data_tranform.push(group);
                    data_tranform[j][that.data[i].y].push(bar);
                    data_tranform[j][that.data[i].y][0][that.data[i].group].push(stack);
                }
            }
        }
        that.barName = _.unique(that.barName);

        return data_tranform;
    };
    return this;
};
PykCharts.multiD.columnChart = function(options){
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    
    this.execute = function () {
        that = new PykCharts.multiD.processInputs(that, options, "column");

        that.grid = options.chart && options.chart.grid ? options.chart.grid : theme.stylesheet.chart.grid;
        that.grid.yEnabled = options.chart && options.chart.grid && options.chart.grid.yEnabled ? options.chart.grid.yEnabled : theme.stylesheet.chart.grid.yEnabled;
        that.grid.color = options.chart && options.chart.grid && options.chart.grid.color ? options.chart.grid.color : theme.stylesheet.chart.grid.color;

        if(that.mode === "default") {
           that.k.loading();
        }
        d3.json(options.data, function(e, data){
            that.data = data;
            $(that.selector+" #chart-loader").remove();
            that.render();
        });
    };

    this.refresh = function () {
        d3.json(options.data, function (e, data) {
            that.data = data;      
            that.data = that.dataTransformation(); 
            that.data = that.emptygroups(that.data);                          

            var fD = that.flattenData();
            that.the_bars = fD[0];
            that.the_keys = fD[1];
            that.the_layers = that.layers(that.the_bars);
            if(that.max_length === 1) {
                that.legends.enable = "no";
            }
            that.optionalFeatures()
                    .createColumnChart()
                    .legends();
                    
            that.k.yAxis(that.svg,that.ygroup,that.yScaleInvert)
                .yGrid(that.svg,that.group,that.yScaleInvert);
        });
    };

    //----------------------------------------------------------------------------------------
    //4. Render function to create the chart
    //----------------------------------------------------------------------------------------
    this.render = function(){
        var that = this;
        that.data = that.dataTransformation();
        that.data = that.emptygroups(that.data);                          
        var fD = that.flattenData();
        that.the_bars = fD[0];
        that.the_keys = fD[1];
        that.the_layers = that.layers(that.the_bars);

        that.border = new PykCharts.Configuration.border(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.mouseEvent1 = new PykCharts.multiD.mouseEvent(that);
        that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);
        if(that.max_length === 1) {
            that.legends.enable = "no";
        }
        if(that.mode === "default") {
            that.k.title()
                .subtitle()
                .makeMainDiv(that.selector,1);

            that.optionalFeatures()
                .legendsContainer(1)
                .svgContainer(1);

            that.k.credits()
                .dataSource()
                .liveData(that)
                .tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
            
            that.optionalFeatures()
                .createColumnChart()
                .legends()
                .axisContainer();

            that.k.yAxis(that.svg,that.ygroup,that.yScaleInvert)
                // .xAxis(that.svg,that.xgroup,that.xScale)
                .yGrid(that.svg,that.group,that.yScaleInvert);
              
        } else if(that.mode === "infographics") {
            that.k.makeMainDiv(that.selector,1);
            that.optionalFeatures().svgContainer(1)
                .createColumnChart()
                .axisContainer();

            that.k.tooltip();
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
            that.k.yAxis(that.svg,that.ygroup,that.yScaleInvert);
        }
    };

    this.optionalFeatures = function() {
        var that = this;
        var optional = {
            svgContainer: function (i) {
               $(that.selector).attr("class","PykCharts-twoD");
                that.svg = d3.select(options.selector + " #tooltip-svg-container-" + i)
                    .append("svg:svg")
                    .attr("width",that.width )
                    .attr("height",that.height)
                    .attr("id","svgcontainer")
                    .attr("class","svgcontainer")
                    .style("background-color",that.bg);

                that.group = that.svg.append("g")
                    .attr("id","svggroup")
                    .attr("class","svggroup")
                    .attr("transform","translate(" + that.margin.left + "," + that.margin.top +")");
               
                if(PykCharts.boolean(that.grid.yEnabled)) {
                    that.group.append("g")
                        .attr("id","ygrid")
                        .style("stroke",that.grid.color)
                        .attr("class","y grid-line");
                }
                return this;
            },
            legendsContainer: function (i) {
                if(PykCharts.boolean(that.legends.enable)) {
                    that.legend_svg = d3.select(options.selector + " #tooltip-svg-container-" + i)
                        .append("svg:svg")
                        .attr("width",that.width)
                        .attr("height",50)
                        .attr("class","legendscontainer")
                        .attr("id","legendscontainer");

                    that.legends_group = that.legend_svg.append("g")
                        .attr("id","legends")
                        .attr("class","legends")
                        .attr("transform","translate(0,10)");
                }
                return this;
            },
            axisContainer : function () {
                if(PykCharts.boolean(that.axis.x.enable)) {
                    var axis_line = that.group.selectAll(".axis-line")
                        .data(["line"]);

                    axis_line.enter()
                            .append("line");

                    axis_line.attr("class","axis-line")
                            .attr("x1",0)
                            .attr("y1",that.height-that.margin.top-that.margin.bottom)
                            .attr("x2",that.width-that.margin.left-that.margin.right)
                            .attr("y2",that.height-that.margin.top-that.margin.bottom)
                            .attr("stroke",that.axis.x.axisColor);
                    if(that.axis.x.position === "top") {
                        axis_line.attr("y1",0)
                            .attr("y2",0);
                    }
                    axis_line.exit().remove();

                    that.xgroup = that.group.append("g")
                        .attr("id","xaxis")
                        .attr("class", "x axis")
                        .style("stroke","none"); 
                }
                
                if(PykCharts.boolean(that.axis.y.enable)) {
                    that.ygroup = that.group.append("g")
                        .attr("id","yaxis")
                        .attr("class","y axis");
                }
                return this;
            },
            createColumnChart: function() {
                var w = that.width - that.margin.left - that.margin.right;
                var h = that.height - that.margin.top - that.margin.bottom,j=that.max_length+1;

                var the_bars = that.the_bars;
                var keys = that.the_keys;
                var layers = that.the_layers;
                var groups= that.getGroups();
  
                var stack = d3.layout.stack() // Create default stack
                    .values(function(d){ // The values are present deep in the array, need to tell d3 where to find it
                        return d.values;
                    })(layers);

                var yValues = [];
                layers.map(function(e, i){ // Get all values to create scale
                    for(i in e.values){
                        var d = e.values[i];
                        yValues.push(d.y + d.y0); // Adding up y0 and y to get total height
                    }
                });

                that.xScale = d3.scale.ordinal()
                    .domain(the_bars.map(function(e, i){
                        return e.id || i; // Keep the ID for bars and numbers for integers
                    }))
                    .rangeBands([0,w],0.1);

                y_domain = [0,d3.max(yValues)]  
                // console.log(d3.max(yValues));              
                y_domain = that.k._domainBandwidth(y_domain,1);
                // console.log(y_domain,"y_domain");
                that.yScale = d3.scale.linear().domain(y_domain).range([0, h]);
                // console.log(y_domain[1],"y_domain");
                // console.log(that.yScale.domain());
                that.yScaleInvert = d3.scale.linear().domain([y_domain[1],y_domain[0]]).range([0, h]); // For the yAxis
                // console.log(that.yScaleInvert.domain());
                var zScale = d3.scale.category10();

                var group_label_data = [], g, x, totalWidth, i;
                var x_factor = 0, width_factor = 0;
                if(that.max_length === 1) {
                    x_factor = that.xScale.rangeBand()/4;
                    width_factor = (that.xScale.rangeBand()/(2*that.max_length));
                };

                for(i in groups){
                    g = groups[i];
                    x = that.xScale(g[0]);
                    totalWidth = that.xScale.rangeBand() * g.length;
                    x = x + (totalWidth/2);
                    group_label_data.push({x: x, name: i});
                }

                // console.log(that.xScale.rangeBand()*17,"rangeBand");

                // that.x0 = d3.scale.ordinal()
                //     .domain(group_label_data.map(function (d,i) { return d.name; }))
                //     .rangeRoundBands([0, w], 0.1);

                // that.x1 = d3.scale.ordinal()
                //     .domain(that.barName.map(function(d) { return d; }))
                //     .rangeRoundBands([0, that.x0.rangeBand()]) ;

                
                var bars = that.group.selectAll(".bars")
                    .data(layers);

                bars.attr("class","bars");
                bars.enter()
                        .append("g")
                        .attr("class", "bars");
//                        .attr("transform","translate("+that.columnMargin+",0)");

                var rect = bars.selectAll("rect")
                    .data(function(d,i){
                        return d.values;
                    });

                rect.enter()
                    .append("svg:rect")
                    .attr("class","rect");

                rect.attr("height", 0).attr("y", h)
                    .attr("fill", function(d){
                        // console.log(d.highlight);
                        return that.fillColor.colorPieMS(d);
                    })
                    .attr("fill-opacity", function (d,i) {
                        if(PykCharts.boolean(that.saturationEnable))     {
                            if(d.highlight) {
                                j--;
                                return 1;
                            }
                            if(j>1) {
                                j--;
                                return j/that.max_length;
                            } else {
                                j = that.max_length+1;
                                j--;
                                return j/that.max_length;
                            }
                        }
                    })
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-opacity",1)
                    .on('mouseover',function (d) {
                        that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.toolTextShow(d.tooltip ? d.tooltip : d.y);
                        that.mouseEvent.axisHighlightShow(d.name,options.selector + " " + ".axis-text","column");
                    })
                    .on('mouseout',function (d) {
                        that.mouseEvent.tooltipHide(d);
                        that.mouseEvent.axisHighlightHide(options.selector + " " + ".axis-text","column");
                     })
                    .on('mousemove', function (d) {
                        that.mouseEvent.tooltipPosition(d);
                    });

                rect.transition()
                    .duration(that.transitions.duration())
                    .attr("x", function(d){
                        return that.xScale(d.x)-x_factor;
                    })
                    .attr("width", function(d){
                        return that.xScale.rangeBand()+width_factor;
                    })
                    .attr("height", function(d){
                        return that.yScale(d.y);
                    })
                    .attr("y", function(d){
                        return h - that.yScale(d.y0 + d.y);
                    });

                bars.exit()
                    .remove();
                
                var xAxis_label = that.group.selectAll("text.axis-text")
                    .data(group_label_data);

                xAxis_label.enter()
                        .append("text")

                xAxis_label.attr("class", "axis-text")
                        .attr("x", function(d){
                            return d.x;
                        })
                        .attr("text-anchor", "middle")
                        .attr("fill",that.axis.x.labelColor)
                        .text(function(d){
                            return d.name;
                        });

                xAxis_label.exit().remove();
                if(that.axis.x.position==="top") {
                    if(that.axis.x.orient === "top") {
                        xAxis_label.attr("y", function () {
                            return -15;
                        });
                    } else if(that.axis.x.orient === "bottom") {
                        xAxis_label.attr("y", function () {
                            return 15;
                        });
                    }
                }
                if(that.axis.x.orient === "top") {
                    xAxis_label.attr("y", function () {
                        return h-15;
                    });
                } else if(that.axis.x.orient === "bottom") {
                    xAxis_label.attr("y", function () {
                        return h+15;
                    });
                }
                return this;
            },
            legends: function () {
                if(PykCharts.boolean(that.legends.enable)) {
                    var params = that.getParameters(),color;
                    // console.log(params);
                    color = params[0].color; 
                    params = params.map(function (d) {
                        return d.name;
                    });

                    params = jQuery.unique(params);
                    var j = 0,k = 0;
                    j = params.length;
                    k = params.length;                
                    
                    if(that.legends.display === "vertical" ) {
                        that.legend_svg.attr("height", (params.length * 30)+20);
                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        text_parameter1value = function (d,i) { return that.width - that.width/4 + 16; };
                        rect_parameter3value = function (d,i) { return that.width - that.width/4; };
                        var rect_parameter4value = function (d,i) { return i * 24 + 12;};
                        var text_parameter2value = function (d,i) { return i * 24 + 23;};
                    }
                    else if(that.legends.display === "horizontal") {
                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";
                        var text_parameter1value = function (d,i) { j--;return that.width - (j*100 + 75); };
                        text_parameter2value = 30;
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        var rect_parameter3value = function (d,i) { k--;return that.width - (k*100 + 100); };
                        rect_parameter4value = 18;
                    }

                    var legend = that.legends_group.selectAll("rect")
                                    .data(params);

                    legend.enter()
                            .append("rect");

                    legend.attr(rect_parameter1, rect_parameter1value)
                        .attr(rect_parameter2, rect_parameter2value)
                        .attr(rect_parameter3, rect_parameter3value)
                        .attr(rect_parameter4, rect_parameter4value)
                        .attr("fill", function (d) {
                            return that.fillColor.colorPieMS(color);
                        })
                        .attr("fill-opacity", function (d,i) {
                            if(PykCharts.boolean(that.saturationEnable)){
                                return (that.max_length-i)/that.max_length;
                            }
                        });

                    legend.exit().remove();

                    that.legends_text = that.legends_group.selectAll(".legends_text")
                        .data(params);
                    
                    that.legends_text
                        .enter()
                        .append('text')
                        .attr("class","legends_text")
                        .attr("fill","#1D1D1D")
                        .attr("pointer-events","none")
                        .style("font-family", "'Helvetica Neue',Helvetica,Arial,sans-serif")
                        .attr("font-size",12);

                    that.legends_text.attr("class","legends_text")
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   .attr("fill","black")
                    .attr(text_parameter1, text_parameter1value)
                    .attr(text_parameter2, text_parameter2value)
                    .text(function (d) { return d; });
                    
                    that.legends_text.exit()
                                    .remove();                
                }     
                return this;    
            } 
        }
        return optional;
    };

    //----------------------------------------------------------------------------------------
    // 6. Rendering groups:
    //----------------------------------------------------------------------------------------
    
    this.getGroups = function(){
        var groups = {};
        for(var i in that.the_bars){
            var bar = that.the_bars[i];
            if(!bar.id) continue;
            if(groups[bar.group]){
                groups[bar.group].push(bar.id);
            }else{
                groups[bar.group] = [bar.id];
            }
        }
        return groups;
    };

    //----------------------------------------------------------------------------------------
    // 10.Data Manuplation:
    //----------------------------------------------------------------------------------------

    // Data Helpers
    // Takes the flattened data and returns layers
    // Each layer is a separate category
    // The structure of the layer is made so that is plays well with d3.stack.layout()
    // Docs - https://github.com/mbostock/d3/wiki/Stack-Layout#wiki-values

    this.layers = function(the_bars){
        var layers = [];

        function findLayer(l){
            for(var i in layers){
                // console.log(layers[i])
                var layer = layers[i];
                if (layer.name == l) return layer;
            }
            return addLayer(l);
        }

        function addLayer(l){
            var new_layer = {
                "name": l,
                "values": []
            };
            layers.push(new_layer);
            return new_layer;
        }

        for(var i in the_bars){
            // console.log(the_bars[i])
            var bar = the_bars[i];
            if(!bar.id) continue;
            var id = bar.id;
            for(var k in bar){
                if(k === "id") continue;
                var icings = bar[k];
                for(var j in icings){
                    var icing = icings[j];
                    if(!icing.name) continue;
                    var layer = findLayer(icing.name);
                    layer.values.push({
                        "x": id,
                        "y": icing.val,
                        "color": icing.color,
                        "tooltip": icing.tooltip,
                        "group": that.keys[id],
                        "name": bar.group,
                        "highlight": icing.highlight
                    });
                }
            }
        }
        return layers;
    };

    // Traverses the JSON and returns an array of the 'bars' that are to be rendered
    this.flattenData = function(){
        var the_bars = [-1];
        that.keys = {};
        for(var i in that.data){
            var d = that.data[i];
            for(var cat_name in d){
                for(var j in d[cat_name]){
                    var id = "i" + i + "j" + j;
                    if(typeof d[cat_name][j] !== "object"){
                        continue;
                    }
                    var key = Object.keys(d[cat_name][j])[0];
                    that.keys[id] = key;
                    d[cat_name][j].id = id;
                    d[cat_name][j].group = cat_name;

                    the_bars.push(d[cat_name][j]);
                }
                the_bars.push(i); // Extra seperator element for gaps in segments
            }
        }
        return [the_bars, that.keys];
    };

    this.getParameters = function () {
        var p = [];
        for(var i in  that.the_layers){
            // console.log(that.the_layers[i]);
            if(!that.the_layers[i].name) continue;
            for(var j in that.the_layers[i].values) {
                if(!PykCharts.boolean(that.the_layers[i].values[j].y)) continue;
                var name = that.the_layers[i].values[j].group, color;
                if(options.optional && options.optional.colors) {
                    if(options.optional.colors.chartColor) {
                        color = that.chartColor;
                    }
                    else if(that.the_layers[i].values[0].color) {
                        color = that.the_layers[i].values[0].color;   
                    }
                }
                else {
                    color = that.chartColor;
                }

                p.push({
                    "name": name,
                    "color": color
                });
            }
        }
        return p;
    }
    this.emptygroups = function (data) {
        that.max_length = d3.max(data,function (d){
            var value = _.values(d);
            return value[0].length;
        });

        var new_data = _.map(data,function (d,i){
            var value = _.values(d);
            while(value[0].length < that.max_length) {
                var key = _.keys(d);
                var stack = { "name": "stack", "tooltip": "null", "color": "white", "val": 0, highlight: false };
                var group = {"group3":[stack]};
                data[i][key[0]].push(group);
                value = _.values(d);
            }
        });
        // console.log(data,"new_data");
        return data;
    };

    this.dataTransformation = function () {

        var data_tranform = [];
        that.barName = [];
        var data_length = that.data.length;   
        that.data.sort(function (a,b) {
            return b.y - a.y;
        }); 
        for(var i=0; i < data_length; i++) {
            var group = {},
                bar = {},
                stack;

            if(!that.data[i].group) {
                that.data[i].group = "group" + i;
            }

            if(!that.data[i].stack) {
                that.data[i].stack = "stack";
            }

            that.barName[i] = that.data[i].group;
            group[that.data[i].x] = [];      
            bar[that.data[i].group] = [];
            stack = { "name": that.data[i].stack, "tooltip": that.data[i].tooltip, "color": that.data[i].color, "val": that.data[i].y, highlight: that.data[i].highlight };

            if(i === 0) {
                data_tranform.push(group);
                data_tranform[i][that.data[i].x].push(bar);
                data_tranform[i][that.data[i].x][i][that.data[i].group].push(stack);
            } else {
                var data_tranform_lenght = data_tranform.length;
                var j=0;
                for(j=0;j < data_tranform_lenght; j++) {
                    if ((_.has(data_tranform[j], that.data[i].x))) {
                        var barr = data_tranform[j][that.data[i].x],
                            barLength = barr.length,
                            k = 0;

                        for(k =0; k<barLength;k++) {
                            if(_.has(data_tranform[j][that.data[i].x][k],that.data[i].group)) {
                                break;
                            }
                        }
                        if(k < barLength) {
                            data_tranform[j][that.data[i].x][k][that.data[i].group].push(stack);                   
                        } else {
                            data_tranform[j][that.data[i].x].push(bar);
                            data_tranform[j][that.data[i].x][k][that.data[i].group].push(stack);                      
                        }
                        break;
                    }
                }
                if(j === data_tranform_lenght) {    
                    data_tranform.push(group);
                    data_tranform[j][that.data[i].x].push(bar);
                    data_tranform[j][that.data[i].x][0][that.data[i].group].push(stack);
                }
            }
        }
        that.barName = _.unique(that.barName);

        return data_tranform;
    };
    return this;
};

PykCharts.multiD.scatterPlot = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    
    this.execute = function() {
        that = new PykCharts.multiD.processInputs(that, options, "scatterplot");
        if(that.mode === "default") {
            that.k.loading();
        }
        var multiDimensionalCharts = theme.multiDimensionalCharts,
            stylesheet = theme.stylesheet,
            optional = options.optional;
        // that.enableCrossHair = optional && optional.enableCrossHair ? optional.enableCrossHair : multiDimensionalCharts.enableCrossHair;
        that.multiD = new PykCharts.multiD.configuration(that);
        // that.grid = options.chart && options.chart.grid ? options.chart.grid : stylesheet.chart.grid;
        // that.grid.yEnabled = options.chart && options.chart.grid && options.chart.grid.yEnabled ? options.chart.grid.yEnabled : stylesheet.chart.grid.yEnabled;
        // that.grid.xEnabled = options.chart && options.chart.grid && options.chart.grid.xEnabled ? options.chart.grid.xEnabled : stylesheet.chart.grid.xEnabled;
        that.multiple_containers = optional && optional.multiple_containers && optional.multiple_containers.enable ? optional.multiple_containers.enable : multiDimensionalCharts.multiple_containers.enable;
        that.bubbleRadius = options.scatterplot && _.isNumber(options.scatterplot.radius) ? options.scatterplot.radius : multiDimensionalCharts.scatterplot.radius;
        that.zoomedOut = true;
        that.radius_range = [20,50];
        d3.json(options.data, function (e, data) {
            that.data = data;
            $(that.selector+" #chart-loader").remove();
            var a = new PykCharts.multiD.scatterplotFunction(options,that,"scatterplot");
            a.render();
        });
    };
};

PykCharts.multiD.pulse = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    
    this.execute = function() {
        that = new PykCharts.multiD.processInputs(that, options, "pulse");
        if(that.mode === "default") {
            that.k.loading();
        }
        var multiDimensionalCharts = theme.multiDimensionalCharts,
            stylesheet = theme.stylesheet,
            optional = options.optional;
        // that.enableCrossHair = optional && optional.enableCrossHair ? optional.enableCrossHair : multiDimensionalCharts.enableCrossHair;
        that.multiD = new PykCharts.multiD.configuration(that);
        that.multiple_containers = optional && optional.multiple_containers && optional.multiple_containers.enable ? optional.multiple_containers.enable : multiDimensionalCharts.multiple_containers.enable;
        that.bubbleRadius = optional && optional.scatterplot && _.isNumber(optional.scatterplot.radius) ? optional.scatterplot.radius : multiDimensionalCharts.scatterplot.radius;
        that.zoomedOut = true;
        that.radius_range = [4,14];
        d3.json(options.data, function (e, data) {
            that.data = data;
            $(that.selector+" #chart-loader").remove();
            var a = new PykCharts.multiD.scatterplotFunction(options,that,"pulse");
            a.render();
        });
    };
};
PykCharts.multiD.scatterplotFunction = function (options,chartObject,type) {
    var that = chartObject;
    that.refresh = function () {
        d3.json(options.data, function (e, data) {
            that.data = data;
            that.mapGroupData = that.multiD.mapGroup(that.data);
            console.log("hey");
            that.optionalFeatures()
                    .createScatterPlot()
                    .legends()
                    .label()
                    .ticks();
        });
    };

    this.render = function () {
        that.mapGroupData = that.multiD.mapGroup(that.data);
        that.fillChart = new PykCharts.Configuration.fillChart(that);      
        
        that.border = new PykCharts.Configuration.border(that);
    
        if(that.mode === "default") {
            that.k.title()
                .subtitle();
            
            that.data_group = jQuery.unique(that.data.map(function (d) {
                return d.group;
            }));

            that.no_of_groups = 1;
            
            if(PykCharts.boolean(that.multiple_containers) && type === "scatterplot") {
                that.no_of_groups = that.data_group.length;
                that.w = that.width/4;
                that.height = that.height/2;
                that.margin.left = 25;
                that.margin.right = 15;
                that.radius_range = [20,35];
                for(i=0;i<that.no_of_groups;i++){
                    that.new_data = [];
                    for(j=0;j<that.data.length;j++) {
                        if(that.data[j].group === that.data_group[i]) {
                            that.new_data.push(that.data[j]);
                        }
                    }
                    that.k.positionContainers(that.legends,that);

                    that.k.makeMainDiv(that.selector,i);
                    that.optionalFeatures()
                        .legendsContainer(i)
                        .svgContainer(i);

                    that.k.liveData(that)
                        .tooltip();

                    that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
                    that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range); 

                    that.optionalFeatures().createScatterPlot()
                        .legends(i)
                        .label()
                        .ticks();
                        // .crossHair();

                    that.k.xAxis(that.svgContainer,that.xGroup,that.x)
                        .yAxis(that.svgContainer,that.yGroup,that.y)
                        // .yGrid(that.svgContainer,that.group,that.y)
                        // .xGrid(that.svgContainer,that.group,that.x);
                    if((i+1)%4 === 0 && i !== 0) {
                        that.k.emptyDiv();
                    }
                }
                that.k.emptyDiv(); 
            } else {
                that.w = that.width;
                that.new_data = that.data;
                that.k.makeMainDiv(that.selector,1);
                that.optionalFeatures()
                    .legendsContainer(1)
                    .svgContainer(1);

                that.k.liveData(that)
                    .tooltip();

                that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
                // that.k.positionContainers(that.legends,that);
                that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range); 
                
                that.optionalFeatures().createScatterPlot()
                    .legends()
                    .label()
                    .zoom()
                    .ticks();
                    // .crossHair();


                that.k.xAxis(that.svgContainer,that.xGroup,that.x)
                    .yAxis(that.svgContainer,that.yGroup,that.y)
                    // .yGrid(that.svgContainer,that.group,that.y)
                    // .xGrid(that.svgContainer,that.group,that.x);
            }

            that.k.credits()
                .dataSource();
            that.optionalFeatures()
                .zoom();

        } else if (that.mode === "infographics") {
            that.radius_range = [7,18];
            that.new_data = that.data;
            that.w = that.width
            that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range);
            that.k.tooltip()
                .makeMainDiv(that.selector,1);
            that.optionalFeatures()
                    .svgContainer(1);
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
            that.optionalFeatures().createScatterPlot()
                // .crossHair();

            that.k.xAxis(that.svgContainer,that.xGroup,that.x)
                .yAxis(that.svgContainer,that.yGroup,that.y)
        }
    };

    that.optionalFeatures = function () {
        var optional = {
            svgContainer :function (i) {
                $(options.selector + " #tooltip-svg-container-" + i).css("width",that.w);
                $(options.selector).attr("class","PykCharts-weighted")
                that.svgContainer = d3.select(options.selector + " #tooltip-svg-container-" + i)
                    .append('svg')
                    .attr("width",that.w)
                    .attr("height",that.height)
                    .attr("id","svgcontainer" + i)
                    .attr("class","svgcontainer")
                    .style("background-color",that.bg);

                that.group = that.svgContainer.append("g")
                    .attr("transform","translate("+(that.margin.left)+","+(that.margin.top)+")")
                    .attr("id","main");

                that.group1 = that.svgContainer.append("g")
                    .attr("transform","translate("+(that.margin.left)+","+(that.margin.top)+")")
                    .attr("id","main2");
                if(PykCharts.boolean(that.axis.x.enable)) {
                    that.xGroup = that.group.append("g")
                        .attr("class", "x axis")
                        .style("stroke","black");
                    }
                if(PykCharts.boolean(that.axis.y.enable)){
                    that.yGroup = that.group.append("g")
                        .attr("class", "y axis")
                        .style("stroke","blue");
                }

                // if(PykCharts.boolean(that.grid.xEnabled)) {
                //     that.group.append("g")
                //         .attr("id","xgrid")
                //         .attr("class","x grid-line");
                // }

                // if(PykCharts.boolean(that.grid.yEnabled)) {
                //     that.group.append("g")
                //         .attr("id","ygrid")
                //         .attr("class","y grid-line");
                // }

                that.clip = that.group.append("svg:clipPath")
                            .attr("id", "clip")
                            .append("svg:rect")
                            .attr("width",(that.w-that.margin.left-that.margin.right))
                            .attr("height", that.height-that.margin.top-that.margin.bottom);

                that.chartBody = that.group.append("g")
                            .attr("clip-path", "url(#clip)");

                return this;
            },
            legendsContainer : function (i) {
                if (PykCharts.boolean(that.legends.enable) && PykCharts.boolean(that.size.enable) && that.mapGroupData[1]) {
                    that.legendsContainer = d3.select(that.selector + " #tooltip-svg-container-" + i)
                        .append('svg')
                        .attr('width',that.w)
                        .attr('height',50)
                        .attr('class','legends')
                        .attr('id','legendscontainer');

                    that.legendsGroup = that.legendsContainer
                        .append("g")
                                .attr('id',"legends")
                                .attr("transform","translate(0,20)");
                }
                return this;
            },
            createScatterPlot : function () {
                that.weight = _.map(that.new_data, function (d) {
                    return d.weight;
                });

                that.weight = _.reject(that.weight,function (num) {
                    return num == 0;
                });

                that.max_radius = that.sizes(d3.max(that.weight));

                that.sorted_weight = that.weight.slice(0);
                that.sorted_weight.sort(function(a,b) { return a-b; });
                
                that.group.append("text")
                    .attr("fill", "black")
                    .attr("text-anchor", "end")
                    .attr("x", that.w - 70)
                    .attr("y", that.height + 40)
                    .text(that.axis.x.label);

                if(that.zoomedOut === true) {
                    var x_domain = d3.extent(that.data, function (d) {
                            return d.x;
                        });
                    var y_domain = d3.extent(that.data, function (d) {
                            return d.y;
                        })
                    var x_domain = [],y_domain,max,min,type;
                    var x_domain,x_data = [],y_data = [],y_range,x_range,y_domain;

                    if(that.yAxisDataFormat === "number") {
                        y_domain = d3.extent(that.data, function(d) { return d.y });
                        y_data = that.k._domainBandwidth(y_domain,2, function () {
                            var scale1 = d3.scale.linear()
                                .range([that.height - that.margin.top - that.margin.bottom, 0])
                                .domain(y_domain);
                            yinvert = scale1.invert(that.radius_range[1]);
                            yinvert = y_domain[1] - yinvert;
                            return yinvert;
                        });
                        y_range = [that.height - that.margin.top - that.margin.bottom, 0];
                        that.y = that.k.scaleIdentification("linear",y_data,y_range);
                        that.top_margin = 0;

                    } else if(that.yAxisDataFormat === "string") {
                        that.data.forEach(function(d) { y_data.push(d.y); });
                        y_range = [0,that.height - that.margin.top - that.margin.bottom];
                        that.y = that.k.scaleIdentification("ordinal",y_data,y_range,0);
                        that.top_margin = (that.y.rangeBand() / 2);

                    } else if (that.yAxisDataFormat === "time") {
                        y_data = d3.extent(that.data, function (d) { return new Date(d.x); });
                        y_range = [that.height - that.margin.top - that.margin.bottom, 0];
                        that.y = that.k.scaleIdentification("time",y_data,y_range);
                        that.top_margin = 0;
                    }
                    if(that.xAxisDataFormat === "number") {
                        x_domain = d3.extent(that.data, function(d) { return d.x; });
                        x_data = that.k._domainBandwidth(x_domain,2, function () {
                            var scale1 = d3.scale.linear()
                                .range([0 ,that.w - that.margin.left - that.margin.right])
                                .domain(x_domain);
                            xinvert = scale1.invert(that.radius_range[1]);
                            xinvert = x_domain[1] - xinvert;
                            return xinvert;
                        });
                        x_range = [0 ,that.w - that.margin.left - that.margin.right];
                        that.x = that.k.scaleIdentification("linear",x_data,x_range);
                        that.left_margin = 0;

                    } else if(that.xAxisDataFormat === "string") {
                        that.data.forEach(function(d) { x_data.push(d.x); });
                        x_range = [0 ,that.w - that.margin.left - that.margin.right];
                        that.x = that.k.scaleIdentification("ordinal",x_data,x_range,0);
                        that.left_margin = (that.x.rangeBand()/2);

                    } else if (that.xAxisDataFormat === "time") {
                        max = d3.max(that.data, function(d) { return d3.max(d.data, function(k) { return new Date(k.x); }); });
                        min = d3.min(that.data, function(d) { return d3.min(d.data, function(k) { return new Date(k.x); }); });
                        x_data = [min,max];
                        x_range = [0 ,that.w - that.margin.left - that.margin.right];
                        that.x = that.k.scaleIdentification("time",x_data,x_range);
                        that.new_data[0].data.forEach(function (d) {
                            d.x = new Date(d.x);
                        });
                        that.left_margin = 0;
                    }

                    if(PykCharts.boolean(that.zoom.enable) && !(that.yAxisDataFormat==="string" || that.xAxisDataFormat==="string") && (that.mode === "default")) {
                        that.svgContainer
                            .call(d3.behavior.zoom()
                            .x(that.x)
                            .y(that.y)
                            .scaleExtent([1, 10])
                            .on("zoom", zoomed));
                    }
                    that.optionalFeatures().plotCircle();
                }
                return this;
            },
            legends : function (index) {
                if (PykCharts.boolean(that.legends.enable) && PykCharts.boolean(that.size.enable) && that.mapGroupData[1]) {
                    var unique = _.uniq(that.sorted_weight);
                    
                    var k = 0;
                    var l = 0;
                    if(options.optional.legends.display === "vertical" ) {
                        that.legendsContainer.attr("height", (that.mapGroupData[0].length * 30)+20);
                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        text_parameter1value = function (d,i) { return that.w - that.w/4 + 16; };
                        rect_parameter3value = function (d,i) { return that.w - that.w/4; };
                        var rect_parameter4value = function (d,i) { return i * 24 + 12;};
                        var text_parameter2value = function (d,i) { return i * 24 + 23;};

                    } else if(options.optional.legends.display === "horizontal") {
                        // that.legendsContainer.attr("height", (k+1)*70);
                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";
                        k = 0, l = 0;

                        var text_parameter1value = function (d,i) { 
                            if( i === 0) {
                                l = 0;
                            }
                            if((that.w - (i*100 + 75)) > 0) {
                                return that.w - (i*100 + 75); 
                            } else if ((that.w - (l*100 + 75)) < that.w) {
                                l++;
                                return that.w - ((l-1)*100 + 75); 
                            } else {
                                l = 0;
                                l++;
                                return that.w - ((l-1)*100 + 75); 
                            }
                        };

                        text_parameter2value = function (d,i) {
                            if(i === 0) {
                                k = 0, l = 0;
                            }
                            if((that.w - (i*100 + 75)) > 0) {
                            } else if ((that.w - (l*100 + 75)) < that.w) {
                                if(l === 0) {
                                    k++;
                                }
                                l++;
                            } else {
                                l = 0;
                                l++;
                                k++;    
                            }
                        return k * 24 + 23;  
                        }; 
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        var rect_parameter3value = function (d,i) {      
                            if( i === 0) {
                                k = 0, l = 0;
                            }
                            if((that.w - (i*100 + 100)) >= 0) {
                                return that.w - (i*100 + 100); 
                            } else if ((that.w - (i*100 + 100)) < that.w) {
                                k++;
                                if(l === 0) {
                                    that.legendsContainer.attr("height", (k+1)*50);
                                }
                                l++;
                                return that.w - ((l-1)*100 + 100); 
                            } else {
                                l = 0;
                                l++;
                                k++;
                                return that.w - ((l-1)*100 + 100); 
                            }
                        };
                        rect_parameter4value = function (d,i) {
                            if(i === 0) {
                                k = 0, l = 0;
                            }
                            if((that.w - (i*100 + 75)) > 0) {
                            } else if ((that.w - (l*100 + 75)) < that.w) {
                                if( l == 0) {
                                    k++;
                                }
                                l++;
                            } else {
                                l = 0;
                                l++;
                                k++;    
                            }
                            // console.log(k*24+12, "k", d.group);
                        return k * 24 + 12;;  
                        } 
                    };
                    var legend;
                    if(PykCharts.boolean(that.multiple_containers)){
                        var abc =[];
                        abc.push(that.mapGroupData[0][index]);
                        legend = that.legendsGroup.selectAll("rect")
                            .data(abc);
                        that.legends_text = that.legendsGroup.selectAll(".legends_text")
                            .data(abc);
                    } else {
                        legend = that.legendsGroup.selectAll("rect")
                                .data(that.mapGroupData[0]);
                        that.legends_text = that.legendsGroup.selectAll(".legends_text")
                            .data(that.mapGroupData[0]);
                    }
                    // console.log(that.mapGroupData[0]);
                    legend.enter()
                            .append("rect");

                    legend.attr(rect_parameter1, rect_parameter1value)
                        .attr(rect_parameter2, rect_parameter2value)
                        .attr(rect_parameter3, rect_parameter3value)
                        .attr(rect_parameter4, rect_parameter4value)
                        .attr("fill", function (d) {
                             // console.log(d);
                        //      console.log(that.fillChart.colorPieW(d));
                            return that.fillChart.colorPieW(d);
                        })
                        .attr("opacity", function (d) {
                            return 0.6;
                        //    return that.multiD.opacity(d,that.sorted_weight,that.data);
                        });

                    legend.exit().remove();

                    that.legends_text
                        .enter()
                        .append('text')
                        .attr("class","legends_text")
                         .attr("fill",that.legendsText.color)
                        .attr("pointer-events","none")
                        .style("font-family", that.legendsText.family)
                        .attr("font-size",that.legendsText.size);

                    that.legends_text.attr("class","legends_text")
                        .attr("fill","black")
                        .attr(text_parameter1, text_parameter1value)
                        .attr(text_parameter2, text_parameter2value)
                        .text(function (d) { return d.group });

                    that.legends_text.exit()
                                    .remove();
                }
                return this;
            },
            // legends : function (position) {
            //     if(PykCharts.boolean(that.legends) && !(PykCharts.boolean(that.size.enable))) {
            //         var xPosition, textXPosition, roundOff, opacity;
            //         var unique = _.uniq(that.sorted_weight);
            //         var x, y, k;
            //         xPosition = function (d , i) { return (i)*(90 * that.width / unique.length)/100; };
            //         yPosition = function (d , i) { return (i)*(90 * that.height / unique.length)/100; };
            //         textXPosition = function (d,i) { return (++i*(90*that.width /unique.length)/100-5); };
            //         textYPosition = function (d,i) { return (++i*(90*that.height /unique.length)/100-5); };
            //         roundOff = function (d,i) { return Math.round(d); };
            //         opacity = function (d){ return that.multiD.opacity(d,that.weight,that.data); };
            //         var start, height, width, xtext, ytext;

            //         var renderLengends = function (start,height,width,xtext,ytext,position,textPosition) {
            //             // for(k=1;k<=unique.length;k++)
            //             // {
            //                 x = that.legendsGroup.selectAll("rect")
            //                     .data(unique);

            //                 x.enter()
            //                     .append("rect");

            //                 x.attr(start, position)
            //                     .attr("height", height)
            //                     .attr("width", width)
            //                     .attr("fill",function(d) { return that.fillChart.colorPieW(d); })
            //                     .attr("opacity",opacity);

            //                 x.exit().remove();

            //                 y = that.legendsGroup.selectAll(".leg")
            //                      .data(unique);

            //                 y.enter()
            //                     .append("text");

            //                 y.attr("class","leg")
            //                     .attr("x",xtext)
            //                     .attr("y",ytext)
            //                     .style("font-size", 14)
            //                     .style("font-family", "''Helvetica Neue',Helvetica,Arial,sans-serif',Helvetica,Arial,sans-serif");

            //                 y.text(roundOff);

            //                 y.exit().remove();
            //             // }

            //         };
            //         if(position == "top" || position == "bottom") {
            //             start = "x";
            //             height = 10;
            //             width = (90*that.width/unique.length)/100;
            //             xtext = textXPosition;
            //             ytext = 25;
            //             renderLengends(start,height,width,xtext,ytext,xPosition);
            //         } else if(position == "left" || position == "right") {
            //             that.legendsContainer.attr("width",100).attr("height",that.height);
            //             that.legendsGroup.attr("transform","translate(20,0)");
            //             start = "y";
            //             height = (90*that.height/unique.length)/100;
            //             width = 10;
            //             xtext = 15;
            //             ytext = textYPosition;
            //             renderLengends(start,height,width,xtext,ytext,yPosition);
            //         }
            //     }
            //     return this;
            // },
            ticks : function () {
                if(PykCharts.boolean(that.enableTicks)) {
                    var scattrText = that.group1.selectAll("text")
                        .data(that.new_data);

                    scattrText.enter()
                        .append("text");

                    scattrText.
                        attr("transform",function (d) {
                            return "translate(" + that.x(d.x) + "," + that.y(d.y) + ")";
                        })
                        .style("text-anchor", "middle")
                        .style("font-family", that.label.family)
                        .style("font-size",that.label.size)
                        .attr("pointer-events","none")
                        .attr("dx",-1)
                        .attr("dy",-12);

                    scattrText.text(function (d) { return d.name; });

                    scattrText.exit().remove();
                }
                return this;
            },
            zoom : function () {
                // if(PykCharts.boolean(that.zoom) && !(that.yAxisDataFormat==="string" || that.xAxisDataFormat==="string")) {
                //     $(that.selector).css("position","relative");
                //     that.zoomOutButton = d3.select(options.selector)
                //         .append("input")
                //             .attr("type","button")
                //             .attr("value","Zoom Out")
                //             .attr("id","zoomOut")
                //             .style("position","absolute")
                //             .style("left",that.width)
                //             .style("top", that.margin.top + 50)
                //             .style("height","20")
                //             .on("click",function () {
                //                 that.zoomedOut = true;
                //                 that.optionalFeatures().createScatterPlot();
                //                 that.k.xAxis(that.svgContainer,that.xGroup,that.x)
                //                     .yAxis(that.svgContainer,that.yGroup,that.y);
                                    // .yGrid(that.svgContainer,that.group,that.y)
                                    // .xGrid(that.svgContainer,that.group,that.x)
 //                           });
   //             }
                return this;
            },
            plotCircle : function () {
                
                that.circlePlot = that.chartBody.selectAll(".dot")
                                     .data(that.new_data);

                that.circlePlot.enter()
                            .append("circle")
                            .attr("class", "dot");

                that.circlePlot
                    .attr("r", function (d) { return that.sizes(d.weight); })
                    .attr("cx", function (d) { return (that.x(d.x)+that.left_margin); })
                    .attr("cy", function (d) { return (that.y(d.y)+that.top_margin); })
                    .style("fill", function (d) { return that.fillChart.colorPieW(d); })
                    .style("fill-opacity", function (d) { return that.multiD.opacity(d.weight,that.weight,that.data); })
                    .attr("stroke", that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-opacity",1)
                    .on('mouseover',function (d) {
                        tooltipText = d.tooltip ? d.tooltip : "<table class='PykCharts'><tr><th>"+d.name+"</th></tr><tr><td>X</td><td>"+d.x+"</td></tr><tr><td>Y</td><td>"+d.y+"</td></tr></table>";
                        that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.toolTextShow(tooltipText);
                        if(PykCharts.boolean(that.size.enable)){
                            d3.select(this).style("fill-opacity",1);
                        }
                    })
                    .on('mouseout',function (d) {
                        that.mouseEvent.tooltipHide(d);
                        if(PykCharts.boolean(that.size.enable)) {
                            d3.selectAll(".dot").style("fill-opacity",0.5);
                        }
                    })
                    .on('mousemove', function (d) {
                        that.mouseEvent.tooltipPosition(d);
                    });

                that.circlePlot.exit().remove();
                return this;
            },
            label : function () {
                if(PykCharts.boolean(that.label.size)) {
                    that.circleLabel = that.chartBody.selectAll(".text")
                        .data(that.new_data);

                    that.circleLabel.enter()
                        .append("text")
                        .attr("class","text");

                    that.circleLabel
                        .attr("x", function (d) { return (that.x(d.x)+that.left_margin); })
                        .attr("y", function (d) { return (that.y(d.y)+that.top_margin + 5); })
                        .attr("text-anchor","middle")
                        .attr("pointer-events","none")
                        .style("font-weight", that.label.weight)
                        .style("font-size", that.label.size)
                        .attr("fill", that.label.color)
                        .style("font-family", that.label.family)
                        .text(function (d) {
                            return d.weight;
                        })
                        .text(function (d) {
                            if((this.getBBox().width < (that.sizes(d.weight) * 2)) && (this.getBBox().height < (that.sizes(d.weight) * 2))) {
                                return d.weight;
                            } else {
                                return "";
                            }
                        });
                    that.circleLabel.exit()
                        .remove();
                }
                return this;
            },            
            // crossHair : function () {
            //     if(PykCharts.boolean(that.enableCrossHair)) {

            //         var horizontalLine = that.svgContainer.append("line")
            //             .attr("x1", that.margin.left)
            //             .attr("y1", that.margin.top)
            //             .attr("x2", that.w-that.margin.right)
            //             .attr("y2", that.margin.top)
            //             .attr("id","horizontal-cursor")
            //             .attr("pointer-events","none")
            //             .attr("class","line-cursor");

            //         var verticalLine = that.svgContainer.append("line")
            //             .attr("x1", that.margin.left)
            //             .attr("y1", that.margin.top)
            //             .attr("x2", that.margin.left)
            //             .attr("y2", that.height-that.margin.bottom)
            //             .attr("id", "vertical-cursor")
            //             .attr("pointer-events","none")
            //             .attr("class","line-cursor");

            //         $(that.selector + " " +"#horizontal-cursor").hide();
            //         $(that.selector + " " +"#vertical-cursor").hide();

            //         that.svgContainer.on("mousemove",function () {
            //             id = this.id
    
            //             $(that.selector + " " +"#horizontal-cursor").show();
            //             $(that.selector + " " +"#vertical-cursor").show();

            //             var i,
            //                 x = (d3.event.pageX) - ($(that.selector+ " #" + id).offset().left),
            //                 y = (d3.event.pageY) - ($(that.selector+ " #" + id).offset().top);

            //             d3.select(that.selector + " #" + id).style('cursor', 'none');

            //             if(x >= that.margin.left && x <=(that.w-that.margin.right)) { 

            //                 d3.select(options.selector+" #"+ id +' #vertical-cursor')
            //                     .attr("x1",x)
            //                     .attr("x2",x);
            //             }
            //             if(y >= that.margin.top && y <=(that.height-that.margin.bottom)) {
            //                 d3.selectAll(options.selector+" "+'#horizontal-cursor')
            //                     .attr("y1",y)
            //                     .attr("y2",y);
            //             }
            //         });

            //         that.svgContainer.on("mouseout",function () {
            //             $(that.selector + " " +"#horizontal-cursor").hide();
            //             $(that.selector + " " +"#vertical-cursor").hide();                        
            //         });
                    
            //     }
            //     return this;
            // }

        };
        return optional;
    };

    function zoomed () {

            that.zoomedOut = false;

            // that.k.isOrdinal(that.svgContainer,".x.axis",that.x);
//            that.k.isOrdinal(that.svgContainer,".x.grid",that.x);

            // that.k.isOrdinal(that.svgContainer,".y.axis",that.y);
  //          that.k.isOrdinal(that.svgContainer,".y.grid",that.y);

            that.optionalFeatures().plotCircle().label();
            d3.select("#"+this.id)
                .selectAll(".dot")
                .attr("r", function (d) {
                    return that.sizes(d.weight)*d3.event.scale;
                });
    };

    // this.fullScreen = function () {
    //     var modalDiv = d3.select(that.selector).append("div")
    //         .attr("id","abc")
    //         .attr("visibility","hidden")
    //         .attr("class","clone")
    //         .append("a")
    //         .attr("class","b-close")
    //             .style("cursor","pointer")
    //             .style("position","absolute")
    //             .style("right","10px")
    //             .style("top","5px")
    //             .style("font-size","20px")
    //             .html("Close");
    //     var scaleFactor = 1.2;
    //     var w = that.width;
    //     var h = that.height;
    //     if(h>=500 || w>900){
    //         scaleFactor = 1;
    //     }
    //     $(".legends").clone().appendTo("#abc");
    //     $(".svgcontainer").clone().appendTo("#abc");
    //     if(that.legends.display==="vertical"){
    //         d3.select(".clone #legendscontainer").attr("width",screen.width-200).attr("height", that.series.length*40);
    //     }else if(that.legends.display === "horizontal") {
    //         d3.select(".clone #legendscontainer").attr("width",screen.width-200).attr("height", 60);
    //     }
    //     d3.select(".clone #legends").attr("transform","scale("+scaleFactor+")");
    //     d3.select(".clone #container").attr("width",screen.width-200).attr("height",screen.height-200).style("display","block");
    //     d3.select(".clone svg #main").attr("transform","scale("+scaleFactor+")translate("+(that.margin.left)+","+that.margin.top+")");
    //     d3.select(".clone svg #horizontal-cursor").remove();
    //     d3.select(".clone svg #vertical-cursor").remove();
    //     $(".clone").css({"background-color":"#fff","border-radius":"15px","color":"#000","display":"none","padding":"20px   ","min-width":screen.availWidth-100,"min-height":screen.availHeight-150,"visibility":"visible","align":"center"});
    //     $("#abc").bPopup({position: [30, 10],transition: 'fadeIn',onClose: function(){ $('.clone').remove(); }});
    // };
};
PykCharts.multiD.spiderWeb = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function () {
        if(that.mode === "default") {
            that.k.loading();
        }
        that = new PykCharts.multiD.processInputs(that, options, "spiderweb");
        that.multiD = new PykCharts.multiD.configuration(that);
        that.axisTitle = options.optional && options.optional.axisTitle ? options.optional.axisTitle : theme.multiDimensionalCharts.spiderweb.axisTitle;
        that.bubbleRadius = options.spiderweb && _.isNumber(options.spiderweb.radius) ? options.spiderweb.radius : theme.multiDimensionalCharts.spiderweb.radius;
        that.outerRadius = options.spiderweb && _.isNumber(options.spiderweb.outer_radius) ? options.spiderweb.outer_radius : theme.multiDimensionalCharts.spiderweb.radius; 
        that.innerRadius = 0;
        that.enableTicks = options.optional && options.optional.enableTicks ? options.optional.enableTicks : theme.multiDimensionalCharts.spiderweb.enableTicks;        

        d3.json(options.data, function (e, data) {
            that.data = data;
            $(that.selector+" #chart-loader").remove();
            that.render();
        });
    };

    that.refresh = function () {
        d3.json(options.data, function (e, data) {
            that.data = data;
            that.mapGroupData = that.multiD.mapGroup(that.data); 
            that.optionalFeatures()
                .createSpiderWeb()
                .legends()
                .axisTicks()
                .axisTitle();
        });
    };

    this.render = function () {
        that.radius_range = [7,18];
        that.fillChart = new PykCharts.Configuration.fillChart(that);
        that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range);
        that.border = new PykCharts.Configuration.border(that);
        that.mapGroupData = that.multiD.mapGroup(that.data);
        if(that.mode === "default") {
            that.k.title();
            that.k.subtitle()
                .makeMainDiv(that.selector,1);
            
            that.optionalFeatures()
                .legendsContainer(1)
                .svgContainer(1);

            that.k
                .liveData(that)
                .tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

            that.optionalFeatures()
                .createSpiderWeb()
                .axisTicks()
                .axisTitle()
                .legends();

              that.k.credits()
                .dataSource();

        } else if (that.mode==="infographics") {
            that.optionalFeatures().svgContainer()
                .createSpiderWeb()
                .axisTicks()
                .axisTitle();

            that.k.tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
       }              
    };

    this.degrees = function (radians) {
      return (radians / Math.PI * 180 - 90);
    };

    this.optionalFeatures = function () {
        var that =this;
        var status;
        var optional = {
            svgContainer: function (i) {
                $(that.selector).attr("class","PykCharts-spider-web");
                that.svg = d3.select(that.selector + " #tooltip-svg-container-" + i)
                    .append("svg")
                    .attr("class","svgcontainer")
                    .attr("id","svgcontainer")
                    .attr("width", that.width)
                    .attr("height", that.height)
                    .style("background-color",that.bg);
                    
                that.group = that.svg.append("g")
                    .attr("id","spidergrp")
                    .attr("transform", "translate(" + that.width / 2 + "," + that.height / 2 + ")");

                return this;               
            },
            legendsContainer : function (i) {
                if (PykCharts.boolean(that.legends.enable) && PykCharts.boolean(that.size.enable) && that.mapGroupData[1]) {
                    that.legendSvg = d3.select(that.selector + " #tooltip-svg-container-" + i)
                        .append("svg")
                        .attr("class","legendsvg")
                        .attr("id","legendsvg")
                        .attr("width",that.width)
                        .attr("height",50);

                    that.legendsgrp = that.legendSvg.append("g")
                        .attr("class","legendgrp")
                        .attr("id","legendgrp");
                } 
                return this;
            },
            createSpiderWeb: function () {
                var i;
                that.group_arr = [];
                that.unique_arr = [];
                for(j=0; j<that.data.length; j++) {
                    that.group_arr[j] = that.data[j].group;
                }
                that.uniq_arr = _.uniq(that.group_arr);
                var len = that.uniq_arr.length;
                that.new_data = [];

                for (k=0; k<len; k++) {
                    that.new_data[k] = {
                        name: that.uniq_arr[k],
                        data: []
                    };                   
                    for (l=0; l<that.data.length; l++) {
                        if (that.uniq_arr[k] === that.data[l].group) {
                            that.new_data[k].data.push({
                                x: that.data[l].x,
                                y: that.data[l].y,
                                weight: that.data[l].weight,
                                color: that.data[l].color,
                                tooltip: that.data[l].tooltip
                            });
                        } 
                    }
                }
                var uniq = that.new_data[0].data;    
                                
                that.max = d3.max(that.new_data, function (d,i) { return d3.max(d.data, function (k) { return k.y; })});
                that.min = d3.min(that.new_data, function (d,i) { return d3.min(d.data, function (k) { return k.y; })});

                that.yScale = d3.scale.linear()
                    .domain([that.min,that.max])
                    .range([that.innerRadius, that.outerRadius]);
                that.yDomain = [], that.nodes = [];

                for (i=0;i<that.new_data.length;i++){
                    var t = [];
                    for (j=0;j<that.new_data[i].data.length;j++) {
                        t[j] = that.yScale(that.new_data[i].data[j].y);
                    }
                    that.yDomain[i] = t;
                }
                for (i=0;i<that.new_data.length;i++){
                    that.y = d3.scale.linear()
                        .domain(d3.extent(that.yDomain[i], function(d) { return d; }))
                        .range([0.1,0.9]);
                    var xyz = [];
                    for (j=0;j<uniq.length;j++) {
                        xyz[j] = {
                            x: j,
                            y: that.y(that.yDomain[i][j])
                        }
                    }
                    that.nodes[i] = xyz;
                }
                for (m =0; m<that.new_data.length; m++) {
                    var toolTip = [];
                    for (j=0; j<that.new_data[m].data.length;j++) {
                        toolTip[j] = that.new_data[m].data[j].tooltip;
                    }
                    that.angle = d3.scale.ordinal().domain(d3.range(that.new_data[m].data.length+1)).rangePoints([0, 2 * Math.PI]);
                    that.radius = d3.scale.linear().range([that.innerRadius, that.outerRadius]);

                    that.yAxis = [];
                    for (i=0;i<that.new_data[m].data.length;i++){
                        that.yAxis.push(
                            {x: i, y: 0.25},
                            {x: i, y: 0.5},
                            {x: i, y: 0.75},
                            {x: i, y: 1}
                        );
                    }

                    var target;
                    var grids = [];
                    for (i=0;i<that.yAxis.length;i++) {               
                        if (i<(that.yAxis.length-4)) {
                            target = that.yAxis[i+4];
                        } else {
                            target = that.yAxis[i - that.yAxis.length + 4];
                        }
                        grids.push({source: that.yAxis[i], target: target});
                    }

                    var links = [], color;
                    for (i=0;i<that.nodes[m].length;i++) {                      
                        if (i<(that.nodes[m].length-1)) {
                            target = that.nodes[m][i+1];
                            color = that.fillChart.colorPieW(that.new_data[m].data[i]);
                        } else {
                            target = that.nodes[m][0];
                            color = that.fillChart.colorPieW(that.new_data[m].data[i]);
                        }
                        links.push({source: that.nodes[m][i], target: target, color : color});
                    }

                    var spider =  that.group.selectAll("#link"+m)
                        .data(links);

                    spider.enter().append("path")
                        .attr("class", "link")
                        
                    spider.attr("class","link")
                        .attr("stroke",function (d) {
                            return d.color;
                        })
                        .attr("stroke-opacity",1)
                        .attr("id","link"+m)
                        .attr("d", d3.customHive.link()
                            .angle(function(d) { /*console.log(d,"d");*/ return that.angle(d.x); })
                            .radius(function(d) { return that.radius(d.y); })
                        );
                    spider.exit().remove();


                    that.weight = _.map(that.new_data[m].data, function (d) {
                        return d.weight;
                    });

                    that.weight = _.reject(that.weight,function (num) {
                        return num == 0;
                    });

                    that.sorted_weight = that.weight.slice(0);
                    that.sorted_weight.sort(function(a,b) { return a-b; });

                    var spidernode = that.group.selectAll(".node"+m)
                        .data(that.nodes[m])
                    
                    spidernode.enter().append("circle")
                        .attr("class", "node"+m)
                        .attr("transform", function(d) { return "rotate(" + that.degrees(that.angle(d.x)) + ")"; })
                        
                        
                    spidernode.attr("class","node"+m)
                        .attr("cx", function (d) { return that.radius(d.y); })
                        .attr("r", function (d,i) { return that.sizes(that.new_data[m].data[i].weight); })
                        .style("fill", function (d,i) {
                            return that.fillChart.colorPieW(that.new_data[m].data[i]);
                        })
                        .style("opacity", function (d,i) { 
                            return that.multiD.opacity(that.new_data[m].data[i].weight,that.weight,that.data);
                        })
                        .attr("stroke",that.border.color())
                        .attr("stroke-width",that.border.width())
                        .on('mouseover',function (d,i) {
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.toolTextShow(toolTip[i]);
                        })
                        .on('mouseout',function (d) {
                            that.mouseEvent.tooltipHide(d);  
                        })
                        .on('mousemove', function (d) {
                          that.mouseEvent.tooltipPosition(d);
                        });
                    spidernode.exit().remove();
                }

                that.group.selectAll(".axis")
                    .data(d3.range(that.new_data[0].data.length))
                    .enter().append("line")
                    .attr("class", "axis")
                    .attr("transform", function(d) { return "rotate(" + that.degrees(that.angle(d)) + ")"; })
                    .attr("x1", that.radius.range()[0])
                    .attr("x2", that.radius.range()[1]);
                  //  .attr("fill","blue");

                that.group.selectAll(".grid")
                    .data(grids)
                    .enter().append("path")
                    .attr("class", "grid")
                    .attr("d", d3.customHive.link()
                        .angle(function(d) { return that.angle(d.x); })
                        .radius(function(d) { return that.radius(d.y); })
                    );

                return this;             
            },
            legends : function () {
                if (PykCharts.boolean(that.legends.enable) && PykCharts.boolean(that.size.enable) && that.mapGroupData[1]) {
                    var unique = _.uniq(that.sorted_weight);
                    var k = 0;
                    var l = 0;
                    if(that.legends.display === "vertical" ) {
                        that.legendSvg.attr("height", (that.mapGroupData[0].length * 30)+20);
                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        text_parameter1value = function (d,i) { return that.width - that.width/4 + 16; };
                        rect_parameter3value = function (d,i) { return that.width - that.width/4; };
                        var rect_parameter4value = function (d,i) { return i * 24 + 12;};
                        var text_parameter2value = function (d,i) { return i * 24 + 23;};

                    } else if(that.legends.display === "horizontal") {
                         // that.legendSvg.attr("height", (k+1)*70);
                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";
                        k = 0, l = 0;

                        var text_parameter1value = function (d,i) { 
                            if( i === 0) {
                                l = 0;
                            }
                            if((that.w - (i*100 + 75)) > 0) {
                                return that.width - (i*100 + 75); 
                            } else if ((that.width - (l*100 + 75)) < that.width) {
                                l++;
                                return that.width - ((l-1)*100 + 75); 
                            } else {
                                l = 0;
                                l++;
                                return that.width - ((l-1)*100 + 75); 
                            }
                        };

                        text_parameter2value = function (d,i) {
                            if(i === 0) {
                                k = 0, l = 0;
                            }
                            if((that.width - (i*100 + 75)) > 0) {
                            } else if ((that.width - (l*100 + 75)) < that.width) {
                                if(l === 0) {
                                    k++;
                                }
                                l++;
                            } else {
                                l = 0;
                                l++;
                                k++;    
                            }
                            return k * 24 + 23;  
                        }; 
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        var rect_parameter3value = function (d,i) {      
                            if( i === 0) {
                                k = 0, l = 0;
                            }
                            if((that.w - (i*100 + 100)) >= 0) {
                                return that.width - (i*100 + 100); 
                            } else if ((that.width - (i*100 + 100)) < that.width) {
                                k++;
                                if(l === 0) {
                                    that.legendSvg.attr("height", (l+1)*50);
                                }
                                l++;
                                return that.width - ((l-1)*100 + 100); 
                            } else {
                                l = 0;
                                l++;
                                k++;
                                return that.width - ((l-1)*100 + 100); 
                            }
                        };
                        rect_parameter4value = function (d,i) {
                            if(i === 0) {
                                k = 0, l = 0;
                            }
                            if((that.width - (i*100 + 75)) > 0) {
                            } else if ((that.width - (l*100 + 75)) < that.width) {
                                if( l == 0) {
                                    k++;
                                }
                                l++;
                            } else {
                                l = 0;
                                l++;
                                k++;    
                            }
                            return k * 24 + 12;  
                        } 
                    };

                    var legend = that.legendsgrp.selectAll("rect")
                            .data(that.mapGroupData[0]);

                    legend.enter()
                            .append("rect");

                    legend.attr(rect_parameter1, rect_parameter1value)
                        .attr(rect_parameter2, rect_parameter2value)
                        .attr(rect_parameter3, rect_parameter3value)
                        .attr(rect_parameter4, rect_parameter4value)
                        .attr("fill", function (d) {
                            return that.fillChart.colorPieW(d);
                        })
                        .attr("opacity", function (d) {
                            return 0.6;
                        });

                    legend.exit().remove();

                    that.legends_text = that.legendsgrp.selectAll(".legends_text")
                        .data(that.mapGroupData[0]);

                    that.legends_text
                        .enter()
                        .append('text')
                        .attr("class","legends_text")
                         .attr("fill",that.legendsText.color)
                        .attr("pointer-events","none")
                        .style("font-family", that.legendsText.family)
                        .attr("font-size",that.legendsText.size);

                    that.legends_text.attr("class","legends_text")
                        .attr("fill","black")
                        .attr(text_parameter1, text_parameter1value)
                        .attr(text_parameter2, text_parameter2value)
                        .text(function (d) { return d.group });

                    that.legends_text.exit()
                                    .remove();
                }
                return this;
            },
            // legends : function (position) {
            //     if(PykCharts.boolean(that.legends) && !(PykCharts.boolean(that.size.enable))) {
            //         var xPosition, textXPosition, roundOff, opacity;
            //         var unique = _.uniq(that.sorted_weight);
            //         var x, y, k; 
            //         xPosition = function (d , i) { return (i)*(90 * that.width / unique.length)/100; };
            //         yPosition = function (d , i) { return (i)*(90 * that.height / unique.length)/100; };
            //         textXPosition = function (d,i) { return (++i*(90*that.width /unique.length)/100-5); };
            //         textYPosition = function (d,i) { return (++i*(90*that.height /unique.length)/100-5); };
            //         roundOff = function (d,i) { return Math.round(d); };
            //         opacity = function (d){return that.multiD.opacity(d,that.sorted_weight,that.data); };
            //         var start, height, width, xtext, ytext;
                   
            //         var renderLengends = function (start,height,width,xtext,ytext,position,textPosition) {
            //             for(k=1;k<=unique.length;k++)
            //             {    
            //                 x = that.legendgrp.selectAll("rect")
            //                     .data(unique);
                                
            //                 x.enter()
            //                     .append("rect");

            //                 x.attr(start, position)
            //                     .attr("height", height)
            //                     .attr("width", width)
            //                     .attr("fill",function(d) { return that.fillChart.colorPieW(d); })
            //                     .attr("opacity",opacity);

            //                 x.exit().remove();
                            
            //                 y = that.legendgrp.selectAll(".leg")
            //                      .data(unique);
                            
            //                 y.enter()
            //                     .append("text");

            //                 y.attr("class","leg")
            //                     .attr("x",xtext)
            //                     .attr("y",ytext)
            //                     .style("font-size",12)
            //                     .style("font-family", "'Helvetica Neue',Helvetica,Arial,sans-serif");

            //                 y.text(roundOff);
                            
            //                 y.exit().remove();
            //             }                   
            //         };
            //         if(position == "top" || position == "bottom") {
            //             start = "x";
            //             height = 10;
            //             width = (90*that.width/unique.length)/100;
            //             xtext = textXPosition;
            //             ytext = 25;
            //             renderLengends(start,height,width,xtext,ytext,xPosition);
            //         } else if(position == "left" || position == "right") {
            //             that.legendsContainer.attr("width",100).attr("height",that.height);
            //             that.legendsGroup.attr("transform","translate(20,0)");
            //             start = "y";
            //             height = (90*that.height/unique.length)/100;
            //             width = 10;
            //             xtext = 15;
            //             ytext = textYPosition;
            //             renderLengends(start,height,width,xtext,ytext,yPosition);
            //         }                     
            //     }    
            //     return this;
            // },
            axisTitle : function () {
                if(PykCharts.boolean(that.axisTitle)) {
                    that.length = that.new_data[0].data.length;

                    var spider_text = that.group.selectAll("text.axisTitle")
                        .data(that.nodes[0]);

                    spider_text.enter()
                        .append("text")
                        .attr("class","axisTitle");

                    spider_text
                        .attr("transform", function(d, i){ 
                            return "translate(" + (-that.width/2) + "," + (-that.height/2) + ")";
                        })
                        .style("text-anchor","middle")
                        .attr("x", function (d, i){return that.width/2*(1-0.2*Math.sin(i*2*Math.PI/that.length))+245*Math.sin(i*2*Math.PI/that.length);})
                        .attr("y", function (d, i){
                            return that.height/2*(1-0.60*Math.cos(i*2*Math.PI/that.length))-75*Math.cos(i*2*Math.PI/that.length);
                        })
                        .style("font-size",that.label.size)
                        .style("font-family",that.label.family)
                    
                    spider_text
                        .text(function (d,i) { return that.new_data[0].data[i].x; });
                
                    spider_text.exit().remove();
                }
                return this;
            },
            axisTicks: function () {
                if (PykCharts.boolean(that.enableTicks)) {
                    var a = that.yScale.domain();
                    var t = a[1]/4;
                    var b=[];
                    for(i=4,j=0; i>=0 ;i--,j++){
                        b[j]=i*t;
                    }
                    var spider_ticks = that.group.selectAll("text.ticks")
                        .data(b);

                    spider_ticks.enter()
                        .append("text")
                        .attr("class","ticks");

                    spider_ticks
                        .style("text-anchor","start")
                        .attr("transform", "translate(5,-180)") 
                        .attr("x",0)
                        .attr("y", function (d,i) { return i*40; });

                    spider_ticks               
                        .text(function (d) { return d; })
                        .style("font-size",that.label.size)
                        .style("font-family",that.label.family);
                }              
                return this;
            },          
        }
        return optional;
    };

    // this.fullScreen = function () {      
    //     var modalDiv = d3.select(options.selector).append("div")
    //         .attr("id","abc")
    //         .attr("align","center")
    //         .attr("visibility","hidden")
    //         .attr("class","clone")
    //         .style("align","center")
    //         .append("a")
    //         .attr("class","b-close")
    //             .style("cursor","pointer")
    //             .style("position","absolute")
    //             .style("right","10px")
    //             .style("top","5px")
    //             .style("font-size","20px")
    //             .html("Close");

    //     var scaleFactor = 1.5;
    //     var w = that.w;
    //     var h = that.h;
    //     if(h>=500 || w>900){
    //         scaleFactor = 1;
    //     }
    //     if(that.legends.position == "top" || that.legends.position == "left") {
    //         $(".legendsvg").clone().appendTo("#abc");            
    //         $(".svgcontainer").clone().appendTo("#abc");
    //     }
    //     else {
    //         $(".svgcontainer").clone().appendTo("#abc");  
    //         $(".legendsvg").clone().appendTo("#abc");
    //     }
    //     if(that.legends.position == "top" || that.legends.position == "bottom") {
    //         d3.select(".clone #legendsvg").attr("width",screen.width-200);
    //         d3.select(".clone #legendgrp").attr("transform","scale("+scaleFactor+")"); 
    //         d3.select(".clone #svgcontainer").attr("width",screen.width-200).attr("height",screen.height-200).style("display","block");
    //     }
    //     else if(that.legends.position == "left" || that.legends.position == "right") {
    //         d3.select(".clone #legendsvg").attr("width",100).attr("height",screen.height-100);
    //         d3.select(".clone svg #legendgrp").attr("transform","scale("+scaleFactor+")");            
    //         d3.select(".clone #svgcontainer").attr("width",screen.width-200).attr("height",screen.height-200);
    //     }
    //     d3.select(".clone svg #spidergrp")
    //         .attr("transform","scale("+scaleFactor+")")
    //         .attr("transform", "translate(" + that.w / 2 + "," + that.h / 2 + ")");  
    //     $(".clone").css({"background-color":"#fff","border-radius":"15px","color":"#000","display":"none","padding":"20px","min-width":screen.availWidth-100,"min-height":screen.availHeight-150,"visibility":"visible","align":"center"});
    //     $("#abc").bPopup({position: [30, 10],transition: 'fadeIn',onClose: function(){ $('.clone').remove(); }});
    // };
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
    chartObject.width = optional.map && _.isNumber(parseInt(optional.map.width,10)) ? optional.map.width : mapsTheme.map.width;
    chartObject.height = optional.map && _.isNumber(parseInt(optional.map.height,10)) ? optional.map.height : mapsTheme.map.height;
    chartObject.mapCode = options.mapCode ? options.mapCode : mapsTheme.mapCode;
    chartObject.enableClick = options.enableClick ? options.enableClick : mapsTheme.enableClick;
    // chartObject.defaultColor = optional && optional.colors && optional.colors.defaultColor ? optional.colors.defaultColor : mapsTheme.colors.defaultColor;
    // chartObject.colorType = optional && optional.colors && optional.colors.type ? optional.colors.type : stylesheet.colors.type;
    // chartObject.totalColors = optional && optional.colors && _.isNumber(parseInt(optional.colors.total,10)) ? parseInt(optional.colors.total,10) : stylesheet.colors.total;
    // chartObject.colorPalette = optional && optional.colors && optional.colors.palette ? optional.colors.palette : mapsTheme.colors.palette;
    chartObject.bg = optional && optional.colors && optional.colors.backgroundColor ? optional.colors.backgroundColor : stylesheet.colors.backgroundColor;
    if (optional && optional.timeline) {
        chartObject.timeline = optional.timeline;
        chartObject.timeline.duration = optional.timeline.duration ? optional.timeline.duration :mapsTheme.timeline.duration;
        chartObject.timeline.margin = optional.timeline.margin;
        chartObject.timeline.margin.left = optional.timeline.margin.left ? optional.timeline.margin.left : mapsTheme.timeline.margin.left;
        chartObject.timeline.margin.right = optional.timeline.margin.right ? optional.timeline.margin.right : mapsTheme.timeline.margin.right;
        chartObject.timeline.margin.top = optional.timeline.margin.top ? optional.timeline.margin.top : mapsTheme.timeline.margin.top;
        chartObject.timeline.margin.bottom = optional.timeline.margin.bottom ? optional.timeline.margin.bottom : mapsTheme.timeline.margin.bottom;
    } else {
        chartObject.timeline = mapsTheme.timeline;
    }
    if (optional && optional.tooltip)  {
        chartObject.tooltip = optional.tooltip;
        chartObject.tooltip.enable = optional.tooltip.enable ? optional.tooltip.enable : mapsTheme.tooltip.enable;
        // chartObject.enableTooltip = chartObject.tooltip.enable;
        chartObject.tooltip.mode = optional.tooltip.mode ? optional.tooltip.mode : mapsTheme.tooltip.mode;
        chartObject.tooltip.positionTop = optional.tooltip.positionTop ? optional.tooltip.positionTop : mapsTheme.tooltip.positionTop;
        chartObject.tooltip.positionLeft = optional.tooltip.positionLeft ? optional.tooltip.positionLeft : mapsTheme.tooltip.positionLeft;
        chartObject.tooltipTopCorrection = d3.select(chartObject.selector).style("top");
        chartObject.tooltipLeftCorrection = d3.select(chartObject.selector).style("left");
    } else {
        chartObject.tooltip = mapsTheme.tooltip;
    }
    if (optional && optional.colors) {
        chartObject.colors = optional.colors;
        chartObject.colors.defaultColor = optional.colors.defaultColor ? optional.colors.defaultColor : mapsTheme.colors.defaultColor;
        chartObject.colors.total = optional.colors.total && _.isNumber(parseInt(optional.colors.total,10))? parseInt(optional.colors.total,10) : mapsTheme.colors.total;
        chartObject.colors.type = optional.colors.type ? optional.colors.type : mapsTheme.colors.type;
        chartObject.colors.palette = optional.colors.palette ? optional.colors.palette : mapsTheme.colors.palette;
    } else {
        chartObject.colors = mapsTheme.colors;
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
    if(optional && optional.label) {
        chartObject.label = optional.label;
        chartObject.label.enable = optional.label.enable && optional.label.enable ? optional.label.enable : mapsTheme.label.enable;
    } else {
        chartObject.label =  mapsTheme.label;
    }
    // if (optional && optional.label) {
    //     chartObject.label = optional.label;
    //     chartObject.label.size = optional.label.size ? optional.label.size : stylesheet.label.size;
    //     chartObject.label.color = optional.label.color ? optional.label.color : stylesheet.label.color;
    //     chartObject.label.weight = optional.label.weight ? optional.label.weight : stylesheet.label.weight;
    //     chartObject.label.family = optional.label.family ? optional.label.family : stylesheet.label.family;
    // } else {
    //     chartObject.label = stylesheet.label;
    // }
    if(optional && optional.legends) {
        chartObject.legends = optional.legends;
        chartObject.legends.enable = optional.legends.enable && optional.legends.enable ? optional.legends.enable : mapsTheme.legends.enable;
    } else {
        chartObject.legends =  mapsTheme.legends;
    }
    // if(optional && optional.legends) {
    //     chartObject.legends = optional.legends;
    //     chartObject.legends.strokeWidth = optional.legends.strokeWidth ? optional.legends.strokeWidth : stylesheet.legends.strokeWidth;
    //     chartObject.legends.size = optional.legends.size ? optional.legends.size : stylesheet.legends.size;
    //     chartObject.legends.color = optional.legends.color ? optional.legends.color : stylesheet.legends.color;
    //     chartObject.legends.family = optional.legends.family ? optional.legends.family : stylesheet.legends.family;
    // } else {
    //     chartObject.legends = stylesheet.legends;
    // }
    if(optional && optional.border) {
        chartObject.border = optional.border;
        chartObject.border.color = optional.border.color ? optional.border.color : mapsTheme.border.color;
        chartObject.border.thickness = optional.border.thickness ? optional.border.thickness : mapsTheme.border.thickness;
    } else {
        chartObject.border = mapsTheme.border;
    }
    chartObject.onhover = optional && optional.onhover ? optional.onhover : mapsTheme.onhover;
    chartObject.defaultZoomLevel = optional && optional.defaultZoomLevel ? optional.defaultZoomLevel : 80;
    chartObject.loading = optional && optional.loading && optional.loading.animationGifUrl ? optional.loading.animationGifUrl: stylesheet.loading.animationGifUrl;
    chartObject.highlightArea = optional && optional.highlightArea ? optional.highlightArea : mapsTheme.highlightArea;
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
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function () {
        that = PykCharts.maps.processInputs(that, options);
        //$(that.selector).css("height",that.height);
        that.data = options.data;
        
        that.k
            .totalColors(that.colors.total)
            .colorType(that.colors.type)
            .loading(that.loading)
            .tooltip(that.tooltip.enable)

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
                console.log(ec);
                if (PykCharts.boolean(ec)) {
                    that.areas.on("click", that.clicked);
                    // that.onhover = "color_saturation";
                    that.onhover1 = that.onhover;
                };
                return this;
            }
        }
        return config;
    }

    this.render = function () {
        var that = this;

        var that = this,
            scale = 10,
            offset = [that.width / 2, that.height / 2],
            i;

        that.current_palette = _.where(that.colorPalette_data, {name:that.colors.palette, number:that.colors.total})[0];
        that.optionalFeatures()
            .enableLegend(that.legends.enable)

        that.svg = d3.select(that.selector)
            .append("svg")
            .attr("width", that.width)
            .attr("height", that.height)
            .attr("style", "border:1px solid lightgrey")
            .style("border-radius", "5px");

        var map_cont = that.svg.append("g")
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
        that.areas = that.group.append("path")
            .attr("d", that.path)
            .attr("class", "area")
            .attr("state_name", function (d) {
                return d.properties.NAME_1;
            })
            //.attr("prev-fill",that.renderPreColor)
            .attr("fill", that.renderColor)
            .attr("opacity", that.renderOpacity)
            .attr("stroke", that.border.color)
            .attr("stroke-width", that.border.thickness + "px")
            .on("mouseover", function (d,i) {
                // console.log(d.properties,"^^^^^^");
                if (PykCharts.boolean(that.tooltip.enable)) {
                    ttp.style("visibility", "visible");
                    ttp.html((_.where(that.data, {iso2: d.properties.iso_a2})[0]).tooltip);
                }
                that.bodColor(d);
            })
            .on("mousemove", function () {
                if (PykCharts.boolean(that.tooltip.enable)) {
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
                if (PykCharts.boolean(that.tooltip.enable)) {
                    ttp.style("visibility", "hidden");
                }
                that.bodUncolor(d);
            });
        this.optionalFeatures()
            .enableLabel(that.label.enable)
            .enableClick(that.enableClick);

        if (PykCharts.boolean(that.creditMySite.enable)) {
            that.k.credits();
        }
        if (PykCharts.boolean(that.dataSource.enable)) {
            console.log("dataSource");
             that.k.dataSource();
        }
    };

    this.renderColor = function (d, i) {
        var col_shade,
            obj;
            obj = _.where(that.data, {iso2: d.properties.iso_a2});
        if (_.where(that.data, {iso2: d.properties.iso_a2}).length > 0) {
            if (that.colors.type === "colors") {
                if (obj.length > 0 && obj[0].color !== "") {
                    return obj[0].color;
                }
                return that.colors.defaultColor;
            }
            if (that.colors.type === "saturation") {

                if ((that.highlightArea === "yes") && obj[0].highlight == "true") {
                    return obj[0].highlight_color;
                } else {
                    if (that.colors.palette !== "") {
                        col_shade = _.where(that.data, {iso2: d.properties.iso_a2})[0].size;
                        for (i = 0; i < that.current_palette.colors.length; i++) {
                            if (col_shade >= that.min_size + i * (that.difference / that.current_palette.colors.length) && col_shade <= that.min_size + (i + 1) * (that.difference / that.current_palette.colors.length)) {
                                return that.current_palette.colors[i];
                            }
                        }

                    }
                    return that.colors.defaultColor;
                }
            }
            return that.colors.defaultColor;
        }
        return that.colors.defaultColor;
    };

    this.renderOpacity = function (d) {

        if (that.colors.palette === "" && that.colors.type === "saturation") {
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
        if (that.colors.type === "saturation") {
            that.legs = d3.select(that.selector)
                .append("svg")
                .attr("id", "legend-container")
                .attr("width", that.width)
                .attr("height", 50);
            if (that.colors.palette === "") {
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
            .attr("x", function (d) { 
                return that.path.centroid(d)[0]; })
            .attr("y", function (d) { return that.path.centroid(d)[1]; })
            .attr("text-anchor", "middle")
            .attr("font-size", "10")
            .attr("pointer-events", "none")
            .text(function (d) { 
               return d.properties.NAME_1; 
            });
    };

    this.bodColor = function (d) {
        // console.log(that.onhover1);
        if(that.onhover1 !== "none") {
            if (that.onhover1 === "highlight_border") {
                d3.select("path[state_name='" + d.properties.NAME_1 + "']")
                    .attr("stroke", that.border.color)
                    .attr("stroke-width", that.border.thickness + 0.5);
            } else if (that.onhover1 === "shadow") {
                d3.select("path[state_name='" + d.properties.NAME_1 + "']")
                    .attr('filter', 'url(#dropshadow)')
                    .attr("opacity", function () {
                        if (that.colors.palette === "" && that.colors.type === "saturation") {
                            that.oneninth_dim = +(d3.format(".2f")(that.difference / 10));
                            that.opacity_dim = (that.min_size + (_.where(that.data, {iso2: d.properties.iso_a2})[0]).size + that.oneninth_dim) / that.difference;
                            return that.opacity_dim/2;
                        }
                        return 0.5;
                    });
            } else if (that.onhover1 === "color_saturation") {
                d3.select("path[state_name='" + d.properties.NAME_1 + "']")
                    .attr("opacity", function () {
                        if (that.colors.palette=== "" && that.colors.type === "saturation") {
                            that.oneninth_dim = +(d3.format(".2f")(that.difference / 10));
                            that.opacity_dim = (that.min_size + (_.where(that.data, {iso2: d.properties.iso_a2})[0]).size + that.oneninth_dim) / that.difference;
                            return that.opacity_dim/2;
                        }
                        return 0.5;
                    });
            }
        } else {
            console.log("none");
            that.bodUncolor(d);
        }
    };

    this.bodUncolor = function (d) {
        d3.select("path[state_name='" + d.properties.NAME_1 + "']")
            .attr("stroke", that.border.color)
            .attr("stroke-width", that.border.thickness)
            .attr('filter', null)
            .attr("opacity", function () {
                if (that.colors.palette === "" && that.colors.type === "saturation") {
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
PykCharts.maps.timelineMap = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function () {
        that = PykCharts.maps.processInputs(that, options);
        //$(that.selector).css("height",that.height);

        that.timeline_data = options.data;

        var x_extent = d3.extent(options.data, function (d) { return d.timestamp; })
        that.data = _.where(options.data, {timestamp: x_extent[0]});

        // that.margin = {top:10, right:30, bottom:10, left:30};

        that.reducedWidth = that.width - (that.timeline.margin.left * 2) - that.timeline.margin.right;
        that.reducedHeight = that.height - that.timeline.margin.top - that.timeline.margin.bottom;

        that.k
            .totalColors(that.colors.total)
            .colorType(that.colors.type)
            .loading(that.loading)
            .tooltip(that.tooltip.enable)

        d3.json("../data/maps/" + that.mapCode + ".json", function (data) {
            that.map_data = data;

            d3.json("../data/maps/colorPalette.json", function (data) {
                that.colorPalette_data = data;

                var x_extent = d3.extent(that.timeline_data, function (d) { return d.timestamp; })
                that.data = _.where(that.timeline_data, {timestamp: x_extent[0]});

                that.data.sort(function (a,b) {
                    return a.timestamp - b.timestamp;
                });
                $(that.selector).html("");
                that.render();
                that.simulateLiveData(that.timeline_data);
            });
        });

        that.extent_size = d3.extent(that.data, function (d) { return parseInt(d.size, 10); });
        that.difference = that.extent_size[1] - that.extent_size[0];
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
                    that.areas.on("click", that.clicked);
                    // that.onhover = "color_saturation";
                    that.onhover1 = that.onhover;
                };
                return this;
            },
            axisContainer : function (ae) {
                if(PykCharts.boolean(ae)){
                    that.gxaxis = that.svg.append("g")
                        .attr("id","xaxis")
                        .attr("class", "x axis")
                        .attr("transform", "translate("+that.timeline.margin.left*2+"," + that.reducedHeight + ")");
                }
                return this;
            }
        }
        return config;
    }

    this.render = function () {
        var that = this;

        var that = this
        , scale = 150
        , offset = [that.width / 2, that.height / 2]
        , i;

        console.log(that.legends,"legends");

        that.current_palette = _.where(that.colorPalette_data, {name:that.colors.palette, number:that.colors.total})[0];
        that.optionalFeatures()
            .enableLegend(that.legends.enable);

        that.svg = d3.select(that.selector)
            .append("svg")
            .attr("width", that.width)
            .attr("height", that.height)
            .attr("style", "border:1px solid lightgrey")
            .style("border-radius", "5px");

        var map_cont = that.svg.append("g")
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

        that.areas = that.group.append("path")
            .attr("d", that.path)
            .attr("class", "area")
            .attr("iso2", function (d) {
                return d.properties.iso_a2;
            })
            .attr("state_name", function (d) {
                return d.properties.NAME_1;
            })
            //.attr("prev-fill",that.renderPreColor)
            .attr("fill", that.renderColor)
            .attr("prev_fill", function (d) {
                return d3.select(this).attr("fill");
            })
            .attr("opacity", that.renderOpacity)
            .attr("stroke", that.border.color)
            .attr("stroke-width", that.border.thickness + "px")
            .on("mouseover", function (d) {
                // console.log((_.where(that.data, {iso2: d.properties.iso_a2})[0]).tooltip)
                if (PykCharts.boolean(that.tooltip.enable)) {
                    ttp.style("visibility", "visible");
                    ttp.html((_.where(that.data, {iso2: d.properties.iso_a2})[0]).tooltip);
                }
                that.bodColor(d);
            })
            .on("mousemove", function () {
                if (PykCharts.boolean(that.tooltip.enable)) {
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
                if (PykCharts.boolean(that.tooltip.enable)) {
                    ttp.style("visibility", "hidden");
                }
                that.bodUncolor(d);
            });

        that.optionalFeatures()
            .enableLabel(that.label.enable)
            .enableClick(that.enableClick);

        that.k.dataSource(that.dataSource)
            .credits(that.creditMySite);

        that.renderTimeline();
    };

    this.renderColor = function (d, i) {
        if (!PykCharts.boolean(d)) {
            return false;
        }
        var col_shade,
            obj = _.where(that.data, {iso2: d.properties.iso_a2});
        if (obj.length > 0) {
            if (that.colors.type === "colors") {
                if (obj.length > 0 && obj[0].color !== "") {
                    return obj[0].color;
                }
                return that.colors.defaultColor;
            }
            if (that.colors.type === "saturation") {

                if ((that.highlightArea === "yes") && obj[0].highlight == "true") {
                    return obj[0].highlight_color;
                } else {
                    if (that.colors.palette !== "") {
                        col_shade = obj[0].size;
                        for (i = 0; i < that.current_palette.colors.length; i++) {
                            if (col_shade >= that.extent_size[0] + i * (that.difference / that.current_palette.colors.length) && col_shade <= that.extent_size[0] + (i + 1) * (that.difference / that.current_palette.colors.length)) {
                                return that.current_palette.colors[i];
                            }
                        }

                    }
                    return that.colors.defaultColor;
                }
            }
            return that.colors.defaultColor;
        }
        return that.colors.defaultColor;
    };

    this.renderOpacity = function (d) {

        if (that.colors.palette === "" && that.colors.type === "saturation") {
            that.oneninth = +(d3.format(".2f")(that.difference / 10));
            that.opacity = (that.extent_size[0] + (_.where(that.data, {iso2: d.properties.iso_a2})[0]).size + that.oneninth) / that.difference;
            return that.opacity;
        }
        return 1;
    };

    this.renderLegend = function () {
        var that = this,
            k,
            onetenth;
        if (that.colors.type === "saturation") {
            that.legs = d3.select(that.selector)
                .append("svg")
                .attr("id", "legend-container")
                .attr("width", that.width)
                .attr("height", 50);
            if (that.colors.palette === "") {
                for (k = 1; k <= 9; k++) {
                    onetenth = d3.format(".1f")(that.extent_size[1] / 9);
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
                    that.leg = d3.round(that.extent_size[0] + k * (that.difference / that.current_palette.number));
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
            $("#legend-container").after("</br>");
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
        // console.log(that.onhover1);
        var obj = _.where(that.data, {iso2: d.properties.iso_a2});
        if(that.onhover1 !== "none") {
            if (that.onhover1 === "highlight_border") {
                d3.select("path[state_name='" + d.properties.NAME_1 + "']")
                    .attr("stroke", that.border.color)
                    .attr("stroke-width", that.border.thickness + 0.5);
            } else if (that.onhover1 === "shadow") {
                d3.select("path[state_name='" + d.properties.NAME_1 + "']")
                    .attr('filter', 'url(#dropshadow)')
                    .attr("opacity", function () {
                        if (that.colors.palette === "" && that.colors.type === "saturation") {
                            that.oneninth_dim = +(d3.format(".2f")(that.difference / 10));
                            that.opacity_dim = (that.extent_size[0] + (obj[0]).size + that.oneninth_dim) / that.difference;
                            return that.opacity_dim/2;
                        }
                        return 0.5;
                    });
            } else if (that.onhover1 === "color_saturation") {
                d3.select("path[state_name='" + d.properties.NAME_1 + "']")
                    .attr("opacity", function () {
                        if (that.colors.palette=== "" && that.colors.type === "saturation") {
                            that.oneninth_dim = +(d3.format(".2f")(that.difference / 10));
                            that.opacity_dim = (that.extent_size[0] + (obj[0]).size + that.oneninth_dim) / that.difference;
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
                if (that.colors.palette === "" && that.colors.type === "saturation") {
                    that.oneninth_high = +(d3.format(".2f")(that.difference / 10));
                    that.opacity_high = (that.extent_size[0] + (_.where(that.data, {iso2: d.properties.iso_a2})[0]).size + that.oneninth_high) / that.difference;
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

    this.renderTimeline = function () {
        var x_extent
        , x_range
        , unique = []
        , duration
        , interval = interval1 = 1;

        that.optionalFeatures()
            .axisContainer(true);

        x_extent = d3.extent(that.timeline_data, function(d) { return d.timestamp; });
        x_range = [0 ,that.reducedWidth];
        that.xScale = that.k.scaleIdentification("linear",x_extent,x_range);

        that.k.xAxis(that.svg,that.gxaxis,that.xScale);

        _.each(that.timeline_data, function (d) {
            if (unique.indexOf(d.timestamp) === -1) {
                unique.push(d.timestamp);
            }
        });

        var bbox = d3.select(that.selector+" .axis").node().getBBox()
        , timeline_status;

        var startTimeline = function () {
            if (timeline_status==="playing") {
                play.attr("xlink:href","../img/play.gif");
                clearInterval(that.playInterval);
                timeline_status = "paused";
            } else {
                timeline_status = "playing";
                play.attr("xlink:href","../img/pause.gif");
                that.playInterval = setInterval(function () {

                    marker.transition()
                        .duration(that.timeline.duration/2)
                        .attr("x",  (that.timeline.margin.left*2) + that.xScale(unique[interval]) - 7);

                    that.data = _.where(that.timeline_data, {timestamp:unique[interval]});
                    that.data.sort(function (a,b) {
                        return a.timestamp - b.timestamp;
                    });
                    _.each(that.data, function (d) {
                        d3.select("path[iso2='"+d.iso2+"']")
                            .transition()
                            .duration(that.timeline.duration/4)
                            .attr("fill", that.renderColor);
                    });

                    interval++;

                    if (interval===unique.length) {
                        clearInterval(that.playInterval);
                    };
                }, that.timeline.duration);

                var timelag = setTimeout(function () {
                    var undoHeatmap = setInterval(function () {
                        interval1++;

                        if (interval1 === interval) {
                            clearInterval(undoHeatmap);
                            clearTimeout(timelag)
                        }

                        if (interval1===unique.length) {
                            clearInterval(undoHeatmap);
                            play.attr("xlink:href","../img/play.gif");
                            marker.attr("x",  (that.timeline.margin.left*2) + that.xScale(unique[0]) - 7);
                            interval = interval1 = 1;
                            timeline_status = "";
                        };
                    }, that.timeline.duration);
                },that.timeline.duration);
            }
        }

        var play = that.svg.append("image")
            .attr("xlink:href","../img/play.gif")
            .attr("x", that.timeline.margin.left / 2)
            .attr("y", that.reducedHeight - that.timeline.margin.top - (bbox.height/2))
            .attr("width","24px")
            .attr("height", "21px")
            .style("cursor", "pointer")
            .on("click", startTimeline)

        var marker = that.svg.append("image")
            .attr("xlink:href","../img/marker.png")
            .attr("x", (that.timeline.margin.left*2) + that.xScale(unique[0]) - 7)
            .attr("y", that.reducedHeight)
            .attr("width","14px")
            .attr("height", "12px")

        // duration = unique.length * 1000;

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
