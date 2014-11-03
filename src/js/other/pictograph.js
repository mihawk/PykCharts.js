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
            if(!_.isNumber(that.imgperline)) {
                that.imgperline = otherCharts.pictograph_image_per_line;
                throw "pictograph_image_per_line"
            }
        }

        catch (err) {
            that.k.warningHandling(err,"1");
        }

        try {
            if(!_.isNumber(that.imageWidth)) {
                that.imageWidth = otherCharts.pictograph_image_width;
                throw "pictograph_image_width"
            }
        }

        catch (err) {
            that.k.warningHandling(err,"1");
        }

        try {
            if(!_.isNumber(that.imageHeight)) {
                that.imageHeight = otherCharts.pictograph_image_height;
                throw "pictograph_image_height"
            }
        }

        catch (err) {
            that.k.warningHandling(err,"1");
        }

        try {
            if(!_.isNumber(that.current_count_size)) {
                that.current_count_size = otherCharts.pictograph_current_count_size;
                throw "pictograph_current_count_size"
            }
        }

        catch (err) {
            that.k.warningHandling(err,"1");
        }

        try {
            if(!_.isNumber(that.total_count_size)) {
                that.total_count_size = otherCharts.pictograph_total_count_size;
                throw "pictograph_total_count_size"
            }
        }

        catch (err) {
            that.k.warningHandling(err,"1");
        }

        // try {
        //     if(!_.isNumber(that.current_count_color)) {
        //         that.current_count_color = otherCharts.pictograph_current_count_color;
        //         throw "pictograph_current_count_color"
        //     }
        // }
        // catch (err) {
        //     that.k.warningHandling(err,"3");
        // }

        if(that.stop) {
            return;
        }

        if(that.mode === "default") {
           that.k.loading();
        }
        d3.json(options.data, function (e,data) {

            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(options.selector+" #chart-loader").remove();
                return;
            }

            that.data = data.sort(function(a,b) {
                return b.weight - a.weight;
            });
            that.old_weight = 0;
            // that.old_data = that.data;

            that.compare_data = that.data;
            $(options.selector+" #chart-loader").remove();
            that.render();
        })
    };
    this.refresh = function () {
        d3.json(options.data, function (e,data) {
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
        })
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
                .createChart();
        if(that.mode==="default") {
            that.k.createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();
        }

        $(document).ready(function () { return that.k.resize(that.svgContainer); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer); });
    };

    this.optionalFeatures = function () {

        var optional = {
            svgContainer: function () {
                // $(options.selector).css("background-color",that.background_color);

                that.svgContainer = d3.select(options.selector).append('svg')
                    .attr("width",that.width)
                    // .attr("height",that.height)
                    .attr("id",that.container_id)
                    .attr("class","svgcontainer")
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height);

                that.group = that.svgContainer.append("g")
                    .attr("id", "pictograph_image_group")
                    // .attr("transform", "translate(100,0)")
                    // .attr("transform", "translate(" + that.imageWidth + ",0)");

                that.group1 = that.svgContainer.append("g")
                    .attr("transform","translate(0,0)");

                return this;
            },
            createChart: function () {
                var a = 0,b=0;

                that.optionalFeatures().showTotal();
                var counter = 0;

                that.group.attr("transform", "translate(" + (that.textWidth + that.totalTxtWeight + 25) + ",0)")
                for(var j=1; j<=that.weight; j++) {
                    if(j <= that.data[1].weight) {
                        if (!that.old_data || (that.old_data && j > that.old_data[1].weight)) {
                            that.group.append("image")
                                .attr("xlink:href",that.data[1]["image"])
                                // .attr("x", b *(50 + 1))
                                // .attr("y", a *(100 + 10))
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
                                // .attr("x", b *(50 + 1))
                                // .attr("y", a *(100 + 10))
                                .attr("width",0)
                                // .attr("height",100)
                                .attr("height", that.imageHeight + "px")
                                .transition()
                                .duration(that.transitions.duration())
                                .attr("width", that.imageWidth + "px");
                        // }
                    }
                    counter++;
                    b++;

                    if (counter >= that.imgperline) {
                        a++;
                        b=0;
                        counter=0;
                        // that.group.append("text").html("<br><br>");
                    }

                    if (j===that.weight) {
                      var group_bbox_height = that.group.node().getBBox().height;
                      that.svgContainer
                          .attr("height",group_bbox_height)
                          .attr("viewBox", "0 0 " + that.width + " " + group_bbox_height);
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

                if(((that.imageWidth * that.imgperline) + that.textWidth + that.totalTxtWeight + 25) > that.width) {
                    console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px',"Your Lable text size and image width exceeds the chart conatiner width")
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
                    var current_text = $(options.selector+" .PykCharts-current-text");
                    if (current_text.length > 0) {
                        current_text.remove();
                    };
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
                            textHeight =this.getBBox().height;
                            that.totalTxtWeight = this.getBBox().width;
                            return "/"+that.data[0].weight;
                        })
                        .attr("x", (that.textWidth+5))
                        .attr("y", function () { return (((that.imageHeight * y_pos)/2) + (textHeight/2)); });
                }
                return this;
            },
            labelText: function () {
                if (PykCharts.boolean(that.enableCurrent)) {
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
                            textHeight = this.getBBox().height;
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
