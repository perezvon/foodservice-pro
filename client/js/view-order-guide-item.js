//chart is giving this error: Cannot read property 'width' of undefined
// makes me think it's trying to create it before it's rendered, which I thought putting in onRendered would explicitly avoid.

/*Template.viewOrderGuideItem.onRendered (function () {
    var ctx = $("#myChart");
    var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
    });
});*/

Template.viewOrderGuideItem.helpers ({
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
                    //this returns 1 for each month, but what I really want is (# of cases ordered this year / 12)
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
});