const Event = require('../../models/event');
const User = require('../../models/user');

const { transformEvent } = require('./merge');

module.exports = {
	events: async () => {
		try {
			const events = await Event.find();
			return events.map(event => {
				return transformEvent(event);
			});
	  	} catch (err) {
			throw err;
	  	}
	},
	createEvent: async args => {
		const creatorID = '5e6029d88d038c2fcaef1c5f';
		const event = new Event({
			title: args.eventInput.title,
			description: args.eventInput.description,
			price: +args.eventInput.price,
			date: new Date(args.eventInput.date),
			// TODO: charge hard coded creator ID
			creator: creatorID
		});
		let createdEvent;
		try {
			const result = await event.save();
			createdEvent = transformEvent(result);
			// TODO: change hard coded creator ID
			const creator = await User.findById(creatorID);
	
			if (!creator) {
				throw new Error('User not found.');
			}
			creator.createdEvents.push(event);
			await creator.save();

			return createdEvent;
		} catch (err) {
			console.log(err);
		throw err;
		}
	}
};