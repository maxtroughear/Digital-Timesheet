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
	rootValue: graphQlResolvers,
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
