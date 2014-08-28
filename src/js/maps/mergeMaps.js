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
            .tooltip()

        d3.json("../data/maps/" + that.mapCode + ".json", function (data) {
            that.map_data = data;
            d3.json("../data/maps/colorPalette.json", function (data) {
                that.colorPalette_data = data;
                $(that.selector).html("");
                var oneLayer = new PykCharts.maps.mapFunctions(options,that,"oneLayer");
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
                var timeline = new PykCharts.maps.mapFunctions(options,that,"timeline");
                timeline.render();
                timeline.simulateLiveData(that.timeline_data);
            });
        });

        that.extent_size = d3.extent(that.data, function (d) { return parseInt(d.size, 10); });
        that.difference = that.extent_size[1] - that.extent_size[0];
    };
};

PykCharts.maps.mapFunctions = function (options,chartObject,type) {
    var that = chartObject;
    this.render = function () {
    //    var that = this;
        var scale = 150
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
              
                // if (PykCharts.boolean(that.tooltip.enable)) {
                //     console.log("inside");
                //     ttp.style("visibility", "visible");
                //     ttp.html((_.where(that.data, {iso2: d.properties.iso_a2})[0]).tooltip);
                //     console.log(ttp);
                // }
                that.bodColor(d);
            })
            .on("mousemove", function () {
                // if (PykCharts.boolean(that.tooltip.enable)) {
                //     if (that.tooltip.mode === "moving") {
                //         ttp.style("top", function () {

                //                 return (d3.event.clientY + 10 ) + "px";
                //             })
                //             .style("left", function () {

                //                 return (d3.event.clientX + 10 ) + "px";

                //             });
                //     } else if (that.tooltip.mode === "fixed") {
                //         ttp.style("top", (that.tooltip.positionTop) + "px")
                //             .style("left", (that.tooltip.positionLeft) + "px");
                //     }
                // }
            })
            .on("mouseout", function (d) {
                // if (PykCharts.boolean(that.tooltip.enable)) {
                //     ttp.style("visibility", "hidden");
                // }
                that.bodUncolor(d);
            });

        that.optionalFeatures()
            .enableLabel(that.label.enable)
            .enableClick(that.enableClick);

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

    that.optionalFeatures = function () {
        console.log(that);
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
                console.log("that.onhover1",ec);
                if (PykCharts.boolean(ec)) {
                    that.areas.on("click", that.clicked);
                    // that.onhover = "color_saturati`on";
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
    };


    that.renderColor = function (d, i) {
        if (!PykCharts.boolean(d)) {
            return false;
        }
        var col_shade,
            obj = _.where(that.data, {iso2: d.properties.iso_a2});
        if (obj.length > 0) {
            if (that.colors.type === "colors") {
                if (obj.length > 0 && obj[0].color !== "") {
                    return obj[0].color;
                }
                return that.colors.defaultColor;
            }
            if (that.colors.type === "saturation") {

                if ((that.highlightArea === "yes") && obj[0].highlight == "true") {
                    return obj[0].highlight_color;
                } else {
                    if (that.colors.palette !== "") {
                        col_shade = obj[0].size;
                        for (i = 0; i < that.current_palette.colors.length; i++) {
                            if (col_shade >= that.extent_size[0] + i * (that.difference / that.current_palette.colors.length) && col_shade <= that.extent_size[0] + (i + 1) * (that.difference / that.current_palette.colors.length)) {
                                return that.current_palette.colors[i];
                            }
                        }

                    }
                    return that.colors.defaultColor;
                }
            }
            return that.colors.defaultColor;
        }
        return that.colors.defaultColor;
    };

    that.renderOpacity = function (d) {

        if (that.colors.palette === "" && that.colors.type === "saturation") {
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
        if (that.colors.type === "saturation") {
            that.legs = d3.select(that.selector)
                .append("svg")
                .attr("id", "legend-container")
                .attr("width", that.width)
                .attr("height", 50);
            if (that.colors.palette === "") {
                for (k = 1; k <= 9; k++) {
                    onetenth = d3.format(".1f")(that.extent_size[1] / 9);
                    that.leg = d3.round(onetenth * k);
                    that.legs.append("rect")
                        .attr("x", k * (that.width / 11))
                        .attr("y", 20)
                        .attr("width", (that.width / 11))
                        .attr("height", 5)
                        .attr("fill", that.defaultColor)
                        .attr("opacity", k / 9);

                    that.legs.append("text")
                        .attr("x", (k + 1) * (that.width / 11) - 5)
                        .attr("y", 34)
                        .style("font-size", 10)
                        .style("font", "Arial")
                        .text("< " + that.leg);
                }
            } else {
                for (k = 1; k <= that.current_palette.number; k++) {
                    that.leg = d3.round(that.extent_size[0] + k * (that.difference / that.current_palette.number));
                    that.legs.append("rect")
                        .attr("x", k * that.width / (that.current_palette.number + 2))
                        .attr("y", 20)
                        .attr("width", that.width / (that.current_palette.number + 2))
                        .attr("height", 5)
                        .attr("fill", that.current_palette.colors[k - 1]);

                    that.legs.append("text")
                        .attr("x", (k + 1) * that.width / (that.current_palette.number + 2) - 5)
                        .attr("y", 34)
                        .style("font-size", 10)
                        .style("font", "Arial")
                        .text("< " + that.leg);
                }
            }
            $("#legend-container").after("</br>");
        } else {
            $("#legend-container").remove();
        }
    };

    that.renderLabel = function () {
        that.group.append("text")
            .attr("x", function (d) { return that.path.centroid(d)[0]; })
            .attr("y", function (d) { return that.path.centroid(d)[1]; })
            .attr("text-anchor", "middle")
            .attr("font-size", "10")
            .attr("pointer-events", "none")
            .text(function (d) { return d.properties.NAME_1; });
    };

    that.bodColor = function (d) {
        // console.log(that.onhover1);
        console.log("highlight");
        var obj = _.where(that.data, {iso2: d.properties.iso_a2});
        console.log(that.onhover1);
        if(that.onhover1 !== "none") {
            if (that.onhover1 === "highlight_border") {
                console.log("highlight");
                d3.select("path[state_name='" + d.properties.NAME_1 + "']")
                    .attr("stroke", that.border.color)
                    .attr("stroke-width", that.border.thickness + 0.5);
            } else if (that.onhover1 === "shadow") {
                d3.select("path[state_name='" + d.properties.NAME_1 + "']")
                    .attr('filter', 'url(#dropshadow)')
                    .attr("opacity", function () {
                        if (that.colors.palette === "" && that.colors.type === "saturation") {
                            that.oneninth_dim = +(d3.format(".2f")(that.difference / 10));
                            that.opacity_dim = (that.extent_size[0] + (obj[0]).size + that.oneninth_dim) / that.difference;
                            return that.opacity_dim/2;
                        }
                        return 0.5;
                    });
            } else if (that.onhover1 === "color_saturation") {
                d3.select("path[state_name='" + d.properties.NAME_1 + "']")
                    .attr("opacity", function () {
                        if (that.colors.palette=== "" && that.colors.type === "saturation") {
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
        d3.select("path[state_name='" + d.properties.NAME_1 + "']")
            .attr("stroke", that.border.color)
            .attr("stroke-width", that.border.thickness)
            .attr('filter', null)
            .attr("opacity", function () {
                if (that.colors.palette === "" && that.colors.type === "saturation") {
                    that.oneninth_high = +(d3.format(".2f")(that.difference / 10));
                    that.opacity_high = (that.extent_size[0] + (_.where(that.data, {iso2: d.properties.iso_a2})[0]).size + that.oneninth_high) / that.difference;
                    return that.opacity_high;
                }
                return 1;
            });
    };

    this.clicked = function (d) {
        var obj = {};
        obj.container = d3.event.target.ownerSVGElement.parentNode.id;
        obj.area = d.properties;
        obj.data = _.where(that.data, {iso2: d.properties.iso_a2})[0];
        try {
            customFunction(obj);
        } catch (ignore) {
            /*console.log(e);*/
        }
    };

    this.simulateLiveData = function(data) {
        var bat = $('#live-data').val();
        batSplit = bat.split("\n");
        var ball = [];
        that.live_json = [];
        for (var i = 0; i < batSplit.length -1 ; i++) {
            ball[i] = batSplit[i].split(",");
        };
        for (var i = 1; i < batSplit.length -1 ; i++) {
            var tep = {}
            for (var j = 0; j < ball[i].length; j++) {
                tep[ball[0][j]] = ball[i][j];
            };
            that.live_json.push(tep);
        };
        that.data = that.live_json;
        d3.selectAll("path")
            .attr("fill", that.renderColor)
            .attr("opacity", that.renderOpacity);
    }

    that.renderTimeline = function () {
        var x_extent
        , x_range
        , unique = []
        , duration
        , interval = interval1 = 1;

        that.optionalFeatures()
            .axisContainer(true);

        x_extent = d3.extent(that.timeline_data, function(d) { return d.timestamp; });
        x_range = [0 ,that.reducedWidth];
        that.xScale = that.k.scaleIdentification("linear",x_extent,x_range);

        that.k.xAxis(that.svg,that.gxaxis,that.xScale);

        _.each(that.timeline_data, function (d) {
            if (unique.indexOf(d.timestamp) === -1) {
                unique.push(d.timestamp);
            }
        });

        var bbox = d3.select(that.selector+" .axis").node().getBBox()
        , timeline_status;

        var startTimeline = function () {
            if (timeline_status==="playing") {
                play.attr("xlink:href","../img/play.gif");
                clearInterval(that.playInterval);
                timeline_status = "paused";
            } else {
                timeline_status = "playing";
                play.attr("xlink:href","../img/pause.gif");
                that.playInterval = setInterval(function () {

                    marker.transition()
                        .duration(that.timeline.duration/2)
                        .attr("x",  (that.timeline.margin.left*2) + that.xScale(unique[interval]) - 7);

                    that.data = _.where(that.timeline_data, {timestamp:unique[interval]});
                    that.data.sort(function (a,b) {
                        return a.timestamp - b.timestamp;
                    });
                    _.each(that.data, function (d) {
                        d3.select("path[iso2='"+d.iso2+"']")
                            .transition()
                            .duration(that.timeline.duration/4)
                            .attr("fill", that.renderColor);
                    });

                    interval++;

                    if (interval===unique.length) {
                        clearInterval(that.playInterval);
                    };
                }, that.timeline.duration);

                var timelag = setTimeout(function () {
                    var undoHeatmap = setInterval(function () {
                        interval1++;

                        if (interval1 === interval) {
                            clearInterval(undoHeatmap);
                            clearTimeout(timelag)
                        }

                        if (interval1===unique.length) {
                            clearInterval(undoHeatmap);
                            play.attr("xlink:href","../img/play.gif");
                            marker.attr("x",  (that.timeline.margin.left*2) + that.xScale(unique[0]) - 7);
                            interval = interval1 = 1;
                            timeline_status = "";
                        };
                    }, that.timeline.duration);
                },that.timeline.duration);
            }
        }

        var play = that.svg.append("image")
            .attr("xlink:href","../img/play.gif")
            .attr("x", that.timeline.margin.left / 2)
            .attr("y", that.reducedHeight - that.timeline.margin.top - (bbox.height/2))
            .attr("width","24px")
            .attr("height", "21px")
            .style("cursor", "pointer")
            .on("click", startTimeline)

        var marker = that.svg.append("image")
            .attr("xlink:href","../img/marker.png")
            .attr("x", (that.timeline.margin.left*2) + that.xScale(unique[0]) - 7)
            .attr("y", that.reducedHeight)
            .attr("width","14px")
            .attr("height", "12px")

        // duration = unique.length * 1000;

    }
};