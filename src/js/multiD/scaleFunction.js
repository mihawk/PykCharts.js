PykCharts.scaleFunction = function (options) {
    var isNumber = options.k.__proto__._isNumber;
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
            comp = a[i].textContent;
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
    options.k.xAxis =  function (svg, gsvg, xScale,extra,domain,tick_values,legendsGroup_height,type,that) {
        if(PykCharts['boolean'](options.axis_x_enable)) {
            var width = options.chart_width,
                height = options.chart_height,
                e = extra;

            if(legendsGroup_height === undefined) {
                legendsGroup_height = 0;
            }
            d3.selectAll(options.selector + " .x.axis").attr("fill",function () {
                if (that && that.axis_x_pointer_color != undefined && that.axis_x_pointer_color != "") {
                    return that.axis_x_pointer_color;
                }
                else {
                    return options.axis_x_pointer_color;
                }
            });
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
    options.k.yAxis = function (svg, gsvg, yScale,domain,tick_values,legendsGroup_width, type,  tick_format_function, that) {
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
            d3.selectAll(options.selector + " .y.axis").attr("fill",function () {
                if (that && that.axis_y_pointer_color != undefined && that.axis_y_pointer_color != "") {
                    return that.axis_y_pointer_color;
                }                
                else {
                    return options.axis_y_pointer_color;    
                }             
            });
            var yaxis = PykCharts.Configuration.makeYAxis(options,yScale,tick_format_function);

            if(tick_values && tick_values.length) {
                yaxis.tickValues(tick_values);
            }

            var mouseEvent = new PykCharts.Configuration.mouseEvent(options);
            gsvg.style("stroke",function () { return options.axis_y_line_color; })
                .call(yaxis);

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
            if(options.axis_y_position === "left") {
                position = -(options.chart_margin_left - options.axis_y_title_size);
                dy = 0;
            } else if (options.axis_y_position === "right") {
                position = (options.chart_margin_right - options.axis_y_title_size);
                dy = "0.71em";
            }
            gsvg.append("text")
                .attr({
                    "class" : "y-axis-title",
                    "x" : -((options.chart_height - options.chart_margin_bottom - options.chart_margin_top)/2),
                    "transform" : "rotate(-90)",
                    "y" : position,
                    "dy" : dy
                })
                .style({
                    "fill":options.axis_y_title_color,
                    "font-weight":options.axis_y_title_weight,
                    "font-family":options.axis_y_title_family,
                    "font-size":options.axis_y_title_size,
                    "text-anchor":"middle"
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
    options.k.xAxisDataFormatIdentification = function (data){
        if(isNumber(data[0].x) || !(isNaN(data[0].x))){
            return "number";
        } else if(!(isNaN(new Date(data[0].x).getTime()))) {
            return "time";
        } else {
            return "string";
        }
    }
    options.k.yAxisDataFormatIdentification = function (data) {
        if(isNumber(data[0].y) || !(isNaN(data[0].y))){
            return "number";
        } else if(!(isNaN(new Date(data[0].y).getTime()))) {
            return "time";
        } else {
            return "string";
        }
    }
    options.k.processXAxisTickValues = function () {
        var values = [], newVal = [];
        var length = options.axis_x_pointer_values.length;
        if(length) {
            for(var i = 0 ; i < length ; i++) {
                if(options.axis_x_data_format === "number") {
                    if((isNumber(options.axis_x_pointer_values[i]) || !(isNaN(options.axis_x_pointer_values[i]))) && options.axis_x_pointer_values[i]!=""){

                        values.push(parseFloat(options.axis_x_pointer_values[i]))
                    }
                } else if(options.axis_x_data_format === "time") {
                    if(!(isNaN(new Date(options.axis_x_pointer_values[i]).getTime()))) {
                        values.push(options.axis_x_pointer_values[i])
                    }
                }
            }
        }
        if(values.length) {
            var len = values.length
            if(options.axis_x_data_format === "time") {
                for(var i=0 ; i<len; i++) {
                    newVal.push(options.k.dateConversion(values[i]));            
                }
            } else {
                newVal = values;
            }
        }

        return newVal;
    }
    options.k.processYAxisTickValues = function () {
        var length = options.axis_y_pointer_values.length;
        var values = [];
        if(length) {
            for(var i = 0 ; i < length ; i++) {
                if(options.axis_y_data_format === "number") {
                    if((isNumber(options.axis_y_pointer_values[i]) || !(isNaN(options.axis_y_pointer_values[i]))) && options.axis_y_pointer_values[i]!=""){
                        values.push(options.axis_y_pointer_values[i])
                    }
                }
            }
        }
        return values;
    }
}
var configuration = PykCharts.Configuration;
configuration.makeXAxis = function(options,xScale) {
    var that = this;
    var k = PykCharts.Configuration(options);
    var xaxis = d3.svg.axis()
                    .scale(xScale)
                    .tickSize(options.axis_x_pointer_length)
                    .outerTickSize(options.axis_x_outer_pointer_length)
                    .tickFormat(function (d,i) {
                        if(options.panels_enable === "yes" && options.axis_x_data_format === "string") {
                            return d.substr(0,2);
                        }
                        else {
                            return d;
                        }
                    })
                    .tickPadding(options.axis_x_pointer_padding)
                    .orient(options.axis_x_pointer_position);

    d3.selectAll(options.selector + " .x.axis .tick text")
            .attr("font-size",options.axis_x_pointer_size +"px")
            .style({
                "font-weight" : options.axis_x_pointer_weight,
                "font-family" : options.axis_x_pointer_family
            });

    if(options.axis_x_data_format=== "time" && PykCharts['boolean'](options.axis_x_time_value_datatype)) {
        switch (options.axis_x_time_value_datatype) {
            case "month" :
                a = d3.time.month;
                b = "%b";
                break;

            case "date" :
                a = d3.time.day;
                b = "%d";
                break;

            case "year" :
                a = d3.time.year;
                b = "%Y";
                break;

            case "hours" :
                a = d3.time.hour;
                b = "%H";
                break;

            case "minutes" :
                a = d3.time.minute;
                b = "%M";
                break;
        }
        xaxis.ticks(a,options.axis_x_time_value_interval)
            .tickFormat(d3.time.format(b));

    } else if(options.axis_x_data_format === "number") {
        xaxis.ticks(options.axis_x_no_of_axis_value);
    }

    return xaxis;
};

configuration.makeYAxis = function(options,yScale,tick_format_function) {
    var that = this;
    var k = PykCharts.Configuration(options);
    var yaxis = d3.svg.axis()
                    .scale(yScale)
                    .orient(options.axis_y_pointer_position)
                    .tickSize(options.axis_y_pointer_length)
                    .outerTickSize(options.axis_y_outer_pointer_length)
                    .tickPadding(options.axis_y_pointer_padding)
                    .tickFormat(function (d,i) {
                        if(tick_format_function) {
                            return tick_format_function(d);
                        } else {
                            return d;                            
                        }
                    });

    d3.selectAll(options.selector + " .y.axis .tick text")
                .attr("font-size",options.axis_y_pointer_size +"px")
                .style({
                    "font-weight" : options.axis_y_pointer_weight,
                    "font-family" : options.axis_y_pointer_family
                });

    /*if(options.axis_y_data_format=== "time" && PykCharts['boolean'](options.axis_y_time_value_type)) {
        switch (options.axis_y_time_value_datatype) {
            case "month" :
                a = d3.time.month;
                b = "%b";
                break;

            case "date" :
                a = d3.time.day;
                b = "%d";
                break;

            case "year" :
                a = d3.time.year;
                b = "%Y";
                break;

            case "hours" :
                a = d3.time.hour;
                b = "%H";
                break;

            case "minutes" :
                a = d3.time.minute;
                b = "%M";
                break;
        }
        xaxis.ticks(a,options.axis_y_time_value_unit)
            .tickFormat(d3.time.format(b));

    }else */if(options.axis_y_data_format === "number"){
        yaxis.ticks(options.axis_y_no_of_axis_value);
    }
    return yaxis;
};
