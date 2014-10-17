PykCharts.oneD.pictograph = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function () {
        that = new PykCharts.oneD.processInputs(that, options);
        var optional = options.optional
        ,functionality = theme.oneDimensionalCharts;
        that.showTotal = options.pictograph_show_total ? options.pictograph_show_total : functionality.pictograph_show_total;
        that.enableTotal = options.pictograph_total_enable ? options.pictograph_total_enable : functionality.pictograph_total_enable;
        that.enableCurrent = options.pictograph_current_enable ? options.pictograph_current_enable : functionality.pictograph_current_enable;
        that.imgperline = options.pictograph_image_per_line ?  options.pictograph_image_per_line : functionality.pictograph_image_per_line;
        that.activeText_size = options.pictograph_active_text_size ? options.pictograph_active_text_size : functionality.pictograph_active_text_size;
        that.activeText_color = options.pictograph_active_text_color ? options.pictograph_active_text_color : functionality.pictograph_active_text_color;
        that.activeText_weight = options.pictograph_active_text_weight ? options.pictograph_active_text_weight : functionality.pictograph_active_text_weight;
        that.activeText_family = options.pictograph_active_text_family ? options.pictograph_active_text_family : functionality.pictograph_active_text_family;
        that.inactiveText_size = options.pictograph_inactive_text_size ? options.pictograph_inactive_text_size : functionality.pictograph_inactive_text_size;
        that.inactiveText_color = options.pictograph_inactive_text_color ? options.pictograph_inactive_text_color : functionality.pictograph_inactive_text_color;
        that.inactiveText_weight = options.pictograph_inactive_text_weight ? options.pictograph_inactive_text_weight : functionality.pictograph_inactive_text_weight;
        that.inactiveText_family = options.pictograph_inactive_text_family ? options.pictograph_inactive_text_family : functionality.pictograph_inactive_text_family;
        that.imageWidth =  options.pictograph_image_width ? options.pictograph_image_width : functionality.pictograph_image_width;
        that.imageHeight = options.pictograph_image_height ? options.pictograph_image_height : functionality.pictograph_image_height;
        // that.showTotal = optional && optional.pictograph && optional.pictograph.showTotal ? optional.pictograph.showTotal : functionality.pictograph.showTotal;
        // that.enableTotal = optional && optional.pictograph && optional.pictograph.enableTotal ? optional.pictograph.enableTotal : functionality.pictograph.enableTotal;
        // that.enableCurrent = optional && optional.pictograph && optional.pictograph.enableCurrent ? optional.pictograph.enableCurrent : functionality.pictograph.enableCurrent;
        // that.imgperline = optional && optional.pictograph && optional.pictograph.imagePerLine ?  optional.pictograph.imagePerLine : functionality.pictograph.imagePerLine;
        // if (optional && optional.pictograph && optional.pictograph.activeText) {
        //     that.activeText = optional.pictograph.activeText;
        //     that.activeText.size = optional.pictograph.activeText.size ? optional.pictograph.activeText.size : functionality.pictograph.activeText.size;
        //     that.activeText.color = optional.pictograph.activeText.color ? optional.pictograph.activeText.color : functionality.pictograph.activeText.color;
        //     that.activeText.weight = optional.pictograph.activeText.weight ? optional.pictograph.activeText.weight : functionality.pictograph.activeText.weight;
        //     that.activeText.family = optional.pictograph.activeText.family ? optional.pictograph.activeText.family : functionality.pictograph.activeText.family;
        // } else {
        //     that.activeText = functionality.pictograph.activeText;
        // }
        // if (optional && optional.pictograph && optional.pictograph.inactiveText) {
        //     that.inactiveText = optional.pictograph.inactiveText;
        //     that.inactiveText.size = optional.pictograph.inactiveText.size ? optional.pictograph.inactiveText.size : functionality.pictograph.inactiveText.size;
        //     that.inactiveText.color = optional.pictograph.inactiveText.color ? optional.pictograph.inactiveText.color : functionality.pictograph.inactiveText.color;
        //     that.inactiveText.weight = optional.pictograph.inactiveText.weight ? optional.pictograph.inactiveText.weight : functionality.pictograph.inactiveText.weight;
        //     that.inactiveText.family = optional.pictograph.inactiveText.family ? optional.pictograph.inactiveText.family : functionality.pictograph.inactiveText.family;
        // } else {
        //     that.inactiveText = functionality.pictograph.inactiveText;
        // }
        // that.imageWidth = optional && optional.pictograph && optional.pictograph.imageWidth ? optional.pictograph.imageWidth : functionality.pictograph.imageWidth;
        // that.imageHeight = optional && optional.pictograph && optional.pictograph.imageHeight ? optional.pictograph.imageHeight : functionality.pictograph.imageHeight;

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
            that.k.title();
            that.k.subtitle();
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

        that.k.export(that,"#svgcontainer","pictograph");

        $(window).on("load", function () { return that.k.resize(that.svgContainer); })
                            .on("resize", function () { return that.k.resize(that.svgContainer); });
    };

    this.optionalFeatures = function () {

        var optional = {
            svgContainer: function () {
                $(options.selector).css("background-color",that.background_color);

                that.svgContainer = d3.select(options.selector).append('svg')
                    .attr("width",that.width)
                    .attr("height",that.height)
                    .attr("id","svgcontainer")
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height);

                that.group = that.svgContainer.append("g")
                    .attr("transform", "translate(" + that.imageWidth + ",0)");

                that.group1 = that.svgContainer.append("g")
                    .attr("transform","translate(0,"+ that.imageHeight +")");

                return this;
            },
            createChart: function () {
                var a = 1,b=1;

                that.optionalFeatures().showTotal();
                var counter = 0;
                for(var j=1; j<=that.weight; j++) {
                    if(j <= that.data[1].weight ) {
                        that.group.append("image")
                            .attr("xlink:href",that.data[1]["image"])
                            .attr("x", b *(that.imageWidth + 1))
                            .attr("y", a *(that.imageHeight + 10))
                            .attr("width",0)
                            .attr("height", that.imageHeight + "px")
                            .transition()
                            .duration(that.transitions.duration())
                            .attr("width", that.imageWidth + "px");
                    }else {
                        that.group.append("image")
                            .attr("xlink:href",that.data[0]["image"])
                            .attr("x", b *(that.imageWidth + 1))
                            .attr("y", a *(that.imageHeight+ 10))
                            .attr("width",0)
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
                    var textHeight;
                     this.labelText();
                     that.group1.append("text")
                        .attr("font-family",that.inactiveText_family)
                        .attr("font-size",that.inactiveText_size)
                        .attr("fill",that.inactiveText_color)
                        .text("/"+that.data[0].weight)
                        .text(function () {
                            textHeight =this.getBBox().height;
                            return "/"+that.data[0].weight;
                        })
                        .attr("x", (that.textWidth+5))
                        .attr("y", that.height/2 - textHeight);
                }
                return this;
            },
            labelText: function () {
                if (PykCharts.boolean(that.enableCurrent)) {
                    var textHeight;
                    that.group1.append("text")
                        .attr("x", 0)
                        .attr("font-family",that.activeText_family)
                        .attr("font-size",that.activeText_size)
                        .attr("fill",that.activeText_color)
                        .text(that.data[1].weight)
                        .text(function () {
                            textHeight =this.getBBox().height;
                            that.textWidth = this.getBBox().width;
                            return that.data[1].weight;
                        })
                        .attr("y", that.height/2 - textHeight);

                }
                return this;
            }
        }
        return optional;
    }
};
