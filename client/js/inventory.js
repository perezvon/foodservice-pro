Template.inventory.helpers({
   getMonthlyOrdering() {
       //get all items ordered in current month
       var month = moment().format("MM");
       var year = moment().format("YYYY");
       var monthStart = new Date(year, month, 1);
       var monthEnd = new Date(year, (month === 12 ? 1 : month + 1), 1);
       var ordering = Ordering.find({
           orderHistory: {$elemMatch:{date: {$gte: monthStart, $lt: monthEnd}}}}, 
           {fields: {name: 1, place: 1, orderHistory: 1}}, 
           {sort: {place: 1}
           }).fetch();
       return ordering;
       //to do: get all items that were in stock on last month's inventory, filter duplicate productId, add to ordering, return this
       //let stock = Inventory.find({month: month, qty: {$gt: 0}}).fetch();
   } 
});

Template.inventory.events({
    'click .print-pdf': function () {
    //make a pdf and open in new window.
        
    }
})