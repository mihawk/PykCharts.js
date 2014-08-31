(function () {

    function importFiles (url) {
        var include = document.createElement('script');
        include.type = 'text/javascript';
        include.async = true;
        include.onload = include.onreadystatechange = function () {
            try {
                if (_ && d3 && ($ || jQuery) && d3.customHive && topojson) {
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
        if (!_) {
            importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/underscore-min.js');
        }
    }
    catch (e) {
        importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/underscore-min.js');
    }
    try {
        if (!d3) {
            importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/d3.min.js');
        }
    }
    catch (e) {
        importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/d3.min.js');
    }
    try {
        if (!$ && !jQuery) {
            importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/jquery-1.11.1.min.js');
        }
    }
    catch (e) {
        importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/jquery-1.11.1.min.js');
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
        if (!topojson) {
            importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/topojson.js');
        }
    }
    catch (e) {
          importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/topojson.js');
    }
})();
