 Template.menuBuilder.onRendered(function() {
     $('#menu-build-dropzone tbody').sortable({
        appendTo: 'parent',
        helper: 'clone'
     }).disableSelection();
     
     $('#menu-build-items tr').draggable({
        helper: 'clone',
        distance: 10,
        start: function(e, ui){
            var dragging = Blaze.getData(this)._id;
            Session.set('draggingMenuItem', dragging);
        }
     }).disableSelection();
     
     $('#menu-build-dropzone').droppable({
         accept: '.drag-menu-item',
         drop: function(e, ui){
             $('#menu-build-dropzone table tr:last').after('<tr>' + ui.draggable.html() + '</tr>');
             var dragging = Session.get('draggingMenuItem');
            //erroring: need parent of parent -- var currentMenu = Template.parentData(0)._id; 
            var currentMenu = '';
            Meteor.call('updateEventMenu', currentMenu, dragging);
             ui.draggable.remove();
             ui.helper.remove();
         }
     });
 });
 
 Template.menuItems.helpers({
    'menuItemsIndex': function (){ return menuItemsIndex; },
    'inputAttributes': function() {
      return {'class': 'form-control', 'id': 'search-menu-items'};
    }
  });
  
 Template.menuBuilder.helpers({
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
       }
    });
    
        Template.menuItems.events({
      'click .item-list-view': function() {
        Router.go('editMenuItem', {_id: this._id}); 
      }
    });