const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
});

UserSchema.plugin(passportLocalMongoose); //will add username, password, make sure they are unique ...

module.exports = mongoose.model('User', UserSchema);
