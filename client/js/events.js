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
        var guestCount = $('[name="guestCount"]').val();
           Meteor.call('newEvent', {
               name: eventName,
               startDate: startDate,
               accountExec: accountExec,
               client: client,
               guestCount: guestCount
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
    },
    
    'keyup .form-control': function(event){
    if(event.which == 13 || event.which == 27){
        $(event.target).blur();
    } else {
        var currentEvent = this._id;
        var updateField = event.target.id;
        var updateVal = $(event.target).val();
        var update = {};
        update[updateField] = updateVal;
        console.log(update);
       Meteor.call('updateEvent', { _id: currentEvent }, {$set: update });
    }
}
});