if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const gamesRouter = require('./routes/games');
const customersRouter = require('./routes/customers');
const rentalsRouter = require('./routes/rentals');
const app = express();

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('conneceted to mongoose;'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.set('stylesheets', __dirname + '/stylesheets');

app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '110mb', extended: false }));

app.use('/', indexRouter);
app.use('/games', gamesRouter);
app.use('/customers', customersRouter);
app.use('/rentals', rentalsRouter);

app.listen(process.env.PORT || 3000);
