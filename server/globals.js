
const setupGlobals = () => {
  global.gPort = process.env.PORT || 3000;
  global.gMongoURI = process.env.MONGO_URI;
  global.gRedisHost = process.env.REDIS_HOST;
  global.gTokenSecret = process.env.SECRET_TOKEN_KEY;
  global.gEnvironment = process.env.NODE_ENV;
  global.gProduction = process.env.PRODUCTION || global.gEnvironment === 'production';
  global.gAppInstance = process.env.NODE_APP_INSTANCE || 0;
  global.gDebug = global.gEnvironment !== 'production';
  global.gAutoIndex = global.gEnvironment !== 'production' && global.gAppInstance === '0';
};

module.exports = {
  setupGlobals,
};
