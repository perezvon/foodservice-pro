Template.place.helpers({
  places() {
     var distinctEntries = _.uniq(Ordering.find({}, {
      sort: {place: 1}, fields: {place: true}
      }).fetch().map(function(x) {
          return x.place;
      }), true);
  return distinctEntries;
 }
})

Template.place.events({
  'change #place': function (e) {
    let place = $(e.target).val();
    Session.set('place', place);
    $("#inventory tbody").editableTableWidget();
  },
})
