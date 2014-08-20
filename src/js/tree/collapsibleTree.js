PykCharts.tree.collapsibleTree = function (options) {
    var that = this;
    this.execute = function () {
        that = new PykCharts.tree.processInputs(that, options, "collapsibleTree");
        that.k1 = new PykCharts.tree.configuration(that);
        if(that.mode === "default") {
           that.k.loading();
        }
        d3.json(options.data, function(e, data){
            
            that.data = data;
            console.log(that.k1.dataTransfer);
            // that.tree_data = that.k1.dataTransfer();
            console.log(that.tree_data);
            // that.tree_data = {
            //     key: "root",
            //     values: that.tree_data
            // };            
            $(that.selector+" #chart-loader").remove();
            that.render();

        });
    },
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
                // .liveData(that)
                // .tooltip();

            // that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
            
            that.optionalFeatures()
                .createChart();
              
        } else if(that.mode === "infographic") {

            that.optionalFeatures().svgContainer()
                .createChart();

            that.k.tooltip();
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        }
    },
    this.optionalFeatures = function () {
        var optional = {
            svgContainer : function () {
                that.svg = d3.select(options.selector)
                    .attr("class", "Pykcharts-tree")
                    .append("svg")
                    .attr("width", that.width)
                    .attr("height", that.height);

                that.group = that.svg.append("g")
                    .attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")");
            },
            createChart : function () {
                that.w = that.width - that.margin.right - that.margin.left,
                that.h = that.height - that.margin.top - that.margin.bottom;
                var i = 0,
                root,
                tree,
                diagonal;

                tree = d3.layout.tree()
                    .size([that.height, that.width])
                    .children(function (d) {
                        return d.values;
                    });

                diagonal = d3.svg.diagonal()
                    .projection(function(d) { return [d.y, d.x]; });

                root = that.tree_data;
                root.x0 = that.h / 2;
                root.y0 = 0;

                function collapse(d) {
                    if (d.values) {
                        d._values = d.values;
                        d._values.forEach(collapse);
                        d.values = null;
                    }
                }

                root.values.forEach(collapse);
                this.update(root);
                function click(d) {
                    if (d.values) {
                        d._values = d.values;
                        d.values = null;
                    } else {
                        d.values = d._values;
                        d._values = null;
                    }
                }
                d3.select(self.frameElement).style("height", that.h);
                this.update(d);
            },

            chartLabel : function () {

            },
            update : function (source) {
                var nodes = tree.nodes(root).reverse(),
                    links = tree.links(nodes);

                nodes.forEach(function(d) { d.y = d.depth * 180; });

                var node = svg.selectAll("g.node")
                    .data(nodes, function(d) { return d.id || (d.id = ++i); });

                var nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                    

                nodeEnter.append("circle")
                    .attr("r", 1e-6)
                    .style("fill", function(d) { return d._values ? "lightsteelblue" : "#fff"; })
                    .on("click", click);

                nodeEnter.append("text")
                    .attr("x", function(d) { return d.values || d._values ? -10 : 10; })
                    .attr("dy", ".35em")
                    .attr("text-anchor", function(d) { return d.values || d._values ? "end" : "start"; })
                    .attr("pointer-events","none")
                    .text(function(d) { return d.key; })
                    .style("fill-opacity", 1e-6);

                var nodeUpdate = node.transition()
                    .duration(duration)
                    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

                nodeUpdate.select("circle")
                    .attr("r", 4.5)
                    .style("fill", function(d) { return d._values ? "lightsteelblue" : "#fff"; });

                nodeUpdate.select("text")
                    .style("fill-opacity", 1);

                var nodeExit = node.exit().transition()
                    .duration(that.transitions.duration())
                    .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                    .remove();

                nodeExit.select("circle")
                    .attr("r", 1e-6);

                nodeExit.select("text")
                    .style("fill-opacity", 1e-6);

                var link = svg.selectAll("path.link")
                    .data(links, function(d) { return d.target.id; });

                link.enter().insert("path", "g")
                    .attr("class", "link")
                    .attr("d", function(d) {
                        var o = {x: source.x0, y: source.y0};
                        return diagonal({source: o, target: o});
                    });

                link.transition()
                    .duration(duration)
                    .attr("d", diagonal);

                link.exit().transition()
                    .duration(that.transitions.duration())
                    .attr("d", function(d) {
                        var o = {x: source.x, y: source.y};
                        return diagonal({source: o, target: o});
                    })
                    .remove();

                // Stash the old positions for transition.
                nodes.forEach(function(d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });
            }
        }
        return optional;

    }
    // this.execute = function () {
        

        
        

    //     d3.json(options.data, function (error, data) {
    //         var tree_data = 

            
    //     });

    //     d3.select(self.frameElement).style("height", "800px");

    //     function update(source) {

            
    //     }

        
    // }
}