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
        that.executeDataSet = function (data) {
            that.compare_data_set = data;
            that.sets = data;
            
            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(options.selector+" #chart-loader").remove();
                return;
            }
            that.executeDataOvelap = function (data) {
                var validate = that.k.validator().validatingJSON(data);
                if(that.stop || validate === false) {
                    $(options.selector+" #chart-loader").remove();
                    return;
                }

                that.overlaps = data;
                that.compare_data_overlap = data;
                $(options.selector+" #chart-loader").remove();
                that.render();
            }
            that.k.dataSourceFormatIdentification(options.data[1],that,"executeDataOvelap");
        };
        that.k.dataSourceFormatIdentification(options.data[0],that,"executeDataSet");
    };
    this.render = function () {
        var l = $(".svgcontainer").length;
        that.container_id = "svgcontainer" + l;
        that.transitions = new PykCharts.Configuration.transition(that);
        var padding = 6;
        that.border = new PykCharts.Configuration.border(that);
        that.sets_data = venn.venn(that.sets, that.overlaps);
        that.dataset = venn.scaleSolution(that.sets_data, that.width, that.height, padding);
        venn.computeTextCenters(that.dataset, that.width, that.height);
        if(that.mode==="default") {
            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+that.container_id,"venn")
                .emptyDiv()
                .subtitle()
                .tooltip()
                .liveData(that);
        } else {
            that.k.backgroundColor(that)
                .export(that,"#"+that.container_id,"venn")
                .emptyDiv();
        }

        that.optionalFeatures()
                .svgContainer()
        that.optionalFeatures().createChart()
            .label();
        if(that.mode==="default") {
            that.k.createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();
        }
        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        
        that.k.exportSVG(that,"#"+that.container_id,"venn")
        $(document).ready(function () { return that.k.resize(that.svgContainer); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer); });
    };
    that.refresh = function () {
        that.executeRefreshSet = function (data){
            that.refresh_data_set = data;
            that.sets = data;
            that.executeRefreshOverlap = function (data) {
                that.refresh_data_overlap = data;
                that.overlaps = data;
                that.sets_data = venn.venn(that.sets, that.overlaps);
                var padding = 6;

                that.dataset = venn.scaleSolution(that.sets_data, that.width, that.height, padding);
                venn.computeTextCenters(that.dataset, that.width, that.height);
                
                var compare_overlap = that.k.checkChangeInData(that.refresh_data_overlap,that.compare_data_overlap);
                that.compare_data_overlap = compare_overlap[0];
                var data_changed_overlap = compare_overlap[1];
                if(data_changed_overlap) {
                    that.k.lastUpdatedAt("liveData");
                }
                
                var compare_set = that.k.checkChangeInData(that.refresh_data_set,that.compare_data_set);
                that.compare_data_set = compare_set[0];
                var data_changed_set = compare_set[1];
                if(data_changed_set) {
                    that.k.lastUpdatedAt("liveData");
                }
                
                that.optionalFeatures().createChart().label();
            }
            that.k.dataSourceFormatIdentification(options.data[1],that,"executeRefreshOverlap");
        }
        that.k.dataSourceFormatIdentification(options.data[0],that,"executeRefreshSet");
    }
    this.optionalFeatures = function () {

        var optional = {
            svgContainer: function () {
                
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

                that.colours = d3.scale.category10();
                
                that.nodes = that.group.selectAll(".venn-group")
                    .data(that.dataset);

                that.node_group = that.nodes.enter()
                    .append("g")
                that.node_group.attr("class","venn-group")
                    .append("circle")
                    .attr("class","venn-nodes");
                
                that.nodes.select("circle")
                    .attr("r",0)
                    .style("fill-opacity", 0.3)
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; })
                    .style("fill", function(d, i) { 
                        return that.highlight === d.name ? that.highlight_color : (that.chart_color[i] || d.color || that.default_color[0]); 
                    })
                    .on("mousemove", function(d) {
                        if(that.mode==="default") {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    })
                    .on("mouseover", function(d, i) {
                        if(that.mode==="default") {
                            tooltip = d.tooltip || d.weight + " users";
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(tooltip);
                            if (PykCharts.boolean(that.onhover_enable)) {
                                var selection = d3.select(this);
                                selection.moveParentToFront()
                                    // .transition()
                                    .style("fill-opacity", .5);
                            }
                        }
                    })
                    .on("mouseout", function(d, i) {
                        if(that.mode==="default") {
                            that.mouseEvent.tooltipHide(d);
                            if (PykCharts.boolean(that.onhover_enable)) {
                                d3.select(this)/*.transition()*/
                                    .style("fill-opacity", .3);
                            }
                        }
                    })
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-dasharray", that.border.style())
                    .attr("stroke-opacity",0)
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("r",  function(d) { return d.radius; })
                    .attr("stroke-opacity",1);
                that.nodes.exit().remove();

                that.path = that.group1.selectAll("path")
                    .data(that.overlaps)
                that.path.enter()
                    .append("path")
                that.path
                    .style("fill-opacity","0")
                    .style("fill", "black")
                    .style("stroke-opacity",0)
                    .transition()
                    .delay(that.transitions.duration())
                    .attr("d", function(d) {
                        return venn.intersectionAreaPath(d.sets.map(function(j) { return that.sets_data[j]; }));
                    })
                    .style("fill-opacity","0")
                    .style("fill", "black")
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-dasharray", that.border.style())
                    .style("stroke-opacity",1)
                that.path.on("mouseover", function(d, i) {
                        if(that.mode==="default") {
                            tooltip = d.tooltip || d.weight + " users"
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(tooltip);
                            if(PykCharts.boolean(that.onhover_enable)) {
                                d3.select(this)
                                    .style("fill-opacity", .3);
                            }
                        }
                            
                    })
                    .on("mouseout", function(d, i) {
                        if(that.mode==="default") {
                            that.mouseEvent.tooltipHide(d)
                            if(PykCharts.boolean(that.onhover_enable)) {
                                d3.select(this)
                                    .style("fill-opacity", 0);
                            }
                        }
                            
                    })
                    .on("mousemove", function(d) {
                        if(that.mode==="default") {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    })
                    // .transition()
                    // .delay(that.transitions.duration())
                that.path.exit().remove();
                return this;
            },
            label : function () {
                that.node_group.append("text");
                
                that.nodes.select("text")
                    .text("");
                setTimeout(function () {
                    that.nodes.select("text")
                       .attr("dy", ".35em")
                       .attr("x", function(d) { return Math.floor(d.textCenter.x); })
                       .attr("y", function(d) { return Math.floor(d.textCenter.y); })
                       .attr("text-anchor", "middle")
                       .style("fill", that.label_color)
                       .style("font-size",that.label_size)
                       .style("font-family",that.label_family)
                       .style("font-weight",that.label_weight)
                       .style("pointer-events","none")
                       .call(function (text) { text.each(venn.wrapText); });
                }, that.transitions.duration())
                
                return this;
            }
        }
        return optional;
    }
};
