 
 Template.components.helpers({
    'componentsIndex': function (){ return componentsIndex; },
    'inputAttributes': function() {
      return {'class': 'form-control', 'id': 'search-components'};
    }
  });
  
Template.components.events({
  'click .component-list-view': function() {
        Router.go('editComponent', {_id: this._id}); 
      }  
});
 
Template.newComponent.events({
       'submit form': function(e){
           e.preventDefault();
           var name = $('#component-name').val();
           var description = $('#description').val();
           var unit = $('#unit').val();
           var cost = $('#cost').val();
           Meteor.call('newComponent', {
               name: name,
               description: description,
               unit: unit,
               cost: cost
       });
       }
    });
    
Template.editComponent.events({
        'keyup .form-control': function(event){
    if(event.which == 13 || event.which == 27){
        $(event.target).blur();
    } else {
        var currentComponent = this._id;
        var updateField = event.target.id;
        var updateVal = $(event.target).val();
        var update = {};
        update[updateField] = updateVal;
       Meteor.call('updateComponent', { _id: currentComponent }, {$set: update });
        }
    }
});