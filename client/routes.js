  Router.configure({
    layoutTemplate: 'main',
    loadingTemplate: 'loading'
});

  Router.route('/',{
    name: 'home',
    template: 'orderGuide',
    waitOn: function() {
      return this.subscribe('ordering');
    }
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
      return [this.subscribe('menuItems'), this.subscribe('tags'), this.subscribe('components')];
    },
    data: function() {
        var currentItem = this.params._id;
        return MenuItems.findOne({_id: currentItem});
    }
  });

    Router.route('/components', {
      waitOn: function() {
      return this.subscribe('components');
      }
    });

    Router.route('/component', {
    name: 'newComponent',
    template: 'newComponent'
    });

    Router.route('/component/:_id', {
    name: 'editComponent',
    template: 'editComponent',
    waitOn: function() {
      return this.subscribe('components');
    },
    data: function() {
        var currentComponent = this.params._id;
        return Components.findOne({_id: currentComponent});
    }
  });

    Router.route('/orderGuide', {
      waitOn: function() {
      return this.subscribe('ordering');
      }
    });

    Router.route('/orderGuide/:_id', {
      name: 'viewOrderGuideItem',
      data: function() {
        var currentOrderGuideItem = this.params._id;
        return Ordering.findOne({_id: currentOrderGuideItem});
      }
    });


    Router.route('/orderGuide/edit/:_id', {
      name: 'editOrderGuideItem',
      template: 'orderGuideItem',
      data: function() {
        var currentOrderGuideItem = this.params._id;
        return Ordering.findOne({_id: currentOrderGuideItem});
      }
    });

    Router.route('/newOrderGuideItem', {
        name: 'newOrderGuideItem',
        template: 'orderGuideItem'
    });

    Router.route('/prep', {
      name: 'newPrep',
      template: 'newPrep'
    });

    Router.route('/invoice', {
      name: 'newInvoice',
      template: 'newInvoice'
    });

    Router.route('/inventory', {
      name: 'inventory',
      template: 'inventory'
    });
    Router.route('/reports', {
      name: 'reports',
      template: 'reports'
    });

    Router.route('/inventory/:year/:month', {
      name: 'pastInventory',
      template: 'inventory',
        data: function () {
            let year = this.params.year;
            let month = this.params.month;
			return {year: year, month: month};
		}
    });
