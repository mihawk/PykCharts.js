PykCharts.multi_series_2D.ultimate = function(options){
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
                var fD = that.flattenData();
                that.the_bars = fD[0];
                that.the_keys = fD[1];
                that.the_layers = that.layers(that.the_bars);

                that.optionalFeatures()
                        .createColumnChart()
                        .legends();
            });
    };

    //----------------------------------------------------------------------------------------
    //4. Render function to create the chart
    //----------------------------------------------------------------------------------------
    this.render = function(){
        var that = this;

        that.data = that.dataTransformation();

        var fD = that.flattenData();
        that.the_bars = fD[0];
        that.the_keys = fD[1];
        that.the_layers = that.layers(that.the_bars);

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
                .axisContainer();

            that.k.yAxis(that.svg,that.ygroup,that.yScaleInvert)
               .xAxis(that.svg,that.xgroup,that.x0)
               .yGrid(that.svg,that.group,that.yScaleInvert);
              
        } else if(that.mode === "infographic") {

            that.optionalFeatures().svgContainer()
                .createColumnChart()
                .axisContainer();

            that.k.tooltip();
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
            that.k.yAxis(that.svg,that.ygroup,that.yScaleInvert)
                .xAxis(that.svg,that.xgroup,that.x0);
        }
    };

    this.optionalFeatures = function() {
        var that = this;
        var optional = {
            svgContainer: function () {

                $(options.selector).css("background-color",that.bg);
                $(that.selector).attr("class","PykCharts-twoD");
                that.svg = d3.select(that.selector).append("svg:svg")
                    .attr("width",that.width )
                    .attr("height",that.height)
                    .attr("id","svgcontainer")
                    .attr("class","svgcontainer");

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
                if(PykCharts.boolean(that.legends)) {
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
                if(PykCharts.boolean(that.axis.x.enable)) {
                    that.xgroup = that.group.append("g")
                        .attr("id","xaxis")
                        .attr("class", "x axis")
                        .attr("transform","translate(0,"+(that.height-that.margin.top-that.margin.bottom)+")")
                        .style("stroke","none"); 
                }
                
                if(PykCharts.boolean(that.axis.y.enable)) {
                    that.ygroup = that.group.append("g")
                        .attr("id","yaxis")
                        .attr("class","y axis");
                }
                return this;
            },
            createColumnChart: function() {
                var w = that.width - that.margin.left - that.margin.right;
                var h = that.height - that.margin.top - that.margin.bottom;

                var the_bars = that.the_bars;
                var keys = that.the_keys;
                var layers = that.the_layers;
                var groups= that.getGroups();
  
                var stack = d3.layout.stack() // Create default stack
                    .values(function(d){ // The values are present deep in the array, need to tell d3 where to find it
                        return d.values;
                    })(layers);

                var yValues = [];
                layers.map(function(e, i){ // Get all values to create scale
                    for(i in e.values){
                        var d = e.values[i];
                        yValues.push(d.y + d.y0); // Adding up y0 and y to get total height
                    }
                });

                that.xScale = d3.scale.ordinal()
                    .domain(the_bars.map(function(e, i){
                        return e.id || i; // Keep the ID for bars and numbers for integers
                    }))
                    .rangeBands([0,w], 0.1);

                  
                that.yScale = d3.scale.linear().domain([0,d3.max(yValues)]).range([0, h]).nice();
                that.yScaleInvert = d3.scale.linear().domain([d3.max(yValues), 0]).range([0, h]).nice(); // For the yAxis
                var zScale = d3.scale.category10();

                var group_label_data = [];

                for(var i in groups){
                    var g = groups[i];
                    var x = that.xScale(g[0]);
                    var totalWidth = that.xScale.rangeBand() * g.length;
                    x = x + (totalWidth/2);
                    group_label_data.push({x: x, name: i});
                }

                that.x0 = d3.scale.ordinal()
                    .domain(group_label_data.map(function (d,i) { return d.name; }))
                    .rangeRoundBands([0, w], 0.1);

                that.x1 = d3.scale.ordinal()
                    .domain(that.barName.map(function(d) { return d; }))
                    .rangeRoundBands([0, that.x0.rangeBand()]) ;

                // console.log(that.x1.domain(),that.barName,"domain");

                // console.log(layers,"layers");

                // var chart = that.group.selectAll(".group_label")
                //     .data(group_label_data)
                //     .enter()
                //         .append("g")
                //         .attr("class", "group_label");
//                        .attr("transform", function (d) { return "translate(" + that.x0(d.name) + ",0)"; });

                // var opacity = 0;
                // var seriesLength = layers[0].values.length;
                // console.log(seriesLength,"seriesLength");

                console.log(layers,"layersssssssssssss");
                var bars = that.group.selectAll(".bars")
                    .data(layers);

                bars.enter()
                        .append("g")
                        .attr("class", "bars");

                var rect = bars.selectAll("rect")
                    .data(function(d,i){
                        return d.values;
                    });

                rect.enter()
                    .append("svg:rect")
                    .attr("class","rect")

                rect.attr("height", 0).attr("y", h)
                    .attr("fill", function(d){
                        return that.fillColor(d);
                    })
                    .attr("fill-opacity", function (d,i) {
                        // if(options.optional && options.optional.colors && options.optional.colors.saturationColor) {
                        //     if(i < seriesLength-1) {
                        //         return (opacity+1)/ layers.length;
                                
                        //     } else {
                        //         opacity++;
                        //         return opacity/ layers.length;
                        //     }
                        // } else {
                            return 1;
//                        }
                    })
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-opacity",1)
                    .on('mouseover',function (d) {
                        that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.toolTextShow(d.tooltip ? d.tooltip : d.y);
                    })
                    .on('mouseout',function (d) {
                        that.mouseEvent.tooltipHide(d);
                    })
                    .on('mousemove', function (d) {
                        that.mouseEvent.tooltipPosition(d);
                    });

                rect.transition()
                    .duration(that.transitions.duration())
                    .attr("x", function(d){
                        return that.xScale(d.x);
                    })
                    .attr("width", function(d){
                        return that.xScale.rangeBand();
                    })
                    .attr("height", function(d){
                        return that.yScale(d.y);
                    })
                    .attr("y", function(d){
                        return h - that.yScale(d.y0 + d.y);
                    });

                bars.exit()
                    .remove();

            return this;
            },
            legends: function () {
                if(PykCharts.boolean(that.legends)) {
                    var params = that.getParameters();
                    var j = 0,k = 0;
                    j = params.length;
                    k = params.length;                
                    console.log(params);
                    console.log(that.legends.display);
                    if(that.legends.display === "vertical" ) {

                        that.legend_svg.attr("height", (params.length * 30)+20)
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

    this.layers = function(the_bars){
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
                        "group": that.keys[id]
                    });
                }
            }
        }
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
            var name = that.the_layers[i].name
            , color;
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
    }

    this.dataTransformation = function () {

        var data_tranform = [];
        that.barName = [];
        var data_length = that.data.length;                                                                                                             
        for(var i=0; i < data_length; i++) {
            var group = {}
            , bar = {}
            , stack;

            if(!that.data[i].group) {
                that.data[i].group = "group" + i;
            }

            if(!that.data[i].stack) {
                that.data[i].stack = "stack";
            }

            that.barName[i] = that.data[i].group;
            group[that.data[i].x] = [];      
            bar[that.data[i].group] = [];
            stack = { "name": that.data[i].stack, "tooltip": that.data[i].tooltip, "color": that.data[i].color, "val": that.data[i].y, highlight: that.data[i].highlight };

            if(i === 0) {
                data_tranform.push(group);
                data_tranform[i][that.data[i].x].push(bar);
                data_tranform[i][that.data[i].x][i][that.data[i].group].push(stack);
            } else {
                var data_tranform_lenght = data_tranform.length;
                var j=0;
                for(j=0;j < data_tranform_lenght; j++) {
                    if ((_.has(data_tranform[j], that.data[i].x))) {
                        var barr = data_tranform[j][that.data[i].x];
                        var barLength = barr.length;
                        var k = 0;
                        for(k =0; k<barLength;k++) {
                            if(_.has(data_tranform[j][that.data[i].x][k],that.data[i].group)) {
                                break;
                            }
                        }
                        if(k < barLength) {
                            data_tranform[j][that.data[i].x][k][that.data[i].group].push(stack);                   
                        } else {
                            data_tranform[j][that.data[i].x].push(bar);
                            data_tranform[j][that.data[i].x][k][that.data[i].group].push(stack);                      
                        }
                        break;
                    }
                }
                if(j === data_tranform_lenght) {    
                    data_tranform.push(group);
                    data_tranform[j][that.data[i].x].push(bar);
                    data_tranform[j][that.data[i].x][0][that.data[i].group].push(stack);
                }
            }
        }
        that.barName = _.unique(that.barName);

        return data_tranform;
    };
    return this;
};