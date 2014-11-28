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
                // .liveData(that);
        } else {
            that.k.backgroundColor(that)
                .export(that,"#"+that.container_id,"pictograph")
                .emptyDiv();
        }

        that.optionalFeatures()
                .svgContainer()
                // .labelText()
                // .enableLabel()
        // if(PykCharts.boolean(that.pictograph_units_per_image)) {
        //     that.optionalFeatures().appendUnits()
        // }
        that.optionalFeatures().createChart();
        if(that.mode==="default") {
            that.k.createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();
        }
        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        console.log(that.mouseEvent);
        that.k.exportSVG(that,"#"+that.container_id,"pictograph")
        $(document).ready(function () { return that.k.resize(that.svgContainer); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer); });
    };

    this.optionalFeatures = function () {

        var optional = {
            svgContainer: function () {
                that.sets_data = venn.venn(that.sets, that.overlaps);

                // draw the diagram in the 'venn' div
                that.diagram = venn.drawD3Diagram(d3.select(options.selector), that.sets_data, that.width, that.height);
                that.svgContainer = that.diagram.svg
                    .attr("id",that.container_id)
                    .attr("class","svgcontainer")
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height);
                return this;
            },
            createChart : function () {
                
                // add a tooltip showing the size of each set/intersection
                // var tooltip = d3.select("body").append("div")
                //     .style  ("position","absolute")
                //     .attr("class", "venntooltip");

                d3.selection.prototype.moveParentToFront = function() {
                  return this.each(function(){
                    this.parentNode.parentNode.appendChild(this.parentNode);
                  });
                };

                // hover on all the circles
                that.diagram.circles
                    .style("stroke-opacity", 0)
                    .style("stroke", "white")
                    .style("stroke-width", "2");

                that.diagram.nodes
                    .on("mousemove", function(d) {
                        if(that.mode==="default") {
                            that.mouseEvent.tooltipPosition(d);
                        }
                        // tooltip.style("left", (d3.event.pageX) + "px")
                        //        .style("top", (d3.event.pageY - 28) + "px");
                    })
                    .on("mouseover", function(d, i) {
                        if(that.mode==="default") {
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(d.weight + " users");
                        }
                        var selection = d3.select(this).select("circle");
                        selection.moveParentToFront()
                            .transition()
                            .style("fill-opacity", .5)
                            .style("stroke-opacity", 1);

                        // tooltip.transition().style("opacity", .9);
                        // tooltip.text(d.weight + " users");
                    })
                    .on("mouseout", function(d, i) {
                        if(that.mode==="default") {
                            that.mouseEvent.tooltipHide(d)
                        }
                        d3.select(this).select("circle").transition()
                            .style("fill-opacity", .3)
                            .style("stroke-opacity", 0);
                        // tooltip.transition().style("opacity", 0);
                    });

                // draw a path around each intersection area, add hover there as well
                that.svgContainer.selectAll("path")
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
                        // tooltip.transition().style("opacity", .9);
                        // tooltip.text(d.weight + " users");
                    })
                    .on("mouseout", function(d, i) {
                        if(that.mode==="default") {
                            that.mouseEvent.tooltipHide(d)
                        }
                        d3.select(this).transition()
                            .style("fill-opacity", 0)
                            .style("stroke-opacity", 0);
                        // tooltip.transition().style("opacity", 0);
                    })
                    .on("mousemove", function(d) {
                        if(that.mode==="default") {
                            that.mouseEvent.tooltipPosition(d);
                        }
                        // tooltip.style("left", (d3.event.pageX) + "px")
                        //        .style("top", (d3.event.pageY - 28) + "px");
                    });
                return this;
            }
        }
        return optional;
    }
};
// PykCharts.other.venn = function (options) {
//     var that = this;

//     this.execute = function () {
//       d3.json(options.data[0], function (data) {
//           that.sets = data;
//           d3.json(options.data[1], function (data) {
//               that.overlaps = data;
//               that.render();
//           })
//       })
//     }
//     this.render = function () {
//         // get positions for each set
        

        
//     }
// }