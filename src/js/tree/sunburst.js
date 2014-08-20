PykCharts.tree.sunburst = function (options) {
    var that = this;

    this.execute = function () {

        var width = 840,
            height = 500,
            radius = Math.min(width, height) / 2 - 50;

        var x = d3.scale.linear()
            .range([0, 2 * Math.PI]);

        var y = d3.scale.sqrt()
            .range([0, radius]);

        var color = d3.scale.category20c();

        var svg = d3.select(options.selector)
            .attr("class", "PykCharts-sunburst")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

        var partition = d3.layout.partition()
            .value(function(d) { return d.weight; })
            .children(function(d) {
                return d.values;
            });

        var arc = d3.svg.arc()
            .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
            .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
            .innerRadius(function(d) { return Math.max(0, y(d.y)); })
            .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

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

            var path = svg.selectAll("path")
                .data(partition.nodes(tree_data))
                .enter().append("path")
                .attr("d", arc)
                .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
                .on("click", click);

            function click(d) {
                path.transition()
                    .duration(750)
                    .attrTween("d", arcTween(d));
            }
        });

        d3.select(self.frameElement).style("height", height + "px");

        // Interpolate the scales!
        function arcTween(d) {
            var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx])
            , yd = d3.interpolate(y.domain(), [d.y, 1])
            , yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);

            return function(d, i) {
                return i
                    ? function(t) { return arc(d); }
                    : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
            };
        }
    }
}
