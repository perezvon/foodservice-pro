Meteor.publish('events', function (){
  return Events.find();
});

Meteor.publish('menus', function (){
  return Menus.find();
});

Meteor.publish('menuItems', function (){
  return MenuItems.find();
});

Meteor.methods({
addMenuItemToEvent: function (event, data) {
    var menuItem = MenuItems.findOne({_id: data});
    console.log(menuItem);
  Events.update({_id: event}, {$addToSet: {menu: menuItem}});  
}
});