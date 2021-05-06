const mongoose = require('mongoose');
const Rental = require('./rental');

const customerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	mail: {
		type: String,
		required: true,
		unique: true
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
