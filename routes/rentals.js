const express = require('express');
const router = express.Router();
const Rental = require('../models/rental');
const Customer = require('../models/customer');
const Game = require('../models/game');
const mongoose = require('mongoose');
const Fawn = require('fawn');

Fawn.init(mongoose);
//All rentals

router.get('/', async (req, res) => {
	let searchOptions = {};
	if (req.query.title != null && req.query.title !== '') {
		searchOptions.title = new RegExp(req.query.title, 'i');
	}
	try {
		const rentals = await Rental.aggregate([
			{
				$lookup: {
					from: 'games',
					localField: 'game',
					foreignField: '_id',
					as: 'game'
				}
			},
			{
				$unwind: '$game'
			},

			{
				$lookup: {
					from: 'customers',
					localField: 'customer',
					foreignField: '_id',
					as: 'customer'
				}
			},
			{
				$unwind: '$customer'
			},
			searchOptions.title != undefined
				? {
						$match: {
							'game.title': searchOptions.title
						}
				  }
				: {
						$sort: {
							date: -1
						}
				  }
		]);
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

	try {
		await rental.save();
		await new Fawn.Task()
			.update('games', { _id: gameID._id }, { $inc: { numberInStock: -1 } })
			.run();
		res.redirect('/rentals');
	} catch (error) {
		res.render('rentals/rent', {
			game: gameID,
			customers: customers,
			rental: new Rental({
				game: req.body.title,
				customer: req.body.customer,
				date: req.body.date
			}),
			date: req.body.date,
			errorMessage: 'Błąd podczas tworzenia wypożyczenia'
		});
	}
});

router.delete('/:id', async (req, res) => {
	let rental = await Rental.findById(req.params.id);
	let gameID = await Game.findById(rental.game);

	try {
		await new Fawn.Task()
			.update('games', { _id: gameID._id }, { $inc: { numberInStock: +1 } })
			.run();
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
