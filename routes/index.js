const express = require('express');
const router = express.Router();
const Game = require('../models/game');

router.get('/', async (req, res) => {
	let games;
	try {
		games = await Game.find().sort({ title: 'asc' }).limit(10).exec();
	} catch {
		games = [];
	}
	res.render('index', { games: games });
});

module.exports = router;
