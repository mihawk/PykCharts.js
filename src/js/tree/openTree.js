PykCharts.tree.openTree = function (options) {
    var that = this;

    this.execute = function () {

        var width = 960,
            height = 2200;

        var cluster = d3.layout.cluster()
            .size([height, width - 160])
            .children(function (d) {
                return d.values;
            });

        var diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; });

        var svg = d3.select(options.selector)
            .attr("class", "Pykcharts-tree")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(40,0)");

        d3.json(options.data, function(error, data) {
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

            var nodes = cluster.nodes(tree_data),
                links = cluster.links(nodes);

            var link = svg.selectAll(".link")
                .data(links)
                .enter().append("path")
                .attr("class", "link")
                .attr("d", diagonal);

            var node = svg.selectAll(".node")
                .data(nodes)
                .enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

            node.append("circle")
                .attr("r", 4.5);

            node.append("text")
                .attr("dx", function(d) { return d.values ? -8 : 8; })
                .attr("dy", 3)
                .style("text-anchor", function(d) { return d.values ? "end" : "start"; })
                .text(function(d) { return d.key; });
        });

        d3.select(self.frameElement).style("height", height + "px");
    }
}