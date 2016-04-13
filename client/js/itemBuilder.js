Template.itemBuilder.onRendered(function() {
     Session.set('currentDataContext', Template.currentData());
     
     
     
    $('#item-build-dropzone tbody').sortable({
        helper: 'clone',
        start: function(e, ui){
          var dragging = ui.item.get(0).id;
          Session.set('draggingComponent', dragging);
        },
        update: function(e, ui){
            var before = ui.item.prev().get(0);
            var after = ui.item.next().get(0);
            var dragging = Session.get('draggingComponent');
            var currentMenuItem = Session.get('currentDataContext')._id;
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
        Meteor.call('updateMenuItem', {'_id': currentMenuItem, 'components._id': dragging}, {$set: {'components.$.rank': newRank}});
        }
     }).editableTableWidget(); //sortable && editable doesn't work -- why?
  
   //copy removal from menuBuilder when fixed
    
     $('#item-build-components tr').draggable({
        helper: 'clone',
        distance: 10,
        start: function(e, ui){
            var dragging = Blaze.getData(this)._id;
            Session.set('draggingComponent', dragging);
        }
     }).disableSelection();
     
     $('#item-build-dropzone').droppable({
         accept: '.drag-component',
         drop: function(e, ui){
             var dragging = Session.get('draggingComponent');
             var currentMenuItem = Session.get('currentDataContext')._id;
             Meteor.call('addComponentToMenuItem', currentMenuItem, dragging);
             ui.draggable.remove();
             ui.helper.remove();
         }
     }); 
 });
 
 Template.itemBuilder.helpers({
    'componentsIndex': function (){ return componentsIndex; },  
    'inputAttributes': function() {
      return {'class': 'form-control', 'id': 'search-components'};
    },
    'getMenuItemComponents': function() {
        var currentMenuItem = Session.get('currentDataContext')._id; 
        var components = MenuItems.findOne(currentMenuItem).components;
        
        if (components) {
            components = components.sort(function(a,b){
            return a.rank - b.rank;
        });
        return components;
    }
        else return false;
    }
  });