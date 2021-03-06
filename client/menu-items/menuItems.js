 
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
           var cost = $('#cost').val();
           var price = $('#price').val();
           var description = $('#description').val();
   
           Meteor.call('newMenuItem', {
               name: name,
               type: type,
               tags: tags,
               description: description,
               cost: cost,
               price: price
           }, function(error){
               if (error) Bert.alert(error.reason, 'danger');
               else {
                   Bert.alert('Menu Item created.', 'success');
                   Router.go('menuItems');
                }
            });
       }
    });
    
Template.editMenuItem.events({
        'keyup .form-control': function(e){
    if(e.which == 13 || e.which == 27){
        $(e.target).blur();
    }
    }, 
    
    'blur .form-control': function(e){
        var currentMenuItem = this._id;
        var updateField = e.target.id;
        var updateVal = $(e.target).val();
        var update = {};
        update[updateField] = updateVal;
        console.log(update);
       Meteor.call('updateMenuItem', { _id: currentMenuItem }, {$set: update });
        },
        
        'click .delete': function(e){
            var currentMenuItem = this._id;
            var update = {'status': 'deleted'};
            console.log(update);
            Meteor.call('updateMenuItem', {_id: currentMenuItem}, {$set: update}, 
                function(err, res){
                if (err)
                    Bert.alert(err.reason, 'danger');
                else 
                    Router.go('menuItems');
            });
        }
});