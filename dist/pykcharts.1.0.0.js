/*! ====================================================
* This file is part of PykCharts v1.0.0
* Copyright 2014 Pykih Software LLP
* Contact: charts@pykih.com
* ======================================================
*
* Licensees holding valid commercial licenses may use
* this file in accordance with the Commercial Software
* License Agreement provided with the Software or,
* alternatively, in accordance with the terms contained
* in a written agreement between you and Pykih.
*
* https://chartstore.io/license
*
* If you are unsure which license is appropriate for
* your use, please contact the sales department at
* charts@pykih.com
*
* ====================================================== */

var PykCharts = {};
PykCharts.assets = "../pykih-charts/assets/";
PykCharts.export_menu_status = 0;

PykCharts['boolean'] = function(d) {
    var false_values = ['0','f',"false",'n','no','',0,"0.00","0.0",0.0,0.00];
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

PykCharts.getEvent = function () {
  try {
    return d3.event || event;
  } catch (e) {
    return event;
  }
}

PykCharts.Configuration = function (options){
    var that = this;

    var configuration = {
        liveData: function (chart) {
            var frequency = options.real_time_charts_refresh_frequency;
            if(PykCharts['boolean'](frequency)) {
                PykCharts.interval = setInterval(chart.refresh,frequency*1000);
            }
            return this;
        },
        emptyDiv: function () {
            d3.select(options.selector).append("div")
                .style("clear","both");

            return this;
        },
        scaleIdentification: function (type,data,range,x) {
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
        appendUnits: function (text) {
            text = PykCharts.numberFormat(text);
            var label,prefix,suffix;
                prefix = options.units_prefix,
                suffix = options.units_suffix;
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

            return label;
        },
        title: function () {
            if(PykCharts['boolean'](options.title_text) && options.title_size) {
                var div_width;

                if(PykCharts['boolean'](options.export_enable)) {
                    div_width = 0.9*options.width;
                } else {
                    div_width = options.width;
                }

                that.titleDiv = d3.select(options.selector)
                    .append("div")
                        .attr("id","title")
                        .style("width", (div_width) + "px")
                        .style("text-align","left")
                        .style("float","left")
                        .html("<span style='pointer-events:none;font-size:" +
                        options.title_size+
                        "px;color:" +
                        options.title_color+
                        ";font-weight:" +
                        options.title_weight+
                        ";padding-left:1px;font-family:" +
                        options.title_family
                        + "'>" +
                        options.title_text +
                        "</span>");
            }
            return this;
        },
        subtitle: function () {
            if(PykCharts['boolean'](options.subtitle_text) && options.subtitle_size) {
                that.subtitleDiv = d3.select(options.selector)
                    .append("div")
                        .attr("id","sub-title")
                        .style("width", options.width + "px")
                        .style("text-align","left")
                        .html("<span style='pointer-events:none;font-size:" +
                        options.subtitle_size+"px;color:" +
                        options.subtitle_color +
                        ";font-weight:" +
                        options.subtitle_weight+";padding-left:1px;font-family:" +
                        options.subtitle_family + "'>"+
                        options.subtitle_text + "</span>");
            }
            return this;
        },
        createFooter: function () {
            d3.select(options.selector).append("table")
                .attr("id","footer")
                .style("background", options.bg)
                .attr("width",options.width+"px");
            return this;
        },
        lastUpdatedAt: function (a) {
            if(PykCharts['boolean'](options.real_time_charts_refresh_frequency) && PykCharts['boolean'](options.real_time_charts_last_updated_at_enable)) {
                if(a === "liveData"){
                    var currentdate = new Date();
                    var date = currentdate.getDate() + "/"+(currentdate.getMonth()+1)
                        + "/" + currentdate.getFullYear() + " "
                        + currentdate.getHours() + ":"
                        + currentdate.getMinutes() + ":" + currentdate.getSeconds();
                    $(options.selector+" #lastUpdatedAt").html("<span style='pointer-events:none;'>Last Updated At: </span><span style='pointer-events:none;'>"+ date +"</span>");
                } else {
                    var currentdate = new Date();
                    var date = currentdate.getDate() + "/"+(currentdate.getMonth()+1)
                        + "/" + currentdate.getFullYear() + " "
                        + currentdate.getHours() + ":"
                        + currentdate.getMinutes() + ":" + currentdate.getSeconds();
                    d3.select(options.selector+" #footer")
                        .append("tr")
                        .attr("class","PykCharts-credits")
                        .html("<td colspan=2 style='text-align:right' id='lastUpdatedAt'><span style='pointer-events:none;'>Last Updated At: </span><span style='pointer-events:none;'>"+ date +"</span></tr>")
                }
            }
            return this;
        },
        checkChangeInData: function (data, compare_data) { // this function checks if the data in json has been changed
            var key1 = Object.keys(compare_data[0]);
            var key2 = Object.keys(data[0]);
            var changed = false;
            if(key1.length === key2.length && compare_data.length === data.length) {
                for(i=0;i<data.length;i++) {
                    for(j=0;j<key1.length;j++){
                        if(typeof data[i][key2[j]] !== "object" && typeof compare_data[i][key1[j]] !== "object") {
                            if(data[i][key2[j]] !== compare_data[i][key1[j]] || key1[j] !== key2[j]) {
                                changed = true;
                                break;
                            }
                        } else {
                            if(!(_.isEqual(data[i][key2[j]],compare_data[i][key1[j]])) || key1[j] !== key2[j]) {
                                changed = true;
                                break;
                            }
                        }
                    }
                }
            } else {
                changed = true;
            }
            that.compare_data = data;
            return [that.compare_data, changed];
        },
        credits: function () {
            if(PykCharts['boolean'](options.credit_my_site_name) || PykCharts['boolean'](options.credit_my_site_url)) {
                var enable = true;

                if(options.credit_my_site_name === "") {
                    options.credit_my_site_name = options.credit_my_site_url;
                }
                if(options.credit_my_site_url === "") {
                    enable = false;
                }

                d3.select(options.selector+" #footer").append("tr")
                    .attr("class","PykCharts-credits")
                    .attr("id","credit-datasource")
                    .append("td")
                    .style("text-align","left")
                    .html("<span style='pointer-events:none;'>Credits: </span><a href='" +  options.credit_my_site_url + "' target='_blank' onclick='return " + enable +"'>"+  options.credit_my_site_name +"</a>");

            }
            return this;
        },
        dataSource: function () {
            if( (PykCharts['boolean'](options.data_source_name) || PykCharts['boolean'](options.data_source_url))) {
                var enable = true;
                if(options.data_source_name === "") {
                    options.data_source_name =options.data_source_url;
                }
                if(options.data_source_url === "") {
                    enable = false;
                }
                if($(options.selector+" #footer").length) {
                    d3.select(options.selector+" table #credit-datasource")
                        .style("background", options.bg)
                        .append("td")
                        .style("text-align","right")
                        .html("<span style='pointer-events:none;'>Source: </span><a href='" + options.data_source_url + "' target='_blank' onclick='return " + enable +"'>"+ options.data_source_name +"</a></tr>");
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
                        .html("<span style='pointer-events:none;'>Source: </span><a href='" + options.data_source_url + "' target='_blank' onclick='return " + enable +"'>"+ options.data_source_name +"</a></tr>");
                }
            }
            return this;
        },
        makeMainDiv: function (selection,i) {
            var d = d3.select(selection).append("div")
                .attr("id","tooltip-svg-container-"+i)
                .attr("class","main-div")
                .style("width",options.width);
            if(PykCharts['boolean'](options.panels_enable)){
                d.style("float","left")
                    .style("width","auto");
            }
            return this;
        },
        tooltip: function (d,selection,i,flag ) {
            if((PykCharts['boolean'](options.tooltip_enable) || options.axis_x_data_format === "string" || options.axis_y_data_format === "string" || PykCharts['boolean'](options.annotation_enable)) && options.mode === "default") {
                if(selection !== undefined){
                    var selector = options.selector.substr(1,options.selector.length)
                    PykCharts.Configuration.tooltipp = d3.select("body").append("div")
                        .attr("id", "tooltip-svg-container-" + i + "-pyk-tooltip"+selector)
                        .attr("class","pyk-tooltip")
                        .style("height","auto")
                        .style("weight","auto")
                        .style("padding", "5px 6px")
                        .style("color","#4F4F4F")
                        .style("background","#fff")
                        .style("text-decoration","none")
                        .style("position", "absolute")
                        .style("border-radius", "5px")
                        .style("border","1px solid #CCCCCC")
                        .style("font-family","'Helvetica Neue', Helvetica, Arial, sans-serif")
                        .style("font-size","12px")
                        .style("text-align","center")
                        .style("min-width","30px")
                        .style("z-index","10")
                        .style("display", "none")
                        .style("box-shadow","0 5px 10px rgba(0,0,0,.2)")
                        .style("pointer-events","none");
                } else {
                    PykCharts.Configuration.tooltipp = d3.select("body")
                        .append("div")
                        .attr("id", "pyk-tooltip")
                        .attr("class","pyk-tooltip")
                        .style("height","auto")
                        .style("weight","auto")
                        .style("padding", "5px 6px")
                        .style("color","#4F4F4F")
                        .style("background","#fff")
                        .style("text-decoration","none")
                        .style("position", "absolute")
                        .style("border-radius", "5px")
                        .style("border","1px solid #CCCCCC")
                        .style("font-family","'Helvetica Neue', Helvetica, Arial, sans-serif")
                        .style("font-size","12px")
                        .style("text-align","center")
                        .style("min-width","30px")
                        .style("z-index","10")
                        .style("display", "none")
                        .style("box-shadow","0 5px 10px rgba(0,0,0,.2)");
                }
            } else if (PykCharts['boolean'](options.tooltip_enable)) {
                if (options.tooltip_mode === "fixed") {
                    PykCharts.Configuration.tooltipp = d3.select("body")
                        .append("div")
                        .attr("id", "pyk-tooltip")
                        .attr("class","pyk-tooltip")
                        .style("height","auto")
                        .style("weight","auto")
                        .style("padding", "5px 6px")
                        .style("color","#4F4F4F")
                        .style("background","#fff")
                        .style("text-decoration","none")
                        .style("position", "absolute")
                        .style("border-radius", "5px")
                        .style("border","1px solid #CCCCCC")
                        .style("font-family","'Helvetica Neue', Helvetica, Arial, sans-serif")
                        .style("font-size","12px")
                        .style("text-align","center")
                        .style("min-width","30px")
                        .style("z-index","10")
                        .style("display", "none")
                        .style("box-shadow","0 5px 10px rgba(0,0,0,.2)");
                } else {
                    PykCharts.Configuration.tooltipp = d3.select("body")
                        .append("div")
                        .attr("id", "pyk-tooltip")
                        .attr("class","pyk-tooltip")
                        .style("height","auto")
                        .style("weight","auto")
                        .style("padding", "5px 6px")
                        .style("color","#4F4F4F")
                        .style("background","#fff")
                        .style("text-decoration","none")
                        .style("position", "absolute")
                        .style("border-radius", "5px")
                        .style("border","1px solid #CCCCCC")
                        .style("font-family","'Helvetica Neue', Helvetica, Arial, sans-serif")
                        .style("font-size","12px")
                        .style("text-align","center")
                        .style("min-width","30px")
                        .style("z-index","10")
                        .style("display", "none")
                        .style("box-shadow","0 5px 10px rgba(0,0,0,.2)");
                }
            }
            return this;
        },
        annotation: function (svg,data,xScale,yScale) {
            var legendsGroup_height = (options.legendsGroup_height) ? options.legendsGroup_height: 0;

            if(options.annotation_view_mode.toLowerCase() === "onclick") {
                var annotation_circle = d3.select(svg).selectAll(".PykCharts-annotation-circle")
                    .data(data);
                var annotation_text = d3.select(svg).selectAll(".PykCharts-annotation-text")
                    .data(data);

                annotation_circle.enter()
                    .append("circle")
                    .attr("class","PykCharts-annotation-circle");
                annotation_text.enter()
                    .append("text")
                    .attr("class","PykCharts-annotation-text");
                annotation_text
                    .text(function (d) {
                        return "";
                    });
                annotation_circle
                    .attr("r",0);
                setTimeout(function () {
                    annotation_text.attr("x",function (d) {
                            return parseInt(xScale(d.x))+options.extra_left_margin+options.margin_left;
                        })
                        .attr("y", function (d) {
                            return parseInt(yScale(d.y)-16+options.margin_top+legendsGroup_height);
                        })
                        .attr("text-anchor","middle")
                        .style("font-size","12px")
                        .style("pointer-events","none");
                    annotation_circle
                        .attr("cx",function (d,i) {
                            return (parseInt(xScale(d.x))+options.extra_left_margin+options.margin_left);
                        })
                        .attr("cy", function (d,i) {
                            return (parseInt(yScale(d.y))-15+options.margin_top+legendsGroup_height);
                        })
                        .attr("r", "7")
                        .style("cursor","pointer")
                        .on("click",function (d,i) {
                            options.mouseEvent.tooltipPosition(d);
                            options.mouseEvent.tooltipTextShow(d.annotation);
                        })
                        .on("mouseover", function (d) {
                            options.mouseEvent.tooltipHide(d,options.panels_enable,"multilineChart")
                        })
                        .attr("fill",options.annotation_background_color)
                },options.transitions.duration());

                annotation_text.exit().remove();
                annotation_circle.exit().remove();
            } else if(options.annotation_view_mode.toLowerCase() === "onload") {
                var w = [],h=[];
                var annotation_rect = d3.select(svg).selectAll(".annotation-rect")
                    .data(data)

                annotation_rect.enter()
                    .append("rect")
                    .attr("class","annotation-rect");

                var annotation_text = d3.select(svg).selectAll(".annotation-text")
                    .data(data)

                annotation_text.enter()
                    .append("text")
                    .attr("class","annotation-text");
                annotation_text
                    .text(function (d) {
                        return "";
                    });
                annotation_rect
                    .attr("width",0)
                    .attr("height",0);
                setTimeout(function () {
                    annotation_text.attr("x",function (d) {
                            return parseInt(xScale(d.x)-(5))+options.extra_left_margin+options.margin_left;
                        })
                        .attr("y", function (d) {
                            return parseInt(yScale(d.y)-18+options.margin_top+legendsGroup_height);
                        })
                        .attr("text-anchor","middle")
                        .style("font-size","12px")
                        .text(function (d) {
                            return d.annotation;
                        })
                        .text(function (d,i) {
                            w[i] = this.getBBox().width + 20;
                            h[i] = this.getBBox().height + 10;
                            return d.annotation;
                        })
                        .attr("fill",options.annotation_font_color)
                        .style("pointer-events","none");

                    annotation_rect.attr("x",function (d,i) {
                            return (parseInt(xScale(d.x)-(5))+options.extra_left_margin+options.margin_left) - (w[i]/2);
                        })
                        .attr("y", function (d,i) {
                            return (parseInt(yScale(d.y)-10+options.margin_top)+legendsGroup_height) - h[i];
                        })
                        .attr("width",function (d,i) { return w[i]; })
                        .attr("height",function (d,i) { return h[i]; })
                        .attr("fill",options.annotation_background_color)
                        .style("pointer-events","none");
                },options.transitions.duration());
                annotation_text.exit()
                    .remove();
                annotation_rect.exit()
                    .remove();
            }

            return this;
        },
        dateConversion: function (d) {
            d = new Date(d);
            var time_zone = d.getTimezoneOffset();
            d = new Date(d.getTime() + (time_zone * 60 * 1000));
            return d;
        },
        crossHair: function (svg,len,data,fill,type) {

            if(PykCharts['boolean'](options.crosshair_enable) && options.mode === "default") {
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

                for (j=0; j<len; j++) {
                    PykCharts.Configuration.focus_circle = svg.append("g")
                        .attr("class","focus")
                        .style("display","none")
                        .attr("id","f_circle"+j);

                    PykCharts.Configuration.focus_circle.append("circle")
                        .attr("fill",function (d) {
                            return fill.colorPieMS(data[j],type);
                        })
                        .attr("id","focus-circle"+j)
                        .attr("r","6");
                }
            }
            return this;
        },
        fullScreen: function (chart) {
            if(PykCharts['boolean'](options.fullScreen)) {
                that.fullScreenButton = d3.select(options.selector)
                    .append("input")
                        .attr("type","image")
                        .attr("id","btn-zoom")
                        .attr("src",PykCharts.assets+"PykCharts/img/apple_fullscreen.jpg")
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
            var loading_content;
            $(options.selector).css("height",options.height);
            if(options.loading_type === "image") {
                loading_content = "<img src=" + options.loading_source + ">"
            } else {
                loading_content = options.loading_source;
            }

            $(options.selector).html("<div id='chart-loader'>" + loading_content + "</div>");
            var initial_height_div = $(options.selector).height();
            $(options.selector + " #chart-loader").css({"visibility":"visible","padding-left":(options.width/2) +"px","padding-top":(initial_height_div/2) + "px"});
            return this;
        },
        positionContainers: function (position, chart) {
            if(PykCharts['boolean'](options.legends_enable) && !(PykCharts['boolean'](options.variable_circle_size_enable))) {
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
        yGrid: function (svg, gsvg, yScale,legendsGroup_width) {
            var width = options.width,
                height = options.height;
            if(PykCharts['boolean'](options.grid_y_enable)) {
                var ygrid = PykCharts.Configuration.makeYGrid(options,yScale,legendsGroup_width);
                gsvg.selectAll(options.selector + " g.y.grid-line")
                    .style("stroke",function () { return options.grid_color; })
                    .call(ygrid);
            }
            return this;
        },
        xGrid: function (svg, gsvg, xScale,legendsGroup_height) {
             var width = options.width,
                height = options.height;

            if(PykCharts['boolean'](options.grid_x_enable)) {
                var xgrid = PykCharts.Configuration.makeXGrid(options,xScale,legendsGroup_height);
                gsvg.selectAll(options.selector + " g.x.grid-line")
                    .style("stroke",function () { return options.grid_color; })
                    .call(xgrid);
            }
            return this;
        },
        xAxis: function (svg, gsvg, xScale,extra,domain,tick_values,legendsGroup_height,type) {
            var width = options.width,
                height = options.height;

            if(legendsGroup_height === undefined) {
                legendsGroup_height = 0;
            }

            var k = new PykCharts.Configuration(options);
            var e = extra;
            if(PykCharts['boolean'](options.axis_x_enable)) {
                d3.selectAll(options.selector + " .x.axis").attr("fill",function () {return options.axis_x_pointer_color;});
                if(options.axis_x_position === "bottom") {
                    gsvg.attr("transform", "translate(0," + (options.height - options.margin_top - options.margin_bottom - legendsGroup_height) + ")");
                }

                var xaxis = PykCharts.Configuration.makeXAxis(options,xScale);

                if(tick_values && tick_values.length) {
                    xaxis.tickValues(tick_values);
                }

                gsvg.style("stroke",function () { return options.axis_x_line_color; })
                    .call(xaxis)
                if((options.axis_x_data_format === "string") && options.panels_enable === "no") {
                    k.ordinalXAxisTickFormat(domain,extra);
                }

                d3.selectAll(options.selector + " .x.axis .tick text")
                        .attr("font-size",options.axis_x_pointer_size)
                        .style("font-weight",options.axis_x_pointer_weight)
                        .style("font-family",options.axis_x_pointer_family);
                if(type && options.axis_x_data_format !== "string") {
                    d3.selectAll(options.selector + " .x.axis .domain").remove();
                }
            }

            return this;
        },
        yAxis: function (svg, gsvg, yScale,domain,tick_values,legendsGroup_width, type) {

            if(!legendsGroup_width) {
                legendsGroup_width = 0;
            }
            var width = options.width,
                height = options.height;
            var k = new PykCharts.Configuration(options);
            var w;
                    if(PykCharts['boolean'](options.panels_enable)) {
                        w = options.w;
                    } else {
                        w = options.width;
                    }

            if(PykCharts['boolean'](options.axis_y_enable)){
                if(options.axis_y_position === "right") {
                    gsvg.attr("transform", "translate(" + (w - options.margin_left - options.margin_right - legendsGroup_width) + ",0)");
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
                    k.ordinalYAxisTickFormat(domain);
                }

                d3.selectAll(options.selector + " .y.axis .tick text")
                        .attr("font-size",options.axis_y_pointer_size)
                        .style("font-weight",options.axis_y_pointer_weight)
                        .style("font-family",options.axis_y_pointer_family);

                if(type && options.axis_y_data_format !== "string") {
                    d3.selectAll(options.selector + " .y.axis .domain").remove();
                }

            }
            return this;
        },
        xAxisTitle: function (gsvg,legendsGroup_height,legendsGroup_width) {
            var w;
            if(PykCharts['boolean'](options.panels_enable)) {
                w = options.w;
            } else {
                w = options.width;
            }

            if(!legendsGroup_height) {
                legendsGroup_height = 0;
            }

            if(!legendsGroup_width) {
                legendsGroup_width = 0;
            }

            if(options.axis_x_title) {

                if(!PykCharts['boolean'](options.axis_x_enable)) {
                    gsvg.attr("transform", "translate(0," + (options.height - options.margin_top - options.margin_bottom - legendsGroup_height) + ")");
                }

                if(options.axis_x_position === "bottom") {
                    gsvg.append("text")
                        .attr("class","x-axis-title")
                        .attr("x", (w- options.margin_left - options.margin_right - legendsGroup_width)/2)
                        .attr("y", options.margin_bottom)
                        .style("text-anchor", "middle")
                        .style("fill",options.axis_x_title_color)
                        .style("font-weight",options.axis_x_title_weight)
                        .style("font-family",options.axis_x_title_family)
                        .style("font-size",options.axis_x_title_size)
                        .text(options.axis_x_title);

                } else if (options.axis_x_position === "top") {
                    gsvg.append("text")
                        .attr("class","x-axis-title")
                        .attr("x", (w - options.margin_left - options.margin_right -legendsGroup_width)/2)
                        .attr("y", - options.margin_top + options.axis_x_title_size)
                        .style("text-anchor", "middle")
                        .style("fill",options.axis_x_title_color)
                        .style("font-weight",options.axis_x_title_weight)
                        .style("font-family",options.axis_x_title_family)
                        .style("font-size",options.axis_x_title_size)
                        .text(options.axis_x_title);
                }
            }
            return this;
        },
        yAxisTitle: function (gsvg) {
             var w;
                if(PykCharts['boolean'](options.panels_enable)) {
                    w = options.w;
                } else {
                    w = options.width;
                }
            if(options.axis_y_title) {
                if(options.axis_y_position === "left"){
                    gsvg.append("text")
                        .attr("class","y-axis-title")
                        .attr("x",-(options.height)/2)
                        .attr("transform", "rotate(-90)")
                        .attr("y", -(options.margin_left - options.axis_y_title_size))
                        .style("fill",options.axis_y_title_color)
                        .style("font-weight",options.axis_y_title_weight)
                        .style("font-family",options.axis_y_title_family)
                        .style("font-size",options.axis_y_title_size)
                        .text(options.axis_y_title);
                } else if (options.axis_y_position === "right") {
                    gsvg.append("text")
                        .attr("class","y-axis-title")
                        .attr("x",-(options.height)/2)
                        .attr("transform", "rotate(-90)")
                        .attr("y", (options.margin_right - options.axis_y_title_size))
                        .attr("dy", ".71em")
                        .style("fill",options.axis_y_title_color)
                        .style("font-weight",options.axis_y_title_weight)
                        .style("font-family",options.axis_y_title_family)
                        .style("font-size",options.axis_y_title_size)
                        .text(options.axis_y_title);
                }
            }
            return this;
        },
        isOrdinal: function(svg,container,scale,domain,extra) {
            var k = new PykCharts.Configuration(options);
            if(container === ".x.axis" && PykCharts['boolean'](options.axis_x_enable)) {
                svg.select(container).call(PykCharts.Configuration.makeXAxis(options,scale));
                if((options.axis_x_data_format === "string") && options.panels_enable === "no") {
                    k.ordinalXAxisTickFormat(domain,extra);
                }
            }
            else if (container === ".x.grid") {
                svg.select(container).call(PykCharts.Configuration.makeXGrid(options,scale));
            }
            else if (container === ".y.axis" && PykCharts['boolean'](options.axis_y_enable)) {
                svg.select(container).call(PykCharts.Configuration.makeYAxis(options,scale));
                if((options.axis_y_data_format === "string") && options.panels_enable === "no") {
                    k.ordinalyAxisTickFormat(domain);
                }
            }
            else if (container === ".y.grid") {
                svg.select(container).call(PykCharts.Configuration.makeYGrid(options,scale));
            }
            return this;
        },
        ordinalXAxisTickFormat :function (domain,extra) {
                var a = $(options.selector + " g.x.axis .tick text"),
                len = a.length, comp, flag, largest = 0, rangeband = (extra*2);

            _.each(a, function (d) {
                largest = (d.getBBox().width > largest) ? d.getBBox().width: largest;
            });
            if (rangeband >= (largest+10)) { flag = 1; }
            else if (rangeband >= (largest*0.75) && rangeband < largest) { flag = 2; }
            else if (rangeband >= (largest*0.65) && rangeband < (largest*0.75)) { flag = 3; }
            else if (rangeband >= (largest*0.55) && rangeband < (largest*0.65)) { flag = 4; }
            else if (rangeband >= (largest*0.35) && rangeband < (largest*0.55)) { flag = 5; }
            else if (rangeband <= 20 || rangeband < (largest*0.35)) { flag = 0; }

            for(i=0; i<len; i++) {
                comp = a[i].__data__;
                if (flag === 0) {
                    comp = "";
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
        },
        ordinalYAxisTickFormat: function (domain) {
            var a = $(options.selector + " g.y.axis .tick text");
            var len = a.length,comp;

            for(i=0; i<len; i++) {
                comp = a[i].__data__;
                if(a[i].getBBox().width > (options.margin_left * 0.7)) {
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
            if (ct === "color") {
                that.legends = "no";
            };
            return this;
        },
        processXAxisTickValues: function () {

            var values = [], newVal = [];
            var length = options.axis_x_pointer_values.length;
            if(length) {
                for(var i = 0 ; i < length ; i++) {
                    if(options.axis_x_data_format === "number") {
                        if(_.isNumber(options.axis_x_pointer_values[i]) || !(isNaN(options.axis_x_pointer_values[i]))){
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
                if(options.axis_x_data_format === "time") {
                    _.each(values, function (d) {
                        newVal.push(options.k.dateConversion(d));
                    });
                } else {
                    newVal = values;
                }
            }

            return newVal;
        },
        processYAxisTickValues: function () {
            var length = options.axis_y_pointer_values.length;
            var values = [];
            if(length) {
                for(var i = 0 ; i < length ; i++) {
                    if(options.axis_y_data_format === "number") {
                        if(_.isNumber(options.axis_y_pointer_values[i]) || !(isNaN(options.axis_y_pointer_values[i]))){
                            values.push(options.axis_y_pointer_values[i])
                        }
                    }
                }
            }
            return values;
        },
        xAxisDataFormatIdentification: function (data){
            if(_.isNumber(data[0].x) || !(isNaN(data[0].x))){
                return "number";
            } else if(!(isNaN(new Date(data[0].x).getTime()))) {
                return "time";
            } else {
                return "string";
            }
        },
        yAxisDataFormatIdentification: function (data) {
            if(_.isNumber(data[0].y) || !(isNaN(data[0].y))){
                return "number";
            } else if(!(isNaN(new Date(data[0].y).getTime()))) {
                return "time";
            } else {
                return "string";
            }
        },
        resize: function (svg,anno,lsvg) {
            var aspect = (options.width/options.height);
            var targetWidth = $(options.selector).width();
            if(targetWidth > options.width) {
                targetWidth = options.width;
            }
            if(PykCharts['boolean'](svg)) {
                svg.attr("width", targetWidth);
                svg.attr("height", (targetWidth / aspect));
            }
            var title_div_width;
            if(PykCharts['boolean'](options.title_text)) {
                if(PykCharts['boolean'](options.export_enable)) {
                    title_div_width = 0.9*targetWidth;
                    $(options.selector + " #title").css("width",title_div_width);
                }
            }
            if(PykCharts['boolean'](options.subtitle_text)) {
                title_div_width = 0.9*targetWidth;
                $(options.selector + " #sub-title").css("width", title_div_width);
            }
            if(PykCharts['boolean'](options.export_enable)) {
                div_size = targetWidth
                div_float ="none"
                div_left = targetWidth-16;
                if(PykCharts['boolean'](options.title_text) && options.title_size && options.mode === "default") {
                    div_size = 0.1*targetWidth;
                    div_float ="left";
                    div_left = 0;
                }
                $(options.selector + " #export").css("width",div_size)
                        .css("left",div_left)
                        .css("float",div_float);

                $(options.selector + " .dropdown-multipleConatiner-export")
                        .css("left",(targetWidth - 80)+"px");

            }
            var a = $(options.selector + " #footer");
            if(a) {
                a.attr("width",targetWidth);
            }
            var b = $(options.selector + " .main-div");
            if(b && !(PykCharts['boolean'](options.panels_enable))) {
                $(options.selector + " .main-div").css("width",targetWidth);
            }
            if(PykCharts['boolean'](anno)) {
            }
        },
        __proto__: {
            _domainBandwidth: function (domain_array, count, type) {
                addFactor = 0;
                if(type === "time") {
                    var a = domain_array[0],
                        b = domain_array[1], new_array = [];
                    padding = (b - a) * 0.1;
                    if (count === 0) {
                        new_array[0] = a - (padding + addFactor);
                    }else if(count === 1) {
                        new_array[1] = b + (padding + addFactor);
                    }else if (count === 2) {
                        new_array[0] = a - (padding + addFactor);
                        new_array[1] = b + (padding + addFactor);
                    }
                    return [options.k.dateConversion(new_array[0]),options.k.dateConversion(new_array[1])];
                }else {
                    padding = (domain_array[1] - domain_array[0]) * 0.1;
                    if (count === 0) {
                        domain_array[0] -= (padding + addFactor);
                    }else if(count === 1) {
                        domain_array[1] = parseFloat(domain_array[1],10) + (padding + addFactor);
                    }else if (count === 2) {
                        domain_array[0] -= (padding + addFactor);
                        domain_array[1] = parseFloat(domain_array[1],10) + (padding + addFactor);
                    }
                    return domain_array;
                }
            },
            _radiusCalculation: function (radius_percent,type) {
                var min_value;
                if(type === "percentageBar") {
                    min_value = options.height;
                } else if(type === "spiderweb") {
                    min_value = d3.min([(options.width - options.legendsGroup_width),(options.height-options.legendsGroup_height-20)])
                } else if(type !== undefined) {
                    min_value = options.width;
                } else {
                    min_value = d3.min([options.width,options.height]);
                }
                return (min_value*radius_percent)/200;
            },
            _groupBy: function (chart,arr) {
                var gd = []
                , i
                , obj
                , dimensions = {
                    "oned": ["name"],
                    "line": ["x","name"],
                    "area": ["x","name"],
                    "bar": ["y","group"],
                    "column": ["x","group"],
                    "scatterplot": ["x","y","name","group"],
                    "pulse": ["x","y","name","group"],
                    "spiderweb": ["x","y","group"],
                }
                , charts = {
                    "oned": {
                        "dimension": "name",
                        "fact": "weight"
                    },
                    "line": {
                      "dimension": "x",
                      "fact": "y",
                      "name": "name"
                    },
                    "area": {
                      "dimension": "x",
                      "fact": "y",
                      "name": "name"
                    },
                    "bar": {
                      "dimension": "y",
                      "fact": "x",
                      "name": "group"
                    },
                    "column": {
                      "dimension": "x",
                      "fact": "y",
                      "name": "group"
                    },
                    "scatterplot": {
                      "dimension": "x",
                      "fact": "y",
                      "weight": "weight",
                      "name": "name",
                      "group": "group"
                    },
                    "pulse": {
                      "dimension": "y",
                      "fact": "x",
                      "weight": "weight",
                      "name": "name",
                      "group": "group"
                    },
                    "spiderweb": {
                      "dimension": "x",
                      "fact": "y",
                      "name": "name",
                      "weight": "weight"
                    }
                };

                var properties = dimensions[chart];
                var groups = [];
                for(var i = 0, len = arr.length; i<len; i+=1){
                    var obj = arr[i];
                    if(groups.length == 0){
                        groups.push([obj]);
                    }
                    else{
                        var equalGroup = false;
                        for(var a = 0, glen = groups.length; a<glen;a+=1){
                            var group = groups[a];
                            var equal = true;
                            var firstElement = group[0];
                            properties.forEach(function(property){

                                if(firstElement[property] !== obj[property]){
                                    equal = false;
                                }

                            });
                            if(equal){
                                equalGroup = group;
                            }
                        }
                        if(equalGroup){
                            equalGroup.push(obj);
                        }
                        else {
                            groups.push([obj]);
                        }
                    }
                }

                for(i in groups) {
                    if ($.isArray(groups[i])) {
                        obj = {};
                        var grp = groups[i]
                        var chart_name = charts[chart];
                        obj[chart_name.dimension] = grp[0][chart_name.dimension];
                        if (chart_name.name) {
                            obj[chart_name.name] = grp[0][chart_name.name];
                        }
                        if (chart_name.weight) {
                            obj[chart_name.weight] = d3.sum(grp, function (d) { return d[charts[chart].weight]; });
                            obj[chart_name.fact] = grp[0][chart_name.fact];
                        } else {
                            obj[chart_name.fact] = d3.sum(grp, function (d) { return d[charts[chart].fact]; });
                        }
                        if (chart_name.group) {
                            obj[chart_name.group] = grp[0][chart_name.group];
                        }
                        var f = _.extend(obj,_.omit(grp[0], _.values(charts[chart])));
                        gd.push(f);
                    }
                };
                return gd;
            },
            _sortData: function (data, column_to_be_sorted, group_column_name, options) {
                if(!PykCharts['boolean'](options.data_sort_enable)) {
                    data.sort(function(a,b) {
                        if (a[group_column_name] < b[group_column_name]) {
                            return -1;
                        }
                        else if (a[group_column_name] > b[group_column_name]) {
                            return 1;
                        }
                    });

                } else if (PykCharts['boolean'](options.data_sort_enable)) {
                    switch (options.data_sort_type) {
                        case "numerically":
                            data.sort(function (a,b) {
                                return ((options.data_sort_order === "descending") ? (b[column_to_be_sorted] - a[column_to_be_sorted]) : (a[column_to_be_sorted] - b[column_to_be_sorted]));
                            });
                            break;
                        case "alphabetically":
                            data.sort(function (a,b) {
                                if (a[column_to_be_sorted] < b[column_to_be_sorted]) {
                                    return (options.data_sort_order === "descending") ? 1 : -1;
                                }
                                else if (a[column_to_be_sorted] > b[column_to_be_sorted]) {
                                    return (options.data_sort_order === "descending") ? -1 : 1;
                                }
                                else if (a[group_column_name] < b[group_column_name]) {
                                    return (options.data_sort_order === "descending") ? 1 : -1;
                                }
                                else if (a[group_column_name] > b[group_column_name]) {
                                    return (options.data_sort_order === "descending") ? -1 : 1;
                                }
                                return 0;
                            });
                            break;
                        case "date":
                            data.sort(function (a,b) {
                                if (new Date(a[column_to_be_sorted]) < new Date(b[column_to_be_sorted])) {
                                    return (options.data_sort_order === "descending") ? 1 : -1;
                                }
                                else if (new Date(a[column_to_be_sorted]) > new Date(b[column_to_be_sorted])) {
                                    return (options.data_sort_order === "descending") ? -1 : 1;
                                }
                                else if (a[group_column_name] < b[group_column_name]) {
                                    return (options.data_sort_order === "descending") ? 1 : -1;
                                }
                                else if (a[group_column_name] > b[group_column_name]) {
                                    return (options.data_sort_order === "descending") ? -1 : 1;
                                }
                                return 0;
                            });
                            break;
                    }
                }
                return data;
            }
        },
        backgroundColor: function (options) {
             $(options.selector).css({"background-color":options.background_color,"position":"relative"})
                var bg,child1;
                bgColor(options.selector);

                function bgColor(child) {
                    child1 = child;
                    bg = $(child).css("background-color");
                    if (bg === "transparent" || bg === "rgba(0, 0, 0, 0)") {
                        if($(child)[0].parentNode.tagName === undefined || $(child)[0].parentNode.tagName.toLowerCase() === "body") {
                            $(child).colourBrightness("rgb(255,255,255)");
                        } else {
                            return bgColor($(child)[0].parentNode);
                        }
                    } else {
                       return $(child).colourBrightness(bg);
                    }
                }

                if ($(child1)[0].classList.contains("light")) {
                    options.img = PykCharts.assets+"img/download.png";
                } else {
                    options.img = PykCharts.assets+"img/download-light.png";
                }

            return this;
        },
        dataSourceFormatIdentification: function (data,chart,executeFunction) {
            var dot_index = data.lastIndexOf('.'),
                len = data.length - dot_index,
                format = data.substr(dot_index+1,len),
                cache_avoidance_value = Math.floor((Math.random() * 100) + 1);

            if(data.indexOf("{")!= -1) {
                chart.data = JSON.parse(data);
                chart[executeFunction](chart.data);
            } else if (data.indexOf(",")!= -1) {
                chart.data = d3.csv.parse(data);
                chart[executeFunction](chart.data);
            } else if (format === "json") {
                d3.json(data+"?"+cache_avoidance_value,chart[executeFunction]);
            } else if(format === "csv") {
                d3.csv(data+"?"+cache_avoidance_value,chart[executeFunction]);
            }
        },
        export: function(chart,svgId,chart_name,panels_enable,containers) {
            if(PykCharts['boolean'](options.export_enable)) {
                d3.select(options.selector)
                        .append("div")
                        .attr("class","pyk-tooltip dropdown-multipleConatiner-export")
                        .style("left",options.width - 80 + "px")
                        .style("top","10px")
                        .style("height","auto")
                        .style("width","auto")
                        .style("padding", "8px 8px")
                        .style("color","#4F4F4F")
                        .style("background","#fff")
                        .style("text-decoration","none")
                        .style("position", "absolute")
                        .style("border-radius", "3px")
                        .style("border","1px solid #CCCCCC")
                        .style("font-family","'Helvetica Neue', Helvetica, Arial, sans-serif")
                        .style("font-size","12px")
                        .style("text-align","center")
                        .style("z-index","10")
                        .style("visibility", "hidden")
                        .style("box-shadow","0 5px 10px rgba(0,0,0,.2)");

                if(PykCharts['boolean'](panels_enable)) {
                    for(var i = 0; i < containers.length; i++) {
                        d3.select(options.selector + " .dropdown-multipleConatiner-export")
                            .append("span")
                            .attr("id",chart_name + i)
                            .on("mouseover",function () {
                                $(this).css("background-color","#E0E0E1");
                            })
                            .on("mouseout",function() {
                                $(this).css('background-color',"#fff")
                            })
                            .style("margin-bottom", "3px")
                            .style("cursor","pointer")
                            .html("Panel " + (i+1) + "<br>");
                    }
                } else {
                    d3.select(options.selector + " .dropdown-multipleConatiner-export")
                        .append("span")
                        .attr("id","span")
                        .on("mouseover",function () {
                            $(this).css("background-color","#E0E0E1");
                        })
                        .on("mouseout",function() {
                            $(this).css('background-color',"#fff")
                        })
                        .style("margin-bottom", "3px")
                        .style("cursor","pointer")
                        .html("Export as SVG" + "<br>");
                }

                var id = "export",
                div_size = options.width
                div_float ="none"
                div_left = options.width-16;

                if(PykCharts['boolean'](options.title_text) && options.title_size  && options.mode === "default") {
                    div_size = 0.1*options.width;
                    div_float ="left";
                    div_left = 0;
                }

                var export_div = d3.select(chart.selector)
                                .append("div")
                                .attr("id",id)
                                .style("width",div_size + "px")
                                .style("left",div_left+"px")
                                .style("float",div_float)
                                .style("text-align","right");

                setTimeout(function () {
                    export_div.html("<img title='Export to SVG' src='"+options.img+"' style='left:"+div_left+"px;margin-bottom:3px;cursor:pointer;'/>");
                },options.transition_duration*1000);

            }
            return this;
        },
        exportSVG: function (chart,svgId,chart_name,panels_enable,containers,add_extra_width,add_extra_height) {
            if(PykCharts['boolean'](options.export_enable)) {
                if(!add_extra_width) {
                    add_extra_width = 0;
                }
                if(!add_extra_height) {
                    add_extra_height = 0;
                }

                var id = "export";
                var canvas_id = chart_name+"canvas";
                var canvas = document.createElement("canvas");
                canvas.setAttribute('id', canvas_id);
                canvas.setAttribute('width',500);
                canvas.setAttribute('height',500);
                var get_canvas = document.getElementById(canvas_id);
                paper.setup(get_canvas);
                var project = new paper.Project();
                project._view._viewSize.width = chart.width + add_extra_width;
                project._view._viewSize.height = chart.height +  add_extra_height;

                var name = chart_name + ".svg";

                $(chart.selector + " #"+id).click(function () {
                  PykCharts.export_menu_status = 1;
                    d3.select(options.selector + " .dropdown-multipleConatiner-export").style("visibility", "visible");
                });

                if(!PykCharts['boolean'](panels_enable)) {
                    $(chart.selector + " #span").click(function () {
                        d3.select(options.selector + " .dropdown-multipleConatiner-export").style("visibility", "hidden");
                        chart.k.processSVG(document.querySelector(options.selector +" "+svgId),chart_name);
                        project.importSVG(document.querySelector(options.selector +" "+svgId));
                        var svg = project.exportSVG({ asString: true });
                        downloadDataURI({
                            data: 'data:image/svg+xml;base64,' + btoa(svg),
                            filename: name
                        });
                        project.clear();
                    });
                } else {
                    for(var i = 0; i<containers.length; i++) {
                        $(chart.selector + " #"+chart_name + i).click(function () {
                            d3.select(options.selector + " .dropdown-multipleConatiner-export").style("visibility", "hidden");
                            var id = this.id.substring(this.id.length-1,this.id.length);
                            chart.k.processSVG(document.querySelector(options.selector + " #" +svgId + id),chart_name);
                            project.importSVG(document.querySelector(options.selector + " #" +svgId + id));
                            var svg = project.exportSVG({ asString: true });;
                            downloadDataURI({
                                data: 'data:image/svg+xml;base64,' + btoa(svg),
                                filename: name
                            });
                            project.clear();
                        });
                    }
                }
            }
            return this;
        },
        processSVG: function (svg,svgId) {
            var x = svg.querySelectorAll("text");
            for (var i = 0; i < x.length; i++) {
                if(x[i].hasAttribute("dy")) {
                    var attr_value = x[i].getAttribute("dy");
                    var attr_length = attr_value.length;
                    if(attr_value.substring(attr_length-2,attr_length) == "em") {
                        var font_size, value;
                        if(x[i].hasAttribute('font-size')) {
                            font_size = x[i].getAttribute('font-size');
                            value = parseFloat(font_size)*parseFloat(attr_value);

                        } else {
                            value = 12*parseFloat(attr_value);
                        }
                        x[i].setAttribute("dy", value);
                    }
                }
            }
            return this;
        },
        errorHandling: function(error_msg,error_code,err_url) {
            console.error('%c[Error - Pykih Charts] ', 'color: red;font-weight:bold;font-size:14px', " at "+options.selector+".(Invalid value for attribute \""+error_msg+"\")  Visit www.chartstore.io/docs#error_"+error_code);
            return;
        },
        warningHandling: function(error_msg,error_code,err_url) {
            console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+options.selector+".(Invalid value for attribute \""+error_msg+"\")  Visit www.chartstore.io/docs#warning_"+error_code);
            return;
        },
        validator: function () {
            var validator = {
                validatingSelector: function (selector) {
                    try {
                        if(!document.getElementById(selector)) {
                            options.stop = true;
                            throw "selector";
                        }
                    }
                    catch (err) {
                        options.k.errorHandling(err,"1");
                    }
                    return this;
                },
                validatingDataType: function (attr_value,config_name,default_value,name) {
                    try {
                        if(!_.isNumber(attr_value)) {
                            if(name) {
                                options[name] = default_value;
                            } else {
                                options[config_name] = default_value;
                            }
                            throw config_name;
                        }
                    }
                    catch (err) {
                        options.k.warningHandling(err,"1");
                    }
                    return this;
                },
                validatingChartMode: function (mode,config_name,default_value) {
                    try {
                        if(mode.toLowerCase() === "default" || mode.toLowerCase()=== "infographics") {
                        } else {
                            options[config_name] = default_value;
                            throw "mode";
                        }
                    }
                    catch (err) {
                        options.k.warningHandling(err,"2");
                    }
                    return this;
                },
                validatingAxisDataFormat: function (axis_data_format,config_name) {
                    if(axis_data_format) {
                        try {
                            if(axis_data_format.toLowerCase() === "number" || axis_data_format.toLowerCase()=== "string" || axis_data_format.toLowerCase() === "time") {
                            } else {
                                options.stop = true;
                                throw config_name;
                            }
                        }
                        catch (err) {

                            options.k.errorHandling(err,"9");
                        }
                    }
                    return this;
                },
                validatingColorMode: function (color_mode,config_name,default_value) {
                    if(color_mode) {
                        try {
                            if(color_mode.toLowerCase() === "color" || color_mode.toLowerCase()=== "saturation") {
                            } else {
                                options[config_name] = default_value;
                                throw "color_mode";
                            }
                        }
                        catch (err) {
                            options.k.warningHandling(err,"3");
                        }
                    }
                    return this;
                },
                validatingYAxisPointerPosition: function (axis_pointer_position,config_name,default_value) {
                        try {
                            if(axis_pointer_position.toLowerCase() === "left" || axis_pointer_position.toLowerCase()=== "right" ) {
                            } else {
                                options[config_name] = default_value;
                                throw config_name;
                            }
                        }
                        catch (err) {
                            options.k.warningHandling(err,"7");
                        }
                    return this;
                },
                validatingXAxisPointerPosition: function (axis_pointer_position,config_name,default_value) {
                        try {
                            if(axis_pointer_position.toLowerCase()=== "top" || axis_pointer_position.toLowerCase()=== "bottom") {
                            } else {
                                options[config_name] = default_value;
                                throw config_name;
                            }
                        }
                        catch (err) {
                            options.k.warningHandling(err,"7");
                        }
                    return this;
                },
                validatingBorderBetweenChartElementsStyle: function (border_between_chart_elements_style,config_name) {
                        try {
                            if(border_between_chart_elements_style.toLowerCase() === "1,3" || border_between_chart_elements_style.toLowerCase()=== "5,5" || border_between_chart_elements_style.toLowerCase() === "0") {
                            } else {
                                throw config_name;
                            }
                        }
                        catch (err) {
                            options.k.errorHandling(err,"#7");
                        }
                    return this;
                },
                validatingLegendsPosition: function (legends_display,config_name,default_value) {
                        try {
                            if(legends_display.toLowerCase() === "horizontal" || legends_display.toLowerCase()=== "vertical") {
                            } else {
                                options[config_name] = default_value;
                                throw config_name;
                            }
                        }
                        catch (err) {
                            options.k.warningHandling(err,"13");
                        }
                    return this;
                },
                isArray: function (value,config_name) {
                        try {
                            if(!$.isArray(value)) {
                                throw config_name;
                            }
                        }
                        catch (err) {
                            options.stop = true;
                            options.k.errorHandling(err,"4");
                        }
                    return this;
                },
                validatingTimeScaleDataType: function (axis_time_value_datatype,config_name) {
                    if(axis_time_value_datatype) {
                        try {
                            if(axis_time_value_datatype.toLowerCase() === "date" || axis_time_value_datatype.toLowerCase()=== "year" || axis_time_value_datatype.toLowerCase() === "month" || axis_time_value_datatype === "hours" || axis_time_value_datatype === "minutes") {
                            } else {
                                options.stop = true;
                                throw config_name;
                            }
                        }
                        catch (err) {
                            options.k.errorHandling(err,"5");
                        }
                    }
                    return this;
                },
                validatingTooltipMode: function (tooltip_mode,config_name,default_value) {
                    if(tooltip_mode) {
                        try {
                            if(tooltip_mode.toLowerCase() === "fixed" || tooltip_mode.toLowerCase()=== "moving") {
                            } else {
                                options[config_name] = default_value;
                                throw config_name;
                            }
                        }
                        catch (err) {
                            options.k.warningHandling(err,"14");
                        }
                    }
                    return this;
                },
                validatingFontWeight: function (font_weight,config_name,default_value,name) {
                    try {
                        if(font_weight.toLowerCase() === "bold" || font_weight.toLowerCase() === "normal") {
                        } else {
                            if(name) {
                                options[name] = default_value;
                            } else {
                                options[config_name] = default_value;
                            }

                            throw config_name;
                        }
                    }
                    catch (err) {
                        options.k.warningHandling(err,"5");
                    }
                    return this;
                },
                validatingColor: function (color,config_name,default_value,name) {
                    if(color) {
                        try {
                            var checked;
                            if(typeof color != "string" ) {

                                throw config_name;
                            }

                            if(color.charAt(0)!= "#" && color.substring(0,3).toLowerCase() !="rgb" && color.toLowerCase()!= "transparent") {
                                checked = $c.name2hex(color) ;
                                if(checked === "Invalid Color Name") {
                                    throw config_name;
                                }
                            } else if (color.charAt(0) === "#") {
                                checked = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
                                if(!checked) {
                                    throw config_name;
                                }
                            }
                        }
                        catch (err) {
                            if(name) {
                                options[name] = default_value;
                            } else {
                                options[config_name] = default_value;
                            }
                            options.k.warningHandling(err,"4");
                        }
                    }
                    return this;
                },
                validatingDataMode : function (mode,config_name,default_value,name) {
                    try {

                        if(mode.toLowerCase() === "absolute" || mode.toLowerCase()=== "percentage") {
                        } else {
                            options[config_name] = default_value;
                            throw config_name;
                        }
                    }
                    catch (err) {
                        options.k.warningHandling(err,"16");
                    }
                    return this;
                },
                validatingLegendsMode : function (mode,config_name,default_value,name) {
                    try {
                        if(mode.toLowerCase() === "default" || mode.toLowerCase()=== "interactive") {
                        } else {
                            options[config_name] = default_value;
                            throw config_name;
                        }
                    }
                    catch (err) {
                        options.k.warningHandling(err,"17");
                    }
                    return this;
                },
                validatingJSON : function (data) { // note: this method method cannot be used for chaining as it return fasle and not this;
                    if(!data) {
                        try {
                            options.stop = true;
                            throw "Data is not in the valid JSON format";
                        }
                        catch (err) {
                            console.error('%c[Error - Pykih Charts] ', 'color: red;font-weight:bold;font-size:14px', " at "+ options.selector+".(\""+err+"\")  Visit www.chartstore.io/docs#error_2");
                        }
                    }
                    if(options.stop) {
                        return false;
                    } else {
                        return true;
                    }
                }
            };
            return validator;
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
    that.pt_circle = configuration.pt_circle;
    that.start_pt_circle = configuration.start_pt_circle;

    var status;

    var action = {
        tooltipPosition: function (d,xPos,yPos,xDiff,yDiff,group_index,width_percentage,height_percentage,type) {
            if(PykCharts['boolean'](options.tooltip_enable) || PykCharts['boolean'](options.annotation_enable) || options.axis_x_data_format === "string" || options.axis_y_data_format === "string") {
                if(xPos !== undefined){
                    var selector = options.selector.substr(1,options.selector.length)
                    var width_tooltip = parseFloat($("#tooltip-svg-container-"+group_index +"-pyk-tooltip"+selector).css("width"));
                    var height_tooltip = parseFloat($("#tooltip-svg-container-"+group_index +"-pyk-tooltip"+selector).css("height"));
                    tooltip = $("#tooltip-svg-container-"+group_index +"-pyk-tooltip"+selector);
                    offset = $(options.selector).offset();
                    if (type === "lineChart" || type === "areaChart") {
                      var place_tooltip_from_top = yPos * height_percentage;
                    } else {
                      var place_tooltip_from_top = yPos - ((height_tooltip)/2) * height_percentage;
                    }
                    
                    tooltip
                        .css("display", "block")
                        .css("top", place_tooltip_from_top + "px")
                        .css("left", ((xPos + options.margin_left + offset.left) * width_percentage) + "px");
                }
                else {
                    that.tooltip
                        .style("display", "block")
                        .style("top", (PykCharts.getEvent().pageY - 20) + "px")
                        .style("left", (PykCharts.getEvent().pageX + 30) + "px");
                }
                return that.tooltip;
            }

        },
        tooltipTextShow: function (d,panels_enable,type,group_index) {
            var selector = options.selector.substr(1,options.selector.length)
            if(PykCharts['boolean'](options.tooltip_enable) || PykCharts['boolean'](options.annotation_enable) || options.axis_x_data_format === "string" || options.axis_y_data_format === "string") {
                if(panels_enable === "yes" && type === "multilineChart") {
                    $("#tooltip-svg-container-"+group_index +"-pyk-tooltip"+selector).html(d);
                }
                else {
                    that.tooltip.html(d);
                }
                return this;
            }
        },
        tooltipHide: function (d,panels_enable,type) {
            if(PykCharts['boolean'](options.tooltip_enable) || PykCharts['boolean'](options.annotation_enable) || options.axis_x_data_format === "string" || options.axis_y_data_format === "string") {
                if(panels_enable === "yes" && type === "multilineChart") {
                    return d3.selectAll(".pyk-tooltip").style("display","none");
                }
                else {
                    return that.tooltip.style("display", "none");
                }
            }
        },
        crossHairPosition: function(new_data,xScale,yScale,dataLineGroup,lineMargin,domain,type,tooltipMode,color_from_data,panels_enable){
            if((PykCharts['boolean'](options.crosshair_enable) || PykCharts['boolean'](options.tooltip_enable) || PykCharts['boolean'](options.axis_onhover_highlight_enable))  && options.mode === "default") {
                var selectSVG = $(options.selector + " #"+dataLineGroup[0][0][0].parentNode.parentNode.id),
                    width_percentage = 0,
                    height_percentage = 0,
                    top_shift_from_first_panel;
                if (!PykCharts['boolean'](panels_enable)) {
                    width_percentage = selectSVG.width() / options.width;
                    height_percentage = selectSVG.height() / options.height;
                } else {
                    top_shift_from_first_panel = $("svg#svg-0").offset().top;
                    width_percentage = 1;
                    height_percentage = 1;
                }
                var legendsGroup_height = options.legendsGroup_height ? options.legendsGroup_height: 0;
                var offsetLeft =  (options.margin_left + lineMargin + selectSVG.offset().left) * width_percentage;
                var offsetTop = selectSVG.offset().top;
                var number_of_lines = new_data.length;
                var left = options.margin_left;
                var right = options.margin_right;
                var top = options.margin_top;
                var bottom = options.margin_bottom;
                var w = options.width;
                var h = options.height;
                var group_index = parseInt(PykCharts.getEvent().target.id.substr((PykCharts.getEvent().target.id.length-1),1));
                var c = b - a;
                var x = PykCharts.getEvent().pageX - offsetLeft;
                var y = PykCharts.getEvent().pageY - offsetTop - top;
                var x_range = [];
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
                var y_range = yScale.range();
                var j,tooltpText,active_x_tick,active_y_tick = [],left_diff,right_diff,
                    pos_line_cursor_x,pos_line_cursor_y = [],right_tick,left_tick,
                    range_length = x_range.length,colspan,bottom_tick,top_tick;
                for(j = 0;j < range_length;j++) {
                    for(k = 0; k<y_range.length;k++) {
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
                                                        if(!PykCharts['boolean'](color_from_data)) {
                                                            tt_row += "<tr><td>"+new_data[a].name+"</td><td><b>"+ (new_data[a].data[b].tooltip || new_data[a].data[b].y) +"</b></td></tr>";
                                                            colspan = 2;
                                                        }
                                                        else if (PykCharts['boolean'](color_from_data)) {
                                                            tt_row += "<tr><td><div style='padding:2px;width:5px;height:5px;background-color:"+new_data[a].color+"'></div></td><td>"+new_data[a].name+"</td><td><b>"+ (new_data[a].data[b].tooltip || new_data[a].data[b].y) +"</b></td></tr>";
                                                            colspan = 3;
                                                        }
                                                    }
                                                }
                                            }

                                            pos_line_cursor_x += 6;
                                            tooltipText = "<table><thead><th colspan='"+colspan+"'>"+active_x_tick+"</th></thead><tbody>"+tt_row+"</tbody></table>";
                                            if(PykCharts['boolean'](options.tooltip_enable)) {
                                                this.tooltipPosition(tooltipText,pos_line_cursor_x,(y+offsetTop),60,-15,group_index,width_percentage,height_percentage,type);
                                                this.tooltipTextShow(tooltipText);
                                            }
                                            (options.crosshair_enable) ? this.crossHairShow(pos_line_cursor_x,top,pos_line_cursor_x,(h - bottom),pos_line_cursor_x,test,type,active_y_tick.length,panels_enable,new_data): null;
                                            (options.colspanrosshair_enable) ? this.crossHairShow(pos_line_cursor_x,top,pos_line_cursor_x,(h - bottom),pos_line_cursor_x,pos_line_cursor_y,type,active_y_tick.length,panels_enable): null;
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
                                                var left_offset = $(options.selector + " #svg-"+a).offset().left - $(options.selector).offset().left;
                                                var top_offset = $(options.selector + " #svg-"+a).offset().top - $(options.selector).offset().top;
                                                for(var b=0;b < len_data;b++) {
                                                    if(options.axis_x_data_format === "time") {
                                                        cond = Date.parse(active_x_tick)===Date.parse(new_data[a].data[b].x);
                                                    } else {
                                                        cond = new_data[a].data[b].x === active_x_tick;
                                                    }
                                                    if(cond) {
                                                        active_y_tick.push(new_data[a].data[b].y);
                                                        tooltipText = (new_data[a].data[b].tooltip || new_data[a].data[b].y);
                                                        if (a%4 == 0 && a != 0) {
                                                            ++multiply_by;
                                                            final_displacement = multiply_value * multiply_by;
                                                        }
                                                        pos_line_cursor_y = (yScale(new_data[a].data[b].y) + top);
                                                        this.tooltipPosition(tooltipText,(pos_line_cursor_x+left_offset-15-30),(pos_line_cursor_y+top_shift_from_first_panel+final_displacement),-15,-15,a,width_percentage,height_percentage,type);
                                                        this.tooltipTextShow(tooltipText,panels_enable,type,a);
                                                        (options.crosshair_enable) ? this.crossHairShow(pos_line_cursor_x,top,pos_line_cursor_x,(h - bottom),pos_line_cursor_x,pos_line_cursor_y,type,active_y_tick.length,panels_enable,new_data[a],a): null;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if(type === "lineChart" || type === "areaChart") {
                                        if(PykCharts['boolean'](options.tooltip_enable)) {
                                            if((options.tooltip_mode).toLowerCase() === "fixed") {
                                                this.tooltipPosition(tooltipText,-options.margin_left,(pos_line_cursor_y + offsetTop),-14,23,group_index,width_percentage,height_percentage,type);
                                            } else if((options.tooltip_mode).toLowerCase() === "moving") {
                                                this.tooltipPosition(tooltipText,(pos_line_cursor_x-options.margin_left + 10),(pos_line_cursor_y+offsetTop-5),0,-45,group_index,width_percentage,height_percentage,type);
                                            }
                                            this.tooltipTextShow(tooltipText);
                                        }
                                        (options.crosshair_enable) ? this.crossHairShow(pos_line_cursor_x,top,pos_line_cursor_x,(h - bottom),pos_line_cursor_x,pos_line_cursor_y,type,active_y_tick.length,panels_enable): null;
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
                                                    if(!PykCharts['boolean'](color_from_data)) {
                                                        tt_row += "<tr><td>"+new_data[a].name+"</td><td><b>"+ (new_data[a].data[b].tooltip || new_data[a].data[b].y) +"</b></td></tr>";
                                                        colspan = 2;
                                                    }
                                                    else if (PykCharts['boolean'](color_from_data)) {
                                                        tt_row += "<tr><td><div style='padding:2px;width:5px;height:5px;background-color:"+new_data[a].color+"'></div></td><td>"+new_data[a].name+"</td><td><b>"+ (new_data[a].data[b].tooltip || new_data[a].data[b].y) +"</b></td></tr>";
                                                        colspan = 3;
                                                    }
                                                }
                                            }
                                        }

                                        pos_line_cursor_x += 6;
                                        tooltipText = "<table><thead><th colspan='"+colspan+"'>"+active_x_tick+"</th></thead><tbody>"+tt_row+"</tbody></table>";
                                        if(PykCharts['boolean'](options.tooltip_enable)) {
                                            group_index = 1;
                                            this.tooltipPosition(tooltipText,pos_line_cursor_x,(y+offsetTop),60,70,group_index,width_percentage,height_percentage);
                                            this.tooltipTextShow(tooltipText,type);
                                        }
                                        (options.crosshair_enable) ? this.crossHairShow(pos_line_cursor_x,top+legendsGroup_height,pos_line_cursor_x,(h - bottom),pos_line_cursor_x,test,type,active_y_tick.length,panels_enable,new_data): null;
                                        this.axisHighlightShow(active_y_tick,options.selector+" .y.axis",domain);
                                        this.axisHighlightShow(active_x_tick,options.selector+" .x.axis",domain);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        crossHairShow: function (x1,y1,x2,y2,cx,cy,type,no_bullets,panels_enable,new_data,group_index) {
            if(PykCharts['boolean'](options.crosshair_enable)) {
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
                            .attr("x1",options.margin_left)
                            .attr("y1",cy)
                            .attr("x2",(options.width - options.margin_right))
                            .attr("y2",cy);
                        that.focus_circle.style("display","block")
                            .attr("transform", "translate(" + cx + "," + cy + ")");

                    }
                    else if(type === "multilineChart" /*|| type === "stackedAreaChart"*/) {
                        if(panels_enable === "no") {
                            that.cross_hair_v.style("display","block");
                            that.cross_hair_v.select(options.selector + " #cross-hair-v")
                                .attr("x1",(x1 - 5))
                                .attr("y1",y1)
                                .attr("x2",(x2 - 5))
                                .attr("y2",y2);
                                for(j=0; j<new_data.length; j++) {
                                    d3.select(options.selector+" #f_circle"+j).style("display","block")
                                        .attr("transform", "translate(" + (cx-3) + "," + cy[j] + ")");
                                }
                        }
                        else if(panels_enable === "yes") {
                            d3.selectAll(options.selector+" .line-cursor").style("display","block");
                            d3.selectAll(options.selector+" .cross-hair-v")
                                .attr("x1",(x1 - 5))
                                .attr("y1",y1)
                                .attr("x2",(x2 - 5))
                                .attr("y2",y2);
                            d3.select(options.selector+" #svg-"+group_index+" .cross-hair-h")
                                .attr("x1",options.margin_left)
                                .attr("y1",cy)
                                .attr("x2",(options.w - options.margin_right))
                                .attr("y2",cy);
                            d3.select(options.selector+" #svg-"+group_index+" .focus").style("display","block")
                                .attr("transform", "translate(" + (cx - 5) + "," + cy + ")");
                        }
                    }
                    else if (type === "stackedAreaChart") {
                        that.cross_hair_v.style("display","block");
                        that.cross_hair_v.select(options.selector + " #cross-hair-v")
                            .attr("x1",(x1 - 5))
                            .attr("y1",y1)
                            .attr("x2",(x2 - 5))
                            .attr("y2",y2);
                        for(j=0; j<new_data.length; j++) {
                            d3.select(options.selector+" #f_circle"+j).style("display","block")
                                .attr("transform", "translate(" + (cx-3) + "," + cy[j] + ")");
                        }
                    }
                }
            }
            return this;
        },
        crossHairHide: function (type) {
            if(PykCharts['boolean'](options.crosshair_enable)/* && options.mode === "default"*/) {
                that.cross_hair_v.style("display","none");
                if(type === "lineChart" || type === "areaChart") {
                    that.cross_hair_h.style("display","none");
                    that.focus_circle.style("display","none");
                }
                else if(type === "multilineChart" || type === "stackedAreaChart") {
                    d3.selectAll(options.selector+" .line-cursor").style("display","none");
                    d3.selectAll(options.selector+" .focus").style("display","none");
                }
            }
            return this;
        },
        axisHighlightShow: function (active_tick,axisHighlight,domain,a) {
            var curr_tick,prev_tick,abc,selection,axis_data_length;
            if(PykCharts['boolean'](options.axis_onhover_highlight_enable)/* && options.mode === "default"*/){
                if(axisHighlight === options.selector + " .y.axis"){
                    selection = axisHighlight+" .tick text";
                    abc = options.axis_y_pointer_color;
                    axis_data_length = d3.selectAll(selection)[0].length;
                    d3.selectAll(selection)
                        .style("fill","#bbb")
                        .style("font-weight","normal");
                    for(var b=0;b < axis_data_length;b++) {
                        for(var a=0;a < active_tick.length;a++) {
                            if(d3.selectAll(selection)[0][b].__data__ == active_tick[a]) {
                                d3.select(d3.selectAll(selection)[0][b])
                                    .style("fill",abc)
                                    .style("font-weight","bold");
                            }
                        }
                    }
                }
                else {
                    if(axisHighlight === options.selector + " .x.axis") {
                        selection = axisHighlight+" .tick text";
                        abc = options.axis_x_pointer_color;
                    } else if(axisHighlight === options.selector + " .axis-text" && a === "column") {
                        selection = axisHighlight;
                        abc = options.axis_x_pointer_color;
                    } else if(axisHighlight === options.selector + " .axis-text" && a === "bar") {
                        selection = axisHighlight;
                        abc = options.axis_y_pointer_color;
                    }
                    if(prev_tick !== undefined) {
                        d3.select(d3.selectAll(selection)[0][prev_tick])
                            .style("fill",abc)
                            .style("font-weight","normal");
                    }
                    axis_data_length = d3.selectAll(selection)[0].length;
                    var len = domain.length;
                    if(options.axis_x_data_format === "number" && a === undefined) {
                        for(var curr_tick=0;curr_tick< axis_data_length;curr_tick++) {
                            if(d3.selectAll(selection)[0][curr_tick].__data__ == active_tick) {
                                break;
                            }
                        }
                    }
                    else{
                        for(curr_tick = 0;curr_tick < len;curr_tick++){
                            if(domain[curr_tick] === active_tick) {
                                break;
                            }
                        }
                    }
                    prev_tick = curr_tick;
                    d3.selectAll(selection)
                        .style("fill","#bbb")
                    d3.select(d3.selectAll(selection)[0][curr_tick])
                        .style("fill",abc)
                        .style("font-weight","bold");
                }
            }
            return this;
        },
        axisHighlightHide: function (axisHighlight,a) {
            var fill_color,selection,font_weight;
            if(PykCharts['boolean'](options.axis_onhover_highlight_enable)/* && options.mode === "default"*/){
                if(axisHighlight === options.selector + " .y.axis") {
                    selection = axisHighlight+" .tick text";
                    fill_color = options.axis_y_pointer_color;
                    font_weight = options.axis_y_pointer_weight;
                } else if(axisHighlight === options.selector + " .x.axis") {
                    selection = axisHighlight+" .tick text";
                    fill_color = options.axis_x_pointer_color;
                    font_weight = options.axis_x_pointer_weight;
                } else if(axisHighlight === options.selector + " .axis-text" && a === "column") {
                    selection = axisHighlight;
                    fill_color = options.axis_x_pointer_color;
                    font_weight = options.axis_x_pointer_weight;
                } else if(axisHighlight === options.selector + " .axis-text" && a === "bar") {
                    selection = axisHighlight;
                    fill_color = options.axis_y_pointer_color;
                    font_weight = options.axis_y_pointer_weight;
                }
                d3.selectAll(selection)
                    .style("fill",fill_color)
                    .style("font-weight",font_weight);
            }

            return this;
        },
        highlight: function (selectedclass, that) {
            var t = d3.select(that);
            d3.selectAll(selectedclass)
                .attr("fill-opacity",.5)
            t.attr("fill-opacity",1);
            return this;
        },
        highlightHide: function (selectedclass) {
            d3.selectAll(selectedclass)
                .attr("fill-opacity",function (d,i) {
                    return $(this).attr("data-fill-opacity");
                });
            return this;
        },
        highlightGroup: function (selectedclass, that, element) {
            var t = d3.select(that);

            var group = d3.selectAll(selectedclass);

                group.selectAll(element)
                    .attr("fill-opacity",.5)

            t.selectAll(element).attr("fill-opacity",1);

            return this;
        },
        highlightGroupHide : function (selectedclass,element) {
            d3.selectAll(selectedclass+" "+element)
                .attr("fill-opacity",function (d,i) {
                    return $(this).attr("data-fill-opacity");
                });
            return this;
        }
    };
    return action;
};

configuration.fillChart = function (options,theme,config) {
    var that = this;
    var fillchart = {
        selectColor: function (d) {
        theme = new PykCharts.Configuration.Theme({});
            if(d.name.toLowerCase() === options.highlight.toLowerCase()) {
                return options.highlight_color;
            } else if (options.chart_color.length && options.chart_color[0]){
                return options.chart_color[0];
            } else {
                return theme.stylesheet.chart_color
            }
        },
        colorChart: function (d) {
            if(d.name === options.highlight) {
                return theme.stylesheet.highlight_color;
            } else{
                return theme.stylesheet.chart_color;
            }
        },
        colorPieW: function (d) {
            if(d.color) {

                return d.color;
            } else if(options.chart_color.length) {
                return options.color;
            }
            else return options.chart_color[0];
        },
        colorPieMS: function (d,chart_type) {
            if( chart_type !== "lineChart" && chart_type !== "areaChart" && d.name.toLowerCase() === options.highlight.toLowerCase()) {
                return options.highlight_color;
            } else if(options.color_mode === "saturation") {
                return options.saturation_color;
            } else if(options.color_mode === "color") {
                return d.color;
            } else if(options.color_mode === "color"){
                return options.chart_color;
            } return options.chart_color[0];
        },
        colorGroup: function (d) {
            if(options.color_mode === "saturation") {
                return options.saturation_color;
            } else if(options.color_mode === "color") {
                return d.color;
            } else if(options.color_mode === "color"){
                return options.chart_color[0];
            }
        },
        colorLegends: function (d) {
            if(options.color_mode === "saturation") {
                return options.saturation_color;
            } else if(options.color_mode === "color" && d) {
                return d;
            } else if(options.color_mode === "color"){
                return options.chart_color;
            } else {
                return options.chart_color[0];
            } return options.chart_color;
        }
    }
    return fillchart;
};

configuration.border = function (options) {
    var that = this;
    var border = {
        width: function () {
            return options.border_between_chart_elements_thickness +"px";
        },
        color: function () {
            return options.border_between_chart_elements_color;
        },
        style: function () {
            return options.border_between_chart_elements_style;
        }
    };
    return border;
};

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
            .style("font-weight",options.axis_x_pointer_weight)
            .style("font-family",options.axis_x_pointer_family);

    if(options.axis_x_data_format=== "time" && PykCharts['boolean'](options.axis_x_time_value_datatype)) {
        if(options.axis_x_time_value_datatype === "month") {
            a = d3.time.month;
            b = "%b";
        }else if(options.axis_x_time_value_datatype === "date") {
            a = d3.time.day;
            b = "%d";
        } else if(options.axis_x_time_value_datatype === "year") {
            a = d3.time.year;
            b = "%Y";
        } else if(options.axis_x_time_value_datatype === "hours") {
            a = d3.time.hour;
            b = "%H";
        } else if(options.axis_x_time_value_datatype === "minutes") {
            a = d3.time.minute;
            b = "%M";
        }
        xaxis.ticks(a,options.axis_x_time_value_interval)
            .tickFormat(d3.time.format(b));

    } else if(options.axis_x_data_format === "number") {
        xaxis.ticks(options.axis_x_no_of_axis_value);
    }

    return xaxis;
};

configuration.makeYAxis = function(options,yScale) {
    var that = this;
    var k = PykCharts.Configuration(options);

    var yaxis = d3.svg.axis()
                    .scale(yScale)
                    .orient(options.axis_y_pointer_position)
                    .tickSize(options.axis_y_pointer_length)
                    .outerTickSize(options.axis_y_outer_pointer_length)
                    .tickPadding(options.axis_y_pointer_padding)
                    .tickFormat(function (d,i) {
                        return d;
                    });

    d3.selectAll(options.selector + " .y.axis .tick text")
                .attr("font-size",options.axis_y_pointer_size +"px")
                .style("font-weight",options.axis_y_pointer_weight)
                .style("font-family",options.axis_y_pointer_family);


    if(options.axis_y_data_format=== "time" && PykCharts['boolean'](options.axis_y_time_value_type)) {
        if(options.axis_y_time_value_type === "month") {
            a = d3.time.month;
            b = "%b";
        }else if(options.axis_y_time_value_type === "date") {
            a = d3.time.day;
            b = "%d";
        } else if(options.axis_y_time_value_type === "year") {
            a = d3.time.year;
            b = "%Y";
        } else if(options.axis_y_time_value_type === "hours") {
            a = d3.time.hour;
            b = "%H";
        } else if(options.axis_y_time_value_type === "minutes") {
            a = d3.time.minute;
            b = "%M";
        }
        xaxis.ticks(a,options.axis_y_time_value_unit)
            .tickFormat(d3.time.format(b));

    }else if(options.axis_y_data_format === "number"){
        yaxis.ticks(options.axis_y_no_of_axis_value);
    }
    return yaxis;
};

configuration.makeXGrid = function(options,xScale,legendsGroup_height) {
    var that = this;
    if(!legendsGroup_height) {
        legendsGroup_height = 0;
    }

    var xgrid = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(options.axis_x_no_of_axis_value)
                    .tickFormat("")
                    .tickSize(options.height - options.margin_top - options.margin_bottom - legendsGroup_height)
                    .outerTickSize(0);

    d3.selectAll(options.selector + " .x.axis .tick text")
                    .attr("font-size",options.axis_x_pointer_size + "px")
                    .style("font-weight",options.axis_x_pointer_weight)
                    .style("font-family",options.axis_x_pointer_family);

    return xgrid;
};

configuration.makeYGrid = function(options,yScale,legendsGroup_width) {
    var that = this, size;
    if(!legendsGroup_width) {
        legendsGroup_width = 0;
    }

    if(PykCharts['boolean'](options.panels_enable)) {
        size = options.w - options.margin_left - options.margin_right - legendsGroup_width;
    } else {
        size = options.width - options.margin_left - options.margin_right - legendsGroup_width;
    }
    var ygrid = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(options.axis_x_no_of_axis_value)
                    .tickSize(-size)
                    .tickFormat("")
                    .outerTickSize(0);

    d3.selectAll(options.selector + " .y.axis .tick text")
                    .attr("font-size",options.axis_y_pointer_size + "px")
                    .style("font-weight",options.axis_y_pointer_weight)
                    .style("font-family",options.axis_y_pointer_family);


    return ygrid;
};

configuration.transition = function (options) {
    var that = this;
    var transition = {
        duration: function() {
            if(options.mode === "default" && PykCharts['boolean'](options.transition_duration)) {
                return options.transition_duration * 1000;
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

        "mode": "default",
        "selector": "",
        "is_interactive": "yes",

        "chart_height": 400,
        "chart_width": 600,
        "chart_margin_top": 35,
        "chart_margin_right": 50,
        "chart_margin_bottom": 35,
        "chart_margin_left": 50,

        "title_size": 15,
        "title_color": "#1D1D1D",
        "title_weight": "bold",
        "title_family": "'Helvetica Neue',Helvetica,Arial,sans-serif",

        "subtitle_size": 12,
        "subtitle_color": "black",
        "subtitle_weight": "normal",
        "subtitle_family": "'Helvetica Neue',Helvetica,Arial,sans-serif",

        "highlight": "",
        "highlight_color": "#08306b",
        "background_color": "transparent",
        "chart_color": ["#255AEE"],
        "saturation_color": "#255AEE",

        "border_between_chart_elements_thickness": 1,
        "border_between_chart_elements_color": "white",
        "border_between_chart_elements_style": "solid",

        "legends_enable": "yes",
        "legends_display": "horizontal",
        "legends_text_size": 13,
        "legends_text_color": "#1D1D1D",
        "legends_text_weight": "normal",
        "legends_text_family": "'Helvetica Neue',Helvetica,Arial,sans-serif",

        "label_size": 13,
        "label_color": "white",
        "label_weight": "normal",
        "label_family": "'Helvetica Neue',Helvetica,Arial,sans-serif",

        "pointer_overflow_enable": "no",
        "pointer_thickness": 1,
        "pointer_weight": "normal",
        "pointer_size": 13,
        "pointer_color": "#1D1D1D",
        "pointer_family": "'Helvetica Neue',Helvetica,Arial,sans-serif",

        "export_enable": "yes",

        "color_mode": "saturation",

        "axis_x_pointer_size": 12,
        "axis_x_pointer_family": "'Helvetica Neue',Helvetica,Arial,sans-serif",
        "axis_x_pointer_weight": "normal",
        "axis_x_pointer_color": "#1D1D1D",

        "axis_x_enable": "yes",

        "axis_x_title": "",
        "axis_x_title_size": 14,
        "axis_x_title_color": "#1D1D1D",
        "axis_x_title_weight": "bold",
        "axis_x_title_family": "'Helvetica Neue',Helvetica,Arial,sans-serif",

        "axis_x_position": "bottom",
        "axis_x_pointer_position": "top", //axis orient
        "axis_x_line_color": "#1D1D1D",
        "axis_x_no_of_axis_value": 5,
        "axis_x_pointer_length": 5,
        "axis_x_pointer_padding": 6,
        "axis_x_pointer_values": [],
        "axis_x_outer_pointer_length": 0,
        "axis_x_time_value_datatype":"",
        "axis_x_time_value_interval":0,
        "axisHighlight_x_data_format": "string",

        "loading_source": "<div class='PykCharts-loading'><div></div><div></div><div></div></div>",
        "loading_type": "css",

        "tooltip_enable": "yes",
        "tooltip_mode": "moving",

        "credit_my_site_name": "Pykih",
        "credit_my_site_url": "http://www.pykih.com",
        "chart_onhover_highlight_enable": "yes",

    };

    that.functionality = {
        "real_time_charts_refresh_frequency": 0,
        "real_time_charts_last_updated_at_enable": "yes",
        "transition_duration": 0
    };

    that.oneDimensionalCharts = {
        "clubdata_enable": "yes",
        "clubdata_text": "Others",
        "clubdata_maximum_nodes": 5,

        "pie_radius_percent": 70,
        "donut_radius_percent": 70,
        "donut_inner_radius_percent": 40,
        "donut_show_total_at_center": "yes",
        "donut_show_total_at_center_size": 14,
        "donut_show_total_at_center_color": "#1D1D1D",
        "donut_show_total_at_center_weight": "bold",
        "donut_show_total_at_center_family":"'Helvetica Neue',Helvetica,Arial,sans-serif",

        "funnel_rect_width": 100,
        "funnel_rect_height": 100,

        "percent_column_rect_width": 15,
        "percent_row_rect_height": 26,
    };

    that.otherCharts = {
        "pictograph_show_all_images": "yes",
        "pictograph_total_count_enable": "yes",
        "pictograph_current_count_enable": "yes",
        "pictograph_image_per_line": 3,
        "pictograph_image_width": 79,
        "pictograph_image_height": 66,
        "pictograph_current_count_size": 64,
        "pictograph_current_count_color": "#255aee",
        "pictograph_current_count_weight": "normal",
        "pictograph_current_count_family": "'Helvetica Neue',Helvetica,Arial,sans-serif",
        "pictograph_total_count_size": 64,
        "pictograph_total_count_color": "grey",
        "pictograph_total_count_weight": "normal",
        "pictograph_total_count_family": "'Helvetica Neue',Helvetica,Arial,sans-serif",
        "pictograph_units_per_image_text_size": 24,
        "pictograph_units_per_image_text_color": "grey",
        "pictograph_units_per_image_text_weight": "normal",
        "pictograph_units_per_image_text_family": "'Helvetica Neue',Helvetica,Arial,sans-serif"
    };

    that.multiDimensionalCharts = {

        "chart_grid_x_enable": "yes",
        "chart_grid_y_enable": "yes",
        "chart_grid_color":"#ddd",

        "axis_onhover_highlight_enable": "no",

        "axis_y_pointer_size": 12,
        "axis_y_pointer_family": "'Helvetica Neue',Helvetica,Arial,sans-serif",
        "axis_y_pointer_weight": "normal",
        "axis_y_pointer_color": "#1D1D1D",
        "axis_y_enable": "yes",

        "axis_y_title": "",
        "axis_y_title_size": 14,
        "axis_y_title_color": "#1D1D1D",
        "axis_y_title_weight": "bold",
        "axis_y_title_family": "'Helvetica Neue',Helvetica,Arial,sans-serif",

        "axis_y_position": "left",
        "axis_y_pointer_position": "left",
        "axis_y_line_color": "#1D1D1D",
        "axis_y_no_of_axis_value": 5,
        "axis_y_pointer_length": 5,
        "axis_y_pointer_padding": 6,
        "axis_y_pointer_values": [],
        "axis_y_outer_pointer_length": 0,
        "axis_y_time_value_datatype":"",
        "axis_y_time_value_interval":0,
        "axis_y_data_format": "number",
        "variable_circle_size_enable": "yes",

        "crosshair_enable": "yes",
        "zoom_enable": "no",
        "zoom_level": 3,

        "spiderweb_outer_radius_percent": 80,

        "scatterplot_radius": 20,
        "scatterplot_pointer_enable": "no",

        "curvy_lines_enable": "no",

        "annotation_enable": "no",
        "annotation_view_mode": "onload", // "onload" / "onclick"

        "annotation_background_color" : "#C2CBCF", /*"#EEEEEE"*/
        "annotation_font_color" : "black",
        "legends_mode":"default", // or interactive
        "expand_group": "yes",
        "data_mode_enable" : "no",
        "data_mode_legends_color" : "black",
        "data_mode_default" : "percentage",
        "connecting_lines_color" : "#ddd",
        "connecting_lines_style": "solid",
        "text_between_steps_color": "#aaa",
        "text_between_steps_family": "'Helvetica Neue',Helvetica,Arial,sans-serif",
        "text_between_steps_size": 10,
        "text_between_steps_weight" : "normal",
        "data_mode_enable" : "no",
        "data_mode_legends_color" : "black",
        "data_mode_default" : "percentage",
        "connecting_lines_color" : "#ddd",
        "connecting_lines_style": "solid",

        "data_sort_enable": "yes",
        "data_sort_type": "alphabetically", // sort type --- "alphabetically" / "numerically" / "date"
        "data_sort_order": "ascending" // sort order --- "descending" / "ascending"
    };

    that.treeCharts = {
        "zoom_enable": "no",
        "nodeRadius": 4.5
    };

    that.mapsTheme = {
        "total_no_of_colors": 3,
        "palette_color": "Blue-1",

        "tooltip_position_top": 0,
        "tooltip_position_left": 0,

        "timeline_duration": 1,
        "timeline_margin_top": 5,
        "timeline_margin_right": 25,
        "timeline_margin_bottom": 25,
        "timeline_margin_left": 45,

        "label_enable": "no",
        "click_enable": "yes",

        "chart_onhover_effect": "shadow"
    };
    return that;
}

PykCharts.oneD = {};

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
        , oneDimensionalCharts = theme.oneDimensionalCharts;

    chartObject.selector = options.selector ? options.selector : stylesheet.selector;
    chartObject.width = options.chart_width  ? options.chart_width : stylesheet.chart_width;
    chartObject.is_interactive = options.is_interactive ? options.is_interactive.toLowerCase(): oneDimensionalCharts.is_interactive;

    chartObject.mode = options.mode ? options.mode.toLowerCase(): stylesheet.mode;

    if (options &&  PykCharts['boolean'] (options.title_text)) {
        chartObject.title_text = options.title_text;
        chartObject.title_size = "title_size" in options ? options.title_size : stylesheet.title_size;
        chartObject.title_color = options.title_color ? options.title_color : stylesheet.title_color;
        chartObject.title_weight = options.title_weight ? options.title_weight.toLowerCase() : stylesheet.title_weight;
        chartObject.title_family = options.title_family ? options.title_family.toLowerCase() : stylesheet.title_family;
    } else {
        chartObject.title_size = stylesheet.title_size;
        chartObject.title_color = stylesheet.title_color;
        chartObject.title_weight = stylesheet.title_weight;
        chartObject.title_family = stylesheet.title_family;
    }

    if (options && PykCharts['boolean'](options.subtitle_text)) {
        chartObject.subtitle_text = options.subtitle_text;
        chartObject.subtitle_size = "subtitle_size" in options ? options.subtitle_size : stylesheet.subtitle_size;
        chartObject.subtitle_color = options.subtitle_color ? options.subtitle_color : stylesheet.subtitle_color;
        chartObject.subtitle_weight = options.subtitle_weight ? options.subtitle_weight.toLowerCase() : stylesheet.subtitle_weight;
        chartObject.subtitle_family = options.subtitle_family ? options.subtitle_family.toLowerCase() : stylesheet.subtitle_family;
    } else {
        chartObject.subtitle_size = stylesheet.subtitle_size;
        chartObject.subtitle_color = stylesheet.subtitle_color;
        chartObject.subtitle_weight = stylesheet.subtitle_weight;
        chartObject.subtitle_family = stylesheet.subtitle_family;
    }
    chartObject.real_time_charts_refresh_frequency = options.real_time_charts_refresh_frequency ? options.real_time_charts_refresh_frequency : functionality.real_time_charts_refresh_frequency;
    chartObject.real_time_charts_last_updated_at_enable = options.real_time_charts_last_updated_at_enable ? options.real_time_charts_last_updated_at_enable.toLowerCase() : functionality.real_time_charts_last_updated_at_enable;

    if(options.credit_my_site_name || options.credit_my_site_url) {
        chartObject.credit_my_site_name = options.credit_my_site_name ? options.credit_my_site_name : "";
        chartObject.credit_my_site_url = options.credit_my_site_url ? options.credit_my_site_url : "";
    } else {
        chartObject.credit_my_site_name = stylesheet.credit_my_site_name;
        chartObject.credit_my_site_url = stylesheet.credit_my_site_url;
    }
    chartObject.data_source_name = options.data_source_name ? options.data_source_name : "";
    chartObject.data_source_url = options.data_source_url ? options.data_source_url : "";

    chartObject.clubdata_enable = options.clubdata_enable ? options.clubdata_enable.toLowerCase() : oneDimensionalCharts.clubdata_enable;
    chartObject.clubdata_text = PykCharts['boolean'](chartObject.clubdata_enable) && options.clubdata_text ? options.clubdata_text : oneDimensionalCharts.clubdata_text;
    chartObject.clubdata_maximum_nodes = PykCharts['boolean'](chartObject.clubdata_enable) && options.clubdata_maximum_nodes ? options.clubdata_maximum_nodes : oneDimensionalCharts.clubdata_maximum_nodes;
    chartObject.clubdata_always_include_data_points = PykCharts['boolean'](chartObject.clubdata_enable) && options.clubdata_always_include_data_points ? options.clubdata_always_include_data_points : [];

    chartObject.transition_duration = options.transition_duration ? options.transition_duration : functionality.transition_duration;
    chartObject.pointer_overflow_enable = options.pointer_overflow_enable ? options.pointer_overflow_enable.toLowerCase() : stylesheet.pointer_overflow_enable;

    chartObject.background_color = options.background_color ? options.background_color : stylesheet.background_color;

    chartObject.chart_color = options.chart_color  ? options.chart_color : stylesheet.chart_color;
    chartObject.highlight_color = options.highlight_color ? options.highlight_color : stylesheet.highlight_color;

    chartObject.fullscreen_enable = options.fullscreen_enable ? options.fullscreen_enable : stylesheet.fullscreen_enable;
    chartObject.loading_type = options.loading_type ? options.loading_type : stylesheet.loading_type;
    chartObject.loading_source = options.loading_source ? options.loading_source : stylesheet.loading_source;
    chartObject.tooltip_enable = options.tooltip_enable ? options.tooltip_enable.toLowerCase() : stylesheet.tooltip_enable;
    chartObject.border_between_chart_elements_thickness = "border_between_chart_elements_thickness" in options ? options.border_between_chart_elements_thickness : stylesheet.border_between_chart_elements_thickness;
    chartObject.border_between_chart_elements_color = options.border_between_chart_elements_color ? options.border_between_chart_elements_color : stylesheet.border_between_chart_elements_color;
    chartObject.border_between_chart_elements_style = options.border_between_chart_elements_style ? options.border_between_chart_elements_style.toLowerCase() : stylesheet.border_between_chart_elements_style;
    switch(chartObject.border_between_chart_elements_style) {
        case "dotted" : chartObject.border_between_chart_elements_style = "1,3";
                        break;
        case "dashed" : chartObject.border_between_chart_elements_style = "5,5";
                       break;
        default : chartObject.border_between_chart_elements_style = "0";
                  break;
    }
    chartObject.highlight = options.highlight ? options.highlight : stylesheet.highlight;

    chartObject.label_size = "label_size" in options ? options.label_size : stylesheet.label_size;
    chartObject.label_color = options.label_color ? options.label_color : stylesheet.label_color;
    chartObject.label_weight = options.label_weight ? options.label_weight.toLowerCase() : stylesheet.label_weight;
    chartObject.label_family = options.label_family ? options.label_family.toLowerCase() : stylesheet.label_family;

    chartObject.pointer_thickness = "pointer_thickness" in options ? options.pointer_thickness : stylesheet.pointer_thickness;
    chartObject.pointer_size = "pointer_size" in options ? options.pointer_size : stylesheet.pointer_size;
    chartObject.pointer_color = options.pointer_color ? options.pointer_color : stylesheet.pointer_color;
    chartObject.pointer_family = options.pointer_family ? options.pointer_family.toLowerCase() : stylesheet.pointer_family;
    chartObject.pointer_weight = options.pointer_weight ? options.pointer_weight.toLowerCase() : stylesheet.pointer_weight;

    chartObject.units_prefix = options.units_prefix ? options.units_prefix : false;
    chartObject.units_suffix = options.units_suffix ? options.units_suffix : false;

    chartObject.onhover_enable = options.chart_onhover_highlight_enable ? options.chart_onhover_highlight_enable : stylesheet.chart_onhover_highlight_enable;
    
    chartObject.export_enable = options.export_enable ? options.export_enable.toLowerCase() : stylesheet.export_enable;
    chartObject.k = new PykCharts.Configuration(chartObject);

    chartObject.k.validator().validatingSelector(chartObject.selector.substring(1,chartObject.selector.length))
                .isArray(chartObject.chart_color,"chart_color")
                .isArray(chartObject.clubdata_always_include_data_points,"clubdata_always_include_data_points")
                .validatingChartMode(chartObject.mode,"mode",stylesheet.mode)
                .validatingDataType(chartObject.width,"chart_width",stylesheet.chart_width,"width")
                .validatingDataType(chartObject.title_size,"title_size",stylesheet.title_size)
                .validatingDataType(chartObject.subtitle_size,"subtitle_size",stylesheet.subtitle_size)
                .validatingDataType(chartObject.real_time_charts_refresh_frequency,"real_time_charts_refresh_frequency",functionality.real_time_charts_refresh_frequency)
                .validatingDataType(chartObject.transition_duration,"transition_duration",functionality.transition_duration)
                .validatingDataType(chartObject.border_between_chart_elements_thickness,"border_between_chart_elements_thickness",stylesheet.border_between_chart_elements_thickness)
                .validatingDataType(chartObject.label_size,"label_size",stylesheet.label_size)
                .validatingDataType(chartObject.pointer_thickness,"pointer_thickness",stylesheet.pointer_thickness)
                .validatingDataType(chartObject.pointer_size,"pointer_size",stylesheet.pointer_size)
                .validatingDataType(chartObject.clubdata_maximum_nodes,"clubdata_maximum_nodes",oneDimensionalCharts.clubdata_maximum_nodes)
                .validatingFontWeight(chartObject.title_weight,"title_weight",stylesheet.title_weight)
                .validatingFontWeight(chartObject.subtitle_weight,"subtitle_weight",stylesheet.subtitle_weight)
                .validatingFontWeight(chartObject.pointer_weight,"pointer_weight",stylesheet.pointer_weight)
                .validatingFontWeight(chartObject.label_weight,"label_weight",stylesheet.label_weight)
                .validatingColor(chartObject.background_color,"background_color",stylesheet.background_color)
                .validatingColor(chartObject.title_color,"title_color",stylesheet.title_color)
                .validatingColor(chartObject.subtitle_color,"subtitle_color",stylesheet.subtitle_color)
                .validatingColor(chartObject.highlight_color,"highlight_color",stylesheet.highlight_color)
                .validatingColor(chartObject.label_color,"label_color",stylesheet.label_color)
                .validatingColor(chartObject.pointer_color,"pointer_color",stylesheet.pointer_color)
                .validatingColor(chartObject.border_between_chart_elements_color,"border_between_chart_elements_color",stylesheet.border_between_chart_elements_color)

        if($.isArray(chartObject.chart_color)) {
            if(chartObject.chart_color[0]) {
                chartObject.k.validator()
                    .validatingColor(chartObject.chart_color[0],"chart_color",stylesheet.chart_color);
            }
        }


    return chartObject;
};

PykCharts.oneD.bubble = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function () {
        that = PykCharts.oneD.processInputs(that, options);
        that.height = options.chart_height ? options.chart_height : that.width;

        try {
            if(!_.isNumber(that.height)) {
                that.height = that.width;
                throw "chart_height"
            }
        }

        catch (err) {
            that.k.warningHandling(err,"1");
        }

        if(that.mode === "default") {
            that.k.loading();
        }

        that.executeData = function (data) { 
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(options.selector+" #chart-loader").remove();
                $(that.selector).css("height","auto")
                return;
            }

            that.data = that.k.__proto__._groupBy("oned",data);
            that.compare_data = that.k.__proto__._groupBy("oned",data);

            $(options.selector+" #chart-loader").remove();
            $(that.selector).css("height","auto")
            that.clubdata_enable = that.data.length>that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.render();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeData")
    };

    this.refresh = function () {

        that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("oned",data);
            that.clubdata_enable = that.data.length>that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.refresh_data = that.k.__proto__._groupBy("oned",data);
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.new_data = that.optionalFeatures().clubData();
            that.optionalFeatures()
                .createChart()
                .label();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
    };

    this.render = function () {
        var l = $(".svgcontainer").length;
        that.container_id = "svgcontainer" + l;
        that.fillChart = new PykCharts.Configuration.fillChart(that);
        that.transitions = new PykCharts.Configuration.transition(that);

        if (that.mode ==="default") {

            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+that.container_id,"bubble")
                .emptyDiv()
                .subtitle();

            that.new_data = that.optionalFeatures().clubData();
            that.optionalFeatures().svgContainer()
                .createChart()
                .label();

            that.k.createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource()
                .liveData(that)
                .tooltip();
        }
        else if (that.mode ==="infographics") {
            that.k.backgroundColor(that)
                .export(that,"#" + that.container_id,"bubble")
                .emptyDiv();

            that.new_data = {"children" : that.data};
            that.optionalFeatures().svgContainer()
                .createChart()
                .label();

            that.k.tooltip();

        }
        that.k.exportSVG(that,"#"+that.container_id,"bubble")
        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        $(document).ready(function () { return that.k.resize(that.svgContainer); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer); });
    };

    this.optionalFeatures = function () {

        var optional = {
            svgContainer: function () {
                that.svgContainer = d3.select(that.selector).append("svg")
                    .attr("class","svgcontainer PykCharts-oneD")
                    .attr("id",that.container_id)
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height)
                    .attr("width",that.width)
                    .attr("height",that.height);

                that.group = that.svgContainer.append("g")
                    .attr("id","bubgrp");
                return this;
            },
            createChart : function () {

                that.bubble = d3.layout.pack()
                    .sort(function (a,b) { return b.weight - a.weight; })
                    .size([that.width, that.height])
                    .value(function (d) { return d.weight; })
                    .padding(20);

                that.sum = d3.sum(that.new_data.children, function (d) {
                    return d.weight;
                })
                
                var l = that.new_data.children.length;
                that.node = that.bubble.nodes(that.new_data);

                that.chart_data = that.group.selectAll(".bubble-node")
                    .data(that.node);

                that.chart_data.enter()
                    .append("g")
                    .attr("class","bubble-node")
                    .append("circle");

                that.chart_data.attr("class","bubble-node")
                    .select("circle")
                    .attr("class","bubble")
                    .attr("id",function (d,i) {
                        return "bubble"+i;
                    })
                    .attr("x",function (d) { return d.x; })
                    .attr("y",function (d) { return d.y; })
                    .attr("r",0)
                    .attr("transform",function (d) { return "translate(" + d.x + "," + d.y +")"; })
                    .attr("fill",function (d) {
                        return d.children ? that.background_color : that.fillChart.selectColor(d);
                    })
                    .attr("fill-opacity",1)
                    .attr("data-fill-opacity",function () {
                        return $(this).attr("fill-opacity");
                    })
                    .on("mouseover", function (d) {
                        if(!d.children && that.mode==="default") {
                            if(PykCharts['boolean'](that.onhover_enable)) {
                                that.mouseEvent.highlight(options.selector+" "+".bubble", this);
                            }
                            d.tooltip = d.tooltip ||"<table><thead><th colspan='2' class='tooltip-heading'>"+d.name+"</th></thead><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.weight)+"  <td class='tooltip-right-content'>("+((d.weight*100)/that.sum).toFixed(1)+"%)</tr></table>";
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(d.tooltip);
                        }
                    })
                    .on("mouseout", function (d) {
                        if(that.mode==="default") {
                            that.mouseEvent.tooltipHide(d)
                            if(PykCharts['boolean'](that.onhover_enable)) {
                                that.mouseEvent.highlightHide(options.selector+" "+".bubble");
                            }
                        }

                    })
                    .on("mousemove", function (d) {
                        if(!d.children && that.mode==="default") {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("r",function (d) {return d.r; });
                that.chart_data.exit().remove();

                return this;
            },
            label : function () {
                 that.chart_text = that.group.selectAll(".name")
                        .data(that.node);
                    that.chart_text1 = that.group.selectAll(".weight")
                        .data(that.node);
                    that.chart_text.enter()
                        .append("svg:text")
                        .attr("class","name");

                    that.chart_text1.enter()
                        .append("svg:text")
                        .attr("class","weight");

                    that.chart_text.attr("class","name")
                        .attr("x", function (d) { return d.x })
                        .attr("y", function (d) { return d.y -5 });

                    that.chart_text1.attr("class","weight")
                        .attr("x", function (d) { return d.x })
                        .attr("y", function (d) { return d.y + 10; });

                    that.chart_text.attr("text-anchor","middle")
                        .style("font-weight", that.label_weight)
                        .style("font-size", that.label_size + "px")
                        .attr("fill", that.label_color)
                        .style("font-family", that.label_family)
                        .text("")

                  setTimeout(function() {
                        that.chart_text
                            .text(function (d) { return d.children ? " " :  d.name; })
                            .attr("pointer-events","none")
                            .text(function (d) {
                                if(this.getBBox().width< 2*d.r && this.getBBox().height<2*d.r) {
                                    return d.children ? " " :  d.name;
                                }
                                else {
                                    return "";
                                }
                            });
                    },that.transitions.duration());

                    that.chart_text1.attr("text-anchor","middle")
                        .style("font-weight", that.label_weight)
                        .style("font-size", that.label_size + "px")
                        .attr("fill", that.label_color)
                        .style("font-family", that.label_family)
                        .text("")
                        .attr("pointer-events","none")

                    setTimeout(function () {
                        that.chart_text1.text(function (d) { return d.children ? " " :  that.k.appendUnits(d.weight); })
                            .text(function (d) {
                                if(this.getBBox().width<2*d.r*0.55 && this.getBBox().height<2*d.r*0.55) {
                                    return d.children ? " " :  ((d.weight*100)/that.sum).toFixed(1)+"%"; /*that.k.appendUnits(d.weight);*/
                                }
                                else {
                                    return "";
                                }
                            });
                    },that.transitions.duration());

                    that.chart_text.exit()
                        .remove();
                    that.chart_text1.exit()
                        .remove();
                return this;
            },
            clubData : function () {
                var new_data1;
                if (PykCharts['boolean'](that.clubdata_enable)) {
                    var clubdata_content = [];
                    var k = 0, j, i, new_data = [];
                    if(that.data.length <= that.clubdata_maximum_nodes) {
                        new_data1 = { "children" : that.data };
                        return new_data1;
                    }
                    if (that.clubdata_always_include_data_points.length!== 0) {
                        var l = that.clubdata_always_include_data_points.length;
                        for (i =0; i<l; i++) {
                            clubdata_content[i] = that.clubdata_always_include_data_points[i];
                        }
                    }
                    for (i=0; i<clubdata_content.length; i++) {
                        for (j=0; j< that.data.length; j++) {
                            if (clubdata_content[i].toUpperCase() === that.data[j].name.toUpperCase()) {
                                new_data.push(that.data[j]);
                            }
                        }
                    }

                    that.data.sort (function (a,b) { return b.weight - a.weight;});
                    while (new_data.length < that.clubdata_maximum_nodes-1) {
                        for(i=0;i<clubdata_content.length;i++) {
                            if(that.data[k].name.toUpperCase() === clubdata_content[i].toUpperCase()) {
                                k++;
                            }
                        }
                        new_data.push(that.data[k]);
                        k++;
                    }
                    var sum_others = 0;
                    for(j=k; j<that.data.length; j++) {
                        for (i=0; i<new_data.length && j<that.data.length; i++) {
                            if(that.data[j].name.toUpperCase() === new_data[i].name.toUpperCase()) {
                                sum_others+=0;
                                j++;
                                i = -1;
                            }
                        }
                        if(j<that.data.length) {
                            sum_others += that.data[j].weight;
                        }
                    }
                    var f = function (a,b) {return b.weight- a.weight;};
                    while (new_data.length > that.clubdata_maximum_nodes) {
                        new_data.sort(f);
                        var a = new_data.pop();
                    }

                    var others_Slice = {"name": that.clubdata_text,"weight": sum_others, "color": that.clubData_color,"tooltip": that.clubData_tooltipText,"highlight":false};

                    if (new_data.length < that.clubdata_maximum_nodes) {
                        new_data.push(others_Slice);

                    }
                    new_data.sort(function (a,b) {
                        return a.weight - b.weight;
                    })

                    new_data1 = {"children": new_data};
                    that.map1 = new_data1.children.map(function (d) { return d.weight;});
                }
                else {
                    that.data.sort(function (a,b) {
                        return a.weight - b.weight;
                    })
                    new_data1 = { "children" : that.data };
                }
                return new_data1;
            }
        };
        return optional;
    };
};

PykCharts.oneD.funnel = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function () {
        that = new PykCharts.oneD.processInputs(that, options);
        that.height = options.chart_height ? options.chart_height : that.width;
        var optional = options.optional
        , functionality = theme.oneDimensionalCharts;
        that.rect_width =  options.funnel_rect_width   ? options.funnel_rect_width : functionality.funnel_rect_width;
        that.rect_height = options.funnel_rect_height  ? options.funnel_rect_height : functionality.funnel_rect_height;

            try {
                if(!_.isNumber(that.height)) {
                    that.height = that.width;
                    throw "chart_height"
                }
            }

            catch (err) {
                that.k.warningHandling(err,"1");
            }

            try {
                if(!_.isNumber(that.rect_width)) {
                    that.rect_width = functionality.funnel_rect_width;
                    throw "funnel_rect_width"
                }
            }
            catch (err) {
                that.k.warningHandling(err,"1");
            }

            try {

                if(!_.isNumber(that.rect_height)) {
                    that.rect_height = functionality.funnel_rect_height;
                    throw "funnel_rect_height"
                }
            }
            catch (err) {
                that.k.warningHandling(err,"1");
            }

        if(that.stop) {
            return;
        }

        if(that.mode === "default") {
           that.k.loading();
        }

        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(options.selector+" #chart-loader").remove();
                $(that.selector).css("height","auto")
                return;
            }
            that.data = that.k.__proto__._groupBy("oned",data);
            that.compare_data = that.k.__proto__._groupBy("oned",data);
            $(options.selector+" #chart-loader").remove();
            $(that.selector).css("height","auto");
            that.render();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeData");

    };
    this.refresh = function () {
        that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("oned",data);
            that.refresh_data = that.k.__proto__._groupBy("oned",data);
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.optionalFeatures()
                    .createChart()
                    .label()
                    .ticks();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
    };

    this.render = function () {
        var that = this;
        var l = $(".svgcontainer").length;
        that.container_id = "svgcontainer" + l;

        that.fillChart = new PykCharts.Configuration.fillChart(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.border = new PykCharts.Configuration.border(that);

        if(that.mode === "default") {
            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+that.container_id,"funnel")
                .emptyDiv()
                .subtitle();
        }
        that.k.tooltip();
        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        if(that.mode === "infographics") {
            that.k.backgroundColor(that)
                .export(that,"#"+that.container_id,"funnel")
                .emptyDiv();

            that.new_data = that.data;
        }
        if(that.mode === "default") {
            that.optionalFeatures();
        }
        that.optionalFeatures().svgContainer()
            .createChart()
            .label()
            .ticks();
        if(that.mode === "default") {
            that.k.liveData(that)
                .createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();
        }

        var add_extra_width = 0;
            setTimeout(function () {
                if(that.ticks_text_width.length) {
                    add_extra_width = _.max(that.ticks_text_width,function(d){
                            return d;
                        });
                }
                that.k.exportSVG(that,"#"+that.container_id,"funnel",undefined,undefined,add_extra_width)
            },that.transitions.duration());

        $(document).ready(function () { return that.k.resize(that.svgContainer); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer); });
    };

    this.funnelLayout = function (){
        var that = this;
        var data,
            size,
            mouth,
            sort_data,
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
                var ratio = tw/th;
                var area_of_trapezium = (w + rw) / 2 * th;
                var area_of_rectangle = rw * rh;
                var total_area = area_of_trapezium + area_of_rectangle;
                var percent_of_rectangle = area_of_rectangle / total_area * 100;
                for (var i=data.length-1; i>=0; i--){
                    var selectedPercentValues = that.percentageValues(data)[i];
                    if (percent_of_rectangle>=selectedPercentValues){
                        height3 = selectedPercentValues / percent_of_rectangle * rh;
                        height1 = h - height3;
                        if (i===data.length-1){
                            coordinates[i] = {"values":[{"x":(w-rw)/2,"y":height1},{"x":(w-rw)/2,"y":h},{"x":((w-rw)/2)+rw,"y":h},{"x":((w-rw)/2)+rw,"y":height1}]};
                        }else{
                            coordinates[i] = {"values":[{"x":(w-rw)/2,"y":height1},coordinates[i+1].values[0],coordinates[i+1].values[3],{"x":((w-rw)/2)+rw,"y":height1}]};
                        }
                    }else{
                        var area_of_element = ((selectedPercentValues)/100 * total_area) - area_of_rectangle;
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
        var percentValues = data.map(function (d){
            var weight_max = d3.max(data, function (d) {
                return d.weight;
            })
            return d.weight/weight_max*100;
        });
        percentValues.sort(function(a,b){
            return b-a;
        });
        return percentValues;
    };

    this.optionalFeatures = function () {

        var optional = {
            svgContainer :function () {

                that.svgContainer = d3.select(options.selector)
                    .append('svg')
                    .attr("width",that.width + "px") //+100 removed
                    .attr("height",that.height + "px")
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height)
                    .attr("id",that.container_id)
                    .attr("class","svgcontainer PykCharts-oneD");

                    that.group = that.svgContainer.append("g")
                        .attr("id","funnel");

                return this;
            },
            createChart: function () {

                that.new_data = that.data.sort(function(a,b) {
                    return b.weight-a.weight;
                })

                that.per_values = that.percentageValues(that.new_data);
                that.funnel = that.funnelLayout()
                                .data(that.new_data)
                                .size([that.width,that.height])
                                .mouth([that.rect_width,that.rect_height]);

                that.coordinates = that.funnel.coordinates();
                var line = d3.svg.line()
                                .interpolate('linear-closed')
                                .x(function(d,i) { return d.x; })
                                .y(function(d,i) { return d.y; });

                that.chart_data = that.group.selectAll('.fun-path')
                                .data(that.coordinates);
                var a = [{x:0,y:0},{x:that.width,y:0},{x:0,y:0},{x:that.width,y:0},{x:0,y:0},{x:that.width,y:0}];
                that.chart_data.enter()
                    .append('path')
                    .attr("class", "fun-path")

                that.chart_data
                    .attr("class","fun-path")
                    .attr('d',function(d){ return line(a); })

                    .attr("fill",function (d,i) {
                        return that.fillChart.selectColor(that.new_data[i]);
                    })
                    .attr("fill-opacity",1)
                    .attr("data-fill-opacity",function () {
                        return $(this).attr("fill-opacity");
                    })
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-dasharray", that.border.style())
                    .attr("stroke-opacity",1)
                    .on("mouseover", function (d,i) {
                        if(that.mode === "default") {
                            if(PykCharts['boolean'](that.onhover_enable)) {
                                that.mouseEvent.highlight(options.selector +" "+".fun-path",this);
                            }
                            tooltip = that.data[i].tooltip || "<table class='PykCharts'><tr><th colspan='3' class='tooltip-heading'>"+that.new_data[i].name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(that.new_data[i].weight)+"<td class='tooltip-right-content'>("+that.per_values[i].toFixed(1)+"%) </tr></table>";
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(tooltip);
                        }
                    })
                    .on("mouseout", function (d) {
                        if(that.mode === "default") {
                            if(PykCharts['boolean'](that.onhover_enable)) {
                                that.mouseEvent.highlightHide(options.selector +" "+".fun-path");
                            }
                            that.mouseEvent.tooltipHide(d);
                        }
                    })
                    .on("mousemove", function (d,i) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr('d',function(d){ return line(d.values); });

               that.chart_data.exit()
                   .remove();

                return this;
            },
            label : function () {

                that.chart_text = that.group.selectAll("text")
                    .data(that.coordinates)

                    that.chart_text.enter()
                        .append("text")


                    that.chart_text.attr("y",function (d,i) {
                            if(d.values.length===4){
                                return (((d.values[0].y-d.values[1].y)/2)+d.values[1].y) + 5;
                            } else {
                                return (((d.values[0].y-d.values[2].y)/2)+d.values[2].y) + 5;
                            }
                        })
                        .attr("x", function (d,i) { return that.width/2;})

                    that.chart_text.text("");

                    setTimeout(function(){
                        that.chart_text.text(function (d,i) {
                                return that.per_values[i].toFixed(1) + "%";
                             })
                            .attr("text-anchor","middle")
                            .attr("pointer-events","none")
                            .style("font-weight", that.label_weight)
                            .style("font-size", that.label_size + "px")
                            .attr("fill", that.label_color)
                            .style("font-family", that.label_family)
                            .text(function (d,i) {
                                if(this.getBBox().width<(d.values[3].x - d.values[1].x) && this.getBBox().height < (d.values[2].y - d.values[0].y)) {
                                    return that.per_values[i].toFixed(1) + "%";
                                }
                                else {
                                    return "";
                                }
                            });
                    },that.transitions.duration());

                    that.chart_text.exit()
                         .remove();
                return this;
            },
            ticks : function () {
                if(PykCharts['boolean'](that.pointer_overflow_enable)) {
                    that.svgContainer.style("overflow","visible");
                }

                var w =[];
                that.ticks_text_width = [];
                    var tick_label = that.group.selectAll(".ticks_label")
                                        .data(that.coordinates);

                    tick_label.attr("class","ticks_label");

                    tick_label.enter()
                        .append("text")
                        .attr("x",0)
                        .attr("y",0);

                    var x,y;

                    tick_label.attr("transform",function (d) {
                        if (d.values.length === 4) {
                            x = ((d.values[3].x + d.values[2].x)/2 ) + 10;
                            y = ((d.values[0].y + d.values[2].y)/2) + 5;
                        } else {
                            x = (d.values[4].x) + 10;
                            y = (d.values[4].y) + 5;
                        }
                        return "translate(" + x + "," + y + ")";});

                    tick_label.text("");

                    setTimeout(function() {
                        tick_label.text(function (d,i) { return that.data[i].name; })
                            .text(function (d,i) {
                                w[i] = this.getBBox().height;
                                that.ticks_text_width.push(this.getBBox().width);
                                if (this.getBBox().height < (d.values[2].y - d.values[0].y)) {
                                    return that.data[i].name;
                                }
                                else {
                                    return "";
                                }
                            })
                            .attr("font-size", that.pointer_size + "px")
                            .attr("text-anchor","start")
                            .attr("fill", that.pointer_color)
                            .attr("pointer-events","none")
                            .attr("font-family", that.pointer_family)
                            .attr("font-weight",that.pointer_weight);

                    },that.transitions.duration());

                    tick_label.exit().remove();
                    var tick_line = that.group.selectAll(".funnel-ticks")
                        .data(that.coordinates);

                    tick_line.enter()
                        .append("line")
                        .attr("class", "funnel-ticks");

                    tick_line
                        .attr("x1", function (d,i) {
                           if (d.values.length === 4) {
                                return ((d.values[3].x + d.values[2].x)/2 );
                           } else {
                                return (d.values[4].x);
                           }

                        })
                        .attr("y1", function (d,i) {
                            if (d.values.length === 4) {
                                return ((d.values[0].y + d.values[2].y)/2);
                           } else {
                                return (d.values[4].y);
                           }
                        })
                        .attr("x2", function (d, i) {
                            if (d.values.length === 4) {
                                return ((d.values[3].x + d.values[2].x)/2 );
                           } else {
                                return (d.values[4].x);
                           }
                        })
                        .attr("y2", function (d, i) {
                            if (d.values.length === 4) {
                                return ((d.values[0].y + d.values[2].y)/2);
                           } else {
                                return (d.values[4].y);
                           }
                        })
                        .attr("stroke-width", that.pointer_thickness + "px")
                        .attr("stroke", that.pointer_color)

                        setTimeout(function(){
                            tick_line.attr("x2", function (d, i) {
                                if(( d.values[2].y - d.values[0].y) > w[i]) {
                                    if (d.values.length === 4) {
                                        return ((d.values[3].x + d.values[2].x)/2 ) + 5;
                                    } else {
                                        return ((d.values[4].x) +5);
                                    }
                                } else {
                                    if (d.values.length === 4) {
                                        return ((d.values[3].x + d.values[2].x)/2 );
                                    } else {
                                        return (d.values[4].x);
                                    }
                                }
                            });
                        },that.transitions.duration());

                    tick_line.exit().remove();

                return this;
            }
        };
        return optional;
    };
};

PykCharts.oneD.percentageColumn = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function () {
        var that = this;

        that = new PykCharts.oneD.processInputs(that, options, "percentageColumn");

        that.height = options.chart_height ? options.chart_height : that.width;
        that.percent_column_rect_width = options.percent_column_rect_width ? options.percent_column_rect_width : theme.oneDimensionalCharts.percent_column_rect_width;

        try {
            if(!_.isNumber(that.height)) {
                that.height = that.width;
                throw "chart_height"
            }
        }
        catch (err) {
            that.k.warningHandling(err,"1");
        }

        try {
            if(!_.isNumber(that.percent_column_rect_width)) {
                that.percent_column_rect_width = theme.oneDimensionalCharts.percent_column_rect_width;
                throw "percent_column_rect_width"
            }
        }
        catch (err) {
            that.k.warningHandling(err,"1");
        }
        if(that.stop) {
            return;
        }

        if(that.percent_column_rect_width > 100) {
            that.percent_column_rect_width = 100;
        }

        that.percent_column_rect_width = that.k.__proto__._radiusCalculation(that.percent_column_rect_width,"percentageColumn") * 2;

        if(that.mode === "default") {
           that.k.loading();
        }
        
        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(options.selector+" #chart-loader").remove();
                $(that.selector).css("height","auto")
                return;
            }            
            that.data = that.k.__proto__._groupBy("oned",data);
            that.compare_data = that.k.__proto__._groupBy("oned",data);
            $(options.selector+" #chart-loader").remove();
            $(that.selector).css("height","auto")
            that.clubdata_enable = that.data.length>that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.render();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };
    this.refresh = function () {
        that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("oned",data);
            that.clubdata_enable = that.data.length>that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.refresh_data = that.k.__proto__._groupBy("oned",data);
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.optionalFeatures()
                    .clubData()
                    .createChart()
                    .label()
                    .ticks();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh")
    };

    this.render = function () {
        var that = this;
        var l = $(".svgcontainer").length;
        that.container_id = "svgcontainer" + l;
        that.fillChart = new PykCharts.Configuration.fillChart(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.border = new PykCharts.Configuration.border(that);

        if(that.mode === "default") {
            that.k.title()
                    .backgroundColor(that)
                    .export(that,"#"+that.container_id,"percentageColumn")
                    .emptyDiv()
                    .subtitle();
        }
        if(that.mode === "infographics") {
            that.k.backgroundColor(that)
                .export(that,"#"+that.container_id,"percentageColumn")
                    .emptyDiv();

            that.new_data = that.data;
        }

        that.k.tooltip();

        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        if(that.mode === "default") {
            percent_column = that.optionalFeatures()
                            .clubData();
        }
        that.optionalFeatures().svgContainer()
            .createChart()
            .label()
            .ticks();
        if(that.mode === "default") {
            that.k.liveData(that)
                .createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();
        }
        
        var add_extra_width = 0;

        setTimeout(function () {
            if(that.ticks_text_width.length) {
                add_extra_width = _.max(that.ticks_text_width,function(d){
                        return d;
                    });
            }
            that.k.exportSVG(that,"#"+that.container_id,"percentageColumn",undefined,undefined,(add_extra_width+15))
        },that.transitions.duration());

        $(document).ready(function () { return that.k.resize(that.svgContainer); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer); });
    };
    this.optionalFeatures = function () {
        var optional = {
            createChart: function () {
                var arr = that.new_data.map(function (d) {
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
                that.new_data.forEach(function (d, i) {
                    this[i].percentValue= d.weight * 100 / sum;
                }, that.new_data);
               // that.new_data.sort(function (a,b) { return b.weight - a.weight; })
                that.chart_data = that.group.selectAll('.per-rect')
                    .data(that.new_data)

                that.chart_data.enter()
                    .append('rect')
                    .attr("class","per-rect")

                that.chart_data.attr('x', 0)
                    .attr('y', function (d, i) {
                        if (i === 0) {
                            return 0;
                        } else {
                            var sum = 0,
                                subset = that.new_data.slice(0,i);

                            subset.forEach(function(d, i){
                                sum += this[i].percentValue;
                            },subset);

                            return sum * that.height / 100;
                        }
                    })
                    .attr('width', that.percent_column_rect_width)
                    .attr('height', 0)
                    .attr("fill",function (d) {
                        return that.fillChart.selectColor(d);
                    })
                    .attr("fill-opacity",1)
                    .attr("data-fill-opacity",function () {
                        return $(this).attr("fill-opacity");
                    })
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-dasharray", that.border.style())
                    .on("mouseover", function (d,i) {
                        if(that.mode === "default") {
                            d.tooltip=d.tooltip||"<table class='PykCharts'><tr><th colspan='2' class='tooltip-heading'>"+d.name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.weight)+"<td class='tooltip-right-content'>("+d.percentValue.toFixed(1)+"%)</tr></table>"
                            if(PykCharts['boolean'](that.onhover_enable)) {
                                that.mouseEvent.highlight(options.selector+" "+".per-rect",this);
                            }
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(d.tooltip);
                        }
                    })
                    .on("mouseout", function (d) {
                        if(that.mode === "default") {
                            if(PykCharts['boolean'](that.onhover_enable)) {
                                that.mouseEvent.highlightHide(options.selector+" "+".per-rect");
                            }
                            that.mouseEvent.tooltipHide(d);
                        }
                    })
                    .on("mousemove", function (d,i) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr('height', function (d) {
                        return d.percentValue * that.height / 100;
                    });
                that.chart_data.exit()
                    .remove();

                return this;
            },
            svgContainer :function () {

                that.svgContainer = d3.select(options.selector)
                    .append('svg')
                    .attr("width",that.width)
                    .attr("height",that.height)
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height)
                    .attr("id",that.container_id)
                    .attr("class","svgcontainer PykCharts-oneD");

                    that.group = that.svgContainer.append("g")
                        .attr("id","funnel");

                return this;
            },
            label : function () {
                    that.chart_text = that.group.selectAll(".per-text")
                        .data(that.new_data);
                    var sum = 0;
                    that.chart_text.enter()
                        .append("text")
                        .attr("class","per-text");

                    that.chart_text.attr("class","per-text")
                        .attr("x", (that.percent_column_rect_width/2 ))
                        .attr("y",function (d,i) {
                                sum = sum + d.percentValue;
                                if (i===0) {
                                    return (0 + (sum * that.height / 100))/2+5;
                                } else {
                                    return (((sum - d.percentValue) * that.height/100)+(sum * that.height / 100))/2+5;
                                }
                            });
                    sum = 0;

                    that.chart_text.text("")
                        .attr("fill", that.label_color)
                        .style("font-size", that.label_size + "px")
                        .attr("text-anchor","middle")
                        .attr("pointer-events","none")
                        .style("font-weight", that.label_weight)
                        .style("font-family", that.label_family);

                        setTimeout(function(){
                            that.chart_text.text(function (d) {
                                return d.percentValue.toFixed(1)+"%";
                            })
                                .text(function (d) {
                                    if(this.getBBox().width < (that.width/4) && this.getBBox().height < (d.percentValue * that.height / 100)) {
                                        return d.percentValue.toFixed(1)+"%";
                                    }else {
                                        return "";
                                    }
                                });
                        }, that.transitions.duration());


                    that.chart_text.exit()
                        .remove();
                return this;
            },
            ticks : function () {
                if(PykCharts['boolean'](that.pointer_overflow_enable)) {
                    that.svgContainer.style("overflow","visible");
                }
                    var sum = 0, sum1 = 0;

                    var x, y, w = [];
                    sum = 0;
                    that.ticks_text_width = [];

                    var tick_line = that.group.selectAll(".per-ticks")
                        .data(that.new_data);

                    tick_line.enter()
                        .append("line")
                        .attr("class", "per-ticks");

                    var tick_label = that.group.selectAll(".ticks_label")
                                        .data(that.new_data);

                    tick_label.enter()
                        .append("text")
                        .attr("class", "ticks_label")

                    tick_label.attr("class", "ticks_label")
                        .attr("transform",function (d) {
                            sum = sum + d.percentValue
                            x = (that.percent_column_rect_width) + 10;
                            y = (((sum - d.percentValue) * that.height/100)+(sum * that.height / 100))/2 + 5;

                            return "translate(" + x + "," + y + ")";
                        });

                    tick_label.text(function (d) {
                            return "";
                        })
                        .attr("font-size", that.pointer_size)
                        .attr("text-anchor","start")
                        .attr("fill", that.pointer_color)
                        .attr("font-family", that.pointer_family)
                        .attr("font-weight",that.pointer_weight)
                        .attr("pointer-events","none");

                        setTimeout(function() {
                            tick_label.text(function (d) {
                                return d.name;
                            })
                            .text(function (d,i) {
                                w[i] = this.getBBox().height;
                                that.ticks_text_width[i] = this.getBBox().width;
                                if (this.getBBox().height < (d.percentValue * that.height / 100)) {
                                    return d.name;
                                }
                                else {
                                    return "";
                                }
                            });

                            sum = 0;
                            tick_line
                                .attr("x1", function (d,i) {
                                    return that.percent_column_rect_width;
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
                                     return (that.percent_column_rect_width);
                                })
                                .attr("y2", function (d,i) {
                                    sum1 = sum1 + d.percentValue;
                                    if (i===0){
                                        return (0 + (sum1 * that.height / 100))/2;
                                    }else {
                                        return (((sum1 - d.percentValue) * that.height/100)+(sum1 * that.height / 100))/2;
                                    }
                                })
                                .attr("stroke-width", that.pointer_thickness + "px")
                                .attr("stroke", that.pointer_color)
                                .attr("x2", function (d, i) {
                                    if((d.percentValue * that.height / 100) > w[i]) {
                                        return (that.percent_column_rect_width) + 5;
                                    } else {
                                        return (that.percent_column_rect_width) ;
                                    }
                                });
                        },that.transitions.duration());

                    tick_label.exit().remove();


                    tick_line.exit().remove();

                return this;
            },
            clubData : function () {

                if(PykCharts['boolean'](that.clubdata_enable)) {
                    var clubdata_content = [];
                    if(that.clubdata_always_include_data_points.length!== 0){
                        var l = that.clubdata_always_include_data_points.length;
                        for(i=0; i < l; i++){
                            clubdata_content[i] = that.clubdata_always_include_data_points[i];
                        }
                    }
                    var new_data1 = [];
                    for(i=0;i<clubdata_content.length;i++){
                        for(j=0;j<that.data.length;j++){
                            if(clubdata_content[i].toUpperCase() === that.data[j].name.toUpperCase()){
                                new_data1.push(that.data[j]);
                            }
                        }
                    }
                    that.data.sort(function (a,b) { return b.weight - a.weight; });
                    var k = 0;

                    while(new_data1.length<that.clubdata_maximum_nodes-1){
                        for(i=0;i<clubdata_content.length;i++){
                            if(that.data[k].name.toUpperCase() === clubdata_content[i].toUpperCase()){
                                k++;
                            }
                        }
                        new_data1.push(that.data[k]);
                        k++;
                    }
                    var sum_others = 0;
                    for(j=k; j < that.data.length; j++){
                        for(i=0; i<new_data1.length && j<that.data.length; i++){
                            if(that.data[j].name.toUpperCase() === new_data1[i].name.toUpperCase()){
                                sum_others +=0;
                                j++;
                                i = -1;
                            }
                        }
                        if(j < that.data.length){
                            sum_others += that.data[j].weight;
                        }
                    }
                    var sortfunc = function (a,b) { return b.weight - a.weight; };

                    while(new_data1.length > that.clubdata_maximum_nodes){
                        new_data1.sort(sortfunc);
                        var a=new_data1.pop();
                    }
                    var others_Slice = { "name":that.clubdata_text, "weight": sum_others, /*"color": that.clubData_color,*/ "tooltip": that.clubdata_tooltip };
                    new_data1.sort(function(a,b){
                        return b.weight - a.weight;
                    })
                    if(new_data1.length < that.clubdata_maximum_nodes){
                        new_data1.push(others_Slice);
                    }
                    that.new_data = new_data1;
                }
                else {
                    that.data.sort(function (a,b) { return b.weight - a.weight; });
                    that.new_data = that.data;
                }
                return this;
            }
        };
        return optional;
    };
};

PykCharts.oneD.percentageBar = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function () {
        var that = this;

        that = new PykCharts.oneD.processInputs(that, options, "percentageBar");

        that.height = options.chart_height ? options.chart_height : that.width/2;
        that.percent_row_rect_height = options.percent_row_rect_height ? options.percent_row_rect_height : theme.oneDimensionalCharts.percent_row_rect_height;

        try {
            if(!_.isNumber(that.height)) {
                that.height = that.width/2;
                throw "chart_height"
            }
        }
        catch (err) {
            that.k.warningHandling(err,"1");
        }

        try {
            if(!_.isNumber(that.percent_row_rect_height)) {
                that.percent_row_rect_height = theme.oneDimensionalCharts.percent_row_rect_height;
                throw "percent_row_rect_height";
            }
        }
        catch (err) {
            that.k.warningHandling(err,"1");
        }

        if(that.stop) {
            return;
        }

        if(that.percent_row_rect_height > 100) {
            that.percent_row_rect_height = 100;
        }

        that.percent_row_rect_height = that.k.__proto__._radiusCalculation(that.percent_row_rect_height,"percentageBar") * 2;

        if(that.mode === "default") {
           that.k.loading();
        }
        
        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(options.selector+" #chart-loader").remove();
                $(that.selector).css("height","auto")
                return;
            }

            that.data = that.k.__proto__._groupBy("oned",data);
            that.compare_data = that.k.__proto__._groupBy("oned",data);
            $(options.selector+" #chart-loader").remove();
            $(that.selector).css("height","auto")
            that.clubdata_enable = that.data.length>that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.render();
        }

        that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };
    this.refresh = function () {
        that.executeRefresh = function (data) {

            that.data = that.k.__proto__._groupBy("oned",data);
            that.clubdata_enable = that.data.length>that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.refresh_data = that.k.__proto__._groupBy("oned",data);
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.optionalFeatures()
                    .clubData()
                    .createChart()
                    .label()
                    .ticks();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
    };

    this.render = function () {
        var that = this;
        var l = $(".svgcontainer").length;
        that.container_id = "svgcontainer" + l;
        that.fillChart = new PykCharts.Configuration.fillChart(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.border = new PykCharts.Configuration.border(that);

        if(that.mode === "default") {

            that.k.title()
                    .backgroundColor(that)
                    .export(that,"#"+that.container_id,"percentageBar")
                    .emptyDiv()
                    .subtitle();
        }
        if(that.mode === "infographics") {
            that.k.backgroundColor(that)
            .export(that,"#"+that.container_id,"percentageBar").emptyDiv();
            that.new_data = that.data;
        }

        that.k.tooltip();

        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        if(that.mode === "default") {

            percent_bar = that.optionalFeatures()
                            .clubData();
        }
        that.optionalFeatures().svgContainer()
            .createChart()
            .label()
            .ticks();
        if(that.mode === "default") {
            that.k.liveData(that)
                .createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();
        }

        var add_extra_height = 0;

        setTimeout(function () {
            if(that.ticks_text_height) {
                add_extra_height = that.ticks_text_height + 10;
            }

            that.k.exportSVG(that,"#"+that.container_id,"percentageBar",undefined,undefined,0,add_extra_height);
        },that.transitions.duration());

        $(document).ready(function () { return that.k.resize(that.svgContainer); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer); });
    };
    this.optionalFeatures = function () {
        var optional = {
            createChart: function () {
                var arr = that.new_data.map(function (d) {
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
                that.new_data.forEach(function (d, i) {
                    this[i].percentValue= d.weight * 100 / sum;
                }, that.new_data);

               // that.new_data.sort(function (a,b) { return b.weight - a.weight; })
                that.chart_data = that.group.selectAll('.per-rect')
                    .data(that.new_data)

                that.chart_data.enter()
                    .append('rect')
                    .attr("class","per-rect")

                that.chart_data.attr('x', 0)
                    .attr('x', function (d, i) {
                        if (i === 0) {
                            return 0;
                        } else {
                            var sum = 0,
                                subset = that.new_data.slice(0,i);

                            subset.forEach(function(d, i){
                                sum += this[i].percentValue;
                            },subset);

                            return sum * that.width / 100;
                        }
                    })
                    .attr("width",0)
                    .attr('height', function (d) {
                        return that.percent_row_rect_height;
                    })
                    .attr("fill",function (d) {
                        return that.fillChart.selectColor(d);
                    })
                    .attr("fill-opacity",1)
                    .attr("data-fill-opacity",function () {
                        return $(this).attr("fill-opacity");
                    })
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-dasharray", that.border.style())
                    .on("mouseover", function (d,i) {
                        if(that.mode === "default") {
                            d.tooltip=d.tooltip||"<table class='PykCharts'><tr><th colspan='2' class='tooltip-heading'>"+d.name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.weight)+"<td class='tooltip-right-content'>("+d.percentValue.toFixed(1)+"%)</tr></table>"
                            if(PykCharts['boolean'](that.onhover_enable)) {
                                that.mouseEvent.highlight(options.selector+" "+".per-rect",this);
                            }
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(d.tooltip);
                        }
                    })
                    .on("mouseout", function (d) {
                        if(that.mode === "default") {
                            if(PykCharts['boolean'](that.onhover_enable)) {
                                that.mouseEvent.highlightHide(options.selector+" "+".per-rect");
                            }
                            that.mouseEvent.tooltipHide(d);
                        }
                    })
                    .on("mousemove", function (d,i) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr('width', function (d) {
                        return d.percentValue * that.width / 100;
                    });

                that.chart_data.exit()
                    .remove();

                return this;
            },
            svgContainer :function () {

                that.svgContainer = d3.select(options.selector)
                    .append('svg')
                    .attr("width",that.width)
                    .attr("height",that.height)
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height)
                    .attr("id",that.container_id)
                    .attr("class","svgcontainer PykCharts-oneD");

                    that.group = that.svgContainer.append("g")
                        .attr("id","percentageBar");

                return this;
            },
            label : function () {
                    that.chart_text = that.group.selectAll(".per-text")
                        .data(that.new_data);
                    var sum = 0;
                    that.chart_text.enter()
                        .append("text")
                        .attr("class","per-text");

                    that.chart_text.attr("class","per-text")
                        .attr("y", (that.percent_row_rect_height/2 ))
                        .attr("x",function (d,i) {
                                sum = sum + d.percentValue;
                                if (i===0) {
                                    return (0 + (sum * that.width / 100))/2;
                                } else {
                                    return (((sum - d.percentValue) * that.width/100)+(sum * that.width / 100))/2;
                                }
                            });
                    sum = 0;

                    that.chart_text.text("")
                        .attr("fill", that.label_color)
                        .style("font-size", that.label_size + "px")
                        .attr("text-anchor","middle")
                        .attr("pointer-events","none")
                        .style("font-weight", that.label_weight)
                        .style("font-family", that.label_family);

                        setTimeout(function(){
                            that.chart_text.text(function (d) { return d.percentValue.toFixed(1)+"%"; })
                                .text(function (d) {
                                    if(this.getBBox().width < (d.percentValue * that.width / 100) && this.getBBox().height < that.percent_row_rect_height) {
                                        return d.percentValue.toFixed(1)+"%"
                                    }else {
                                        return "";
                                    }
                                });
                        }, that.transitions.duration());


                    that.chart_text.exit()
                        .remove();
                return this;
            },
            ticks : function () {
                if(PykCharts['boolean'](that.pointer_overflow_enable)) {
                    that.svgContainer.style("overflow","visible");
                }
                    var sum = 0, sum1 = 0;

                    var x, y, w = [];
                    that.ticks_text_height;
                    sum = 0;

                    var tick_line = that.group.selectAll(".per-ticks")
                        .data(that.new_data);

                    tick_line.enter()
                        .append("line")
                        .attr("class", "per-ticks");

                    var tick_label = that.group.selectAll(".ticks_label")
                                        .data(that.new_data);

                    tick_label.enter()
                        .append("text")
                        .attr("class", "ticks_label")

                    tick_label.attr("class", "ticks_label")
                        .attr("transform",function (d) {
                            sum = sum + d.percentValue
                            y = (that.percent_row_rect_height) + 20;
                            x = (((sum - d.percentValue) * that.width/100)+(sum * that.width / 100))/2;

                            return "translate(" + x + "," + y + ")";
                        });

                    tick_label.text(function (d) {
                            return "";
                        })
                        .attr("font-size", that.pointer_size)
                        .attr("text-anchor","middle")
                        .attr("fill", that.pointer_color)
                        .attr("font-family", that.pointer_family)
                        .attr("font-weight",that.pointer_weight)
                        .attr("pointer-events","none");

                        setTimeout(function() {
                            tick_label.text(function (d) {
                                return d.name;
                            })
                            .text(function (d,i) {
                                w[i] = this.getBBox().width;
                                that.ticks_text_height = this.getBBox().height;
                                if (this.getBBox().width < (d.percentValue * that.width / 100)) {
                                    return d.name;
                                }
                                else {
                                    return "";
                                }
                            });

                            sum = 0;
                            tick_line
                                .attr("y1", function (d,i) {
                                    return that.percent_row_rect_height;
                                })
                                .attr("x1", function (d,i) {
                                    sum = sum + d.percentValue;
                                    if (i===0){
                                        return (0 + (sum * that.width / 100))/2;
                                    }else {
                                        return (((sum - d.percentValue) * that.width/100)+(sum * that.width / 100))/2;
                                    }
                                })
                                .attr("y2", function (d, i) {
                                     return (that.percent_row_rect_height);
                                })
                                .attr("x2", function (d,i) {
                                    sum1 = sum1 + d.percentValue;
                                    if (i===0){
                                        return (0 + (sum1 * that.width / 100))/2;
                                    }else {
                                        return (((sum1 - d.percentValue) * that.width/100)+(sum1 * that.width / 100))/2;
                                    }
                                })
                                .attr("stroke-width", that.pointer_thickness + "px")
                                .attr("stroke", that.pointer_color)
                                .attr("y2", function (d, i) {
                                    if((d.percentValue * that.width / 100) > w[i]) {
                                        return (that.percent_row_rect_height) + 5;
                                    } else {
                                        return (that.percent_row_rect_height) ;
                                    }
                                });
                        },that.transitions.duration());

                    tick_label.exit().remove();


                    tick_line.exit().remove();

                return this;
            },
            clubData : function () {

                if(PykCharts['boolean'](that.clubdata_enable)) {
                    var clubdata_content = [];
                    if(that.clubdata_always_include_data_points.length!== 0){
                        var l = that.clubdata_always_include_data_points.length;
                        for(i=0; i < l; i++){
                            clubdata_content[i] = that.clubdata_always_include_data_points[i];
                        }
                    }
                    var new_data1 = [];
                    for(i=0;i<clubdata_content.length;i++){
                        for(j=0;j<that.data.length;j++){
                            if(clubdata_content[i].toUpperCase() === that.data[j].name.toUpperCase()){
                                new_data1.push(that.data[j]);
                            }
                        }
                    }
                    that.data.sort(function (a,b) { return b.weight - a.weight; });
                    var k = 0;

                    while(new_data1.length<that.clubdata_maximum_nodes-1){
                        for(i=0;i<clubdata_content.length;i++){
                            if(that.data[k].name.toUpperCase() === clubdata_content[i].toUpperCase()){
                                k++;
                            }
                        }
                        new_data1.push(that.data[k]);
                        k++;
                    }
                    var sum_others = 0;
                    for(j=k; j < that.data.length; j++){
                        for(i=0; i<new_data1.length && j<that.data.length; i++){
                            if(that.data[j].name.toUpperCase() === new_data1[i].name.toUpperCase()){
                                sum_others +=0;
                                j++;
                                i = -1;
                            }
                        }
                        if(j < that.data.length){
                            sum_others += that.data[j].weight;
                        }
                    }
                    var sortfunc = function (a,b) { return b.weight - a.weight; };

                    while(new_data1.length > that.clubdata_maximum_nodes){
                        new_data1.sort(sortfunc);
                        var a=new_data1.pop();
                    }
                    var others_Slice = { "name":that.clubdata_text, "weight": sum_others,/* "color": that.clubdata_color,*/ "tooltip": that.clubdata_tooltip };
                    new_data1.sort(function(a,b){
                        return b.weight - a.weight;
                    })
                    if(new_data1.length < that.clubdata_maximum_nodes){
                        new_data1.push(others_Slice);
                    }
                    that.new_data = new_data1;
                }
                else {
                    that.data.sort(function (a,b) { return b.weight - a.weight; });
                    that.new_data = that.data;
                }
                return this;
            }
        };
        return optional;
    };
};

PykCharts.oneD.pie = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function() {
        that = new PykCharts.oneD.processInputs(that, options, "pie");
        if(options.chart_height) {
            that.height = options.chart_height;
            that.calculation = undefined;
        }
        else {
            that.height = that.width;
            that.calculation = "pie";
        }
        that.radiusPercent = options.pie_radius_percent ? options.pie_radius_percent : theme.oneDimensionalCharts.pie_radius_percent;

        try {
            if(!_.isNumber(that.height)) {
                that.height = that.width;
                throw "chart_height"
            }
        }
        catch (err) {
            that.k.warningHandling(err,"1");
        }

        try {
            if(!_.isNumber(that.radiusPercent)) {
                that.radiusPercent = theme.oneDimensionalCharts.pie_radius_percent;
                throw "pie_radius_percent"
            }
        }
        catch (err) {
            that.k.warningHandling(err,"1");
        }

        if(that.stop) {
            return;
        }

        that.innerRadiusPercent = 0;
        that.height_translate = that.height/2;

        if(that.radiusPercent > 100) {
            that.radiusPercent = 100;
        }

        if(that.mode === "default") {
           that.k.loading();
        }

        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(options.selector+" #chart-loader").remove();
                $(that.selector).css("height","auto")
                return;
            }

            that.data = that.k.__proto__._groupBy("oned",data);
            that.compare_data = that.k.__proto__._groupBy("oned",data);
            $(options.selector+" #chart-loader").remove();
            $(that.selector).css("height","auto")
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"pie");
            that.clubdata_enable = that.data.length > that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            pieFunctions.render();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeData");

    };
};

PykCharts.oneD.donut = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function() {

        that = new PykCharts.oneD.processInputs(that, options, "pie");
        if(options.chart_height) {
            that.height = options.chart_height;
            that.calculation = undefined;
        }
        else {
            that.height = that.width;
            that.calculation = "pie";
        }

        that.radiusPercent = options.donut_radius_percent  ? options.donut_radius_percent : theme.oneDimensionalCharts.donut_radius_percent;
        that.innerRadiusPercent = options.donut_inner_radius_percent  ? options.donut_inner_radius_percent : theme.oneDimensionalCharts.donut_inner_radius_percent;

        try {
            if(!_.isNumber(that.height)) {
                that.height = that.width;
                throw "chart_height"
            }
        }
        catch (err) {
            that.k.warningHandling(err,"1");
        }

        try {
            if(!_.isNumber(that.radiusPercent)) {
                that.radiusPercent = theme.oneDimensionalCharts.donut_radius_percent;
                throw "donut_radius_percent"
            }
        }
        catch (err) {
            that.k.warningHandling(err,"1");
        }

        try {
            if(!_.isNumber(that.innerRadiusPercent)) {
                that.innerRadiusPercent = theme.oneDimensionalCharts.donut_inner_radius_percent;
                throw "donut_inner_radius_percent"
            }
        }
        catch (err) {
            that.k.warningHandling(err,"1");
        }


        if(that.stop) {
            return;
        }

        if(that.radiusPercent > 100) {
            that.radiusPercent = 100;
        }

        if(that.innerRadiusPercent > 100) {
            that.innerRadiusPercent = 100;
        }

        try {
            if(that.innerRadiusPercent >= that.radiusPercent) {
                that.innerRadiusPercent = theme.oneDimensionalCharts.donut_inner_radius_percent;
                throw "donut_inner_radius_percent";
            }
        }
        catch(err) {
            that.k.warningHandling(err,"6");
        }

        if(that.stop) {
            return;
        }
        if(that.mode === "default") {
           that.k.loading();
        }
        that.height_translate = that.height/2;
        that.show_total_at_center = options.donut_show_total_at_center ? options.donut_show_total_at_center.toLowerCase() : theme.oneDimensionalCharts.donut_show_total_at_center;
        that.show_total_at_center_size = "donut_show_total_at_center_size" in options ? options.donut_show_total_at_center_size : theme.oneDimensionalCharts.donut_show_total_at_center_size;
        that.show_total_at_center_color = options.donut_show_total_at_center_color ? options.donut_show_total_at_center_color : theme.oneDimensionalCharts.donut_show_total_at_center_color;
        that.show_total_at_center_weight = options.donut_show_total_at_center_weight ? options.donut_show_total_at_center_weight : theme.oneDimensionalCharts.donut_show_total_at_center_weight;
        that.show_total_at_center_family = options.donut_show_total_at_center_family ? options.donut_show_total_at_center_family : theme.oneDimensionalCharts.donut_show_total_at_center_family;

        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(options.selector+" #chart-loader").remove();
                $(that.selector).css("height","auto")
                return;
            }

            that.data = that.k.__proto__._groupBy("oned",data);
            that.compare_data = that.k.__proto__._groupBy("oned",data);
            $(options.selector+" #chart-loader").remove();
            $(that.selector).css("height","auto")
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"donut");
            that.clubdata_enable = that.data.length > that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            pieFunctions.render();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };
};

PykCharts.oneD.electionPie = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function() {

        that = new PykCharts.oneD.processInputs(that, options, "pie");
        that.x = true;
        if(options.chart_height || options.chart_height == undefined) {
            try {
                if (options.chart_height == undefined) {                    
                    options.chart_height = theme.stylesheet.chart_height;
                }
                else if (!_.isNumber(options.chart_height)) {
                    that.x = false;
                    throw "chart_height"
                }
            }
            catch (err) {
                that.k.warningHandling(err,"1");
            }
        }
        if(that.x) {
            that.height = options.chart_height;
            that.calculation = undefined;
            that.height_translate = that.height/2;
        }
        else {
            that.height = that.width/2;
            that.calculation = "pie";
            that.height_translate = that.height;
        }

        that.radiusPercent = options.pie_radius_percent ? options.pie_radius_percent : theme.oneDimensionalCharts.pie_radius_percent;

        try {
            if(!_.isNumber(that.radiusPercent)) {
                that.radiusPercent = theme.oneDimensionalCharts.pie_radius_percent;
                throw "pie_radius_percent"
            }
        }

        catch (err) {
            that.k.warningHandling(err,"1");
        }

        if(that.stop) {
            return;
        }

        if(that.radiusPercent > 100) {
            that.radiusPercent = 100;
        }
        if(that.mode === "default") {
           that.k.loading();
        }
        that.innerRadiusPercent = 0;

        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(options.selector+" #chart-loader").remove();
                $(that.selector).css("height","auto")
                return;
            }

            that.data = that.k.__proto__._groupBy("oned",data);
            that.compare_data = that.k.__proto__._groupBy("oned",data);
            $(options.selector+" #chart-loader").remove();
            $(that.selector).css("height","auto")
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"election pie");
            that.clubdata_enable = that.data.length > that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            pieFunctions.render();

        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };
};

PykCharts.oneD.electionDonut = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function() {
        that = new PykCharts.oneD.processInputs(that, options, "pie");

        that.x = true;
        if(options.chart_height || options.chart_height == undefined) {
            try {
                if (options.chart_height == undefined) {                    
                    options.chart_height = theme.stylesheet.chart_height;
                }
                else if (!_.isNumber(options.chart_height)) {
                    that.x = false;
                    throw "chart_height"
                }
            }
            catch (err) {
                that.k.warningHandling(err);
            }
        }

        if(that.x) {
            that.height = options.chart_height;
            that.calculation = undefined;
            that.height_translate = that.height/2;
        }

        else {
            that.height = that.width/2;
            that.calculation = "pie";
            that.height_translate = that.height;
        }

        that.radiusPercent = options.donut_radius_percent ? options.donut_radius_percent : theme.oneDimensionalCharts.donut_radius_percent;
        that.innerRadiusPercent = options.donut_inner_radius_percent  && options.donut_inner_radius_percent ? options.donut_inner_radius_percent : theme.oneDimensionalCharts.donut_inner_radius_percent;

        try {
            if(!_.isNumber(that.radiusPercent)) {
                that.radiusPercent = theme.oneDimensionalCharts.donut_radius_percent;
                throw "donut_radius_percent"
            }
        }
        catch (err) {
            that.k.warningHandling(err,"3");
        }

        try {
            if(!_.isNumber(that.innerRadiusPercent)) {
                that.innerRadiusPercent = theme.oneDimensionalCharts.donut_inner_radius_percent;
                throw "donut_inner_radius_percent"
            }
        }
        catch (err) {
            that.k.warningHandling(err,"3");
        }

        if(that.stop) {
            return;
        }

        if(that.radiusPercent > 100) {
            that.radiusPercent = 100;
        }

        if(that.innerRadiusPercent > 100) {
            that.innerRadiusPercent = 100;
        }

        try {
            if(that.innerRadiusPercent >= that.radiusPercent) {
                that.innerRadiusPercent = theme.oneDimensionalCharts.donut_inner_radius_percent;
                throw "donut_inner_radius_percent";
            }
        }
        catch(err) {

            that.k.warningHandling(err,"6");
        }

        if(that.stop) {
            return;
        }
        if(that.mode === "default") {
           that.k.loading();
        }
        that.show_total_at_center = options.donut_show_total_at_center ? options.donut_show_total_at_center.toLowerCase() : theme.oneDimensionalCharts.donut_show_total_at_center;
        that.show_total_at_center_size = "donut_show_total_at_center_size" in options ? options.donut_show_total_at_center_size : theme.oneDimensionalCharts.donut_show_total_at_center_size;
        that.show_total_at_center_color = options.donut_show_total_at_center_color ? options.donut_show_total_at_center_color : theme.oneDimensionalCharts.donut_show_total_at_center_color;
        that.show_total_at_center_weight = options.donut_show_total_at_center_weight ? options.donut_show_total_at_center_weight : theme.oneDimensionalCharts.donut_show_total_at_center_weight;
        that.show_total_at_center_family = options.donut_show_total_at_center_family ? options.donut_show_total_at_center_family : theme.oneDimensionalCharts.donut_show_total_at_center_family;

        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(options.selector+" #chart-loader").remove();
                $(that.selector).css("height","auto")
                return;
            }

            that.data = that.k.__proto__._groupBy("oned",data);
            that.compare_data = that.k.__proto__._groupBy("oned",data);
            $(options.selector+" #chart-loader").remove();
            $(that.selector).css("height","auto")
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"election donut");
            that.clubdata_enable = that.data.length> that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            pieFunctions.render();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };
};

PykCharts.oneD.pieFunctions = function (options,chartObject,type) {
    var that = chartObject;
       that.refresh = function () {
        that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("oned",data);
            that.clubdata_enable = that.data.length>that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.refresh_data = that.k.__proto__._groupBy("oned",data);
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.new_data = that.optionalFeatures().clubData();
            that.optionalFeatures()
                    .createChart()
                    .label()
                    .ticks()
                    .centerLabel();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
    };

    this.render = function() {

        that.count = 1;
        var l = $(".svgcontainer").length;
        that.container_id = "svgcontainer" + l;
        that.fillChart = new PykCharts.Configuration.fillChart(that);
        that.border = new PykCharts.Configuration.border(that);
        that.transitions = new PykCharts.Configuration.transition(that);

        if(that.mode.toLowerCase() == "default") {

            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+that.container_id,type)
                .emptyDiv()
                .subtitle();

            that.optionalFeatures().svgContainer();
            that.new_data = that.optionalFeatures().clubData();

            that.k.createFooter()
                    .lastUpdatedAt()
                    .credits()
                    .dataSource()
                    .tooltip();


            that.optionalFeatures()
                    .set_start_end_angle()
                    .createChart()
                    .label()
                    .ticks()
                    .centerLabel();

            that.k.liveData(that);

        } else if(that.mode.toLowerCase() == "infographics") {
            that.new_data = that.data;
            that.k.backgroundColor(that)
                .export(that,"#"+that.container_id,type)
                    .emptyDiv();
            that.optionalFeatures().svgContainer()
                    .set_start_end_angle()
                    .createChart()
                    .label()
                    .ticks()
                    .centerLabel();

            that.k.tooltip();
        }

        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

        var add_extra_width = 0;
        var add_extra_height = 0;
        setTimeout(function () {
            if(that.ticks_text_width.length) {
                add_extra_width = _.max(that.ticks_text_width,function(d) {
                        return d;
                    });
                add_extra_height = that.ticks_text_height;
            }
            that.k.exportSVG(that,"#"+that.container_id,type,undefined,undefined,(add_extra_width+20),(add_extra_height+20))
        },that.transitions.duration());

        $(document).ready(function () { return that.k.resize(that.svgContainer); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer); });
    };

    that.optionalFeatures = function () {
        var optional = {
            svgContainer :function () {
                that.svgContainer = d3.select(that.selector)
                    .append('svg')
                    .attr("width",that.width)
                    .attr("height",function () {
                        return that.height;
                    })
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height)
                    .attr("id",that.container_id)
                    .attr("class","svgcontainer PykCharts-oneD");
                that.group = that.svgContainer.append("g")
                    .attr("transform","translate("+(that.width/2)+","+that.height_translate+")")
                    .attr("id","pieGroup");

                return this;
            },
            createChart : function () {
                $(that.selector +" #pieGroup").empty();

                if(type.toLowerCase() == "pie" || type.toLowerCase() == "donut") {
                    that.new_data.sort(function (a,b) { return a.weight - b.weight;});
                    var temp = that.new_data.pop();
                    that.new_data.unshift(temp);
                    if(PykCharts['boolean'](that.clubdata_enable)) {
                        var index,data;
                        for(var i = 0;i<that.new_data.length;i++) {
                            if(that.new_data[i].name === that.clubdata_text) {
                                index = i;
                                data = that.new_data[i];
                                break;
                            }
                        }

                        that.new_data.splice(index,1);
                        if(i===0) {
                            var temp = that.new_data.pop();
                            that.new_data.splice(0,0,temp);
                        }
                        that.new_data.splice(1,0,data);
                    }
                } else if(type.toLowerCase() == "election pie" || type.toLowerCase() == "election donut") {
                    that.new_data.sort(function (a,b) { return b.weight - a.weight;});
                    if(PykCharts['boolean'](that.clubdata_enable)) {
                        var index,data;
                        for(var i = 0;i<that.new_data.length;i++) {
                            if(that.new_data[i].name === that.clubdata_text) {
                                index = i;
                                data = that.new_data[i];
                                break;
                            }
                        }
                        that.new_data.splice(index,1);
                        that.new_data.push(data);
                    }
                }
                that.sum = _.reduce(that.data,function (start,num) { return start+num.weight; },0);
                that.inner_radius = that.k.__proto__._radiusCalculation(that.innerRadiusPercent,that.calculation);
                that.outer_radius = that.k.__proto__._radiusCalculation(that.radiusPercent,that.calculation);

                that.arc = d3.svg.arc()
                    .innerRadius(that.inner_radius)
                    .outerRadius(that.outer_radius);

                that.pie = d3.layout.pie()
                    .value(function (d) { return d.weight; })
                    .sort(null)
                    .startAngle(that.start_angle)
                    .endAngle(that.end_angle);

                that.chart_data = that.group.selectAll("path").
                                        data(that.pie(that.new_data));

                that.chart_data.enter()
                    .append("path");

                that.chart_data
                    .attr("class","pie");

                that.chart_data
                    .attr("fill",function (d) {
                            return that.fillChart.selectColor(d.data);
                    })
                    .attr("fill-opacity",1)
                    .attr("data-fill-opacity",function () {
                        return $(this).attr("fill-opacity");
                    })
                    .on('mouseover',function (d) {
                        if(that.mode === "default") {
                            d.data.tooltip = d.data.tooltip || "<table class='PykCharts'><tr><th colspan='3' class='tooltip-heading'>"+d.data.name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.data.weight)+"<td class='tooltip-right-content'>("+((d.data.weight*100)/that.sum).toFixed(1)+"%) </tr></table>";
                            if(PykCharts['boolean'](that.onhover_enable)) {
                                that.mouseEvent.highlight(options.selector +" "+".pie", this);
                            }
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(d.data.tooltip);
                        }
                    })
                    .on('mouseout',function (d) {
                        if(that.mode === "default") {
                            if(PykCharts['boolean'](that.onhover_enable)) {
                                that.mouseEvent.highlightHide(options.selector +" "+".pie");
                            }
                            that.mouseEvent.tooltipHide(d);
                        }
                    })
                    .on('mousemove', function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    })
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-dasharray", that.border.style());

                that.chart_data.transition()
                    .delay(function(d, i) {
                        if(that.transition_duration && that.mode == "default") {
                            return (i * that.transition_duration * 1000)/that.new_data.length;
                        } else return 0;
                    })
                    .duration(that.transitions.duration()/that.new_data.length)
                    .attrTween("d",function(d) {
                        var i = d3.interpolate(d.startAngle, d.endAngle);
                        return function(t) {
                            d.endAngle = i(t);
                            return that.arc(d);
                        }
                    });

                that.chart_data.exit().remove();
                return this;
            },
            label : function () {

                    that.chart_text = that.group.selectAll("text")
                                       .data(that.pie(that.new_data));

                    that.chart_text.enter()
                        .append("text")
                        .attr("class","pie-label")
                        .attr("transform",function (d) { return "translate("+that.arc.centroid(d)+")"; });

                    that.chart_text.attr("transform",function (d) { return "translate("+that.arc.centroid(d)+")"; });

                    that.chart_text.text("")
                        .attr("fill", "red");

                    setTimeout(function () {
                        that.chart_text.text(function (d) { return that.k.appendUnits(d.data.weight); })
                            .attr("text-anchor","middle")
                            .attr("pointer-events","none")
                            .style("font-weight", that.label_weight)
                            .style("font-size", that.label_size + "px")
                            .text(function (d,i) {
                                if(type.toLowerCase() === "pie" || type.toLowerCase() === "election pie") {
                                    
                                    
                                    if(this.getBBox().width<((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9))) {
                                        
                                        
                                        return ((d.data.weight*100)/that.sum).toFixed(1)+"%";
                                    }
                                    else {
                                        return "";
                                    }
                                } else {
                                    if((this.getBBox().width < (Math.abs(d.endAngle - d.startAngle)*that.outer_radius*0.9))  && (this.getBBox().height < (((that.outer_radius-that.inner_radius)*0.75)))) {
                                        return ((d.data.weight*100)/that.sum).toFixed(1)+"%";
                                    }
                                    else {
                                        return "";
                                    }
                                }
                            })
                            .attr("dy",5)
                            .style("font-weight", that.label_weight)
                            .style("font-size", that.label_size + "px")
                            .attr("fill", that.label_color)
                            .style("font-family", that.label_family);
                        that.chart_text.exit().remove();
                    },that.transitions.duration());

                return this;
            },
            clubData: function () {
                if(PykCharts['boolean'](that.clubdata_enable)) {
                    that.displayData = [];
                    that.sorted_weight = _.map(that.data,function(num){ return num.weight; });
                    that.sorted_weight.sort(function(a,b){ return b-a; });
                    that.checkDuplicate = [];
                    var others_Slice = {"name":that.clubdata_text,"color":that.clubData_color,"tooltip":that.clubData_tooltipText,"highlight":false};
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
                        var result = _.reject(that.sorted_weight,function(num)
                            {
                                return num == that.data[index].weight;
                            });
                        return result;
                    } ;
                    var k = 0;

                    if(that.clubdata_always_include_data_points.length!== 0) {
                        for (var l=0;l<that.clubdata_always_include_data_points.length;l++)
                        {

                            index = that.getIndexByName(that.clubdata_always_include_data_points[l]);
                            if(index!= undefined) {
                                that.displayData.push(that.data[index]);
                                that.sorted_weight = reject (index);
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
                    var count = that.clubdata_maximum_nodes-that.displayData.length;

                    var sum_others = d3.sum(that.sorted_weight,function (d,i) {
                            if(i>=count-1)
                                return d;
                        });

                    others_Slice.weight = sum_others;
                    if(count>0)
                    {
                        that.displayData.push(others_Slice);
                        for (i=0;i<count-1;i++) {
                            index = that.getIndexByWeight(that.sorted_weight[i]);
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
                if(PykCharts['boolean'](that.pointer_overflow_enable)) {
                    that.svgContainer.style("overflow","visible");
                }
                var w = [];
                that.ticks_text_width = [];
                    var tick_label = that.group.selectAll(".ticks_label")
                                    .data(that.pie(that.new_data));

                    tick_label.attr("class","ticks_label");

                    tick_label.enter()
                        .append("text")
                        .attr("x",0)
                        .attr("y",0);

                    var x,y;
                    tick_label.attr("transform",function (d) {
                        if (d.endAngle - d.startAngle < 0.2) {
                             x = (that.outer_radius +30 ) * (1) * Math.cos((d.startAngle + d.endAngle - Math.PI)/2);
                             y = (that.outer_radius/1+20) * (1) * Math.sin((d.startAngle + d.endAngle -  Math.PI)/2);
                        } else {
                             x = (that.outer_radius +22 ) * (1) * Math.cos((d.startAngle + d.endAngle - Math.PI)/2);
                             y = (that.outer_radius/1+24) * (1) * Math.sin((d.startAngle + d.endAngle -  Math.PI)/2);
                        }
                        return "translate(" + x + "," + y + ")";});

                    tick_label.text("")

                    setTimeout(function() {
                        tick_label.text(function(d) { return d.data.name; })
                            .text(function(d,i) {
                                that.ticks_text_width[i] = this.getBBox().width;
                                that.ticks_text_height = this.getBBox().height;
                                return d.data.name; })
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
                                } else if(type ==="election pie" || type === "election donut" && rads < -1) {
                                    return "end";
                                } else if(rads<0) {
                                    return "middle";
                                } 
                            })
                            .attr("dy",5)
                            .attr("pointer-events","none")
                            .style("fill",that.pointer_color)
                            .style("font-size",that.pointer_size + "px")
                            .style("font-weight",that.pointer_weight)
                            .style("font-family", that.pointer_family);

                        tick_label.exit().remove();
                    },that.transitions.duration());


                    var tick_line = that.group.selectAll("line")
                        .data(that.pie(that.new_data));

                    tick_line.enter()
                        .append("line")
                        .attr("class", "ticks");

                    tick_line.attr("x1", function (d,i) {
                        return (that.outer_radius) * (1)* Math.cos((d.startAngle + d.endAngle)/2);
                        })
                        .attr("y1", function (d,i) {
                            return (that.outer_radius) * (1) *Math.sin((d.endAngle + d.startAngle )/2);
                        })
                        .attr("x2", function (d,i) {
                            return (that.outer_radius) * (1)* Math.cos((d.startAngle + d.endAngle)/2);
                        })
                        .attr("y2", function (d,i) {
                            return (that.outer_radius) * (1) *Math.sin((d.endAngle + d.startAngle )/2);
                        })

                    setTimeout(function () {
                        tick_line.attr("x2", function (d, i) {
                                return (that.outer_radius/1+12)* (1) * Math.cos((d.startAngle + d.endAngle)/2);
                            })
                            .attr("y2", function (d, i) {
                                return (that.outer_radius/1+12)* (1) * Math.sin((d.startAngle + d.endAngle)/2);
                            })
                            .attr("transform","rotate(-90)")
                            .attr("stroke-width", that.pointer_thickness + "px")
                            .attr("stroke",that.pointer_color);
                        tick_line.exit().remove();
                    },that.transitions.duration());
                return this;
            },
            centerLabel: function () {
                if(PykCharts['boolean'](that.show_total_at_center) && (type == "donut" || type == "election donut")) {

                    var h;
                    var label = that.group.selectAll(options.selector +" "+".centerLabel")
                                    .data([that.sum]);

                    label.enter()
                        .append("text");

                    label.attr("class","centerLabel")
                        .text("")
                    setTimeout(function () {
                        label.text( function(d) {
                                return that.k.appendUnits(that.sum);
                            })
                            .text( function(d) {
                                h = this.getBBox().height;
                                return that.k.appendUnits(that.sum);
                            })
                            .attr("pointer-events","none")
                            .attr("text-anchor","middle")
                            .attr("y",function () {
                                return (type == "donut") ? h/2 : (-0.25*that.inner_radius);
                            })
                            .style("font-family",that.show_total_at_center_family)
                            .attr("fill",that.show_total_at_center_color)
                            .style("font-weight", that.show_total_at_center_weight)
                            .style("font-size", that.show_total_at_center_size + "px");

                    },that.transitions.duration());

                    label.exit().remove();
                }
                return this;
            },
            set_start_end_angle: function () {
                that.startAngle, that.endAngle;
                if(type == "pie" || type == "donut") {
                    that.start_angle = (0 * (Math.PI/180));
                    that.end_angle = (360 * (Math.PI/180));
                } else if(type == "election pie" || type == "election donut") {
                    that.start_angle = (-90 * (Math.PI/180));
                    that.end_angle = (90 * (Math.PI/180));
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
        that.height = options.chart_height ? options.chart_height : that.width;

        try {
            if(!_.isNumber(that.height)) {
                that.height = that.width;
                throw "chart_height"
            }
        }
        catch (err) {
            that.k.warningHandling(err,"1");
        }

        if(that.stop) {
            return;
        }

        if(that.mode === "default") {
           that.k.loading();
        }

        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(options.selector+" #chart-loader").remove();
                $(that.selector).css("height","auto")
                return;
            }

			that.data = that.k.__proto__._groupBy("oned",data);
            that.compare_data = that.k.__proto__._groupBy("oned",data);
            $(options.selector+" #chart-loader").remove();
            $(that.selector).css("height","auto")
			that.clubdata_enable = that.data.length > that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.render();
		};

        that.k.dataSourceFormatIdentification(options.data,that,"executeData");
	};

    this.refresh = function () {
        that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("oned",data);
            that.clubdata_enable = that.data.length>that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.refresh_data = that.k.__proto__._groupBy("oned",data);
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.new_data = that.optionalFeatures().clubData();
            that.optionalFeatures()
                    .createChart()
                    .label()
                    .ticks();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh")
    };

	this.render = function () {
        var l = $(".svgcontainer").length;
        that.container_id = "svgcontainer" + l;
        that.fillChart = new PykCharts.Configuration.fillChart(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.border = new PykCharts.Configuration.border(that);

        if (that.mode === "default") {
            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+that.container_id,"pyramid")
                .emptyDiv()
                .subtitle();
            that.new_data = that.optionalFeatures().clubData();
            that.optionalFeatures().svgContainer()
                .createChart()
                .label()
                .ticks();

            that.k.createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource()
                .tooltip()
                .liveData(that);

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

        } else if (that.mode === "infographics") {
            that.new_data = that.data;
            that.k.backgroundColor(that)
                .export(that,"#"+that.container_id,"pyramid")
                .emptyDiv();
            that.optionalFeatures().svgContainer()
                .createChart()
                .label()
                .ticks();

            that.k.tooltip();
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        }

        var add_extra_width = 0;
        setTimeout(function () {
            if(that.ticks_text_width.length) { 
                add_extra_width = _.max(that.ticks_text_width,function(d){
                        return d;
                    });
            }
            that.k.exportSVG(that,"#"+that.container_id,"pyramid",undefined,undefined,add_extra_width)
        },that.transitions.duration());
        
        $(document).ready(function () { return that.k.resize(that.svgContainer); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer); });
	};

	this.percentageValues = function (data){
        that.sum = d3.sum(data, function (d){
            return d.weight;
        });
        var percentValues = data.map(function (d){
            return d.weight/that.sum*100;
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

                that.svgContainer = d3.select(options.selector)
                    .append('svg')
                    .attr("width", that.width) //+200 removed
                    .attr("height",that.height)
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height)
                    .attr("id",that.container_id)
                    .attr("class","svgcontainer PykCharts-oneD");

                that.group = that.svgContainer.append("g")
                    .attr("id","pyrgrp");

                return this;
            },
        	createChart : function () {

        		that.pyramid = that.pyramidLayout()
                    .data(that.new_data)
                    .size([that.width,that.height]);
		        that.coordinates = that.pyramid.coordinates();
                that.coordinates[0].values[1] = that.coordinates[that.coordinates.length-1].values[1];
                that.coordinates[0].values[2] = that.coordinates[that.coordinates.length-1].values[2];
                var k = that.new_data.length-1,p = that.new_data.length-1,tooltipArray = [];
                for(i=0;i<that.new_data.length;i++){
                    if(i==0) {
                        tooltipArray[i] = that.new_data[i].tooltip || "<table class='PykCharts'><tr><th colspan='3'  class='tooltip-heading'>"+that.new_data[i].name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(that.new_data[i].weight)+"<td class='tooltip-right-content'>("+((that.new_data[i].weight*100)/that.sum).toFixed(1)+"%) </tr></table>";
                    } else {
                        tooltipArray[i] = that.new_data[k].tooltip || "<table class='PykCharts'><tr><th colspan='3'  class='tooltip-heading'>"+that.new_data[k].name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(that.new_data[k].weight)+"<td class='tooltip-right-content'>("+((that.new_data[k].weight*100)/that.sum).toFixed(1)+"%) </tr></table>";
                        k--;
                    }
                }
		        var line = d3.svg.line()
                    .interpolate('linear-closed')
                    .x(function(d,i) { return d.x; })
                    .y(function(d,i) { return d.y; });

                var a = [{x:0,y:that.height},{x:that.width,y:that.height},{x:0,y:that.height},{x:that.width,y:that.height},{x:0,y:that.height},{x:that.width,y:that.height}]
                var k =that.new_data.length;

                that.chart_data =that.group.selectAll('.pyr-path')
                    .data(that.coordinates)
                that.chart_data.enter()
                    .append('path')

                that.chart_data.attr("class","pyr-path")
                    .attr('d',function(d) {return line(a);})
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-dasharray", that.border.style())
                   	.attr("fill",function (d,i) {
                        if(i===0) {
                            b = that.new_data[i];
                        }
                        else {
                            k--;
                            b = that.new_data[k];
                        }
                        return that.fillChart.selectColor(b);
                    })
                    .attr("fill-opacity",1)
                    .attr("data-fill-opacity",function () {
                        return $(this).attr("fill-opacity");
                    })
        			.on("mouseover", function (d,i) {
                        if(that.mode === "default") {
                            if(PykCharts['boolean'](that.onhover_enable)) {
                                that.mouseEvent.highlight(options.selector +" "+".pyr-path",this);
                            }
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(tooltipArray[i]);
                        }
        			})
        			.on("mouseout", function (d) {
                        if(that.mode === "default") {
                            if(PykCharts['boolean'](that.onhover_enable)) {
                                that.mouseEvent.highlightHide(options.selector +" "+".pyr-path")
                			}
                            that.mouseEvent.tooltipHide(d);
                        }
        			})
        			.on("mousemove", function (d,i) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                        }
        			})
                    .transition()
                    .duration(that.transitions.duration())
                    .attr('d',function (d){ return line(d.values); });

                that.chart_data.exit().remove();

		        return this;
        	},
            label: function () {
                    var j = that.new_data.length;
                    var p = that.new_data.length;
                    that.chart_text = that.group.selectAll("text")
                        .data(that.coordinates)

                    that.chart_text.enter()
                        .append("text")

                    that.chart_text.attr("y",function (d,i) {
                            if(d.values.length === 4) {
                                return (((d.values[0].y-d.values[1].y)/2)+d.values[1].y) +2;
                            } else {
                                return (d.values[0].y + that.coordinates[that.coordinates.length-1].values[1].y)/2 + 10;
                            }
                        })
                        .attr("x", function (d,i) { return that.width/2;})
                        .text("")
                        .attr("text-anchor","middle")
                        .attr("pointer-events","none")
                        .style("font-weight", that.label_weight)
                        .style("font-size", that.label_size + "px")
                        .attr("fill", that.label_color)
                        .style("font-family", that.label_family);


                    setTimeout(function () {
                        that.chart_text.text(function (d,i) {
                                if(i===0) {
                                    return ((that.new_data[i].weight*100)/that.sum).toFixed(1)+"%";

                                }
                                else {
                                    j--;
                                     return ((that.new_data[j].weight*100)/that.sum).toFixed(1)+"%";
                                }
                             })
                            .text(function (d,i) {
                                if(this.getBBox().width < (d.values[2].x - d.values[1].x) && this.getBBox().height < Math.abs(d.values[1].y - d.values[0].y)) {
                                    if(i===0) {
                                        return ((that.new_data[i].weight*100)/that.sum).toFixed(1)+"%";

                                    }else {
                                        p--;
                                        return ((that.new_data[p].weight*100)/that.sum).toFixed(1)+"%";

                                    }
                                }
                                else {
                                    return "";
                                }
                            });
                    },that.transitions.duration());

                    that.chart_text.exit().remove();

                return this;
            },
            ticks : function () {
                if(PykCharts['boolean'](that.pointer_overflow_enable)) {
                    that.svgContainer.style("overflow","visible");
                }

                var tick_label = that.group.selectAll(".ticks_label")
                        .data(that.coordinates);

                tick_label.enter()
                    .append("text")
                    .attr("x",0)
                    .attr("y",0)
                    .attr("class","ticks_label");

                var x,y,w = [];
                that.ticks_text_width = [];
                var j = that.new_data.length;
                var n = that.new_data.length;
                tick_label.attr("transform",function (d) {
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

                tick_label
                .text("")

                setTimeout(function() {
                    tick_label.text(function (d,i) {
                            if(i===0) {
                                return that.new_data[i].name;
                            }
                            else {
                                n--;
                                return that.new_data[n].name;
                            }
                        })
                        .text(function (d,i) {
                            if(i===0) {
                                w[i] = this.getBBox().height;
                                that.ticks_text_width[i] = this.getBBox().width;
                                if (this.getBBox().height < (d.values[1].y - d.values[0].y)) {
                                    return that.new_data[i].name;

                                } else {
                                    return "";
                                }
                            }
                            else {
                                w[i] = this.getBBox().height;
                                if (this.getBBox().height < (d.values[0].y - d.values[1].y)) {
                                     j--;
                                    return that.new_data[j].name;
                                }
                                else {
                                    return "";
                                }
                            }
                    })
                    .style("fill",that.pointer_color)
                    .style("font-size",that.pointer_size + "px")
                    .style("font-family", that.pointer_family)
                    .style("font-weight",that.pointer_weight)
                    .attr("text-anchor","start");

                },that.transitions.duration());

                tick_label.exit().remove();
                var tick_line = that.group.selectAll(".pyr-ticks")

                    .data(that.coordinates);

                tick_line.enter()
                    .append("line")
                    .attr("class", "pyr-ticks");

                tick_line.attr("x1", function (d,i) {
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
                    .attr("stroke-width", that.pointer_thickness + "px")
                    .attr("stroke",that.pointer_color)

                    setTimeout(function() {
                        tick_line.attr("x2", function (d,i) {
                            if(Math.abs(d.values[0].y - d.values[1].y) > w[i]) {
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
                    }, that.transitions.duration());

                tick_line.exit().remove();
                return this;
            },
            clubData: function () {

            	if (PykCharts['boolean'](that.clubdata_enable)) {
            		that.displayData = [];
                    that.sorted_weight = _.map(that.data,function(num){ return num.weight; });
                    that.sorted_weight.sort(function(a,b){ return b-a; });
                    that.checkDuplicate = [];
                    var others_Slice = {"name":that.clubdata_text,"color":that.clubData_color,"tooltip":that.clubData_tooltipText,"highlight":false};
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
                        var result = _.reject(that.sorted_weight,function(num)
                            {
                                return num==that.data[index].weight;
                            });
                        return result;
                    } ;

                    if(that.clubdata_always_include_data_points.length!== 0) {
                        for (var l=0;l<that.clubdata_always_include_data_points.length;l++)
                        {

                            index = that.getIndexByName(that.clubdata_always_include_data_points[l]);
                            if(index!= undefined) {
                                that.displayData.push(that.data[index]);
                                that.sorted_weight = reject (index);
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

                    var count = that.clubdata_maximum_nodes-that.displayData.length;

                    if(count>0)
                    {   that.displayData.push(others_Slice);
                        for (i=0;i<count-1;i++) {
                            index = that.getIndexByWeight(that.sorted_weight[i]);
                            that.displayData.push(that.data[index]);
                        }
                    }
                    var sum_others = d3.sum(that.sorted_weight,function (d,i) {
                            if(i>=count-1)
                                return d;
                        });
                    
                    others_Slice.weight = sum_others;
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
        that.selector = options.selector;
        that.height = options.chart_height ? options.chart_height : that.width;

        try {
            if(!_.isNumber(that.height)) {
                that.height = that.width;
                throw "chart_height"
            }
        }
        catch (err) {
            that.k.warningHandling(err,"1");
        }

        if(that.stop) {
            return;
        }

        if(that.mode === "default") {
           that.k.loading();
        }

        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(options.selector+" #chart-loader").remove();
                $(that.selector).css("height","auto")
                return;
            }

            that.data = that.k.__proto__._groupBy("oned",data);
            that.compare_data = that.k.__proto__._groupBy("oned",data);
            $(options.selector+" #chart-loader").remove();
            $(that.selector).css("height","auto")
            that.clubdata_enable = that.data.length>that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.render();
        };

        that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };

    this.refresh = function (){
        that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("oned",data);
            that.clubdata_enable = that.data.length>that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.refresh_data = that.k.__proto__._groupBy("oned",data);
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.optionalFeatures()
                .clubData()
                .createChart()
                .label();

        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
    };

    this.render = function (){
        var l = $(".svgcontainer").length;
        that.container_id = "svgcontainer" + l;
        that.fillChart = new PykCharts.Configuration.fillChart(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.border = new PykCharts.Configuration.border(that);

        if(that.mode === "default") {
            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+that.container_id,"treemap")
                .emptyDiv()
                .subtitle();
        }

        that.k.tooltip();
        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        if(that.mode === "infographics"){
            that.k.backgroundColor(that)
                .export(that,"#"+that.container_id,"treemap")
                .emptyDiv();
            that.new_data = {"children" : that.data};
        }

        if(that.mode === "default") {
            that.optionalFeatures()
                .clubData()
        }
        that.optionalFeatures().svgContainer()
            .createChart()
            .label();
        if(that.mode === "default") {
            that.k.liveData(that)
                .createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();
        }

        that.k.exportSVG(that,"#"+that.container_id,"treemap")
        
        $(document).ready(function () { return that.k.resize(that.svgContainer); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer); });
    };

    this.optionalFeatures = function (){
        var optional = {
            svgContainer: function () {

                that.svgContainer = d3.select(that.selector).append("svg:svg")
                    .attr("width",that.width)
                    .attr("height",that.height)
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height)
                    .attr("id",that.container_id)
                    .attr("class","svgcontainer PykCharts-oneD");

                that.group = that.svgContainer.append("g")
                    .attr("id","treemap");
                return this;
            },
            createChart: function () {
                that.treemap = d3.layout.treemap()
                    .sort(function (a,b) { return a.weight - b.weight; })
                    .size([that.width,that.height])
                    .value(function (d) { return d.weight; })
                    .sticky(false);
                that.sum = d3.sum(that.new_data.children, function (d){
                        return d.weight;
                    });
                var l;

                that.node = that.treemap.nodes(that.new_data);
                l = that.new_data.children.length;
                that.chart_data = that.group.selectAll(".cell")
                                    .data(that.node);
                that.chart_data.enter()
                    .append("svg:g")
                    .attr("class","cell")
                    .append("svg:rect")
                    .attr("class","treemap-rect");

                that.chart_data.attr("class","cell")
                    .select("rect")
                    .attr("class","treemap-rect")
                    .attr("id",function (d,i) { return "rect" + i; })
                    .attr("x",function (d) { return d.x; })
                    .attr("y", function (d) { return d.y; })
                    .attr("width", function (d) { return d.dx-1; })
                    .attr("height", 0)
                    .attr("fill",function (d) {
                        return d.children ? "white" : that.fillChart.selectColor(d);
                    })
                    .attr("fill-opacity",1)
                    .attr("data-fill-opacity",function () {
                        return $(this).attr("fill-opacity");
                    })
                    .on('mouseover',function (d) {
                        if(!d.children && that.mode === "default") {
                            d.tooltip = d.tooltip || "<table class='PykCharts'><tr><th colspan='2' class='tooltip-heading'>"+d.name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.weight)+"<td class='tooltip-right-content'>("+((d.weight*100)/that.sum).toFixed(1)+"%)</tr></table>";
                            if(PykCharts['boolean'](that.onhover_enable)) {
                                that.mouseEvent.highlight(options.selector +" "+".treemap-rect", this);
                            }
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(d.tooltip);
                        }
                    })
                    .on('mouseout',function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipHide(d);
                            if(PykCharts['boolean'](that.onhover_enable)) {    
                                that.mouseEvent.highlightHide(options.selector +" "+".treemap-rect");
                            }
                        }
                    })
                    .on('mousemove', function (d) {
                        if(!d.children && that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("height", function (d) { return d.dy-1; });

                that.chart_data.exit()
                    .remove();
                return this;
            },
            label: function () {
                    that.chart_text = that.group.selectAll(".name")
                        .data(that.node);
                    that.chart_text1 = that.group.selectAll(".weight")
                        .data(that.node);
                    that.chart_text.enter()
                        .append("svg:text")
                        .attr("class","name");

                    that.chart_text1.enter()
                        .append("svg:text")
                        .attr("class","weight");

                    that.chart_text.attr("class","name")
                        .attr("x", function (d) { return d.x + d.dx / 2; })
                        .attr("y", function (d) { return d.y + d.dy / 2; });

                    that.chart_text1.attr("class","weight")
                        .attr("x", function (d) { return d.x + d.dx / 2; })
                        .attr("y", function (d) { return d.y + d.dy / 2 + 15; });

                    that.chart_text.attr("text-anchor","middle")
                        .style("font-weight", that.label_weight)
                        .style("font-size", that.label_size + "px")
                        .attr("fill", that.label_color)
                        .style("font-family", that.label_family)

                        .text("")

                    setTimeout(function() {
                        that.chart_text.text(function (d) { return d.children ? " " :  d.name; })
                            .attr("pointer-events","none")
                            .text(function (d) {

                                if(this.getBBox().width<d.dx && this.getBBox().height<d.dy-15) {
                                    return d.children ? " " :  d.name;
                                }
                                else {
                                    return "";
                                }
                            });
                    },that.transitions.duration());

                    that.chart_text1.attr("text-anchor","middle")
                        .style("font-weight", that.label_weight)
                        .style("font-size", that.label_size + "px")
                        .attr("fill", that.label_color)
                        .style("font-family", that.label_family)
                        .text("")
                        .attr("pointer-events","none")

                    setTimeout(function () {
                        that.chart_text1.text(function (d) { return d.children ? " " :  that.k.appendUnits(d.weight); })
                            .text(function (d) {
                                if(this.getBBox().width < d.dx && this.getBBox().height < d.dy-15) {
                                    return d.children ? " " :  ((d.weight*100)/that.sum).toFixed(1)+"%"; /*that.k.appendUnits(d.weight);*/

                                }
                                else {
                                    return "";
                                }
                            });
                    },that.transitions.duration());

                    that.chart_text.exit()
                        .remove();
                    that.chart_text1.exit()
                        .remove();
                return this;
            },
            clubData : function () {

                if(PykCharts['boolean'](that.clubdata_enable)){
                    var clubdata_content = [],sum_others = 0,k=0;
                    if(that.data.length <= that.clubdata_maximum_nodes) {
                        that.new_data = { "children" : that.data };
                        return this;
                    }
                    if(that.clubdata_always_include_data_points.length!== 0){
                        var l = that.clubdata_always_include_data_points.length;
                        for(i=0; i < l; i++){
                            clubdata_content[i] = that.clubdata_always_include_data_points[i];
                        }
                    }
                    var new_data1 = [];
                    for(i=0;i<clubdata_content.length;i++){
                        for(j=0;j<that.data.length;j++){
                            if(clubdata_content[i].toUpperCase() === that.data[j].name.toUpperCase()){
                                new_data1.push(that.data[j]);
                            }
                        }
                    }
                    that.data.sort(function (a,b) { return b.weight - a.weight; });

                    while(new_data1.length<that.clubdata_maximum_nodes-1){
                        for(i=0;i<clubdata_content.length;i++){
                            if(that.data[k].name.toUpperCase() === clubdata_content[i].toUpperCase()){
                                k++;
                            }
                        }
                        new_data1.push(that.data[k]);
                        k++;
                    }
                    for(j=k; j < that.data.length; j++){
                        for(i=0; i<new_data1.length && j<that.data.length; i++){
                            if(that.data[j].name.toUpperCase() === new_data1[i].name.toUpperCase()){
                                sum_others +=0;
                                j++;
                                i = -1;
                            }
                        }
                        if(j < that.data.length){
                            sum_others += that.data[j].weight;
                        }
                    }
                    var sortfunc = function (a,b) { return b.weight - a.weight; };
                    while(new_data1.length > that.clubdata_maximum_nodes){
                        new_data1.sort(sortfunc);
                        var a=new_data1.pop();
                    }
                    var others_Slice = { "name":that.clubdata_text, "weight": sum_others, "color": that.clubData_color, "tooltip": that.clubData_tooltip };

                    if(new_data1.length < that.clubdata_maximum_nodes){
                        new_data1.push(others_Slice);

                    }
                    that.new_data = {"children" : new_data1};
                }
                else {
                    that.new_data = {"children" : that.data};
                }
                return this;
            },
        };
        return optional;
    };
};

PykCharts.other = {};

PykCharts.other.processInputs = function (chartObject, options) {

    var theme = new PykCharts.Configuration.Theme({})
        , stylesheet = theme.stylesheet
        , functionality = theme.functionality
        , otherCharts = theme.otherCharts;

    chartObject.selector = options.selector ? options.selector : stylesheet.selector;
    
    chartObject.width = options.chart_width  ? options.chart_width : stylesheet.chart_width;

    chartObject.mode = options.mode ? options.mode.toLowerCase(): stylesheet.mode;

    chartObject.tooltip_enable = options.tooltip_enable ? options.tooltip_enable.toLowerCase() : stylesheet.tooltip_enable;
    if (options &&  PykCharts['boolean'] (options.title_text)) {
        chartObject.title_text = options.title_text;
        chartObject.title_size = "title_size" in options ? options.title_size : stylesheet.title_size;
        chartObject.title_color = options.title_color ? options.title_color.toLowerCase()  : stylesheet.title_color;
        chartObject.title_weight = options.title_weight ? options.title_weight.toLowerCase() : stylesheet.title_weight;
        chartObject.title_family = options.title_family ? options.title_family.toLowerCase() : stylesheet.title_family;
    } else {
        chartObject.title_size = stylesheet.title_size;
        chartObject.title_color = stylesheet.title_color;
        chartObject.title_weight = stylesheet.title_weight;
        chartObject.title_family = stylesheet.title_family;
    }

    if (options && PykCharts['boolean'](options.subtitle_text)) {
        chartObject.subtitle_text = options.subtitle_text;
        chartObject.subtitle_size = "subtitle_size" in options ? options.subtitle_size : stylesheet.subtitle_size;
        chartObject.subtitle_color = options.subtitle_color ? options.subtitle_color : stylesheet.subtitle_color;
        chartObject.subtitle_weight = options.subtitle_weight ? options.subtitle_weight.toLowerCase() : stylesheet.subtitle_weight;
        chartObject.subtitle_family = options.subtitle_family ? options.subtitle_family.toLowerCase() : stylesheet.subtitle_family;
    } else {
        chartObject.subtitle_size = stylesheet.subtitle_size;
        chartObject.subtitle_color = stylesheet.subtitle_color;
        chartObject.subtitle_weight = stylesheet.subtitle_weight;
        chartObject.subtitle_family = stylesheet.subtitle_family;
    }

    if(options.credit_my_site_name || options.credit_my_site_url) {
        chartObject.credit_my_site_name = options.credit_my_site_name ? options.credit_my_site_name : "";
        chartObject.credit_my_site_url = options.credit_my_site_url ? options.credit_my_site_url : "";
    } else {
        chartObject.credit_my_site_name = stylesheet.credit_my_site_name;
        chartObject.credit_my_site_url = stylesheet.credit_my_site_url;
    }
    chartObject.data_source_name = options.data_source_name ? options.data_source_name : "";
    chartObject.data_source_url = options.data_source_url ? options.data_source_url : "";
    
    chartObject.label_size = "label_size" in options ? options.label_size : stylesheet.label_size;
    chartObject.label_color = options.label_color ? options.label_color : stylesheet.label_color;
    chartObject.label_weight = options.label_weight ? options.label_weight.toLowerCase() : stylesheet.label_weight;
    chartObject.label_family = options.label_family ? options.label_family.toLowerCase() : stylesheet.label_family;

    chartObject.transition_duration = options.transition_duration ? options.transition_duration : functionality.transition_duration;
    chartObject.onhover_enable = options.chart_onhover_highlight_enable ? options.chart_onhover_highlight_enable : stylesheet.chart_onhover_highlight_enable;
    chartObject.highlight_color = options.highlight_color ? options.highlight_color : stylesheet.highlight_color;
    chartObject.highlight = options.highlight ? options.highlight : stylesheet.highlight;
    
    chartObject.background_color = options.background_color ? options.background_color.toLowerCase() : stylesheet.background_color;
    chartObject.real_time_charts_refresh_frequency = options.real_time_charts_refresh_frequency ? options.real_time_charts_refresh_frequency : functionality.real_time_charts_refresh_frequency;
    chartObject.real_time_charts_last_updated_at_enable = options.real_time_charts_last_updated_at_enable ? options.real_time_charts_last_updated_at_enable.toLowerCase() : functionality.real_time_charts_last_updated_at_enable;

    chartObject.chart_color = options.chart_color ? options.chart_color : [];
    chartObject.default_color = stylesheet.chart_color;
    chartObject.fullscreen_enable = options.fullscreen_enable ? options.fullscreen_enable : stylesheet.fullscreen_enable;
    chartObject.loading_type = options.loading_type ? options.loading_type : stylesheet.loading_type;
    chartObject.loading_source = options.loading_source ? options.loading_source : stylesheet.loading_source;
    chartObject.export_enable = options.export_enable ? options.export_enable.toLowerCase() : stylesheet.export_enable;
    chartObject.border_between_chart_elements_thickness = "border_between_chart_elements_thickness" in options ? options.border_between_chart_elements_thickness : stylesheet.border_between_chart_elements_thickness;
    chartObject.border_between_chart_elements_color = options.border_between_chart_elements_color ? options.border_between_chart_elements_color: stylesheet.border_between_chart_elements_color;
    chartObject.border_between_chart_elements_style = options.border_between_chart_elements_style ? options.border_between_chart_elements_style.toLowerCase() : stylesheet.border_between_chart_elements_style;
    switch(chartObject.border_between_chart_elements_style) {
        case "dotted" : chartObject.border_between_chart_elements_style = "1,3";
                        break;
        case "dashed" : chartObject.border_between_chart_elements_style = "5,5";
                       break;
        default : chartObject.border_between_chart_elements_style = "0";
                  break;
    }

    chartObject.k = new PykCharts.Configuration(chartObject);

    chartObject.k.validator().validatingSelector(chartObject.selector.substring(1,chartObject.selector.length))
                .validatingChartMode(chartObject.mode,"mode",stylesheet.mode)
                .validatingDataType(chartObject.width,"chart_width",stylesheet.chart_width,"width")
                .validatingDataType(chartObject.title_size,"title_size",stylesheet.title_size)
                .validatingDataType(chartObject.border_between_chart_elements_thickness,"border_between_chart_elements_thickness",stylesheet.border_between_chart_elements_thickness)
                .validatingDataType(chartObject.real_time_charts_refresh_frequency,"real_time_charts_refresh_frequency",functionality.real_time_charts_refresh_frequency)
                .validatingDataType(chartObject.label_size,"label_size",stylesheet.label_size)
                .validatingDataType(chartObject.subtitle_size,"subtitle_size",stylesheet.subtitle_size)
                .validatingDataType(chartObject.transition_duration,"transition_duration",functionality.transition_duration)
                .validatingBorderBetweenChartElementsStyle(chartObject.border_between_chart_elements_style,"border_between_chart_elements_style")
                .validatingFontWeight(chartObject.title_weight,"title_weight",stylesheet.title_weight)
                .validatingFontWeight(chartObject.subtitle_weight,"subtitle_weight",stylesheet.subtitle_weight)
                .validatingFontWeight(chartObject.label_weight,"label_weight",stylesheet.label_weight)
                .validatingColor(chartObject.title_color,"title_color",stylesheet.title_color)
                .validatingColor(chartObject.subtitle_color,"subtitle_color",stylesheet.subtitle_color)
                .validatingColor(chartObject.highlight_color,"highlight_color",stylesheet.highlight_color)
                .validatingColor(chartObject.label_color,"label_color",stylesheet.label_color)
                .validatingColor(chartObject.border_between_chart_elements_color,"border_between_chart_elements_color")
                .validatingColor(chartObject.background_color,"background_color",stylesheet.background_color)
    if($.isArray(chartObject.chart_color)) {
        for(var i = 0;i < chartObject.chart_color.length;i++) {
            if(chartObject.chart_color[i]) {
                chartObject.k.validator()
                    .validatingColor(chartObject.chart_color[i],"chart_color",stylesheet.chart_color);
            }
        }
    }
    return chartObject;
};

PykCharts.other.pictograph = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function () {
        that = new PykCharts.other.processInputs(that, options);
        var optional = options.optional,
            otherCharts = theme.otherCharts;
        that.showTotal = options.pictograph_show_all_images ? options.pictograph_show_all_images.toLowerCase() : otherCharts.pictograph_show_all_images;
        that.enableTotal = options.pictograph_total_count_enable ? options.pictograph_total_count_enable.toLowerCase() : otherCharts.pictograph_total_count_enable;
        that.enableCurrent = options.pictograph_current_count_enable ? options.pictograph_current_count_enable.toLowerCase() : otherCharts.pictograph_current_count_enable;
        that.imgperline = options.pictograph_image_per_line ?  options.pictograph_image_per_line : otherCharts.pictograph_image_per_line;
        that.current_count_size = options.pictograph_current_count_size ? options.pictograph_current_count_size : otherCharts.pictograph_current_count_size;
        that.current_count_color = options.pictograph_current_count_color ? options.pictograph_current_count_color : otherCharts.pictograph_current_count_color;
        that.current_count_weight = options.pictograph_current_count_weight ? options.pictograph_current_count_weight.toLowerCase() : otherCharts.pictograph_current_count_weight;
        that.current_count_family = options.pictograph_current_count_family ? options.pictograph_current_count_family.toLowerCase() : otherCharts.pictograph_current_count_family;
        that.total_count_size = options.pictograph_total_count_size ? options.pictograph_total_count_size : otherCharts.pictograph_total_count_size;
        that.total_count_color = options.pictograph_total_count_color ? options.pictograph_total_count_color : otherCharts.pictograph_total_count_color;
        that.total_count_weight = options.pictograph_total_count_weight ? options.pictograph_total_count_weight.toLowerCase() : otherCharts.pictograph_total_count_weight;
        that.total_count_family = options.pictograph_total_count_family ? options.pictograph_total_count_family.toLowerCase() : otherCharts.pictograph_total_count_family;
        that.imageWidth =  options.pictograph_image_width ? options.pictograph_image_width : otherCharts.pictograph_image_width;
        that.imageHeight = options.pictograph_image_height ? options.pictograph_image_height : otherCharts.pictograph_image_height;
        that.pictograph_units_per_image = options.pictograph_units_per_image ? options.pictograph_units_per_image : "";
        that.pictograph_units_per_image_text_family = options.pictograph_units_per_image_text_family ? options.pictograph_units_per_image_text_family.toLowerCase(): otherCharts.pictograph_units_per_image_text_family;
        that.pictograph_units_per_image_text_size = options.pictograph_units_per_image_text_size ? options.pictograph_units_per_image_text_size : otherCharts.pictograph_units_per_image_text_size;
        that.pictograph_units_per_image_text_color = options.pictograph_units_per_image_text_color ? options.pictograph_units_per_image_text_color : otherCharts.pictograph_units_per_image_text_color;
        that.pictograph_units_per_image_text_weight = options.pictograph_units_per_image_text_weight ? options.pictograph_units_per_image_text_weight.toLowerCase() : otherCharts.pictograph_units_per_image_text_weight;
        that.height = options.chart_height ? options.chart_height : that.width;

        that.k.validator()
            .validatingDataType(that.height,"chart_height",that.width,"height")
            .validatingDataType(that.pictograph_units_per_image_text_size,"pictograph_units_per_image_text_size",otherCharts.pictograph_units_per_image_text_size)            
            .validatingDataType(that.current_count_size,"pictograph_current_count_size",otherCharts.pictograph_current_count_size,"current_count_size")
            .validatingDataType(that.total_count_size,"pictograph_total_count_size",otherCharts.pictograph_total_count_size,"total_count_size")
            .validatingDataType(that.imageWidth,"pictograph_image_width",otherCharts.pictograph_image_width,"imageWidth")
            .validatingDataType(that.imageHeight,"pictograph_image_height",otherCharts.pictograph_image_height,"imageHeight")
            .validatingDataType(that.imgperline,"pictograph_image_per_line",otherCharts.pictograph_image_per_line,"imgperline")
            .validatingFontWeight(that.current_count_weight,"pictograph_current_count_weight",otherCharts.pictograph_current_count_weight,"current_count_weight")           
            .validatingFontWeight(that.total_count_weight,"pictograph_total_count_weight",otherCharts.pictograph_total_count_weight,"total_count_weight")                       
            .validatingFontWeight(that.pictograph_units_per_image_text_weight,"pictograph_units_per_image_text_weight",otherCharts.pictograph_units_per_image_text_weight)
            .validatingColor(that.current_count_color,"pictograph_current_count_color",otherCharts.pictograph_current_count_color,"current_count_color")
            .validatingColor(that.total_count_color,"pictograph_total_count_color",otherCharts.pictograph_total_count_color,"total_count_color")
            .validatingColor(that.pictograph_units_per_image_text_color,"pictograph_units_per_image_text_color",otherCharts.pictograph_units_per_image_text_color,"pictograph_units_per_image_text_color"); 

        if(that.stop) {
            return;
        }

        if(that.mode === "default") {
           that.k.loading();
        }

        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(options.selector+" #chart-loader").remove();
                $(that.selector).css("height","auto")
                return;
            }

            that.data = data.sort(function(a,b) {
                return b.weight - a.weight;
            });
            that.old_weight = 0;

            that.compare_data = that.data;
            $(options.selector+" #chart-loader").remove();
            $(that.selector).css("height","auto")
            that.render();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeData");

    };
    this.refresh = function () {
        that.executeRefresh = function (data) {
            that.old_data = that.data;
            that.old_weight = that.weight;
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(options.selector+" #chart-loader").remove();
                return;
            }

            that.data = data.sort(function(a,b) {
                return b.weight - a.weight;
            });
            that.refresh_data = that.data;
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.optionalFeatures()
                .labelText()
                .enableLabel()
                .createChart();
        }
        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
    }
    this.render = function () {
        var l = $(".svgcontainer").length;
        that.container_id = "svgcontainer" + l;
        that.transitions = new PykCharts.Configuration.transition(that);

        if(that.mode==="default") {
            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+that.container_id,"pictograph")
                .emptyDiv()
                .subtitle()
                .liveData(that);
        } else {
            that.k.backgroundColor(that)
                .export(that,"#"+that.container_id,"pictograph")
                .emptyDiv();
        }

        that.optionalFeatures()
                .svgContainer()
                .labelText()
                .enableLabel()
        if(PykCharts['boolean'](that.pictograph_units_per_image)) {
            that.optionalFeatures().appendUnits()
        }
        that.optionalFeatures().createChart();
        if(that.mode==="default") {
            that.k.createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();
        }
        that.k.exportSVG(that,"#"+that.container_id,"pictograph")
        $(document).ready(function () { return that.k.resize(that.svgContainer); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer); });
    };

    this.optionalFeatures = function () {

        var optional = {
            svgContainer: function () {

                that.svgContainer = d3.select(options.selector).append('svg')
                    .attr("width",that.width)
                    .attr("id",that.container_id)
                    .attr("class","svgcontainer")
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height);

                that.group = that.svgContainer.append("g")
                    .attr("id", "pictograph_image_group")

                that.group1 = that.svgContainer.append("g")
                    .attr("transform","translate(0,0)");

                if(PykCharts['boolean'](that.pictograph_units_per_image)) {
                    that.group2 = that.svgContainer.append("g")
                        .attr("id","units-per-image");
                }

                return this;
            },
            createChart: function () {
                var a = 0,b=0;

                that.optionalFeatures().showTotal();
                var counter = 0;
                
                if(!that.textWidth) {
                    that.textWidth = 0;    
                }

                if(!that.totalTxtWeight) {
                    that.totalTxtWeight = 0;
                }

                var width = that.textWidth + that.totalTxtWeight + 25;

                if(that.total_unit_width > width) {
                    width = that.total_unit_width + 10
                }

                that.group.attr("transform", "translate(" + (width) + ",0)")
                for(var j=1; j<=that.weight; j++) {
                    if(j <= that.data[1].weight) {
                        if (!that.old_data || (that.old_data && j > that.old_data[1].weight)) {
                            that.group.append("image")
                                .attr("xlink:href",that.data[1]["image"])
                                .attr("id","current_image"+j)
                                .attr("x", b *(that.imageWidth + 1))
                                .attr("y", a *(that.imageHeight + 10))
                                .attr("width",0)
                                .attr("height", that.imageHeight + "px")
                                .transition()
                                .duration(that.transitions.duration())
                                .attr("width", that.imageWidth + "px");

                            setTimeout(function () {
                                if ($("#total_image"+j)) {
                                    $("#total_image"+j).remove();
                                }
                            },that.transitions.duration());
                        }
                    } else if ((j > that.old_weight && that.weight > that.old_weight) || (that.old_data && j <= that.old_data[1].weight)) {
                            that.group.append("image")
                                .attr("xlink:href",that.data[0]["image"])
                                .attr("id","total_image"+j)
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
                        b=0;
                        counter=0;
                    }

                    var group_bbox_height = that.group.node().getBBox().height;
                    if (j===that.weight && group_bbox_height != 0) {
                        that.height = group_bbox_height;
                        that.svgContainer
                            .attr("height",group_bbox_height)
                            .attr("viewBox", "0 0 " + that.width + " " + group_bbox_height);
                    }
                    else {
                        that.svgContainer
                            .attr("height",group_bbox_height)
                            .attr("viewBox", "0 0 " + that.width + " " + that.height);
                    }
                    
                }

                setTimeout(function () {
                    if (that.old_data && that.old_data[1].weight > that.data[1].weight) {
                        for (var i = that.old_data[1].weight; i > that.data[1].weight; i--) {
                            if ($("#current_image"+i)) {
                                $("#current_image"+i).remove();
                            }
                        }
                    }
                    if (that.old_data && that.old_data[0].weight > that.data[0].weight) {
                        for (var i = that.old_data[0].weight; i > that.data[0].weight; i--) {
                            if ($("#total_image"+i)) {
                                $("#total_image"+i).remove();
                            }
                        }
                    }
                },that.transitions.duration());

                if(((that.imageWidth * that.imgperline) + width) > that.width) {
                    console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px',"Your Lable text size and image width exceeds the chart conatiner width")
                }
                return this;
            },
            showTotal: function () {
                 if (PykCharts['boolean'](that.showTotal)) {
                    that.weight = that.data[0].weight;
                }
                else {
                    that.weight = that.data[1].weight;
                }
                return this ;
            },
            enableLabel: function () {
                if (PykCharts['boolean'](that.enableTotal)) {
                    var current_text = $(options.selector+" .PykCharts-current-text");
                    if (current_text.length > 0) {
                        current_text.remove();
                    };
                    
                    if(!that.textWidth) {
                        that.textWidth = 0;    
                    }

                    var y_pos =  ((that.data[0].weight)/(that.imgperline));
                    var textHeight;

                     that.group1.append("text")
                        .attr("class","PykCharts-current-text")
                        .attr("font-family",that.total_count_family)
                        .attr("font-size",that.total_count_size)
                        .attr("font-weight",that.total_count_weight)
                        .attr("fill",that.total_count_color)
                        .text("/"+that.data[0].weight)
                        .text(function () {
                            that.textHeight =this.getBBox().height;
                            that.totalTxtWeight = this.getBBox().width;
                            return "/"+that.data[0].weight;
                        })
                        .attr("x", (that.textWidth+5))
                        .attr("y", function () { return ((that.textHeight)-10); });
                }
                return this;
            },
            labelText: function () {
                if (PykCharts['boolean'](that.enableCurrent)) {
                    var total_text = $(options.selector+" .PykCharts-total-text");
                    if (total_text.length > 0) {
                        total_text.remove();
                    };
                    var y_pos =  ((that.data[0].weight)/(that.imgperline));
                    var textHeight;
                    that.group1.append("text")
                        .attr("x", 0)
                        .attr("class","PykCharts-total-text")
                        .attr("font-family",that.current_count_family)
                        .attr("font-size",that.current_count_size)
                        .attr("font-weight",that.current_count_weight)
                        .attr("fill",that.current_count_color)
                        .text(that.data[1].weight)
                        .text(function () {
                            that.textHeight = this.getBBox().height;
                            that.textWidth = this.getBBox().width;
                            return that.data[1].weight;
                        })
                        .attr("y", function () { return ((that.textHeight)-10); });

                }
                return this;
            },
            appendUnits: function () {

                if(!that.textHeight) {
                    that.textHeight = 0;
                }
                

                var unit_text_width, image_width,unit_text_width1,unit_text_height;
                that.group2.attr("transform","translate(0," + (that.textHeight + 15)+")");

                that.group2.append("text")
                        .attr("x", 0)
                        .attr("class","PykCharts-unit-text")
                        .attr("font-family",that.pictograph_units_per_image_text_family)
                        .attr("font-size",that.pictograph_units_per_image_text_size)
                        .attr("font-weight",that.pictograph_units_per_image_text_weight)
                        .attr("fill",that.pictograph_units_per_image_text_color)
                        .text(function () {
                            return "1 ";
                        })
                        .text(function () {
                            unit_text_height = this.getBBox().height;
                            unit_text_width = this.getBBox().width;
                            return "1 ";
                        })
                        .attr("dy",0)
                        .attr("y",unit_text_height - 5);

                that.group2.append("image")
                        .attr("xlink:href",that.data[1]["image"])
                        .attr("id","unit-image")
                        .attr("x", unit_text_width + 2 + "px")
                        .attr("y", 0)
                        .attr("height", unit_text_height + "px")
                        .attr("width", unit_text_height + "px");
                image_width = d3.select(options.selector +" #unit-image").attr("width");

                that.group2.append("text")
                        .attr("x", function () {
                            return parseFloat(image_width) + unit_text_width + 4;
                        })
                        .attr("class","PykCharts-unit-text")
                        .attr("font-family",that.pictograph_units_per_image_text_family)
                        .attr("font-size",that.pictograph_units_per_image_text_size)
                        .attr("font-weight",that.pictograph_units_per_image_text_weight)
                        .attr("fill",that.pictograph_units_per_image_text_color)
                        .text(function () {
                            return "= " + that.pictograph_units_per_image;
                        })
                        .text(function () {
                            unit_text_width1 = this.getBBox().width;
                            return "= " + that.pictograph_units_per_image;
                        })
                        .attr("y", function () { return (unit_text_height - 5); });
                that.total_unit_width = unit_text_width + parseFloat(image_width) + unit_text_width1+4;
                return this;
            }

        }
        return optional;
    }
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
            if(!(PykCharts['boolean'](options.variable_circle_size_enable))) {
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

                if(options.legends_display === "vertical") {
                    svg.attr("height", (series.length * 30)+20)
                    text_parameter1 = "x";
                    text_parameter2 = "y";
                    rect_parameter1 = "width";
                    rect_parameter2 = "height";
                    rect_parameter3 = "x";
                    rect_parameter4 = "y";
                    rect_parameter1value = 13;
                    rect_parameter2value = 13;
                    text_parameter1value = function (d,i) { return options.chart_width - 75; };
                    rect_parameter3value = function (d,i) { return options.chart_width - 100; };
                    var rect_parameter4value = function (d,i) { return i * 24 + 12;};
                    var text_parameter2value = function (d,i) { return i * 24 + 26;};
                }
                if(options.legends_display === "horizontal"){
                    svg.attr("height",70);
                    text_parameter1 = "x";
                    text_parameter2 = "y";
                    rect_parameter1 = "width";
                    rect_parameter2 = "height";
                    rect_parameter3 = "x";
                    rect_parameter4 = "y";
                    var text_parameter1value = function (d,i) { j--;return options.chart_width - (j*100 + 75); };
                    text_parameter2value = 30;
                    rect_parameter1value = 13;
                    rect_parameter2value = 13;
                    var rect_parameter3value = function (d,i) { k--;return options.chart_width - (k*100 + 100); };
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
                    .attr("fill-opacity", function (d,i) { return options.saturation_enable === "yes" ? (i+1)/series.length : 1; })
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
                            .attr("x",function (d) { k--;return options.chart_width - (k*80 + 75); })
                            .attr("y", 20)
                            .attr("height",13)
                            .attr("width",13)
                            .attr("fill-opacity",function (d,i) { return options.saturation_enable === "yes" ? (names[i].length - i)/names[i].length : 1 ;});
                legendsGroup.selectAll(".legends_text")
                    .data(a)
                    .enter()
                        .append("text")
                        .attr("class","legends_text")
                        .attr("pointer-events","none")
                        .attr("x", function (d,i) {jc--;return options.chart_width - (jc*80 + 55); })
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
            data = new PykCharts.multiD.sortDataByGroup(data);
            data.forEach(function (item) {
                if(item.group) {
                    checkGroup = true;
                } else {
                    checkGroup = false;
                    if(options.chart_color) {
                        checkGroup = false;
                        item.color = options.chart_color[0];
                    } else if(item.color) {
                        checkColor = false;
                        item.color = item.color;
                    } else{
                        checkColor = false;
                        item.color = options.default_color[0];
                    }
                }
            });
            i = 0
            if(checkGroup) {
                data.forEach(function(item) {
                    if (!unique[item.group] && item.color) {
                        unique[item.group] = item;
                        if(options.chart_color.length !== 0 && PykCharts['boolean'](options.chart_color[k])) {
                            item.color = options.chart_color[k];
                        } else if(item.color) {
                            item.color = item.color;
                        } else {
                            item.color = options.default_color;
                        }
                        if(i<data.length-2 && item.group !== data[i+1].group) {
                            k++;
                        }
                        newarr.push(item);
                    } else {
                        if(i < data.length-2 && item.group !== data[i+1].group) {
                            k++;
                        }
                    }
                    i++;
                });
                k=0;i=0;
                data.forEach(function(item) {
                    if(!unique[item.group]) {
                        unique[item.group] = item;
                        if(options.chart_color.length !== 0 && PykCharts['boolean'](options.chart_color[k])) {
                            item.color = options.chart_color[k];
                        } else {
                            item.color = options.default_color;
                        }
                        if(i<data.length-2 &&item.group !== data[i+1].group) {
                            k++;
                        }
                        newarr.push(item);
                    } else {
                        if(i<data.length-2 && item.group !== data[i+1].group) {
                            k++;
                        }
                    }
                    i++;
                })

                var arr = [];
                var uniqueColor = {};
                k = 0;
                newarr.forEach(function(item) {
                    arr.push(item);
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
        if(d && PykCharts['boolean'](options.variable_circle_size_enable)) {
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

PykCharts.multiD.sortDataByGroup = function (data) {
    data.sort(function(a,b) {
        if (a.group < b.group) {
            return -1;
        }
        else if (a.group > b.group) {
            return 1;
        }
    });
    return data;
}

PykCharts.multiD.processInputs = function (chartObject, options) {

    var theme = new PykCharts.Configuration.Theme({}),
        stylesheet = theme.stylesheet,
        functionality = theme.functionality,
        multiDimensionalCharts = theme.multiDimensionalCharts,
        optional = options.optional;
    chartObject.selector = options.selector ? options.selector : "body";
    chartObject.width = options.chart_width ? options.chart_width : stylesheet.chart_width;
    chartObject.height = options.chart_height ? options.chart_height : stylesheet.chart_height;

    chartObject.margin_left = options.chart_margin_left  ? options.chart_margin_left : stylesheet.chart_margin_left;
    chartObject.margin_right = options.chart_margin_right  ? options.chart_margin_right : stylesheet.chart_margin_right;
    chartObject.margin_top = options.chart_margin_top  ? options.chart_margin_top : stylesheet.chart_margin_top;
    chartObject.margin_bottom = options.chart_margin_bottom  ? options.chart_margin_bottom : stylesheet.chart_margin_bottom;

    chartObject.grid_x_enable = options.chart_grid_x_enable ? options.chart_grid_x_enable.toLowerCase() : multiDimensionalCharts.chart_grid_x_enable;
    chartObject.grid_y_enable = options.chart_grid_y_enable ? options.chart_grid_y_enable.toLowerCase() : multiDimensionalCharts.chart_grid_y_enable;
    chartObject.grid_color = options.chart_grid_color ? options.chart_grid_color : multiDimensionalCharts.chart_grid_color;
    chartObject.mode = options.mode ? options.mode.toLowerCase() : "default";
    chartObject.color_mode = options.color_mode ? options.color_mode.toLowerCase() : stylesheet.color_mode;

    if (options &&  PykCharts['boolean'] (options.title_text)) {
        chartObject.title_text = options.title_text;
        chartObject.title_size = "title_size" in options ? options.title_size : stylesheet.title_size;
        chartObject.title_color = options.title_color ? options.title_color : stylesheet.title_color;
        chartObject.title_weight = options.title_weight ? options.title_weight.toLowerCase() : stylesheet.title_weight;
        chartObject.title_family = options.title_family ? options.title_family.toLowerCase() : stylesheet.title_family;
    } else {
        chartObject.title_size = stylesheet.title_size;
        chartObject.title_color = stylesheet.title_color;
        chartObject.title_weight = stylesheet.title_weight;
        chartObject.title_family = stylesheet.title_family;
    }

    if (options && PykCharts['boolean'](options.subtitle_text)) {
        chartObject.subtitle_text = options.subtitle_text;
        chartObject.subtitle_size = "subtitle_size" in options ? options.subtitle_size : stylesheet.subtitle_size;
        chartObject.subtitle_color = options.subtitle_color ? options.subtitle_color : stylesheet.subtitle_color;
        chartObject.subtitle_weight = options.subtitle_weight ? options.subtitle_weight.toLowerCase() : stylesheet.subtitle_weight;
        chartObject.subtitle_family = options.subtitle_family ? options.subtitle_family.toLowerCase() : stylesheet.subtitle_family;
    } else {
        chartObject.subtitle_size = stylesheet.subtitle_size;
        chartObject.subtitle_color = stylesheet.subtitle_color;
        chartObject.subtitle_weight = stylesheet.subtitle_weight;
        chartObject.subtitle_family = stylesheet.subtitle_family;
    }

    chartObject.axis_x_enable = options.axis_x_enable ? options.axis_x_enable.toLowerCase() : stylesheet.axis_x_enable;
    chartObject.axis_onhover_highlight_enable = PykCharts['boolean'](chartObject.axis_x_enable) && options.axis_onhover_highlight_enable ? options.axis_onhover_highlight_enable.toLowerCase() : multiDimensionalCharts.axis_onhover_highlight_enable;
    chartObject.axis_x_title = options.axis_x_title ? options.axis_x_title : stylesheet.axis_x_title;
    chartObject.axis_x_pointer_position = PykCharts['boolean'](chartObject.axis_x_enable) && options.axis_x_pointer_position ? options.axis_x_pointer_position.toLowerCase(): stylesheet.axis_x_pointer_position;
    chartObject.axis_x_position = PykCharts['boolean'](chartObject.axis_x_enable) && options.axis_x_position ? options.axis_x_position.toLowerCase() : stylesheet.axis_x_position;
    chartObject.axis_x_line_color = PykCharts['boolean'](chartObject.axis_x_enable) && options.axis_x_line_color ? options.axis_x_line_color : stylesheet.axis_x_line_color;

    chartObject.onhover_enable = options.chart_onhover_highlight_enable ? options.chart_onhover_highlight_enable : stylesheet.chart_onhover_highlight_enable;

    chartObject.axis_x_no_of_axis_value = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_no_of_axis_value ? options.axis_x_no_of_axis_value : stylesheet.axis_x_no_of_axis_value;
    chartObject.axis_x_pointer_padding = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_pointer_padding ? options.axis_x_pointer_padding : stylesheet.axis_x_pointer_padding;

    chartObject.axis_x_no_of_axis_value = PykCharts['boolean'](chartObject.axis_x_enable) && options.axis_x_no_of_axis_value ? options.axis_x_no_of_axis_value : stylesheet.axis_x_no_of_axis_value;
    chartObject.axis_x_pointer_padding = PykCharts['boolean'](chartObject.axis_x_enable) && options.axis_x_pointer_padding ? options.axis_x_pointer_padding : stylesheet.axis_x_pointer_padding;

    chartObject.axis_x_pointer_length = "axis_x_pointer_length" in options && PykCharts['boolean'](chartObject.axis_x_enable) ? options.axis_x_pointer_length : stylesheet.axis_x_pointer_length;

    chartObject.axis_x_pointer_values = PykCharts['boolean'](chartObject.axis_x_enable) && options.axis_x_pointer_values ? options.axis_x_pointer_values : stylesheet.axis_x_pointer_values;
    chartObject.axis_x_outer_pointer_length = "axis_x_outer_pointer_length" in options && PykCharts['boolean'](chartObject.axis_x_enable) ? options.axis_x_outer_pointer_length : stylesheet.axis_x_outer_pointer_length;
    chartObject.axis_x_time_value_datatype = PykCharts['boolean'](chartObject.axis_x_enable) && options.axis_x_time_value_datatype ? options.axis_x_time_value_datatype.toLowerCase() : stylesheet.axis_x_time_value_datatype;
    chartObject.axis_x_time_value_interval = PykCharts['boolean'](chartObject.axis_x_enable) && options.axis_x_time_value_interval ? options.axis_x_time_value_interval : stylesheet.axis_x_time_value_interval;

    chartObject.axis_x_title_color = options.axis_x_title_color ? options.axis_x_title_color : stylesheet.axis_x_title_color;
    chartObject.axis_x_title_weight = options.axis_x_title_weight ? options.axis_x_title_weight.toLowerCase() : stylesheet.axis_x_title_weight;
    chartObject.axis_x_title_family = options.axis_x_title_family ? options.axis_x_title_family.toLowerCase() : stylesheet.axis_x_title_family;
    chartObject.axis_x_title_size = "axis_x_title_size" in options ? options.axis_x_title_size : stylesheet.axis_x_title_size;

    chartObject.axis_x_pointer_size = "axis_x_pointer_size" in options ? options.axis_x_pointer_size : stylesheet.axis_x_pointer_size;
    chartObject.axis_x_pointer_weight = options.axis_x_pointer_weight ? options.axis_x_pointer_weight.toLowerCase() : stylesheet.axis_x_pointer_weight;
    chartObject.axis_x_pointer_family = options.axis_x_pointer_family ? options.axis_x_pointer_family.toLowerCase() : stylesheet.axis_x_pointer_family;
    chartObject.axis_x_pointer_color = options.axis_x_pointer_color ? options.axis_x_pointer_color : stylesheet.axis_x_pointer_color;

    chartObject.axis_y_enable = options.axis_y_enable ? options.axis_y_enable.toLowerCase() : multiDimensionalCharts.axis_y_enable;
    chartObject.axis_y_title =  options.axis_y_title ? options.axis_y_title : multiDimensionalCharts.axis_y_title;
    chartObject.axis_y_pointer_position = PykCharts['boolean'](chartObject.axis_y_enable) && options.axis_y_pointer_position ? options.axis_y_pointer_position.toLowerCase() : multiDimensionalCharts.axis_y_pointer_position;
    chartObject.axis_y_position = PykCharts['boolean'](chartObject.axis_y_enable) && options.axis_y_position ? options.axis_y_position.toLowerCase(): multiDimensionalCharts.axis_y_position;
    chartObject.axis_y_line_color = PykCharts['boolean'](chartObject.axis_y_enable) && options.axis_y_line_color ? options.axis_y_line_color : multiDimensionalCharts.axis_y_line_color;

    chartObject.axis_y_no_of_axis_value = PykCharts['boolean'](chartObject.axis_y_enable) && options.axis_y_no_of_axis_value ? options.axis_y_no_of_axis_value : multiDimensionalCharts.axis_y_no_of_axis_value;
    chartObject.axis_y_pointer_padding = PykCharts['boolean'](chartObject.axis_y_enable) && options.axis_y_pointer_padding ? options.axis_y_pointer_padding : multiDimensionalCharts.axis_y_pointer_padding;

    chartObject.axis_y_pointer_length = "axis_y_pointer_length" in options && PykCharts['boolean'](chartObject.axis_y_enable) ? options.axis_y_pointer_length : multiDimensionalCharts.axis_y_pointer_length;
    chartObject.axis_y_pointer_values = PykCharts['boolean'](chartObject.axis_y_enable) && options.axis_y_pointer_values ? options.axis_y_pointer_values : multiDimensionalCharts.axis_y_pointer_values;
    chartObject.axis_y_outer_pointer_length = "axis_y_outer_pointer_length" in options && PykCharts['boolean'](chartObject.axis_y_enable) ? options.axis_y_outer_pointer_length : multiDimensionalCharts.axis_y_outer_pointer_length;
    chartObject.axis_y_time_value_datatype = PykCharts['boolean'](chartObject.axis_y_enable) && options.axis_y_time_value_datatype ? options.axis_y_time_value_datatype.toLowerCase(): multiDimensionalCharts.axis_y_time_value_datatype;
    chartObject.axis_y_time_value_interval = PykCharts['boolean'](chartObject.axis_y_enable) && options.axis_y_time_value_interval ? options.axis_y_time_value_interval : multiDimensionalCharts.axis_y_time_value_interval;

    chartObject.axis_y_pointer_size = "axis_y_pointer_size" in options ? options.axis_y_pointer_size : multiDimensionalCharts.axis_y_pointer_size;
    chartObject.axis_y_pointer_weight = options.axis_y_pointer_weight ? options.axis_y_pointer_weight.toLowerCase() : multiDimensionalCharts.axis_y_pointer_weight;
    chartObject.axis_y_pointer_family = options.axis_y_pointer_family ? options.axis_y_pointer_family.toLowerCase() : multiDimensionalCharts.axis_y_pointer_family;
    chartObject.axis_y_pointer_color = options.axis_y_pointer_color ? options.axis_y_pointer_color : multiDimensionalCharts.axis_y_pointer_color;

    chartObject.axis_y_title_color = options.axis_y_title_color ? options.axis_y_title_color : multiDimensionalCharts.axis_y_title_color;
    chartObject.axis_y_title_weight = options.axis_y_title_weight ? options.axis_y_title_weight : multiDimensionalCharts.axis_y_title_weight;
    chartObject.axis_y_title_family = options.axis_y_title_family ? options.axis_y_title_family : multiDimensionalCharts.axis_y_title_family;
    chartObject.axis_y_title_size = "axis_y_title_size" in options ? options.axis_y_title_size : multiDimensionalCharts.axis_y_title_size;

    if(options.credit_my_site_name || options.credit_my_site_url) {
        chartObject.credit_my_site_name = options.credit_my_site_name ? options.credit_my_site_name : "";
        chartObject.credit_my_site_url = options.credit_my_site_url ? options.credit_my_site_url : "";
    } else {
        chartObject.credit_my_site_name = stylesheet.credit_my_site_name;
        chartObject.credit_my_site_url = stylesheet.credit_my_site_url;
    }
    chartObject.data_source_name = options.data_source_name ? options.data_source_name : "";
    chartObject.data_source_url = options.data_source_url ? options.data_source_url : "";

    chartObject.background_color = options.background_color ? options.background_color : stylesheet.background_color;

    chartObject.chart_color = options.chart_color ? options.chart_color : [];
    chartObject.default_color = stylesheet.chart_color;
    chartObject.highlight_color = options.highlight_color ? options.highlight_color : stylesheet.highlight_color;
    chartObject.saturation_color = options.saturation_color ? options.saturation_color : stylesheet.saturation_color;

    chartObject.fullscreen_enable = options.fullscreen_enable ? options.fullscreen_enable : stylesheet.fullscreen_enable;
    chartObject.loading_type = options.loading_type ? options.loading_type : stylesheet.loading_type;
    chartObject.loading_source = options.loading_source ? options.loading_source : stylesheet.loading_source;
    chartObject.real_time_charts_refresh_frequency = options.real_time_charts_refresh_frequency ? options.real_time_charts_refresh_frequency : functionality.real_time_charts_refresh_frequency;
    chartObject.real_time_charts_last_updated_at_enable = options.real_time_charts_last_updated_at_enable ? options.real_time_charts_last_updated_at_enable.toLowerCase() : functionality.real_time_charts_last_updated_at_enable;

    chartObject.transition_duration = options.transition_duration ? options.transition_duration : functionality.transition_duration;

    chartObject.border_between_chart_elements_thickness = "border_between_chart_elements_thickness" in options ? options.border_between_chart_elements_thickness : stylesheet.border_between_chart_elements_thickness;
    chartObject.border_between_chart_elements_color = options.border_between_chart_elements_color ? options.border_between_chart_elements_color: stylesheet.border_between_chart_elements_color;
    chartObject.border_between_chart_elements_style = options.border_between_chart_elements_style ? options.border_between_chart_elements_style.toLowerCase() : stylesheet.border_between_chart_elements_style;
    switch(chartObject.border_between_chart_elements_style) {
        case "dotted" : chartObject.border_between_chart_elements_style = "1,3";
                        break;
        case "dashed" : chartObject.border_between_chart_elements_style = "5,5";
                       break;
        default : chartObject.border_between_chart_elements_style = "0";
                  break;
    }

    chartObject.pointer_thickness = "pointer_thickness" in options ? options.pointer_thickness : stylesheet.pointer_thickness;
    chartObject.pointer_size = "pointer_size" in options ? options.pointer_size : stylesheet.pointer_size;
    chartObject.pointer_color = options.pointer_color ? options.pointer_color : stylesheet.pointer_color;
    chartObject.pointer_family = options.pointer_family ? options.pointer_family.toLowerCase() : stylesheet.pointer_family;
    chartObject.pointer_weight = options.pointer_weight ? options.pointer_weight.toLowerCase(): stylesheet.pointer_weight;
    chartObject.zoom_enable = options.zoom_enable ? options.zoom_enable.toLowerCase() : multiDimensionalCharts.zoom_enable;
    chartObject.zoom_level = options.zoom_level ? options.zoom_level : multiDimensionalCharts.zoom_level;

    chartObject.label_size = "label_size" in options ? options.label_size : stylesheet.label_size;
    chartObject.label_color = options.label_color ? options.label_color : stylesheet.label_color;
    chartObject.label_weight = options.label_weight ? options.label_weight.toLowerCase() : stylesheet.label_weight;
    chartObject.label_family = options.label_family ? options.label_family.toLowerCase() : stylesheet.label_family;

    chartObject.tooltip_enable = options.tooltip_enable ? options.tooltip_enable.toLowerCase() : stylesheet.tooltip_enable;
    chartObject.tooltip_mode = options.tooltip_mode ? options.tooltip_mode.toLowerCase() : stylesheet.tooltip_mode;

    chartObject.annotation_enable = options.annotation_enable ? options.annotation_enable.toLowerCase() : multiDimensionalCharts.annotation_enable;
    chartObject.annotation_view_mode = options.annotation_view_mode ? options.annotation_view_mode : multiDimensionalCharts.annotation_view_mode;
    chartObject.annotation_background_color = options.annotation_background_color ? options.annotation_background_color : multiDimensionalCharts.annotation_background_color;
    chartObject.annotation_font_color = options.annotation_font_color ? options.annotation_font_color : multiDimensionalCharts.annotation_font_color;

    chartObject.legends_enable = options.legends_enable ? options.legends_enable.toLowerCase() : stylesheet.legends_enable;
    chartObject.legends_display = options.legends_display ? options.legends_display.toLowerCase() : stylesheet.legends_display;
    chartObject.legends_text_size = options.legends_text_size ? options.legends_text_size : stylesheet.legends_text_size;
    chartObject.legends_text_color = options.legends_text_color ? options.legends_text_color : stylesheet.legends_text_color;
    chartObject.legends_text_weight = options.legends_text_weight ? options.legends_text_weight.toLowerCase() : stylesheet.legends_text_weight;
    chartObject.legends_text_family = options.legends_text_family ? options.legends_text_family.toLowerCase() : stylesheet.legends_text_family;
    chartObject.highlight = options.highlight ? options.highlight : stylesheet.highlight;
    chartObject.variable_circle_size_enable = options.variable_circle_size_enable ? options.variable_circle_size_enable.toLowerCase() : multiDimensionalCharts.variable_circle_size_enable;
    chartObject.export_enable = options.export_enable ? options.export_enable.toLowerCase() : stylesheet.export_enable;
    chartObject.k = new PykCharts.Configuration(chartObject);

    chartObject.k.validator().validatingSelector(chartObject.selector.substring(1,chartObject.selector.length))
                .isArray(chartObject.axis_x_pointer_values,"axis_x_pointer_values")
                .isArray(chartObject.axis_y_pointer_values,"axis_y_pointer_values")
                .isArray(chartObject.chart_color,"chart_color")
                .validatingTimeScaleDataType(chartObject.axis_x_time_value_datatype,"axis_x_time_value_datatype",stylesheet.axis_x_time_value_datatype)
                .validatingTimeScaleDataType(chartObject.axis_y_time_value_datatype,"axis_y_time_value_datatype",multiDimensionalCharts.axis_y_time_value_datatype)
                .validatingAxisDataFormat(options.axis_x_data_format,"axis_x_data_format",stylesheet.axis_x_data_format)
                .validatingAxisDataFormat(options.axis_y_data_format,"axis_y_data_format",multiDimensionalCharts.axis_x_data_format)
                .validatingChartMode(chartObject.mode,"mode",stylesheet.mode)
                .validatingDataType(chartObject.width,"chart_width",stylesheet.chart_width,"width")
                .validatingDataType(chartObject.height,"chart_height",stylesheet.chart_height,"height")
                .validatingDataType(chartObject.margin_left,"chart_margin_left",stylesheet.chart_margin_left,"margin_left")
                .validatingDataType(chartObject.margin_right,"chart_margin_right",stylesheet.chart_margin_right,"margin_right")
                .validatingDataType(chartObject.margin_top,"chart_margin_top",stylesheet.chart_margin_top,"margin_top")
                .validatingDataType(chartObject.margin_bottom,"chart_margin_bottom",stylesheet.chart_margin_bottom,"margin_bottom")
                .validatingDataType(chartObject.title_size,"title_size",stylesheet.title_size)
                .validatingDataType(chartObject.subtitle_size,"subtitle_size",stylesheet.subtitle_size)
                .validatingDataType(chartObject.real_time_charts_refresh_frequency,"real_time_charts_refresh_frequency",functionality.real_time_charts_refresh_frequency)
                .validatingDataType(chartObject.transition_duration,"transition_duration",functionality.transition_duration)
                .validatingDataType(chartObject.border_between_chart_elements_thickness,"border_between_chart_elements_thickness",stylesheet.border_between_chart_elements_thickness)
                .validatingDataType(chartObject.axis_x_pointer_size,"axis_x_pointer_size",stylesheet.axis_x_pointer_size)
                .validatingDataType(chartObject.axis_y_pointer_size,"axis_y_pointer_size",multiDimensionalCharts.axis_y_pointer_size)
                .validatingDataType(chartObject.axis_x_pointer_length,"axis_x_pointer_length",stylesheet.axis_x_pointer_length)
                .validatingDataType(chartObject.axis_y_pointer_length,"axis_y_pointer_length",multiDimensionalCharts.axis_y_pointer_length)
                .validatingDataType(chartObject.axis_x_title_size,"axis_x_title_size",stylesheet.axis_x_title_size)
                .validatingDataType(chartObject.axis_y_title_size,"axis_y_title_size",multiDimensionalCharts.axis_y_title_size)
                .validatingDataType(chartObject.label_size,"label_size",stylesheet.label_size)
                .validatingDataType(chartObject.legends_text_size ,"legends_text_size",stylesheet.legends_text_size)
                .validatingDataType(chartObject.zoom_level,"zoom_level",stylesheet.zoom_level)
                .validatingDataType(chartObject.pointer_thickness,"pointer_thickness",stylesheet.pointer_thickness)
                .validatingDataType(chartObject.pointer_size,"pointer_size",stylesheet.pointer_size)
                .validatingDataType(chartObject.axis_x_outer_pointer_length,"axis_x_outer_pointer_length",stylesheet.axis_x_outer_pointer_length)
                .validatingDataType(chartObject.axis_y_outer_pointer_length,"axis_y_outer_pointer_length",multiDimensionalCharts.axis_y_outer_pointer_length)
                .validatingDataType(chartObject.axis_x_pointer_padding,"axis_x_pointer_padding",stylesheet.axis_x_pointer_padding)
                .validatingDataType(chartObject.axis_y_pointer_padding,"axis_y_pointer_padding",multiDimensionalCharts.axis_y_pointer_padding)
                .validatingDataType(chartObject.axis_x_no_of_axis_value,"axis_x_no_of_axis_value",stylesheet.axis_x_no_of_axis_value)
                .validatingDataType(chartObject.axis_y_no_of_axis_value,"axis_y_no_of_axis_value",multiDimensionalCharts.axis_y_no_of_axis_value)
                .validatingDataType(chartObject.axis_x_time_value_interval,"axis_x_time_value_interval",stylesheet.axis_x_time_value_interval)
                .validatingDataType(chartObject.axis_y_time_value_interval,"axis_y_time_value_interval",multiDimensionalCharts.axis_y_time_value_interval)
                .validatingColorMode(chartObject.color_mode,"color_mode",stylesheet.color_mode)
                .validatingYAxisPointerPosition(chartObject.axis_y_pointer_position,"axis_y_pointer_position",multiDimensionalCharts.axis_y_pointer_position)
                .validatingXAxisPointerPosition(chartObject.axis_x_pointer_position,"axis_x_pointer_position",stylesheet.axis_x_pointer_position)
                .validatingXAxisPointerPosition(chartObject.axis_x_position,"axis_x_position",stylesheet.axis_x_position)
                .validatingYAxisPointerPosition(chartObject.axis_y_position,"axis_y_position",multiDimensionalCharts.axis_y_position)
                .validatingBorderBetweenChartElementsStyle(chartObject.border_between_chart_elements_style,"border_between_chart_elements_style")
                .validatingLegendsPosition(chartObject.legends_display,"legends_display",stylesheet.legends_display)
                .validatingTooltipMode(chartObject.tooltip_mode,"tooltip_mode",stylesheet.tooltip_mode)
                .validatingFontWeight(chartObject.title_weight,"title_weight",stylesheet.title_weight)
                .validatingFontWeight(chartObject.subtitle_weight,"subtitle_weight",stylesheet.subtitle_weight)
                .validatingFontWeight(chartObject.pointer_weight,"pointer_weight",stylesheet.pointer_weight)
                .validatingFontWeight(chartObject.label_weight,"label_weight",stylesheet.label_weight)
                .validatingFontWeight(chartObject.legends_text_weight,"legends_text_weight",stylesheet.legends_text_weight)
                .validatingFontWeight(chartObject.axis_x_pointer_weight,"axis_x_pointer_weight",stylesheet.axis_x_pointer_weight)
                .validatingFontWeight(chartObject.axis_y_pointer_weight,"axis_y_pointer_weight",multiDimensionalCharts.axis_y_pointer_weight)
                .validatingFontWeight(chartObject.axis_x_title_weight,"axis_x_title_weight",stylesheet.axis_x_title_weight)
                .validatingFontWeight(chartObject.axis_y_title_weight,"axis_y_title_weight",multiDimensionalCharts.axis_y_title_weight)
                .validatingColor(chartObject.background_color,"background_color",stylesheet.background_color)
                .validatingColor(chartObject.grid_color,"chart_grid_color",multiDimensionalCharts.chart_grid_color)
                .validatingColor(chartObject.title_color,"title_color",stylesheet.title_color)
                .validatingColor(chartObject.subtitle_color,"subtitle_color",stylesheet.subtitle_color)
                .validatingColor(chartObject.axis_x_line_color,"axis_x_line_color",stylesheet.axis_x_line_color)
                .validatingColor(chartObject.axis_y_line_color,"axis_y_line_color",multiDimensionalCharts.axis_y_line_color)
                .validatingColor(chartObject.axis_x_title_color,"axis_x_title_color",stylesheet.axis_x_title_color)
                .validatingColor(chartObject.axis_y_title_color,"axis_y_title_color",multiDimensionalCharts.axis_y_title_color)
                .validatingColor(chartObject.axis_x_pointer_color,"axis_x_pointer_color",stylesheet.axis_x_pointer_color)
                .validatingColor(chartObject.axis_y_pointer_color,"axis_y_pointer_color",multiDimensionalCharts.axis_y_pointer_color)
                .validatingColor(chartObject.highlight_color,"highlight_color",stylesheet.highlight_color)
                .validatingColor(chartObject.saturation_color,"saturation_color",stylesheet.saturation_color)
                .validatingColor(chartObject.pointer_color,"pointer_color",stylesheet.pointer_color)
                .validatingColor(chartObject.label_color,"label_color",stylesheet.label_color)
                .validatingColor(chartObject.border_between_chart_elements_color,"border_between_chart_elements_color")
                .validatingColor(chartObject.annotation_border_color,"annotation_border_color",multiDimensionalCharts.annotation_border_color)
                .validatingColor(chartObject.annotation_background_color,"annotation_background_color",multiDimensionalCharts.annotation_background_color)
                .validatingColor(chartObject.annotation_font_color,"annotation_font_color",multiDimensionalCharts.annotation_font_color)
                .validatingColor(chartObject.legends_text_color,"legends_text_color",stylesheet.legends_text_color);

        if($.isArray(chartObject.chart_color)) {
            for(var i = 0;i < chartObject.chart_color.length;i++) {
                if(chartObject.chart_color[i]) {
                    chartObject.k.validator()
                        .validatingColor(chartObject.chart_color[i],"chart_color",stylesheet.chart_color);
                }
            }
        }

    return chartObject;
};

PykCharts.multiD.line = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function () {

        that = new PykCharts.multiD.processInputs(that, options, "line");

        if(that.stop)
            return;

        if(that.mode === "default") {
            that.k.loading();
        }

        var multiDimensionalCharts = theme.multiDimensionalCharts,
            stylesheet = theme.stylesheet,
            optional = options.optional;

        that.pointer_overflow_enable = options.pointer_overflow_enable ? options.pointer_overflow_enable.toLowerCase() : stylesheet.pointer_overflow_enable;
        that.crosshair_enable = options.crosshair_enable ? options.crosshair_enable.toLowerCase() : multiDimensionalCharts.crosshair_enable;
        that.curvy_lines = options.curvy_lines_enable ? options.curvy_lines_enable.toLowerCase() : multiDimensionalCharts.curvy_lines_enable;
        that.interpolate = PykCharts['boolean'](that.curvy_lines) ? "cardinal" : "linear";
        that.panels_enable = "no";

        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(that.selector+" #chart-loader").remove();
                $(that.selector).css("height","auto")
                return;
            }
            that.data = that.k.__proto__._groupBy("line",data);

            that.axis_y_data_format = "number";
            that.axis_x_data_format = that.k.xAxisDataFormatIdentification(that.data);
            if(that.axis_x_data_format === "time" && that.axis_x_time_value_datatype === "") {
                console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to have passed Date data so please pass the value for axis_x_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
            }

            if (that.axis_x_data_format === "string") {
                that.data_sort_enable = "no";
            }
            else {
                that.data_sort_enable = "yes";
                that.data_sort_type = (that.axis_x_data_format === "time") ? "date" : "numerically";
                that.data_sort_order = "ascending";
            }
            PykCharts.multiD.lineFunctions(options,that,"line");
        }

        that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };
};

PykCharts.multiD.multiSeriesLine = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function (){

        that = new PykCharts.multiD.processInputs(that, options, "line");
        if(that.stop)
            return;

        if(that.mode === "default") {
            that.k.loading();
        }

        var multiDimensionalCharts = theme.multiDimensionalCharts,
            stylesheet = theme.stylesheet,
            optional = options.optional;

        that.pointer_overflow_enable = options.pointer_overflow_enable ? options.pointer_overflow_enable.toLowerCase() : stylesheet.pointer_overflow_enable;
        that.crosshair_enable = options.crosshair_enable ? options.crosshair_enable.toLowerCase() : multiDimensionalCharts.crosshair_enable;
        that.curvy_lines = options.curvy_lines_enable ? options.curvy_lines_enable.toLowerCase() : multiDimensionalCharts.curvy_lines_enable;
        that.interpolate = PykCharts['boolean'](that.curvy_lines) ? "cardinal" : "linear";
        that.panels_enable = "no";

        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(that.selector+" #chart-loader").remove();
                $(that.selector).css("height","auto")
                return;
            }
            that.data = that.k.__proto__._groupBy("line",data);
            that.axis_y_data_format = "number";
            that.axis_x_data_format = that.k.xAxisDataFormatIdentification(that.data);
            if(that.axis_x_data_format === "time" && that.axis_x_time_value_datatype === "") {
                console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to have passed Date data so please pass the value for axis_x_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
            }

            if (that.axis_x_data_format === "string") {
                that.data_sort_enable = "no";                
            }
            else {
                that.data_sort_enable = "yes";
                that.data_sort_type = (that.axis_x_data_format === "time") ? "date" : "numerically";
                that.data_sort_order = "ascending";
            }
            PykCharts.multiD.lineFunctions(options,that,"multi_series_line");
        };

        that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };
};

PykCharts.multiD.panelsOfLine = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function (){

        that = new PykCharts.multiD.processInputs(that, options, "line");

        if(that.stop)
            return;

        if(that.mode === "default") {
            that.k.loading();
        }

        var multiDimensionalCharts = theme.multiDimensionalCharts,
            stylesheet = theme.stylesheet,
            optional = options.optional;

        that.pointer_overflow_enable = options.pointer_overflow_enable ? options.pointer_overflow_enable.toLowerCase() : stylesheet.pointer_overflow_enable;
        that.crosshair_enable = options.crosshair_enable ? options.crosshair_enable.toLowerCase() : multiDimensionalCharts.crosshair_enable;
        that.curvy_lines = options.curvy_lines_enable ? options.curvy_lines_enable.toLowerCase() : multiDimensionalCharts.curvy_lines_enable;
        that.interpolate = PykCharts['boolean'](that.curvy_lines) ? "cardinal" : "linear";
        that.panels_enable = "yes";

        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(that.selector+" #chart-loader").remove();
                $(that.selector).css("height","auto")
                return;
            }

            that.data = that.k.__proto__._groupBy("line",data);
            that.axis_y_data_format = "number";
            that.axis_x_data_format = that.k.xAxisDataFormatIdentification(that.data);
            if(that.axis_x_data_format === "time" && that.axis_x_time_value_datatype === "") {
                console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to have passed Date data so please pass the value for axis_x_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
            }

            if (that.axis_x_data_format === "string") {
                that.data_sort_enable = "no";                
            }
            else {
                that.data_sort_enable = "yes";
                that.data_sort_type = (that.axis_x_data_format === "time") ? "date" : "numerically";
                that.data_sort_order = "ascending";
            }
            PykCharts.multiD.lineFunctions(options,that,"panels_of_line");

        };

        that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };
};

PykCharts.multiD.lineFunctions = function (options,chartObject,type) {
    var that = chartObject;

    that.compare_data = that.data;
    that.data_length = that.data.length;
    $(that.selector+" #chart-loader").remove();
    $(that.selector).css("height","auto");

    that.dataTransformation = function () {
        that.group_arr = [], that.new_data = [];
        that.ticks = [], that.x_arr = [];

        for(j = 0;j < that.data_length;j++) {
            that.group_arr[j] = that.data[j].name;
        }
        that.uniq_group_arr = _.unique(that.group_arr);
        that.uniq_color_arr = [];
        var uniq_group_arr_length = that.uniq_group_arr.length;

        for(var k = 0;k < that.data_length;k++) {
            that.x_arr[k] = that.data[k].x;
        }
        var uniq_x_arr = _.unique(that.x_arr);

        for (k = 0;k < uniq_group_arr_length;k++) {
            if(that.chart_color[k]) {
                that.uniq_color_arr[k] = that.chart_color[k];
            } else {
                for (l = 0;l < that.data_length;l++) {
                    if (that.uniq_group_arr[k] === that.data[l].name && that.data[l].color) {
                        that.uniq_color_arr[k] = that.data[l].color;
                        break;
                    }
                } if(!PykCharts['boolean'](that.uniq_color_arr[k])) {
                    that.uniq_color_arr[k] = that.default_color[0];
                }
            }
        }

        that.flag = 0;
        for (k = 0;k < uniq_group_arr_length;k++) {
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
                        tooltip: that.data[l].tooltip,
                        annotation: that.data[l].annotation || ""
                    });
                }
            }
        }

        that.new_data_length = that.new_data.length;
        var uniq_x_arr_length = uniq_x_arr.length;
        
        for (var a = 0;a < that.new_data_length;a++) {
            var uniq_x_arr_copy = _.unique(that.x_arr);
            for(var b = 0;b < that.new_data[a].data.length;b++) {
                for(var k = 0;k < uniq_x_arr_length;k++) {
                    if(that.new_data[a].data[b].x == uniq_x_arr_copy[k]) {
                        uniq_x_arr_copy[k] = undefined;
                        break;
                    }
                }
            }
            _.each(uniq_x_arr_copy, function(d,i) {
                if (d != undefined) {
                    var temp_obj_to_insert_in_new_data = {
                        x: d,
                        y: 0,
                        tooltip: 0,
                        annotation: ""
                    };
                    that.new_data[a].data.splice(i, 0, temp_obj_to_insert_in_new_data);
                }
            });
        }

        for (var k = 0;k < that.new_data_length;k++) {
            that.new_data[k].data = that.k.__proto__._sortData(that.new_data[k].data, "x", "name", that);
        }
    };

    that.render = function () {
        that.dataLineGroup = [],that.clicked;
        that.multid = new PykCharts.multiD.configuration(that);
        that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);
        that.transitions = new PykCharts.Configuration.transition(that);
        
        if(that.mode === "default") {

            that.k.title();

            if(PykCharts['boolean'](that.panels_enable)) {
                that.w = that.width/4;
                that.height = that.height/2;
                that.margin_left = that.margin_left;
                that.margin_right = that.margin_right;

                that.k.backgroundColor(that)
                    .export(that,"svg-","lineChart",that.panels_enable,that.new_data)
                    .emptyDiv()
                    .subtitle();

                d3.select(that.selector).append("div")
                        .style("width",that.width + "px")
                        .style("height",that.height + "px")
                        .attr("id","panels_of_line_main_div")

                that.k.liveData(that);
                that.optionalFeature().chartType();
                that.reducedWidth = that.w - that.margin_left - that.margin_right;
                that.reducedHeight = that.height - that.margin_top - that.margin_bottom;
                that.fill_data = [];
                if(that.axis_x_data_format === "time") {
                    for(i = 0;i<that.new_data_length;i++) {

                        that.new_data[i].data.forEach(function (d) {
                            d.x = that.k.dateConversion(d.x);
                        });
                        
                    }
                    that.data.forEach(function (d) {
                        d.x =that.k.dateConversion(d.x);
                    });
                }

                that.renderPanelOfLines();
            } else {
                that.k.backgroundColor(that)
                    .export(that,"#svg-1","lineChart")
                    .emptyDiv()
                    .subtitle();

                that.w = that.width;
                that.reducedWidth = that.w - that.margin_left - that.margin_right;
                that.reducedHeight = that.height - that.margin_top - that.margin_bottom;

                that.k.liveData(that)
                        .makeMainDiv(that.selector,1)
                        .tooltip(true,that.selector,1,that.flag);
                
                that.optionalFeature()
                        .chartType();
                if(that.axis_x_data_format === "time") {
                    for(i = 0;i<that.new_data_length;i++) {

                        that.new_data[i].data.forEach(function (d) {
                            d.x = that.k.dateConversion(d.x);
                        });
                        
                    }
                    that.data.forEach(function (d) {
                        d.x =that.k.dateConversion(d.x);
                    });
                }
                try {
                    if(that.type === "multilineChart" && type === "line" ) {
                        throw "Invalid data in the JSON";
                    }
                }
                catch (err) {
                    console.error('%c[Error - Pykih Charts] ', 'color: red;font-weight:bold;font-size:14px', " at "+that.selector+".\""+err+"\"  Visit www.chartstore.io/docs#error_6");                 
                    return;
                }

                that.renderLineChart();
            }
            that.k.createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();
            if(PykCharts['boolean'](that.annotation_enable)) {
                that.annotation();
            }
        }
        else if(that.mode === "infographics") {
            if(PykCharts['boolean'](that.panels_enable)) {

                that.k.backgroundColor(that)
                    .export(that,"#svg-","lineChart",that.panels_enable,that.new_data)
                    .emptyDiv();

                that.w = that.width/3;
                that.height = that.height/2;
                if(that.axis_x_data_format === "time") {
                    for(i = 0;i<that.new_data_length;i++) {

                        that.new_data[i].data.forEach(function (d) {
                            d.x = that.k.dateConversion(d.x);
                        });
                        
                    }
                    that.data.forEach(function (d) {
                        d.x =that.k.dateConversion(d.x);
                    });
                }
                that.reducedWidth = that.w - that.margin_left - that.margin_right;
                that.reducedHeight = that.height - that.margin_top - that.margin_bottom;
                that.fill_data = [];

                that.renderPanelOfLines();
            } else {

                that.k.backgroundColor(that)
                    .export(that,"#svg-0","lineChart")
                    .emptyDiv();

                that.w = that.width;
                that.reducedWidth = that.w - that.margin_left - that.margin_right;
                that.reducedHeight = that.height - that.margin_top - that.margin_bottom;

                that.k.makeMainDiv(that.selector,1)

                that.optionalFeature()
                        .chartType();
                if(that.axis_x_data_format === "time") {
                    for(i = 0;i<that.new_data_length;i++) {
                        that.new_data[i].data.forEach(function (d) {
                            d.x = that.k.dateConversion(d.x);
                        });
                        
                    }
                    that.data.forEach(function (d) {
                        d.x =that.k.dateConversion(d.x);
                    });
                }

                try {
                    if(that.type === "multilineChart" && type === "line" ) {
                        throw "Invalid data in the JSON";
                    }
                }
                catch (err) {
                    console.error('%c[Error - Pykih Charts] ', 'color: red;font-weight:bold;font-size:14px', " at "+that.selector+".\""+err+"\"  Visit www.chartstore.io/docs#error_");                  
                    return;
                }

                that.renderLineChart();
            }
        }
        if(!PykCharts['boolean'](that.panels_enable)) {
            $(document).ready(function () { return that.k.resize(that.svgContainer,"yes"); })
            $(window).on("resize", function () { return that.k.resize(that.svgContainer,"yes"); });
        } else {
            $(document).ready(function () { return that.k.resize(null); })
            $(window).on("resize", function () { return that.k.resize(null); });
        }
    };

    that.refresh = function () {
        that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("line",data);
            that.data_length = that.data.length;
            var compare = that.k.checkChangeInData(that.data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            that.dataTransformation();

            if(data_changed || (PykCharts['boolean'](that.zoom_enable) && that.count > 1 && that.count <= that.zoom_level) || that.transition_duration) {
                that.k.lastUpdatedAt("liveData");
                that.mouseEvent.tooltipHide(null,that.panels_enable,that.type);
                that.mouseEvent.crossHairHide(that.type);
                that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
                that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
            }
            that.optionalFeature().hightLightOnload();
            if(that.axis_x_data_format === "time") {
                for(i = 0;i<that.new_data_length;i++) {

                    that.new_data[i].data.forEach(function (d) {
                        d.x = that.k.dateConversion(d.x);
                    });
                    
                }
                that.data.forEach(function (d) {
                    d.x =that.k.dateConversion(d.x);
                });
            }
            if(PykCharts['boolean'](that.panels_enable)) {
                for (var i = 0;i < that.previous_length;i++) {
                    $(that.selector + " #panels_of_line_main_div #tooltip-svg-container-"+i).remove();
                }               
                that.renderPanelOfLines();
            }

            if(that.type === "multilineChart" && !PykCharts['boolean'](that.panels_enable)) {
                $(that.selector + " #tooltip-svg-container-1").empty();
                that.renderLineChart();
            }

            if(that.type === "lineChart") {

                that.optionalFeature()
                    .createChart("liveData")
                    .ticks();

                that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values)
                        .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values)
                        .yGrid(that.svgContainer,that.group,that.yScale)
                        .xGrid(that.svgContainer,that.group,that.xScale)

                if(PykCharts['boolean'](that.annotation_enable)) {
                    that.annotation();
                }
            }

        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
    };

    that.optionalFeature = function (){
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
            hightLightOnload: function () {
                if(that.type === "multilineChart") {
                    if(that.new_data_length > 0 && that.highlight) {
                        for(var i = 0;i< that.uniq_group_arr.length;i++) {

                            if(that.highlight.toLowerCase() === that.uniq_group_arr[i].toLowerCase()) {
                                that.new_data[i].highlight = true;
                            } else
                            {
                                that.new_data[i].highlight = false;
                            }
                        }
                    }
                }
                return this;
            },
            svgContainer: function (i){
                if(that.type === "multilineChart") {
                    $(that.selector).attr("class","PykCharts-twoD PykCharts-line-chart PykCharts-multi-series2D");
                }
                else if(that.type === "lineChart") {
                    $(that.selector).attr("class","PykCharts-twoD PykCharts-line-chart");
                }

                that.svgContainer = d3.select(that.selector+" #tooltip-svg-container-"+i)
                    .append("svg:svg")
                    .attr("id","svg-" + i)
                    .attr("width",that.w)
                    .attr("height",that.height)
                    .attr("class","svgcontainer")
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.w + " " + that.height);

                if(PykCharts['boolean'](that.pointer_overflow_enable) && !PykCharts['boolean'](that.panels_enable)) {
                    that.svgContainer.style("overflow","visible");
                }

                return this;
            },
            createGroups : function (i) {
                that.group = that.svgContainer.append("g")
                    .attr("id","chartsvg")
                    .attr("transform","translate("+ that.margin_left +","+ that.margin_top +")");

                if(PykCharts['boolean'](that.grid_y_enable)){
                    that.group.append("g")
                        .attr("id","ygrid")
                        .attr("class","y grid-line");
                }
                if(PykCharts['boolean'](that.grid_x_enable)){
                    that.group.append("g")
                        .attr("id","xgrid")
                        .attr("class","x grid-line");
                }

                that.clip = that.svgContainer.append("svg:clipPath")
                    .attr("id","clip" + i + that.selector)
                    .append("svg:rect")
                    .attr("width", that.reducedWidth)
                    .attr("height", that.reducedHeight);

                that.chartBody = that.svgContainer.append("g")
                    .attr("id","clipPath")
                    .attr("clip-path", "url(#clip" + i + that.selector + ")")
                    .attr("transform","translate("+ that.margin_left +","+ that.margin_top +")");

                return this;
            },
            axisContainer : function () {

                if(PykCharts['boolean'](that.axis_x_enable) || that.axis_x_title){
                    that.xGroup = that.group.append("g")
                        .attr("id","xaxis")
                        .attr("class", "x axis");
                }
                if(PykCharts['boolean'](that.axis_y_enable) || that.axis_y_title) {
                    that.yGroup = that.group.append("g")
                        .attr("id","yaxis")
                        .attr("class","y axis");
                }
                return this;
            },
            createChart : function (evt,index) {
                that.previous_length = that.new_data.length;

                that.x_tick_values = that.k.processXAxisTickValues();
                that.y_tick_values = that.k.processYAxisTickValues();

                var x_domain,x_data = [],y_data,y_range,x_range,y_domain,min_x_tick_value,max_x_tick_value, min_y_tick_value,max_y_tick_value;

                if(that.axis_y_data_format === "number") {
                    max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return k.y; }); });
                    min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return k.y; }); });
                    y_domain = [min,max];

                    y_data = that.k.__proto__._domainBandwidth(y_domain,2);
                    min_y_tick_value = d3.min(that.y_tick_values);
                    max_y_tick_value = d3.max(that.y_tick_values);

                    if(y_data[0] > min_y_tick_value) {
                        y_data[0] = min_y_tick_value;
                    }
                    if(y_data[1] < max_y_tick_value) {
                        y_data[1] = max_y_tick_value;
                    }

                    y_range = [that.reducedHeight, 0];
                    that.yScale = that.k.scaleIdentification("linear",y_data,y_range);

                } else if(that.axis_y_data_format === "string") {
                    that.new_data[0].data.forEach(function(d) { y_data.push(d.y); });
                    y_range = [0,that.reducedHeight];
                    that.yScale = that.k.scaleIdentification("ordinal",y_data,y_range,0);

                } else if (that.axis_y_data_format === "time") {
                    y_data = d3.extent(that.data, function (d) {
                        return new Date(d.x);
                    });

                    min_y_tick_value = d3.min(that.y_tick_values, function (d) {
                        return new Date(d);
                    });

                    max_y_tick_value = d3.max(that.y_tick_values, function (d) {
                        return new Date(d);
                    });

                    if(new Date(y_data[0]) > new Date(min_y_tick_value)) {
                        y_data[0] = min_y_tick_value;
                    }
                    if(new Date(y_data[1]) < new Date(max_y_tick_value)) {
                        y_data[1] = max__tick_value;
                    }

                    y_range = [that.reducedHeight, 0];
                    that.yScale = that.k.scaleIdentification("time",y_data,y_range);
                }
                that.xdomain = [];
                if(that.axis_x_data_format === "number") {
                    max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return k.x; }); });
                    min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return k.x; }); });
                    x_domain = [min,max];
                    x_data = that.k.__proto__._domainBandwidth(x_domain,2);

                    min_x_tick_value = d3.min(that.x_tick_values);
                    max_x_tick_value = d3.max(that.x_tick_values);

                    if(x_data[0] > min_x_tick_value) {
                        x_data[0] = min_x_tick_value;
                    }
                    if(x_data[1] < max_x_tick_value) {
                        x_data[1] = max_x_tick_value;
                    }

                    x_range = [0 ,that.reducedWidth];
                    that.xScale = that.k.scaleIdentification("linear",x_data,x_range);
                    that.extra_left_margin = 0;
                    that.new_data[0].data.forEach(function (d) {
                        that.xdomain.push(d.x);
                    })

                } else if(that.axis_x_data_format === "string") {
                    that.new_data[0].data.forEach(function(d) { x_data.push(d.x); });
                    x_range = [0 ,that.reducedWidth];
                    that.xScale = that.k.scaleIdentification("ordinal",x_data,x_range,0);
                    that.extra_left_margin = (that.xScale.rangeBand() / 2);
                    that.xdomain = that.xScale.domain();

                } else if (that.axis_x_data_format === "time") {
                    max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return k.x; }); });
                    min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return k.x; }); });
                    x_data = [min,max];
                    x_range = [0 ,that.reducedWidth];

                    min_x_tick_value = d3.min(that.x_tick_values, function (d) {
                        d = that.k.dateConversion(d);
                        return d;
                    });

                    max_x_tick_value = d3.max(that.x_tick_values, function (d) {
                        d = that.k.dateConversion(d);
                        return d;
                    });

                    if((x_data[0]) > (min_x_tick_value)) {
                        x_data[0] = min_x_tick_value;
                    }
                    if((x_data[1]) < (max_x_tick_value)) {
                        x_data[1] = max_x_tick_value;
                    }
                    that.xScale = that.k.scaleIdentification("time",x_data,x_range);
                    that.extra_left_margin = 0;
                    that.new_data[0].data.forEach(function (d) {
                        that.xdomain.push(d.x);
                    })
                }
                that.count = 1;
                that.zoom_event = d3.behavior.zoom();
                if(!(that.axis_y_data_format==="string" || that.axis_x_data_format==="string")) {
                    that.zoom_event.x(that.xScale)
                        .y(that.yScale)
                        .scale(that.count)
                        .on("zoom",that.zoomed);
                } else {
                    that.zoom_event.y(that.yScale)
                        .scale(that.count)
                        .on("zoom",that.zoomed);
                }

                if(PykCharts['boolean'](that.zoom_enable) && (that.mode === "default")) {
                    if(PykCharts['boolean'](that.panels_enable)){
                        n = that.new_data_length;
                        j = 0;
                    } else {
                        n = 2;
                        j = 1;
                    }
                    for(i=j;i<n;i++) {
                        d3.selectAll(that.selector + " #svg-" +i).call(that.zoom_event);
                        d3.selectAll(that.selector + " #svg-" + i).on("wheel.zoom", null)
                            .on("mousewheel.zoom", null);
                    }
                }
                that.chart_path = d3.svg.line()
                    .x(function(d) { return that.xScale(d.x); })
                    .y(function(d) { return that.yScale(d.y); })
                    .interpolate(that.interpolate);

                that.chartPathClass = (that.type === "lineChart") ? "line" : "multi-line";
                if(evt === "liveData" && that.type === "lineChart") {

                        for (var i = 0;i < that.new_data_length;i++) {
                            var data = that.new_data[i].data;
                            type = that.type + "-svg-" +i;

                            that.svgContainer.select(that.selector + " #"+type)
                                .datum(that.new_data[i].data)
                                .attr("transform", "translate("+ that.extra_left_margin +",0)")
                                .style("stroke", function() {
                                    if(that.new_data[i].highlight && that.type === "multilineChart" && !that.clicked) {
                                        that.highlightLine(this,null);
                                    } else if(that.clicked) {
                                        that.highlightLine(that.selected,null,that.previous_color);
                                    }
                                    else {
                                        d3.select(this).classed({'multi-line-selected':false,'multi-line':true,'multi-line-hover':false});
                                    }
                                    return that.fillColor.colorPieMS(that.new_data[i],that.type);
                                });
                            function transition1 (i) {
                                that.dataLineGroup[i].transition()
                                    .duration(that.transitions.duration())
                                    .attrTween("d", function (d) {
                                        var interpolate = d3.scale.quantile()
                                            .domain([0,1])
                                            .range(d3.range(1, data.length + 1));
                                        return function(t) {
                                            return that.chart_path(that.new_data[i].data.slice(0, interpolate(t)));
                                        };
                                    });
                            }
                            transition1(i);

                            d3.selectAll(that.selector+" text#"+ (that.type + "-svg-" + i))
                                .style("fill",function() {
                                    return that.fillColor.colorPieMS(that.new_data[i],that.type);
                                });
                        }
                    if(that.type === "lineChart" && that.mode === "default") {
                        that.svgContainer
                            .on('mouseout',function (d) {
                                that.mouseEvent.tooltipHide();
                                that.mouseEvent.crossHairHide(that.type);
                                that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
                                that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
                            })
                            .on("mousemove", function(){
                                if(!PykCharts['boolean'](that.panels_enable)) {
                                    that.mouseEvent.crossHairPosition(that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.extra_left_margin,that.xdomain,that.type,that.tooltipMode,that.color_from_data,null);
                                }
                                else {
                                    that.mouseEvent.crossHairPosition(that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.extra_left_margin,that.xdomain);
                                }
                            });
                    }
                }
                else { // Static Viz
                    that.clk = true;
                    if(!PykCharts['boolean'](that.panels_enable)) {
                        var i;
                        for (i = 0;i < that.new_data_length;i++) {
                            var type = that.type + "-svg-" + i;
                            that.dataLineGroup[i] = that.chartBody.append("path");
                            var data = that.new_data[i].data;

                            that.dataLineGroup[i]
                                    .datum(that.new_data[i].data)
                                    .attr("class", "lines-hover " + that.chartPathClass)
                                    .attr("id", type)
                                    .attr("transform","translate("+ that.extra_left_margin +",0)")
                                    .style("stroke", function() {
                                        if(that.new_data[i].highlight) {
                                            that.highlightLine(this,null);
                                        }
                                        return that.fillColor.colorPieMS(that.new_data[i],that.type);
                                    })
                                    .attr("stroke-opacity", function () {
                                        if(that.color_mode === "saturation") {
                                            return (i+1)/that.new_data.length;
                                        } else {
                                            return 1;
                                        }
                                    })
                                    .attr("path-stroke-opacity", function () {
                                        return $(this).attr("stroke-opacity");
                                    });

                                function transition (i) {
                                    that.dataLineGroup[i].transition()
                                        .duration(that.transitions.duration())
                                        .attrTween("d", function (d) {
                                            var interpolate = d3.scale.quantile()
                                                .domain([0,1])
                                                .range(d3.range(1, data.length + 1));
                                            return function(t) {
                                                return that.chart_path(that.new_data[i].data.slice(0, interpolate(t)));
                                            };
                                        })
                                }
                                transition(i);
                        }
                    } else {                // Multiple Containers -- "Yes"
                        data = that.new_data[index].data;
                        type = that.type + that.svgContainer.attr("id");
                        that.dataLineGroup[0] = that.chartBody.append("path");

                        that.dataLineGroup[0]
                                .datum(that.new_data1.data)
                                .attr("class", "lines-hover "+that.chartPathClass)
                                .attr("id", type)
                                .attr("transform", "translate("+ that.extra_left_margin +",0)")
                                .style("stroke", function() {
                                    if(that.new_data[index].highlight) {
                                        that.highlightLine(this,null);
                                    }
                                    return that.fillColor.colorPieMS(that.new_data[index],that.type);
                                })
                                .attr("stroke-opacity", function () {
                                    if(that.color_mode === "saturation") {
                                        return (index+1)/that.new_data.length;
                                    } else {
                                        return 1;
                                    }
                                })
                                .attr("path-stroke-opacity", function () {
                                    return $(this).attr("stroke-opacity");
                                })
                                .on("click",function (d) {
                                        that.clicked = true;
                                        that.highlightLine(PykCharts.getEvent().target,that.clicked,that.previous_color);
                                })
                                .on("mouseover",function (d) {
                                    if(this !== that.selected && (that.color_mode === "saturation" || that.hover)) {
                                        that.previous_color = d3.select(this).attr("stroke-opacity");
                                        that.click_color = d3.select(this).style("stroke");
                                        d3.select(this)
                                            .classed({'multi-line-hover':true,'multi-line':false})
                                            .style("stroke", "orange");
                                    }
                                })
                                .on("mouseout",function (d,i) {
                                    if(this !== that.selected && (that.color_mode === "saturation" || that.hover)) {
                                        d3.select(this)
                                            .classed({'multi-line-hover':false,'multi-line':true})
                                            .style("stroke", function() {
                                                if(that.new_data[index].highlight) {
                                                    that.highlightLine(this,null,that.previous_color/*that.new_data[i].highlight*/);
                                                }
                                                return that.click_color;
                                            })
                                            .attr("stroke-opacity", function () {
                                                if(that.color_mode === "saturation") {
                                                    return that.previous_color;
                                                } else {
                                                    return 1;
                                                }
                                            });
                                    }
                                });

                        function animation(i) {
                            that.dataLineGroup[0].transition()
                                    .duration(that.transitions.duration())
                                    .attrTween("d", function (d) {
                                        var interpolate = d3.scale.quantile()
                                            .domain([0,1])
                                            .range(d3.range(1, data.length + 1));
                                        return function(t) {
                                            return that.chart_path(data.slice(0, interpolate(t)));
                                        };
                                    });
                        }
                        animation(index);
                    }

                    if(that.type === "lineChart" && that.mode === "default") {

                        that.svgContainer
                            .on('mouseout',function (d) {
                                that.mouseEvent.tooltipHide();
                                that.mouseEvent.crossHairHide(that.type);
                                that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
                                that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
                            })
                            .on("mousemove", function(){
                                that.mouseEvent.crossHairPosition(that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.extra_left_margin,that.xdomain,that.type,that.tooltipMode,that.color_from_data,null);
                            });

                    }
                    else if (that.type === "multilineChart" && that.mode === "default") {
                        that.svgContainer
                            .on('mouseout', function (d) {
                                that.mouseEvent.tooltipHide(null,that.panels_enable,that.type);
                                that.mouseEvent.crossHairHide(that.type);
                                that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
                                that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
                                for(var a=0;a < that.new_data_length;a++) {
                                    $(that.selector+" #svg-"+a).trigger("mouseout");
                                }
                            })
                            .on("mousemove", function(){
                                var line = [];
                                line[0] = d3.select(that.selector+" #"+this.id+" .lines-hover");
                                that.mouseEvent.crossHairPosition(that.new_data,that.xScale,that.yScale,line,that.extra_left_margin,that.xdomain,that.type,that.tooltipMode,that.color_from_data,that.panels_enable);
                                for(var a=0;a < that.new_data_length;a++) {
                                    $(that.selector+" #svg-"+a).trigger("mousemove");
                                }
                            });
                    }
                }
                return this;
            },
            ticks: function (index) {

                if(PykCharts['boolean'](that.pointer_size)) {
                    if(PykCharts['boolean'](that.panels_enable)) {
                        type = that.type + that.svgContainer.attr("id");
                        if (that.axis_x_position  === "bottom" && (that.axis_y_position === "left" || that.axis_y_position === "right")) {
                            that.ticks[0] = that.svgContainer.append("text")
                                .attr("id",type)
                                .attr("x", that.margin_left)
                                .attr("y", that.margin_top)
                                .attr("dy",-5)
                                .style("font-size", that.pointer_size + "px")
                                .style("font-weight", that.pointer_weight)
                                .style("font-family", that.pointer_family)
                                .html(that.new_data1.name)
                                .style("fill", function() {
                                    return that.fillColor.colorPieMS(that.new_data1,that.type);
                                });
                        } else if (that.axis_x_position  === "top"  && (that.axis_y_position === "left" || that.axis_y_position === "right")) {
                            that.ticks[0] = that.svgContainer.append("text")
                                .attr("id",type)
                                .attr("x", that.w - that.margin_left)
                                .attr("y", that.height-that.margin_bottom)
                                .attr("dy",10)
                                .attr("text-anchor","end")
                                .style("font-size", that.pointer_size + "px")
                                .style("font-weight", that.pointer_weight)
                                .style("font-family", that.pointer_family)
                                .html(that.new_data1.name)
                                .style("fill", function() {
                                    return that.fillColor.colorPieMS(that.new_data1,that.type);
                                });
                        }

                    } else {
                        that.ticks_text_width = [];
                        tickPosition = function (d,i) {
                            var end_x_circle, end_y_circle;
                            if(that.axis_y_position === "left") {
                                end_x_circle = (that.xScale(that.new_data[i].data[(that.new_data[i].data.length - 1)].x) + that.extra_left_margin + that.margin_left);
                                end_y_circle = (that.yScale(that.new_data[i].data[(that.new_data[i].data.length - 1)].y) + that.margin_top);
                            } else if(that.axis_y_position === "right") {
                                end_x_circle = (that.xScale(that.new_data[i].data[0].x) + that.extra_left_margin + that.margin_left) - 10;
                                end_y_circle = (that.yScale(that.new_data[i].data[0].y) + that.margin_top);
                            }
                            text_x = end_x_circle,
                            text_y = end_y_circle,
                            text_rotate = 0;
                            return "translate("+text_x+","+text_y+") rotate("+text_rotate+")";
                        }
                        orient = function () {
                            if(that.axis_y_position === "left") {
                                return "start";
                            } else if(that.axis_y_position === "right") {
                                return "end";
                            }
                        }
                        that.ticks = that.svgContainer.selectAll(".legend-heading")
                                .data(that.new_data);

                        that.ticks.enter()
                                .append("text")

                        that.ticks.attr("id", function (d,i) { return that.type + "-svg-" + i; })
                                .attr("class","legend-heading")
                                .attr("transform", tickPosition)
                                .attr("text-anchor",orient);

                        that.ticks.text(function (d,i) {
                                return "";
                            })
                        setTimeout(function() {
                            that.ticks.text(function (d,i) {
                                    return d.name;
                                })
                                .text(function (d,i) {
                                    that.ticks_text_width[i] = this.getBBox().width;
                                    return d.name;
                                })
                                .style("font-size", that.pointer_size + "px")
                                .style("font-weight", function(d){
                                    if(d.highlight) {
                                        return "bold";
                                    } else {
                                        return that.pointer_weight;
                                    }
                                })
                                .style("font-family", that.pointer_family)
                                .style("visibility","visible")
                                .attr("dx",5)
                                .attr("dy",5)
                                .style("fill", function(d,i) {
                                    return that.fillColor.colorPieMS(that.new_data[i],that.type);
                                });
                        }, that.transitions.duration());
                        that.ticks.exit()
                            .remove();
                    }
                }
                return this;
            }
        };
        return optional;
    };
    that.zoomed = function() {
        if(!PykCharts['boolean'](that.panels_enable)) {
            
            if(PykCharts['boolean'](that.pointer_overflow_enable)) {
                that.svgContainer.style("overflow","hidden");
            }

            that.k.isOrdinal(that.svgContainer,".x.axis",that.xScale,that.xdomain,that.extra_left_margin);
            that.k.isOrdinal(that.svgContainer,".x.grid",that.xScale);
            that.k.isOrdinal(that.svgContainer,".y.axis",that.yScale,that.ydomain);
            that.k.isOrdinal(that.svgContainer,".y.grid",that.yScale);
            for (i = 0;i < that.new_data_length;i++) {
                type = that.type + "-svg-" + i;
                that.svgContainer.select(that.selector+" #"+type)
                    .attr("class","lines-hover " + that.chartPathClass)
                    .attr("d", that.chart_path);

            }
        } else {
            for (i = 0;i < that.new_data_length;i++) {
                type = that.type + "svg-" + i;
                currentContainer = d3.selectAll(that.selector + " #svg-" + i);
                that.k.isOrdinal(currentContainer,".x.axis",that.xScale,that.xdomain,that.extra_left_margin);
                that.k.isOrdinal(currentContainer,".x.grid",that.xScale);
                that.k.isOrdinal(currentContainer,".y.axis",that.yScale,that.ydomain);
                that.k.isOrdinal(currentContainer,".y.grid",that.yScale);

                currentContainer.select(that.selector+" #"+type)
                    .attr("class", "lines-hover " + that.chartPathClass)
                    .attr("d", that.chart_path);

            }
        }
        if(PykCharts.getEvent().sourceEvent.type === "dblclick") {
            that.count++;
        }
        that.mouseEvent.tooltipHide();
        that.mouseEvent.crossHairHide(that.type);
        that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
        that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");

        if(that.count === that.zoom_level+1) {
            that.zoomOut();
        }
        if(PykCharts['boolean'](that.annotation_enable)) {
            that.annotation();
        }
        that.optionalFeature().ticks();
    };
    that.zoomOut = function () {
        if(PykCharts['boolean'](that.pointer_overflow_enable) && !PykCharts['boolean'](that.panels_enable)) {
            that.svgContainer.style("overflow","visible");
        }
        if(PykCharts['boolean'](that.panels_enable)) {
            for (var i = 0;i < that.previous_length;i++) {
                $(that.selector + " #panels_of_line_main_div #tooltip-svg-container-"+i).remove();
            }               
            that.renderPanelOfLines();
        }

        if(that.type === "multilineChart" && !PykCharts['boolean'](that.panels_enable)) {
            $(that.selector + " #tooltip-svg-container-1").empty();
            that.renderLineChart();
        }
        that.k.isOrdinal(that.svgContainer,".x.axis",that.xScale,that.xdomain,that.extra_left_margin);
        that.k.isOrdinal(that.svgContainer,".x.grid",that.xScale);
        that.k.isOrdinal(that.svgContainer,".y.axis",that.yScale,that.ydomain);
        that.k.isOrdinal(that.svgContainer,".y.grid",that.yScale);
    }
    that.highlightLine = function(linePath,clicked,prev_opacity) {

            that.selected_line = linePath;
            that.selected_line_data = that.selected_line.__data__;            
            that.selected_line_data_len = that.selected_line_data.length;
            that.deselected = that.selected;

            that.selected = linePath;

            if(that.type === "multilineChart" && (that.color_mode === "saturation" || that.hover))
                d3.select(that.selected)
                    .style("stroke", function (d,i) {
                        return that.click_color;
                    });

            if(clicked) {
                 if (d3.select(that.selected).classed("multi-line")) {
                        d3.selectAll(that.selector+" path.multi-line").attr("stroke-opacity",0.3);
                        if (that.color_mode === "color") {
                            d3.selectAll(that.selector+ " .legend-heading").style("opacity",0.3);
                        }
                        d3.select(that.selector+" text#"+that.selected.id).style("opacity",1).style
                        ("font-weight","bold");
                        d3.selectAll(".lines-hover")
                            .attr("stroke-opacity",0.3)
                            .classed("multi-line-selected",false)
                            .classed("multi-line",true);
                        d3.select(that.selected)
                            .attr("stroke-opacity",1)
                            .classed("multi-line-selected",true)
                            .classed("multi-line",false);
                 } else {
                    if (that.color_mode === "color") {
                        d3.selectAll(that.selector+" path.multi-line").attr("stroke-opacity",prev_opacity);
                    } else {
                        d3.selectAll(that.selector+" path.multi-line").attr("stroke-opacity",function () {
                            return $(this).attr("path-stroke-opacity");
                        });
                    }
                    d3.selectAll(that.selector+ " .legend-heading").style("opacity",1);
                    d3.select(that.selector+" text#"+that.selected.id).style("opacity",1).style
                    ("font-weight","normal");
                    d3.select(that.selected)
                        .attr("stroke-opacity",prev_opacity)
                        .classed("multi-line-selected",false)
                        .classed("multi-line",true);
                }
            }

    };

    that.annotation = function () {
        that.line = d3.svg.line()
                .interpolate('linear-closed')
                .x(function(d,i) { return d.x; })
                .y(function(d,i) { return d.y; });

        if(!PykCharts['boolean'](that.panels_enable)) {
            var arrow_size = 12/*line_size = 15*/,annotation = [];

            for(i=0;i<that.new_data_length;i++){
                that.new_data[i].data.map(function (d) {
                    if(d.annotation) {
                        annotation.push({
                            annotation : d.annotation,
                            x : d.x,
                            y : d.y
                        })
                    }
                });
            }

            var anno = that.svgContainer.selectAll(that.selector+ " .PykCharts-annotation-line")
                .data(annotation);
            anno.enter()
                .append("path");
              anno.attr("d", function (d,i) {
                    var a = [
                        {
                            x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
                            y:parseInt(that.yScale(d.y)-(arrow_size)+that.margin_top)
                        },
                        {
                            x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
                            y:parseInt(that.yScale(d.y)-(arrow_size)+that.margin_top)
                        }
                    ];
                    return that.line(a);
                })
            setTimeout(function () {
                anno.attr("class", "PykCharts-annotation-line")
                    .attr("d", function (d,i) {
                        var a = [
                        {
                            x:parseInt(that.xScale(d.x)-(arrow_size*0.5))+that.extra_left_margin+that.margin_left,
                            y:parseInt(that.yScale(d.y)-(arrow_size)+that.margin_top)
                        },
                        {
                            x:parseInt(that.xScale(d.x)+(arrow_size*0.5))+that.extra_left_margin+that.margin_left,
                            y:parseInt(that.yScale(d.y)-(arrow_size)+that.margin_top)
                        },
                        {
                            x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
                            y:parseInt(that.yScale(d.y)+that.margin_top),
                        }
                        ];
                        return that.line(a);
                    })
                    .attr("fill",that.annotation_background_color);
            },that.transitions.duration());

            anno.exit()
                .remove();
            that.k.annotation(that.selector + " #svg-1",annotation, that.xScale,that.yScale);
        }
        else if(PykCharts['boolean'](that.panels_enable)) {
            for(i=0;i<that.new_data_length;i++){
                var annotation = [], arrow_size = 12;
                that.new_data[i].data.map(function (d) {
                    if(d.annotation) {
                        annotation.push({
                            annotation : d.annotation,
                            x : d.x,
                            y : d.y
                        })
                    }
                });
                var anno = d3.select(that.selector + " #svg-" + i).selectAll(that.selector+ " .PykCharts-annotation-line")
                    .data(annotation);
                anno.enter()
                    .append("path");
                anno.attr("d", function (d,i) {
                        var a = [
                            {
                                x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
                                y:parseInt(that.yScale(d.y)-(arrow_size)+that.margin_top)
                            },
                            {
                                x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
                                y:parseInt(that.yScale(d.y)-(arrow_size)+that.margin_top)
                            }
                        ];
                        return that.line(a);
                    })
                function annotationAnimation(a) {
                    setTimeout(function () {
                        a.attr("class", "PykCharts-annotation-line")
                            .attr("d", function (d,i) {
                                var a = [
                                    {
                                        x:parseInt(that.xScale(d.x)-(arrow_size*0.5))+that.extra_left_margin+that.margin_left,
                                        y:parseInt(that.yScale(d.y)-(arrow_size)+that.margin_top)
                                    },
                                    {
                                        x:parseInt(that.xScale(d.x)+(arrow_size*0.5))+that.extra_left_margin+that.margin_left,
                                        y:parseInt(that.yScale(d.y)-(arrow_size)+that.margin_top)
                                    },
                                    {
                                        x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
                                        y:parseInt(that.yScale(d.y)+that.margin_top),
                                    }
                                ];
                                return that.line(a);
                            })
                            .attr("fill",that.annotation_background_color);
                    },that.transitions.duration());
                }
                annotationAnimation(anno);
                anno.exit().remove();
                that.k.annotation(that.selector + " #svg-" + i,annotation, that.xScale,that.yScale)
            }
        }

    };

    that.renderPanelOfLines = function () {

        for(i=0;i<that.new_data_length;i++) {
            that.k.makeMainDiv((that.selector + " #panels_of_line_main_div"),i)
                .tooltip(true,that.selector,i);

            that.new_data1 = that.new_data[i];
            that.fill_data[0] = that.new_data1;
            that.optionalFeature()
                    .svgContainer(i)
                    .createGroups(i);
    
            that.k.crossHair(that.svgContainer,1,that.fill_data,that.fillColor,that.type);
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

            that.optionalFeature()
                    .createChart(null,i)
                    .ticks(i)
                    .axisContainer();

            that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values)
                    .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values)
                    .xAxisTitle(that.xGroup)
                    .yAxisTitle(that.yGroup);

            if(that.mode === "default") {
                that.k.yGrid(that.svgContainer,that.group,that.yScale)
                    .xGrid(that.svgContainer,that.group,that.xScale)
            }

            if((i+1)%4 === 0 && i !== 0) {
                that.k.emptyDiv();
            }
        }
        that.k.exportSVG(that,"svg-","lineChart",that.panels_enable,that.new_data)
        that.k.emptyDiv();      
    };

    that.renderLineChart = function () {

        that.optionalFeature().svgContainer(1)
            .createGroups(1)
            .hightLightOnload();

        that.k.crossHair(that.svgContainer,that.new_data_length,that.new_data,that.fillColor,that.type);
        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

        that.optionalFeature()
                .createChart()
                .ticks()
                .axisContainer();

        that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values)
                .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values)
                .xAxisTitle(that.xGroup)
                .yAxisTitle(that.yGroup);

        if(that.mode === "default") {
            that.k.yGrid(that.svgContainer,that.group,that.yScale)
                .xGrid(that.svgContainer,that.group,that.xScale)
        }       

        var add_extra_width = 0;
        setTimeout(function () {
            if(PykCharts['boolean'](that.pointer_size)) {
                add_extra_width = _.max(that.ticks_text_width,function(d){
                        return d;
                    });
            }
            that.k.exportSVG(that,"#svg-1","lineChart",undefined,undefined,add_extra_width);
        },that.transitions.duration());
    };

    that.dataTransformation();
    that.render();
};

PykCharts.multiD.area = function (options){
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

	    that.crosshair_enable = options.crosshair_enable ? options.crosshair_enable.toLowerCase() : multiDimensionalCharts.crosshair_enable;
		that.curvy_lines = options.curvy_lines_enable ? options.curvy_lines_enable.toLowerCase() : multiDimensionalCharts.curvy_lines_enable;
	  	that.panels_enable = "no";
	  	that.interpolate = PykCharts['boolean'](that.curvy_lines) ? "cardinal" : "linear";
		that.w = that.width - that.margin_left - that.margin_right;
		that.h = that.height - that.margin_top - that.margin_bottom;

		that.executeData = function (data) {
			var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(that.selector+" #chart-loader").remove();
                $(that.selector).css("height","auto")
                return;
            }

			that.data = that.k.__proto__._groupBy("area",data);
			that.axis_y_data_format = "number";
    		that.axis_x_data_format = that.k.xAxisDataFormatIdentification(that.data);
    		if(that.axis_x_data_format === "time" && that.axis_x_time_value_datatype === "") {
    			console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to have passed Date data so please pass the value for axis_x_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
    		}
			that.compare_data = that.data;
			that.data_length = that.data.length;
			$(that.selector+" #chart-loader").remove();
			$(that.selector).css("height","auto")

			if (that.axis_x_data_format === "string") {
                that.data_sort_enable = "no";                
            }
            else {
                that.data_sort_enable = "yes";
                that.data_sort_type = (that.axis_x_data_format === "time") ? "date" : "numerically";
                that.data_sort_order = "ascending";
            }
			PykCharts.multiD.areaFunctions(options,that,"area");
			that.dataTransformation();
			that.render();

		}
		that.k.dataSourceFormatIdentification(options.data,that,"executeData");
		
	};
};

PykCharts.multiD.stackedArea = function (options){
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

	    that.crosshair_enable = options.crosshair_enable ? options.crosshair_enable.toLowerCase() : multiDimensionalCharts.crosshair_enable;
		that.curvy_lines = options.curvy_lines_enable ? options.curvy_lines_enable.toLowerCase() : multiDimensionalCharts.curvy_lines_enable;
	  	that.panels_enable = "no";
	  	that.interpolate = PykCharts['boolean'](that.curvy_lines) ? "cardinal" : "linear";
		that.w = that.width - that.margin_left - that.margin_right;
		that.h = that.height - that.margin_top - that.margin_bottom;

		that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(that.selector+" #chart-loader").remove();
                $(that.selector).css("height","auto");
                return;
            }

			that.data = that.k.__proto__._groupBy("area",data);
			that.axis_y_data_format = "number";
    		that.axis_x_data_format = that.k.xAxisDataFormatIdentification(that.data);
    		if(that.axis_x_data_format === "time" && that.axis_x_time_value_datatype === "") {
    			console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to have passed Date data so please pass the value for axis_x_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
    		}
			that.compare_data = that.data;
			that.data_length = that.data.length;
			$(that.selector+" #chart-loader").remove();
            $(that.selector).css("height","auto");
			
			if (that.axis_x_data_format === "string") {
                that.data_sort_enable = "no";                
            }
            else {
                that.data_sort_enable = "yes";
                that.data_sort_type = (that.axis_x_data_format === "time") ? "date" : "numerically";
                that.data_sort_order = "ascending";
            }
			PykCharts.multiD.areaFunctions(options,that,"stacked_area");
			that.dataTransformation();
			that.render();
		};
		that.k.dataSourceFormatIdentification(options.data,that,"executeData");
	};
};

PykCharts.multiD.areaFunctions = function (options,chartObject,type) {
	var that = chartObject;
	
	that.dataTransformation = function () {
        that.group_arr = [], that.new_data = [];
        that.ticks = [], that.x_arr = [];

        for(j = 0;j < that.data_length;j++) {
            that.group_arr[j] = that.data[j].name;
        }
        that.uniq_group_arr = _.unique(that.group_arr);
        that.uniq_color_arr = [];
        var uniq_group_arr_length = that.uniq_group_arr.length;

        for(var k = 0;k < that.data_length;k++) {
            that.x_arr[k] = that.data[k].x;
        }
        that.uniq_x_arr = _.unique(that.x_arr);

        for (k = 0;k < uniq_group_arr_length;k++) {
            if(that.chart_color[k]) {
                that.uniq_color_arr[k] = that.chart_color[k];
            } else {
                for (l = 0;l < that.data_length;l++) {
                    if (that.uniq_group_arr[k] === that.data[l].name && that.data[l].color) {
                        that.uniq_color_arr[k] = that.data[l].color;
                        break;
                    }
                } if(!PykCharts['boolean'](that.uniq_color_arr[k])) {
                    that.uniq_color_arr[k] = that.default_color[0];
                }
            }
        }

        that.flag = 0;
        for (k = 0;k < uniq_group_arr_length;k++) {
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
                        tooltip: that.data[l].tooltip,
                        annotation: that.data[l].annotation || ""
                    });
                }
            }
        }

        that.new_data_length = that.new_data.length;
        var uniq_x_arr_length = that.uniq_x_arr.length;

        for (var a = 0;a < that.new_data_length;a++) {
            that.uniq_x_arr_copy = _.unique(that.x_arr);
            for(var b = 0;b < that.new_data[a].data.length;b++) {                
                for(var k = 0;k < uniq_x_arr_length;k++) {
                    if(that.new_data[a].data[b].x == that.uniq_x_arr_copy[k]) {
                        that.uniq_x_arr_copy[k] = undefined;
                        break;
                    }
                }
            }
            _.each(that.uniq_x_arr_copy, function(d,i) {
                if (d != undefined) {
                    var temp_obj_to_insert_in_new_data = {
                        x: d,
                        y: 0,
                        tooltip: 0,
                        annotation: ""
                    };
                    that.new_data[a].data.splice(i, 0, temp_obj_to_insert_in_new_data);
                }
            });
        }

        for (var k = 0;k < that.new_data_length;k++) {
            that.new_data[k].data = that.k.__proto__._sortData(that.new_data[k].data, "x", "name", that);
        }
    };
	
	that.render = function () {
		that.dataLineGroup = [], that.dataLineGroupBorder = [];
		that.multid = new PykCharts.multiD.configuration(that);
		that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);
		that.transitions = new PykCharts.Configuration.transition(that);
		that.border = new PykCharts.Configuration.border(that);
		that.xdomain = [];
		that.optional_feature()
		    .chartType();

		try {
			if(that.type === "stackedAreaChart" && type === "area" ) {
				throw "Invalid data in the JSON";
			}

		}
		catch (err) {
            console.error('%c[Error - Pykih Charts] ', 'color: red;font-weight:bold;font-size:14px', " at "+that.selector+".\""+err+"\"  Visit www.chartstore.io/docs#error_7");					
         	return;   
		}
		if(that.axis_x_data_format === "time") {
			for(i = 0;i<that.new_data_length;i++) {
	          	that.new_data[i].data.forEach(function (d) {
		          	d.x = that.k.dateConversion(d.x);
		          	that.xdomain.push(d.x);
	          	});
	          	that.data.forEach(function (d) {
		          	d.x =that.k.dateConversion(d.x);
          		});
	        }
	    }

		if(that.mode === "default") {

			that.k.title()
					.backgroundColor(that)
					.export(that,"#svg-1","areaChart")
					.liveData(that)
					.emptyDiv()
					.subtitle()
					.makeMainDiv(that.selector,1)
					.tooltip(true,that.selector,1);

			that.renderChart();

			that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
					.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
					.yGrid(that.svgContainer,that.group,that.yScale,that.legendsGroup_width)
					.xGrid(that.svgContainer,that.group,that.xScale,that.legendsGroup_height)
					.xAxisTitle(that.xGroup,that.legendsGroup_height,that.legendsGroup_width)
					.yAxisTitle(that.yGroup)
					.createFooter()
	                .lastUpdatedAt()
	                .credits()
	                .dataSource();

	        if(PykCharts['boolean'](that.annotation_enable)) {
	        	that.annotation();
	        }
		}
		else if(that.mode === "infographics") {
			  that.k/*.liveData(that)*/
			  			.backgroundColor(that)
			  			.export(that,"#svg-1","areaChart")
			  			.emptyDiv()
						.makeMainDiv(that.selector,1);

			  that.optional_feaure()
						.svgContainer(1)
						.legendsContainer()
						.createGroups(1)
						.createChart()
			    		.axisContainer();

		    that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
					.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
					.xAxisTitle(that.xGroup,that.legendsGroup_height,that.legendsGroup_width)
					.yAxisTitle(that.yGroup);
  		}
		that.k.exportSVG(that,"#svg-1","areaChart")
  		that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
  		$(document).ready(function () { return that.k.resize(that.svgContainer,"yes"); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer,"yes"); });
	};

	that.refresh = function () {
		that.xdomain = [];
		that.executeRefresh = function (data) {
			that.data = that.k.__proto__._groupBy("area",data);
			that.data_length = that.data.length;
			that.dataTransformation();
			var compare = that.k.checkChangeInData(that.data,that.compare_data);
			that.compare_data = compare[0];
			var data_changed = compare[1];

			if(data_changed) {
				that.k.lastUpdatedAt("liveData");
				that.mouseEvent.tooltipHide();
				that.mouseEvent.crossHairHide(that.type);
				that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
				that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
			}
			if(that.axis_x_data_format === "time") {
				for(i = 0;i<that.new_data_length;i++) {
		          	that.new_data[i].data.forEach(function (d) {
			          	d.x = that.k.dateConversion(d.x);
			          	that.xdomain.push(d.x);
		          	});
		          	that.data.forEach(function (d) {
			          	d.x =that.k.dateConversion(d.x);
	          		});
		        }
		    }
			if(that.type === "stackedAreaChart") {
				that.dataTransformation();
				$(that.selector + " #tooltip-svg-container-1").empty();
				that.renderChart();
			}
			else {
				that.optional_feature().createChart("liveData");
			}

			that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
					.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
					.yGrid(that.svgContainer,that.group,that.yScale,that.legendsGroup_width)
					.xGrid(that.svgContainer,that.group,that.xScale,that.legendsGroup_height)
					.tooltip(true,that.selector);

			if(PykCharts['boolean'](that.annotation_enable)) {
	        	that.annotation();
	        }
		};
		that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
	};

	that.optional_feature = function (){
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
			svgContainer: function (i){
				$(that.selector).attr("class","PykCharts-twoD PykCharts-multi-series2D PykCharts-line-chart");

				that.svgContainer = d3.select(that.selector+" "+"#tooltip-svg-container-"+i).append("svg:svg")
					.attr("id","svg-"+i)
					.attr("width",that.width)
					.attr("height",that.height)
					.attr("class","svgcontainer")
					.attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height);
    			return this;
			},
			createGroups : function (i) {

				that.group = that.svgContainer.append("g")
					.attr("id","chartsvg")
					.attr("transform","translate("+ that.margin_left +","+ (that.margin_top + that.legendsGroup_height)+")");

				if(PykCharts['boolean'](that.grid_y_enable)){
					that.group.append("g")
						.attr("id","ygrid")
						.attr("class","y grid-line");
				}
				if(PykCharts['boolean'](that.grid_x_enable)){
					that.group.append("g")
						.attr("id","xgrid")
						.attr("class","x grid-line");
				}

				that.clip = that.svgContainer.append("svg:clipPath")
				    .attr("id","clip" + i + that.selector)
				    .append("svg:rect")
				    .attr("width", that.w - that.legendsGroup_width)
				    .attr("height", that.h - that.legendsGroup_height);

				that.chartBody = that.svgContainer.append("g")
					.attr("id","clipPath")
					.attr("clip-path", "url(#clip" + i + that.selector + " )")
					.attr("transform","translate("+ that.margin_left +","+ (that.margin_top+that.legendsGroup_height) +")");

				that.stack_layout = d3.layout.stack()
					.values(function(d) { return d.data; });

    			return this;
			},
			legendsContainer : function (i) {
                if (PykCharts['boolean'](that.legends_enable) && that.type === "stackedAreaChart" && that.mode === "default") {
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
			axisContainer : function () {
	        	if(PykCharts['boolean'](that.axis_x_enable) || options.axis_x_title){
					that.xGroup = that.group.append("g")
							.attr("id","xaxis")
							.attr("class", "x axis");
				}
				if(PykCharts['boolean'](that.axis_y_enable) || options.axis_y_title){
					that.yGroup = that.group.append("g")
						.attr("id","yaxis")
						.attr("class","y axis");
				}
	        	return this;
      		},
			createChart : function (evt) {

				that.legend_text = [];

				that.layers = that.stack_layout(that.new_data);

        		var x_domain,x_data = [],y_data,y_range,x_range,y_domain, min_x_tick_value,max_x_tick_value, min_y_tick_value,max_y_tick_value;
        		that.count = 1;

        		that.x_tick_values = that.k.processXAxisTickValues();
                that.y_tick_values = that.k.processYAxisTickValues();

				if(that.axis_y_data_format === "number") {
					max = d3.max(that.layers, function(d) { return d3.max(d.data, function(k) { return k.y0 + k.y; }); });
					min = 0;
         			y_domain = [min,max];
		          	y_data = that.k.__proto__._domainBandwidth(y_domain,1);
					y_range = [that.h - that.legendsGroup_height, 0];

					min_y_tick_value = d3.min(that.y_tick_values);
                    max_y_tick_value = d3.max(that.y_tick_values);

                    if(y_data[0] > min_y_tick_value) {
                        y_data[0] = min_y_tick_value;
                    }
                    if(y_data[1] < max_y_tick_value) {
                        y_data[1] = max_y_tick_value;
                    }

		          	that.yScale = that.k.scaleIdentification("linear",y_data,y_range);
		        }
		        else if(that.axis_y_data_format === "string") {
		          	that.new_data[0].data.forEach(function(d) { y_data.push(d.y); });
		          	y_range = [0,that.h];
		          	that.yScale = that.k.scaleIdentification("ordinal",y_data,y_range,0);
		        }
		        else if (that.axis_y_data_format === "time") {
		          	that.layers.data.forEach(function (k) {
		          		k.y0 = new Date(k.y0);
		          		k.y = new Date(k.y);
		          	});
		          	max = d3.max(that.layers, function(d) { return d3.max(d.data, function(k) { return k.y0 + k.y; }); });
					min = 0;
		         	y_data = [min,max];
		          	y_range = [that.h, 0];

	          	    min_y_tick_value = d3.min(that.y_tick_values, function (d) {
                        return new Date(d);
                    });

                    max_y_tick_value = d3.max(that.y_tick_values, function (d) {
                        return new Date(d);
                    });

                    if(new Date(y_data[0]) > new Date(min_y_tick_value)) {
                        y_data[0] = min_y_tick_value;
                    }
                    if(new Date(y_data[1]) < new Date(max_y_tick_value)) {
                        y_data[1] = max_y_tick_value;
                    }

		          	that.yScale = that.k.scaleIdentification("time",y_data,y_range);

		        }
		        if(that.axis_x_data_format === "number") {
        			max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return k.x; }); });
					min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return k.x; }); });
         			x_domain = [min,max];
			        x_data = that.k.__proto__._domainBandwidth(x_domain,2);
			        x_range = [0 ,that.w - that.legendsGroup_width];

		            min_x_tick_value = d3.min(that.x_tick_values);
                    max_x_tick_value = d3.max(that.x_tick_values);

                    if(x_data[0] > min_x_tick_value) {
                        x_data[0] = min_x_tick_value;
                    }
                    if(x_data[1] < max_x_tick_value) {
                        x_data[1] = max_x_tick_value;
                    }

			        that.xScale = that.k.scaleIdentification("linear",x_data,x_range);
			        that.extra_left_margin = 0;
			        that.new_data[0].data.forEach(function (d) {
                        that.xdomain.push(d.x);
                    })
		        }
		        else if(that.axis_x_data_format === "string") {
		          	that.new_data[0].data.forEach(function(d) { x_data.push(d.x); });
		          	x_range = [0 ,that.w - that.legendsGroup_width];
		          	that.xScale = that.k.scaleIdentification("ordinal",x_data,x_range,0);
		          	that.extra_left_margin = (that.xScale.rangeBand() / 2);
		          	that.xdomain = that.xScale.domain()
		        }
		        else if (that.axis_x_data_format === "time") {
		        	max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return k.x; }); });
					min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return k.x; }); });
		         	x_data = [min,max];
		          	x_range = [0 ,that.w - that.legendsGroup_width];

	          	    min_x_tick_value = d3.min(that.x_tick_values, function (d) {
                        return that.k.dateConversion(d);
                    });

                    max_x_tick_value = d3.max(that.x_tick_values, function (d) {
                        return that.k.dateConversion(d);
                    });

                    if(new Date(x_data[0]) > new Date(min_x_tick_value)) {
                        x_data[0] = min_x_tick_value;
                    }
                    if(new Date(x_data[1]) < new Date(max_x_tick_value)) {
                        x_data[1] = max_x_tick_value;
                    }

		          	that.xScale = that.k.scaleIdentification("time",x_data,x_range);
		          	
		          	that.extra_left_margin = 0;
		          	that.new_data[0].data.forEach(function (d) {
                        that.xdomain.push(d.x);
                    })
		        }
		        that.ydomain = that.yScale.domain();
				that.zoom_event = d3.behavior.zoom();

		      	if(!(that.axis_y_data_format==="string" || that.axis_x_data_format==="string")) {
		      		that.zoom_event.x(that.xScale)
					    .y(that.yScale)
					    .scale(that.count)
					    .on("zoom",that.zoomed);
				} else {
					that.zoom_event.y(that.yScale)
					    .scale(that.count)
					    .on("zoom",that.zoomed);
				}

				if(PykCharts['boolean'](that.zoom_enable) && (that.mode === "default")) {
					that.svgContainer.call(that.zoom_event);
					that.svgContainer.on("wheel.zoom", null)
                    	.on("mousewheel.zoom", null);
				}

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

	        	if(evt === "liveData") {
	        		for (var i = 0;i < that.new_data_length;i++) {
	        			var data = that.new_data[i].data;
	        			type = that.chartPathClass + i;

	        			that.svgContainer.select("#"+type)
							.datum(that.layers[i].data)
							.attr("transform", "translate("+ that.extra_left_margin +",0)")
							.style("stroke",that.border.color())
		                    .style("stroke-width",that.border.width())
		                    .style("stroke-dasharray", that.border.style());

						function transition1 (i) {
						    that.dataLineGroup[i].transition()
							    .duration(that.transitions.duration())
							    .attrTween("d", function (d) {
							    	var interpolate = d3.scale.quantile()
						                .domain([0,1])
						                .range(d3.range(1, data.length + 1));
							        return function(t) {
							            return that.chart_path(that.new_data[i].data.slice(0, interpolate(t)));
							        };
							    });
						}

						transition1(i);

						that.svgContainer.select("#border-stacked-area"+i)
							.datum(that.layers[i].data)
							.attr("transform", "translate("+ that.extra_left_margin +",0)");

					    function borderTransition1 (i) {
						    that.dataLineGroupBorder[i].transition()
							    .duration(that.transitions.duration())
							    .attrTween("d", function (d) {
							    	var interpolate = d3.scale.quantile()
						                .domain([0,1])
						                .range(d3.range(1, that.layers[i].data.length + 1));
							        return function(t) {
							            return that.chart_path_border(that.layers[i].data.slice(0, interpolate(t)));
							        };
							    })
						}
						borderTransition1(i);
					}
					if(that.type === "areaChart") {
						that.svgContainer
							.on('mouseout',function (d) {
			          			that.mouseEvent.tooltipHide();
			          			that.mouseEvent.crossHairHide(that.type);
								that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
								that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
		          			})
							.on("mousemove", function(){
								that.mouseEvent.crossHairPosition(that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.extra_left_margin,that.xdomain,that.type,that.tooltip_mode);
					  		});
					}
				}
				else {
					for (var i = 0;i < that.new_data_length;i++) {
						var data = that.new_data[i].data;
						type = that.chartPathClass + i;
						that.dataLineGroup[i] = that.chartBody.append("path");
						that.dataLineGroup[i]
							.datum(that.layers[i].data)
							.attr("class", that.chartPathClass)
							.attr("id", type)
							.style("fill", function(d) {
								return that.fillColor.colorPieMS(that.new_data[i],that.type);
							})
							.attr("fill-opacity",function() {
								if(that.type === "stackedAreaChart" && that.color_mode === "saturation") {
									return (i+1)/that.new_data.length;
								}
							})
							.attr("data-fill-opacity",function () {
		                        return $(this).attr("fill-opacity");
		                    })
							.attr("transform", "translate("+ that.extra_left_margin +",0)");

						function transition (i) {
						    that.dataLineGroup[i].transition()
							    .duration(that.transitions.duration())
							    .attrTween("d", function (d) {
							    	var interpolate = d3.scale.quantile()
						                .domain([0,1])
						                .range(d3.range(1, data.length + 1));
							        return function(t) {
							            return that.chart_path(that.new_data[i].data.slice(0, interpolate(t)));
							        };
							    });
						}
						transition(i);

						that.dataLineGroupBorder[i] = that.chartBody.append("path");
						that.dataLineGroupBorder[i]
							.datum(that.layers[i].data)
							.attr("class", "area-border")
							.attr("id", "border-stacked-area"+i)
							.style("stroke",that.border.color())
		                    .style("stroke-width",that.border.width())
		                    .style("stroke-dasharray", that.border.style())
		                    .style("pointer-events","none")
							.attr("transform", "translate("+ that.extra_left_margin +",0)")


						function borderTransition (i) {
						    that.dataLineGroupBorder[i].transition()
							    .duration(that.transitions.duration())
							    .attrTween("d", function (d) {
							    	var interpolate = d3.scale.quantile()
						                .domain([0,1])
						                .range(d3.range(1, that.layers[i].data.length + 1));
							        return function(t) {
							            return that.chart_path_border(that.layers[i].data.slice(0, interpolate(t)));
							        };
							    });
						}
						borderTransition(i);

					}

					that.svgContainer
						.on('mouseout', function (d) {
							that.mouseEvent.tooltipHide();
							that.mouseEvent.crossHairHide(that.type);
							that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
							that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");

							if(that.type === "stackedAreaChart") {
								for(var a=0;a < that.new_data_length;a++) {
									$(that.selector+" #svg-"+a).trigger("mouseout");
								}
							}
						})
						.on("mousemove", function() {
							if(that.type === "areaChart") {
								that.mouseEvent.crossHairPosition(that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.extra_left_margin,that.xdomain,that.type,that.tooltip_mode);
							} else if(that.type === "stackedAreaChart") {
								var line = [];
								line[0] = d3.select(that.selector+" #"+this.id+" .stacked-area");
								that.mouseEvent.crossHairPosition(that.new_data,that.xScale,that.yScale,line,that.extra_left_margin,that.xdomain,that.type,that.tooltipMode,that.color_from_data,"no");
								for(var a=0;a < that.new_data_length;a++) {
									$(that.selector+" #svg-"+a).trigger("mousemove");
								}
							}
						});

				}
				d3.selectAll(that.selector + " ." +that.chartPathClass)
					.on("mouseover", function () {
						if(that.mode === "default") {
							that.mouseEvent.highlight(that.selector + " ."+that.chartPathClass,this);
						}
					})
					.on("mouseout", function () {
						if(that.mode === "default") {
							that.mouseEvent.highlightHide(that.selector + " ."+that.chartPathClass);
						}
					});
				return this;
			},
			legends : function (index) {

                if (PykCharts['boolean'](that.legends_enable) && that.type === "stackedAreaChart" && that.mode==="default") {
                    var k = 0;
                    var l = 0;

                    if(that.legends_display === "vertical" ) {
                        that.legendsGroup.attr("height", (that.new_data_length * 30)+20);
                        that.legendsGroup_height = 0;

                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        text_parameter1value = function (d,i) { return 36; };
                        rect_parameter3value = function (d,i) { return 20; };
                        var rect_parameter4value = function (d,i) { return i * 24 + 12;};
                        var text_parameter2value = function (d,i) { return i * 24 + 23;};

                    } else if(that.legends_display === "horizontal") {
                        that.legendsGroup_height = 50;
                        final_rect_x = 0;
                        final_text_x = 0;
                        legend_text_widths = [];
                        sum_text_widths = 0;
                        temp_text = temp_rect = 0;
                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";

                        var text_parameter1value = function (d,i) {
                            legend_text_widths[i] = this.getBBox().width;
                            legend_start_x = 16;
                            final_text_x = (i === 0) ? legend_start_x : (legend_start_x + temp_text);
                            temp_text = temp_text + legend_text_widths[i] + 30;
                            return final_text_x;
                        };
                        text_parameter2value = 30;
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        var rect_parameter3value = function (d,i) {
                            final_rect_x = (i === 0) ? 0 : temp_rect;
                            temp_rect = temp_rect + legend_text_widths[i] + 30;
                            return final_rect_x;
                        };
                        rect_parameter4value = 18;
                    }

                    var legend = that.legendsGroup.selectAll("rect")
                                    .data(that.new_data);

                    that.legends_text = that.legendsGroup.selectAll(".legends_text")
                        .data(that.new_data);

                    that.legends_text.enter()
                        .append('text');

                    that.legends_text.attr("class","legends_text")
                        .attr("pointer-events","none")
                        .text(function (d) { return d.name; })
                        .attr("fill", that.legends_text_color)
                        .attr("font-family", that.legends_text_family)
                        .attr("font-size",that.legends_text_size +"px")
                        .attr("font-weight", that.legends_text_weight)
                        .attr(text_parameter1, text_parameter1value)
                        .attr(text_parameter2, text_parameter2value);

                    legend.enter()
                        .append("rect");

                    legend.attr(rect_parameter1, rect_parameter1value)
                        .attr(rect_parameter2, rect_parameter2value)
                        .attr(rect_parameter3, rect_parameter3value)
                        .attr(rect_parameter4, rect_parameter4value)
                        .attr("fill", function (d) {
                            return that.fillColor.colorPieMS(d,that.type);
                        })
                        .attr("fill-opacity", function (d,i) {
                            if(that.type === "stackedAreaChart" && that.color_mode === "saturation") {
								return (i+1)/that.new_data.length;
							}
                        });


                    var legend_container_width = that.legendsGroup.node().getBBox().width, translate_x;
                    if(that.legends_display === "vertical") {
                    	that.legendsGroup_width = legend_container_width + 20;
                    } else  {
                    	that.legendsGroup_width = 0;
                    }
                    
                    translate_x = (that.legends_display === "vertical") ? (that.width - that.legendsGroup_width)  : (that.width - legend_container_width - 20);

                    if (legend_container_width < that.width) { that.legendsGroup.attr("transform","translate("+translate_x+",10)"); }
                    that.legendsGroup.style("visibility","visible");

                    that.legends_text.exit().remove();
                    legend.exit().remove();


                    /* !!!!! DO NOT TOUCH THE BELOW COMMENTED CODE, PREVIOUSLY WRITTEN FOR DISPLAYING LEGENDS ON THE NEXT LINE !!!!!*/
                }
                return this;
            }
		};
		return optional;
	};

	that.zoomed = function() {
		that.k.isOrdinal(that.svgContainer,".x.axis",that.xScale,that.xdomain,that.extra_left_margin);
	    that.k.isOrdinal(that.svgContainer,".x.grid",that.xScale);
	    that.k.isOrdinal(that.svgContainer,".y.axis",that.yScale,that.ydomain);
	    that.k.isOrdinal(that.svgContainer,".y.grid",that.yScale);

	    for (i = 0;i < that.new_data_length;i++) {
	    	type = that.chartPathClass + i;
	  	 	that.svgContainer.select(that.selector+" #"+type)
	        	.attr("class", that.chartPathClass)
		        .attr("d", that.chart_path);
		    that.svgContainer.select(that.selector+" #border-stacked-area"+i)
				.attr("class","area-border")
				.attr("d", that.chart_path_border);
	    }
	    if(PykCharts.getEvent().sourceEvent.type === "dblclick") {
	    	that.count++;
	    }
	    that.mouseEvent.tooltipHide();
		that.mouseEvent.crossHairHide(that.type);
		that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
		that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
	    if(that.count === that.zoom_level+1) {
	    	that.zoomOut();
	    }
	    if(PykCharts['boolean'](that.annotation_enable)) {
        	that.annotation();
        }
	};

	that.zoomOut =  function () {
		that.optional_feature().createChart("liveData");
    	that.k.isOrdinal(that.svgContainer,".x.axis",that.xScale,that.xdomain,that.extra_left_margin);
	    that.k.isOrdinal(that.svgContainer,".x.grid",that.xScale);
	    that.k.isOrdinal(that.svgContainer,".y.axis",that.yScale,that.ydomain);
	    that.k.isOrdinal(that.svgContainer,".y.grid",that.yScale);
	};

	that.annotation = function () {
		that.line = d3.svg.line()
				.interpolate('linear-closed')
                .x(function(d,i) { return d.x; })
                .y(function(d,i) { return d.y; });

		if(that.type === "areaChart") {
			var arrow_size = 12,annotation = [];
			that.new_data[0].data.map(function (d) {
				if(d.annotation) {
					annotation.push({
						annotation : d.annotation,
						x : d.x,
						y : d.y
					})
				}
			});

			var anno = that.svgContainer.selectAll(that.selector + " .PykCharts-annotation-line")
                .data(annotation);
            anno.enter()
                .append("path");
            anno.attr("d", function (d,i) {
                	var a = [
                		{
                			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
                			y:parseInt(that.yScale(d.y)+that.margin_top - arrow_size)
                		},
                		{
                			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
                			y:parseInt(that.yScale(d.y)+that.margin_top - arrow_size)
                		}
                	];
                	return that.line(a);
                })
            setTimeout(function () {
	            anno.attr("class", "PykCharts-annotation-line")
	                .attr("d", function (d,i) {
	                	var a = [
	                		{
	                			x:parseInt(that.xScale(d.x)-(arrow_size*0.5))+that.extra_left_margin+that.margin_left,
	                			y:parseInt(that.yScale(d.y)-(arrow_size)+that.margin_top)
	                		},
	                		{
	                			x:parseInt(that.xScale(d.x)+(arrow_size*0.5))+that.extra_left_margin+that.margin_left,
	                			y:parseInt(that.yScale(d.y)-(arrow_size)+that.margin_top)
	                		},
	                		{
	                			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
	                			y:parseInt(that.yScale(d.y)+that.margin_top),
	                		}
                		];
	                	return that.line(a);
	                })
	                .attr("fill",that.annotation_background_color);
            }, that.transitions.duration());

            anno.exit().remove();
            that.k.annotation(that.selector + " #svg-1",annotation, that.xScale,that.yScale);

		} else if(that.type === "stackedAreaChart" && that.mode === "default") {
			var arrow_size = 12,annotation = [];
			for(i=0;i<that.new_data_length;i++) {
				that.new_data[i].data.map(function (d) {
					if(d.annotation) {
						annotation.push({
							annotation : d.annotation,
							x : d.x,
							y : d.y + d.y0
						});
					}
				});
			}

			var anno = that.svgContainer.selectAll(" .PykCharts-annotation-line")
                .data(annotation);
            anno.enter()
                .append("path");

            anno.attr("d", function (d,i) {
	            	var a = [
	            		{
	            			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
	            			y:parseInt(that.yScale(d.y)-(arrow_size)+that.margin_top+that.legendsGroup_height)
	            		},
	            		{
	            			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
	            			y:parseInt(that.yScale(d.y)-(arrow_size)+that.margin_top+that.legendsGroup_height)
	            		}
	            	];
	            	return that.line(a);
	            })
            setTimeout(function () {
	        	anno.attr("class", "PykCharts-annotation-line")
		            .attr("d", function (d,i) {
		            	var a = [
	                		{
	                			x:parseInt(that.xScale(d.x)-(arrow_size*0.5))+that.extra_left_margin+that.margin_left,
	                			y:parseInt(that.yScale(d.y)-(arrow_size)+that.margin_top+that.legendsGroup_height)
	                		},
	                		{
	                			x:parseInt(that.xScale(d.x)+(arrow_size*0.5))+that.extra_left_margin+that.margin_left,
	                			y:parseInt(that.yScale(d.y)-(arrow_size)+that.margin_top+that.legendsGroup_height)
	                		},
	                		{
	                			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
	                			y:parseInt(that.yScale(d.y)+that.margin_top+that.legendsGroup_height),
	                		}
                		];
		            	return that.line(a);
		            })
					.attr("fill",that.annotation_background_color);
            }, that.transitions.duration());

            anno.exit().remove();
            that.k.annotation(that.selector + " #svg-1",annotation,that.xScale,that.yScale)
		}
	};

	that.renderChart =  function () {
		that.optional_feature()
				.svgContainer(1)
				.legendsContainer()
				.legends()
				.createGroups(1)
				.createChart()
	    		.axisContainer();

	    that.k.crossHair(that.svgContainer,that.new_data_length,that.new_data,that.fillColor,that.type);
	};
};
PykCharts.multiD.bar = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    var multiDimensionalCharts = theme.multiDimensionalCharts;
    this.execute = function () {
        that = new PykCharts.multiD.processInputs(that, options, "bar");
        that.data_sort_enable = options.data_sort_enable ? options.data_sort_enable.toLowerCase() : multiDimensionalCharts.data_sort_enable;
        that.data_sort_type = PykCharts['boolean'](that.data_sort_enable) && options.data_sort_type ? options.data_sort_type.toLowerCase() : multiDimensionalCharts.data_sort_type;
        that.data_sort_order = PykCharts['boolean'](that.data_sort_enable) && options.data_sort_order ? options.data_sort_order.toLowerCase() : multiDimensionalCharts.data_sort_order;
        try{
            if(that.data_sort_order === "ascending" || that.data_sort_order === "descending") {
            } else {
                that.data_sort_order = multiDimensionalCharts.data_sort_order;
                throw "data_sort_order";
            }
        }
        catch(err) {
            that.k.warningHandling(err,"9");
        }
        if(that.stop)
            return;
         that.panels_enable = "no";

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
            that.data = that.k.__proto__._groupBy("bar",data);
            that.compare_data = that.k.__proto__._groupBy("bar",data);
            that.axis_x_data_format = "number";
            that.axis_y_data_format = that.k.yAxisDataFormatIdentification(that.data);
            if(that.axis_y_data_format === "time") {
                that.axis_y_data_format = "string";
            }
            $(that.selector+" #chart-loader").remove();
            $(options.selector).css("height","auto");
            that.render();
        };
        that.format = that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };

    this.transformData = function () {
        that.optionalFeatures().sort();
        that.data.forEach(function(d) {
            d.name = d.y;
        })
    }

    this.render = function () {
        var l = $(".svgcontainer").length;
        that.container_id = "svgcontainer" + l;

        that.border = new PykCharts.Configuration.border(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.mouseEvent1 = new PykCharts.multiD.mouseEvent(options);
        that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);
        that.transformData();

        // if(that.axis_x_data_format === "time") {
        //     that.data.forEach(function (d) {
        //         d.x =that.k.dateConversion(d.x);
        //     });
        // }

        that.map_group_data = that.multiD.mapGroup(that.data);

        if(that.mode === "default") {

            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+that.container_id,"barChart")
                .emptyDiv()
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
                .createColumn()
                .axisContainer()
                .ticks();

            that.k.xAxis(that.svgContainer,that.xgroup,that.xScale,that.extra_left_margin,that.x_domain,that.x_tick_values)
                .xAxisTitle(that.xgroup)
                .yAxisTitle(that.ygroup);
            if(that.axis_y_data_format !== "string") {
                that.k.yAxis(that.svgContainer,that.ygroup,that.yScale,that.y_domain,that.y_tick_values,null,"bar");
                that.optionalFeatures().newYAxis();
            } else {
                that.k.yAxis(that.svgContainer,that.ygroup,that.yScale,that.y_domain,that.y_tick_values);
            }
        } else if(that.mode === "infographics") {
            that.k.backgroundColor(that)
                .export(that,"#"+that.container_id,"barChart")
                .emptyDiv()
                .makeMainDiv(that.selector,1);

            that.optionalFeatures()
                .svgContainer(1)
                .createGroups();

            that.k.liveData(that)
                .tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

            that.optionalFeatures()
                .createColumn()
                .axisContainer()
                .ticks();
            
            that.k.xAxis(that.svgContainer,that.xgroup,that.xScale,that.extra_left_margin,that.x_domain,that.x_tick_values)
                .xAxisTitle(that.xgroup)
                .yAxisTitle(that.ygroup);
            if(that.axis_y_data_format !== "string") {
                that.k.yAxis(that.svgContainer,that.ygroup,that.yScale,that.y_domain,that.y_tick_values,null,"bar");
                that.optionalFeatures().newYAxis();
            } else {
                that.k.yAxis(that.svgContainer,that.ygroup,that.yScale,that.y_domain,that.y_tick_values);
            }
        }
        that.k.exportSVG(that,"#"+that.container_id,"barChart")
        $(document).ready(function () { return that.k.resize(that.svgContainer,""); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer,""); });

    };

    this.refresh = function () {
       that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("bar",data);
            that.refresh_data = that.k.__proto__._groupBy("bar",data);
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            that.transformData();

            if(that.axis_x_data_format === "time") {
                that.data.forEach(function (d) {
                    d.x =that.k.dateConversion(d.x);
                });
            }

        that.map_group_data = that.multiD.mapGroup(that.data);

            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }

            that.optionalFeatures()
                .createColumn()
                .ticks();

            that.k.xAxis(that.svgContainer,that.xgroup,that.xScale,that.extra_left_margin,that.x_domain,that.x_tick_values);
            if(that.axis_y_data_format !== "string") {
                that.k.yAxis(that.svgContainer,that.ygroup,that.yScale,that.y_domain,that.y_tick_values,null,"bar");
                that.optionalFeatures().newYAxis();
            } else {
                that.k.yAxis(that.svgContainer,that.ygroup,that.yScale,that.y_domain,that.y_tick_values);
            }
        };
        
        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
    };

    this.optionalFeatures = function () {
        var status;
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
            createGroups: function (i) {
                that.group = that.svgContainer.append("g")
                    .attr("id","svggroup")
                    .attr("class","svggroup")
                    .attr("transform","translate(" + that.margin_left + "," + (that.margin_top/* + that.legendsGroup_height*/) +")");

                if(PykCharts.boolean(that.grid_y_enable)) {
                    that.group.append("g")
                        .attr("id","ygrid")
                        .style("stroke",that.grid_color)
                        .attr("class","y grid-line");

                }
                return this;
            },
             newYAxis : function () {
                if(PykCharts["boolean"](that.axis_y_enable)) {
                    if(that.axis_y_position === "right") {
                        gsvg.attr("transform", "translate(" + (that.width - that.margin_left - that.margin_right) + ",0)");
                    }
                    var yaxis = d3.svg.axis()
                        .scale(that.yScale)
                        .orient(that.axis_y_pointer_position)
                        .tickSize(0)
                        .outerTickSize(that.axis_y_outer_pointer_length);
                    that.new_yAxisgroup.style("stroke",function () { return that.axis_y_line_color; })
                        .call(yaxis);
                    d3.selectAll(that.selector + " .y.new-axis text").style("display",function () { return "none"; })
                        .style("stroke","none");
                }
                return this;
            },
            axisContainer : function () {
                if(PykCharts.boolean(that.axis_x_enable)  || that.axis_x_title) {
                    that.xgroup = that.group.append("g")
                        .attr("id","xaxis")
                        .attr("class", "x axis")
                        .style("stroke","none");
                }

                if(PykCharts.boolean(that.axis_y_enable)  || that.axis_y_title) {
                    that.ygroup = that.group.append("g")
                        .attr("id","yaxis")
                        .attr("class","y axis");
                    that.new_yAxisgroup = that.group.append("g")
                        .attr("class", "y new-axis")
                        .attr("id","new-yaxis")
                        .style("stroke","blue");
                    
                }
                return this;
            },
            createColumn: function () {
                that.x_tick_values = that.k.processXAxisTickValues();
                that.y_tick_values = that.k.processYAxisTickValues();
                that.reducedWidth = that.width - that.margin_left - that.margin_right;
                that.reducedHeight = that.height - that.margin_top - that.margin_bottom;
                var height = that.height - that.margin_top - that.margin_bottom;
                var x_domain,x_data = [],y_data = [],y_range,x_range,y_domain, min_x_tick_value,max_x_tick_value, min_y_tick_value,max_y_tick_value;

                if(that.axis_y_data_format === "number") {
                    y_domain = [0,d3.max(that.data,function (d) { return d.y; })];
                    y_data = that.k._domainBandwidth(y_domain,1);
                    y_range = [that.height - that.margin_top - that.margin_bottom, 0];
                    min_y_tick_value = d3.min(that.y_tick_values);
                    max_y_tick_value = d3.max(that.y_tick_values);

                    if(y_data[0] > min_y_tick_value) {
                        y_data[0] = min_y_tick_value;
                    }
                    if(y_data[1] < max_y_tick_value) {
                        y_data[1] = max_y_tick_value;
                    }
                    that.data.sort(function (a,b) {
                        return a.y - b.y;
                    })
                    that.yScale1 = that.k.scaleIdentification("linear",y_data,y_range);
                    y_data1 = that.data.map(function (d) { return d.y; });
                    y_range1 = [0,that.height - that.margin_top - that.margin_bottom];
                    that.yScale = that.k.scaleIdentification("ordinal",y_data1,y_range1,0.3);
                    that.extra_top_margin = (that.yScale.rangeBand() / 2);

                } else if(that.axis_y_data_format === "string") {
                    y_data = that.data.map(function (d) { return d.y; });
                    y_range = [0,that.height - that.margin_top - that.margin_bottom];
                    that.yScale = that.k.scaleIdentification("ordinal",y_data,y_range,0.3);
                    that.extra_top_margin = (that.yScale.rangeBand() / 2);

                }

                if(that.axis_x_data_format === "number") {
                    x_domain = [0,d3.max(that.data,function (d) {  return d.x; })];
                    x_data = that.k._domainBandwidth(x_domain,1);
                    x_range = [0 ,that.reducedWidth];
                    min_x_tick_value = d3.min(that.x_tick_values);
                    max_x_tick_value = d3.max(that.x_tick_values);

                    if(x_data[0] > min_x_tick_value) {
                        x_data[0] = min_x_tick_value;
                    }
                    if(x_data[1] < max_x_tick_value) {
                        x_data[1] = max_x_tick_value;
                    }

                    that.xScale = that.k.scaleIdentification("linear",x_data,x_range);
                    that.extra_left_margin = 0;
                }

                that.x_domain = that.xScale.domain();
                that.y_domain = that.yScale.domain();
                
                that.bar = that.group.selectAll(".bar")
                    .data(that.data)

                that.bar.enter()
                    .append("g")
                    .attr("class","bar")
                    .append("svg:rect");

                that.bar.attr("class","bar")
                    .select("rect")
                    .attr("class","hbar")
                    .attr("y", function (d) { return that.yScale(d.y); })
                    .attr("x", 0)
                    .attr("height",function (d) { 
                        return (that.reducedHeight/(that.data.length))-(0.03*that.reducedHeight); 
                    })
                    .attr("width",0)
                    .attr("fill", function (d) { return that.fillColor.colorPieMS(d); })
                    .attr("stroke", that.border.color())
                    .attr("stroke-width",that.border.width())
                    .on('mouseover',function (d) {
                        if(that.mode === "default") {
                            if(PykCharts.boolean(that.onhover_enable)) {
                                that.mouseEvent1.highlight(that.selector+" "+".hbar", this);
                            }
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(d.tooltip ? d.tooltip : d.x);
                        }
                    })
                    .on('mouseout',function (d) {
                        if(that.mode === "default") {
                            if(PykCharts.boolean(that.onhover_enable)) {
                                that.mouseEvent1.highlightHide(that.selector+" "+".hbar");
                            }
                            that.mouseEvent.tooltipHide(d);
                            that.mouseEvent.axisHighlightHide(that.selector+" "+".y.axis")
                        }
                    })
                    .on('mousemove', function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.axisHighlightShow([d.y],that.selector+" "+".y.axis",that.y_domain);
                        }                       
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("width", function (d) { return that.xScale(d.x); });

                that.bar.exit()
                    .remove();
                var t = d3.transform(d3.select(d3.selectAll(options.selector + ' .bar')[0][(that.data.length-1)]).attr("transform")),
                    x = t.translate[0],
                    y = t.translate[1];
                y_range = [(that.reducedHeight - y - (that.yScale.rangeBand()/2)),(y + (that.yScale.rangeBand()/2))];
                that.yScale1 = that.k.scaleIdentification("linear",y_data,y_range);
                return this;
            },
            ticks: function() {
                if(that.pointer_size) {
                    var tick_label = that.group.selectAll(".tickLabel")
                        .data(that.data);

                    tick_label.enter()
                        .append("text")

                    tick_label.attr("class","tickLabel");

                    setTimeout(function () {
                        tick_label.attr("x", function (d) { return that.xScale(d.x); })
                            .attr("y",function (d) { return that.yScale(d.name) + ((that.reducedHeight/(that.data.length))-(0.03*that.reducedHeight))/2; })
                            .attr("dx",4)
                            .attr("dy",4)
                            .style("font-weight", that.pointer_weight)
                            .style("font-size", that.pointer_size + "px")
                            .attr("fill", that.pointer_color)
                            .style("font-family", that.pointer_family)
                            .text(function (d) { 
                                if(d.x) {
                                    that.txt_width = this.getBBox().width;
                                    that.txt_height = this.getBBox().height;
                                    if(d.x && (that.txt_width< that.xScale(d.x)) && (that.txt_height < ((that.reducedHeight/(that.data.length))-(0.03*that.reducedHeight)))) {
                                        return d.x;
                                    }
                                }
                                return (d.x).toFixed(); 
                            });
                    }, that.transitions.duration());
                }
                return this;
            },
            sort : function () {
                if(that.axis_y_data_format === "string") {
                    try {
                        if(that.data_sort_type === "alphabetically" || that.data_sort_type === "numerically") {
                        } else {
                            that.data_sort_type = multiDimensionalCharts.data_sort_type;
                            throw "data_sort_type";
                        }
                    }
                    catch(err) {
                        that.k.warningHandling(err,"8");
                    }
                    var column_to_be_sorted = "";
                    switch (that.data_sort_type) {
                        case "alphabetically":
                        case "date":            column_to_be_sorted = "y";
                                                break;
                        case "numerically":     column_to_be_sorted = "x";
                                                break;
                    }
                    that.data = that.k.__proto__._sortData(that.data, column_to_be_sorted, "group", that);
                }
            }
        };
        return optional;
    };
};
PykCharts.multiD.groupedBar = function(options){
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    var multiDimensionalCharts = theme.multiDimensionalCharts;
    this.execute = function () {
        that = new PykCharts.multiD.processInputs(that, options, "bar");

        that.data_sort_enable = options.data_sort_enable ? options.data_sort_enable.toLowerCase() : multiDimensionalCharts.data_sort_enable;
        that.data_sort_type = PykCharts['boolean'](that.data_sort_enable) && options.data_sort_type ? options.data_sort_type.toLowerCase() : multiDimensionalCharts.data_sort_type;
        that.data_sort_order = PykCharts['boolean'](that.data_sort_enable) && options.data_sort_order ? options.data_sort_order.toLowerCase() : multiDimensionalCharts.data_sort_order;

        try {
            if(that.data_sort_order === "ascending" || that.data_sort_order === "descending") {
            } else {
                that.data_sort_order = multiDimensionalCharts.data_sort_order;
                throw "data_sort_order";
            }
        }
        catch(err) {
            that.k.warningHandling(err,"9");
        }
        
        if(that.stop)
            return;
        that.grid_color = options.chart_grid_color ? options.chart_grid_color : theme.stylesheet.chart_grid_color;
         that.panels_enable = "no";

        if(that.mode === "default") {
           that.k.loading();
        }
        that.multiD = new PykCharts.multiD.configuration(that);

        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(that.selector+" #chart-loader").remove();
                $(options.selector).css("height","auto");
                return;
            }
            that.data = that.k.__proto__._groupBy("bar",data);
            that.compare_data = that.k.__proto__._groupBy("bar",data);
            that.axis_x_data_format = "number";
            that.axis_y_data_format = that.k.yAxisDataFormatIdentification(that.data);
            if(that.axis_y_data_format === "time") {
                that.axis_y_data_format = "string";
            }

            $(that.selector+" #chart-loader").remove();
            $(options.selector).css("height","auto");
            // PykCharts.multiD.columnFunctions(options,that,"group_bar");
            that.render();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };

    that.dataTransformation = function () {
        that.optionalFeatures().sort();
        that.group_arr = [], that.new_data = [];
        that.data_length = that.data.length;
        for(j = 0;j < that.data_length;j++) {
            that.group_arr[j] = that.data[j].y;
        }
        that.uniq_group_arr = _.unique(that.group_arr);
        var len = that.uniq_group_arr.length;
        
        for (k = 0;k < len;k++) {
            that.new_data[k] = {
                    name: that.uniq_group_arr[k],
                    data: []
            };
            for (l = 0;l < that.data_length;l++) {
                if (that.uniq_group_arr[k] === that.data[l].y) {
                    that.new_data[k].data.push({
                        x: that.data[l].x,
                        name: that.data[l].group,
                        tooltip: that.data[l].tooltip,
                        color: that.data[l].color
                    });
                }
            }
        }
        that.new_data_length = that.new_data.length;
    };

    that.refresh = function () {
        that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("bar",data);
            that.refresh_data = that.k.__proto__._groupBy("bar",data);
            that.map_group_data = that.multiD.mapGroup(that.data);
            that.dataTransformation();
            that.optionalFeatures().mapColors();

            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }

            that.optionalFeatures()
                    .createChart()
                    .legends()
                    .ticks()
                    .highlightRect();

            that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
            .yGrid(that.svgContainer,that.group,that.yScale,that.legendsGroup_width);
            if(that.axis_y_data_format !== "string") {
                that.k.yAxis(that.svgContainer,that.yGroup,that.yScale1,that.ydomain,that.y_tick_values,that.legendsGroup_width,"groupbar");
                that.optionalFeatures().newYAxis();
            } else {
                that.k.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width);
            }
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
    };

    that.render = function() {
        var that = this;
        var l = $(".svgcontainer").length;
        that.container_id = "svgcontainer" + l;

        that.map_group_data = that.multiD.mapGroup(that.data);
        that.dataTransformation();
        that.optionalFeatures().mapColors();

        that.border = new PykCharts.Configuration.border(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.mouseEvent1 = new PykCharts.multiD.mouseEvent(that);
        that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);

        if(that.mode === "default") {
            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+that.container_id,"groupbarChart")
                .emptyDiv()
                .subtitle()
                .makeMainDiv(that.selector,1);

            that.optionalFeatures()
                .svgContainer(1)
                .legendsContainer(1);

            that.k.liveData(that)
                .tooltip()
                .createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

            that.optionalFeatures()
                .legends()
                .createGroups(1)
                .createChart()
                .axisContainer()
               .highlightRect()
               .ticks();

        
            that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
                .xAxisTitle(that.xGroup)
                .yAxisTitle(that.yGroup);
            if(that.axis_y_data_format !== "string") {
                that.k.yAxis(that.svgContainer,that.yGroup,that.yScale1,that.ydomain,that.y_tick_values,that.legendsGroup_width,"groupbar");
                that.optionalFeatures().newYAxis();
            } else {
                that.k.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width);
            }
        } else if(that.mode === "infographics") {
            that.k.backgroundColor(that)
                .export(that,"#"+that.container_id,"groupbarChart")
                .emptyDiv()
                .makeMainDiv(that.selector,1);

            that.optionalFeatures().svgContainer(1)
                .legendsContainer(1)
                .createGroups(1)
                .createChart()
                .axisContainer()
                .highlightRect();

            that.k.tooltip();
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
            that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
                .xAxisTitle(that.xGroup)
                .yAxisTitle(that.yGroup);
            if(that.axis_y_data_format !== "string") {
                that.k.yAxis(that.svgContainer,that.yGroup,that.yScale1,that.ydomain,that.y_tick_values,that.legendsGroup_width,"groupbar");
                that.optionalFeatures().newYAxis();
            } else {
                that.k.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width);
            }
        }

        that.k.exportSVG(that,"#"+that.container_id,"groupbarChart")
        $(document).ready(function () { return that.k.resize(that.svgContainer,""); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer,""); });
    };

    that.optionalFeatures = function() {
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
            createGroups: function (i) {
                that.group = that.svgContainer.append("g")
                    .attr("id","svggroup")
                    .attr("class","svggroup")
                    .attr("transform","translate(" + that.margin_left + "," + (that.margin_top + that.legendsGroup_height) +")");
                
                return this;
            },
            legendsContainer: function (i) {
                if(PykCharts.boolean(that.legends_enable) && that.mode === "default") {

                    that.legendsGroup = that.svgContainer.append("g")
                        .attr("id","legends")
                        .attr("class","legends")
                        .style("visibility","hidden")
                        .attr("transform","translate(0,10)");

                } else {
                    that.legendsGroup_height = 0;
                    that.legendsGroup_width = 0;
                }
                return this;
            },
            axisContainer : function () {
                if(PykCharts.boolean(that.axis_x_enable) || that.axis_x_title) {
                    that.xGroup = that.group.append("g")
                        .attr("class", "x axis")
                        .attr("id","xaxis")
                        .style("stroke","black");
                }

                if(PykCharts.boolean(that.axis_y_enable) || that.axis_y_title) {
                    that.yGroup = that.group.append("g")
                        .attr("class", "y axis")
                        .attr("id","yaxis")
                        .style("stroke","blue");
                    that.new_yAxisgroup = that.group.append("g")
                        .attr("class", "y new-axis")
                        .attr("id","new-yaxis")
                        .style("stroke","blue");
                    
                }
                return this;
            },  
            createChart: function() {
                that.reduced_width = that.width - that.margin_left - that.margin_right - that.legendsGroup_width;

                that.reduced_height = that.height - that.margin_top - that.margin_bottom - that.legendsGroup_height;

                that.getuniqueGroups = _.map(that.data,function(d) {
                    return d.group;
                })

                that.getuniqueGroups = _.unique(that.getuniqueGroups)

                that.x_tick_values = that.k.processXAxisTickValues();
                that.y_tick_values = that.k.processYAxisTickValues();

                var x_domain,x_data = [],y_data,y_range,x_range,y_domain,min_x_tick_value,max_x_tick_value, min_y_tick_value,max_y_tick_value;

                if(that.axis_y_data_format === "number") {
                    max = d3.max(that.new_data, function(d) { return d.name });
                    min = d3.min(that.new_data, function(d) { return d.name });
                    y_domain = [min,max];
                    // y_data = that.k.__proto__._domainBandwidth(y_domain,2);
                    y_data = y_domain;

                    min_y_tick_value = d3.min(that.y_tick_values);
                    max_y_tick_value = d3.max(that.y_tick_values);

                    if(y_data[0] > min_y_tick_value) {
                        y_data[0] = min_y_tick_value;
                    }
                    if(y_data[1] < max_y_tick_value) {
                        y_data[1] = max_y_tick_value;
                    }
   
                    that.new_data.sort(function (a,b) {
                        return a.name - b.name;
                    })
                    y_data1 = that.new_data.map(function (d) { return d.name; });
                    y_range1 = [that.reduced_height,0];
                    that.yScale = that.k.scaleIdentification("ordinal",y_data1,y_range1,0.3);
                    that.extra_top_margin = (that.yScale.rangeBand() / 2);
                    that.y1 = d3.scale.ordinal()
                        .domain(that.getuniqueGroups)
                        .rangeRoundBands([that.yScale.rangeBand(),0]) ;
                    that.extra_top_margin = 0;
                } else if(that.axis_y_data_format === "string") {
                    y_data = that.new_data.map(function (d) { return d.name; });
                    y_range = [0,that.reduced_height];
                    that.yScale = that.k.scaleIdentification("ordinal",y_data,y_range,0.3);
                    that.extra_top_margin = (that.yScale.rangeBand() / 2);
                    that.y1 = d3.scale.ordinal()
                        .domain(that.getuniqueGroups)
                        .rangeRoundBands([0, that.yScale.rangeBand()]) ;
                }

                if(that.axis_x_data_format === "number") {
                    that.max_x_value = d3.max(that.new_data, function(d) { return d3.max(d.data, function(d) { return d.x; }); });

                    x_domain = [0,that.max_x_value];
                    x_data = that.k._domainBandwidth(x_domain,1);
                    x_range = [0 ,that.reduced_width];
                    min_x_tick_value = d3.min(that.x_tick_values);
                    max_x_tick_value = d3.max(that.x_tick_values);

                    if(x_data[0] > min_x_tick_value) {
                        x_data[0] = min_x_tick_value;
                    }
                    if(x_data[1] < max_x_tick_value) {
                        x_data[1] = max_x_tick_value;
                    }

                    that.xScale = that.k.scaleIdentification("linear",x_data,x_range);
                    that.extra_left_margin = 0;
                }

                that.xdomain = that.xScale.domain();
                that.ydomain = that.yScale.domain();
                that.highlight_x_positions =  [];
                var chart = that.group.selectAll(".bar-group")
                    .data(that.new_data);
                
                chart.enter()
                    .append("g")
                    .attr("class", "bar-group");

                that.highlight_y_positions = "";
                    
                chart
                    .attr("transform", function (d) {
                        that.optionalFeatures().checkIfHighLightDataExists(d.name); 
                        if(that.highlight_group_exits) {
                            that.flag = true;
                            that.highlight_y_positions = that.yScale(d.name);
                        }
                        return "translate(" + 0 + "," + that.yScale(d.name) + ")"; 
                    })
                    .on('mouseout',function (d) {
                        if(that.mode === "default") {
                            if(PykCharts.boolean(that.onhover_enable)) {
                                that.mouseEvent.highlightGroupHide(that.selector+" "+".bar-group","rect");
                            }
                            that.mouseEvent.axisHighlightHide(that.selector+" "+".y.axis")
                        }
                    })
                    .on('mousemove', function (d) {
                        if(that.mode === "default") {
                            if(PykCharts.boolean(that.onhover_enable)) {
                                that.mouseEvent.highlightGroup(that.selector+" "+".bar-group", this, "rect");
                            }
                            that.mouseEvent.axisHighlightShow([d.name],that.selector+" "+".y.axis",that.xdomain,"bar");
                        }
                    });

                var bar = chart.selectAll("rect")
                            .data(function (d) { return d.data; });

                bar.enter()
                    .append("rect")
                      
                bar.attr("height", 0)
                    .attr("y", function (d) {return that.y1(d.name); })
                    .attr("x", 0)
                    .attr("width",0)
                    .attr("height", function (d){ return 0.98*that.y1.rangeBand(); })
                    .attr("fill", function (d,i) {
                        return that.fillColor.colorGroup(d);
                    })
                    .attr("fill-opacity", function (d,i) {
                        if (that.color_mode === "saturation") {
                            return (i+1)/that.no_of_groups;
                        } else {
                            return 1;
                        }
                    })
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("data-fill-opacity",function () {
                        return $(this).attr("fill-opacity");
                    })
                    .on('mouseover',function (d) {
                        if(that.mode === "default") {
                            var tooltip = d.tooltip ? d.tooltip : d.x;
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(tooltip);
                        }
                    })
                    .on('mouseout',function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipHide(d);
                        }
                    })
                    .on('mousemove', function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                        }

                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("width", function (d) { return that.xScale(d.x); })
                bar.exit().remove();
                chart.exit().remove(); 

                var t = d3.transform(d3.select(d3.selectAll('.bar-group')[0][(that.new_data.length-1)]).attr("transform")),
                    x = t.translate[0],
                    y = t.translate[1];
                y_range = [(that.reduced_height-y - (that.y1.rangeBand()*2)),(y + (that.y1.rangeBand()*2))];
                that.yScale1 = that.k.scaleIdentification("linear",y_data,y_range);

                return this;
            },
            ticks : function(){
                if(that.pointer_size) {
                    var ticks = that.group.selectAll(".g")
                                                .data(that.new_data);
                    ticks.enter()
                        .append("g")
                        .attr("class","g");
                    ticks.attr("transform", function (d) {
                        return "translate(" + 0 + "," + that.yScale(d.name) + ")"; 
                    })
                    var tick_label = ticks.selectAll(".tickLabel")
                                            .data(function (d) { return d.data; });

                    tick_label.enter()
                                .append("text")
                          
                    tick_label.attr("class","tickLabel")
                        .text("");

                    setTimeout(function () {
                        tick_label.attr("x", function (d) { return that.xScale(d.x); })
                            .attr("y",function(d) { return (that.y1(d.name))+(that.y1.rangeBand()/2); })
                            .attr("dx",4)
                            .attr("dy",2)
                            .transition()
                            .text(function (d) { 
                                if(d.x) {
                                    return (d.x).toFixed(); 
                                }
                            })
                            .attr("pointer-events","none")
                            .style("font-weight", that.pointer_weight)
                            .style("font-size", that.pointer_size + "px")
                            .attr("fill", that.pointer_color)
                            .style("font-family", that.pointer_family)
                            .text(function (d) { 
                                if(d.x) {
                                    that.txt_width = this.getBBox().width;
                                    that.txt_height = this.getBBox().height;
                                    if(d.x && (that.txt_width< that.xScale(d.x)) && (that.txt_height < (that.y1.rangeBand() ))) {
                                        return d.x;
                                    }
                                } 
                            });
                    },that.transitions.duration());

                    tick_label.exit().remove();
                    ticks.exit().remove();
                }
                return this;
            },
            mapColors : function () {
                that.no_of_groups = d3.max(that.new_data,function (d){
                    return d.data.length;
                });

                for(var i = 0;that.new_data.length;i++) {
                    if(that.new_data[i].data.length === that.no_of_groups) {
                        that.group_data = that.new_data[i].data;
                        break;
                    }
                }
                that.new_data.forEach(function(d){
                    d.data.forEach(function(data){
                        data.color = _.find(that.group_data,function(d) {
                            return d.name === data.name;
                        }).color;
                    })
                });
            },
            legends: function () {
                if(PykCharts.boolean(that.legends_enable)) {
                    var params = that.group_data,color;

                    color = params.map(function (d) {
                        return d.color;
                    });

                    params = params.map(function (d) {
                        return d.name;
                    });

                    params = _.uniq(params);
                    var j = 0,k = 0;
                    j = params.length;
                    k = params.length;

                    if(that.legends_display === "vertical" ) {
                        that.legendsGroup.attr("height", (params.length * 30)+20);
                        that.legendsGroup_height = 0;

                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        text_parameter1value = function (d,i) { return 36; };
                        rect_parameter3value = function (d,i) { return 20; };
                        var rect_parameter4value = function (d,i) { return i * 24 + 12;};
                        var text_parameter2value = function (d,i) { return i * 24 + 23;};
                    }
                    else if(that.legends_display === "horizontal") {
                        that.legendsGroup_height = 50;
                        temp_i = j;
                        final_rect_x = 0;
                        final_text_x = 0;
                        legend_text_widths = [];
                        sum_text_widths = 0;
                        temp_text = temp_rect = 0;
                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";
                        var text_parameter1value = function (d,i) {
                            legend_text_widths[i] = this.getBBox().width;
                            legend_start_x = 16;
                            final_text_x = (i === 0) ? legend_start_x : (legend_start_x + temp_text);
                            temp_text = temp_text + legend_text_widths[i] + 30;
                            return final_text_x;
                        };
                        text_parameter2value = 30;
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        var rect_parameter3value = function (d,i) {
                            final_rect_x = (i === 0) ? 0 : temp_rect;
                            temp_rect = temp_rect + legend_text_widths[i] + 30;
                            return final_rect_x;
                        };
                        rect_parameter4value = 18;
                    }

                    var legend = that.legendsGroup.selectAll(".legends-rect")
                                    .data(params);

                    that.legends_text = that.legendsGroup.selectAll(".legends_text")
                        .data(params);

                    that.legends_text.enter()
                        .append('text');

                    that.legends_text.attr("class","legends_text")
                        .attr("pointer-events","none")
                        .text(function (d) { return d; })
                        .attr("fill", that.legends_text_color)
                        .attr("font-family", that.legends_text_family)
                        .attr("font-size",that.legends_text_size+"px")
                        .attr("font-weight", that.legends_text_weight)
                        .attr(text_parameter1, text_parameter1value)
                        .attr(text_parameter2, text_parameter2value);

                    legend.enter()
                        .append("rect");

                    legend.attr("class","legends-rect")
                        .attr(rect_parameter1, rect_parameter1value)
                        .attr(rect_parameter2, rect_parameter2value)
                        .attr(rect_parameter3, rect_parameter3value)
                        .attr(rect_parameter4, rect_parameter4value)
                        .attr("fill", function (d,i) {
                            if(that.color_mode === "color")
                                return color[i];
                            else return that.saturation_color
                        })
                        .attr("fill-opacity", function (d,i) {
                            if (that.color_mode === "saturation") {
                                return (i+1)/that.no_of_groups;
                            }
                        });

                    var legend_container_width = that.legendsGroup.node().getBBox().width,translate_x;

                    if(that.legends_display === "vertical") {
                        that.legendsGroup_width = legend_container_width + 20;
                    } else  {
                        that.legendsGroup_width = 0;
                    }

                    translate_x = (that.legends_display === "vertical") ? (that.width - that.legendsGroup_width) : (that.width - legend_container_width - 20);

                    if (legend_container_width < that.width) { that.legendsGroup.attr("transform","translate("+translate_x+",10)"); }
                    that.legendsGroup.style("visibility","visible");

                    that.legends_text.exit().remove();
                    legend.exit().remove();
                }
                return this;
            },
            checkIfHighLightDataExists : function (name) {
                if(that.highlight) {
                    if(that.axis_y_data_format === "number") {
                        that.highlight_group_exits = (that.highlight === name);
                    } else if (that.axis_y_data_format === "string") {
                        that.highlight_group_exits = (that.highlight.toLowerCase() === name.toLowerCase());
                    }
                }
                return this;
            },
            highlightRect : function () {
                if(that.flag) {
                    setTimeout(function() {
                        y = that.highlight_y_positions - 5;                    
                    
                        var highlight_rect = that.group.selectAll(".highlight-rect")
                            .data([that.highlight])

                        highlight_rect.enter()
                            .append("rect")

                        highlight_rect.attr("class","highlight-rect")
                            .attr("x", 0)
                            .attr("y", y)
                            .attr("height", (that.y1.rangeBand()* that.group_data.length)+10)
                            .attr("width", that.reduced_width+ 5) 
                            .attr("fill","none")
                            .attr("stroke", that.highlight_color)
                            .attr("stroke-width", "1.5px")
                            .attr("stroke-dasharray", "5,5")
                            .attr("stroke-opacity",1);
                        highlight_rect.exit()
                            .remove();
                        if(PykCharts["boolean"](that.highlight_y_positions)) {
                            highlight_array = that.highlight;
                        } else {
                            highlight_rect
                                .remove()
                        }
                    }, that.transitions.duration());
                }
                return this;
            },
            newYAxis : function () {
                if(PykCharts["boolean"](that.axis_y_enable)) {
                    if(that.axis_y_position === "right") {
                        that.new_yAxisgroup.attr("transform", "translate(" + (that.width - that.margin_left - that.margin_right - that.legendsGroup_width) + ",0)");
                    }
                    var yaxis = d3.svg.axis()
                        .scale(that.yScale)
                        .orient(that.axis_y_pointer_position)
                        .tickSize(0)
                        .outerTickSize(that.axis_y_outer_pointer_length);
                    that.new_yAxisgroup.style("stroke",function () { return that.axis_y_line_color; })
                        .call(yaxis);
                    d3.selectAll(that.selector + " .y.new-axis text").style("display",function () { return "none"; })
                        .style("stroke","none");
                }
                return this;
            },
            sort : function() {
                if(that.axis_y_data_format === "string") {
                    try {
                        if(that.data_sort_type === "alphabetically") {
                            that.data = that.k.__proto__._sortData(that.data, "y", "group", that);
                        } else {
                            that.data_sort_type = multiDimensionalCharts.data_sort_type;
                            throw "data_sort_type";
                        }
                    }
                    catch(err) {
                        that.k.warningHandling(err,"8");
                    }
                }
                return this;
            }
        }
        return optional;
    };
};
PykCharts.multiD.column = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function () {
        that = new PykCharts.multiD.processInputs(that, options, "column");
        if(that.stop)
            return;
        that.grid_color = options.chart_grid_color ? options.chart_grid_color : theme.stylesheet.chart_grid_color;
         that.panels_enable = "no";

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
            that.data = that.k.__proto__._groupBy("column",data);
            that.compare_data = that.k.__proto__._groupBy("column",data);
            that.axis_y_data_format = "number";
            that.axis_x_data_format = that.k.xAxisDataFormatIdentification(that.data);
            if(that.axis_x_data_format === "time" && that.axis_x_time_value_datatype === "") {
                console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to have passed Date data so please pass the value for axis_x_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
            }
            $(that.selector+" #chart-loader").remove();
            $(options.selector).css("height","auto");
            that.render();
        };
        that.format = that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };

    this.transformData = function () {
        that.data.forEach(function(d){
            d.name = d.x;
        })
    }

    this.render = function () {
        var l = $(".svgcontainer").length;
        that.container_id = "svgcontainer" + l;

        that.border = new PykCharts.Configuration.border(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.mouseEvent1 = new PykCharts.multiD.mouseEvent(options);
        that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);
        that.transformData();

        if(that.axis_x_data_format === "time") {
            that.data.forEach(function (d) {
                d.x =that.k.dateConversion(d.x);
            });
        }

        that.map_group_data = that.multiD.mapGroup(that.data);

        if(that.mode === "default") {

            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+that.container_id,"columnChart")
                .emptyDiv()
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
                .createColumn()
                .axisContainer();

            that.k.yAxis(that.svgContainer,that.ygroup,that.yScale,that.y_domain,that.y_tick_values)
                .yGrid(that.svgContainer,that.group,that.yScale)
                .xAxisTitle(that.xgroup)
                .yAxisTitle(that.ygroup);
            if(that.axis_x_data_format !== "string") {
                that.k.xAxis(that.svgContainer,that.xgroup,that.xScale,that.extra_left_margin,that.x_domain,that.x_tick_values,null,"bar")
                that.optionalFeatures().newXAxis();
            } else {
                that.k.xAxis(that.svgContainer,that.xgroup,that.xScale,that.extra_left_margin,that.x_domain,that.x_tick_values)
            }

        } else if(that.mode === "infographics") {
            that.k.backgroundColor(that)
                .export(that,"#"+that.container_id,"columnChart")
                .emptyDiv()
                .makeMainDiv(that.selector,1);

            that.optionalFeatures()
                .svgContainer(1)
                .createGroups();

            that.k.liveData(that)
                .tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

            that.optionalFeatures()
                .createColumn()
                .axisContainer();

            that.k.yAxis(that.svgContainer,that.ygroup,that.yScale,that.y_domain,that.y_tick_values)
                .xAxisTitle(that.xgroup)
                .yAxisTitle(that.ygroup);
            if(that.axis_x_data_format !== "string") {
                that.k.xAxis(that.svgContainer,that.xgroup,that.xScale,that.extra_left_margin,that.x_domain,that.x_tick_values,null,"bar")
                that.optionalFeatures().newXAxis();
            } else {
                that.k.xAxis(that.svgContainer,that.xgroup,that.xScale,that.extra_left_margin,that.x_domain,that.x_tick_values)
            }
        }
        that.k.exportSVG(that,"#"+that.container_id,"columnChart")
        $(document).ready(function () { return that.k.resize(that.svgContainer,""); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer,""); });

    };

    this.refresh = function () {
       that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("column",data);
            that.refresh_data = that.k.__proto__._groupBy("column",data);
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            that.transformData();
            if(that.axis_x_data_format === "time") {
                that.data.forEach(function (d) {
                    d.x =that.k.dateConversion(d.x);
                });
            }

        that.map_group_data = that.multiD.mapGroup(that.data);

            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }

            that.optionalFeatures()
                .createColumn();

            that.k.yAxis(that.svgContainer,that.ygroup,that.yScale,that.y_domain,that.y_tick_values)
                .yGrid(that.svgContainer,that.group,that.yScale);
            if(that.axis_x_data_format !== "string") {
                that.k.xAxis(that.svgContainer,that.xgroup,that.xScale,that.extra_left_margin,that.x_domain,that.x_tick_values,null,"bar")
                that.optionalFeatures().newXAxis();
            } else {
                that.k.xAxis(that.svgContainer,that.xgroup,that.xScale,that.extra_left_margin,that.x_domain,that.x_tick_values)
            }
        };
        
        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
    };

    this.optionalFeatures = function () {
        var status;
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
            createGroups: function (i) {
                that.group = that.svgContainer.append("g")
                    .attr("id","svggroup")
                    .attr("class","svggroup")
                    .attr("transform","translate(" + that.margin_left + "," + (that.margin_top/* + that.legendsGroup_height*/) +")");

                if(PykCharts.boolean(that.grid_y_enable)) {
                    that.group.append("g")
                        .attr("id","ygrid")
                        .style("stroke",that.grid_color)
                        .attr("class","y grid-line");
                }
                return this;
            },
            axisContainer : function () {
                if(PykCharts.boolean(that.axis_x_enable)  || that.axis_x_title) {
                    that.xgroup = that.group.append("g")
                        .attr("id","xaxis")
                        .attr("class", "x axis")
                        .style("stroke","none");
                }

                if(PykCharts.boolean(that.axis_y_enable)  || that.axis_y_title) {
                    that.ygroup = that.group.append("g")
                        .attr("id","yaxis")
                        .attr("class","y axis");
                    that.new_xAxisgroup = that.group.append("g")
                        .attr("class", "x new-axis")
                        .attr("id","new-xaxis")
                        .style("stroke","blue");
                }
                return this;
            },
            createColumn: function () {
                that.x_tick_values = that.k.processXAxisTickValues();
                that.y_tick_values = that.k.processYAxisTickValues();
                that.reducedWidth = that.width - that.margin_left - that.margin_right;

                var height = that.height - that.margin_top - that.margin_bottom;
                var x_domain,x_data = [],y_data = [],y_range,x_range,y_domain, min_x_tick_value,max_x_tick_value, min_y_tick_value,max_y_tick_value;

                if(that.axis_y_data_format === "number") {
                    y_domain = [0,d3.max(that.data,function (d) { return d.y; })];
                    y_data = that.k._domainBandwidth(y_domain,1);
                    y_range = [that.height - that.margin_top - that.margin_bottom, 0];
                    min_y_tick_value = d3.min(that.y_tick_values);
                    max_y_tick_value = d3.max(that.y_tick_values);

                    if(y_data[0] > min_y_tick_value) {
                        y_data[0] = min_y_tick_value;
                    }
                    if(y_data[1] < max_y_tick_value) {
                        y_data[1] = max_y_tick_value;
                    }

                    that.yScale = that.k.scaleIdentification("linear",y_data,y_range);
                    that.extra_top_margin = 0;


                } else if(that.axis_y_data_format === "string") {
                    y_data = that.data.map(function (d) { return d.y; });
                    y_range = [0,that.height - that.margin_top - that.margin_bottom];
                    that.yScale = that.k.scaleIdentification("ordinal",y_data,y_range,0.3);
                    that.extra_top_margin = (that.yScale.rangeBand() / 2);

                } else if (that.axis_y_data_format === "time") {
                    y_data = d3.extent(that.data, function (d) {
                        return parseDate(d.y);
                    });

                    min_y_tick_value = d3.min(that.y_tick_values, function (d) {
                            return new Date(d);
                        });

                        max_y_tick_value = d3.max(that.y_tick_values, function (d) {
                            return new Date(d);
                        });

                        if(new Date(y_data[0]) > new Date(min_y_tick_value)) {
                            y_data[0] = min_y_tick_value;
                        }
                        if(new Date(y_data[1]) < new Date(max_y_tick_value)) {
                            y_data[1] = max__tick_value;
                        }

                    y_range = [that.height - that.margin_top - that.margin_bottom, 0];
                    that.yScale = that.k.scaleIdentification("time",y_data,y_range);
                    that.extra_top_margin = 0;
                }
                if(that.axis_x_data_format === "number") {
                    x_domain = [0,d3.max(that.data,function (d) { return d.x; })];
                    x_data = that.k._domainBandwidth(x_domain,1);
                    x_range = [0 ,that.reducedWidth];
                    min_x_tick_value = d3.min(that.x_tick_values);
                    max_x_tick_value = d3.max(that.x_tick_values);

                    if(x_data[0] > min_x_tick_value) {
                        x_data[0] = min_x_tick_value;
                    }
                    if(x_data[1] < max_x_tick_value) {
                        x_data[1] = max_x_tick_value;
                    }
                    that.data.sort(function (a,b) {
                        return a.x - b.x;
                    })
                    that.xScale1 = that.k.scaleIdentification("linear",x_data,x_range);
                    x_data1 = that.data.map(function (d) { return d.x; });
                    x_range1 = [0 ,that.reducedWidth];
                    that.xScale = that.k.scaleIdentification("ordinal",x_data1,x_range1,0.3);
                    that.extra_left_margin = (that.xScale.rangeBand()/2);

                } else if(that.axis_x_data_format === "string") {
                    x_data = that.data.map(function (d) { return d.x; });
                    x_range = [0 ,that.reducedWidth];
                    that.xScale = that.k.scaleIdentification("ordinal",x_data,x_range,0.3);
                    that.extra_left_margin = (that.xScale.rangeBand()/2);
                } else if (that.axis_x_data_format === "time") {
                    max = d3.max(that.data, function(k) { return (k.x); });
                    min = d3.min(that.data, function(k) { return (k.x); });
                    x_domain = [min.getTime(),max.getTime()];

                    min_x_tick_value = d3.min(that.x_tick_values, function (d) {
                        return that.k.dateConversion(d);
                    });

                    max_x_tick_value = d3.max(that.x_tick_values, function (d) {
                        return that.k.dateConversion(d);
                    });

                    if(x_data[0] > min_x_tick_value) {
                        x_data[0] = min_x_tick_value;
                    }
                    if(x_data[1] < max_x_tick_value) {
                        x_data[1] = max_x_tick_value;
                    }

                    x_range = [0 ,that.reducedWidth];
                    that.xScale = that.k.scaleIdentification("time",x_domain,x_range);
                    that.data.sort(function (a,b) {
                        if ((a.x) < (b.x)) {
                            return -1 ;
                        }
                        else if ((a.x) > (b.x)) {
                            return 1;
                        }
                    })
                    that.xScale1 = that.k.scaleIdentification("linear",x_data,x_range);
                    x_data1 = that.data.map(function (d) { return d.x; });
                    x_range1 = [0 ,that.reducedWidth];
                    that.xScale = that.k.scaleIdentification("ordinal",x_data1,x_range1,0.3);
                    that.extra_left_margin = (that.xScale.rangeBand()/2);

                }

                that.x_domain = that.xScale.domain();
                that.y_domain = that.yScale.domain();

                that.bar = that.group.selectAll(".bar")
                    .data(that.data)

                that.bar.enter()
                    .append("g")
                    .attr("class","bar")
                    .append("svg:rect");

                that.bar.attr("class","bar")
                    .select("rect")
                    .attr("class","hbar")
                    .attr("x", function (d) { return that.xScale(d.x); })
                    .attr("y", height)
                    .attr("height", 0)
                    .attr("width", function (d) { return (that.reducedWidth/(that.data.length))-(0.03*that.reducedWidth); })
                    .attr("fill", function (d) { return that.fillColor.colorPieMS(d); })
                    .attr("stroke", that.border.color())
                    .attr("stroke-width",that.border.width())
                    .on('mouseover',function (d) {
                        if(that.mode === "default") {
                            if(PykCharts.boolean(that.onhover_enable)) {
                                that.mouseEvent1.highlight(that.selector+" "+".hbar", this);
                            }
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(d.tooltip ? d.tooltip : d.y);
                        }
                    })
                    .on('mouseout',function (d) {
                        if(that.mode === "default") {
                            if(PykCharts.boolean(that.onhover_enable)) {
                                that.mouseEvent1.highlightHide(that.selector+" "+".hbar");
                            }
                            that.mouseEvent.tooltipHide(d);
                            that.mouseEvent.axisHighlightHide(that.selector+" "+".x.axis")
                        }
                    })
                    .on('mousemove', function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.axisHighlightShow(d.x,that.selector+" "+".x.axis",that.x_domain);
                        }                       
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("y", function (d) { return that.yScale(d.y); })
                    .attr("height", function (d) { return height - that.yScale(d.y); });

                that.bar.exit()
                    .remove();
                var t = d3.transform(d3.select(d3.selectAll(options.selector + ' .bar')[0][(that.data.length-1)]).attr("transform")),
                    x = t.translate[0],
                    y = t.translate[1];
                x_range = [(x + (that.xScale.rangeBand()/2)),(that.reducedWidth - x - (that.xScale.rangeBand()/2))];
                that.xScale1 = that.k.scaleIdentification("linear",x_data,x_range);
                return this;
            },
            newXAxis : function () {
                if(PykCharts["boolean"](that.axis_x_enable)) {
                    if(that.axis_x_position === "bottom") {
                        that.new_xAxisgroup.attr("transform", "translate(0," + (that.height - that.margin_top - that.margin_bottom) + ")");
                    }
                    var xaxis = d3.svg.axis()
                        .scale(that.xScale)
                        .orient(that.axis_x_pointer_position)
                        .tickSize(0)
                        .outerTickSize(that.axis_x_outer_pointer_length);
                    that.new_xAxisgroup.style("stroke",function () { return that.axis_x_line_color; })
                        .call(xaxis);
                    d3.selectAll(that.selector + " .x.new-axis text").style("display",function () { return "none"; })
                        .style("stroke","none");
                }
                return this;
            },
        };
        return optional;
    };
};
PykCharts.multiD.groupedColumn = function(options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function () {
        that = new PykCharts.multiD.processInputs(that, options, "column");

        if(that.stop)
            return;
        that.grid_color = options.chart_grid_color ? options.chart_grid_color : theme.stylesheet.chart_grid_color;
         that.panels_enable = "no";

        if(that.mode === "default") {
           that.k.loading();
        }
        that.multiD = new PykCharts.multiD.configuration(that);

        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(that.selector+" #chart-loader").remove();
                $(options.selector).css("height","auto");
                return;
            }
            that.data = that.k.__proto__._groupBy("column",data);
            that.compare_data = that.k.__proto__._groupBy("column",data);
            that.axis_y_data_format = "number";
            that.axis_x_data_format = that.k.xAxisDataFormatIdentification(that.data);
            if(that.axis_x_data_format === "time" && that.axis_x_time_value_datatype === "") {
                console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to have passed Date data so please pass the value for axis_x_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
            }

            $(that.selector+" #chart-loader").remove();
            $(options.selector).css("height","auto");
            // PykCharts.multiD.columnFunctions(options,that,"group_column");
            that.render();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };

    that.dataTransformation = function () {
        that.group_arr = [], that.new_data = [];
        that.data_length = that.data.length;
        for(j = 0;j < that.data_length;j++) {
            that.group_arr[j] = that.data[j].x;
        }
        that.uniq_group_arr = _.unique(that.group_arr);
        var len = that.uniq_group_arr.length;

        for (k = 0;k < len;k++) {
            that.new_data[k] = {
                    name: that.uniq_group_arr[k],
                    data: []
            };
            for (l = 0;l < that.data_length;l++) {
                if (that.uniq_group_arr[k] === that.data[l].x) {
                    that.new_data[k].data.push({
                        y: that.data[l].y,
                        name: that.data[l].group,
                        tooltip: that.data[l].tooltip,
                        color: that.data[l].color
                    });
                }
            }
        }
        that.new_data_length = that.new_data.length;
    };

    that.refresh = function () {
        that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("column",data);
            that.refresh_data = that.k.__proto__._groupBy("column",data);
            that.map_group_data = that.multiD.mapGroup(that.data);
            that.dataTransformation();
            that.optionalFeatures().mapColors();

            if(that.axis_x_data_format === "time") {
                    that.new_data.forEach(function (d) {
                        d.name = that.k.dateConversion(d.name);
                        // that.xdomain.push(d.x);
                    });
                    that.data.forEach(function (d) {
                        d.x =that.k.dateConversion(d.x);
                    });
            }
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }

            that.optionalFeatures()
                    .createChart()
                    .legends()
                    .highlightRect();

            that.k.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
            .yGrid(that.svgContainer,that.group,that.yScale,that.legendsGroup_width);
            if(that.axis_y_data_format !== "string") {
                that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height,"groupcolumn")
                that.optionalFeatures().newXAxis();
            } else {
                that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
            }
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
    };

    that.render = function() {
        var that = this;
        var l = $(".svgcontainer").length;
        that.container_id = "svgcontainer" + l;

        that.map_group_data = that.multiD.mapGroup(that.data);
        that.dataTransformation();
        that.optionalFeatures().mapColors();

        if(that.axis_x_data_format === "time") {
                that.new_data.forEach(function (d) {
                    d.name = that.k.dateConversion(d.name);
                    // that.xdomain.push(d.x);
                });
                that.data.forEach(function (d) {
                    d.x =that.k.dateConversion(d.x);
                });
        }


        that.border = new PykCharts.Configuration.border(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.mouseEvent1 = new PykCharts.multiD.mouseEvent(that);
        that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);

        if(that.mode === "default") {
            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+that.container_id,"groupColumnChart")
                .emptyDiv()
                .subtitle()
                .makeMainDiv(that.selector,1);

            that.optionalFeatures()
                .svgContainer(1)
                .legendsContainer(1);

            that.k.liveData(that)
                .tooltip()
                .createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

            that.optionalFeatures()
                .legends()
                .createGroups(1)
                .createChart()
                .axisContainer()
               .highlightRect();

            that.k.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
            .yGrid(that.svgContainer,that.group,that.yScale,that.legendsGroup_width)
            .xAxisTitle(that.xGroup)
            .yAxisTitle(that.yGroup);
            if(that.axis_y_data_format !== "string") {
                that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height,"groupcolumn")
                that.optionalFeatures().newXAxis();
            } else {
                that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
            }

        } else if(that.mode === "infographics") {
            that.k.backgroundColor(that)
                .export(that,"#"+that.container_id,"groupColumnChart")
                .emptyDiv()
                .makeMainDiv(that.selector,1);

            that.optionalFeatures().svgContainer(1)
                .legendsContainer(1)
                .createGroups(1)
                .createChart()
                .axisContainer()
                .highlightRect();

            that.k.tooltip();
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
            that.k
            .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
            .xAxisTitle(that.xGroup)
            .yAxisTitle(that.yGroup);
            if(that.axis_y_data_format !== "string") {
                that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height,"groupcolumn")
                that.optionalFeatures().newXAxis();
            } else {
                that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
            }
        }

        that.k.exportSVG(that,"#"+that.container_id,"groupColumnChart")
        if(PykCharts.boolean(that.legends_enable)) {
            $(document).ready(function () { return that.k.resize(that.svgContainer,"",that.legendsContainer); })
            $(window).on("resize", function () { return that.k.resize(that.svgContainer,"",that.legendsContainer); });
        } else {
            $(document).ready(function () { return that.k.resize(that.svgContainer,""); })
            $(window).on("resize", function () { return that.k.resize(that.svgContainer,""); });
        }
    };

    that.optionalFeatures = function() {
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
            createGroups: function (i) {
                that.group = that.svgContainer.append("g")
                    .attr("id","svggroup")
                    .attr("class","svggroup")
                    .attr("transform","translate(" + that.margin_left + "," + (that.margin_top + that.legendsGroup_height) +")");

                if(PykCharts.boolean(that.grid_y_enable)) {
                    that.group.append("g")
                        .attr("id","ygrid")
                        .style("stroke",that.grid_color)
                        .attr("class","y grid-line");
                }
                return this;
            },
            legendsContainer: function (i) {
                if(PykCharts.boolean(that.legends_enable) && that.mode === "default") {

                    that.legendsGroup = that.svgContainer.append("g")
                        .attr("id","legends")
                        .attr("class","legends")
                        .style("visibility","hidden")
                        .attr("transform","translate(0,10)");

                } else {
                    that.legendsGroup_height = 0;
                    that.legendsGroup_width = 0;
                }
                return this;
            },
            axisContainer : function () {
                if(PykCharts.boolean(that.axis_x_enable) || that.axis_x_title) {
                    that.xGroup = that.group.append("g")
                        .attr("class", "x axis")
                        .attr("id","xaxis")
                        .style("stroke","black");
                    that.new_xAxisgroup = that.group.append("g")
                        .attr("class", "x new-axis")
                        .attr("id","new-xaxis")
                        .style("stroke","blue");
                }

                if(PykCharts.boolean(that.axis_y_enable) || that.axis_y_title) {
                    that.yGroup = that.group.append("g")
                        .attr("class", "y axis")
                        .attr("id","yaxis")
                        .style("stroke","blue");
                }
                return this;
            },
            createChart: function() {
                that.reduced_width = that.width - that.margin_left - that.margin_right - that.legendsGroup_width;

                that.reduced_height = that.height - that.margin_top - that.margin_bottom - that.legendsGroup_height;

                that.getuniqueGroups = _.map(that.data,function(d) {
                    return d.group;
                })

                that.getuniqueGroups = _.unique(that.getuniqueGroups)

                that.x_tick_values = that.k.processXAxisTickValues();
                that.y_tick_values = that.k.processYAxisTickValues();

                var x_domain,x_data = [],y_data,y_range,x_range,y_domain,min_x_tick_value,max_x_tick_value, min_y_tick_value,max_y_tick_value;

                if(that.axis_y_data_format === "number") {
                    that.max_y_value = d3.max(that.new_data, function(d) { return d3.max(d.data, function(d) { return d.y; }); });

                    y_domain = [0,that.max_y_value];
                    y_data = that.k.__proto__._domainBandwidth(y_domain,1);
                    min_y_tick_value = d3.min(that.y_tick_values);
                    max_y_tick_value = d3.max(that.y_tick_values);

                    if(y_data[0] > min_y_tick_value) {
                        y_data[0] = min_y_tick_value;
                    }
                    if(y_data[1] < max_y_tick_value) {
                        y_data[1] = max_y_tick_value;
                    }
                    y_range = [that.reduced_height, 0];
                    that.yScale = that.k.scaleIdentification("linear",y_data,y_range);


                }

                if(that.axis_x_data_format === "number") {
                    max = d3.max(that.new_data, function(d) { return d.name });
                    min = d3.min(that.new_data, function(d) { return d.name });
                    x_domain = [min,max];
                    x_data = [min,max];

                    min_x_tick_value = d3.min(that.x_tick_values);
                    max_x_tick_value = d3.max(that.x_tick_values);

                    if(x_data[0] > min_x_tick_value) {
                        x_data[0] = min_x_tick_value;
                    }
                    if(x_data[1] < max_x_tick_value) {
                        x_data[1] = max_x_tick_value;
                    }
                    that.new_data.sort(function (a,b) {
                        return a.name - b.name;
                    })
                    x_range = [0 ,that.reduced_width];
                    that.xScale1 = that.k.scaleIdentification("linear",x_data,x_range);
                    x_data1 = that.new_data.map(function (d) { return d.name; });
                    x_range1 = [0 ,that.reduced_width];
                    that.xScale = that.k.scaleIdentification("ordinal",x_data1,x_range1,0.2);
                    that.extra_left_margin = (that.xScale.rangeBand() / 2);
                    that.xdomain = that.xScale.domain();
                    that.x1 = d3.scale.ordinal()
                        .domain(that.getuniqueGroups)
                        .rangeRoundBands([0, that.xScale.rangeBand()]) ;
                    

                } else if(that.axis_x_data_format === "string") {
                    x_data = that.new_data.map(function (d) { return d.name; });

                    x_range = [0 ,that.reduced_width];
                    that.xScale = that.k.scaleIdentification("ordinal",x_data,x_range,0.2);
                    that.extra_left_margin = (that.xScale.rangeBand() / 2);
                    that.xdomain = that.xScale.domain();
                    that.x1 = d3.scale.ordinal()
                        .domain(that.getuniqueGroups)
                        .rangeRoundBands([0, that.xScale.rangeBand()]) ;


                } else if (that.axis_x_data_format === "time") {
                    max = d3.max(that.new_data,function(d) {
                        return d.name;
                    })

                    min = d3.min(that.new_data,function(d) {
                        return d.name;
                    })

                    x_domain = [min.getTime(),max.getTime()];
                    x_data = [min,max];
                    x_range = [0 ,that.reduced_width];


                    min_x_tick_value = d3.min(that.x_tick_values, function (d) {
                        d = that.k.dateConversion(d);
                        return d;
                    });

                    max_x_tick_value = d3.max(that.x_tick_values, function (d) {
                        d = that.k.dateConversion(d);
                        return d;
                    });

                    if((x_data[0]) > (min_x_tick_value)) {
                        x_data[0] = min_x_tick_value;
                    }
                    if((x_data[1]) < (max_x_tick_value)) {
                        x_data[1] = max_x_tick_value;
                    }

                    that.xScale = that.k.scaleIdentification("time",x_data,x_range);
                    that.new_data.sort(function (a,b) {
                        if (new Date(a.name) < new Date(b.name)) {
                            return -1 ;
                        }
                        else if (new Date(a.name) > new Date(b.name)) {
                            return 1;
                        }
                    });
                    x_data1 = that.new_data.map(function (d) { return d.name; });

                    x_range1 = [0 ,that.reduced_width];
                    that.xScale1 = that.k.scaleIdentification("ordinal",x_data1,x_range1,0.2);
                    x_data1 = that.new_data.map(function (d) { return d.name; });
                    x_range1 = [0 ,that.reduced_width];
                    that.xScale = that.k.scaleIdentification("ordinal",x_data1,x_range1,0.2);
                    that.extra_left_margin = (that.xScale.rangeBand() / 2);
                    that.xdomain = that.xScale.domain();
                    that.x1 = d3.scale.ordinal()
                        .domain(that.getuniqueGroups)
                        .rangeRoundBands([0, that.xScale.rangeBand()]) ;
                }
                that.xdomain = that.xScale.domain();
                that.ydomain = that.yScale.domain();
                that.highlight_y_positions =  [];
                var chart = that.group.selectAll(".column-group")
                    .data(that.new_data);

                chart.enter()
                    .append("g")
                    .attr("class", "column-group")

                chart
                    .attr("transform", function (d) {
                        that.optionalFeatures().checkIfHighLightDataExists(d.name);
                        if(that.highlight_group_exits) {
                            that.flag = true;
                            that.highlight_x_positions = that.xScale(d.name);
                        }
                        return "translate(" + that.xScale(d.name) + ",0)";
                    })
                    .on('mouseout',function (d) {
                        if(that.mode === "default") {
                            if(PykCharts.boolean(that.onhover_enable)) {
                                that.mouseEvent.highlightGroupHide(that.selector+" "+".column-group","rect");
                            }
                            that.mouseEvent.axisHighlightHide(that.selector+" "+".x.axis")
                        }
                    })
                    .on('mousemove', function (d) {
                        if(that.mode === "default") {
                            if(PykCharts.boolean(that.onhover_enable)) {
                                that.mouseEvent.highlightGroup(that.selector+" "+".column-group", this, "rect");
                            }
                            that.mouseEvent.axisHighlightShow(d.name,that.selector+" "+".x.axis",that.xdomain);
                        }
                    });

                var bar = chart.selectAll("rect")
                            .data(function (d) { return d.data; });

                bar.enter()
                    .append("rect")

                bar.attr("height", 0)
                    .attr("x", function (d) {return that.x1(d.name); })
                    .attr("y", that.height - that.margin_top - that.margin_bottom)
                    .attr("width", function (d){ return 0.98*that.x1.rangeBand(); })
                    .attr("fill", function (d,i) {
                        return that.fillColor.colorGroup(d);
                    })
                    .attr("fill-opacity", function (d,i) {
                        if (that.color_mode === "saturation") {
                            return (i+1)/that.no_of_groups;
                        } else {
                            return 1;
                        }
                    })
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("data-fill-opacity",function () {
                        return $(this).attr("fill-opacity");
                    })
                    .on('mouseover',function (d) {
                        if(that.mode === "default") {
                            var tooltip = d.tooltip ? d.tooltip : d.y
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(tooltip);
                        }
                    })
                    .on('mouseout',function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipHide(d);
                        }
                    })
                    .on('mousemove', function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                        }

                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("height", function (d) { return that.reduced_height - that.yScale(d.y); })
                    .attr("y",function (d) {
                        if(that.flag) {
                            that.highlight_y_positions.push(that.yScale(d.y));
                        }
                        return that.yScale(d.y);
                    });

                chart.exit().remove();
                bar.exit().remove();
                var t = d3.transform(d3.select(d3.selectAll('.column-group')[0][(that.new_data.length-1)]).attr("transform")),
                    x = t.translate[0],
                    y = t.translate[1];
                x_range = [(that.reduced_height-x - (that.x1.rangeBand()*2)),(x + (that.x1.rangeBand()*2))];
                that.xScale1 = that.k.scaleIdentification("linear",x_data,x_range);

                return this;
            },
            mapColors : function () {
                that.no_of_groups = d3.max(that.new_data,function (d){
                    return d.data.length;
                });

                for(var i = 0;that.new_data.length;i++) {
                    if(that.new_data[i].data.length === that.no_of_groups) {
                        that.group_data = that.new_data[i].data;
                        break;
                    }
                }

                that.new_data.forEach(function(d){
                    d.data.forEach(function(data){
                        data.color = _.find(that.group_data,function(d) {
                            return d.name === data.name;
                        }).color;
                    })
                });
            },
            legends: function () {
                if(PykCharts.boolean(that.legends_enable)) {
                    var params = that.group_data,color;

                    color = params.map(function (d) {
                        return d.color;
                    });

                    params = params.map(function (d) {
                        return d.name;
                    });

                    params = _.uniq(params);
                    var j = 0,k = 0;
                    j = params.length;
                    k = params.length;

                    if(that.legends_display === "vertical" ) {
                        that.legendsGroup.attr("height", (params.length * 30)+20);
                        that.legendsGroup_height = 0;

                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        text_parameter1value = function (d,i) { return 36; };
                        rect_parameter3value = function (d,i) { return 20; };
                        var rect_parameter4value = function (d,i) { return i * 24 + 12;};
                        var text_parameter2value = function (d,i) { return i * 24 + 23;};
                    }
                    else if(that.legends_display === "horizontal") {
                        that.legendsGroup_height = 50;
                        temp_i = j;
                        final_rect_x = 0;
                        final_text_x = 0;
                        legend_text_widths = [];
                        sum_text_widths = 0;
                        temp_text = temp_rect = 0;
                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";
                        var text_parameter1value = function (d,i) {
                            legend_text_widths[i] = this.getBBox().width;
                            legend_start_x = 16;
                            final_text_x = (i === 0) ? legend_start_x : (legend_start_x + temp_text);
                            temp_text = temp_text + legend_text_widths[i] + 30;
                            return final_text_x;
                        };
                        text_parameter2value = 30;
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        var rect_parameter3value = function (d,i) {
                            final_rect_x = (i === 0) ? 0 : temp_rect;
                            temp_rect = temp_rect + legend_text_widths[i] + 30;
                            return final_rect_x;
                        };
                        rect_parameter4value = 18;
                    }

                    var legend = that.legendsGroup.selectAll(".legends-rect")
                                    .data(params);

                    that.legends_text = that.legendsGroup.selectAll(".legends_text")
                        .data(params);

                    that.legends_text.enter()
                        .append('text');

                    that.legends_text.attr("class","legends_text")
                        .attr("pointer-events","none")
                        .text(function (d) { return d; })
                        .attr("fill", that.legends_text_color)
                        .attr("font-family", that.legends_text_family)
                        .attr("font-size",that.legends_text_size+"px")
                        .attr("font-weight", that.legends_text_weight)
                        .attr(text_parameter1, text_parameter1value)
                        .attr(text_parameter2, text_parameter2value);

                    legend.enter()
                        .append("rect");

                    legend.attr("class","legends-rect")
                        .attr(rect_parameter1, rect_parameter1value)
                        .attr(rect_parameter2, rect_parameter2value)
                        .attr(rect_parameter3, rect_parameter3value)
                        .attr(rect_parameter4, rect_parameter4value)
                        .attr("fill", function (d,i) {
                            if(that.color_mode === "color")
                                return color[i];
                            else return that.saturation_color
                        })
                        .attr("fill-opacity", function (d,i) {
                            if (that.color_mode === "saturation") {
                                return (i+1)/that.no_of_groups;
                            }
                        });

                    var legend_container_width = that.legendsGroup.node().getBBox().width,translate_x;

                    if(that.legends_display === "vertical") {
                        that.legendsGroup_width = legend_container_width + 20;
                    } else  {
                        that.legendsGroup_width = 0;
                    }

                    translate_x = (that.legends_display === "vertical") ? (that.width - that.legendsGroup_width) : (that.width - legend_container_width - 20);

                    if (legend_container_width < that.width) { that.legendsGroup.attr("transform","translate("+translate_x+",10)"); }
                    that.legendsGroup.style("visibility","visible");

                    that.legends_text.exit().remove();
                    legend.exit().remove();
                }
                return this;
            },
            checkIfHighLightDataExists : function (name) {
                if(that.highlight) {
                    if(that.axis_x_data_format === "number") {
                        that.highlight_group_exits = (that.highlight === name);
                    } else if (that.axis_x_data_format === "string") {
                        that.highlight_group_exits = (that.highlight.toLowerCase() === name.toLowerCase());
                        
                    }
                }
                return this;
            },
            newXAxis : function () {
                if(PykCharts["boolean"](that.axis_x_enable)) {
                    if(that.axis_x_position === "bottom") {
                        that.new_xAxisgroup.attr("transform", "translate(0," + (that.height - that.margin_top - that.margin_bottom - that.legendsGroup_height) + ")");
                    }
                    var xaxis = d3.svg.axis()
                        .scale(that.xScale)
                        .orient(that.axis_x_pointer_position)
                        .tickSize(0)
                        .outerTickSize(that.axis_x_outer_pointer_length);
                    that.new_xAxisgroup.style("stroke",function () { return that.axis_x_line_color; })
                        .call(xaxis);
                    d3.selectAll(that.selector + " .x.new-axis text").style("display",function () { return "none"; })
                        .style("stroke","none");
                }
                
                return this;
            },
            highlightRect : function () {
                if(that.flag) {
                    setTimeout(function() {
                        x = that.highlight_x_positions - 5;                    
                    
                        var highlight_rect = that.group.selectAll(".highlight-rect")
                            .data([that.highlight])

                        highlight_rect.enter()
                            .append("rect")

                        highlight_rect.attr("class","highlight-rect")
                            .attr("x", x)
                            .attr("y", 0)
                            .attr("width", (that.x1.rangeBand()* that.group_data.length)+10)
                            .attr("height", that.reduced_height+ 5) 
                            .attr("fill","none")
                            .attr("stroke", that.highlight_color)
                            .attr("stroke-width", "1.5px")
                            .attr("stroke-dasharray", "5,5")
                            .attr("stroke-opacity",1);
                        highlight_rect.exit()
                            .remove();
                        if(PykCharts["boolean"](that.highlight_x_positions)) {
                            highlight_array = that.highlight;
                        } else {
                            highlight_rect
                                .remove()
                        }
                    }, that.transitions.duration());
                }
                return this;
            },
        }
        return optional;
    };
};;

PykCharts.multiD.scatter = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function() {
        that = new PykCharts.multiD.processInputs(that, options, "scatterplot");
        that.bubbleRadius = options.scatterplot_radius ? options.scatterplot_radius : theme.multiDimensionalCharts.scatterplot_radius;
        that.panels_enable = "no";

        try {
            if(!_.isNumber(that.bubbleRadius)) {
                that.bubbleRadius = theme.multiDimensionalCharts.scatterplot_radius;
                throw "scatterplot_radius"
            }
        }

        catch (err) {
            that.k.warningHandling(err,"1");
        }

        if(that.stop)
            return;

        if(that.mode === "default") {
            that.k.loading();
        }

        var multiDimensionalCharts = theme.multiDimensionalCharts,
            stylesheet = theme.stylesheet,
            optional = options.optional;

        that.multiD = new PykCharts.multiD.configuration(that);
        that.enableTicks =  options.scatterplot_pointer_enable ? options.scatterplot_pointer_enable.toLowerCase() : multiDimensionalCharts.scatterplot_pointer_enable;
        that.zoomed_out = true;

        if(PykCharts['boolean'](that.panels_enable)) {
            that.radius_range = [that.k.__proto__._radiusCalculation(1.1)*2,that.k.__proto__._radiusCalculation(2.6)*2];
        } else {
            that.radius_range = [that.k.__proto__._radiusCalculation(4.5)*2,that.k.__proto__._radiusCalculation(11)*2];
        }
        
        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(that.selector+" #chart-loader").remove();
                $(that.selector).css("height","auto")
                return;
            }

            that.data = that.k.__proto__._groupBy("scatterplot",data);
            that.axis_y_data_format = that.k.yAxisDataFormatIdentification(that.data);
            that.axis_x_data_format = that.k.xAxisDataFormatIdentification(that.data);
            if(that.axis_x_data_format === "time" && that.axis_x_time_value_datatype === "") {
                console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to have passed Date data so please pass the value for axis_x_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
            }
            if(that.axis_y_data_format === "time" && that.axis_y_time_value_datatype === "") {
                console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to have passed Date data so please pass the value for axis_x_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
            }
            that.compare_data = that.k.__proto__._groupBy("scatterplot",data);
            $(that.selector+" #chart-loader").remove();
            $(that.selector).css("height","auto")
            var a = new PykCharts.multiD.scatterplotFunctions(options,that,"scatterplot");
            a.render();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };
};

PykCharts.multiD.panelsOfScatter = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function() {
        that = new PykCharts.multiD.processInputs(that, options, "scatterplot");
        that.bubbleRadius = options.scatterplot_radius ? options.scatterplot_radius : theme.multiDimensionalCharts.scatterplot_radius;
        that.panels_enable = "yes";
        that.legends_display = "horizontal";
        try {
            if(!_.isNumber(that.bubbleRadius)) {
                that.bubbleRadius = theme.multiDimensionalCharts.scatterplot_radius;
                throw "scatterplot_radius"
            }
        }

        catch (err) {
            that.k.warningHandling(err,"1");
        }

        if(that.stop)
            return;

        if(that.mode === "default") {
            that.k.loading();
        }
        
        var multiDimensionalCharts = theme.multiDimensionalCharts,
            stylesheet = theme.stylesheet,
            optional = options.optional;

        that.multiD = new PykCharts.multiD.configuration(that);
        that.enableTicks =  options.scatterplot_pointer_enable ? options.scatterplot_pointer_enable.toLowerCase() : multiDimensionalCharts.scatterplot_pointer_enable;
        that.zoomed_out = true;

        if(PykCharts['boolean'](that.panels_enable)) {
            that.radius_range = [that.k.__proto__._radiusCalculation(1.1)*2,that.k.__proto__._radiusCalculation(2.6)*2];
        } else {
            that.radius_range = [that.k.__proto__._radiusCalculation(4.5)*2,that.k.__proto__._radiusCalculation(11)*2];
        }
        
        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(that.selector+" #chart-loader").remove();
                $(that.selector).css("height","auto")
                return;
            }

            that.data = that.k.__proto__._groupBy("scatterplot",data);
            that.axis_y_data_format = that.k.yAxisDataFormatIdentification(that.data);
            that.axis_x_data_format = that.k.xAxisDataFormatIdentification(that.data);
            if(that.axis_x_data_format === "time" && that.axis_x_time_value_datatype === "") {
                console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to have passed Date data so please pass the value for axis_x_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
            }
            if(that.axis_y_data_format === "time" && that.axis_y_time_value_datatype === "") {
                console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to have passed Date data so please pass the value for axis_x_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
            }
            that.compare_data = that.k.__proto__._groupBy("scatterplot",data);
            $(that.selector+" #chart-loader").remove();
            $(that.selector).css("height","auto")
            var a = new PykCharts.multiD.scatterplotFunctions(options,that,"scatterplot");
            a.render();
        };

        that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };
};

PykCharts.multiD.pulse = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function() {
        that = new PykCharts.multiD.processInputs(that, options, "pulse");
        var multiDimensionalCharts = theme.multiDimensionalCharts,
            stylesheet = theme.stylesheet,
            optional = options.optional;
        that.multiD = new PykCharts.multiD.configuration(that);
        that.bubbleRadius = options.scatterplot_radius ? options.scatterplot_radius : (0.6 * multiDimensionalCharts.scatterplot_radius);
        that.panels_enable = "no";

        try {
            if(!_.isNumber(that.bubbleRadius)) {
                that.bubbleRadius = (0.6 * multiDimensionalCharts.scatterplot_radius);
                throw "scatterplot_radius"
            }
        }

        catch (err) {
            that.k.warningHandling(err,"1");
        }

        if(that.stop) {
            return;
        }

        that.zoomed_out = true;
        that.radius_range = [that.k.__proto__._radiusCalculation(1.1)*2,that.k.__proto__._radiusCalculation(3.5)*2];

        if(that.mode === "default") {
            that.k.loading();
        }

        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(that.selector+" #chart-loader").remove();
                $(that.selector).css("height","auto")
                return;
            }
            that.data = that.k.__proto__._groupBy("pulse",data);
            that.axis_y_data_format = that.k.yAxisDataFormatIdentification(that.data);
            that.axis_x_data_format = that.k.xAxisDataFormatIdentification(that.data);
            if(that.axis_x_data_format === "date" && that.axis_x_time_value_datatype === "") {
                console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to pass Date data so please pass axis_x_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
            }
            if(that.axis_y_data_format === "date" && that.axis_y_time_value_datatype === "") {
                console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to pass Date data so please pass axis_y_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
            }
            that.compare_data = that.k.__proto__._groupBy("pulse",data);
            $(that.selector+" #chart-loader").remove();
            $(that.selector).css("height","auto")
            var a = new PykCharts.multiD.scatterplotFunctions(options,that,"pulse");
            a.render();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };
};

PykCharts.multiD.scatterplotFunctions = function (options,chartObject,type) {
    var that = chartObject;
    that.refresh = function () {
        that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("scatterplot",data);
            that.refresh_data = that.k.__proto__._groupBy("scatterplot",data);
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];

            that.uniq_group_arr = _.uniq(that.data.map(function (d) {
                return d.group;
            }));

            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.map_group_data = that.multiD.mapGroup(that.data);
            if(that.axis_x_data_format === "time") {
                that.data.forEach(function (d) {
                    d.x = that.k.dateConversion(d.x);
                });
            }
            if(!PykCharts['boolean'](that.panels_enable)) {
                that.new_data = that.data;
                that.optionalFeatures()
                    .createChart()
                    .legends()
                    .plotCircle()
                    .ticks();
                if(type === "scatterplot") {
                    that.optionalFeatures().label();
                }
            } else if(PykCharts['boolean'](that.panels_enable) && type === "scatterplot") {
                $(that.selector + " #panels_of_scatter_main_div").empty();
                that.renderChart();
            }
            that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
                    .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh")
    };

    this.render = function () {
        that.map_group_data = that.multiD.mapGroup(that.data);
        that.fillChart = new PykCharts.Configuration.fillChart(that);
        that.transitions = new PykCharts.Configuration.transition(that);

        that.border = new PykCharts.Configuration.border(that);
        that.uniq_group_arr = _.uniq(that.data.map(function (d) {
            return d.group;
        }));
        that.no_of_groups = 1;
        if(that.axis_x_data_format === "time") {
            that.data.forEach(function (d) {
                d.x = that.k.dateConversion(d.x);
            });
        }
        if(that.mode === "default") {
            if(PykCharts['boolean'](that.panels_enable) && type === "scatterplot") {
                    that.w = that.width/4;
                    that.height = that.height/2;
                    that.margin_left = that.margin_left;
                    that.margin_right = that.margin_right;

                that.k.title()
                    .backgroundColor(that)
                    .export(that,"svgcontainer",type,that.panels_enable,that.uniq_group_arr)
                    .emptyDiv()
                    .subtitle();


                    d3.select(that.selector).append("div")
                        .style("width",that.width + "px")
                        .style("height",that.height + "px")
                        .attr("id","panels_of_scatter_main_div");

                    that.renderChart();

                    that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
                        .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
                        .xAxisTitle(that.xGroup,that.legendsGroup_height,that.legendsGroup_width)
                        .yAxisTitle(that.yGroup);

            } else {
                that.k.title()
                    .backgroundColor(that)
                    .export(that,"#svgcontainer0",type)
                    .emptyDiv()
                    .subtitle();

                that.w = that.width;
                that.new_data = that.data;
                that.k.makeMainDiv(that.selector,0);

                that.optionalFeatures()
                    .svgContainer(0)
                    .legendsContainer(0);

                that.k.liveData(that)
                    .tooltip();

                that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
                that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range);

                that.optionalFeatures()
                    .legends()
                    .createGroups(0)
                    .createChart()
                    .ticks();

                if(type === "scatterplot") {
                    that.optionalFeatures().label();
                }
                that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
                    .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
                    .xAxisTitle(that.xGroup,that.legendsGroup_height,that.legendsGroup_width)
                    .yAxisTitle(that.yGroup);
                that.k.exportSVG(that,"#svgcontainer0",type)
            }

            that.k.createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();

        } else if (that.mode === "infographics") {

            if(PykCharts['boolean'](that.panels_enable) && type === "scatterplot") {
                that.k.backgroundColor(that)
                    .export(that,"svgcontainer",type,that.panels_enable,that.uniq_group_arr)
                    .emptyDiv();

                that.no_of_groups = that.uniq_group_arr.length;
                that.w = that.width/4;
                that.height = that.height/2;
                that.margin_left = that.margin_left;
                that.margin_right = that.margin_right;
                
                for(i=0;i<that.no_of_groups;i++){
                    that.new_data = [];
                    for(j=0;j<that.data.length;j++) {
                        if(that.data[j].group === that.uniq_group_arr[i]) {
                            that.new_data.push(that.data[j]);
                        }
                    }
                    that.k.makeMainDiv(that.selector,i);

                    that.optionalFeatures()
                        .svgContainer(i)
                        .legendsContainer(i);

                    that.k.tooltip();

                    that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
                    that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range);

                    that.optionalFeatures()
                        .legends(i)
                        .createGroups(i)
                        .createChart()
                        .label()
                        .ticks();

                    that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
                        .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
                        .xAxisTitle(that.xGroup,that.legendsGroup_height,that.legendsGroup_width)
                        .yAxisTitle(that.yGroup);

                    if((i+1)%4 === 0 && i !== 0) {
                        that.k.emptyDiv();
                    }
                }
                that.k.exportSVG(that,"svgcontainer",type,that.panels_enable,that.uniq_group_arr)
                that.k.emptyDiv();
            } else {

                that.k.backgroundColor(that)
                    .export(that,"#svgcontainer0",type)
                    .emptyDiv();

                that.w = that.width;
                that.new_data = that.data;
                that.k.makeMainDiv(that.selector,0);

                that.optionalFeatures()
                    .svgContainer(0)
                    .legendsContainer(0);

                that.k.liveData(that)
                    .tooltip();

                that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
                that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range);

                that.optionalFeatures()
                    .legends()
                    .createGroups(0)
                    .createChart()
                    .ticks();

                if(type === "scatterplot") {
                    that.optionalFeatures().label();
                }

                that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
                    .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
                    .xAxisTitle(that.xGroup,that.legendsGroup_height,that.legendsGroup_width)
                    .yAxisTitle(that.yGroup);

                that.k.exportSVG(that,"#svgcontainer0",type);
            }

        }
        if(!PykCharts['boolean'](that.panels_enable)) {
            if(type === "scatterplot" && PykCharts['boolean'](that.legends_enable) && PykCharts['boolean'](that.variable_circle_size_enable) && that.map_group_data[1]) {
                $(document).ready(function () { return that.k.resize(that.svgContainer,"",that.legendsContainer); })
                $(window).on("resize", function () { return that.k.resize(that.svgContainer,"",that.legendsContainer); });
            } else {
                $(document).ready(function () { return that.k.resize(that.svgContainer); })
                $(window).on("resize", function () { return that.k.resize(that.svgContainer); });
            }
        } else {
            $(document).ready(function () { return that.k.resize(); })
            $(window).on("resize", function () { return that.k.resize(); });
        }
    };

    that.optionalFeatures = function () {
        var optional = {
            svgContainer :function (i) {
                $(that.selector + " #tooltip-svg-container-" + i).css("width",that.w);
                $(that.selector).attr("class","PykCharts-weighted")

                that.svgContainer = d3.select(that.selector + " #tooltip-svg-container-" + i)
                    .append('svg')
                    .attr("width",that.w)
                    .attr("height",that.height)
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.w + " " + that.height)
                    .attr("id","svgcontainer" + i)
                    .attr("class","svgcontainer")

                return this;
            },
            createGroups : function (i) {
                that.group = that.svgContainer.append("g")
                    .attr("transform","translate("+(that.margin_left)+","+(that.margin_top+that.legendsGroup_height)+")")
                    .attr("id","main");

                that.ticksElement = that.svgContainer.append("g")
                    .attr("transform","translate("+(that.margin_left)+","+(that.margin_top + that.legendsGroup_height)+")")
                    .attr("id","main2");

                if(PykCharts['boolean'](that.axis_x_enable) || that.axis_x_title) {
                    that.xGroup = that.group.append("g")
                        .attr("class", "x axis")
                        .attr("id","xaxis")
                        .style("stroke","black");
                }

                if(PykCharts['boolean'](that.axis_y_enable) || that.axis_y_title){
                    that.yGroup = that.group.append("g")
                        .attr("class", "y axis")
                        .attr("id","yaxis")
                        .style("stroke","blue");
                }

                that.clip = that.group.append("svg:clipPath")
                            .attr("id", "clip" + i + that.selector)
                            .append("svg:rect")
                            .attr("width",(that.w-that.margin_left-that.margin_right-that.legendsGroup_width))
                            .attr("height", that.height-that.margin_top-that.margin_bottom - that.legendsGroup_height);

                that.chartBody = that.group.append("g")
                            .attr("id","clip"+i)
                            .attr("clip-path", "url(#clip" + i + that.selector +")");

                return this;
            },
            legendsContainer : function (i) {

                if (PykCharts['boolean'](that.legends_enable) && that.map_group_data[1] && that.mode === "default") {
                        that.legendsGroup = that.svgContainer.append("g")
                                    .attr('id',"legends")
                                    .style("visibility","visible");
                } else {
                    that.legendsGroup_width = 0;
                    that.legendsGroup_height = 0;
                }

                return this;
            },
            createChart : function (index) {
                that.weight = _.map(that.new_data, function (d) {
                    return d.weight;
                });
                that.weight = _.reject(that.weight,function (num) {
                    return num == 0;
                });
                that.sorted_weight = that.weight.slice(0);
                that.sorted_weight.sort(function(a,b) { return a-b; });

                that.x_tick_values = that.k.processXAxisTickValues();
                that.y_tick_values = that.k.processYAxisTickValues();

                that.group.append("text")
                    .attr("fill", "black")
                    .attr("text-anchor", "end")
                    .attr("x", that.w - 70)
                    .attr("y", that.height + 40);

                if(that.zoomed_out === true) {

                    var x_domain,x_data = [],y_data = [],y_range,x_range,y_domain, min_x_tick_value,max_x_tick_value, min_y_tick_value,max_y_tick_value;

                    if(that.axis_y_data_format === "number") {
                        y_domain = d3.extent(that.data, function(d) { return parseFloat(d.y) });
                        y_data = that.k.__proto__._domainBandwidth(y_domain,2,"number");
                        y_range = [that.height - that.margin_top - that.margin_bottom - that.legendsGroup_height, 0];

                        min_y_tick_value = d3.min(that.y_tick_values);
                        max_y_tick_value = d3.max(that.y_tick_values);

                        if(y_data[0] > min_y_tick_value) {
                            y_data[0] = min_y_tick_value;
                        }
                        if(y_data[1] < max_y_tick_value) {
                            y_data[1] = max_y_tick_value;
                        }

                        that.yScale = that.k.scaleIdentification("linear",y_data,y_range);
                        that.extra_top_margin = 0;

                    } else if(that.axis_y_data_format === "string") {
                        that.data.forEach(function(d) { y_data.push(d.y); });
                        y_range = [0,that.height - that.margin_top - that.margin_bottom - that.legendsGroup_height];
                        that.yScale = that.k.scaleIdentification("ordinal",y_data,y_range,0);
                        that.extra_top_margin = (that.yScale.rangeBand() / 2);
                    } else if (that.axis_y_data_format === "time") {
                        y_data = d3.extent(that.data, function (d) { return new Date(d.x); });

                        min_y_tick_value = d3.min(that.y_tick_values, function (d) {
                            return new Date(d);
                        });

                        max_y_tick_value = d3.max(that.y_tick_values, function (d) {
                            return new Date(d);
                        });

                        if(new Date(y_data[0]) > new Date(min_y_tick_value)) {
                            y_data[0] = min_y_tick_value;
                        }
                        if(new Date(y_data[1]) < new Date(max_y_tick_value)) {
                            y_data[1] = max__tick_value;
                        }

                        y_range = [that.height - that.margin_top - that.margin_bottom - that.legendsGroup_height, 0];
                        that.yScale = that.k.scaleIdentification("time",y_data,y_range);
                        that.extra_top_margin = 0;
                    }
                    if(that.axis_x_data_format === "number") {

                        x_domain = d3.extent(that.data, function(d) { return parseFloat(d.x); });
                        x_data = that.k.__proto__._domainBandwidth(x_domain,2);

                        min_x_tick_value = d3.min(that.x_tick_values);
                        max_x_tick_value = d3.max(that.x_tick_values);

                        if(x_data[0] > min_x_tick_value) {
                            x_data[0] = min_x_tick_value;
                        }
                        if(x_data[1] < max_x_tick_value) {
                            x_data[1] = max_x_tick_value;
                        }

                        x_range = [0 ,that.w - that.margin_left - that.margin_right - that.legendsGroup_width];
                        that.x = that.k.scaleIdentification("linear",x_data,x_range);
                        that.extra_left_margin = 0;

                    } else if(that.axis_x_data_format === "string") {
                        that.data.forEach(function(d) { x_data.push(d.x); });
                        x_range = [0 ,that.w - that.margin_left - that.margin_right - that.legendsGroup_width];
                        that.x = that.k.scaleIdentification("ordinal",x_data,x_range,0);
                        that.extra_left_margin = (that.x.rangeBand()/2);

                    } else if (that.axis_x_data_format === "time") {
                        
                        max = d3.max(that.data, function(k) { return k.x; });
                        min = d3.min(that.data, function(k) { return k.x; });
                        x_domain = [min.getTime(),max.getTime()];
                        x_data = that.k.__proto__._domainBandwidth(x_domain,2,"time");

                        min_x_tick_value = d3.min(that.x_tick_values, function (d) {
                            return that.k.dateConversion(d);
                        });

                        max_x_tick_value = d3.max(that.x_tick_values, function (d) {
                            return that.k.dateConversion(d);
                        });

                        if(x_data[0] > min_x_tick_value) {
                            x_data[0] = min_x_tick_value;
                        }
                        if(x_data[1] < max_x_tick_value) {
                            x_data[1] = max_x_tick_value;
                        }

                        x_range = [0 ,that.w - that.margin_left - that.margin_right];
                        that.x = that.k.scaleIdentification("time",x_data,x_range);
                        
                        that.extra_left_margin = 0;
                    }

                    that.xdomain = that.x.domain();
                    that.ydomain = that.yScale.domain();
                    that.x1 = 1;
                    that.y1 = 12;
                    that.count = 1;
                    if(type!== "pulse") {
                        var zoom = d3.behavior.zoom()
                                .scale(that.count)
                                .x(that.x)
                                .y(that.yScale)
                                .on("zoom",zoomed);
                    }


                    if(PykCharts['boolean'](that.zoom_enable) && !(that.axis_y_data_format==="string" || that.axis_x_data_format==="string") && (that.mode === "default") ) {
                        var n;
                        if(PykCharts['boolean'](that.panels_enable)) {
                            n = that.no_of_groups;
                        } else {
                            n = 1;
                        }

                        for(var i = 0; i < that.no_of_groups; i++) {
                            d3.select(that.selector+ " #svgcontainer" +i)
                                .call(zoom)

                            d3.select(that.selector+ " #svgcontainer" +i)
                                .on("wheel.zoom", null)
                                .on("mousewheel.zoom", null);
                        }
                    }
                    that.optionalFeatures().plotCircle(index);
                }
                return this ;
            },
            legends : function (index) {

                if (PykCharts['boolean'](that.legends_enable) && that.map_group_data[1] && that.mode==="default") {
                    var unique = _.uniq(that.sorted_weight);
                    var k = 0,
                        l = 0,
                        translate_x = 0;


                    if(that.legends_display === "vertical" ) {
                        that.legendsGroup.attr("height", (that.map_group_data[0].length * 30)+20);
                        that.legendsGroup_height = 0;

                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        text_parameter1value = function (d,i) { return 36; };
                        rect_parameter3value = function (d,i) { return 20; };
                        var rect_parameter4value = function (d,i) { return i * 24 + 12;};
                        var text_parameter2value = function (d,i) { return i * 24 + 23;};

                    } else if(that.legends_display === "horizontal") {
                        that.legendsGroup_height = 50;
                        final_rect_x = 0;
                        final_text_x = 0;
                        legend_text_widths = [];
                        sum_text_widths = 0;
                        temp_text = temp_rect = 0;
                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";

                        var text_parameter1value = function (d,i) {
                            legend_text_widths[i] = this.getBBox().width;
                            legend_start_x = 16;
                            final_text_x = (i === 0) ? legend_start_x : (legend_start_x + temp_text);
                            temp_text = temp_text + legend_text_widths[i] + 30;
                            return final_text_x;
                        };
                        text_parameter2value = 30;
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        var rect_parameter3value = function (d,i) {
                            final_rect_x = (i === 0) ? 0 : temp_rect;
                            temp_rect = temp_rect + legend_text_widths[i] + 30;
                            return final_rect_x;
                        };
                        rect_parameter4value = 18;
                    }

                    var legend;
                    if(PykCharts['boolean'](that.panels_enable)){
                        var abc =[];
                        abc.push(that.map_group_data[0][index]);
                        legend = that.legendsGroup.selectAll("rect")
                            .data(abc);
                        that.legends_text = that.legendsGroup.selectAll(".legends_text")
                            .data(abc);
                    } else {
                        legend = that.legendsGroup.selectAll("rect")
                                .data(that.map_group_data[0]);
                        that.legends_text = that.legendsGroup.selectAll(".legends_text")
                            .data(that.map_group_data[0]);
                    }

                    that.legends_text.enter()
                        .append('text');

                    that.legends_text.attr("class","legends_text")
                        .attr("pointer-events","none")
                        .text(function (d) { return d.group; })
                        .attr("fill", that.legends_text_color)
                        .attr("font-family", that.legends_text_family)
                        .attr("font-size",that.legends_text_size +"px")
                        .attr("font-weight", that.legends_text_weight)
                        .attr(text_parameter1, text_parameter1value)
                        .attr(text_parameter2, text_parameter2value);

                    legend.enter()
                        .append("rect");

                    legend.attr(rect_parameter1, rect_parameter1value)
                        .attr(rect_parameter2, rect_parameter2value)
                        .attr(rect_parameter3, rect_parameter3value)
                        .attr(rect_parameter4, rect_parameter4value)
                        .attr("fill", function (d) {
                            return that.fillChart.colorPieW(d);
                        })
                        .attr("fill-opacity", function (d) {
                            return 0.6;
                        });

                    var legend_container_width = that.legendsGroup.node().getBBox().width, translate_x = 0;

                    if(that.legends_display === "vertical" && !PykCharts['boolean'](that.panels_enable)) {
                        that.legendsGroup_width = legend_container_width + 20 ;
                    } else {
                        that.legendsGroup_width = 0;
                    }

                        translate_x = (that.legends_display === "vertical") ? (that.w - that.legendsGroup_width) : ((!PykCharts['boolean'](that.panels_enable)) ? (that.width - legend_container_width - 20) : that.margin_left);

                    if (legend_container_width < that.w) { that.legendsGroup.attr("transform","translate("+translate_x+",20)"); }
                    that.legendsGroup.style("visibility","visible");

                    that.legends_text.exit().remove();
                    legend.exit().remove();

                        /* !!!!! DO NOT TOUCH THE BELOW COMMENTED CODE, PREVIOUSLY WRITTEN FOR DISPLAYING LEGENDS ON THE NEXT LINE !!!!!*/
                }
                return this;
            },
            ticks : function () {
                if(PykCharts['boolean'](that.enableTicks)) {
                    var tick_label = that.ticksElement.selectAll(".ticks-text")
                        .data(that.new_data);

                    tick_label.enter()
                        .append("text");

                    tick_label.attr("class","ticks-text")
                        .attr("x",function (d) {
                            return that.x(d.x);
                        })
                        .attr("y",function (d) {
                            return that.yScale(d.y) ;
                        })
                        .style("text-anchor", "middle")
                        .style("font-family", that.label_family)
                        .style("font-size",that.label_size + "px")
                        .attr("pointer-events","none")
                        .attr("dx",-1)
                        .attr("dy",function (d) { return -that.sizes(d.weight)-4; });

                setTimeout(function () {
                    tick_label.text(function (d) {return d.name; });
                },that.transitions.duration());

                    tick_label.exit().remove();
                }
                return this;
            },
            plotCircle : function () {
                that.circlePlot = that.chartBody.selectAll(".dot")
                                 .data(that.new_data)

                that.circlePlot.enter()
                            .append("circle")
                            .attr("class", "dot");

                that.circlePlot
                    .attr("r",0)
                    .attr("cx", function (d) { return (that.x(d.x)+that.extra_left_margin); })
                    .attr("cy", function (d) { return (that.yScale(d.y)+that.extra_top_margin); })
                    .attr("fill", function (d) { return that.fillChart.colorPieW(d); })
                    .attr("fill-opacity", function (d) { return that.multiD.opacity(d.weight,that.weight,that.data); })
                    .attr("data-fill-opacity",function () {
                        return $(this).attr("fill-opacity");
                    })
                    .attr("stroke", that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-dasharray", that.border.style())
                    .attr("stroke-opacity",1)
                    .on('mouseover',function (d) {
                        if(that.mode === "default") {
                            tooltipText = d.tooltip ? d.tooltip : "<table><thead><th colspan='2'><b>"+d.name+"</b></th></thead><tr><td>X</td><td><b>"+d.x+"</b></td></tr><tr><td>Y</td><td><b>"+d.y+"<b></td></tr><tr><td>Weight</td><td><b>"+d.weight+"</b></td></tr></table>";
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(tooltipText);
                            if(PykCharts['boolean'](that.onhover_enable)) {
                                that.mouseEvent.highlight(that.selector + " .dot", this);
                            }
                        }
                    })
                    .on('mouseout',function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipHide(d);
                            if(PykCharts['boolean'](that.onhover_enable)) {
                                that.mouseEvent.highlightHide(that.selector + " .dot");
                            }
                        }
                    })
                    .on('mousemove', function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    })
                    .on("dblclick",function() {
                        PykCharts.getEvent().stopPropagation();
                    })
                    .on("mousedown",function() {
                        PykCharts.getEvent().stopPropagation();
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("r", function (d) { return that.sizes(d.weight); });

                that.circlePlot.exit().remove();
                return this;
            },
            label : function () {
                if(PykCharts['boolean'](that.label_size)) {
                    that.circleLabel = that.chartBody.selectAll(".text")
                        .data(that.new_data);

                    that.circleLabel.enter()
                        .append("text")
                        .attr("class","text");

                setTimeout(function () {
                    that.circleLabel
                        .attr("x", function (d) { return (that.x(d.x)+that.extra_left_margin); })
                        .attr("y", function (d) { return (that.yScale(d.y)+that.extra_top_margin + 5); })
                        .attr("text-anchor","middle")
                        .attr("pointer-events","none")
                        .style("font-weight", that.label_weight)
                        .style("font-size", that.label_size + "px")
                        .attr("fill", that.label_color)
                        .style("font-family", that.label_family)
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
                    },that.transitions.duration());

                    that.circleLabel.exit()
                        .remove();
                }
                return this;
            },

        };
        return optional;
    };

    function zoomed () {
        that.zoomed_out = false;

        var id = this.id,
        idLength = id.length,
        n;

        if(PykCharts['boolean'](that.panels_enable)) {
            n = that.no_of_groups;
        } else {
            n = 1;
        }
        for(var i = 0; i < n; i++) {
            var containerId = id.substring(0,idLength-1);
            current_container = d3.select(that.selector+" #"+containerId +i)


            that.k.isOrdinal(current_container,".x.axis",that.x);
            that.k.isOrdinal(current_container,".y.axis",that.yScale);

            that.optionalFeatures().plotCircle()
                                    .label()
                                    .ticks();
            var radius;
            d3.select(that.selector+" #"+containerId +i)
                .selectAll(".dot")
                .attr("r", function (d) {
                    radius = that.sizes(d.weight)*PykCharts.getEvent().scale;
                    return radius;
                })
                .attr("cx", function (d) { return (that.x(d.x)+that.extra_left_margin); })
                .attr("cy", function (d) { return (that.yScale(d.y)+that.extra_top_margin); });

            d3.select(that.selector+" #"+containerId +i)
                .selectAll(".text")
                .style("font-size", that.label_size +"px")
                .attr("x", function (d) { return (that.x(d.x)+that.extra_left_margin); })
                .attr("y", function (d) { return (that.yScale(d.y)+that.extra_top_margin + 5); });
             d3.select(that.selector+" #"+containerId +i)
                .selectAll(".ticks-text")
                        .attr("x",function (d) {
                            return that.x(d.x);
                        })
                        .attr("y",function (d) {
                            return that.yScale(d.y) - radius;
                        })
        }
        if(PykCharts.getEvent().sourceEvent.type === "dblclick") {
            that.count++;
        }
        if(that.count === that.zoom_level+1) {
            for(var i = 0; i < n; i++) {
                if(that.panels_enable==="yes"){
                    that.new_data = [];
                    for(j=0;j<that.data.length;j++) {
                        if(that.data[j].group === that.uniq_group_arr[i]) {
                            that.new_data.push(that.data[j]);
                        }
                    }
                } else {
                    that.new_data = that.data;
                }
                var containerId = id.substring(0,idLength-1);
                d3.select(that.selector+" #"+containerId +i)
                    .call(function () {
                        return that.zoomOut(i);
                    });
                that.count = 1;
            }
       }
    };

    that.zoomOut=function (i) {
        that.zoomed_out = true;
        that.x1 = 1;
        that.y1 = 12;

        that.optionalFeatures().createChart(i)
            .label()
            .ticks();
        var currentSvg = d3.select(that.selector + " #svgcontainer" + i)
        var current_x_axis = currentSvg.select("#xaxis");
        var current_y_axis = currentSvg.select("#yaxis");
        that.k.xAxis(currentSvg,current_x_axis,that.x,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
            .yAxis(currentSvg,current_y_axis,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width);

        d3.select(that.selector+" #svgcontainer" +i)
            .selectAll(".dot")
            .attr("r", function (d) {
                return that.sizes(d.weight);
            })
            .attr("cx", function (d) { return (that.x(d.x)+that.extra_left_margin); })
            .attr("cy", function (d) { return (that.yScale(d.y)+that.extra_top_margin); });

        d3.select(that.selector+" #svgcontainer" +i)
            .selectAll(".text")
            .style("font-size", that.label_size + "px")
            .attr("x", function (d) { return (that.x(d.x)+that.extra_left_margin); })
            .attr("y", function (d) { return (that.yScale(d.y)+that.extra_top_margin + 5); });

    }

    that.renderChart =  function () {

        that.no_of_groups = that.uniq_group_arr.length;
        for(i=0;i<that.no_of_groups;i++){
            that.new_data = [];
            for(j=0;j<that.data.length;j++) {
                if(that.data[j].group === that.uniq_group_arr[i]) {
                    that.new_data.push(that.data[j]);
                }
            }
            that.k.positionContainers(that.legends_enable,that);

            that.k.makeMainDiv((that.selector + " #panels_of_scatter_main_div"),i);

            that.optionalFeatures()
                .svgContainer(i)
                .legendsContainer(i);

            that.k.liveData(that)
                .tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
            that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range);

            that.optionalFeatures()
                .legends(i)
                .createGroups(i)
                .createChart()
                .label()
                .ticks();

            if((i+1)%4 === 0 && i !== 0) {
                that.k.emptyDiv();
            }
            that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
                .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
                .xAxisTitle(that.xGroup,that.legendsGroup_height,that.legendsGroup_width)
                .yAxisTitle(that.yGroup);

        }
        that.k.exportSVG(that,"svgcontainer",type,that.panels_enable,that.uniq_group_arr);
        that.k.emptyDiv();
    };
};
PykCharts.multiD.spiderWeb = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function () {
        var multiDimensionalCharts = theme.multiDimensionalCharts;
        that = new PykCharts.multiD.processInputs(that, options, "spiderweb");
        that.bubbleRadius = options.spiderweb_radius  ? options.spiderweb_radius : (0.6 * multiDimensionalCharts.scatterplot_radius);
        that.outerRadius = options.spiderweb_outer_radius_percent  ? options.spiderweb_outer_radius_percent : multiDimensionalCharts.spiderweb_outer_radius_percent;
        that.panels_enable = "no";
        that.data_sort_enable = "yes";
        that.data_sort_type = "alphabetically";
        that.data_sort_order = "ascending";
        
        try {
            if(!_.isNumber(that.bubbleRadius)) {
                that.bubbleRadius = (0.6 * multiDimensionalCharts.scatterplot_radius);
                throw "spiderweb_radius"
            }
        } 

        catch (err) {
            that.k.warningHandling(err,"1");
        }

        try {
            if(!_.isNumber(that.outerRadius)) {
                that.bubbleRadius = multiDimensionalCharts.spiderweb_outer_radius_percent;
                throw "spiderweb_outer_radius_percent"
            }
        } 

        catch (err) {
            that.k.warningHandling(err,"1");
        }

        if(that.stop) 
            return;
        
        if(that.mode === "default") {
            that.k.loading();
        }

        if(that.outerRadius > 100) {
            that.outerRadius = 100;
        }

        that.multiD = new PykCharts.multiD.configuration(that);
        
        that.inner_radius = 0;
        
        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(that.selector+" #chart-loader").remove();
                $(that.selector).css("height","auto")
                return;
            }

            that.data = that.k.__proto__._groupBy("spiderweb",data);
            that.compare_data = that.k.__proto__._groupBy("spiderweb",data);
            $(that.selector+" #chart-loader").remove();
            $(that.selector).css("height","auto")
            that.render();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };

    that.dataTransformation = function () {
        that.group_arr = [];
        that.uniq_group_arr = [];
        that.x_arr = [];
        that.uniq_x_arr = [];
        that.data = that.k.__proto__._sortData(that.data, "x", "group", that);
        for(j=0; j<that.data.length; j++) {
            that.group_arr[j] = that.data[j].group;
        }
        that.uniq_group_arr = _.uniq(that.group_arr);
        var len = that.uniq_group_arr.length;

        for(var k=0; k<that.data_length; k++) {
            that.x_arr[k] = that.data[k].x;
        }
        var uniq_x_arr = _.unique(that.x_arr);

        that.new_data = [];
        for (k=0; k<len; k++) {
            that.new_data[k] = {
                name: that.uniq_group_arr[k],
                data: []
            };
            for (l=0; l<that.data.length; l++) {
                if (that.uniq_group_arr[k] === that.data[l].group) {
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
        that.new_data_length = that.new_data.length;
    }

    that.refresh = function () {
        that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("spiderweb",data);
            that.refresh_data = that.k.__proto__._groupBy("spiderweb",data);
            that.map_group_data = that.multiD.mapGroup(that.data);
            that.dataTransformation();
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.optionalFeatures()
                .createChart()
                .legends()
                .xAxis()
                .yAxis();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
    };

    this.render = function () {
        that.fillChart = new PykCharts.Configuration.fillChart(that);
        var l = $(".svgcontainer").length;
        that.container_id = "svgcontainer" + l;
        that.border = new PykCharts.Configuration.border(that);
        that.map_group_data = that.multiD.mapGroup(that.data);
        that.dataTransformation();
        
        if(that.mode === "default") {
            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+that.container_id,"spiderweb")
                .emptyDiv()
                .subtitle()
                .makeMainDiv(that.selector,1);
            that.h = that.height;
            that.optionalFeatures()
                .svgContainer(1)
                .legendsContainer(1);
            
            that.k
                .liveData(that)
                .tooltip();
            
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

            that.optionalFeatures()
                .legends()
                .createGroups();
            that.outerRadius = that.k.__proto__._radiusCalculation(that.outerRadius,"spiderweb");
            that.radius_range = [(3*that.outerRadius)/100,(0.09*that.outerRadius)];
            that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range);
            
            that.optionalFeatures()
                .createChart()
                .xAxis()
                .yAxis();
            that.k.createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();

        } else if (that.mode==="infographics") {
            that.k.backgroundColor(that)
                .export(that,"#"+that.container_id,"spiderweb")
                .emptyDiv();
            that.k.makeMainDiv(that.selector,1);
            that.h = that.height;
            that.optionalFeatures().svgContainer(1)
                .legendsContainer()
                .createGroups();
            that.outerRadius = that.k.__proto__._radiusCalculation(that.outerRadius,"spiderweb");
            that.radius_range = [(3*that.outerRadius)/100,(0.09*that.outerRadius)];
            that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range);
            that.optionalFeatures()
                .createChart()
                .xAxis()
                .yAxis();

            that.k.tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        }
        that.k.exportSVG(that,"#"+that.container_id,"spiderweb")
        if(PykCharts['boolean'](that.legends_enable)) {
            $(document).ready(function () { return that.k.resize(that.svgContainer,"",that.legendsContainer); })
            $(window).on("resize", function () { return that.k.resize(that.svgContainer,"",that.legendsContainer); });
        } else {
            $(document).ready(function () { return that.k.resize(that.svgContainer,""); })
            $(window).on("resize", function () { return that.k.resize(that.svgContainer,""); });
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
                that.svgContainer = d3.select(that.selector + " #tooltip-svg-container-" + i)
                    .append("svg")
                    .attr("class","svgcontainer")
                    .attr("id",that.container_id)
                    .attr("width", that.width)
                    .attr("height", that.height)
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height);

                return this;
            },
            createGroups: function () {
                that.group = that.svgContainer.append("g")
                    .attr("id","spidergrp")
                    .attr("transform", "translate(" + (that.width - that.legendsGroup_width) / 2 + "," + ((that.h+that.legendsGroup_height+20)/2) + ")");

                that.ticksElement = that.svgContainer.append("g")
                        .attr("transform", "translate(" + (that.width - that.legendsGroup_width)/ 2 + "," + ((that.h+that.legendsGroup_height+20)/2) + ")");
                return this;
            },
            legendsContainer : function (i) {
                if (PykCharts['boolean'](that.legends_enable) && that.map_group_data[1] && that.mode === "default") {
                    that.legendsGroup = that.svgContainer.append("g")
                        .attr("class","legendgrp")
                        .attr("id","legendgrp");
                } else {
                    that.legendsGroup_width = 0;
                    that.legendsGroup_height = 0;
                }
                return this;
            },
            createChart: function () {
                var i, min, max;
                var uniq = that.new_data[0].data;

                max = d3.max(that.new_data, function (d,i) { return d3.max(d.data, function (k) { return k.y; })});
                min = d3.min(that.new_data, function (d,i) { return d3.min(d.data, function (k) { return k.y; })});

                that.yScale = d3.scale.linear()
                    .domain([min,max])
                    .range([that.inner_radius, that.outerRadius]);
                that.y_domain = [], that.nodes = [];

                for (i=0;i<that.new_data.length;i++){
                    var t = [];
                    for (j=0;j<that.new_data[i].data.length;j++) {
                        t[j] = that.yScale(that.new_data[i].data[j].y);
                    }
                    that.y_domain[i] = t;
                }
                for (i=0;i<that.new_data.length;i++){
                    that.y = d3.scale.linear()
                        .domain(d3.extent(that.y_domain[i], function(d) { return parseFloat(d); }))
                        .range([0.1,0.9]);
                    var xyz = [];
                    for (j=0;j<uniq.length;j++) {
                        xyz[j] = {
                            x: j,
                            y: that.y(that.y_domain[i][j]),
                            tooltip: that.new_data[i].data[j].tooltip || that.new_data[i].data[j].weight
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
                    that.radius = d3.scale.linear().range([that.inner_radius, that.outerRadius]);

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
                            .angle(function(d) { /**/ return that.angle(d.x); })
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
                    var spiderNode = that.group.selectAll(".node"+m)
                        .data(that.nodes[m])

                    spiderNode.enter().append("circle")
                        .attr("class", "dot node"+m)
                        .attr("transform", function(d) { return "rotate(" + that.degrees(that.angle(d.x)) + ")"; })


                    spiderNode.attr("class","dot node"+m)
                        .attr("cx", function (d) { return that.radius(d.y); })
                        .attr("r", function (d,i) { return that.sizes(that.new_data[m].data[i].weight); })
                        .style("fill", function (d,i) {
                            return that.fillChart.colorPieW(that.new_data[m].data[i]);
                        })
                        .attr("fill-opacity", function (d,i) {
                            return that.multiD.opacity(that.new_data[m].data[i].weight,that.weight,that.data);
                        })
                        .attr("data-fill-opacity",function () {
                            return $(this).attr("fill-opacity");
                        })
                        .attr("stroke",that.border.color())
                        .attr("stroke-width",that.border.width())
                        .attr("stroke-dasharray", that.border.style())
                        .on('mouseover',function (d,i) {
                            if(that.mode === "default") {
                                that.mouseEvent.tooltipPosition(d);
                                that.mouseEvent.tooltipTextShow(d.tooltip);
                                if(PykCharts['boolean'](that.onhover_enable)) {
                                    that.mouseEvent.highlight(that.selector + " .dot", this);
                                }
                            }
                        })
                        .on('mouseout',function (d) {
                            if(that.mode === "default") {
                                that.mouseEvent.tooltipHide(d);
                                if(PykCharts['boolean'](that.onhover_enable)) {
                                    that.mouseEvent.highlightHide(that.selector + " .dot");
                                }
                            }
                        })
                        .on('mousemove', function (d) {
                            if(that.mode === "default") {
                                that.mouseEvent.tooltipPosition(d);
                            }
                        });
                    spiderNode.exit().remove();
                }

                that.group.selectAll(".axis")
                    .data(d3.range(that.new_data[0].data.length))
                    .enter().append("line")
                    .attr("class", "axis")
                    .attr("transform", function(d) { return "rotate(" + that.degrees(that.angle(d)) + ")"; })
                    .attr("x1", that.radius.range()[0])
                    .attr("x2", that.radius.range()[1]);

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
                if (PykCharts['boolean'](that.legends_enable) && that.map_group_data[1] && that.mode==="default") {
                    var unique = _.uniq(that.sorted_weight);
                    var k = 0;
                    var l = 0;
                    if(that.legends_display === "vertical" ) {
                        that.legendsGroup.attr("height", (that.map_group_data[0].length * 30)+20);
                        that.legendsGroup_height = 0;
                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        text_parameter1value = function (d,i) { return 36; };
                        rect_parameter3value = function (d,i) { return 20; };
                        var rect_parameter4value = function (d,i) { return i * 24 + 12;};
                        var text_parameter2value = function (d,i) { return i * 24 + 23;};


                    } else if(that.legends_display === "horizontal") {
                        that.legendsGroup_height = 50;
                        final_rect_x = 0;
                        final_text_x = 0;
                        legend_text_widths = [];
                        sum_text_widths = 0;
                        temp_text = temp_rect = 0;
                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";

                        var text_parameter1value = function (d,i) {
                            legend_text_widths[i] = this.getBBox().width;
                            legend_start_x = 16;
                            final_text_x = (i === 0) ? legend_start_x : (legend_start_x + temp_text);
                            temp_text = temp_text + legend_text_widths[i] + 30;
                            return final_text_x;
                        };
                        text_parameter2value = 30;
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        var rect_parameter3value = function (d,i) {
                            final_rect_x = (i === 0) ? 0 : temp_rect;
                            temp_rect = temp_rect + legend_text_widths[i] + 30;
                            return final_rect_x;
                        };
                        rect_parameter4value = 18;
                    }

                    var legend = that.legendsGroup.selectAll("rect")
                            .data(that.map_group_data[0]);

                    that.legends_text = that.legendsGroup.selectAll(".legends_text")
                        .data(that.map_group_data[0]);

                    that.legends_text.enter()
                        .append('text');

                    that.legends_text.attr("class","legends_text")
                        .attr("pointer-events","none")
                        .text(function (d) { return d.group; })
                        .attr("fill", that.legends_text_color)
                        .attr("font-family", that.legends_text_family)
                        .attr("font-size",that.legends_text_size +"px")
                        .attr("font-weight", that.legends_text_weight)
                        .attr(text_parameter1, text_parameter1value)
                        .attr(text_parameter2, text_parameter2value);

                    legend.enter()
                        .append("rect");

                    legend.attr(rect_parameter1, rect_parameter1value)
                        .attr(rect_parameter2, rect_parameter2value)
                        .attr(rect_parameter3, rect_parameter3value)
                        .attr(rect_parameter4, rect_parameter4value)
                            .attr("fill", function (d) {
                            return that.fillChart.colorPieW(d);
                        })
                        .attr("fill-opacity", function (d) {
                            return 0.6;
                        });

                    var legend_container_width = that.legendsGroup.node().getBBox().width, translate_x;

                    if(that.legends_display === "vertical") {
                        that.legendsGroup_width = legend_container_width + 20;
                    } else  {
                        that.legendsGroup_width = 0;
                    }
      
                    translate_x = (that.legends_display === "vertical") ? (that.width - that.legendsGroup_width) : (that.width - legend_container_width - 20);
                    
                    if (legend_container_width < that.width) { that.legendsGroup.attr("transform","translate("+translate_x+",10)"); }
                    that.legendsGroup.style("visibility","visible");
                    
                    that.legends_text.exit().remove();
                    legend.exit().remove();

                    /* !!!!! DO NOT TOUCH THE BELOW COMMENTED CODE, PREVIOUSLY WRITTEN FOR DISPLAYING LEGENDS ON THE NEXT LINE !!!!!*/
                }
                return this;
            },
            xAxis : function () {
                    that.length = that.new_data[0].data.length;

                    var spiderAxisTitle = that.group.selectAll("text.axisTitle")
                        .data(that.nodes[0]);
                    spiderAxisTitle.enter()
                        .append("text")
                        .attr("class","axisTitle");

                    spiderAxisTitle
                        .attr("transform", function(d, i){
                            return "translate(" + (-that.outerRadius) + "," + (-that.outerRadius) + ")";
                        })
                        .style("text-anchor","middle")
                        .attr("x", function (d, i){ return that.outerRadius*(1-0.2*Math.sin(i*2*Math.PI/that.length))+(that.outerRadius * 1.25)*Math.sin(i*2*Math.PI/that.length);})
                        .attr("y", function (d, i){
                            return that.outerRadius*(1-0.60*Math.cos(i*2*Math.PI/that.length))-(that.outerRadius * 0.47)*Math.cos(i*2*Math.PI/that.length);
                        })
                        .style("font-size",that.axis_x_pointer_size + "px")
                        .style("font-family",that.axis_x_pointer_family)
                        .style("font-weight",that.axis_x_pointer_weight)
                        .style("fill",that.axis_x_pointer_color)

                    spiderAxisTitle
                        .text(function (d,i) { return that.new_data[0].data[i].x; });

                    spiderAxisTitle.exit().remove();
                return this;
            },
            yAxis: function () {
                    var a = that.yScale.domain();
                    var t = a[1]/4;
                    var b = [];
                    for(i=4,j=0; i>=0 ;i--,j++){
                        b[j]=i*t;
                    }
                    var tick_label = that.ticksElement.selectAll("text.ticks")
                        .data(b);

                    tick_label.enter()
                        .append("text")
                        .attr("class","ticks"); 
                    tick_label
                        .style("text-anchor","start")
                        .attr("transform", "translate(5,"+(-that.outerRadius)+")") 
                        .attr("x",0)
                        .attr("y", function (d,i) { return (i*(that.outerRadius/4)); })
                        .attr("dy",-2);

                    tick_label               
                        .text(function (d,i) { return d; })
                        .style("font-size",that.axis_y_pointer_size + "px")
                        .style("font-family",that.axis_y_pointer_family)
                        .style("font-weight",that.axis_y_pointer_weight)
                        .style("fill",that.axis_y_pointer_color);

                    tick_label.exit().remove();
                return this;
            },
            sort : function() {
                if(that.axis_y_data_format === "string") {
                    try {
                        if(that.data_sort_type === "alphabetically") {
                            that.data = that.k.__proto__._sortData(that.data, "y", "group", that);
                        } else {
                            that.data_sort_type = multiDimensionalCharts.data_sort_type;
                            throw "data_sort_type";
                        }
                    }
                    catch(err) {
                        that.k.warningHandling(err,"8");
                    }
                }
                return this;
            }
        }
        return optional;
    };
};
PykCharts.multiD.river = function (options){
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function (){
        that = new PykCharts.multiD.processInputs(that, options, "area");
        var multiDimensionalCharts = theme.multiDimensionalCharts,
            stylesheet = theme.stylesheet,
            optional = options.optional;
        that.data_mode_enable = options.data_mode_enable ? options.data_mode_enable.toLowerCase() : multiDimensionalCharts.data_mode_enable;
        if(PykCharts.boolean(that.data_mode_enable) && that.mode === "default") {
            that.chart_mode = options.data_mode_default ? options.data_mode_default.toLowerCase() : multiDimensionalCharts.data_mode_default;
            that.data_mode_legends_color = options.data_mode_legends_color ? options.data_mode_legends_color : multiDimensionalCharts.data_mode_legends_color;
        } else {
            that.data_mode_enable = "no";
            that.chart_mode = "absolute";
        }
        that.connecting_lines_color = options.connecting_lines_color ? options.connecting_lines_color : multiDimensionalCharts.connecting_lines_color;
        that.connecting_lines_style = options.connecting_lines_style ? options.connecting_lines_style : multiDimensionalCharts.connecting_lines_style;
        switch(that.connecting_lines_style) {
            case "dotted" : that.connecting_lines_style = "1,3";
                            break;
            case "dashed" : that.connecting_lines_style = "5,5";
                           break;
            default : that.connecting_lines_style = "0";
                      break;
        }
        that.legends_mode = options.legends_mode ? options.legends_mode : multiDimensionalCharts.legends_mode;
        that.expand_group = options.expand_group ? options.expand_group : multiDimensionalCharts.expand_group;
        that.text_between_steps_color = options.text_between_steps_color ? options.text_between_steps_color : multiDimensionalCharts.text_between_steps_color;
        that.text_between_steps_weight = options.text_between_steps_weight ? options.text_between_steps_weight.toLowerCase() : multiDimensionalCharts.text_between_steps_weight;
        that.text_between_steps_family = options.text_between_steps_family ? options.text_between_steps_family.toLowerCase() : multiDimensionalCharts.text_between_steps_family;
        that.text_between_steps_size = "text_between_steps_size" in options ? options.text_between_steps_size : multiDimensionalCharts.text_between_steps_size;
        that.k.validator()
            .validatingDataType(that.text_between_steps_size,"text_between_steps_size",multiDimensionalCharts.text_between_steps_size,"text_between_steps_size")
            .validatingFontWeight(that.text_between_steps_weight,"text_between_steps_weight",multiDimensionalCharts.text_between_steps_weight,"text_between_steps_weight")
            .validatingColor(that.text_between_steps_color,"text_between_steps_color",multiDimensionalCharts.text_between_steps_color,"text_between_steps_color")
            .validatingColor(that.connecting_lines_color,"connecting_lines_color",multiDimensionalCharts.connecting_lines_color,"connecting_lines_color")
            .validatingColor(that.data_mode_legends_color,"data_mode_legends_color",multiDimensionalCharts.data_mode_legends_color,"data_mode_legends_color")
            .validatingDataMode(that.chart_mode,"data_mode_default",multiDimensionalCharts.data_mode_default,"chart_mode")
            .validatingLegendsMode(that.legends_mode,"legends_mode",multiDimensionalCharts.legends_mode,"legends_mode");

        if(that.stop)
            return;

        if(that.mode === "default") {
            that.k.loading();
        }

        that.w = that.width - that.margin_left - that.margin_right;
        that.h = that.height - that.margin_top - that.margin_bottom;
        that.multiD = new PykCharts.multiD.configuration(that);
        that.filterList = [];
        that.fullList = [];
        that.extended = that.chart_mode === "absolute" ? false : true;

        that.executeData = function (data) {

            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(that.selector+" #chart-loader").remove();
                $(options.selector).css("height","auto")
                return;
            }

            that.data = data;
            that.data.forEach(function (d) {
                d.group = d.stack;
            })
            that.axis_y_data_format = "number";
            that.axis_x_data_format = "number"
            that.compare_data = that.data;
            that.data_length = that.data.length;
            $(that.selector+" #chart-loader").remove();
            $(options.selector).css("height","auto")
            that.map_group_data = that.multiD.mapGroup(that.data);
            that.dataTransformation();
            that.render();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };
    this.render = function () {
        that.multid = new PykCharts.multiD.configuration(that);
        that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.border = new PykCharts.Configuration.border(that);
        if(that.mode === "default") {
            that.k.title()
                    .backgroundColor(that)
                    .export(that,"#svg-1","river")
                    .liveData(that)
                    .emptyDiv()
                    .subtitle()
                    .tooltip();
            that.optional_feature()
                .svgContainer(1)
                .legendsContainer()
                .legends()
                .dataModeContainer()
                .dataMode()
                .createGroups(1)
                .preProcessing()
                .ticks()
                .yAxisLabel()
                .grids()
                .durationLabel()
                .createChart()
                .connectingLines()

                .highlight();

            that.k.createFooter()
                    .lastUpdatedAt()
                    .credits()
                    .dataSource();
        }
        else if(that.mode === "infographics") {
              that.k.liveData(that)
                        .backgroundColor(that)
                        .export(that,"#svg-1","river")
                        .emptyDiv()
                        .makeMainDiv(options.selector,1);

              that.optional_feature()
                        .svgContainer(1)
                        .legendsContainer()
                        .dataModeContainer()
                        .dataMode()
                        .createGroups(1)
                        .preProcessing()
                        .ticks()
                        .yAxisLabel()
                        .grids()
                        .durationLabel()
                        .createChart()
                        .connectingLines();

        }
        that.k.exportSVG(that,"#svg-1","river")
        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        $(document).ready(function () { return that.k.resize(that.svgContainer); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer); });

    };
    that.dataTransformation = function () {
        that.group_arr = [], that.new_data = [],that.uniq_alias_arr = [],that.uniq_duration_arr = [];
        that.data_length = that.data.length;
        for(j = 0;j < that.data_length;j++) {
            that.group_arr[j] = that.data[j].y;
        }
        that.uniq_group_arr = _.unique(that.group_arr);
        var len = that.uniq_group_arr.length;
        for (k = 0;k < len;k++) {
            for (l = 0;l < that.data_length;l++) {
                if (that.uniq_group_arr[k] === that.data[l].y) {
                    that.uniq_alias_arr[k] = that.data[l].alias;
                    that.uniq_duration_arr[k] = that.data[l].text_between_steps || "";
                    break;
                }
            }
        }

        for (k = 0;k < len;k++) {
            that.new_data[k] = {
                    display_name: that.uniq_group_arr[k],
                    breakup: [],
                    technical_name: that.uniq_alias_arr[k],
                    duration: that.uniq_duration_arr[k]
            };
            for (l = 0;l < that.data_length;l++) {
                if (that.uniq_group_arr[k] === that.data[l].y) {
                    that.new_data[k].breakup.push({
                        count: +that.data[l].x,
                        name: that.data[l].stack,
                        tooltip: that.data[l].tooltip,
                        color: that.data[l].color
                    });
                }
            }
        }
        that.opacity_array = [];
        that.new_data_length = that.new_data.length;
        for(i = 0; i<that.new_data_length;i++) {
            that.opacity_array.push(((that.new_data_length-i)/that.new_data_length)) 
        }
    };
    that.refresh = function() {
        that.executeRefresh = function (e, data) {
            that.data = data;
            that.refresh_data = data;
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.data.forEach(function (d) {
                d.group = d.stack;
            })
            that.map_group_data = that.multiD.mapGroup(that.data);
            that.dataTransformation();
            that.draw();
            that.optional_feature().grids()
                .yAxisLabel()
                .durationLabel();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
    }
    this.draw = function(){
        that.optional_feature().legends().dataMode().preProcessing().createChart().grids();
        that.optional_feature().connectingLines().ticks().highlight();
    };
    that.optional_feature = function (){
        var optional = {
            svgContainer: function (i){
                $(that.selector).attr("class","PykCharts-twoD PykCharts-multi-series2D PykCharts-line-chart");

                that.svgContainer = d3.select(options.selector).append("svg:svg")
                    .attr("id","svg-"+i)
                    .attr("width",that.width)
                    .attr("height",that.height)
                    .attr("class","svgcontainer PykCharts-river")
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height);
                return this;
            },
            createGroups : function (i) {
                that.group = that.svgContainer.append("g")
                    .attr("id","chartsvg")
                    .attr("transform","translate("+ that.margin_left +","+ (that.legendsGroup_height)+")");
                that.ygroup = that.svgContainer.append("g")
                    .attr("transform","translate("+ 0 +","+ (that.legendsGroup_height)+")");
                that.grid_group = that.svgContainer.append("g")
                    .attr("transform","translate("+ 0 +","+ (that.legendsGroup_height)+")");
                that.ticks_group = that.svgContainer.append("g")
                    .attr("transform","translate("+ (0) +","+ (that.legendsGroup_height)+")")
                return this;
            },
            dataModeContainer : function () {
                that.chart_mode_group = that.svgContainer.append("g")
                    .attr("translate","transform(0,0)");
                return this;
            },
            legendsContainer : function (i) {
                if(PykCharts.boolean(that.legends_enable) && that.mode === "default") {
                    that.legendsGroup = that.svgContainer.append("g")
                        .attr('id',"legends")
                        .style("visibility","visible")
                        .attr("class", "legend-holder")
                        // .attr("transform","translate(0,10)");
                } else {
                    that.legendsGroup_height = 0;
                    that.legendsGroup_width = 0;
                    that.new_data[0].breakup.forEach(function(d) {
                        that.filterList.push(d.name);
                        that.fullList.push(d.name);
                    })
                }
                var opacity_array =  that.new_data[0].breakup.map(function(d) {
                    return d.name
                })
                that.color_opacity = d3.scale.ordinal()
                        .domain(opacity_array)
                        .rangeBands([1,0.1]);
                return this;
            },
            preProcessing: function () {
                that.new_data1 = jQuery.extend(true, [], that.new_data);
                that.highlightdata = [],highlight_index = -1;
                that.new_data1 = that.filter(that.new_data1);
                that.new_data1 = that.parseData(that.new_data1);
                that.maxTotalVal = that.maxTotal(that.new_data1);
                that.highlight_enable = false;
                that.yScale = d3.scale.linear().domain([0, that.height]).range([0, that.height-that.legendsGroup_height]);
                that.barHeight = (that.height) / (that.new_data1.length * 2);
                that.barMargin = that.barHeight * 2;

                return this;
            },
            createChart : function () {
                
                that.margin_left = that.max_label + 10;
                that.margin_right = that.max_duration > that.max_tick ? (that.max_duration + 10) : (that.max_tick + 10);
                var height = that.height;
                var width = that.width - that.legendsGroup_width - that.margin_right - that.margin_left;
                that.group.attr("transform","translate("+ that.margin_left +","+ (that.legendsGroup_height)+")");
                if(!that.extended) {
                    that.xScale = d3.scale.linear().domain([0, that.maxTotalVal]).range([0, width]);
                } else {
                    that.xScale = d3.scale.linear().range([0, width]);
                }
                var svg = that.group;
                var groups = svg.selectAll("g.bar-holder").data(that.new_data1);

                groups.enter().append("g").attr("class", "bar-holder")
                    .attr("transform", function(d, i){
                        var y = that.yScale(i * that.barMargin);
                        var x = that.xScale((that.maxTotalVal - d.breakupTotal) / 2);
                        if(that.extended) {
                            var x = 0;
                        }

                        return "translate("+x+","+y+")";
                    });

                groups.transition().duration(that.transitions.duration())
                    .attr("transform", function(d, i){
                        var y = that.yScale(i * that.barMargin);
                        var x = that.xScale((that.maxTotalVal - d.breakupTotal) / 2);
                        if(that.extended){
                            x = that.yScale(0);
                        }
                        if(d.display_name.toLowerCase() === that.highlight.toLowerCase()) {
                            that.highlightdata.push(d);
                            that.highlight_index = i;
                            that.highlight_enable = true;
                        }
                        return "translate("+x+","+y+")";
                    });

                groups.exit().remove();

                var bar_holder = svg.selectAll("g.bar-holder")[0];
                for(var i = 0; i<that.new_data1.length; i++){
                    var group = bar_holder[i];
                    var breakup = that.new_data1[i].breakup;
                    var len = that.new_data[i].breakup.length;
                    if(that.extended) {
                        that.xScale.domain([0,that.new_data1[i].breakupTotal]);
                    }

                    var rects = d3.select(group).selectAll("rect").data(breakup);

                    rects.enter().append("rect").attr("width", 0).attr("class","rect");

                    rects.transition().duration(that.transitions.duration())
                        .attr("x", function(d, i){
                            if (i === 0) return 0;
                            var shift = 0;
                            for(var j = 0; j < i; j++){
                                shift += breakup[j].count;
                            }
                            return that.xScale(shift);
                        })
                        .attr("y", 0)
                        .attr("height", function(d, i){

                            return (that.barHeight * (height - that.legendsGroup_height)) / height;

                        })
                        .attr("width", function(d,i){
                            return that.xScale(d.count);
                        });

                    rects.attr("fill", function (d) {
                            return that.fillColor.colorPieMS(d);
                        })
                        .attr("stroke",that.border.color())
                        .attr("stroke-width",that.border.width())
                        .attr("stroke-dasharray", that.border.style())
                        .attr("fill-opacity", function (d,i) {
                            if(that.color_mode === "saturation") {
                                return that.color_opacity(d.name);
                            }
                            return 1;
                        })
                        .attr("data-fill-opacity",function () {
                            return $(this).attr("fill-opacity");
                        })
                        .on("mouseover", function(d, i){
                            if(that.mode === "default") {
                                that.mouseEvent.tooltipPosition(d);
                                that.mouseEvent.tooltipTextShow(d.tooltip ? d.tooltip : d.y);
                                if(PykCharts.boolean(that.onhover_enable)) {
                                    that.mouseEvent.highlight(options.selector + " .rect", this);
                                }
                            }
                        })
                        .on("mousemove", function(d){
                            if(that.mode === "default") {
                                that.mouseEvent.tooltipPosition(d);
                            }
                        })
                        .on("mouseout", function(d){
                            if(that.mode === "default") {
                                that.mouseEvent.tooltipHide(d);
                                if(PykCharts.boolean(that.onhover_enable)) {
                                    that.mouseEvent.highlightHide(options.selector + " .rect")
                                }
                            }
                        })
                        .on("click", function(d, i){
                            if(PykCharts.boolean(that.expand_group) && that.mode === "default") {
                                that.onlyFilter(d.name);
                            }
                        });

                    rects.exit().transition().duration(that.transitions.duration()).attr("width", 0).remove();
                    if(PykCharts.boolean(that.expand_group)) {
                        rects.style("cursor","pointer");
                    }
                }
                return this;
            },
            grids: function () {
                if(PykCharts.boolean(that.grid_y_enable)) {

                    var width = that.width - that.legendsGroup_width;
                    var top_grid = that.grid_group.selectAll("line.top_line")
                        .data(that.new_data1)
                    top_grid.enter()
                        .append("line")
                    top_grid.attr("class", "top_line")
                        .attr("x1", 0).attr("x2", width)
                        .attr("y1", function(d, i){
                            return that.yScale(i * that.barMargin);
                        })
                        .attr("y2", function(d, i){
                            return that.yScale(i * that.barMargin);
                        })
                        .attr("stroke",that.grid_color);
                    top_grid.exit().remove();

                    var bottom_grid = that.grid_group.selectAll("line.bottom_line")
                        .data(that.new_data1);
                    bottom_grid.enter()
                        .append("line")
                    bottom_grid.attr("class", "bottom_line")
                        .attr("x1", 0).attr("x2", width)
                        .attr("y1", function(d, i){
                            return that.yScale((i * that.barMargin) + that.barHeight);
                        })
                        .attr("y2", function(d, i){
                            return that.yScale((i * that.barMargin) + that.barHeight);
                        })
                        .attr("stroke",that.grid_color);
                    bottom_grid.exit().remove();
                }
                return this;
            },
            connectingLines: function () {
                if(!that.extended) {
                    $("line.left_line").fadeIn();
                    $("line.right_line").fadeIn();
                    var left_angles = that.group.selectAll("line.left_line").data(that.new_data1);

                    left_angles.enter().append("line").attr("class", "left_line")
                        .attr("y2", function(d,i){
                            return that.yScale((i * that.barMargin) + that.barHeight);
                        })
                        .attr("x2", function(d,i){
                            return that.xScale((that.maxTotalVal - d.breakupTotal) / 2);
                        });
                    left_angles.style("stroke-width", function(d,i){
                            if(!that.new_data1[i+1]) return "0";
                        })
                    left_angles.transition().duration(that.transitions.duration())
                        .style("stroke-width", 1)
                        .style("stroke", that.connecting_lines_color)
                        .style("stroke-dasharray", that.connecting_lines_style)
                        .style("shape-rendering", "auto")
                        .style("stroke-width", function(d,i){
                            if(!that.new_data1[i+1]) return "0";
                        })
                        .attr("y1", function(d,i){
                            return that.yScale((i * that.barMargin) + that.barHeight);
                        })
                        .attr("x1", function(d,i){
                            return that.xScale((that.maxTotalVal - d.breakupTotal) / 2);
                        })
                        .attr("y2", function(d,i){
                            return that.yScale(((i+1) * that.barMargin));
                        })
                        .attr("x2", function(d,i){
                            if(!that.new_data1[i+1]) return 0;
                            return that.xScale((that.maxTotalVal - that.new_data1[i+1].breakupTotal) / 2);

                        });
                    left_angles.exit().remove();
                    var right_angles = that.group.selectAll("line.right_line").data(that.new_data1);

                    right_angles.enter().append("line").attr("class", "right_line")
                        .attr("y2", function(d,i){
                            return that.yScale((i * that.barMargin) + that.barHeight);
                        })
                        .attr("x2", function(d,i){
                            return that.xScale(((that.maxTotalVal - d.breakupTotal) / 2) + d.breakupTotal);
                        });
                    right_angles.style("stroke-width", function(d,i){
                            if(!that.new_data1[i+1]) return "0";
                        })
                    right_angles.transition().duration(that.transitions.duration())
                        .style("stroke-width", 1)
                        .style("stroke", that.connecting_lines_color)
                        .style("stroke-dasharray", that.connecting_lines_style)
                        .style("shape-rendering", "auto")
                        .style("stroke-width", function(d,i){
                            if(!that.new_data1[i+1]) return "0";
                        })
                        .attr("y1", function(d,i){
                            return that.yScale((i * that.barMargin) + that.barHeight);
                        })
                        .attr("x1", function(d,i){
                            return that.xScale(((that.maxTotalVal - d.breakupTotal) / 2) + d.breakupTotal);
                        })
                        .attr("y2", function(d,i){
                            return that.yScale(((i+1) * that.barMargin));
                        })
                        .attr("x2", function(d,i){
                            if(!that.new_data1[i+1]) return 0;
                            return that.xScale(((that.maxTotalVal - that.new_data1[i+1].breakupTotal) / 2) + that.new_data1[i+1].breakupTotal);
                        });
                    right_angles.exit().remove();
                } else if(that.extended) {
                    $("line.left_line").remove();
                    $("line.right_line").remove();
                }
                return this;
            },
            ticks: function () {
                if(PykCharts.boolean(that.pointer_size)) {
                    var tick_text_width = [];
                    var width = that.width - that.legendsGroup_width;
                    var display_name = that.ticks_group.selectAll("text.cool_label").data(that.new_data1);

                    display_name.enter().append("text").attr("class", "cool_label");

                    display_name.attr("x", width)
                        .attr("y", function(d, i){
                            return that.yScale((i * that.barMargin) + (that.barHeight/2) + 5);
                        })
                        .text(function(d, i){
                            return d.breakupTotal + " " + d.technical_name;
                        })
                        .text(function(d,i){
                            var x = this.getBBox().width;
                            tick_text_width.push(x);
                            return d.breakupTotal + " " + d.technical_name;
                        })
                        .style("font-weight", that.pointer_weight)
                        .style("font-size", that.pointer_size + "px")
                        .attr("fill", that.pointer_color)
                        .style("font-family", that.pointer_family)
                        .attr("text-anchor","end");
                    that.max_tick = d3.max(tick_text_width,function (d) { return d; })
                    display_name.exit().remove();
                }
                return this;
            },
            yAxisLabel : function () {
                var left_labels = that.ygroup.selectAll("text.left_label").data(that.new_data1);
                var label_text_width = [];
                left_labels.enter().append("svg:text").attr("class", "left_label");

                left_labels
                    .attr("y", function(d, i){
                        return that.yScale((i * that.barMargin) + (that.barHeight/2) + 5);
                    })
                    .attr("x", 0)
                    .text(function(d,i){
                        return d.display_name;
                    })
                    .text(function (d,i) {
                        var x = this.getBBox().width;
                        label_text_width.push(x);
                        return d.display_name;
                    })
                    .style("font-size",that.axis_y_pointer_size + "px")
                    .style("fill",that.axis_y_pointer_color)
                    .style("font-weight",that.axis_y_pointer_weight)
                    .style("font-family",that.axis_y_pointer_family);
                that.max_label = d3.max(label_text_width,function (d) { return d; })
                left_labels.exit().remove();
                return this;
            },
            highlight : function () {
                if(that.highlight_enable) {
                    var highlight_rect = that.group.selectAll(".highlight-rect")
                        .data(that.highlightdata)
                    highlight_rect.enter()
                        .append("rect")
                        .attr("class","highlight-rect")

                    highlight_rect.attr("y", function(d){
                            return that.yScale((that.highlight_index * that.barMargin)) - 5;
                        })
                        .attr("x", function(d){
                            return that.xScale((that.maxTotalVal - d.breakupTotal) / 2) - 5;
                        })
                        .attr("width", function (d) {

                            return that.xScale(d.breakupTotal) + 10;
                        })
                        .attr("height", (that.barHeight + 5))
                        .attr("fill","none")
                        .attr("stroke", that.highlight_color)
                        .attr("stroke-width", "1.5px")
                        .attr("stroke-dasharray", "5,5")
                        .attr("stroke-opacity",1);
                    if(that.extended) {
                        highlight_rect.attr("x",-5)
                            .attr("width", (that.width- that.legendsGroup_width - that.margin_right - that.margin_left + 10))
                    }
                }
                return this;
            },
            durationLabel: function () {
                if(PykCharts.boolean(that.text_between_steps_size)) {
                    var duration_text_width = [];
                    var width = that.width - that.legendsGroup_width;
                    var right_labels = that.ticks_group.selectAll("text.right_label").data(that.new_data1);

                    right_labels.enter().append("svg:text").attr("class", "right_label");

                    right_labels
                        .attr("y", function(d, i){
                            return that.yScale((i * that.barMargin) + (that.barHeight * 1.5) + 5);
                        })
                        .attr("x", width)
                        .attr("text-anchor","start")
                        .text(function(d,i){
                            if(that.new_data1[i+1] === undefined){
                                return "";
                            }
                            return d.duration;
                        })
                        .text(function(d,i){
                            var x = this.getBBox().width
                            duration_text_width.push(x);
                            return d.duration;
                        })
                        .style("font-weight", that.text_between_steps_weight)
                        .style("font-size", that.text_between_steps_size + "px")
                        .attr("fill", that.text_between_steps_color)
                        .style("font-family", that.text_between_steps_family)
                        .attr("text-anchor","end");
                    }
                that.max_duration = d3.max(duration_text_width,function (d) { return d; });
                right_labels.exit().remove();
                return this;
            },
            legends : function () {
                if(PykCharts.boolean(that.legends_enable)) {
                    var k = 0;
                    var l = 0;

                    if(that.legends_display === "vertical" ) {
                        that.legendsGroup.attr("height", (that.new_data_length * 30)+20);
                        that.legendsGroup_height = 0;

                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        text_parameter1value = function (d,i) { return 36; };
                        rect_parameter3value = function (d,i) { return 20; };
                        var rect_parameter4value = function (d,i) { return (i * 24 + 12) + 7.5;};
                        var text_parameter2value = function (d,i) { return i * 24 + 23;};

                    } else if(that.legends_display === "horizontal") {
                        that.legendsGroup_height = 50;
                        final_rect_x = 0;
                        final_text_x = 0;
                        legend_text_widths = [];
                        sum_text_widths = 0;
                        temp_text = temp_rect = 0;
                        text_parameter1 = "x";
                        text_parameter2 = "y";

                        var text_parameter1value = function (d,i) {
                            legend_text_widths[i] = this.getBBox().width;
                            legend_start_x = 16;
                            final_text_x = (i === 0) ? legend_start_x : (legend_start_x + temp_text);
                            temp_text = temp_text + legend_text_widths[i] + 30;
                            return final_text_x;
                        };
                        text_parameter2value = 30;
                        var rect_parameter3value = function (d,i) {
                            final_rect_x = (i === 0) ? 0 : temp_rect;
                            temp_rect = temp_rect + legend_text_widths[i] + 30;
                            return final_rect_x;
                        };
                        rect_parameter4value = 18 + 7.5;
                    }
                    var len = that.new_data[0].breakup.length;
                    var legend = that.legendsGroup.selectAll(".circ")
                                    .data(that.new_data[0].breakup);

                    that.legends_text = that.legendsGroup.selectAll(".legends_text")
                        .data(that.new_data[0].breakup);

                    that.legends_text.enter()
                        .append('text')
                        .text(function (d) {
                            that.filterList.push(d.name);
                            that.fullList.push(d.name);
                        })

                    that.legends_text.attr("class","legends_text")
                        .text(function (d) {
                            return d.name;
                        })
                        .on("click", function(d){
                            if(that.legends_mode === "interactive" && that.mode === "default") {
                                that.toggleFilter(d.name);
                            }
                        })
                        .attr("fill", that.legends_text_color)
                        .attr("font-family", that.legends_text_family)
                        .attr("font-size",that.legends_text_size +"px")
                        .attr("font-weight", that.legends_text_weight)
                        .attr(text_parameter1, text_parameter1value)
                        .attr(text_parameter2, text_parameter2value);

                    legend.enter()
                        .append("circle");

                    legend.attr("cx", rect_parameter3value)
                        .attr("class","circ")
                        .attr("cy", rect_parameter4value)
                        .attr("r", 7.5)
                        .on("click", function(d){
                            if(that.legends_mode === "interactive" && that.mode === "default") {
                                that.toggleFilter(d.name);
                            }
                        })
                        .attr("style", function(d){
                            var fill = (that.filterList.indexOf(d.name) === -1) ? "transparent" : that.fillColor.colorPieMS(d);
                            if(that.filterList.length === 0) fill = that.fillColor.colorPieMS(d);
                            return "fill: "+ fill +"; stroke-width: 3px; stroke:" + that.fillColor.colorPieMS(d);
                        })
                        .attr("opacity", function (d,i) {
                            if(that.color_mode === "saturation") {
                                return that.color_opacity(d.name);
                            }
                            return 1;
                        });
                    if(that.legends_mode === "interactive") {
                        legend.style("cursor","pointer");
                        that.legends_text.style("cursor","pointer");
                    }
                    var legend_container_width = that.legendsGroup.node().getBBox().width, translate_x,translate_y;
                    if(that.legends_display === "vertical") {
                        translate_y = 0;
                        if(PykCharts.boolean(that.data_mode_enable)) { 
                            translate_y = 40;
                        }
                        that.legendsGroup_width = legend_container_width + 20;
                    } else  {
                        translate_y = 0;
                        that.legendsGroup_width = 0;
                    }

                    translate_x = (that.legends_display === "vertical") ? (that.width - that.legendsGroup_width)  : (that.width - legend_container_width - 20);                   
                    if (legend_container_width < that.width) { that.legendsGroup.attr("transform","translate("+translate_x+"," + translate_y + ")"); }
                    that.legendsGroup.style("visibility","visible");

                    that.legends_text.exit().remove();
                    legend.exit().remove();
                }
                return this;
            },
            dataMode : function () {
                if(PykCharts.boolean(that.data_mode_enable)) {
                    var options = [
                        {
                            "name": "Percentage",
                            "on": that.extended
                        },
                        {
                            "name": "Absolute",
                            "on": !that.extended
                        }
                    ];
                    that.legendsGroup_height = 50;
                    var texts = that.chart_mode_group.selectAll(".mode-text").data(options);
                    texts.enter().append("text")

                    texts.attr("class","mode-text")
                        .attr("fill", that.legends_text_color)
                        .attr("font-family", that.legends_text_family)
                        .attr("font-size",that.legends_text_size +"px")
                        .attr("font-weight", that.legends_text_weight)
                        .text(function(d,i){
                            return d.name;
                        })
                        .attr("transform", function(d, i){
                            return "translate(" + ((i*100) + 20) + ",30)";
                        })
                        .on("click", function(d,i){
                            that.extended = !that.extended;
                            that.draw();
                        });
                    var circles = that.chart_mode_group.selectAll(".mode-circ").data(options);
                    circles.enter().append("circle");

                    circles.attr("class","mode-circ")
                        .attr("cx", function(d,i){
                            return (i*100)+10;
                        })
                        .attr("cy",(18 + 7.5)).attr("r", 6)
                        .attr("style", function(d){
                            var fill = !d.on ? "transparent" : that.data_mode_legends_color;
                            return "fill: "+ fill +"; stroke-width: 3px; stroke:" + that.data_mode_legends_color;
                        })
                        .on("click", function(d,i){
                            if(that.mode === "default") {
                                that.extended = !that.extended;
                                that.draw();
                            }
                        });
                        texts.style("cursor","pointer");
                        circles.style("cursor","pointer");
                }
                return this;
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
            that.filterList = [];
        }else{
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
        that.draw();
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

    chartObject.width = options.chart_width ? options.chart_width : stylesheet.chart_width;
    chartObject.height = options.chart_height ? options.chart_height : stylesheet.chart_height;
    chartObject.map_code = options.map_code ? options.map_code : mapsTheme.map_code;
    chartObject.click_enable = options.click_enable ? options.click_enable.toLowerCase() : mapsTheme.click_enable;
    chartObject.background_color = options.background_color ? options.background_color : stylesheet.background_color;

    chartObject.timeline_duration = "timeline_duration" in options ? options.timeline_duration :mapsTheme.timeline_duration;

    chartObject.margin_left = options.timeline_margin_left ? options.timeline_margin_left : mapsTheme.timeline_margin_left;
    chartObject.margin_right = options.timeline_margin_right ? options.timeline_margin_right : mapsTheme.timeline_margin_right;
    chartObject.margin_top = options.timeline_margin_top ? options.timeline_margin_top : mapsTheme.timeline_margin_top;
    chartObject.margin_bottom = options.timeline_margin_bottom ? options.timeline_margin_bottom : mapsTheme.timeline_margin_bottom;

    chartObject.tooltip_enable = options.tooltip_enable ? options.tooltip_enable.toLowerCase() : stylesheet.tooltip_enable;
    chartObject.tooltip_mode = options.tooltip_mode ? options.tooltip_mode.toLowerCase() : stylesheet.tooltip_mode;
    chartObject.tooltip_position_top = options.tooltip_position_top ? options.tooltip_position_top : mapsTheme.tooltip_position_top;
    chartObject.tooltip_position_left = options.tooltip_position_left ? options.tooltip_position_left : mapsTheme.tooltip_position_left;
    chartObject.tooltipTopCorrection = d3.select(chartObject.selector).style("top");
    chartObject.tooltipLeftCorrection = d3.select(chartObject.selector).style("left");
    chartObject.chart_color = options.chart_color ? options.chart_color : [];
    chartObject.default_color = stylesheet.chart_color;
    chartObject.total_no_of_colors = options.total_no_of_colors && _.isNumber(parseInt(options.total_no_of_colors,10))? parseInt(options.total_no_of_colors,10) : mapsTheme.total_no_of_colors;
    chartObject.color_mode = options.color_mode ? options.color_mode.toLowerCase() : stylesheet.color_mode;
    chartObject.saturation_color = options.saturation_color ? options.saturation_color : "";
    chartObject.palette_color = options.palette_color ? options.palette_color : mapsTheme.palette_color;

    chartObject.legends_enable =  options.legends_enable ? options.legends_enable.toLowerCase() : stylesheet.legends_enable;
    chartObject.legends_display = options.legends_display ? options.legends_display.toLowerCase() : stylesheet.legends_display;
    chartObject.legends_text_size = options.legends_text_size ? options.legends_text_size : stylesheet.legends_text_size;
    chartObject.legends_text_color = options.legends_text_color ? options.legends_text_color : stylesheet.legends_text_color;
    chartObject.legends_text_weight = options.legends_text_weight ? options.legends_text_weight.toLowerCase() : stylesheet.legends_text_weight;
    chartObject.legends_text_family = options.legends_text_family ? options.legends_text_family.toLowerCase() : stylesheet.legends_text_family;

    chartObject.axis_x_enable = options.axis_x_enable ? options.axis_x_enable.toLowerCase() : stylesheet.axis_x_enable;
    chartObject.axis_x_pointer_position = PykCharts['boolean'](chartObject.axis_x_enable) && options.axis_x_pointer_position ? options.axis_x_pointer_position.toLowerCase() : stylesheet.axis_x_pointer_position;
    chartObject.axis_x_line_color = PykCharts['boolean'](chartObject.axis_x_enable) && options.axis_x_line_color ? options.axis_x_line_color : stylesheet.axis_x_line_color;
    chartObject.axis_x_no_of_axis_value = PykCharts['boolean'](chartObject.axis_x_enable) && options.axis_x_no_of_axis_value ? options.axis_x_no_of_axis_value : stylesheet.axis_x_no_of_axis_value;
    chartObject.axis_x_pointer_padding = PykCharts['boolean'](chartObject.axis_x_enable) && options.axis_x_pointer_padding ? options.axis_x_pointer_padding : stylesheet.axis_x_pointer_padding;
    chartObject.axis_x_pointer_length = "axis_x_pointer_length" in options && PykCharts['boolean'](chartObject.axis_x_enable) ? options.axis_x_pointer_length : stylesheet.axis_x_pointer_length;
    chartObject.axis_x_pointer_values = PykCharts['boolean'](chartObject.axis_x_enable) && options.axis_x_pointer_values ? options.axis_x_pointer_values : stylesheet.axis_x_pointer_values;
    chartObject.axis_x_outer_pointer_length = "axis_x_outer_pointer_length" in options && PykCharts['boolean'](chartObject.axis_x_enable) ? options.axis_x_outer_pointer_length : stylesheet.axis_x_outer_pointer_length;

    chartObject.axis_x_pointer_size = "axis_x_pointer_size" in options ? options.axis_x_pointer_size : stylesheet.axis_x_pointer_size;
    chartObject.axis_x_pointer_weight = options.axis_x_pointer_weight ? options.axis_x_pointer_weight.toLowerCase() : stylesheet.axis_x_pointer_weight;
    chartObject.axis_x_pointer_family = options.axis_x_pointer_family ? options.axis_x_pointer_family.toLowerCase() : stylesheet.axis_x_pointer_family;
    chartObject.axis_x_pointer_color = options.axis_x_pointer_color ? options.axis_x_pointer_color : stylesheet.axis_x_pointer_color;

    chartObject.label_enable = options.label_enable ? options.label_enable.toLowerCase() : mapsTheme.label_enable;
    chartObject.label_color = options.label_color ? options.label_color : stylesheet.label_color;

    chartObject.border_between_chart_elements_thickness = "border_between_chart_elements_thickness" in options ? options.border_between_chart_elements_thickness : stylesheet.border_between_chart_elements_thickness;
    chartObject.border_between_chart_elements_color = options.border_between_chart_elements_color ? options.border_between_chart_elements_color : stylesheet.border_between_chart_elements_color;
    chartObject.border_between_chart_elements_style = options.border_between_chart_elements_style ? options.border_between_chart_elements_style.toLowerCase() : stylesheet.border_between_chart_elements_style;
    switch(chartObject.border_between_chart_elements_style) {
        case "dotted" : chartObject.border_between_chart_elements_style = "1,3";
                        break;
        case "dashed" : chartObject.border_between_chart_elements_style = "5,5";
                       break;
        default : chartObject.border_between_chart_elements_style = "0";
                  break;
    }
    
    chartObject.onhover_enable = options.chart_onhover_highlight_enable ? options.chart_onhover_highlight_enable : stylesheet.chart_onhover_highlight_enable;
    chartObject.onhover = options.chart_onhover_effect ? options.chart_onhover_effect : mapsTheme.chart_onhover_effect;
    chartObject.default_zoom_level = options.default_zoom_level ? options.default_zoom_level : 80;

    chartObject.loading_type = options.loading_type ? options.loading_type : stylesheet.loading_type;
    chartObject.loading_source = options.loading_source ? options.loading_source : stylesheet.loading_source;
    chartObject.highlight = options.highlight ? options.highlight : stylesheet.highlight;
    chartObject.highlight_color = options.highlight_color ? options.highlight_color: stylesheet.highlight_color;
    if (options &&  PykCharts['boolean'] (options.title_text)) {
        chartObject.title_text = options.title_text;
        chartObject.title_size = "title_size" in options ? options.title_size : stylesheet.title_size;
        chartObject.title_color = options.title_color ? options.title_color : stylesheet.title_color;
        chartObject.title_weight = options.title_weight ? options.title_weight.toLowerCase() : stylesheet.title_weight;
        chartObject.title_family = options.title_family ? options.title_family.toLowerCase() : stylesheet.title_family;
    } else {
        chartObject.title_size = stylesheet.title_size;
        chartObject.title_color = stylesheet.title_color;
        chartObject.title_weight = stylesheet.title_weight;
        chartObject.title_family = stylesheet.title_family;
    }

    if (options && PykCharts['boolean'](options.subtitle_text)) {
        chartObject.subtitle_text = options.subtitle_text;
        chartObject.subtitle_size = "subtitle_size" in options ? options.subtitle_size : stylesheet.subtitle_size;
        chartObject.subtitle_color = options.subtitle_color ? options.subtitle_color : stylesheet.subtitle_color;
        chartObject.subtitle_weight = options.subtitle_weight ? options.subtitle_weight.toLowerCase() : stylesheet.subtitle_weight;
        chartObject.subtitle_family = options.subtitle_family ? options.subtitle_family.toLowerCase() : stylesheet.subtitle_family;
    } else {
        chartObject.subtitle_size = stylesheet.subtitle_size;
        chartObject.subtitle_color = stylesheet.subtitle_color;
        chartObject.subtitle_weight = stylesheet.subtitle_weight;
        chartObject.subtitle_family = stylesheet.subtitle_family;
    }

    chartObject.real_time_charts_refresh_frequency = options.real_time_charts_refresh_frequency ? options.real_time_charts_refresh_frequency : functionality.real_time_charts_refresh_frequency;
    chartObject.real_time_charts_last_updated_at_enable = options.real_time_charts_last_updated_at_enable ? options.real_time_charts_last_updated_at_enable.toLowerCase() : functionality.real_time_charts_last_updated_at_enable;
    chartObject.transition_duration = options.transition_duration ? options.transition_duration : functionality.transition_duration;

    if(options.credit_my_site_name || options.credit_my_site_url) {
        chartObject.credit_my_site_name = options.credit_my_site_name ? options.credit_my_site_name : "";
        chartObject.credit_my_site_url = options.credit_my_site_url ? options.credit_my_site_url : "";
    } else {
        chartObject.credit_my_site_name = stylesheet.credit_my_site_name;
        chartObject.credit_my_site_url = stylesheet.credit_my_site_url;
    }
    chartObject.data_source_name = options.data_source_name ? options.data_source_name : "";
    chartObject.data_source_url = options.data_source_url ? options.data_source_url : "";
    chartObject.export_enable = options.export_enable ? options.export_enable.toLowerCase() : stylesheet.export_enable;

    chartObject.k = new PykCharts.Configuration(chartObject);

    chartObject.k.validator().validatingSelector(chartObject.selector.substring(1,chartObject.selector.length))
                .isArray(chartObject.axis_x_pointer_values,"axis_x_pointer_values")
                .isArray(chartObject.chart_color,"chart_color")
                .validatingDataType(chartObject.width,"chart_width",stylesheet.chart_width,"width")
                .validatingDataType(chartObject.height,"chart_height",stylesheet.chart_height,"height")
                .validatingDataType(chartObject.margin_left,"timeline_margin_left",mapsTheme.timeline_margin_left,"margin_left")
                .validatingDataType(chartObject.margin_right,"timeline_margin_right",mapsTheme.timeline_margin_right,"margin_right")
                .validatingDataType(chartObject.margin_top,"timeline_margin_top",mapsTheme.timeline_margin_top,"margin_top")
                .validatingDataType(chartObject.margin_bottom,"timeline_margin_bottom",mapsTheme.timeline_margin_bottom,"margin_bottom")
                .validatingDataType(chartObject.title_size,"title_size",stylesheet.title_size)
                .validatingDataType(chartObject.subtitle_size,"subtitle_size",stylesheet.subtitle_size)
                .validatingDataType(chartObject.real_time_charts_refresh_frequency,"real_time_charts_refresh_frequency",functionality.real_time_charts_refresh_frequency)
                .validatingDataType(chartObject.transition_duration,"transition_duration",functionality.transition_duration)
                .validatingDataType(chartObject.border_between_chart_elements_thickness,"border_between_chart_elements_thickness",stylesheet.border_between_chart_elements_thickness)
                .validatingDataType(chartObject.legends_text_size ,"legends_text_size",stylesheet.legends_text_size)
                .validatingDataType(chartObject.axis_x_pointer_size,"axis_x_pointer_size",stylesheet.axis_x_pointer_size)
                .validatingDataType(chartObject.axis_x_pointer_length,"axis_x_pointer_length",stylesheet.axis_x_pointer_length)
                .validatingDataType(chartObject.axis_x_pointer_padding,"axis_x_pointer_padding",stylesheet.axis_x_pointer_padding)
                .validatingDataType(chartObject.tooltip_position_top,"tooltip_position_top",mapsTheme.tooltip_position_top)
                .validatingDataType(chartObject.tooltip_position_left,"tooltip_position_left",mapsTheme.tooltip_position_left)
                .validatingColorMode(chartObject.color_mode,"color_mode",stylesheet.color_mode)
                .validatingLegendsPosition(chartObject.legends_display,"legends_display",stylesheet.legends_display)
                .validatingTooltipMode(chartObject.tooltip_mode,"tooltip_mode",stylesheet.tooltip_mode)
                .validatingXAxisPointerPosition(chartObject.axis_x_pointer_position,"axis_x_pointer_position",stylesheet.axis_x_pointer_position)
                .validatingFontWeight(chartObject.title_weight,"title_weight",stylesheet.title_weight)
                .validatingFontWeight(chartObject.subtitle_weight,"subtitle_weight",stylesheet.subtitle_weight)
                .validatingFontWeight(chartObject.axis_x_pointer_weight,"axis_x_pointer_weight",stylesheet.axis_x_pointer_weight)
                .validatingFontWeight(chartObject.legends_text_weight,"legends_text_weight",stylesheet.legends_text_weight)
                .validatingColor(chartObject.background_color,"background_color",stylesheet.background_color)
                .validatingColor(chartObject.label_color,"label_color",stylesheet.label_color)
                .validatingColor(chartObject.title_color,"title_color",stylesheet.title_color)
                .validatingColor(chartObject.subtitle_color,"subtitle_color",stylesheet.subtitle_color)
                .validatingColor(chartObject.axis_x_line_color,"axis_x_line_color",stylesheet.axis_x_line_color)
                .validatingColor(chartObject.pointer_color,"pointer_color",stylesheet.pointer_color)
                .validatingColor(chartObject.highlight_color,"highlight_color",stylesheet.highlight_color)
                .validatingColor(chartObject.saturation_color,"saturation_color",stylesheet.saturation_color)
                .validatingColor(chartObject.border_between_chart_elements_color,"border_between_chart_elements_color",stylesheet.border_between_chart_elements_color)
                .validatingColor(chartObject.legends_text_color,"legends_text_color",stylesheet.legends_text_color);

            if($.isArray(chartObject.chart_color)) {
                if(chartObject.chart_color[0]) {
                    chartObject.k.validator()
                        .validatingColor(chartObject.chart_color[0],"chart_color",stylesheet.chart_color);
                }
            }

            if (chartObject.color_mode === "saturation") {
                try {
                    if(chartObject.total_no_of_colors < 3 || chartObject.total_no_of_colors > 9) {
                        chartObject.total_no_of_colors = mapsTheme.total_no_of_colors;
                        throw "total_no_of_colors";
                    }
                }
                catch (err) {
                    chartObject.k.warningHandling(err,"10");
                }
            }

            try {
                if(chartObject.onhover.toLowerCase() === "shadow" || chartObject.onhover.toLowerCase() === "none" || chartObject.onhover.toLowerCase() === "highlight_border" || chartObject.onhover.toLowerCase() === "color_saturation") {
                } else {
                    chartObject.onhover = mapsTheme.onhover;
                    throw "chart_onhover_effect";
                }
            }
            catch (err) {
                chartObject.k.warningHandling(err,"12");
            }

            try {
                if(!_.isNumber(chartObject.default_zoom_level)) {
                    chartObject.default_zoom_level = 80;
                    throw "default_zoom_level"
                }
            }

            catch (err) {
                chartObject.k.warningHandling(err,"1");
            }

    chartObject.timeline_duration = (chartObject.timeline_duration * 1000);

    return chartObject;
};
PykCharts.maps.oneLayer = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function () {
        that = PykCharts.maps.processInputs(that, options);
        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(options.selector).css("height","auto")
                $(options.selector+" #chart-loader").remove();
                return;
            }

            that.data = data;
            that.compare_data = data;
            that.k
                .totalColors(that.total_no_of_colors)
                .colorType(that.color_mode)
                .loading(that.loading)
                .tooltip();

                d3.json(PykCharts.assets+"ref/" + that.map_code + "-topo.json", function (e,data) {

                        if(e && e.status === 404) {
                            that.k.errorHandling("map_code","3");
                            $(options.selector+" #chart-loader").remove();
                            $(options.selector).css("height","auto")
                            return;
                        }

                    that.map_data = data;

                    _.each(that.map_data.objects.geometries, function (d) {
                      var a = d.properties.NAME_1.replace("'","&#39;");
                      d.properties.NAME_1 = a;
                      return d;
                    });

                    d3.json(PykCharts.assets+"ref/colorPalette.json", function (data) {
                        that.color_palette_data = data;
                        var validate = _.where(that.color_palette_data,{name:that.palette_color});

                        try {
                            if (!validate.length) {
                                that.palette_color = theme.mapsTheme.palette_color;
                                throw "palette_color";
                            }
                        }
                        catch (e) {
                            that.k.warningHandling(e,"11");
                        }

                        $(that.selector).html("");
                        $(options.selector).css("height","auto")
                        var oneLayer = new PykCharts.maps.mapFunctions(options,that,"oneLayer");
                        oneLayer.render();
                    });
                });
            that.extent_size = d3.extent(that.data, function (d) { return parseInt(d.size, 10); });
            that.difference = that.extent_size[1] - that.extent_size[0];
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeData")
    };
};

PykCharts.maps.timelineMap = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function () {
        that = PykCharts.maps.processInputs(that, options);
        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(options.selector+" #chart-loader").remove();
                return;
            }

            that.timeline_data = data;
            that.compare_data = data;
            var x_extent = d3.extent(data, function (d) { return d.timestamp; });
            that.data = _.where(data, {timestamp: x_extent[0]});

            that.redeced_width = that.width - (that.margin_left * 2) - that.margin_right;

            that.k
                .totalColors(that.total_no_of_colors)
                .colorType(that.color_mode)
                .loading(that.loading)
                .tooltip(that.tooltip_enable);

            d3.json(PykCharts.assets+"ref/" + that.map_code + "-topo.json", function (data) {
                that.map_data = data;
                _.each(that.map_data.objects.geometries, function (d) {
                  var a = d.properties.NAME_1.replace("'","&#39;");
                  d.properties.NAME_1 = a;
                  return d;
                });
                d3.json(PykCharts.assets+"ref/colorPalette.json", function (data) {
                    that.color_palette_data = data;
                    var validate = _.where(that.color_palette_data,{name:that.palette_color});

                    try {
                        if (!validate.length) {
                            that.palette_color = theme.mapsTheme.palette_color;
                            throw "palette_color";
                        }
                    }
                    catch (err) {
                        that.k.warningHandling(err,"11");
                    }

                    var x_extent = d3.extent(that.timeline_data, function (d) { return d.timestamp; })
                    that.data = _.where(that.timeline_data, {timestamp: x_extent[0]});

                    that.data.sort(function (a,b) {
                        return a.timestamp - b.timestamp;
                    });
                    $(that.selector).html("");
                    var timeline = new PykCharts.maps.mapFunctions(options,that,"timeline");
                    timeline.render();
                });
            });

            that.extent_size = d3.extent(that.data, function (d) { return parseInt(d.size, 10); });
            that.difference = that.extent_size[1] - that.extent_size[0];
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeData")
    };
};

PykCharts.maps.mapFunctions = function (options,chartObject,type) {
    var that = chartObject;
    this.render = function () {
        that.border = new PykCharts.Configuration.border(that);
        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        that.k.title()
            .backgroundColor(that)

        if(type === "oneLayer") {
            that.k
            .export(that,"#svgcontainer",type)
            .emptyDiv()
            .subtitle()
            .exportSVG(that,"#svgcontainer",type)
        }
        that.current_palette = _.where(that.color_palette_data, {name:that.palette_color, number:that.total_no_of_colors})[0];
        if (type === "timeline"){
             that.k.subtitle();
        }

        that.optionalFeatures()
            .svgContainer()
            .legendsContainer(that.legends_enable)
            .legends(that.legends_enable)
            .createMap()
            .label(that.label_enable)
            .enableClick(that.click_enable);

        that.redeced_height = that.height - that.margin_top - that.margin_bottom;

        that.k
            .createFooter()
            .lastUpdatedAt()
            .credits()
            .dataSource();

        if(type === "timeline") {
            that.optionalFeatures()
                .axisContainer(true);
            that.renderDataForTimescale();
            that.backgroundColor();
            that.renderButtons();
            that.renderTimeline();
        }

        if(PykCharts['boolean'](that.legends_enable) && that.color_mode === "saturation") {
            $(document).ready(function () { return that.k.resize(that.svgContainer,"",that.legendsContainer); });
            $(window).on("resize", function () { return that.k.resize(that.svgContainer,"",that.legendsContainer); });
        } else {
            $(document).ready(function () { return that.k.resize(that.svgContainer,""); });
            $(window).on("resize", function () { return that.k.resize(that.svgContainer,""); });
        }

    };

    that.refresh = function () {
        that.executeRefresh = function (data) {
            that.data = data;
            that.refresh_data = data;
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.extent_size = d3.extent(that.data, function (d) { return parseInt(d.size, 10); });
            that.difference = that.extent_size[1] - that.extent_size[0];
            that.optionalFeatures()
                .legends(that.legends_enable)
                .createMap();
        }
        if(type === "oneLayer") {
            that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh")
        }
    };

    that.optionalFeatures = function () {
        var config = {
            legends: function (el) {
                if (PykCharts['boolean'](el)) {
                    that.renderLegend();
                };
                return this;
            },
            legendsContainer : function (el) {
                if (PykCharts['boolean'](el) && that.color_mode === "saturation") {
                    that.legendsContainer = that.svgContainer
                        .append("g")
                        .attr("id", "legend-container");
                } else {
                    that.legendsGroup_height = 0;
                    that.legendsGroup_width = 0;
                }
                return this;
            },
            label: function (el) {
                if (PykCharts['boolean'](el)) {
                    that.renderLabel();
                };
                return this;
            },
            svgContainer : function () {
                $(that.selector).css("width","100%");

                that.svgContainer = d3.select(that.selector)
                    .append("svg")
                    .attr("width", that.width)
                    .attr("height", that.height)
                    .attr("id","svgcontainer")
                    .attr("class",'PykCharts-map')
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height);

                that.map_cont = that.svgContainer.append("g")
                    .attr("id", "map_group")

                var defs = that.map_cont.append('defs');
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
                return this;
            },
            createMap : function () {

                var new_width =  that.width - that.legendsGroup_width;
                var new_height = that.height - that.legendsGroup_height - that.margin_bottom -that.margin_top - 10;
                var scale = 150
                , offset = [new_width / 2, new_height / 2]
                , i;
                $(options.selector).css("background-color",that.background_color);

                that.group = that.map_cont.selectAll(".map_group")
                    .data(topojson.feature(that.map_data, that.map_data.objects).features)

                that.group.enter()
                    .append("g")
                    .attr("class","map_group")
                    .append("path");

                if (that.map_code==="world" || that.map_code==="world_with_antarctica") {
                    var center = [0,0];
                } else {
                    var center = d3.geo.centroid(topojson.feature(that.map_data, that.map_data.objects));
                }
                var projection = d3.geo.mercator().center(center).scale(scale).translate(offset);

                that.path = d3.geo.path().projection(projection);

                var bounds = that.path.bounds(topojson.feature(that.map_data, that.map_data.objects)),
                    hscale = scale * (new_width) / (bounds[1][0] - bounds[0][0]),
                    vscale = scale * (new_height) / (bounds[1][1] - bounds[0][1]),
                    scale = (hscale < vscale) ? hscale : vscale,
                    offset = [new_width - (bounds[0][0] + bounds[1][0]) / 2, new_height - (bounds[0][1] + bounds[1][1]) / 2];
                projection = d3.geo.mercator().center(center)
                   .scale((that.default_zoom_level / 100) * scale).translate(offset);

                that.path = that.path.projection(projection);
                var ttp = d3.select("#pyk-tooltip");

                that.chart_data = that.group.select("path")
                    .attr("d", that.path)
                    .attr("class", "area")
                    .attr("iso2", function (d) {
                        return d.properties.iso_a2;
                    })
                    .attr("area_name", function (d) {
                        return d.properties.NAME_1;
                    })
                    .attr("fill", that.renderColor)
                    .attr("prev_fill", function (d) {
                        return d3.select(this).attr("fill");
                    })
                    .attr("fill-opacity", that.renderOpacity)
                    .attr("data-fill-opacity",function () {
                        return $(this).attr("fill-opacity");
                    })
                    .style("stroke", that.border.color())
                    .style("stroke-width", that.border.width())
                    .style("stroke-dasharray", that.border.style())
                    .on("mouseover", function (d) {
                        if((_.where(that.data, {iso2: d.properties.iso_a2})[0])) {
                            if (PykCharts['boolean'](that.tooltip_enable)) {
                                var tooltip_text = ((_.where(that.data, {iso2: d.properties.iso_a2})[0]).tooltip) ? ((_.where(that.data, {iso2: d.properties.iso_a2})[0]).tooltip) : ("<table><thead><th colspan='2'><b>"+d.properties.NAME_1+"</b></th></thead><tr><td>Size</td><td><b>"+((_.where(that.data, {iso2: d.properties.iso_a2})[0]).size)+"</b></td></tr></table>");

                                ttp.style("display", "block");
                                ttp.html(tooltip_text);
                                if (that.tooltip_mode === "moving") {
                                    ttp.style("top", function () {
                                            return (PykCharts.getEvent().pageY - 20 ) + "px";
                                        })
                                        .style("left", function () {
                                            return (PykCharts.getEvent().pageX + 20 ) + "px";
                                        });
                                } else if (that.tooltip_mode === "fixed") {
                                    ttp.style("top", (that.tooltip_position_top) + "px")
                                        .style("left", (that.tooltip_position_left) + "px");
                                }
                            }
                            if(that.onhover1 === "color_saturation" && PykCharts['boolean'](that.onhover_enable)) {
                                that.mouseEvent.highlight(options.selector + " .area", this);
                            }else {
                                that.bodColor(d);
                            }
                        }
                    })
                    .on("mouseout", function (d) {
                        if (PykCharts['boolean'](that.tooltip_enable)) {
                            ttp.style("display", "none");
                        }
                        that.bodUncolor(d);
                        that.mouseEvent.highlightHide(options.selector + " .area");
                    });
                that.group.exit()
                    .remove();
                return this;
            },
            enableClick: function (ec) {
                if (PykCharts['boolean'](ec)) {
                    that.chart_data.on("click", that.clicked);
                    that.onhover1 = that.onhover;
                } else {
                    that.onhover1 = that.onhover;
                }
                return this;
            },
            axisContainer : function (ae) {
                if(PykCharts['boolean'](ae)){
                    that.gxaxis = that.svgContainer.append("g")
                        .attr("id","xaxis")
                        .attr("class", "x axis")
                        .attr("transform", "translate("+(that.margin_left*2)+"," + that.redeced_height + ")");
                }
                return this;
            }
        }
        return config;
    };


    that.renderColor = function (d, i) {
        if (!PykCharts['boolean'](d)) {
            return false;
        }
        var col_shade,
            obj = _.where(that.data, {iso2: d.properties.iso_a2});
        if (obj.length > 0) {
            if (that.color_mode === "color") {
                if(that.chart_color[0]) {
                    return that.chart_color[0];
                } else if (obj.length > 0 && PykCharts['boolean'](obj[0].color)) {
                    return obj[0].color;
                }
                return that.default_color[0];
            }
            if (that.color_mode === "saturation") {
                if (that.highlight === that.map_data.objects.geometries[i].properties.iso_a2/*obj[0].highlight === true*/) {
                    return that.highlight_color;
                } else {
                    if(that.saturation_color !== "") {
                        return that.saturation_color;
                    } else if (that.palette_color !== "") {
                        col_shade = obj[0].size;
                        for (i = 0; i < that.current_palette.colors.length; i++) {
                            if (col_shade >= that.extent_size[0] + i * (that.difference / that.current_palette.colors.length) && col_shade <= that.extent_size[0] + (i + 1) * (that.difference / that.current_palette.colors.length)) {
                                if (that.data.length===1) {
                                    return that.current_palette.colors[that.current_palette.colors.length-1];
                                }
                                else{
                                    return that.current_palette.colors[i];
                                }
                            }
                        }

                    }
                }
            }
            return that.default_color[0];
        }
        return that.default_color[0];
    };

    that.renderOpacity = function (d) {

        if (that.saturation_color !=="" && that.color_mode === "saturation") {
            that.oneninth = +(d3.format(".2f")(that.difference / that.total_no_of_colors));
            that.opacity = (that.extent_size[0] + (_.where(that.data, {iso2: d.properties.iso_a2})[0]).size + that.oneninth) / that.difference;
            return that.opacity;
        }
        return 1;
    };

    that.renderLegend = function () {
            var k,
            onetenth;
        if (that.color_mode === "saturation") {
            if(that.legends_display === "vertical" ) {
                var m = 0, n = 0;
                if(that.palette_color === "") {
                    that.legendsContainer.attr("height", (9 * 30)+20);
                    that.legendsGroup_height = 0;
                }
                else {
                    that.legendsContainer.attr("height", (that.current_palette.number * 30)+20);
                    that.legendsGroup_height = 0;
                }
                text_parameter1 = "x";
                text_parameter2 = "y";
                rect_parameter1 = "width";
                rect_parameter2 = "height";
                rect_parameter3 = "x";
                rect_parameter4 = "y";
                rect_parameter1value = 13;
                rect_parameter2value = 13;
                text_parameter1value = function (d,k) { return 38; };
                rect_parameter3value = function (d,k) { return 20; };
                var rect_parameter4value = function (d) {n++; return n * 24 + 12;};
                var text_parameter2value = function (d) {m++; return m * 24 + 23;};

            } else if(that.legends_display === "horizontal") {
                var j = 0, i = 0;
                if(that.palette_color === "") {
                    j = 9, i = 9;
                }
                else {
                    j = that.current_palette.number, i = that.current_palette.number;
                    that.legendsContainer.attr("height", (that.current_palette.number * 30)+20);
                    that.legendsGroup_height = (that.current_palette.number * 30)+20;
                }
                that.legendsContainer.attr("height", 50);
                that.legendsGroup_height = 50;
                final_rect_x = 0;
                final_text_x = 0;
                legend_text_widths = [];
                temp_text = temp_rect = 0;
                text_parameter1 = "x";
                text_parameter2 = "y";
                rect_parameter1 = "width";
                rect_parameter2 = "height";
                rect_parameter3 = "x";
                rect_parameter4 = "y";
                var text_parameter1value = function (d,i) {
                    legend_text_widths[i] = this.getBBox().width;
                    legend_start_x = 16;
                    final_text_x = (i === 0) ? legend_start_x : (legend_start_x + temp_text);
                    temp_text = temp_text + legend_text_widths[i] + 30;
                    return final_text_x;
                };
                text_parameter2value = 30;
                rect_parameter1value = 13;
                rect_parameter2value = 13;
                var rect_parameter3value = function (d,i) {
                    final_rect_x = (i === 0) ? 0 : temp_rect;
                    temp_rect = temp_rect + legend_text_widths[i] + 30;
                    return final_rect_x;
                };
                rect_parameter4value = 18;

            }
            if (that.saturation_color !== "") {
                var leg_data = [], onetenth;
                for(var i=1 ; i<=that.total_no_of_colors ; i++) { leg_data.push(i); }
                onetenth = d3.format(".1f")(that.extent_size[1] / that.total_no_of_colors);
                that.leg = function (d,i) { return "<" + d3.round(onetenth * (i+1)); };

                var legend = that.legendsContainer.selectAll(".rect")
                    .data(leg_data);

                that.legends_text = that.legendsContainer.selectAll(".text")
                    .data(leg_data);

                that.legends_text.enter()
                    .append("text");
                that.legends_text.attr("class","text")
                    .attr("pointer-events","none")
                    .text(that.leg)
                    .attr("fill", that.legends_text_color)
                    .attr("font-family", that.legends_text_family)
                    .attr("font-size",that.legends_text_size)
                    .attr("font-weight", that.legends_text_weight)
                    .attr("x", text_parameter1value)
                    .attr("y", text_parameter2value);

                legend.enter()
                    .append("rect")

                legend.attr("class","rect")
                    .attr("x", rect_parameter3value)
                    .attr("y", rect_parameter4value)
                    .attr("width", rect_parameter1value)
                    .attr("height", rect_parameter2value)
                    .attr("fill", that.saturation_color)
                    .attr("fill-opacity", function(d,i) { return (i+1)/that.total_no_of_colors; });

                var legend_container_width = that.legendsContainer.node().getBBox().width, translate_x;

                    if(that.legends_display === "vertical") {
                        that.legendsGroup_width = legend_container_width + 20;
                    } else  {
                        that.legendsGroup_width = 0;
                    }

                    translate_x = (that.legends_display === "vertical") ? (that.width - that.legendsGroup_width) : (that.width - legend_container_width - 20);
                if (legend_container_width < that.width) { that.legendsContainer.attr("transform","translate("+(translate_x-20)+",10)"); }
                that.legendsContainer.style("visibility","visible");

                that.legends_text.exit()
                    .remove();
                legend.exit()
                    .remove();

            } else {
                that.leg = function (d,i) { return  "<" + d3.round(that.extent_size[0] + (i+1) * (that.difference / that.current_palette.number)); };
                var legend = that.legendsContainer.selectAll(".rect")
                    .data(that.current_palette.colors);

                that.legends_text = that.legendsContainer.selectAll(".text")
                    .data(that.current_palette.colors);

                that.legends_text.enter()
                    .append("text");
                that.legends_text.attr("class","text")
                    .attr("pointer-events","none")
                    .text(that.leg)
                    .attr("fill", that.legends_text_color)
                    .attr("font-family", that.legends_text_family)
                    .attr("font-size",that.legends_text_size)
                    .attr("font-weight", that.legends_text_weight)
                    .attr("x", text_parameter1value)
                    .attr("y",text_parameter2value);

                legend.enter()
                    .append("rect");
                legend.attr("class","rect")
                    .attr("width", rect_parameter1value)
                    .attr("height", rect_parameter2value)
                    .attr("fill", function (d) { return d; })
                    .attr("x",rect_parameter3value)
                    .attr("y", rect_parameter4value);

                var legend_container_width = that.legendsContainer.node().getBBox().width,translate_x;

                    if(that.legends_display === "vertical") {
                        that.legendsGroup_width = legend_container_width + 20;
                    } else  {
                        that.legendsGroup_width = 0;
                    }

                    translate_x = (that.legends_display === "vertical") ? 0 : (that.width - legend_container_width - 20);
                if (legend_container_width < that.width) { that.legendsContainer.attr("transform","translate("+translate_x+",10)"); }
                that.legendsContainer.style("visibility","visible");

                that.legends_text.exit()
                    .remove();
                legend.exit()
                    .remove();
            }
        } else {
            $("#legend-container").remove();
        }
    };

    that.renderLabel = function () {
        that.group.append("text")
            .attr("x", function (d) { return that.path.centroid(d)[0]; })
            .attr("y", function (d) { return that.path.centroid(d)[1]; })
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("fill",that.label_color)
            .attr("pointer-events", "none")
            .text(function (d) { return d.properties.NAME_1.replace("&#39;","'"); });
    };

    that.bodColor = function (d) {
        var obj = _.where(that.data, {iso2: d.properties.iso_a2});
        if(PykCharts['boolean'](that.onhover_enable)) {
            if (that.onhover1 === "highlight_border") {
                d3.select("path[area_name='" + d.properties.NAME_1 + "']")
                    .style("stroke", that.border.color())
                    .style("stroke-width", parseFloat(that.border.width()) + 1.5 + "px")
                    .style("stroke-dasharray", that.border.style());
            } else if (that.onhover1 === "shadow") {
                d3.select("path[area_name='" + d.properties.NAME_1 + "']")
                    .attr('filter', 'url(#dropshadow)')
                    .attr("fill-opacity", function () {
                        if (that.palette_color === "" && that.color_mode === "saturation") {
                            that.oneninth_dim = +(d3.format(".2f")(that.difference / that.total_no_of_colors));
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
    that.bodUncolor = function (d) {
        d3.select("path[area_name='" + d.properties.NAME_1 + "']")
            .style("stroke", that.border.color())
            .style("stroke-width", that.border.width())
            .style("stroke-dasharray", that.border.style())
            .attr('filter', null)
            .attr("fill-opacity", function () {
                if (that.saturation_color !== "" && that.color_mode === "saturation") {
                    that.oneninth_high = +(d3.format(".2f")(that.difference / that.total_no_of_colors));
                    that.opacity_high = (that.extent_size[0] + (_.where(that.data, {iso2: d.properties.iso_a2})[0]).size + that.oneninth_high) / that.difference;
                    return that.opacity_high;
                }
                return 1;
            });
    };

    this.clicked = function (d) {
        var obj = {};
        obj.container = PykCharts.getEvent().target.ownerSVGElement.parentNode.id;
        obj.area = d.properties;
        obj.data = _.where(that.data, {iso2: d.properties.iso_a2})[0];
        try {
            customFunction(obj);
        } catch (ignore) {
            /**/
        }
    };

    that.backgroundColor =function () {
        var bg,child1;
        bgColor(options.selector);

        function bgColor(child) {
            child1 = child;
            bg = $(child).css("background-color");
            if (bg === "transparent" || bg === "rgba(0, 0, 0, 0)") {
                if($(child)[0].parentNode.tagName === undefined || $(child)[0].parentNode.tagName.toLowerCase() === "body") {
                    $(child).colourBrightness("rgb(255,255,255)");
                } else {
                    return bgColor($(child)[0].parentNode);
                }
            } else {
               return $(child).colourBrightness(bg);
            }
                }
        if ($(child1)[0].classList.contains("light") || window.location.pathname === "/overview") {
            that.play_image_url = PykCharts.assets+"img/play.png";
            that.pause_image_url = PykCharts.assets+"img/pause.png";
            that.marker_image_url = PykCharts.assets+"img/marker.png";
        } else {
            that.play_image_url = PykCharts.assets+"img/play-light.png";
            that.pause_image_url = PykCharts.assets+"img/pause-light.png";
            that.marker_image_url = PykCharts.assets+"img/marker-light.png";
        }

    }

    that.renderDataForTimescale = function () {
        that.unique = [];
        x_extent = d3.extent(that.timeline_data, function(d) {return d.timestamp; });
        x_range = [0 ,that.redeced_width];
        that.xScale = that.k.scaleIdentification("linear",x_extent,x_range);
        _.each(that.timeline_data, function (d) {
            if (that.unique.indexOf(d.timestamp) === -1) {
                that.unique.push(d.timestamp);
            }

        })
        that.unique.sort(function (a,b) {
          return a - b;
        });
        that.k.xAxis(that.svgContainer,that.gxaxis,that.xScale);
    }
    that.renderTimeline = function () {
        var x_extent
        , x_range
        , duration
        , interval = interval1 = that.interval_index = 1;

        that.play.on("click", function () {
            startTimeline();
        });

        that.timeline_status = "";

        var startTimeline = function () {
            if (that.timeline_status==="playing") {
                that.play.attr("xlink:href",that.play_image_url);
                that.timeline_status = "paused";
                that.interval_index = interval;
                clearInterval(that.play_interval);
            } else {
                that.timeline_status = "playing";
                that.play.attr("xlink:href",that.pause_image_url);
                interval = that.interval_index;
                var startInterval = function () {
                    if (interval===that.unique.length) {
                        interval = 0;
                    }

                    that.marker
                        .attr("x",  (that.margin_left*2) + that.xScale(that.unique[interval]) - 7);

                    that.data = _.where(that.timeline_data, {timestamp:that.unique[interval]});
                    that.data.sort(function (a,b) {
                        return a.timestamp - b.timestamp;
                    });
                    that.extent_size = d3.extent(that.data, function (d) { return parseInt(d.size, 10); });
                    that.difference = that.extent_size[1] - that.extent_size[0];
                    _.each(that.data, function (d) {
                        d3.select("path[iso2='"+d.iso2+"']")
                            .attr("fill", that.renderColor)
                            .attr("fill-opacity", that.renderOpacity)
                            .attr("data-fill-opacity",function () {
                                return $(this).attr("fill-opacity");
                            });
                    });
                    interval++;
                }
                that.play_interval = setInterval(function () {
                    startInterval();
                    if (interval===1) {
                        that.play.attr("xlink:href",that.play_image_url);
                        that.interval_index = 1;
                        that.timeline_status = "";
                        clearInterval(that.play_interval);
                    };
                }, that.timeline_duration);
                startInterval();
            }
        }
    };

    that.renderButtons = function () {
        var bbox = d3.select(that.selector+" .axis").node().getBBox();
            drag = d3.behavior.drag()
                    .origin(Object)
                    .on("drag",dragmove)
                    .on("dragend", function () {
                        $("body").css("cursor","default");
                    });
        function dragmove (d) {
            $("body").css("cursor","pointer");
            if (that.timeline_status !== "playing") {
                var x = PykCharts.getEvent().sourceEvent.pageX - (that.margin_left),
                    x_range = [],
                    temp = that.xScale.range(),
                    len = that.unique.length,
                    pad = (temp[1]-temp[0])/len,
                    strt = 0, left_tick, right_tick, left_diff, right_diff;

                for(var j=0 ; j<len ; j++){
                    strt = strt + pad;
                    x_range[j] = parseInt(strt);
                }

                for(var i=0 ; i<len ; i++) {
                    if (x >= x_range[i] && x <= x_range[i+1]) {
                        left_tick = x_range[i], right_tick = x_range[i+1],
                        left_diff = (x - left_tick), right_diff = (right_tick - x);

                        if ((left_diff >= right_diff) && (i <= (len-2))) {
                            that.marker.attr("x", (that.margin_left*2) + that.xScale(that.unique[i]) - 7);
                            that.data = _.where(that.timeline_data, {timestamp:that.unique[i]});
                            that.data.sort(function (a,b) {
                                return a.timestamp - b.timestamp;
                            });
                            that.extent_size = d3.extent(that.data, function (d) { return parseInt(d.size, 10); });
                            that.difference = that.extent_size[1] - that.extent_size[0];
                            _.each(that.data, function (d) {
                                d3.select("path[iso2='"+d.iso2+"']")
                                    .attr("fill", that.renderColor)
                                    .attr("fill-opacity", that.renderOpacity)
                                    .attr("data-fill-opacity",function () {
                                        return $(this).attr("fill-opacity");
                                    });
                            });
                            that.interval_index = i;
                        }
                    }
                    else if ((x > x_range[i]) && (i > (len-2))) {
                            that.marker.attr("x", (that.margin_left*2) + that.xScale(that.unique[i]) - 7);
                            that.data = _.where(that.timeline_data, {timestamp:that.unique[i]});
                            that.data.sort(function (a,b) {
                                return a.timestamp - b.timestamp;
                            });
                            that.extent_size = d3.extent(that.data, function (d) { return parseInt(d.size, 10); });
                            that.difference = that.extent_size[1] - that.extent_size[0];
                            _.each(that.data, function (d) {
                                d3.select("path[iso2='"+d.iso2+"']")
                                    .attr("fill", that.renderColor)
                                    .attr("fill-opacity", that.renderOpacity)
                                    .attr("data-fill-opacity",function () {
                                        return $(this).attr("fill-opacity");
                                    });
                            });
                            that.interval_index = i;
                    }
                }
            }
        }

        that.play = that.svgContainer.append("image")
            .attr("xlink:href",that.play_image_url)
            .attr("x", that.margin_left / 2)
            .attr("y", that.redeced_height - that.margin_top - (bbox.height/2))
            .attr("width","24px")
            .attr("height","21px")
            .style("cursor","pointer");

        that.marker = that.svgContainer.append("image")
            .attr("xlink:href",that.marker_image_url)
            .attr("x", (that.margin_left*2) + that.xScale(that.unique[0]) - 7)
            .attr("y", that.redeced_height)
            .attr("width","14px")
            .attr("height","12px")
            .style("cursor","pointer")
            .call(drag);
    }
};

var anonymousFunc = function () {

    var urls = [
      PykCharts.assets+'lib/jquery-1.11.1.min.js'
    , PykCharts.assets+'lib/d3.min.js'
    , PykCharts.assets+'lib/underscore.min.js'
    , PykCharts.assets+'lib/topojson.min.js'
    , PykCharts.assets+'lib/custom-hive.min.js'
    , PykCharts.assets+'lib/jquery.colourbrightness.min.js'
    , PykCharts.assets+'lib/colors.min.js'
    , PykCharts.assets+'lib/paper-full.min.js'
    , PykCharts.assets+'lib/downloadDataURI.min.js'
    ];

    function importFiles (url) {
        var include = document.createElement('script');
        include.type = 'text/javascript';
        include.async = false;
        include.onload = function () {
            try {
                PykCharts.numberFormat = d3.format(",");
                if (_ && d3 && ($ || jQuery) && d3.customHive && topojson && $("body").colourBrightness && $c && paper && downloadDataURI) {
                    window.PykChartsInit();
                    $("body").click(function () {
                        if (PykCharts.export_menu_status === 0) {
                            $(".dropdown-multipleConatiner-export").css("visibility","hidden");
                        }
                        PykCharts.export_menu_status = 0;
                    })
                };
            }
            catch (e) {

            }
        }
        include.src = url;
        var s = document.getElementsByTagName('link')[0];
        s.parentNode.insertBefore(include, s);
    };
    try {
        if (!$ && !jQuery) {
            importFiles(urls[0]);
        }
    } catch (e) {
        importFiles(urls[0]);
    }
    try {
        if(!d3) {
            importFiles(urls[1]);
        }
    } catch (e) {
        importFiles(urls[1])
    }
    try {
        if(!_) {
            importFiles(urls[2]);
        }
    } catch (e) {
        importFiles(urls[2]);
    }
    try {
        if(!d3.customHive) {
            importFiles(urls[3]);
        }
    } catch (e) {
        importFiles(urls[3]);
    }
    try {
        if(!topojson) {
            importFiles(urls[4]);
        }
    } catch (e) {
        importFiles(urls[4]);
    }
    try {
        if(!$("body").colourBrightness) {
            importFiles(urls[5]);
        }
    } catch (e) {
        importFiles(urls[5]);
    }
    try {
        if(!$c) {
            importFiles(urls[6]);
        }
    } catch (e) {
        importFiles(urls[6]);
    }
    try {
        if(!paper) {
            importFiles(urls[7]);
        }
    } catch (e) {
        importFiles(urls[7]);
    }
    try {
        if(!downloadDataURI) {
            importFiles(urls[8]);
        }
    } catch (e) {
        importFiles(urls[8]);
    }
};

window.onload = anonymousFunc;
