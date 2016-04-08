updateEventMenu = function (menu, data) {
    var menuItem = MenuItems.findOne({_id: data});
    console.log(menuItem);
  //Menus.upsert({_id: menu}, {$addToSet: {menuItem}});  
};