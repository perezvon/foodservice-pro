Events = new Mongo.Collection('events');
Menus = new Mongo.Collection('menus');
MenuItems = new Mongo.Collection('menuItems');
Preps = new Mongo.Collection('preps');

eventsIndex = new EasySearch.Index({
    collection: Events,
    fields: ['name'],
    engine: new EasySearch.Minimongo({
      sort: () => ['startDate']  
    })
  });
  
  menuItemsIndex = new EasySearch.Index({
    collection: MenuItems,
    fields: ['name', 'description'],
    engine: new EasySearch.Minimongo()
  });