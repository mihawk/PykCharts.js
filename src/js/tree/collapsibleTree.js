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
            that.tree_data = that.k1.dataTransfer(that.data);
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
    };
    this.optionalFeatures = function () {
        var optional = {
            svgContainer : function () {
                that.svg = d3.select(options.selector)
                    .attr("class", "Pykcharts-tree")
                    .append("svg")
                    .attr("width", that.width)
                    .attr("height", that.height)
                    .style("overflow","visible");

                that.group = that.svg.append("g")
                    .attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")");
            },
            createChart : function () {
                that.w = that.width - that.margin.right - that.margin.left,
                that.h = that.height - that.margin.top - that.margin.bottom;
                that.i = 0;

                that.tree = d3.layout.tree()
                    .size([that.h, that.w])
                    .children(function (d) {
                        return d.values;
                    });

                that.diagonal = d3.svg.diagonal()
                    .projection(function(d) { return [d.y, d.x]; });

                that.root = that.tree_data;
                that.root.x0 = that.h / 2;
                that.root.y0 = 0;

                function collapse(d) {
                    if (d.values) {
                        d._values = d.values;
                        d._values.forEach(collapse);
                        d.values = null;
                    }
                }

                that.root.values.forEach(collapse);
                this.update(that.root).chartLabel();
                // d3.select(self.frameElement).style("height", that.h).style("width",that.w);
            },

            chartLabel : function () {
                if(PykCharts.boolean(that.label)) {
                    that.nodeEnter.append("text")
                        .attr("x", function(d) { return d.values || d._values ? -10 : 10; })
                        .attr("dy", ".35em")
                        .attr("text-anchor", function(d) { return d.values || d._values ? "end" : "start"; })
                        .attr("pointer-events","none")
                        .text(function(d) { return d.key; })
                        .style("fill-opacity", 1e-6)
                        .style("font-weight", that.label.weight)
                        .style("font-size", that.label.size)
                        .attr("fill", that.label.color)
                        .style("font-family", that.label.family);
                    that.nodeUpdate.select("text")
                        .style("fill-opacity", 1);
                    that.nodeExit.select("text")
                        .style("fill-opacity", 1e-6);
                }
                return this;
            },
            update : function (source) {
                var nodes = that.tree.nodes(that.root).reverse(),
                    links = that.tree.links(nodes);

                nodes.forEach(function(d) { d.y = d.depth * 180; });

                var node = that.group.selectAll("g.node")
                    .data(nodes, function(d) { return d.id || (d.id = ++that.i); });

                that.nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                    

                that.nodeEnter.append("circle")
                    .attr("r", 1e-6)
                    .style("fill", function(d) { return d._values ? "lightsteelblue" : "#fff"; })
                    .on("click", that.click);

                

                that.nodeUpdate = node.transition()
                    .duration(that.transitions.duration())
                    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

                that.nodeUpdate.select("circle")
                    .attr("r", 4.5)
                    .style("fill", function(d) { return d._values ? "lightsteelblue" : "#fff"; });

                

                that.nodeExit = node.exit().transition()
                    .duration(that.transitions.duration())
                    .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                    .remove();

                that.nodeExit.select("circle")
                    .attr("r", 1e-6);

                

                var link = that.group.selectAll("path.link")
                    .data(links, function(d) { return d.target.id; });

                link.enter().insert("path", "g")
                    .attr("class", "link")
                    .attr("d", function(d) {
                        var o = {x: source.x0, y: source.y0};
                        return that.diagonal({source: o, target: o});
                    });

                link.transition()
                    .duration(that.transitions.duration())
                    .attr("d", that.diagonal);

                link.exit().transition()
                    .duration(that.transitions.duration())
                    .attr("d", function(d) {
                        var o = {x: source.x, y: source.y};
                        return that.diagonal({source: o, target: o});
                    })
                    .remove();

                // Stash the old positions for transition.
                nodes.forEach(function(d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });
                return this;
            },
            // panning : function () {
            //     var speed = panSpeed;
            //     if (that.panTimer) {
            //         clearTimeout(that.panTimer);
            //         translateCoords = d3.transform(svgGroup.attr("transform"));
            //         if (direction == 'left' || direction == 'right') {
            //             translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
            //             translateY = translateCoords.translate[1];
            //         } else if (direction == 'up' || direction == 'down') {
            //             translateX = translateCoords.translate[0];
            //             translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
            //         }
            //         scaleX = translateCoords.scale[0];
            //         scaleY = translateCoords.scale[1];
            //         scale = zoomListener.scale();
            //         svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
            //         d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
            //         zoomListener.scale(zoomListener.scale());
            //         zoomListener.translate([translateX, translateY]);
            //         panTimer = setTimeout(function() {
            //             pan(domNode, speed, direction);
            //         }, 50);
            //     }
            // }
        }
        return optional;

    }
    that.click = function (d) {
        if (d.values) {
            d._values = d.values;
            d.values = null;
        } else {
            d.values = d._values;
            d._values = null;
        }
        that.optionalFeatures().update(d)
            .chartLabel();
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

    // function zoom() {
    //     svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    // }


    // // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    // var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

    // function initiateDrag(d, domNode) {
    //     draggingNode = d;
    //     d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
    //     d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
    //     d3.select(domNode).attr('class', 'node activeDrag');

    //     svgGroup.selectAll("g.node").sort(function(a, b) { // select the parent and sort the path's
    //         if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
    //         else return -1; // a is the hovered element, bring "a" to the front
    //     });
    //     // if nodes has children, remove the links and nodes
    //     if (nodes.length > 1) {
    //         // remove link paths
    //         links = tree.links(nodes);
    //         nodePaths = svgGroup.selectAll("path.link")
    //             .data(links, function(d) {
    //                 return d.target.id;
    //             }).remove();
    //         // remove child nodes
    //         nodesExit = svgGroup.selectAll("g.node")
    //             .data(nodes, function(d) {
    //                 return d.id;
    //             }).filter(function(d, i) {
    //                 if (d.id == draggingNode.id) {
    //                     return false;
    //                 }
    //                 return true;
    //             }).remove();
    //     }

    //     // remove parent link
    //     parentLink = tree.links(tree.nodes(draggingNode.parent));
    //     svgGroup.selectAll('path.link').filter(function(d, i) {
    //         if (d.target.id == draggingNode.id) {
    //             return true;
    //         }
    //         return false;
    //     }).remove();

    //     dragStarted = null;
    // }

    // // define the baseSvg, attaching a class for styling and the zoomListener
    // var baseSvg = d3.select("#tree-container").append("svg")
    //     .attr("width", viewerWidth)
    //     .attr("height", viewerHeight)
    //     .attr("class", "overlay")
    //     .call(zoomListener);


    // // Define the drag listeners for drag/drop behaviour of nodes.
    // dragListener = d3.behavior.drag()
    //     .on("dragstart", function(d) {
    //         if (d == root) {
    //             return;
    //         }
    //         dragStarted = true;
    //         nodes = tree.nodes(d);
    //         d3.event.sourceEvent.stopPropagation();
    //         // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
    //     })
    //     .on("drag", function(d) {
    //         if (d == root) {
    //             return;
    //         }
    //         if (dragStarted) {
    //             domNode = this;
    //             initiateDrag(d, domNode);
    //         }

    //         // get coords of mouseEvent relative to svg container to allow for panning
    //         relCoords = d3.mouse($('svg').get(0));
    //         if (relCoords[0] < panBoundary) {
    //             panTimer = true;
    //             pan(this, 'left');
    //         } else if (relCoords[0] > ($('svg').width() - panBoundary)) {

    //             panTimer = true;
    //             pan(this, 'right');
    //         } else if (relCoords[1] < panBoundary) {
    //             panTimer = true;
    //             pan(this, 'up');
    //         } else if (relCoords[1] > ($('svg').height() - panBoundary)) {
    //             panTimer = true;
    //             pan(this, 'down');
    //         } else {
    //             try {
    //                 clearTimeout(panTimer);
    //             } catch (e) {

    //             }
    //         }

    //         d.x0 += d3.event.dy;
    //         d.y0 += d3.event.dx;
    //         var node = d3.select(this);
    //         node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
    //         updateTempConnector();
    //     }).on("dragend", function(d) {
    //         if (d == root) {
    //             return;
    //         }
    //         domNode = this;
    //         if (selectedNode) {
    //             // now remove the element from the parent, and insert it into the new elements children
    //             var index = draggingNode.parent.children.indexOf(draggingNode);
    //             if (index > -1) {
    //                 draggingNode.parent.children.splice(index, 1);
    //             }
    //             if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
    //                 if (typeof selectedNode.children !== 'undefined') {
    //                     selectedNode.children.push(draggingNode);
    //                 } else {
    //                     selectedNode._children.push(draggingNode);
    //                 }
    //             } else {
    //                 selectedNode.children = [];
    //                 selectedNode.children.push(draggingNode);
    //             }
    //             // Make sure that the node being added to is expanded so user can see added node is correctly moved
    //             expand(selectedNode);
    //             sortTree();
    //             endDrag();
    //         } else {
    //             endDrag();
    //         }
    //     });

    // function endDrag() {
    //     selectedNode = null;
    //     d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
    //     d3.select(domNode).attr('class', 'node');
    //     // now restore the mouseover event or we won't be able to drag a 2nd time
    //     d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
    //     updateTempConnector();
    //     if (draggingNode !== null) {
    //         update(root);
    //         centerNode(draggingNode);
    //         draggingNode = null;
    //     }
    // }