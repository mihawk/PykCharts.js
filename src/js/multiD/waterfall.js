PykCharts.multiD.waterfall = function(options){
	var that = this;

	this.execute = function () {
		that.selector = options.selector;
		that.mode = options.mode;
		that.width = options.chart_width;
		that.height = options.chart_height;

		d3.json(options.json, function(e, data) {
			// var validate = that.k.validator().validatingJSON(data);
   //          if(that.stop || validate === false) {
   //              $(that.selector+" #chart-loader").remove();
   //              return;
   //          }

            that.data = that.k.__proto__._groupBy("bar",data);
            that.compare_data = that.k.__proto__._groupBy("bar",data);
            console.log(that.data,"*******",options);

            that.render();
		});
	};

	this.render = function () {
		console.log(that.data," <<< RENDER");
	};
};