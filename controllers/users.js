const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
	res.render('users/register');
};

module.exports.register = async (req, res, next) => {
	try {
		const { email, username, password } = req.body;
		let newUser = new User({ email, username });
		newUser = await User.register(newUser, password);
		req.logIn(newUser, (err) => {
			if (err) next(err);
			req.flash('success', 'Welcome to YelpCamp!');
			res.redirect('/campgrounds');
		});
	} catch (e) {
		req.flash('error', e.message);
		res.redirect('/register');
	}
};

module.exports.renderLogin = (req, res) => {
	res.render('users/login');
};

module.exports.login = (req, res) => {
	req.flash('succcess', 'Welcome back!');
	const redirectUrl = res.locals.returnTo || '/campgrounds';
	// delete req.session.returnTo;
	res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
	req.logOut(function (err) {
		if (err) {
			return next(err);
		}
		req.flash('success', 'Goodbye!');
		res.redirect('/campgrounds');
	});
};
