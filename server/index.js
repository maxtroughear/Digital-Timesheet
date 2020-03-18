const { GraphQLServer } = require('graphql-yoga');
const resolvers = require('./graphql/resolvers');

const logger = require('./logger');

const { connect, models } = require('./mongo');

const { auth, checkAuth } = require('./auth');

const db = connect({
  uri: process.env.MONGO_URI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
});

const context = (req) => ({
  db,
  models,
  auth,
  user: checkAuth(req),
});

const Server = new GraphQLServer({
  typeDefs: `${__dirname}/graphql/schema.graphql`,
  resolvers,
  context,
});

// options
const opts = {
  port: process.env.PORT || 3000,
};

Server.start(opts, () => {
  logger.info(`Server is running on port: ${opts.port}`);
  logger.warn(`Server is running on port: ${opts.port}`);
  logger.error(`Server is running on port: ${opts.port}`);
  logger.data(`Server is running on port: ${opts.port}`);
});
