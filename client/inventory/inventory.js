Template.inventory.onRendered(function () {
    Session.set('uploadCommand', 'saveInventory');
    Session.set('place', '');
    $('#inventory tbody').editableTableWidget();
});

Template.inventory.helpers({
	isInventory () {
		let currentMonth = Template.currentData();
		let month = (currentMonth ? currentMonth : moment().format("MM"));
		let isInventory = Inventory.findOne({month: month});
		if (isInventory) return true;
		else return false;
	},
	
   	getMonthlyOrdering () {
		let currentMonth = Template.currentData();
       let month = (currentMonth ? currentMonth : moment().format("MM"));
		//check whether there is an Inventory for the selected month
		let isInventory = Inventory.findOne({month: month}); 
		if (isInventory) {
			let thisMonthInventory = isInventory.inventory;
			let place = Session.get('place');
       		if (place) {
				return thisMonthInventory.filter(function(a){
               if (a.place == place) return true;
           }).sort(function(a, b){
                    if (a.place && a. name){
					return a.place.localeCompare(b.place) ||
                a.name.localeCompare(b.name);
                    }
           });
			} else {
				return thisMonthInventory.sort(function(a, b){
                    if (a.place && a. name){
					return a.place.localeCompare(b.place) ||
                a.name.localeCompare(b.name);
                    }
           });
			}
		} else {
       //get all items ordered in current month
       let year = moment().format("YYYY");
       let monthStart = new Date(year, (month - 1), 1);
       let monthEnd = new Date((month === 11 ? year + 1 : year), (month === 11 ? 0 : month), 1);
        let ordering = Ordering.find({
           orderHistory: {$elemMatch:{date: {$gte: monthStart, $lt: monthEnd}}}
        }).fetch();
       
		let lastMonth = (month-1 < 10 ? "0" + (month-1) : month-1);
       let stock = Inventory.findOne({month: lastMonth});
            console.log(stock);
       if (stock){
           stock = stock.inventory.filter(function(obj){
        if (parseFloat(obj.qty) > 0) return true;
       });
       ordering = ordering.concat(stock).sort(function(a, b){
           if (a.place && a. name){
		   return a.place.localeCompare(b.place) ||
                a.name.localeCompare(b.name);
           }
           });
           ordering = _.uniq(ordering, true, function(a){return a.productId;});
       }
       let place = Session.get('place');
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
	   let currentMonth = (Template.currentData() ? moment(Template.currentData()).format("MMMM") + " 2016" : moment().format("MMMM YYYY"));
    return currentMonth;
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
        $("#inventory tbody").editableTableWidget();
    }, 
    
    'change #past-inventory': function (e) {
        let currentInventory = {};
        currentInventory.month = $(e.target).val();        Router.go('pastInventory', currentInventory);
    },
    
	'click #export': function (e) {
		e.preventDefault();
		let inventoryData = Template.inventory.__helpers.get('getMonthlyOrdering').call();	
		Meteor.call('exportToCSV', inventoryData, function (err, res) {
					if (err) {
			Bert.alert(err.reason, 'warning');
		} else {
			if (res) {
				var csvData = new Blob([res], {type: 'text/csv;charset=utf-8;'});
var csvURL = window.URL.createObjectURL(csvData);
var tempLink = document.createElement('a');
tempLink.href = csvURL;
tempLink.setAttribute('download', 'inventory.csv');
tempLink.click();
			}
		}
					});
	},
	
    'click .save': function (e) {
        e.preventDefault();
        let result = {};
        let currentMonth = Template.currentData();
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
            result.month = currentMonth;
            result.inventory = inventory;
            Meteor.call('saveInventory', currentMonth, result, function(error){
                if (error) Bert.alert(error.reason, 'danger');
                else {
                    Bert.alert('Inventory saved.', 'success');
                    Router.go('orderGuide');
                }
            });
    }
});