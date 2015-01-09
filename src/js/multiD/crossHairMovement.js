PykCharts.crossHairMovement = function (options) {
	var that = this;
	var mouseEvent = PykCharts.Configuration.mouseEvent(options);
    that.tooltip = configuration.tooltipp;
	that.cross_hair_v = configuration.cross_hair_v;
    that.cross_hair_h = configuration.cross_hair_h;
    that.focus_circle = configuration.focus_circle;
    that.pt_circle = configuration.pt_circle;
    that.start_pt_circle = configuration.start_pt_circle;
    mouseEvent.crossHairPosition = function(new_data,xScale,yScale,dataLineGroup,lineMargin,domain,type,tooltipMode,panels_enable,container_id){
        if((PykCharts['boolean'](options.crosshair_enable) || PykCharts['boolean'](options.tooltip_enable) || PykCharts['boolean'](options.axis_onhover_highlight_enable))  && options.mode === "default") {
            var selectSVG = $(options.selector + " #"+dataLineGroup[0][0][0].parentNode.parentNode.id),
                width_percentage = 0,
                height_percentage = 0,
                top_shift_from_first_panel
                containerOffsetTop = $(options.selector).offset().top;
                // console.log(selectSVG,document.querySelectorAll(options.selector + " #"+dataLineGroup[0][0][0].parentNode.parentNode.id))
            if (!PykCharts['boolean'](panels_enable)) {
                width_percentage = selectSVG.width() / options.chart_width;
                height_percentage = selectSVG.height() / options.chart_height;
            } else {
                top_shift_from_first_panel = $("svg#"+container_id+"-0").offset().top;
                width_percentage = 1;
                height_percentge = 1;
            }
            var legendsGroup_height = options.legendsGroup_height ? options.legendsGroup_height: 0,
                offsetLeft =  (options.chart_margin_left + lineMargin) * width_percentage + selectSVG.offset().left,
                offsetTop = selectSVG.offset().top,
                number_of_lines = new_data.length,
                left = options.chart_margin_left,
                right = options.chart_margin_right,
                top = options.chart_margin_top,
                bottom = options.chart_margin_bottom,
                w = options.chart_width,
                h = options.chart_height,
                group_index = parseInt(PykCharts.getEvent().target.id.substr((PykCharts.getEvent().target.id.length-1),1)),
                c = b - a,
                x = PykCharts.getEvent().pageX - offsetLeft,
                y = PykCharts.getEvent().pageY - offsetTop - top,
                x_range = [];

            if(options.axis_x_data_format==="string") {
                x_range = xScale.range();
            } else {
                temp = xScale.range();
                pad = (temp[1]-temp[0])/(new_data[0].data.length-1);
                len = new_data[0].data.length;
                strt = 0;
                for(i = 0;i<len;i++){
                    x_range[i] = strt;
                    strt = strt + pad;
                }

            }
            var y_range = yScale.range(),
                y_range_length = y_range.length;
            var j,tooltpText,active_x_tick,active_y_tick = [],left_diff,right_diff,
                pos_line_cursor_x,pos_line_cursor_y = [],right_tick,left_tick,
                range_length = x_range.length,colspan,bottom_tick,top_tick;
            for(j = 0;j < range_length;j++) {
                for(k = 0; k<y_range_length;k++) {
                    if((j+1) >= range_length) {
                        return false;
                    }
                    else {
                        if((right_tick === x_range[j] && left_tick === x_range[j+1]) && (top_tick === y_range[k])) {
                            return false;
                        }
                        else if((x >= (width_percentage*x_range[j]) && x <= width_percentage*x_range[j+1]) && (y <= (y_range[k] + legendsGroup_height))) {
                            left_tick = width_percentage*x_range[j], right_tick = width_percentage*x_range[j+1];
                            bottom_tick = y_range[k+1];
                            top_tick = y_range[k];
                            left_diff = (left_tick - x), right_diff = (x - right_tick);
                            if(left_diff >= right_diff) {
                                active_x_tick = new_data[0].data[j].x;
                                active_y_tick.push(new_data[0].data[j].y);
                                tooltipText = new_data[0].data[j].tooltip || new_data[0].data[j].y;
                                pos_line_cursor_x = (xScale(active_x_tick) + lineMargin + left);
                                pos_line_cursor_y = (yScale(tooltipText) + top);
                            }
                            else {
                                active_x_tick = new_data[0].data[j+1].x;
                                active_y_tick.push(new_data[0].data[j+1].y);
                                tooltipText = new_data[0].data[j+1].tooltip || new_data[0].data[j+1].y; // Line Chart ONLY!
                                pos_line_cursor_x = (xScale(active_x_tick) + lineMargin + left);
                                pos_line_cursor_y = (yScale(tooltipText) + top);
                            }
                            if((pos_line_cursor_y > top && pos_line_cursor_y < (h-bottom)) && (pos_line_cursor_x >= left && pos_line_cursor_x <= (w-right))) {
                                if(type === "multilineChart" /*|| type === "stackedAreaChart"*/) {
                                    if(panels_enable === "no") {
                                        var test = [];
                                        d3.selectAll(options.selector+" #pyk-tooltip").classed({"pyk-tooltip":false,"pyk-multiline-tooltip":true,"pyk-tooltip-table":true});
                                        var len_data = new_data[0].data.length,tt_row=""; // Assumption -- number of Data points in different groups will always be equal
                                        active_y_tick = [];
                                        for(var a=0;a < number_of_lines;a++) {
                                            for(var b=0;b < len_data;b++) {
                                                if(options.axis_x_data_format === "time") {
                                                    cond = Date.parse(active_x_tick) === Date.parse(new_data[a].data[b].x);
                                                } else {
                                                    cond = new_data[a].data[b].x === active_x_tick;
                                                }
                                                if(cond) {
                                                    active_y_tick.push(new_data[a].data[b].y);
                                                    test.push(yScale(new_data[a].data[b].y) + top);
                                                    tt_row += "<tr><td>"+new_data[a].name+"</td><td><b>"+ (new_data[a].data[b].tooltip || new_data[a].data[b].y) +"</b></td></tr>";
                                                    colspan = 2;
                                                }
                                            }
                                        }

                                        pos_line_cursor_x += 6;
                                        tooltipText = "<table><thead><th colspan='"+colspan+"'>"+active_x_tick+"</th></thead><tbody>"+tt_row+"</tbody></table>";
                                        if(PykCharts['boolean'](options.tooltip_enable)) {
                                            this.tooltipPosition(tooltipText,pos_line_cursor_x,(y),60,-15,group_index,width_percentage,height_percentage,type);
                                            this.tooltipTextShow(tooltipText);
                                        }
                                        (options.crosshair_enable) ? this.crossHairShowMultipleline(pos_line_cursor_x,top,pos_line_cursor_x,(h - bottom),pos_line_cursor_x,test,new_data): null;
                                        this.axisHighlightShow(active_y_tick,options.selector+" .y.axis",domain);
                                        this.axisHighlightShow(active_x_tick,options.selector+" .x.axis",domain);
                                    }
                                    else if(panels_enable === "yes") {
                                        pos_line_cursor_x += 5;
                                        var len_data = new_data[0].data.length,
                                            multiply_value = 200,
                                            multiply_by = 0,
                                            final_displacement = 0;
                                        for(var a=0;a < number_of_lines;a++) {
                                            var left_offset = $(options.selector + " #"+container_id+"-"+a).offset().left - $(options.selector).offset().left;
                                            var top_offset = $(options.selector + " #"+container_id+"-"+a).offset().top - $(options.selector).offset().top;
                                            for(var b=0;b < len_data;b++) {
                                                if(options.axis_x_data_format === "time") {
                                                    cond = Date.parse(active_x_tick)===Date.parse(new_data[a].data[b].x);
                                                } else {
                                                    cond = new_data[a].data[b].x === active_x_tick;
                                                }
                                                if(cond) {
                                                    active_y_tick.push(new_data[a].data[b].y);
                                                    tooltipText = (new_data[a].data[b].tooltip || new_data[a].data[b].y);
                                                    if (a%3 == 0 && a != 0) {
                                                    ++multiply_by;
                                                    final_displacement = multiply_value * multiply_by;
                                                    }
                                                    pos_line_cursor_y = (yScale(new_data[a].data[b].y) + top);
                                                    this.tooltipPosition(tooltipText,(pos_line_cursor_x+left_offset-15-30),(pos_line_cursor_y+top_shift_from_first_panel+final_displacement-containerOffsetTop),-15,-15,a,width_percentage,height_percentage,type);
                                                    this.tooltipTextShow(tooltipText,panels_enable,type,a);
                                                    (options.crosshair_enable) ? this.crossHairShowPanelOfLine(pos_line_cursor_x,top,pos_line_cursor_x,(h - bottom),pos_line_cursor_x,pos_line_cursor_y,a,container_id): null;
                                                }
                                            }
                                        }
                                    }
                                }
                                if(type === "lineChart" || type === "areaChart") {
                                    if(PykCharts['boolean'](options.tooltip_enable)) {
                                        if((options.tooltip_mode).toLowerCase() === "fixed") {
                                            this.tooltipPosition(tooltipText,-options.chart_margin_left,(pos_line_cursor_y),-14,23,group_index,width_percentage,height_percentage,type);
                                        } else if((options.tooltip_mode).toLowerCase() === "moving") {
                                            this.tooltipPosition(tooltipText,(pos_line_cursor_x-options.chart_margin_left + 10),(pos_line_cursor_y-5),0,-45,group_index,width_percentage,height_percentage,type);
                                        }
                                        this.tooltipTextShow(tooltipText);
                                    }
                                    (options.crosshair_enable) ? this.crossHairShowLineArea(pos_line_cursor_x,top,pos_line_cursor_x,(h - bottom),pos_line_cursor_x,pos_line_cursor_y): null;
                                    this.axisHighlightShow(active_y_tick,options.selector+" .y.axis",domain);
                                    this.axisHighlightShow(active_x_tick,options.selector+" .x.axis",domain);
                                }
                                else if (type === "stackedAreaChart") {
                                    var test = [];
                                    d3.selectAll(options.selector+" #pyk-tooltip").classed({"pyk-tooltip":false,"pyk-multiline-tooltip":true,"pyk-tooltip-table":true});
                                    var len_data = new_data[0].data.length,tt_row=""; // Assumption -- number of Data points in different groups will always be equal
                                    active_y_tick = [];
                                    for(var a=0;a < number_of_lines;a++) {
                                        for(var b=0;b < len_data;b++) {
                                            if(options.axis_x_data_format === "time") {
                                                cond = Date.parse(active_x_tick)===Date.parse(new_data[a].data[b].x);
                                            } else {
                                                cond = new_data[a].data[b].x === active_x_tick;
                                            }
                                            if(cond) {
                                                active_y_tick.push(new_data[a].data[b].y);
                                                test.push(yScale(new_data[a].data[b].y+new_data[a].data[b].y0) + top + options.legendsGroup_height);
                                                tt_row += "<tr><td>"+new_data[a].name+"</td><td><b>"+ (new_data[a].data[b].tooltip || new_data[a].data[b].y) +"</b></td></tr>";
                                                colspan = 2;
                                            }
                                        }
                                    }

                                    pos_line_cursor_x += 6;
                                    tooltipText = "<table><thead><th colspan='"+colspan+"'>"+active_x_tick+"</th></thead><tbody>"+tt_row+"</tbody></table>";
                                    if(PykCharts['boolean'](options.tooltip_enable)) {
                                        group_index = 1;
                                        this.tooltipPosition(tooltipText,pos_line_cursor_x,(y),60,70,group_index,width_percentage,height_percentage);
                                        this.tooltipTextShow(tooltipText,type);
                                    }
                                    (options.crosshair_enable) ? this.crossHairShowStackedArea(pos_line_cursor_x,top+legendsGroup_height,pos_line_cursor_x,(h - bottom),pos_line_cursor_x,test,new_data): null;
                                    this.axisHighlightShow(active_y_tick,options.selector+" .y.axis",domain);
                                    this.axisHighlightShow(active_x_tick,options.selector+" .x.axis",domain);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    mouseEvent.crossHairShowLineArea = function (x1,y1,x2,y2,cx,cy) {
        if(PykCharts['boolean'](options.crosshair_enable)) {
            that.cross_hair_v.style("display","block");
            that.cross_hair_v.select(options.selector + " #cross-hair-v")
                .attr({
                    "x1" : x1,
                    "y1" : y1,
                    "x2" : x2,
                    "y2" : y2
                });
            that.cross_hair_h.style("display","block");
            that.cross_hair_h.select(options.selector + " #cross-hair-h")
                .attr({
                    "x1" : options.chart_margin_left,
                    "y1" : cy,
                    "x2" : (options.chart_width - options.chart_margin_right),
                    "y2" : cy
                });
            that.focus_circle.style("display","block")
                .attr("transform", "translate(" + cx + "," + cy + ")");
        }
        return this;
    }
    mouseEvent.crossHairShowMultipleline = function (x1,y1,x2,y2,cx,cy,new_data) {
        if(PykCharts['boolean'](options.crosshair_enable)) {
            that.cross_hair_v.style("display","block");
            that.cross_hair_v.select(options.selector + " #cross-hair-v")
                .attr({
                    "x1" : (x1 - 5),
                    "y1" : y1,
                    "x2" : (x2 - 5),
                    "y2" : y2
                });
            for(var j=0; j<new_data.length; j++) {
                d3.select(options.selector+" #f_circle"+j).style("display","block")
                    .attr("transform", "translate(" + (cx-3) + "," + cy[j] + ")");
            }
        }
        return this;
    }
    mouseEvent.crossHairShowPanelOfLine = function (x1,y1,x2,y2,cx,cy,group_index,container_id) {
        if(PykCharts['boolean'](options.crosshair_enable)) {
            d3.selectAll(options.selector+" .line-cursor").style("display","block");
            d3.selectAll(options.selector+" .cross-hair-v")
                .attr({
                    "x1" : (x1 - 5),
                    "y1" : y1,
                    "x2" : (x2 - 5),
                    "y2" : y2
                });
            d3.select(options.selector+" #"+container_id+"-"+group_index+" .cross-hair-h")
                .attr({
                    "x1" : options.chart_margin_left,
                    "y1" : cy,
                    "x2" : (options.w - options.chart_margin_right),
                    "y2" : cy
                });
            d3.select(options.selector+" #"+container_id+"-"+group_index+" .focus").style("display","block")
                .attr("transform", "translate(" + (cx - 5) + "," + cy + ")");
        }
        return this;
    }
    mouseEvent.crossHairShowStackedArea = function (x1,y1,x2,y2,cx,cy,new_data) {
        if(PykCharts['boolean'](options.crosshair_enable)) {
            d3.selectAll(options.selector+" .line-cursor").style("display","block");
            d3.selectAll(options.selector+" .cross-hair-v")
                .attr({
                    "x1" : (x1 - 5),
                    "y1" : y1,
                    "x2" : (x2 - 5),
                    "y2" : y2
                });
            for(var j=0; j<new_data.length; j++) {
                d3.select(options.selector+" #f_circle"+j).style("display","block")
                    .attr("transform", "translate(" + (cx-3) + "," + cy[j] + ")");
            }
        }
        return this;
    }
    mouseEvent.crossHairHide = function (type) {
        if(PykCharts['boolean'](options.crosshair_enable)) {
            that.cross_hair_v.style("display","none");
            if(type === "lineChart" || type === "areaChart") {
                that.cross_hair_h.style("display","none");
                that.focus_circle.style("display","none");
            } else if(type === "multilineChart" || type === "stackedAreaChart") {
                d3.selectAll(options.selector+" .line-cursor").style("display","none");
                d3.selectAll(options.selector+" .focus").style("display","none");
            }
        }
        return this;
    }
    mouseEvent.tooltipPosition = function (d,xPos,yPos,xDiff,yDiff,group_index,width_percentage,height_percentage,type) {
        if(PykCharts['boolean'](options.tooltip_enable) || PykCharts['boolean'](options.annotation_enable) || options.axis_x_data_format === "string" || options.axis_y_data_format === "string") {
            if(xPos !== undefined){
                var selector = options.selector.substr(1,options.selector.length),
                    selector_element = document.getElementById(selector),
                    width_tooltip = parseFloat($("#tooltip-svg-container-"+group_index +"-pyk-tooltip"+selector).css("width")),
                    height_tooltip = parseFloat($("#tooltip-svg-container-"+group_index +"-pyk-tooltip"+selector).css("height")),
                    tooltip = d3.select("#tooltip-svg-container-"+group_index +"-pyk-tooltip"+selector),
                    offset_left = selector_element.offsetLeft,
                    offset_top = selector_element.offsetTop;

                if (type === "lineChart" || type === "areaChart") {
                    var place_tooltip_from_top = yPos * height_percentage;
                } else {
                    var place_tooltip_from_top = yPos - ((height_tooltip)/2) * height_percentage;
                }

                tooltip
                    .style({
                        "display": "block",
                        "top": place_tooltip_from_top + offset_top + "px",
                        "left": ((xPos + options.chart_margin_left) * width_percentage) + offset_left + "px"
                });
            } else {
                that.tooltip
                    .style({
                        "display" : "block",
                        "top" : (PykCharts.getEvent().pageY - 20) + "px",
                        "left" : (PykCharts.getEvent().pageX + 30) + "px"
                    });
            }
        return that.tooltip;
        }
    }
    mouseEvent.tooltipTextShow = function (d,panels_enable,type,group_index) {
        var selector = options.selector.substr(1,options.selector.length)
        if(PykCharts['boolean'](options.tooltip_enable) || PykCharts['boolean'](options.annotation_enable) || options.axis_x_data_format === "string" || options.axis_y_data_format === "string") {
            if(panels_enable === "yes" && type === "multilineChart") {
                d3.selectAll("#tooltip-svg-container-"+group_index +"-pyk-tooltip"+selector).html(d);
            } else {
                that.tooltip.html(d);
            }
            return this;
        }
    }
    mouseEvent.tooltipHide = function (d,panels_enable,type) {
        if(PykCharts['boolean'](options.tooltip_enable) || PykCharts['boolean'](options.annotation_enable) || options.axis_x_data_format === "string" || options.axis_y_data_format === "string") {
            if(panels_enable === "yes" && type === "multilineChart") {
                return d3.selectAll(".pyk-tooltip").style("display","none");
            }
            else {
                return that.tooltip.style("display", "none");
            }
        }
    }
    return mouseEvent;
}