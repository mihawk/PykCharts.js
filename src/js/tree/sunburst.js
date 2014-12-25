PykCharts.tree.sunburst = function (options) {
    var that = this;

    this.execute = function () {

        that = new PykCharts.tree.processInputs(that, options, "sunburst");
        that.k1 = new PykCharts.tree.configuration(that);
        if(that.mode === "default") {
           that.k.loading();
        }
        d3.json(options.data, function (e, data) {            
            that.data = data;
            that.tree_data = that.k1.dataTransfer(that.data);
            $(that.selector+" #chart-loader").remove();
            $(that.selector).css("height","auto");
            that.render();

        });
    };

    this.refresh = function () {
        d3.json(options.data, function (e,data) {
            
            that.data = data;
            that.tree_data = that.k1.dataTransfer(that.data);

            that.optionalFeature()
                .createChart();

        })
    };

    this.render = function () {
        that.border = new PykCharts.Configuration.border(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        if (that.mode==="default") {
            that.k.title()
                .subtitle();

            that.optionalFeature()
                .svgContainer();

            that.k.credits()
                .dataSource()
                .liveData(that)
                .tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

            that.optionalFeature()
                .createChart();

        } else if (that.mode==="infographics") {
            that.optionalFeature()
                .svgContainer()
                .createChart();

            that.k.tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        }
    };

    this.click = function (d) {
        if(PykCharts['boolean'](that.zoom.enable)) {
             that.path.transition()
            .duration(that.transitions.duration())
            .attrTween("d", that.arcTween(d));
        }
    };

    this.arcTween = function (d) {
        var xd = d3.interpolate(that.x.domain(), [d.x, d.x + d.dx])
            , yd = d3.interpolate(that.y.domain(), [d.y, 1])
            , yr = d3.interpolate(that.y.range(), [d.y ? 20 : 0, that.radius]);

            return function (d, i) {
                return i ? function (t) { return that.arc(d); }: function (t) { that.x.domain(xd(t)); that.y.domain(yd(t)).range(yr(t)); return that.arc(d); };
            };
    };

    this.optionalFeature = function () {
        var optional = {
            svgContainer : function () {
                that.svg = d3.select(options.selector)
                    .attr("class", "Pykcharts-sunburst")
                    .attr("id","svgcontainer")
                    .append("svg")
                    .attr("width", that.width)
                    .attr("height", that.height);

                that.group = that.svg.append("g")
                    .attr("transform", "translate(" + that.width/2 + "," + that.height/2 + ")");
            },
            createChart : function () {
                that.w = that.width - that.margin.right - that.margin.left;
                that.h = that.height - that.margin.top - that.margin.bottom;

                that.radius = Math.min(that.width,that.height)/2 - 50;

                var color,partition;

                that.x = d3.scale.linear()
                    .range([0,2*Math.PI]);

                that.y = d3.scale.sqrt()
                    .range([0,that.radius]);

                color = d3.scale.category20c();

                partition = d3.layout.partition()
                    .value(function(d) { return d.weight; })
                    .children(function(d) {
                        return d.values;
                    });

                that.arc = d3.svg.arc()
                        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, that.x(d.x))); })
                        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, that.x(d.x + d.dx))); })
                        .innerRadius(function(d) { return Math.max(0, that.y(d.y)); })
                        .outerRadius(function(d) { return Math.max(0, that.y(d.y + d.dy)); });

                that.path = that.group.selectAll("path")
                    .data(partition.nodes(that.tree_data))
                    .enter()
                    .append("path")
                    .attr("d", that.arc)
                    .style("stroke",that.border.color())
                    .style("stroke-width",that.border.width())
                    .style("fill", function (d) { 
                        if (options.optional && options.optional.colors && options.optional.colors.chartColor) {
                            return that.chartColor;                       
                        } else {
                            return color(d.children);
                        }
                    })
                    .on("click", that.click)
                    .on("mouseover", function (d) {
                        that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.tooltipTextShow(d.key);
                    })
                    .on("mouseout",function (d) {
                        that.mouseEvent.tooltipHide(d);
                    })
                    .on("mousemove", function (d) {
                        that.mouseEvent.tooltipPosition(d);
                    })
            },
        }
        return optional;
    };
}
