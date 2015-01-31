PykCharts.multiD.line = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function (pykquery_data) {
        that = new PykCharts.validation.processInputs(that, options, 'multiDimensionalCharts');
        PykCharts.crossHair(that);
        PykCharts.annotation(that);
        PykCharts.scaleFunction(that);
        PykCharts.grid(that);
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
        that.curvy_lines_enable = options.curvy_lines_enable ? options.curvy_lines_enable.toLowerCase() : multiDimensionalCharts.curvy_lines_enable;
        that.interpolate = PykCharts['boolean'](that.curvy_lines_enable) ? "cardinal" : "linear";
        that.panels_enable = "no";

        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data),
                id = that.selector.substring(1,that.selector.length);
            if(that.stop || validate === false) {
                // that.k.remove_loading_bar(id);
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

        if (PykCharts.boolean(options.interactive_enable)) {
            that.k.dataFromPykQuery(pykquery_data);
            that.k.dataSourceFormatIdentification(that.data,that,"executeData");
        } else {
            that.k.dataSourceFormatIdentification(options.data,that,"executeData");
        }   
    };
};

PykCharts.multiD.multiSeriesLine = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function (){
        that = new PykCharts.validation.processInputs(that, options, 'multiDimensionalCharts');
        PykCharts.crossHair(that);
        PykCharts.annotation(that);
        PykCharts.scaleFunction(that);
        PykCharts.grid(that);
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
        that.curvy_lines_enable = options.curvy_lines_enable ? options.curvy_lines_enable.toLowerCase() : multiDimensionalCharts.curvy_lines_enable;
        that.interpolate = PykCharts['boolean'](that.curvy_lines_enable) ? "cardinal" : "linear";
        that.panels_enable = "no";

        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data),
                id = that.selector.substring(1,that.selector.length);
            if(that.stop || validate === false) {
                that.k.remove_loading_bar(id);
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

        that = new PykCharts.validation.processInputs(that, options, 'multiDimensionalCharts');

        PykCharts.crossHair(that);
        PykCharts.annotation(that);
        PykCharts.scaleFunction(that);
        PykCharts.grid(that);
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
        that.curvy_lines_enable = options.curvy_lines_enable ? options.curvy_lines_enable.toLowerCase() : multiDimensionalCharts.curvy_lines_enable;
        that.interpolate = PykCharts['boolean'](that.curvy_lines_enable) ? "cardinal" : "linear";
        that.panels_enable = "yes";

        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data),
                id = that.selector.substring(1,that.selector.length);
            if(that.stop || validate === false) {
                that.k.remove_loading_bar(id);
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
    var that = chartObject,
        id = that.selector.substring(1,that.selector.length);

    that.compare_data = that.data;
    that.data_length = that.data.length;
    that.k.remove_loading_bar(id);

    that.dataTransformation = function () {
        that.group_arr = [], that.new_data = [];
        that.ticks = [], that.x_arr = [];

        for(j = 0;j < that.data_length;j++) {
            that.group_arr[j] = that.data[j].name;
        }
        that.uniq_group_arr = that.k.__proto__._unique(that.group_arr);
        that.uniq_color_arr = [];
        var uniq_group_arr_length = that.uniq_group_arr.length;

        for(var k = 0;k < that.data_length;k++) {
            that.x_arr[k] = that.data[k].x;
        }
        var uniq_x_arr = that.k.__proto__._unique(that.x_arr);

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
            var uniq_x_arr_copy = that.k.__proto__._unique(that.x_arr)
            ,   every_data_length = that.new_data[a].data.length
            for(var b = 0;b < every_data_length;b++) {
                for(var k = 0;k < uniq_x_arr_length;k++) {
                    if(that.new_data[a].data[b].x == uniq_x_arr_copy[k]) {
                        uniq_x_arr_copy[k] = undefined;
                        break;
                    }
                }
            }
            for (var i = 0; i < uniq_x_arr_length ; i++) {
                if (uniq_x_arr_copy[i] != undefined) {
                    var temp_obj_to_insert_in_new_data = {
                        x: uniq_x_arr_copy[i],
                        y: 0,
                        tooltip: 0,
                        annotation: ""
                    };
                    that.new_data[a].data.splice(i, 0, temp_obj_to_insert_in_new_data);
                }
            }
        }

        for (var k = 0;k < that.new_data_length;k++) {
            that.new_data[k].data = that.k.__proto__._sortData(that.new_data[k].data, "x", "name", that);
        }
    };

    that.render = function () {
        var id = that.selector.substring(1,that.selector.length);
        that.container_id = id + "_svg";
        that.dataLineGroup = [],that.clicked;
        that.multid = new PykCharts.multiD.configuration(that);
        that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);
        that.transitions = new PykCharts.Configuration.transition(that);
        if(that.mode === "default") {

            that.k.title();

            if(PykCharts['boolean'](that.panels_enable)) {
                that.w = that.chart_width/3;
                that.chart_height = that.chart_height/2;
                that.chart_margin_left = that.chart_margin_left;
                that.chart_margin_right = that.chart_margin_right;

                that.k.backgroundColor(that)
                    .export(that,that.container_id+"-","lineChart",that.panels_enable,that.new_data)
                    .emptyDiv(options.selector)
                    .subtitle();

                d3.select(that.selector).append("div")
                        .attr("id","panels_of_line_main_div")

                that.k.liveData(that);
                that.optionalFeature().chartType();
                that.reducedWidth = that.w - that.chart_margin_left - that.chart_margin_right;
                that.reducedHeight = that.chart_height - that.chart_margin_top - that.chart_margin_bottom;
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
                    .export(that,"#"+that.container_id+"-1","lineChart")
                    .emptyDiv(options.selector)
                    .subtitle();

                that.w = that.chart_width;
                that.reducedWidth = that.w - that.chart_margin_left - that.chart_margin_right;
                that.reducedHeight = that.chart_height - that.chart_margin_top - that.chart_margin_bottom;

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
                    .export(that,"#"+that.container_id+"-","lineChart",that.panels_enable,that.new_data)
                    .emptyDiv(options.selector);

                that.w = that.chart_width/3;
                that.chart_height = that.chart_height/2;
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
                that.reducedWidth = that.w - that.chart_margin_left - that.chart_margin_right;
                that.reducedHeight = that.chart_height - that.chart_margin_top - that.chart_margin_bottom;
                that.fill_data = [];

                that.renderPanelOfLines();
            } else {

                that.k.backgroundColor(that)
                    .export(that,"#"+that.container_id+"-0","lineChart")
                    .emptyDiv(options.selector);

                that.w = that.chart_width;
                that.reducedWidth = that.w - that.chart_margin_left - that.chart_margin_right;
                that.reducedHeight = that.chart_height - that.chart_margin_top - that.chart_margin_bottom;

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
            var resize = that.k.resize(that.svgContainer);
            that.k.__proto__._ready(resize);
            window.addEventListener('resize', function(event){
                return that.k.resize(that.svgContainer);
            });
        } else {
            var resize = that.k.resize(null);
            that.k.__proto__._ready(resize);
            window.addEventListener('resize', function(event){
                return that.k.resize(null);
            });
        }
    };

    that.refresh = function (pykquery_data) {
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
                    var element = document.querySelector(that.selector + " #panels_of_line_main_div #tooltip-svg-container-"+i);
                    element.parentNode.removeChild(element);
                }               
                that.renderPanelOfLines();
            }

            if(that.type === "multilineChart" && !PykCharts['boolean'](that.panels_enable)) {
                document.querySelector(that.selector +" #tooltip-svg-container-1").innerHTML = null;
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
        if (PykCharts.boolean(options.interactive_enable)) {
            that.k.dataFromPykQuery(pykquery_data);
            that.k.dataSourceFormatIdentification(that.data,that,"executeRefresh");
        } else {
            that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
        }   
    };

    that.optionalFeature = function (){
        var id = that.selector.substring(1,that.selector.length);
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
                    document.getElementById(id).className = "PykCharts-twoD PykCharts-line-chart PykCharts-multi-series2D";
                }
                else if(that.type === "lineChart") {
                    document.getElementById(id).className = "PykCharts-twoD PykCharts-line-chart";
                }

                that.svgContainer = d3.select(that.selector+" #tooltip-svg-container-"+i)
                    .append("svg:svg")
                    .attr({
                        "id": that.container_id+"-" + i,
                        "width": that.w,
                        "height": that.chart_height,
                        "class": "svgcontainer",
                        "preserveAspectRatio": "xMinYMin",
                        "viewBox": "0 0 " + that.w + " " + that.chart_height
                    });

                if(PykCharts['boolean'](that.pointer_overflow_enable) && !PykCharts['boolean'](that.panels_enable)) {
                    that.svgContainer.style("overflow","visible");
                }

                return this;
            },
            createGroups : function (i) {
                that.group = that.svgContainer.append("g")
                    .attr({
                        "id": that.type+"-svg",
                        "transform": "translate("+ that.chart_margin_left +","+ that.chart_margin_top +")"
                    });

                if(PykCharts['boolean'](that.chart_grid_y_enable)){
                    that.group.append("g")
                        .attr({
                            "id": "ygrid",
                            "class": "y grid-line"
                        });
                }
                if(PykCharts['boolean'](that.chart_grid_x_enable)){
                    that.group.append("g")
                        .attr({
                            "id": "xgrid",
                            "class": "x grid-line"
                        });
                }

                that.clip = that.svgContainer.append("svg:clipPath")
                    .attr("id","clip" + i + that.selector)
                    .append("svg:rect")
                    .attr({
                        "width": that.reducedWidth,
                        "height": that.reducedHeight
                    });

                that.chartBody = that.svgContainer.append("g")
                    .attr({
                        "id": "clipPath",
                        "clip-path": "url(#clip" + i + that.selector + ")",
                        "transform": "translate("+ that.chart_margin_left +","+ that.chart_margin_top +")"
                    });

                return this;
            },
            axisContainer : function () {

                if(PykCharts['boolean'](that.axis_x_enable) || that.axis_x_title){
                    that.xGroup = that.group.append("g")
                        .attr({
                            "id": "xaxis",
                            "class": "x axis"
                        });
                }
                if(PykCharts['boolean'](that.axis_y_enable) || that.axis_y_title) {
                    that.yGroup = that.group.append("g")
                        .attr({
                            "id": "yaxis",
                            "class": "y axis"
                        });
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
                        d3.selectAll(that.selector + " #"+that.container_id+"-" +i).call(that.zoom_event);
                        d3.selectAll(that.selector + " #"+that.container_id+"-" + i).on("wheel.zoom", null)
                            .on("mousewheel.zoom", null);
                    }
                }
                that.chart_path = d3.svg.line()
                    .x(function(d) { return that.xScale(d.x); })
                    .y(function(d) { return that.yScale(d.y); })
                    .interpolate(that.interpolate);
                var chartType = (that.type === "lineChart") ? "lineChart" : (that.panels_enable === "yes") ? "panels_of_line" : "multi_series_line";
                that.chartPathClass = (that.type === "lineChart") ? "line" : "multi-line";
                if(evt === "liveData" && that.type === "lineChart") {

                        for (var i = 0;i < that.new_data_length;i++) {
                            var data = that.new_data[i].data;
                            var type = that.type + "-svg-" +i;

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
                                attr("data-id",function (d,i) {
                                    return that.new_data[i];
                                });
)
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
                    if(that.mode === "default") {
                        that.svgContainer
                            .on('mouseout',function (d) {
                                that.mouseEvent.tooltipHide();
                                that.mouseEvent.crossHairHide(that.type);
                                that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
                                that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
                            })
                            .on("mousemove", function(){
                                that.mouseEvent.crossHairPosition(that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.extra_left_margin,that.xdomain,chartType,that.tooltipMode,null,that.container_id);
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
                                    .attr({
                                        "class": "lines-hover " + that.chartPathClass,
                                        "id": type,
                                        "transform": "translate("+ that.extra_left_margin +",0)",
                                        "stroke-opacity": function () {
                                            if(that.color_mode === "saturation") {
                                                return (i+1)/that.new_data.length;
                                            } else {
                                                return 1;
                                            }
                                        },
                                        "path-stroke-opacity": function () {
                                            return d3.select(this).attr("stroke-opacity");
                                        }
                                    })
                                    .style("stroke", function() {
                                        if(that.new_data[i].highlight) {
                                            that.highlightLine(this,null);
                                        }
                                        return that.fillColor.colorPieMS(that.new_data[i],that.type);
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
                                .attr({
                                    "class": "lines-hover "+that.chartPathClass,
                                    "id": type,
                                    "transform": "translate("+ that.extra_left_margin +",0)",
                                    "stroke-opacity": function () {
                                        if(that.color_mode === "saturation") {
                                            return (index+1)/that.new_data.length;
                                        } else {
                                            return 1;
                                        }
                                    },
                                    "path-stroke-opacity": function () {
                                        return d3.select(this).attr("stroke-opacity");
                                    },
                                    "data-id":function (d,i) {
                                        return that.new_data[i];
                                    }
                                })
                                .style("stroke", function() {
                                    if(that.new_data[index].highlight) {
                                        that.highlightLine(this,null);
                                    }
                                    return that.fillColor.colorPieMS(that.new_data[index],that.type);
                                })
                                .on({
                                    "click": function (d) {
                                        that.clicked = true;
                                        that.highlightLine(PykCharts.getEvent().target,that.clicked,that.previous_color);
                                    },
                                    "mouseover": function (d) {
                                        if(this !== that.selected && (that.color_mode === "saturation" || that.hover)) {
                                            that.previous_color = d3.select(this).attr("stroke-opacity");
                                            that.click_color = d3.select(this).style("stroke");
                                            d3.select(this)
                                                .classed({'multi-line-hover':true,'multi-line':false})
                                                .style("stroke", "orange");
                                        }
                                    },
                                    "mouseout": function (d,i) {
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
                                that.mouseEvent.crossHairPosition(that.new_data,that.xScale,that.yScale,that.dataLineGroup,that.extra_left_margin,that.xdomain,chartType,that.tooltipMode,null,that.container_id);
                            });
                    }
                    else if (that.type === "multilineChart" && that.mode === "default") {
                        that.svgContainer
                            .on('mouseout', function (d) {
                                that.mouseEvent.tooltipHide(null,that.panels_enable,that.type);
                                that.mouseEvent.crossHairHide(that.type);
                                that.mouseEvent.axisHighlightHide(that.selector + " .x.axis");
                                that.mouseEvent.axisHighlightHide(that.selector + " .y.axis");
                            })
                            .on("mousemove", function(){
                                var line = [];
                                line[0] = d3.select(that.selector+" #"+this.id+" .lines-hover");
                                that.mouseEvent.crossHairPosition(that.new_data,that.xScale,that.yScale,line,that.extra_left_margin,that.xdomain,chartType,that.tooltipMode,that.panels_enable,that.container_id);
                            });
                    }
                }
                return this;
            },
            ticks: function (index) {

                if(PykCharts['boolean'](that.pointer_size)) {
                    if(PykCharts['boolean'](that.panels_enable)) {
                        var type = that.type + that.svgContainer.attr("id");
                        if (that.axis_x_position  === "bottom" && (that.axis_y_position === "left" || that.axis_y_position === "right")) {
                            that.ticks[0] = that.svgContainer.append("text")
                                .attr({
                                    "id": type,
                                    "x": that.chart_margin_left,
                                    "y": that.chart_margin_top,
                                    "dy": -5
                                })
                                .style({
                                    "font-size": that.pointer_size + "px",
                                    "font-weight": that.pointer_weight,
                                    "font-family": that.pointer_family,
                                    "fill": function() {
                                        return that.fillColor.colorPieMS(that.new_data1,that.type);
                                    }
                                })
                                .html(that.new_data1.name);
                        } else if (that.axis_x_position  === "top"  && (that.axis_y_position === "left" || that.axis_y_position === "right")) {
                            that.ticks[0] = that.svgContainer.append("text")
                                .attr({
                                    "id": type,
                                    "x": that.w - that.chart_margin_left,
                                    "y": that.chart_height-that.chart_margin_bottom,
                                    "dy": 10,
                                    "text-anchor": "end"
                                })
                                .style({
                                    "font-size": that.pointer_size + "px",
                                    "font-weight": that.pointer_weight,
                                    "font-family": that.pointer_family,
                                    "fill": function() {
                                        return that.fillColor.colorPieMS(that.new_data1,that.type);
                                    }
                                })
                                .html(that.new_data1.name);
                        }

                    } else {
                        that.ticks_text_width = [];
                        tickPosition = function (d,i) {
                            var end_x_circle, end_y_circle;
                            if(that.axis_y_position === "left") {
                                end_x_circle = (that.xScale(that.new_data[i].data[(that.new_data[i].data.length - 1)].x) + that.extra_left_margin + that.chart_margin_left);
                                end_y_circle = (that.yScale(that.new_data[i].data[(that.new_data[i].data.length - 1)].y) + that.chart_margin_top);
                            } else if(that.axis_y_position === "right") {
                                end_x_circle = (that.xScale(that.new_data[i].data[0].x) + that.extra_left_margin + that.chart_margin_left) - 10;
                                end_y_circle = (that.yScale(that.new_data[i].data[0].y) + that.chart_margin_top);
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
                                .append(
                                    "text")

                        that.ticks.attr({
                            "id": function (d,i) { return that.type + "-svg-" + i; },
                            "class": "legend-heading",
                            "transform": tickPosition,
                            "text-anchor": orient
                        });

                        that.ticks.text(function (d,i) {
                                return "";
                            })
                        function setTimeoutTicks() {
                            that.ticks.text(function (d,i) {
                                    return d.name;
                                })
                                .text(function (d,i) {
                                    that.ticks_text_width[i] = this.getBBox().width;
                                    return d.name;
                                })
                                .attr({
                                    "dx": 5,
                                    "dy": 5
                                })
                                .style({
                                    "font-size": that.pointer_size + "px",
                                    "font-weight": function(d){
                                        if(d.highlight) {
                                            return "bold";
                                        } else {
                                            return that.pointer_weight;
                                        }
                                    },
                                    "font-family": that.pointer_family,
                                    "visibility": "visible",
                                    "fill": function(d,i) {
                                        return that.fillColor.colorPieMS(that.new_data[i],that.type);
                                    },
                                    "pointer-events" : "none"
                                });
                        }
                        setTimeout(setTimeoutTicks, that.transitions.duration());
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
                var type = that.type+"-svg-"+i;
                that.svgContainer.select(that.selector+" #"+type)
                    .attr({
                        "class": "lines-hover " + that.chartPathClass,
                        "d": that.chart_path
                    });

            }
        } else {
            for (i = 0;i < that.new_data_length;i++) {                 
                var type = that.type;
                currentContainer = d3.selectAll("#"+that.container_id + "-" + i);
                that.k.isOrdinal(currentContainer,".x.axis",that.xScale,that.xdomain,that.extra_left_margin);
                that.k.isOrdinal(currentContainer,".x.grid",that.xScale);
                that.k.isOrdinal(currentContainer,".y.axis",that.yScale,that.ydomain);
                that.k.isOrdinal(currentContainer,".y.grid",that.yScale);
                currentContainer.select("#"+type+that.container_id+"-"+i)
                    .attr({
                        "class": "lines-hover " + that.chartPathClass,
                        "d": that.chart_path
                    });

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
                var element = document.querySelector(that.selector + " #panels_of_line_main_div #tooltip-svg-container-"+i);
                element.parentNode.removeChild(element);
            }               
            that.renderPanelOfLines();
        }
        if(that.type === "lineChart") {
            that.optionalFeature().createChart("liveData");
        } else if(that.type === "multilineChart" && !PykCharts['boolean'](that.panels_enable)) {
            document.querySelector(that.selector +" #tooltip-svg-container-1").innerHTML = null;
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
                            .classed({
                                "multi-line-selected": false,
                                "multi-line": true
                            });
                        d3.select(that.selected)
                            .attr("stroke-opacity",1)
                            .classed({
                                "multi-line-selected": true,
                                "multi-line": false
                            });
                 } else {
                    if (that.color_mode === "color") {
                        d3.selectAll(that.selector+" path.multi-line").attr("stroke-opacity",prev_opacity);
                    } else {
                        d3.selectAll(that.selector+" path.multi-line").attr("stroke-opacity",function () {
                            return d3.select(this).attr("path-stroke-opacity");
                        });
                    }
                    d3.selectAll(that.selector+ " .legend-heading").style("opacity",1);
                    d3.select(that.selector+" text#"+that.selected.id).style({
                        "opacity": 1,
                        "font-weight": "normal"
                    });
                    d3.select(that.selected)
                        .attr("stroke-opacity",prev_opacity)
                        .classed({
                            "multi-line-selected": false,
                            "multi-line": true
                        });
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

            annotationComman(annotation,1);
            that.k.annotation(that.selector + " #svg-1",annotation, that.xScale,that.yScale);
        } else if(PykCharts['boolean'](that.panels_enable)) {
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
                annotationComman(annotation,i);
                that.k.annotation(that.selector + " #"+that.container_id+"-" + i,annotation, that.xScale,that.yScale)
            }
        }
        function annotationComman (annotation,i) {
            var anno = d3.select(that.selector + " #"+that.container_id+"-" + i).selectAll(that.selector+ " .PykCharts-annotation-line")
                .data(annotation);
            anno.enter()
                .append("path");
            anno.attr("d", function (d,i) {
                    var a = [
                        {
                            x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.chart_margin_left,
                            y:parseInt(that.yScale(d.y)-(arrow_size)+that.chart_margin_top)
                        },
                        {
                            x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.chart_margin_left,
                            y:parseInt(that.yScale(d.y)-(arrow_size)+that.chart_margin_top)
                        }
                    ];
                    return that.line(a);
                })
            function setTimeoutAnnotationPanelOfLine() {
                anno.attr("class", "PykCharts-annotation-line")
                    .attr("d", function (d,i) {
                        var a = [
                            {
                                x:parseInt(that.xScale(d.x)-(arrow_size*0.5))+that.extra_left_margin+that.chart_margin_left,
                                y:parseInt(that.yScale(d.y)-(arrow_size)+that.chart_margin_top)
                            },
                            {
                                x:parseInt(that.xScale(d.x)+(arrow_size*0.5))+that.extra_left_margin+that.chart_margin_left,
                                y:parseInt(that.yScale(d.y)-(arrow_size)+that.chart_margin_top)
                            },
                            {
                                x:parseInt(that.xScale(d.x))+that.extra_left_margin+that.chart_margin_left,
                                y:parseInt(that.yScale(d.y)+that.chart_margin_top),
                            }
                        ];
                        return that.line(a);
                    })
                    .attr("fill",that.annotation_background_color);
            }
            setTimeout(setTimeoutAnnotationPanelOfLine,that.transitions.duration());
            anno.exit().remove();
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
            that.mouseEvent = new PykCharts.crossHairMovement(that);
            
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

            if((i+1)%3 === 0 && i !== 0) {
                if (that.mode === "default") {
                    that.k.emptyDiv("#panels_of_line_main_div");
                } else {
                    that.k.emptyDiv(options.selector);
                }
            }
        }
        that.k.exportSVG(that,that.container_id+"-","lineChart",that.panels_enable,that.new_data);
        that.k.emptyDiv(options.selector);      
    };

    that.renderLineChart = function () {

        that.optionalFeature().svgContainer(1)
            .createGroups(1)
            .hightLightOnload();

        that.k.crossHair(that.svgContainer,that.new_data_length,that.new_data,that.fillColor,that.type);
        that.mouseEvent = new PykCharts.crossHairMovement(that);

        that.optionalFeature()
                .createChart()
                .ticks()
                .axisContainer();

        that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.xdomain,that.x_tick_values)
                .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values)
                .xAxisTitle(that.xGroup)
                .yAxisTitle(that.yGroup);

        if (PykCharts.boolean(options.interactive_enable)) {
            that.brush = new PykCharts.Configuration.renderBrush(that,that.xScale,that.group,that.reducedHeight); 
        }

        if(that.mode === "default") {
            that.k.yGrid(that.svgContainer,that.group,that.yScale)
                .xGrid(that.svgContainer,that.group,that.xScale)
        }       

        var add_extra_width = 0;
        function setTimeoutExport() {
            if(PykCharts['boolean'](that.pointer_size)) {
                add_extra_width = d3.max(that.ticks_text_width,function(d){
                        return d;
                    });
            }
            that.k.exportSVG(that,"#"+that.container_id+"-1","lineChart",undefined,undefined,add_extra_width);
        }
        setTimeout(setTimeoutExport,that.transitions.duration());
    };

    that.dataTransformation();
    that.render();
};
