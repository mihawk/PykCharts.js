PykCharts.tree.collapsibleTree = function (options) {
    var that = this;

    this.execute = function () {

        var margin = {top: 20, right: 120, bottom: 20, left: 120},
            width = 960 - margin.right - margin.left,
            height = 800 - margin.top - margin.bottom;

        var i = 0,
            duration = 750,
            root;

        var tree = d3.layout.tree()
            .size([height, width])
            .children(function (d) {
                return d.values;
            });

        var diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; });

        var svg = d3.select(options.selector)
            .attr("class", "Pykcharts-tree")
            .append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.json(options.data, function (error, data) {
            var tree_data = d3.nest()
                .key(function(d) {
                    return d.level1;
                })
                .key(function(d) {
                    return d.level2;
                })
                .key(function(d) {
                    return d.level3;
                })
                .rollup(function(d) {
                    var leaves = [];
                    _.each(d, function (d1) {
                        leaves.push({
                            key: d1.level4,
                            weight: d1.weight
                        });
                    })
                    return leaves;
                })
                .entries(data)

            tree_data = {
                key: "root",
                values: tree_data
            };

            root = tree_data;
            root.x0 = height / 2;
            root.y0 = 0;

            function collapse(d) {
                if (d.values) {
                    d._values = d.values;
                    d._values.forEach(collapse);
                    d.values = null;
                }
            }

            root.values.forEach(collapse);
            update(root);
        });

        d3.select(self.frameElement).style("height", "800px");

        function update(source) {

            var nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);

            nodes.forEach(function(d) { d.y = d.depth * 180; });

            var node = svg.selectAll("g.node")
                .data(nodes, function(d) { return d.id || (d.id = ++i); });

            var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                .on("click", click);

            nodeEnter.append("circle")
                .attr("r", 1e-6)
                .style("fill", function(d) { return d._values ? "lightsteelblue" : "#fff"; });

            nodeEnter.append("text")
                .attr("x", function(d) { return d.values || d._values ? -10 : 10; })
                .attr("dy", ".35em")
                .attr("text-anchor", function(d) { return d.values || d._values ? "end" : "start"; })
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
                .duration(duration)
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
                .duration(duration)
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

        function click(d) {
            if (d.values) {
                d._values = d.values;
                d.values = null;
            } else {
                d.values = d._values;
                d._values = null;
            }
            update(d);
        }
    }
}