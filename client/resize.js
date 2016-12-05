export default function resize() {
  /* Find the new window dimensions */
    var width = parseInt(d3.select("#graph").style("width")) - margin*2,
    height = parseInt(d3.select("#graph").style("height")) - margin*2;

    /* Update the range of the scale with new width/height */
    xScale.range([0, width]).nice(d3.time.year);
    yScale.range([height, 0]).nice();

    /* Update the axis with the new scale */
    graph.select('.x.axis')
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    graph.select('.y.axis')
      .call(yAxis);

    /* Force D3 to recalculate and update the line */
    graph.selectAll('.line')
      .attr("d", line);
    }
