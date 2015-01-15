PykCharts.annotation = function (options) {
    options.k.annotation = function (svg,data,xScale,yScale) {
        var legendsGroup_height = (options.legendsGroup_height) ? options.legendsGroup_height: 0;

        if(options.annotation_view_mode === "onclick") {
            var annotation_circle = d3.select(svg).selectAll(".PykCharts-annotation-circle")
                .data(data);
            var annotation_text = d3.select(svg).selectAll(".PykCharts-annotation-text")
                .data(data);

            annotation_circle.enter()
                .append("circle")
                .attr("class","PykCharts-annotation-circle");

            annotation_circle
                .attr("r",0);
            setTimeout(function () {
                annotation_circle
                    .attr("cx",function (d,i) {
                        return (parseInt(xScale(d.x))+options.extra_left_margin+options.chart_margin_left);
                    })
                    .attr("cy", function (d,i) {
                        return (parseInt(yScale(d.y))-15+options.chart_margin_top+legendsGroup_height);
                    })
                    .attr("r", "7")
                    .style("cursor","pointer")
                    .on("click",function (d,i) {
                        options.mouseEvent.tooltipPosition(d);
                        options.mouseEvent.tooltipTextShow(d.annotation);
                    })
                    .on("mouseover", function (d) {
                        options.mouseEvent.tooltipHide(d,options.panels_enable,"multilineChart")
                    })
                    .attr("fill",options.annotation_background_color)
            },options.transitions.duration());

            annotation_circle.exit().remove();
        } else if(options.annotation_view_mode === "onload") {
            var w = [],h=[];
            var annotation_rect = d3.select(svg).selectAll(".annotation-rect")
                .data(data)

            annotation_rect.enter()
                .append("rect")
                .attr("class","annotation-rect");

            var annotation_text = d3.select(svg).selectAll(".annotation-text")
                .data(data)

            annotation_text.enter()
                .append("text")
                .attr("class","annotation-text");
            annotation_text
                .text(function (d) {
                    return "";
                });
            annotation_rect
                .attr("width",0)
                .attr("height",0);
            setTimeout(function () {
                annotation_text.attr("x",function (d) {
                        return parseInt(xScale(d.x)-(5))+options.extra_left_margin+options.chart_margin_left;
                    })
                    .attr("y", function (d) {
                        return parseInt(yScale(d.y)-18+options.chart_margin_top+legendsGroup_height);
                    })
                    .attr("text-anchor","middle")
                    .style("font-size","12px")
                    .text(function (d) {
                        return d.annotation;
                    })
                    .text(function (d,i) {
                        w[i] = this.getBBox().width + 20;
                        h[i] = this.getBBox().height + 10;
                        return d.annotation;
                    })
                    .attr("fill",options.annotation_font_color)
                    .style("pointer-events","none");

                annotation_rect.attr("x",function (d,i) {
                        return (parseInt(xScale(d.x)-(5))+options.extra_left_margin+options.chart_margin_left) - (w[i]/2);
                    })
                    .attr("y", function (d,i) {
                        return (parseInt(yScale(d.y)-10+options.chart_margin_top)+legendsGroup_height) - h[i];
                    })
                    .attr("width",function (d,i) { return w[i]; })
                    .attr("height",function (d,i) { return h[i]; })
                    .attr("fill",options.annotation_background_color)
                    .style("pointer-events","none");
            },options.transitions.duration());
            annotation_text.exit()
                .remove();
            annotation_rect.exit()
                .remove();
        }

        return this;
    }
}