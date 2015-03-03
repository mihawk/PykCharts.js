PykCharts.multiD.panelsOfLine = function (options) {
    var that = this;
    that.interval = "";
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function (pykquery_data){

        that = new PykCharts.validation.processInputs(that, options, 'multiDimensionalCharts');

        PykCharts.crossHair(that);
        PykCharts.annotation(that);
        PykCharts.scaleFunction(that);
        PykCharts.grid(that);

        if(that.stop) {
            return;
        }
        that.k.storeInitialDivHeight();
        if(that.mode === "default") {
            that.k.loading();
        }

        var multiDimensionalCharts = theme.multiDimensionalCharts,
            stylesheet = theme.stylesheet,
            optional = options.optional;

        that.pointer_overflow_enable = options.pointer_overflow_enable ? options.pointer_overflow_enable.toLowerCase() : stylesheet.pointer_overflow_enable;
        that.crosshair_enable = options.crosshair_enable ? options.crosshair_enable.toLowerCase() : multiDimensionalCharts.crosshair_enable;
        that.curvy_lines_enable = options.curvy_lines_enable ? options.curvy_lines_enable.toLowerCase() : multiDimensionalCharts.curvy_lines_enable;
        that.interpolate = PykCharts['boolean'](that.curvy_lines_enable) ? "cardinal" : "linear";
        that.panels_enable = "yes";

        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data),
                id = that.selector.substring(1,that.selector.length);
            if(that.stop || validate === false) {
                that.k.remove_loading_bar(id);
                return;
            }

            that.data = that.k.__proto__._groupBy("line",data);
            that.axis_y_data_format = "number";
            that.axis_x_data_format = that.k.xAxisDataFormatIdentification(that.data);
            if(that.axis_x_data_format === "time" && that.axis_x_time_value_datatype === "") {
                console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to have passed Date data so please pass the value for axis_x_time_value_datatype"+"\")  Visit www.pykcharts.com/errors#warning_15");
            }

            if (that.axis_x_data_format === "string") {
                that.data_sort_enable = "no";                
            }
            else {
                that.data_sort_enable = "yes";
                that.data_sort_type = (that.axis_x_data_format === "time") ? "date" : "numerically";
                that.data_sort_order = "ascending";
            }
            PykCharts.multiD.lineFunctions(options,that,"panels_of_line");

        };
        if (PykCharts.boolean(options.interactive_enable)) {
            that.k.dataFromPykQuery(pykquery_data);
            that.k.dataSourceFormatIdentification(that.data,that,"executeData");
        } else {
            that.k.dataSourceFormatIdentification(options.data,that,"executeData");
        }  
    };
};