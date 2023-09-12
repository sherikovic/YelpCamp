if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');

const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

// mongoose connection
mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

// express
const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
	secret: 'thisisasecret',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

//routes
app.use('/', userRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);

//homepage
app.get('/', (req, res) => {
	res.render('home');
});
//couldn't match any page
app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found!', 404));
});
//error handling middleware
app.use((err, req, res, next) => {
	const { status = 500 } = err;
	if (!err.message) {
		err.message = 'Something went wrong';
	}
	res.status(status).render('error', { err });
});
//start the connection
app.listen(3000, () => {
	console.log('Serving on port 3000.');
});
