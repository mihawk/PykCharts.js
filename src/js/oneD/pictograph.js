PykCharts.oneD.pictograph = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function () {
        that = new PykCharts.oneD.processInputs(that, options);

        var optional = options.optional
        ,functionality = theme.oneDimensionalCharts;
        that.showActive = optional && optional.pictograph && optional.pictograph.showActive ? optional.pictograph.showActive : functionality.pictograph.showActive;
        that.enableTotal = optional && optional.pictograph && optional.pictograph.enableTotal ? optional.pictograph.enableTotal : functionality.pictograph.enableTotal;
        that.enableCurrent = optional && optional.pictograph && optional.pictograph.enableCurrent ? optional.pictograph.enableCurrent : functionality.pictograph.enableCurrent;
        that.imgperline = optional && optional.pictograph && optional.pictograph.imagePerLine ?  optional.pictograph.imagePerLine : functionality.pictograph.imagePerLine;
        if (optional && optional.pictograph && optional.pictograph.activeText) {
            that.activeText = optional.pictograph.activeText;
            that.activeText.size = optional.pictograph.activeText.size ? optional.pictograph.activeText.size : functionality.pictograph.activeText.size;
            that.activeText.color = optional.pictograph.activeText.color ? optional.pictograph.activeText.color : functionality.pictograph.activeText.color;
            that.activeText.weight = optional.pictograph.activeText.weight ? optional.pictograph.activeText.weight : functionality.pictograph.activeText.weight;
            that.activeText.family = optional.pictograph.activeText.family ? optional.pictograph.activeText.family : functionality.pictograph.activeText.family;
        } else {
            that.activeText = functionality.pictograph.activeText;
        }
        if (optional && optional.pictograph && optional.pictograph.inactiveText) {
            that.inactiveText = optional.pictograph.inactiveText;
            that.inactiveText.size = optional.pictograph.inactiveText.size ? optional.pictograph.inactiveText.size : functionality.pictograph.inactiveText.size;
            that.inactiveText.color = optional.pictograph.inactiveText.color ? optional.pictograph.inactiveText.color : functionality.pictograph.inactiveText.color;
            that.inactiveText.weight = optional.pictograph.inactiveText.weight ? optional.pictograph.inactiveText.weight : functionality.pictograph.inactiveText.weight;
            that.inactiveText.family = optional.pictograph.inactiveText.family ? optional.pictograph.inactiveText.family : functionality.pictograph.inactiveText.family;
        } else {
            that.inactiveText = functionality.pictograph.inactiveText;
        }
        that.imageWidth = optional && optional.pictograph && optional.pictograph.imageWidth ? optional.pictograph.imageWidth : functionality.pictograph.imageWidth;
        that.imageHeight = optional && optional.pictograph && optional.pictograph.imageHeight ? optional.pictograph.imageHeight : functionality.pictograph.imageHeight;

        if(that.mode === "default") {
           that.k.loading();
        }
        d3.json(options.data, function (e,data) {
            that.data = data;
            $(options.selector+" #chart-loader").remove();
            that.render();
        })
    };

    this.render = function () {

        that.transitions = new PykCharts.Configuration.transition(that);
        that.k.title();
        that.k.subtitle();

        var picto = that.optionalFeatures()
                .svgContainer()
                .createPictograph()
                .labelText()
                .enableLabel();
        that.k.credits()
                .dataSource();
    };

    this.optionalFeatures = function () {

        var optional = {
            svgContainer: function () {
                $(options.selector).css("background-color",that.bg);

                that.svg = d3.select(options.selector).append('svg')
                    .attr("width",that.width)
                    .attr("height",that.height);

                that.group = that.svg.append("g")
                    .attr("transform", "translate(" + that.imageWidth + ",0)");

                that.group1 = that.svg.append("g")
                    .attr("transform","translate(0,"+ that.imageHeight +")");

                return this;
            },
            createPictograph: function () {
                var a = 1,b=1;

                that.optionalFeatures().showActive();
                var counter = 0;
                for(var j=1; j<=that.size; j++) {
                    if(j <= that.data[1].size ) {
                        that.group.append("image")
                            .attr("xlink:href",that.data[1].img)
                            .attr("x", b *(that.imageWidth + 1))
                            .attr("y", a *(that.imageHeight + 10))
                            .attr("width",0)
                            .attr("height", that.imageHeight + "px")
                            .transition()
                            .duration(that.transitions.duration())
                            .attr("width", that.imageWidth + "px");
                    }else {
                        that.group.append("image")
                            .attr("xlink:href",that.data[0].img)
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
            showActive: function () {
                 if (PykCharts.boolean(that.showActive)) {
                    that.size = that.data[0].size;
                }
                else {
                    that.size = that.data[1].size;
                }
                return this ;
            },
            enableLabel: function () {
                if (PykCharts.boolean(that.enableTotal)) {
                    var textHeight;
                     this.labelText();
                     that.group1.append("text")
                        .attr("font-family",that.inactiveText.family)
                        .attr("font-size",that.inactiveText.size)
                        .attr("fill",that.inactiveText.color)
                        .text("/"+that.data[0].size)
                        .text(function () {
                            textHeight =this.getBBox().height;
                            return "/"+that.data[0].size;
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
                        .attr("font-family",that.activeText.family)
                        .attr("font-size",that.activeText.size)
                        .attr("fill",that.activeText.color)
                        .text(that.data[1].size)
                        .text(function () {
                            textHeight =this.getBBox().height;
                            that.textWidth = this.getBBox().width;
                            return that.data[1].size;
                        })
                        .attr("y", that.height/2 - textHeight);

                }
                return this;
            }
        }
        return optional;
    }
};
