$(document).ready( function() {
  autoPlayYouTubeModal();
  $("#download_pykcharts_link").click(function(){
    var email_id = $("#email").val()
    , link_with_email_param = "";
    if ( !validateEmailId(email_id) ){
      generate_notify({text: "Please enter a valid email address.", notify: "error"});
      return false;
    }
    setTimeout(function () { $("#email").val(""); } , 100);
  });

  window.PykChartsInit = function (e) {
    d3.csv("https://s3-ap-southeast-1.amazonaws.com/chartstore.io-data/pie.csv", function (data) {
      var k = new PykCharts.oneD.pie({
        selector: "#pie_container",
        data: data,
        chart_width: 160,
        chart_height: 135,
        label_size: 0,
        pointer_size: 0,
        pointer_thickness: 0,
        pie_radius_percent: 100,
        export_enable: "no"
      });
      k.execute();

      var k = new PykCharts.oneD.donut({
        selector: "#donut_container",
        data: data,
        chart_width: 160,
        chart_height: 135,
        label_size: 0,
        pointer_size: 0,
        pointer_thickness: 0,
        "donut_radius_percent": 100,
        "donut_inner_radius_percent": 55,
        "donut_show_total_at_center": "no",
        export_enable: "no"
      });
      k.execute();

      var k = new PykCharts.oneD.electionDonut({
        selector: "#election-donut_container",
        data: data,
        chart_width: 160,
        chart_height: 135,
        label_size: 0,
        pointer_size: 0,
        pointer_thickness: 0,
        "donut_radius_percent": 100,
        "donut_inner_radius_percent": 55,
        "donut_show_total_at_center": "no",
        export_enable: "no"
      });
      k.execute();

      var k = new PykCharts.oneD.electionPie({
        selector: "#election-pie_container",
        data: data,
        chart_width: 160,
        chart_height: 135,
        label_size: 0,
        pointer_size: 0,
        pointer_thickness: 0,
        pie_radius_percent: 100,
        export_enable: "no"
      });
      k.execute();

      var k = new PykCharts.oneD.bubble({
        selector: "#bubble_container",
        data: data,
        chart_width: 160,
        chart_height: 135,
        label_size: 0,
        export_enable: "no"
      });
      k.execute();

      var k = new PykCharts.oneD.funnel({
        selector: "#funnel_container",
        data: data,
        chart_width: 160,
        chart_height: 135,
        label_size: 0,
        pointer_size: 0,
        pointer_thickness: 0,
        "funnel_rect_height": 35,
        "funnel_rect_width": 40,
        export_enable: "no"
      });
      k.execute();

      var k = new PykCharts.oneD.pyramid({
        selector: "#pyramid_container",
        data: data,
        chart_width: 160,
        chart_height: 135,
        label_size: 0,
        pointer_size: 0,
        pointer_thickness: 0,
        export_enable: "no"
      });
      k.execute();

      var k = new PykCharts.oneD.percentageBar({
        selector: "#percentage-bar_container",
        data: data,
        chart_width: 160,
        chart_height: 135,
        percent_row_rect_height: 25,
        label_size: 0,
        pointer_size: 0,
        pointer_thickness: 0,
        export_enable: "no"
      });
      k.execute();

      var k = new PykCharts.oneD.percentageColumn({
        selector: "#percentage-column_container",
        data: data,
        chart_width: 160,
        chart_height: 135,
        percent_column_rect_width: 25,
        label_size: 0,
        pointer_size: 0,
        pointer_thickness: 0,
        export_enable: "no"
      });
      k.execute();

      var k = new PykCharts.oneD.treemap({
        selector: "#percentage-rectangle_container",
        data: data,
        chart_width: 160,
        chart_height: 135,
        label_size: 0,
        pointer_size: 0,
        pointer_thickness: 0,
        export_enable: "no"
      });
      k.execute();
    });

    var k = new PykCharts.multiD.bar({
      selector: "#bar_container",
      data: "https://s3-ap-southeast-1.amazonaws.com/chartstore.io-data/bar.csv",
      chart_width: 300,
      chart_height: 251,
      chart_margin_top: 0,
      chart_margin_right: 0,
      chart_margin_bottom: 0,
      chart_margin_left: 0,
      pointer_size: 0,
      pointer_thickness: 0,
      "axis_x_enable": "no",
      "axis_y_enable": "no",
      "data_sort_enable": "yes",
      "data_sort_type": "numerically",
      "data_sort_order": "descending",
      export_enable: "no"
    });
    k.execute();

    var k = new PykCharts.multiD.groupedBar({
      selector: "#grouped_bar_container",
      data: "https://s3-ap-southeast-1.amazonaws.com/chartstore.io-data/grouped-bar.csv",
      chart_color: ["#B0E2FF","#60AFFE",,"#3A5FCD"],
      chart_width: 400,
      chart_height: 335,
      chart_margin_top: 0,
      chart_margin_right: 0,
      chart_margin_bottom: 0,
      chart_margin_left: 0,
      pointer_size: 0,
      pointer_thickness: 0,
      "axis_x_enable": "no",
      "axis_y_enable": "no",
      "legends_enable": "no",
      export_enable: "no"
    });
    k.execute();

    var k = new PykCharts.multiD.column({
      selector: "#column_container",
      data: "https://s3-ap-southeast-1.amazonaws.com/chartstore.io-data/column.csv",
      chart_width: 300,
      chart_height: 300,
      chart_margin_top: 0,
      chart_margin_right: 0,
      chart_margin_bottom: 0,
      chart_margin_left: 0,
      pointer_size: 0,
      pointer_thickness: 0,
      "axis_x_enable": "no",
      "axis_y_enable": "no",
      chart_grid_x_enable: "no",
      chart_grid_y_enable: "no",
      export_enable: "no"
    });
    k.execute();

    var k = new PykCharts.multiD.groupedColumn({
      selector: "#grouped_column_container",
      data: "https://s3-ap-southeast-1.amazonaws.com/chartstore.io-data/grouped-column.csv",
      chart_color: [,"#60AFFE","#3A5FCD"],
      chart_width: 400,
      chart_height: 400,
      chart_margin_top: 0,
      chart_margin_right: 0,
      chart_margin_bottom: 0,
      chart_margin_left: 0,
      pointer_size: 0,
      pointer_thickness: 0,
      "axis_x_enable": "no",
      "axis_y_enable": "no",
      "legends_enable": "no",
      chart_grid_x_enable: "no",
      chart_grid_y_enable: "no",
      export_enable: "no"
    });
    k.execute();

    var k = new PykCharts.multiD.scatter({
      selector: "#scatterplot_container",
      data: "https://s3-ap-southeast-1.amazonaws.com/chartstore.io-data/scatter.csv",
      chart_color: ["#B0E2FF","#00BFFF","#0147FA","#0198E1","#2C5197"],
      chart_width: 400,
      chart_height: 380,
      chart_margin_top: 0,
      chart_margin_right: 0,
      chart_margin_bottom: 0,
      chart_margin_left: 0,
      pointer_size: 0,
      pointer_thickness: 0,
      "axis_x_enable": "no",
      "axis_y_enable": "no",
      "legends_enable": "no",
      variable_circle_size_enable : "no",
      label_size: 0,
      scatterplot_radius: 20,
      chart_grid_x_enable: "no",
      chart_grid_y_enable: "no",
      export_enable: "no"
    });
    k.execute();

    var k = new PykCharts.multiD.panelsOfScatter({
      selector: "#panels_of_scatter_container",
      data: "https://s3-ap-southeast-1.amazonaws.com/chartstore.io-data/panel-of-scatters.csv",
      chart_color: ["#B0E2FF","#00BFFF","#0147FA","#0198E1","#2C5197"],
      border_between_chart_elements_thickness: 0,
      chart_width: 150,
      chart_height: 130,
      chart_margin_top: 5,
      chart_margin_right: 10,
      chart_margin_bottom: 10,
      chart_margin_left: 10,
      pointer_size: 0,
      pointer_thickness: 0,
      axis_x_line_color: "lightgray",
      axis_y_line_color: "lightgray",
      axis_x_pointer_size: 0,
      axis_y_pointer_size: 0,
      axis_x_pointer_length: 0,
      axis_y_pointer_length: 0,
      // "axis_x_enable": "no",
      // "axis_y_enable": "no",
      "legends_enable": "no",
      // variable_circle_size_enable : "no",
      label_size: 0,
      // scatterplot_radius: 10,
      chart_grid_x_enable: "no",
      chart_grid_y_enable: "no",
      export_enable: "no"
    });
    k.execute();

    var k = new PykCharts.multiD.pulse({
      selector: "#pulse_container",
      data: "https://s3-ap-southeast-1.amazonaws.com/chartstore.io-data/circle-comparison.csv",
      chart_width: 400,
      chart_height: 380,
      chart_margin_top: 0,
      chart_margin_right: 0,
      chart_margin_bottom: 0,
      chart_margin_left: 0,
      pointer_size: 0,
      pointer_thickness: 0,
      "axis_x_enable": "no",
      "axis_y_enable": "no",
      "legends_enable": "no",
      variable_circle_size_enable : "no",
      label_size: 0,
      scatterplot_radius: 15,
      legends_enable: "no",
      chart_grid_x_enable: "no",
      chart_grid_y_enable: "no",
      export_enable: "no"
    });
    k.execute();

    var k = new PykCharts.multiD.line({
      selector: "#line_container",
      data: "https://s3-ap-southeast-1.amazonaws.com/chartstore.io-data/line.csv",
      chart_width: 300,
      chart_height: 300,
      chart_margin_top: 0,
      chart_margin_right: 0,
      chart_margin_bottom: 0,
      chart_margin_left: 0,
      pointer_size: 0,
      pointer_thickness: 0,
      "axis_x_enable": "no",
      "axis_y_enable": "no",
      // chart_grid_x_enable: "no",
      // chart_grid_y_enable: "no",
      export_enable: "no"
    });
    k.execute();

    var k = new PykCharts.multiD.multiSeriesLine({
      selector: "#multi_series_line_container",
      data: "https://s3-ap-southeast-1.amazonaws.com/chartstore.io-data/multi-series-line.csv",
      chart_width: 300,
      chart_height: 300,
      chart_margin_top: 0,
      chart_margin_right: 0,
      chart_margin_bottom: 0,
      chart_margin_left: 0,
      pointer_size: 0,
      pointer_thickness: 0,
      "axis_x_enable": "no",
      "axis_y_enable": "no",
      // chart_grid_x_enable: "no",
      // chart_grid_y_enable: "no",
      export_enable: "no"
    });
    k.execute();

    var k = new PykCharts.multiD.panelsOfLine({
      selector: "#panel_of_lines_container",
      data: "https://s3-ap-southeast-1.amazonaws.com/chartstore.io-data/panel-of-lines.csv",
      chart_width: 150, //170
      chart_height: 130, //150
      chart_margin_top: 5,
      chart_margin_right: 10,
      chart_margin_bottom: 10,
      chart_margin_left: 10,
      pointer_size: 0,
      pointer_thickness: 0,
      axis_x_line_color: "lightgray",
      axis_y_line_color: "lightgray",
      axis_x_pointer_size: 0,
      axis_y_pointer_size: 0,
      axis_x_pointer_length: 0,
      axis_y_pointer_length: 0,
      // "axis_x_enable": "no",
      // "axis_y_enable": "no",
      chart_grid_x_enable: "no",
      chart_grid_y_enable: "no",
      export_enable: "no"
    });
    k.execute();

    var k = new PykCharts.multiD.area({
      selector: "#area_container",
      data: "https://s3-ap-southeast-1.amazonaws.com/chartstore.io-data/area.csv",
      chart_width: 400,
      chart_height: 400,
      chart_margin_top: 0,
      chart_margin_right: 0,
      chart_margin_bottom: 0,
      chart_margin_left: 0,
      pointer_size: 0,
      pointer_thickness: 0,
      "axis_x_enable": "no",
      "axis_y_enable": "no",
      chart_grid_x_enable: "no",
      chart_grid_y_enable: "no",
      export_enable: "no"
    });
    k.execute();

    var k = new PykCharts.multiD.stackedArea({
      selector: "#stacked_area_container",
      data: "https://s3-ap-southeast-1.amazonaws.com/chartstore.io-data/stacked-area.csv",
      chart_width: 500,
      chart_height: 500,
      chart_margin_top: 0,
      chart_margin_right: 0,
      chart_margin_bottom: 0,
      chart_margin_left: 0,
      pointer_size: 0,
      pointer_thickness: 0,
      "axis_x_enable": "no",
      "axis_y_enable": "no",
      legends_enable: "no",
      chart_grid_x_enable: "no",
      chart_grid_y_enable: "no",
      export_enable: "no"
    });
    k.execute();

    var k = new PykCharts.multiD.spiderWeb({
      selector: "#spider_container",
      data: "https://s3-ap-southeast-1.amazonaws.com/chartstore.io-data/spider.csv",
      chart_color: ["#00BFFF","rgb(37, 90, 238)"],
      chart_width: 160,
      chart_height: 156,
      chart_margin_top: 0,
      chart_margin_right: 0,
      chart_margin_bottom: 0,
      chart_margin_left: 0,
      pointer_size: 0,
      pointer_thickness: 0,
      axis_x_pointer_size: 0,
      axis_y_pointer_size: 0,
      axis_x_pointer_length: 0,
      axis_y_pointer_length: 0,
      // "axis_x_enable": "no",
      // "axis_y_enable": "no",
      legends_enable: "no",
      "spiderweb_radius": 10,
      "spiderweb_outer_radius_percent" : 100,
      export_enable: "no"
    });
    k.execute();

    var k = new PykCharts.multiD.waterfall({
      selector: "#waterfall_container",
      data: "https://s3-ap-southeast-1.amazonaws.com/chartstore.io-data/waterfall.csv",
      chart_width: 200,
      chart_height: 190,
      chart_margin_top: 10,
      chart_margin_right: 0,
      chart_margin_bottom: 0,
      chart_margin_left: 0,
      pointer_size: 0,
      pointer_thickness: 0,
      "axis_x_enable": "no",
      "axis_y_enable": "no",
      label_size: 0,
      chart_color: ["grey","rgb(0, 185, 250)","#255AEE"],
      export_enable: "no"
    });
    k.execute();

    var k = new PykCharts.other.pictograph({
      selector: "#pictograph_container",
      data: "https://s3-ap-southeast-1.amazonaws.com/chartstore.io-data/pictograph.json",

      // optional,
      chart_width: 450,
      "pictograph_image_width": 100,
      "pictograph_image_height": 135,
      "pictograph_current_count_size": 70,
      "pictograph_total_count_size": 70,
      export_enable: "no"
    });
    k.execute();

    var resize = function () {
      var api_code_tags = $("code.xml"),
        json_input_data_code_tags = $("code.div-height-json"),
        csv_input_data_code_tags = $("code.div-height-csv"),
        nav_tab_height = parseInt($(".nav-smaller").css("height")),
        set_height = 0;
      for (var i=0, len=api_code_tags.length ; i<len ; i++) {
        set_height = parseInt($($("code.xml")[i]).css("height")) - nav_tab_height;
        $($("code.div-height-json")[i]).css("height", set_height+"px");
        $($("code.div-height-csv")[i]).css("height", set_height+"px");
      }
    }
    resize();
}
});

var validateEmailId = function (email_id) {
  var is_valid = false
  if( email_id && email_id !== "" && email_id.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) !== null) {
    is_valid = true;
  } else {
    is_valid = false;
  };
  return is_valid;
}
;
