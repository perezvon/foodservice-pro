Template.registerHelper('totalCost', function(){
    var currentEvent = Template.parentData(0)._id;
    var result = Events.findOne({_id: currentEvent}).menu;
    var cost = 0;
    result.forEach(function(each){
        cost += eval(each.cost);
    });
    return cost;
});

Template.registerHelper('totalPrice', function(){
    var currentEvent = Template.parentData(0)._id;
    var result = Events.findOne({_id: currentEvent}).menu;
    var price = 0;
    result.forEach(function(each){
        price += eval(each.price);
    });
    return price;
});