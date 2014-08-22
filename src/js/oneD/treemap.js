PykCharts.oneD.treemap = function (options){
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function (){
        that = new PykCharts.oneD.processInputs(that, options);
        optional = options.optional;
        // that.enableText = optional && PykCharts.boolean(optional.enableText) ? optional.enableText : false;
        that.selector = options.selector;

        if(that.mode === "default") {
           that.k.loading();
        }

        d3.json(options.data, function (e,data) {
            that.data = Array.groupBy(data);
            $(options.selector+" #chart-loader").remove();
            that.render();
        });

    };

    this.refresh = function (){
        d3.json(options.data, function (e,data) {
            that.data = data;
            that.optionalFeatures()
                .clubData()
                .createChart()
                .label();
        });
    };

    this.render = function (){

        that.fillChart = new PykCharts.oneD.fillChart(that);
        that.mouseEvent1 = new PykCharts.oneD.mouseEvent(options);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.border = new PykCharts.Configuration.border(that);
        if(that.mode === "default") {
            that.k.title();
            that.k.subtitle();
        }

        that.k.tooltip();
        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        if(that.mode === "infographics"){
            that.new_data1 = that.data;
        }

        if(that.mode === "default") {
            var treemap = that.optionalFeatures()
                .clubData()
        }
        that.optionalFeatures().svgContainer()
            .createChart()
            .label();
        if(that.mode === "default") {
            that.k.liveData(that)
                .credits()
                .dataSource();
        }
    };

    this.optionalFeatures = function (){
        var optional = {
            svgContainer: function () {
                $(options.selector).css("background-color",that.bg);

                that.svg = d3.select(that.selector).append("svg:svg")
                    .attr("width",that.width)
                    .attr("height",that.height)
                    .attr("id","svgcontainer")
                    .attr("class","svgcontainer");

                that.group = that.svg.append("g")
                    .attr("id","treemap");
                return this;
            },
            createChart: function () {
                that.treemap = d3.layout.treemap()
                    .sort(function (a,b) { return a.weight - b.weight; })
                    .size([that.width,that.height])
                    .value(function (d) { return d.weight; })
                    .sticky(false);
                var total = d3.sum(that.new_data1.children, function (d){
                        return d.weight;
                    }), l, cell;

                that.node = that.treemap.nodes(that.new_data1);
                l = that.new_data1.children.length;
                that.max = that.new_data1.children[l-1].weight;
                that.map1 = that.new_data1.children.map(function (d) { return d.weight; });
                that.map1 = jQuery.unique(that.map1);
                that.treemap_data = that.group.selectAll(".cell")
                                    .data(that.node);
                cell = that.treemap_data.enter()
                    .append("svg:g")
                    .attr("class","cell")
                    .append("svg:rect")
                    .attr("class","treemap-rect");

                that.treemap_data.attr("class","cell")
                    .select("rect")
                    .attr("class","treemap-rect")
                    .attr("id",function (d,i) { return i; })
                    .attr("x",function (d) { return d.x; })
                    .attr("y", function (d) { return d.y; })
                    .attr("width", function (d) { return d.dx-1; })
                    .attr("height", 0)
                    .attr("fill",function (d) {
                        return d.children ? "white" : that.fillChart.chartColor(d);
                    })
                    .on('mouseover',function (d) {
                        if(!d.children) {
                            d.tooltip = d.tooltip || "<table class='PykCharts'><tr><th colspan='2' class='tooltip-heading'>"+d.name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.weight)+"<td class='tooltip-right-content'>(&nbsp;"+((d.weight*100)/total).toFixed(2)+"%&nbsp;)</tr></table>";
                            that.mouseEvent1.highlight(options.selector +" "+".treemap-rect", this);
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.toolTextShow(d.tooltip);
                        }
                    })
                    .on('mouseout',function (d) {
                        var o = d.weight/that.max;
                        that.mouseEvent.tooltipHide(d);
                        that.mouseEvent1.highlightHide(options.selector +" "+".treemap-rect");
                    })
                    .on('mousemove', function (d) {
                        if(!d.children) {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("height", function (d) { return d.dy-1; });

                that.treemap_data.exit()
                    .remove();
                return this;
            },
            label: function () {
                if(PykCharts.boolean(that.enableLabel)) {
                    that.treemap_text = that.group.selectAll(".name")
                        .data(that.node);
                    that.treemap_text1 = that.group.selectAll(".weight")
                        .data(that.node);
                    that.treemap_text.enter()
                        .append("svg:text")
                        .attr("class","name");

                    that.treemap_text1.enter()
                        .append("svg:text")
                        .attr("class","weight");

                    that.treemap_text.attr("class","name")
                        .attr("x", function (d) { return d.x + d.dx / 2; })
                        .attr("y", function (d) { return d.y + d.dy / 2; });

                    that.treemap_text1.attr("class","weight")
                        .attr("x", function (d) { return d.x + d.dx / 2; })
                        .attr("y", function (d) { return d.y + d.dy / 2 + 15; });

                    that.treemap_text.attr("text-anchor","middle")
                        .style("font-weight", that.label.weight)
                        .style("font-size", that.label.size)
                        .attr("fill", that.label.color)
                        .style("font-family", that.label.family)
                        .text("")
                        .transition()
                        .delay(that.transitions.duration())

                    that.treemap_text.text(function (d) { return d.children ? " " :  d.name; })
                        .attr("pointer-events","none")
                        .text(function (d) {

                            if(this.getBBox().width<d.dx && this.getBBox().height<d.dy-15) {
                                return d.children ? " " :  d.name;
                            }
                            else {
                                return "";
                            }
                        });

                    that.treemap_text1.attr("text-anchor","middle")
                        .style("font-weight", that.label.weight)
                        .style("font-size", that.label.size)
                        .attr("fill", that.label.color)
                        .style("font-family", that.label.family)
                        .text("")
                        .attr("pointer-events","none")
                        .transition()
                        .delay(that.transitions.duration())
                    that.treemap_text1.text(function (d) { return d.children ? " " :  that.k.appendUnits(d.weight); })
                        .text(function (d) {
                            if(this.getBBox().width < d.dx && this.getBBox().height < d.dy-15) {
                                return d.children ? " " :  that.k.appendUnits(d.weight);
                            }
                            else {
                                return "";
                            }
                        });

                    that.treemap_text.exit()
                        .remove();
                    that.treemap_text1.exit()
                        .remove();
                }
                return this;
            },
            clubData : function () {
                if(PykCharts.boolean(that.clubData.enable)){
                    var clubdata_content = [],weight = 0,k=0;
                    if(that.data.length <= that.clubData.maximumNodes) {
                        that.new_data1 = { "children" : that.data };
                        return this;
                    }
                    if(that.clubData.alwaysIncludeDataPoints.length!== 0){
                        var l = that.clubData.alwaysIncludeDataPoints.length;
                        for(i=0; i < l; i++){
                            clubdata_content[i] = that.clubData.alwaysIncludeDataPoints[i];
                        }
                    }
                    that.new_data = [];
                    for(i=0;i<clubdata_content.length;i++){
                        for(j=0;j<that.data.length;j++){
                            if(clubdata_content[i].toUpperCase() === that.data[j].name.toUpperCase()){
                                that.new_data.push(that.data[j]);
                            }
                        }
                    }
                    that.data.sort(function (a,b) { return b.weight - a.weight; });
                    while(that.new_data.length<that.clubData.maximumNodes-1){
                        for(i=0;i<clubdata_content.length;i++){
                            if(that.data[k].name.toUpperCase() === clubdata_content[i].toUpperCase()){
                                k++;
                            }
                        }
                        that.new_data.push(that.data[k]);
                        k++;
                    }
                    for(j=k; j < that.data.length; j++){
                        for(i=0; i<that.new_data.length && j<that.data.length; i++){
                            if(that.data[j].name.toUpperCase() === that.new_data[i].name.toUpperCase()){
                                weight +=0;
                                j++;
                                i = -1;
                            }
                        }
                        if(j < that.data.length){
                            weight += that.data[j].weight;
                        }
                    }
                    var sortfunc = function (a,b) { return b.weight - a.weight; };
                    while(that.new_data.length > that.clubData.maximumNodes){
                        that.new_data.sort(sortfunc);
                        var a=that.new_data.pop();
                    }
                    var other_span = { "name":that.clubData.text, "weight": weight, "color": that.clubData.color, "tooltip": that.clubData.tooltip };

                    if(that.new_data.length < that.clubData.maximumNodes){
                        that.new_data.push(other_span);
                    }
                    that.new_data1 = {"children" : that.new_data};
                }
                else {
                    that.new_data1 = {"children" : that.data};
                }
                return this;
            },
        };
        return optional;
    };
};