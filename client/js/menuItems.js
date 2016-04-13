 
 Template.menuItems.helpers({
    'menuItemsIndex': function (){ return menuItemsIndex; },
    'inputAttributes': function() {
      return {'class': 'form-control', 'id': 'search-menu-items'};
    }
  });
  
Template.menuItems.events({
  'click .item-list-view': function() {
        Router.go('editMenuItem', {_id: this._id}); 
      }  
});
 
Template.newMenuItem.events({
       'submit form': function(e){
           e.preventDefault();
           var name = $('#menu-item-name').val();
           var type = $('#type').val();
           var tags = $('#tags').val();
           var image = $('#image').val();
           var cost = $('#cost').val();
           var price = $('#price').val();
           var description = $('#description').val();
   
           Meteor.call('newMenuItem', {
               name: name,
               type: type,
               tags: tags,
               description: description,
               cost: cost,
               price: price,
               image: image
           });
       }
    });
    
Template.editMenuItem.events({
        'keyup .form-control': function(event){
    if(event.which == 13 || event.which == 27){
        $(event.target).blur();
    } else {
        var currentMenuItem = this._id;
        var updateField = event.target.id;
        var updateVal = $(event.target).val();
        var update = {};
        update[updateField] = updateVal;
        console.log(update);
       Meteor.call('updateMenuItem', { _id: currentMenuItem }, {$set: update });
        }
    }
});