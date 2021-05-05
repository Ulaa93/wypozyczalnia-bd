const mongoose = require('mongoose');

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

module.exports = mongoose.model('Customer', customerSchema);
