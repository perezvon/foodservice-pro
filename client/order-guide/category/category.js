Template.category.helpers({
  categories() {
     var distinctEntries = _.uniq(Ordering.find({}, {
      sort: {category: 1}, fields: {category: true}
      }).fetch().map(function(x) {
          return x.category;
      }), true);
  return distinctEntries;
 }
})

Template.category.events({
  'change #category': function (e) {
    let category = $(e.target).val();
    Session.set('category', category);
    $("#inventory tbody").editableTableWidget();
  },
})
