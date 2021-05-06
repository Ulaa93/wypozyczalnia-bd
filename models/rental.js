const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
	date: {
		type: Date,
		required: true,
		default: Date.now()
	},
	dateOfReturn: {
		type: Date,
		required: true,
		default: new Date().setDate(new Date().getDate() + 30)
	},
	game: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Game'
	},
	customer: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Customer'
	}
});

module.exports = mongoose.model('Rental', rentalSchema);
