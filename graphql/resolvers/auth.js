const bcrypt = require('bcryptjs');

const User = require('../../models/user');

module.exports = {
  	createUser: async args => {
		try {
			const existingUser = await User.findOne({ userID: args.userInput.userID });
			if (existingUser) {
				throw new Error('User exists already.');
			}
			const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

			const user = new User({
				userID: args.userInput.userID,
				password: hashedPassword
			});

			const result = await user.save();

			return { ...result._doc, password: null };
		} catch (err) {
			throw err;
		}
	}
};
