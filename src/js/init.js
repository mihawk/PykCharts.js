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
    , PykCharts.assets+'lib/venn.js'
    ];

    function importFiles (url) {
        var include = document.createElement('script');
        include.type = 'text/javascript';
        include.async = false;
        include.onload = function () {
            try {
                PykCharts.numberFormat = d3.format(",");
                if (_ && d3 && ($ || jQuery) && d3.customHive && topojson && $("body").colourBrightness && $c && paper && downloadDataURI && venn) {
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
    try {
        if (!$ && !jQuery) {
            importFiles(urls[0]);
        }
    } catch (e) {
        importFiles(urls[0]);
    }
    try {
        if(!d3) {
            importFiles(urls[1]);
        }
    } catch (e) {
        importFiles(urls[1])
    }
    try {
        if(!_) {
            importFiles(urls[2]);
        }
    } catch (e) {
        importFiles(urls[2]);
    }
    try {
        if(!d3.customHive) {
            importFiles(urls[3]);
        }
    } catch (e) {
        importFiles(urls[3]);
    }
    try {
        if(!topojson) {
            importFiles(urls[4]);
        }
    } catch (e) {
        importFiles(urls[4]);
    }
    try {
        if(!$("body").colourBrightness) {
            importFiles(urls[5]);
        }
    } catch (e) {
        importFiles(urls[5]);
    }
    try {
        if(!$c) {
            importFiles(urls[6]);
        }
    } catch (e) {
        importFiles(urls[6]);
    }
    try {
        if(!paper) {
            importFiles(urls[7]);
        }
    } catch (e) {
        importFiles(urls[7]);
    }
    try {
        if(!downloadDataURI) {
            importFiles(urls[8]);
        }
    } catch (e) {
        importFiles(urls[8]);
    }
    try {
        if(!venn) {
            importFiles(urls[9]);
        }
    } catch (e) {
        importFiles(urls[9]);
    }
    // for (var i = 0; i < urls.length; i++) {
    //     try {
    //         if ((!$ && !jQuery) || !d3 || !_ || !d3.customHive || !topojson || !$("body").colourBrightness || !$c || !paper || !downloadDataURI) {
    //             
    //         } else {
    //             
    //     }
    // }
};

window.onload = anonymousFunc;