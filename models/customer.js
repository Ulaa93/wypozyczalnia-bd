const mongoose = require('mongoose');
const Rental = require('./rental');

const customerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Imię jest wymagane!'],
		minlength: [3, 'Minimalna długość imienia to 3']
	},
	lastName: {
		type: String,
		required: [true, 'Nazwisko jest wymagane!'],
		minlength: [3, 'Minimalna długość nazwiska to 3']
	},
	mail: {
		type: String,
		required: [true, 'Mail jest wymagany!'],
		unique: [true, 'Mail musi być unikalny!']
	},
	rentals: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Rentals'
	}
});
customerSchema.pre('remove', function (next) {
	Rental.find({ customer: this.id }, (err, rentals) => {
		if (err) {
			next(err);
		} else if (rentals.length > 0) {
			next(new Error('This customer has games still'));
		} else {
			next();
		}
	});
});
module.exports = mongoose.model('Customer', customerSchema);
