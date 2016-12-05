Meteor.subscribe('events');
Meteor.subscribe('menus');
Meteor.subscribe('menuItems');
Meteor.subscribe('ordering');
Meteor.subscribe('inventory');

Session.set("resize", null); 
Meteor.startup(function () {
  window.addEventListener('resize', function(){
    Session.set("resize", new Date());
  });
});