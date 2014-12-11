PykCharts.weighted = {};
PykCharts.weighted.configuration = function (options){
	var that = this;
	var status;

	var weightedConfig = {
        opacity : function (d,weight,data) {
        	if(!(PykCharts['boolean'](options.size.enable))) {
        		var z = d3.scale.linear()
							.domain(d3.extent(data,function (d) {
							    return d.weight;
							}))
						.range([0.1,1]);
        		
                return d ? z(d) : z(_.min(weight));
        	}
            else {
                return 0.6;
            }
        }
	};
	return weightedConfig;
};

PykCharts.weighted.bubbleSizeCalculation = function (options,data,range) {
    var size = function (d) {
        if(d && PykCharts['boolean'](options.size.enable)) {
            var z = d3.scale.linear()
						.domain(d3.extent(data,function (d) {
						    return d.weight;
						}))
						.range(range);
			return z(d);
		} else { 
			return options.bubbleRadius;
		}
	};
	return size;
};

PykCharts.weighted.pulseBubbleSize = function (options,data) {
    var len = data.length,z;
    var size = function (d,i) {
        if(d && options.optional.size === "yes" && options.optional.color.enable==="yes") {
                z = d3.scale.linear()
                        .domain([0, d3.max(data[i].collection, function (d) {
                            return d[1];
                        })])
                        .range([2,12]);           
                return z(d);
        } else { 
            return options.optional.chart.radius;
        }
    };
    return size;
};

PykCharts.weighted.fillChart = function (options) {
    var that = this;
    var colorPie = function (d) {
        if(!(PykCharts['boolean'](options.size.enable))) {
    		return options.saturationColor;
    	} else if(PykCharts['boolean'](options.size.enable)) {
            if(d.color) {
                return d.color;
            }
    		return options.chartColor;
    	}
    };
    return colorPie;
};