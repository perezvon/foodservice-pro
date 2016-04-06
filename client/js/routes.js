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
    
    Router.route('/menuItems');
    
    Router.route('/menuItem', {
    name: 'newMenuItem',
    template: 'newMenuItem'
    });
    
    Router.route('/menuItem/:_id', {
    name: 'editMenuItem',
    template: 'editMenuItem',
    data: function() {
        var currentItem = this.params._id;
        return MenuItems.findOne({_id: currentItem});
    }
  });
    
    Router.route('/prep', {
      name: 'newPrep',
      template: 'newPrep'
    });
