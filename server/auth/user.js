const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticator } = require('otplib');

const { Company, User } = require('../mongo').models;

const login = async (code, username, password, twoFactor) => {
  const company = await Company.findOne({ code });
  if (!company) return new Error('Invalid company code');

  const user = await User
    .findOne({ username, company: company.id })
    .populate('company');

  if (!user) return new Error('Password incorrect');

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) return new Error('Password incorrect');

  if (user.twoFactor.enabled && !twoFactor) {
    return {
      twoFactorEnabled: true,
    };
  } if (user.twoFactor.enabled) {
    if (!authenticator.check(twoFactor, user.twoFactor.secret)) {
      return new Error('2FA token invalid');
    }
  }

  const userData = {
    id: user.id,
    username: user.username,
  };
  const opts = {
    expiresIn: '1h',
  };
  const token = jwt.sign(userData, global.gTokenSecret, opts);

  return {
    user,
    token,
    tokenExpiration: 1,
    twoFactorEnabled: user.twoFactor.enabled,
  };
};

const create = async (code, username, password) => {
  const company = await Company.findOne({ code });
  if (!company) return new Error('Invalid company code');

  const existingUser = await User.findOne({ username, company: company.id });
  if (existingUser) return new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({
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

const enableTwoFactor = async (userModel, token, secret) => {
  const user = userModel;

  if (user.twoFactor.enabled) return new Error('2FA already enabled');

  if (!authenticator.check(token, secret)) return new Error('2FA token invalid');

  user.twoFactor = {
    enabled: true,
    secret,
  };

  const result = await user.save();
  return result === user;
};

const disableTwoFactor = async (userModel, password) => {
  const user = userModel;

  if (!user.twoFactor.enabled) return new Error('2FA not enabled');

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) return new Error('Password incorrect');

  user.twoFactor = {
    enabled: false,
  };

  const result = await user.save();
  return result === user;
};

module.exports = {
  login,
  create,
  enableTwoFactor,
  disableTwoFactor,
};
