const authResolver = require('./auth');
const eventsResolver = require('./events');

const rootResolver = (secretkey) => {
	return {
		...authResolver(secretkey),
		...eventsResolver
	}
};

module.exports = rootResolver;