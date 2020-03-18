const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	createdEvents: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Event'
		}
	]
});

module.exports = mongoose.model('User', UserSchema);