const authResolver = require('./auth');
const eventsResolver = require('./events');

const rootResolver = {
	...authResolver,
	...eventsResolver
};

exports = rootResolver;