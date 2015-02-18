PykCharts.oneD.pie = function (options) {
    var that = this;
    that.interval = "";
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function(pykquery_data) {
        that = new PykCharts.validation.processInputs(that, options, 'oneDimensionalCharts');
        if(options.chart_height) {
            that.chart_height = options.chart_height;
            that.calculation = undefined;
        }
        else {
            that.chart_height = that.chart_width;
            that.calculation = "pie";
        }
        that.pie_radius_percent = options.pie_radius_percent ? options.pie_radius_percent : theme.oneDimensionalCharts.pie_radius_percent;

        that.k.validator()
            .validatingDataType(that.chart_height,"chart_height",that.chart_width)
            .validatingDataType(that.pie_radius_percent,"pie_radius_percent",theme.oneDimensionalCharts.pie_radius_percent);

        if(that.stop) {
            return;
        }
        that.k.storeInitialDivHeight();
        that.innerRadiusPercent = 0;
        that.height_translate = that.chart_height/2;

        if(that.pie_radius_percent > 100) {
            that.pie_radius_percent = 100;
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
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"pie");
            that.clubdata_enable = that.data.length > that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            pieFunctions.render();
        };
        if (PykCharts['boolean'](options.interactive_enable)) {
            that.k.dataFromPykQuery(pykquery_data);
            that.k.dataSourceFormatIdentification(that.data,that,"executeData");
        } else {
            that.k.dataSourceFormatIdentification(options.data,that,"executeData");
        }   

    };
};