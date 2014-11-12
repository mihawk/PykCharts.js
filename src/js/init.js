var anonymousFunc = function () {

    var urls = [
        PykCharts.assets+'lib/jquery-1.11.1.min.js'
      , PykCharts.assets+'lib/d3.min.js'
      , PykCharts.assets+'lib/underscore.min.js'
      , PykCharts.assets+'lib/topojson.min.js'
      , PykCharts.assets+'lib/custom-hive.min.js'
      , PykCharts.assets+'lib/jquery.colourbrightness.min.js'
      , PykCharts.assets+'lib/colors.min.js'
      , PykCharts.assets+'lib/paper-full.min.js'
      , PykCharts.assets+'lib/downloadDataURI.min.js'
    ];

    function importFiles (url) {
        var include = document.createElement('script');
        include.type = 'text/javascript';
        include.async = false;
        include.onload = function () {
            try {
                if (_ && d3 && ($ || jQuery) && d3.customHive && topojson && $("body").colourBrightness && $c && paper && downloadDataURI) {
                    PykCharts.numberFormat = d3.format(",");
                    window.PykChartsInit();
                    $("body").click(function () {
                        if (PykCharts.export_menu_status === 0) {
                            $(".dropdown-multipleConatiner-export").css("visibility","hidden");
                        }
                        PykCharts.export_menu_status = 0;
                    })
                };
            }
            catch (e) {

            }
        }
        include.src = url;
        var s = document.getElementsByTagName('link')[0];
        s.parentNode.insertBefore(include, s);
    };
    for (var i = 0; i < urls.length; i++) {
        try {
            if ((!$ && !jQuery) || !d3 || !_ || !d3.customHive || !topojson || !$("body").colourBrightness || !$c || !paper || !downloadDataURI) {
                importFiles(urls[i]);
            }
        }
        catch (e) {
            importFiles(urls[i]);
        }
    }
};

window.onload = anonymousFunc;
