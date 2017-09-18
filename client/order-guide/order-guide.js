Template.orderGuide.onRendered(function(){
    //should automatically refresh when a new item is added to Ordering, but does not.
    /*this.autorun(function(){
        var orderingGuideTrack = function(){
            return Ordering.find().fetch();
        };
        if (orderingGuideTrack())
     $('#order-guide tbody').editableTableWidget();
    });*/
    Session.set('uploadCommand', 'newOrderGuideItem');
	Session.set('sortDirection', false);
    orderingIndex.getComponentMethods()
            .removeProps('vendor');
});

Template.orderGuide.helpers({
    vendors() {
       var distinctEntries = _.uniq(Ordering.find({}, {
        sort: {vendor: 1}, fields: {vendor: true}
        }).fetch().map(function(x) {
            return x.vendor;
        }), true);
    return distinctEntries;
   },
    orderingIndex() { return orderingIndex; },
    'order-guide'() {
      return Ordering.find({});
    },
    inputAttributes() {
      return {'class': 'form-control', 'id': 'search-ordering-guide'};
    },

    pricePerUnit(price, pack, size, unit){
        if (price && pack && size) {
        var result =  (price / (pack * size)).toFixed(2);
        if (!isNaN(result)) return "$" + result + " / " + unit;
        }
    },

    conditionalStyling (item) {
        let currentItem = Ordering.findOne({_id: item, orderHistory: {$exists: true}}, {fields: {orderHistory: 1}});
        if (currentItem) {
          currentItem = currentItem.orderHistory;
                        let dates = [];
                        for (let i = 0; i < currentItem.length; i++){
                            dates.push(currentItem[i].date);
                            }
                        dates.sort(function(a, b){
                        return b - a;
                        });
                        let lastOrderedDate = moment(dates[0]).format("MM/DD/YYYY");
						let daysElapsed = moment().diff(lastOrderedDate, 'days');
                    if (daysElapsed < 60) return 'success';
					else if (daysElapsed > 60 && daysElapsed < 120) return 'warning';
					else return 'danger';
		}
    },
	lastOrdered (item) {
	let currentItem = Ordering.findOne({_id: item, orderHistory: {$exists: true}}, {fields: {orderHistory: 1}});
        if (currentItem) {
          currentItem = currentItem.orderHistory;
                        let dates = [];
                        for (let i = 0; i < currentItem.length; i++){
                            dates.push(currentItem[i].date);
                            }
                        dates.sort(function(a, b){
                        return b - a;
                        });
                        let lastOrderedDate = moment(dates[0]).format("MM/DD/YYYY");
						let daysElapsed = moment().diff(lastOrderedDate, 'days');
                    return lastOrderedDate;
		}
	},
       orderQty (item) {
	let currentItem = Ordering.findOne({_id: item, orderHistory: {$exists: true}}, {fields: {orderHistory: 1, unit: 1, size: 1}});
        if (currentItem) {
                    let totalOrdered = 0;
                        for (let i = 0; i < currentItem.orderHistory.length; i++){
                                totalOrdered += eval(currentItem.orderHistory[i].qty);
                        }
		   			let currentUnit = currentItem.unit === 'lb' && currentItem.size == 1 ? 'lb' : 'cs';
                        return totalOrdered + ' ' + currentUnit;
	   }
	},
  thisWeekEnd () {
    return moment().subtract(7, 'days').endOf('Week').format('MMMM DD, YYYY')
  },
  weeklySpend () {
    const currentWeekStart = moment().subtract(7, 'days').startOf('Week').toDate();
    const currentWeekEnd = moment().subtract(7, 'days').endOf('Week').toDate();
    let accumulator = 0;
    console.log(currentWeekStart, currentWeekEnd)
    const orderData = Ordering.find({
       orderHistory: {$elemMatch:{date: {$gte: currentWeekStart, $lt: currentWeekEnd}}}
    }, {fields: {orderHistory: 1}}).fetch();
    const newData = orderData.map(x => x.orderHistory)
    newData.forEach((arr) => {
      arr.forEach(x => {
        if (x.date >= currentWeekStart && x.date < currentWeekEnd) {
          accumulator += parseFloat(x.price) * parseInt(x.qty)
        }
      })
  })
    return accumulator.toFixed(2);
  }
});

Template.orderGuide.events({
   'click .add-line': function(){
       var newId = new Mongo.ObjectID()._str;
       $('#order-guide > tbody:last-child').append('<tr class="ordering-guide-view" data-id="' + newId +'"><td data-field="itemId"></td><td data-field="name">New Item</td><td data-field="pack"></td><td data-field="price"></td><td></td></tr>');
        //until autorun works, make sure new item can be edited
    //   $('#order-guide tbody').editableTableWidget();

   },

    'focus #order-guide tbody td': function (e) {
       var currentId = e.target.parentElement.dataset.id;
       //var currentId = (newId ? newId : this._id);
       Session.set('currentOrderGuideId', currentId);
   },

   'click #order-guide tbody td': function (e) {
       var currentId = e.target.parentElement.dataset.id;
       Modal.show('viewOrderGuideItem', function(){
           return Ordering.findOne({_id: currentId});
           });
   },

  'change #order-guide td': function(e, t){
       var currentId = Session.get('currentOrderGuideId');
       var field = e.target.dataset.field;
       var newValue = e.target.textContent;
       var query = {};
       query[field] = newValue;
       Meteor.call('updateOrderGuide', {_id: currentId}, {$set: query});
       e.target.textContent = '';
   },

   'click .new-invoice': function () {
       Router.go('newInvoice');
   },

   'click .inventory': function () {
       Router.go('inventory');
   },

	'click .reports': function () {
       Router.go('reports');
   },

   'click .cleanup': function () {
     orderingIndex.getComponentMethods()
      .addProps('showEmptyItems', true);
   },

    'change select': function (e) {
        orderingIndex.getComponentMethods()
            .addProps('vendor', $(e.target).val());
    },
	'click .table-header > td': function (e) {
		Session.set('sortDirection', !Session.get('sortDirection'));
		const sortValue = Session.get('sortDirection') ? e.target.dataset.sort + 'Asc' : e.target.dataset.sort + 'Desc';
		orderingIndex.getComponentMethods().addProps('sortBy', sortValue);
	}
});
