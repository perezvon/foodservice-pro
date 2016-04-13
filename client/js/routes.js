  Router.configure({
    layoutTemplate: 'main',
    loadingTemplate: 'loading'
});
  
  Router.route('/',{
    name: 'home',
    template: 'home'
  });
  
  Router.route('/events');
  
  Router.route('/event/:_id', {
    name: 'editEvent',
    template: 'editEvent',
   waitOn: function() {
      return this.subscribe('events');
    }, 
    data: function() {
        var currentEvent = this.params._id;
        return Events.findOne({_id: currentEvent});
    }
  });
  
    Router.route('/event', {
    name: 'newEvent',
    template: 'newEvent'
    });
    
    Router.route('/menuItems');
    
    Router.route('/menuItem', {
      waitOn: function() {
        return this.subscribe('tags');
      },
    name: 'newMenuItem',
    template: 'newMenuItem'
    });
    
    Router.route('/menuItem/:_id', {
    name: 'editMenuItem',
    template: 'editMenuItem',
    waitOn: function() {
      return [this.subscribe('menuItems'), this.subscribe('tags')];
    },
    data: function() {
        var currentItem = this.params._id;
        return MenuItems.findOne({_id: currentItem});
    }
  });
    
    Router.route('/prep', {
      name: 'newPrep',
      template: 'newPrep'
    });
