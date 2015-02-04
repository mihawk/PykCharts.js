PykCharts.multiD.scatter = function (options) {
  var that = this;
  var theme = new PykCharts.Configuration.Theme({});

  this.execute = function(pykquery_data) {
    that = new PykCharts.validation.processInputs(that, options, 'multiDimensionalCharts');
    that.bubbleRadius = options.scatterplot_radius ? options.scatterplot_radius : theme.multiDimensionalCharts.scatterplot_radius;
    that.panels_enable = "no";
    PykCharts.scaleFunction(that);

    try {
      if(!that.k.__proto__._isNumber(that.bubbleRadius)) {
        that.bubbleRadius = theme.multiDimensionalCharts.scatterplot_radius;
        throw "bubbleRadius";
      }
    }

    catch (err) {
      that.k.warningHandling(err,"1");
    }

    if(that.stop){
      return;
    }
    that.k.storeInitialDivHeight();
    if(that.mode === "default") {
      that.k.loading();
    }

    var multiDimensionalCharts = theme.multiDimensionalCharts,
    stylesheet = theme.stylesheet;

    that.multiD = new PykCharts.multiD.configuration(that);
    that.scatterplot_pointer_enable =  options.scatterplot_pointer_enable ? options.scatterplot_pointer_enable.toLowerCase() : multiDimensionalCharts.scatterplot_pointer_enable;
    that.zoomed_out = true;

    if(PykCharts['boolean'](that.panels_enable)) {
      that.radius_range = [that.k.__proto__._radiusCalculation(1.1)*2,that.k.__proto__._radiusCalculation(2.6)*2];
    } else {
      that.radius_range = [that.k.__proto__._radiusCalculation(4.5)*2,that.k.__proto__._radiusCalculation(11)*2];
    }

    that.executeData = function (data) {
      var validate = that.k.validator().validatingJSON(data),
      id = that.selector.substring(1,that.selector.length);
      if(that.stop || validate === false) {
        that.k.remove_loading_bar(id);
        return;
      }

      that.data = that.k.__proto__._groupBy("scatterplot",data);
      that.axis_y_data_format = that.k.yAxisDataFormatIdentification(that.data);
      that.axis_x_data_format = that.k.xAxisDataFormatIdentification(that.data);
      if(that.axis_x_data_format === "time" && that.axis_x_time_value_datatype === "") {
        console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to have passed Date data so please pass the value for axis_x_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
      }
      if(that.axis_y_data_format === "time" && that.axis_y_time_value_datatype === "") {
        console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to have passed Date data so please pass the value for axis_x_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
      }
      that.compare_data = that.k.__proto__._groupBy("scatterplot",data);
      that.k.remove_loading_bar(id);
      var a = new PykCharts.multiD.scatterplotFunctions(options,that,"scatterplot");
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

PykCharts.multiD.panelsOfScatter = function (options) {
  var that = this;
  var theme = new PykCharts.Configuration.Theme({});

  this.execute = function(pykquery_data) {
    that = new PykCharts.validation.processInputs(that, options, 'multiDimensionalCharts');
    PykCharts.scaleFunction(that);
    that.bubbleRadius = options.scatterplot_radius ? options.scatterplot_radius : theme.multiDimensionalCharts.scatterplot_radius;
    that.panels_enable = "yes";
    that.legends_display = "horizontal";
    try {
      if(!that.k.__proto__._isNumber(that.bubbleRadius)) {
        that.bubbleRadius = theme.multiDimensionalCharts.scatterplot_radius;
        throw "bubbleRadius"
      }
    }

    catch (err) {
      that.k.warningHandling(err,"1");
    }

    if(that.stop){
      return;
    }
    that.k.storeInitialDivHeight();
    if(that.mode === "default") {
      that.k.loading();
    }

    var multiDimensionalCharts = theme.multiDimensionalCharts,
    stylesheet = theme.stylesheet;

    that.multiD = new PykCharts.multiD.configuration(that);
    that.scatterplot_pointer_enable =  options.scatterplot_pointer_enable ? options.scatterplot_pointer_enable.toLowerCase() : multiDimensionalCharts.scatterplot_pointer_enable;
    that.zoomed_out = true;

    if(PykCharts['boolean'](that.panels_enable)) {
      that.radius_range = [that.k.__proto__._radiusCalculation(1.1)*2,that.k.__proto__._radiusCalculation(2.6)*2];
    } else {
      that.radius_range = [that.k.__proto__._radiusCalculation(4.5)*2,that.k.__proto__._radiusCalculation(11)*2];
    }

    that.executeData = function (data) {
      var validate = that.k.validator().validatingJSON(data),
      id = that.selector.substring(1,that.selector.length);
      if(that.stop || validate === false) {
        that.k.remove_loading_bar(id);
        return;
      }

      that.data = that.k.__proto__._groupBy("scatterplot",data);
      that.axis_y_data_format = that.k.yAxisDataFormatIdentification(that.data);
      that.axis_x_data_format = that.k.xAxisDataFormatIdentification(that.data);
      if(that.axis_x_data_format === "time" && that.axis_x_time_value_datatype === "") {
        console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to have passed Date data so please pass the value for axis_x_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
      }
      if(that.axis_y_data_format === "time" && that.axis_y_time_value_datatype === "") {
        console.warn('%c[Warning - Pykih Charts] ', 'color: #F8C325;font-weight:bold;font-size:14px', " at "+that.selector+".(\""+"You seem to have passed Date data so please pass the value for axis_x_time_value_datatype"+"\")  Visit www.chartstore.io/docs#warning_"+"15");
      }
      that.compare_data = that.k.__proto__._groupBy("scatterplot",data);
      that.k.remove_loading_bar(id);
      var a = new PykCharts.multiD.scatterplotFunctions(options,that,"scatterplot");
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

PykCharts.multiD.pulse = function (options) {
  var that = this;
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

PykCharts.multiD.scatterplotFunctions = function (options,chartObject,type) {
  var that = chartObject;
  that.refresh = function (pykquery_data) {
    that.executeRefresh = function (data) {
      that.data = that.k.__proto__._groupBy("scatterplot",data);
      that.refresh_data = that.k.__proto__._groupBy("scatterplot",data);
      var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
      that.compare_data = compare[0];
      var data_changed = compare[1];

      that.uniq_group_arr = that.k.__proto__._unique(that.data.map(function (d) {
        return d.group;
      }));

      if(data_changed) {
        that.k.lastUpdatedAt("liveData");
      }
      that.map_group_data = that.multiD.mapGroup(that.data);
      if(that.axis_x_data_format === "time") {
        that.data.forEach(function (d) {
          d.x = that.k.dateConversion(d.x);
        });
      }
      if(!PykCharts['boolean'](that.panels_enable)) {
        that.new_data = that.data;
        that.optionalFeatures()
        .createChart()
        .legends()
        .plotCircle()
        .ticks();
        if(type === "scatterplot") {
          that.optionalFeatures().label();
        }
      } else if(PykCharts['boolean'](that.panels_enable) && type === "scatterplot") {
        document.querySelector(that.selector + " #panels_of_scatter_main_div").innerHTML = null;
        that.renderChart();
      }
      that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
      .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
    };
    if (PykCharts.boolean(options.interactive_enable)) {
        that.k.dataFromPykQuery(pykquery_data);
        that.k.dataSourceFormatIdentification(that.data,that,"executeRefresh");
    } else {
        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
    }   
  };

  this.render = function () {
    var id = that.selector.substring(1,that.selector.length);
    that.container_id = id + "_svg";
    that.map_group_data = that.multiD.mapGroup(that.data);
    that.fillChart = new PykCharts.Configuration.fillChart(that);
    that.transitions = new PykCharts.Configuration.transition(that);

    that.border = new PykCharts.Configuration.border(that);
    that.uniq_group_arr = that.k.__proto__._unique(that.data.map(function (d) {
      return d.group;
    }));


    that.no_of_groups = 1;

    if(PykCharts["boolean"](that.panels_enable)) {
      var width= that.k._getHighestParentsAttribute(that.selector,"width");
      if(width) {
          total_width = width;
      } else {
          total_width = d3.select("body").style("width");
      }
      that.no_of_containers_in_row = Math.floor(parseInt(total_width)/that.chart_width);
      if(that.no_of_containers_in_row > that.uniq_group_arr.length) {
        that.no_of_containers_in_row = that.uniq_group_arr.length;
      }
      that.new_width = that.no_of_containers_in_row*that.chart_width;
    }

    if(that.axis_x_data_format === "time") {
      that.data.forEach(function (d) {
        d.x = that.k.dateConversion(d.x);
      });
    }
    if(that.mode === "default") {
      if(PykCharts['boolean'](that.panels_enable) && type === "scatterplot") {
        that.w = that.chart_width;
        that.chart_height = that.chart_height;
        that.chart_margin_left = that.chart_margin_left;
        that.chart_margin_right = that.chart_margin_right;

        that.k.title(that.new_width)
        .backgroundColor(that)
        .export(that,that.container_id,type,that.panels_enable,that.uniq_group_arr,that.new_width)
        .emptyDiv(options.selector)
        .subtitle(that.new_width);

        d3.select(that.selector).append("div")
        .attr("id","panels_of_scatter_main_div");
        that.renderChart();
        that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
        .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
        .xAxisTitle(that.xGroup,that.legendsGroup_height,that.legendsGroup_width)
        .yAxisTitle(that.yGroup);

      } else {
        that.k.title()
        .backgroundColor(that)
        .export(that,"#"+that.container_id+"0",type)
        .emptyDiv(options.selector)
        .subtitle();

        that.w = that.chart_width;
        that.chart_height = that.chart_height;
        that.new_data = that.data;
        that.k.makeMainDiv(that.selector,0);

        that.optionalFeatures()
        .svgContainer(0)
        .legendsContainer(0);

        that.k.liveData(that)
        .tooltip();

        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range);

        that.optionalFeatures()
        .legends()
        .createGroups(0)
        .createChart()
        .ticks();

        if(type === "scatterplot") {
          that.optionalFeatures().label();
        }
        that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
        .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
        .xAxisTitle(that.xGroup,that.legendsGroup_height,that.legendsGroup_width)
        .yAxisTitle(that.yGroup);
        that.k.exportSVG(that,"#"+that.container_id+"0",type)
      }

      that.k.createFooter(that.new_width)
      .lastUpdatedAt()
      .credits()
      .dataSource();

    } else if (that.mode === "infographics") {
      if(PykCharts['boolean'](that.panels_enable) && type === "scatterplot") {
        that.k.backgroundColor(that)
          .export(that,that.container_id,type,that.panels_enable,that.uniq_group_arr,that.new_width)
          .emptyDiv(options.selector);

        that.no_of_groups = that.uniq_group_arr.length;
        that.data_length = that.data.length;
        that.w = that.chart_width;
        that.chart_height = that.chart_height;
        that.chart_margin_left = that.chart_margin_left;
        that.chart_margin_right = that.chart_margin_right;

        for(var i=0;i<that.no_of_groups;i++){
          that.new_data = [];
          for(var j=0;j<that.data_length;j++) {
            if(that.data[j].group === that.uniq_group_arr[i]) {
              that.new_data.push(that.data[j]);
            }
          }
          that.k.makeMainDiv(that.selector,i);

          that.optionalFeatures()
          .svgContainer(i)
          .legendsContainer(i);

          that.k.tooltip();

          that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
          that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range);
          that.optionalFeatures()
          .legends(i)
          .createGroups(i)
          .createChart()
          .label()
          .ticks();

          that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
          .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
          .xAxisTitle(that.xGroup,that.legendsGroup_height,that.legendsGroup_width)
          .yAxisTitle(that.yGroup);

          // if((i+1)%4 === 0 && i !== 0) {
          //   that.k.emptyDiv(options.selector);
          // }
        }
        that.k.exportSVG(that,that.container_id,type,that.panels_enable,that.uniq_group_arr)
        that.k.emptyDiv(options.selector);
      } else {

        that.k.backgroundColor(that)
        .export(that,"#"+that.container_id+"0",type)
        .emptyDiv(options.selector);

        that.w = that.chart_width;
        that.new_data = that.data;
        that.k.makeMainDiv(that.selector,0);

        that.optionalFeatures()
        .svgContainer(0)
        .legendsContainer(0);

        that.k.liveData(that)
        .tooltip();

        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range);

        that.optionalFeatures()
        .legends()
        .createGroups(0)
        .createChart()
        .ticks();

        if(type === "scatterplot") {
          that.optionalFeatures().label();
        }

        that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
        .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
        .xAxisTitle(that.xGroup,that.legendsGroup_height,that.legendsGroup_width)
        .yAxisTitle(that.yGroup);

        that.k.exportSVG(that,"#"+that.container_id+"0",type);
      }
    }

    if(!PykCharts['boolean'](that.panels_enable)) {
      var resize = that.k.resize(that.svgContainer);
      that.k.__proto__._ready(resize);
      window.addEventListener('resize', function(event){
        return that.k.resize(that.svgContainer);
      });
    } else {
      var resize = that.k.resize(undefined,that.new_width);
      that.k.__proto__._ready(resize);
      window.addEventListener('resize', function(event){
        return that.k.resize(undefined,that.new_width);
      });
    }
  };

  that.optionalFeatures = function () {
    var id = that.selector.substring(1,that.selector.length);
    var optional = {
      svgContainer :function (i) {
        document.querySelector(that.selector + " #tooltip-svg-container-" + i).style.width = that.w;
        document.getElementById(id).className += " PykCharts-weighted";
        that.svgContainer = d3.select(that.selector + " #tooltip-svg-container-" + i)
        .append('svg')
        .attr({
          "width": that.w,
          "height": that.chart_height,
          "preserveAspectRatio": "xMinYMin",
          "viewBox": "0 0 " + that.w + " " + that.chart_height,
          "id": that.container_id+ "" + i,
          "class": "svgcontainer"
        });

        return this;
      },
      createGroups : function (i) {
        that.group = that.svgContainer.append("g")
        .attr({
          "transform": "translate("+(that.chart_margin_left)+","+(that.chart_margin_top+that.legendsGroup_height)+")",
          "id": "main"
        });

        that.ticksElement = that.svgContainer.append("g")
        .attr({
          "transform": "translate("+(that.chart_margin_left)+","+(that.chart_margin_top + that.legendsGroup_height)+")",
          "id": "main2"
        });

        if(PykCharts['boolean'](that.axis_x_enable) || that.axis_x_title) {
          that.xGroup = that.group.append("g")
          .attr({
            "class": "x axis",
            "id": "xaxis"
          })
          .style("stroke","black");
        }

        if(PykCharts['boolean'](that.axis_y_enable) || that.axis_y_title){
          that.yGroup = that.group.append("g")
          .attr({
            "class": "y axis",
            "id": "yaxis"
          })
          .style("stroke","blue");
        }

        that.clip = that.group.append("svg:clipPath")
        .attr("id", "clip" + i + that.selector)
        .append("svg:rect")
        .attr({
          "width": (that.w-that.chart_margin_left-that.chart_margin_right-that.legendsGroup_width),
          "height": that.chart_height-that.chart_margin_top-that.chart_margin_bottom - that.legendsGroup_height
        });

        that.chartBody = that.group.append("g")
        .attr({
          "id": "clip"+i,
          "clip-path": "url(#clip" + i + that.selector +")"
        });

        return this;
      },
      legendsContainer : function (i) {

        if (PykCharts['boolean'](that.legends_enable) && that.map_group_data[1] && that.mode === "default") {
          that.legendsGroup = that.svgContainer.append("g")
          .attr('id',"scatterplot-legends")
          .style("visibility","visible");
        } else {
          that.legendsGroup_width = 0;
          that.legendsGroup_height = 0;
        }

        return this;
      },
      createChart : function (index) {
        that.weight = that.new_data.map(function (d) {
          return d.weight;
        });
        var weight_length = that.weight.length,
        rejected_result = [];
        for(var i=0 ; i<weight_length ; i++) {
          if(that.weight[i] !== 0) {
            rejected_result.push(that.weight[i]);
          }
        }
        that.weight = rejected_result;

        that.sorted_weight = that.weight.slice(0);
        that.sorted_weight.sort(function(a,b) { return a-b; });

        that.x_tick_values = that.k.processXAxisTickValues();
        that.y_tick_values = that.k.processYAxisTickValues();

        that.group.append("text")
        .attr({
          "fill": "black",
          "text-anchor": "end",
          "x": that.w - 70,
          "y": that.chart_height + 40
        });

        if(that.zoomed_out === true) {

          var x_domain,x_data = [],y_data = [],y_range,x_range,y_domain, min_x_tick_value,max_x_tick_value, min_y_tick_value,max_y_tick_value;

          if(that.axis_y_data_format === "number") {
            y_domain = d3.extent(that.data, function(d) { return parseFloat(d.y) });
            y_data = that.k.__proto__._domainBandwidth(y_domain,2,"number");
            y_range = [that.chart_height - that.chart_margin_top - that.chart_margin_bottom - that.legendsGroup_height, 0];

            min_y_tick_value = d3.min(that.y_tick_values);
            max_y_tick_value = d3.max(that.y_tick_values);

            if(y_data[0] > min_y_tick_value) {
              y_data[0] = min_y_tick_value;
            }
            if(y_data[1] < max_y_tick_value) {
              y_data[1] = max_y_tick_value;
            }

            that.yScale = that.k.scaleIdentification("linear",y_data,y_range);
            that.extra_top_margin = 0;

          } else if(that.axis_y_data_format === "string") {
            that.data.forEach(function(d) { y_data.push(d.y); });
            y_range = [0,that.chart_height - that.chart_margin_top - that.chart_margin_bottom - that.legendsGroup_height];
            that.yScale = that.k.scaleIdentification("ordinal",y_data,y_range,0);
            that.extra_top_margin = (that.yScale.rangeBand() / 2);
          } else if (that.axis_y_data_format === "time") {
            y_data = d3.extent(that.data, function (d) { return new Date(d.x); });

            min_y_tick_value = d3.min(that.y_tick_values, function (d) {
              return new Date(d);
            });

            max_y_tick_value = d3.max(that.y_tick_values, function (d) {
              return new Date(d);
            });

            if(new Date(y_data[0]) > new Date(min_y_tick_value)) {
              y_data[0] = min_y_tick_value;
            }
            if(new Date(y_data[1]) < new Date(max_y_tick_value)) {
              y_data[1] = max__tick_value;
            }

            y_range = [that.chart_height - that.chart_margin_top - that.chart_margin_bottom - that.legendsGroup_height, 0];
            that.yScale = that.k.scaleIdentification("time",y_data,y_range);
            that.extra_top_margin = 0;
          }
          if(that.axis_x_data_format === "number") {
            x_domain = d3.extent(that.data, function(d) { return parseFloat(d.x); });
            x_data = that.k.__proto__._domainBandwidth(x_domain,2);

            min_x_tick_value = d3.min(that.x_tick_values);
            max_x_tick_value = d3.max(that.x_tick_values);

            if(x_data[0] > min_x_tick_value) {
              x_data[0] = min_x_tick_value;
            }
            if(x_data[1] < max_x_tick_value) {
              x_data[1] = max_x_tick_value;
            }

            x_range = [0 ,that.w - that.chart_margin_left - that.chart_margin_right - that.legendsGroup_width];
            that.x = that.k.scaleIdentification("linear",x_data,x_range);
            that.extra_left_margin = 0;

          } else if(that.axis_x_data_format === "string") {
            that.data.forEach(function(d) { x_data.push(d.x); });
            x_range = [0 ,that.w - that.chart_margin_left - that.chart_margin_right - that.legendsGroup_width];
            that.x = that.k.scaleIdentification("ordinal",x_data,x_range,0);
            that.extra_left_margin = (that.x.rangeBand()/2);

          } else if (that.axis_x_data_format === "time") {

            max = d3.max(that.data, function(k) { return k.x; });
            min = d3.min(that.data, function(k) { return k.x; });
            x_domain = [min.getTime(),max.getTime()];
            x_data = that.k.__proto__._domainBandwidth(x_domain,2,"time");

            min_x_tick_value = d3.min(that.x_tick_values, function (d) {
              return that.k.dateConversion(d);
            });

            max_x_tick_value = d3.max(that.x_tick_values, function (d) {
              return that.k.dateConversion(d);
            });

            if(x_data[0] > min_x_tick_value) {
              x_data[0] = min_x_tick_value;
            }
            if(x_data[1] < max_x_tick_value) {
              x_data[1] = max_x_tick_value;
            }

            x_range = [0 ,that.w - that.chart_margin_left - that.chart_margin_right];
            that.x = that.k.scaleIdentification("time",x_data,x_range);

            that.extra_left_margin = 0;
          }

          that.xdomain = that.x.domain();
          that.ydomain = that.yScale.domain();
          that.x1 = 1;
          that.y1 = 12;
          that.count = 1;
          if(type!== "pulse") {
            var zoom = d3.behavior.zoom()
            .scale(that.count)
            .x(that.x)
            .y(that.yScale)
            .on("zoom",zoomed);
          }


          if(PykCharts['boolean'](that.zoom_enable) && !(that.axis_y_data_format==="string" || that.axis_x_data_format==="string") && (that.mode === "default") ) {
            var n;
            if(PykCharts['boolean'](that.panels_enable)) {
              n = that.no_of_groups;
            } else {
              n = 1;
            }

            for(var i = 0; i < that.no_of_groups; i++) {
              d3.select(that.selector+ " #"+that.container_id+""+i)
              .call(zoom)

              d3.select(that.selector+ " #"+that.container_id+""+i)
              .on({
                "wheel.zoom": null,
                "mousewheel.zoom": null
              });
            }
          }
          that.optionalFeatures().plotCircle(index);
        }
        return this ;
      },
      legends : function (index) {
        if (PykCharts['boolean'](that.legends_enable) && that.map_group_data[1] && that.mode==="default") {
          that.multiD.legendsPosition(that,"scatter",that.map_group_data[0],undefined,index);
        }
        return this;
      },
      ticks : function () {
        if(PykCharts['boolean'](that.scatterplot_pointer_enable)) {
          var tick_label = that.ticksElement.selectAll(".ticks_label")
          .data(that.new_data);

          tick_label.enter()
          .append("text")

          tick_label.attr({
            "class": "ticks_label",
            "x": function (d) {
              return that.x(d.x);
            },
            "y": function (d) {
              return that.yScale(d.y) ;
            },
            "pointer-events": "none",
            "dx": -1,
            "dy": function (d) { return -that.sizes(d.weight)-4; }
          })
          .style({
            "text-anchor": "middle",
            "font-family": that.label_family,
            "font-size": that.label_size + "px"
          })
          .text("");
          function setTimeoutTicks() {
            tick_label.text(function (d) {return d.name; });
          }
          setTimeout(setTimeoutTicks,that.transitions.duration());

          tick_label.exit().remove();
        }
        return this;
      },
      plotCircle : function () {
        that.circlePlot = that.chartBody.selectAll(".scatterplot-dot")
        .data(that.new_data)

        that.circlePlot.enter()
        .append("circle")
        .attr("class", "scatterplot-dot");

        that.circlePlot
        .attr({
          "r": 0,
          "cx": function (d) { return (that.x(d.x)+that.extra_left_margin); },
          "cy": function (d) { return (that.yScale(d.y)+that.extra_top_margin); },
          "fill": function (d) { return that.fillChart.colorPieW(d); },
          "fill-opacity": function (d) { return that.multiD.opacity(d.weight,that.weight,that.data); },
          "data-fill-opacity": function (d) {
            return d3.select(this).attr("fill-opacity");
          },
          "data-id":function(d){
            return d.x;
          },
          "stroke": that.border.color(),
          "stroke-width": that.border.width(),
          "stroke-dasharray": that.border.style(),
          "stroke-opacity": 1
        })
        .on({
          'mouseover': function (d) {
            if(that.mode === "default") {
              if (PykCharts['boolean'](options.tooltip_enable)) {
                tooltipText = d.tooltip ? d.tooltip : "<table><thead><th colspan='2'><b>"+d.name+"</b></th></thead><tr><td>X</td><td><b>"+d.x+"</b></td></tr><tr><td>Y</td><td><b>"+d.y+"<b></td></tr><tr><td>Weight</td><td><b>"+d.weight+"</b></td></tr></table>";
                that.mouseEvent.tooltipPosition(d);
                that.mouseEvent.tooltipTextShow(tooltipText);
              }
              if (PykCharts['boolean'](that.chart_onhover_highlight_enable)) {
                that.mouseEvent.highlight(that.selector + " .scatterplot-dot", this);
              }
            }
          },
          'mouseout': function (d) {
            if (that.mode === "default") {
              if (PykCharts['boolean'](options.tooltip_enable)) {
                that.mouseEvent.tooltipHide(d);
              }
              if (PykCharts['boolean'](that.chart_onhover_highlight_enable)) {
                that.mouseEvent.highlightHide(that.selector + " .scatterplot-dot");
              }
            }
          },
          'mousemove': function (d) {
            if (that.mode === "default" && PykCharts['boolean'](options.tooltip_enable)) {
              that.mouseEvent.tooltipPosition(d);
            }
          },
          "dblclick": function() {
            PykCharts.getEvent().stopPropagation();
          },
          "mousedown": function() {
            PykCharts.getEvent().stopPropagation();
          },
          'click': function (d,i) {
              if(PykCharts['boolean'](options.click_enable)){
                 that.addEvents(d.x, d3.select(this).attr("data-id")); 
              }                     
          }
        })
        .transition()
        .duration(that.transitions.duration())
        .attr("r", function (d) { return that.sizes(d.weight); });

        that.circlePlot.exit().remove();
        return this;
      },
      label : function () {
        if(PykCharts['boolean'](that.label_size)) {

          that.circleLabel = that.chartBody.selectAll(".scatterplot-label")
          .data(that.new_data);

          that.circleLabel.enter()
          .append("text")

          that.circleLabel.attr("class","scatterplot-label")
          .text("");

          function setTimeOut() {
            that.circleLabel.attr({
              "x": function (d) { return (that.x(d.x)+that.extra_left_margin); },
              "y": function (d) { return (that.yScale(d.y)+that.extra_top_margin + 5); },
              "text-anchor": "middle",
              "pointer-events": "none",
              "fill": that.label_color
            })
            .style({
              "font-weight": that.label_weight,
              "font-size": that.label_size + "px",
              "font-family": that.label_family
            })
            .text(function (d) {
              return d.weight;
            })
            .text(function (d) {
              if((this.getBBox().width < (that.sizes(d.weight) * 2)) && (this.getBBox().height < (that.sizes(d.weight) * 2))) {
                return d.weight;
              } else {
                return "";
              }
            });
          }
          setTimeout(setTimeOut,that.transitions.duration());

          that.circleLabel.exit()
          .remove();
        }
        return this;
      },
    };
    return optional;
  };

  function zoomed () {
    that.zoomed_out = false;

    var radius;

    var n = (PykCharts['boolean'](that.panels_enable)) ? that.no_of_groups : 1;
    for(var i = 0; i < n; i++) {
      var current_container = d3.select(that.selector+" #"+that.container_id+""+ i);
      that.k.isOrdinal(current_container,".x.axis",that.x);
      that.k.isOrdinal(current_container,".y.axis",that.yScale);

      that.optionalFeatures().plotCircle()
      .label()
      .ticks();
      d3.select(that.selector+" #"+that.container_id+""+ i)
      .selectAll(".scatterplot-dot")
      .attr({
        "r": function (d) {
          radius = that.sizes(d.weight)*PykCharts.getEvent().scale;
          return radius;
        },
        "cx": function (d) { return (that.x(d.x)+that.extra_left_margin); },
        "cy": function (d) { return (that.yScale(d.y)+that.extra_top_margin); }
      });

      d3.select(that.selector+" #"+that.container_id+""+ i)
      .selectAll(".scatterplot-label")
      .attr({
        "x": function (d) { return (that.x(d.x)+that.extra_left_margin); },
        "y": function (d) { return (that.yScale(d.y)+that.extra_top_margin + 5); }
      })
      .style("font-size", that.label_size +"px");
      d3.select(that.selector+" #"+that.container_id+""+ i)
      .selectAll(".tick_label")
      .attr({
        "x": function (d) {
          return that.x(d.x);
        },
        "y": function (d) {
          return that.yScale(d.y) - radius;
        }
      });
    }
    if(PykCharts.getEvent().sourceEvent.type === "dblclick") {
      that.count++;
    }
    if(that.count === that.zoom_level+1) {
      for(var i = 0; i < n; i++) {
        if(that.panels_enable==="yes"){
          that.new_data = [];
          for(var j=0;j<that.data_length;j++) {
            if(that.data[j].group === that.uniq_group_arr[i]) {
              that.new_data.push(that.data[j]);
            }
          }
        } else {
          that.new_data = that.data;
        }
        d3.select(that.selector+" #"+that.container_id+""+ i)
        .call(function () {
          return that.zoomOut(i);
        });
        that.count = 1;
      }
    }
  };

  that.zoomOut=function (i) {
    that.zoomed_out = true;
    that.x1 = 1;
    that.y1 = 12;

    that.optionalFeatures().createChart(i)
    .label()
    .ticks();
    var currentSvg = d3.select(that.selector + " #"+that.container_id+""+ i),
    current_x_axis = currentSvg.select("#xaxis"),
    current_y_axis = currentSvg.select("#yaxis");
    that.k.xAxis(currentSvg,current_x_axis,that.x,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
    .yAxis(currentSvg,current_y_axis,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width);

    d3.select(that.selector+" #"+that.container_id+""+i)
    .selectAll(".scatterplot-dot")
    .attr({
      "r": function (d) {
        return that.sizes(d.weight);
      },
      "cx": function (d) { return (that.x(d.x)+that.extra_left_margin); },
      "cy": function (d) { return (that.yScale(d.y)+that.extra_top_margin); }
    });

    d3.select(that.selector+" #"+that.container_id+""+ i)
    .selectAll(".scatterplot-label")
    .style("font-size", that.label_size + "px")
    .attr({
      "x": function (d) { return (that.x(d.x)+that.extra_left_margin); },
      "y": function (d) { return (that.yScale(d.y)+that.extra_top_margin + 5); }
    });
  }

  that.renderChart =  function () {
    that.no_of_groups = that.uniq_group_arr.length;
    that.data_length = that.data.length;
    for(var i=0;i<that.no_of_groups;i++){
      that.new_data = [];
      for(var j=0;j<that.data_length;j++) {
        if(that.data[j].group === that.uniq_group_arr[i]) {
          that.new_data.push(that.data[j]);
        }
      }
      that.k.makeMainDiv((that.selector + " #panels_of_scatter_main_div"),i);
      that.optionalFeatures()
      .svgContainer(i)
      .legendsContainer(i);

      that.k.liveData(that)
      .tooltip();

      that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
      that.sizes = new PykCharts.multiD.bubbleSizeCalculation(that,that.data,that.radius_range);
      that.optionalFeatures()
      .legends(i)
      .createGroups(i)
      .createChart()
      .label()
      .ticks();

      // if((i+1)%4 === 0 && i !== 0) {
      //   that.k.emptyDiv("#panels_of_scatter_main_div");
      // }
      that.k.xAxis(that.svgContainer,that.xGroup,that.x,that.extra_left_margin,that.xdomain,that.x_tick_values,that.legendsGroup_height)
      .yAxis(that.svgContainer,that.yGroup,that.yScale,that.ydomain,that.y_tick_values,that.legendsGroup_width)
      .xAxisTitle(that.xGroup,that.legendsGroup_height,that.legendsGroup_width)
      .yAxisTitle(that.yGroup);

    }
    that.k.exportSVG(that,that.container_id,type,that.panels_enable,that.uniq_group_arr);
    that.k.emptyDiv(options.selector);
  };
};
