Template.reports.onCreated(() => {
	Session.set('vendor', '')
	Session.set('category', '')
});

Template.reports.helpers({
	freq () {
		let orderFreq = Ordering.find({}).fetch();
		orderFreq.forEach((each, index, arr) => {arr[index].orderFreq = arr[index].orderHistory ? arr[index].orderHistory.reduce((prev, curr) => { return prev+=parseInt(curr.qty)}, 0) : 0; })
		orderFreq = orderFreq.filter((i) => !!i.orderFreq).sort((a,b) => {return b.orderFreq - a.orderFreq});
		orderFreq = !!Session.get('vendor') ? orderFreq.filter((i) => i.vendor === Session.get('vendor')) : orderFreq;
		orderFreq = !!Session.get('category') ? orderFreq.filter((i) => i.category === Session.get('category')) : orderFreq;
		return orderFreq;
	},
	priceFluct () {
		let priceFluct = Ordering.find({}).fetch();
		priceFluct.forEach((e, i, a) => {
			const qtyArr = a[i].orderHistory ? a[i].orderHistory.map(each => each.qty) : [];
			const diff = Math.max(...qtyArr) - Math.min(...qtyArr).toFixed(2);
			const pct = (Math.max(...qtyArr) / Math.min(...qtyArr) * 100).toFixed(2);
			!Number.isNaN(diff) && diff !== Infinity && diff !== -Infinity ? a[i].diff = diff : a[i].diff = 0;
			!Number.isNaN(+pct) && pct !== Infinity && pct !== -Infinity ? a[i].pct = pct : a[i].pct = 0;
		});
		return priceFluct.sort((a,b)=> {return b.diff - a.diff});
	}
})

Template.reports.events({
    'click .nav-tabs a': function(e){
        e.preventDefault();
        $(this).tab('show');
    },
		'click #export': function (e) {
			e.preventDefault();
	    let data = Template.reports.__helpers.get('freq').call();
			Meteor.call('exportToCSV', data, function (err, res) {
				if (err) {
					Bert.alert(err.reason, 'warning');
				} else {
					if (res) {
						var csvData = new Blob([res], {type: 'text/csv;charset=utf-8;'});
						var csvURL = window.URL.createObjectURL(csvData);
						var tempLink = document.createElement('a');
						tempLink.href = csvURL;
						tempLink.setAttribute('download', 'order-frequency.csv');
						tempLink.click();
					}
				}
			});
		}
});
