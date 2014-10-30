(function () {

    var urls = [
        'https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/jquery-1.11.1.min.js'
      , 'https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/d3.min.js'
      , '../lib/underscore-min.js'
      , 'https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/topojson.js'
      , 'https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/custom-hive.min.js'
      , '../lib/jquery.colourbrightness.js'
    ];

    function importFiles (url) {
        var include = document.createElement('script');
        include.type = 'text/javascript';
        include.async = false;
        include.onload = include.onreadystatechange = function () {
            try {
                if (_ && d3 && ($ || jQuery) && d3.customHive && topojson && $("body").colourBrightness) {
                    PykCharts.numberFormat = d3.format(",");
                    window.PykChartsInit();
                    $("body").click(function () {
                        if (PykCharts.export_menu_status === 0) {
                            $("#dropdown-multipleConatiner-export").css("visibility","hidden");
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
            if ((!$ && !jQuery) || !d3 || !_ || !d3.customHive || !topojson || !$("body").colourBrightness) {
                importFiles(urls[i]);
            }
        }
        catch (e) {
            importFiles(urls[i]);
        }
    }
})();