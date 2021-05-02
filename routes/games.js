const express = require('express');
const router = express.Router();
const Game = require('../models/game');

//All games
router.get('/', async (req, res) => {
	let searchOptions = {};
	if (req.query.title != null && req.query.title !== '') {
		searchOptions.title = new RegExp(req.query.title, 'i');
	}
	try {
		const games = await Game.find(searchOptions);
		res.render('games/index', {
			games: games,
			searchOptions: req.query
		});
	} catch {
		res.redirect('/');
	}
});

//New game
router.get('/new', (req, res) => {
	res.render('games/new', { game: new Game() });
});

//Create games route
router.post('/', async (req, res) => {
	const game = new Game({
		title: req.body.title
	});
	try {
		const newGame = await game.save();
		// res.redirect(`games/${newGame.id}`);
		res.redirect('games');
	} catch (error) {
		res.render('games/new', {
			game: game,
			errorMessage: 'Error creating game'
		});
	}
	// game.save((err, newGame) => {
	// 	if (err) {
	//
	// 		});
	// 	} else {
	// 		// res.redirect(`games/${newGame.id}`)
	// 		res.redirect('games');
	// 	}
	// });
	// res.send(req.body.title);
});
module.exports = router;
