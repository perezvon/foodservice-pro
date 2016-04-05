Events = new Mongo.Collection('events');
Menus = new Mongo.Collection('menus');
MenuItems = new Mongo.Collection('menuItems');
Preps = new Mongo.Collection('preps');

var currentMenu;

if (Meteor.isClient) {
  
  Router.configure({
    layoutTemplate: 'main'
});
  
  Router.route('/',{
    name: 'home',
    template: 'home'
  });
  
  Router.route('/events');
  
  Router.route('/event/:_id', {
    name: 'editEvent',
    template: 'editEvent',
    data: function() {
        var currentEvent = this.params._id;
        return Events.findOne({_id: currentEvent});
    }
  });
  
    Router.route('/event', {
    name: 'newEvent',
    template: 'newEvent'
    });
    
    Router.route('/prep', {
      name: 'newPrep',
      template: 'newPrep'
    });
    

  Template.events.helpers({
    'listEvents': function(){
      return Events.find({}, {sort: {startDate:1}});
    }
  });

//reset prep page if user navigates away
Template.newPrep.rendered = function(){
  Session.set(currentMenu, '');
};

Template.newPrep.helpers({
    'getMenu': function(){
      console.log(Session.get(currentMenu));
      return Session.get(currentMenu);
    },
    
    'getMenuItemName': function(id){
      var result = MenuItems.findOne({_id: id});
      if (result) return result.name;
    }
  });
  
    Template.newPrep.events({
      'change [name="clientName"]': function(){
        var clientName = $('[name="clientName"]').val();
        Session.set(currentMenu, Menus.findOne({clientName: clientName, current: true}));
      },
      
  
    'submit form': function(e){
      e.preventDefault();
      for (var i = 0; i < e.target.length; i++){
        if ($(e.target[i]).is('[type="number"]')){
      console.log(e.target[i].getAttribute('class'), e.target[i].name, e.target[i].value);
        }
        if ($(e.target[i]).is('[type="checkbox"]')) {
      console.log(e.target[i].getAttribute('class'), e.target[i].name, e.target[i].checked);
        }
      };
      /* var clientName = $('[name="clientName"]').val(); 
      var prepDate = $('[name="prepDate"]').val(); 
      var contents = function(){
        
      };
      Preps.insert({
        clientName: clientName,
        prepDate: prepDate,
        contents: { contents();
          
        }
      }); */
    }
  });
  
  
      Template.newEvent.events({
       'submit form': function(e){
           e.preventDefault();
           var eventName = $('[name="eventName"]').val();
           var startDate = $('[name="startDate"]').val();
           var accountExec = $('[name="accountExec"]').val();
           var client = $('[name="client"]').val();
           Events.insert({
               name: eventName,
               startDate: startDate,
               createdDate: new Date(),
               accountExec: accountExec,
               client: client
           });
           $('[name="eventName"]').val('');
       }
    });
    
    Template.events.events({
      'click .event-list-view': function() {
        Router.go('editEvent', {_id: this._id}); 
      }
    });
}

