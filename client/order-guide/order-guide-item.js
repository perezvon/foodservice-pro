Template.orderGuideItem.helpers({
    buttonText() {
      if (this._id) return "Save Item";
        else return "Create Item";
    },
    isSelected(value, property) {
        var selected = Template.parentData(1)[property];
      if (value == selected) return 'selected';
    },
    vendors() {
       var distinctEntries = _.uniq(Ordering.find({}, {
        sort: {vendor: 1}, fields: {vendor: true}
        }).fetch().map(function(x) {
            return x.vendor;
        }), true);
    return distinctEntries;
   },
   categories() {
       var distinctEntries = _.uniq(Ordering.find({}, {
        sort: {category: 1}, fields: {category: true}
        }).fetch().map(function(x) {
            return x.category;
        }), true);
    return distinctEntries;
   },
   subcategories() {
       var distinctEntries = _.uniq(Ordering.find({}, {
        sort: {subcategory: 1}, fields: {subcategory: true}
        }).fetch().map(function(x) {
            return x.subcategory;
        }), true);
    return distinctEntries;
   },
   places() {
       var distinctEntries = _.uniq(Ordering.find({}, {
        sort: {place: 1}, fields: {place: true}
        }).fetch().map(function(x) {
            return x.place;
        }), true);
    return distinctEntries;
   },
    inventoryCodes() {
       var distinctEntries = _.uniq(Ordering.find({}, {
        sort: {inventoryCode: 1}, fields: {inventoryCode: true}
        }).fetch().map(function(x) {
            return x.inventoryCode;
        }), true);
    return distinctEntries;
   },
    units() {
       var distinctEntries = _.uniq(Ordering.find({}, {
        sort: {unit: 1}, fields: {unit: true}
        }).fetch().map(function(x) {
            return x.unit;
        }), true);
    return distinctEntries;
   }
});

Template.orderGuideItem.events({
   'submit form': function(e) {
       e.preventDefault();
       var inputs;
        var data = {};
        $('form').each(function(){
            inputs = ($(this).find(':input'));
        });
        for (var i=0; i< inputs.length; i++){
            if (inputs.get([i]).id !== "") {
            data[inputs.get([i]).id] = inputs.get([i]).value;
            }
        }
       if (this._id) {
           var item = {_id: this._id};
           Meteor.call('editOrderGuideItem', item, {$set:data}, function(error){
               if (error) Bert.alert(error.reason, 'danger');
               else {
                   Bert.alert('Item updated.', 'success');
                   Router.go('orderGuide');
               }
           });
       } else {
        Meteor.call('newOrderGuideItem', data, function(error){
               if (error) Bert.alert(error.reason, 'danger');
               else {
                   Bert.alert('Item created.', 'success');
                   Router.go('newInvoice');
               }
           });
       }
   } 
});