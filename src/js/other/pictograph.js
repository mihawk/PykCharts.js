PykCharts.other.pictograph = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function () {
        that = new PykCharts.validation.processInputs(that, options, "other");
        var optional = options.optional,
            otherCharts = theme.otherCharts;
        that.pictograph_show_all_images = options.pictograph_show_all_images ? options.pictograph_show_all_images.toLowerCase() : otherCharts.pictograph_show_all_images;
        that.pictograph_total_count_enable = options.pictograph_total_count_enable ? options.pictograph_total_count_enable.toLowerCase() : otherCharts.pictograph_total_count_enable;
        that.pictograph_current_count_enable = options.pictograph_current_count_enable ? options.pictograph_current_count_enable.toLowerCase() : otherCharts.pictograph_current_count_enable;
        that.pictograph_image_per_line = options.pictograph_image_per_line ?  options.pictograph_image_per_line : otherCharts.pictograph_image_per_line;
        that.pictograph_current_count_size = options.pictograph_current_count_size ? options.pictograph_current_count_size : otherCharts.pictograph_current_count_size;
        that.pictograph_current_count_color = options.pictograph_current_count_color ? options.pictograph_current_count_color : otherCharts.pictograph_current_count_color;
        that.pictograph_current_count_weight = options.pictograph_current_count_weight ? options.pictograph_current_count_weight.toLowerCase() : otherCharts.pictograph_current_count_weight;
        that.pictograph_current_count_family = options.pictograph_current_count_family ? options.pictograph_current_count_family.toLowerCase() : otherCharts.pictograph_current_count_family;
        that.pictograph_total_count_size = options.pictograph_total_count_size ? options.pictograph_total_count_size : otherCharts.pictograph_total_count_size;
        that.pictograph_total_count_color = options.pictograph_total_count_color ? options.pictograph_total_count_color : otherCharts.pictograph_total_count_color;
        that.pictograph_total_count_weight = options.pictograph_total_count_weight ? options.pictograph_total_count_weight.toLowerCase() : otherCharts.pictograph_total_count_weight;
        that.pictograph_total_count_family = options.pictograph_total_count_family ? options.pictograph_total_count_family.toLowerCase() : otherCharts.pictograph_total_count_family;
        that.pictograph_image_width =  options.pictograph_image_width ? options.pictograph_image_width : otherCharts.pictograph_image_width;
        that.pictograph_image_height = options.pictograph_image_height ? options.pictograph_image_height : otherCharts.pictograph_image_height;
        that.pictograph_units_per_image = options.pictograph_units_per_image ? options.pictograph_units_per_image : "";
        that.pictograph_units_per_image_text_family = options.pictograph_units_per_image_text_family ? options.pictograph_units_per_image_text_family.toLowerCase(): otherCharts.pictograph_units_per_image_text_family;
        that.pictograph_units_per_image_text_size = options.pictograph_units_per_image_text_size ? options.pictograph_units_per_image_text_size : otherCharts.pictograph_units_per_image_text_size;
        that.pictograph_units_per_image_text_color = options.pictograph_units_per_image_text_color ? options.pictograph_units_per_image_text_color : otherCharts.pictograph_units_per_image_text_color;
        that.pictograph_units_per_image_text_weight = options.pictograph_units_per_image_text_weight ? options.pictograph_units_per_image_text_weight.toLowerCase() : otherCharts.pictograph_units_per_image_text_weight;
        that.chart_height = options.chart_height ? options.chart_height : that.chart_width;
        that.k.validator()
            .validatingDataType(that.chart_height,"chart_height",that.chart_width)
            .validatingDataType(that.pictograph_units_per_image_text_size,"pictograph_units_per_image_text_size",otherCharts.pictograph_units_per_image_text_size) 
            .validatingDataType(that.pictograph_current_count_size,"pictograph_current_count_size",otherCharts.pictograph_current_count_size)
            .validatingDataType(that.pictograph_total_count_size,"pictograph_total_count_size",otherCharts.pictograph_total_count_size)
            .validatingDataType(that.pictograph_image_width,"pictograph_image_width",otherCharts.pictograph_image_width)
            .validatingDataType(that.pictograph_image_height,"pictograph_image_height",otherCharts.pictograph_image_height)
            .validatingDataType(that.pictograph_image_per_line,"pictograph_image_per_line",otherCharts.pictograph_image_per_line)
            .validatingFontWeight(that.pictograph_current_count_weight,"pictograph_current_count_weight",otherCharts.pictograph_current_count_weight)
            .validatingFontWeight(that.pictograph_total_count_weight,"pictograph_total_count_weight",otherCharts.pictograph_total_count_weight)
            .validatingFontWeight(that.pictograph_units_per_image_text_weight,"pictograph_units_per_image_text_weight",otherCharts.pictograph_units_per_image_text_weight)
            .validatingColor(that.pictograph_current_count_color,"pictograph_current_count_color",otherCharts.pictograph_current_count_color)
            .validatingColor(that.pictograph_total_count_color,"pictograph_total_count_color",otherCharts.pictograph_total_count_color)
            .validatingColor(that.pictograph_units_per_image_text_color,"pictograph_units_per_image_text_color",otherCharts.pictograph_units_per_image_text_color);
        if(that.stop) {
            return;
        }

        if(that.mode === "default") {
           that.k.loading();
        }

        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data),
                id = that.selector.substring(1,that.selector.length);
            if(that.stop || validate === false) {
                that.k.remove_loading_bar(id);
                return;
            }

            that.data = data.sort(function(a,b) {
                return b.weight - a.weight;
            });
            that.old_weight = 0;

            that.compare_data = that.data;
            that.k.remove_loading_bar(id);
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
        var id = that.selector.substring(1,that.selector.length),
            container_id = id + "_svg";
        that.transitions = new PykCharts.Configuration.transition(that);

        if(that.mode==="default") {
            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+container_id,"pictograph")
                .emptyDiv()
                .subtitle()
                .liveData(that);
        } else {
            that.k.backgroundColor(that)
                .export(that,"#"+container_id,"pictograph")
                .emptyDiv();
        }

        that.optionalFeatures()
                .svgContainer(container_id)
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
        that.k.exportSVG(that,"#"+container_id,"pictograph");
        var resize = that.k.resize(that.svgContainer);
        that.k.__proto__._ready(resize);
        window.addEventListener('resize', function(event){
            return that.k.resize(that.svgContainer);
        });
    };

    this.optionalFeatures = function () {

        var optional = {
            svgContainer: function (container_id) {
                that.svgContainer = d3.select(options.selector).append('svg')
                    .attr({
                        "width": that.chart_width,
                        "id": container_id,
                        "class": "svgcontainer",
                        "preserveAspectRatio": "xMinYMin",
                        "viewBox": "0 0 " + that.chart_width + " " + that.chart_height
                    });

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
                                .attr({
                                    "xlink:href": that.data[1]["image"],
                                    "id": "current_image"+j,
                                    "x": b *(that.pictograph_image_width + 1),
                                    "y": a *(that.pictograph_image_height + 10),
                                    "width": 0,
                                    "height": that.pictograph_image_height + "px"
                                })
                                .transition()
                                .duration(that.transitions.duration())
                                .attr("width", that.pictograph_image_width + "px");

                            setTimeout(function () {
                                var total_image_element = d3.selectAll("#total_image"+j);
                                if (total_image_element) {
                                    total_image_element.remove();
                                }
                            },that.transitions.duration());
                        }
                    } else if ((j > that.old_weight && that.weight > that.old_weight) || (that.old_data && j <= that.old_data[1].weight)) {
                            that.group.append("image")
                                .attr({
                                    "xlink:href": that.data[0]["image"],
                                    "id": "total_image"+j,
                                    "x": b *(that.pictograph_image_width + 1),
                                    "y": a *(that.pictograph_image_height+ 10),
                                    "width": 0,
                                    "height": that.pictograph_image_height + "px"
                                })
                                .transition()
                                .duration(that.transitions.duration())
                                .attr("width", that.pictograph_image_width + "px");
                    }
                    counter++;
                    b++;

                    if (counter >= that.pictograph_image_per_line) {
                        a++;
                        b=0;
                        counter=0;
                    }

                    var group_bbox_height = that.group.node().getBBox().height;
                    if (j===+that.weight && group_bbox_height != 0) {
                        that.chart_height = group_bbox_height;

                        that.svgContainer
                            .attr({
                                "height": group_bbox_height,
                                "viewBox": "0 0 " + that.chart_width + " " + group_bbox_height
                            });
                    }
                    else {
                        that.svgContainer
                            .attr({
                                "height": group_bbox_height,
                                "viewBox": "0 0 " + that.chart_width + " " + that.chart_height
                            });
                    }                    
                }

                setTimeout(function () {
                    if (that.old_data && that.old_data[1].weight > that.data[1].weight) {
                        for (var i = that.old_data[1].weight; i > that.data[1].weight; i--) {
                            var current_image_elements = d3.selectAll("#current_image"+i);
                            if (current_image_elements) {
                                current_image_elements.remove();
                            }
                        }
                    }
                    if (that.old_data && that.old_data[0].weight > that.data[0].weight) {
                        for (var i = that.old_data[0].weight; i > that.data[0].weight; i--) {
                            var total_image_element = d3.selectAll("#total_image"+i);
                                if (total_image_element) {
                                    total_image_element.remove();
                                }
                        }
                    }
                },that.transitions.duration());

                if(((that.pictograph_image_width * that.pictograph_image_per_line) + width) > that.chart_width) {
                    console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px',"Your Lable text size and image width exceeds the chart conatiner width")
                }
                return this;
            },
            showTotal: function () {
                 if (PykCharts['boolean'](that.pictograph_show_all_images)) {
                    that.weight = that.data[0].weight;
                }
                else {
                    that.weight = that.data[1].weight;
                }
                return this ;
            },
            enableLabel: function () {
                if (PykCharts['boolean'](that.pictograph_total_count_enable)) {
                    var current_text = d3.selectAll(options.selector+" .PykCharts-current-text");
                    if (current_text.length > 0) {
                        current_text.remove();
                    };
                    
                    if(!that.textWidth) {
                        that.textWidth = 0;    
                    }

                    var y_pos =  ((that.data[0].weight)/(that.pictograph_image_per_line));
                    var textHeight;

                    that.group1.append("text")
                        .attr({
                            "class": "PykCharts-current-text",
                            "font-family": that.pictograph_total_count_family,
                            "font-size": that.pictograph_total_count_size,
                            "font-weight": that.pictograph_total_count_weight,
                            "fill": that.pictograph_total_count_color
                        })
                        .text("/"+that.data[0].weight)
                        .text(function () {
                            that.textHeight =this.getBBox().height;
                            that.totalTxtWeight = this.getBBox().width;
                            return "/"+that.data[0].weight;
                        })
                        .attr({
                            "x": (that.textWidth+5),
                            "y": function () { return ((that.textHeight)-10); }
                        });
                }
                return this;
            },
            labelText: function () {
                if (PykCharts['boolean'](that.pictograph_current_count_enable)) {
                    var total_text = d3.selectAll(options.selector+" .PykCharts-total-text");
                    if (total_text.length > 0) {
                        total_text.remove();
                    };
                    var y_pos =  ((that.data[0].weight)/(that.pictograph_image_per_line));
                    var textHeight;
                    that.group1.append("text")
                        .attr({
                            "x": 0,
                            "class": "PykCharts-total-text",
                            "font-family": that.pictograph_current_count_family,
                            "font-size": that.pictograph_current_count_size,
                            "font-weight": that.pictograph_current_count_weight,
                            "fill": that.pictograph_current_count_color
                        })
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
                        .attr({
                            "x": 0,
                            "class": "PykCharts-unit-text",
                            "font-family": that.pictograph_units_per_image_text_family,
                            "font-size": that.pictograph_units_per_image_text_size,
                            "font-weight": that.pictograph_units_per_image_text_weight,
                            "fill": that.pictograph_units_per_image_text_color
                        })
                        .text(function () {
                            return "1 ";
                        })
                        .text(function () {
                            unit_text_height = this.getBBox().height;
                            unit_text_width = this.getBBox().width;
                            return "1 ";
                        })
                        .attr({
                            "dy": 0,
                            "y": unit_text_height - 5
                        });

                that.group2.append("image")
                        .attr({
                            "xlink:href": that.data[1]["image"],
                            "id": "unit-image",
                            "x": unit_text_width + 2 + "px",
                            "y": 0,
                            "height": unit_text_height + "px",
                            "width": unit_text_height + "px"
                        });
                image_width = d3.select(options.selector +" #unit-image").attr("width");

                that.group2.append("text")
                        .attr({
                            "x": function () {
                                return parseFloat(image_width) + unit_text_width + 4;
                            },
                            "class": "PykCharts-unit-text",
                            "font-family": that.pictograph_units_per_image_text_family,
                            "font-size": that.pictograph_units_per_image_text_size,
                            "font-weight": that.pictograph_units_per_image_text_weight,
                            "fill": that.pictograph_units_per_image_text_color
                        })
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
