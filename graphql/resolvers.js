module.exports = {
	Query: {
		login: async(_, args, context) => {
			return null;
		}
	},
	Mutation: {
		createUser: async(_, args, context) => {
			try {
				const existingUser = await User.findOne({ username: args.userInput.username });
				if (existingUser) {
					throw new Error('User exists already.');
				}
				const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

				const user = new User({
					username: args.userInput.username,
					password: hashedPassword
				});

				const result = await user.save();

				return { ...result._doc, password: null };
			} catch (err) {
				throw err;
			}
		}
	}
}