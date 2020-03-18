const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { models } = require('../mongo');

const login = async (username, password) => {
	const user = await models.User.findOne({ username });
	if (!user) {
		throw new Error('Password incorrect!');
	}
	const isEqual = await bcrypt.compare(password, user.password);
	if (!isEqual) {
		throw new Error('Password incorrect!');
	}
	const userData = {
		userId: user._id,
		username: user.username
	};
	const opts = {
		expiresIn: '1h'
	};
	const token = jwt.sign(userData, process.env.SECRET_TOKEN_KEY, opts);
	return {
		user: {
			...user._doc,
			password: null
		},
		userId: user._id,
		token: token,
		tokenExpiration: 1
	};
};

const createUser = async (username, password) => {
	const existingUser = await models.User.findOne({ username });
	if (existingUser) {
		throw new Error('User exists already.');
	}
	const hashedPassword = await bcrypt.hash(password, 12);
	const user = new models.User({
		username,
		password: hashedPassword
	});
	const result = await user.save();
	return { ...result._doc, password: null };
};

const decodeToken = async (token) => {
	if (!token || token === '') return null;
	let decoded;
	try {
		decoded = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
	} catch (err) {
		return null;
	}
	return await models.User.findById(decoded.userId);
};

const authenticate = (req) => {
	const token = req.request.headers.authorization || '';
	return decodeToken(token.split(' ')[1]);
};

module.exports = {
	auth: {
		login,
		createUser
	},
	checkAuth: authenticate
};