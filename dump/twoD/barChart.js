PykCharts.twoD.bar = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function () {

        that = new PykCharts.twoD.processInputs(that, options, "bar");
        that.yAxisDataFormat = options.yAxisDataFormat;
        that.xAxisDataFormat = options.xAxisDataFormat;
        if(that.mode === "default") {
             that.k.loading();
        }
        d3.json(options.data, function (e,data) {
            that.data = data;
            $(options.selector+" #chart-loader").remove();
            that.render();
        })
    };

    this.refresh = function () {
        d3.json(options.data, function (e,data) {
            that.data = data;
            that.optionalFeatures()
                .createBar()
                .ticks();

            that.k.yAxis(that.svg,that.ygroup,that.yScale)
                .xAxis(that.svg,that.xgroup,that.xScale)
                .tooltip();
        });
    };

    this.render = function () {

        that.border = new PykCharts.Configuration.border(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.mouseEvent1 = new PykCharts.twoD.mouseEvent(options);
        that.fillChart = new PykCharts.twoD.fillChart(that, theme);

        if(that.mode === "default") {

            that.k.title();
            that.k.subtitle();

            that.optionalFeatures().svgContainer();

            that.k.credits()
                .dataSource()
                .liveData(that)
                .tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

            that.optionalFeatures()
                .createBar()
                .axisContainer()
                .ticks();

            that.k.yAxis(that.svg,that.ygroup,that.yScale)
                .xAxis(that.svg,that.xgroup,that.xScale);

        } else if(that.mode === "infographic") {

            that.optionalFeatures().svgContainer()
                .createBar()
                .axisContainer()
                .ticks();

            that.k.tooltip();
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
            that.k.yAxis(that.svg,that.ygroup,that.yScale)
                .xAxis(that.svg,that.xgroup,that.xScale);
        }
    };

    this.fullScreen = function () {
        var modalDiv = d3.select(that.chartContainer).append("div")
            .attr("id","abc")
            .attr("visibility","hidden")
            .attr("class","clone")
            .append("a")
            .attr("class","b-close")
            .style("cursor","pointer")
            .style("position","absolute")
            .style("right","10px")
            .style("top","5px")
            .style("font-size","20px")
            .html("Close");

        var scaleFactor = 1.2;
        var w = that.width;
        var h = that.height;
        if(h>500 || w>900){
            scaleFactor = 1;
        }
        $(".svgcontainer").clone().appendTo("#abc");
        d3.select(".clone #svgcontainer").attr("width",screen.width-200).attr("height",screen.height-200).style("display","block");
        d3.select(".clone svg #svggroup")
            .attr("transform","scale("+scaleFactor+")translate("+that.margin.left + "," + that.margin.top+")");
        $(".clone").css({"background-color":"#fff","border-radius":"15px","color":"#000","display":"none","padding":"20px","min-width":screen.availWidth-100,"min-height":screen.availHeight-150,"visibility":"visible","align":"center"});
        $("#abc").bPopup({position: [30, 10],transition: 'fadeIn',onClose: function(){ $('.clone').remove(); }});
    };

    this.optionalFeatures = function () {
        var status;
        var optional = {
            svgContainer: function () {
                $(options.selector).css("background-color",that.bg);
                $(that.selector).attr("class","PykCharts-twoD");
                that.svg = d3.select(that.selector).append("svg:svg")
                    .attr("width",that.width)
                    .attr("height",that.height)
                    .attr("id","svgcontainer")
                    .attr("class","svgcontainer")
                    .style("background-color",that.bg);

                that.group = that.svg.append("g")
                    .attr("id","svggroup")
                    .attr("class","svggroup")
                    .attr("transform","translate(" + that.margin.left + "," + that.margin.top +")");

                return this;
            },
            axisContainer: function () {
                if(PykCharts.boolean(that.axis.x.enable)) {
                    that.xgroup = that.group.append("g")
                        .attr("id","xaxis")
                        .attr("class", "x axis")
                }

                if(PykCharts.boolean(that.axis.y.enable)) {
                    that.ygroup = that.group.append("g")
                        .attr("id","yaxis")
                        .attr("class","y axis");
                }
                return this;
            },
            createBar: function () {
                var x_domain,x_data,y_data,y_range,x_range,y_domain;
                if(that.yAxisDataFormat === "number") {
                    y_domain = [0,d3.max(that.data,function (d) { return d.x; })];
                    y_data = that.k._domainBandwidth(y_domain,2);
                    y_range = [that.height - that.margin.top - that.margin.bottom, 0];
                    that.yScale = that.k.scaleIdentification("linear",y_data,y_range);

                } else if(that.yAxisDataFormat === "string") {
                    y_data = that.data.map(function (d) { return d.x; });
                    y_range = [0,that.height - that.margin.top - that.margin.bottom];
                    that.yScale = that.k.scaleIdentification("ordinal",y_data,y_range);

                } else if (that.yAxisDataFormat === "time") {
                    y_data = d3.extent(that.data, function (d) {
                        return new Date(d.x);
                    });
                    y_range = [that.height - that.margin.top - that.margin.bottom, 0];
                    that.yScale = that.k.scaleIdentification("time",y_data,y_range);
                }
                if(that.xAxisDataFormat === "number") {
                    x_domain = [0,d3.max(that.data,function (d) { return d.y; })];
                    x_data = that.k._domainBandwidth(x_domain,1);
                    x_range = [0 ,that.width - that.margin.left - that.margin.right];
                    that.xScale = that.k.scaleIdentification("linear",x_data,x_range);

                } else if(that.xAxisDataFormat === "string") {

                    x_data = that.data.map(function (d) { return d.y; });
                    x_range = [0 ,that.width - that.margin.left - that.margin.right];
                    that.xScale = that.k.scaleIdentification("ordinal",x_data,x_range);

                } else if (that.xAxisDataFormat === "time") {
                    x_data = d3.extent(that.data, function (d) {
                        return new Date(d.y);
                    });
                    x_range = [0 ,that.width - that.margin.left - that.margin.right];
                    that.xScale = that.k.scaleIdentification("time",x_data,x_range);
                }
                that.bar = that.group.selectAll(".bar")
                    .data(that.data)
                barwidth = (that.width - that.margin.left - that.margin.right)/that.data.length;
                that.bar.enter()
                    .append("g")
                    .attr("class","bar")
                    .append("svg:rect");

                that.bar.attr("class","bar")
                    .select("rect")
                    .attr("class","hbar")
                    .attr("y", function (d) { return that.yScale(d.x); })
                    .attr("x", 0)
                    .attr("width",0)
                    .attr("height", function (d) {return that.yScale.rangeBand(new Date(d.x)); })
                    .attr("fill", function (d) {return that.color === "" ? d.color : that.fillChart(d); })
                    // .attr("fill", function (d) {console.log(d); that.fillChart(d); })
                    .attr("stroke", that.border.color())
                    .attr("stroke-width",that.border.width())
                    .on('mouseover',function (d) {
                        that.mouseEvent1.highlight(options.selector+" "+".hbar", this);
                        that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.tooltipTextShow(d.tooltip ? d.tooltip : d.x);
                    })
                    .on('mouseout',function (d) {
                        that.mouseEvent1.highlightHide(options.selector+" "+".hbar");
                        that.mouseEvent.tooltipHide(d);
                        that.mouseEvent.axisHighlightHide(options.selector +" "+".y.axis");
                    })
                    .on('mousemove', function (d) {
                        that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.axisHighlightShow(d.x,options.selector +" "+".y.axis");
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("width", function (d) {return that.xScale(d.y); });

                return this;

            },
            ticks : function () {
                if(PykCharts.boolean(that.ticks)) {
                    var tick_label = that.group.selectAll(".tickLabel")
                        .data(that.data);

                    tick_label.enter()
                        .append("text")

                    tick_label.attr("class","tickLabel");

                    tick_label.attr("x", function (d) { return that.xScale(d.y); })
                        .attr("y",function (d) { return that.yScale(d.x) + (that.yScale.rangeBand(d.x)/2); })
                        .attr("dx",4)
                        .attr("dy",4)
                        .text("")
                            .transition()
                            .delay(that.transitions.duration())
                        .text(function (d) { return d.y })
                        // .attr("fill","black")
                        .style("font-size",12)
                        .style("font-family",that.label.family);

                    tick_label.exit().remove();
                }
                return this;
            }
        };
        return optional;
    };
};