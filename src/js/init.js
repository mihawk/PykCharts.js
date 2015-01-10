var anonymousFunc = function () {

    var urls = [
/*      PykCharts.assets+'lib/jquery-1.11.1.min.js'
    ,*/ PykCharts.assets+'lib/d3.min.js'
    // , PykCharts.assets+'lib/underscore.min.js'
    , PykCharts.assets+'lib/topojson.min.js'
    , PykCharts.assets+'lib/custom-hive.min.js'
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
                PykCharts.numberFormat = d3.format(",");
                if (/*_ && */d3 /*&& ($ || jQuery)*/ && d3.customHive && topojson && $c && paper && downloadDataURI) {
                    window.PykChartsInit();
                    document.querySelector.onclick = function () {
                        if (PykCharts.export_menu_status === 0) {
                            d3.selectAll(".dropdown-multipleConatiner-export").style("visibility","hidden");
                        }
                        PykCharts.export_menu_status = 0;
                    };
                };
            }
            catch (e) {

            }
        }
        include.src = url;
        var s = document.getElementsByTagName('link')[0];
        s.parentNode.insertBefore(include, s);
    };
    // try {
    //     if (!$ && !jQuery) {
    //         importFiles(urls[0]);
    //     }
    // } catch (e) {
    //     importFiles(urls[0]);
    // }
    try {
        if(!d3) {
            importFiles(urls[0]);
        }
    } catch (e) {
        importFiles(urls[0])
    }
    // try {
    //     if(!_) {
    //         importFiles(urls[1]);
    //     }
    // } catch (e) {
    //     importFiles(urls[1]);
    // }
    try {
        if(!d3.customHive) {
            importFiles(urls[1]);
        }
    } catch (e) {
        importFiles(urls[1]);
    }
    try {
        if(!topojson) {
            importFiles(urls[2]);
        }
    } catch (e) {
        importFiles(urls[2]);
    }
    try {
        if(!$c) {
            importFiles(urls[3]);
        }
    } catch (e) {
        importFiles(urls[3]);
    }
    try {
        if(!paper) {
            importFiles(urls[4]);
        }
    } catch (e) {
        importFiles(urls[4]);
    }
    try {
        if(!downloadDataURI) {
            importFiles(urls[5]);
        }
    } catch (e) {
        importFiles(urls[5]);
    }
};

window.onload = anonymousFunc;
