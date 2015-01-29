PykCharts.oneD.pyramid = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

	this.execute = function (pykquery_data) {
        that = new PykCharts.validation.processInputs(that, options,'oneDimensionalCharts');
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
            that.data_length = that.data.length;
            that.compare_data = that.k.__proto__._groupBy("oned",data);
            that.k.remove_loading_bar(id);
			that.clubdata_enable = that.data_length > that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.render();
		};
        if (PykCharts['boolean'](options.interactive_enable)) {
            that.k.dataFromPykQuery(pykquery_data);
            that.k.dataSourceFormatIdentification(that.data,that,"executeData");
        } else {
            that.k.dataSourceFormatIdentification(options.data,that,"executeData");
        }   
	};

    this.refresh = function (pykquery_data) {
        that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("oned",data);
            that.data_length = that.data.length;
            that.clubdata_enable = that.data_length>that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
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
                    .ticks();
        };
        if (PykCharts['boolean'](options.interactive_enable)) {
            that.k.dataFromPykQuery(pykquery_data);
            that.k.dataSourceFormatIdentification(that.data,that,"executeRefresh");
        } else {
            that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
        }   
    };

	this.render = function () {
        var id = that.selector.substring(1,that.selector.length);
        var container_id = id + "_svg";
        that.fillChart = new PykCharts.Configuration.fillChart(that);
        that.transitions = new PykCharts.Configuration.transition(that);

        if (that.mode === "default") {
            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+container_id,"pyramid")
                .emptyDiv(that.selector)
                .subtitle();
            that.new_data = that.optionalFeatures().clubData();
            that.optionalFeatures().svgContainer(container_id)
                .createChart()
                .label()
                .ticks();

            that.k.createFooter()
                .lastUpdatedAt()
                .credits()
                .dataSource()
                .tooltip()
                .liveData(that);

            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

        } else if (that.mode === "infographics") {
            that.new_data = that.data;
            that.k.backgroundColor(that)
                .export(that,"#"+container_id,"pyramid")
                .emptyDiv(that.selector);
            that.optionalFeatures().svgContainer(container_id)
                .createChart()
                .label()
                .ticks();

            that.k.tooltip();
            that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        }

        var add_extra_width = 0;
        setTimeout(function () {
            if(that.ticks_text_width.length) { 
                add_extra_width = d3.max(that.ticks_text_width,function(d){
                        return d;
                    });
            }
            that.k.exportSVG(that,"#"+container_id,"pyramid",undefined,undefined,add_extra_width)
        },that.transitions.duration());
        
        var resize = that.k.resize(that.svgContainer);
        that.k.__proto__._ready(resize);
        window.addEventListener('resize', function(event){
            return that.k.resize(that.svgContainer);
        });
	};

	this.percentageValues = function (data){
        that.sum = d3.sum(data, function (d){
            return d.weight;
        });
        var percentValues = data.map(function (d){
            return d.weight/that.sum*100;
        });
        percentValues.sort(function(a,b){
            return b-a;
        });
        return percentValues;
    };
	this.pyramidLayout = function () {
        var data,
            size,
            coordinates;

        var pyramid = {
            data: function(d){
                if(!(d.length===0)) {
                     data = d;                                
                }
                return this;
            },
            size: function(s){
                if(s.length === 2) {
                    size = s;                    
                }
                // if (s.length!==2){
                // } else {
                //     size = s;
                // }
                return this;
            },
            coordinates: function(c){
                var w = size[0];
                var h = size[1];
                var ratio = (w/2)/h;
                var percentValues = that.percentageValues(data);
                var coordinates = [];
                var area_of_triangle = (w * h) / 2;
                 function d3Sum (i) {
                    return d3.sum(percentValues,function (d, j){
                        if (j>=i) {
                            return d;
                        }
                    });
                }
                for (var i=0; i<data.length; i++){
                    var selectedPercentValues = d3Sum(i);
                    var area_of_element = selectedPercentValues/100 * area_of_triangle;
                    var height1 = Math.sqrt(area_of_element/ratio);
                    var base = 2 * ratio * height1;
                    var xwidth = (w-base)/2;
                    if (i===0){
                        coordinates[i] = {"values":[{"x":w/2,"y":0},{"x":xwidth,"y":height1},{"x":base+xwidth,"y":height1}]};
                    }else{
                        coordinates[i] = {"values":[coordinates[i-1].values[1],{"x":xwidth,"y":height1},{"x":base+xwidth,"y":height1},coordinates[i-1].values[2]]};
                    }
                }
                return coordinates;
            }
        };
        return pyramid;
    };

    this.optionalFeatures = function () {

    	var optional = {
            svgContainer :function (container_id) {

                that.svgContainer = d3.select(options.selector)
                    .append('svg')
                    .attr({
                        "width": that.chart_width,
                        "height": that.chart_height,
                        "preserveAspectRatio": "xMinYMin",
                        "viewBox": "0 0 " + that.chart_width + " " + that.chart_height,
                        "id": container_id,
                        "class": "svgcontainer PykCharts-oneD"
                    });

                that.group = that.svgContainer.append("g")
                    .attr("id","pyrgrp");

                return this;
            },
        	createChart : function () {
                var border = new PykCharts.Configuration.border(that);
        		that.pyramid = that.pyramidLayout()
                    .data(that.new_data)
                    .size([that.chart_width,that.chart_height]);
		        that.coordinates = that.pyramid.coordinates();
                that.coordinates[0].values[1] = that.coordinates[that.coordinates.length-1].values[1];
                that.coordinates[0].values[2] = that.coordinates[that.coordinates.length-1].values[2];
                var k = that.new_data.length-1,p = that.new_data.length-1,tooltipArray = [];
                for(i=0;i<that.new_data.length;i++){
                    if(i==0) {
                        tooltipArray[i] = that.new_data[i].tooltip || "<table class='PykCharts'><tr><th colspan='3'  class='tooltip-heading'>"+that.new_data[i].name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(that.new_data[i].weight)+"<td class='tooltip-right-content'>("+((that.new_data[i].weight*100)/that.sum).toFixed(1)+"%) </tr></table>";
                    } else {
                        tooltipArray[i] = that.new_data[k].tooltip || "<table class='PykCharts'><tr><th colspan='3'  class='tooltip-heading'>"+that.new_data[k].name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(that.new_data[k].weight)+"<td class='tooltip-right-content'>("+((that.new_data[k].weight*100)/that.sum).toFixed(1)+"%) </tr></table>";
                        k--;
                    }
                }
		        var line = d3.svg.line()
                    .interpolate('linear-closed')
                    .x(function(d,i) { return d.x; })
                    .y(function(d,i) { return d.y; });

                var a = [{x:0,y:that.chart_height},{x:that.chart_width,y:that.chart_height},{x:0,y:that.chart_height},{x:that.chart_width,y:that.chart_height},{x:0,y:that.chart_height},{x:that.chart_width,y:that.chart_height}]
                var k =that.new_data.length;

                that.chart_data =that.group.selectAll('.pyr-path')
                    .data(that.coordinates)
                that.chart_data.enter()
                    .append('path')

                that.chart_data.attr({
                    "class": "pyr-path",
                    'd': function(d) {return line(a);},
                    "stroke": border.color(),
                    "stroke-width": border.width(),
                    "stroke-dasharray": border.style(),
                    "fill": function (d,i) {
                        if(i===0) {
                            b = that.new_data[i];
                        }
                        else {
                            k--;
                            b = that.new_data[k];
                        }
                        return that.fillChart.selectColor(b);
                    },
                    "fill-opacity": 1,
                    "data-fill-opacity": function () {
                        return d3.select(this).attr("fill-opacity");
                    },
                    "data-id" : function (d,i) {
                        return that.new_data[i].name;
                    }
                })
                .on({
                    "mouseover": function (d,i) {
                        if(that.mode === "default") {
                            if(PykCharts['boolean'](that.chart_onhover_highlight_enable)) {
                                that.mouseEvent.highlight(options.selector +" "+".pyr-path",this);
                            }
                            that.mouseEvent.tooltipPosition(d);
                            that.mouseEvent.tooltipTextShow(tooltipArray[i]);
                        }
                    },
                    "mouseout": function (d) {
                        if(that.mode === "default") {
                            if(PykCharts['boolean'](that.chart_onhover_highlight_enable)) {
                                that.mouseEvent.highlightHide(options.selector +" "+".pyr-path")
                            }
                            that.mouseEvent.tooltipHide(d);
                        }
                    },
                    "mousemove": function (d,i) {
                        if(that.mode === "default") {
                            that.mouseEvent.tooltipPosition(d);
                        }
                    },
                    "click" : function (d,i) {
                        if(PykCharts['boolean'](options.click_enable)){
                           that.addEvents(that.new_data[i].name, d3.select(this).attr("data-id")); 
                        }                     
                    }
                })
                .transition()
                .duration(that.transitions.duration())
                .attr('d',function (d){ return line(d.values); });

                that.chart_data.exit().remove();

		        return this;
        	},
            label: function () {
                    var j = that.new_data.length;
                    var p = that.new_data.length;
                    that.chart_text = that.group.selectAll("text")
                        .data(that.coordinates)

                    that.chart_text.enter()
                        .append("text")

                    that.chart_text.attr({
                        "text-anchor": "middle",
                        "pointer-events": "none",
                        "fill": that.label_color,
                        "y": function (d,i) {
                            if(d.values.length === 4) {
                                return (((d.values[0].y-d.values[1].y)/2)+d.values[1].y) +2;
                            } else {
                                return (d.values[0].y + that.coordinates[that.coordinates.length-1].values[1].y)/2 + 10;
                            }
                        },
                        "x": function (d,i) { return that.chart_width/2;}
                    })
                    .text("")
                    .style({
                        "font-weight": that.label_weight,
                        "font-size": that.label_size + "px",
                        "font-family": that.label_family
                    });
                    function chart_text_timeout() {
                        that.chart_text.text(function (d,i) {
                                if(i===0) {
                                    return ((that.new_data[i].weight*100)/that.sum).toFixed(1)+"%";

                                }
                                else {
                                    j--;
                                     return ((that.new_data[j].weight*100)/that.sum).toFixed(1)+"%";
                                }
                             })
                            .text(function (d,i) {
                                if(this.getBBox().width < (d.values[2].x - d.values[1].x) && this.getBBox().height < Math.abs(d.values[1].y - d.values[0].y)) {
                                    if(i===0) {
                                        return ((that.new_data[i].weight*100)/that.sum).toFixed(1)+"%";

                                    }else {
                                        p--;
                                        return ((that.new_data[p].weight*100)/that.sum).toFixed(1)+"%";

                                    }
                                }
                                else {
                                    return "";
                                }
                            });
                    }
                    setTimeout(chart_text_timeout,that.transitions.duration());

                    that.chart_text.exit().remove();

                return this;
            },
            ticks : function () {
                if(PykCharts['boolean'](that.pointer_overflow_enable)) {
                    that.svgContainer.style("overflow","visible");
                }

                var tick_label = that.group.selectAll(".ticks_label")
                        .data(that.coordinates);

                tick_label.enter()
                    .append("text")
                    .attr({
                        "x": 0,
                        "y": 0,
                        "class": "ticks_label"
                    });

                var x,y,w = [];
                that.ticks_text_width = [];
                var j = that.new_data.length;
                var n = that.new_data.length;
                tick_label.attr("transform",function (d) {
                    if (d.values.length === 3) {
                        x = ((d.values[0].x + that.coordinates[that.coordinates.length-1].values[2].x)/2) + 30;
                    } else {
                        x = ((d.values[2].x + d.values[3].x)/2 ) + 30;
                    }
                    if(d.values.length === 4) {
                        y= (((d.values[0].y-d.values[1].y)/2)+d.values[1].y) +2;
                    } else {
                        y =(d.values[0].y + that.coordinates[that.coordinates.length-1].values[1].y)/2;
                    }

                    return "translate(" + x + "," + (y + 5) + ")";
                });

                tick_label.text("");

                function tick_label_timeout() {
                    tick_label.text(function (d,i) {
                            if(i===0) {
                                return that.new_data[i].name;
                            }
                            else {
                                n--;
                                return that.new_data[n].name;
                            }
                        })
                        .text(function (d,i) {
                            if(i===0) {
                                w[i] = this.getBBox().height;
                                that.ticks_text_width[i] = this.getBBox().width;
                                if (this.getBBox().height < (d.values[1].y - d.values[0].y)) {
                                    return that.new_data[i].name;

                                } else {
                                    return "";
                                }
                            }
                            else {
                                w[i] = this.getBBox().height;
                                if (this.getBBox().height < (d.values[0].y - d.values[1].y)) {
                                     j--;
                                    return that.new_data[j].name;
                                }
                                else {
                                    return "";
                                }
                            }
                    })
                    .style({
                        "fill": that.pointer_color,
                        "font-size": that.pointer_size + "px",
                        "font-family": that.pointer_family,
                        "font-weight": that.pointer_weight
                    })
                    .attr("text-anchor","start");

                }
                setTimeout(tick_label_timeout,that.transitions.duration());

                tick_label.exit().remove();
                var tick_line = that.group.selectAll(".pyr-ticks")
                    .data(that.coordinates);

                tick_line.enter()
                    .append("line")
                    .attr("class", "pyr-ticks");

                tick_line
                    .attr({
                        "x1": function (d,i) {
                            if (d.values.length === 3) {
                                return (d.values[0].x + that.coordinates[that.coordinates.length-1].values[2].x)/2 ;
                            } else {
                                return ((d.values[2].x + d.values[3].x)/2 );
                            }
                        },
                        "y1": function (d,i) {
                            if(d.values.length === 4) {
                                return (((d.values[0].y-d.values[1].y)/2)+d.values[1].y) +2;
                            } else {
                                return (d.values[0].y + that.coordinates[that.coordinates.length-1].values[1].y)/2;
                            }
                        },
                        "x2": function (d, i) {
                            if (d.values.length === 3) {
                                return (d.values[0].x + that.coordinates[that.coordinates.length-1].values[2].x)/2  ;
                            } else {
                                return ((d.values[2].x + d.values[3].x)/2 )  ;
                            }
                        },
                        "y2": function (d, i) {
                            if(d.values.length === 4) {
                                return (((d.values[0].y-d.values[1].y)/2)+d.values[1].y) +2;
                            } else {
                                return (d.values[0].y + that.coordinates[that.coordinates.length-1].values[1].y)/2;
                            }
                        },
                        "stroke-width": that.pointer_thickness + "px",
                        "stroke": that.pointer_color
                    });
                    function tick_line_timeout() {
                        tick_line.attr("x2", function (d,i) {
                            if(Math.abs(d.values[0].y - d.values[1].y) > w[i]) {
                                if (d.values.length === 3) {
                                    return (d.values[0].x + that.coordinates[that.coordinates.length-1].values[2].x)/2 + 20;
                                } else {
                                    return ((d.values[2].x + d.values[3].x)/2 ) + 20;
                                }
                            } else {
                                if (d.values.length === 3) {
                                    return (d.values[0].x + that.coordinates[that.coordinates.length-1].values[2].x)/2 ;
                                } else {
                                    return ((d.values[2].x + d.values[3].x)/2 ) ;
                                }
                            }
                        });
                    }
                    setTimeout(tick_line_timeout, that.transitions.duration());

                tick_line.exit().remove();
                return this;
            },
            clubData: function () {
            	if (PykCharts['boolean'](that.clubdata_enable)) {
            		that.displayData = [];
                    that.sorted_weight = [];
                    for(var i=0 ; i<that.data_length ; i++) {
                        that.sorted_weight.push(that.data[i].weight);
                    }
                    that.sorted_weight.sort(function(a,b){ return b-a; });
                    that.checkDuplicate = [];
                    var others_Slice = {"name":that.clubdata_text,"color":that.clubData_color,"tooltip":that.clubData_tooltipText,"highlight":false};
                    var index;
                    var i;
                    that.getIndexByName = function(name){
                        for(i=0;i<that.data_length;i++) {
                            if(that.data[i].name === name)
                                return i;
                        }
                    };

                    var reject = function (index) {
                        var list_length = that.sorted_weight.length,
                            result = [];
                        for(var i=0 ; i<list_length ; i++) {
                            if(that.sorted_weight[i] !== that.data[index].weight) {
                                result.push(that.sorted_weight[i]);
                            }
                        }
                        return result;
                    } ;

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
                        for(var i=0;i<that.data_length;i++)
                        {
                            if(that.data[i].weight === weight) {
                                if(that.checkDuplicate.indexOf(i) === -1) {
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

                    if(count>0)
                    {   that.displayData.push(others_Slice);
                        for (i=0;i<count-1;i++) {
                            index = that.getIndexByWeight(that.sorted_weight[i]);
                            that.displayData.push(that.data[index]);
                        }
                    }
                    var sum_others = d3.sum(that.sorted_weight,function (d,i) {
                            if(i>=count-1)
                                return d;
                        });
                    
                    others_Slice.weight = sum_others;
                }
                else {
                    that.displayData = that.data;
                }
                that.displayData.sort(function (a,b) { return a.weight-b.weight; })
                return that.displayData;
            }
        }
    	return optional;
    };
};
