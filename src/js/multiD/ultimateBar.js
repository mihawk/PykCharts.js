PykCharts.multi_series_2D.ultimateBar = function(options){
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    
    this.execute = function () {
        that = new PykCharts.twoD.processInputs(that, options, "column");

        that.grid = options.chart && options.chart.grid ? options.chart.grid : theme.stylesheet.chart.grid;
        that.grid.yEnabled = options.chart && options.chart.grid && options.chart.grid.yEnabled ? options.chart.grid.yEnabled : theme.stylesheet.chart.grid.yEnabled;
        that.grid.color = options.chart && options.chart.grid && options.chart.grid.color ? options.chart.grid.color : theme.stylesheet.chart.grid.color;

        if(that.mode === "default") {
           that.k.loading();
        }
        d3.json(options.data, function(e, data){
            that.data = data;
            $(that.selector+" #chart-loader").remove();
            that.render();
        });
    };

    this.refresh = function () {
        d3.json(options.data, function (e, data) {
            that.data = data;      
            that.data = that.dataTransformation();        
            that.data = that.emptygroups(that.data);                           
            var fD = that.flattenData();
            that.the_bars = fD[0];
            that.the_keys = fD[1];
            that.the_layers = that.buildLayers(that.the_bars);

            that.optionalFeatures()
                    .createColumnChart()
                    .legends()
                    //.ticks();
        });
    };

    //----------------------------------------------------------------------------------------
    //4. Render function to create the chart
    //----------------------------------------------------------------------------------------
    this.render = function(){
        var that = this;

        that.data = that.dataTransformation();
        that.data = that.emptygroups(that.data);
        var fD = that.flattenData();
        that.the_bars = fD[0];
        that.the_keys = fD[1];
        that.the_layers = that.buildLayers(that.the_bars);
        // console.log(that.the_bars);
        that.border = new PykCharts.Configuration.border(that);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.mouseEvent1 = new PykCharts.twoD.mouseEvent(that);
        that.fillColor = new PykCharts.multi_series_2D.fillChart(that,options);
        that.border = new PykCharts.Configuration.border(that);

        if(that.mode === "default") {

            that.k.title()
                .subtitle();

            that.optionalFeatures()
                .legendsContainer()
                .svgContainer();

            that.k.credits()
                .dataSource()
                .liveData(that)
                .tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
            
            that.optionalFeatures()
                .createColumnChart()
                .legends()
                .axisContainer()
               .ticks();

            that.k.xAxis(that.svg,that.xgroup,that.xScale)
                 .xGrid(that.svg,that.group,that.xScale);
//               .yAxis(that.svg,that.ygroup,that.y0);
              
        } else if(that.mode === "infographics") {
            that.optionalFeatures().svgContainer()
                .createColumnChart()
                .axisContainer();

            that.k.tooltip();
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
            that.k.xAxis(that.svg,that.xgroup,that.xScale);
           //    .yAxis(that.svg,that.ygroup,that.y0)
            
        }
    };

    this.optionalFeatures = function() {
        var that = this;
        var optional = {
            svgContainer: function () {
                $(that.selector).attr("class","PykCharts-twoD");
                that.svg = d3.select(that.selector).append("svg:svg")
                    .attr("width",that.width )
                    .attr("height",that.height)
                    .attr("id","svgcontainer")
                    .attr("class","svgcontainer")
                    .style("background-color",that.bg);

                that.group = that.svg.append("g")
                    .attr("id","svggroup")
                    .attr("class","svggroup")
                    .attr("transform","translate(" + that.margin.left + "," + that.margin.top +")");
               
                if(PykCharts.boolean(that.grid.yEnabled)) {
                    that.group.append("g")
                        .attr("id","ygrid")
                        .style("stroke",that.grid.color)
                        .attr("class","y grid-line");
                }
                return this;
            },
            legendsContainer: function () {
                if(PykCharts.boolean(that.legends.enable)) {
                    that.legend_svg = d3.select(that.selector).append("svg:svg")
                        .attr("width",that.width)
                        .attr("height",50)
                        .attr("class","legendscontainer")
                        .attr("id","legendscontainer");

                    that.legends_group = that.legend_svg.append("g")
                        .attr("id","legends")
                        .attr("class","legends")
                        .attr("transform","translate(0,10)");
                }

                return this;
            },
            axisContainer : function () {
                if(PykCharts.boolean(that.axis.y.enable)) {

                    var axis_line = that.group.selectAll(".axis-line")
                        .data(["line"]);

                    axis_line.enter()
                            .append("line");

                    axis_line.attr("class","axis-line")
                            .attr("x1",0)
                            .attr("y1",0)
                            .attr("x2",0)
                            .attr("y2",that.height-that.margin.top-that.margin.bottom)
                            .attr("stroke",that.axis.x.axisColor);

                    axis_line.exit().remove();

                    that.xgroup = that.group.append("g")
                        .attr("id","xaxis")
                        .attr("class", "y axis");
                        // .attr("transform","translate(0,"+(that.height-that.margin.top-that.margin.bottom)+")")
                        // .style("stroke","none"); 
                }
                
                if(PykCharts.boolean(that.axis.x.enable)) {
                    that.ygroup = that.group.append("g")
                        .attr("id","xaxis")
                        .attr("class","x axis");
                }
                return this;
            },
            createColumnChart: function() {
                var w = that.width - that.margin.left - that.margin.right;
                var h = that.height - that.margin.top - that.margin.bottom;

                var the_bars = that.the_bars;
                var keys = that.the_keys;
                that.layers = that.the_layers;
                var groups= that.getGroups();
  
                var stack = d3.layout.stack() // Create default stack
                    .values(function(d){ // The values are present deep in the array, need to tell d3 where to find it
                        return d.values;
                    })(that.layers);
                // console.log(stack);
                that.layers = that.layers.map(function (group) {
                    return {
                        name : group.name,
                        values : group.values.map(function (d) {
                            // Invert the x and y values, and y0 becomes x0
                            return {
                                x: d.y,
                                y: d.x,
                                x0: d.y0,
                                tooltip : d.tooltip,
                                color: d.color,
                                group: d.group,
                                name:d.name,
                                highlight:d.highlight
                            };
                        })
                    };
                })
                // console.log(layers);
                var xValues = [];
                that.layers.map(function(e, i){ // Get all values to create scale
                    for(i in e.values){
                        var d = e.values[i];
                        xValues.push(d.x + d.x0); // Adding up y0 and y to get total height
                    }
                });
                that.yScale = d3.scale.ordinal()
                    .domain(the_bars.map(function(e, i){
                        return e.id || i; // Keep the ID for bars and numbers for integers
                    }))
                    .rangeBands([0,h]);

                that.xScale = d3.scale.linear().domain([0,d3.max(xValues)]).range([0, w]).nice();
                // that.yScaleInvert = d3.scale.linear().domain([d3.max(yValues), 0]).range([0, h]).nice(); // For the yAxis
                var zScale = d3.scale.category10();

                var group_label_data = [];

                for(var i in groups){
                    var g = groups[i];
                    var y = that.yScale(g[0]);
                    var totalHeight = that.yScale.rangeBand() * g.length;
                    y = y + (totalHeight/2);
                    group_label_data.push({y: y, name: i});
                }

                that.y0 = d3.scale.ordinal()
                    .domain(group_label_data.map(function (d,i) { return d.name; }))
                    .rangeRoundBands([0, h], 0.1);

                that.y1 = d3.scale.ordinal()
                    .domain(that.barName.map(function(d) { return d; }))
                    .rangeRoundBands([0, that.y0.rangeBand()]) ;

                that.y_factor = 0;
                that.height_factor = 0;
                if(that.max_length === 1) {
                    that.y_factor = that.yScale.rangeBand()/4;
                    that.height_factor = (that.yScale.rangeBand()/(2*that.max_length));
                };

                var yAxis_label = that.group.selectAll("text.axis-text")
                    .data(group_label_data);

                yAxis_label.enter()
                        .append("text")

                yAxis_label.attr("class", "axis-text")
                        .attr("y", function(d){
                            return d.y;
                        })
                        .attr("x", function(d){
                            return -10;
                        })
                        .attr("text-anchor", "end")
                        .attr("fill",that.axis.y.labelColor)
                        .text(function(d){
                            return d.name;
                        });

                yAxis_label.exit().remove();

                that.bars = that.group.selectAll(".bars")
                    .data(that.layers);

                that.bars.enter()
                        .append("g")
                        .attr("class", "bars");

                var rect = that.bars.selectAll("rect")
                    .data(function(d,i){
                        return d.values;
                    });

                rect.enter()
                    .append("svg:rect")
                    .attr("class","rect")

                rect.attr("width", 0).attr("x", 0)
                    .attr("fill", function(d){
                        return that.fillColor(d);
                    })
                    .attr("fill-opacity", function (d,i) {
                            return 1;
                    })
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-opacity",1)
                    .on('mouseover',function (d) {
                        that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.toolTextShow(d.tooltip ? d.tooltip : d.y);
                        that.mouseEvent.axisHighlightShow(d.name,options.selector + " .axis-text","bar");
                    })
                    .on('mouseout',function (d) {
                        that.mouseEvent.tooltipHide(d);
                        that.mouseEvent.axisHighlightHide(options.selector + " .axis-text","bar");
                    })
                    .on('mousemove', function (d) {
                        that.mouseEvent.tooltipPosition(d);
                    });

                rect.transition()
                    .duration(that.transitions.duration())
                    .attr("x", function(d){
                        return that.xScale(d.x0);
                    })
                    .attr("width", function(d){
                        return that.xScale(d.x);
                    })
                    .attr("height", function(d){
                        return that.yScale.rangeBand()+that.height_factor;
                    })
                    .attr("y", function(d){
                        return that.yScale(d.y)-that.y_factor;                        
                    });

                that.bars.exit()
                    .remove();

                return this;
            },
            ticks: function () {
                if(that.label.size) {
                    that.txt_width;
                    that.txt_height;
                    var ticks = that.bars.selectAll("g")
                                .data(that.layers);
                    
                    var ticksText = that.bars.selectAll(".ticksText")
                                .data(function(d) {
                                        // console.log(d.values);
                                        return d.values;
                                });
                    ticksText.enter()
                        .append("text")
                        .attr("class","ticksText");

                    ticksText.attr("class","ticksText")
                        .text(function(d) {
                            if(d.x) { 
                                // console.log(d.x);
                                return d.x;
                            }
                        })
                        .style("font-weight", that.label.weight)
                        .style("font-size", that.label.size)
                        .attr("fill", that.label.color)
                        .style("font-family", that.label.family)
                        .text(function(d) {
                            if(d.x) {
                                that.txt_width = this.getBBox().width;
                                that.txt_height = this.getBBox().height;
                                if(d.x && (that.txt_width< that.xScale(d.x)) && (that.txt_height < (that.yScale.rangeBand()+that.height_factor ))) {                                   
                                    return d.x;
                                }
                            }
                        })
                        .attr("x", function(d){
                            var bar_width  = that.xScale(d.x);
                            return that.xScale(d.x0) + that.xScale(d.x) - that.txt_width - 5;    
                        })
                        .attr("y",function(d){
                            return that.yScale(d.y)-that.y_factor+(that.yScale.rangeBand()/2);
                        })
                        .attr("dy",5)
                        .style("font-size",function(d) {
                            // console.log(that.label.size);
                            return that.label.size;
                        });

                    ticksText.exit().remove();
                }
                return this;
            },
            legends: function () {
                if(PykCharts.boolean(that.legends.enable)) {
                    var params = that.getParameters();
                    var j = 0,k = 0;
                    j = params.length;
                    k = params.length;

                    if(that.legends.display === "vertical" ) {
                        that.legend_svg.attr("height", (params.length * 30)+20);
                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        text_parameter1value = function (d,i) { return that.width - that.width/4 + 16; };
                        rect_parameter3value = function (d,i) { return that.width - that.width/4; };
                        var rect_parameter4value = function (d,i) { return i * 24 + 12;};
                        var text_parameter2value = function (d,i) { return i * 24 + 23;};
                    }
                    else if(that.legends.display === "horizontal") {
                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        rect_parameter1 = "width";
                        rect_parameter2 = "height";
                        rect_parameter3 = "x";
                        rect_parameter4 = "y";
                        var text_parameter1value = function (d,i) { j--;return that.width - (j*100 + 75); };
                        text_parameter2value = 30;
                        rect_parameter1value = 13;
                        rect_parameter2value = 13;
                        var rect_parameter3value = function (d,i) { k--;return that.width - (k*100 + 100); };
                        rect_parameter4value = 18;
                    }

                    var legend = that.legends_group.selectAll("rect")
                                    .data(params);

                    legend.enter()
                            .append("rect");

                    legend.attr(rect_parameter1, rect_parameter1value)
                        .attr(rect_parameter2, rect_parameter2value)
                        .attr(rect_parameter3, rect_parameter3value)
                        .attr(rect_parameter4, rect_parameter4value)
                        .attr("fill", function (d) {
                            return d.color;
                        });

                    legend.exit().remove();

                    that.legends_text = that.legends_group.selectAll(".legends_text")
                        .data(params);
                    
                    that.legends_text
                        .enter()
                        .append('text')
                        .attr("class","legends_text")
                        .attr("fill","#1D1D1D")
                        .attr("pointer-events","none")
                        .style("font-family", "'Helvetica Neue',Helvetica,Arial,sans-serif")
                        .attr("font-size",12);

                    that.legends_text.attr("class","legends_text")
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   .attr("fill","black")
                    .attr(text_parameter1, text_parameter1value)
                    .attr(text_parameter2, text_parameter2value)
                    .text(function (d) { return d.name; });
                    
                    that.legends_text.exit()
                                    .remove();                
                }     
                return this;    
            } 
        }
        return optional;
    };

    //----------------------------------------------------------------------------------------
    // 6. Rendering groups:
    //----------------------------------------------------------------------------------------
    
    this.getGroups = function(){
        var groups = {};
        for(var i in that.the_bars){
            var bar = that.the_bars[i];
            if(!bar.id) continue;
            if(groups[bar.group]){
                groups[bar.group].push(bar.id);
            }else{
                groups[bar.group] = [bar.id];
            }
        }
        return groups;
    };

    //----------------------------------------------------------------------------------------
    // 10.Data Manuplation:
    //----------------------------------------------------------------------------------------

    // Data Helpers
    // Takes the flattened data and returns layers
    // Each layer is a separate category
    // The structure of the layer is made so that is plays well with d3.stack.layout()
    // Docs - https://github.com/mbostock/d3/wiki/Stack-Layout#wiki-values

    this.buildLayers = function(the_bars){
        var layers = [];

        function findLayer(l){
            for(var i in layers){
                var layer = layers[i];
                if (layer.name == l) return layer;
            }
            return addLayer(l);
        }

        function addLayer(l){
            var new_layer = {
                "name": l,
                "values": []
            };
            layers.push(new_layer);
            return new_layer;
        }

        for(var i in the_bars){
            var bar = the_bars[i];
            if(!bar.id) continue;
            var id = bar.id;
            for(var k in bar){
                // console.log(bar,"bar");
                if(k === "id") continue;
                var icings = bar[k];
                for(var j in icings){
                    var icing = icings[j];
                    if(!icing.name) continue;
                    var layer = findLayer(icing.name);
                    layer.values.push({
                        "x": id,
                        "y": icing.val,
                        "color": icing.color,
                        "tooltip": icing.tooltip,
                        "highlight": icing.highlight,
                        "group": that.keys[id],
                        "name": bar.group
                    });
                }
            }
        }
        // console.log(layers,"layers"); 
        return layers;
    };

    // Traverses the JSON and returns an array of the 'bars' that are to be rendered
    this.flattenData = function(){
        var the_bars = [-1];
        that.keys = {};
        for(var i in that.data){
            var d = that.data[i];
            for(var cat_name in d){
                for(var j in d[cat_name]){
                    var id = "i" + i + "j" + j;
                    var key = Object.keys(d[cat_name][j])[0];
                    that.keys[id] = key;
                    d[cat_name][j].id = id;
                    d[cat_name][j].group = cat_name;

                    the_bars.push(d[cat_name][j]);
                }
                the_bars.push(i); // Extra seperator element for gaps in segments
            }
        }
        return [the_bars, that.keys];
    };

    this.getParameters = function () {
        var p = [];
        for(var i in  that.the_layers){
            if(!that.the_layers[i].name) continue;
            var name = that.the_layers[i].name, color;
            if(options.optional && options.optional.colors) {
                if(options.optional.colors.chartColor) {
                    color = that.chartColor;
                }
                else if(that.the_layers[i].values[0].color) {
                    color = that.the_layers[i].values[0].color;   
                }
            }
            else {
                color = that.chartColor;
            }

            p.push({
                "name": name,
                "color": color
            });
        }
        return p;
    };
    this.emptygroups = function (data) {

        that.max_length = d3.max(data,function (d){
            var value = _.values(d);
            return value[0].length;
        });

        var new_data = _.map(data,function (d,i){
            var value = _.values(d);
            while(value[0].length < that.max_length) {
                var key = _.keys(d);
                var stack = { "name": "stack", "tooltip": "null", "color": "white", "val": 0, highlight: false };
                var group = {"group3":[stack]};
                // console.log(data[1],"dataaaaaaaa");
                data[i][key[0]].push(group);
                value = _.values(d);
            }
        });
        // console.log(data,"new_data");
        return data;
    };

    this.dataTransformation = function () {

        var data_tranform = [];
        that.barName = [];
        var data_length = that.data.length;                                                                                                             
        for(var i=0; i < data_length; i++) {
            var group = {},
                bar = {},
                stack;

            if(!that.data[i].group) {
                that.data[i].group = "group" + i;
            }

            if(!that.data[i].stack) {
                that.data[i].stack = "stack";
            }

            that.barName[i] = that.data[i].group;
            group[that.data[i].y] = [];      
            bar[that.data[i].group] = [];
            stack = { "name": that.data[i].stack, "tooltip": that.data[i].tooltip, "color": that.data[i].color, "val": that.data[i].x, highlight: that.data[i].highlight };

            if(i === 0) {
                data_tranform.push(group);
                data_tranform[i][that.data[i].y].push(bar);
                data_tranform[i][that.data[i].y][i][that.data[i].group].push(stack);
            } else {
                var data_tranform_lenght = data_tranform.length;
                var j=0;
                for(j=0;j < data_tranform_lenght; j++) {
                    if ((_.has(data_tranform[j], that.data[i].y))) {
                        var barr = data_tranform[j][that.data[i].y];
                        var barLength = barr.length;
                        var k = 0;
                        for(k =0; k<barLength;k++) {
                            if(_.has(data_tranform[j][that.data[i].y][k],that.data[i].group)) {
                                break;
                            }
                        }
                        if(k < barLength) {
                            data_tranform[j][that.data[i].y][k][that.data[i].group].push(stack);                   
                        } else {
                            data_tranform[j][that.data[i].y].push(bar);
                            data_tranform[j][that.data[i].y][k][that.data[i].group].push(stack);                      
                        }
                        break;
                    }
                }
                if(j === data_tranform_lenght) {    
                    data_tranform.push(group);
                    data_tranform[j][that.data[i].y].push(bar);
                    data_tranform[j][that.data[i].y][0][that.data[i].group].push(stack);
                }
            }
        }
        that.barName = _.unique(that.barName);

        return data_tranform;
    };
    return this;
};