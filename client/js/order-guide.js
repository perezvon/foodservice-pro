Template.orderGuide.onRendered(function(){
    //should automatically refresh when a new item is added to Ordering, but does not.
    /*this.autorun(function(){
        var orderingGuideTrack = function(){
            return Ordering.find().fetch();
        };
        if (orderingGuideTrack())
     $('#order-guide tbody').editableTableWidget();
    });*/
    orderingIndex.getComponentMethods()
            .removeProps('vendor');
});

Template.orderGuide.helpers({
    'orderingIndex': function (){ return orderingIndex; },
    'order-guide': function(){
      return Ordering.find({});
    }, 
    'inputAttributes': function() {
      return {'class': 'form-control', 'id': 'search-ordering-guide'};
    },
    
    'pricePerUnit': function(price, pack, size, unit){
        var result =  (price / (pack * size)).toFixed(2);
        if (!isNaN(result)) return "$" + result + " / " + unit;
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
   }
});