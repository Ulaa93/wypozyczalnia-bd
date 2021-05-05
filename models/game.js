const mongoose = require('mongoose');

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

// gameSchema.pre('remove', function(next){

// })

module.exports = mongoose.model('Game', gameSchema);
