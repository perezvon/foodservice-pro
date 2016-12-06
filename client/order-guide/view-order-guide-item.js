import d3 from 'd3'
import resize from '../resize.js'

Template.viewOrderGuideItem.onRendered (function () {
    //get price data 
    let currentItem = Ordering.findOne({_id: Template.currentData(0)._id}, {
            fields: {orderHistory: true}
        });
        let curr = currentItem.orderHistory;
     let trend = [];
        for (let i = 0; i < curr.length; i++){
             let price = +curr[i].price, qty = +curr[i].qty;
             trend.push({date: d3.isoParse(curr[i].date), price: price, qty: qty});
             }
        trend = _.sortBy(trend, 'date');
    var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 720 - margin.left - margin.right,
    height = 360 - margin.top - margin.bottom;
    
    var formatTime = d3.timeFormat("%B %d, %Y");
    var priceExtent = d3.extent(trend, function(d) { return d.price; });
    var priceDelta = priceExtent[0] / priceExtent[1];
// style y axis based on price delta
    
var x = d3.scaleTime()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var xAxis = d3.axisBottom(x)
                .ticks(5);

var yAxis = d3.axisLeft(y)
                .ticks(10, d3.format("($.2f"));
    
var valueLine = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.price); });

// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

var chart = d3.select("#priceTrend")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(d3.extent(trend, function(d) { return d.date; }));
  y.domain(priceExtent);
    
  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    chart.append("path")
    .data([trend])
        .attr("class", "line")
        .attr("d", valueLine);
    
    chart.selectAll("dot")
        .data(trend)
      .enter().append("circle")
        .attr("r", function(d) { return 5 + Math.log(d.qty); })
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.price); })
      .on("mouseover", function (d) {
        div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div.html("<strong>Date: </strong>" + formatTime(d.date) + "<br/> <strong>Price: </strong>$" + d.price + "<br/> <strong>Qty: </strong>" + d.qty)	
                .style("left", (d3.event.pageX - 90) + "px")		
                .style("top", (d3.event.pageY - 82) + "px");	
      })
      .on("mouseout", function () {
        div.transition()		
          .duration(500)		
          .style("opacity", 0);
      });

function type(d) {
  d[1] = +d[1]; // coerce to number
  return d;
}
});

/*Template.viewOrderGuideItem.helpers ({
    ordering(result) {
        let currentItem = Ordering.findOne({_id: this._id}, {
            fields: {orderHistory: true}
        });
        let curr = currentItem.orderHistory;
        if (curr){
            switch (result) {
                case "lastOrdered": 
                        let dates = [];
                        for (let i = 0; i < curr.length; i++){
                            dates.push(curr[i].date);
                            }
                        dates.sort(function(a, b){
                        return b - a;
                        });
                        let lastOrderedDate = moment(dates[0]).format("MM/DD/YYYY");
                    return lastOrderedDate;
                    break;
                    
                
                case "orderFrequency":
                    let totalOrdered = 0;
                        for (let i = 0; i < curr.length; i++){
                            if(moment(curr[i].date).format("YYYY") == moment().format("YYYY")) {
                                totalOrdered += eval(curr[i].qty);
                            }
                        }
                        return ((totalOrdered / 12).toFixed(1) + " / Month");
                    break;
                
                case "priceTrend":
                    let trend = [];
                    for (let i = 0; i < curr.length; i++){
                        let price = eval((curr[i].price)).toFixed(2);
                        trend.push({date: moment(curr[i].date).format("MM/DD/YYYY"), price: price});
                     }
                     trend = _.sortBy(trend, 'date').reverse();
                    return trend;
                    break;
            }
        }
    }
});*/

Template.viewOrderGuideItem.events({
   'click #edit-og-item' (e) {
       e.preventDefault();
       Router.go('editOrderGuideItem', {_id: this._id});
   } 
});