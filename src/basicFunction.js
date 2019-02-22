let basicFunction = {
	getDate: function() {
		let currentdate = new Date();
		let date = currentdate.getDate();
		const monthNames = ["January", "February", "March", "April", "May", "June",
		  "July", "August", "September", "October", "November", "December"
		];
		let month = monthNames[(currentdate.getMonth())];
		let year = currentdate.getFullYear();
		let second = currentdate.getSeconds();
	    let minute = currentdate.getMinutes();
	    let hour = currentdate.getHours();
		let dateObj = {
			date: date,
			month: month,
			year: year,
			second: second,
			minute: minute,
			hour: hour
		}
		return dateObj;
	}
}

export default basicFunction;