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
           }, function(error){
               if (error) Bert.alert(error.reason, 'danger');
               else {
                   Bert.alert('Event created.', 'success');
                   Router.go('events');
               }
           });
        $('[name="eventName"]').val('');
    }
});
    
Template.events.events({
    'click .event-list-view': function() {
        Router.go('editEvent', {_id: this._id}); 
      }
});

Template.editEvent.events({
    'click #build-menu': function(e){
        e.preventDefault();
    }
});