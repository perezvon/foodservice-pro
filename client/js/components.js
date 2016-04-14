 
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
        'keyup .form-control': function(e){
    if(e.which == 13 || e.which == 27){
        $(e.target).blur();
    }
    }, 
    
    'blur .form-control': function(e){
        var currentComponent = this._id;
        var updateField = e.target.id;
        var updateVal = $(e.target).val();
        var update = {};
        update[updateField] = updateVal;
        console.log(update);
       Meteor.call('updateComponent', { _id: currentComponent }, {$set: update });
        }
});