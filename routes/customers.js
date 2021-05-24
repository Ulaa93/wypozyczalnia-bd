const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const Rental = require('../models/rental');

//All customers
router.get('/', async (req, res) => {
	let searchOptions = {};
	if (req.query.name != null && req.query.name !== '') {
		searchOptions.name = new RegExp(req.query.name, 'i');
	}
	try {
		const customers = await Customer.find(searchOptions);
		res.render('customers/index', {
			customers: customers,
			searchOptions: req.query
		});
	} catch {
		res.redirect('/');
	}
});

//New customer
router.get('/new', (req, res) => {
	res.render('customers/new', { customer: new Customer() });
});

//Create customer route
router.post('/', async (req, res) => {
	let customer = await Customer.find({ mail: req.body.mail });
	if (customer == null || customer == '') {
		customer = new Customer({
			name: req.body.name,
			lastName: req.body.lastName,
			mail: req.body.mail
		});
	}
	try {
		const newCustomer = await customer.save();
		res.redirect(`customers/${newCustomer.id}`);
	} catch (error) {
		console.log(error);
		if (error.name == 'TypeError') {
			res.render('customers/new', {
				customer: customer,
				errorMessage: 'Mail musi być unikalny!'
			});
		} else if (error.name == 'ValidationError') {
			res.render('customers/new', {
				customer: customer,
				errorMessage:
					error.message
						.split('Customer validation failed:')[1]
						.split(',')
						.map((x) => x.split(':')[1]) || 'Błąd podczas tworzenia gry!'
			});
		} else {
			res.render('customers/new', {
				customer: customer,
				errorMessage: 'Błąd podczas tworzenia gry!'
			});
		}
	}
});

router.get('/:id', async (req, res) => {
	try {
		const customer = await Customer.findById(req.params.id).exec();
		const rentals = await Rental.aggregate([
			{
				$match: { customer: customer._id }
			},
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
			}
		]);
		res.render('customers/show', { customer: customer, rentals: rentals });
	} catch {
		res.redirect('/');
	}
});

router.get('/:id/edit', async (req, res) => {
	try {
		const customer = await Customer.findById(req.params.id);
		res.render('customers/edit', { customer: customer });
	} catch {
		res.redirect('/customers');
	}
});

router.put('/:id', async (req, res) => {
	let customer;
	try {
		customer = await Customer.findById(req.params.id);
		customer.name = req.body.name;
		customer.lastName = req.body.lastName;
		customer.mail = req.body.mail;
		await customer.save();
		res.redirect(`/customers/${customer._id}`);
	} catch (error) {
		if (customer == null) {
			res.redirect('/');
		} else {
			if (error.name == 'TypeError') {
				res.render('customers/new', {
					customer: customer,
					errorMessage: 'Mail musi być unikalny!'
				});
			} else if (error.name == 'ValidationError') {
				res.render('customers/new', {
					customer: customer,
					errorMessage:
						error.message
							.split('Customer validation failed:')[1]
							.split(',')
							.map((x) => x.split(':')[1]) || 'Błąd podczas tworzenia klienta!'
				});
			} else {
				res.render('customers/new', {
					customer: customer,
					errorMessage: 'Błąd podczas tworzenia klienta!'
				});
			}
		}
	}
});

router.delete('/:id', async (req, res) => {
	let customer;
	try {
		customer = await Customer.findById(req.params.id);
		await customer.remove();
		res.redirect('/customers');
	} catch {
		if (customer == null) {
			res.redirect('/');
		} else {
			let searchOptions = {};
			let customers = await Customer.find(searchOptions);
			res.render('customers/index', {
				customers: customers,
				searchOptions: req.query,
				errorMessage:
					'Nie można usunąć klienta posiadającego aktualne wypożyczenia'
			});
		}
	}
});
module.exports = router;
