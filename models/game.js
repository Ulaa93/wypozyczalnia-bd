const mongoose = require('mongoose');
const Rental = require('./rental');

const gameSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	players: {
		type: Number
	},
	age: {
		type: Number
	},
	time: {
		type: String
	},
	numberInStock: {
		type: Number,
		default: 1
	}
});
gameSchema.pre('remove', function (next) {
	Rental.find({ game: this.id }, (err, rentals) => {
		if (err) {
			next(err);
		} else if (rentals.length > 0) {
			next(new Error('This game is rental still'));
		} else {
			next();
		}
	});
});
module.exports = mongoose.model('Game', gameSchema);
