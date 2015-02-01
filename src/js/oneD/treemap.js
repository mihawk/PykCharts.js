PykCharts.oneD.treemap = function (options){
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function (pykquery_data){
        that = new PykCharts.validation.processInputs(that, options,'oneDimensionalCharts');
        optional = options.optional;
        that.chart_height = options.chart_height ? options.chart_height : that.chart_width;
        that.k.validator()
            .validatingDataType(that.chart_height,"chart_height",that.chart_width);

        if(that.stop) {
            return;
        }

        if(that.mode === "default") {
           that.k.loading();
        }

        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data),
                id = that.selector.substring(1,that.selector.length);
            if(that.stop || validate === false) {
                that.k.remove_loading_bar(id);
                return;
            }

            that.data = that.k.__proto__._groupBy("oned",data);
            that.compare_data = that.k.__proto__._groupBy("oned",data);
            that.k.remove_loading_bar(id);
            that.clubdata_enable = that.data.length>that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.render();
        };
        if (PykCharts['boolean'](options.interactive_enable)) {
            that.k.dataFromPykQuery(pykquery_data);
            that.k.dataSourceFormatIdentification(that.data,that,"executeData");
        } else {
            that.k.dataSourceFormatIdentification(options.data,that,"executeData");
        }   
    };

    this.refresh = function (pykquery_data){
        that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("oned",data);
            that.clubdata_enable = that.data.length>that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.refresh_data = that.k.__proto__._groupBy("oned",data);
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.optionalFeatures()
                .clubData()
            if(that.color_mode === "shade") {
                shade_array = that.k.shadeColorConversion(that.shade_color,that.new_data.children.length);
                that.new_data.children.forEach(function (d,i) {
                    d.color = shade_array[i];
                })
            }
            that.optionalFeatures()
                .createChart()
                .label();

        };
        if (PykCharts['boolean'](options.interactive_enable)) {
            that.k.dataFromPykQuery(pykquery_data);
            that.k.dataSourceFormatIdentification(that.data,that,"executeRefresh");
        } else {
            that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
        }   
    };

    this.render = function (){
        var id = that.selector.substring(1,that.selector.length);
        var container_id = id + "_svg";
        that.fillChart = new PykCharts.Configuration.fillChart(that);
        that.transitions = new PykCharts.Configuration.transition(that);

        if(that.mode === "default") {
            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+container_id,"treemap")
                .emptyDiv(that.selector)
                .subtitle();
        }

        that.k.tooltip();
        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        if(that.mode === "infographics"){
            that.k.backgroundColor(that)
                .export(that,"#"+container_id,"treemap")
                .emptyDiv(that.selector);
            that.new_data = {"children" : that.data};
        }

        if(that.mode === "default") {
            that.optionalFeatures()
                .clubData()
        }
        if(that.color_mode === "shade") {
            shade_array = that.k.shadeColorConversion(that.shade_color,that.new_data.children.length);
            that.new_data.children.forEach(function (d,i) {
                d.color = shade_array[i];
            })
        }
        that.optionalFeatures().svgContainer(container_id)
            .createChart()
            .label();
        if(that.mode === "default") {
            that.k.liveData(that)
                .createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource();
        }

        that.k.exportSVG(that,"#"+container_id,"treemap")
        
        var resize = that.k.resize(that.svgContainer);
        that.k.__proto__._ready(resize);
        window.addEventListener('resize', function(event){
            return that.k.resize(that.svgContainer);
        });
    };

    this.optionalFeatures = function (){
        var optional = {
            svgContainer: function (container_id) {

                that.svgContainer = d3.select(that.selector).append("svg:svg")
                    .attr({
                        "width": that.chart_width,
                        "height": that.chart_height,
                        "preserveAspectRatio": "xMinYMin",
                        "viewBox": "0 0 " + that.chart_width + " " + that.chart_height,
                        "id": container_id,
                        "class": "svgcontainer PykCharts-oneD"
                    });

                that.group = that.svgContainer.append("g")
                    .attr("id","treemap");
                return this;
            },
            createChart: function () {
                that.treemap = d3.layout.treemap()
                    .sort(function (a,b) { return a.weight - b.weight; })
                    .size([that.chart_width,that.chart_height])
                    .value(function (d) { return d.weight; })
                    .sticky(false);
                that.sum = d3.sum(that.new_data.children, function (d){
                        return d.weight;
                    });
                var l;

                that.node = that.treemap.nodes(that.new_data);
                l = that.new_data.children.length;
                that.chart_data = that.group.selectAll(".cell")
                                    .data(that.node);
                that.chart_data.enter()
                    .append("svg:g")
                    .attr("class","cell")
                    .append("svg:rect")
                    .attr("class","treemap-rect");

                that.chart_data.attr("class","cell")
                    .select("rect")
                    .attr({
                        "class": "treemap-rect",
                        "id": function (d,i) { return "rect" + i; },
                        "x": function (d) { return d.x; },
                        "y": function (d) { return d.y; },
                        "width": function (d) { return d.dx-1; },
                        "height": 0,
                        "fill": function (d) {
                            return d.children ? "white" : that.fillChart.selectColor(d);
                        },
                        "fill-opacity": 1,
                        "data-fill-opacity": function () {
                            return d3.select(this).attr("fill-opacity");
                        },
                        "data-id" : function (d,i) {
                            return d.name;
                        }
                    })
                    .on({
                        'mouseover': function (d) {
                            if(!d.children && that.mode === "default") {
                                d.tooltip = d.tooltip || "<table class='PykCharts'><tr><th colspan='2' class='tooltip-heading'>"+d.name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.weight)+"<td class='tooltip-right-content'>("+((d.weight*100)/that.sum).toFixed(1)+"%)</tr></table>";
                                if(PykCharts['boolean'](that.chart_onhover_highlight_enable)) {
                                    that.mouseEvent.highlight(options.selector +" "+".treemap-rect", this);
                                }
                                that.mouseEvent.tooltipPosition(d);
                                that.mouseEvent.tooltipTextShow(d.tooltip);
                            }
                        },
                        'mouseout': function (d) {
                            if(that.mode === "default") {
                                that.mouseEvent.tooltipHide(d);
                                if(PykCharts['boolean'](that.chart_onhover_highlight_enable)) {    
                                    that.mouseEvent.highlightHide(options.selector +" "+".treemap-rect");
                                }
                            }
                        },
                        'mousemove': function (d) {
                            if(!d.children && that.mode === "default") {
                                that.mouseEvent.tooltipPosition(d);
                            }
                        },
                        'click' :  function (d,i) {
                            if(PykCharts['boolean'](options.click_enable)){
                               that.addEvents(d.name, d3.select(this).attr("data-id")); 
                            }                     
                        }
                    })
                    .transition()
                    .duration(that.transitions.duration())
                    .attr("height", function (d) { return d.dy-1; });

                that.chart_data.exit()
                    .remove();
                return this;
            },
            label: function () {
                    that.chart_text = that.group.selectAll(".name")
                        .data(that.node);
                    that.chart_text1 = that.group.selectAll(".weight")
                        .data(that.node);
                    that.chart_text.enter()
                        .append("svg:text")
                        .attr("class","name");

                    that.chart_text1.enter()
                        .append("svg:text")
                        .attr("class","weight");

                    that.chart_text.attr({
                        "class": "name",
                        "x": function (d) { return d.x + d.dx / 2; },
                        "y": function (d) { return d.y + d.dy / 2; }
                    });

                    that.chart_text1.attr({
                        "class": "weight",
                        "x": function (d) { return d.x + d.dx / 2; },
                        "y": function (d) { return d.y + d.dy / 2 + that.label_size; }
                    });

                    that.chart_text
                        .attr({
                            "text-anchor": "middle",
                            "fill": that.label_color
                        })
                        .style({
                            "font-weight": that.label_weight,
                            "font-size": that.label_size + "px",
                            "font-family": that.label_family
                        })
                        .text("");
                    function chart_text1_timeout() {
                        that.chart_text.text(function (d) { return d.children ? " " :  d.name; })
                            .attr("pointer-events","none")
                            .text(function (d) {

                                if(this.getBBox().width<d.dx && this.getBBox().height<d.dy-15) {
                                    return d.children ? " " :  d.name;
                                }
                                else {
                                    return "";
                                }
                            });
                    }
                    setTimeout(chart_text1_timeout,that.transitions.duration());

                    that.chart_text1
                        .attr({
                            "text-anchor": "middle",
                            "fill": that.label_color,
                            "pointer-events": "none"
                        })
                        .style({
                            "font-weight": that.label_weight,
                            "font-size": that.label_size + "px",
                            "font-family": that.label_family
                        })
                        .text("");

                    function timeout() {
                        that.chart_text1.text(function (d) { return d.children ? " " :  that.k.appendUnits(d.weight); })
                            .text(function (d) {
                                if(this.getBBox().width < d.dx && this.getBBox().height < d.dy-15) {
                                    return d.children ? " " :  ((d.weight*100)/that.sum).toFixed(1)+"%"; /*that.k.appendUnits(d.weight);*/

                                }
                                else {
                                    return "";
                                }
                            });
                    }

                    setTimeout(timeout,that.transitions.duration());

                    that.chart_text.exit()
                        .remove();
                    that.chart_text1.exit()
                        .remove();
                return this;
            },
            clubData : function () {
                if(PykCharts['boolean'](that.clubdata_enable)){
                    var clubdata_content = [],sum_others = 0,k=0;
                    if(that.data.length <= that.clubdata_maximum_nodes) {
                        that.new_data = { "children" : that.data };
                        return this;
                    }
                    if(that.clubdata_always_include_data_points.length!== 0){
                        var l = that.clubdata_always_include_data_points.length;
                        for(i=0; i < l; i++){
                            clubdata_content[i] = that.clubdata_always_include_data_points[i];
                        }
                    }
                    var new_data1 = [];
                    for(i=0;i<clubdata_content.length;i++){
                        for(j=0;j<that.data.length;j++){
                            if(clubdata_content[i].toUpperCase() === that.data[j].name.toUpperCase()){
                                new_data1.push(that.data[j]);
                            }
                        }
                    }
                    that.data.sort(function (a,b) { return b.weight - a.weight; });

                    while(new_data1.length<that.clubdata_maximum_nodes-1){
                        for(i=0;i<clubdata_content.length;i++){
                            if(that.data[k].name.toUpperCase() === clubdata_content[i].toUpperCase()){
                                k++;
                            }
                        }
                        new_data1.push(that.data[k]);
                        k++;
                    }
                    for(j=k; j < that.data.length; j++){
                        for(i=0; i<new_data1.length && j<that.data.length; i++){
                            if(that.data[j].name.toUpperCase() === new_data1[i].name.toUpperCase()){
                                sum_others +=0;
                                j++;
                                i = -1;
                            }
                        }
                        if(j < that.data.length){
                            sum_others += that.data[j].weight;
                        }
                    }
                    var sortfunc = function (a,b) { return b.weight - a.weight; };
                    while(new_data1.length > that.clubdata_maximum_nodes){
                        new_data1.sort(sortfunc);
                        var a=new_data1.pop();
                    }
                    var others_Slice = { "name":that.clubdata_text, "weight": sum_others, "color": that.clubData_color, "tooltip": that.clubData_tooltip };

                    if(new_data1.length < that.clubdata_maximum_nodes){
                        new_data1.push(others_Slice);

                    }
                    that.new_data = {"children" : new_data1};
                }
                else {
                    that.new_data = {"children" : that.data};
                }
                return this;
            },
        };
        return optional;
    };
};
