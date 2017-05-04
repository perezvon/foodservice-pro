Template.inventory.onRendered(function () {
    Session.set('uploadCommand', 'saveInventory');
    Session.set('place', '');
    $('#inventory tbody').editableTableWidget();
});

Template.inventory.helpers({
   	getMonthlyOrdering () {
       let month = (Template.currentData() ? Template.currentData().month : moment().format("MM"));
        let year = (Template.currentData() ? Template.currentData().year : moment().format("YYYY"));
		//check whether there is an Inventory for the selected month
		let isInventory = Inventory.findOne({year: year, month: month});
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
       let year = (Template.currentData() ? Template.currentData().year : moment().format("YYYY"));
       let monthStart = new Date(year, (month - 1), 1);
       let monthEnd = new Date((month === 11 ? year + 1 : year), (month === 11 ? 0 : month), 1);
        let ordering = Ordering.find({
           orderHistory: {$elemMatch:{date: {$gte: monthStart, $lt: monthEnd}}}
        }).fetch();

		let lastMonth = (month-1 < 10 ? "0" + (month-1) : month-1);
            if (lastMonth === "00") lastMonth = "12";
       let stock = Inventory.findOne({month: lastMonth});
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
	   let currentMonth = (Template.currentData() ? moment(Template.currentData().month).format("MMMM") + " " + Template.currentData().year : moment().format("MMMM YYYY"));
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
        currentInventory.year = $(e.target).val().slice(0,4);
        currentInventory.month = $(e.target).val().slice(4);
        Router.go('pastInventory', {year: currentInventory.year, month: currentInventory.month});
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
  'click #sync': function (e) {
		e.preventDefault();
		  let inventoryData = Template.inventory.__helpers.get('getMonthlyOrdering').call();
      let updatedInventory = [];
      let month = Template.currentData().month;
      let year = Template.currentData().year;
      inventoryData.forEach(item => {
        let temp = Ordering.findOne({_id: item._id});
        let newItem = item;
        if (temp) {
          newItem.pack = temp.pack;
          newItem.size = temp.size;
          newItem.unit = temp.unit;
        }
        updatedInventory.push(newItem);
      })
      Meteor.call('updateInventory', {month: month, year: year}, {inventory: updatedInventory})
	},

    'click .save': function (e) {
        e.preventDefault();
        let result = {};
        let currentMonth = Template.currentData().month;
        let currentYear = Template.currentData().year;
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
            result.year = currentYear;
            result.inventory = inventory;
            Meteor.call('saveInventory', {month: currentMonth, year: currentYear}, result, function(error){
                if (error) Bert.alert(error.reason, 'danger');
                else {
                    Bert.alert('Inventory saved.', 'success');
                    Router.go('orderGuide');
                }
            });
    }
});
