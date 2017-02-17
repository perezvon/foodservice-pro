Template.events.helpers({
    'eventsIndex': function (){ return eventsIndex; },
    'events': function(){
      return Events.find({}, {sort: {startDate:1}});
    }, 
    'inputAttributes': function() {
      return {'class': 'form-control', 'id': 'search-events'};
    }
});
  
Template.newEvent.events({
    'submit form': function(e){
        e.preventDefault();
        var inputs;
        var data = {};
        $('form').each(function(){
            inputs = ($(this).find(':input'));
        });
        for (var i=0; i< inputs.length; i++){
            data[inputs.get([i]).id] = inputs.get([i]).value;
        }
        Meteor.call('newEvent', data, function(error){
               if (error) Bert.alert(error.reason, 'danger');
               else {
                   Bert.alert('Event created.', 'success');
                   Router.go('events');
               }
           });
    }
});
    
Template.events.events({
    'click .event-list-view': function() {
        Router.go('editEvent', {_id: this._id}); 
      }
});
 
Template.editEvent.events({
    'click .nav-tabs a': function(e){
        e.preventDefault();
        $(this).tab('show');
    },
    
    
    
        'keyup .form-control': function(e){
    if(e.which == 13 || e.which == 27){
        $(e.target).blur();
    }
            
        },
        
        'blur .form-control': function(e){
        var currentEvent = this._id;
        var updateField = e.target.id;
        var updateVal = $(e.target).val();
        var update = {};
        update[updateField] = updateVal;
       Meteor.call('updateEvent', { _id: currentEvent }, {$set: update });
        }
});


