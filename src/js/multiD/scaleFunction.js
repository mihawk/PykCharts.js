PykCharts.scaleFunction = function (options) {
    options.k.scaleIdentification = function (type,data,range,x) {
        var scale;
        switch (type) {
            case "ordinal" :
                scale = d3.scale.ordinal()
                    .domain(data)
                    .rangeRoundBands(range, x);
                return scale;

            case "linear" :
                scale = d3.scale.linear()
                    .domain(data)
                    .range(range);
                return scale; 

            case "time" :
                scale = d3.time.scale()
                    .domain(data)
                    .range(range);
                return scale;
        }
    }
    options.k.ordinalXAxisTickFormat = function (domain,extra) {
        var a = d3.selectAll(options.selector + " g.x.axis .tick text")[0],
            len = a.length, comp, flag, largest = 0, rangeband = (extra*2);
        for(var i = 0; i < len; i++) {
            largest = (a[i].getBBox().width > largest) ? a[i].getBBox().width: largest;
        }
        if (rangeband >= (largest+10)) { flag = 1; }
        else if (rangeband >= (largest*0.75) && rangeband < largest) { flag = 2; }
        else if (rangeband >= (largest*0.65) && rangeband < (largest*0.75)) { flag = 3; }
        else if (rangeband >= (largest*0.55) && rangeband < (largest*0.65)) { flag = 4; }
        else if (rangeband >= (largest*0.35) && rangeband < (largest*0.55)) { flag = 5; }
        else if (rangeband <= 20 || rangeband < (largest*0.35)) { flag = 0; }

        for(var i=0; i<len; i++) {
            comp = a[i].__data__;
            if (flag === 0) {
                comp = "";
                d3.selectAll(options.selector + " .x.axis .tick").remove();
            }
            else if (rangeband >= (a[i].getBBox().width+10) && flag === 1) {}
            else if (rangeband >= (a[i].getBBox().width*0.75) && rangeband < a[i].getBBox().width && flag === 2){
                comp = comp.substr(0,5) + "..";
            }
            else if (rangeband >= (a[i].getBBox().width*0.65) && rangeband < (a[i].getBBox().width*0.75) && flag === 3){
                comp = comp.substr(0,4) + "..";
            }
            else if (flag === 4){
                comp = comp.substr(0,3);
            }
            else if (flag === 5){
                comp = comp.substr(0,2);
            }
            d3.select(a[i]).text(comp);
        }

        xaxistooltip = d3.selectAll(options.selector + " g.x.axis .tick text")
            .data(domain);

        if(options.mode === "default") {
            xaxistooltip.on('mouseover',function (d) {
                options.mouseEvent.tooltipPosition(d);
                options.mouseEvent.tooltipTextShow(d);
            })
            .on('mousemove', function (d) {
                options.mouseEvent.tooltipPosition(d);
                options.mouseEvent.tooltipTextShow(d);
            })
            .on('mouseout', function (d) {
                options.mouseEvent.tooltipHide(d);
            });
        }

        return this;
    }
    options.k.ordinalYAxisTickFormat = function (domain) {
        var a = d3.selectAll(options.selector + " g.y.axis .tick text")[0];
        var len = a.length,comp;

        for(i=0; i<len; i++) {
            comp = a[i].__data__;
            if(a[i].getBBox().width > (options.chart_margin_left * 0.9)) {
                comp = comp.substr(0,3) + "..";
            }

            d3.select(a[i]).text(comp);
        }
        yaxistooltip = d3.selectAll(options.selector + " g.y.axis .tick text")
            .data(domain);
        if (options.mode === "default") {
            yaxistooltip.on('mouseover',function (d) {
                options.mouseEvent.tooltipPosition(d);
                options.mouseEvent.tooltipTextShow(d);
            })
            .on('mousemove', function (d) {
                options.mouseEvent.tooltipPosition(d);
                options.mouseEvent.tooltipTextShow(d);
            })
            .on('mouseout', function (d) {
                options.mouseEvent.tooltipHide(d);
            });
       }
        return this;
    }
    options.k.xAxis =  function (svg, gsvg, xScale,extra,domain,tick_values,legendsGroup_height,type) {
        if(PykCharts['boolean'](options.axis_x_enable)) {
            var width = options.chart_width,
                height = options.chart_height,
                e = extra;

            if(legendsGroup_height === undefined) {
                legendsGroup_height = 0;
            }
            d3.selectAll(options.selector + " .x.axis").attr("fill",function () {return options.axis_x_pointer_color;});
            if(options.axis_x_position === "bottom") {
                gsvg.attr("transform", "translate(0," + (options.chart_height - options.chart_margin_top - options.chart_margin_bottom - legendsGroup_height) + ")");
            }

            var xaxis = PykCharts.Configuration.makeXAxis(options,xScale);

            if(tick_values && tick_values.length) {
                xaxis.tickValues(tick_values);
            }

            gsvg.style("stroke",function () { return options.axis_x_line_color; })
                .call(xaxis)
            if((options.axis_x_data_format === "string") && options.panels_enable === "no") {
                options.k.ordinalXAxisTickFormat(domain,extra);
            }

            d3.selectAll(options.selector + " .x.axis .tick text")
                .attr("font-size",options.axis_x_pointer_size)
                .style({
                    "font-weight" : options.axis_x_pointer_weight,
                    "font-family" : options.axis_x_pointer_family
                });

            if(type && options.axis_x_data_format !== "string") {
                d3.selectAll(options.selector + " .x.axis .domain").remove();
            }
        }

        return this;
    }
    options.k.yAxis = function (svg, gsvg, yScale,domain,tick_values,legendsGroup_width, type) {
        if(PykCharts['boolean'](options.axis_y_enable)){
            if(!legendsGroup_width) {
                legendsGroup_width = 0;
            }
            var width = options.chart_width,
                height = options.chart_height,
                w = PykCharts['boolean'](options.panels_enable) ? options.w : options.chart_width;

            if(options.axis_y_position === "right") {
                gsvg.attr("transform", "translate(" + (w - options.chart_margin_left - options.chart_margin_right - legendsGroup_width) + ",0)");
            }
            d3.selectAll(options.selector + " .y.axis").attr("fill",function () { return options.axis_y_pointer_color; });
            var yaxis = PykCharts.Configuration.makeYAxis(options,yScale,legendsGroup_width);

            if(tick_values && tick_values.length) {
                yaxis.tickValues(tick_values);
            }

            var mouseEvent = new PykCharts.Configuration.mouseEvent(options);
            gsvg.style("stroke",function () { return options.axis_y_line_color; })
                .call(yaxis)
            if((options.axis_y_data_format === "string") && options.panels_enable === "no") {
                options.k.ordinalYAxisTickFormat(domain);
            }

            d3.selectAll(options.selector + " .y.axis .tick text")
                    .attr("font-size",options.axis_y_pointer_size)
                    .style({
                        "font-weight" : options.axis_y_pointer_weight,
                        "font-family" : options.axis_y_pointer_family
                    });

            if(type && options.axis_y_data_format !== "string") {
                d3.selectAll(options.selector + " .y.axis .domain").remove();
            }

        }
        return this;
    }
    options.k.xAxisTitle = function (gsvg,legendsGroup_height,legendsGroup_width) {
        if(options.axis_x_title) {
            var w = PykCharts['boolean'](options.panels_enable) ? options.w : options.chart_width,
            position;
            if(!legendsGroup_height) {
                legendsGroup_height = 0;
            }
            if(!legendsGroup_width) {
                legendsGroup_width = 0;
            }

            if(!PykCharts['boolean'](options.axis_x_enable)) {
                gsvg.attr("transform", "translate(0," + (options.chart_height - options.chart_margin_top - options.chart_margin_bottom - legendsGroup_height) + ")");
            }

            if(options.axis_x_position === "bottom") {
                position = options.chart_margin_bottom;
            } else if (options.axis_x_position === "top") {
                position = - options.chart_margin_top + options.axis_x_title_size;
            }
             gsvg.append("text")
                .attr({
                    "class" : "x-axis-title",
                    "x" : (w - options.chart_margin_left - options.chart_margin_right -legendsGroup_width)/2,
                    "y" : position
                })
                .style({
                    'text-anchor':'middle',"fill":options.axis_x_title_color,
                    'font-weight':options.axis_x_title_weight,
                    'font-size':options.axis_x_title_size
                })
                .text(options.axis_x_title);
        }
        return this;
    }
    options.k.yAxisTitle = function (gsvg) {        
        if(options.axis_y_title) {
            var w = PykCharts['boolean'](options.panels_enable) ? options.w : options.chart_width,
            position,dy;
            if(options.axis_y_position === "left"){
                position = -(options.chart_margin_left - options.axis_y_title_size);
                dy = 0;
            } else if (options.axis_y_position === "right") {
                position = (options.chart_margin_right - options.axis_y_title_size);
                dy = "0.71em";
            }
            gsvg.append("text")
                .attr({
                    "class" : "y-axis-title",
                    "x" : -(options.chart_height)/2,
                    "transform" : "rotate(-90)",
                    "y" : position,
                    "dy" : dy
                })
                .style({
                    "fill":options.axis_y_title_color,
                    "font-weight":options.axis_y_title_weight,
                    "font-family":options.axis_y_title_family,
                    "font-size":options.axis_y_title_size
                })
                .text(options.axis_y_title);
        }
        return this;
    }
    options.k.isOrdinal = function(svg,container,scale,domain,extra) {
        if(container === ".x.axis" && PykCharts['boolean'](options.axis_x_enable)) {
            svg.select(container).call(PykCharts.Configuration.makeXAxis(options,scale));
            if((options.axis_x_data_format === "string") && options.panels_enable === "no") {
                options.k.ordinalXAxisTickFormat(domain,extra);
            }
        }
        else if (container === ".x.grid") {
            svg.select(container).call(PykCharts.Configuration.makeXGrid(options,scale));
        }
        else if (container === ".y.axis" && PykCharts['boolean'](options.axis_y_enable)) {
            svg.select(container).call(PykCharts.Configuration.makeYAxis(options,scale));
            if((options.axis_y_data_format === "string") && options.panels_enable === "no") {
                options.k.ordinalyAxisTickFormat(domain);
            }
        }
        else if (container === ".y.grid") {
            svg.select(container).call(PykCharts.Configuration.makeYGrid(options,scale));
        }
        return this;
    }
    
}