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
		title: req.body.title,
		description: req.body.description,
		players: req.body.players,
		age: req.body.age,
		time: req.body.time,
		numberInStock: req.body.numberInStock
	});
	try {
		const newGame = await game.save();
		res.redirect(`games/${newGame._id}`);
	} catch (error) {
		console.log(error);
		if (error.name == 'ValidationError') {
			res.render('games/new', {
				game: game,
				errorMessage:
					error.message
						.split('Game validation failed:')[1]
						.split(',')
						.map((x) => x.split(':')[1]) || 'Błąd podczas tworzenia gry!'
			});
		} else {
			res.render('games/new', {
				game: game,
				errorMessage: 'Błąd podczas tworzenia gry'
			});
		}
	}
});

router.get('/:id', async (req, res) => {
	try {
		const game = await Game.findById(req.params.id).exec();
		res.render('games/show', { game: game });
	} catch {
		res.redirect('/');
	}
});

router.get('/:id/edit', async (req, res) => {
	try {
		const game = await Game.findById(req.params.id);
		res.render('games/edit', { game: game });
	} catch {
		res.redirect('/games');
	}
});

router.put('/:id', async (req, res) => {
	let game;
	game = await Game.findById(req.params.id);
	game.title = req.body.title;
	game.description = req.body.description;
	game.players = req.body.players;
	game.age = req.body.age;
	game.time = req.body.time;
	game.numberInStock = req.body.numberInStock;
	try {
		await game.save();
		res.redirect(`/games/${game._id}`);
	} catch (error) {
		if (game == null) {
			res.redirect('/');
		} else if (error.name == 'ValidationError') {
			res.render('games/new', {
				game: game,
				errorMessage:
					error.message
						.split('Game validation failed:')[1]
						.split(',')
						.map((x) => x.split(':')[1]) || 'Błąd podczas edycji gry!'
			});
		} else {
			res.render('games/edit', {
				game: game,
				errorMessage: 'Błąd podczas edycji gry'
			});
		}
	}
});

router.delete('/:id', async (req, res) => {
	let game;
	try {
		game = await Game.findById(req.params.id);
		await game.remove();
		res.redirect('/games');
	} catch {
		if (game == null) {
			res.redirect('/');
		} else {
			res.render('games/show', {
				game: game,
				errorMessage: 'Nie można usunąć gry będącej aktualnie w wypożyczeniu'
			});
		}
	}
});

module.exports = router;
