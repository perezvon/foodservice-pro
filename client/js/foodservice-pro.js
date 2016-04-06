
var currentMenu;

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
  
  
 