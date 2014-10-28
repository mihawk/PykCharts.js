PykCharts.multi_series_2D.groupedBar = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function() {
        var that = this;

        that.k = new PykCharts.Configuration(options);

        that.mode = options.mode;
        //that.loading = options.optional.loading;
        that.selection = options.selector;
        that.w = options.optional.chart.width;
        that.h = options.optional.chart.height;
        that.bg = theme.stylesheet.colors.backgroundColor;
        that.margin = that.k.setChartMargin();
        that.ticks = options.optional.chart.no_of_ticks;
        that.enableTooltip = theme.stylesheet.enableTooltip;
        that.title = options.optional.title;
        that.color = options.optional.color;
        that.saturation = options.optional.saturation;
        that.legends = options.optional.legends;
        that.dataSource = options.optional.dataSource;
        that.liveData = options.optional.liveData;
        that.fullScreenEnabled = theme.stylesheet.buttons.enableFullScreenButton;
        //that.loading = options.optional.loading;
        that.enableTicks = theme.stylesheet.enableTicks;
        that.download = options.optional.download;
        that.transition = options.optional.transition;
        that.barBorder = options.optional.border;
        that.axis = options.optional.axis;
        that.grid = options.optional.chart.grid;
        
        //that.k[that.loading.enable]().loading();

        d3.json(options.data, function (e, data) {                
            that.data = data;
            that.render();
            $( "#chart-loader" ).remove();

        });  
    };

    this.refresh = function () {
            d3.json(options.data, function (e, data) {
                that.data = data;                                
                that.optionalFeatures()
                        .createGroupedBar()
                        [that.enableTicks]().ticks();
                that.multi_series_2D[that.legends.enable]().legends(that.names,that.legendsGroup,that.new_data,that.legendsContainer);
            });
    };

    this.render = function () {
        var that = this;

        that.multi_series_2D = new PykCharts.multi_series_2D.configuration(options);
        that.border = new PykCharts.Configuration.border(options);
        that.fillColor = new PykCharts.multi_series_2D.fillChart(options);
        that.transitions = new PykCharts.Configuration.transition(options);
        
        if(that.mode === "default") {
            that.k[that.title.enable]().title();
        }
        
        that.multi_series_2D[that.legends.enable]().legendsPosition(that);
        that.k[that.enableTooltip]().tooltip();
        that.mouseEvent = new PykCharts.Configuration.mouseEvent();
        
        var groupedBar = that.optionalFeatures().createGroupedBar()    
                                                .axisContainer();
        


        that.k[that.axis.x.enable]().xAxis(that.svgContainer,that.xGroup,that.x)
            [that.axis.y.enable]().yAxis(that.svgContainer,that.yGroup,that.y0)

        if(that.mode === "default") {
            that.multi_series_2D[that.legends.enable]()
                .legends(that.names,that.legendsGroup,that.new_data,that.legendsContainer);
            
            that.optionalFeatures()[that.enableTicks]().ticks();
                
            that.k["yes"]().credits()
                [that.dataSource.enable]().dataSource()
                [that.fullScreenEnabled]().fullScreen(that)
                [that.liveData.enable]().liveData(that);
        }
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
                $(that.selection).attr("class","PykCharts-twoD");
                that.svgContainer = d3.select(that.selection)
                    .append('svg')
                    .attr("width",that.w)
                    .attr("height",that.h) 
                    .attr("id","container")
                    .attr("pointer-events","all")
                    .attr("class","svgcontainer");

                that.group = that.svgContainer.append("g")
                    .attr("transform","translate("+(that.margin.left)+","+(that.margin.top)+")")
                    .attr("id","main");

                that.group1 = that.svgContainer.append("g")
                    .attr("transform","translate("+(that.margin.left)+","+(that.margin.top)+")")
                    .attr("id","main2");
                 
                return this;
            },
            legendsContainer : function () {
                    that.legendsContainer = d3.select(that.selection)
                        .append('svg')
                        .attr('width',that.width)
                        .attr('height',50)
                        .attr('class','legends')
                        .attr('id','legendscontainer');
                    that.legendsGroup = that.legendsContainer
                        .append("g")
                                .attr('id',"legends")
                                .attr("transform","translate(0,20)");
                return this;
            },
            axisContainer : function () {

                if(that.axis.x.enable === "yes") {
                    that.xGroup = that.group.append("g")
                        .attr("class", "x axis")
                        .style("stroke","black")
                        .attr("transform", "translate(0,0)");
                }
                if(that.axis.y.enable === "yes") {
                    that.yGroup = that.group.append("g")
                        .attr("class", "y axis")
                        .style("stroke","blue");
                }

            },
            createGroupedBar : function () {
                var i,j;

                that.width = that.w - that.margin.left - that.margin.right;
                that.height = that.h - that.margin.top - that.margin.bottom;
                that.names = _.map(that.data,function(key) { return key.name });
                var name  = that.data[0].data.map(function(d) { return d.name; });
                
                that.series = []; 
                //mapping data for plotting

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
                
                that.x = d3.scale.linear()
                    .domain([0, that.max])
                    .range([0, that.width]);
                
                that.y0 = d3.scale.ordinal()
                            .domain(that.series.map(function(d) { return d.name; }))
                            .rangeRoundBands([0, that.height], .25);

                that.y1 = d3.scale.ordinal()
                            .domain(that.series[0].series.map(function(d) { return d.name; }))
                            .rangeRoundBands([0, that.y0.rangeBand()]);

                var chart = that.group.selectAll(".g")
                                    .data(that.series);
                
                chart.enter()
                    .append("g")
                    .attr("class", "g")
                    
                chart.attr("class", "g")
                    .attr("transform", function(d) { return "translate(0,"+ that.y0(d.name) + ")"; })
                    .on('mouseout',function (d) {
                        that.mouseEvent[that.axis.onHoverHighlightenable]().axisHighlightHide(".y.axis");
                    })
                    .on('mousemove', function (d) {
                        that.mouseEvent[that.axis.onHoverHighlightenable]().axisHighlightShow(d.name, ".y.axis");
                    });

                var bar = chart.selectAll("rect")
                            .data(function(d,i) { return d.series; });

                bar.enter()
                    .append("rect")
                      
                bar.attr("height", function (d) { return that.y1.rangeBand(); })
                    .attr("x", function (d) {return 0;})
                    .attr("y",function (d) { return (that.y1(d.name));})
                    .attr("width",0)
                    .attr("fill", function (d,i) { return that.fillColor(that.new_data[i]); })
                    .attr("fill-opacity", function (d,i) { return that.saturation.enable === "yes" ? (i+1)/(that.new_data.length) : 1 ;})
                    .attr("stroke",that.border[that.barBorder.enable]().color())
                    .attr("stroke-width",that.border[that.barBorder.enable]().width())
                    .attr("stroke-opacity",1)
                    .on('mouseover',function (d) {
                        that.mouseEvent[that.enableTooltip]().tooltipPosition(d);
                        that.mouseEvent[that.enableTooltip]().tooltipTextShow(d.tooltip ? d.tooltip : d.weight);
                    })
                    .on('mouseout',function (d) {
                        that.mouseEvent[that.enableTooltip]().tooltipHide(d);  
                    })
                    .on('mousemove', function (d) {
                      that.mouseEvent[that.enableTooltip]().tooltipPosition(d);
                    })
                    .transition()
                    .duration(that.transitions[that.transition.enable]().duration())
                    .attr("width",function (d) { return  that.x(d.weight) });  

                chart.exit().remove(); 

                return this;
            },
            ticks : function () {
              
                if(status) {
                    var ticks = that.group.selectAll(".g")
                                            .data(that.series);
                    
                    var tick_label = ticks.selectAll(".tickLabel")
                                            .data(function (d) { return d.series; });

                    tick_label.enter()
                                .append("text")
                          
                    tick_label.attr("class","tickLabel");

                    tick_label.attr("x", function (d) { return that.x(d.weight); })
                                .attr("y",function(d) { return (that.y1(d.name))+(that.y1.rangeBand()/2); })
                                .attr("dx",4)
                                .attr("dy",2)
                                .transition()
                                .delay(that.transitions[that.transition.enable]().duration())
                                .text(function (d) { return (d.weight).toFixed(); })
                                .attr("pointer-events","none")
                                .attr("fill","black")
                                .attr("font-size",11)
                                .style("font-family", "Helvetica Neue");

                    tick_label.exit().remove();
                }
                return this;
            }
        };
        return optional;
    };         
    this.fullScreen = function () {
        var modalDiv = d3.select(that.selection).append("div")
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
        $(".legends").clone().appendTo("#abc");            
        $(".svgcontainer").clone().appendTo("#abc");
        if(that.legends.display==="vertical"){
            d3.select(".clone #legendscontainer").attr("width",screen.width-200).attr("height", that.series.length*40);
        }else if(that.legends.display === "horizontal") {
            d3.select(".clone #legendscontainer").attr("width",screen.width-200).attr("height", 60);
        }
        d3.select(".clone #legends").attr("transform","scale("+scaleFactor+")"); 
        d3.select(".clone #container").attr("width",screen.width-200).attr("height",screen.height-200).style("display","block");
        d3.select(".clone svg #main").attr("transform","scale("+scaleFactor+")translate("+that.margin.left+","+that.margin.top+")");  
        $(".clone").css({"background-color":"#fff","border-radius":"15px","color":"#000","display":"none","padding":"20px   ","min-width":screen.availWidth-100,"min-height":screen.availHeight-150,"visibility":"visible","align":"center"});
        $("#abc").bPopup({position: [30, 10],transition: 'fadeIn',onClose: function(){ $('.clone').remove(); }});
    };

};
