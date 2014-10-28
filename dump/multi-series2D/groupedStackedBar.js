PykCharts.multi_series_2D.groupedStackedBar = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function() {
        var that = this;

        that.k = new PykCharts.Configuration(options);
        that = new PykCharts.twoD.processInputs(that, options, "column");
        that.mode = options.mode;
        //that.loading = options.optional.loading;
        that.selector = options.selector;
        that.w = options.optional.chart.width;
        that.h = options.optional.chart.height;
        that.margin = options.optional.chart.margin;
        that.ticks = options.optional.chart.no_of_ticks;
        that.enableTooltip = theme.stylesheet.enableTooltip;
        that.title = options.optional.title;
        that.color = options.optional.color;
        that.saturation = options.optional.saturation;
        that.legends = options.optional.legends;
        that.dataSource = options.optional.dataSource;
        that.liveData = options.optional.liveData;
        that.fullScreenEnable = theme.stylesheet.buttons.enableFullScreenButton
        //that.loading = options.optional.loading;
        that.enableTicks = theme.stylesheet.enableTicks;
        that.download = options.optional.download;
        that.barBorder = options.optional.border;
        that.axis = options.optional.axis;
        that.grid = options.optional.chart.grid;
        that.transition = options.optional.transition;
        that.bg = theme.stylesheet.colors.backgroundColor;
        //that.k[that.loading.enable]().loading();

        d3.json(options.data, function (e, data) {                
            that.data = data;
            $(".loader").remove(); // NEW LOADER *****************
            that.render();
        });  
    };

    this.refresh = function () {
        d3.json(options.data, function (e, data) {
            that.data = data;
                       
            that.optionalFeatures()
                .createGroupedBar()
                [that.legends.enable]().ticks()
                [that.legends.enable]().legends();
            that.k[that.axis.x.enable]().xAxis(that.svgContainer,that.xGroup,that.x)
                [that.axis.y.enable]().yAxis(that.svgContainer,that.yGroup,that.y0);
            // that.multi_series_2D[that.legends.enable]().legends(that.names,that.legendsGroup,that.data,that.legendsContainer);
        });
    };

    this.render = function () {
        var that = this;

        that.multi_series_2D = new PykCharts.multi_series_2D.configuration(options);
        that.border = new PykCharts.Configuration.border(that);
        that.fillColor = new PykCharts.multi_series_2D.fillChart(options);
        // that.ticks = new PykCharts.multi_series_2D.ticks(options);
        that.transitions = new PykCharts.Configuration.transition(that);
        if(that.mode === "default") {
            that.k.title()
            // [that.fullScreenEnable]().fullScreen(that);
        }
        that.multi_series_2D[that.legends.enable]().legendsPosition(that);
        that.k.tooltip();
        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
    
        var groupedBar = that.optionalFeatures().createGroupedBar()
            [that.legends.enable]().ticks()
            .axisContainer();
        that.multi_series_2D[that.legends.enable]().legendsGroupStacked(that.legendsContainer,that.legendsGroup,that.names,that.color);
        that.k[that.axis.x.enable]().xAxis(that.svgContainer,that.xGroup,that.x)
            [that.axis.y.enable]().yAxis(that.svgContainer,that.yGroup,that.y0)

        if(that.mode === "default") {
            that.k["yes"]().credits()
                [that.dataSource.enable]().dataSource()
                [that.liveData.enable]().liveData(that);

        }
    };
    this.fullScreen = function () {
        var modalDiv = d3.select(that.selector).append("div")
            .attr("id","abc")
            .attr("visibility","hidden")
            .attr("class","clone")
            .append("a")
            .attr("class","b-close")
                .style("cursor","pointer")
                .style("position","absolute")
                .style("right","10px")
                .style("top","5px")
                .style("font-size","20px")
                .html("Close");
        var scaleFactor = 1.2;
        var w = that.w;
        var h = that.h;
        if(h>=500 || w>900){
            scaleFactor = 1;
        }
        $(".legendscontainer").clone().appendTo("#abc");            
        $(".svgcontainer").clone().appendTo("#abc");
        if(that.legends.display==="vertical"){
            d3.select(".clone #legendscontainer").attr("width",screen.width-200).attr("height", that.series.length*40);
        }else if(that.legends.display === "horizontal") {
            d3.select(".clone #legendscontainer").attr("width",screen.width-200).attr("height", 60);
        }
        d3.select(".clone #legends").attr("transform","scale("+scaleFactor+")"); 
        d3.select(".clone #svgcontainer").attr("width",screen.width-200).attr("height",screen.height-200).style("display","block");
        d3.select(".clone svg #svggroup").attr("transform","scale("+scaleFactor+")translate("+that.margin.left+","+that.margin.top+")");  
        $(".clone").css({"background-color":"#fff","border-radius":"15px","color":"#000","display":"none","padding":"20px   ","min-width":screen.availWidth-100,"min-height":screen.availHeight-150,"visibility":"visible","align":"center"});
        $("#abc").bPopup({position: [30, 10],transition: 'fadeIn',onClose: function(){ $('.clone').remove(); }});
        
    };
    this.optionalFeatures = function () {
        var that = this;
        var status;
        var optional = {
            yes : function () {
                status = true;
                return this;
            },
            no :function () {
                status = false;
                return this;
            },
            svgContainer :function () {
                $(options.selector).css("background-color",that.bg);
                $(that.selector).attr("class","PykCharts-twoD");
                that.svgContainer = d3.select(options.selector)
                    .append('svg')
                    .attr("width",that.w)
                    .attr("height",that.h) 
                    .attr("id","svgcontainer")
                    .attr("pointer-events","all")
                    .attr("class","svgcontainer");

                that.group = that.svgContainer.append("g")
                    .attr("transform","translate("+(that.margin.left)+","+(that.margin.top)+")")
                    .attr("id","svggroup")
                    .attr("class","svggroup");

                if(that.grid.xEnabled === "yes") {
                    that.group.append("g")
                        .attr("id","xgrid")
                        .attr("class","x grid-line")
                }

                return this;
            },
            axisContainer : function () {
                if(that.axis.x.enable === "yes") {
                    that.xGroup = that.group.append("g")
                        .attr("class", "x axis")
                        .style("stroke","black")
                        .attr("transform", "translate(0,0)");
                }
                if(that.axis.x.enable === "yes") {
                    that.yGroup = that.group.append("g")
                        .attr("class", "y axis")
                        .style("stroke","blue");
                }
                return this;
            },
            legendsContainer : function () {
                that.legendsContainer = d3.select(options.selector)
                    .append('svg')
                    .attr('width',that.w)
                    .attr('height',50)
                    .attr('class','legendscontainer')
                    .attr('id','legendscontainer');
                that.legendsGroup = that.legendsContainer
                    .append("g")
                            .attr('id',"legends")
                            .attr("transform","translate(0,20)");
                return this;
            },
            createGroupedBar : function () {
                var i,j,a;

                that.width = that.w - that.margin.left - that.margin.right;
                that.height = that.h - that.margin.top - that.margin.bottom;
                that.name = _.map(that.data,function(key) { return key.name });
                that.names  = that.data.map(function (d) {
                    return d.data.map(function (d) { 
                        return d.name; 
                    });
                });
                that.color = that.data.map(function (d) {
                    return d.color;
                })
                that.series = [];
                for(i=0;i<that.data[0].data[0].data.length;i++) {
                    that.series[i] = {};
                    that.series[i].name = that.data[0].data[0].data[i].name;
                    that.series[i].series = [];
                    for(j=0;j<that.data.length;j++) {
                        that.series[i].series[j] = {};
                        that.series[i].series[j].name = that.data[j].name; 
                        that.series[i].series[j].series = [];
                        for(k=0;k<that.data[j].data.length;k++){
                            var x = k === 0 ? 0 : that.data[j].data[k-1].data[i].weight;
                            that.series[i].series[j].series[k] = {
                                name: that.data[j].data[k].data[i].name,
                                weight: that.data[j].data[k].data[i].weight, 
                                tooltip: that.data[j].data[k].data[i].tooltip,
                                x: x
                            };
                        }
                    }
                }
                that.max = d3.max(that.series, function (d) { 
                    return d3.max(d.series, function (d) { 
                        return d3.max(d.series, function (d) { 
                            return d.weight + d.x; 
                        });
                    }); 
                });
                that.min = d3.min(that.series, function (d) { 
                    return d3.min(d.series, function (d) {
                        return d3.min(d.series, function (d) { 
                            return d.weight; 
                        });
                    }); 
                }); 
                a = that.max*0.1;
                that.x = d3.scale.linear()
                    .domain([0, that.max+a])
                    .range([0, that.width]);
                
                that.y0 = d3.scale.ordinal()
                            .domain(that.series.map(function(d) { return d.name; }))
                            .rangeRoundBands([0, that.height], .1);

                that.y1 = d3.scale.ordinal()
                            .domain(that.series[0].series.map(function(d) { return d.name; }))
                            .rangeRoundBands([0, that.y0.rangeBand()]);

                var chart = that.group.selectAll(".g")
                                    .data(that.series);
                
                chart.enter()
                    .append("g")
                    .attr("class", "g")
                    .on("mouseout", function (d) {
                        that.mouseEvent[that.axis.onHoverHighlightenable]().axisHighlightHide(".y.axis")
                    })
                    .on("mousemove", function (d) {
                        that.mouseEvent[that.axis.onHoverHighlightenable]().axisHighlightShow(d.name, ".y.axis");
                    
                    })
                    
                var bar = chart.attr("class", "g")
                    .attr("transform", function(d) { return "translate(0,"+ that.y0(d.name) + ")"; })
                    .on("mouseover",function(d) { })
                    .selectAll(".rect")
                    .data(function(d) { return d.series; });
                
                bar.enter()
                    .append("g")
                    .attr("class","rect")
                    .attr("transform", function (d) { return "translate(0," + that.y1(d.name) + ")"  })
                    .attr("fill", function (d,i) { return that.color[i]; })
                    
                    
                var chart1 = bar.attr("transform", function (d) { return "translate(0," + that.y1(d.name) + ")"  })
                    .attr("fill", function (d,i) { return that.color[i]; })
                    .selectAll(".stack")
                    .data(function (d) { return d.series; })
                
                chart1.enter()
                    .append("rect")
                    .attr("class","stack")
                
                chart1.attr("height", function (d) { return that.y1.rangeBand(); })
                    .attr("x", 0)
                    .attr("y",function (d) { return (that.y1(d.name));})
                    .attr("width",0)
                    .attr("fill-opacity", function (d,i) { return that.saturation.enable === "yes" ? (that.names[i].length - i)/(that.data[i].data.length) : 1 ;})
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-opacity",1)
                    .on('mouseover',function (d) {
                        tooltip = d.tooltip || d.weight;
                        that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.tooltipTextShow(d.tooltip);
                    })
                    .on('mouseout',function (d) {
                        that.mouseEvent[that.enableTooltip]().tooltipHide(d);  
                    })
                    .on('mousemove', function (d) {
                      that.mouseEvent[that.enableTooltip]().tooltipPosition(d);
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("x", function (d) {return that.x(d.x);})
                    .attr("width",function (d) {return  that.x(d.weight); });  
                
                bar.exit().remove();
                chart.exit().remove(); 

                return this;
            },
            ticks : function () {
                if(status) {
                    var series = that.series[0].series;
                    var ticks = that.group.selectAll(".ticks_label")
                        .data(series)
                        
                    ticks.enter()
                        .append("g")
                        .attr("class","ticks_label")
                        .attr("transform",function (d) { return "translate(0," + ((that.y1(d.name))+(that.y1.rangeBand())) + ")"; })
                        .append("text")
                        .attr("class","tickLabel")
                        
                    ticks.select("text")
                        .attr("x", function (d) { return that.x(d.series[d.series.length - 1].x)+that.x(d.series[d.series.length - 1].weight); })
                        .attr("dx",4)
                        .attr("dy",2)
                        .text("")
                        .transition()
                        .delay(that.transitions.duration())
                        .text(function (d) { return (d.name); })
                        .attr("fill","#1D1D1D")
                        .attr("font-size",15+"px")
                        .attr("font-family","'Helvetica Neue',Helvetica,Arial,sans-serif")
                        .attr("pointer-events","none")
                    ticks.exit().remove();   
                }
                return this;
            }
            
        };
        return optional;
    };                 
};