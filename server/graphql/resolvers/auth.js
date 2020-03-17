const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = (secretkey) => {
	return  {
		createUser: async args => {
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
		},
		login: async ({ username, password }) => {
			const user = await User.findOne({ username: username });
			if (!user) {
				throw new Error('User does not exist!');
			}
			const isEqual = await bcrypt.compare(password, user.password);
			if (!isEqual) {
				throw new Error('Password is incorrect!');
			}
			const token = jwt.sign(
				{
					userID: user._id,
					username: user.username
				}, 
				secretkey,
				{
					expiresIn: '1h'
				}
			);
			return {
				userID: user._id,
				token: token,
				tokenExpiration: 1
			};
		}
	}
}
