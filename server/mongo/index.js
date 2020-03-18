const mongoose = require('mongoose');
const User = require('./models/user');
const Event = require('./models/event');

mongoose.Promise = global.Promise;

const connect = ({ uri, options }) => mongoose.connect(uri, options);

const models = {
	User,
	Event
};

module.exports = {
	connect,
	models
};