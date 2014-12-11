PykCharts.multi_series_2D = {};
PykCharts.multi_series_2D.configuration = function (options){
	var that = this;
	var status;
    var fillColor = new PykCharts.multi_series_2D.fillChart(options);
	var multiSeriesConfig = {
		yes : function () {
            status = true;
            return this;
        },
        no :function () {
            status = false;
            return this;
        },
        legendsPosition : function (chart) {
            if(status) {
                chart.optionalFeatures().legendsContainer().svgContainer();
            }else {
                chart.optionalFeatures().svgContainer();
            }
            return this;
        },
        legends: function (series,group1,data,svg) {
            if(status) {

                var j = 0,k = 0;
                j = series.length;
                k = series.length;                

                if(options.optional.legends.display === "vertical") {
                    svg.attr("height", (series.length * 30)+20)
                    text_parameter1 = "x";
                    text_parameter2 = "y";
                    rect_parameter1 = "width";
                    rect_parameter2 = "height";
                    rect_parameter3 = "x";
                    rect_parameter4 = "y";
                    rect_parameter1value = 13;
                    rect_parameter2value = 13;
                    text_parameter1value = function (d,i) { return options.optional.chart.width - 75; };
                    rect_parameter3value = function (d,i) { return options.optional.chart.width - 100; };
                    var rect_parameter4value = function (d,i) { return i * 24 + 12;};
                    var text_parameter2value = function (d,i) { return i * 24 + 26;};
                }
                if(options.optional.legends.display === "horizontal"){
                    
                    svg.attr("height",70);
                    text_parameter1 = "x";
                    text_parameter2 = "y";
                    rect_parameter1 = "width";
                    rect_parameter2 = "height";
                    rect_parameter3 = "x";
                    rect_parameter4 = "y";
                    var text_parameter1value = function (d,i) { j--;return options.optional.chart.width - (j*100 + 75); };
                    text_parameter2value = 30;
                    rect_parameter1value = 13;
                    rect_parameter2value = 13;
                    var rect_parameter3value = function (d,i) { k--;return options.optional.chart.width - (k*100 + 100); };
                    rect_parameter4value = 18;
                }
                
                that.legends_text = group1.selectAll(".legends_text")
                    .data(series);
                that.legends_text.enter()
                    .append('text')
                    .attr("class","legends_text")
                    .attr("fill","#1D1D1D")
                    .attr("pointer-events","none")
                    .style("font-family", "'Helvetica Neue',Helvetica,Arial,sans-serif");

                that.legends_text.attr("class","legends_text")
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   .attr("fill","black")
                    .attr(text_parameter1, text_parameter1value)
                    .attr(text_parameter2, text_parameter2value)
                    .text(function (d) { return d; });
                that.legends_text.exit()
                    .remove();
                
                that.legends_rect = group1.selectAll(".legends_rect")
                    .data(series);
                
                that.legends_rect.enter()
                    .append("rect")
                    .attr("class","legends_rect");
                
                that.legends_rect.attr("class","legends_rect")
                    .attr('fill',function (d,i) { return fillColor(data[i]); })
                    .attr("fill-opacity", function (d,i) { return options.optional.saturation.enable === "yes" ? (i+1)/series.length : 1; })
                        .attr(rect_parameter1, rect_parameter1value)
                        .attr(rect_parameter2, rect_parameter2value)
                        .attr(rect_parameter3, rect_parameter3value)
                        .attr(rect_parameter4, rect_parameter4value);
                that.legends_rect.exit()
                    .remove();
            }
            return this;
        },
        legendsGroupStacked : function (legendsContainer,legendsGroup,names,color) {
            if(status) {
                var p = 0,a=[],k,jc,ic;
                for(i=0;i<names.length;i++) {
                    for(j=0;j<names[i].length;j++) {
                        a[p] = names[i][j];
                        p++;
                    }
                }
                jc = a.length;
                k = a.length;
                ic = -1;
                legendsContainer.attr("height",90);
                var abc = legendsGroup.selectAll(".legends_g")
                    .data(names)
                    .enter()
                    .append("g")
                    .attr("class","legends_g")
                    .attr("fill",function (d) {ic++;return color[ic];})
                abc.selectAll(".legends_rect")
                        .data(names[ic])
                        .enter()
                            .append("rect")
                            .attr("class","legends_rect")
                            .attr("x",function (d) { k--;return options.optional.chart.width - (k*80 + 75); })
                            .attr("y", 20)
                            .attr("height",13)
                            .attr("width",13)
                            .attr("fill-opacity",function (d,i) { return options.optional.saturation.enable === "yes" ? (names[i].length - i)/names[i].length : 1 ;});
               legendsGroup.selectAll(".legends_text")
                    .data(a)
                    .enter()
                        .append("text")
                        .attr("class","legends_text")
                        .attr("pointer-events","none")
                        .attr("x", function (d,i) {jc--;return options.optional.chart.width - (jc*80 + 55); })
                        .attr("y",32)
                        .attr("fill","#1D1D1D")
                        .attr("font-family","'Helvetica Neue',Helvetica,Arial,sans-serif")
                        .text(function (d) { return d; });
            }
            return this;
        },
        clubData : function (data) {
            if (status) {
                var ref_data = [], new_data = [], always = [], others_weight = [],k;
                if(data.length <= options.optional.clubData.maximumNodes) {
                    new_data = data;
                    return new_data;
                }
                for(i = 0 ; i < data.length; i++) {
                    ref_data[i] = {};
                    ref_data[i].total=0;
                    for(j = 0; j < data[i].data.length; j++) {
                        ref_data[i].total += data[i].data[j].weight;
                    }
                    ref_data[i].name=data[i].name;
                }
                ref_data.sort(function (a,b) { return b.total - a.total; });
                
                clubdata_content = options.optional.clubData.alwaysIncludeDataPoints;

                for(k=0; clubdata_content.length < options.optional.clubData.maximumNodes-1; k++) {
                    clubdata_content.push(ref_data[k].name);
                }
                for(i=0;i<clubdata_content.length;i++){
                    for(j=0;j<data.length;j++){
                        if(clubdata_content[i].toUpperCase() === data[j].name.toUpperCase()){
                            new_data.push(data[j]);
                            always[i] = j;
                        }
                    }
                }
                others = {"name" : options.optional.clubData.text, "color" : options.optional.clubData.color};
                var a;
                for(j = 0; j<data.length; j++) {
                    
                    if(j === 0){
                        a = true;
                    }
                    if(_.contains(always,j)) {
                        continue;
                    }else {
                        others.data=[];
                        for(l = 0; l<data[j].data.length; l++) {
                            if(a) {
                                others_weight[l] = 0;
                            }
                            others.data[l] = {};
                            others_weight[l] += data[j].data[l].weight;
                            others.data[l].name = data[0].data[l].name;
                            others.data[l].weight = others_weight[l];
                            others.data[l].tooltip = "Others";
                        }
                        a=false;
                    }
                }
                if(new_data.length > options.optional.clubData.maximumNodes){
                    new_data.pop();
                }

                if(new_data.length < options.optional.clubData.maximumNodes){
                    new_data.push(others);
                }
            }else {
                new_data =data;
            }
            return new_data;
        }
	};
	return multiSeriesConfig;
};

PykCharts.multi_series_2D.fillChart = function (options,config) {
    var that = this;
    var colorPie = function (d) {
        if(PykCharts['boolean'](d.highlight)) {
            return options.highlightColor;
        } else if(config.optional && config.optional.colors && config.optional.colors.chartColor) {
            return options.chartColor;
        } else if(config.optional && config.optional.colors && d.color){
            return d.color;
        } else {
            return options.chartColor;
        }
    };
    return colorPie;
};

// PykCharts.multi_series_2D.fillChart = function (options) {
//     var that = this;
//     var colorPie = function (d) {
//         if(options.optional.saturation.enable == "yes") {
//             return options.optional.saturation.color;
//         } else if(options.optional.color.enable == "yes" && d.color) {
//             return d.color;
//         } else {
//             return options.optional.color.color;
//         }
//     };
//     return colorPie;
// };
