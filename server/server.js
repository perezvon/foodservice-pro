Meteor.publish('events', function (){
  return Events.find();
});

Meteor.publish('menus', function (){
  return Menus.find();
});

Meteor.publish('menuItems', function (){
  return MenuItems.find();
});

Meteor.publish('tags', function (){
  return Tags.find();
});

Meteor.methods({

newEvent: function(data){
  data.createdDate = new Date();
  Events.insert(data);
}, 
  
addMenuItemToEvent: function (event, data) {
    var menuItem = MenuItems.findOne({_id: data});
    var hasMenu = Events.findOne({_id: event}).menu;
    menuItem.rank = (hasMenu ? hasMenu.length + 1 : 1);
  Events.update({_id: event}, {$addToSet: {menu: menuItem}});  
},

updateEvent: function (event, data) {
  Events.update(event, data);
},

newMenuItem: function(data){
  data.createdDate = new Date();
  MenuItems.insert(data);
},

updateMenuItem: function(item, data){
  MenuItems.update(item, data);
}
});