var PykCharts = {};
PykCharts.export_menu_status = 0;

Array.prototype.groupBy = function (chart) {
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
    var arr = this;
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

PykCharts.getEvent = function () {
  function getSourceEvent() {
    if (d3.event && d3.event.sourceEvent) {
      return d3.event.sourceEvent;
    }
    else {
      return d3.event;
    }
  }
  try {
    return event || getSourceEvent();
  } catch (e) {
    return getSourceEvent();
  }
}

PykCharts.Configuration = function (options){
    var that = this;

    var configuration = {
        liveData : function (chart) {
            var frequency = options.real_time_charts_refresh_frequency;
            if(PykCharts.boolean(frequency)) {
                setInterval(chart.refresh,frequency*1000);
            }
            return this;
        },
        emptyDiv : function () {
            d3.select(options.selector).append("div")
                .style("clear","both");

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
        title : function () {
            if(PykCharts.boolean(options.title_text) && options.title_size) {
                var div_width;

                if(PykCharts.boolean(options.export_enable)) {
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
        subtitle : function () {
            if(PykCharts.boolean(options.subtitle_text) && options.subtitle_size) {
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
        createFooter : function () {
            d3.select(options.selector).append("table")
                .attr("id","footer")
                .style("background", options.bg)
                .attr("width",options.width+"px");
            return this;
        },
        lastUpdatedAt : function (a) {
            if(PykCharts.boolean(options.real_time_charts_refresh_frequency) && PykCharts.boolean(options.real_time_charts_last_updated_at_enable)) {
                if(a === "liveData"){
                    var currentdate = new Date();
                    var date = currentdate.getDate() + "/"+(currentdate.getMonth()+1)
                        + "/" + currentdate.getFullYear() + " "
                        + currentdate.getHours() + ":"
                        + currentdate.getMinutes() + ":" + currentdate.getSeconds();
                    $(options.selector+" #lastUpdatedAt").html("<span style='pointer-events:none;'>Last Updated At: </span><span style='pointer-events:none;'>"+ date +"</span>");
                } else {
                    var currentdate = new Date();
                    // console.log(currentdate.getDate());
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
                        if(data[i][key2[j]] !== compare_data[i][key1[j]] || key1[j] !== key2[j]) {
                            changed = true;
                            break;
                        }
                    }
                }
            } else {
                changed = true;
            }
            that.compare_data = data;
            return [that.compare_data, changed];
        },
        credits : function () {
            if(PykCharts.boolean(options.credit_my_site_name) || PykCharts.boolean(options.credit_my_site_url)) {
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
                    // .html("<span style='pointer-events:none;'>Credits: </span><a href='" + credit.mySiteUrl + "' target='_blank' onclick='return " + enable +"'>"+ credit.mySiteName +"</a>");

            }
            return this;
        },
        dataSource : function () {
            if( (PykCharts.boolean(options.data_source_name) || PykCharts.boolean(options.data_source_url))) {
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
        makeMainDiv : function (selection,i) {
            var d = d3.select(selection).append("div")
                .attr("id","tooltip-svg-container-"+i)
                .attr("class","main-div")
                .style("width",options.width);
            if(PykCharts.boolean(options.panels_enable)){
                d.style("float","left")
                    .style("width","auto");
            }
            return this;
        },
        tooltip : function (d,selection,i,flag ) {
            if((PykCharts.boolean(options.tooltip_enable) || options.axis_x_data_format === "string" || options.axis_y_data_format === "string" || PykCharts.boolean(options.annotation_enable)) && options.mode === "default") {
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
                        .style("visibility", "hidden")
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
                        .style("visibility", "hidden")
                        .style("box-shadow","0 5px 10px rgba(0,0,0,.2)");
                }
            } else if (PykCharts.boolean(options.tooltip_enable)) {
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
                        .style("visibility", "hidden")
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
                        .style("visibility", "hidden")
                        .style("box-shadow","0 5px 10px rgba(0,0,0,.2)");
                }
            }
            return this;
        },
        annotation : function (svg,data,xScale,yScale) {
            var legendsGroup_height = (options.legendsGroup_height) ? options.legendsGroup_height : 0;

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

                        .text(function (d,i) {
                            return i+1;
                        })
                        .attr("fill",options.annotation_font_color)
                        .style("pointer-events","none");
                    annotation_circle
                        .attr("cx",function (d,i) {
                            return (parseInt(xScale(d.x))+options.extra_left_margin+options.margin_left);
                        })
                        .attr("cy", function (d,i) {
                            return (parseInt(yScale(d.y))-20+options.margin_top+legendsGroup_height);
                        })
                        .attr("r", 8)
                        .style("cursor","pointer")
                        .on("click",function (d,i) {
                            options.mouseEvent.tooltipPosition(d);
                            options.mouseEvent.tooltipTextShow(d.annotation);
                        })
                        .on("mouseover", function (d) {
                            options.mouseEvent.tooltipHide(d,options.panels_enable,"multilineChart")
                        })
                        .attr("fill",options.annotation_background_color)
                        .attr("stroke",options.annotation_border_color);
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
                            return parseInt(yScale(d.y)-20+options.margin_top+legendsGroup_height);
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
                        .attr("stroke",options.annotation_border_color)
                        .style("pointer-events","none");
                },options.transitions.duration());
                annotation_text.exit()
                    .remove();
                annotation_rect.exit()
                    .remove();
            }

            return this;
        },
        crossHair : function (svg,len,data,fill) {

            if(PykCharts.boolean(options.crosshair_enable) && options.mode === "default") {
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
                            return fill.colorPieMS(data[j]);
                        })
                        .attr("id","focus-circle"+j)
                        .attr("r",6);
                }
            }
            return this;
        },
        fullScreen : function (chart) {
            if(PykCharts.boolean(options.fullScreen)) {
                that.fullScreenButton = d3.select(options.selector)
                    .append("input")
                        .attr("type","image")
                        .attr("id","btn-zoom")
                        .attr("src",options.assets_location+"PykCharts/img/apple_fullscreen.jpg")
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
                var initial_height_div = $(options.selector).height();
                $(options.selector + " #chart-loader").css({"visibility":"visible","padding-left":(options.width/2) +"px","padding-top":(initial_height_div/2) + "px"});
            }
            return this;
        },
        positionContainers : function (position, chart) {
            if(PykCharts.boolean(options.legends_enable) && !(PykCharts.boolean(options.variable_circle_size_enable))) {
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
            if(PykCharts.boolean(options.grid_y_enable)) {
                var ygrid = PykCharts.Configuration.makeYGrid(options,yScale);
                gsvg.selectAll(options.selector + " g.y.grid-line")
                    .style("stroke",function () { return options.grid_color; })
                    .call(ygrid);
            }
            return this;
        },
        xGrid: function (svg, gsvg, xScale) {
             var width = options.width,
                height = options.height;

            if(PykCharts.boolean(options.grid_x_enable)) {
                var xgrid = PykCharts.Configuration.makeXGrid(options,xScale);
                gsvg.selectAll(options.selector + " g.x.grid-line")
                    .style("stroke",function () { return options.grid_color; })
                    .call(xgrid);
            }
            return this;
        },
        xAxis: function (svg, gsvg, xScale,extra,domain,legendsGroup_height) {
            var width = options.width,
                height = options.height;

            if(legendsGroup_height === undefined) {
                legendsGroup_height = 0;
            }

            var k = new PykCharts.Configuration(options);
            var e = extra;
            if(PykCharts.boolean(options.axis_x_enable)) {
                d3.selectAll(options.selector + " .x.axis").attr("fill",function () {return options.axis_x_pointer_color;});
                if(options.axis_x_position === "bottom") {
                    gsvg.attr("transform", "translate(0," + (options.height - options.margin_top - options.margin_bottom - legendsGroup_height) + ")");
                }
                var xaxis = PykCharts.Configuration.makeXAxis(options,xScale);
                var length = options.axis_x_pointer_values.length;

                var values = [];
                if(length) {
                    for(var i = 0 ; i < length ; i++) {
                        if(options.axis_x_data_format === "number") {
                            if(_.isNumber(options.axis_x_pointer_values[i]) || !(isNaN(options.axis_x_pointer_values[i]))){
                                values.push(options.axis_x_pointer_values[i])
                            }
                        } else if(options.axis_x_data_format === "time") {
                            if(!(isNaN(new Date(data[0].x).getTime()))) {
                                values.push(options.axis_x_pointer_values[i])
                            }
                        }
                    }
                }

                if(values.length) {

                    var newVal = [];
                    if(options.axis_x_data_format === "time") {
                        _.each(values, function (d) {
                            newVal.push(new Date(d));
                        });
                    } else {
                        newVal = values;
                    }
                    xaxis.tickValues(newVal);
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
            }

            return this;
        },
        yAxis: function (svg, gsvg, yScale,domain) {
            var width = options.width,
                height = options.height;
            var k = new PykCharts.Configuration(options);
             var w;
                    if(PykCharts.boolean(options.panels_enable)) {
                        w = options.w;
                    } else {
                        w = options.width;
                    }

            if(PykCharts.boolean(options.axis_y_enable)){
                if(options.axis_y_position === "right") {
                    gsvg.attr("transform", "translate(" + (w - options.margin_left - options.margin_right) + ",0)");
                }
                d3.selectAll(options.selector + " .y.axis").attr("fill",function () { return options.axis_y_pointer_color; });
                var yaxis = PykCharts.Configuration.makeYAxis(options,yScale);

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

                if(values.length) {
                    yaxis.tickValues(values);
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

            }
            return this;
        },
        xAxisTitle : function (gsvg,legendsGroup_height) {
            var w;
            if(PykCharts.boolean(options.panels_enable)) {
                w = options.w;
            } else {
                w = options.width;
            }

            if(!legendsGroup_height) {
                legendsGroup_height = 0;
            }

            if(options.axis_x_title) {

                if(!PykCharts.boolean(options.axis_x_enable)) {
                    gsvg.attr("transform", "translate(0," + (options.height - options.margin_top - options.margin_bottom - legendsGroup_height) + ")");
                }

                if(options.axis_x_position === "bottom") {
                    // console.log(axis_x_pointer_weight,"weird")
                    gsvg.append("text")
                        .attr("class","x-axis-title")
                        .attr("x", (w- options.margin_left - options.margin_right)/2)
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
                        .attr("x", (w - options.margin_left - options.margin_right)/2)
                        .attr("y", - options.margin_top + 10)
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
                if(PykCharts.boolean(options.panels_enable)) {
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
                        .attr("y", -(options.margin_left - 12))
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
            if(container === ".x.axis" && PykCharts.boolean(options.axis_x_enable)) {
                svg.select(container).call(PykCharts.Configuration.makeXAxis(options,scale));
                if((options.axis_x_data_format === "string") && options.panels_enable === "no") {
                    k.ordinalXAxisTickFormat(domain,extra);
                }
            }
            else if (container === ".x.grid") {
                svg.select(container).call(PykCharts.Configuration.makeXGrid(options,scale));
            }
            else if (container === ".y.axis" && PykCharts.boolean(options.axis_y_enable)) {
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
            // var mouseEvent = new PykCharts.Configuration.mouseEvent(options),
                var a = $(options.selector + " g.x.axis text"),
                len = a.length, comp, flag, largest = 0, rangeband = (extra*2);

            _.each(a, function (d) {
                largest = (d.getBBox().width > largest) ? d.getBBox().width : largest;
            });
            if (rangeband >= (largest+10)) { flag = 1; }
            else if (rangeband >= (largest*0.75) && rangeband < largest) { flag = 2; }
            else if (rangeband >= (largest*0.65) && rangeband < (largest*0.75)) { flag = 3; }
            else if (rangeband >= (largest*0.55) && rangeband < (largest*0.65)) { flag = 4; }
            else if (rangeband >= (largest*0.35) && rangeband < (largest*0.55)) { flag = 5; }
            else if (rangeband <= 20 || rangeband < (largest*0.35)) { flag = 0; }

            for(i=0; i<len; i++) {
                comp = a[i].innerHTML;
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
                a[i].innerHTML = comp;
            }
            xaxistooltip = d3.selectAll(options.selector + " g.x.axis text")
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
        ordinalYAxisTickFormat : function (domain) {
            var a = $(options.selector + " g.y.axis text");

            var len = a.length,comp;

            for(i=0; i<len; i++) {
                comp = a[i].innerHTML;
                if(a[i].getBBox().width > (options.margin_left * 0.7)) {
                    comp = comp.substr(0,3) + "..";
                }
                a[i].innerHTML = comp;
            }
            yaxistooltip = d3.selectAll(options.selector + " g.y.axis text")
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
        xAxisDataFormatIdentification : function (data){
            if(_.isNumber(data[0].x) || !(isNaN(data[0].x))){
                return "number";
            } else if(!(isNaN(new Date(data[0].x).getTime()))) {
                return "time";
            } else {
                return "string";
            }
        },
        yAxisDataFormatIdentification : function (data){

            if(_.isNumber(data[0].y) || !(isNaN(data[0].y))){
                return "number";
            } else if(!(isNaN(new Date(data[0].y).getTime()))) {
                return "time";
            } else {
                return "string";
            }
        },
        resize : function (svg,anno,lsvg) {
            var aspect = (options.width/options.height);
            var targetWidth = $(options.selector).width();
            if(targetWidth > options.width) {
                targetWidth = options.width;
            }
            if(PykCharts.boolean(svg)) {
                svg.attr("width", targetWidth);
                svg.attr("height", targetWidth / aspect);
            }
            var title_div_width;
            if(PykCharts.boolean(options.title_text)) {
                if(PykCharts.boolean(options.export_enable)) {
                    title_div_width = 0.9*targetWidth;
                    $(options.selector + " #title").css("width",title_div_width);
                }
            }
            if(PykCharts.boolean(options.subtitle_text)) {
                title_div_width = 0.9*targetWidth;
                $(options.selector + " #sub-title").css("width", title_div_width);
            }
            if(PykCharts.boolean(options.export_enable)) {
                div_size = targetWidth
                div_float ="none"
                div_left = targetWidth-16;
                if(PykCharts.boolean(options.title_text) && options.title_size && options.mode === "default") {
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
            if(lsvg !== undefined) {
                lsvg.attr("width",targetWidth);
            }
            var a = $(options.selector + " #footer");
            if(a) {
                a.attr("width",targetWidth);
            }
            var b = $(options.selector + " .main-div");
            if(b && !(PykCharts.boolean(options.panels_enable))) {
                $(options.selector + " .main-div").css("width",targetWidth);
            }
            if(PykCharts.boolean(anno)) {
                // options.annotation;
            }
        },
        __proto__: {
            _domainBandwidth: function (domain_array, count, type) {
                addFactor = 0;
                // if (callback) {
                //     // addFactor = callback();
                // }
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
                    return [new Date(new_array[0]),new Date(new_array[1])];
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
                    min_value = d3.min([options.width,(options.height-options.legendsGroup_height-20)])
                } else if(type !== undefined) {
                    min_value = options.width;
                } else {
                    min_value = d3.min([options.width,options.height]);
                }
                return (min_value*radius_percent)/200;
            }
        },
        backgroundColor: function (options) {
             $(options.selector).css({"background-color":options.background_color,"position":"relative"})
                var bg,child1;
                bgColor(options.selector);

                function bgColor(child) {
                    child1 = child;
                    bg = $(child).css("background-color");
                    // console.log("what is bg", child,bg);
                    if (bg === "transparent" || bg === "rgba(0, 0, 0, 0)") {
                        // console.log($(child)[0].parentNode.tagName,"is parent node body");
                        if($(child)[0].parentNode.tagName === undefined || $(child)[0].parentNode.tagName.toLowerCase() === "body") {
                        // if (document.getElementsByTagName("body").parentNode === null){
                            // console.log("is it going");
                            $(child).colourBrightness("rgb(255,255,255)");
                        } else {
                            // console.log($(child)[0].parentNode,"child");
                            return bgColor($(child)[0].parentNode);
                        }
                    } else {
                        // console.log("bg",bg);
                       return $(child).colourBrightness(bg);
                    }
                }

                if ($(child1)[0].classList.contains("light")) {
                    options.img = options.assets_location+"img/download.png";
                } else {
                    options.img = options.assets_location+"img/download-light.png";
                }

            return this;
        },
        export : function(chart,svgId,chart_name,panels_enable,containers) {
            if(PykCharts.boolean(options.export_enable)) {
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

                if(PykCharts.boolean(panels_enable)) {
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

                var canvas_id = chart_name+"canvas";
                var canvas = document.createElement("canvas");
                canvas.setAttribute('id', canvas_id);
                canvas.setAttribute('width',500);
                canvas.setAttribute('height',500);

                var id = "export",
                div_size = options.width
                div_float ="none"
                div_left = options.width-16;

                if(PykCharts.boolean(options.title_text) && options.title_size  && options.mode === "default") {
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
                                .style("text-align","right")
                                .html("<img title='Export to SVG' src='"+options.img+"' style='left:"+div_left+"px;margin-bottom:3px;cursor:pointer;'/>");

                var get_canvas = document.getElementById(canvas_id);
                paper.setup(get_canvas);
                var project = new paper.Project();
                project._view._viewSize.width = chart.width;
                project._view._viewSize.height = chart.height;

                var name = chart_name + ".svg";

                $(chart.selector + " #"+id).click(function () {
                  PykCharts.export_menu_status = 1;
                    d3.select(options.selector + " .dropdown-multipleConatiner-export").style("visibility", "visible");
                });
                if(!PykCharts.boolean(panels_enable)) {
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
                            var svg = project.exportSVG({ asString: true });
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
                        var font_size = x[i].getAttribute('font-size');
                        var value = font_size*parseFloat(attr_value);
                        x[i].setAttribute("dy", value);
                    }
                }
            }
            return this;
        },
        errorHandling: function(error_msg,error_code,err_url) {
            console.error('%c[Error - Pykih Charts] ', 'color: red;font-weight:bold;font-size:14px', " at "+options.selector+".(Invalid value for attribute \""+error_msg+"\")  Visit www.chartstore.io/docs#"/*+error_code*/);
            return;
        },
        warningHandling: function(error_msg,error_code,err_url) {
            console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+options.selector+".(Invalid value for attribute \""+error_msg+"\")  Visit www.chartstore.io/docs#"/*+error_code*/);
            return;
        },

        validator: function () {
            var validator = {
                validatingSelector : function (selector) {
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
                validatingDataType : function (attr_value,config_name,default_value,name) {
                    try {
                        if(!_.isNumber(attr_value)) { 
                            if(name) {
                                console.log(options[config_name],default_value,config_name)    
                                options[name] = default_value;
                            } else {
                                console.log(options[config_name],default_value,config_name)
                                options[config_name] = default_value;
                            }
                            throw config_name;
                        }
                    }
                    catch (err) {
                        options.k.warningHandling(err,"3");
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
                            options.k.warningHandling(err,"4");
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
                            options.k.warningHandling(err,"10");
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
                            options.k.warningHandling(err,"10");
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
                            options.k.warningHandling(err,"#8");
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
                            options.k.errorHandling(err,"7");
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
                            options.k.errorHandling(err,"11");
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
                            options.k.warningHandling(err,"#9");
                        }
                    }
                    return this;
                },
                validatingFontWeight: function (font_weight,config_name,default_value) {
                    try {
                        if(font_weight.toLowerCase() === "bold" || font_weight.toLowerCase() === "normal") {
                        } else {
                            options[config_name] = default_value;
                            throw config_name;
                        }
                    }
                    catch (err) {
                        options.k.warningHandling(err,"6");
                    }
                    return this;
                },
                validatingColor: function (color,config_name,default_value) {
                    if(color) {
                        try {
                            var checked;
                            if(typeof color != "string" ) {

                                throw config_name;
                            }

                            if(color.charAt(0)!= "#" && color.substring(0,3).toLowerCase() !="rgb" && color.toLowerCase()!= "transparent") {
                                checked = $c.name2hex(color) ;
                                if(checked === "Invalid Color Name") {
                                    console.log(color,"color")
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
                            options[config_name] = default_value;
                            options.k.warningHandling(err,"5");
                        }
                    }
                    return this;
                },
                validatingJSON : function (data) {
                    if(!data) {
                        try {
                            throw "json format not valid";
                        }
                        catch (err) {
                            options.stop = true;
                            options.k.errorHandling(err);
                        }
                    }
                    return this;
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
        tooltipPosition : function (d,xPos,yPos,xDiff,yDiff,group_index) {
            if(PykCharts.boolean(options.tooltip_enable) || PykCharts.boolean(options.annotation_enable) || options.axis_x_data_format === "string" || options.axis_y_data_format === "string") {
                if(xPos !== undefined){
                    var selector = options.selector.substr(1,options.selector.length)
                    var width_tooltip = parseFloat($("#tooltip-svg-container-"+group_index +"-pyk-tooltip"+selector).css("width"));
                    tooltip = $("#tooltip-svg-container-"+group_index +"-pyk-tooltip"+selector);
                    offset = $(options.selector).offset();
                    tooltip
                        .css("visibility", "visible")
                        .css("top", (yPos + yDiff+offset.top) + "px")
                        .css("left", (xPos + options.margin_left + xDiff - width_tooltip + offset.left) + "px");
                }
                else {
                    that.tooltip
                        .style("visibility", "visible")
                        .style("top", (PykCharts.getEvent().pageY - 20) + "px")
                        .style("left", (PykCharts.getEvent().pageX + 30) + "px");
                }
                return that.tooltip;
            }

        },
        tooltipTextShow : function (d,panels_enable,type,group_index) {
            var selector = options.selector.substr(1,options.selector.length)
            if(PykCharts.boolean(options.tooltip_enable) || PykCharts.boolean(options.annotation_enable) || options.axis_x_data_format === "string" || options.axis_y_data_format === "string") {
                if(panels_enable === "yes" && type === "multilineChart") {
                    $("#tooltip-svg-container-"+group_index +"-pyk-tooltip"+selector).html(d);
                }
                else {
                    that.tooltip.html(d);
                }
                return this;
            }
        },
        tooltipHide : function (d,panels_enable,type) {
            if(PykCharts.boolean(options.tooltip_enable) || PykCharts.boolean(options.annotation_enable) || options.axis_x_data_format === "string" || options.axis_y_data_format === "string") {
                if(panels_enable === "yes" && type === "multilineChart") {
                    return d3.selectAll(".pyk-tooltip").style("visibility","hidden");
                }
                else {
                    return that.tooltip.style("visibility", "hidden");
                }
            }
        },
        crossHairPosition: function(data,new_data,xScale,yScale,dataLineGroup,lineMargin,domain,type,tooltipMode,color_from_data,panels_enable){
            if((PykCharts.boolean(options.crosshair_enable) || PykCharts.boolean(options.tooltip_enable) || PykCharts.boolean(options.axis_onhover_hightlight_enable))  && options.mode === "default") {
                var offsetLeft = options.margin_left + lineMargin +  $(options.selector + " #"+dataLineGroup[0][0][0].parentNode.parentNode.id).offset().left;
                var offsetTop = $(options.selector + " #"+dataLineGroup[0][0][0].parentNode.parentNode.id).offset().top;
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
                var y = PykCharts.getEvent().pageY - offsetTop - top ;
                var x_range = [];
                if(options.axis_x_data_format==="string") {
                    x_range = xScale.range();
                } else {
                    temp = xScale.range();
                    pad = (temp[1]-temp[0])/new_data[0].data.length;
                    len = new_data[0].data.length;
                    strt = 0;
                    for(i = 0;i<len;i++){
                        strt = strt + pad;
                        x_range[i] = strt;
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
                            else if((x >= x_range[j] && x <= x_range[j+1]) && (y <= (y_range[k]))) {
                                left_tick = x_range[j], right_tick = x_range[j+1];
                                bottom_tick = y_range[k+1];
                                top_tick = y_range[k];
                                left_diff = (left_tick - x), right_diff = (x - right_tick);

                                if(left_diff >= right_diff) {
                                    active_x_tick = data[j].x;
                                    active_y_tick.push(data[j].y);
                                    tooltipText = data[j].tooltip || data[j].y;
                                    pos_line_cursor_x = (xScale(active_x_tick) + lineMargin + left);
                                    pos_line_cursor_y = (yScale(data[j].y) + top);
                                }
                                else {
                                    active_x_tick = data[j+1].x;
                                    active_y_tick.push(data[j+1].y);
                                    tooltipText = data[j+1].tooltip || data[j+1].y; // Line Chart ONLY!
                                    pos_line_cursor_x = (xScale(active_x_tick) + lineMargin + left);
                                    pos_line_cursor_y = (yScale(data[j+1].y) + top);
                                }
                                if(type === "multilineChart" /*|| type === "stackedAreaChart"*/) {
                                    if(panels_enable === "no") {
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
                                                    test.push(yScale(new_data[a].data[b].y) + top);
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
                                        if(PykCharts.boolean(options.tooltip_enable)) {
                                            if(type === "stackedAreaChart") {
                                                group_index = 1;
                                                this.tooltipPosition(tooltipText,pos_line_cursor_x,y,60,70,group_index);
                                            } else {
                                                this.tooltipPosition(tooltipText,pos_line_cursor_x,y,60,-15,group_index);
                                            }
                                            this.tooltipTextShow(tooltipText);
                                        }
                                        (options.crosshair_enable) ? this.crossHairShow(pos_line_cursor_x,top,pos_line_cursor_x,(h - bottom),pos_line_cursor_x,test,type,active_y_tick.length,panels_enable,new_data) : null;
                                        // (options.colspanrosshair_enable) ? this.crossHairShow(pos_line_cursor_x,top,pos_line_cursor_x,(h - bottom),pos_line_cursor_x,pos_line_cursor_y,type,active_y_tick.length,panels_enable) : null;
                                        this.axisHighlightShow(active_y_tick,options.selector+" .y.axis",domain);
                                        this.axisHighlightShow(active_x_tick,options.selector+" .x.axis",domain);
                                    }
                                    else if(panels_enable === "yes") {
                                        pos_line_cursor_x += 5;
                                        var len_data = new_data[0].data.length;
                                        for(var a=0;a < number_of_lines;a++) {
                                            var left_offset = $(options.selector + " #svg-"+a).offset().left;
                                            var top_offset = $(options.selector + " #svg-"+a).offset().top - $(options.selector).offset().top;
                                            for(var b=0;b < len_data;b++) {
                                                if(options.axis_x_data_format === "time") {
                                                    cond = Date.parse(active_x_tick)===Date.parse(new_data[a].data[b].x);
                                                } else {
                                                    cond = new_data[a].data[b].x === active_x_tick;
                                                }
                                                if(cond) {
                                                    active_y_tick.push(new_data[a].data[b].y);
                                                    tooltipText = new_data[a].data[b].tooltip;
                                                    pos_line_cursor_y = (yScale(new_data[a].data[b].y) + top);
                                                    this.tooltipPosition(tooltipText,(pos_line_cursor_x+left_offset),(pos_line_cursor_y+top_offset),-15,-15,a);

                                                    this.tooltipTextShow(tooltipText,panels_enable,type,a);
                                                    (options.crosshair_enable) ? this.crossHairShow(pos_line_cursor_x,top,pos_line_cursor_x,(h - bottom),pos_line_cursor_x,pos_line_cursor_y,type,active_y_tick.length,panels_enable,new_data[a],a) : null;
                                                }
                                            }
                                        }
                                    }
                                }
                                else if(type === "lineChart" || type === "areaChart") {
                                    if(PykCharts.boolean(options.tooltip_enable)) {
                                        if((options.tooltip_mode).toLowerCase() === "fixed") {
                                            this.tooltipPosition(tooltipText,0,pos_line_cursor_y,-14,23,group_index);
                                        } else if((options.tooltip_mode).toLowerCase() === "moving"){
                                            this.tooltipPosition(tooltipText,pos_line_cursor_x,pos_line_cursor_y,5,-45,group_index);
                                        }
                                        this.tooltipTextShow(tooltipText);
                                    }
                                    (options.crosshair_enable) ? this.crossHairShow(pos_line_cursor_x,top,pos_line_cursor_x,(h - bottom),pos_line_cursor_x,pos_line_cursor_y,type,active_y_tick.length,panels_enable) : null;
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
                                    if(PykCharts.boolean(options.tooltip_enable)) {
                                        if(type === "stackedAreaChart") {
                                            group_index = 1;
                                            this.tooltipPosition(tooltipText,pos_line_cursor_x,y,60,70,group_index);
                                        } else {
                                            this.tooltipPosition(tooltipText,pos_line_cursor_x,y,60,-15,group_index);
                                        }
                                        this.tooltipTextShow(tooltipText);
                                    }
                                    (options.crosshair_enable) ? this.crossHairShow(pos_line_cursor_x,top,pos_line_cursor_x,(h - bottom),pos_line_cursor_x,test,type,active_y_tick.length,panels_enable,new_data) : null;
                                    this.axisHighlightShow(active_y_tick,options.selector+" .y.axis",domain);
                                    this.axisHighlightShow(active_x_tick,options.selector+" .x.axis",domain);
                                }
                            }
                        }
                    }
                }
            }
        },
        crossHairShow : function (x1,y1,x2,y2,cx,cy,type,no_bullets,panels_enable,new_data,group_index) {
            if(PykCharts.boolean(options.crosshair_enable)) {
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
                                .attr("x2",(options.width - options.margin_right))
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
        crossHairHide : function (type) {
            if(PykCharts.boolean(options.crosshair_enable)/* && options.mode === "default"*/) {
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
        axisHighlightShow : function (active_tick,axisHighlight,domain,a) {
            var curr_tick,prev_tick,abc,selection,axis_data_length;
            if(PykCharts.boolean(options.axis_onhover_hightlight_enable)/* && options.mode === "default"*/){
                if(axisHighlight === options.selector + " .y.axis"){
                    selection = axisHighlight+" .tick text";
                    abc = options.axis_y_pointer_color;
                    axis_data_length = d3.selectAll(selection)[0].length;

                    d3.selectAll(selection)
                        .style("fill","#bbb")
                        // .style("font-size","12px")
                        .style("font-weight","normal");
                    for(var b=0;b < axis_data_length;b++) {
                        for(var a=0;a < active_tick.length;a++) {
                            if(d3.selectAll(selection)[0][b].innerHTML == active_tick[a]) {
                                d3.select(d3.selectAll(selection)[0][b])
                                    .style("fill",abc)
                                    // .style("font-size","13px")
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
                    var len = domain.length;
                    for(curr_tick = 0;curr_tick < len;curr_tick++){
                        if(domain[curr_tick] === active_tick) {
                            break;
                        }
                    }
                    prev_tick = curr_tick;

                    d3.selectAll(selection)
                        .style("fill","#bbb")
                        // .style("font-size","12px")
                        // .style("font-weight","normal");
                    d3.select(d3.selectAll(selection)[0][curr_tick])
                        .style("fill",abc)
                        // .style("font-size","13px")
                        .style("font-weight","bold");
                }
            }
            return this;
        },
        axisHighlightHide : function (axisHighlight,a) {
            var fill_color,selection,font_weight;
            if(PykCharts.boolean(options.axis_onhover_hightlight_enable)/* && options.mode === "default"*/){
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
        }
    };
    return action;
};

configuration.fillChart = function (options,theme,config) {
    var that = this;
    var fillchart = {
        selectColor: function (d) {
        theme = new PykCharts.Configuration.Theme({});
            if(d.name === options.highlight) {
                return options.highlight_color;
            } else if (options.chart_color.length && options.chart_color[0]){
                return options.chart_color;
            } else {
                return theme.stylesheet.chart_color
            }
        },
        colorChart : function (d) {
            if(d.name === options.highlight) {
                return theme.stylesheet.highlight_color;
            } else{
                return theme.stylesheet.chart_color;
            }
        },
        colorPieW : function (d) {
            if(d.color) {
                return d.color;
            } else if(options.chart_color.length) {
                return options.color;
            }
            else return options.chart_color[0];
            // if(!(PykCharts.boolean(options.variable_circle_variable_circle_size_enable))) {
            //     return options.saturation_color;
            // } else if(PykCharts.boolean(options.variable_circle_variable_circle_size_enable)) {
            //     if(d.color) {
            //         return d.color;
            //     }
            //     return options.chart_color;
            // }
        },
        colorPieMS : function (d,chart_type) {
            if(d.name.toLowerCase() === options.highlight.toLowerCase() && chart_type !== "lineChart" && chart_type !== "areaChart") {
                return options.highlight_color;
            } else if(options.color_mode === "saturation") {
                return options.saturation_color;
            } else if(options.color_mode === "color") {
                return d.color;
            } else if(options.color_mode === "color"){
                return options.chart_color;
            } return options.chart_color[0];
        },
        colorGroup : function (d) {
            if(options.color_mode === "saturation") {
                return options.saturation_color;
            } else if(options.color_mode === "color") {
                return d.color;
            } else if(options.color_mode === "color"){
                return options.chart_color[0];
            }
        },
        colorLegends : function (d) {
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
            return options.border_between_chart_elements_thickness;
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
                    .outerTickSize(options.axis_x_outer_pointer_size)
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
            .attr("font-size",options.axis_x_pointer_size)
            .style("font-weight",options.axis_x_pointer_weight)
            .style("font-family",options.axis_x_pointer_family);

    if(options.axis_x_data_format=== "time" && PykCharts.boolean(options.axis_x_time_value_datatype)) {
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
            .tickFormat(d3.time.format(b))

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
                    .outerTickSize(options.axis_y_outer_pointer_size)
                    .tickPadding(options.axis_y_pointer_padding)
                    .tickFormat(function (d,i) {
                        return d;
                    });

    d3.selectAll(options.selector + " .y.axis .tick text")
                .attr("font-size",options.axis_y_pointer_size)
                .style("font-weight",options.axis_y_pointer_weight)
                .style("font-family",options.axis_y_pointer_family);


    if(options.axis_y_data_format=== "time" && PykCharts.boolean(options.axis_y_time_value_type)) {
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

                    // .tickFormat(d3.format(",.0f"));
    return yaxis;
};

configuration.makeXGrid = function(options,xScale) {
    var that = this;

    var xgrid = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(options.axis_x_no_of_axis_value)
                    .tickFormat("")
                    .tickSize(options.height - options.margin_top - options.margin_bottom)
                    .outerTickSize(0);

    d3.selectAll(options.selector + " .x.axis .tick text")
                    .attr("font-size",options.axis_x_pointer_size)
                    .style("font-weight",options.axis_x_pointer_weight)
                    .style("font-family",options.axis_x_pointer_family);

    return xgrid;
};

configuration.makeYGrid = function(options,yScale) {
    var that = this, size;
    if(PykCharts.boolean(options.panels_enable)) {
        size = options.w - options.margin_left - options.margin_right
    } else {
        size = options.width - options.margin_left - options.margin_right
    }
    var ygrid = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(options.axis_x_no_of_axis_value)
                    .tickSize(-size)
                    .tickFormat("")
                    .outerTickSize(0);

    d3.selectAll(options.selector + " .y.axis .tick text")
                    .attr("font-size",options.axis_y_pointer_size)
                    .style("font-weight",options.axis_y_pointer_weight)
                    .style("font-family",options.axis_y_pointer_family);


    return ygrid;
};

configuration.transition = function (options) {
    var that = this;
    var transition = {
        duration : function() {
            if(options.mode === "default" && PykCharts.boolean(options.transition_duration)) {
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
        "pykih_charts_assets_location": "../pykih-charts/assets/",

        "mode": "default",
        "selector": "",

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
        // "export_image_url":"",

        "color_mode" : "saturation",

        "axis_x_pointer_size": 12,
        "axis_x_pointer_family": "'Helvetica Neue',Helvetica,Arial,sans-serif",
        "axis_x_pointer_weight": "normal",
        "axis_x_pointer_color": "#1D1D1D",

        "axis_x_enable": "yes",

        "axis_x_title" : "",
        "axis_x_title_size" : 14,
        "axis_x_title_color" : "#1D1D1D",
        "axis_x_title_weight": "bold",
        "axis_x_title_family" : "'Helvetica Neue',Helvetica,Arial,sans-serif",

        "axis_x_position": "bottom",
        "axis_x_pointer_position": "top", //axis orient
        "axis_x_line_color": "#1D1D1D",
        "axis_x_no_of_axis_value": 5,
        "axis_x_pointer_length": 5,
        // "axis_x_value_format": "",
        "axis_x_pointer_padding": 6,
        "axis_x_pointer_values": [],
        "axis_x_outer_pointer_size": 0,
        "axis_x_time_value_datatype":"",
        "axis_x_time_value_interval":0,
        "axis_x_data_format": "string",

        "loading_gif_url": "https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/img/loader.gif",
        // "fullscreen_enable": "no",

        "tooltip_enable": "yes",
        "tooltip_mode": "moving",

        "credit_my_site_name": "Pykih",
        "credit_my_site_url": "http://www.pykih.com"
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

        "pictograph_show_all_images": "yes",
        "pictograph_total_count_enable": "yes",
        "pictograph_current_count_enable": "yes",
        "pictograph_image_per_line": 3,
        "pictograph_image_width": 79,
        "pictograph_image_height": 66,
        "pictograph_current_count_size": 64,
        "pictograph_current_count_color": "#255AEE",
        "pictograph_current_count_weight": "normal",
        "pictograph_current_count_family": "'Helvetica Neue',Helvetica,Arial,sans-serif",
        "pictograph_total_count_size": 64,
        "pictograph_total_count_color": "grey",
        "pictograph_total_count_weight": "normal",
        "pictograph_total_count_family": "'Helvetica Neue',Helvetica,Arial,sans-serif",

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
        "pictograph_current_count_color": "#255AEE",
        "pictograph_current_count_weight": "normal",
        "pictograph_current_count_family": "'Helvetica Neue',Helvetica,Arial,sans-serif",
        "pictograph_total_count_size": 64,
        "pictograph_total_count_color": "grey",
        "pictograph_total_count_weight": "normal",
        "pictograph_total_count_family": "'Helvetica Neue',Helvetica,Arial,sans-serif"
    };

    that.multiDimensionalCharts = {

        "chart_grid_x_enable": "yes",
        "chart_grid_y_enable": "yes",
        "chart_grid_color":"#ddd",

        "axis_onhover_hightlight_enable": "no",

        "axis_y_pointer_size": 12,
        "axis_y_pointer_family": "'Helvetica Neue',Helvetica,Arial,sans-serif",
        "axis_y_pointer_weight": "normal",
        "axis_y_pointer_color": "#1D1D1D",
        "axis_y_enable": "yes",

        "axis_y_title" : "",
        "axis_y_title_size" : 14,
        "axis_y_title_color" : "#1D1D1D",
        "axis_y_title_weight": "bold",
        "axis_y_title_family" : "'Helvetica Neue',Helvetica,Arial,sans-serif",

        "axis_y_position": "left",
        "axis_y_pointer_position": "left",
        "axis_y_line_color": "#1D1D1D",
        "axis_y_no_of_axis_value": 5,
        "axis_y_pointer_length": 5,
        // "axis_y_value_format": "",
        "axis_y_pointer_padding": 6,
        "axis_y_pointer_values": [],
        "axis_y_outer_pointer_size": 0,
        "axis_y_time_value_datatype":"",
        "axis_y_time_value_interval":0,
        "axis_y_data_format": "number",

        "panels_enable": "no",
        "variable_circle_size_enable" : "yes",

        "crosshair_enable": "yes",
        "zoom_enable": "no",
        "zoom_level" : 3,

        // "color": ["yellow"],

        "spiderweb_outer_radius_percent" : 80,
        // "spiderweb_radius": 5,
        // "spiderweb_axis_title": "yes",
        // "spiderweb_pointer": "yes",

        "scatterplot_radius" : 20,
        "scatterplot_pointer_enable": "no",

        "curvy_lines_enable": "no",

        "annotation_enable": "no",
        "annotation_view_mode": "onload", // "onload" / "onclick"
        "annotation_border_color" : "black",
        "annotation_background_color" : "#EEEEEE",
        "annotation_font_color" : "black",

        "data_sort_enable": "yes",
        "data_sort_type": "alphabetically", // sort type --- "alphabetically" / "numerically" / "date"
        "data_sort_order": "ascending" // sort order --- "descending" / "ascending"
    };

    that.treeCharts = {
        "zoom_enable" : "no",
        "nodeRadius" : 4.5
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

        // "play_image_url":"https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/assets/images/play.gif",
        // "pause_image_url":"https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/assets/images/pause.gif",
        // "marker_image_url":"https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/assets/images/marker.png",

        "label_enable": "no",
        "click_enable": "yes",

        "onhover": "shadow"
    };
    return that;
}

PykCharts.oneD = {};

// PykCharts.oneD.fillChart = function (options) {

//     var colorPie = {
//         chart_color: function (d) {
//             if(d.highlight === true) {
//                 return options.highlight_color;
//             } else{
//                 return options.chart_color;
//             }
//         }
//     };
//     return colorPie;
// };

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
        // , optional = options.optional;
    // console.log(options.mode,"options");

    chartObject.assets_location = options.pykih_charts_assets_location ? options.pykih_charts_assets_location : stylesheet.pykih_charts_assets_location;

    chartObject.selector = options.selector ? options.selector : stylesheet.selector;
    // if(options.chart_width) {
    //     var targetWidth = $(options.selector).width();
    //     options.chart_width = targetWidth < options.chart_width ? targetWidth : options.chart_width;
    // }
    chartObject.width = options.chart_width  ? options.chart_width : stylesheet.chart_width;
    // chartObject.height = options.chart_height && _.isNumber(options.chart_height) ? options.chart_height : stylesheet.chart_height;
    // chartObject.width = optional && optional.chart && _.isNumber(optional.chart.width) ? optional.chart.width : stylesheet.chart.width;
    // chartObject.height = optional && optional.chart &&_.isNumber(optional.chart.height) ? optional.chart.height : stylesheet.chart.height;

    chartObject.mode = options.mode ? options.mode.toLowerCase(): stylesheet.mode;

    if (options &&  PykCharts.boolean (options.title_text)) {
        chartObject.title_text = options.title_text;
        chartObject.title_size = "title_size" in options ? options.title_size : stylesheet.title_size;
        chartObject.title_color = options.title_color ? options.title_color : stylesheet.title_color;
        chartObject.title_weight = options.title_weight ? options.title_weight : stylesheet.title_weight;
        chartObject.title_family = options.title_family ? options.title_family.toLowerCase() : stylesheet.title_family;
    } else {
        chartObject.title_size = stylesheet.title_size;
        chartObject.title_color = stylesheet.title_color;
        chartObject.title_weight = stylesheet.title_weight;
        chartObject.title_family = stylesheet.title_family;
    }

    if (options && PykCharts.boolean(options.subtitle_text)) {
        chartObject.subtitle_text = options.subtitle_text;
        chartObject.subtitle_size = "subtitle_size" in options ? options.subtitle_size : stylesheet.subtitle_size;
        chartObject.subtitle_color = options.subtitle_color ? options.subtitle_color : stylesheet.subtitle_color;
        chartObject.subtitle_weight = options.subtitle_weight ? options.subtitle_weight : stylesheet.subtitle_weight;
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
    // chartObject.credit_my_site_name = options.credit_my_site_name ? options.credit_my_site_name : stylesheet.credit_my_site_name;
    // chartObject.credit_my_site_url = options.credit_my_site_url ? options.credit_my_site_url : stylesheet.credit_my_site_url;
    chartObject.data_source_name = options.data_source_name ? options.data_source_name : "";
    chartObject.data_source_url = options.data_source_url ? options.data_source_url : "";

    chartObject.clubdata_enable = options.clubdata_enable ? options.clubdata_enable.toLowerCase() : oneDimensionalCharts.clubdata_enable;
    chartObject.clubdata_text = PykCharts.boolean(options.clubdata_enable) && options.clubdata_text ? options.clubdata_text : oneDimensionalCharts.clubdata_text;
    chartObject.clubdata_maximum_nodes = PykCharts.boolean(options.clubdata_maximum_nodes) && options.clubdata_maximum_nodes ? options.clubdata_maximum_nodes : oneDimensionalCharts.clubdata_maximum_nodes;
    chartObject.clubdata_always_include_data_points = PykCharts.boolean(options.clubdata_enable) && options.clubdata_always_include_data_points ? options.clubdata_always_include_data_points : [];

    chartObject.transition_duration = options.transition_duration ? options.transition_duration : functionality.transition_duration;
    chartObject.pointer_overflow_enable = options.pointer_overflow_enable ? options.pointer_overflow_enable.toLowerCase() : stylesheet.pointer_overflow_enable;

    chartObject.background_color = options.background_color ? options.background_color : stylesheet.background_color;

    chartObject.chart_color = options.chart_color  ? options.chart_color : stylesheet.chart_color;
    chartObject.highlight_color = options.highlight_color ? options.highlight_color : stylesheet.highlight_color;

    chartObject.fullscreen_enable = options.fullscreen_enable ? options.fullscreen_enable : stylesheet.fullscreen_enable;
    chartObject.loading = options.loading_gif_url ? options.loading_gif_url: stylesheet.loading_gif_url;
    chartObject.tooltip_enable = options.tooltip_enable ? options.tooltip_enable.toLowerCase() : stylesheet.tooltip_enable;
    chartObject.border_between_chart_elements_thickness = "border_between_chart_elements_thickness" in options ? options.border_between_chart_elements_thickness : stylesheet.border_between_chart_elements_thickness;
    chartObject.border_between_chart_elements_color = options.border_between_chart_elements_color ? options.border_between_chart_elements_color.toLowerCase() : stylesheet.border_between_chart_elements_color;
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
    chartObject.label_weight = options.label_weight ? options.label_weight : stylesheet.label_weight;
    chartObject.label_family = options.label_family ? options.label_family.toLowerCase() : stylesheet.label_family;

    chartObject.pointer_thickness = "pointer_thickness" in options ? options.pointer_thickness : stylesheet.pointer_thickness;
    chartObject.pointer_size = "pointer_size" in options ? options.pointer_size : stylesheet.pointer_size;
    chartObject.pointer_color = options.pointer_color ? options.pointer_color : stylesheet.pointer_color;
    chartObject.pointer_family = options.pointer_family ? options.pointer_family.toLowerCase() : stylesheet.pointer_family;
    chartObject.pointer_weight = options.pointer_weight ? options.pointer_weight : stylesheet.pointer_weight;

    chartObject.units_prefix = options.units_prefix ? options.units_prefix : false;
    chartObject.units_suffix = options.units_suffix ? options.units_suffix : false;

    chartObject.export_enable = options.export_enable ? options.export_enable.toLowerCase() : stylesheet.export_enable;
    // chartObject.export_image_url = options.export_image_url ? options.export_image_url : stylesheet.export_image_url;
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
            that.k.warningHandling(err,"3");
        }

        if(that.stop) {
            return;
        }

        if(that.mode === "default") {
           that.k.loading();
        }

        d3.json(options.data, function (e,data) {
            console.log(options.data,"data");
            // that.data =options.data;
            // that.compare_data = options.data;
            that.data = data.groupBy("oned");
            that.compare_data = data.groupBy("oned");
            $(options.selector+" #chart-loader").remove();
            that.clubdata_enable = that.data.length>that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.render();
        });
    };

    this.refresh = function () {

        d3.json (options.data, function (e,data) {
            that.data = data.groupBy("oned");
            that.refresh_data = data.groupBy("oned");
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
        });
    };

    this.render = function () {
        // that.fillChart = new PykCharts.oneD.fillChart(that);
        that.fillChart = new PykCharts.Configuration.fillChart(that);
        that.onHoverEffect = new PykCharts.oneD.mouseEvent(that);
        that.transitions = new PykCharts.Configuration.transition(that);

        if (that.mode ==="default") {

            that.k.title()
                .backgroundColor(that)
                .export(that,"#svgcontainer","bubble")
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
                .export(that,"#svgcontainer","bubble")
                .emptyDiv();

            that.new_data = {"children" : that.data};
            that.optionalFeatures().svgContainer()
                .createChart()
                .label();

            that.k.tooltip();

        }
        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        $(document).ready(function () { return that.k.resize(that.svgContainer); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer); });
    };

    this.optionalFeatures = function () {

        var optional = {
            svgContainer: function () {
                // $(that.selector).css("background-color",that.background_color);

                that.svgContainer = d3.select(that.selector).append("svg")
                    .attr("class","svgcontainer")
                    .attr("id","svgcontainer")
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
                // that.max = that.new_data.children[l-1].weight;
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
                    .attr("x",function (d) { return d.x; })
                    .attr("y",function (d) { return d.y; })
                    .attr("r",0)
                    .attr("transform",function (d) { return "translate(" + d.x + "," + d.y +")"; })
                    .attr("fill",function (d) {
                        return d.children ? that.background_color : that.fillChart.selectColor(d);
                    })
                    .on("mouseover", function (d) {
                        if(!d.children && that.mode==="default") {
                            that.onHoverEffect.highlight(options.selector+" "+".bubble", this);
                            d.tooltip = d.tooltip ||"<table><thead><th colspan='2' class='tooltip-heading'>"+d.name+"</th></thead><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.weight)+"  <td class='tooltip-right-content'>("+((d.weight*100)/that.sum).toFixed(2)+"%)</tr></table>";
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(d.tooltip);
                        }
                    })
                    .on("mouseout", function (d) {
                        if(that.mode==="default") {
                            that.mouseEvent.tooltipHide(d)
                            that.onHoverEffect.highlightHide(options.selector+" "+".bubble");
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

                //     that.chart_text = that.group.selectAll("text")
                //         .data(that.node);

                //     that.chart_text.enter()
                //     .append("text")
                //     .style("pointer-events","none");

                //     that.chart_text.attr("text-anchor","middle")
                //         .attr("transform",function (d) {return "translate(" + d.x + "," + (d.y + 5) +")";})
                //         .text("")
                //         // .transition()
                //         // .delay(that.transitions.duration());

                //     setTimeout(function() {
                //         that.chart_text
                //             .text(function (d) { return d.children ? " " :  d.name; })
                //             .attr("pointer-events","none")
                //             .text(function (d) {
                //                 if(this.getBBox().width< 2*d.r && this.getBBox().height<2*d.r) {
                //                     return d.children ? " " :  d.name;
                //                 }
                //                 else {
                //                      return "";
                //                     }
                //             })
                //             .style("font-weight", that.label_weight)
                //             .style("font-size",function (d,i) {
                //                 if (d.r > 24) {
                //                     return that.label_size;
                //                 } else {
                //                     return "10px";
                //                 }
                //             })
                //             .attr("fill", that.label_color)
                //             .style("font-family", that.label_family);
                //     },that.transitions.duration());

                //     that.chart_text.exit().remove;
                // return this;
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
                        .style("font-size", that.label_size)
                        .attr("fill", that.label_color)
                        .style("font-family", that.label_family)
                        .text("")
                        // .transition()
                        // .delay(that.transitions.duration())

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
                        .style("font-size", that.label_size)
                        .attr("fill", that.label_color)
                        .style("font-family", that.label_family)
                        .text("")
                        .attr("pointer-events","none")
                        // .transition()
                        // .delay(that.transitions.duration())

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
                if (PykCharts.boolean(that.clubdata_enable)) {
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
                        for (i=0; i<new_data.length && i< that.data.length; i++) {
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
                    // console.log(that.data.data,"what is this");
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

    //----------------------------------------------------------------------------------------
    //1. This is the method that executes the various JS functions in the proper sequence to generate the chart
    //----------------------------------------------------------------------------------------
    this.execute = function () {
        //1.3 Assign Global variable var that to access function and variable throughout
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
                that.k.warningHandling(err,"3");
            }

            try {
                if(!_.isNumber(that.rect_width)) {
                    that.rect_width = functionality.funnel_rect_width;
                    throw "funnel_rect_width"
                }
            } 
            catch (err) {
                that.k.warningHandling(err,"3");
            }

            try {
            
                if(!_.isNumber(that.rect_height)) {
                    that.rect_height = functionality.funnel_rect_height;
                    throw "funnel_rect_height"
                }
            } 
            catch (err) {
                that.k.warningHandling(err,"3");
            }

        if(that.stop) {
            return;
        }

        if(that.mode === "default") {
           that.k.loading();
        }

        d3.json(options.data, function (e,data) {
            that.data = data.groupBy("oned");
            that.compare_data = data.groupBy("oned");
            $(options.selector+" #chart-loader").remove();
            that.clubdata_enable = that.data.length>that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.render();
        });
        // that.clubData.enable = that.data.length>that.clubData.maximumNodes ? that.clubData.enable : "no";

    };


    //----------------------------------------------------------------------------------------
    //2. Render function to create the chart
    //----------------------------------------------------------------------------------------
    this.refresh = function () {
        d3.json (options.data, function (e,data) {
            that.data = data.groupBy("oned");
            that.refresh_data = data.groupBy("oned");
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
        });
    };

    this.render = function () {
        var that = this;
        //that.fillChart = new PykCharts.oneD.fillChart(that);
        that.fillChart = new PykCharts.Configuration.fillChart(that);
        that.onHoverEffect = new PykCharts.oneD.mouseEvent(that);
        that.transitions = new PykCharts.Configuration.transition(that);
//        theme.stylesheet.borderBetweenChartElements;
        that.border = new PykCharts.Configuration.border(that);

        if(that.mode === "default") {
            that.k.title()
                .backgroundColor(that)
                .export(that,"#svgcontainer","funnel")
                .emptyDiv()
                .subtitle();
        }
        that.k.tooltip();
        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        if(that.mode === "infographics") {
            that.k.backgroundColor(that)
                .export(that,"#svgcontainer","funnel")
                .emptyDiv();

            that.new_data = that.data;
        }
        if(that.mode === "default") {
            that.optionalFeatures()
                .clubData();
        }
        that.optionalFeatures().svgContainer()
            .createChart()
            .label()
            .ticks();
        if(that.mode === "default") {
            // that.optionalFeatures().ticks();
            that.k.liveData(that)
                .createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();
        }
        $(document).ready(function () { return that.k.resize(that.svgContainer); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer); });
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
    this.optionalFeatures = function () {

        var optional = {
            svgContainer :function () {
                // $(options.selector).css("background-color",that.background_color);

                that.svgContainer = d3.select(options.selector)
                    .append('svg')
                    .attr("width",that.width) //+100 removed
                    .attr("height",that.height)
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height)
                    .attr("id","svgcontainer")
                    .attr("class","svgcontainer");

                    that.group = that.svgContainer.append("g")
                        .attr("id","funnel");

                return this;
            },
            createChart: function () {
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
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-dasharray", that.border.style())
                    .attr("stroke-opacity",1)
        			.on("mouseover", function (d,i) {
                        if(that.mode === "default") {
                            that.onHoverEffect.highlight(options.selector +" "+".fun-path",this);
                            tooltip = that.new_data[i].tooltip || "<table class='PykCharts'><tr><th colspan='3' class='tooltip-heading'>"+that.new_data[i].name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(that.new_data[i].weight)+"<td class='tooltip-right-content'>("+that.per_values[i].toFixed(2)+"%) </tr></table>";
                			that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(tooltip);
                        }
        			})
        			.on("mouseout", function (d) {
                        if(that.mode === "default") {
                            that.onHoverEffect.highlightHide(options.selector +" "+".fun-path");
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
                                // return that.k.appendUnits(that.new_data[i].weight);
                             })
                            .attr("text-anchor","middle")
                            .attr("pointer-events","none")
                            .style("font-weight", that.label_weight)
                            .style("font-size", that.label_size)
                            .attr("fill", that.label_color)
                            .style("font-family", that.label_family)
                            .text(function (d,i) {
                                if(this.getBBox().width<(d.values[3].x - d.values[1].x) && this.getBBox().height < (d.values[2].y - d.values[0].y)) {
                                    return that.per_values[i].toFixed(1) + "%";
                                    // return that.k.appendUnits(that.new_data[i].weight);
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
                // console.log("ticks");
                if(PykCharts.boolean(that.pointer_overflow_enable)) {
                    that.svgContainer.style("overflow","visible");
                }

                var w =[];
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
                        // .transition()
                        // .delay(that.transitions.duration())

                    setTimeout(function() {
                        tick_label.text(function (d,i) { return that.new_data[i].name; })
                            .text(function (d,i) {
                                w[i] = this.getBBox().height;
                                if (this.getBBox().height < (d.values[2].y - d.values[0].y)) {
                                    return that.new_data[i].name;
                                }
                                else {
                                    return "";
                                }
                            })
                            .attr("font-size", that.pointer_size)
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
                        .attr("stroke-width", that.pointer_thickness)
                        .attr("stroke", that.pointer_color)
                        // .transition()
                        // .duration(that.transitions.duration())

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
            },
            clubData : function () {
                if(PykCharts.boolean(that.clubdata_enable)) {
                    var clubdata_content = [];
                    if(that.clubdata_always_include_data_points.length!== 0){
                        var l = that.clubdata_always_include_data_points.length;
                        for(i=0; i < l; i++){
                            clubdata_content[i] = that.clubdata_always_include_data_points[i];
                        }
                    }
                    var newData = [];
                    for(i=0;i<clubdata_content.length;i++){
                        for(j=0;j<that.data.length;j++){
                            if(clubdata_content[i].toUpperCase() === that.data[j].name.toUpperCase()){
                                newData.push(that.data[j]);
                            }
                        }
                    }
                    that.data.sort(function (a,b) { return b.weight - a.weight; });
                    var k = 0;
                    while(newData.length<that.clubdata_maximum_nodes-1){
                        for(i=0;i<clubdata_content.length;i++){
                            if(that.data[k].name.toUpperCase() === clubdata_content[i].toUpperCase()){
                                k++;
                            }
                        }
                        newData.push(that.data[k]);
                        k++;
                    }
                    var sum_others = 0;
                    for(j=k; j < that.data.length; j++){
                        for(i=0; i<newData.length && j<that.data.length; i++){
                            if(that.data[j].name.toUpperCase() === newData[i].name.toUpperCase()){
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
                    while(newData.length > that.clubdata_maximum_nodes){
                        newData.sort(sortfunc);
                        var a=newData.pop();
                    }

                    var others_Slice = { "name":that.clubdata_text, "weight": sum_others, "color": that.clubData_color, "tooltip": (that.clubData_tooltip)};
                    if(newData.length < that.clubdata_maximum_nodes){
                        newData.push(others_Slice);
                    }
                    newData.sort(function (a,b) { return b.weight - a.weight; });
                    that.new_data = newData;
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

        that.height = options.chart_height ? options.chart_height : that.width;
        that.percent_column_rect_width = options.percent_column_rect_width ? options.percent_column_rect_width : theme.oneDimensionalCharts.percent_column_rect_width;

        try {
            if(!_.isNumber(that.height)) {
                that.height = that.width;
                throw "chart_height"
            }
        } 
        catch (err) {
            that.k.warningHandling(err,"3");
        }

        try {
            if(!_.isNumber(that.percent_column_rect_width)) {
                that.percent_column_rect_width = theme.oneDimensionalCharts.percent_column_rect_width;
                throw "percent_column_rect_width"
            }
        } 
        catch (err) {
            that.k.warningHandling(err,"3");
        }
        if(that.stop) {
            return;
        }
        // 1.2 Read Json File Get all the data and pass to render

        if(that.percent_column_rect_width > 100) {
            that.percent_column_rect_width = 100;
        }

        that.percent_column_rect_width = that.k._radiusCalculation(that.percent_column_rect_width,"percentageColumn") * 2;

        if(that.mode === "default") {
           that.k.loading();
        }
        d3.json(options.data, function (e, data) {
            that.data = data.groupBy("oned");
            that.compare_data = data.groupBy("oned");
            $(options.selector+" #chart-loader").remove();
            that.clubdata_enable = that.data.length>that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.render();
        });
        // that.clubData.enable = that.data.length>that.clubData.maximumNodes ? that.clubData.enable : "no";
    };
    //----------------------------------------------------------------------------------------
    //2. Render function to create the chart
    //----------------------------------------------------------------------------------------
    this.refresh = function () {
        d3.json (options.data, function (e,data) {
            that.data = data.groupBy("oned");
            that.refresh_data = data.groupBy("oned");
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
        });
    };

    this.render = function () {
        var that = this;

        that.fillChart = new PykCharts.Configuration.fillChart(that);
        that.onHoverEffect = new PykCharts.oneD.mouseEvent(options);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.border = new PykCharts.Configuration.border(that);

        if(that.mode === "default") {
            that.k.title()
                    .backgroundColor(that)
                    .export(that,"#svgcontainer","percentageColumn")
                    .emptyDiv()
                    .subtitle();
                // [that.fullscreen]().fullScreen(that);
        }
        if(that.mode === "infographics") {
            that.k.backgroundColor(that)
                .export(that,"#svgcontainer","percentageColumn")
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
            // that.optionalFeatures().ticks()
            that.k.liveData(that)
                .createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();
        }

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
                that.new_data.sort(function (a,b) { return b.weight - a.weight; })
                // that.map1 = _.map(that.new_data,function (d,i) {
                //     return d.percentValue;
                // });
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
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-dasharray", that.border.style())
                    .on("mouseover", function (d,i) {
                        if(that.mode === "default") {
                            d.tooltip=d.tooltip||"<table class='PykCharts'><tr><th colspan='2' class='tooltip-heading'>"+d.name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.weight)+"<td class='tooltip-right-content'>("+d.percentValue.toFixed(2)+"%)</tr></table>"
                            that.onHoverEffect.highlight(options.selector+" "+".per-rect",this);
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(d.tooltip);
                        }
                    })
                    .on("mouseout", function (d) {
                        if(that.mode === "default") {
                            that.onHoverEffect.highlightHide(options.selector+" "+".per-rect");
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
                // $(options.selector).css("background-color",that.background_color);

                that.svgContainer = d3.select(options.selector)
                    .append('svg')
                    .attr("width",that.width)
                    .attr("height",that.height)
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height)
                    .attr("id","svgcontainer")
                    .attr("class","svgcontainer");

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
                        .style("font-size", that.label_size)
                        .attr("text-anchor","middle")
                        .attr("pointer-events","none")
                        .style("font-weight", that.label_weight)
                        .style("font-family", that.label_family);
                        // .transition()
                        // .delay(that.transitions.duration())

                        setTimeout(function(){
                            that.chart_text.text(function (d) {
                                return d.percentValue.toFixed(1)+"%";
                                // return that.k.appendUnits(d.weight);
                            })
                                .text(function (d) {
                                    if(this.getBBox().width < (that.width/4) && this.getBBox().height < (d.percentValue * that.height / 100)) {
                                        return d.percentValue.toFixed(1)+"%";
                                        // return that.k.appendUnits(d.weight);
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
                if(PykCharts.boolean(that.pointer_overflow_enable)) {
                    that.svgContainer.style("overflow","visible");
                }
                    var sum = 0, sum1 = 0;

                    var x, y, w = [];
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
                                .attr("stroke-width", that.pointer_thickness)
                                .attr("stroke", that.pointer_color)
                                // .transition()
                                // .duration(that.transitions.duration())
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

                if(PykCharts.boolean(that.clubdata_enable)) {
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

    //----------------------------------------------------------------------------------------
    //1. This is the method that executes the various JS functions in the proper sequence to generate the chart
    //----------------------------------------------------------------------------------------
    this.execute = function () {
        //1.3 Assign Global variable var that to access function and variable throughout
        var that = this;

        that = new PykCharts.oneD.processInputs(that, options, "percentageBar");
        // 1.2 Read Json File Get all the data and pass to render

        that.height = options.chart_height ? options.chart_height : that.width/2;
        that.percent_row_rect_height = options.percent_row_rect_height ? options.percent_row_rect_height : theme.oneDimensionalCharts.percent_row_rect_height;

        try {
            if(!_.isNumber(that.height)) {
                that.height = that.width/2;
                throw "chart_height"
            }
        } 
        catch (err) {
            that.k.warningHandling(err,"3");
        }

        try {
            if(!_.isNumber(that.percent_row_rect_height)) {
                that.percent_row_rect_height = theme.oneDimensionalCharts.percent_row_rect_height;
                throw "percent_row_rect_height";
            }
        } 
        catch (err) {
            that.k.warningHandling(err,"3");
        }

        if(that.stop) {
            return;
        }

        if(that.percent_row_rect_height > 100) {
            that.percent_row_rect_height = 100;
        }

        that.percent_row_rect_height = that.k._radiusCalculation(that.percent_row_rect_height,"percentageBar") * 2;

        if(that.mode === "default") {
           that.k.loading();
        }
        d3.json(options.data, function (e, data) {
            that.data = data.groupBy("oned");
            that.compare_data = data.groupBy("oned");
            $(options.selector+" #chart-loader").remove();
            that.clubdata_enable = that.data.length>that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.render();
        });
        // that.clubData.enable = that.data.length>that.clubData.maximumNodes ? that.clubData.enable : "no";
    };
    //----------------------------------------------------------------------------------------
    //2. Render function to create the chart
    //----------------------------------------------------------------------------------------
    this.refresh = function () {
        d3.json (options.data, function (e,data) {
            that.data = data.groupBy("oned");
            that.refresh_data = data.groupBy("oned");
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
        });
    };

    this.render = function () {
        var that = this;
    //    that.fillChart = new PykCharts.oneD.fillChart(that);
        that.fillChart = new PykCharts.Configuration.fillChart(that);
        that.onHoverEffect = new PykCharts.oneD.mouseEvent(options);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.border = new PykCharts.Configuration.border(that);

        if(that.mode === "default") {

            that.k.title()
                    .backgroundColor(that)
                    .export(that,"#svgcontainer","percentageBar")
                    .emptyDiv()
                    .subtitle();
        }
        if(that.mode === "infographics") {
            that.k.backgroundColor(that)
            .export(that,"#svgcontainer","percentageBar").emptyDiv();
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

            // that.optionalFeatures().ticks()
            that.k.liveData(that)
                .createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();
        }
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
                that.new_data.sort(function (a,b) { return b.weight - a.weight; })
                // that.map1 = _.map(that.new_data,function (d,i) {
                //     return d.percentValue;
                // });
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
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-dasharray", that.border.style())
                    .on("mouseover", function (d,i) {
                        if(that.mode === "default") {
                            d.tooltip=d.tooltip||"<table class='PykCharts'><tr><th colspan='2' class='tooltip-heading'>"+d.name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.weight)+"<td class='tooltip-right-content'>("+d.percentValue.toFixed(2)+"%)</tr></table>"
                            that.onHoverEffect.highlight(options.selector+" "+".per-rect",this);
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(d.tooltip);
                        }
                    })
                    .on("mouseout", function (d) {
                        if(that.mode === "default") {
                            that.onHoverEffect.highlightHide(options.selector+" "+".per-rect");
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
                // $(options.selector).css("background-color",that.bg);

                that.svgContainer = d3.select(options.selector)
                    .append('svg')
                    .attr("width",that.width)
                    .attr("height",that.height)
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height)
                    .attr("id","svgcontainer")
                    .attr("class","svgcontainer");

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
                        .style("font-size", that.label_size)
                        .attr("text-anchor","middle")
                        .attr("pointer-events","none")
                        .style("font-weight", that.label_weight)
                        .style("font-family", that.label_family);
                        // .transition()
                        // .delay(that.transitions.duration())

                        setTimeout(function(){
                            that.chart_text.text(function (d) { return d.percentValue.toFixed(1)+"%"; })
                                .text(function (d) {
                                    if(this.getBBox().width < (d.percentValue * that.width / 100) && this.getBBox().height < that.percent_row_rect_height) {
                                        return d.percentValue.toFixed(1)+"%"
                                        // return that.k.appendUnits(d.weight);
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
                if(PykCharts.boolean(that.pointer_overflow_enable)) {
                    that.svgContainer.style("overflow","visible");
                }
                    var sum = 0, sum1 = 0;

                    var x, y, w = [];
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
                                .attr("stroke-width", that.pointer_thickness)
                                .attr("stroke", that.pointer_color)
                                // .transition()
                                // .duration(that.transitions.duration())
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

                if(PykCharts.boolean(that.clubdata_enable)) {
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
            that.k.warningHandling(err,"3");
        }

        try {
            if(!_.isNumber(that.radiusPercent)) {
                that.radiusPercent = theme.oneDimensionalCharts.pie_radius_percent;
                throw "pie_radius_percent"
            }
        } 
        catch (err) {
            that.k.warningHandling(err,"3");
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

        d3.json(options.data, function (e, data) {
            that.data = data.groupBy("oned");
            that.compare_data = data.groupBy("oned");
            $(options.selector+" #chart-loader").remove();
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"pie");
            that.clubdata_enable = that.data.length > that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
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
            that.k.warningHandling(err,"3");
        }

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
                throw "donut_inner_radius_percent";
            }
        }
        catch(err) {
            that.k.errorHandling(err,"8");
        }

        if(that.stop) {
            return;
        }

        that.height_translate = that.height/2;
        that.show_total_at_center = options.donut_show_total_at_center ? options.donut_show_total_at_center.toLowerCase() : theme.oneDimensionalCharts.donut_show_total_at_center;


        // that.radiusPercent = options.optional && options.optional.donut && _.isNumber(options.optional.donut.radiusPercent) ? options.optional.donut.radiusPercent : theme.oneDimensionalCharts.donut.radiusPercent;
        // that.innerRadiusPercent = options.optional && options.optional.donut && _.isNumber(options.optional.donut.innerRadiusPercent) && options.optional.donut.innerRadiusPercent ? options.optional.donut.innerRadiusPercent : theme.oneDimensionalCharts.donut.innerRadiusPercent;

        d3.json(options.data, function (e, data) {
            that.data = data.groupBy("oned");
            that.compare_data = data.groupBy("oned");
            $(options.selector+" #chart-loader").remove();
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"donut");
            that.clubdata_enable = that.data.length > that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            pieFunctions.render();
        });
    };
};

PykCharts.oneD.election_pie = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function() {

        that = new PykCharts.oneD.processInputs(that, options, "pie");

        if(options.chart_height) {
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

        that.k.validator()
            .validatingDataType(that.height,"chart_height",that.width/2,"height")
            .validatingDataType(that.radiusPercent,"pie_radius_percent",theme.oneDimensionalCharts.pie_radius_percent);

        if(that.stop) {
            return;
        }

        if(that.radiusPercent > 100) {
            that.radiusPercent = 100;
        }

        that.innerRadiusPercent = 0;

        d3.json(options.data, function (e, data) {
            that.data = data.groupBy("oned");
            that.compare_data = data.groupBy("oned");
            $(options.selector+" #chart-loader").remove();
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"election pie");
            that.clubdata_enable = that.data.length > that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            pieFunctions.render();

        });
    };
};

PykCharts.oneD.election_donut = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function() {
        that = new PykCharts.oneD.processInputs(that, options, "pie");
        if(options.chart_height) {
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

        that.k.validator()
            .validatingDataType(that.height,"chart_height",that.width/2,"height")
            .validatingDataType(that.radiusPercent,"donut_radius_percent",theme.oneDimensionalCharts.donut_radius_percent)
            .validatingDataType(that.innerRadiusPercent,"donut_inner_radius_percent",theme.oneDimensionalCharts.donut_inner_radius_percent);

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
                throw "donut_inner_radius_percent";
            }
        }
        catch(err) {

            that.k.errorHandling(err,"8");
        }

        if(that.stop) {
            return;
        }

        that.show_total_at_center = options.donut_show_total_at_center ? options.donut_show_total_at_center.toLowerCase() : theme.oneDimensionalCharts.donut_show_total_at_center;

        d3.json(options.data, function (e, data) {
            that.data = data.groupBy("oned");
            that.compare_data = data.groupBy("oned");
            $(options.selector+" #chart-loader").remove();
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"election donut");
            that.clubdata_enable = that.data.length> that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
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
            that.data = data.groupBy("oned");
            that.refresh_data = data.groupBy("oned");
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
        });
    };

    //----------------------------------------------------------------------------------------
    // Function to render the chart
    //----------------------------------------------------------------------------------------

    this.render = function() {

        that.count = 1;

        //that.fillChart = new PykCharts.oneD.fillChart(that);
        that.fillChart = new PykCharts.Configuration.fillChart(that);
        that.onHoverEffect = new PykCharts.oneD.mouseEvent(options);
        that.border = new PykCharts.Configuration.border(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

        if(that.mode.toLowerCase() == "default") {

            that.k.title()
                .backgroundColor(that)
                .export(that,"#svgcontainer",type)
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
                .export(that,"#svgcontainer",type)
                    .emptyDiv();
            that.optionalFeatures().svgContainer()
                    .set_start_end_angle()
                    .createChart()
                    .label()
                    .ticks()
                    .centerLabel();

            that.k.tooltip();
        }

        $(document).ready(function () { return that.k.resize(that.svgContainer); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer); });
    };

    //----------------------------------------------------------------------------------------
    // Function to render configuration parameters
    //----------------------------------------------------------------------------------------

    that.optionalFeatures = function () {
        var optional = {
            svgContainer :function () {
                // $(options.selector).css("background-color",that.background_color);

                that.svgContainer = d3.select(that.selector)
                    .append('svg')
                    .attr("width",that.width)
                    .attr("height",function () {
                        return that.height;
                    })
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height)
                    .attr("id","svgcontainer")
                    .attr("class","svgcontainer");
                that.group = that.svgContainer.append("g")
                    .attr("transform","translate("+(that.width/2)+","+that.height_translate+")")
                    .attr("id","pieGroup");

                return this;
            },
            createChart : function () {
                d3.select(that.selector +" #pieGroup").node().innerHTML="";

                if(type.toLowerCase() == "pie" || type.toLowerCase() == "donut") {
                    that.new_data.sort(function (a,b) { return a.weight - b.weight;});
                    var temp = that.new_data.pop();
                    that.new_data.unshift(temp);
                }
                else if(type.toLowerCase() == "election pie" || type.toLowerCase() == "election donut") {
                    that.new_data.sort(function (a,b) { return b.weight - a.weight;});
                }
                that.sum = _.reduce(that.data,function (start,num) { return start+num.weight; },0);

                // that.sorted_weight = _.map(that.new_data,function (d,i) {
                //     return d.weight*100/that.sum;
                // });

                // that.sorted_weight.sort(function (a,b){return a-b;});

                // var proportion =_.map(that.new_data,function (d,i) {
                //     return d.weight*100/that.sum;
                // });
                that.inner_radius = that.k._radiusCalculation(that.innerRadiusPercent,that.calculation);
                that.outer_radius = that.k._radiusCalculation(that.radiusPercent,that.calculation);

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
                    .on('mouseover',function (d) {
                        if(that.mode === "default") {
                            d.data.tooltip = d.data.tooltip || "<table class='PykCharts'><tr><th colspan='3' class='tooltip-heading'>"+d.data.name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.data.weight)+"<td class='tooltip-right-content'>("+((d.data.weight*100)/that.sum).toFixed(2)+"%) </tr></table>";
                            that.onHoverEffect.highlight(options.selector +" "+".pie", this);
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(d.data.tooltip);
                        }
                    })
                    .on('mouseout',function (d) {
                        if(that.mode === "default") {
                            that.onHoverEffect.highlightHide(options.selector +" "+".pie");
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
//                    .attr("d",that.arc); // comment this if u want to enable transition

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


                    //     .transition()
                    //     .delay(function(d, i) {
                        //     if(PykCharts.boolean(that.transition.duration)) {
                        //         return (i * that.transition.duration)/that.new_data.length;
                        //     } else return 0;
                        // });

                    setTimeout(function () {
                        that.chart_text.text(function (d) { return that.k.appendUnits(d.data.weight); })
                            .attr("text-anchor","middle")
                            .attr("pointer-events","none")
                            .text(function (d,i) {
                                if(type.toLowerCase() === "pie" || type.toLowerCase() === "election pie") {
                                    if(this.getBBox().width<((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9))) {
                                        return ((d.data.weight*100)/that.sum).toFixed(1)+"%";
                                        // return that.k.appendUnits(d.data.weight);
                                    }
                                    else {
                                        return "";
                                    }
                                } else {
                                    if((this.getBBox().width < (Math.abs(d.endAngle - d.startAngle)*that.outer_radius*0.9))  && (this.getBBox().height < (((that.outer_radius-that.inner_radius)*0.75)))) {
                                        return ((d.data.weight*100)/that.sum).toFixed(1)+"%";
                                        // return that.k.appendUnits(d.data.weight);
                                    }
                                    else {
                                        return "";
                                    }
                                }
                            })
                            .attr("dy",5)
                            .style("font-weight", that.label_weight)
                            .style("font-size", that.label_size)
                            .attr("fill", that.label_color)
                            .style("font-family", that.label_family);
                        that.chart_text.exit().remove();
                    },that.transitions.duration());

                return this;
            },
            clubData: function () {
                if(PykCharts.boolean(that.clubdata_enable)) {
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
                if(PykCharts.boolean(that.pointer_overflow_enable)) {
                    that.svgContainer.style("overflow","visible");
                }
                var w = [];
                //if(PykCharts.boolean(that.enableTicks)) {
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
                        //.style("visibility","hidden");
                        // .transition()
                        // .delay(function(d, i) {
                        //     if(PykCharts.boolean(that.transition.duration)) {
                        //         return ((i+1) * that.transition.duration)/that.new_data.length;
                        //     } else return 0;
                        // })
                        // .text(function (d,i) {
                        //     if(type.toLowerCase() === "pie" || type.toLowerCase() === "election pie") {
                        //         if(type.toLowerCase() === "pie") {
                        //             w[i] = this.getBBox().height;
                        //             console.log(w[i],((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9)),d.startAngle,d.data.name);
                        //             if(this.getBBox().height < ((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9))) {
                        //                 return d.data.name;
                        //             }
                        //             else {
                        //                 return "";
                        //             }
                        //         } else {
                        //             w[i] =this.getBBox().height;
                        //             if(this.getBBox().height < ((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9))) {
                        //                 return d.data.name;
                        //             }
                        //             else {
                        //                 return "";
                        //             }
                        //         }
                        //     } else {
                        //         if(type.toLowerCase() === "donut") {
                        //             w[i] = this.getBBox().width;
                        //             if(this.getBBox().width < ((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9))) {
                        //                 return d.data.name;
                        //             }
                        //             else {
                        //                 return "";
                        //             }
                        //         } else {
                        //             w[i] = this.getBBox().height;
                        //             if(this.getBBox().height < ((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9))) {
                        //                 return d.data.name;
                        //             }
                        //             else {
                        //                 return "";
                        //             }
                        //         }
                        //     }
                        // })
                        // .style("visibility","visible")

                    setTimeout(function() {
                        tick_label.text(function(d) { return d.data.name; })
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
                            .style("fill",that.pointer_color)
                            .style("font-size",that.pointer_size)
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
                            // if(w[i] >= ((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9))) {
                            //     return 0;
                            // }
                            // else {
                            //        return (that.outer_radius) * (1)* Math.cos((d.startAngle + d.endAngle)/2);
                            // }
                        })
                        .attr("y1", function (d,i) {
                            return (that.outer_radius) * (1) *Math.sin((d.endAngle + d.startAngle )/2);
                            // if(w[i] >= ((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9))) {
                            //     return 0;
                            // }
                            // else {
                            //     return (that.outer_radius) * (1) *Math.sin((d.endAngle + d.startAngle )/2);
                            // }
                        })
                        .attr("x2", function (d,i) {
                            return (that.outer_radius) * (1)* Math.cos((d.startAngle + d.endAngle)/2);
                            // if(w[i] >= ((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9))) {
                            //     return 0;
                            // }
                            // else {
                            //     return (that.outer_radius) * (1)* Math.cos((d.startAngle + d.endAngle)/2);
                            // }
                        })
                        .attr("y2", function (d,i) {
                            return (that.outer_radius) * (1) *Math.sin((d.endAngle + d.startAngle )/2);
                            // if(w[i] >= ((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9))) {
                            //     return 0;
                            // }
                            // else {
                            //     return (that.outer_radius) * (1) *Math.sin((d.endAngle + d.startAngle )/2);
                            // }
                        })
                        // .transition()
                        // .delay(function(d, i) {
                        //     if(PykCharts.boolean(that.transition.duration)) {
                        //         return ((i) * that.transition.duration)/that.new_data.length;
                        //     } else return 0;
                        // })
                        // .duration(that.transitions.duration()/that.new_data.length)

                    setTimeout(function () {
                        tick_line.attr("x2", function (d, i) {
                                return (that.outer_radius/1+12)* (1) * Math.cos((d.startAngle + d.endAngle)/2);
                                // if(w[i] >= ((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9))) {
                                //     return 0;
                                // }
                                // else {
                                //     return (that.outer_radius/1+12)* (1) * Math.cos((d.startAngle + d.endAngle)/2);
                                // }
                            })
                            .attr("y2", function (d, i) {
                                return (that.outer_radius/1+12)* (1) * Math.sin((d.startAngle + d.endAngle)/2);
                                // if(w[i] >= ((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9))) {
                                //     return 0;
                                // }
                                // else {
                                //     return (that.outer_radius/1+12)* (1) * Math.sin((d.startAngle + d.endAngle)/2);
                                // }
                            })
                            .attr("transform","rotate(-90)")
                            .attr("stroke-width", that.pointer_thickness)
                            .attr("stroke",that.pointer_color);
                        tick_line.exit().remove();
                    },that.transitions.duration());
                // }
                return this;
            },
            centerLabel: function () {
                if(PykCharts.boolean(that.show_total_at_center) && (type == "donut" || type == "election donut")) {

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
                    //         return (type == "donut") ? (-0.1*that.inner_radius) : (-0.5*that.inner_radius);
                    //     })
                    //     .attr("font-size",function () {
                    //         return (type == "donut") ? 0.1*that.inner_radius : 0.1*that.inner_radius;
                    //     })
                    //     .style("font-family","'Helvetica Neue',Helvetica,Arial,sans-serif")
                    //     .attr("fill","gray");

                    // displaySum.exit().remove();

                    var h;
                    var label = that.group.selectAll(options.selector +" "+".centerLabel")
                                    .data([that.sum]);

                    label.enter()
                        .append("text");

                    label.attr("class","centerLabel")
                        .text("")
                        // .transition()
                        // .delay( function(d) {
                        //     if(PykCharts.boolean(that.transitions.duration())) {
                        //         return that.transitions.duration();
                        //     }
                        // })
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
                            .attr("font-size",function () {
                                return (type == "donut") ? 0.32*that.inner_radius : 0.2*that.inner_radius;
                            })
                            .style("font-family","'Helvetica Neue',Helvetica,Arial,sans-serif")
                            .attr("fill","#484848");
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
            that.k.warningHandling(err,"3");
        }

        if(that.stop) {
            return;
        }

        if(that.mode === "default") {
           that.k.loading();
        }

        d3.json(options.data, function (e,data) {
			that.data = data.groupBy("oned");
            that.compare_data = data.groupBy("oned");
            $(options.selector+" #chart-loader").remove();
			that.clubdata_enable = that.data.length > that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.render();
		});
        // that.clubData.enable = that.data.length>that.clubData.maximumNodes ? that.clubData.enable : "no";
	};

    this.refresh = function () {
        d3.json (options.data, function (e,data) {
            that.data = data.groupBy("oned");
            that.refresh_data = data.groupBy("oned");
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
        });
    };

	this.render = function () {
//		that.fillChart = new PykCharts.oneD.fillChart(that);
        that.fillChart = new PykCharts.Configuration.fillChart(that);
        that.onHoverEffect = new PykCharts.oneD.mouseEvent(options);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.border = new PykCharts.Configuration.border(that);

        if (that.mode === "default") {
            that.k.title()
                .backgroundColor(that)
                .export(that,"#svgcontainer","pyramid")
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
                // [that.fullscreen]().fullScreen(that)

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

        } else if (that.mode === "infographics") {
            that.new_data = that.data;
            that.k.backgroundColor(that)
                .export(that,"#svgcontainer","pyramid")
                .emptyDiv();
            that.optionalFeatures().svgContainer()
                .createChart()
                .label()
                .ticks();

            that.k.tooltip();
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        }

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
                // $(options.selector).css("background-color",that.background_color);

                that.svgContainer = d3.select(options.selector)
                    .append('svg')
                    .attr("width", that.width) //+200 removed
                    .attr("height",that.height)
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height)
                    .attr("id","svgcontainer")
                    .attr("class","svgcontainer");

                that.group = that.svgContainer.append("g")
                    .attr("id","pyrgrp");

                return this;
            },
        	createChart : function () {


        		// that.perValues = that.percentageValues(that.new_data);

        		that.pyramid = that.pyramidLayout()
                    .data(that.new_data)
                    .size([that.width,that.height]);
                // var total = d3.sum(that.new_data, function (d){
                //     return d.weight;
                // });
		        that.coordinates = that.pyramid.coordinates();
                that.coordinates[0].values[1] = that.coordinates[that.coordinates.length-1].values[1];
                that.coordinates[0].values[2] = that.coordinates[that.coordinates.length-1].values[2];
                var k = that.new_data.length-1,p = that.new_data.length-1,tooltipArray = [];
                for(i=0;i<that.new_data.length;i++){
                    if(i==0) {
                        tooltipArray[i] = that.new_data[i].tooltip || "<table class='PykCharts'><tr><th colspan='3'  class='tooltip-heading'>"+that.new_data[i].name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(that.new_data[i].weight)+"<td class='tooltip-right-content'>("+((that.new_data[i].weight*100)/that.sum).toFixed(2)+"%) </tr></table>";
                    } else {
                        tooltipArray[i] = that.new_data[k].tooltip || "<table class='PykCharts'><tr><th colspan='3'  class='tooltip-heading'>"+that.new_data[k].name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(that.new_data[k].weight)+"<td class='tooltip-right-content'>("+((that.new_data[k].weight*100)/that.sum).toFixed(2)+"%) </tr></table>";
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
        			.on("mouseover", function (d,i) {
                        if(that.mode === "default") {
                            that.onHoverEffect.highlight(options.selector +" "+".pyr-path",this);
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(tooltipArray[i]);
                        }
        			})
        			.on("mouseout", function (d) {
                        if(that.mode === "default") {
                            that.onHoverEffect.highlightHide(options.selector +" "+".pyr-path")
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
                        .style("font-size", that.label_size)
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
                if(PykCharts.boolean(that.pointer_overflow_enable)) {
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
                    .style("font-size",that.pointer_size)
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
                    .attr("stroke-width", that.pointer_thickness)
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

                // }
                return this;
            },
            clubData: function () {

            	if (PykCharts.boolean(that.clubdata_enable)) {
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
        // that.enableText = optional && PykCharts.boolean(optional.enableText) ? optional.enableText : false;
        that.selector = options.selector;
        that.height = options.chart_height ? options.chart_height : that.width;

        try {
            if(!_.isNumber(that.height)) {
                that.height = that.width;
                throw "chart_height"
            }
        } 
        catch (err) {
            that.k.warningHandling(err,"3");
        }

        if(that.stop) {
            return;
        }

        if(that.mode === "default") {
           that.k.loading();
        }

        d3.json(options.data, function (e,data) {
            that.data = data.groupBy("oned");
            that.compare_data = data.groupBy("oned");
            $(options.selector+" #chart-loader").remove();
            that.clubdata_enable = that.data.length>that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.render();
        });
        // that.clubData.enable = that.data.length > that.clubData.maximumNodes ? that.clubData.enable : "no";
    };

    this.refresh = function (){
        d3.json(options.data, function (e,data) {
            that.data = data.groupBy("oned");
            that.refresh_data = data.groupBy("oned");
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

        });
    };

    this.render = function (){

//        that.fillChart = new PykCharts.oneD.fillChart(that);
        that.fillChart = new PykCharts.Configuration.fillChart(that);
        that.onHoverEffect = new PykCharts.oneD.mouseEvent(options);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.border = new PykCharts.Configuration.border(that);

        if(that.mode === "default") {
            that.k.title()
                .backgroundColor(that)
                .export(that,"#svgcontainer","treemap")
                .emptyDiv()
                .subtitle();
        }

        that.k.tooltip();
        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        if(that.mode === "infographics"){
            that.k.backgroundColor(that)
                .export(that,"#svgcontainer","treemap")
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

        $(document).ready(function () { return that.k.resize(that.svgContainer); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer); });
    };

    this.optionalFeatures = function (){
        var optional = {
            svgContainer: function () {
                // $(options.selector).css("background-color",that.background_color);

                that.svgContainer = d3.select(that.selector).append("svg:svg")
                    .attr("width",that.width)
                    .attr("height",that.height)
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height)
                    .attr("id","svgcontainer")
                    .attr("class","svgcontainer");

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
                // that.max = that.new_data.children[l-1].weight;
                // that.map1 = that.new_data.children.map(function (d) { return d.weight; });
                // that.map1 = jQuery.unique(that.map1);
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
                    .on('mouseover',function (d) {
                        if(!d.children && that.mode === "default") {
                            d.tooltip = d.tooltip || "<table class='PykCharts'><tr><th colspan='2' class='tooltip-heading'>"+d.name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.weight)+"<td class='tooltip-right-content'>("+((d.weight*100)/that.sum).toFixed(2)+"%)</tr></table>";
                            that.onHoverEffect.highlight(options.selector +" "+".treemap-rect", this);
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(d.tooltip);
                        }
                    })
                    .on('mouseout',function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipHide(d);
                            that.onHoverEffect.highlightHide(options.selector +" "+".treemap-rect");
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
                        .style("font-size", that.label_size)
                        .attr("fill", that.label_color)
                        .style("font-family", that.label_family)

                        .text("")
                        // .transition()
                        // .delay(that.transitions.duration())

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
                        .style("font-size", that.label_size)
                        .attr("fill", that.label_color)
                        .style("font-family", that.label_family)
                        .text("")
                        .attr("pointer-events","none")
                        // .transition()
                        // .delay(that.transitions.duration())

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

                if(PykCharts.boolean(that.clubdata_enable)){
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

// PykCharts.other.fillChart = function (options) {

//     var colorPie = {
//         chart_color: function (d) {
//             if(d.highlight === true) {
//                 return options.highlight_color;
//             } else{
//                 return options.chart_color;
//             }
//         }
//     };
//     return colorPie;
// };

// PykCharts.other.mouseEvent = function (options) {
//     var highlight_selected = {
//         highlight: function (selectedclass, that) {
//                 var t = d3.select(that);
//                 d3.selectAll(selectedclass)
//                     .attr("opacity",.5)
//                 t.attr("opacity",1);
//                 return this;
//         },
//         highlightHide : function (selectedclass) {
//                 d3.selectAll(selectedclass)
//                     .attr("opacity",1);
//             return this;
//         }
//     }
//     return highlight_selected;
// }

PykCharts.other.processInputs = function (chartObject, options) {

    var theme = new PykCharts.Configuration.Theme({})
        , stylesheet = theme.stylesheet
        , functionality = theme.functionality
        , otherCharts = theme.otherCharts;

    chartObject.selector = options.selector ? options.selector : stylesheet.selector;
    if(options.chart_width) {
        var targetWidth = $(options.selector).width();
        options.chart_width = targetWidth < options.chart_width ? targetWidth : options.chart_width;
    }
    chartObject.width = options.chart_width  ? options.chart_width : stylesheet.chart_width;
    // chartObject.height = options.chart_height && _.isNumber(options.chart_height) ? options.chart_height : stylesheet.chart_height;
    // chartObject.width = optional && optional.chart && _.isNumber(optional.chart.width) ? optional.chart.width : stylesheet.chart.width;
    // chartObject.height = optional && optional.chart &&_.isNumber(optional.chart.height) ? optional.chart.height : stylesheet.chart.height;

    chartObject.mode = options.mode ? options.mode.toLowerCase(): stylesheet.mode;

    if (options &&  PykCharts.boolean (options.title_text)) {
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

    if (options && PykCharts.boolean(options.subtitle_text)) {
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
    // chartObject.credit_my_site_name = options.credit_my_site_name ? options.credit_my_site_name : stylesheet.credit_my_site_name;
    // chartObject.credit_my_site_url = options.credit_my_site_url ? options.credit_my_site_url : stylesheet.credit_my_site_url;
    chartObject.data_source_name = options.data_source_name ? options.data_source_name : "";
    chartObject.data_source_url = options.data_source_url ? options.data_source_url : "";
    
    chartObject.transition_duration = options.transition_duration ? options.transition_duration : functionality.transition_duration;
    
    chartObject.background_color = options.background_color ? options.background_color.toLowerCase() : stylesheet.background_color;
    
    chartObject.fullscreen_enable = options.fullscreen_enable ? options.fullscreen_enable : stylesheet.fullscreen_enable;
    chartObject.loading = options.loading_gif_url ? options.loading_gif_url: stylesheet.loading_gif_url;
    
    chartObject.export_enable = options.export_enable ? options.export_enable.toLowerCase() : stylesheet.export_enable;
    // chartObject.export_image_url = options.export_image_url ? options.export_image_url : stylesheet.export_image_url; 
    chartObject.k = new PykCharts.Configuration(chartObject);

    chartObject.k.validator().validatingSelector(chartObject.selector.substring(1,chartObject.selector.length))
                .validatingChartMode(chartObject.mode)
                .validatingDataType(chartObject.width,"chart_width")
                .validatingDataType(chartObject.title_size,"title_size")
                .validatingDataType(chartObject.subtitle_size,"subtitle_size")
                .validatingDataType(chartObject.transition_duration,"transition_duration")
                .validatingFontWeight(chartObject.title_weight,"title_weight")
                .validatingFontWeight(chartObject.subtitle_weight,"subtitle_weight")
                .validatingColor(chartObject.background_color,"background_color")                                                              

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
        that.current_count_color = options.pictograph_current_count_color ? options.pictograph_current_count_color.toLowerCase() : otherCharts.pictograph_current_count_color;
        that.current_count_weight = options.pictograph_current_count_weight ? options.pictograph_current_count_weight.toLowerCase() : otherCharts.pictograph_current_count_weight;
        that.current_count_family = options.pictograph_current_count_family ? options.pictograph_current_count_family.toLowerCase() : otherCharts.pictograph_current_count_family;
        that.total_count_size = options.pictograph_total_count_size ? options.pictograph_total_count_size : otherCharts.pictograph_total_count_size;
        that.total_count_color = options.pictograph_total_count_color ? options.pictograph_total_count_color.toLowerCase() : otherCharts.pictograph_total_count_color;
        that.total_count_weight = options.pictograph_total_count_weight ? options.pictograph_total_count_weight.toLowerCase() : otherCharts.pictograph_total_count_weight;
        that.total_count_family = options.pictograph_total_count_family ? options.pictograph_total_count_family.toLowerCase() : otherCharts.pictograph_total_count_family;
        that.imageWidth =  options.pictograph_image_width ? options.pictograph_image_width : otherCharts.pictograph_image_width;
        that.imageHeight = options.pictograph_image_height ? options.pictograph_image_height : otherCharts.pictograph_image_height;
        that.height = options.chart_height ? options.chart_height : that.width;

        that.k.validator()
            .validatingDataType(that.height,"chart_height")
            .validatingDataType(that.imgperline,"pictograph_image_per_line")
            .validatingDataType(that.imageWidth,"pictograph_image_width")
            .validatingDataType(that.imageHeight,"pictograph_image_height")
            .validatingDataType(that.current_count_size,"pictograph_current_count_size")
            .validatingColor(that.total_count_color,"pictograph_total_count_color")                                                              
            .validatingColor(that.current_count_color,"pictograph_current_count_color")           

        if(that.stop) {
            return;
        }
        
        if(that.mode === "default") {
           that.k.loading();
        }
        d3.json(options.data, function (e,data) {
            that.data = data.sort(function(a,b) {
                return b.weight - a.weight;
            });
            $(options.selector+" #chart-loader").remove();
            that.render();
        })
    };

    this.render = function () {

        that.transitions = new PykCharts.Configuration.transition(that);

        if(that.mode==="default") {
            that.k.title()
                .backgroundColor(that)
                .export(that,"#svgcontainer","pictograph")
                .emptyDiv()
                .subtitle();
        } else {
            that.k.backgroundColor(that)
                .export(that,"#svgcontainer","pictograph")
                .emptyDiv();
        }
           
        that.optionalFeatures()
                .svgContainer()
                .createChart()
                .labelText()
                .enableLabel();
        if(that.mode==="default") {
            that.k.createFooter()
                .credits()
                .dataSource();
        }

        $(window).on("load", function () { return that.k.resize(that.svgContainer); })
                            .on("resize", function () { return that.k.resize(that.svgContainer); });
    };

    this.optionalFeatures = function () {

        var optional = {
            svgContainer: function () {
                // $(options.selector).css("background-color",that.background_color);

                that.svgContainer = d3.select(options.selector).append('svg')
                    .attr("width",that.width)
                    .attr("height",that.height)
                    .attr("id","svgcontainer")
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height);

                that.group = that.svgContainer.append("g")
                    // .attr("transform", "translate(100,0)")
                    .attr("transform", "translate(" + that.imageWidth + ",0)");

                that.group1 = that.svgContainer.append("g")
                    .attr("transform","translate(0,0)");

                return this;
            },
            createChart: function () {
                var a = 0,b=1;

                that.optionalFeatures().showTotal();
                var counter = 0;
                for(var j=1; j<=that.weight; j++) {
                    if(j <= that.data[1].weight ) {
                        that.group.append("image")
                            .attr("xlink:href",that.data[1]["image"])
                            // .attr("x", b *(50 + 1))
                            // .attr("y", a *(100 + 10))
                            .attr("x", b *(that.imageWidth + 1))
                            .attr("y", a *(that.imageHeight + 10))
                            .attr("width",0)
                            // .attr("height",100)
                            .attr("height", that.imageHeight + "px")
                            .transition()
                            .duration(that.transitions.duration())
                            .attr("width", that.imageWidth + "px");
                    }else {
                        that.group.append("image")
                            .attr("xlink:href",that.data[0]["image"])
                            .attr("x", b *(that.imageWidth + 1))
                            .attr("y", a *(that.imageHeight+ 10))
                            // .attr("x", b *(50 + 1))
                            // .attr("y", a *(100 + 10))
                            .attr("width",0)
                            // .attr("height",100)
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
            showTotal: function () {
                 if (PykCharts.boolean(that.showTotal)) {
                    that.weight = that.data[0].weight;
                }
                else {
                    that.weight = that.data[1].weight;
                }
                return this ;
            },
            enableLabel: function () {
                if (PykCharts.boolean(that.enableTotal)) {
                    var y_pos =  ((that.data[0].weight)/(that.imgperline));
                    var textHeight;
                     this.labelText();
                     that.group1.append("text")
                        .attr("font-family",that.total_count_family)
                        .attr("font-size",that.total_count_size)
                        .attr("font-weight",that.total_count_weight)
                        .attr("fill",that.total_count_color)
                        .text("/"+that.data[0].weight)
                        .text(function () {
                            textHeight =this.getBBox().height;
                            return "/"+that.data[0].weight;
                        })
                        .attr("x", (that.textWidth+5))
                        .attr("y", function () { return (((that.imageHeight * y_pos)/2) + (textHeight/2)); });
                }
                return this;
            },
            labelText: function () {
                if (PykCharts.boolean(that.enableCurrent)) {
                    var y_pos =  ((that.data[0].weight)/(that.imgperline));
                    var textHeight;
                    that.group1.append("text")
                        .attr("x", 0)
                        .attr("font-family",that.current_count_family)
                        .attr("font-size",that.current_count_size)
                        .attr("font-weight",that.current_count_weight)
                        .attr("fill",that.current_count_color)
                        .text(that.data[1].weight)
                        .text(function () {
                            textHeight =this.getBBox().height;
                            that.textWidth = this.getBBox().width;
                            return that.data[1].weight;
                        })
                        .attr("y", function () { return (((that.imageHeight * y_pos)/2)+ (textHeight/2)); });

                }
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
        checkChangeInData: function (data, compare_data) { // this function checks if the data in json has been changed
            var key1 = Object.keys(compare_data[0]);
            var key2 = Object.keys(data[0]);
            var changed = false;
            that.data = data.groupBy("oned");
            if(key1.length === key2.length && compare_data.length === data.length) {
                for(i=0;i<data.length;i++) {
                    for(j=0;j<key1.length;j++){
                        if(data[i][key2[j]] !== compare_data[i][key1[j]] || key1[j] !== key2[j]) {
                            changed = true;
                            break;
                        }
                    }
                }
            } else {
                changed = true;
            }
            that.compare_data = data;
            return [that.compare_data, changed];
        },
        opacity : function (d,weight,data) {
            if(!(PykCharts.boolean(options.variable_circle_size_enable))) {
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
            // console.log(data,"data");
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
                    if(options.chart_color) {
                        checkGroup = false;
                        item.color = options.chart_color[0];
                    }else if(item.color) {
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
                        if(options.chart_color.length !== 0 && PykCharts.boolean(options.chart_color[k])) {
                            item.color = options.chart_color[k];
                        }else if(item.color) {
                            item.color = item.color;
                        } else {
                            item.color = options.default_color;
                        }
                        if(i<data.length-2 &&item.group !== data[i+1].group) {
                            k++;
                        }
                        newarr.push(item);
                    } else {
                        if(i<data.length-2 &&item.group !== data[i+1].group) {
                            k++;
                        }
                    }
                    i++;
                });
                k=0;i=0;
                data.forEach(function(item) {
                    if(!unique[item.group]) {
                        unique[item.group] = item;
                        if(options.chart_color.length !== 0 && PykCharts.boolean(options.chart_color[k])) {
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
                // console.log(arr,checkGroup,"before return");
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
        if(d && PykCharts.boolean(options.variable_circle_size_enable)) {
            var z = d3.scale.linear()
                        .domain(d3.extent(data,function (d) {
                            return d.weight;
                        }))
                        .range(rad_range);
            return z(d);
        } else {
            // console.log("Same Radius >>> ",options.bubbleRadius,options.selector);
            return options.bubbleRadius;
        }
    };
    return size;
};

PykCharts.multiD.processInputs = function (chartObject, options) {

    var theme = new PykCharts.Configuration.Theme({}),
        stylesheet = theme.stylesheet,
        functionality = theme.functionality,
        multiDimensionalCharts = theme.multiDimensionalCharts,
        optional = options.optional;

    chartObject.assets_location = options.pykih_charts_assets_location ? options.pykih_charts_assets_location : stylesheet.pykih_charts_assets_location;

    // chartObject.axis_y_data_format = options.axis_y_data_format ? options.axis_y_data_format : multiDimensionalCharts.axis_y_data_format;
    // chartObject.axis_x_data_format = options.axis_x_data_format ? options.axis_x_data_format : multiDimensionalCharts.axis_x_data_format;
    chartObject.selector = options.selector ? options.selector : "body";
    chartObject.panels_enable = options.panels_enable ? options.panels_enable.toLowerCase() : multiDimensionalCharts.panels_enable;
    // if(options.chart_width && !PykCharts.boolean(chartObject.panels_enable)) {
    //     var targetWidth = $(options.selector).width();
    //     options.chart_width = targetWidth < options.chart_width ? targetWidth : options.chart_width;
    // }
    chartObject.width = options.chart_width ? options.chart_width : stylesheet.chart_width;
    chartObject.height = options.chart_height ? options.chart_height : stylesheet.chart_height;

    chartObject.margin_left = options.chart_margin_left  ? options.chart_margin_left : stylesheet.chart_margin_left;
    chartObject.margin_right = options.chart_margin_right  ? options.chart_margin_right : stylesheet.chart_margin_right;
    chartObject.margin_top = options.chart_margin_top  ? options.chart_margin_top : stylesheet.chart_margin_top;
    chartObject.margin_bottom = options.chart_margin_bottom  ? options.chart_margin_bottom : stylesheet.chart_margin_bottom;

    chartObject.grid_x_enable = options.chart_grid_x_enable ? options.chart_grid_x_enable.toLowerCase() : multiDimensionalCharts.chart_grid_x_enable;
    chartObject.grid_y_enable = options.chart_grid_y_enable ? options.chart_grid_y_enable.toLowerCase() : multiDimensionalCharts.chart_grid_y_enable;
    chartObject.grid_color = options.chart_grid_color ? options.chart_grid_color.toLowerCase() : multiDimensionalCharts.chart_grid_color;
    chartObject.mode = options.mode ? options.mode.toLowerCase() : "default";
    chartObject.color_mode = options.color_mode ? options.color_mode.toLowerCase() : stylesheet.color_mode;

    if (options &&  PykCharts.boolean (options.title_text)) {
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

    if (options && PykCharts.boolean(options.subtitle_text)) {
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
    chartObject.axis_onhover_hightlight_enable = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_onhover_hightlight_enable ? options.axis_onhover_hightlight_enable.toLowerCase() : multiDimensionalCharts.axis_onhover_hightlight_enable;
    chartObject.axis_x_title = options.axis_x_title ? options.axis_x_title : stylesheet.axis_x_title;
    chartObject.axis_x_pointer_position = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_pointer_position ? options.axis_x_pointer_position.toLowerCase(): stylesheet.axis_x_pointer_position;
    chartObject.axis_x_position = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_position ? options.axis_x_position.toLowerCase() : stylesheet.axis_x_position;
    chartObject.axis_x_line_color = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_line_color ? options.axis_x_line_color : stylesheet.axis_x_line_color;
    // chartObject.axis_x_label_color = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_label_color ? options.axis_x_label_color.toLowerCase() : stylesheet.axis_x_label_color;

    chartObject.axis_x_no_of_axis_value = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_no_of_axis_value ? options.axis_x_no_of_axis_value : stylesheet.axis_x_no_of_axis_value;
    chartObject.axis_x_pointer_padding = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_pointer_padding ? options.axis_x_pointer_padding : stylesheet.axis_x_pointer_padding;

    chartObject.axis_x_pointer_length = "axis_x_pointer_length" in options && PykCharts.boolean(chartObject.axis_x_enable) ? options.axis_x_pointer_length : stylesheet.axis_x_pointer_length;
    chartObject.axis_x_value_format = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_value_format ? options.axis_x_value_format : stylesheet.axis_x_value_format;

    chartObject.axis_x_pointer_values = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_pointer_values ? options.axis_x_pointer_values : stylesheet.axis_x_pointer_values;
    chartObject.axis_x_outer_pointer_size = "axis_x_outer_pointer_size" in options && PykCharts.boolean(chartObject.axis_x_enable) ? options.axis_x_outer_pointer_size : stylesheet.axis_x_outer_pointer_size;
    chartObject.axis_x_time_value_datatype = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_time_value_datatype ? options.axis_x_time_value_datatype.toLowerCase() : stylesheet.axis_x_time_value_datatype;
    chartObject.axis_x_time_value_interval = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_time_value_interval ? options.axis_x_time_value_interval : stylesheet.axis_x_time_value_interval;

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
    chartObject.axis_y_pointer_position = PykCharts.boolean(chartObject.axis_y_enable) && options.axis_y_pointer_position ? options.axis_y_pointer_position.toLowerCase() : multiDimensionalCharts.axis_y_pointer_position;
    chartObject.axis_y_position = PykCharts.boolean(chartObject.axis_y_enable) && options.axis_y_position ? options.axis_y_position.toLowerCase(): multiDimensionalCharts.axis_y_position;
    chartObject.axis_y_line_color = PykCharts.boolean(chartObject.axis_y_enable) && options.axis_y_line_color ? options.axis_y_line_color : multiDimensionalCharts.axis_y_line_color;
    // chartObject.axis_y_label_color = PykCharts.boolean(chartObject.axis_y_enable) && options.axis_y_label_color ? options.axis_y_label_color.toLowerCase() : multiDimensionalCharts.axis_y_label_color;

    chartObject.axis_y_no_of_axis_value = PykCharts.boolean(chartObject.axis_y_enable) && options.axis_y_no_of_axis_value ? options.axis_y_no_of_axis_value : multiDimensionalCharts.axis_y_no_of_axis_value;
    chartObject.axis_y_pointer_padding = PykCharts.boolean(chartObject.axis_y_enable) && options.axis_y_pointer_padding ? options.axis_y_pointer_padding : multiDimensionalCharts.axis_y_pointer_padding;

    chartObject.axis_y_pointer_length = "axis_y_pointer_length" in options && PykCharts.boolean(chartObject.axis_y_enable) ? options.axis_y_pointer_length : multiDimensionalCharts.axis_y_pointer_length;
    chartObject.axis_y_value_format = PykCharts.boolean(chartObject.axis_y_enable) && options.axis_y_value_format ? options.axis_y_value_format : multiDimensionalCharts.axis_y_value_format;
    chartObject.axis_y_pointer_values = PykCharts.boolean(chartObject.axis_y_enable) && options.axis_y_pointer_values ? options.axis_y_pointer_values : multiDimensionalCharts.axis_y_pointer_values;
    chartObject.axis_y_outer_pointer_size = "axis_y_outer_pointer_size" in options && PykCharts.boolean(chartObject.axis_y_enable) ? options.axis_y_outer_pointer_size : multiDimensionalCharts.axis_y_outer_pointer_size;
    chartObject.axis_y_time_value_datatype = PykCharts.boolean(chartObject.axis_y_enable) && options.axis_y_time_value_datatype ? options.axis_y_time_value_datatype.toLowerCase(): multiDimensionalCharts.axis_y_time_value_datatype;
    chartObject.axis_y_time_value_interval = PykCharts.boolean(chartObject.axis_y_enable) && options.axis_y_time_value_interval ? options.axis_y_time_value_interval : multiDimensionalCharts.axis_y_time_value_interval;

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
    // chartObject.credit_my_site_name = options.credit_my_site_name ? options.credit_my_site_name : stylesheet.credit_my_site_name;
    // chartObject.credit_my_site_url = options.credit_my_site_url ? options.credit_my_site_url : stylesheet.credit_my_site_url;
    chartObject.data_source_name = options.data_source_name ? options.data_source_name : "";
    chartObject.data_source_url = options.data_source_url ? options.data_source_url : "";

    chartObject.background_color = options.background_color ? options.background_color : stylesheet.background_color;

    chartObject.chart_color = options.chart_color ? options.chart_color : [];
    chartObject.default_color = stylesheet.chart_color;
    chartObject.highlight_color = options.highlight_color ? options.highlight_color : stylesheet.highlight_color;
    chartObject.saturation_color = options.saturation_color ? options.saturation_color : stylesheet.saturation_color;

    chartObject.fullscreen_enable = options.fullscreen_enable ? options.fullscreen_enable : stylesheet.fullscreen_enable;
    chartObject.loading = options.loading_gif_url ? options.loading_gif_url: stylesheet.loading_gif_url;
    chartObject.real_time_charts_refresh_frequency = options.real_time_charts_refresh_frequency ? options.real_time_charts_refresh_frequency : functionality.real_time_charts_refresh_frequency;
    chartObject.real_time_charts_last_updated_at_enable = options.real_time_charts_last_updated_at_enable ? options.real_time_charts_last_updated_at_enable.toLowerCase() : functionality.real_time_charts_last_updated_at_enable;

    chartObject.transition_duration = options.transition_duration ? options.transition_duration : functionality.transition_duration;
    // chartObject.saturationEnable = options.saturation_enable ? options.saturation_enable : "no";

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

    chartObject.annotation_enable = options.annotation_enable ? options.annotation_enable : multiDimensionalCharts.annotation_enable;
    chartObject.annotation_view_mode = options.annotation_view_mode ? options.annotation_view_mode : multiDimensionalCharts.annotation_view_mode;
    chartObject.annotation_background_color = options.annotation_background_color ? options.annotation_background_color : multiDimensionalCharts.annotation_background_color;
    chartObject.annotation_border_color = options.annotation_border_color ? options.annotation_border_color : multiDimensionalCharts.annotation_border_color;
    chartObject.annotation_font_color = options.annotation_font_color ? options.annotation_font_color : multiDimensionalCharts.annotation_font_color;

    chartObject.legends_enable = options.legends_enable ? options.legends_enable.toLowerCase() : stylesheet.legends_enable;
    chartObject.legends_display = options.legends_display ? options.legends_display.toLowerCase() : stylesheet.legends_display;
    chartObject.legends_text_size = options.legends_text_size ? options.legends_text_size : stylesheet.legends_text_size;
    chartObject.legends_text_color = options.legends_text_color ? options.legends_text_color : stylesheet.legends_text_color;

    chartObject.legends_text_weight = options.legends_text_weight ? options.legends_text_weight.toLowerCase() : stylesheet.legends_text_weight;
    chartObject.legends_text_family = options.legends_text_family ? options.legends_text_family.toLowerCase() : stylesheet.legends_text_family;
    chartObject.highlight = options.highlight ? options.highlight : stylesheet.highlight;
    chartObject.variable_circle_size_enable = options.variable_circle_size_enable ? options.variable_circle_size_enable : multiDimensionalCharts.variable_circle_size_enable;
    // chartObject.units = options.units ? options.units : false;
    // chartObject.colorPalette = ["#b2df8a", "#1f78b4", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928", "#a6cee3"];
    chartObject.export_enable = options.export_enable ? options.export_enable.toLowerCase() : stylesheet.export_enable;
    // chartObject.export_image_url = options.export_image_url ? options.export_image_url : stylesheet.export_image_url;
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
                .validatingDataType(chartObject.axis_x_outer_pointer_size,"axis_x_outer_pointer_size",stylesheet.axis_x_outer_pointer_size)
                .validatingDataType(chartObject.axis_y_outer_pointer_size,"axis_y_outer_pointer_size",multiDimensionalCharts.axis_y_outer_pointer_size)
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
                                // .validatingDataType(,"");
    return chartObject;
};

PykCharts.multiD.lineChart = function (options){
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
		that.crosshair_enable = options.crosshair_enable ? options.crosshair_enable.toLowerCase() : multiDimensionalCharts.crosshair_enable;
		that.curvy_lines = options.curvy_lines_enable ? options.curvy_lines_enable.toLowerCase() : multiDimensionalCharts.curvy_lines_enable;
		that.interpolate = PykCharts.boolean(that.curvy_lines) ? "cardinal" : "linear";

	    d3.json(options.data, function (e, data) {
			that.data = data.groupBy("line");
			that.axis_y_data_format = "number";
    		that.axis_x_data_format = options.axis_x_data_format ? options.axis_x_data_format.toLowerCase() : that.k.xAxisDataFormatIdentification(that.data);
			that.compare_data = that.data;
			that.data_length = that.data.length;
			that.dataTransformation();
			$(that.selector+" #chart-loader").remove();
			that.render();
		});
	};

	this.dataTransformation = function () {
		that.group_arr = [], that.color_arr = [], that.new_data = []/*, that.dataLineGroup = []*/,

		that.ticks = [];

		for(j = 0;j < that.data_length;j++) {
			that.group_arr[j] = that.data[j].name;
		}
		that.uniq_group_arr = that.group_arr.slice();
		that.uniq_color_arr = [];
		$.unique(that.uniq_group_arr);
		var len = that.uniq_group_arr.length;
		for (k = 0;k < len;k++) {
			if(that.chart_color[k]) {
				that.uniq_color_arr[k] = that.chart_color[k];
			} else {
				for (l = 0;l < that.data_length;l++) {
					if (that.uniq_group_arr[k] === that.data[l].name && that.data[l].color) {
						that.uniq_color_arr[k] = that.data[l].color;
						break;
					}
				} if(!PykCharts.boolean(that.uniq_color_arr[k])) {
					that.uniq_color_arr[k] = that.default_color[0];
				}
			}
		}
		that.flag = 0;
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
						tooltip: that.data[l].tooltip,
						annotation: that.data[l].annotation || ""
					});
				}
			}
		}
		that.new_data_length = that.new_data.length;
	};

	this.render = function () {
		that.dataLineGroup = [],that.clicked;
		that.multid = new PykCharts.multiD.configuration(that);
		that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);
		that.transitions = new PykCharts.Configuration.transition(that);
		if(that.mode === "default") {

			that.k.title();

			if(PykCharts.boolean(that.panels_enable)) {

				that.k.backgroundColor(that)
					.export(that,"svg-","lineChart",that.panels_enable,that.new_data)
					.emptyDiv()
					.subtitle();

				that.w = that.width/3;
                that.height = that.height/2;
                that.reducedWidth = that.w - that.margin_left - that.margin_right;
				that.reducedHeight = that.height - that.margin_top - that.margin_bottom;
				that.fill_data = [];
				for(i=0;i<that.new_data_length;i++) {
					that.k.liveData(that)
							.makeMainDiv(that.selector,i)
							.tooltip(true,that.selector,i);

					that.new_data1 = that.new_data[i];
					that.fill_data[0] = that.new_data1;
					that.optionalFeature()
							.chartType()
							.svgContainer(i)
							.createGroups(i);
					that.k.crossHair(that.svgContainer,1,that.fill_data,that.fillColor);
					that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

					that.optionalFeature()
							.createChart(null,i)
							.ticks(i)
							.axisContainer();

					that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain)
							.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain)
							.yGrid(that.svgContainer,that.group,that.yScale)
							.xGrid(that.svgContainer,that.group,that.xScale)
							.xAxisTitle(that.xGroup)
							.yAxisTitle(that.yGroup);

					if((i+1)%4 === 0 && i !== 0) {
                        that.k.emptyDiv();
                    }
				}
				that.k.emptyDiv();
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
						.chartType()
						.svgContainer(1)
						.createGroups(1)
						.hightLightOnload();

				that.k.crossHair(that.svgContainer,that.new_data_length,that.new_data,that.fillColor);
				that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

				that.optionalFeature()
						.createChart()
						.ticks()
						.axisContainer();

				that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain)
						.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain)
						.yGrid(that.svgContainer,that.group,that.yScale)
						.xGrid(that.svgContainer,that.group,that.xScale)
						.xAxisTitle(that.xGroup)
						.yAxisTitle(that.yGroup);
			}
			that.k.createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();
            if(PykCharts.boolean(that.annotation_enable)) {
            	that.annotation();
            }
		}
		else if(that.mode === "infographics") {
			if(PykCharts.boolean(that.panels_enable)) {

				that.k.backgroundColor(that)
					.export(that,"#svg-","lineChart",that.panels_enable,that.new_data)
					.emptyDiv();

				that.w = that.width/3;
                that.height = that.height/2;
                that.reducedWidth = that.w - that.margin_left - that.margin_right;
				that.reducedHeight = that.height - that.margin_top - that.margin_bottom;
				that.fill_data = [];
				for(i=0;i<that.new_data_length;i++) {
					that.new_data1 = that.new_data[i];
					that.fill_data[0] = that.new_data1;
					that.k.makeMainDiv(that.selector,i)
					that.optionalFeature()
							.chartType()
							.svgContainer(i)
							.createGroups(i)
							.createChart(null,i)
							.ticks(i)
							.axisContainer();

					that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain)
							.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain)
							.xAxisTitle(that.xGroup)
							.yAxisTitle(that.yGroup);

					if((i+1)%4 === 0 && i !== 0) {
                        that.k.emptyDiv();
                    }
				}
				that.k.emptyDiv();
			} else {

				that.k.backgroundColor(that)
					.export(that,"#svg-0","lineChart")
					.emptyDiv();

				that.w = that.width;
				that.reducedWidth = that.w - that.margin_left - that.margin_right;
				that.reducedHeight = that.height - that.margin_top - that.margin_bottom;

				that.k.makeMainDiv(that.selector,1)
				that.optionalFeature()
						.chartType()
						.svgContainer(1)
						.createGroups(1)
						.hightLightOnload()
						.createChart()
						.ticks()
						.axisContainer();

				that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain)
						.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain)
						.xAxisTitle(that.xGroup)
						.yAxisTitle(that.yGroup);


			}
		}
		if(!PykCharts.boolean(that.panels_enable)) {
            $(document).ready(function () { return that.k.resize(that.svgContainer,"yes"); })
            $(window).on("resize", function () { return that.k.resize(that.svgContainer,"yes"); });
        } else {
        	$(document).ready(function () { return that.k.resize(null); })
            $(window).on("resize", function () { return that.k.resize(null); });
        }
	};

	this.refresh = function () {
		d3.json(options.data, function (e,data) {
			that.data = data.groupBy("line");
			that.data_length = that.data.length;
			// that.transition_duration = 0;
			var compare = that.multid.checkChangeInData(that.data,that.compare_data);
			that.compare_data = compare[0];
			var data_changed = compare[1];
			that.dataTransformation();

			if(data_changed) {
				that.k.lastUpdatedAt("liveData");
				that.mouseEvent.tooltipHide(null,that.panels_enable,that.type);
				that.mouseEvent.crossHairHide(that.type);
				that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
				that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
			}

			that.optionalFeature().hightLightOnload()
				.createChart("liveData")
				.ticks();

			that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain)
					.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain)
					.yGrid(that.svgContainer,that.group,that.yScale)
					.xGrid(that.svgContainer,that.group,that.xScale)

			if(PykCharts.boolean(that.annotation_enable)) {
				that.annotation();
			}
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

				// $(that.selector).css({"background-color":that.bg,"position":"relative"});

				that.svgContainer = d3.select(that.selector+" #tooltip-svg-container-"+i)
					.append("svg:svg")
					.attr("id","svg-" + i)
					.attr("width",that.w)
					.attr("height",that.height)
					.attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.w + " " + that.height);
                // console.log(that.svgContainer);
				// var x = $(that.selector).colourBrightness(bg);

				// console.log("after appending the class light/dark");

				return this;
			},
			createGroups : function (i) {
				that.group = that.svgContainer.append("g")
					.attr("id","chartsvg")
					.attr("transform","translate("+ that.margin_left +","+ that.margin_top +")");

				if(PykCharts.boolean(that.grid_y_enable)){
					that.group.append("g")
						.attr("id","ygrid")
						.attr("class","y grid-line");
				}
				if(PykCharts.boolean(that.grid_x_enable)){
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
			createChart : function (evt,index) {

				var x_domain,x_data = [],y_data,y_range,x_range,y_domain;

				if(that.axis_y_data_format === "number") {
					max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return k.y; }); });
					min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return k.y; }); });
		         	y_domain = [min,max];
			        y_data = that.k._domainBandwidth(y_domain,2);
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
			        y_range = [that.reducedHeight, 0];
			        that.yScale = that.k.scaleIdentification("time",y_data,y_range);
	      		}
	      		that.xdomain = [];
			    if(that.axis_x_data_format === "number") {
			      	max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return k.x; }); });
					min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return k.x; }); });
		         	x_domain = [min,max];
		        	x_data = that.k._domainBandwidth(x_domain,2);
		          	x_range = [0 ,that.reducedWidth];
		          	that.xScale = that.k.scaleIdentification("linear",x_data,x_range);
		          	that.extra_left_margin = 0;
		          	that.ydomain = that.yScale.domain();

		        } else if(that.axis_x_data_format === "string") {
		          	that.new_data[0].data.forEach(function(d) { x_data.push(d.x); });
		          	x_range = [0 ,that.reducedWidth];
		          	that.xScale = that.k.scaleIdentification("ordinal",x_data,x_range,0);
		          	that.extra_left_margin = (that.xScale.rangeBand() / 2);
		          	that.xdomain = that.xScale.domain();

		        } else if (that.axis_x_data_format === "time") {
		        	max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return new Date(k.x); }); });
					min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return new Date(k.x); }); });
		         	x_data = [min,max];
		          	x_range = [0 ,that.reducedWidth];
		          	that.xScale = that.k.scaleIdentification("time",x_data,x_range);
		          	for(i = 0;i<that.new_data_length;i++) {
			          	that.new_data[i].data.forEach(function (d) {
				          	d.x = new Date(d.x);
			          	});
			          	that.data.forEach(function (d) {
				          	d.x = new Date(d.x);
				          	that.xdomain.push(d.x);
		          		});
			        }
			        // console.log(that.new_data[0].data[2].x);
		          	that.extra_left_margin = 0;
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

				if(PykCharts.boolean(that.zoom_enable) && (that.mode === "default")) {
					if(PykCharts.boolean(that.panels_enable)){
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

				// Code for Live Data
			  	if(evt === "liveData") {
					if(!PykCharts.boolean(that.panels_enable)) {

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
				      					that.highlightLine(that.selected,null);
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
					} else {
						type = that.type + that.svgContainer.attr("id");

						for(var i = 0;i < that.new_data_length;i++) {
							var data = that.new_data[i].data;
							var currentSvg = d3.select(that.selector + " #svg-" +i);
							var current_x_axis = currentSvg.select("#xaxis");
							var current_y_axis = currentSvg.select("#yaxis");
							var current_xgrid = currentSvg.select("#xgrid");
							var current_ygrid = currentSvg.select("#ygrid");
							var type_length = type.length;
							var containerId = type.substring(0,type_length-1);

							that.k.xAxis(that.svgContainer,current_x_axis,that.xScale)
								.yAxis(that.svgContainer,current_y_axis,that.yScale)
								.yGrid(that.svgContainer,that.group,that.yScale)
								.xGrid(that.svgContainer,that.group,that.xScale);

							currentSvg.select(that.selector + " #"+containerId+i)
								.datum(that.new_data[i].data)
				      			.attr("transform", "translate("+ that.extra_left_margin +",0)");						
						
							function animation1(index,svg,data) {
								svg.select("#multilineChartsvg-"+index).transition()
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
							animation1(i,currentSvg,data);
						}
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
								if(!PykCharts.boolean(that.panels_enable)) {
									that.mouseEvent.crossHairPosition(that.data,that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.extra_left_margin,that.xdomain,that.type,that.tooltipMode,that.color_from_data,null);
								}
								else {
									that.mouseEvent.crossHairPosition(that.data,that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.extra_left_margin,that.xdomain);
								}
					  		});
					}
				}
				else { // Static Viz
					if(!PykCharts.boolean(that.panels_enable)) {
						var i;
						for (i = 0;i < that.new_data_length;i++) {
							var type = that.type + "-svg-" + i;
							that.dataLineGroup[i] = that.chartBody.append("path");
							var data = that.new_data[i].data;

							that.ticks[i] = that.svgContainer.append("text")
									.attr("id",type)
									.attr("class","legend-heading")
									.style("visibility","hidden")
									.html(that.new_data[i].name)
					      			.style("fill", function() {
					      				return that.fillColor.colorPieMS(that.new_data[i],that.type);
						      		});

							that.dataLineGroup[i]
									.datum(that.new_data[i].data)
								    .attr("class", that.chartPathClass)
								    .attr("id", type)
								    .attr("transform","translate("+ that.extra_left_margin +",0)")
							      	.style("stroke", function() {
							      		if(that.new_data[i].highlight && that.type === "multilineChart") {
					      					that.highlightLine(this,null,that.new_data[i].highlight);
					      				}
					      				return that.fillColor.colorPieMS(that.new_data[i],that.type);
					      			})
					      			.style("stroke-opacity", function () {
					      				if(that.type === "multilineChart" && that.color_mode === "saturation") {
						      				return (i+1)/that.new_data.length;
					      				} else {
					      					return 1;
					      				}
					      			})
						      		.on("click",function (d) {
						      			if(that.type === "multilineChart") {
						      				that.clicked = true;
						      				that.highlightLine(PykCharts.getEvent().target,that.clicked);
										}
									})
									.on("mouseover",function (d) {
										if(that.type === "multilineChart" && this !== that.selected && (that.color_mode === "saturation" || that.hover)) {
											that.previous_color = d3.select(this).style("stroke-opacity");
											that.click_color = d3.select(this).style("stroke");
											d3.select(this)
												.classed({'multi-line-hover':true,'multi-line':false})
												.style("stroke", "orange");
										}
									})
									.on("mouseout",function (d,i) {
										if(that.type === "multilineChart" && this !== that.selected && (that.color_mode === "saturation" || that.hover)) {
											d3.select(this)
												.classed({'multi-line-hover':false,'multi-line':true})
												.style("stroke", function() {
													if(that.new_data[i].highlight && that.type === "multilineChart") {
								      					that.highlightLine(this,null,that.new_data[i].highlight);
								      				}
								      				return that.click_color;
								      			})
								      			.style("stroke-opacity", function () {
								      				if(that.type === "multilineChart" && that.color_mode === "saturation") {
									      				return that.previous_color;
								      				} else {
								      					return 1;
								      				}
								      			});
										}
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
					} else {  				// Multiple Containers -- "Yes"
						type = that.type + that.svgContainer.attr("id");
						that.dataLineGroup[0] = that.chartBody.append("path");

						that.dataLineGroup[0]
								.datum(that.new_data1.data)
							    .attr("class", that.chartPathClass)
							    .attr("id", type)
							    .attr("transform", "translate("+ that.extra_left_margin +",0)")
							    .style("stroke", function (d,i) {
										return that.fillColor.colorPieMS(that.new_data[index],that.type);
								});

						function animation(i) {
							that.dataLineGroup[0].transition()
								    .duration(that.transitions.duration())
								    .attrTween("d", function (d) {
								    	var interpolate = d3.scale.quantile()
							                .domain([0,1])
							                .range(d3.range(1, that.new_data[i].data.length + 1));
								        return function(t) {
								            return that.chart_path(that.new_data[i].data.slice(0, interpolate(t)));
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
								that.mouseEvent.crossHairPosition(that.data,that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.extra_left_margin,that.xdomain,that.type,that.tooltipMode,that.color_from_data,null);
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
									$(options.selector+" #svg-"+a).trigger("mouseout");
								}
							})
							.on("mousemove", function(){

								var line = [];
								line[0] = d3.select(options.selector+" #"+this.id+" .multi-line");
								that.mouseEvent.crossHairPosition(that.data,that.new_data,that.xScale,that.yScale,line,that.extra_left_margin,that.xdomain,that.type,that.tooltipMode,that.color_from_data,that.panels_enable);
								for(var a=0;a < that.new_data_length;a++) {
 									$(options.selector+" #svg-"+a).trigger("mousemove");
								}
							});
					}
				}
				// var itm=document.getElementById("line");
				// var cln=itm.cloneNode(true);
				// console.log(cln,"testing export step 1");
				return this;
			},
			ticks: function (index) {
				if(PykCharts.boolean(that.pointer_size)) {
					if(PykCharts.boolean(that.panels_enable)) {
						type = that.type + that.svgContainer.attr("id");
						if (that.axis_x_position  === "bottom" && (that.axis_y_position === "left" || that.axis_y_position === "right")) {
							that.ticks[0] = that.svgContainer.append("text")
								.attr("id",type)
								.attr("x", that.margin_left)
								.attr("y", that.margin_top)
								.attr("dy",-5)
								.style("font-size", that.pointer_size)
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
								.style("font-size", that.pointer_size)
								.style("font-weight", that.pointer_weight)
								.style("font-family", that.pointer_family)
								.html(that.new_data1.name)
								.style("fill", function() {
					      			return that.fillColor.colorPieMS(that.new_data1,that.type);
					      		});
						}

					} else {
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
									that.tick_w = this.getBBox().width + 5;
									return d.name;
								})
								.style("font-size", that.pointer_size)
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
	this.zoomed = function() {
		if(!PykCharts.boolean(that.panels_enable)) {
			that.k.isOrdinal(that.svgContainer,".x.axis",that.xScale,that.xdomain,that.extra_left_margin);
		    that.k.isOrdinal(that.svgContainer,".x.grid",that.xScale);
		    that.k.isOrdinal(that.svgContainer,".y.axis",that.yScale,that.ydomain);
		    that.k.isOrdinal(that.svgContainer,".y.grid",that.yScale);
		    for (i = 0;i < that.new_data_length;i++) {
		    	type = that.type + "-svg-" + i;
		  	 	that.svgContainer.select(that.selector+" #"+type)
		        	.attr("class", that.chartPathClass)
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
		        	.attr("class", that.chartPathClass)
			        .attr("d", that.chart_path);

		    }
		}
	    if(PykCharts.getEvent().type === "dblclick") {
	    	that.count++;
	    }
	    that.mouseEvent.tooltipHide();
		that.mouseEvent.crossHairHide(that.type);
		that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
		that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");

	    if(that.count === that.zoom_level+1) {

	    	that.zoomOut();
	    }
	    if(PykCharts.boolean(that.annotation_enable)) {
        	that.annotation();
        }
	    that.optionalFeature().ticks();
	};
	this.zoomOut = function () {
		that.optionalFeature().createChart("liveData");
    	that.k.isOrdinal(that.svgContainer,".x.axis",that.xScale,that.xdomain,that.extra_left_margin);
	    that.k.isOrdinal(that.svgContainer,".x.grid",that.xScale);
	    that.k.isOrdinal(that.svgContainer,".y.axis",that.yScale,that.ydomain);
	    that.k.isOrdinal(that.svgContainer,".y.grid",that.yScale);
	}
	this.highlightLine = function(linePath,clicked) {

			that.selected_line = linePath;
			that.selected_line_data = that.selected_line.__data__;
			that.selected_line_data_len = that.selected_line_data.length;
			that.deselected = that.selected;

			d3.select(that.deselected)
					.classed({'multi-line-selected':false,'multi-line':true,'multi-line-hover':false})

			that.selected = linePath;

			d3.select(that.selected)
					.classed({'multi-line-selected':true,'multi-line':false,'multi-line-hover':false})
			if(that.type === "multilineChart" && (that.color_mode === "saturation" || that.hover))
				d3.select(that.selected)
					.style("stroke", function (d,i) {
	      				return that.click_color;
	      			});

			if(clicked) {
				d3.selectAll(options.selector+" path.multi-line").style("stroke-opacity",0.3);
				d3.selectAll(options.selector+ " .legend-heading").style("opacity",0.3);
				d3.select(that.selector+" text#"+that.selected.id).style("opacity",1).style
				("font-weight","bold");
				d3.select(that.selected).style("stroke-opacity",1);
			}
	};

	this.annotation = function () {
		that.line = d3.svg.line()
                .x(function(d,i) { return d.x; })
                .y(function(d,i) { return d.y; });

    	if(!PykCharts.boolean(that.panels_enable)) {
			var line_size = 15,annotation = [];

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
                			y:parseInt(that.yScale(d.y)-(line_size)+that.margin_top)
                		},
                		{
                			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
                			y:parseInt(that.yScale(d.y)-(line_size)+that.margin_top)
                		}
                	];
                	return that.line(a);
                })
           	setTimeout(function () {
	        	anno.attr("class", "PykCharts-annotation-line")
	                .attr("d", function (d,i) {
	                	var a = [
	                		{
	                			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
	                			y:parseInt(that.yScale(d.y)-(line_size)+that.margin_top)
	                		},
	                		{
	                			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
	                			y:parseInt(that.yScale(d.y)+that.margin_top),
	                		}
	                	];
	                	return that.line(a);
	                })
	                .attr("stroke",that.annotation_border_color);
           	},that.transitions.duration());

            anno.exit()
            	.remove();
            // .call(that.k.annotation);
            that.k.annotation(that.selector + " #svg-1",annotation, that.xScale,that.yScale);
		}
		else if(PykCharts.boolean(that.panels_enable)) {
			for(i=0;i<that.new_data_length;i++){
				var annotation = [], line_size = 15;
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
                    			y:parseInt(that.yScale(d.y)-(line_size)+that.margin_top)
                    		},
                    		{
                    			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
                    			y:parseInt(that.yScale(d.y)-(line_size)+that.margin_top)
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
		                    			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
		                    			y:parseInt(that.yScale(d.y)-(line_size)+that.margin_top)
		                    		},
		                    		{
		                    			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
		                    			y:parseInt(that.yScale(d.y)+that.margin_top),
		                    		}
		                    	];
		                    	return that.line(a);
		                    })
		                	.attr("stroke",that.annotation_border_color);
		            },that.transitions.duration());
	            }
	            annotationAnimation(anno);
                anno.exit().remove();
                that.k.annotation(that.selector + " #svg-" + i,annotation, that.xScale,that.yScale)
			}
		}

	}
};

PykCharts.multiD.areaChart = function (options){
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
		// that.color_from_data = options.line_color_from_data ? options.line_color_from_data : multiDimensionalCharts.line_color_from_data;
	  	that.interpolate = PykCharts.boolean(that.curvy_lines) ? "cardinal" : "linear";
		that.w = that.width - that.margin_left - that.margin_right;
		that.h = that.height - that.margin_top - that.margin_bottom;

		d3.json(options.data, function (e, data) {
			that.data = data.groupBy("area");
			that.axis_y_data_format = "number";
    		that.axis_x_data_format = options.axis_x_data_format ? options.axis_x_data_format.toLowerCase() : that.k.xAxisDataFormatIdentification(that.data);
			that.compare_data = that.data;
			that.data_length = that.data.length;
			that.dataTransformation();
			$(that.selector+" #chart-loader").remove();
			that.render();
		});
	};
	this.dataTransformation = function () {
		that.group_arr = [], that.color_arr = [], that.new_data = [];
		for(j = 0;j < that.data_length;j++) {
			that.group_arr[j] = that.data[j].name;
		}
		that.uniq_group_arr = that.group_arr.slice();
		that.uniq_color_arr = [];
		$.unique(that.uniq_group_arr);
		var len = that.uniq_group_arr.length;
		for (k = 0;k < len;k++) {
			if(that.chart_color[k]) {
				that.uniq_color_arr[k] = that.chart_color[k];
			} else {
				for (l = 0;l < that.data_length;l++) {
					if (that.uniq_group_arr[k] === that.data[l].name && that.data[l].color) {
						that.uniq_color_arr[k] = that.data[l].color;
						break;
					}
				} if(!PykCharts.boolean(that.uniq_color_arr[k])) {
					that.uniq_color_arr[k] = that.default_color[0];
				}
			}
		}

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
							tooltip: that.data[l].tooltip,
							annotation : that.data[l].annotation || ""
				 	});
				}
				}
		}
		that.new_data_length = that.new_data.length;
	}
	this.render = function (){
		that.dataLineGroup = [], that.dataLineGroupBorder = [];
		that.multid = new PykCharts.multiD.configuration(that);
		that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);
		that.transitions = new PykCharts.Configuration.transition(that);
		that.border = new PykCharts.Configuration.border(that);

//		that.k.export(that,"#svg-1","areaChart");
		if(that.mode === "default") {

			that.k.title()
					.backgroundColor(that)
					.export(that,"#svg-1","areaChart")
					.liveData(that)
					.emptyDiv()
					.subtitle()
					.makeMainDiv(options.selector,1)
					.tooltip(true,options.selector,1);


			that.optional_feature()
		    		.chartType()
					.svgContainer(1)
					.legendsContainer()
					.legends()
					.createGroups(1)
					.createChart()
		    		.axisContainer();

		    that.k.crossHair(that.svgContainer,that.new_data_length,that.new_data,that.fillColor);


			that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.legendsGroup_height,that.data)
					.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain)
					.yGrid(that.svgContainer,that.group,that.yScale)
					.xGrid(that.svgContainer,that.group,that.xScale)
					.xAxisTitle(that.xGroup)
					.yAxisTitle(that.yGroup)
					.createFooter()
	                .lastUpdatedAt()
	                .credits()
	                .dataSource();
	        if(PykCharts.boolean(that.annotation_enable)) {
	        	that.annotation();
	        }
		}
		else if(that.mode === "infographics") {
			  that.k.liveData(that)
			  			.backgroundColor(that)
			  			.export(that,"#svg-1","areaChart")
			  			.emptyDiv()
						.makeMainDiv(options.selector,1);

			  that.optional_feature()
			    		.chartType()
						.svgContainer(1)
						.legendsContainer()
						.createGroups(1)
						.createChart()
			    		.axisContainer();

		    that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.legendsGroup_height)
					.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain)
					.xAxisTitle(that.xGroup)
					.yAxisTitle(that.yGroup);
  		}

  		that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
  		$(document).ready(function () { return that.k.resize(that.svgContainer,"yes"); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer,"yes"); });
	};

	this.refresh = function (){
		d3.json(options.data, function (e,data) {
			that.data = data.groupBy("area");
			that.data_length = that.data.length;
			// that.transition_duration = 0;
			that.dataTransformation();
			var compare = that.multid.checkChangeInData(that.data,that.compare_data);
			that.compare_data = compare[0];
			var data_changed = compare[1];

			if(data_changed) {
				that.k.lastUpdatedAt("liveData");
				that.mouseEvent.tooltipHide();
				that.mouseEvent.crossHairHide(that.type);
				that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
				that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
			}

			that.optional_feature().createChart("liveData");

			that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.legendsGroup_height)
					.yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain)
					.yGrid(that.svgContainer,that.group,that.yScale)
					.xGrid(that.svgContainer,that.group,that.xScale)
					.tooltip(true,options.selector);

			if(PykCharts.boolean(that.annotation_enable)) {
	        	that.annotation();
	        }
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
			svgContainer: function (i){
				$(that.selector).attr("class","PykCharts-twoD PykCharts-multi-series2D PykCharts-line-chart");
				// $(options.selector).css({"background-color":that.background_color,"position":"relative"});

				that.svgContainer = d3.select(options.selector+" "+"#tooltip-svg-container-"+i).append("svg:svg")
					.attr("id","svg-"+i)
					.attr("width",that.width)
					.attr("height",that.height)
					.attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height);
                    
                // $(options.selector).colourBrightness();
    			return this;
			},
			createGroups : function (i) {

				that.group = that.svgContainer.append("g")
					.attr("id","chartsvg")
					.attr("transform","translate("+ that.margin_left +","+ (that.margin_top + that.legendsGroup_height)+")");

				if(PykCharts.boolean(that.grid_y_enable)){
					that.group.append("g")
						.attr("id","ygrid")
						.attr("class","y grid-line");
				}
				if(PykCharts.boolean(that.grid_x_enable)){
					that.group.append("g")
						.attr("id","xgrid")
						.attr("class","x grid-line");
				}

				that.clip = that.svgContainer.append("svg:clipPath")
				    .attr("id","clip" + i + that.selector)
				    .append("svg:rect")
				    .attr("width", that.w)
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
                if (PykCharts.boolean(that.legends_enable) && that.type === "stackedAreaChart" && that.mode === "default") {
                    that.legendsGroup = that.svgContainer
                        .append("g")
                                .attr('id',"legends")
                                .attr("transform","translate(0,20)");
                } else {
                    that.legendsGroup_height = 0;
                }
                return this;
            },
			axisContainer : function () {
	        	if(PykCharts.boolean(that.axis_x_enable) || options.axis_x_title){
					that.xGroup = that.group.append("g")
							.attr("id","xaxis")
							.attr("class", "x axis");
				}
				if(PykCharts.boolean(that.axis_y_enable) || options.axis_y_title){
					that.yGroup = that.group.append("g")
						.attr("id","yaxis")
						.attr("class","y axis");
				}
	        	return this;
      		},
			createChart : function (evt) {
				
				that.legend_text = [];

				that.layers = that.stack_layout(that.new_data);

        		var x_domain,x_data = [],y_data,y_range,x_range,y_domain;
        		that.count = 1;

				if(that.axis_y_data_format === "number") {
					max = d3.max(that.layers, function(d) { return d3.max(d.data, function(k) { return k.y0 + k.y; }); });
					min = 0;
         			y_domain = [min,max];
		          	y_data = that.k._domainBandwidth(y_domain,1);
		          	y_range = [that.h - that.legendsGroup_height, 0];
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
		          	that.yScale = that.k.scaleIdentification("time",y_data,y_range);

		        }
		        if(that.axis_x_data_format === "number") {
        			max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return k.x; }); });
					min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return k.x; }); });
         			x_domain = [min,max];
			        x_data = that.k._domainBandwidth(x_domain,2);
			        x_range = [0 ,that.w];
			        that.xScale = that.k.scaleIdentification("linear",x_data,x_range);
			        that.extra_left_margin = 0;

		        }
		        else if(that.axis_x_data_format === "string") {
		          	that.new_data[0].data.forEach(function(d) { x_data.push(d.x); });
		          	x_range = [0 ,that.w];
		          	that.xScale = that.k.scaleIdentification("ordinal",x_data,x_range,0);
		          	that.extra_left_margin = (that.xScale.rangeBand() / 2);

		        }
		        else if (that.axis_x_data_format === "time") {
		        	max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return new Date(k.x); }); });
					min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return new Date(k.x); }); });
		         	x_data = [min,max];
		          	x_range = [0 ,that.w];
		          	that.xScale = that.k.scaleIdentification("time",x_data,x_range);
		          	for(i=0;i<that.new_data_length;i++) {
			          	that.new_data[i].data.forEach(function (d) {
			          		d.x = new Date(d.x);
			          	});
			        }
		          	that.data.forEach(function (d) {
		          		d.x = new Date(d.x);
		          	});
		          	that.extra_left_margin = 0;
		        }
		        that.xdomain = that.xScale.domain();
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

				if(PykCharts.boolean(that.zoom_enable) && (that.mode === "default")) {
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

	        	if(evt === "liveData"){
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
								that.mouseEvent.axisHighlightHide(options.selector + " .x.axis");
								that.mouseEvent.axisHighlightHide(options.selector + " .y.axis");
		          			})
							.on("mousemove", function(){
								that.mouseEvent.crossHairPosition(that.data,that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.extra_left_margin,that.xdomain,that.type,that.tooltip_mode);
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
							.style("fill-opacity",function() {
								if(that.type === "stackedAreaChart" && that.color_mode === "saturation") {
									return (i+1)/that.new_data.length;
								}
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
							.attr("transform", "translate("+ that.extra_left_margin +",0)");

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

						// Legend ---- Pending!
					  // that.legend_text[i] = that.svgContainer.append("text")
					  // 		.attr("id",that.chartPathClass+"-"+that.new_data[i].name)
					  // 		.attr("x", 20)
					  // 		.attr("y", 20)
					  // 		.style("display","none")
					  // 		.text(that.new_data[i].name);data

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

					that.svgContainer
						.on('mouseout', function (d) {
							that.mouseEvent.tooltipHide();
							that.mouseEvent.crossHairHide(that.type);
							that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
							that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");

							if(that.type === "stackedAreaChart") {
								for(var a=0;a < that.new_data_length;a++) {
									$(options.selector+" #svg-"+a).trigger("mouseout");
								}
							}
						})
						.on("mousemove", function() {
							if(that.type === "areaChart") {
								that.mouseEvent.crossHairPosition(that.data,that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.extra_left_margin,that.xdomain,that.type,that.tooltip_mode);
							} else if(that.type === "stackedAreaChart") {
								var line = [];
								line[0] = d3.select(options.selector+" #"+this.id+" .stacked-area");
								that.mouseEvent.crossHairPosition(that.data,that.new_data,that.xScale,that.yScale,line,that.extra_left_margin,that.xdomain,that.type,that.tooltipMode,that.color_from_data,"no");
								for(var a=0;a < that.new_data_length;a++) {
									$(options.selector+" #svg-"+a).trigger("mousemove");
								}
							}
						});

				}
				return this;
			},
			legends : function (index) {
                   
                if (PykCharts.boolean(that.legends_enable) && that.type === "stackedAreaChart" && that.mode==="default") {
                    var k = 0;
                    var l = 0;

                    if(that.legends_display === "vertical" ) {
                        that.legendsGroup.attr("height", (that.new_data_length * 30)+20);
                        that.legendsGroup_height = (that.new_data_length * 30)+20;

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

                    } else if(that.legends_display === "horizontal") {
                        // that.legendsContainer.attr("height", (k+1)*70);
                        that.legendsGroup_height = 50;
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
                                    // that.legendsContainer.attr("height", (k+1)*50);
                                    that.legendsGroup.attr("height", (k+1)*50);
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
                    legend = that.legendsGroup.selectAll("rect")
                            .data(that.new_data);
                    that.legends_text = that.legendsGroup.selectAll(".legends_text")
                        .data(that.new_data);
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

                    legend.exit().remove();

                    that.legends_text
                        .enter()
                        .append('text')
                        .attr("class","legends_text")
                        .attr("fill",that.legends_text_color)
                        .attr("pointer-events","none")
                        .style("font-family", that.legends_text_family)
                        .attr("font-size",that.legends_text_size)
                        .style("font-weight", that.legends_text_weight);

                    that.legends_text.attr("class","legends_text")
                        .attr(text_parameter1, text_parameter1value)
                        .attr(text_parameter2, text_parameter2value)
                        .text(function (d) { return d.name; });

                    that.legends_text.exit()
                                    .remove();
                }
                return this;
            }
		};
		return optional;
	};

	this.zoomed = function() {
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
	    if(PykCharts.getEvent().type === "dblclick") {
	    	that.count++;
	    }
	    that.mouseEvent.tooltipHide();
		that.mouseEvent.crossHairHide(that.type);
		that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
		that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
	    if(that.count === that.zoom_level+1) {
	    	that.zoomOut();
	    }
	    if(PykCharts.boolean(that.annotation_enable)) {
        	that.annotation();
        }
	};

	this.zoomOut =  function () {
		that.optional_feature().createChart("liveData");
    	that.k.isOrdinal(that.svgContainer,".x.axis",that.xScale,that.xdomain,that.extra_left_margin);
	    that.k.isOrdinal(that.svgContainer,".x.grid",that.xScale);
	    that.k.isOrdinal(that.svgContainer,".y.axis",that.yScale,that.ydomain);
	    that.k.isOrdinal(that.svgContainer,".y.grid",that.yScale);
	};

	this.annotation = function () {
		that.line = d3.svg.line()
                .x(function(d,i) { return d.x; })
                .y(function(d,i) { return d.y; });

		if(that.type === "areaChart") {
			var line_size = 15,annotation = [];
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
                			y:parseInt(that.yScale(d.y)+that.margin_top - line_size)
                		},
                		{
                			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
                			y:parseInt(that.yScale(d.y)+that.margin_top - line_size)
                		}
                	];
                	return that.line(a);
                })
            setTimeout(function () {
	            anno.attr("class", "PykCharts-annotation-line")
	                .attr("d", function (d,i) {
	                	var a = [
	                		{
	                			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
	                			y:parseInt(that.yScale(d.y)+that.margin_top - line_size)
	                		},
	                		{
	                			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
	                			y:parseInt(that.yScale(d.y)+that.margin_top),
	                		}
	                	];
	                	return that.line(a);
	                })
	                // .attr("stroke-width",0.5)
	                .attr("stroke",that.annotation_border_color);
            }, that.transitions.duration());
            
            anno.exit().remove();
            that.k.annotation(that.selector + " #svg-1",annotation, that.xScale,that.yScale);

		} else if(that.type === "stackedAreaChart" && that.mode === "default") {
			var line_size = 15,annotation = [];
			for(i=0;i<that.new_data_length;i++) {
				that.new_data[i].data.map(function (d) {
					if(d.annotation) {
						annotation.push({
							annotation : d.annotation,
							x : d.x,
							y : d.y + d.y0
							// y0 : d.y0
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
	            			y:parseInt(that.yScale(d.y)-(line_size)+that.margin_top+that.legendsGroup_height)
	            		},
	            		{
	            			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
	            			y:parseInt(that.yScale(d.y)-(line_size)+that.margin_top+that.legendsGroup_height)
	            		}
	            	];
	            	return that.line(a);
	            })
            setTimeout(function () {
	        	anno.attr("class", "PykCharts-annotation-line")
		            .attr("d", function (d,i) {
		            	var a = [
		            		{
		            			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
		            			y:parseInt(that.yScale(d.y)-(line_size)+that.margin_top+that.legendsGroup_height)
		            		},
		            		{
		            			x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.margin_left,
		            			y:parseInt(that.yScale(d.y)+that.margin_top+that.legendsGroup_height),
		            		}
		            	];
		            	return that.line(a);
		            })
		            .attr("stroke",that.annotation_border_color);
            }, that.transitions.duration());
                
            anno.exit().remove();
            that.k.annotation(that.selector + " #svg-1",annotation,that.xScale,that.yScale)
		}
	}
};

PykCharts.multiD.barChart = function(options){
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function () {
        that = new PykCharts.multiD.processInputs(that, options, "column");
        var multiDimensionalCharts = theme.multiDimensionalCharts;
        // console.log(that.stop);
        
        // console.log("barChart");        
        that.grid_y_enable =  options.chart_grid_y_enable ? options.chart_grid_y_enable.toLowerCase() : theme.stylesheet.chart_grid_y_enable;
        that.grid_color = options.chart_grid_color ? options.chart_grid_color.toLowerCase() : theme.stylesheet.chart_grid_color;
        
        that.data_sort_enable = options.data_sort_enable ? options.data_sort_enable.toLowerCase() : multiDimensionalCharts.data_sort_enable;
        that.data_sort_type = PykCharts.boolean(that.data_sort_enable) && options.data_sort_type ? options.data_sort_type.toLowerCase() : multiDimensionalCharts.data_sort_type;
        that.data_sort_order = PykCharts.boolean(that.data_sort_enable) && options.data_sort_order ? options.data_sort_order.toLowerCase() : multiDimensionalCharts.data_sort_order;

        try {
            if(that.data_sort_type === "alphabetically" || that.data_sort_type === "numerically") {                
            } else {
                that.data_sort_type = multiDimensionalCharts.data_sort_type;
                throw "data_sort_type";
            } 
        }
        catch(err) {
            that.k.warningHandling(err,"12");
        }

        try {
            if(that.data_sort_order === "ascending" || that.data_sort_order === "descending") {                
            } else {
                that.data_sort_order = multiDimensionalCharts.data_sort_order;
                throw "data_sort_order";
            } 
        }
        catch(err) {
            that.k.warningHandling(err,"13");
        }

        if(that.stop)
            return;

            if(that.mode === "default") {
           that.k.loading();
        }
        that.multiD = new PykCharts.multiD.configuration(that);
        d3.json(options.data, function(e, data){
            // console.log("data",data);
            that.data = data.groupBy("bar");
            that.compare_data = data.groupBy("bar");
            //console.log(data);
            that.axis_x_data_format = that.k.xAxisDataFormatIdentification(that.data);
            $(that.selector+" #chart-loader").remove();
            that.render();
        });
    };

    this.refresh = function () {
        d3.json(options.data, function (e, data) {
            that.data = data.groupBy("bar");
            that.refresh_data = data.groupBy("bar");
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.data = that.dataTransformation();
            that.data = that.emptygroups(that.data);
            var fD = that.flattenData();
            that.the_bars = fD[0];
            that.the_keys = fD[1];
            that.the_layers = that.buildLayers(that.the_bars);
            if(that.no_of_groups === 1) {
                that.legends_enable = "no";
            }
            that.map_group_data = that.multiD.mapGroup(that.data);
            that.optionalFeatures()
                    .createChart()
                    .legends()
                    .ticks();
            that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,undefined,undefined,that.legendsGroup_height);
        });
    };

    //----------------------------------------------------------------------------------------
    //4. Render function to create the chart
    //----------------------------------------------------------------------------------------
    this.render = function(){
        // console.log("barChart")
        var that = this;
        that.map_group_data = that.multiD.mapGroup(that.data);
        that.data = that.dataTransformation();
        that.data = that.emptygroups(that.data);

        // console.log(that.data,"that.data");
        var fD = that.flattenData();
        // console.log(fD);
        that.the_bars = fD[0];
        that.the_keys = fD[1];
        that.the_layers = that.buildLayers(that.the_bars);
        // console.log(that.the_bars);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.mouseEvent1 = new PykCharts.multiD.mouseEvent(that);
        that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);
        that.border = new PykCharts.Configuration.border(that);
        if(that.no_of_groups === 1) {
            that.legends_enable = "no";
        }
        if(that.mode === "default") {

            that.k.title()
                .backgroundColor(that)
                .export(that,"#svgcontainer","barChart")
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
                .createGroups()
                .createChart()
                .axisContainer()
                .ticks()
                .highlightRect();

        } else if(that.mode === "infographics") {
            that.k.backgroundColor(that)
                .export(that,"#svgcontainer","barChart")
                .emptyDiv()
                .makeMainDiv(that.selector,1);

            that.optionalFeatures().svgContainer(1)
                .legendsContainer(1)
                .createGroups()
                .createChart()
                .axisContainer()
                .ticks()
                .highlightRect();

            that.k.tooltip();
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

        }
        that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,undefined,undefined,that.legendsGroup_height)
                .xAxisTitle(that.xGroup,that.legendsGroup_height);

        if(PykCharts.boolean(that.legends_enable)) {
            $(document).ready(function () { return that.k.resize(that.svgContainer,"",that.legendsContainer); })
            $(window).on("resize", function () { return that.k.resize(that.svgContainer,"",that.legendsContainer); });
        } else {
            $(document).ready(function () { return that.k.resize(that.svgContainer,""); })
            $(window).on("resize", function () { return that.k.resize(that.svgContainer,""); });
        }
    };

    this.optionalFeatures = function() {
        var that = this;
        var optional = {
            svgContainer: function (i) {
                $(that.selector).attr("class","PykCharts-twoD");
                that.svgContainer = d3.select(options.selector + " #tooltip-svg-container-" + i)
                    .append("svg:svg")
                    .attr("width",that.width )
                    .attr("height",that.height)
                    .attr("id","svgcontainer")
                    .attr("class","svgcontainer")
                    // .style("background-color",that.background_color)
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height);

                // $(options.selector).colourBrightness();

                return this;
            },
            createGroups: function () {
                that.group = that.svgContainer.append("g")
                    .attr("id","svggroup")
                    .attr("class","svggroup")
                    .attr("transform","translate(" + that.margin_left + "," + (that.margin_top + that.legendsGroup_height) +")");

                return this;
            },
            legendsContainer: function (i) {
                if(PykCharts.boolean(that.legends_enable)&&that.mode === "default") {
                    that.legendsGroup = that.svgContainer.append("g")
                        .attr("id","legends")
                        .attr("class","legends")
                        .attr("transform","translate(0,10)");

                } else {
                    that.legendsGroup_height = 0;
                }

                return this;
            },
            axisContainer : function () {
                if(PykCharts.boolean(that.axis_y_enable)) {

                    var axis_line = that.group.selectAll(".axis-line")
                        .data(["line"]);

                    axis_line.enter()
                            .append("line");

                    axis_line.attr("class","axis-line")
                            .attr("x1",0)
                            .attr("y1",0)
                            .attr("x2",0)
                            .attr("y2",that.height-that.margin_top-that.margin_bottom - that.legendsGroup_height)
                            .attr("stroke",that.axis_x_line_color)
                            .attr("stroke-width","1px");

                    axis_line.exit().remove();
                }    
                if(that.axis_y_title) {
                    if(that.axis_y_position === "left") {
                        that.yGroup = that.group.append("g")
                            .attr("id","yaxis")
                            .attr("class", "y axis")
                            .append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("x",-(that.height-that.margin_top-that.margin_bottom - that.legendsGroup_height)/2)
                            .attr("y", -60)
                            .attr("dy", ".71em")
                            .style("text-anchor", "end")
                            .style("fill",that.axis_y_title_color)
                            .style("font-weight",that.axis_y_title_weight)
                            .style("font-family",that.axis_y_title_family)
                            .style("font-size",that.axis_y_title_size)
                            .text(that.axis_y_title);

                    } else if(that.axis_y_position === "right") {
                        axis_line.attr("x1",(that.width-that.margin_left-that.margin_right))
                            .attr("x2",(that.width-that.margin_left-that.margin_right));

                        that.yGroup = that.group.append("g")
                            .attr("id","yaxis")
                            .attr("class", "y axis")
                            .append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("x",-(that.height-that.margin_top-that.margin_bottom-that.legendsGroup_height)/2)
                            .attr("y", (that.width-that.margin_left-that.margin_right)+12)
                            .attr("dy", ".71em")
                            .style("text-anchor", "end")
                            .style("fill",that.axis_y_title_color)
                            .style("font-weight",that.axis_y_title_weight)
                            .style("font-family",that.axis_y_title_family)
                            .style("font-size",that.axis_y_title_size)
                            .text(that.axis_y_title);
                        // that.xGroup.attr("transform","translate(0,"+(that.width-that.margin.left-that.margin.right)+")");
                    }
                        // .style("stroke","none");
                }
                // console.log(PykCharts.boolean(that.axis_x_enable),"is boolean");
                if(PykCharts.boolean(that.axis_x_enable) || that.axis_x_title) {
                    that.xGroup = that.group.append("g")
                        .attr("id","xaxis")
                        .attr("class","x axis");
                }
                return this;
            },
            createChart: function() {
                var w = that.width - that.margin_left - that.margin_right,
                    j = that.no_of_groups + 1,
                    h = that.height - that.margin_top - that.margin_bottom - that.legendsGroup_height;

                var the_bars = that.the_bars;
                var keys = that.the_keys;
                that.layers = that.the_layers;
                var groups= that.getGroups();

                that.stack_layout = d3.layout.stack() // Create default stack
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
                                tooltip : d.tooltip ? d.tooltip : d.y,
                                color: d.color,
                                group: d.group,
                                name:d.name
                                // highlight:d.highlight
                            };
                        })
                    };
                })
                // console.log(layers);
                var x_data = [];
                that.layers.map(function(e, i){ // Get all values to create scale
                    for(i=0;i < e.values.length;i++){
                        var d = e.values[i];
                        x_data.push(d.x + d.x0); // Adding up y0 and y to get total height
                    }
                });

                that.yScale = d3.scale.ordinal()
                    .domain(the_bars.map(function(e, i){
                        return e.id || i; // Keep the ID for bars and numbers for integers
                    }))
                    .rangeBands([0,h]);

                var x_domain = [0,d3.max(x_data)];
                that.xScale = d3.scale.linear().domain(that.k._domainBandwidth(x_domain,1)).range([0, w]);

                // that.yScaleInvert = d3.scale.linear().domain([d3.max(yValues), 0]).range([0, h]).nice(); // For the yAxis
                // var zScale = d3.scale.category10();

                // if(that.axis_x_data_format === "number") {
                //     max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return k.x; }); });
                //     min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return k.x; }); });
                //     x_domain = [min,max];
                //     x_data = that.k._domainBandwidth(x_domain,2);
                //     x_range = [0 ,that.reducedWidth];
                //     that.xScale = that.k.scaleIdentification("linear",x_data,x_range);
                //     that.extra_left_margin = 0;

                // } else if(that.axis_x_data_format === "string") {
                //     that.new_data[0].data.forEach(function(d) { x_data.push(d.x); });
                //     x_range = [0 ,that.reducedWidth];
                //     that.xScale = that.k.scaleIdentification("ordinal",x_data,x_range,0);
                //     that.extra_left_margin = (that.xScale.rangeBand() / 2);

                // } else if (that.axis_x_data_format === "time") {
                //     max = d3.max(that.new_data, function(d) { return d3.max(d.data, function(k) { return new Date(k.x); }); });
                //     min = d3.min(that.new_data, function(d) { return d3.min(d.data, function(k) { return new Date(k.x); }); });
                //     x_data = [min,max];
                //     x_range = [0 ,that.reducedWidth];
                //     that.xScale = that.k.scaleIdentification("time",x_data,x_range);
                //     that.new_data[0].data.forEach(function (d) {
                //         d.x = new Date(d.x);
                //     });
                //     that.extra_left_margin = 0;
                // }

                var group_arr = [];

                for(var i in groups){
                // for(var i=0;i<groups.length;i++) {
                    var g = groups[i];
                    var y = that.yScale(g[0]);
                    var totalHeight = that.yScale.rangeBand() * g.length;
                    y = y + (totalHeight/2);
                    group_arr.push({y: y, name: i});
                }
                that.domain = group_arr.map(function (d) {
                    return d.name;
                });
                that.y0 = d3.scale.ordinal()
                    .domain(group_arr.map(function (d,i) { return d.name; }))
                    .rangeRoundBands([0, h], 0.1);

                that.y1 = d3.scale.ordinal()
                    .domain(that.barName.map(function(d) { return d; }))
                    .rangeRoundBands([0, that.y0.rangeBand()]) ;

                that.y_factor = 0;
                that.height_factor = 0;
                if(that.no_of_groups === 1) {
                    that.y_factor = that.yScale.rangeBand()/4;
                    that.height_factor = (that.yScale.rangeBand()/(2*that.no_of_groups));
                };
                that.highlight_y_positions = [];
                that.highlight_x_positions = [];

                // console.log(that.layers,"layers")

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
                    .attr("fill", function(d,i){
                        if(that.no_of_groups === 1) {
                            return that.fillColor.colorPieMS(d);
                        } else {
                            return that.fillColor.colorGroup(d);
                        }
                    })
                    .attr("fill-opacity", function (d,i) {
                        if (that.color_mode === "saturation"){
                        // if(PykCharts.boolean(that.saturationEnable)){
                            // if(that.highlight === d.name) {
                            //     j--;
                            //     return 1;
                            // }
                            if(j>1){
                                j--;
                                return j/that.no_of_groups;
                            } else {
                                j = that.no_of_groups+1;
                                j--;
                                return j/that.no_of_groups;
                            }
                        }
                    })
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-dasharray", that.border.style())
                    .attr("stroke-opacity",1)
                    .on('mouseover',function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(d.tooltip ? d.tooltip : d.y);
                            that.mouseEvent.axisHighlightShow(d.name,options.selector + " .axis-text",that.domain,"bar");
                        }
                    })
                    .on('mouseout',function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipHide(d);
                            that.mouseEvent.axisHighlightHide(options.selector + " .axis-text","bar");
                        }
                    })
                    .on('mousemove', function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    });

                rect
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("x", function(d){
                        return that.xScale(d.x0);
                    })
                    .attr("width", function(d){
                        if(that.highlight.toLowerCase() === d.name.toLowerCase()) {
                            that.highlight_x_positions.push(that.xScale(d.x));
                        }
                        return that.xScale(d.x);
                    })
                    .attr("height", function(d){
                        return that.yScale.rangeBand()+that.height_factor;
                    })
                    .attr("y", function(d){
                        if(that.highlight.toLowerCase() === d.name.toLowerCase()) {
                            that.highlight_y_positions.push(that.yScale(d.y)-that.y_factor);
                        }
                        return that.yScale(d.y)-that.y_factor;
                    });

                that.bars.exit()
                    .remove();
                if(PykCharts.boolean(that.axis_y_enable)) {
                    var yAxis_label = that.group.selectAll("text.axis-text")
                        .data(group_arr);

                    yAxis_label.enter()
                            .append("text")

                    yAxis_label.attr("class", "axis-text")
                            .attr("y", function(d){
                                return d.y;
                            })
                            .attr("x", function(d){
                                return -10;
                            })
                            .style("fill",that.axis_y_pointer_color)
                            .style("font-weight",that.axis_y_pointer_weight)
                            .style("font-family",that.axis_y_pointer_family)
                            .style("font-size",that.axis_y_pointer_size)
                            .text(function(d){
                                return d.name;
                            })
                            .text(function (d) {
                                if(this.getBBox().width > (0.8*that.margin_left)) {
                                    return d.name.substr(0,2) + "..";
                                } else {
                                    return d.name;
                                }
                            })
                            .on('mouseover',function (d) {
                                that.mouseEvent.tooltipPosition(d);
                                that.mouseEvent.tooltipTextShow(d.name);
                            })
                            .on('mouseout',function (d) {
                                that.mouseEvent.tooltipHide(d);
                            })
                            .on('mousemove', function (d) {
                                that.mouseEvent.tooltipPosition(d);
                            });
                    if(that.axis_y_position === "right") {
                        yAxis_label.attr("x", function () {
                            return (that.width-that.margin_left-that.margin_right) + 10;
                        });
                    }
                    if(that.axis_y_position === "left" && that.axis_y_pointer_position === "right") {
                        yAxis_label.attr("x", function (d) {
                            return 10;
                        });
                    }
                    if(that.axis_y_position === "right" && that.axis_y_pointer_position === "left") {
                        yAxis_label.attr("x", function (d) {
                            return (that.width-that.margin_left-that.margin_right) - 10;
                        });
                    }
                    if(that.axis_y_pointer_position === "right") {
                        yAxis_label.attr("text-anchor","start");
                    } else if(that.axis_y_pointer_position === "left") {
                        yAxis_label.attr("text-anchor","end");
                    }
                    yAxis_label.exit().remove();
                }
                return this;
            },
            ticks: function () {
                if(that.pointer_size) {
                    that.txt_width;
                    that.txt_height;
                    that.ticksElement = that.bars.selectAll("g")
                                .data(that.layers);

                    var tick_label = that.bars.selectAll(".ticksText")
                                .data(function(d) {
                                        // console.log(d.values);
                                        return d.values;
                                });
                    tick_label.enter()
                        .append("text")
                        .attr("class","ticksText");

                    tick_label.attr("class","ticksText")
                        .text("");

                    setTimeout(function() {
                        tick_label.text(function(d) {
                                if(d.x) {
                                    // console.log(d.x);
                                    return d.x;
                                }
                            })
                            .style("font-weight", that.pointer_weight)
                            .style("font-size", that.pointer_size)
                            .attr("fill", that.pointer_color)
                            .style("font-family", that.pointer_family)
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
                                if(that.no_of_groups ===1) {
                                    return that.yScale.rangeBand()/2;
                                } else {
                                    return that.yScale.rangeBand()/4;
                                }
                            })
                            .style("font-size",function(d) {
                                // console.log(that.label.size);
                                return that.pointer_size;
                            });
                    }, that.transitions.duration());

                    tick_label.exit().remove();
                }
                return this;
            },
            highlightRect : function () {
                if(that.no_of_groups > 1 && PykCharts.boolean(that.highlight)) {
                    setTimeout(function() {
                        function ascending( a, b ) {
                            return a - b;
                        }
                        that.highlight_x_positions.sort(ascending)
                        that.highlight_y_positions.sort(ascending);
                        var x_len = that.highlight_x_positions.length,
                            y_len = that.highlight_y_positions.length,
                            x = -5,
                            y = (that.highlight_y_positions[0] - 5),
                            width = (that.highlight_x_positions[x_len - 1] + 15 + that.txt_width),
                            height;
                        height = (that.highlight_y_positions[y_len - 1] - that.highlight_y_positions[0] + 10 + that.yScale.rangeBand()+that.height_factor);
                        that.group.append("rect")
                            .attr("class","highlight-rect")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("width", width)
                            .attr("height", height)
                            .attr("fill","none")
                            .attr("stroke", that.highlight_color)
                            .attr("stroke-width", "1.5")
                            .attr("stroke-dasharray", "5,5")
                            .attr("stroke-opacity",1);
                    }, that.transitions.duration());
                }
                return this;
            },
            legends: function () {
                if(PykCharts.boolean(that.legends_enable)) {
                    var params = that.getParameters(),color;
                    // console.log(params);
                    color = params.map(function (d) {
                        return d.color;
                    });
                    params = params.map(function (d) {
                        return d.name;
                    });

                    params = _.uniq(params);
                    // console.log(params)
                    // color = _.uniq(color);
                    var j = 0,k = 0;
                    j = params.length;
                    k = params.length;

                    if(that.legends_display === "vertical" ) {
                        // that.legendsContainer.attr("height", (params.length * 30)+20);
                        that.legendsGroup_height = (params.length * 30)+20;
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
                    else if(that.legends_display === "horizontal") {
                        that.legendsGroup_height = 50;
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

                    var legend = that.legendsGroup.selectAll("rect")
                                    .data(params);

                    legend.enter()
                            .append("rect");

                    legend.attr(rect_parameter1, rect_parameter1value)
                        .attr(rect_parameter2, rect_parameter2value)
                        .attr(rect_parameter3, rect_parameter3value)
                        .attr(rect_parameter4, rect_parameter4value)
                        .attr("fill", function (d,i) {
                            // console.log(color[i])
                            if(that.color_mode === "color")
                                return color[i];
                            else return color[0];
                        })
                        .attr("fill-opacity", function (d,i) {
                            // if(PykCharts.boolean(that.saturationEnable)){
                                if(that.color_mode === "saturation"){
                                return (that.no_of_groups-i)/that.no_of_groups;
                            }
                        });

                    legend.exit().remove();

                    that.legends_text = that.legendsGroup.selectAll(".legends_text")
                        .data(params);

                    that.legends_text
                        .enter()
                        .append('text')
                        .attr("class","legends_text")
                        .attr("pointer-events","none")
                        .attr("fill", that.legends_text_color)
                        .attr("font-family", that.legends_text_family)
                        .attr("font-size",that.legends_text_size)
                        .attr("font-weight", that.legends_text_weight);

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
        // for(var i in that.the_bars){
        for(var i=0;i<that.the_bars.length;i++) {
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
            for(var i = 0;i<layers.length;i++){
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

        // for(var i in the_bars){
        for(var i=0;i<the_bars.length;i++) {
            var bar = the_bars[i];
            if(!bar.id) continue;
            var id = bar.id;
            for(var k in bar){
                // console.log(bar,"bar");
                if(k === "id") continue;
                var icings = bar[k];
                // console.log(icings,"icings");
                // for(var j in icings){
                for(var j=0;j<icings.length;j++) {
                    var icing = icings[j];
                    if(!icing.name) continue;
                    var layer = findLayer(icing.name);
                    var index_group = that.unique_group.indexOf(that.keys[id])
                    layer.values.push({
                        "x": id,
                        "y": icing.val,
                        "group": that.keys[id],
                        "color": icing.color,
                        "tooltip": icing.tooltip,
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
        // for(var i in that.data){
        for(var i=0; i<that.data.length; i++) {
            var d = that.data[i];
            for(var cat_name in d){
                // console.log(d[cat_name], "cat_name");
                // for(var j in d[cat_name]){
                for(var j = 0; j < d[cat_name].length; j++) {    
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
        for(var i = 0; i<that.the_layers.length;i++){
            if(!that.the_layers[i].name) continue;
            var name = that.the_layers[i].name, color;
            for(var j = 0; j<that.the_layers[i].values.length;j++) {
                var name = that.the_layers[i].values[j].group, color;
                if(that.color_mode === "saturation") {
                    color = that.saturation_color;
                } else if(that.color_mode === "color" && that.the_layers[0].values[j].color){
                    color = that.the_layers[0].values[j].color;
                }
                p.push({
                    "name": name,
                    "color": color
                });
            }
        }
        // console.log(p,"p");
        return p;
    };
    this.emptygroups = function (data) {

        that.no_of_groups = d3.max(data,function (d){
            var value = _.values(d);
            return value[0].length;
        });

        that.group_data;

        for(var i =0; i<that.no_of_groups;i++) {
            if(_.values(data[i])[0].length === that.no_of_groups) {
                that.group_data = _.values(data[i])[0];
                break;
            }            
        }
        // console.log(that.group_data,"group");
        that.get_unique_group = _.map(that.group_data,function(d,i) {
            
            return _.keys(d)[0];
        });
        // console.log(that.get_unique_group);
        that.unique_color = _.map(that.group_data, function (d,i) {
            return d[_.keys(d)][0].color;
        });
        // console.log(data);
        for(var i = 0;i<data.length;i++) {
            var value = _.values(data[i]);
            var group = value[0];
            // console.log(value);
            if(value[0].length < that.no_of_groups) {
                for(var k=0; k<that.no_of_groups;k++) {         
                // console.log(group[k],"hello",group,k,data[i][0])       
                    var value = _.values(data[i]);
                    var group = value[0];
                    if(_.keys(group[k])[0] != that.get_unique_group[k]) {                        
                        var stack = { "name": "stack", "tooltip": "null", "color": that.unique_color[k], "val": 0, /*highlight: false*/ };
                        var missing_group = that.get_unique_group[k];
                        _.values(data[i])[0].splice(k, 0, {});
                        // _.values(data[i])[0][k] = {};
                        _.values(data[i])[0][k][missing_group] = [stack];
                        // console.log(_.values(data[i])[0],data[i],"jhol",[stack])
                    }
                }
            }
        }
        // console.log(data,"data")
        return data;
    };

    this.dataTransformation = function () {

        var data_tranform = [];
        that.barName = [];

        var data_length = that.data.length;
        that.unique_group = _.uniq(that.data, function (d) {
            return d.group;
        });

        if (PykCharts.boolean(that.data_sort_enable)) {
            switch (that.data_sort_type) {
                case "numerically":
                    if (that.unique_group.length === 1) {
                        that.data.sort(function (a,b) {
                            return ((that.data_sort_order === "descending") ? (b.x - a.x) : (a.x - b.x));
                        });
                    }
                    break;
                case "alphabetically":
                    that.data.sort(function (a,b) {
                        if (a.y < b.y) {
                            return (that.data_sort_order === "descending") ? 1 : -1;
                        }
                        else if (a.y > b.y) {
                            return (that.data_sort_order === "descending") ? -1 : 1;
                        }
                        else if (a.group < b.group) {
                            return (that.data_sort_order === "descending") ? 1 : -1;
                        }
                        else if (a.group > b.group) {
                            return (that.data_sort_order === "descending") ? -1 : 1;
                        }
                        return 0;
                    });
                    break;
                case "date":
                    that.data.sort(function (a,b) {
                        return ((that.data_sort_order === "descending") ? (new Date(b.y) - new Date(a.y)) : (new Date(a.y) - new Date(b.y)));
                    });
                    break;
            }
        }
        // console.log(that.data,"that.data")

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
            stack = { "name": that.data[i].stack, "tooltip": that.data[i].tooltip, "color": that.data[i].color, "val": that.data[i].x/*, highlight: that.data[i].highlight */};
            if(i === 0) {
                data_tranform.push(group);
                data_tranform[i][that.data[i].y].push(bar);
                data_tranform[i][that.data[i].y][i][that.data[i].group].push(stack);

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

        if(that.stop) 
            return;
        
        // that.grid_y_enable = options.chart_grid_y_enable ? options.chart_grid_y_enable : theme.stylesheet.chart_grid_y_enable;
        that.grid_color = options.chart_grid_color ? options.chart_grid_color : theme.stylesheet.chart_grid_color;

        if(that.mode === "default") {
           that.k.loading();
        }
        that.multiD = new PykCharts.multiD.configuration(that);
        d3.json(options.data, function(e, data){
            that.data = data.groupBy("column");
            that.compare_data = data.groupBy("column");
            that.axis_y_data_format = that.k.yAxisDataFormatIdentification(that.data);
            $(that.selector+" #chart-loader").remove();
            that.render();
        });
    };

    this.refresh = function () {
        d3.json(options.data, function (e, data) {
            that.data = data.groupBy("column");
            that.refresh_data = data.groupBy("column");
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }      
            that.data = that.dataTransformation();
            that.data = that.emptygroups(that.data);

            var fD = that.flattenData();
            that.the_bars = fD[0];
            that.the_keys = fD[1];
            that.the_layers = that.buildLayers(that.the_bars);
            if(that.no_of_groups === 1) {
                that.legends_enable = "no";
            }
            that.map_group_data = that.multiD.mapGroup(that.data);
            that.optionalFeatures()
                    .createChart()
                    .legends();

            that.k.yAxis(that.svgContainer,that.yGroup,that.yScaleInvert)
                .yGrid(that.svgContainer,that.group,that.yScaleInvert);
                // console.log("inside liveData");
        });
    };

    //----------------------------------------------------------------------------------------
    //4. Render function to create the chart
    //----------------------------------------------------------------------------------------
    this.render = function(){
        var that = this;
        that.map_group_data = that.multiD.mapGroup(that.data);
        that.data = that.dataTransformation();
        that.data = that.emptygroups(that.data);
        var fD = that.flattenData();
        that.the_bars = fD[0];
        that.the_keys = fD[1];
        that.the_layers = that.buildLayers(that.the_bars);
        that.border = new PykCharts.Configuration.border(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.mouseEvent1 = new PykCharts.multiD.mouseEvent(that);
        that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);

        
        if(that.no_of_groups === 1) {
            that.legends_enable = "no";
        }
        if(that.mode === "default") {
            that.k.title()
                .backgroundColor(that)
                .export(that,"#svgcontainer","columnChart")
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

            that.k.yAxis(that.svgContainer,that.yGroup,that.yScaleInvert)
                 .yAxisTitle(that.yGroup)
                // .xAxis(that.svgContainer,that.xGroup,that.xScale)
                .yGrid(that.svgContainer,that.group,that.yScaleInvert);

        } else if(that.mode === "infographics") {
            that.k.backgroundColor(that)
                .export(that,"#svgcontainer","columnChart")
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
            that.k.yAxis(that.svgContainer,that.yGroup,that.yScaleInvert)
                 .yAxisTitle(that.yGroup);
        }

        if(PykCharts.boolean(that.legends_enable)) {
            $(document).ready(function () { return that.k.resize(that.svgContainer,"",that.legendsContainer); })
            $(window).on("resize", function () { return that.k.resize(that.svgContainer,"",that.legendsContainer); });
        } else {
            $(document).ready(function () { return that.k.resize(that.svgContainer,""); })
            $(window).on("resize", function () { return that.k.resize(that.svgContainer,""); });
        }
    };

    this.optionalFeatures = function() {
        var that = this;
        var optional = {
            svgContainer: function (i) {
               $(that.selector).attr("class","PykCharts-twoD");
                that.svgContainer = d3.select(options.selector + " #tooltip-svg-container-" + i)
                    .append("svg:svg")
                    .attr("width",that.width )
                    .attr("height",that.height)
                    .attr("id","svgcontainer")
                    .attr("class","svgcontainer")
                    // .style("background-color",that.background_color)
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height);

                // $(options.selector).colourBrightness();
                return this;
            },
            createGroups: function (i) {
                // console.log(that.legendsGroup_height,"hello");
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
                        .attr("transform","translate(0,10)");
                        
                } else {
                    that.legendsGroup_height = 0;
                }
                return this;
            },
            axisContainer : function () {
                // console.log(that.x_axis_enable);
                if(PykCharts.boolean(that.axis_x_enable)) {
                    // console.log("hey");
                    var axis_line = that.group.selectAll(".axis-line")
                        .data(["line"]);

                    axis_line.enter()
                            .append("line");

                    axis_line.attr("class","axis-line")
                            .attr("x1",0)
                            .attr("y1",that.height-that.margin_top-that.margin_bottom-that.legendsGroup_height )
                            .attr("x2",that.width-that.margin_left-that.margin_right)
                            .attr("y2",that.height-that.margin_top-that.margin_bottom-that.legendsGroup_height)
                            .attr("stroke",that.axis_x_line_color);

                    axis_line.exit().remove();
                }

                if(PykCharts.boolean(that.axis_y_enable) || that.axis_y_enable) {
                    that.yGroup = that.group.append("g")
                        .attr("id","yaxis")
                        .attr("class","y axis");
                }
                if(that.axis_x_title) {
                    if (that.axis_x_position === "bottom") {
                        that.xGroup = that.group.append("g")
                            .attr("id","xaxis")
                            .attr("class", "x axis")
                            .style("stroke","none")
                            .append("text")
                                .attr("x", (that.width - that.margin_left - that.margin_right)/2)
                                .attr("y", that.height -that.margin_bottom - that.margin_top - that.legendsGroup_height)
                                // .attr("dy", -8)
                                .attr("dy", that.margin_top + 10)
                                .style("text-anchor", "end")
                                .style("fill",that.axis_x_title_color)
                                .style("font-weight",that.axis_x_title_weight)
                                .style("font-family",that.axis_x_title_family)
                                .style("font-size",that.axis_x_title_size)
                                .text(that.axis_x_title);

                    } else if(that.axis_x_position === "top") {
                        axis_line.attr("y1",0)
                            .attr("y2",0);

                        that.xGroup = that.group.append("g")
                            .attr("id","xaxis")
                            .attr("class", "x axis")
                            .style("stroke","none")
                            .append("text")
                                .attr("x", (that.width - that.margin_left - that.margin_right)/2)
                                .attr("y", -40)
                                // .attr("dy", -8)
                                .attr("dy", that.margin_top + that.legendsGroup_height + 10)
                                .style("text-anchor", "end")
                                .style("fill",that.axis_x_title_color)
                                .style("font-weight",that.axis_x_title_weight)
                                .style("font-family",that.axis_x_title_family)
                                .style("font-size",that.axis_x_title_size)
                                .text(that.axis_x_title);
                    }                    
                }
                return this;
            },
            createChart: function() {
                var w = that.width - that.margin_left - that.margin_right;
                var h = that.height - that.margin_top - that.margin_bottom - that.legendsGroup_height,j=that.no_of_groups+1;

                var the_bars = that.the_bars;
                var keys = that.the_keys;
                that.groups= that.getGroups();
                var layers = that.the_layers;
                
                that.stack_layout = d3.layout.stack() // Create default stack
                    .values(function(d){ // The values are present deep in the array, need to tell d3 where to find it
                        return d.values;
                    })(layers);

                var y_data = [];
                layers.map(function(e, i){ // Get all values to create scale
                    // for(i in e.values){
                    for(i=0;i<e.values.length;i++) {
                        var d = e.values[i];
                        y_data.push(d.y + d.y0); // Adding up y0 and y to get total height
                    }
                });

                that.xScale = d3.scale.ordinal()
                    .domain(the_bars.map(function(e, i){
                        return e.id || i; // Keep the ID for bars and numbers for integers
                    }))
                    .rangeBands([0,w],0.1);
                that.highlight_y_positions = [];
                that.highlight_x_positions = [];
                y_domain = [0,d3.max(y_data)]
                y_domain = that.k._domainBandwidth(y_domain,1);
                that.yScale = d3.scale.linear().domain(y_domain).range([0, h]);
                that.yScaleInvert = d3.scale.linear().domain([y_domain[1],y_domain[0]]).range([0, h]); // For the yAxis
                var zScale = d3.scale.category10();

                var group_arr = [], g, x, totalWidth, i;
                var x_factor = 0, width_factor = 0;
                if(that.no_of_groups === 1) {
                    x_factor = that.xScale.rangeBand()/4;
                    width_factor = (that.xScale.rangeBand()/(2*that.no_of_groups));
                };

                for(i in that.groups){
                    g = that.groups[i];
                    x = that.xScale(g[0]);
                    totalWidth = that.xScale.rangeBand() * g.length;
                    x = x + (totalWidth/2);
                    group_arr.push({x: x, name: i});
                }
                var len = w/group_arr.length;
                var bars = that.group.selectAll(".bars")
                    .data(layers);

                bars.attr("class","bars");
                bars.enter()
                        .append("g")
                        .attr("class", "bars");
                that.domain = group_arr.map(function (d) {
                    return d.name;
                });
                var rect = bars.selectAll("rect")
                    .data(function(d,i){
                        return d.values;
                    });
                
                rect.enter()
                    .append("svg:rect")
                    .attr("class","rect");

                rect.attr("height", 0).attr("y", h)
                    .attr("fill", function(d){
                        if(that.no_of_groups === 1) {
                            return that.fillColor.colorPieMS(d);
                        } else {
                            return that.fillColor.colorGroup(d);
                        }
                    })
                    .attr("fill-opacity", function (d,i) {
                        if (that.color_mode === "saturation") {
                        // if(PykCharts.boolean(that.saturationEnable))     {
                            
                            if(j>1) {
                                j--;
                                return j/that.no_of_groups;
                            } else {
                                j = that.no_of_groups+1;
                                j--;
                                return j/that.no_of_groups;
                            }
                        }
                    })
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-dasharray", that.border.style())
                    .attr("stroke-opacity",1)
                    .on('mouseover',function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(d.tooltip ? d.tooltip : d.y);
                            that.mouseEvent.axisHighlightShow(d.name,options.selector + " " + ".axis-text",that.domain,"column");
                        }
                    })
                    .on('mouseout',function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipHide(d);
                            that.mouseEvent.axisHighlightHide(options.selector + " " + ".axis-text","column");
                        }
                     })
                    .on('mousemove', function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    });

                rect
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("x", function(d) {
                        if(that.highlight.toLowerCase() === d.name.toLowerCase()) {
                            that.highlight_x_positions.push(that.xScale(d.x) - x_factor);
                        }
                        return that.xScale(d.x) - x_factor;
                    })
                    .attr("width", function(d) {
                        return that.xScale.rangeBand()+width_factor;
                    })
                    .attr("height", function(d){
                        return that.yScale(d.y);
                    })
                    .attr("y", function(d){
                        if(that.highlight.toLowerCase() === d.name.toLowerCase()) {
                            that.highlight_y_positions.push(that.yScale(d.y0+d.y));
                        }
                        return h - that.yScale(d.y0 + d.y);
                    });

                bars.exit()
                    .remove();
                var flag, length = group_arr.length,
                    largest = 0, rangeband = len;

                if(PykCharts.boolean(that.axis_x_enable)) {
                    var xAxis_label = that.group.selectAll("text.axis-text")
                        .data(group_arr);

                    xAxis_label.enter()
                            .append("text")

                    xAxis_label.attr("class", "axis-text")
                            .attr("x", function(d){
                                // console.log(d.x,"d.x");
                                return d.x;
                            })
                            .attr("text-anchor", "middle")
                            .attr("fill",that.axis_x_pointer_color)
                            .attr("font-size",that.axis_x_pointer_size)
                            .style("font-weight",that.axis_x_pointer_weight)
                            .style("font-family",that.axis_x_pointer_family)
                            .text(function(d){
                                // console.log(d.name,"name");
                                return d.name;
                            })
                            .text(function (d) {
                                largest = (this.getBBox().width > largest) ? this.getBBox().width : largest;
                            });
                    if (rangeband >= largest) { flag = 1; }
                    else if (rangeband >= (largest*0.75) && rangeband < largest) { flag = 2; }
                    else if (rangeband >= (largest*0.65) && rangeband < (largest*0.75)) { flag = 3; }
                    else if (rangeband >= (largest*0.55) && rangeband < (largest*0.65)) { flag = 4; }
                    else if (rangeband >= (largest*0.35) && rangeband < (largest*0.55)) { flag = 5; }
                    else if (rangeband <= 20 || rangeband < (largest*0.35)) { flag = 0; }

                    xAxis_label.text(function (d) {
                                if (flag === 0) {
                                    return "";
                                }
                                else if (rangeband >= this.getBBox().width && flag === 1) {
                                    return d.name;
                                }
                                else if (rangeband >= (this.getBBox().width*0.75) && rangeband < this.getBBox().width && flag === 2){
                                    return d.name.substr(0,5) + "..";
                                }
                                else if (rangeband >= (this.getBBox().width*0.65) && rangeband < (this.getBBox().width*0.75) && flag === 3){
                                    return d.name.substr(0,4) + "..";
                                }
                                else if (flag === 4){
                                    return d.name.substr(0,3);
                                }
                                else if (flag === 5){
                                    return d.name.substr(0,2);
                                }
                                else {
                                    return d.name;
                                }
                            })
                            .on('mouseover',function (d) {
                                that.mouseEvent.tooltipPosition(d);
                                that.mouseEvent.tooltipTextShow(d.name);
                            })
                            .on('mouseout',function (d) {
                                that.mouseEvent.tooltipHide(d);
                            })
                            .on('mousemove', function (d) {
                                that.mouseEvent.tooltipPosition(d);
                            });

                    xAxis_label.exit().remove();
                    if(that.axis_x_position==="top") {
                        if(that.axis_x_pointer_position === "top") {
                            xAxis_label.attr("y", function () {
                                return -15;
                            });
                        } else if(that.axis_x_pointer_position === "bottom") {
                            xAxis_label.attr("y", function () {
                                return 15;
                            });
                        }
                    }else {
                        if(that.axis_x_pointer_position === "top") {
                            xAxis_label.attr("y", function () {
                                return h-15;
                            });
                        } else if(that.axis_x_pointer_position === "bottom") {
                            xAxis_label.attr("y", function () {
                                return h+15;
                            });
                        }
                    }
                }   
                return this;
            },
            highlightRect : function () {
                if(that.no_of_groups > 1 && PykCharts.boolean(that.highlight)) {
                    setTimeout(function() {
                        function ascending( a, b ) {
                            return a - b;
                        }
                        that.highlight_x_positions.sort(ascending)
                        that.highlight_y_positions.sort(ascending);

                        var x_len = that.highlight_x_positions.length,
                            y_len = that.highlight_y_positions.length,
                            x = that.highlight_x_positions[0] - 5,
                            y = (that.height - that.margin_bottom - that.margin_top - that.legendsGroup_height - that.highlight_y_positions[y_len - 1] - 5),
                            height = (that.highlight_y_positions[y_len - 1] + 10);
                        width = (that.highlight_x_positions[x_len - 1] - that.highlight_x_positions[0] + 10 + that.xScale.rangeBand());
                        that.group.append("rect")
                            .attr("class","highlight-rect")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("width", width)
                            .attr("height", height)
                            .attr("fill","none")
                            .attr("stroke", that.highlight_color)
                            .attr("stroke-width", "1.5")
                            .attr("stroke-dasharray", "5,5")
                            .attr("stroke-opacity",1);
                    }, that.transitions.duration());
                }
                return this;
            },
            legends: function () {
                if(PykCharts.boolean(that.legends_enable)) {
                    var params = that.getParameters(),color;
                    // console.log(params);
                    color = params.map(function (d) {
                        return d.color;
                    });
                    params = params.map(function (d) {
                        return d.name;
                    });

                    params = _.uniq(params);
                    // color = _.uniq(color);
                    var j = 0,k = 0;
                    j = params.length;
                    k = params.length;

                    if(that.legends_display === "vertical" ) {
                        that.legendsGroup.attr("height", (params.length * 30)+20);
                        that.legendsGroup_height = (params.length * 30)+20;

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
                    else if(that.legends_display === "horizontal") {
                        that.legendsGroup_height = 50;
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

                    var legend = that.legendsGroup.selectAll("rect")
                                    .data(params);

                    legend.enter()
                            .append("rect");

                    legend.attr(rect_parameter1, rect_parameter1value)
                        .attr(rect_parameter2, rect_parameter2value)
                        .attr(rect_parameter3, rect_parameter3value)
                        .attr(rect_parameter4, rect_parameter4value)
                        .attr("fill", function (d,i) {
                            if(that.color_mode === "color")
                                return color[i];
                            else return color[0];
                        })
                        .attr("fill-opacity", function (d,i) {
                            if (that.color_mode === "saturation") {
                            // if(PykCharts.boolean(that.saturationEnable)){
                                return (that.no_of_groups-i)/that.no_of_groups;
                            }
                        });

                    legend.exit().remove();

                    that.legends_text = that.legendsGroup.selectAll(".legends_text")
                        .data(params);

                    that.legends_text
                        .enter()
                        .append('text')
                        .attr("class","legends_text")
                        .attr("pointer-events","none")
                        .attr("fill", that.legends_text_color)
                        .attr("font-family", that.legends_text_family)
                        .attr("font-size",that.legends_text_size)
                        .attr("font-weight", that.legends_text_weight);

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
        // for(var i in that.the_bars){
        for(var i=0;i<that.the_bars.length;i++) {
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
            // for(var i in layers){
            for(var i=0; i<layers.length; i++) {
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

        // for(var i in the_bars){
        for(var i=0; i<the_bars.length; i++) {
            // console.log(the_bars[i])
            var bar = the_bars[i];
            if(!bar.id) continue;
            var id = bar.id;
            for(var k in bar){
                if(k === "id") continue;
                var icings = bar[k];
                // for(var j in icings){
                for(var j=0;j<icings.length;j++) {
                    var icing = icings[j];
                    if(!icing.name) continue;
                    var layer = findLayer(icing.name);
                    var index_group = that.unique_group.indexOf(that.keys[id])
                    layer.values.push({
                        "x": id,
                        "y": icing.val,
                        "group": that.keys[id],
                        "color": icing.color,
                        "tooltip": icing.tooltip,
                        "name": bar.group
                        // "highlight": icing.highlight
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
        // for(var i in that.data){
        for(var i=0; i<that.data.length; i++) {
            var d = that.data[i];
            for(var cat_name in d){
                // for(var j in d[cat_name]){
                for(var j=0; j<d[cat_name].length; j++) {
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
        // for(var i in  that.the_layers){
        for(var i=0; i<that.the_layers.length; i++) {
            // console.log(that.the_layers[i]);
            if(!that.the_layers[i].name) continue;
            // for(var j in that.the_layers[i].values) {
            for(var j=0; j<that.the_layers[i].values.length; j++) {
                var name = that.the_layers[i].values[j].group, color;
                if(that.color_mode === "saturation") {
                    color = that.saturation_color;
                } else if(that.color_mode === "color" && that.the_layers[0].values[j].color){
                    color = that.the_layers[0].values[j].color;
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
        that.no_of_groups = d3.max(data,function (d){
            var value = _.values(d);
            return value[0].length;
        });

        that.group_data;

        for(var i =0; i<that.no_of_groups;i++) {
            if(_.values(data[i])[0].length === that.no_of_groups) {
                that.group_data = _.values(data[i])[0];
                break;
            }            
        }

        that.get_unique_group = _.map(that.group_data,function(d,i) {
            return _.keys(d)[0];
        });

        that.unique_color = _.map(that.group_data, function (d,i) {
            return d[_.keys(d)][0].color;
        });

        for(var i = 0;i<data.length;i++) {
            var value = _.values(data[i]);
            var group = value[0];

            if(value[0].length < that.no_of_groups) {
                for(var k=0; k<that.no_of_groups;k++) {         
                    var value = _.values(data[i]);
                    var group = value[0];
                    if(_.keys(group[k])[0] != that.get_unique_group[k]) {                        
                        var stack = { "name": "stack", "tooltip": "null", "color": that.unique_color[k], "val": 0, /*highlight: false*/ };
                        var missing_group = that.get_unique_group[k];
                        _.values(data[i])[0].splice(k, 0, {});
                        _.values(data[i])[0][k][missing_group] = [stack];
                    }
                }
            }
        }
        // console.log(data,"data")
        // console.log(data,"new_data");
        return data;
    };

    this.dataTransformation = function () {

        var data_tranform = [];
        that.barName = [];
        var data_length = that.data.length;
        that.unique_group = that.data.map(function (d) {
            return d.group;
        });
        that.unique_group = _.uniq(that.unique_group);
        
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
            stack = { "name": that.data[i].stack, "tooltip": that.data[i].tooltip, "color": that.data[i].color, "val": that.data[i].y/*, highlight: that.data[i].highlight */};

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
        that.bubbleRadius = options.scatterplot_radius ? options.scatterplot_radius : theme.multiDimensionalCharts.scatterplot_radius;

        try {
            if(!_.isNumber(that.bubbleRadius)) {
                that.bubbleRadius = theme.multiDimensionalCharts.scatterplot_radius;
                throw "scatterplot_radius"
            }
        } 

        catch (err) {
            that.k.warningHandling(err,"3");
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
        that.panels_enable =options.panels_enable && options.panels_enable.toLowerCase() ? options.panels_enable.toLowerCase() : multiDimensionalCharts.panels_enable;
        that.enableTicks =  options.scatterplot_pointer_enable ? options.scatterplot_pointer_enable.toLowerCase() : multiDimensionalCharts.scatterplot_pointer_enable;
        that.zoomed_out = true;

        if(PykCharts.boolean(that.panels_enable)) {
            that.radius_range = [that.k._radiusCalculation(1.1)*2,that.k._radiusCalculation(2.6)*2];
        } else {
            that.radius_range = [that.k._radiusCalculation(4.5)*2,that.k._radiusCalculation(11)*2];
        }
        d3.json(options.data, function (e, data) {
            that.data = data.groupBy("scatterplot");
            that.axis_y_data_format = options.axis_y_data_format ? options.axis_y_data_format.toLowerCase() : that.k.yAxisDataFormatIdentification(that.data);
            that.axis_x_data_format = options.axis_x_data_format ? options.axis_x_data_format.toLowerCase() : that.k.xAxisDataFormatIdentification(that.data);
            that.compare_data = data.groupBy("scatterplot");
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
        var multiDimensionalCharts = theme.multiDimensionalCharts,
            stylesheet = theme.stylesheet,
            optional = options.optional;
        // that.enableCrossHair = optional && optional.enableCrossHair ? optional.enableCrossHair : multiDimensionalCharts.enableCrossHair;
        that.multiD = new PykCharts.multiD.configuration(that);
        that.bubbleRadius = options.scatterplot_radius ? options.scatterplot_radius : (0.6 * multiDimensionalCharts.scatterplot_radius);
        that.panels_enable = options.panels_enable && options.panels_enable.toLowerCase() ? options.panels_enable : multiDimensionalCharts.panels_enable;

        try {
            if(!_.isNumber(that.bubbleRadius)) {
                that.bubbleRadius = (0.6 * multiDimensionalCharts.scatterplot_radius);
                throw "scatterplot_radius"
            }
        } 

        catch (err) {
            that.k.warningHandling(err,"3");
        }

        if(that.stop) {
            return;
        }

        that.zoomed_out = true;
        that.radius_range = [that.k._radiusCalculation(1.1)*2,that.k._radiusCalculation(3.5)*2];

        if(that.mode === "default") {
            that.k.loading();
        }

        d3.json(options.data, function (e, data) {
            that.data = data.groupBy("pulse");
            that.axis_y_data_format = options.axis_y_data_format ? options.axis_y_data_format.toLowerCase() : that.k.yAxisDataFormatIdentification(that.data);
            that.axis_x_data_format = options.axis_x_data_format ? options.axis_x_data_format.toLowerCase() : that.k.xAxisDataFormatIdentification(that.data);
            that.compare_data = data.groupBy("pulse");
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
            that.data = data.groupBy("scatterplot");
            that.refresh_data = data.groupBy("scatterplot");
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.map_group_data = that.multiD.mapGroup(that.data);
            
            that.optionalFeatures()
                    .createChart()
                    .legends()
                    .plotCircle()
                    .label()
                    .ticks();
            that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain,that.legendsGroup_height)
                    .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain)
        });
    };

    this.render = function () {
        // console.log(that.data);
        that.map_group_data = that.multiD.mapGroup(that.data); 
        that.fillChart = new PykCharts.Configuration.fillChart(that);

        that.border = new PykCharts.Configuration.border(that);
        that.uniq_group_arr = _.uniq(that.data.map(function (d) {
            return d.group;
        }));
        that.no_of_groups = 1;

        if(that.mode === "default") {
            if(PykCharts.boolean(that.panels_enable) && type === "scatterplot") {
                that.k.title()
                    .backgroundColor(that)
                    .export(that,"svgcontainer",type,that.panels_enable,that.uniq_group_arr)
                    .emptyDiv()
                    .subtitle();

                that.no_of_groups = that.uniq_group_arr.length;
                that.w = that.width/4;
                that.height = that.height/2;
                that.margin_left = that.margin_left;
                that.margin_right = that.margin_right;
//                that.radius_range = [20,35];
                for(i=0;i<that.no_of_groups;i++){
                    that.new_data = [];
                    for(j=0;j<that.data.length;j++) {
                        if(that.data[j].group === that.uniq_group_arr[i]) {
                            that.new_data.push(that.data[j]);
                        }
                    }
                    that.k.positionContainers(that.legends_enable,that);

                    that.k.makeMainDiv(that.selector,i);
                    
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

                    that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain,that.legendsGroup_height)
                        .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain)
                        .xAxisTitle(that.xGroup,that.legendsGroup_height)
                        .yAxisTitle(that.yGroup);
        
                    if((i+1)%4 === 0 && i !== 0) {
                        that.k.emptyDiv();
                    }
                }
                that.k.emptyDiv();
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
                  //  .zoom();

                if(type === "scatterplot") {
                    that.optionalFeatures().label();
                }

                that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain,that.legendsGroup_height)
                    .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain)
                    .xAxisTitle(that.xGroup,that.legendsGroup_height)
                    .yAxisTitle(that.yGroup);
                    // .yGrid(that.svgContainer,that.group,that.yScale)
                    // .xGrid(that.svgContainer,that.group,that.x);
            }

            that.k.createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();

            // that.optionalFeatures()
            //      .zoom();

        } else if (that.mode === "infographics") {
            
            if(PykCharts.boolean(that.panels_enable) && type === "scatterplot") {
                that.k.backgroundColor(that)
                    .export(that,"svgcontainer",type,that.panels_enable,that.uniq_group_arr)
                    .emptyDiv();

                that.no_of_groups = that.uniq_group_arr.length;
                that.w = that.width/4;
                that.height = that.height/2;
                that.margin_left = that.margin_left;
                that.margin_right = that.margin_right;
//                that.radius_range = [20,35];
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

                    that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain,that.legendsGroup_height)
                        .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain)
                        .xAxisTitle(that.xGroup,that.legendsGroup_height)
                        .yAxisTitle(that.yGroup);
        
                    if((i+1)%4 === 0 && i !== 0) {
                        that.k.emptyDiv();
                    }
                }
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
                  //  .zoom();

                if(type === "scatterplot") {
                    that.optionalFeatures().label();
                }

                that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain,that.legendsGroup_height)
                    .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain)
                    .xAxisTitle(that.xGroup,that.legendsGroup_height)
                    .yAxisTitle(that.yGroup);
            }

        }
        if(!PykCharts.boolean(that.panels_enable)) {
            if(type === "scatterplot" && PykCharts.boolean(that.legends_enable) && PykCharts.boolean(that.variable_circle_size_enable) && that.map_group_data[1]) {
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
                $(options.selector + " #tooltip-svg-container-" + i).css("width",that.w);
                $(options.selector).attr("class","PykCharts-weighted")

                that.svgContainer = d3.select(options.selector + " #tooltip-svg-container-" + i)
                    .append('svg')
                    .attr("width",that.w)
                    .attr("height",that.height)
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.w + " " + that.height)
                    .attr("id","svgcontainer" + i)
                    .attr("class","svgcontainer")
                    // .style("background-color",that.background_color);

                // $(options.selector).colourBrightness();

                return this;
            },
            createGroups : function (i) {
                that.group = that.svgContainer.append("g")
                    .attr("transform","translate("+(that.margin_left)+","+(that.margin_top+that.legendsGroup_height)+")")
                    .attr("id","main");

                that.ticksElement = that.svgContainer.append("g")
                    .attr("transform","translate("+(that.margin_left)+","+(that.margin_top)+")")
                    .attr("id","main2");

                if(PykCharts.boolean(that.axis_x_enable) || that.axis_x_title) {
                    that.xGroup = that.group.append("g")
                        .attr("class", "x axis")
                        .attr("id","xaxis")
                        .style("stroke","black");
                }
                
                if(PykCharts.boolean(that.axis_y_enable) || that.axis_y_title){
                    that.yGroup = that.group.append("g")
                        .attr("class", "y axis")
                        .attr("id","yaxis")
                        .style("stroke","blue");
                }

                that.clip = that.group.append("svg:clipPath")
                            .attr("id", "clip" + i + that.selector)
                            .append("svg:rect")
                            .attr("width",(that.w-that.margin_left-that.margin_right))
                            .attr("height", that.height-that.margin_top-that.margin_bottom - that.legendsGroup_height);

                that.chartBody = that.group.append("g")
                            .attr("id","clip"+i)
                            .attr("clip-path", "url(#clip" + i + that.selector +")");

                return this;
            },
            legendsContainer : function (i) {
                if (PykCharts.boolean(that.legends_enable) && that.map_group_data[1] && that.mode === "default") {
                    that.legendsGroup = that.svgContainer
                        .append("g")
                                .attr('id',"legends")
                                .attr("transform","translate(0,20)");
                } else {
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
                // that.max_radius = that.sizes(d3.max(that.weight));
                that.sorted_weight = that.weight.slice(0);
                that.sorted_weight.sort(function(a,b) { return a-b; });

                that.group.append("text")
                    .attr("fill", "black")
                    .attr("text-anchor", "end")
                    .attr("x", that.w - 70)
                    .attr("y", that.height + 40);
                    // .text(that.axis_x_label);

                if(that.zoomed_out === true) {
                    // var x_domain = d3.extent(that.data, function (d) {
                    //         return d.x;
                    //     });
                    // var y_domain = d3.extent(that.data, function (d) {
                    //         return d.y;
                    //     })
                    // var x_domain = [],y_domain,max,min,type;
                    var x_domain,x_data = [],y_data = [],y_range,x_range,y_domain;

                    if(that.axis_y_data_format === "number") {
                        y_domain = d3.extent(that.data, function(d) { return d.y });
                        y_data = that.k._domainBandwidth(y_domain,2,"number");
                        y_range = [that.height - that.margin_top - that.margin_bottom - that.legendsGroup_height, 0];
                        that.yScale = that.k.scaleIdentification("linear",y_domain,y_range);
                        that.extra_top_margin = 0;

                    } else if(that.axis_y_data_format === "string") {
                        that.data.forEach(function(d) { y_data.push(d.y); });
                        y_range = [0,that.height - that.margin_top - that.margin_bottom - that.legendsGroup_height];
                        that.yScale = that.k.scaleIdentification("ordinal",y_data,y_range,0);
                        that.extra_top_margin = (that.yScale.rangeBand() / 2);

                    } else if (that.axis_y_data_format === "time") {
                        y_data = d3.extent(that.data, function (d) { return new Date(d.x); });
                        y_range = [that.height - that.margin_top - that.margin_bottom - that.legendsGroup_height, 0];
                        that.yScale = that.k.scaleIdentification("time",y_data,y_range);
                        that.extra_top_margin = 0;
                    }
                    if(that.axis_x_data_format === "number") {
                        x_domain = d3.extent(that.data, function(d) { return d.x; });
                        x_data = that.k._domainBandwidth(x_domain,2);
                        x_range = [0 ,that.w - that.margin_left - that.margin_right];
                        that.x = that.k.scaleIdentification("linear",x_data,x_range);
                        that.extra_left_margin = 0;

                    } else if(that.axis_x_data_format === "string") {
                        that.data.forEach(function(d) { x_data.push(d.x); });
                        x_range = [0 ,that.w - that.margin_left - that.margin_right];
                        that.x = that.k.scaleIdentification("ordinal",x_data,x_range,0);
                        that.extra_left_margin = (that.x.rangeBand()/2);

                    } else if (that.axis_x_data_format === "time") {
                        max = d3.max(that.data, function(k) { return new Date(k.x); });
                        min = d3.min(that.data, function(k) { return new Date(k.x); }); 
                        x_domain = [min.getTime(),max.getTime()];
                        x_data = that.k._domainBandwidth(x_domain,2,"time");
                        x_range = [0 ,that.w - that.margin_left - that.margin_right];
                        that.x = that.k.scaleIdentification("time",x_data,x_range);
                        that.data.forEach(function (d) {
                            d.x = new Date(d.x);
                        });
                        that.extra_left_margin = 0;
                    }
                    that.xdomain = that.x.domain();
                    that.ydomain = that.yScale.domain();
                    that.x1 = 1;
                    that.y1 = 12;
                    that.count = 1;
                    if(type!== "pulse") {
                        var zoom = d3.behavior.zoom()
                                .x(that.x)
                                .y(that.yScale)
                                // .scaleExtent()
                                .scale(that.count)
                                .on("zoom",zoomed);
                    }
                    // console.log($("#svgcontainer0 .dot"));
                     // $("#svgcontainer0 .dot").dblclick(function(){
                     //    console.log(d3.event,"d33333 eeee");
                     //    // console.log("heyyyyyyyy");
                     //    return false;
                     // })

//        $("#svgcontainer0 .dot").off("dblclick");
    

                    if(PykCharts.boolean(that.zoom_enable) && !(that.axis_y_data_format==="string" || that.axis_x_data_format==="string") && (that.mode === "default") ) {                                           
                        var n;
                        if(PykCharts.boolean(that.panels_enable)) {
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
                   
                if (PykCharts.boolean(that.legends_enable) && that.map_group_data[1] && that.mode==="default") {
                    var unique = _.uniq(that.sorted_weight);
                    var k = 0;
                    var l = 0;

                    if(that.legends_display === "vertical" ) {
                        that.legendsGroup.attr("height", (that.map_group_data[0].length * 30)+20);
                        that.legendsGroup_height = (that.map_group_data[0].length * 30)+20;

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

                    } else if(that.legends_display === "horizontal") {
                        // that.legendsContainer.attr("height", (k+1)*70);
                        that.legendsGroup_height = 50;
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
                                    // that.legendsContainer.attr("height", (k+1)*50);
                                    that.legendsGroup.attr("height", (k+1)*50);
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
                    if(PykCharts.boolean(that.panels_enable)){
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
                    // console.log(that.map_group_data[0]);
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

                    legend.exit().remove();

                    that.legends_text
                        .enter()
                        .append('text')
                        .attr("class","legends_text")
                        .attr("pointer-events","none")
                        .attr("fill", that.legends_text_color)
                        .attr("font-family", that.legends_text_family)
                        .attr("font-size",that.legends_text_size)
                        .attr("font-weight", that.legends_text_weight);

                    that.legends_text.attr("class","legends_text")
                        .attr(text_parameter1, text_parameter1value)
                        .attr(text_parameter2, text_parameter2value)
                        .text(function (d) { return d.group });

                    that.legends_text.exit()
                                    .remove();
                }
                return this;
            },
            ticks : function () {
                if(PykCharts.boolean(that.enableTicks)) {
                    var tick_label = that.ticksElement.selectAll("text")
                        .data(that.new_data);

                    tick_label.enter()
                        .append("text");

                    tick_label.
                        attr("transform",function (d) {
                            return "translate(" + that.x(d.x) + "," + that.yScale(d.y) + ")";
                        })
                        .style("text-anchor", "middle")
                        .style("font-family", that.label_family)
                        .style("font-size",that.label_size)
                        .attr("pointer-events","none")
                        .attr("dx",-1)
                        .attr("dy",function (d) { return -that.sizes(d.weight)-4; });

                    tick_label.text(function (d) {return d.name; });

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
                    .attr("r", function (d) { return that.sizes(d.weight); })
                    .attr("cx", function (d) { return (that.x(d.x)+that.extra_left_margin); })
                    .attr("cy", function (d) { return (that.yScale(d.y)+that.extra_top_margin); })
                    .attr("fill", function (d) { return that.fillChart.colorPieW(d); })
                    .attr("fill-opacity", function (d) { return that.multiD.opacity(d.weight,that.weight,that.data); })
                    .attr("stroke", that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-dasharray", that.border.style())
                    .attr("stroke-opacity",1)
                    .on('mouseover',function (d) {
                        if(that.mode === "default" && PykCharts.boolean(that.tooltip_enable)) {
                            tooltipText = d.tooltip ? d.tooltip : "<table><thead><th colspan='2'><b>"+d.name+"</b></th></thead><tr><td>X</td><td><b>"+d.x+"</b></td></tr><tr><td>Y</td><td><b>"+d.y+"<b></td></tr><tr><td>Weight</td><td><b>"+d.weight+"</b></td></tr></table>";
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(tooltipText);
                            if(PykCharts.boolean(that.variable_circle_size_enable)){
                                d3.select(this).style("fill-opacity",1);
                            }
                        }
                    })
                    .on('mouseout',function (d) {
                        if(that.mode === "default" && PykCharts.boolean(that.tooltip_enable)) {
                            that.mouseEvent.tooltipHide(d);
                            if(PykCharts.boolean(that.variable_circle_size_enable)) {
                                d3.selectAll(".dot").style("fill-opacity",0.5);
                            }
                        }
                    })
                    .on('mousemove', function (d) {
                        if(that.mode === "default" && PykCharts.boolean(that.tooltip_enable)) {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    })
                    .on("dblclick",function() {
                        PykCharts.getEvent().stopPropagation();
                    })
                    .on("mousedown",function() {
                        PykCharts.getEvent().stopPropagation();
                    });

                that.circlePlot.exit().remove();
                return this;
            },
            label : function () {
                if(PykCharts.boolean(that.label_size)) {
                    that.circleLabel = that.chartBody.selectAll(".text")
                        .data(that.new_data);

                    that.circleLabel.enter()
                        .append("text")
                        .attr("class","text");

                    that.circleLabel
                        .attr("x", function (d) { return (that.x(d.x)+that.extra_left_margin); })
                        .attr("y", function (d) { return (that.yScale(d.y)+that.extra_top_margin + 5); })
                        .attr("text-anchor","middle")
                        .attr("pointer-events","none")
                        .style("font-weight", that.label_weight)
                        .style("font-size", that.label_size)
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

        if(PykCharts.boolean(that.panels_enable)) {
            n = that.no_of_groups;
        } else {
            n = 1;
        }
        for(var i = 0; i < n; i++) {
            var containerId = id.substring(0,idLength-1);
            current_container = d3.select(that.selector+" #"+containerId +i)

            
            that.k.isOrdinal(current_container,".x.axis",that.x);
    //        that.k.isOrdinal(current_container,".x.grid",that.x);

            that.k.isOrdinal(current_container,".y.axis",that.yScale);
    //        that.k.isOrdinal(current_container,".y.grid",that.yScale);

            that.optionalFeatures().plotCircle()
                                    .label();

            d3.select(that.selector+" #"+containerId +i)
                .selectAll(".dot")
                .attr("r", function (d) {
                    return that.sizes(d.weight)*PykCharts.getEvent().scale;
                })                    
                .attr("cx", function (d) { return (that.x(d.x)+that.extra_left_margin); })
                .attr("cy", function (d) { return (that.yScale(d.y)+that.extra_top_margin); });

            d3.select(that.selector+" #"+containerId +i)
                .selectAll(".text")
                .style("font-size", that.label_size)
                .attr("x", function (d) { return (that.x(d.x)+that.extra_left_margin); })
                .attr("y", function (d) { return (that.yScale(d.y)+that.extra_top_margin + 5); });
        }
        that.count++;
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
            .label();
        var currentSvg = d3.select(options.selector + " #svgcontainer" + i)
        var current_x_axis = currentSvg.select("#xaxis");
        var current_y_axis = currentSvg.select("#yaxis");
        that.k.xAxis(currentSvg,current_x_axis,that.x,that.extra_left_margin,that.xdomain,that.legendsGroup_height)
            .yAxis(currentSvg,current_y_axis,that.yScale,that.ydomain);
        d3.select(that.selector+" #svgcontainer" +i)
            .selectAll(".dot")
            .attr("r", function (d) {
                return that.sizes(d.weight);
            })                    
            .attr("cx", function (d) { return (that.x(d.x)+that.extra_left_margin); })
            .attr("cy", function (d) { return (that.yScale(d.y)+that.extra_top_margin); });

        d3.select(that.selector+" #svgcontainer" +i)
            .selectAll(".text")
            .style("font-size", that.label_size)
            .attr("x", function (d) { return (that.x(d.x)+that.extra_left_margin); })
            .attr("y", function (d) { return (that.yScale(d.y)+that.extra_top_margin + 5); });

    }
};
PykCharts.multiD.spiderWeb = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function () {
        var multiDimensionalCharts = theme.multiDimensionalCharts;
        that = new PykCharts.multiD.processInputs(that, options, "spiderweb");
        that.bubbleRadius = options.spiderweb_radius  ? options.spiderweb_radius : (0.6 * multiDimensionalCharts.scatterplot_radius);
        that.outerRadius = options.spiderweb_outer_radius_percent  ? options.spiderweb_outer_radius_percent : multiDimensionalCharts.spiderweb_outer_radius_percent;

        try {
            if(!_.isNumber(that.bubbleRadius)) {
                that.bubbleRadius = (0.6 * multiDimensionalCharts.scatterplot_radius);
                throw "spiderweb_radius"
            }
        } 

        catch (err) {
            that.k.warningHandling(err,"3");
        }

        try {
            if(!_.isNumber(that.outerRadius)) {
                that.bubbleRadius = multiDimensionalCharts.spiderweb_outer_radius_percent;
                throw "spiderweb_outer_radius_percent"
            }
        } 

        catch (err) {
            that.k.warningHandling(err,"3");
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
        // that.axisTitle = options.spiderweb_axis_title ? options.spiderweb_axis_title : theme.multiDimensionalCharts.spiderweb_axis_title;
        
        that.inner_radius = 0;
        // that.enableTicks =  options.spiderweb_pointer ? options.spiderweb_pointer : multiDimensionalCharts.spiderweb_pointer;
        // that.variable_circle_size_enable = options.variable_circle_size_enable ? options.variable_circle_size_enable : multiDimensionalCharts.variable_circle_size_enable;
        
        
        d3.json(options.data, function (e, data) {
            that.data = data.groupBy("spiderweb");
            that.compare_data = data.groupBy("spiderweb");
            $(that.selector+" #chart-loader").remove();
            that.render();
        });
    };

    that.refresh = function () {
        d3.json(options.data, function (e, data) {
            that.data = data.groupBy("spiderweb");
            that.refresh_data = data.groupBy("spiderweb");
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.map_group_data = that.multiD.mapGroup(that.data);
            that.optionalFeatures()
                .createChart()
                .legends()
                .xAxis()
                .yAxis();
                // .axisTicks()
                // .axisTitle();
        });
    };

    this.render = function () {
        that.fillChart = new PykCharts.Configuration.fillChart(that);
        
        that.border = new PykCharts.Configuration.border(that);
        that.map_group_data = that.multiD.mapGroup(that.data);

        if(that.mode === "default") {
            that.k.title()
                .backgroundColor(that)
                .export(that,"#svgcontainer","spiderweb")
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
            // that.height = that.height - that.legendsGroup_height - 20;
            that.outerRadius = that.k._radiusCalculation(that.outerRadius,"spiderweb");
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
                .export(that,"#svgcontainer","spiderweb")
                .emptyDiv();
            that.k.makeMainDiv(that.selector,1);
            that.h = that.height;
            that.optionalFeatures().svgContainer(1)
                .legendsContainer()
                .createGroups();
            // that.height = that.height - that.legendsGroup_height - 20;
            that.outerRadius = that.k._radiusCalculation(that.outerRadius,"spiderweb");
            that.radius_range = [(3*that.outerRadius)/100,(0.09*that.outerRadius)];
            that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range);
            that.optionalFeatures()
                .createChart()
                .xAxis()
                .yAxis();

            that.k.tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        }

        if(PykCharts.boolean(that.legends_enable)) {
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
                    .attr("id","svgcontainer")
                    .attr("width", that.width)
                    .attr("height", that.height)
                    // .style("background-color",that.background_color)
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height);

                // $(options.selector).colourBrightness();

                return this;
            },
            createGroups: function () {
                that.group = that.svgContainer.append("g")
                    .attr("id","spidergrp")
                    .attr("transform", "translate(" + that.width / 2 + "," + ((that.h+that.legendsGroup_height+20)/2) + ")");

                that.ticksElement = that.svgContainer.append("g")
                        .attr("transform", "translate(" + that.width / 2 + "," + ((that.h+that.legendsGroup_height+20)/2) + ")");
                return this;
            },
            legendsContainer : function (i) {
                if (PykCharts.boolean(that.legends_enable) && that.map_group_data[1] && that.mode === "default") {
                    that.legendsGroup = that.svgContainer.append("g")
                        .attr("class","legendgrp")
                        .attr("id","legendgrp");
                } else {
                    that.legendsGroup_height = 0;
                }
                return this;
            },
            createChart: function () {
                // console.log(that.height,that.outerRadius);
                var i, min, max;
                that.group_arr = [];
                that.uniq_group_arr = [];
                for(j=0; j<that.data.length; j++) {
                    that.group_arr[j] = that.data[j].group;
                }
                that.uniq_group_arr = _.uniq(that.group_arr);
                var len = that.uniq_group_arr.length;
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
                var uniq = that.new_data[0].data;

                max = d3.max(that.new_data, function (d,i) { return d3.max(d.data, function (k) { return k.y; })});
                min = d3.min(that.new_data, function (d,i) { return d3.min(d.data, function (k) { return k.y; })});

                that.yScale = d3.scale.linear()
                    .domain([min,max])
                    .range([that.inner_radius, that.outerRadius]);
                // console.log(that.yScale.range());
                that.y_domain = [], that.nodes = [];

                for (i=0;i<that.new_data.length;i++){
                    var t = [];
                    for (j=0;j<that.new_data[i].data.length;j++) {
                        t[j] = that.yScale(that.new_data[i].data[j].y);
                    }
                    that.y_domain[i] = t;
                }
                // console.log(that.y_domain[1], that.radius_range);
                for (i=0;i<that.new_data.length;i++){
                    that.y = d3.scale.linear()
                        .domain(d3.extent(that.y_domain[i], function(d) { return d; }))
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
                    var spiderNode = that.group.selectAll(".node"+m)
                        .data(that.nodes[m])

                    spiderNode.enter().append("circle")
                        .attr("class", "node"+m)
                        .attr("transform", function(d) { return "rotate(" + that.degrees(that.angle(d.x)) + ")"; })


                    spiderNode.attr("class","node"+m)
                        .attr("cx", function (d) { return that.radius(d.y); })
                        .attr("r", function (d,i) { return that.sizes(that.new_data[m].data[i].weight); })
                        .style("fill", function (d,i) {
                            return that.fillChart.colorPieW(that.new_data[m].data[i]);
                        })
                        .style("fill-opacity", function (d,i) {
                            return that.multiD.opacity(that.new_data[m].data[i].weight,that.weight,that.data);
                        })
                        .attr("stroke",that.border.color())
                        .attr("stroke-width",that.border.width())
                        .attr("stroke-dasharray", that.border.style())
                        .on('mouseover',function (d,i) {
                            if(that.mode === "default") {
                                that.mouseEvent.tooltipPosition(d);
                                that.mouseEvent.tooltipTextShow(d.tooltip);
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
                 // console.log("heyy",PykCharts.boolean(that.variable_circle_size_enable));
                if (PykCharts.boolean(that.legends_enable) && that.map_group_data[1] && that.mode==="default") {
                    // console.log("goes inside");
                    var unique = _.uniq(that.sorted_weight);
                    var k = 0;
                    var l = 0;
                    if(that.legends_display === "vertical" ) {
                        that.legendsGroup.attr("height", (that.map_group_data[0].length * 30)+20);
                        that.legendsGroup_height = (that.map_group_data[0].length * 30)+20;
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


                    } else if(that.legends_display === "horizontal") {
                         // that.legendsContainer.attr("height", (k+1)*70);
                        that.legendsGroup_height = 50;
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
                                    that.legendsGroup.attr("height", (l+1)*50);
                                    that.legendsGroup_height = (l+1)*50;
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

                    var legend = that.legendsGroup.selectAll("rect")
                            .data(that.map_group_data[0]);

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

                    legend.exit().remove();

                    that.legends_text = that.legendsGroup.selectAll(".legends_text")
                        .data(that.map_group_data[0]);

                    that.legends_text
                        .enter()
                        .append('text')
                        .attr("class","legends_text")
                        .attr("pointer-events","none")
                        .attr("fill",that.legends_text_color)
                        .attr("font-family", that.legends_text_family)
                        .attr("font-size",that.legends_text_size)
                        .attr("font-weight",that.legends_text_weight);

                    that.legends_text.attr("class","legends_text")
                        .attr(text_parameter1, text_parameter1value)
                        .attr(text_parameter2, text_parameter2value)
                        .text(function (d) { return d.group });

                    that.legends_text.exit()
                                    .remove();
                }
                return this;
            },
            xAxis : function () {
                // if(PykCharts.boolean(that.axisTitle)) {
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
                        .style("font-size",that.axis_x_pointer_size)
                        .style("font-family",that.axis_x_pointer_family)
                        .style("font-weight",that.axis_x_pointer_weight)
                        .style("fill",that.axis_x_pointer_color)

                    spiderAxisTitle
                        .text(function (d,i) { return that.new_data[0].data[i].x; });

                    spiderAxisTitle.exit().remove();
                // }
                return this;
            },
            yAxis: function () {
                // if (PykCharts.boolean(that.enableTicks)) {
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

                        //var levelFactor =   that.outerRadius*((i+1)/4));
                    tick_label
                        .style("text-anchor","start")
                        .attr("transform", "translate(5,"+(-that.outerRadius)+")") 
                        .attr("x",0)
                        .attr("y", function (d,i) { return (i*(that.outerRadius/4)); })
                        .attr("dy",-2);
                        // .attr("dy",function(d,i) {
                        //     if(i === 0) 2
                        //         return -20;
                        //     } else {
                        //         console.log(i,-20/(4*(5-(i))),(4*(5-(i))));
                        //         return -4;
                        //     }
                        // });

                    tick_label               
                        .text(function (d,i) { return d; })
                        .style("font-size",that.axis_y_pointer_size)
                        .style("font-family",that.axis_y_pointer_family)
                        .style("font-weight",that.axis_y_pointer_weight)
                        .style("fill",that.axis_y_pointer_color);

                    tick_label.exit().remove();
                // }
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
    //         d3.select(".clone #legendscontainer").attr("width",screen.width-200);
    //         d3.select(".clone #legendgrp").attr("transform","scale("+scaleFactor+")");
    //         d3.select(".clone #svgcontainer").attr("width",screen.width-200).attr("height",screen.height-200).style("display","block");
    //     }
    //     else if(that.legends.position == "left" || that.legends.position == "right") {
    //         d3.select(".clone #legendscontainer").attr("width",100).attr("height",screen.height-100);
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

    chartObject.assets_location = options.pykih_charts_assets_location ? options.pykih_charts_assets_location : stylesheet.pykih_charts_assets_location;

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
    chartObject.axis_x_pointer_position = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_pointer_position ? options.axis_x_pointer_position.toLowerCase() : stylesheet.axis_x_pointer_position;
    chartObject.axis_x_line_color = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_line_color ? options.axis_x_line_color.toLowerCase() : stylesheet.axis_x_line_color;
    // chartObject.axis_x_label_color = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_label_color ? options.axis_x_label_color.toLowerCase() : stylesheet.axis_x_label_color;
    chartObject.axis_x_no_of_axis_value = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_no_of_axis_value ? options.axis_x_no_of_axis_value : stylesheet.axis_x_no_of_axis_value;
    chartObject.axis_x_pointer_padding = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_pointer_padding ? options.axis_x_pointer_padding : stylesheet.axis_x_pointer_padding;
    chartObject.axis_x_pointer_length = "axis_x_pointer_length" in options && PykCharts.boolean(chartObject.axis_x_enable) ? options.axis_x_pointer_length : stylesheet.axis_x_pointer_length;
    // chartObject.axis_x_value_format = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_value_format ? options.axis_x_value_format : stylesheet.axis_x_value_format;
    chartObject.axis_x_pointer_values = PykCharts.boolean(chartObject.axis_x_enable) && options.axis_x_pointer_values ? options.axis_x_pointer_values : stylesheet.axis_x_pointer_values;
    chartObject.axis_x_outer_pointer_size = "axis_x_outer_pointer_size" in options && PykCharts.boolean(chartObject.axis_x_enable) ? options.axis_x_outer_pointer_size : stylesheet.axis_x_outer_pointer_size;

    chartObject.axis_x_pointer_size = "axis_x_pointer_size" in options ? options.axis_x_pointer_size : stylesheet.axis_x_pointer_size;
    chartObject.axis_x_pointer_weight = options.axis_x_pointer_weight ? options.axis_x_pointer_weight.toLowerCase() : stylesheet.axis_x_pointer_weight;
    chartObject.axis_x_pointer_family = options.axis_x_pointer_family ? options.axis_x_pointer_family.toLowerCase() : stylesheet.axis_x_pointer_family;
    chartObject.axis_x_pointer_color = options.axis_x_pointer_color ? options.axis_x_pointer_color : stylesheet.axis_x_pointer_color;

    chartObject.label_enable = options.label_enable ? options.label_enable.toLowerCase() : mapsTheme.label_enable;

    chartObject.border_between_chart_elements_thickness = "border_between_chart_elements_thickness" in options ? options.border_between_chart_elements_thickness : stylesheet.border_between_chart_elements_thickness;
    chartObject.border_between_chart_elements_color = options.border_between_chart_elements_color ? options.border_between_chart_elements_color : stylesheet.border_between_chart_elements_color;
    chartObject.border_between_chart_elements_style = options.border_between_chart_elements_style.toLowerCase() ? options.border_between_chart_elements_style : stylesheet.border_between_chart_elements_style;
    switch(chartObject.border_between_chart_elements_style) {
        case "dotted" : chartObject.border_between_chart_elements_style = "1,3";
                        break;
        case "dashed" : chartObject.border_between_chart_elements_style = "5,5";
                       break;
        default : chartObject.border_between_chart_elements_style = "0";
                  break;
    }
    chartObject.onhover = options.onhover ? options.onhover : mapsTheme.onhover;
    chartObject.default_zoom_level = options.default_zoom_level ? options.default_zoom_level : 80;

    chartObject.loading = options.loading_gif_url ? options.loading_gif_url: stylesheet.loading_gif_url;
    chartObject.highlight = options.highlight ? options.highlight : stylesheet.highlight;
    chartObject.highlight_color = options.highlight_color ? options.highlight_color: stylesheet.highlight_color;
    if (options &&  PykCharts.boolean (options.title_text)) {
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

    if (options && PykCharts.boolean(options.subtitle_text)) {
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
    // chartObject.units = options.units ? options.units : false;

    // chartObject.play_image_url = options.play_image_url ? options.play_image_url : mapsTheme.play_image_url;
    // chartObject.pause_image_url = options.pause_image_url ? options.pause_image_url : mapsTheme.pause_image_url;
    // chartObject.marker_image_url = options.marker_image_url ? options.marker_image_url : mapsTheme.marker_image_url;

    // chartObject.export_image_url = options.export_image_url ? options.export_image_url : stylesheet.export_image_url;
    chartObject.export_enable = options.export_enable ? options.export_enable.toLowerCase() : stylesheet.export_enable;

    chartObject.k = new PykCharts.Configuration(chartObject);


    chartObject.k.validator().validatingSelector(chartObject.selector.substring(1,chartObject.selector.length))
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
                .validatingDataType(chartObject.axis_x_outer_pointer_size,"axis_x_outer_pointer_size",stylesheet.axis_x_outer_pointer_size)
                .validatingDataType(chartObject.axis_x_pointer_padding,"axis_x_pointer_padding",stylesheet.axis_x_pointer_padding)
                .validatingDataType(chartObject.tooltip_position_top,"tooltip_position_top",mapsTheme.tooltip_position_top)
                .validatingDataType(chartObject.tooltip_position_left,"tooltip_position_left",mapsTheme.tooltip_position_left)
                .validatingColorMode(chartObject.color_mode,"color_mode",stylesheet.color_mode)
                .validatingLegendsPosition(chartObject.legends_display,"legends_display",stylesheet.legends_display)            
                .validatingTooltipMode(chartObject.tooltip_mode,"tooltip_mode",stylesheet.tooltip_mode)                .isArray(chartObject.axis_x_pointer_values,"axis_x_pointer_values")
                .isArray(chartObject.chart_color,"chart_color")
                .validatingXAxisPointerPosition(chartObject.axis_x_pointer_position,"axis_x_pointer_position",stylesheet.axis_x_pointer_position)
                .validatingFontWeight(chartObject.title_weight,"title_weight",stylesheet.title_weight)
                .validatingFontWeight(chartObject.subtitle_weight,"subtitle_weight",stylesheet.subtitle_weight)
                .validatingFontWeight(chartObject.axis_x_pointer_weight,"axis_x_pointer_weight",stylesheet.axis_x_pointer_weight)
                .validatingFontWeight(chartObject.legends_text_weight,"legends_text_weight",stylesheet.legends_text_weight)
                .validatingColor(chartObject.background_color,"background_color",stylesheet.background_color)
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
                    chartObject.k.warningHandling(err,"15");
                }
            }

            try {
                if(chartObject.onhover.toLowerCase() === "shadow" || chartObject.onhover.toLowerCase() === "none" || chartObject.onhover.toLowerCase() === "highlight_border" || chartObject.onhover.toLowerCase() === "color_saturation") {
                } else {
                    chartObject.onhover = mapsTheme.onhover;
                    throw "onhover";
                }
            }
            catch (err) {
                chartObject.k.warningHandling(err,"17");
            }

            try {
                if(!_.isNumber(chartObject.default_zoom_level)) {
                    chartObject.default_zoom_level = 80;
                    throw "default_zoom_level"
                }
            } 

            catch (err) {
                chartObject.k.warningHandling(err,"3");
            }


    chartObject.timeline_duration = (chartObject.timeline_duration * 1000);

    return chartObject;
};
PykCharts.maps.oneLayer = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function () {
        that = PykCharts.maps.processInputs(that, options);
        //$(that.selector).css("height",that.height);

        if(that.stop) {
            return
        }

        d3.json(options.data, function (data) {
            that.data = data;
            that.compare_data = data;
            that.k
                .totalColors(that.total_no_of_colors)
                .colorType(that.color_mode)
                .loading(that.loading)
                .tooltip();

            d3.json(that.assets_location+"ref/" + that.map_code + "-topo.json", function (data) {
                that.map_data = data;
                _.each(that.map_data.objects.geometries, function (d) {
                  var a = d.properties.NAME_1.replace("'","&#39;");
                  d.properties.NAME_1 = a;
                  return d;
                });
                d3.json(that.assets_location+"ref/colorPalette.json", function (data) {
                    that.color_palette_data = data;
                    var validate = _.where(that.color_palette_data,{name:that.palette_color});

                    try {
                        if (!validate.length) {
                            that.palette_color = theme.mapsTheme.palette_color;
                            throw "palette_color";
                        }
                    }
                    catch (err) {
                        that.k.warningHandling(err,"16");
                    }

                    $(that.selector).html("");
                    var oneLayer = new PykCharts.maps.mapFunctions(options,that,"oneLayer");
                    oneLayer.render();
                });
            });
            that.extent_size = d3.extent(that.data, function (d) { return parseInt(d.size, 10); });
            that.difference = that.extent_size[1] - that.extent_size[0];
        });
    };
};

PykCharts.maps.timelineMap = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function () {
        that = PykCharts.maps.processInputs(that, options);

        if(that.stop) {
            return;
        }
        //$(that.selector).css("height",that.height);
        d3.json(options.data, function (data) {
            that.timeline_data = data;
            that.compare_data = data;
            var x_extent = d3.extent(data, function (d) { return d.timestamp; });
            that.data = _.where(data, {timestamp: x_extent[0]});

            // that.margin = {top:10, right:30, bottom:10, left:30};

            that.redeced_width = that.width - (that.margin_left * 2) - that.margin_right;

            that.k
                .totalColors(that.total_no_of_colors)
                .colorType(that.color_mode)
                .loading(that.loading)
                .tooltip(that.tooltip_enable);

            d3.json(that.assets_location+"ref/" + that.map_code + "-topo.json", function (data) {
                that.map_data = data;
                _.each(that.map_data.objects.geometries, function (d) {
                  var a = d.properties.NAME_1.replace("'","&#39;");
                  d.properties.NAME_1 = a;
                  return d;
                });
                d3.json(that.assets_location+"ref/colorPalette.json", function (data) {
                    that.color_palette_data = data;
                    var validate = _.where(that.color_palette_data,{name:that.palette_color});

                    try {
                        if (!validate.length) {
                            that.palette_color = theme.mapsTheme.palette_color;
                            throw "palette_color";
                        }
                    }
                    catch (err) {
                        that.k.warningHandling(err,"16");
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
        });
    };
};

PykCharts.maps.mapFunctions = function (options,chartObject,type) {
    var that = chartObject;
    this.render = function () {

        that.border = new PykCharts.Configuration.border(that);

        that.k.title()
            .backgroundColor(that)
            // .subtitle();

        if(type === "oneLayer") {
            that.k
            .export(that,"#svgcontainer",type)
            .emptyDiv()
            .subtitle();
        }
        // console.log(that.color_palette_data,"color_palette_data",that.palette_color);
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

        if(PykCharts.boolean(that.legends_enable) && that.color_mode === "saturation") {
            $(document).ready(function () { return that.k.resize(that.svgContainer,"",that.legendsContainer); });
            $(window).on("resize", function () { return that.k.resize(that.svgContainer,"",that.legendsContainer); });
        } else {
            $(document).ready(function () { return that.k.resize(that.svgContainer,""); });
            $(window).on("resize", function () { return that.k.resize(that.svgContainer,""); });
        }

    };

    that.refresh = function () {

        if(type === "oneLayer") {
            d3.json(options.data, function (data) {
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
                // that.k.lastUpdatedAt("liveData");
            });
        } else {
            d3.json(options.data, function (data) {
                that.timeline_data = data;
                that.refresh_data = data;
                var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
                that.compare_data = compare[0];
                var data_changed = compare[1];
                var x_extent = d3.extent(data, function (d) { return d.timestamp; });
                that.data = _.where(data, {timestamp: x_extent[0]});
                that.optionalFeatures()
                    .legends(that.legends_enable)
                    .createMap();
                that.renderDataForTimescale();
                that.renderTimeline();

                if(data_changed) {
                    that.k.lastUpdatedAt("liveData");
                }

            });
        }
    };

    that.optionalFeatures = function () {
        var config = {
            legends: function (el) {
                if (PykCharts.boolean(el)) {
                    that.renderLegend();
                };
                return this;
            },
            legendsContainer : function (el) {
                if (PykCharts.boolean(el) && that.color_mode === "saturation") {
                    that.legendsContainer = that.svgContainer
                        .append("g")
                        .attr("id", "legend-container");
                } else {
                    that.legendsGroup_height = 0;
                }
                return this;
            },
            label: function (el) {
                if (PykCharts.boolean(el)) {
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
                //    .attr("transform","translate(0,"+that.legendsGroup_height+")");

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
                var scale = 150
                , offset = [that.width / 2, that.height / 2]
                , i;
                $(options.selector).css("background-color",that.background_color);

                that.group = that.map_cont.selectAll(".map_group")
                    .data(topojson.feature(that.map_data, that.map_data.objects).features)

                that.group.enter()
                    .append("g")
                    .attr("class","map_group")
                    .append("path");

                if (that.map_code==="world" || that.map_code==="world_without_antarctica") {
                    var center = [0,0];
                } else {
                    var center = d3.geo.centroid(topojson.feature(that.map_data, that.map_data.objects));
                }
                var projection = d3.geo.mercator().center(center).scale(scale).translate(offset);

                that.path = d3.geo.path().projection(projection);

                var bounds = that.path.bounds(topojson.feature(that.map_data, that.map_data.objects)),
                    hscale = scale * (that.width) / (bounds[1][0] - bounds[0][0]),
                    vscale = scale * (that.height) / (bounds[1][1] - bounds[0][1]),
                    scale = (hscale < vscale) ? hscale : vscale,
                    offset = [that.width - (bounds[0][0] + bounds[1][0]) / 2, that.height - (bounds[0][1] + bounds[1][1]) / 2];

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
                    //.attr("prev-fill",that.renderPreColor)
                    .attr("fill", that.renderColor)
                    .attr("prev_fill", function (d) {
                        return d3.select(this).attr("fill");
                    })
                    .attr("opacity", that.renderOpacity)
                    .style("stroke", that.border.color())
                    .style("stroke-width", that.border.width() + "px")
                    .style("stroke-dasharray", that.border.style())
                    .on("mouseover", function (d) {
                        if (PykCharts.boolean(that.tooltip_enable)) {
                            var tooltip_text = ((_.where(that.data, {iso2: d.properties.iso_a2})[0]).tooltip) ? ((_.where(that.data, {iso2: d.properties.iso_a2})[0]).tooltip) : ("<table><thead><th colspan='2'><b>"+d.properties.NAME_1+"</b></th></thead><tr><td>Size</td><td><b>"+((_.where(that.data, {iso2: d.properties.iso_a2})[0]).size)+"</b></td></tr></table>");
                            ttp.style("visibility", "visible");
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
                        that.bodColor(d);
                    })
                    .on("mouseout", function (d) {
                        if (PykCharts.boolean(that.tooltip_enable)) {
                            ttp.style("visibility", "hidden");
                        }
                        that.bodUncolor(d);
                    });
                that.group.exit()
                    .remove();
                return this;
            },
            enableClick: function (ec) {
                if (PykCharts.boolean(ec)) {
                    that.chart_data.on("click", that.clicked);
                    // that.onhover = "color_saturation";
                    that.onhover1 = that.onhover;
                };
                return this;
            },
            axisContainer : function (ae) {
                if(PykCharts.boolean(ae)){
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
        if (!PykCharts.boolean(d)) {
            return false;
        }
        var col_shade,
            obj = _.where(that.data, {iso2: d.properties.iso_a2});
        if (obj.length > 0) {
            if (that.color_mode === "color") {
                if(that.chart_color[0]) {
                    return that.chart_color[0];
                } else if (obj.length > 0 && PykCharts.boolean(obj[0].color)) {
                    return obj[0].color;
                }
                console.log(that.default_color[0]);
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
                                    return(that.current_palette.colors[that.current_palette.colors.length-1]);
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
            that.oneninth = +(d3.format(".2f")(that.difference / 10));
            that.opacity = (that.extent_size[0] + (_.where(that.data, {iso2: d.properties.iso_a2})[0]).size + that.oneninth) / that.difference;
            return that.opacity;
        }
        return 1;
    };

    that.renderLegend = function () {
        // var that = this,
            var k,
            onetenth;
        if (that.color_mode === "saturation") {

            if(that.legends_display === "vertical" ) {
                var j = 0, i = 0;
                if(that.palette_color === "") {
                    that.legendsContainer.attr("height", (9 * 30)+20);
                    that.legendsGroup_height = (9 * 30)+20;
                }
                else {
                    that.legendsContainer.attr("height", (that.current_palette.number * 30)+20);
                    that.legendsGroup_height = (that.current_palette.number * 30)+20;
                }
                text_parameter1 = "x";
                text_parameter2 = "y";
                rect_parameter1 = "width";
                rect_parameter2 = "height";
                rect_parameter3 = "x";
                rect_parameter4 = "y";
                rect_parameter1value = 13;
                rect_parameter2value = 13;
                text_parameter1value = function (d,i) { return that.width - (that.width/12) + 18; };
                rect_parameter3value = function (d,i) { return that.width - (that.width/12); };
                var rect_parameter4value = function (d) {j++; return j * 24 + 12;};
                var text_parameter2value = function (d) {i++; return i * 24 + 23;};

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
                temp_i = i;
                final_rect_x = 0;
                final_text_x = 0;
                legend_text_widths = [];
                text_parameter1 = "x";
                text_parameter2 = "y";
                rect_parameter1 = "width";
                rect_parameter2 = "height";
                rect_parameter3 = "x";
                rect_parameter4 = "y";
                var text_parameter1value = function () {
                    i--;
                    legend_text_widths[i]=this.getBBox().width;
                    final_text_x = (i === 0) ? (that.width - (legend_text_widths[i])) : (that.width - ((i*(legend_text_widths[i]+25))+legend_text_widths[i])-3);
                    return final_text_x;
                };
                text_parameter2value = 30;
                rect_parameter1value = 13;
                rect_parameter2value = 13;
                var rect_parameter3value = function () {
                    j--;
                    final_rect_x = (j === 0) ? (that.width - (legend_text_widths[j]+this.getBBox().width+2)) : (that.width - ((j*(legend_text_widths[j]+25))+legend_text_widths[j]+this.getBBox().width+5));
                    return final_rect_x;
                };
                rect_parameter4value = 18;

            };
            if (that.saturation_color !== "") {
                var leg_data = [1,2,3,4,5,6,7,8,9],
                    onetenth = d3.format(".1f")(that.extent_size[1] / 9);
                that.leg = function (d,i) { return "<" + d3.round(onetenth * (i+1)); };
                var legend = that.legendsContainer.selectAll(".rect")
                    .data(leg_data)

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

                that.legends_text.exit()
                    .remove();

                legend.enter()
                    .append("rect")

                legend.attr("class","rect")
                    .attr("x", rect_parameter3value)
                    .attr("y", rect_parameter4value)
                    .attr("width", rect_parameter1value)
                    .attr("height", rect_parameter2value)
                    .attr("fill", that.saturation_color)
                    .attr("opacity", function(d,i) { return (i+1)/9; });

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
                    .attr("fill", that.legends_text_color)
                    .text(that.leg)
                    .attr("font-family", that.legends_text_family)
                    .attr("font-size",that.legends_text_size)
                    .attr("font-weight", that.legends_text_weight)
                    .attr("x", text_parameter1value)
                    .attr("y",text_parameter2value);

                that.legends_text.exit()
                    .remove();

                legend.enter()
                    .append("rect")

                legend.attr("class","rect")
                    .attr("width", rect_parameter1value)
                    .attr("height", rect_parameter2value)
                    .attr("fill", function (d) { return d; })
                    .attr("x",rect_parameter3value)
                    .attr("y", rect_parameter4value);

                legend.exit()
                    .remove();
            }
            // $("#legend-container").after("</br>");
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
            .attr("pointer-events", "none")
            .text(function (d) { return d.properties.NAME_1.replace("&#39;","'"); });
    };

    that.bodColor = function (d) {
        // console.log(that.onhover1);
        var obj = _.where(that.data, {iso2: d.properties.iso_a2});
        if(that.onhover1 !== "none") {
            if (that.onhover1 === "highlight_border") {
                d3.select("path[area_name='" + d.properties.NAME_1 + "']")
                    .style("stroke", that.border.color())
                    .style("stroke-width", parseInt(that.border.width()) + 1.5 + "px")
                    .style("stroke-dasharray", that.border.style());
            } else if (that.onhover1 === "shadow") {
                d3.select("path[area_name='" + d.properties.NAME_1 + "']")
                    .attr('filter', 'url(#dropshadow)')
                    .attr("opacity", function () {
                        if (that.palette_color === "" && that.color_mode === "saturation") {
                            that.oneninth_dim = +(d3.format(".2f")(that.difference / 10));
                            that.opacity_dim = (that.extent_size[0] + (obj[0]).size + that.oneninth_dim) / that.difference;
                            return that.opacity_dim/2;
                        }
                        return 0.5;
                    });
            } else if (that.onhover1 === "color_saturation") {
                d3.select("path[area_name='" + d.properties.NAME_1 + "']")
                    .attr("opacity", function () {
                        if (that.saturation_color !== "" && that.color_mode === "saturation") {
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
    that.bodUncolor = function (d) {
        d3.select("path[area_name='" + d.properties.NAME_1 + "']")
            .style("stroke", that.border.color())
            .style("stroke-width", that.border.width())
            .style("stroke-dasharray", that.border.style())
            .attr('filter', null)
            .attr("opacity", function () {
                if (that.saturation_color !== "" && that.color_mode === "saturation") {
                    that.oneninth_high = +(d3.format(".2f")(that.difference / 10));
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
            /*console.log(e);*/
        }
    };

    that.backgroundColor =function () {
        var bg,child1;
        bgColor(options.selector);

        function bgColor(child) {
            child1 = child;
            bg = $(child).css("background-color");
            // console.log("what is bg", child,bg);
            if (bg === "transparent" || bg === "rgba(0, 0, 0, 0)") {
                // console.log($(child)[0].parentNode.tagName,"is parent node body");
                if($(child)[0].parentNode.tagName === undefined || $(child)[0].parentNode.tagName.toLowerCase() === "body") {
                // if (document.getElementsByTagName("body").parentNode === null){
                    // console.log("is it going");
                    $(child).colourBrightness("rgb(255,255,255)");
                } else {
                    // console.log($(child)[0].parentNode,"child");
                    return bgColor($(child)[0].parentNode);
                }
            } else {
                // console.log("bg",bg);
               return $(child).colourBrightness(bg);
            }
                }
        if ($(child1)[0].classList.contains("light")) {
            that.play_image_url = that.assets_location+"img/play.png";
            that.pause_image_url = that.assets_location+"img/pause.png";
            that.marker_image_url = that.assets_location+"img/marker.png";
        } else {
            // console.log("dark");
            that.play_image_url = that.assets_location+"img/play-light.png";
            that.pause_image_url = that.assets_location+"img/pause-light.png";
            that.marker_image_url = that.assets_location+"img/marker-light.png";
        }

    }
    that.renderDataForTimescale = function () {
        that.unique = [];
        x_extent = d3.extent(that.timeline_data, function(d) { return d.timestamp; });
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
        console.log("heyy");
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
                // that.play.attr("xlink:href","https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/assets/images/play.gif");
                clearInterval(that.play_interval);
                that.timeline_status = "paused";
                that.interval_index = interval;
            } else {
                that.timeline_status = "playing";
                that.play.attr("xlink:href",that.pause_image_url);
                // that.play.attr("xlink:href","https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/assets/images/pause.gif");
                interval = that.interval_index;
                interval1 = that.interval_index;

                that.play_interval = setInterval(function () {
                    that.marker
                        // .transition()
                        // .duration(that.timeline.duration/2)
                        .attr("x",  (that.margin_left*2) + that.xScale(that.unique[interval]) - 7);

                    that.data = _.where(that.timeline_data, {timestamp:that.unique[interval]});
                    that.data.sort(function (a,b) {
                        return a.timestamp - b.timestamp;
                    });
                    _.each(that.data, function (d) {
                        d3.select("path[iso2='"+d.iso2+"']")
                            // .transition()
                            // .duration(that.timeline.duration/4)
                            .attr("fill", that.renderColor);
                    });

                    interval++;

                    if (interval===that.unique.length) {
                        clearInterval(that.play_interval);
                    };
                }, that.timeline_duration);

                var time_lag = setTimeout(function () {
                    var undo_heatmap = setInterval(function () {
                        interval1++;
                        var play1;
                        if (interval1 === interval) {
                            clearInterval(undo_heatmap);
                            clearTimeout(time_lag);
                        }

                        if (interval1 === that.unique.length) {
                            clearInterval(undo_heatmap);
                            that.play.attr("xlink:href",that.play_image_url);
                            that.marker.attr("x",  (that.margin_left*2) + that.xScale(that.unique[0]) - 7);
                            interval = interval1 = that.interval_index = 1;
                            that.timeline_status = "";
                        };
                    }, that.timeline_duration);
                },that.timeline_duration);
            }
        }
        // duration = unique.length * 1000;
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
                var x = PykCharts.getEvent().pageX - (that.margin_left),
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
                            _.each(that.data, function (d) {
                                d3.select("path[iso2='"+d.iso2+"']")
                                    .attr("fill", that.renderColor);
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
                            _.each(that.data, function (d) {
                                d3.select("path[iso2='"+d.iso2+"']")
                                    .attr("fill", that.renderColor);
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

(function () {

    var urls = [
        'https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/jquery-1.11.1.min.js'
      , 'https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/d3.min.js'
      , '../pykih-charts/assets/lib/underscore.min.js'
      , 'https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/topojson.js'
      , 'https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/custom-hive.min.js'
      , '../lib/jquery.colourbrightness.js'
    ];

    function importFiles (url) {
        var include = document.createElement('script');
        include.type = 'text/javascript';
        include.async = false;
        include.onload = include.onreadystatechange = function () {
            try {
                if (_ && d3 && ($ || jQuery) && d3.customHive && topojson && $("body").colourBrightness) {
                    PykCharts.numberFormat = d3.format(",");
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
    for (var i = 0; i < urls.length; i++) {
        try {
            if ((!$ && !jQuery) || !d3 || !_ || !d3.customHive || !topojson || !$("body").colourBrightness) {
                importFiles(urls[i]);
            }
        }
        catch (e) {
            importFiles(urls[i]);
        }
    }
})();
