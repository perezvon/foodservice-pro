Template.home.onRendered(function(){
    var data = Events.find().fetch();
    $('#mainCalendar').fullCalendar({
        events: data
        });
});