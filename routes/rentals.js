const express = require('express');
const router = express.Router();
const Rental = require('../models/rental');
const Customer = require('../models/customer');
const Game = require('../models/game');
// const Fawn = require('fawn');
const mongoose = require('mongoose');
// const { db } = require('../models/game');
const game = require('../models/game');
const customer = require('../models/customer');

// Fawn.init(mongoose);

//All rentals
router.get('/', async (req, res) => {
	let searchOptions = {};
	if (req.query.title != null && req.query.title !== '') {
		searchOptions.title = new RegExp(req.query.title, 'i');
	}
	try {
		const games = await Game.find(searchOptions);
		const rentals = await Rental.find({ game: games }).populate('game').exec();
		res.render('rentals/index', {
			rentals: rentals,
			searchOptions: req.query
		});
	} catch {
		res.redirect('/');
	}
});

//New rental
router.get('/:id/rent', async (req, res) => {
	try {
		const game = await Game.findById(req.params.id);
		const customers = await Customer.find({});
		res.render('rentals/rent', {
			game: game,
			customers: customers,
			rental: new Rental({
				game: req.body.title,
				customer: req.body.mail,
				date: req.body.date
			}),
			date: req.body.date
		});
	} catch {
		res.redirect('/rentals');
	}
});

router.post('/', async (req, res) => {
	let customers = await Customer.find({});
	let gameID = await Game.findOne({ title: req.body.title });
	let rental;
	let date = new Date(req.body.date);
	rental = new Rental({
		game: gameID,
		customer: req.body.customer,
		date: req.body.date,
		dateOfReturn: date.setDate(date.getDate() + 30)
	});

	gameID.title = gameID.title;
	gameID.description = gameID.description;
	gameID.players = gameID.players;
	gameID.age = gameID.age;
	gameID.time = gameID.time;
	gameID.numberInStock = gameID.numberInStock - 1;
	try {
		await rental.save();
		await gameID.save();
		res.redirect('/rentals');
	} catch (error) {
		res.render('rentals/rent', {
			game: game,
			customers: customers,
			rental: new Rental({
				game: req.body.title,
				customer: req.body.mail,
				date: req.body.date
			}),
			date: req.body.date,
			errorMessage: 'Error creating rental'
		});
	}
});

router.delete('/:id', async (req, res) => {
	let rental = await Rental.findById(req.params.id);
	let gameID = await Game.findById(rental.game);
	gameID.title = gameID.title;
	gameID.description = gameID.description;
	gameID.players = gameID.players;
	gameID.age = gameID.age;
	gameID.time = gameID.time;
	gameID.numberInStock = gameID.numberInStock + 1;
	try {
		await gameID.save();
		await rental.remove();
		res.redirect('/rentals');
	} catch {
		if (rental == null) {
			res.redirect('/');
		} else {
			res.redirect(`/rentals`);
		}
	}
});
module.exports = router;
