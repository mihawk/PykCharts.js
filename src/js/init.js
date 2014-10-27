(function () {

    function importFiles (url) {
        var include = document.createElement('script');
        include.type = 'text/javascript';
        include.async = false;
        include.onload = include.onreadystatechange = function () {
            try {
                if (_ && d3 && ($ || jQuery) && d3.customHive && topojson && $("body").colourBrightness) {
                    PykCharts.numberFormat = d3.format(",");
                    window.PykChartsInit();
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
        if (!d3) {
            importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/d3.min.js');
        }
    }
    catch (e) {
        importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/d3.min.js');
    }
    try {
        if (!_) {
            importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/underscore-min.js');
        }
    }
    catch (e) {
        importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/underscore-min.js');
    }
    try {
        if (!$ && !jQuery) {
            console.log("jquery");
            importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/jquery-1.11.1.min.js');
        }
    }
    catch (e) {
        console.log("catch jquery");
        importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/jquery-1.11.1.min.js');
    }
    try {
        if (!topojson) {
            importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/topojson.js');
        }
    }
    catch (e) {
          importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/topojson.js');
    }
    try {
        if (!d3.customHive) {
            importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/custom-hive.min.js');
        }
    }
    catch (e) {
        importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/custom-hive.min.js');
    }
    try {
        if (!$("body").colourBrightness) {
            // console.log($,"dollar");
            importFiles("../lib/jquery.colourbrightness.js");
            // importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/jquery.colourbrightness.js');
        }
    }
    catch (e) {
        // console.log(jQuery,"dollar");
        importFiles("../lib/jquery.colourbrightness.js");
        // importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/jquery.colourbrightness.js');
    }
})();
