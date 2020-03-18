module.exports = {
	Query: {
		login: async(parent, { username, password }, { auth, user }) => {
			
			if (user) console.log(user);

			return auth.login(username, password);
		}
	},
	Mutation: {
		createUser: async(parent, { username, password }, { auth }) => {
			return auth.createUser(username, password);
		}
	}
}