const express = require('express');
const router = express.Router();
const passpoort = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users');

router
	.route('/register')
	.get(users.renderRegister)
	.post(catchAsync(users.register));
router
	.route('/login')
	.get(users.renderLogin)
	.post(
		storeReturnTo,
		passpoort.authenticate('local', {
			failureFlash: true,
			failureRedirect: '/login',
		}),
		users.login
	);
router.get('/logout', users.logout);

module.exports = router;
