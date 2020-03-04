const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema');
const graphQlResolvers = require('./graphql/resolvers');

const Event = require('./models/event');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
	schema: graphqlSchema,
	rootValue: {
		events: () => {
			return Event.find().then(events => {
				return events.map(event => {
					return { ...event._doc };
				})
			}).catch(err => {
				console.log(err);
				throw err;
			})
		},
		createEvent: args => {
			const event = new Event({
				title: args.eventInput.title,
				description: args.eventInput.description,
				price: +args.eventInput.price,
				date: new Date(args.eventInput.date)
			});

			return event.save().then(result => {
				console.log(result);
				return { ...result._doc };
			}).catch(err => {
				console.log(err);
				throw err;
			});
		}
	},
	graphiql: true
}));

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	app.listen(process.env.PORT || 3000);
})
.catch((err) => {
	console.log('Unable to connect to mongodb');
	console.log(err);
});
