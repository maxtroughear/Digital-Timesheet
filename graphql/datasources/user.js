const { MongoDataSource  } = require('apollo-datasource-mongodb');

const jwt = require('jsonwebtoken');

class UserAPI extends MongoDataSource {
	constructor({ store }) {
		super();
		this.store = store;
	}

	getUser(userId) {
		return this.findOneById(UserId);
	}

	getUserFromToken(token) {
		jwt.verify(token, process.env.SECRET_TOKEN_KEY, (err, decoded) => {
			if (err || !decoded) return null;

			return this.getUser(decoded.userId);
		});
	}
}

module.exports = UserAPI;