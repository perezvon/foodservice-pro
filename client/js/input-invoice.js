Template.newInvoice.helpers({
    vendors() {
       var distinctEntries = _.uniq(Ordering.find({}, {
        sort: {vendor: 1}, fields: {vendor: true}
        }).fetch().map(function(x) {
            return x.vendor;
        }), true);
    return distinctEntries;
   },
   'orderingIndex': function (){ return orderingIndex; },
    'order-guide': function(){
      return Ordering.find({});
    }, 
    'inputAttributes': function() {
      return {'class': 'form-control', 'id': 'productId'};
    },
    today() {
        return moment().format("YYYY-MM-DD");
    }
});


Template.newInvoice.events({
   'submit form': function (e) {
        e.preventDefault();
        var currentId = $('#_id').val();
        var data = {};
       //get date & price history
       let currentItem = Ordering.findOne({_id: currentId}, {
            fields: {orderHistory: true}
        });
       
        let itemHistory = [];
       if (currentItem.orderHistory){
            let curr = currentItem.orderHistory; 
            for (let i = 0; i < curr.length; i++){
            let price = parseInt((curr[i].price)).toFixed(2);
            itemHistory.push({date: moment(curr[i].date).toDate(), price: price});
            }
            itemHistory = _.sortBy(itemHistory, 'date').reverse();
           console.log(itemHistory);
        }
        data.date = moment($('#date').val()).toDate();
        data.qty = $('#qty').val();
        data.price = $('#price').val();
        //check if entered date is latest date, then check whether this price is different than item.price & update if needed
        if (data.date > itemHistory[0].date) {
            if (data.price !== itemHistory[0].price) {
                Meteor.call('updateOrderGuide', {_id: currentId}, {$set: {price: parseFloat(data.price)}});
            }    
        }
       //add the order record to the item's history
        Meteor.call('updateOrderGuide', {_id: currentId}, {$addToSet:{orderHistory: data}}, function(error){
              if (error) Bert.alert(error.reason, 'danger');
              else {
                  Bert.alert('Item entered.', 'success', 'growl-top-right');
               }
           });
    },
    
    'click .inventory-item': function (e) {
        let currentId = e.target.parentElement.dataset.id;
        let currentItem = Ordering.findOne({_id: currentId});
        let price = currentItem.price;
        let name = currentItem.name;
        $('.form-group').removeClass('hidden');
        $('#_id').val(currentId);
        $('#price').val(price);
        $('#name').text(name);
    },
    
    'change select': function (e) {
        orderingIndex.getComponentMethods()
            .addProps('vendor', $(e.target).val());
    },
    
    'click .add-item': function () {
        Router.go('newOrderGuideItem');
    }
});