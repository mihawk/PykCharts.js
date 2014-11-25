PykCharts.tree = {}

var theme = new PykCharts.Configuration.Theme({});

PykCharts.tree.configuration = function (options){
    var that = this;
    var treeConfig = {
    	dataTransfer : function (d) {
    		var data = d3.nest()
                .key(function(d) {
                    return d.level1;
                })
                .key(function(d) {
                    return d.level2;
                })
                .key(function(d) {
                    return d.level3;
                })
                .rollup(function(d) {
                    var leaves = [];
                    _.each(d, function (d1) {
                        leaves.push({
                            key: d1.level4,
                            weight: d1.weight,
                            tooltip: d1.tooltip
                        });
                    })
                    return leaves;
                })
                .entries(d);
            data = {
                key: "root",
                values: data
            };
            return data;
    	},
        zoom : function (svg,group) {
            zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", function () {
                group.attr("transform", "translate(" + PykCharts.getEvent().translate + ")scale(" + PykCharts.getEvent().scale + ")");
            });
            if(PykCharts.boolean(options.zoom.enable))
            {
                svg.call(zoomListener);
                svg.style("overflow","hidden");
            }
            return zoomListener;
        }
    }
    return treeConfig;
};


PykCharts.tree.processInputs = function (chartObject, options) {

    var theme = new PykCharts.Configuration.Theme({})
        , stylesheet = theme.stylesheet
        , functionality = theme.functionality
        , treeCharts = theme.treeCharts
        , optional = options.optional;

    chartObject.selector = options.selector ? options.selector : stylesheet.selector;
    chartObject.width = optional.chart && _.isNumber(optional.chart.width) ? optional.chart.width : stylesheet.chart.width;
    chartObject.height = optional.chart &&_.isNumber(optional.chart.height) ? optional.chart.height : stylesheet.chart.height;
    chartObject.margin = optional.chart && optional.chart.margin ? optional.chart.margin : stylesheet.chart.margin;
    chartObject.margin.left = optional.chart && optional.chart.margin && _.isNumber(optional.chart.margin.left) ? optional.chart.margin.left : stylesheet.chart.margin.left;
    chartObject.margin.right = optional.chart && optional.chart.margin && _.isNumber(optional.chart.margin.right) ? optional.chart.margin.right : stylesheet.chart.margin.right;
    chartObject.margin.top = optional.chart && optional.chart.margin && _.isNumber(optional.chart.margin.top) ? optional.chart.margin.top : stylesheet.chart.margin.top;
    chartObject.margin.bottom = optional.chart && optional.chart.margin && _.isNumber(optional.chart.margin.bottom) ? optional.chart.margin.bottom : stylesheet.chart.margin.bottom;
    chartObject.mode = options.mode ? options.mode : stylesheet.mode;
    if (optional && optional.title) {
        chartObject.title = optional.title;
        chartObject.title.size = optional.title.size ? optional.title.size : stylesheet.title.size;
        chartObject.title.color = optional.title.color ? optional.title.color : stylesheet.title.color;
        chartObject.title.weight = optional.title.weight ? optional.title.weight : stylesheet.title.weight;
        chartObject.title.family = optional.title.family ? optional.title.family : stylesheet.title.family;
    } else {
        chartObject.title = stylesheet.title;
    }
    if (optional && optional.subtitle) {
        chartObject.subtitle = optional.subtitle;
        chartObject.subtitle.size = optional.subtitle.size ? optional.subtitle.size : stylesheet.subtitle.size;
        chartObject.subtitle.color = optional.subtitle.color ? optional.subtitle.color : stylesheet.subtitle.color;
        chartObject.subtitle.weight = optional.subtitle.weight ? optional.subtitle.weight : stylesheet.subtitle.weight;
        chartObject.subtitle.family = optional.subtitle.family ? optional.subtitle.family : stylesheet.subtitle.family;
    } else {
        chartObject.subtitle = stylesheet.subtitle;
    }
    chartObject.realTimeCharts = optional && optional.realTimeCharts ? optional.realTimeCharts : functionality.realTimeCharts;
    chartObject.transition = optional && optional.transition && optional.transition.duration ? optional.transition : functionality.transition;
    chartObject.creditMySite = optional && optional.creditMySite ? optional.creditMySite : stylesheet.creditMySite;
    chartObject.dataSource = optional && optional.dataSource ? optional.dataSource : "no";
    chartObject.bg = optional && optional.colors && optional.colors.backgroundColor ? optional.colors.backgroundColor : stylesheet.colors.backgroundColor;
    chartObject.chartColor = optional && optional.colors && optional.colors.chartColor ? optional.colors.chartColor : stylesheet.colors.chartColor;
    chartObject.fullscreen = optional && optional.buttons && optional.buttons.enableFullScreen ? optional.buttons.enableFullScreen : stylesheet.buttons.enableFullScreen;
    chartObject.loading = optional && optional.loading && optional.loading.animationGifUrl ? optional.loading.animationGifUrl: stylesheet.loading.animationGifUrl;
    chartObject.enableTooltip = optional && optional.enableTooltip ? optional.enableTooltip : stylesheet.enableTooltip;
    if (optional && optional.borderBetweenChartElements) {
        chartObject.borderBetweenChartElements = optional.borderBetweenChartElements;
        chartObject.borderBetweenChartElements.width = "width" in optional.borderBetweenChartElements ? optional.borderBetweenChartElements.width : stylesheet.borderBetweenChartElements.width;
        chartObject.borderBetweenChartElements.color = optional.borderBetweenChartElements.color ? optional.borderBetweenChartElements.color : stylesheet.borderBetweenChartElements.color;
        chartObject.borderBetweenChartElements.style = optional.borderBetweenChartElements.style ? optional.borderBetweenChartElements.style : stylesheet.borderBetweenChartElements.style;
    } else {
        chartObject.borderBetweenChartElements = stylesheet.borderBetweenChartElements;
    }
    if (optional && optional.label) {
        chartObject.label = optional.label;
        chartObject.label.size = "size" in optional.label ? optional.label.size : stylesheet.label.size;
        chartObject.label.color = optional.label.color ? optional.label.color : stylesheet.label.color;
        chartObject.label.weight = optional.label.weight ? optional.label.weight : stylesheet.label.weight;
        chartObject.label.family = optional.label.family ? optional.label.family : stylesheet.label.family;
    } else {
        chartObject.label = stylesheet.label;
    }
    chartObject.zoom = optional && optional.zoom ? optional.zoom : treeCharts.zoom;
    chartObject.zoom.enable = optional && optional.zoom && optional.zoom.enable ? optional.zoom.enable : treeCharts.zoom.enable;
    chartObject.nodeRadius = optional && optional.nodeRadius && _.isNumber(optional.nodeRadius) ? optional.nodeRadius : treeCharts.nodeRadius;

    chartObject.k = new PykCharts.Configuration(chartObject);

    return chartObject;
};
