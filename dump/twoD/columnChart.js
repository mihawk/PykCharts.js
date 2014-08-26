PykCharts.twoD.column = function (option) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function () {

        that = new PykCharts.twoD.processInputs(that, option, "column");
        that.yAxisDataFormat = option.yAxisDataFormat;
        that.xAxisDataFormat = option.xAxisDataFormat;
        if(that.mode === "default") {
            that.k.loading();
        }
        that.grid = option.chart && option.chart.grid ? option.chart.grid : theme.stylesheet.chart.grid;
        that.grid.yEnabled = option.chart && option.chart.grid && option.chart.grid.yEnabled ? option.chart.grid.yEnabled : theme.stylesheet.chart.grid.yEnabled;
        that.grid.color = option.chart && option.chart.grid && option.chart.grid.color ? option.chart.grid.color : theme.stylesheet.chart.grid.color;
        d3.json(option.data, function (e,data) {
            that.data = data;
            $(that.selector+" #chart-loader").remove();
            that.render();
        });
    };

    this.render = function () {
        that.border = new PykCharts.Configuration.border(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.mouseEvent1 = new PykCharts.twoD.mouseEvent(option);
        that.fillChart = new PykCharts.twoD.fillChart(option, theme);

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
                .createColumn()
                .axisContainer();

            that.k.yAxis(that.svg,that.ygroup,that.yScale)
                .xAxis(that.svg,that.xgroup,that.xScale)
                .yGrid(that.svg,that.group,that.yScale);

        }else if(that.mode === "infographic") {

            that.optionalFeatures().svgContainer()
                .createColumn();

            that.k.tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

            that.k.yAxis(that.svg,that.ygroup,that.yScale)
                .xAxis(that.svg,that.xgroup,that.xScale);
        }

    };
    this.refresh = function () {
        d3.json(option.data, function (e,data) {
            that.data = data;
            that.optionalFeatures()
                .createColumn();

                that.k.yAxis(that.svg,that.ygroup,that.yScale)
                    .xAxis(that.svg,that.xgroup,that.xScale)
                    .yGrid(that.svg,that.group,that.yScale)
                    .tooltip();
        });
    };
    this.fullScreen = function () {
        var modalDiv = d3.select(that.selector).append("div")
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
            .attr("transform","translate(" + that.margin.left + "," + that.margin.top +")scale("+scaleFactor+")");
        $(".clone").css({"background-color":"#fff","border-radius":"15px","color":"#000","display":"none","padding":"20px   ","min-width":screen.availWidth-100,"min-height":screen.availHeight-150,"visibility":"visible","align":"center"});
        $("#abc").bPopup({position: [30, 10],transition: 'fadeIn',onClose: function(){ $('.clone').remove(); }});
    }

    this.optionalFeatures = function () {
        var status;
        var optional = {
            svgContainer: function () {
                $(option.selector).css("background-color",that.bg);
                $(that.selector).attr("class","PykCharts-twoD");
                that.svg = d3.select(that.selector).append("svg:svg")
                    .attr("width",that.width )
                    .attr("height",that.height)
                    .attr("id","svgcontainer")
                    .attr("class","svgcontainer");

                that.group = that.svg.append("g")
                    .attr("id","svggroup")
                    .attr("class","svggroup")
                    .attr("transform","translate(" + that.margin.left + "," + that.margin.top +")");

                if(PykCharts.boolean(that.grid.yEnabled)) {
                    that.group.append("g")
                        .attr("id","ygrid")
                        .style("stroke",that.grid.color)
                        .attr("class","y grid-line");
                }
                return this;
            },
            axisContainer : function () {
                if(PykCharts.boolean(that.axis.x.enable)) {
                    that.xgroup = that.group.append("g")
                        .attr("id","xaxis")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + (that.height - that.margin.top - that.margin.bottom ) + ")")
                        .style("stroke","none");
                }

                if(PykCharts.boolean(that.axis.y.enable)) {
                    that.ygroup = that.group.append("g")
                        .attr("id","yaxis")
                        .attr("class","y axis");
                }
                return this;
            },
            createColumn: function () {

                var height = that.height - that.margin.top - that.margin.bottom;
                //var y_domain = [0,d3.max(that.data,function (d) { return d.y; })]
                var x_domain,x_data,y_data,y_range,x_range,y_domain;
                if(that.yAxisDataFormat === "number") {
                    y_domain = [0,d3.max(that.data,function (d) { return d.y; })];
                    y_data = that.k._domainBandwidth(y_domain,2);
                    y_range = [that.height - that.margin.top - that.margin.bottom, 0];
                    that.yScale = that.k.scaleIdentification("linear",y_data,y_range);

                } else if(that.yAxisDataFormat === "string") {
                    y_data = that.data.map(function (d) { return d.y; });
                    y_range = [0,that.height - that.margin.top - that.margin.bottom];
                    that.yScale = that.k.scaleIdentification("ordinal",y_data,y_range);

                } else if (that.yAxisDataFormat === "time") {
                    y_data = d3.extent(that.data, function (d) {
                        return parseDate(d.y);
                    });
                    y_range = [that.height - that.margin.top - that.margin.bottom, 0];
                    that.yScale = that.k.scaleIdentification("time",y_data,y_range);
                }
                if(that.xAxisDataFormat === "number") {
                    x_domain = [0,d3.max(that.data,function (d) { return d.x; })];
                    x_data = that.k._domainBandwidth(x_domain,1);
                    x_range = [0 ,that.width - that.margin.left - that.margin.right];
                    that.xScale = that.k.scaleIdentification("linear",x_data,x_range);

                } else if(that.xAxisDataFormat === "string") {

                    x_data = that.data.map(function (d) { return d.x; });
                    x_range = [0 ,that.width - that.margin.left - that.margin.right];
                    that.xScale = that.k.scaleIdentification("ordinal",x_data,x_range);

                } else if (that.xAxisDataFormat === "time") {
                    x_data = d3.extent(that.data, function (d) {
                        return parseDate(d.x);
                    });
                    x_range = [0 ,that.width - that.margin.left - that.margin.right];
                    that.xScale = that.k.scaleIdentification("time",x_data,x_range);
                }
                that.bar = that.group.selectAll(".bar")
                    .data(that.data)

                that.bar.enter()
                    .append("g")
                    .attr("class","bar")
                    .append("svg:rect");

                that.bar.attr("class","bar")
                    .select("rect")
                    .attr("class","hbar")
                    .attr("x", function (d) { return that.xScale(d.x); })
                    .attr("y", height)
                    .attr("height", 0)
                    .attr("width", function (d) { return that.xScale.rangeBand(d.x); })
                    .attr("fill", function (d) { return that.color === "" ? d.color : that.fillChart(d); })
                    // .attr("fill", function (d) { return that.color === "" ? d.color : that.color; })
                    .attr("stroke", that.border.color())
                    .attr("stroke-width",that.border.width())
                    .on('mouseover',function (d) {
                        that.mouseEvent1.highlight(option.selector+" "+".hbar", this);
                        that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.toolTextShow(d.tooltip ? d.tooltip : d.y);
                    })
                    .on('mouseout',function (d) {
                        that.mouseEvent1.highlightHide(option.selector+" "+".hbar");
                        that.mouseEvent.tooltipHide(d);
                        that.mouseEvent.axisHighlightHide(option.selector+" "+".x.axis")
                    })
                    .on('mousemove', function (d) {
                        that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.axisHighlightShow(d.x,option.selector+" "+".x.axis");
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("y", function (d) { return that.yScale(d.y); })
                    .attr("height", function (d) { return height - that.yScale(d.y); });

                that.bar.exit()
                    .remove();

                return this;
            }
        };
        return optional;
    };
};