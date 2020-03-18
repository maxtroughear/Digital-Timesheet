const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema');
const graphQlResolvers = require('./graphql/resolvers');

const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use(isAuth(process.env.SECRET_KEY));

app.use('/', graphqlHttp({
	schema: graphqlSchema,
	rootValue: graphQlResolvers(process.env.SECRET_KEY),
	graphiql: true
	// context: ({ req }) => {
	// 	const token = req.get('Authorization') || '';

	// 	const user = getUser(token);

	// 	return { user };
	// }
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
