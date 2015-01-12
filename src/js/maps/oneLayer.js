PykCharts.maps.oneLayer = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function () {
        that = PykCharts.maps.processInputs(that, options);
        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data),
                id = that.selector.substring(1,that.selector.length);
            if(that.stop || validate === false) {
                that.k.remove_loading_bar(id);
                return;
            }

            that.data = data;
            that.data_length = that.data.length;
            that.compare_data = data;
            that.k
                .totalColors(that.total_no_of_colors)
                .colorType(that.color_mode)
                .loading(that.loading)
                .tooltip();

                d3.json(PykCharts.assets+"ref/" + that.map_code + "-topo.json", function (e,data) {
                        if(e && e.status === 404) {
                            that.k.errorHandling("map_code","3");
                            that.k.remove_loading_bar(id);
                            return;
                        }

                    that.map_data = data;
                    var map_data_objects_geometries_length = that.map_data.objects.geometries.length;
                    for (var i=0 ; i<map_data_objects_geometries_length ; i++) {
                        var a = that.map_data.objects.geometries[i].properties.NAME_1.replace("'","&#39;");
                        that.map_data.objects.geometries[i].properties.NAME_1 = a;
                    }

                    d3.json(PykCharts.assets+"ref/colorPalette.json", function (data) {
                        that.color_palette_data = data;
                        var validate = that.k.__proto__._where(that.color_palette_data,{name:that.palette_color});

                        try {
                            if (!validate.length) {
                                that.palette_color = theme.mapsTheme.palette_color;
                                throw "palette_color";
                            }
                        }
                        catch (e) {
                            that.k.warningHandling(e,"11");
                        }

                        d3.select(that.selector).html("");
                        d3.select(options.selector).style("height","auto");
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
        PykCharts.scaleFunction(that);
        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data),
                id = that.selector.substring(1,that.selector.length);

            if(that.stop || validate === false) {
                that.k.remove_loading_bar(id);
                return;
            }

            that.timeline_data = data;
            that.compare_data = data;
            var x_extent = d3.extent(data, function (d) { return d.timestamp; }),
                data_length = data.length;

            that.data = that.k.__proto__._where(data, {timestamp: x_extent[0]});
            that.data_length = that.data.length;

            that.redeced_width = that.chart_width - (that.timeline_margin_left * 2) - that.timeline_margin_right;

            that.k
                .totalColors(that.total_no_of_colors)
                .colorType(that.color_mode)
                .loading(that.loading)
                .tooltip(that.tooltip_enable);

            d3.json(PykCharts.assets+"ref/" + that.map_code + "-topo.json", function (data) {
                that.map_data = data;
                var map_data_objects_geometries_length = that.map_data.objects.geometries.length;
                for (var i=0 ; i<map_data_objects_geometries_length ; i++) {
                    var a = that.map_data.objects.geometries[i].properties.NAME_1.replace("'","&#39;");
                    that.map_data.objects.geometries[i].properties.NAME_1 = a;
                }
                d3.json(PykCharts.assets+"ref/colorPalette.json", function (data) {
                    that.color_palette_data = data;
                    var validate = that.k.__proto__._where(that.color_palette_data, {name:that.palette_color});

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
                    that.data = that.k.__proto__._where(that.timeline_data, {timestamp: x_extent[0]});
                    that.data_length = that.data.length;

                    that.data.sort(function (a,b) {
                        return a.timestamp - b.timestamp;
                    });
                    d3.select(that.selector).html("");
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
    var that = chartObject,
        id = that.selector.substring(1,that.selector.length),
        container_id = id + "_svg";

    this.render = function () {
        that.border = new PykCharts.Configuration.border(that);
        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        that.k.title()
            .backgroundColor(that)

        if(type === "oneLayer") {
            that.k
            .export(that,"#"+container_id,type)
            .emptyDiv()
            .subtitle()
            .exportSVG(that,"#"+container_id,type)
        }
        that.current_palette = that.k.__proto__._where(that.color_palette_data, {name:that.palette_color, number:that.total_no_of_colors})[0];
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

        that.redeced_height = that.chart_height - that.timeline_margin_top - that.timeline_margin_bottom;

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
        var resize = that.k.resize(that.svgContainer);
        that.k.__proto__._ready(resize);
        window.onresize = function () {
            return that.k.resize(that.svgContainer);
        };
    };

    that.refresh = function () {
        that.executeRefresh = function (data) {
            that.data = data;
            that.data_length = that.data.length;
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
        var id = that.selector.substring(1,that.selector.length);
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
                document.getElementById(id).style.width = "100%";
            
                that.svgContainer = d3.select(that.selector)
                    .append("svg")
                    .attr({
                        "width": that.chart_width,
                        "height": that.chart_height,
                        "id": "svgcontainer",
                        "class": 'PykCharts-map',
                        "preserveAspectRatio": "xMinYMin",
                        "viewBox": "0 0 " + that.chart_width + " " + that.chart_height
                    });

                that.map_cont = that.svgContainer.append("g")
                    .attr("id", "map_group")

                var defs = that.map_cont.append('defs');
                var filter = defs.append('filter')
                    .attr('id', 'dropshadow');

                filter.append('feGaussianBlur')
                    .attr({
                        'in': 'SourceAlpha',
                        'stdDeviation': 1,
                        'result': 'blur'
                    });

                filter.append('feOffset')
                    .attr({
                        'in': 'blur',
                        'dx': 1,
                        'dy': 1,
                        'result': 'offsetBlur'
                    });

                var feMerge = filter.append('feMerge');

                feMerge.append('feMergeNode')
                    .attr('in", "offsetBlur');

                feMerge.append('feMergeNode')
                    .attr('in', 'SourceGraphic');
                return this;
            },
            createMap : function () {

                var new_width =  that.chart_width - that.legendsGroup_width;
                var new_height = that.chart_height - that.legendsGroup_height - that.timeline_margin_bottom -that.timeline_margin_top - 10;
                var scale = 150
                , offset = [new_width / 2, new_height / 2]
                , i;

                document.getElementById(id).style.backgroundColor = that.background_color;

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
                    .attr({
                        "d": that.path,
                        "class": "area",
                        "iso2": function (d) {
                            return d.properties.iso_a2;
                        },
                        "area_name": function (d) {
                            return d.properties.NAME_1;
                        },
                        "fill": that.renderColor,
                        "prev_fill": function (d) {
                            return d3.select(this).attr("fill");
                        },
                        "fill-opacity": that.renderOpacity,
                        "data-fill-opacity": function () {
                            return d3.select(this).attr("fill-opacity");
                        }
                    })
                    .style({
                        "stroke": that.border.color(),
                        "stroke-width": that.border.width(),
                        "stroke-dasharray": that.border.style()
                    })
                    .on({
                        "mouseover": function (d) {
                            var tooltip_data_found = that.k.__proto__._where(that.data, {iso2: d.properties.iso_a2})[0];
                            if (tooltip_data_found) {
                                if (PykCharts['boolean'](that.tooltip_enable)) {
                                    var tooltip_text = ((that.k.__proto__._where(that.data, {iso2: d.properties.iso_a2})[0]).tooltip) ? ((that.k.__proto__._where(that.data, {iso2: d.properties.iso_a2})[0]).tooltip) : ("<table><thead><th colspan='2'><b>"+d.properties.NAME_1+"</b></th></thead><tr><td>Size</td><td><b>"+((that.k.__proto__._where(that.data, {iso2: d.properties.iso_a2})[0]).size)+"</b></td></tr></table>");

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
                                if(that.onhover1 === "color_saturation" && PykCharts['boolean'](that.chart_onhover_highlight_enable)) {
                                    that.mouseEvent.highlight(options.selector + " .area", this);
                                }else {
                                    that.bodColor(d);
                                }
                            }
                        },
                        "mouseout": function (d) {
                            if (PykCharts['boolean'](that.tooltip_enable)) {
                                ttp.style("display", "none");
                            }
                            that.bodUncolor(d);
                            that.mouseEvent.highlightHide(options.selector + " .area");
                        }
                    });
                that.group.exit()
                    .remove();
                return this;
            },
            enableClick: function (ec) {
                if (PykCharts['boolean'](ec)) {
                    that.chart_data.on("click", that.clicked);
                    that.onhover1 = that.chart_onhover_effect;
                } else {
                    that.onhover1 = that.chart_onhover_effect;
                }
                return this;
            },
            axisContainer : function (ae) {
                if(PykCharts['boolean'](ae)){
                    that.gxaxis = that.svgContainer.append("g")
                        .attr({
                            "id": "xaxis",
                            "class": "x axis",
                            "transform": "translate("+(that.timeline_margin_left*2)+"," + that.redeced_height + ")"
                        });
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
            obj = that.k.__proto__._where(that.data, {iso2: d.properties.iso_a2});
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
            that.opacity = (that.extent_size[0] + (that.k.__proto__._where(that.data, {iso2: d.properties.iso_a2})[0]).size + that.oneninth) / that.difference;
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
                    .attr({
                        "fill": that.legends_text_color,
                        "font-family": that.legends_text_family,
                        "font-size": that.legends_text_size,
                        "font-weight": that.legends_text_weight,
                        "x": text_parameter1value,
                        "y": text_parameter2value
                    });

                legend.enter()
                    .append("rect")

                legend.attr("class","rect")
                    .attr({
                        "x": rect_parameter3value,
                        "y": rect_parameter4value,
                        "width": rect_parameter1value,
                        "height": rect_parameter2value,
                        "fill": that.saturation_color,
                        "fill-opacity": function(d,i) { return (i+1)/that.total_no_of_colors; }
                    });

                var legend_container_width = that.legendsContainer.node().getBBox().width, translate_x;

                    if(that.legends_display === "vertical") {
                        that.legendsGroup_width = legend_container_width + 20;
                    } else  {
                        that.legendsGroup_width = 0;
                    }

                    translate_x = (that.legends_display === "vertical") ? (that.chart_width - that.legendsGroup_width) : (that.chart_width - legend_container_width - 20);
                if (legend_container_width < that.chart_width) { that.legendsContainer.attr("transform","translate("+(translate_x-20)+",10)"); }
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
                    .attr({
                        "fill": that.legends_text_color,
                        "font-family": that.legends_text_family,
                        "font-size": that.legends_text_size,
                        "font-weight": that.legends_text_weight,
                        "x": text_parameter1value,
                        "y":text_parameter2value
                    });

                legend.enter()
                    .append("rect");
                legend.attr({
                    "class": "rect",
                    "width": rect_parameter1value,
                    "height": rect_parameter2value,
                    "fill": function (d) { return d; },
                    "x": rect_parameter3value,
                    "y": rect_parameter4value
                });

                var legend_container_width = that.legendsContainer.node().getBBox().width,translate_x;

                    if(that.legends_display === "vertical") {
                        that.legendsGroup_width = legend_container_width + 20;
                    } else  {
                        that.legendsGroup_width = 0;
                    }

                    translate_x = (that.legends_display === "vertical") ? 0 : (that.chart_width - legend_container_width - 20);
                if (legend_container_width < that.chart_width) { that.legendsContainer.attr("transform","translate("+translate_x+",10)"); }
                that.legendsContainer.style("visibility","visible");

                that.legends_text.exit()
                    .remove();
                legend.exit()
                    .remove();
            }
        } else {
            var c = document.getElementById("legend-container");
            c.parentNode.removeChild(c);
        }
    };

    that.renderLabel = function () {
        that.group.append("text")
            .attr({
                "x": function (d) { return that.path.centroid(d)[0]; },
                "y": function (d) { return that.path.centroid(d)[1]; },
                "text-anchor": "middle",
                "font-size": "10px",
                "fill": that.label_color,
                "pointer-events": "none"
            })
            .text(function (d) { return d.properties.NAME_1.replace("&#39;","'"); });
    };

    that.bodColor = function (d) {
        var obj = that.k.__proto__._where(that.data, {iso2: d.properties.iso_a2});
        if(PykCharts['boolean'](that.chart_onhover_highlight_enable)) {
            if (that.onhover1 === "highlight_border") {
                d3.select("path[area_name='" + d.properties.NAME_1 + "']")
                    .style({
                        "stroke": that.border.color(),
                        "stroke-width": parseFloat(that.border.width()) + 1.5 + "px",
                        "stroke-dasharray": that.border.style()
                    });
            } else if (that.onhover1 === "shadow") {
                d3.select("path[area_name='" + d.properties.NAME_1 + "']")
                    .attr({
                        'filter': 'url(#dropshadow)',
                        "fill-opacity": function () {
                            if (that.palette_color === "" && that.color_mode === "saturation") {
                                that.oneninth_dim = +(d3.format(".2f")(that.difference / that.total_no_of_colors));
                                that.opacity_dim = (that.extent_size[0] + (obj[0]).size + that.oneninth_dim) / that.difference;
                                return that.opacity_dim/2;
                            }
                            return 0.5;
                        }
                    });
            }
        } else {
            that.bodUncolor(d);
        }
    };
    that.bodUncolor = function (d) {
        d3.select("path[area_name='" + d.properties.NAME_1 + "']")
            .style({
                "stroke": that.border.color(),
                "stroke-width": that.border.width(),
                "stroke-dasharray": that.border.style()
            })
            .attr({
                'filter': null,
                "fill-opacity": function () {
                    if (that.saturation_color !== "" && that.color_mode === "saturation") {
                        that.oneninth_high = +(d3.format(".2f")(that.difference / that.total_no_of_colors));
                        that.opacity_high = (that.extent_size[0] + (that.k.__proto__._where(that.data, {iso2: d.properties.iso_a2})[0]).size + that.oneninth_high) / that.difference;
                        return that.opacity_high;
                    }
                    return 1;
                }
            });
    };

    this.clicked = function (d) {
        var obj = {};
        obj.container = PykCharts.getEvent().target.ownerSVGElement.parentNode.id;
        obj.area = d.properties;
        obj.data = that.k.__proto__._where(that.data, {iso2: d.properties.iso_a2})[0];
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
            bg  = d3.selectAll(child).style("background-color");
            if (bg === "transparent" || bg === "rgba(0, 0, 0, 0)") {
                if(d3.selectAll(child)[0][0].parentNode.tagName === undefined || d3.selectAll(child)[0][0].parentNode.tagName.toLowerCase() === "body") {
                    that.k.__proto__._colourBrightness("rgb(255,255,255)",d3.selectAll(child)[0]);
                } else {
                    return bgColor(d3.selectAll(child)[0][0].parentNode);
                }
            } else {
                return that.k.__proto__._colourBrightness(bg,d3.selectAll(child)[0]);
            }
        }
        if (document.querySelectorAll(child1)[0].classList.contains("light") || window.location.pathname === "/overview") {
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
        var timeline_data_length = that.timeline_data.length;
        for (var i=0 ; i<timeline_data_length ; i++) {
            if (that.unique.indexOf(that.timeline_data[i].timestamp) === -1) {
                that.unique.push(that.timeline_data[i].timestamp);
            }
        }
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
                        .attr("x",  (that.timeline_margin_left*2) + that.xScale(that.unique[interval]) - 7);

                    that.data = that.k.__proto__._where(that.timeline_data, {timestamp:that.unique[interval]});
                    that.data_length = that.data.length;
                    that.data.sort(function (a,b) {
                        return a.timestamp - b.timestamp;
                    });
                    that.extent_size = d3.extent(that.data, function (d) { return parseInt(d.size, 10); });
                    that.difference = that.extent_size[1] - that.extent_size[0];
                    for (var i=0 ; i<that.data_length ; i++) {
                        d3.select("path[iso2='"+that.data[i].iso2+"']")
                            .attr({
                                "fill": that.renderColor,
                                "fill-opacity": that.renderOpacity,
                                "data-fill-opacity": function () {
                                    return d3.select(this).attr("fill-opacity");
                                }
                            });
                    }
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
                        document.getElementsByTagName('body')[0].style.cursor = "default";
                    });
        function dragmove (d) {
            document.getElementsByTagName('body')[0].style.cursor = "pointer";
            if (that.timeline_status !== "playing") {
                var x = PykCharts.getEvent().sourceEvent.pageX - (that.timeline_margin_left),
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
                            that.marker.attr("x", (that.timeline_margin_left*2) + that.xScale(that.unique[i]) - 7);
                            that.data = that.k.__proto__._where(that.timeline_data, {timestamp:that.unique[i]});
                            that.data_length = that.data.length;
                            that.data.sort(function (a,b) {
                                return a.timestamp - b.timestamp;
                            });
                            that.extent_size = d3.extent(that.data, function (d) { return parseInt(d.size, 10); });
                            that.difference = that.extent_size[1] - that.extent_size[0];
                            for (var k=0 ; k<that.data_length ; k++) {
                                d3.select("path[iso2='"+that.data[k].iso2+"']")
                                    .attr({
                                        "fill": that.renderColor,
                                        "fill-opacity": that.renderOpacity,
                                        "data-fill-opacity": function () {
                                            return d3.select(this).attr("fill-opacity");
                                        }
                                    });
                            }
                            that.interval_index = i;
                        }
                    }
                    else if ((x > x_range[i]) && (i > (len-2))) {
                            that.marker.attr("x", (that.timeline_margin_left*2) + that.xScale(that.unique[i]) - 7);
                            that.data = that.k.__proto__._where(that.timeline_data, {timestamp:that.unique[i]});
                            that.data_length = that.data.length;
                            that.data.sort(function (a,b) {
                                return a.timestamp - b.timestamp;
                            });
                            that.extent_size = d3.extent(that.data, function (d) { return parseInt(d.size, 10); });
                            that.difference = that.extent_size[1] - that.extent_size[0];
                            for (var k=0 ; k<that.data_length ; k++) {
                                d3.select("path[iso2='"+that.data[k].iso2+"']")
                                    .attr({
                                        "fill": that.renderColor,
                                        "fill-opacity": that.renderOpacity,
                                        "data-fill-opacity": function () {
                                            return d3.select(this).attr("fill-opacity");
                                        }
                                    });
                            }
                            that.interval_index = i;
                    }
                }
            }
        }

        that.play = that.svgContainer.append("image")
            .attr({
                "xlink:href": that.play_image_url,
                "x": that.timeline_margin_left / 2,
                "y": that.redeced_height - that.timeline_margin_top - (bbox.height/2),
                "width": "24px",
                "height": "21px"
            })
            .style("cursor","pointer");

        that.marker = that.svgContainer.append("image")
            .attr({
                "xlink:href": that.marker_image_url,
                "x": (that.timeline_margin_left*2) + that.xScale(that.unique[0]) - 7,
                "y": that.redeced_height,
                "width": "14px",
                "height": "12px"
            })
            .style("cursor","pointer")
            .call(drag);
    }
};
