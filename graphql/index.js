const { ApolloServer } = require('apollo-server');
const { RedisCache } = require('apollo-server-cache-redis');

const mongoose = require('mongoose');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

// const resolvers = {
// 	Query: {
// 		books: () => books,
// 		users: (parent, args, context) => {
// 			if (!context.user) return null;

// 			console.log(context.user.roles);

// 			if (context.user.roles.includes('user')) throw new AuthenticationError('you must be logged in');

// 			return ['user1'];
// 		}
// 	},
// };

const cache = new RedisCache({
	host: process.env.REDIS_HOST
});

const dataSources = () => ({
	userAPI: new UserAPI(User)
});

const context = async ({ req }) => {
	// // Get the user token from the headers.
	// const token = req.headers.authorization || '';
	
	// // try to retrieve a user with the token
	// const user = getUser(token);
	
	// // add the user to the context
	// return user;
}

const server = new ApolloServer({
	typeDefs,
	resolvers,
	cache,
	dataSources,
	context,
	playground: true
});

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	server.listen(process.env.PORT || 3000).then(({ url }) => {
		console.log(`Server ready at ${url}`)
	});
})
.catch((err) => {
	console.log('Unable to connect to mongodb');
	console.log(err);
});

