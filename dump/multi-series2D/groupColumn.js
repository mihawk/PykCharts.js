PykCharts.multi_series_2D.groupedColumn = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function () {

        that = new PykCharts.twoD.processInputs(that, options, "groupedColumn");

        if(that.mode === "default") {
            that.k.loading();
        }
        // that.k = new PykCharts.Configuration(options);

        // that.mode = options.mode;
        // //that.loading = options.optional.loading;
        // that.selector = options.selector;
        // that.w = options.optional.chart.width;
        // that.h = options.optional.chart.height;
        // that.bg = theme.stylesheet.colors.backgroundColor;
        // // that.margin = options.optional.chart.margin;
        // that.margin = that.k.setChartMargin();
        // that.ticks = options.optional.chart.no_of_ticks;
        // that.datasource = options.optional.dataSource;
        // that.toolTipsEnable = theme.stylesheet.enableTooltip;
        // that.title = options.optional.title;
        // that.color = options.optional.color;
        // that.saturation = options.optional.saturation;
        // that.legends = options.optional.legends;
        // that.liveData = options.optional.liveData;
        // that.clubData = options.optional.clubData;
        // that.fullscreen = theme.stylesheet.buttons.enableFullScreenButton;
        // that.barBorder = options.optional.border;
        // that.axis = options.optional.axis;
        // that.grid = options.optional.chart.grid;
        // that.transition = options.optional.transition;

        //that.k[that.loading.enable]().loading();

        d3.json(options.data, function (e, data) { 
            that.data = data;
            $(that.selector+" #chart-loader").remove();
            that.render();
        })
    };

    this.refresh = function () {
        d3.json(options.data, function (e,data) {

            that.data = data;
      
            that.optionalFeatures()
                .createGroupedColumn();

            // that.k1[that.legends.enable]().legends(that.names,that.group1,that.data,that.legendsvg);
            that.k.yAxis(that.svg,that.ygroup,that.yScale)
                .xAxis(that.svg,that.xgroup,that.xScale)
                .xGrid(that.svg,that.group,that.yScale);
        }); 
    };

    this.render = function () {

        that.multi_series_2D = new PykCharts.multi_series_2D.configuration(options);
        that.border = new PykCharts.Configuration.border(that);
        that.fillColor = new PykCharts.multi_series_2D.fillChart(options);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.k1 = new PykCharts.multi_series_2D.configuration(options);

         if(that.mode === "default") {

            that.k.title()
                .subtitle();

            that.optionalFeatures().svgContainer();
            // that.k1[that.legends.enable]().legendsPosition(that);

            that.k.credits()
                .dataSource()
                .liveData(that)
                .tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

            that.optionalFeatures()
                .createGroupedColumn()
                .axisContainer();

            // that.k1[that.legends.enable]().legends(that.names,that.group1,that.data,that.legendsvg);

            that.k.yAxis(that.svg,that.ygroup,that.yScale)
                .xAxis(that.svg,that.xgroup,that.xScale)
                .yGrid(that.svg,that.group,that.yScale);

        } else if(that.mode === "infographic") {

            that.optionalFeatures().svgContainer()
                .createGroupedColumn()
                .axisContainer();

            that.k.tooltip();

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

            that.k.yAxis(that.svg,that.ygroup,that.yScale)
                .xAxis(that.svg,that.xgroup,that.xScale);
        }
    };

    this.fullScreen = function () {
        var modalDiv = d3.select(options.selector).append("div")
            .attr("id","abc")
            .attr("align","center")
            .attr("visibility","hidden")
            .attr("class","clone")
            .style("align","center")
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
        console.log(h);
        if(h>=500 || w>900){
            console.log("hey");
            scaleFactor = 1;
        }
        if(that.legends.position == "top" || that.legends.position == "left") {
            $(".legendsvg").clone().appendTo("#abc");            
            $(".svgcontainer").clone().appendTo("#abc");
        }
        else {
            $(".svgcontainer").clone().appendTo("#abc");  
            $(".legendsvg").clone().appendTo("#abc");
        }
        if(that.legends.position == "top" || that.legends.position == "bottom") {
            d3.select(".clone #legendsvg").attr("width",screen.width-200);
            d3.select(".clone #legendgrp").attr("transform","scale("+scaleFactor+")"); 
            d3.select(".clone #svgcontainer").attr("width",screen.width-200).attr("height",screen.height-230).style("display","block");
        }
        else if(that.legends.position == "left" || that.legends.position == "right") {
            d3.select(".clone #legendsvg").attr("width",100).attr("height",screen.height-100);
            d3.select(".clone svg #legendgrp").attr("transform","scale("+scaleFactor+")");            
            d3.select(".clone #svgcontainer").attr("width",screen.width-200).attr("height",screen.height-230);
        }
        d3.select(".clone svg #colgrp").attr("transform","translate(250,40)scale("+scaleFactor+")");
            // .attr("transform","scale("+scaleFactor+")translate(700,100)");
            // .attr("transform","translate(700,100)");  
        $(".clone").css({"background-color":"#fff","border-radius":"15px","color":"#000","display":"none","padding":"20px","min-width":screen.availWidth-100,"min-height":screen.availHeight-150,"visibility":"visible","align":"center"});
        $("#abc").bPopup({position: [30, 10],transition: 'fadeIn',onClose: function(){ $('.clone').remove(); }});
    };

    this.optionalFeatures = function () {
        var status;
        var optional = {
            yes: function () {
                status = true;
                return this;
            },
            no: function () {
                status = false;
                return this;
            },
            svgContainer :function () {
                $(options.selector).css("background-color",that.bg);
                $(that.selector).attr("class","PykCharts-twoD");
                that.svg = d3.select(options.selector)
                    .append('svg')
                    .attr("width",that.w)
                    .attr("height",that.h)
                    .attr("id","svgcontainer")
                    .attr("class","svgcontainer")
                    // .attr("id","container")
                    .attr("pointer-events","all");
                    // .attr("class","svgcontainer");

                that.group = that.svg.append("g")
                    .attr("transform","translate("+(that.margin.left)+","+(that.margin.top)+")")
                    // .attr("id","main")
                    .attr("id","colgrp");

                
                if(that.grid.yEnabled === "yes") {
                    that.group.append("g")
                        .attr("id","ygrid")
                        .style("stroke",that.grid.color)
                        .attr("class","y grid-line");
                }
                return this;
            },
            legendsContainer: function () {
                that.legendsvg = d3.select(that.selector).append("svg")
                    .attr("width",that.w)
                    .attr("class","legendsvg")
                    .attr("id","legendsvg");
                    // .attr("class","legendscontainer")
                    // .attr("id","legendscontainer");
 
                that.group1 = that.legendsvg.append("g")
                    .attr("class","legendgrp")
                    .attr("id","legendgrp"); 
                    // .attr("id","legends")
                    // .attr("class","legends");

                return this;
            },
            axisContainer: function () {
                if(PykCharts['boolean'](that.axis.x.enable)) {
                    that.xgroup = that.group.append("g")
                        .attr("id","xaxis")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + (that.h - that.margin.top - that.margin.bottom ) + ")")
                        .style("stroke","none");
                }
                
                if(PykCharts['boolean'](that.axis.y.enable)) {
                    that.ygroup = that.group.append("g")
                        .attr("id","yaxis")
                        .attr("class","y axis");
                }
                return this;
            },
            createGroupedColumn: function () {
                var i,j;

                console.log(that.data);

                that.width = that.w - that.margin.left - that.margin.right;
                that.height = that.h - that.margin.top - that.margin.bottom;
                that.names = that.data.map(function (d){
                    return d.name;
                });
                
                that.series = [];
                
                for(i=0;i<that.data[0].data.length;i++) {
                    that.series[i] = {};
                    that.series[i].name = that.data[0].data[i].name;
                    that.series[i].series = [];
                    for(j=0;j<that.data.length;j++) {
                        that.series[i].series[j] = {name: that.data[j].name, weight: that.data[j].weight, tooltip: that.data[j].tooltip};
                    }
                }
                
                that.max = d3.max(that.series, function(d) { return d3.max(d.series, function(d) { return d.weight; }); });

                
                that.min = d3.min(that.series, function(d) { return d3.min(d.series, function(d) { return d.weight; }); }); 

                that.yScale = d3.scale.linear()
                    .domain([0,that.max])
                    .range([that.height, 0]);

                that.xScale = d3.scale.ordinal()
                    .domain(that.series.map(function (d) { return d.name; }))
                    .rangeRoundBands([0, that.width], 0.2);

                that.x1 = d3.scale.ordinal()
                    .domain(that.series[0].series.map(function(d) { return d.name; }))
                    .rangeRoundBands([0, that.xScale.rangeBand()]) ;


                var chart = that.group.selectAll(".g")
                    .data(that.series);
                
                chart.enter()
                    .append("g")
                    .attr("class", "g")
                    
                chart.attr("class", "g")
                    .attr("transform", function (d) { return "translate(" + that.xScale(d.name) + ",0)"; })
                    .on('mouseout',function (d) {
                        that.mouseEvent.axisHighlightHide(".x.axis");
                    })
                    .on('mousemove', function (d) {
                        that.mouseEvent.axisHighlightShow(d.name, ".x.axis");
                    });

                var bar = chart.selectAll("rect")
                            .data(function (d) { return d.series; });

                bar.enter()
                    .append("rect")
                      
                bar.attr("height", 0)
                    .attr("x", function (d) {return that.x1(d.name); })
                    .attr("y", that.height)
                    .attr("width", function (d){ return that.x1.rangeBand(); })
                    .attr("fill", function (d,i) {return that.fillColor(that.data[i]); })
                    .attr("fill-opacity", function (d,i) { return that.saturation.enable === "yes" ? (i+1)/(that.data.length) : 1 ;})
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .on('mouseover',function (d) {
                        that.mouseEvent.tooltipPosition(d);
                        that.mouseEvent.tooltipTextShow(d.tooltip);
                    })
                    .on('mouseout',function (d) {
                        that.mouseEvent.tooltipHide(d);
                    })
                    .on('mousemove', function (d) {
                        that.mouseEvent.tooltipPosition(d);
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("height", function (d) { return that.height - that.yScale(d.weight); })
                    .attr("y",function (d) {return that.yScale(d.weight); });

                chart.exit().remove(); 

                return this;
            }
        };
        return optional;
    };
};