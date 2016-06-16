Template.inventory.helpers({
   getMonthlyOrdering() {
       //get all items ordered in current month
       var month = moment().format("MM");
       var year = moment().format("YYYY");
       var monthStart = new Date(year, (month - 1), 1);
       var monthEnd = new Date(year, (month === 11 ? 0 : month), 1);
       
         var ordering = Ordering.find({
           orderHistory: {$elemMatch:{date: {$gte: monthStart, $lt: monthEnd}}}}, 
           {fields: {name: 1, place: 1, orderHistory: 1}}, 
           {sort: {place: 1}
           }).fetch();  
       //to do: get all items that were in stock on last month's inventory, filter duplicate productId, add to ordering, return this
       //let stock = Inventory.find({month: month, qty: {$gt: 0}}).fetch();
       
       return ordering;
   },
   
   month() {
       return moment().format("MMMM YYYY");
   },
    places() {
       var distinctEntries = _.uniq(Ordering.find({}, {
        sort: {place: 1}, fields: {place: true}
        }).fetch().map(function(x) {       
            return x.place;
        }), true);
    return distinctEntries;
   }    
});

Template.inventory.events({
    /* old // 'click .print-pdf': function () {
        var month = moment().format("MM");
        var year = moment().format("YYYY");
        var monthStart = new Date(year, (month - 1), 1);
        var monthEnd = new Date(year, (month === 11 ? 0 : month), 1);
        var ordering = Ordering.find({
           orderHistory: {$elemMatch:{date: {$gte: monthStart, $lt: monthEnd}}}}, 
           {fields: {name: 1, place: 1, orderHistory: 1}}, 
           {sort: {place: 1}
           }).fetch();
           
        var monthYear = moment().format("MMMM YYYY");
        var doc = new PDFDocument({size: 'A4', margin: 50});
        var stream = doc.pipe(blobStream());
        doc.fontSize(12);
        doc.text("Ordering for " + monthYear + "\n still working on this feature", 10, 30, {width: 200});
        doc.end();
        stream.on('finish', function() {
         window.open(stream.toBlobURL('application/pdf'), '_blank');
        });
        //doc.write('Inventory ' + monthYear + '.pdf');
    } */
    'click .print-pdf'() {
        Meteor.call('printPDF', 'https://www.google.com', 'google.pdf');
    },
    'change select': function (e) {
        var place = $(e.target).val();
        
    }
});