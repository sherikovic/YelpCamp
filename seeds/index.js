const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedsHelpers');

// mongoose connection
mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 300; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			author: '64f837fdf528a0852538cb91',
			title: `${sample(descriptors)} ${sample(places)}`,
			geometry: {
				type: 'Point',
				coordinates: [
					cities[random1000].longitude,
					cities[random1000].latitude,
				],
			},
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			images: [
				{
					url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
					filename: 'YelpCamp/ahfnenvca4tha00h2ubt',
				},
				{
					url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
					filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi',
				},
			],
			description: 'a random description',
			price: price,
		});
		await camp.save();
	}
};

seedDB().then(() => mongoose.connection.close());