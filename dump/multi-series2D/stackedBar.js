PykCharts.multi_series_2D.stackedBar = function (option) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function () {
        that.k = new PykCharts.Configuration(option);
        that.mode = option.mode;
        //that.loading = option.optional.loading;
        if(that.mode === "default") {
            //that.k[that.loading.enable]().loading();
        }
        that.optional = option.optional;
        that.title = option.optional.title;
        that.toolTipsEnable = theme.stylesheet.enableTooltip;
        that.liveData = option.optional.liveData;
        that.width = option.optional.chart.width;
        that.height = option.optional.chart.height;
        that.axis = option.optional.axis;
        that.grid = option.optional.chart.grid;
        that.color = option.optional.color;
        that.selector = option.selector;
        that.margin = that.k.setChartMargin();
        that.borders = option.optional.border;
        that.transition = option.optional.transition;
        that.legends = option.optional.legends;
        that.fullScreenEnable = theme.stylesheet.buttons.enableFullScreenButton;
        d3.json(option.data, function (e,data) {
            that.data = data;
            $(".loader").remove();
            that.render();
        });
        that.bg = theme.stylesheet.colors.backgroundColor;
        that.barcolor = option.optional.color;
        that.saturation = option.optional.saturation;
        that.dataSource = option.optional.dataSource;
    };
    this.render = function () {
        that.border = new PykCharts.Configuration.border(option);
        that.transitions = new PykCharts.Configuration.transition(option);
        that.k1 = new PykCharts.multi_series_2D.configuration(option);
        that.fillColor = new PykCharts.multi_series_2D.fillChart(option);
        if(that.mode === "default") {

            that.k[that.title.enable]().title()
                [that.fullScreenEnable]().fullScreen(that);
            that.k1[that.legends.enable]().legendsPosition(that)
                
            that.k[that.toolTipsEnable]().tooltip()
                [that.liveData.enable]().liveData(that);
            
            that.mouseEvent = new PykCharts.Configuration.mouseEvent();

            that.optionalFeatures()
                .createChart()
                .axisContainer();
            that.k1[that.legends.enable]().legends(that.series,that.group1,that.data,that.legendsvg);
            that.k[that.axis.y.enable]().yAxis(that.svg,that.ygroup,that.yScale)
                [that.axis.x.enable]().xAxis(that.svg,that.xgroup,that.xScale)
                [that.grid.xEnabled]().xGrid(that.svg,that.group,that.xScale)
                ["yes"]().credits()
                [that.dataSource.enable]().dataSource();
        }else if(that.mode === "infographic") {

            that.optionalFeatures().svgContainer()
                .createChart()
                .axisContainer();
            that.k[that.toolTipsEnable]().tooltip();
            that.mouseEvent = new PykCharts.Configuration.mouseEvent();
            that.k[that.axis.y.enable]().yAxis(that.svg,that.ygroup,that.yScale)
                [that.axis.x.enable]().xAxis(that.svg,that.xgroup,that.xScale);

        }
            
    };
    this.refresh = function () {
        d3.json(option.data, function (e,data) {
            that.data = data;
            that.optionalFeatures()
                .createChart()
            that.k1[that.legends.enable]().legends(that.series,that.group1,that.data,that.legendsvg);
            that.k[that.axis.y.enable]().yAxis(that.svg,that.ygroup,that.yScale)
                [that.axis.x.enable]().xAxis(that.svg,that.xgroup,that.xScale)
                [that.grid.xEnabled]().xGrid(that.svg,that.group,that.xScale);
        }); 
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
        var w = that.width;
        var h = that.height;
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
               
                if(that.grid.xEnabled === "yes") {
                    that.group.append("g")
                        .attr("id","xgrid")
                        .style("stroke",that.grid.color)
                        .attr("class","x grid-line");
                }
                return this;
            },
            legendsContainer: function () {
                that.legendsvg = d3.select(that.selector).append("svg:svg")
                    .attr("width",that.width)
                    .attr("class","legendscontainer")
                    .attr("id","legendscontainer");
                that.group1 = that.legendsvg.append("g")
                    .attr("id","legends")
                    .attr("class","legends")
                    .attr("transform","translate(0,10)");
                return this;
            },
            createChart: function () { 
                that.series = that.data.map(function (d) {
                    return d.name;
                });
                that.color = that.data.map(function (d) {
                    return d.color;
                });
                that.dataset = that.data.map(function (d) {
                    return d.data.map(function (o, i) {
                        return {
                            y: o.weight,
                            x: o.name,
                            tooltip : o.tooltip
                        };
                    });
                }),
                stack = d3.layout.stack();

                stack(that.dataset);
                
                that.dataset = that.dataset.map(function (group) {
                    return group.map(function (d) {
                        // Invert the x and y values, and y0 becomes x0
                        return {
                            x: d.y,
                            y: d.x,
                            x0: d.y0,
                            tooltip : d.tooltip
                        };
                    });
                }),
                xMax = d3.max(that.dataset, function (group) {
                    return d3.max(group, function (d) {
                        return d.x + d.x0;
                    });
                }),
                months = that.dataset[0].map(function (d) {
                    return d.y;
                });
                that.xScale = d3.scale.linear()
                    .domain([0, xMax])
                    .range([0, that.width - that.margin.left - that.margin.right]);
                that.yScale = d3.scale.ordinal()
                    .domain(months)
                    .rangeRoundBands([that.height - that.margin.top - that.margin.bottom,0 ], .3);

                that.chart1 = that.group.selectAll(".g")
                    .data(function () { return that.dataset; });
                that.chart1.enter()
                    .append("g")
                    //.attr("class","g");

                that.chart = that.chart1.attr("class","g")
                    .style("fill", function (d,i) { return that.fillColor(that.data[i]); })
                    .style("fill-opacity", function (d,i) { return that.saturation.enable === "yes" ? (i+1)/that.series.length : 1; })
                    .selectAll("rect")
                    .data(function (d) { return d; });
                
                that.chart.enter()
                    .append("rect")
                    .attr("class","rect")
                
                that.chart.attr("class","rect")
                    .attr('x', 0)
                    .attr('y', function (d, i) {
                        return that.yScale(d.y);
                    })
                    .attr('height', function (d) {
                        return that.yScale.rangeBand();
                    })
                    .attr('width', 0)
                    .on('mouseover',function (d,i) {
                        that.mouseEvent[that.toolTipsEnable]().tooltipPosition(d);
                        that.mouseEvent[that.toolTipsEnable]().tooltipTextShow(d.tooltip ? d.tooltip : d.x);
                    })
                    .on('mouseout',function (d) {
                        that.mouseEvent[that.toolTipsEnable]().tooltipHide(d);
                        that.mouseEvent[that.axis.onHoverHighlightenable]().axisHighlightHide(".y.axis");
                    })
                    .on('mousemove', function (d) {
                        that.mouseEvent[that.toolTipsEnable]().tooltipPosition(d);
                        that.mouseEvent[that.axis.onHoverHighlightenable]().axisHighlightShow(d.y, ".y.axis");
                    
                    })
                    .attr("stroke", that.border[that.optional.border.enable]().color())
                    .attr("stroke-width",that.border[that.optional.border.enable]().width())
                    .transition()
                    .duration(that.transitions[that.transition.enable]().duration())
                    .attr('width', function (d,i) {
                        return that.xScale(d.x);
                    })
                    .attr('x', function (d,i) {
                        return that.xScale(d.x0);
                    })
                
                that.chart1.exit()
                    .remove();
                return this;
            },
            axisContainer : function () {
                if(that.axis.x.enable === "yes") {
                    that.xgroup = that.group.append("g")
                        .attr("id","xaxis")
                        .attr("class", "x axis")
                        .style("stroke","none"); 
                }
                
                if(that.axis.y.enable === "yes") {
                    that.ygroup = that.group.append("g")
                        .attr("id","yaxis")
                        .attr("class","y axis");
                }
                return this;
            }
            
        };
        return optional;
    };
};