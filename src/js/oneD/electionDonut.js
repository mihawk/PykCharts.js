PykCharts.oneD.electionDonut = function (options) {
    var that = this;
    that.interval = "";
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function(pykquery_data) {
        that = new PykCharts.validation.processInputs(that, options, 'oneDimensionalCharts');

        that.x = true;
        if(options.chart_height || options.chart_height === undefined) {
            try {
                if (options.chart_height === undefined) {                    
                    options.chart_height = theme.stylesheet.chart_height;
                }
                else if (isNaN(options.chart_height)) {
                    that.x = false;
                    throw "chart_height"
                }
            }
            catch (err) {
                that.k.warningHandling(err);
            }
        }

        if(that.x) {
            that.chart_height = options.chart_height;
            that.calculation = undefined;
            that.height_translate = that.chart_height/2;
        }

        else {
            that.chart_height = that.chart_width/2;
            that.calculation = "pie";
            that.height_translate = that.chart_height;
        }

        that.pie_radius_percent = options.donut_radius_percent ? options.donut_radius_percent : theme.oneDimensionalCharts.donut_radius_percent;
        that.innerRadiusPercent = options.donut_inner_radius_percent  && options.donut_inner_radius_percent ? options.donut_inner_radius_percent : theme.oneDimensionalCharts.donut_inner_radius_percent;

        that.k.validator().validatingDataType(that.pie_radius_percent,"donut_radius_percent",theme.oneDimensionalCharts.donut_radius_percent)
            .validatingDataType(that.innerRadiusPercent,"donut_inner_radius_percent",theme.oneDimensionalCharts.donut_inner_radius_percent);

        if(that.stop) {
            return;
        }
        that.k.storeInitialDivHeight();
        if(that.pie_radius_percent > 100) {
            that.pie_radius_percent = 100;
        }

        if(that.innerRadiusPercent > 100) {
            that.innerRadiusPercent = 100;
        }

        try {
            if(that.innerRadiusPercent >= that.pie_radius_percent) {
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
        if(that.mode === "default") {
           that.k.loading();
        }
        that.show_total_at_center = options.donut_show_total_at_center ? options.donut_show_total_at_center.toLowerCase() : theme.oneDimensionalCharts.donut_show_total_at_center;
        that.show_total_at_center_size = "donut_show_total_at_center_size" in options ? options.donut_show_total_at_center_size : theme.oneDimensionalCharts.donut_show_total_at_center_size;
        that.show_total_at_center_color = options.donut_show_total_at_center_color ? options.donut_show_total_at_center_color : theme.oneDimensionalCharts.donut_show_total_at_center_color;
        that.show_total_at_center_weight = options.donut_show_total_at_center_weight ? options.donut_show_total_at_center_weight : theme.oneDimensionalCharts.donut_show_total_at_center_weight;
        that.show_total_at_center_family = options.donut_show_total_at_center_family ? options.donut_show_total_at_center_family : theme.oneDimensionalCharts.donut_show_total_at_center_family;

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
            var pieFunctions = new PykCharts.oneD.pieFunctions(options,that,"election donut");
            that.clubdata_enable = that.data.length> that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
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