Template.viewOrderGuideItem.helpers ({
    ordering(result) {
        let currentItem = Ordering.findOne({_id: this._id}, {
            fields: {orderHistory: true}
        });
        if (currentItem.orderHistory){
            let dates = [];
            for (let i = 0; i < currentItem.orderHistory.length; i++){
                dates.push(currentItem.orderHistory[i].date);
                }
                dates.sort(function(a, b){
                    return b - a;
                });
            switch (result) {
                case "lastOrdered": 
                    let lastOrderedDate = moment(dates[0]).format("MM/DD/YYYY");
                    return lastOrderedDate;
                    break;
                case "orderFrequency":
                    let datesByMonth = [];
                    for (let i = 0; i < dates.length; i++){
                        let m = moment(dates[i]).format("MM");
                        datesByMonth.push(m);
                    }
                    return ((datesByMonth) ? (datesByMonth.length / 12).toFixed(2) + " / Month" : "never ordered");
                    break;
                case "priceTrend":
                    let trend = [];
                    for (let i = 0; i < currentItem.orderHistory.length; i++){
                        let curr = currentItem.orderHistory[i];
                        trend.push({date: moment(curr.date).format("MM/DD/YYYY"), price: curr.price});
                     }
                    return trend;
                    break;
            }
        }
    }
});