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

newEvent (data){
  data.createdDate = new Date();
  Events.insert(data);
}, 
  
addMenuItemToEvent (event, data) {
    var menuItem = MenuItems.findOne({_id: data});
    var hasMenu = Events.findOne({_id: event}).menu;
    menuItem.rank = (hasMenu ? hasMenu.length + 1 : 1);
    menuItem.quantity = Events.findOne({_id: event}).guestCount;
  Events.update({_id: event}, {$addToSet: {menu: menuItem}});  
},

updateEvent (event, data) {
  Events.update(event, data);
},

newMenuItem (data){
  data.createdDate = new Date();
  MenuItems.insert(data);
},

updateMenuItem (item, data){
  MenuItems.update(item, data);
},

newComponent (data){
  Components.insert(data);
},
    
newOrderGuideItem (data) {
    Ordering.insert(data);
},

updateComponent (item, data){
  Components.update(item, data);
},

updateOrderGuide (item, data){
  Ordering.update(item, data, {upsert: true}); 
},

addComponentToMenuItem (item, data){
    var component = Components.findOne({_id: data});
    var hasComponents = MenuItems.findOne({_id: item}).components;
    component.rank = (hasComponents ? hasComponents.length + 1 : 1);
  MenuItems.update({_id: item}, {$addToSet: {components: component}});  

},

parseUpload (data) {
    check(data, Array);
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      Ordering.insert(item);
    }
  },
    
printPDF (page, file) {
    webshot(page, file, function (err) {
    if(err) throw err;
    console.log('Saved to PDF');
});
}

});