const MongoDataSource = require('apollo-datasource-mongo').MongoDataSource;

module.exports = class extends MongoDataSource {
	initialize(config) {
		super.initialize({
			...config
		});
	}

	async getUser(userId) {
		return this.User.loadOneById
	}
};