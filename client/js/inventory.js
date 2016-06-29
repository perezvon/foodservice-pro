Template.inventory.onRendered(function(){
    Session.set('uploadCommand', 'newInventory');
    Session.set('place', '');
       $('#inventory tbody').editableTableWidget();
});

Template.inventory.helpers({
   getMonthlyOrdering() {
       //get all items ordered in current month
       var month = moment().format("MM");
       var year = moment().format("YYYY");
       var monthStart = new Date(year, (month - 1), 1);
       var monthEnd = new Date((month === 11 ? year + 1 : year), (month === 11 ? 0 : month), 1);
        var ordering = Ordering.find({
           orderHistory: {$elemMatch:{date: {$gte: monthStart, $lt: monthEnd}}}
        }).fetch();
       
       let stock = Inventory.findOne({month: month-1});
       if (stock){
           stock = stock.inventory.filter(function(obj){
        if (parseInt(obj.qty) > 0) return true;
       });
       ordering = ordering.concat(stock).sort(function(a, b){
               return a.name.localeCompare(b.name);
           });
           ordering = _.uniq(ordering, true, function(a){return a.productId;});
       }
       var place = Session.get('place');
       if (place) {
           ordering = ordering.filter(function(a){
               if (a.place == place) return true;
           });
       }
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