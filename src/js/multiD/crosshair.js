PykCharts.crossHair = function (options) {
    options.k.crossHair= function (svg,len,data,fill,type) {
        if(PykCharts['boolean'](options.crosshair_enable) && options.mode === "default") {

            PykCharts.Configuration.cross_hair_v = svg.append("line")
                .attr({
                    "class" : "line-cursor",
                    "id" : "cross-hair-v"
                });

            PykCharts.Configuration.cross_hair_h = svg.append("line")
                .attr({
                    "class" : "line-cursor",
                    "id" : "cross-hair-h"
                })
                .style("display","none");

            for (j=0; j<len; j++) {
                PykCharts.Configuration.focus_circle = svg.append("g")
                    .attr({
                        "class" : "focus",
                        "id" : "f_circle"+j
                    })
                    .style("display","none");

                PykCharts.Configuration.focus_circle.append("circle")
                    .attr({
                        "fill" : function (d) {
                            return fill.colorPieMS(data[j],type);
                        },
                        "id" : "focus-circle"+j,
                        "r" : "6"
                    });
            }
        }
        return this;
    }
    
}
//     };
//     return configuration1;
// };