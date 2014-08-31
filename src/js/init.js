(function () {
    var count = 0;

    function importFiles (url) {
        var include = document.createElement('script');
        include.type = 'text/javascript';
        include.async = true;
        include.onload = include.onreadystatechange = function () {
            count++;
            if (count===3) {
                window.PykChartsInit();
            };
        }
        include.src = url;
        var s = document.getElementsByTagName('link')[0];
        s.parentNode.insertBefore(include, s);
    }
    importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/underscore-min.js');
    importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/d3.min.js');
    importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/jquery-1.11.1.min.js');
    importFiles('https://s3-ap-southeast-1.amazonaws.com/ap-southeast-1.datahub.pykih/distribution/js/custom-hive.js');
})();
