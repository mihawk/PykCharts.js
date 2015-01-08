/* ====================================================
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
    return (false_values.indexOf(value) > -1)? false : true;
};

PykCharts.getEvent = function () {
  try {
    return d3.event || event;
  } catch (e) {
    return event;
  }
}

PykCharts.Configuration = function (options){
    var that = this,
        options_selector = options.selector;

    var configuration = {
        liveData: function (chart) {
            var frequency = options.real_time_charts_refresh_frequency;
            if(PykCharts['boolean'](frequency)) {
                PykCharts.interval = setInterval(chart.refresh,frequency*1000);
            }
            return this;
        },
        emptyDiv: function (id) {
            d3.select(id).append("div")
                .style("clear","both");

            return this;
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
                }
                    label = text;
            return label;
        },
        title: function () {
            if(PykCharts['boolean'](options.title_text) && options.title_size) {
            var div_width = PykCharts['boolean'](options.export_enable) ? 0.9*options.chart_width : options.chart_width; 
                that.titleDiv = d3.select(options.selector)
                    .append("div")
                        .attr("id","title")
                        .style({
                            "width": (div_width) + "px",
                            "text-align":"left",
                            "float":"left"                          
                        })
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
                        .style({
                            "width": options.chart_width + "px",
                            "text-align": "left"                            
                        })
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
                .attr({
                    "id" : "footer", 
                    "width": options.chart_width + "px"                                            
                })
                .style("background", options.bg);
            return this;
        },
        lastUpdatedAt: function (a) {
            if(PykCharts['boolean'](options.real_time_charts_refresh_frequency) && PykCharts['boolean'](options.real_time_charts_last_updated_at_enable)) {
                var currentdate = new Date();
                var date = currentdate.getDate() + "/"+(currentdate.getMonth()+1)
                        + "/" + currentdate.getFullYear() + " "
                        + currentdate.getHours() + ":"
                        + currentdate.getMinutes() + ":" + currentdate.getSeconds();
                if(a === "liveData"){
                    document.querySelectorAll(options.selector+" #lastUpdatedAt").innerHTML = "<span style='pointer-events:none;'>Last Updated At: </span><span style='pointer-events:none;'>"+ date +"</span>";
                } else {
                    d3.select(options.selector+" #footer")
                        .append("tr")
                        .attr("class","PykCharts-credits")
                        .html("<td colspan=2 style='text-align:right' id='lastUpdatedAt'><span style='pointer-events:none;'>Last Updated At: </span><span style='pointer-events:none;'>"+ date +"</span></tr>")
                }
            }
            return this;
        },
        checkChangeInData: function (data, compare_data) { // this function checks if the data in json has been changed
            var key1 = Object.keys(compare_data[0]),
                key2 = Object.keys(data[0]),
                changed = false,
                data_length = data.length,
                key1_length = key1.length;

            if(key1.length === key2.length && compare_data.length === data.length) {
                for(var i=0;i<data_length;i++) {
                    for(var j=0;j<key1_length;j++){
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
                    .attr({
                        "class" : "PykCharts-credits",
                        "id" : "credit-datasource"
                    })
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
                if(d3.selectAll(options.selector+" #footer").length) {
                    d3.select(options.selector+" table #credit-datasource")
                        .style({
                            "background" : options.bg,
                            "text-align" : "right"
                        })
                        .append("td")
                        .html("<span style='pointer-events:none;'>Source: </span><a href='" + options.data_source_url + "' target='_blank' onclick='return " + enable +"'>"+ options.data_source_name +"</a></tr>");
                }
                else {
                    d3.select(options.selector).append("table")
                        .attr({
                            "id" : "footer",
                            "class" : "PykCharts-credits",
                            "width" : options.chart_width + "px"
                        })
                        .style({
                            "background" : options.bg,
                            "text-align" : "right"
                        })
                        .append("tr")
                        .append("td")
                        .html("<span style='pointer-events:none;'>Source: </span><a href='" + options.data_source_url + "' target='_blank' onclick='return " + enable +"'>"+ options.data_source_name +"</a></tr>");
                }
            }
            return this;
        },
        makeMainDiv: function (selection,i) {
            var d = d3.select(selection).append("div")
                .attr({
                    "id" : "tooltip-svg-container-"+i,
                    "class" : "main-div"
                })
                .style("width",options.chart_width);

            if(PykCharts['boolean'](options.panels_enable)){
                d.style({
                    "float": "left",
                    "width": "auto"
                });
            }
            return this;
        },
        tooltip: function (d,selection,i,flag) {
            if((PykCharts['boolean'](options.tooltip_enable) || options.axis_x_data_format === "string" || options.axis_y_data_format === "string" || PykCharts['boolean'](options.annotation_enable)) && options.mode === "default") {
                if(selection !== undefined){
                    var selector = options.selector.substr(1,options.selector.length),
                        id = "tooltip-svg-container-" + i + "-pyk-tooltip"+selector;
                } else {
                    id = "pyk-tooltip";
                }
                PykCharts.Configuration.tooltipp = d3.select("body")
                        .append("div")
                        .attr({
                            "id" : id,
                            "class" : "pyk-tooltip"
                        });
    
            } else if (PykCharts['boolean'](options.tooltip_enable)) {
                    PykCharts.Configuration.tooltipp = d3.select("body")
                        .append("div")
                        .attr({
                            "id" : "pyk-tooltip",
                            "class" : "pyk-tooltip"
                        });
            }
            return this;
        },
        dateConversion: function (d) {
            d = new Date(d);
            var time_zone = d.getTimezoneOffset();
            d = new Date(d.getTime() + (time_zone * 60 * 1000));
            return d;
        },        
        loading: function () {
            d3.select(options.selector).style("height",options.chart_height);
            var loading_content = options.loading_type === "image" ? "<img src=" + options.loading_source + ">" : options.loading_source;
            d3.select(options.selector).html("<div id='chart-loader'>" + loading_content + "</div>");
            var initial_height_div = document.querySelector(options.selector).offsetHeight;
            d3.select(options.selector + " #chart-loader").style({"visibility":"visible","padding-left":(options.chart_width/2) +"px","padding-top":(initial_height_div/2) + "px"});
            return this;
        },
        remove_loading_bar: function (id) {
            var loading = document.querySelector(options.selector+" #chart-loader");
            loading.parentNode.removeChild(loading);
            document.getElementById(id).style.height = "auto";
        },
        yGrid: function (svg, gsvg, yScale,legendsGroup_width) {
            var width = options.chart_width,
                height = options.chart_height;
            if(PykCharts['boolean'](options.chart_grid_y_enable)) {
                var ygrid = PykCharts.Configuration.makeYGrid(options,yScale,legendsGroup_width);
                gsvg.selectAll(options.selector + " g.y.grid-line")
                    .style("stroke",function () { return options.chart_grid_color; })
                    .call(ygrid);
            }
            return this;
        },
        xGrid: function (svg, gsvg, xScale,legendsGroup_height) {
            var width = options.chart_width,
                height = options.chart_height;

            if(PykCharts['boolean'](options.chart_grid_x_enable)) {
                var xgrid = PykCharts.Configuration.makeXGrid(options,xScale,legendsGroup_height);
                gsvg.selectAll(options.selector + " g.x.grid-line")
                    .style("stroke",function () { return options.chart_grid_color; })
                    .call(xgrid);
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
        resize: function (svg) {
            var aspect = (options.chart_width/options.chart_height),
                targetWidth = document.querySelector(options.selector).offsetWidth,
                a = d3.selectAll(options.selector + " #footer"),
                b = d3.selectAll(options.selector + " .main-div"),
                title_div_width;

            if(targetWidth > options.chart_width) {
                targetWidth = options.chart_width;
            }
            if(PykCharts['boolean'](svg)) {
                svg.attr({
                    "width" : targetWidth,
                    "height" : (targetWidth / aspect)
                });
            }
            if(PykCharts['boolean'](options.title_text)) {
                if(PykCharts['boolean'](options.export_enable)) {
                    title_div_width = 0.9*targetWidth;
                    d3.select(options.selector + " #title").style("width",title_div_width);
                }
            }
            if(PykCharts['boolean'](options.subtitle_text)) {
                title_div_width = 0.9*targetWidth;
                d3.select(options.selector + " #sub-title").style("width", title_div_width);
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

                d3.select(options.selector + " #export").style({
                    "width": div_size,
                    "left":div_left,
                     "float":div_float
                });
 
                d3.select(options.selector + " .dropdown-multipleConatiner-export")
                        .style("left",(targetWidth - 80)+"px");
            }
        
            if(a) {
                a.attr("width",targetWidth);
            }
        
            if(b && !(PykCharts['boolean'](options.panels_enable))) {
                var select = document.querySelector(options.selector + " .main-div");
                if(select) {
                    select.style.width = targetWidth;
                }
            }
        },
        __proto__: {
            _domainBandwidth: function (domain_array, count, type) {
                addFactor = 0;
                if(type === "time") {
                    var a = domain_array[0],
                        b = domain_array[1], new_array = [];
                    padding = (b - a) * 0.1;
                    switch( count ) {
                        case 0: new_array[0] = a - (padding + addFactor);
                        break;
                        case 1:  new_array[1] = b + (padding + addFactor);
                        break;
                        case 2: 
                            new_array[0] = a - (padding + addFactor);
                            new_array[1] = b + (padding + addFactor); 
                            break;
                    }
                    return [options.k.dateConversion(new_array[0]),options.k.dateConversion(new_array[1])];
                }else {
                    padding = (domain_array[1] - domain_array[0]) * 0.1;
                    switch( count ) {
                        case 0: domain_array[0] -= (padding + addFactor);
                        break;
                        case 1: domain_array[1] = parseFloat(domain_array[1],10) + (padding + addFactor);
                        break;
                        case 2: 
                            domain_array[0] -= (padding + addFactor);
                            domain_array[1] = parseFloat(domain_array[1],10) + (padding + addFactor);
                            break;
                    }
                    return domain_array;
                }
            },
            _radiusCalculation: function (radius_percent,type) {
                var min_value;
                if(type === "percentageBar") {
                    min_value = options.chart_height;
                } else if(type === "spiderweb") {
                    min_value = d3.min([(options.chart_width - options.legendsGroup_width),(options.chart_height-options.legendsGroup_height-20)])
                } else if(type !== undefined) {
                    min_value = options.chart_width;
                } else {
                    min_value = d3.min([options.chart_width,options.chart_height]);
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
                },
                properties = dimensions[chart],
                groups = [];
                var len = arr.length;
                for(var i = 0; i<len; i+=1){
                    var obj = arr[i];
                    if(groups.length == 0){
                        groups.push([obj]);
                    }
                    else{
                        var equalGroup = false,
                            glen = groups.length;
                        for(var a = 0;a<glen;a+=1){
                            var group = groups[a],
                            equal = true,
                            firstElement = group[0];
                            properties.forEach(function(property){
                                if(firstElement[property] !== obj[property]){
                                    equal = false;
                                }
                            });
                            if(equal){
                                equalGroup = group;
                            }
                        }
                        equalGroup ? equalGroup.push(obj) : groups.push([obj]);
                    }
                }

                for(i in groups) {
                    if (groups[i].constructor === Array) {
                        obj = {};
                        var grp = groups[i],
                        chart_name = charts[chart];
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
            },
            _unique : function (data) {
                var n = {},r=[];
                    for(var i = 0,len=data.length; i < len; i++) 
                    {   
                        if (!n[data[i]]) 
                        {
                            n[data[i]] = true; 
                            r.push(data[i]); 
                        }
                    }
                    return r;
            },
            _ready: function (fn) {
                function completed() {
                    document.removeEventListener( "DOMContentLoaded", completed, false );
                    window.removeEventListener( "load", completed, false );
                }

                if ( document.addEventListener ) {
                    document.addEventListener( "DOMContentLoaded", completed, false );
                    window.addEventListener( "load", completed, false );
                    fn;
                } else if ( document.attachEvent ) { // if IE event model is used
                  document.attachEvent("onreadystatechange", function(){
                    if ( document.readyState === "complete" ) {
                        document.detachEvent( "onreadystatechange", arguments.callee );
                        fn;
                    }
                  });
                }
            return this;
        }
        },
        backgroundColor: function (options) {
            d3.select(options.selector).style({"background-color":options.background_color,"position":"relative"})
                var bg,child1;
                bgColor(options.selector);

                function bgColor(child) {
                    child1 = child;
                    bg = $(child).css("background-color");
                    // console.log(document.querySelector(child),$(child))
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
                var id = "export",
                div_size = options.chart_width,
                div_float ="none",
                div_left = options.chart_width-16;
                
                d3.select(options.selector)
                        .append("div")
                        .style("left",options.chart_width - 80 + "px")
                        .attr("class","dropdown-multipleConatiner-export")
                
                if(PykCharts['boolean'](panels_enable)) {
                    var containers_length = containers.length;
                    for(var i = 0; i < containers_length; i++) {
                        d3.select(options.selector + " .dropdown-multipleConatiner-export")
                            .append("span")
                            .attr("id",chart_name + i)
                            .on("mouseover",function () {
                                d3.select(this).style("background-color","#E0E0E1");
                            })
                            .on("mouseout",function() {
                                d3.select(this).style('background-color',"#fff")
                            })
                            .style({
                                "margin-bottom" : "3px",
                                "cursor" : "pointer"
                            })
                            .html("Panel " + (i+1) + "<br>");
                    }
                } else {
                    d3.select(options.selector + " .dropdown-multipleConatiner-export")
                        .append("span")
                        .attr("id","span")
                        .on("mouseover",function () {
                            d3.select(this).style("background-color","#E0E0E1");
                        })
                        .on("mouseout",function() {
                            d3.select(this).style('background-color',"#fff")
                        })
                        .style({
                                "margin-bottom" : "3px",
                                "cursor" : "pointer"
                        })
                        .html("Export as SVG" + "<br>");
                }

                if(PykCharts['boolean'](options.title_text) && options.title_size  && options.mode === "default") {
                    div_size = 0.1*options.chart_width;
                    div_float ="left";
                    div_left = 0;
                }

                var export_div = d3.select(chart.selector)
                    .append("div")
                    .attr("id",id)
                    .style({
                        "width":div_size + "px",
                        "left":div_left+"px",
                        "float":div_float,
                        'text-align':'right'
                    })
                               
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
                var get_canvas = document.getElementById(canvas_id);
                paper.setup(get_canvas);
                var project = new paper.Project();
                project._view._viewSize.width = chart.chart_width + add_extra_width;
                project._view._viewSize.height = chart.chart_height +  add_extra_height;

                var name = chart_name + ".svg";

                $(chart.selector + " #"+id).click(function () {
                    PykCharts.export_menu_status = 1;
                    d3.select(options.selector + " .dropdown-multipleConatiner-export").style("visibility", "visible");
                });

                if(!PykCharts['boolean'](panels_enable)) {
                    d3.selectAll(chart.selector + " #span").on("click",function () {
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
                    var containers_length = containers.length;
                    for(var i = 0; i<containers_length; i++) {
                        d3.selectAll(chart.selector + " #"+chart_name + i).on("click",function () {
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
            var x = svg.querySelectorAll("text"),
                x_length = x.length;
            for (var i = 0; i < x_length; i++) {
                if(x[i].hasAttribute("dy")) {
                    var attr_value = x[i].getAttribute("dy"),
                        attr_length = attr_value.length;
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
                        if(mode === "default" || mode === "infographics") {
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
                            if(axis_data_format === "number" || axis_data_format === "string" || axis_data_format === "time") {
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
                            if(color_mode === "color" || color_mode === "saturation") {
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
                            if(axis_pointer_position === "left" || axis_pointer_position === "right" ) {
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
                            if(axis_pointer_position === "top" || axis_pointer_position === "bottom") {
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
                            if(border_between_chart_elements_style === "1,3" || border_between_chart_elements_style === "5,5" || border_between_chart_elements_style === "0") {
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
                            if(legends_display === "horizontal" || legends_display === "vertical") {
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
                            if(!(value.constructor === Array)) {
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
                            if(axis_time_value_datatype === "date" || axis_time_value_datatype === "year" || axis_time_value_datatype === "month" || axis_time_value_datatype === "hours" || axis_time_value_datatype === "minutes") {
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
                            if(tooltip_mode === "fixed" || tooltip_mode === "moving") {
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
                        if(font_weight === "bold" || font_weight === "normal") {
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
                        if(mode === "absolute" || mode === "percentage") {
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
                        if(mode === "default" || mode === "interactive") {
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
                    return (options.stop) ? false : true;
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
                }
                else {
                    that.tooltip
                        .style({
                            "display" : "block",
                            "top" : (PykCharts.getEvent().pageY - 20) + "px",
                            "left" : (PykCharts.getEvent().pageX + 30) + "px"
                        });
                }
                return that.tooltip;
            }

        },
        tooltipTextShow: function (d,panels_enable,type,group_index) {
            var selector = options.selector.substr(1,options.selector.length)
            if(PykCharts['boolean'](options.tooltip_enable) || PykCharts['boolean'](options.annotation_enable) || options.axis_x_data_format === "string" || options.axis_y_data_format === "string") {
                if(panels_enable === "yes" && type === "multilineChart") {
                    d3.selectAll("#tooltip-svg-container-"+group_index +"-pyk-tooltip"+selector).html(d);
                } else {
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
                    top_shift_from_first_panel
                    containerOffsetTop = $(options.selector).offset().top;
                    // console.log(selectSVG,document.querySelectorAll(options.selector + " #"+dataLineGroup[0][0][0].parentNode.parentNode.id))
                if (!PykCharts['boolean'](panels_enable)) {
                    width_percentage = selectSVG.width() / options.chart_width;
                    height_percentage = selectSVG.height() / options.chart_height;
                } else {
                    top_shift_from_first_panel = $("svg#svg-0").offset().top;
                    width_percentage = 1;
                    height_percentge = 1;
                }
                var legendsGroup_height = options.legendsGroup_height ? options.legendsGroup_height: 0,
                    offsetLeft =  (options.chart_margin_left + lineMargin + selectSVG.offset().left) * width_percentage,
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
                                                this.tooltipPosition(tooltipText,pos_line_cursor_x,(y),60,-15,group_index,width_percentage,height_percentage,type);
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
                                                        if (a%3 == 0 && a != 0) {
                                                        ++multiply_by;
                                                        final_displacement = multiply_value * multiply_by;
                                                        }
                                                        pos_line_cursor_y = (yScale(new_data[a].data[b].y) + top);
                                                        this.tooltipPosition(tooltipText,(pos_line_cursor_x+left_offset-15-30),(pos_line_cursor_y+top_shift_from_first_panel+final_displacement-containerOffsetTop),-15,-15,a,width_percentage,height_percentage,type);
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
                                                this.tooltipPosition(tooltipText,-options.chart_margin_left,(pos_line_cursor_y),-14,23,group_index,width_percentage,height_percentage,type);
                                            } else if((options.tooltip_mode).toLowerCase() === "moving") {
                                                this.tooltipPosition(tooltipText,(pos_line_cursor_x-options.chart_margin_left + 10),(pos_line_cursor_y-5),0,-45,group_index,width_percentage,height_percentage,type);
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
                                            this.tooltipPosition(tooltipText,pos_line_cursor_x,(y),60,70,group_index,width_percentage,height_percentage);
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
                    else if(type === "multilineChart" /*|| type === "stackedAreaChart"*/) {
                        if(panels_enable === "no") {
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
                        else if(panels_enable === "yes") {
                            d3.selectAll(options.selector+" .line-cursor").style("display","block");
                            d3.selectAll(options.selector+" .cross-hair-v")
                                .attr({
                                    "x1" : (x1 - 5),
                                    "y1" : y1,
                                    "x2" : (x2 - 5),
                                    "y2" : y2
                                });
                            d3.select(options.selector+" #svg-"+group_index+" .cross-hair-h")
                                .attr({
                                    "x1" : options.chart_margin_left,
                                    "y1" : cy,
                                    "x2" : (options.w - options.chart_margin_right),
                                    "y2" : cy
                                });
                            d3.select(options.selector+" #svg-"+group_index+" .focus").style("display","block")
                                .attr("transform", "translate(" + (cx - 5) + "," + cy + ")");
                        }
                    } else if (type === "stackedAreaChart") {
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
                } else if(type === "multilineChart" || type === "stackedAreaChart") {
                    d3.selectAll(options.selector+" .line-cursor").style("display","none");
                    d3.selectAll(options.selector+" .focus").style("display","none");
                }
            }
            return this;
        },
        axisHighlightShow: function (active_tick,axisHighlight,domain,a) {
            var curr_tick,prev_tick,axis_pointer_color,selection,axis_data_length,active_tick_length;
            if(PykCharts['boolean'](options.axis_onhover_highlight_enable)/* && options.mode === "default"*/){
                if(axisHighlight === options.selector + " .y.axis"){
                    selection = axisHighlight+" .tick text";
                    axis_pointer_color = options.axis_y_pointer_color;
                    axis_data_length = d3.selectAll(selection)[0].length;
                    active_tick_length = active_tick.length;
                    // console.log(active_tick,"active_tick");
                    d3.selectAll(selection)
                        .style("fill","#bbb")
                        .style("font-weight","normal");
                    for(var b=0;b < axis_data_length;b++) {
                        for(var a=0;a < active_tick_length;a++) {
                            if(d3.selectAll(selection)[0][b].__data__ == active_tick[a]) {
                                d3.select(d3.selectAll(selection)[0][b])
                                    .style("fill",axis_pointer_color)
                                    .style("font-weight","bold");
                            }
                        }
                    }
                }
                else {
                    if(axisHighlight === options.selector + " .x.axis") {
                        selection = axisHighlight+" .tick text";
                        axis_pointer_color = options.axis_x_pointer_color;
                    } else if(axisHighlight === options.selector + " .axis-text" && a === "column") {
                        selection = axisHighlight;
                        axis_pointer_color = options.axis_x_pointer_color;
                    } else if(axisHighlight === options.selector + " .axis-text" && a === "bar") {
                        selection = axisHighlight;
                        axis_pointer_color = options.axis_y_pointer_color;
                    }
                    if(prev_tick !== undefined) {
                        d3.select(d3.selectAll(selection)[0][prev_tick])
                            .style({
                                "fill" : axis_pointer_color,
                                "font-weight" : "normal"
                            });
                    }
                    axis_data_length = d3.selectAll(selection)[0].length;
                    var len = domain.length;
                    if(options.axis_x_data_format === "number" && a === undefined) {
                        for(var curr_tick=0;curr_tick< axis_data_length;curr_tick++) {
                            if(d3.selectAll(selection)[0][curr_tick].__data__ == active_tick) {
                                break;
                            }
                        }
                    } else{
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
                        .style({
                            "fill" : axis_pointer_color,
                            "font-weight" : "bold"
                        });
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
                    .style({
                        "fill" : fill_color,
                        "font-weight" : font_weight
                    });
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
                    return d3.select(this).attr("data-fill-opacity");
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
                    return d3.select(this).attr("data-fill-opacity");
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
            if(chart_type !== "lineChart" && chart_type !== "areaChart" && d.name.toLowerCase() === options.highlight.toLowerCase()) {
                return options.highlight_color;
            } else if(options.color_mode === "saturation") {
                return options.saturation_color;
            } else if(options.color_mode === "color") {
                return d.color;
            }
        },
        colorGroup: function (d) {
            if(options.color_mode === "saturation") {
                return options.saturation_color;
            } else if(options.color_mode === "color") {
                return d.color;
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
                    .tickSize(options.chart_height - options.chart_margin_top - options.chart_margin_bottom - legendsGroup_height)
                    .outerTickSize(0);

    d3.selectAll(options.selector + " .x.axis .tick text")
                    .attr("font-size",options.axis_x_pointer_size + "px")
                    .style({
                        "font-weight" : options.axis_x_pointer_weight,
                        "font-family" : options.axis_x_pointer_family
                    });

    return xgrid;
};

configuration.makeYGrid = function(options,yScale,legendsGroup_width) {
    var that = this, size;
    if(!legendsGroup_width) {
        legendsGroup_width = 0;
    }

    if(PykCharts['boolean'](options.panels_enable)) {
        size = options.w - options.chart_margin_left - options.chart_margin_right - legendsGroup_width;
    } else {
        size = options.chart_width - options.chart_margin_left - options.chart_margin_right - legendsGroup_width;
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
                    .style({
                        "font-weight" : options.axis_x_pointer_weight,
                        "font-family" : options.axis_x_pointer_family
                    });


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