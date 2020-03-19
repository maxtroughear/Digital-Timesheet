const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { models } = require('../mongo');

const login = async (code, username, password) => {
  const company = await models.Company.findOne({ code });
  const user = await models.User
    .findOne({ username, company: company.id })
    .populate('company');

  if (!user) {
    throw new Error('Password incorrect!');
  }
  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    throw new Error('Password incorrect!');
  }
  const userData = {
    userId: user.id,
    username: user.username,
  };
  const opts = {
    expiresIn: '1h',
  };
  const token = jwt.sign(userData, process.env.SECRET_TOKEN_KEY, opts);

  return {
    user,
    token,
    tokenExpiration: 1,
  };
};

const createUser = async (code, username, password) => {
  const company = await models.Company.findOne({ code });
  if (!company) throw new Error('Company does not exist');

  const existingUser = await models.User.findOne({ username, company: company.id });
  if (existingUser) throw new Error('User exists already.');

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new models.User({
    company,
    username,
    password: hashedPassword,
  });

  const result = await (await user
    .save())
    .populate('company')
    .execPopulate();
  return result;
};

const decodeToken = async (token) => {
  if (!token || token === '') return null;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
  } catch (err) {
    return null;
  }
  const user = await models.User.findById(decoded.userId);

  return user;
};

const authenticate = (req) => {
  const token = req.request.headers.authorization || '';
  return decodeToken(token.split(' ')[1]);
};

module.exports = {
  auth: {
    login,
    createUser,
  },
  checkAuth: authenticate,
};
