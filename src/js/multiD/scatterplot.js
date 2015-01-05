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

                    console.log(that.chartBody.selectAll(".text"));
            function test () {        
                // console.log("hello")
                setTimeout(function () {
                    // console.log("inside");
                    that.circleLabel
                        .attr("x", function (d) {console.log(d.group,that.new_data); return (that.x(d.x)+that.extra_left_margin); })
                        .attr("y", function (d) { return (that.yScale(d.y)+that.extra_top_margin + 5); })
                        .attr("text-anchor","middle")
                        .attr("pointer-events","none")
                        .attr("fill", that.label_color)
                        .style("font-weight", that.label_weight)
                        .style("font-size", that.label_size + "px")
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
                 
                }
                test();
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
            console.log("heyyyyyyyyyy",that.new_data)
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
        // console.log(that.data)
        that.k.exportSVG(that,"svgcontainer",type,that.panels_enable,that.uniq_group_arr);
        that.k.emptyDiv();
    };
};