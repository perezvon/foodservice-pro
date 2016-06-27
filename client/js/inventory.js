Template.inventory.helpers({
   getMonthlyOrdering() {
       //get all items ordered in current month
       var month = moment().format("MM");
       var year = moment().format("YYYY");
       var monthStart = new Date(year, (month - 1), 1);
       var monthEnd = new Date(year, (month === 11 ? 0 : month), 1);
       var place = Session.get('place');
       if (place){
        var ordering = Ordering.find({
            place: place,
           orderHistory: {$elemMatch:{date: {$gte: monthStart, $lt: monthEnd}}}}, 
           {sort: {place: 1}
           }).fetch();
       } else {
           var ordering = Ordering.find({
           orderHistory: {$elemMatch:{date: {$gte: monthStart, $lt: monthEnd}}}}, 
           {sort: {place: 1}
           }).fetch();  
       }
         //to do: get all items that were in stock on last month's inventory, filter duplicate productId, add to ordering, return this
       //let stock = Inventory.find({month: month, qty: {$gt: 0}}).fetch();
       return ordering;
           
   },
   
   month() {
       return moment().format("MMMM YYYY");
   },
    places() {
       var distinctEntries = _.uniq(Ordering.find({}, {
        sort: {place: 1}, fields: {place: true}
        }).fetch().map(function(x) {       
            return x.place;
        }), true);
    return distinctEntries;
   }    
});

Template.inventory.events({
    'change select': function (e) {
        var place = $(e.target).val();
        Session.set('place', place);
        
    }
});