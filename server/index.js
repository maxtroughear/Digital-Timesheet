const { GraphQLServer } = require('graphql-yoga');
const mongoose = require('mongoose');

const { setupGlobals } = require('./globals');

setupGlobals();

const permissions = require('./permissions');
const resolvers = require('./graphql/resolvers');

const logger = require('./logger');

const { connect, models } = require('./mongo');

const {
  auth, userAuth, serviceAuth, getUser, getServiceAdmin,
} = require('./auth');

const connectedServers = {
  mongo: false,
  redis: false,
};

const db = connect({
  uri: global.gMongoURI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
}).catch((err) => {
  logger.error('Failed to connect to mongodb');
  logger.error(err);
  process.exit(1);
});

const context = async (req) => ({
  ...req,
  db,
  models,
  auth,
  userAuth,
  serviceAuth,
  user: await getUser(req),
  serviceAdmin: await getServiceAdmin(req),
});

const Server = new GraphQLServer({
  typeDefs: `${__dirname}/graphql/schema.graphql`,
  resolvers,
  context,
  middlewares: [permissions],
});

// format all graphql responses to show which server served the request
const formatResponse = (response) => {
  const meta = {
    server: `api_${global.gAppInstance}`,
  };
  return {
    ...response,
    meta,
  };
};

// options
const opts = {
  port: global.gPort,
  formatResponse,
  debug: global.gDebug,
  playground: (!global.gDebug) ? false : '/',
  uploads: {
    maxFieldSize: 1000000,
    maxFileSize: 10485760,
    maxFiles: 10,
  },
};

Server.start(opts, () => {
  logger.info(`Server api_${global.gAppInstance} is running on port: ${opts.port}`);
  process.send('ready');
});

const checkAllDisconnectedAndExit = () => {
  const connections = Object.values(connectedServers);

  if (connections.every((connected) => connected === false)) {
    process.exit(0);
  }
};

process.on('message', (msg) => {
  if (msg === 'shutdown') {
    logger.info('Closing connections');
    mongoose.connection.close();
  }
});

mongoose.connection.on('connected', () => {
  logger.info('MongoDB connected');
  connectedServers.mongo = true;
});

mongoose.connection.on('close', () => {
  logger.info('MongoDB connection closed');
  connectedServers.mongo = false;
  checkAllDisconnectedAndExit();
});

mongoose.connection.on('reconnectFailed', () => {
  // close all other connections and exit process
});
