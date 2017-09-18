Events = new Mongo.Collection('events');
Menus = new Mongo.Collection('menus');
MenuItems = new Mongo.Collection('menuItems');
Components = new Mongo.Collection('components');
Preps = new Mongo.Collection('preps');
Ordering = new Mongo.Collection('ordering');
Inventory = new Mongo.Collection('inventory');
Tags = new Mongo.Collection('tags');

  eventsIndex = new EasySearch.Index({
    collection: Events,
    fields: ['title', 'client'],
    engine: new EasySearch.Minimongo({
      sort: () => ['start']
    })
  });

 menuItemsIndex = new EasySearch.Index({
    collection: MenuItems,
    fields: ['name', 'description'],
    engine: new EasySearch.Minimongo()
  });

  componentsIndex = new EasySearch.Index({
    collection: Components,
    fields: ['name', 'description'],
    engine: new EasySearch.Minimongo()
  });

  orderingIndex = new EasySearch.Index({
    collection: Ordering,
    fields: ['name', 'productId'],
    defaultSearchOptions: {
        limit: 100,
		sortBy: ''
    },
    engine: new EasySearch.Minimongo({
        selector (searchObject, options, aggregation) {
            let selector = this.defaultConfiguration().selector(searchObject, options, aggregation);
            const filter = {}
            // filter for vendor if set
            if (options.search.props.vendor) {
                selector.vendor = options.search.props.vendor;
            }
            if (options.search.props.place) {
                selector.place = options.search.props.place;
            }
            if (options.search.props.showEmptyItems) {
              filter.$exists = false;
              selector.name = filter
            }
            return selector;
        },
		sort: function (searchObject, options) {
      		const sortBy = options.search.props.sortBy;
			switch (sortBy) {
				case 'priceDesc':
					return {price: -1}
					break;
				case 'priceAsc':
					return {price: 1}
					break;
				case 'productIdDesc':
					return {productId: -1}
					break;
				case 'productIdAsc':
					return {productId: 1}
					break;
				case 'nameDesc':
					return {name: -1}
					break;
				case 'nameAsc':
					return {name: 1}
					break;
			}
		}
    })
  });
