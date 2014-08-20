PykCharts.weighted.pulse = function (options) {
	var that = this;
    var theme = new PykCharts.Configuration.Theme({});
	this.execute = function () {

		that.k = new PykCharts.Configuration(options);
        that.weighted = new PykCharts.weighted.configuration(options);
        //that.loading = options.optional.loading;
        that.mode = options.mode;
        that.selector = options.selector;
        that.enableTooltip = theme.stylesheet.enableTooltip;
        that.optional = options.optional;
        that.margin = options.optional.chart.margin;
        that.axis = options.optional.axis;
        that.w = options.optional.chart.width;
        that.h = options.optional.chart.height;
        that.bg = theme.stylesheet.colors.backgroundColor;
        that.clubData = options.optional.clubData;
        that.textHover = options.optional.enable_text_hover;
        that.color = options.optional.color;
        that.saturation = options.optional.saturation;
        that.title = options.optional.title;
        that.datasource = options.optional.dataSource;
        that.fullscreen = theme.stylesheet.buttons.enableFullScreenButton;
        that.legends = options.optional.legends;
        that.liveData = options.optional.liveData;
        if(that.mode === "default") {
	        //that.k[that.loading.enable]().loading();
	    }    
        d3.json(options.data, function (e, data) {
        	that.data = data;
        	$(".loader").remove(); // NEW LOADER *****************
            that.render();                    
        });
	};

	this.render = function () {
		that.fillChart = new PykCharts.weighted.fillChart(options);
        that.size = new PykCharts.weighted.pulseBubbleSize(options,that.data);
        that.border = new PykCharts.Configuration.border(options);
        that.k1 = new PykCharts.multi_series_2D.configuration(options);

        if(that.mode === "default") {
            that.k[that.title.enable]().title()
            [that.legends.enable]().positionContainers(that.legends.position,that)
            [that.fullscreen]().fullScreen(that)
            [that.enableTooltip]().tooltip();
        }
        // that.new_data =that.k1[that.clubData.enable]().clubData(that.data);

        that.optionalFeatures()
        	.createPulse()
        	[that.legends.enable]().renderLegends(that.legends.position);
        
        that.mouseEvent = new PykCharts.Configuration.mouseEvent();	
        
        that.k[that.axis.x.enable]().xAxis(that.svg,that.xgroup,that.xScale)
                
        if(that.mode === "default") {
            that.k["yes"]().credits()
                [that.datasource.enable]().dataSource()
                [that.liveData.enable]().liveData(that);
        }       
	};

	this.refresh = function () {
		d3.json(options.data, function (e,data) {
            that.data = data;
      
            that.optionalFeatures()
                .createPulse();
            // that.k1[that.legends.enable]().legends(that.series,that.group1,that.new_data,that.legendsvg);
            // that.k[that.axis.y.enable]().yAxis(that.svg,that.ygroup,that.yScale)
            //     [that.axis.x.enable]().xAxis(that.svg,that.xgroup,that.xScale)
            //     [that.grid.xEnabled]().xGrid(that.svg,that.group,that.xScale);
        }); 

	};

	function showText () {
		if (that.textHover==="yes") {
			that.group = d3.select(this).node().parentNode;
			d3.select(that.group).selectAll("circle")
				.style("display","none");
			d3.select(that.group).selectAll("text.value")
				.style("display","block");
		}
	};

	function hideText () {
		if (that.textHover==="yes") {
			that.group = d3.select(this).node().parentNode;
    		d3.select(that.group).selectAll("circle")
    			.style("display", "block");
    		d3.select(that.group).selectAll("text.value")
    			.style("display", "none");
		}
	};

	this.truncate = function (str, maxLength, suffix) {	 
        if (str.length > maxLength) {
            str = str.substring(0, maxLength + 1);
            str = str.substring(0, Math.min(str.length, str.lastIndexOf(" ")));
            str = str + suffix;
        }
        return str;  
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
        if(h >= 500 || w > 900){
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
            d3.select(".clone #legendgrp").attr("transform","translate(0,0)scale("+scaleFactor+")"); 
            d3.select(".clone #svgcontainer").attr("width",screen.width-200).attr("height",screen.height-200).style("display","block");
        }
        else if(that.legends.position == "left" || that.legends.position == "right") {
            d3.select(".clone #legendsvg").attr("width",100).attr("height",screen.height-100);
            d3.select(".clone svg #legendgrp").attr("transform","translate(150,0)scale("+scaleFactor+")");            
            d3.select(".clone #svgcontainer").attr("width",screen.width-200).attr("height",screen.height-200);
        }
        d3.select(".clone svg #pulsegrp").attr("transform","translate(20,0)scale("+scaleFactor+")");
        // .attr("transform","scale("+scaleFactor+")");  
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
			svgContainer: function () {
				that.svg = d3.select(options.selector)
                    .append("svg")
                    .attr("class","svgcontainer")
                    .attr("id","svgcontainer")
                    .attr("width", that.w)
                    .attr("height", that.h)
                    .style("background-color",that.bg);

                that.g = that.svg.append("g")
                	.attr("id","pulsegrp")
                	// .attr("transform","translate(20,0)")

                if(that.axis.x.enable === "yes") {
                	that.xgroup = that.g.append("g")
                    	.attr("id","xaxis")
                    	.attr("class", "x axis")
                    	.attr("transform","translate(0," + that.margin.top + ")")
                    	.style("stroke","none"); 
                }
                return this;
			},
			legendsContainer : function () {
                that.legendSvg = d3.select(options.selector).append("svg")
                    .attr("class","legendsvg")
                    .attr("id","legendsvg")
                    .attr("width",that.w)
                    .attr("height",50);

                that.legendgrp = that.legendSvg.append("g")
                    .attr("class","legendgrp")
                    .attr("id","legendgrp"); 

            return this;
            },
			createPulse : function () {
				var len = that.data.length;
				var len1 = that.data[0].collection.length;
			
				that.width = that.w - that.margin.left - that.margin.right;
				that.height = that.h - that.margin.top - that.margin.bottom;

				that.max = 12;
				that.min =2;

				that.xScale = d3.scale.linear()
			            .domain([2001, 2012])
			            .range([10, that.width]);

			       var a = [], k=0;
		            for (i=0;i<that.data.length;i++){
		            	for (j=0;j<that.data[0].collection.length;j++) {
		            		a[k] = that.data[j].collection[j][1];
		            		k++;
		            	}
		            }
		         
				for (var j = 0; j < len; j++) {

            		that.group = that.svg.append("g")
            			.attr("id", "pulsegrp")
            			.attr("width", that.w)
            			.attr("transform","translate(20,20)");
            
	            	that.circles = that.group.selectAll("circle")
		                .data(that.data[j].collection)
		                .enter()
		                .append("circle");
		            
	            	that.text = that.group.selectAll("text")
		                .data(that.data[j].collection)
		                .enter()
		                .append("text");

	            	that.rScale = d3.scale.linear()
		                .domain([0, d3.max(that.data[j].collection, function (d) {
		                    return d[1];
		                })])
		                .range([that.min,that.max]);

		            that.circles
		                .attr("cx", function (d, i) {
		                    return that.xScale(d[0]);
		                })
		                .attr("cy", j * 30 + 30)
		                .attr("r", function (d) {
		                	if (that.color.enable==="yes" || that.saturation.enable==="yes") {
		                		return that.size(d[1],j);
		                	}
		                	else {
		                		return that.rScale(d[1]);
		                	}		                
		                })
		                .attr("fill", function (d,i) {
		                	if(that.color.enable === "no")
		                	{		                	
		                		if(that.saturation.enable === "no") {	
		                			return that.data[j].color;
		                		} else if(that.saturation.enable==="yes"){
		                			return that.saturation.color;
		                		}
 		                	}
		                	else {
		                		return that.color.color;
		                	}
		                })
		                .attr("opacity",function (d,i) {
		                	if(that.color.enable === "no" && that.saturation.enable === "yes") {
		                		return that.rScale(d[1])/12;
		                	}		                	
		                })
		                .on("mouseover", function (d) {
		          
                            that.mouseEvent[that.enableTooltip]().tooltipPosition(d);
                            that.mouseEvent[that.enableTooltip]().toolTextShow(d[1]);                        	
                    	})
                    	.on("mouseout", function (d) {
                        	that.mouseEvent[that.enableTooltip]().tooltipHide(d)
                     
                   	 	})
	                    .on("mousemove", function (d) {	                        
	                        that.mouseEvent[that.enableTooltip]().tooltipPosition(d);	                        
	                    })
			         
		            that.text
		                .attr("y", j * 30 + 35)
		                .attr("x", function (d, i) {
		                    return that.xScale(d[0]) - 5;
		                })
		                .attr("class", "value")
		                .text(function (d) {
		                    return d[1];
		                })
		                .attr("fill", function (d,i) {
		                	if(that.color.enable === "no")
		                	{		                	
		                		if(that.saturation.enable === "no") {	
		                			return that.data[j].color;
		                		} else if(that.saturation.enable==="yes"){
		                			return that.saturation.color;
		                		}
 		                	}
		                	else {
		                		return that.color.color;
		                	}
		                })
		                .attr("opacity",function (d,i) {
		                	if(that.color.enable === "no" && that.saturation.enable === "yes") {
		                		return that.rScale(d[1])/12;
		                	}		                	
		                })
						.style("font-size",12)
                    	.style("font-family", "'Helvetica Neue',Helvetica,Arial,sans-serif")
		                .style("display", "none");

		            that.group.append("text")
		                .attr("y", j * 30 + 35)
		                .attr("x", that.width +40)
		                .attr("class", "label1")
		                .text(that.truncate(that.data[j].name, 30, "..."))
		                .attr("fill", function (d,i) {
		                	if(that.color.enable === "no")
		                	{		                	
		                		if(that.saturation.enable === "no") {	
		                			return that.data[j].color;
		                		} else if(that.saturation.enable==="yes"){
		                			return that.saturation.color;
		                		}
 		                	}
		                	else {
		                		return that.color.color;
		                	}
		                })
		                .attr("pointer-events","all")
		                .style("font-size",12)
                   		.style("font-family", "'Helvetica Neue',Helvetica,Arial,sans-serif")
		                .on("mouseover", showText)
		                .on("mouseout", hideText);		     
        		}
        		return this;
			},
			renderLegends : function (position) {
                if(status && that.color.enable == "no" && that.saturation.enable == "yes") {
					var map =[];
                    for (i =that.min, j=0; i<=that.max; i++,j++){
                    	map[j]=i;
                    }
                    that.arrange = map.sort(d3.ascending);        
                    var unique = _.uniq(that.arrange);
                    var a,b,c,d,e,v;
                    var x_legend = function (d,i) { return i*that.w/unique.length; };
                    var width_func = function (d) { return that.w/unique.length; };
                    var x_text = function (d,i) { return i*that.w/unique.length+that.w/unique.length; };
                    var y_legend = function (d,i) { return i*that.h/unique.length; };
                    var height_func = function (d) { return that.h/unique.length; };                    
                    var y_text = function (d,i) { return i*that.h/unique.length+that.h/unique.length; };
                    var fillColor = function (d) {
                    	if(that.color.enable === "no") {		                	
		                	if(that.saturation.enable === "no") {	
		                		return that.data[j].color;
		                	} else if(that.saturation.enable==="yes"){
		                		return that.saturation.color;
		                	}
 		                }
		                else {
		                		return that.color.color;
		                }
                    };
                    var opacity = function (d) {
                    	if(that.color.enable === "no" && that.saturation.enable === "yes") {
		                		return d/that.max;
		                }	                          
                    };
                    var sign = function (d){ return Math.round(d);};

                    if (position==="top" || position==="bottom") {
                        v="x";
                        a=x_legend;
                        b= width_func;                        
                        c= 10;
                        d=30;
                        e= x_text;
                        common (v,a,b,c,d,e);
                        
                    }
                    if (position==="left" || position==="right") {
                        that.legendSvg.attr("width",50)
                            .attr("height", that.h);
                       v="y";
                       a=y_legend;
                       b=10;
                       c=height_func;
                       d=y_text;
                       e=41;
                       common (v,a,b,c,d,e);
                    } 
                return this;
                }
                function common() {
                    for(i=0; i<unique.length; i++) {
                    var legend_data =that.legendgrp.selectAll("rect")
                        .data(unique);

                    legend_data.enter()
                        .append("rect");

                    legend_data.attr(v,a)
                        .attr("width",b)
                        .attr("height",c)
                        .attr("fill",fillColor)
                        .attr("opacity",opacity);

                    legend_data.exit().remove();

                    var legend_text = that.legendgrp.selectAll("text")
                        .data(unique);

                    legend_text.enter()
                        .append("text");

                    legend_text.attr("y",d)
                        .attr("x",e)
                        .attr("text-anchor","end")
                        .text(sign)
                        .style("font-size",12)
                        .style("font-family", "'Helvetica Neue',Helvetica,Arial,sans-serif");

                    legend_text.exit().remove(); 
                    }               
                }
            },      			
		};
		return optional;
	};
};