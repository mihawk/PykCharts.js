PykCharts.multiD.simple2x2 = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function () {
    	that = new PykCharts.validation.processInputs(that, options, 'multiDimensionalCharts');
        PykCharts.scaleFunction(that);
        if(that.stop) {
            return;
        }

        if(that.mode === "default") {
            that.k.loading();
        }

        var multiDimensionalCharts = theme.multiDimensionalCharts,
            stylesheet = theme.stylesheet,
            optional = options.optional;
        that.axis_x_enable = "yes";
        that.axis_x_data_format = "string";
        that.axis_x_pointer_length = 0;
        that.axis_x_pointer_position = "bottom";
        that.axis_y_enable = "yes";
        that.axis_y_data_format = "string";
        that.axis_y_pointer_length = 0;

        that.data_sort_enable = "yes";
        that.data_sort_type = "numerically";

        that.chart_width = (that.chart_width < that.chart_height) ? that.chart_width : that.chart_height;
        that.chart_height = that.chart_width;
        that.reducedWidth = that.chart_width - that.chart_margin_left - that.chart_margin_right;
        that.reducedHeight = that.chart_height - that.chart_margin_top - that.chart_margin_bottom;
        that.axis_x_pointer_padding = (that.reducedHeight/2) + 10;
        that.axis_x_title_padding = that.axis_x_pointer_padding;
        that.axis_y_pointer_padding = (that.reducedWidth/2) + 10;
        that.axis_y_title_padding = that.axis_y_pointer_padding;

        that.border_between_chart_elements_color = options.border_between_chart_elements_color || "#1d1d1d";
        
        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data),
                id = that.selector.substring(1,that.selector.length);
            if(that.stop || validate === false) {
                that.k.remove_loading_bar(id);
                return;
            }
            that.data = that.k.__proto__._groupBy("simple2x2",data);
            that.compare_data = that.k.__proto__._groupBy("simple2x2",data);
            that.k.remove_loading_bar(id);

            that.dataTransformation();
            that.render();
        }

        that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };

    this.dataTransformation = function () {
    	that.data = that.k.__proto__._sortData(that.data, "group", null, that);
    };

    this.render = function () {
        var id = that.selector.substring(1,that.selector.length),
            container_id = id + "_svg";

        that.border = new PykCharts.Configuration.border(that);

		if (that.mode === "default") {
			that.k.title()
                .backgroundColor(that)
                .export(that,"#"+that.container_id,"simple2x2")
                .emptyDiv()
                .subtitle();

            that.optionalFeatures()
                .svgContainer(container_id)
                .renderOuterBoundary()
                .createChart()
                .axisContainer()
                .label();

            that.k.liveData(that)
                .tooltip()
                .createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();

		}
        else {
            that.k.backgroundColor(that)
                .export(that,"#"+that.container_id,"simple2x2")
                .emptyDiv();

            that.optionalFeatures()
                .svgContainer(container_id)
                .createChart()
                .axisContainer()
                .labels();

            that.k.createFooter()
                .credits()
                .dataSource();

        }

        that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.x_domain,that.x_tick_values)
            .yAxis(that.svgContainer,that.yGroup,that.yScale,that.y_domain,that.y_tick_values)
            .xAxisTitle(that.xGroup)
            .yAxisTitle(that.yGroup);

        that.optionalFeatures().axisShift();

        that.k.exportSVG(that,"#"+container_id,"simple2x2Chart");

        var resize = that.k.resize(that.svgContainer);
        that.k.__proto__._ready(resize);
        window.addEventListener('resize', function(event){
            return that.k.resize(that.svgContainer);
        });
    };

    this.refresh = function () {
        that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("simple2x2",data);
            that.refresh_data = that.k.__proto__._groupBy("simple2x2",data);
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            that.dataTransformation();

            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }

            that.optionalFeatures()
                .createChart()                
                .label();

            that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,that.extra_left_margin,that.x_domain,that.x_tick_values)
                .yAxis(that.svgContainer,that.yGroup,that.yScale,that.y_domain,that.y_tick_values);

            that.optionalFeatures().axisShift();
        };
        
        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
    };

    this.optionalFeatures = function () {
        var id = that.selector.substring(1,that.selector.length);
        var optional = {
            svgContainer: function (container_id) {
                document.getElementById(id).className = "PykCharts-twoD";
                that.svgContainer = d3.select(that.selector)
                    .append("svg:svg")
                    .attr({
                        "width": that.chart_width,
                        "height": that.chart_height,
                        "id": container_id,
                        "class": "svgcontainer",
                        "preserveAspectRatio": "xMinYMin",
                        "viewBox": "0 0 " + that.chart_width + " " + that.chart_height
                    });

                that.group = that.svgContainer.append("g")
                    .attr("id","simple2x2-group");
                return this;
            },
            axisContainer: function () {
                if(PykCharts['boolean'](that.axis_x_enable) || options.axis_x_title){
                    that.xGroup = that.group.append("g")
                            .attr({
                                "id": "xaxis",
                                "class": "x axis"
                            });
                }
                if(PykCharts['boolean'](that.axis_y_enable) || options.axis_y_title){
                    that.yGroup = that.group.append("g")
                        .attr({
                            "id": "yaxis",
                            "class": "y axis"
                        });
                }
                return this;
            },
            createChart: function () {
                var x_data=[], y_data=[],
                    y_range, x_range;
                that.x_tick_values = that.k.processXAxisTickValues(); //--- NOT REQD ???
                that.y_tick_values = that.k.processYAxisTickValues(); //--- NOT REQD ???

                if(that.axis_y_data_format === "string") {
                    y_data = ["Low", "High"];
                    y_range = [that.reducedHeight, 0];
                    that.yScale = that.k.scaleIdentification("ordinal",y_data,y_range,0.3);
                    that.extra_top_margin = (that.yScale.rangeBand() / 2);
                }

                if(that.axis_x_data_format === "string") {
                    x_data = y_data;
                    x_range = [0 ,that.reducedWidth];
                    that.xScale = that.k.scaleIdentification("ordinal",x_data,x_range,0.3);
                    that.extra_left_margin = (that.xScale.rangeBand()/2);
                }

                that.x_domain = that.xScale.domain();
                that.y_domain = that.yScale.domain();

                return this;
            },
            axisShift: function () {
                that.xGroup.attr("transform","translate("+that.chart_margin_left+"," + (that.chart_margin_top + that.reducedHeight/2) + ")");
                that.yGroup.attr("transform","translate(" + (that.chart_margin_left + that.reducedWidth/2) + ","+ that.chart_margin_top +")");
                
                if (d3.select(that.selector+" text.x-axis-title").node() != null) {
                    var x_axis_title_height = d3.select(that.selector+" text.x-axis-title").node().getBBox().height;
                    d3.select(that.selector+" text.x-axis-title").attr("transform","translate(0,"+((that.reducedHeight/2) - (x_axis_title_height/3))+")");
                }
                if (d3.select(that.selector+" text.y-axis-title").node() != null) {
                    var y_axis_title_height = d3.select(that.selector+" text.y-axis-title").node().getBBox().height;                
                    d3.select(that.selector+" text.y-axis-title").attr("transform","translate("+(-(that.reducedWidth/2))+",0) rotate(-90)");
                }

                return this;
            },
            renderOuterBoundary: function () {
                that.outer_boundary = that.group.append("svg:rect")
                    .attr({
                        "class": "simple2x2-outer-boundary",
                        "x": that.chart_margin_left,
                        "y": that.chart_margin_top,
                        "height": that.reducedHeight,
                        "width": that.reducedWidth,
                        "fill" : that.chart_color[0],
                        "stroke" : that.border.color(),
                        "stroke-width" : that.border.width(),
                        "stroke-dasharray": that.border.style()
                    });

                return this;
            },
            label: function () {
                var x_position, y_position=300;
                that.chart_label = that.group.selectAll(".simple2x2-label")
                    .data(that.data);

                that.chart_label.enter()
                    .append("text");

                that.chart_label.attr("class","simple2x2-label")
                    .text("");

                that.chart_label.text(function (d) {
                    return d.tooltip;
                })
                .style("visibility","hidden")
                .attr({
                    "x": function (d) {
                        switch (d.group) {
                            case 1: x_position = that.chart_margin_left + (3*(that.reducedWidth/4)) - (this.getBBox().width/2);
                                    break;
                            case 2: x_position = that.chart_margin_left + (that.reducedWidth/4) - (this.getBBox().width/2);
                                    break;
                            case 3: x_position = that.chart_margin_left + (that.reducedWidth/4) - (this.getBBox().width/2);
                                    break;
                            case 4: x_position = that.chart_margin_left + (3*(that.reducedWidth/4)) - (this.getBBox().width/2);
                                    break;
                        }
                        return x_position;
                    },
                    "y": function (d) {
                        switch (d.group) {
                            case 1: y_position = that.chart_margin_top + (that.reducedHeight/4) + (this.getBBox().height/3);
                                    break;
                            case 2: y_position = that.chart_margin_top + (that.reducedHeight/4) + (this.getBBox().height/3);
                                    break;
                            case 3: y_position = that.chart_margin_top + (3*(that.reducedHeight/4)) + (this.getBBox().height/3);
                                    break;
                            case 4: y_position = that.chart_margin_top + (3*(that.reducedHeight/4)) + (this.getBBox().height/3);
                                    break;
                        }
                        return y_position;
                    },
                    "fill": that.label_color
                })
                .style({
                    "font-weight": that.label_weight,
                    "font-size": that.label_size + "px",
                    "font-family": that.label_family,
                    "visibility": "visible"                    
                });

                that.chart_label.exit()
                    .remove();

                return this;
            }
        };
        return optional;
    };
};