const mongoose = require('mongoose');
const Rental = require('./rental');

const gameSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Tytuł jest wymagany'],
		minlength: [3, 'Minimalna długość tytułu to 3']
	},
	description: {
		type: String,
		required: [true, 'Opis jest wymagany'],
		minlength: [5, 'Minimalna długość opisu to 5']
	},
	players: {
		type: Number,
		required: [true, 'Liczba graczy jest wymagana'],
		min: [1, 'Minimalna liczba graczy to 1']
	},
	age: {
		type: Number,
		required: [true, 'Minimalny wiek jest wymagany'],
		min: [1, 'Minimalna wiek to 1']
	},
	time: {
		type: Number,
		required: [true, 'Czas gry jest wymagany'],
		min: [5, 'Minimalna czas  gry to 5 ']
	},
	numberInStock: {
		type: Number,
		default: 1,
		required: [true, 'Ilość sztuk jest wymagana']
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
