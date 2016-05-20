Meteor.publish('events', function (){
  return Events.find();
});

Meteor.publish('menus', function (){
  return Menus.find();
});

Meteor.publish('menuItems', function (){
  return MenuItems.find({status: {$ne: 'deleted'}});
});

Meteor.publish('components', function (){
  return Components.find();
});

Meteor.publish('ordering', function (){
  return Ordering.find();
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
    menuItem.quantity = Events.findOne({_id: event}).guestCount;
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
},

newComponent: function(data){
  Components.insert(data);
},

updateComponent: function(item, data){
  Components.update(item, data);
},

updateOrderGuide: function(item, data){
  Ordering.update(item, data, {upsert: true}); 
},

addComponentToMenuItem: function(item, data){
    var component = Components.findOne({_id: data});
    var hasComponents = MenuItems.findOne({_id: item}).components;
    component.rank = (hasComponents ? hasComponents.length + 1 : 1);
  MenuItems.update({_id: item}, {$addToSet: {components: component}});  

},

parseUpload: function(data) {
    check(data, Array);
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      Ordering.insert(item);
    }
  }

});