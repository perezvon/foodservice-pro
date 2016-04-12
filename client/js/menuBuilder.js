Template.menuBuilder.onRendered(function() {
     Session.set('currentDataContext', Template.currentData());
     
     $('#menu-build-dropzone tbody').sortable({
        appendTo: 'parent',
        helper: 'clone',
        update: function(e, ui){
            console.log(ui);
        }
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
             var dragging = Session.get('draggingMenuItem');
             var currentEvent = Session.get('currentDataContext')._id;
             Meteor.call('addMenuItemToEvent', currentEvent, dragging);
             ui.draggable.remove();
             ui.helper.remove();
         }
     }); 
 });
 
 Template.menuBuilder.helpers({
    'menuItemsIndex': function (){ return menuItemsIndex; },  
    'inputAttributes': function() {
      return {'class': 'form-control', 'id': 'search-menu-items'};
    },
    'getEventMenu': function() {
        var currentEvent = Session.get('currentDataContext')._id; 
        var menu = Events.findOne(currentEvent).menu;
        return menu;
    }
  });