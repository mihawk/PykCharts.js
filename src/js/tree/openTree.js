PykCharts.tree.openTree = function (options) {
    var that = this;
    this.execute = function () {
        that = new PykCharts.tree.processInputs(that, options, "collapsibleTree");
        that.k1 = new PykCharts.tree.configuration(that);
        if(that.mode === "default") {
           that.k.loading();
        }
        d3.json(options.data, function(e, data){
            
            that.data = data;
            that.tree_data = that.k1.dataTransfer(that.data);
            $(that.selector+" #chart-loader").remove();
            that.render();

        });
    },

    this.refresh = function () {
        d3.json(options.data, function (e, data) {
            console.log("liveData");
            that.data = data;  
            that.tree_data = that.k1.dataTransfer(that.data);
            that.optionalFeatures()
                    .createOpenTree()
                    .label();

            that.zoomListener = that.k1.zoom(that.svg,that.group);        
        });
    };

    this.render = function () {
        that.border = new PykCharts.Configuration.border(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        // that.mouseEvent1 = new PykCharts.twoD.mouseEvent(that);
        // that.fillColor = new PykCharts.multi_series_2D.fillChart(that,options);
        
        if(that.mode === "default") {

            that.k.title()
                .subtitle();

            that.optionalFeatures()
                .svgContainer();

            that.k.credits()
                .dataSource()
                .liveData(that)
                .tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
            
            that.optionalFeatures()
                .createOpenTree()
                .label();

            that.zoomListener = that.k1.zoom(that.svg,that.group);
              
        } else if(that.mode === "infographic") {

            that.optionalFeatures().svgContainer()
                .createOpenTree();

            that.k.tooltip();
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        }
    };

    this.optionalFeatures = function () {
        var optional = {
            svgContainer : function () {
                that.svg = d3.select(options.selector)
                    .attr("class", "Pykcharts-tree")
                    .attr("id","svgcontainer")
                    .append("svg")
                    .attr("width", that.width)
                    .attr("height", that.height);

                that.group = that.svg.append("g")
                    .attr("transform", "translate(" + that.margin.left + ",0)");
            },
            createOpenTree : function () {
                var width = that.width,
                    height = that.height;
                
                that.root = that.tree_data;
                that.root.x0 = that.height / 2;
                that.root.y0 = 0;

                var cluster = d3.layout.cluster()
                    .size([height, width - 160])
                    .children(function (d) {
                        return d.values;
                    });

                var diagonal = d3.svg.diagonal()
                    .projection(function(d) { return [d.y, d.x]; });

                that.nodes = cluster.nodes(that.tree_data),
                    links = cluster.links(that.nodes);

                var link = that.group.selectAll(".link")
                    .data(links);

                    link.enter()
                        .append("path")
                    
                 
                    .attr("class", "link")
                    .attr("d", function(d) {
                        console.log("abc");
                        var o = {x: that.root.x0, y: that.root.y0};
                        return diagonal({source: o, target: o});
                    });
                
                    link.transition()
                        .duration(that.transitions.duration())
                        .attr("d", diagonal);

                    link.exit().remove();

                that.node = that.group.selectAll(".node")
                    .data(that.nodes);

                that.nodeEnter =that.node.enter()
                        .append("g");

                that.nodeEnter.attr("class", "node")

                that.nodeEnter.transition()
                        .duration(that.transitions.duration())
                        .attr("transform", function(d) { return "translate(" + that.root.y0 + "," + that.root.x0 + ")"; })

                that.nodeEnter.append("circle");
                
                that.nodeUpdate = that.node
                       .attr("transform", function(d) { return "translate(" + that.root.y0 + "," + that.root.x0 + ")"; })

                that.nodeUpdate.select("g.node circle")
                    .on('mouseover',function (d) {
                        that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.tooltipTextShow(d.key);
                    })
                    .on('mouseout',function (d) {
                        that.mouseEvent.tooltipHide(d);
                    })
                    .on('mousemove', function (d) {
                        that.mouseEvent.tooltipPosition(d);
                    })
                    .attr("r", that.nodeRadius)
                    .style("fill",that.chartColor)
                    .style("stroke",that.border.color())
                    .style("stroke-width",that.border.width());


                that.nodeUpdate.transition()
                        .duration(that.transitions.duration())
                        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })                        
 
                that.node.exit().remove();

                d3.select(self.frameElement).style("height", height + "px");
            return this;
            },
            label : function() {
               if(that.label.size) {     

                    that.nodeEnter.append("text")

                    that.nodeUpdate.select("g.node text")
                        .transition()
                        .delay(that.transitions.duration())
                        .attr("dx", function(d) { return d.values ? -8 : 8; })
                        .attr("dy", 3)
                        .text(function(d) { return d.key; })
                        .style("text-anchor", function(d) { return d.values ? "end" : "start"; })
                        .style("font-weight", that.label.weight)
                        .style("font-size", that.label.size)
                        .attr("fill", that.label.color)
                        .style("font-family", that.label.family);
                        
               }
                return this;    
            }
        }
        return optional;
    };
};