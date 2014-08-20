PykCharts.tree = {}
var theme = new PykCharts.Configuration.Theme({});

PykCharts.tree.configuration = function (options){
    var that = this;
    var treeConfig = {
    	dataTransfer : function () {
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
                            weight: d1.weight
                        });
                    })
                    return leaves;
                })
                .entries(data);
            return data;
    	}