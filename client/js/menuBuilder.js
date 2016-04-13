Template.menuBuilder.onRendered(function() {
     Session.set('currentDataContext', Template.currentData());
     
     $('#menu-build-dropzone tbody').sortable({
        helper: 'clone',
        start: function(e, ui){
          var dragging = ui.item.get(0).id;
          Session.set('draggingMenuItem', dragging);
        },
        update: function(e, ui){
            var before = ui.item.prev().get(0);
            var after = ui.item.next().get(0);
            var dragging = Session.get('draggingMenuItem');
            var currentEvent = Session.get('currentDataContext')._id;
            var newRank;
          if(!before) {
            newRank = Blaze.getData(after).rank - 1;
          } else if(!after) {
            newRank = Blaze.getData(before).rank + 1;
          }
          else {
            //else take the average of the two ranks of the previous
            // and next elements
            newRank = (Blaze.getData(after).rank +
                       Blaze.getData(before).rank)/2;
          }
        Meteor.call('updateEvent', {'_id': currentEvent, 'menu._id': dragging}, {$set: {'menu.$.rank': newRank}});
        }
     }).disableSelection();
  
   //disabling for now -- removes menu item even when dropping onto #menu-build-dropzone tbody  
   
 /*  $('body:not(#menu-build-dropzone tbody)').droppable({
        accept: '.remove-item',
         drop: function(e, ui){
             var dragging = Session.get('draggingMenuItem');
             var currentEvent = Session.get('currentDataContext')._id;
             //remove the dragged element from db
             Meteor.call('updateEvent', {_id: currentEvent}, {$pull: {menu: {_id: dragging}}});
         }
    }); */
    
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
        
        if (menu) {
            menu = menu.sort(function(a,b){
            return a.rank - b.rank;
        });
        return menu;
    }
        else return false;
    }
  });