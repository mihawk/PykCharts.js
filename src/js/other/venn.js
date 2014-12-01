PykCharts.other.venn = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function () {
        that = new PykCharts.other.processInputs(that, options);
        var optional = options.optional,
            otherCharts = theme.otherCharts;
        that.height = options.chart_height ? options.chart_height : that.width;

        that.k.validator()
            .validatingDataType(that.height,"chart_height",that.width,"height");

        if(that.stop) {
            return;
        }

        if(that.mode === "default") {
           that.k.loading();
        }
        d3.json(options.data[0], function (data) {
            that.sets = data;
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(options.selector+" #chart-loader").remove();
                return;
            }
            d3.json(options.data[1], function (data) {
                var validate = that.k.validator().validatingJSON(data);
                if(that.stop || validate === false) {
                    $(options.selector+" #chart-loader").remove();
                    return;
                }

                that.overlaps = data;
                $(options.selector+" #chart-loader").remove();
                that.render();
            })
        });
    };
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
                .tooltip();
        } else {
            that.k.backgroundColor(that)
                .export(that,"#"+that.container_id,"pictograph")
                .emptyDiv();
        }

        that.optionalFeatures()
                .svgContainer()
        that.optionalFeatures().createChart();
        if(that.mode==="default") {
            that.k.createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();
        }
        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        
        that.k.exportSVG(that,"#"+that.container_id,"pictograph")
        $(document).ready(function () { return that.k.resize(that.svgContainer); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer); });
    };

    this.optionalFeatures = function () {

        var optional = {
            svgContainer: function () {
                that.sets_data = venn.venn(that.sets, that.overlaps);
                that.svgContainer = d3.select(options.selector).append("svg")
                        .attr("width", that.width)
                        .attr("height", that.height);
                that.svgContainer = that.svgContainer
                    .attr("id",that.container_id)
                    .attr("class","svgcontainer")
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height);
                that.group = that.svgContainer.append( "g" );
                that.group1 = that.svgContainer.append("g");
                return this;
            },
            createChart : function () {
                d3.selection.prototype.moveParentToFront = function() {
                  return this.each(function(){
                    this.parentNode.parentNode.appendChild(this.parentNode);
                  });
                };

                var colours = d3.scale.category10(),
                    padding = 6;

                dataset = venn.scaleSolution(that.sets_data, that.width, that.height, padding);
                venn.computeTextCenters(dataset, that.width, that.height);

                

                var nodes = that.group.selectAll("circle")
                    .data(dataset);

                that.node_group = nodes.enter()
                    .append("g")
                    .attr("class","venn-group")
                    .append("circle")
                    .attr("class","venn-nodes");

                nodes.select("circle")
                    .attr("r",  function(d) { return d.radius; })
                    .style("fill-opacity", 0.3)
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; })
                    .style("fill", function(d, i) { return colours(i); })
                    .on("mousemove", function(d) {
                        if(that.mode==="default") {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    })
                    .on("mouseover", function(d, i) {
                        if(that.mode==="default") {
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(d.weight + " users");
                        }
                        var selection = d3.select(this);
                        selection.moveParentToFront()
                            .transition()
                            .style("fill-opacity", .5)
                            .style("stroke-opacity", 1);
                    })
                    .on("mouseout", function(d, i) {
                        if(that.mode==="default") {
                            that.mouseEvent.tooltipHide(d)
                        }
                        d3.select(this).transition()
                            .style("fill-opacity", .3)
                            .style("stroke-opacity", 0);
                    })
                    .style("stroke-opacity", 0)
                    .style("stroke", "white")
                    .style("stroke-width", "2");
                nodes.exit().remove();

                var text = that.node_group.append("text")
                       .attr("dy", ".35em")
                       .attr("x", function(d) { return Math.floor(d.textCenter.x); })
                       .attr("y", function(d) { return Math.floor(d.textCenter.y); })
                       .attr("text-anchor", "middle")
                       .style("fill", function(d, i) { return colours(i); })
                       .call(function (text) { text.each(venn.wrapText); });
                that.group1.selectAll("path")
                    .data(that.overlaps)
                    .enter()
                    .append("path")
                    .attr("d", function(d) {
                        return venn.intersectionAreaPath(d.sets.map(function(j) { return that.sets_data[j]; }));
                    })
                    .style("fill-opacity","0")
                    .style("fill", "black")
                    .style("stroke-opacity", 0)
                    .style("stroke", "white")
                    .style("stroke-width", "2")
                    .on("mouseover", function(d, i) {
                        if(that.mode==="default") {
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(d.weight + " users");
                        }
                        d3.select(this).transition()
                            .style("fill-opacity", .1)
                            .style("stroke-opacity", 1);
                    })
                    .on("mouseout", function(d, i) {
                        if(that.mode==="default") {
                            that.mouseEvent.tooltipHide(d)
                        }
                        d3.select(this).transition()
                            .style("fill-opacity", 0)
                            .style("stroke-opacity", 0);
                    })
                    .on("mousemove", function(d) {
                        if(that.mode==="default") {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    });
                return this;
            },
            label : function () {

                return this;
            }
        }
        return optional;
    }
};
