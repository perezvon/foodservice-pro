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
   }
});

Template.inventory.events({
    'click .print-pdf': function () {
        var month = moment().format("MM");
        var year = moment().format("YYYY");
        var monthStart = new Date(year, (month - 1), 1);
        var monthEnd = new Date(year, (month === 11 ? 0 : month), 1);
        var ordering = Ordering.find({
           orderHistory: {$elemMatch:{date: {$gte: monthStart, $lt: monthEnd}}}}, 
           {fields: {name: 1, place: 1, orderHistory: 1}}, 
           {sort: {place: 1}
           }).fetch();
        var monthYear = moment().format("MMMMYYYY");
        var doc = new PDFDocument({size: 'A4', margin: 50});
        var stream = doc.pipe(blobStream());
        doc.fontSize(12);
        doc.text(ordering.name, 10, 30, {width: 200});
        doc.end();
        stream.on('finish', function() {
         window.open(stream.toBlobURL('application/pdf'), '_blank');
        });
        //doc.write('Inventory' + monthYear + '.pdf');
    }
});