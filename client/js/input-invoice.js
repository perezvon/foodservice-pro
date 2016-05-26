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
    }
});


Template.newInvoice.events({
   'submit form': function(e){
        e.preventDefault();
        var currentId = $('#_id').val();
        var data = {};
        data.date = moment($('#date').val()).toDate();
        data.qty = $('#qty').val();
        data.price = $('#price').val();
        Meteor.call('updateOrderGuide', {_id: currentId}, {$addToSet:{orderHistory: data}}, function(error){
              if (error) Bert.alert(error.reason, 'danger');
              else {
                  Bert.alert('Item entered.', 'success', 'growl-top-right');
               }
           });
    }
});