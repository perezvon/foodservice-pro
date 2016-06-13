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
       //to do: check if entered date is latest date, then check whether this price is different than item.price & update if needed
        data.date = moment($('#date').val()).toDate();
        data.qty = $('#qty').val();
        data.price = $('#price').val();
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
    }
});