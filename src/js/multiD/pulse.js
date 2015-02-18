PykCharts.multiD.pulse = function (options) {
  var that = this;
  that.interval = "";
  var theme = new PykCharts.Configuration.Theme({});

  this.execute = function(pykquery_data) {
    that = new PykCharts.validation.processInputs(that, options, 'multiDimensionalCharts');
    PykCharts.scaleFunction(that);
    var multiDimensionalCharts = theme.multiDimensionalCharts,
    stylesheet = theme.stylesheet;

    that.multiD = new PykCharts.multiD.configuration(that);
    that.bubbleRadius = options.bubbleRadius ? options.scatterplot_radius : (0.6 * multiDimensionalCharts.scatterplot_radius);
    that.panels_enable = "no";

    try {
      if(!that.k.__proto__._isNumber(that.bubbleRadius)) {
        that.bubbleRadius = (0.6 * multiDimensionalCharts.scatterplot_radius);
        throw "bubbleRadius"
      }
    }

    catch (err) {
      that.k.warningHandling(err,"1");
    }

    if(that.stop) {
      return;
    }
    that.k.storeInitialDivHeight();
    that.zoomed_out = true;
    that.radius_range = [that.k.__proto__._radiusCalculation(1.1)*2,that.k.__proto__._radiusCalculation(3.5)*2];

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
      that.data = that.k.__proto__._groupBy("pulse",data);
      that.axis_y_data_format = that.k.yAxisDataFormatIdentification(that.data);
      that.axis_x_data_format = that.k.xAxisDataFormatIdentification(that.data);
      if(that.axis_x_data_format === "date" && that.axis_x_time_value_datatype === "") {
        console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to pass Date data so please pass axis_x_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
      }
      if(that.axis_y_data_format === "date" && that.axis_y_time_value_datatype === "") {
        console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to pass Date data so please pass axis_y_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
      }
      that.compare_data = that.k.__proto__._groupBy("pulse",data);
      that.k.remove_loading_bar(id);
      var a = new PykCharts.multiD.scatterplotFunctions(options,that,"pulse");
      a.render();
    };
    if (PykCharts.boolean(options.interactive_enable)) {
        that.k.dataFromPykQuery(pykquery_data);
        that.k.dataSourceFormatIdentification(that.data,that,"executeData");
    } else {
        that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    }   
  };
};