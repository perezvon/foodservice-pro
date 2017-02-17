Template.reports.helpers({
	freq () {
		let orderFreq = Ordering.find({}).fetch();
		orderFreq.forEach((each, index, arr) => {arr[index].orderFreq = arr[index].orderHistory ? arr[index].orderHistory.reduce((prev, curr) => { return prev+=parseInt(curr.qty)}, 0) : 0; })
		orderFreq = orderFreq.sort((a,b) => {return b.orderFreq - a.orderFreq});
		return orderFreq;
	},
	priceFluct () {
		let priceFluct = Ordering.find({}).fetch();
		priceFluct.forEach((e, i, a) => {
			const qtyArr = a[i].orderHistory ? a[i].orderHistory.map(each => each.qty) : [];
			const diff = Math.max(...qtyArr) - Math.min(...qtyArr);
			const pct = (Math.max(...qtyArr) / Math.min(...qtyArr) * 100).toFixed(2);
			console.log(diff, pct);
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
    }
});