$(document).ready(function(){

  setTimeout(function(){initClipBoard("#copy-link", "#config-object-display")},6000);

  function initClipBoard(selector,from) {
    $(selector).zclip({
      path:"/copy-to-clipboard/ZeroClipboard.swf",
      copy:function(){return $(from).text();}
    });
  }
  // var loadingOverlay = function () {
  //   var loading_overlay = document.createElement("div");
  //   loading_overlay.setAttribute("id", "chart-store-loading-overlay");
  //   document.body.appendChild(loading_overlay);
  //   var loading_text = document.createElement("div");
  //   loading_text.className = "chart-store-loading-text";
  //   loading_text.innerHTML = "Loading..";
  //   document.getElementById("chart-store-loading-overlay").appendChild(loading_text);
  //   $(document).ajaxStart(function(pe) {
  //     // console.log("ajax starts");
  //     loading_overlay.style.opacity = 1;
  //     loading_overlay.style.display = "block";
  //   });

  //   $(document).ajaxStop(function(pe) {
  //     // console.log("sti");
  //   loading_overlay.style.opacity = 0;
  //   setTimeout(function () {
  //       loading_overlay.style.display = "none";
  //     }, 250);
  //   });
  // }
  // loadingOverlay();

  var original_width;
  $('#jqeasypanel').jqEasyPanel();
  $('.color').colorpicker().on("hide",function (e,d) {
    if($(this).children()[1].checked){
      if ($(this).has(".execute3").length > 0) {
        if ($("#chart_color_boolean1").attr('checked') === "checked") {
          $('#chart_container').empty();
          var i = $(this).find(".execute3")[0].id
            , color_arr = [];
          var chart_color_checked = $('.execute3:checked');
          for (var j = 0; j<chart_color_checked.length; j++) {
            var color = $($(chart_color_checked[j])[0].previousElementSibling.childNodes[1]).css("background-color");
            color_arr.push(color);
          }
          obj[i] = color_arr;
          k[i] = color_arr;
          final_config[i] = color_arr;
          var b = new initializerFunction(obj);
          displayConfigs(final_config);
          // console.log("color picker");
          b.execute();
          setTimeout(function(){addConfigOptions()},800);
        }
      } else if ($(this).has(".execute1").length > 0) {
        if($(this).find(".execute1")[0].type == "radio"){
          $("#chart_container").empty();
          var i = $(this).find(".execute1")[0].id;
          if(i != "chart_color"){
            var color = $(this).find(".circle").css("background-color");
            obj[i]= color;
            k[this.id] = color;
            final_config[i] = color;
          }
          var b = new initializerFunction(obj);
          d3.selectAll(".pyk-tooltip").remove();
          resizeChartContainerDiv(original_width);
          displayConfigs(final_config);
          // console.log("color picker");
          b.execute();
          setTimeout(function(){addConfigOptions()},400);
        }
      }
    }
  })
  $("#zoom_enable").click(function(){
    if(this.checked){
      $("#zoom_level").attr("disabled",false)
    }
    else{
      $("#zoom_level").attr("disabled",true)
    }
  });
  $("#color_mode").change(function(){
    if(this.value == "color"){
      $("#color_group").show();
      $("#saturation_group").hide();
    }else{
      $("#color_group").hide();
      $("#saturation_group").show();
    }
  });
  if ($(".chart-description").html() == ""){
    $("#jqeasypanel.top").css("top",230)
    $("#jqeasytrigger.top").css("top",230)
  }

  setTimeout(function(){initClipBoard("#copy-link", "#config-object-display")},1000);

  function initClipBoard(selector,from) {
    $(selector).zclip({
      path:"/copy-to-clipboard/ZeroClipboard.swf",
      copy:function(){return $(from).text();}
    });
  }

});
window.PykChartsInit = function (e){
  current_config = {};
  var origonal_chart_color;
  // $.getJSON( "https://s3-ap-southeast-1.amazonaws.com/chartstore.io-data/chartstore_theme.json", function( data ) {
  $.getJSON( "data/chartstore_theme.json", function( data ) {
    json_data = data;
    if(chart_name.toLowerCase() === "river") {
      json_data[0].config["color_mode"] = "color";
      colorRepetation = '#255AEE;#AEC7E8;#FF7F0E;#98DF8A;#D62728';
    }
    if (genre == "One Dimensional Charts") {
      json_data[0].config["color_mode"] = "shade";
    }
    original_width = json_data[0].config["chart_width"];
    origonal_chart_color = json_data[0].config["chart_color"][0];
    // console.log(origonal_chart_color,"vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv")
    dataFinding(json_data,"Default");
    imageGeneration();
  });

  function imageGeneration() {
    var len = json_data.length, tag = "",
        chart = chart_name.toLowerCase(),
        img_path = "";

    switch(chart) {
      case "semi donut" : chart="electionDonut";
                      break;
      case "semi pie" : chart="electionPie";
                      break;
      case "% rect." : chart="treemap";
                      break;
      case "% triangle" : chart="pyramid";
                      break;
      case "percentage column" : chart="percentageColumn";
                      break;
      case "percentage bar" : chart="percentageBar";
                      break;
      case "1d bubble" : chart="bubble";
                      break;
      case "panel of scatters" : chart="panelsOfScatter";
                      break;
      case "panel of lines" : chart="panelsOfLine";
                      break;
      case "multi-series line" : chart="multiSeriesLine";
                      break;
      case "stacked area" : chart="stackedArea";
                      break;
      case "grouped bar" : chart="groupedBar";
                      break;
      case "grouped column" : chart="groupedColumn";
                      break;
      case "choropleth" : chart="oneLayer";
                      break;
      case "timeline" : chart="oneLayer";
                       break;

    }
    for(i=0;i<len;i++) {
      if (genre === "Maps") {
        img_path = "oneLayer" + "-" + json_data[i].image;
      } else {
        img_path = chart + "-" + json_data[i].image;
      }
      if(chart === "oneLayer" || genre === "Maps"){
        tag = tag + "<td class="+ img_path +" ><img class ='theme_image' src='https://s3-ap-southeast-1.amazonaws.com/charts.pykih.com/themes/"+map_code +"-"+ img_path+".png' style = 'cursor:pointer;'/><br><span>"+ json_data[i].name +"<span></td>"
      }else {
        tag = tag + "<td class="+ img_path +" ><img class ='theme_image' src='https://s3-ap-southeast-1.amazonaws.com/charts.pykih.com/themes/"+img_path+".png' style = 'cursor:pointer;'/><br><span>"+ json_data[i].name +"<span></td>"
      }
    }
    $(".panelbuttons").html(tag);

    var a = $(".panelbuttons td");
    a.on("click", function () {
      $("#chart_container").empty();
      $(".execute1").attr("checked",false);
      // console.log("theme chosen --- clicked");
      class_name = this.getAttribute("class");
      class_name = class_name.split("-")[1];
      classline_name = class_name.replace("_"," ");
      dataFinding(json_data,class_name);
    });

  }

  function hex2rgb(hex) {
    return ['0x' + hex[1] + hex[2] | 0, '0x' + hex[3] + hex[4] | 0, '0x' + hex[5] + hex[6] | 0];
  }

  function RGBAtoRGB(r, g, b, a, r2,g2,b2){
      var r3 = Math.round(((1 - a) * r2) + (a * r))
      var g3 = Math.round(((1 - a) * g2) + (a * g))
      var b3 = Math.round(((1 - a) * b2) + (a * b))
      return "rgb("+r3+","+g3+","+b3+")";
  }
  function rgbToHex(color) {
    if (color.substr(0, 1) === "#") {
        return color;
    }
    var nums = /(.*?)rgb\((\d+),\s*(\d+),\s*(\d+)\)/i.exec(color),
        r = parseInt(nums[2], 10).toString(16),
        g = parseInt(nums[3], 10).toString(16),
        b = parseInt(nums[4], 10).toString(16);
    return "#"+ (
        (r.length == 1 ? "0"+ r : r) +
        (g.length == 1 ? "0"+ g : g) +
        (b.length == 1 ? "0"+ b : b)
    );
  }

  function dataFinding(data,name) {
    var count = 0;
    config_data = data.filter(function (d) {
      return d.image === name;
    });

    config_data = config_data[0].config;
    origonal_chart_color = config_data["chart_color"][0];
    if(genre === "One Dimensional Charts") {
      config_data["color_mode"] = "shade";
    }

    if(chart_name === "Panel of Lines" || chart_name === "panelsOfScatter") {
      config_data["chart_width"] = 200;
      config_data["chart_height"] = 200;
    }

    final_config = {};
    var configtype = $(":input"),types_config = [];
    colorRepetation=[];
    countgroup=1;
    config_data['data'] = data_file;
    d3.csv(config_data.data,function(data){
      var data = data[1];
      switch(chart_name.toLowerCase()) {
        case 'pie': config_data.highlight = data.name;
                        break;
        case 'donut': config_data.highlight = data.name;
                        break;
        case "semi donut" : config_data.highlight = data.name;
                        break;
        case "semi pie" : config_data.highlight = data.name;
                        break;
        case "treemap" : config_data.highlight = data.name;
                        break;
        case "% triangle" : config_data.highlight = data.name;
                        break;
        case "percentage column" : config_data.highlight = data.name;
                        break;
        case "percentage bar" : config_data.highlight = data.name;
                        break;
        case "1d bubble" : config_data.highlight = data.name;
                        break;
        case "pyramid" : config_data.highlight = data.name;
                        break;
        case "funnel" : config_data.highlight = data.name;
                        break;
        case 'multi-series line':config_data.highlight = data.name;
                        break;
        case "panel of lines" : config_data.highlight = data.name;
                        break;
        case "bar": config_data.highlight = data.y;
                        break;
        case "column": config_data.highlight = data.x;
                        break;
        case "stacked area" : config_data.highlight = data.name;
                        break;
        case "grouped bar" :  config_data.highlight = data.y;
                        break;
        case "grouped column" : config_data.highlight = data.x;
            break;
        case "choropleth" : config_data.highlight = data.iso2;
                        break;
        case "timeline" : config_data.highlight = data.iso2;
                        break;
      }
      if(chart_name.toLowerCase() === "percentage bar") {
        config_data['chart_height'] = "";
      }
      if(chart_name.toLowerCase() === "percentage column") {
        config_data['chart_width'] = "";
      }
      for(var i in current_config) {
        config_data[i] = current_config[i];
      }
      // console.log(typeof(config_data["chart_color"]), ' *****');
      if (typeof config_data["chart_color"] == "string")  {

        config_data["chart_color"] = config_data["chart_color"].split(";");
      }

      var chart_color_data = config_data["chart_color"];
      for(var i =0;i<chart_color_data.length;i++) {
        if(chart_color_data[i].charAt(0)!= "#" && chart_color_data[i].substring(0,3).toLowerCase() !="rgb") {
          config_data["chart_color"][i] = $c.name2hex(chart_color_data[i]);
        }
      }

      final_config['chart_width'] = config_data['chart_width'];
      final_config['chart_height'] = config_data['chart_height'];
      for(i=0;i<configtype.length;i++) {
        types_config.push(configtype[i].type);
        if(configtype[i].type.toLowerCase() === "number") {
          configtype[i].value = config_data[$(configtype)[i].id];
          final_config[$(configtype)[i].id] = config_data[$(configtype)[i].id]
        } else if(configtype[i].type.toLowerCase() === "textbox") {
          $(configtype)[i].value = config_data[$(configtype)[i].id] || "";
          final_config[$(configtype)[i].id] = config_data[$(configtype)[i].id];
        } else if(configtype[i].type.toLowerCase() === "text") {
          if ($(configtype)[i].id == "clubdata_always_include_data_points" && config_data[$(configtype)[i].id] != "" && config_data[$(configtype)[i].id] != undefined) {
            config_data[$(configtype)[i].id] = config_data[$(configtype)[i].id].split(";");
          }
          $(configtype)[i].value = config_data[$(configtype)[i].id] || "";
          final_config[$(configtype)[i].id] = config_data[$(configtype)[i].id]
        }else if(configtype[i].type.toLowerCase() === "color") {
          $(configtype)[i].value = config_data[$(configtype)[i].id] || "";
          final_config[$(configtype)[i].id] = config_data[$(configtype)[i].id]
        } else if($(configtype[i]).attr("reference") === "color1") {
          if (count===1) {
            count = 0;
          }
          count+=0.2;
          var c = config_data[configtype[i].id],
              swatch_mode_is_changed = false;
          if (configtype[i].id === "chart_color") {
            if (count == 0) {
              var len = $("#chart_color[type='checkbox']");
              for (var i=0 ; i<len ; i++) {
                if ($($("#chart_color[type='checkbox']")[i]).attr("checked") == "checked") {
                  swatch_mode_is_changed = true;
                  break;
                }
              }
            }
            c = (swatch_mode_is_changed) ? c : origonal_chart_color;
            // c = origonal_chart_color;
          }
          var rgb = hex2rgb(c);
          var rgba = "rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+","+count+")";
          var middlecolor =(RGBAtoRGB(rgb[0],rgb[1],rgb[2],count,255,255,255));
          var final = rgbToHex(middlecolor);
          configtype[i].value = final;
          $($(configtype[i])[0].parentElement).attr("data-color",final);
          $($(configtype[i])[0].previousElementSibling.childNodes[1]).css("background-color",final);
          if(configtype[i].id==="chart_color" && countgroup<=5){
            var color = config_data[configtype[i].id];
            var add_color = true;
            if(color[0] != origonal_chart_color) {
              if(color.length > (countgroup-1)) {
                final = color[countgroup-1];
              } else {
                add_color = false;
              }
            }
            if(add_color) {
              if(countgroup===5){
                colorRepetation+=final
              }else{
                colorRepetation+=final+";";
              }
            }
            countgroup++;
          }
        } else if(configtype[i].type.toLowerCase() === "checkbox") {
            $(configtype)[i].value = config_data[$(configtype)[i].id];
            if(config_data[$(configtype)[i].id] === "yes") {
              $(configtype)[i].checked = true;
            } else {
              $(configtype)[i].checked = false;
            }
            final_config[$(configtype)[i].id] = config_data[$(configtype)[i].id]
        } else if(configtype[i].type.toLowerCase() === "select-one") {
          $(configtype)[i].value = config_data[$(configtype)[i].id];
          final_config[$(configtype)[i].id] = config_data[$(configtype)[i].id]
        }
        final_config['background_color'] = config_data['background_color'];
      }

      if(add_color === false) {
        colorRepetation = colorRepetation.substring(0,colorRepetation.length-1);
        colorRepetation.split(";").reverse().join(";");
      }

      init();
    });
//    console.log(map_code);

  }
  function init() {
    $("#chart_container").empty();
    if(chart_name.toLowerCase() === "river") {
      config_data["color_mode"] = "color";
      final_config["chart_color"] = ["#255AEE","#AEC7E8","#FF7F0E","#98DF8A","#D62728"];
      colorRepetation = '#255AEE;#AEC7E8;#FF7F0E;#98DF8A;#D62728';
    }

    if(chart_name.toLowerCase() === "waterfall") {
      config_data["color_mode"] = "color";
      final_config["chart_color"] = ["#150081","#008100","#a10000"];
      config_data["chart_margin_left"] = 140;
      final_config["chart_margin_left"] = 140;
      colorRepetation = '#150081;#008100;#a10000'
      $("#chart_margin_left").val(140);
    }

    obj=config_data;
    config_data["map_code"] = map_code;
    final_config["map_code"] = map_code;
    if (chart_name=="Timeline") {
      obj["data"]="https://s3-ap-southeast-1.amazonaws.com/chartstore.io-data/"+final_config["map_code"]+"_data_timeline.json"
      //console.log($('#'+this.id).val());
    } else if (chart_name=="Choropleth") {
      obj["data"]="https://s3-ap-southeast-1.amazonaws.com/chartstore.io-data/"+final_config["map_code"]+"_data.json"
    }

    // console.log(config_data)
    k = new initializerFunction(config_data);

    if((obj.title_text).toUpperCase=="Enter title here".toUpperCase){
      $("#title_text")[0].value="";
    }
    if((obj.subtitle_text).toUpperCase=="Enter subtitle here".toUpperCase){
      $("#subtitle_text")[0].value="";
    }
    d3.selectAll(".pyk-tooltip").remove();
    resizeChartContainerDiv(original_width);


    var groups;
    var str = '';
    str = colorRepetation;
    if(chart_name!="Pictograph"){
      config_data["chart_color"] = colorRepetation.split(";").reverse();
      $("[id1='array_text']").attr('value',str.split(";").reverse().join(";"));
    }

    displayConfigs(obj);
    // console.log("Init() function");
    k.execute();
    colorRepetation=[];
    str="";
    countgroup=1;
    setTimeout(function(){addConfigOptions()},800);

  }
  $('.apply_config').on("click",function(){
    $("#chart_container").empty();
    class_to_apply = $(this).attr("apply_config_for")
    $(":input."+class_to_apply).each(function(){
      var i = this.id;
      k[i]=$('#'+this.id).val();
      obj[i]=$('#'+this.id).val();
      final_config[i]=$('#'+this.id).val()
      if(i == "title_text" || i == "subtitle_text"){
        if(obj[i] == "" || obj[i].length == 0){
          k[i] = "Enter "+i.split("_")[0]+" here";
          obj[i] = "Enter "+i.split("_")[0]+" here";
          final_config[i] = "Enter "+i.split("_")[0]+" here";
        }
      }
      if(!isNaN(obj[i])){
        k[i] = parseInt(obj[i],10);
        obj[i] = parseInt(obj[i],10);
        final_config[i] = parseInt(obj[i],10);
      }
    });

    if((obj.title_text).toUpperCase()=="ENTER TITLE HERE"){
      $("#title_text")[0].value="";
    }
    if((obj.subtitle_text).toUpperCase()=="ENTER SUBTITLE HERE"){
      $("#subtitle_text")[0].value="";
    }

    var b = new initializerFunction(obj);
    d3.selectAll(".pyk-tooltip").remove();
    resizeChartContainerDiv(original_width);
    displayConfigs(final_config);
    // console.log("apply_config");
    b.execute();
    setTimeout(function(){addConfigOptions()},800);
  });

  $("#expandCollapse").click(function(e){
    e.preventDefault();

    if($(".panel-body").hasClass("in")){
      $(".panel-body").removeClass("in");
    }else{
      $(".panel-body").addClass("in").css("height","auto");
      $(".in").prev().removeClass("collapsed");
    }
  });

  $(":input.execute1").on("click",function(){
    d3.select("#chart_container").html("");
    if(this.type == "radio"){
      $("#chart_container").empty();
      if(!(final_config[this.id] === $('#'+this.id).val() || final_config[this.id] === parseFloat($('#'+this.id).val()))) {
        // console.log(this.id,$('#'+this.id).val(),$(this).val());
        current_config[this.id] = $(this).val();
      }

      if(this.id != "chart_color"){
        obj[this.id]= this.value;
        k[this.id]=this.value;
        final_config[this.id] = this.value;
      }
      var b = new initializerFunction(obj);
      d3.selectAll(".pyk-tooltip").remove();
      resizeChartContainerDiv(original_width);
      displayConfigs(obj);
      // console.log("Clicked .execute1");
      b.execute();
      setTimeout(function(){addConfigOptions()},800);
    }
  });

  $(":input.execute2").on("click",function(){
    $("#chart_container").empty();
    var i = this.id
      , color_arr = [];
      // console.log(colorRepetation,"colorRepetation")
    if (i==="chart_color_boolean0") {
        colorRepetation=$("[id1='array_text']").val();
        $("[id1='array_text']").attr('value',colorRepetation);
        k["chart_color"] = colorRepetation.split(";");
        obj["chart_color"] = colorRepetation.split(";");
        final_config["chart_color"] = k["chart_color"];
       $(".identity1").attr("disabled",true);
       $(".identity2").attr("disabled",false);

    } else {
      var chart_color_checked = $('.execute3:checked');
      if(!chart_color_checked.length){
        color_arr.push(obj["chart_color"][0]);
      }
      else{
        for (var j = 0; j<chart_color_checked.length; j++) {
          color_arr.push(chart_color_checked[j].value);
        }
      }
      // console.log(color_arr,"color_arr");
      obj["chart_color"] = color_arr;
      k["chart_color"] = color_arr;
      final_config["chart_color"] = color_arr;
      $(".identity1").attr("disabled",false);
      $(".identity2").attr("disabled",true);
    }
    d3.selectAll(".pyk-tooltip").remove();
    var b = new initializerFunction(obj);
    displayConfigs(final_config);
    // console.log("Clicked .execute2");
    b.execute();
    setTimeout(function(){addConfigOptions()},800);
  });

  $(".execute3").on("click",function(){
    if ($("#chart_color_boolean1").attr('checked') === "checked") {
      $("#chart_container").empty();
      var i = this.id
        , color_arr = [];
      var chart_color_checked = $('.execute3:checked');
      for (var j = 0; j<chart_color_checked.length; j++) {
        color_arr.push(chart_color_checked[j].value);
      }
      obj[i] = color_arr;
      k[i] = color_arr;
      if(!(final_config[i] === $('#'+this.id).val() || final_config[i] === parseFloat($('#'+this.id).val()))) {
        current_config[i] = $('#'+this.id).val();
      }
      final_config[i] = color_arr;
      d3.selectAll(".pyk-tooltip").remove();
      var b = new initializerFunction(obj);

      displayConfigs(final_config);
      // console.log("Clicked .execute3");
      b.execute();
      setTimeout(function(){addConfigOptions()},800);
    }
  });

  $(":input.execute").on("blur",function(event){
    $("#chart_container").empty();
    // document.getElementById("chart_container").innerHTML = "";
    var i = this.id;
    k[i]=$('#'+this.id).val();
    obj[i]=$('#'+this.id).val();
    if(!(final_config[i] === $('#'+this.id).val() || final_config[i] === parseFloat($('#'+this.id).val()))) {
      if(i!="chart_color") {
        current_config[i] = $('#'+this.id).val();
      } else {
        current_config[i] = this.value.split(";");
      }
    }

    final_config[i]=$('#'+this.id).val();

    if (i==="chart_color") {
      if ($("#chart_color_boolean0").attr('checked') === "checked") {
        var arr=[];
        k[i] = this.value.split(";");
        obj[i] = this.value.split(";");
        final_config[i] = k[i];
      }
    }

    if(this.type == "select-one")
    {
      if(i == "map_code"){
        if(chart_name=="Timeline"){
          obj["data"]="https://s3-ap-southeast-1.amazonaws.com/chartstore.io-data/"+obj["map_code"]+"_data_timeline.json";
        }else{
          obj["data"]="https://s3-ap-southeast-1.amazonaws.com/chartstore.io-data/"+obj["map_code"]+"_data.json";
        }
      }
      imageGeneration();
      if($('#'+this.id).val() == "fixed"){
        $("."+$(this).attr("disableinputs1")).each(function(){
          $(this).attr("disabled",false);
        });
      }else if($('#'+this.id).val() == "moving"){
        $("."+$(this).attr("disableinputs1")).each(function(){
          $(this).attr("disabled",true);
        });
      }
      if($('#'+this.id).val() == "color"){
        $("."+$(this).attr("disableinputs1")).each(function(){
          $(this).attr("disabled",true);
        });
      }else{
        $("."+$(this).attr("disableinputs1")).each(function(){
          $(this).attr("disabled",false);
        });
      }
    }

    if(this.type == "checkbox")
    {
      if(this.checked){
        $("."+$(this).attr("disableinputs")).each(function(){
          $(this).attr("disabled",false);
        });
        k[i] = "yes";
        obj[i] = "yes";
        current_config[i] = "yes";
        final_config[i] = "yes";
      } else {
        $("."+$(this).attr("disableinputs")).each(function(){
          $(this).attr("disabled",true);
        });
        k[i] = "no";
        obj[i] = "no";
        current_config[i] = "no";
        final_config[i] = "no";
      }
    }
    // console.log(current_config)
    if(i == "axis_x_pointer_values" || i == "axis_y_pointer_values" || i == "clubdata_always_include_data_points"){
      obj[i] = obj[i].toString().split(";");
      k[i] = obj[i];
      final_config[i] = obj[i];
    }
    if(!isNaN(obj[i])){
      k[i] = parseInt(obj[i]);
      obj[i] = parseInt(obj[i]);
      final_config[i] = parseInt(obj[i]);
    }

    if (PykCharts.interval){
      clearInterval(PykCharts.interval);
    }

    if(i=="palette_color"){
      k.saturation_color="";
      obj.saturation_color="";
      final_config.saturation_color="";
    }

    if(i==="highlight"){
      final_config[i]=$('#'+this.id).val().toString();
      obj[i]=$('#'+this.id).val().toString();
    }

    var b = new initializerFunction(obj);
    d3.selectAll(".pyk-tooltip").remove();
    resizeChartContainerDiv(original_width);
    displayConfigs(obj);
    if(event.relatedTarget && (event.relatedTarget.id === "highlight_color" || event.relatedTarget.id === "chart_color_boolean1" || event.relatedTarget.getAttribute("class")=== "execute1")) {
    } else {
      // console.log("Moved away from .execute >>>>>");
      b.execute();
    }
    setTimeout(function(){addConfigOptions()},800);
  });
}

function addConfigOptions() {
  var config,i,selector, modal_config = ["title","sub-title"];
  for(i= 0;i<2;i++){
    $("#"+modal_config[i]+"_modal").remove();
    config= '<span class="glyphicon glyphicon-cog" data-target=".bs-'+modal_config[i]+'" data-toggle="modal" id="'+modal_config[i]+'_modal" style="margin:10px;height:10px;cursor:pointer"></span>'
    $("#"+modal_config[i]).append(config);
  }
  $("#footer-should-not-change").show()
}

function displayConfigs(o) {
  $("#config-object-display").text("");
  // console.log(final_config);
  // console.log("<<< Displaying Configs");
  var final_stringified_config = JSON.stringify(final_config, null, 12).replace("{","").replace("}","");
  var html_template ='<head> \n'+
      '\t <link rel="stylesheet" type="text/css" href="pykcharts.1.min.css">\n'+
      '\t<script src="pykcharts.1.min.js"><\/script>\n'+
      '</head>\n' +
      '<body>\n' +
      '\t<div id="my_chart"></div>\n'+
      '\t<script>\n'+
        '\t window.PykChartsInit = function (e) {\n'+
          '\t var k = new '+chart_api_exec+'({\n'+
              '\t "selector": "#my_chart",\n'+
              '\t "data": '+data_file+',\n'+
              '\t '+final_stringified_config+
          '\t });\n'+
          '\t k.execute();\n'+
        '\t}\n'+
        '\t <\/script>\n'+
      '<\/body>\n';

  $("#config-object-display").text(html_template).css({"":"","display":"block"});
}

function resizeChartContainerDiv(w) {
  $("#chart_container").css("width",w);
}
;
