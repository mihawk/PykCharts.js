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
                // .tooltip();

            // that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
            
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
                    .append("svg")
                    .attr("width", that.width)
                    .attr("height", that.height);

                that.group = that.svg.append("g")
                    .attr("transform", "translate(" + that.margin.left + ",0)");
            },
            createOpenTree : function () {
                var width = that.width,
                    height = that.height;

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
                        
                    link.attr("class", "link")
                        .attr("d", diagonal);

                    link.exit().remove();

                that.node = that.group.selectAll(".node")
                    .data(that.nodes);

                that.node.enter()
                        .append("g")

                that.node.attr("class", "node")
                        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

                that.node.append("circle")
                    .attr("r", 4.5)
                    .style("fill",that.chartColor)
                    .style("stroke",that.border.color())
                    .style("stroke-width",that.border.width());
                
                that.node.exit().remove();
                var color = d3.scale.category20c();
                console.log(color(),"color");
                console.log(color(),"color");

                d3.select(self.frameElement).style("height", height + "px");
            return this;
            },
            label : function() {
               if(that.label.size) {
                
            
               }
                return this;    
            }
        }
        return optional;
    };
};