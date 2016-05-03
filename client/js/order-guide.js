Template.orderGuide.onRendered(function(){
    //should automatically refresh when a new item is added to Ordering but does not.
    this.autorun(function(){
     $('#order-guide').editableTableWidget();
    });
});

Template.orderGuide.helpers({
    'orderingIndex': function (){ return orderingIndex; },
    'order-guide': function(){
      return Ordering.find({});
    }, 
    'inputAttributes': function() {
      return {'class': 'form-control', 'id': 'search-ordering-guide'};
    },
    
    'pricePerUnit': function(price, unit){
        return (price / unit).toFixed(2);
    }
});

Template.orderGuide.events({
   'click .add-line': function(){
       $('#order-guide > tbody:last-child').append('<tr class="ordering-guide-view"><td></td><td>New Item</td><td></td><td></td><td></td></tr>');
        //until autorun works, make sure new item can be edited
       $('#order-guide').editableTableWidget();
       
   }, 
   
   'change #order-guide td': function(e, t){
       var field = e.target.dataset.field;
       var newValue = e.target.textContent;
       var query = {};
       query[field] = newValue;
       e.target.textContent = '';
       Meteor.call('updateOrderGuide', {_id: this._id}, {$set: query});
   }
});