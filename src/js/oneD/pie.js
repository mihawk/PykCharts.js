PykCharts.oneD.pie = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function() {
        that = new PykCharts.oneD.processInputs(that, options, "pie");
        if(options.chart_height) {
            that.height = options.chart_height;
            that.calculation = undefined;
        }
        else {
            that.height = that.width;
            that.calculation = "pie";
        }
        that.radiusPercent = options.pie_radius_percent ? options.pie_radius_percent : theme.oneDimensionalCharts.pie_radius_percent;

        try {
            if(!_.isNumber(that.height)) {
                that.height = that.width;
                throw "chart_height"
            }
        }
        catch (err) {
            that.k.warningHandling(err,"1");
        }

        try {
            if(!_.isNumber(that.radiusPercent)) {
                that.radiusPercent = theme.oneDimensionalCharts.pie_radius_percent;
                throw "pie_radius_percent"
            }
        }
        catch (err) {
            that.k.warningHandling(err,"1");
        }

        if(that.stop) {
            return;
        }

        that.innerRadiusPercent = 0;
        that.height_translate = that.height/2;

        if(that.radiusPercent > 100) {
            that.radiusPercent = 100;
        }

        that.pykquery_configs = options.pykquery;
        // !----- PykQuery Object --------!
        // if(PykCharts.boolean()) { pykquery_global = new PykQuery.init("select","global",that.pykquery_configs.id); }
        pykquery_global = new PykQuery.init("select","global",that.pykquery_configs.id);
        pykquery_local = new PykQuery.init("select","local",that.selector);

        pykquery_global.storeObjectInMemory("pykquery_global");
        pykquery_local.storeObjectInMemory("pykquery_local");

        filter_pykquery = pykquery_local.filter();
        filters_selected = pykquery_local.filters;
        
        // !----- Mapping of Locals & Globals -----------!
        pykquery_local.addGlobal(that.pykquery_configs);
        console.log("Begin ---- PIE");
        console.log(pykquery_configs,'>>>>>',pykquery_local,filter_pykquery,filters_selected,query_mapping);

        if(that.mode === "default") {
           that.k.loading();
        }

        d3.json(options.data, function (e, data) {

            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(options.selector+" #chart-loader").remove();
                return;
            }

            that.data = that.k.__proto__._groupBy("oned",data);
            that.compare_data = that.k.__proto__._groupBy("oned",data);
            $(options.selector+" #chart-loader").remove();
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"pie");
            that.clubdata_enable = that.data.length > that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            pieFunctions.render();
        });
        // that.clubData.enable = that.data.length>that.clubData.maximumNodes ? that.clubData.enable : "no";
    };
};

PykCharts.oneD.donut = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    this.execute = function() {

        that = new PykCharts.oneD.processInputs(that, options, "pie");
        if(options.chart_height) {
            that.height = options.chart_height;
            that.calculation = undefined;
        }
        else {
            that.height = that.width;
            that.calculation = "pie";
        }

        that.radiusPercent = options.donut_radius_percent  ? options.donut_radius_percent : theme.oneDimensionalCharts.donut_radius_percent;
        that.innerRadiusPercent = options.donut_inner_radius_percent  ? options.donut_inner_radius_percent : theme.oneDimensionalCharts.donut_inner_radius_percent;

        try {
            if(!_.isNumber(that.height)) {
                that.height = that.width;
                throw "chart_height"
            }
        }
        catch (err) {
            that.k.warningHandling(err,"1");
        }

        try {
            if(!_.isNumber(that.radiusPercent)) {
                that.radiusPercent = theme.oneDimensionalCharts.donut_radius_percent;
                throw "donut_radius_percent"
            }
        }
        catch (err) {
            that.k.warningHandling(err,"1");
        }

        try {
            if(!_.isNumber(that.innerRadiusPercent)) {
                that.innerRadiusPercent = theme.oneDimensionalCharts.donut_inner_radius_percent;
                throw "donut_inner_radius_percent"
            }
        }
        catch (err) {
            that.k.warningHandling(err,"1");
        }


        if(that.stop) {
            return;
        }

        if(that.radiusPercent > 100) {
            that.radiusPercent = 100;
        }

        if(that.innerRadiusPercent > 100) {
            that.innerRadiusPercent = 100;
        }

        try {
            if(that.innerRadiusPercent >= that.radiusPercent) {
                that.innerRadiusPercent = theme.oneDimensionalCharts.donut_inner_radius_percent;
                throw "donut_inner_radius_percent";
            }
        }
        catch(err) {
            that.k.warningHandling(err,"6");
        }

        if(that.stop) {
            return;
        }

        that.height_translate = that.height/2;
        that.show_total_at_center = options.donut_show_total_at_center ? options.donut_show_total_at_center.toLowerCase() : theme.oneDimensionalCharts.donut_show_total_at_center;
        that.show_total_at_center_size = "donut_show_total_at_center_size" in options ? options.donut_show_total_at_center_size : theme.oneDimensionalCharts.donut_show_total_at_center_size;
        that.show_total_at_center_color = options.donut_show_total_at_center_color ? options.donut_show_total_at_center_color : theme.oneDimensionalCharts.donut_show_total_at_center_color;
        that.show_total_at_center_weight = options.donut_show_total_at_center_weight ? options.donut_show_total_at_center_weight : theme.oneDimensionalCharts.donut_show_total_at_center_weight;
        that.show_total_at_center_family = options.donut_show_total_at_center_family ? options.donut_show_total_at_center_family : theme.oneDimensionalCharts.donut_show_total_at_center_family;

        // that.radiusPercent = options.optional && options.optional.donut && _.isNumber(options.optional.donut.radiusPercent) ? options.optional.donut.radiusPercent : theme.oneDimensionalCharts.donut.radiusPercent;
        // that.innerRadiusPercent = options.optional && options.optional.donut && _.isNumber(options.optional.donut.innerRadiusPercent) && options.optional.donut.innerRadiusPercent ? options.optional.donut.innerRadiusPercent : theme.oneDimensionalCharts.donut.innerRadiusPercent;

        d3.json(options.data, function (e, data) {

            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(options.selector+" #chart-loader").remove();
                return;
            }

            that.data = that.k.__proto__._groupBy("oned",data);
            that.compare_data = that.k.__proto__._groupBy("oned",data);
            $(options.selector+" #chart-loader").remove();
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"donut");
            that.clubdata_enable = that.data.length > that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            pieFunctions.render();
        });
    };
};

PykCharts.oneD.electionPie = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function() {

        that = new PykCharts.oneD.processInputs(that, options, "pie");
        that.x = true;
        if(options.chart_height) {
            try {
                if(!_.isNumber(options.chart_height)) {
                    that.x = false;
                    throw "chart_height"
                }
            }
            catch (err) {
                that.k.warningHandling(err,"1");
            }
        }
        if(that.x) {
            that.height = options.chart_height;
            that.calculation = undefined;
            that.height_translate = that.height/2;
        }
        else {
            that.height = that.width/2;
            that.calculation = "pie";
            that.height_translate = that.height;
        }

        that.radiusPercent = options.pie_radius_percent ? options.pie_radius_percent : theme.oneDimensionalCharts.pie_radius_percent;

        try {
            if(!_.isNumber(that.radiusPercent)) {
                that.radiusPercent = theme.oneDimensionalCharts.pie_radius_percent;
                throw "pie_radius_percent"
            }
        }

        catch (err) {
            that.k.warningHandling(err,"1");
        }

        if(that.stop) {
            return;
        }

        if(that.radiusPercent > 100) {
            that.radiusPercent = 100;
        }

        that.innerRadiusPercent = 0;

        d3.json(options.data, function (e, data) {

            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(options.selector+" #chart-loader").remove();
                return;
            }

            that.data = that.k.__proto__._groupBy("oned",data);
            that.compare_data = that.k.__proto__._groupBy("oned",data);
            $(options.selector+" #chart-loader").remove();
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"election pie");
            that.clubdata_enable = that.data.length > that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            pieFunctions.render();

        });
    };
};

PykCharts.oneD.electionDonut = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function() {
        that = new PykCharts.oneD.processInputs(that, options, "pie");

        that.x = true;
        if(options.chart_height) {
            try {
                if(!_.isNumber(options.chart_height)) {
                    that.x = false;
                    throw "chart_height"
                }
            }
            catch (err) {
                that.k.warningHandling(err);
            }
        }

        if(that.x) {
            that.height = options.chart_height;
            that.calculation = undefined;
            that.height_translate = that.height/2;
        }

        else {
            that.height = that.width/2;
            that.calculation = "pie";
            that.height_translate = that.height;
        }

        that.radiusPercent = options.donut_radius_percent ? options.donut_radius_percent : theme.oneDimensionalCharts.donut_radius_percent;
        that.innerRadiusPercent = options.donut_inner_radius_percent  && options.donut_inner_radius_percent ? options.donut_inner_radius_percent : theme.oneDimensionalCharts.donut_inner_radius_percent;

        try {
            if(!_.isNumber(that.radiusPercent)) {
                that.radiusPercent = theme.oneDimensionalCharts.donut_radius_percent;
                throw "donut_radius_percent"
            }
        }
        catch (err) {
            that.k.warningHandling(err,"3");
        }

        try {
            if(!_.isNumber(that.innerRadiusPercent)) {
                that.innerRadiusPercent = theme.oneDimensionalCharts.donut_inner_radius_percent;
                throw "donut_inner_radius_percent"
            }
        }
        catch (err) {
            that.k.warningHandling(err,"3");
        }

        if(that.stop) {
            return;
        }

        if(that.radiusPercent > 100) {
            that.radiusPercent = 100;
        }

        if(that.innerRadiusPercent > 100) {
            that.innerRadiusPercent = 100;
        }

        try {
            if(that.innerRadiusPercent >= that.radiusPercent) {
                that.innerRadiusPercent = theme.oneDimensionalCharts.donut_inner_radius_percent;
                throw "donut_inner_radius_percent";
            }
        }
        catch(err) {

            that.k.warningHandling(err,"6");
        }

        if(that.stop) {
            return;
        }

        that.show_total_at_center = options.donut_show_total_at_center ? options.donut_show_total_at_center.toLowerCase() : theme.oneDimensionalCharts.donut_show_total_at_center;
        that.show_total_at_center_size = "donut_show_total_at_center_size" in options ? options.donut_show_total_at_center_size : theme.oneDimensionalCharts.donut_show_total_at_center_size;
        that.show_total_at_center_color = options.donut_show_total_at_center_color ? options.donut_show_total_at_center_color : theme.oneDimensionalCharts.donut_show_total_at_center_color;
        that.show_total_at_center_weight = options.donut_show_total_at_center_weight ? options.donut_show_total_at_center_weight : theme.oneDimensionalCharts.donut_show_total_at_center_weight;
        that.show_total_at_center_family = options.donut_show_total_at_center_family ? options.donut_show_total_at_center_family : theme.oneDimensionalCharts.donut_show_total_at_center_family;

        d3.json(options.data, function (e, data) {

            var validate = that.k.validator().validatingJSON(data);
            if(that.stop || validate === false) {
                $(options.selector+" #chart-loader").remove();
                return;
            }

            that.data = that.k.__proto__._groupBy("oned",data);
            that.compare_data = that.k.__proto__._groupBy("oned",data);
            $(options.selector+" #chart-loader").remove();
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"election donut");
            that.clubdata_enable = that.data.length> that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            pieFunctions.render();
        });
    };
};


    //----------------------------------------------------------------------------------------
    // Function to handle live data
    //----------------------------------------------------------------------------------------

PykCharts.oneD.pieFunctions = function (options,chartObject,type) {
    var that = chartObject;
       that.refresh = function () {
        d3.json(options.data, function (e, data) {
            that.data = that.k.__proto__._groupBy("oned",data);
            that.clubdata_enable = that.data.length>that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.refresh_data = that.k.__proto__._groupBy("oned",data);
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.new_data = that.optionalFeatures().clubData();
            that.optionalFeatures()
                    .createChart()
                    .label()
                    .ticks()
                    .centerLabel();
        });
    };

    //----------------------------------------------------------------------------------------
    // Function to render the chart
    //----------------------------------------------------------------------------------------

    this.render = function() {

        that.count = 1;
        var l = $(".svgcontainer").length;
        that.container_id = "svgcontainer" + l;
        //that.fillChart = new PykCharts.oneD.fillChart(that);
        that.fillChart = new PykCharts.Configuration.fillChart(that);
        // that.onHoverEffect = new PykCharts.oneD.mouseEvent(options);
        that.border = new PykCharts.Configuration.border(that);
        that.transitions = new PykCharts.Configuration.transition(that);

        if(that.mode.toLowerCase() == "default") {

            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+that.container_id,type)
                .emptyDiv()
                .subtitle();

            that.optionalFeatures().svgContainer();
            that.new_data = that.optionalFeatures().clubData();

            that.k.createFooter()
                    .lastUpdatedAt()
                    .credits()
                    .dataSource()
                    .tooltip();


            that.optionalFeatures()
                    .set_start_end_angle()
                    .createChart()
                    .label()
                    .ticks()
                    .centerLabel();

            that.k.liveData(that);

        } else if(that.mode.toLowerCase() == "infographics") {
            that.new_data = that.data;
            that.k.backgroundColor(that)
                .export(that,"#"+that.container_id,type)
                    .emptyDiv();
            that.optionalFeatures().svgContainer()
                    .set_start_end_angle()
                    .createChart()
                    .label()
                    .ticks()
                    .centerLabel();

            that.k.tooltip();
        }

        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

        var add_extra_width = 0;
        var add_extra_height = 0;
        setTimeout(function () {
            if(that.ticks_text_width.length) {
                add_extra_width = _.max(that.ticks_text_width,function(d) {
                        return d;
                    });
                add_extra_height = that.ticks_text_height;
            }
            that.k.exportSVG(that,"#"+that.container_id,type,undefined,undefined,(add_extra_width+20),(add_extra_height+20))
        },that.transitions.duration());

        $(document).ready(function () { return that.k.resize(that.svgContainer); })
        $(window).on("resize", function () { return that.k.resize(that.svgContainer); });
    };

    //----------------------------------------------------------------------------------------
    // Function to render configuration parameters
    //----------------------------------------------------------------------------------------

    that.optionalFeatures = function () {
        var optional = {
            svgContainer :function () {
                // $(options.selector).css("background-color",that.background_color);
                that.svgContainer = d3.select(that.selector)
                    .append('svg')
                    .attr("width",that.width)
                    .attr("height",function () {
                        return that.height;
                    })
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height)
                    .attr("id",that.container_id)
                    .attr("class","svgcontainer PykCharts-oneD");
                that.group = that.svgContainer.append("g")
                    .attr("transform","translate("+(that.width/2)+","+that.height_translate+")")
                    .attr("id","pieGroup");

                return this;
            },
            createChart : function () {
                $(that.selector +" #pieGroup").empty();

                if(type.toLowerCase() == "pie" || type.toLowerCase() == "donut") {
                    that.new_data.sort(function (a,b) { return a.weight - b.weight;});
                    var temp = that.new_data.pop();
                    that.new_data.unshift(temp);
                }
                else if(type.toLowerCase() == "election pie" || type.toLowerCase() == "election donut") {
                    that.new_data.sort(function (a,b) { return b.weight - a.weight;});
                }
                that.sum = _.reduce(that.data,function (start,num) { return start+num.weight; },0);

                // that.sorted_weight = _.map(that.new_data,function (d,i) {
                //     return d.weight*100/that.sum;
                // });

                // that.sorted_weight.sort(function (a,b){return a-b;});

                // var proportion =_.map(that.new_data,function (d,i) {
                //     return d.weight*100/that.sum;
                // });
                that.inner_radius = that.k.__proto__._radiusCalculation(that.innerRadiusPercent,that.calculation);
                that.outer_radius = that.k.__proto__._radiusCalculation(that.radiusPercent,that.calculation);

                that.arc = d3.svg.arc()
                    .innerRadius(that.inner_radius)
                    .outerRadius(that.outer_radius);
                that.pie = d3.layout.pie()
                    .value(function (d) { return d.weight; })
                    .sort(null)
                    .startAngle(that.start_angle)
                    .endAngle(that.end_angle);

                that.chart_data = that.group.selectAll("path").
                                        data(that.pie(that.new_data));

                that.chart_data.enter()
                    .append("path");

                that.chart_data
                    .attr("class","pie");

                that.chart_data
                    .attr("fill",function (d) {
                            return that.fillChart.selectColor(d.data);
                    })
                    .attr("fill-opacity",1)
                    .attr("data-fill-opacity",function () {
                        return $(this).attr("fill-opacity");
                    })
                    .on('mouseover',function (d) {
                        if(that.mode === "default") {
                            d.data.tooltip = d.data.tooltip || "<table class='PykCharts'><tr><th colspan='3' class='tooltip-heading'>"+d.data.name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.data.weight)+"<td class='tooltip-right-content'>("+((d.data.weight*100)/that.sum).toFixed(1)+"%) </tr></table>";
                            if(PykCharts.boolean(that.onhover_enable)) {
                                that.mouseEvent.highlight(options.selector +" "+".pie", this);
                            }
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(d.data.tooltip);
                        }
                    })
                    .on('mouseout',function (d) {
                        if(that.mode === "default") {
                            if(PykCharts.boolean(that.onhover_enable)) {
                                that.mouseEvent.highlightHide(options.selector +" "+".pie");
                            }
                            that.mouseEvent.tooltipHide(d);
                        }
                    })
                    .on('mousemove', function (d) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    })
                    .attr("stroke",that.border.color())
                    .attr("stroke-width",that.border.width())
                    .attr("stroke-dasharray", that.border.style());
//                    .attr("d",that.arc); // comment this if u want to enable transition

                that.chart_data.transition()
                    .delay(function(d, i) {
                        if(that.transition_duration && that.mode == "default") {
                            return (i * that.transition_duration * 1000)/that.new_data.length;
                        } else return 0;
                    })
                    .duration(that.transitions.duration()/that.new_data.length)
                    .attrTween("d",function(d) {
                        var i = d3.interpolate(d.startAngle, d.endAngle);
                        return function(t) {
                            d.endAngle = i(t);
                            return that.arc(d);
                        }
                    });

                that.chart_data.exit().remove();
                return this;
            },
            label : function () {

                    that.chart_text = that.group.selectAll("text")
                                       .data(that.pie(that.new_data));

                    that.chart_text.enter()
                        .append("text")
                        .attr("class","pie-label")
                        .attr("transform",function (d) { return "translate("+that.arc.centroid(d)+")"; });

                    that.chart_text.attr("transform",function (d) { return "translate("+that.arc.centroid(d)+")"; });

                    that.chart_text.text("")
                        .attr("fill", "red");


                    //     .transition()
                    //     .delay(function(d, i) {
                        //     if(PykCharts.boolean(that.transition.duration)) {
                        //         return (i * that.transition.duration)/that.new_data.length;
                        //     } else return 0;
                        // });

                    setTimeout(function () {
                        that.chart_text.text(function (d) { return that.k.appendUnits(d.data.weight); })
                            .attr("text-anchor","middle")
                            .attr("pointer-events","none")
                            .style("font-weight", that.label_weight)
                            .style("font-size", that.label_size + "px")
                            .text(function (d,i) {
                                if(type.toLowerCase() === "pie" || type.toLowerCase() === "election pie") {
                                    console.log(this.getBBox().width,"outside");
                                    console.log((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9),"angle1111111");
                                    if(this.getBBox().width<((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9))) {
                                        console.log(this.getBBox().width,"b box width");
                                        console.log((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9),"angle");
                                        return ((d.data.weight*100)/that.sum).toFixed(1)+"%";
                                        // return that.k.appendUnits(d.data.weight);
                                    }
                                    else {
                                        return "";
                                    }
                                } else {
                                    if((this.getBBox().width < (Math.abs(d.endAngle - d.startAngle)*that.outer_radius*0.9))  && (this.getBBox().height < (((that.outer_radius-that.inner_radius)*0.75)))) {
                                        return ((d.data.weight*100)/that.sum).toFixed(1)+"%";
                                        // return that.k.appendUnits(d.data.weight);
                                    }
                                    else {
                                        return "";
                                    }
                                }
                            })
                            .attr("dy",5)
                            .style("font-weight", that.label_weight)
                            .style("font-size", that.label_size + "px")
                            .attr("fill", that.label_color)
                            .style("font-family", that.label_family);
                        that.chart_text.exit().remove();
                    },that.transitions.duration());

                return this;
            },
            clubData: function () {
                if(PykCharts.boolean(that.clubdata_enable)) {
                    that.displayData = [];
                    that.sorted_weight = _.map(that.data,function(num){ return num.weight; });
                    that.sorted_weight.sort(function(a,b){ return b-a; });
                    that.checkDuplicate = [];

                    var others_Slice = {"name":that.clubdata_text,"color":that.clubData_color,"tooltip":that.clubData_tooltipText,"highlight":false};
                    var index;
                    var i;
                    that.getIndexByName = function(name) {
                        for(i=0;i<that.data.length;i++)
                        {
                            if(that.data[i].name == name) {
                                return i;
                            }
                        }
                    };

                    var reject = function (index) {
                        var result = _.reject(that.sorted_weight,function(num)
                            {
                                return num == that.data[index].weight;
                            });
                        return result;
                    } ;
                    var k = 0;

                    if(that.clubdata_always_include_data_points.length!== 0) {
                        for (var l=0;l<that.clubdata_always_include_data_points.length;l++)
                        {

                            index = that.getIndexByName(that.clubdata_always_include_data_points[l]);
                            if(index!= undefined) {
                                that.displayData.push(that.data[index]);
                                that.sorted_weight = reject (index);
                            }
                        }
                    }
                    that.getIndexByWeight = function (weight) {
                        for(var i=0;i<that.data.length;i++)
                        {

                            if(that.data[i].weight == weight) {
                                if((_.contains(that.checkDuplicate, i))===false) {
                                   that.checkDuplicate.push(i);
                                    return i;
                                }
                                else {
                                    continue;
                                }
                            }
                        }
                    };
                    var count = that.clubdata_maximum_nodes-that.displayData.length;

                    var sum_others = d3.sum(that.sorted_weight,function (d,i) {
                            if(i>=count-1)
                                return d;
                        });

                    others_Slice.weight = sum_others;
                    if(count>0)
                    {
                        that.displayData.push(others_Slice);
                        for (i=0;i<count-1;i++) {
                            index = that.getIndexByWeight(that.sorted_weight[i]);
                            that.displayData.push(that.data[index]);
                        }
                    }
                }
                else {
                    that.displayData = that.data;
                }
                return that.displayData;
            },
            ticks : function () {
                if(PykCharts.boolean(that.pointer_overflow_enable)) {
                    that.svgContainer.style("overflow","visible");
                }
                var w = [];
                that.ticks_text_width = [];
                //if(PykCharts.boolean(that.enableTicks)) {
                    var tick_label = that.group.selectAll(".ticks_label")
                                    .data(that.pie(that.new_data));

                    tick_label.attr("class","ticks_label");

                    tick_label.enter()
                        .append("text")
                        .attr("x",0)
                        .attr("y",0);

                    var x,y;
                    tick_label.attr("transform",function (d) {
                        if (d.endAngle - d.startAngle < 0.2) {
                             x = (that.outer_radius +30 ) * (1) * Math.cos((d.startAngle + d.endAngle - Math.PI)/2);
                             y = (that.outer_radius/1+20) * (1) * Math.sin((d.startAngle + d.endAngle -  Math.PI)/2);
                        } else {
                             x = (that.outer_radius +22 ) * (1) * Math.cos((d.startAngle + d.endAngle - Math.PI)/2);
                             y = (that.outer_radius/1+24) * (1) * Math.sin((d.startAngle + d.endAngle -  Math.PI)/2);
                        }
                        return "translate(" + x + "," + y + ")";});

                    tick_label.text("")
                        //.style("visibility","hidden");
                        // .transition()
                        // .delay(function(d, i) {
                        //     if(PykCharts.boolean(that.transition.duration)) {
                        //         return ((i+1) * that.transition.duration)/that.new_data.length;
                        //     } else return 0;
                        // })
                        // .text(function (d,i) {
                        //     if(type.toLowerCase() === "pie" || type.toLowerCase() === "election pie") {
                        //         if(type.toLowerCase() === "pie") {
                        //             w[i] = this.getBBox().height;
                        //             console.log(w[i],((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9)),d.startAngle,d.data.name);
                        //             if(this.getBBox().height < ((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9))) {
                        //                 return d.data.name;
                        //             }
                        //             else {
                        //                 return "";
                        //             }
                        //         } else {
                        //             w[i] =this.getBBox().height;
                        //             if(this.getBBox().height < ((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9))) {
                        //                 return d.data.name;
                        //             }
                        //             else {
                        //                 return "";
                        //             }
                        //         }
                        //     } else {
                        //         if(type.toLowerCase() === "donut") {
                        //             w[i] = this.getBBox().width;
                        //             if(this.getBBox().width < ((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9))) {
                        //                 return d.data.name;
                        //             }
                        //             else {
                        //                 return "";
                        //             }
                        //         } else {
                        //             w[i] = this.getBBox().height;
                        //             if(this.getBBox().height < ((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9))) {
                        //                 return d.data.name;
                        //             }
                        //             else {
                        //                 return "";
                        //             }
                        //         }
                        //     }
                        // })
                        // .style("visibility","visible")

                    setTimeout(function() {
                        tick_label.text(function(d) { return d.data.name; })
                            .text(function(d,i) {
                                that.ticks_text_width[i] = this.getBBox().width;
                                that.ticks_text_height = this.getBBox().height;
                                return d.data.name; })
                            .attr("text-anchor",function(d) {
                                var rads = ((d.endAngle - d.startAngle) / 2) + d.startAngle;
                                if (rads>0 && rads<1.5) {
                                    return "start";
                                } else if (rads>=1.5 && rads<3.5) {
                                    return "middle";
                                } else if (rads>=3.5 && rads<6) {
                                    return "end";
                                } else if (rads>=6) {
                                    return "middle";
                                } else if(rads<0) {
                                    return "middle";
                                }
                            })
                            .attr("dy",5)
                            .attr("pointer-events","none")
                            .style("fill",that.pointer_color)
                            .style("font-size",that.pointer_size + "px")
                            .style("font-weight",that.pointer_weight)
                            .style("font-family", that.pointer_family);

                        tick_label.exit().remove();
                    },that.transitions.duration());

                    var tick_line = that.group.selectAll("line")
                        .data(that.pie(that.new_data));

                    tick_line.enter()
                        .append("line")
                        .attr("class", "ticks");

                    tick_line.attr("x1", function (d,i) {
                        return (that.outer_radius) * (1)* Math.cos((d.startAngle + d.endAngle)/2);
                            // if(w[i] >= ((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9))) {
                            //     return 0;
                            // }
                            // else {
                            //        return (that.outer_radius) * (1)* Math.cos((d.startAngle + d.endAngle)/2);
                            // }
                        })
                        .attr("y1", function (d,i) {
                            return (that.outer_radius) * (1) *Math.sin((d.endAngle + d.startAngle )/2);
                            // if(w[i] >= ((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9))) {
                            //     return 0;
                            // }
                            // else {
                            //     return (that.outer_radius) * (1) *Math.sin((d.endAngle + d.startAngle )/2);
                            // }
                        })
                        .attr("x2", function (d,i) {
                            return (that.outer_radius) * (1)* Math.cos((d.startAngle + d.endAngle)/2);
                            // if(w[i] >= ((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9))) {
                            //     return 0;
                            // }
                            // else {
                            //     return (that.outer_radius) * (1)* Math.cos((d.startAngle + d.endAngle)/2);
                            // }
                        })
                        .attr("y2", function (d,i) {
                            return (that.outer_radius) * (1) *Math.sin((d.endAngle + d.startAngle )/2);
                            // if(w[i] >= ((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9))) {
                            //     return 0;
                            // }
                            // else {
                            //     return (that.outer_radius) * (1) *Math.sin((d.endAngle + d.startAngle )/2);
                            // }
                        })
                        // .transition()
                        // .delay(function(d, i) {
                        //     if(PykCharts.boolean(that.transition.duration)) {
                        //         return ((i) * that.transition.duration)/that.new_data.length;
                        //     } else return 0;
                        // })
                        // .duration(that.transitions.duration()/that.new_data.length)

                    setTimeout(function () {
                        tick_line.attr("x2", function (d, i) {
                                return (that.outer_radius/1+12)* (1) * Math.cos((d.startAngle + d.endAngle)/2);
                                // if(w[i] >= ((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9))) {
                                //     return 0;
                                // }
                                // else {
                                //     return (that.outer_radius/1+12)* (1) * Math.cos((d.startAngle + d.endAngle)/2);
                                // }
                            })
                            .attr("y2", function (d, i) {
                                return (that.outer_radius/1+12)* (1) * Math.sin((d.startAngle + d.endAngle)/2);
                                // if(w[i] >= ((d.endAngle-d.startAngle)*((that.outer_radius/2)*0.9))) {
                                //     return 0;
                                // }
                                // else {
                                //     return (that.outer_radius/1+12)* (1) * Math.sin((d.startAngle + d.endAngle)/2);
                                // }
                            })
                            .attr("transform","rotate(-90)")
                            .attr("stroke-width", that.pointer_thickness + "px")
                            .attr("stroke",that.pointer_color);
                        tick_line.exit().remove();
                    },that.transitions.duration());
                // }
                return this;
            },
            centerLabel: function () {
                if(PykCharts.boolean(that.show_total_at_center) && (type == "donut" || type == "election donut")) {

                    // var displaySum = that.group.selectAll(".total")
                    //             .data(["sum"]);

                    // displaySum.enter()
                    //             .append("text");

                    // displaySum.attr("class","total")
                    //     .text("")
                    //     .transition()
                    //     .delay(function(d) {
                    //        return that.transitions.duration();
                    //     })
                    //     .text("Total")
                    //     .attr('font-size',"0.5em")
                    //     .attr("pointer-events","none")
                    //     .attr("text-anchor","middle")
                    //     .attr("y",function () {
                    //         return (type == "donut") ? (-0.1*that.inner_radius) : (-0.5*that.inner_radius);
                    //     })
                    //     .attr("font-size",function () {
                    //         return (type == "donut") ? 0.1*that.inner_radius : 0.1*that.inner_radius;
                    //     })
                    //     .style("font-family","'Helvetica Neue',Helvetica,Arial,sans-serif")
                    //     .attr("fill","gray");

                    // displaySum.exit().remove();

                    var h;
                    var label = that.group.selectAll(options.selector +" "+".centerLabel")
                                    .data([that.sum]);

                    label.enter()
                        .append("text");

                    label.attr("class","centerLabel")
                        .text("")
                        // .transition()
                        // .delay( function(d) {
                        //     if(PykCharts.boolean(that.transitions.duration())) {
                        //         return that.transitions.duration();
                        //     }
                        // })
                    setTimeout(function () {
                        label.text( function(d) {
                                return that.k.appendUnits(that.sum);
                            })
                            .text( function(d) {
                                h = this.getBBox().height;
                                return that.k.appendUnits(that.sum);
                            })
                            .attr("pointer-events","none")
                            .attr("text-anchor","middle")
                            .attr("y",function () {
                                return (type == "donut") ? h/2 : (-0.25*that.inner_radius);
                            })
                            .style("font-family",that.show_total_at_center_family)
                            .attr("fill",that.show_total_at_center_color)
                            .style("font-weight", that.show_total_at_center_weight)
                            .style("font-size", that.show_total_at_center_size + "px");

                    },that.transitions.duration());

                    label.exit().remove();
                }
                return this;
            },
            set_start_end_angle: function () {
                that.startAngle, that.endAngle;
                if(type == "pie" || type == "donut") {
                    that.start_angle = (0 * (Math.PI/180));
                    that.end_angle = (360 * (Math.PI/180));
                } else if(type == "election pie" || type == "election donut") {
                    that.start_angle = (-90 * (Math.PI/180));
                    that.end_angle = (90 * (Math.PI/180));
                }
                return this;
            }
        };
        return optional;
    };
};
