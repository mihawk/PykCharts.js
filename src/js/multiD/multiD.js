PykCharts.multiD = {};
var theme = new PykCharts.Configuration.Theme({});

PykCharts.multiD.configuration = function (options){
    var that = this;
    var fillColor = new PykCharts.Configuration.fillChart(options);
    var multiDConfig = {
        opacity : function (d,weight,data) {
            if(!(PykCharts['boolean'](options.variable_circle_size_enable))) {
                var z = d3.scale.linear()
                    .domain(d3.extent(data,function (d) {
                        return d.weight;
                    }))
                    .range([0.1,1]);
                return d ? z(d) : z(Math.min.apply(null, weight));
            }
            else {
                return 0.6;
            }
        },
        legendsPosition : function (options,type,params,color,index) {
            var j=0,legend,translate_x = 0;
             if(options.legends_display === "vertical" ) {
                options.legendsGroup.attr("height", (params.length * 30)+20);
                options.legendsGroup_height = 0;
                text_parameter1 = "x";
                text_parameter2 = "y";
                rect_parameter1 = "width";
                rect_parameter2 = "height";
                rect_parameter3 = "x";
                rect_parameter4 = "y";
                rect_parameter1value = 13;
                rect_parameter2value = 13;
                text_parameter1value = function (d,i) { return 36; };
                rect_parameter3value = function (d,i) { return 20; };
                var rect_parameter4value = function (d,i) { return i * 24 + 12;};
                var text_parameter2value = function (d,i) { return i * 24 + 23;};
            } else if(options.legends_display === "horizontal") {
                options.legendsGroup_height = 50;
                temp_i = j;
                final_rect_x = 0;
                final_text_x = 0;
                legend_text_widths = [];
                sum_text_widths = 0;
                temp_text = temp_rect = 0;
                text_parameter1 = "x";
                text_parameter2 = "y";
                rect_parameter1 = "width";
                rect_parameter2 = "height";
                rect_parameter3 = "x";
                rect_parameter4 = "y";
                var text_parameter1value = function (d,i) {
                    legend_text_widths[i] = this.getBBox().width;
                    legend_start_x = 16;
                    final_text_x = (i === 0) ? legend_start_x : (legend_start_x + temp_text);
                    temp_text = temp_text + legend_text_widths[i] + 30;
                    return final_text_x;
                };
                text_parameter2value = 30;
                rect_parameter1value = 13;
                rect_parameter2value = 13;
                var rect_parameter3value = function (d,i) {
                    final_rect_x = (i === 0) ? 0 : temp_rect;
                    temp_rect = temp_rect + legend_text_widths[i] + 30;
                    return final_rect_x;
                };
                rect_parameter4value = 18;
            }
            if (type === "scatter") {
                if(options.panels_enable === "yes"){
                    var legend_data =[];
                    legend_data.push(options.map_group_data[0][index]);
                    legend = options.legendsGroup.selectAll("rect")
                        .data(legend_data);
                    options.legends_text = options.legendsGroup.selectAll(".legends_text")
                        .data(legend_data);
                } else {
                    legend = options.legendsGroup.selectAll("rect")
                        .data(options.map_group_data[0]);
                    options.legends_text = options.legendsGroup.selectAll(".legends_text")
                        .data(options.map_group_data[0]);
                }
            } else {
                legend = options.legendsGroup.selectAll(".legends-rect")
                    .data(params);
                options.legends_text = options.legendsGroup.selectAll(".legends_text")
                    .data(params);
            }

            options.legends_text.enter()
                .append('text');
            options.legends_text.attr("class","legends_text")
                .attr("pointer-events","none")
                .text(function (d) {
                    switch (type) {
                        case "groupColumn" :
                        case "groupBar" :
                            return d;
                        case "spiderWeb" :                           
                        case "scatter" :
                            return d.group;
                        case "stackedArea" :
                            return d.name;
                    } 
                })
                .attr("fill", options.legends_text_color)
                .attr("font-family", options.legends_text_family)
                .style("font-size",options.legends_text_size+"px")
                .attr("font-weight", options.legends_text_weight)
                .attr(text_parameter1, text_parameter1value)
                .attr(text_parameter2, text_parameter2value);

            legend.enter()
                .append("rect");

            legend.attr("class","legends-rect")
                .attr(rect_parameter1, rect_parameter1value)
                .attr(rect_parameter2, rect_parameter2value)
                .attr(rect_parameter3, rect_parameter3value)
                .attr(rect_parameter4, rect_parameter4value)
                .attr("fill", function (d,i) {
                    switch(type) {
                        case "groupColumn" :
                        case "groupBar" :
                            if(options.color_mode === "color")
                                return color[i];
                            else return options.saturation_color;
                        case "spiderWeb" :
                        case "scatter" : 
                            return options.fillChart.colorPieW(d);
                        case "stackedArea" :
                            return options.fillColor.colorPieMS(d,options.type);
                    }                    
                })
                .attr("fill-opacity", function (d,i) {
                    switch(type) {
                        case "groupColumn" :
                        case "groupBar" :
                            if (options.color_mode === "saturation") {
                                return (i+1)/options.no_of_groups;
                            }
                            break;
                        case "spiderWeb" :
                        case "scatter" : 
                            return 0.6;
                        case "stackedArea" :
                            if(options.color_mode === "saturation") {
                             return (i+1)/options.new_data.length;
                            }
                    }
                });

            var legend_container_width = options.legendsGroup.node().getBBox().width,translate_x;
            options.legendsGroup_width = (options.legends_display === "vertical") ? legend_container_width + 20 : 0;
            if (type === "scatter") {
                translate_x = (options.legends_display === "vertical") ? (options.w - options.legendsGroup_width) : ((!PykCharts['boolean'](options.panels_enable)) ? (options.chart_width - legend_container_width - 20) : options.chart_margin_left); 
            } else {
                translate_x = (options.legends_display === "vertical") ? (options.chart_width - options.legendsGroup_width) : (options.chart_width - legend_container_width - 20);
            }          
            if (legend_container_width < options.chart_width) { 
                options.legendsGroup.attr("transform","translate("+translate_x+",10)"); 
            }
            options.legendsGroup.style("visibility","visible");
            options.legends_text.exit().remove();
            legend.exit().remove();
        },
        mapGroup : function (data,type) {
            var newarr = [],
                unique = {},
                group_arr = [],
                uniq_group_arr = [],
                uniq_group_obj = {},
                new_arr = [],
                k = 0,
                checkGroup = true,
                checkColor = true;
            for (var i=0 ; i<data.length ; i++) {
                group_arr[i] = data[i]['group'];
            }
            uniq_group_arr = options.k.__proto__._unique(group_arr);
            for (var i=0 ; i<uniq_group_arr.length ; i++) {
                uniq_group_obj[uniq_group_arr[i]] = [];
            }
            for (var key in uniq_group_obj) {
                for (var j=0 ; j<data.length ; j++) {
                    if (key === data[j]['group']) {
                        uniq_group_obj[key].push(data[j]);
                    }
                }
            }
            for (var key in uniq_group_obj) {
                for (var i=0 ; i<uniq_group_obj[key].length ; i++) {
                    new_arr.push(uniq_group_obj[key][i]);
                }
            }
            data = new_arr;
            data.forEach(function (item) {
                if(item.group) {
                    checkGroup = true;
                } else {
                    checkGroup = false;
                    if(options.chart_color) {
                        checkGroup = false;
                        item.color = options.chart_color[0];
                    } else if(item.color) {
                        checkColor = false;
                        item.color = item.color;
                    } else{
                        checkColor = false;
                        item.color = options.default_color[0];
                    }
                }
            });
            i = 0
            if(checkGroup) {
                data.forEach(function(item) {
                    if (!unique[item.group] && item.color) {
                        unique[item.group] = item;
                        if(options.chart_color.length !== 0 && PykCharts['boolean'](options.chart_color[k])) {
                            item.color = options.chart_color[k];
                        } else if(item.color) {
                            item.color = item.color;
                        } else {
                            item.color = options.default_color;
                        }
                        if(i<data.length-2 && item.group !== data[i+1].group) {
                            k++;
                        }
                        newarr.push(item);
                    } else {
                        if(i < data.length-2 && item.group !== data[i+1].group) {
                            k++;
                        }
                    }
                    i++;
                });
                k=0;i=0;
                data.forEach(function(item) {
                    if(!unique[item.group]) {
                        unique[item.group] = item;
                        if(options.chart_color.length !== 0 && PykCharts['boolean'](options.chart_color[k])) {
                            item.color = options.chart_color[k];
                        } else {
                            item.color = options.default_color;
                        }
                        if(i<data.length-2 &&item.group !== data[i+1].group) {
                            k++;
                        }
                        newarr.push(item);
                    } else {
                        if(i<data.length-2 && item.group !== data[i+1].group) {
                            k++;
                        }
                    }
                    i++;
                })

                var arr = [];
                var uniqueColor = {};
                k = 0;
                newarr.forEach(function(item) {
                    arr.push(item);
                });
                var arr_length = arr.length,
                data_length = data.length;
                for(var i = 0;i < arr_length; i++) {
                    for(var j = 0;j<data_length;j++) {
                        if(data[j].group === arr[i].group) {
                            data[j].color = arr[i].color;
                        }
                    }
                }
                return [arr,checkGroup];
            } else {
                return [data,checkGroup];
            }
        }

    };
    return multiDConfig;
};

PykCharts.multiD.bubbleSizeCalculation = function (options,data,rad_range) {
    var size = function (d) {
        if(d && PykCharts['boolean'](options.variable_circle_size_enable)) {
            var z = d3.scale.linear()
                        .domain(d3.extent(data,function (d) {
                            return d.weight;
                        }))
                        .range(rad_range);
            return z(d);
        } else {
            return options.bubbleRadius;
        }
    };
    return size;
};

PykCharts.multiD.sortDataByGroup = function (data) {
    data.sort(function(a,b) {
        if (a.group < b.group) {
            return -1;
        }
        else if (a.group > b.group) {
            return 1;
        }
    });
    return data;
}

