 
 Template.menuItems.helpers({
    'menuItemsIndex': function (){ return menuItemsIndex; },
    'inputAttributes': function() {
      return {'class': 'form-control', 'id': 'search-menu-items'};
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
   
           MenuItems.insert({
               name: name,
               type: type,
               tags: tags,
               description: description,
               cost: cost,
               price: price,
               image: image,
               createdDate: new Date()
           });
       },

      'click .item-list-view': function() {
        Router.go('editMenuItem', {_id: this._id}); 
      }
    });