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
       var monthEnd = new Date((month === 11 ? year : year+1), (month === 11 ? 0 : month), 1);
        var ordering = Ordering.find({
           orderHistory: {$elemMatch:{date: {$gte: monthStart, $lt: monthEnd}}}}, 
           {sort: {place: 1, name: 1}
           }).fetch();
         //to do: get all items that were in stock on last month's inventory, filter duplicate productId, add to ordering, return this
       let stock = Inventory.findOne({month: month-1}).inventory.filter(function(obj){
        if (parseInt(obj.qty) > 0) return true;
       });
       ordering = ordering.concat(stock).reduce(function(a,b){
        if (a.productId !== b.productId ) a.push(b);
        return a;
        },[]);
       var place = Session.get('place');
       console.log(place);
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