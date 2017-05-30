Template.vendor.helpers({
  vendors() {
     var distinctEntries = _.uniq(Ordering.find({}, {
      sort: {vendor: 1}, fields: {vendor: true}
      }).fetch().map(function(x) {
          return x.vendor;
      }), true);
  return distinctEntries;
 },
})

Template.vendor.events({
  'change #vendor': function (e) {
    let vendor = $(e.target).val();
    Session.set('vendor', vendor);
  },
})
