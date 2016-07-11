Template.inventory.onRendered(function () {
    Session.set('uploadCommand', 'newInventory');
    Session.set('place', '');
    $('#inventory tbody').editableTableWidget();
});

Template.inventory.helpers({
   	getMonthlyOrdering () {
		var currentMonth = Template.currentData();
       var month = (currentMonth ? currentMonth : moment().format("MM"));
       console.log(month);
		//check whether there is an Inventory for the selected month
		var isInventory = Inventory.findOne({month: month}); 
		if (isInventory) {
			return isInventory.inventory;
		} else {
       //get all items ordered in current month
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
       $("#inventory tbody").editableTableWidget();
       return ordering;
		}
   },
   
   getMonth() {
    return moment().format("MMMM YYYY");
   },
    inventories () {
      return Inventory.find().fetch();  
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
    'change #place': function (e) {
        let place = $(e.target).val();
        Session.set('place', place);
        
    }, 
    
    'change #past-inventory': function (e) {
        let currentInventory = {};
        currentInventory.month = $(e.target).val();        Router.go('pastInventory', currentInventory);
    },
    
    'click .save': function (e) {
        e.preventDefault();
        let result = {};
        let month = moment().format("MM");
        let inventory = [];
        $('#inventory tbody tr').each(function(){
            $this = $(this);
            let data = {};
            $this.children().each(function(){
                $that = $(this);
                let key = $that.data("field");
                let value = $that.html();
                data[key] = value;
                });
            inventory.push(data);
        });
            result.month = month;
            result.inventory = inventory;
            Meteor.call('newInventory', result, function(error){
                if (error) Bert.alert(error.reason, 'danger');
                else {
                    Bert.alert('Inventory saved.', 'success');
                    Router.go('orderGuide');
                }
            });
    }
});