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
                var oneLayer = new PykCharts.oneD.mapFunctions(options,that,"oneLayer");
                oneLayer.render();
                oneLayer.simulateLiveData(that.data);
            });
        })        

        that.extent_size = d3.extent(that.data, function (d) { return parseInt(d.size, 10); });
        that.difference = that.extent_size[1] - that.extent_size[0];
    };
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
                var timeline = new PykCharts.oneD.mapFunctions(options,that,"timeline");
                timeline.render();
                timeline.simulateLiveData(that.timeline_data);
            });
        });

        that.extent_size = d3.extent(that.data, function (d) { return parseInt(d.size, 10); });
        that.difference = that.extent_size[1] - that.extent_size[0];
    };
};

PykCharts.oneD.mapFunctions = function (options,chartObject,type) {

    this.render = function () {
    //    var that = this;

        var that = chartObject;
        , scale = 150
        , offset = [that.width / 2, that.height / 2]
        , i;

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
            .enableLabel(that.label)
            .enableClick(that.enable_click);

        if (PykCharts.boolean(that.creditMySite.enable)) {
            that.k.credits();
        }
        if (PykCharts.boolean(that.dataSource.enable)) {
            console.log("dataSource");
             that.k.dataSource();
        }

        if(type === "timeline") {
            that.renderTimeline();
        }
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
};